import { and, eq, gte, inArray, lte, type SQL } from "drizzle-orm";

import type { Transaction } from "#domain/transaction/entities/Transaction.js";
import type { ITransactionCategoryRepository } from "#domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { ITransactionRepository } from "#domain/transaction/repositories/ITransactionRepository.js";
import type { DrizzleDB } from "#infrastructure/database/drizzle/db.js";
import { transactionTable } from "#infrastructure/database/drizzle/schema/transaction.js";
import { TransactionMapper } from "#infrastructure/database/mappers/TransactionMapper.js";

type DrizzleTransactionRepositoryProps = {
  db: DrizzleDB;
  accountId: string;
  transactionCategoryRepository: ITransactionCategoryRepository;
};

export class DrizzleTransactionRepository implements ITransactionRepository {
  private readonly db: DrizzleDB;
  private readonly accountId: string;
  private readonly transactionCategoryRepository: ITransactionCategoryRepository;

  constructor(readonly props: DrizzleTransactionRepositoryProps) {
    this.db = props.db;
    this.accountId = props.accountId;
    this.transactionCategoryRepository = props.transactionCategoryRepository;
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.db.query.transactionTable.findMany({
      where: and(eq(transactionTable.account_id, this.accountId)),
      with: {
        category: true,
        bill: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.db.query.transactionTable.findFirst({
      where: and(eq(transactionTable.id, id), eq(transactionTable.account_id, this.accountId)),
      with: {
        category: true,
        bill: true,
      },
    });

    if (!transaction) return null;

    return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
  }

  async findByGroupId(groupId: string): Promise<Transaction[]> {
    const transactions = await this.db.query.transactionTable.findMany({
      where: and(eq(transactionTable.installment_group_id, groupId), eq(transactionTable.account_id, this.accountId)),
      with: {
        category: true,
        bill: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
    });
  }

  async findByCategoryId(categoryId: string): Promise<Transaction[]> {
    const transactions = await this.db.query.transactionTable.findMany({
      where: and(eq(transactionTable.category_id, categoryId), eq(transactionTable.account_id, this.accountId)),
      with: {
        category: true,
        bill: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
    });
  }

  async findByDateRange(startDate: Date, endDate?: Date): Promise<Transaction[]> {
    const conditions: SQL[] = [
      eq(transactionTable.account_id, this.accountId),
      gte(transactionTable.date, startDate.toISOString().split("T")[0]),
    ];

    if (endDate) {
      conditions.push(lte(transactionTable.date, endDate.toISOString().split("T")[0]));
    }

    const transactions = await this.db.query.transactionTable.findMany({
      where: and(...conditions),
      with: {
        category: true,
        bill: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
    });
  }

  async create(data: Transaction): Promise<Transaction> {
    const category = await this.transactionCategoryRepository.findById(data.category.id.value);

    if (!category) {
      throw new Error("Category not found");
    }

    await this.db.insert(transactionTable).values({
      id: data.id.value,
      installment_group_id: data.groupId?.value.toString(),
      bill_id: data?.bill?.id.value,
      category_id: data.category.id.value,
      account_id: this.accountId,
      name: data.name,
      amount: data.amount.toString(),
      description: undefined,
      installment_number: data.installment?.number,
      total_installments: data.installment?.total,
      date: data.date.toISOString(),
      recurrence: data.recurrence,
    });

    const transaction = await this.findById(data.id.value);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }

  async createMany(data: Transaction[]): Promise<Transaction[]> {
    const categoriesIds = new Set(data.map((transaction) => transaction.category.id.value));
    const categories = await this.transactionCategoryRepository.findByIds(Array.from(categoriesIds));

    const transactions = await this.db
      .insert(transactionTable)
      .values(
        data.map((transaction) => ({
          id: transaction.id.value,
          bill_id: transaction?.bill?.id.value,
          category_id: transaction.category.id.value,
          account_id: this.accountId,
          name: transaction.name,
          amount: transaction.amount.toString(),
          description: undefined,
          installment_group_id: transaction.groupId?.value.toString(),
          installment_number: transaction.installment?.number,
          total_installments: transaction.installment?.total,
          date: transaction.date.toISOString(),
          recurrence: transaction.recurrence,
        })),
      )
      .returning();

    return transactions.map((transaction) => {
      const category = categories.find((category) => category.id.value === transaction.category_id)!;

      return TransactionMapper.toEntity(transaction, category);
    });
  }

  async findByMonthAndYear(month: number, year: number): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.db.query.transactionTable.findMany({
      where: and(
        eq(transactionTable.account_id, this.accountId),
        gte(transactionTable.date, startDate.toISOString().split("T")[0]),
        lte(transactionTable.date, endDate.toISOString().split("T")[0]),
      ),
      with: {
        category: true,
        bill: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
    });
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(transactionTable)
      .where(and(eq(transactionTable.id, id), eq(transactionTable.account_id, this.accountId)));
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.db
      .delete(transactionTable)
      .where(and(inArray(transactionTable.id, ids), eq(transactionTable.account_id, this.accountId)));
  }

  async deleteByGroupId(groupId: string): Promise<void> {
    await this.db
      .delete(transactionTable)
      .where(and(eq(transactionTable.installment_group_id, groupId), eq(transactionTable.account_id, this.accountId)));
  }

  async deleteByBillId(billId: string): Promise<void> {
    await this.db
      .delete(transactionTable)
      .where(and(eq(transactionTable.bill_id, billId), eq(transactionTable.account_id, this.accountId)));
  }

  async findByBillId(billId: string): Promise<Transaction[]> {
    const transactions = await this.db.query.transactionTable.findMany({
      where: and(eq(transactionTable.bill_id, billId), eq(transactionTable.account_id, this.accountId)),
      with: {
        category: true,
        bill: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category, transaction.bill || undefined);
    });
  }
}
