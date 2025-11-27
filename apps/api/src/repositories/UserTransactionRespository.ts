import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { and, desc, eq, gte, lte, type SQLWrapper, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import { transactionTable } from "../db/schema/index.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { RecurrenceType, TransactionType } from "../types/transaction.js";

type CreateTransaction = {
  name: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  installment?: number;
  installments?: number;
  recurrence?: RecurrenceType;
  date: Date;
};

export type GetTransactionsFilters = {
  categoryId?: string;
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
};

export class UserTransactionRespository {
  constructor(private readonly userId: string) {}

  async create(data: CreateTransaction) {
    const groupId = randomUUID();

    try {
      const recurrenceType = data.recurrence ?? "none";
      const isRecurrence = recurrenceType !== "none";

      return await db.transaction(async (tx) => {
        const firstTransaction: typeof transactionTable.$inferInsert = {
          ...data,
          date: data.date.toISOString(),
          userId: this.userId,
          groupId,
          installment: 1,
          installments: isRecurrence ? data.installments : undefined,
          recurrence: recurrenceType,
        };

        if (!isRecurrence || recurrenceType !== "monthly") {
          const [transaction] = await tx.insert(transactionTable).values(firstTransaction).returning();

          return transaction;
        }

        const transactionsToInsert = [
          firstTransaction,
          ...Array.from({ length: data.installments! - 1 }, (_, i) => ({
            ...firstTransaction,
            date: add(firstTransaction.date, { months: i + 1 }).toISOString(),
            installment: i + 2,
          })),
        ];

        const insertedTransactions = await tx.insert(transactionTable).values(transactionsToInsert).returning();

        return insertedTransactions[0];
      });
    } catch (_) {
      await db.delete(transactionTable).where(eq(transactionTable.groupId, groupId));
      throw new Error("Can't create user transaction");
    }
  }

  async findById(id: string) {
    try {
      const transaction = await db.query.transactionTable.findFirst({
        where: and(eq(transactionTable.userId, this.userId), eq(transactionTable.id, id)),
        with: {
          category: true,
        },
      });

      if (!transaction) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
      }

      return transaction;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new Error(`Can't get user transaction with id ${id}`);
    }
  }

  async findAll() {
    try {
      const transactions = await db.query.transactionTable.findMany({
        where: eq(transactionTable.userId, this.userId),
        with: {
          category: true,
        },
      });

      return transactions;
    } catch (_) {
      throw new Error("Can't get user transactions");
    }
  }

  async findByCategoryId(categoryId: string) {
    try {
      const transactions = await db.query.transactionTable.findMany({
        where: and(eq(transactionTable.userId, this.userId), eq(transactionTable.categoryId, categoryId)),
        with: {
          category: true,
        },
      });

      return transactions;
    } catch (_) {
      throw new Error(`Can't get user transactions with category id ${categoryId}`);
    }
  }

  async find({ filters }: { filters: GetTransactionsFilters }) {
    try {
      const where: SQLWrapper[] = [];

      if (filters.categoryId) {
        where.push(eq(transactionTable.categoryId, filters.categoryId));
      }

      if (filters.type) {
        where.push(eq(transactionTable.type, filters.type));
      }

      if (filters.startDate) {
        where.push(gte(transactionTable.date, filters.startDate.toISOString().split("T")[0]));
      }

      if (filters.endDate) {
        where.push(lte(transactionTable.date, filters.endDate.toISOString().split("T")[0]));
      }

      const transactions = await db.query.transactionTable.findMany({
        where: and(eq(transactionTable.userId, this.userId), ...where),
        with: {
          category: true,
        },
        orderBy: desc(transactionTable.date),
      });

      return transactions;
    } catch (_) {
      throw new Error(`Can't get user transactions with filters ${JSON.stringify(filters)}`);
    }
  }

  async delete(id: string) {
    try {
      const transaction = await this.findById(id);

      if (transaction.recurrence !== "none") {
        await db
          .delete(transactionTable)
          .where(and(eq(transactionTable.userId, this.userId), eq(transactionTable.groupId, transaction.groupId)));
        return;
      }

      await db
        .delete(transactionTable)
        .where(and(eq(transactionTable.userId, this.userId), eq(transactionTable.id, id)));
    } catch (_) {
      throw new Error(`Can't delete user transaction with id ${id}`);
    }
  }

  async countByFilters(filters: GetTransactionsFilters) {
    try {
      const where: SQLWrapper[] = [];

      if (filters.categoryId) {
        where.push(eq(transactionTable.categoryId, filters.categoryId));
      }

      if (filters.type) {
        where.push(eq(transactionTable.type, filters.type));
      }

      if (filters.startDate) {
        where.push(gte(transactionTable.date, filters.startDate.toISOString().split("T")[0]));
      }

      if (filters.endDate) {
        where.push(lte(transactionTable.date, filters.endDate.toISOString().split("T")[0]));
      }

      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(transactionTable)
        .where(and(eq(transactionTable.userId, this.userId), ...where))
        .then(([result]) => result);

      return Number(result?.count ?? 0);
    } catch (_) {
      throw new Error(`Can't count user transactions with filters ${JSON.stringify(filters)}`);
    }
  }

  async getCountByCategoryId(categoryId: string) {
    try {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(transactionTable)
        .where(and(eq(transactionTable.userId, this.userId), eq(transactionTable.categoryId, categoryId)))
        .then(([result]) => result);

      return result?.count ?? 0;
    } catch (_) {
      throw new Error(`Can't count transactions for category with id ${categoryId}`);
    }
  }

  async getMonthlyTotals(startDate: Date, endDate: Date) {
    try {
      const where: SQLWrapper[] = [
        gte(transactionTable.date, startDate.toISOString().split("T")[0]),
        lte(transactionTable.date, endDate.toISOString().split("T")[0]),
      ];

      const result = await db
        .select({
          type: transactionTable.type,
          total: sql<number>`sum(${transactionTable.amount})`,
        })
        .from(transactionTable)
        .where(and(eq(transactionTable.userId, this.userId), ...where))
        .groupBy(transactionTable.type);

      const income = result.find((r) => r.type === "income")?.total ?? 0;
      const expenses = result.find((r) => r.type === "expense")?.total ?? 0;

      return {
        income: Number(income),
        expenses: Number(expenses),
      };
    } catch (_) {
      throw new Error("Can't get monthly totals");
    }
  }
}
