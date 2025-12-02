import { and, eq } from "drizzle-orm";

import type { Transaction } from "../../../domain/transaction/entities/Transaction.js";
import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";
import type { DrizzleDB } from "../drizzle/db.js";
import {
  type RecurrenceTypeDbEnum,
  type TransactionTypeDbEnum,
  transactionTable,
} from "../drizzle/schema/transaction.js";
import { TransactionMapper } from "../mappers/TransactionMapper.js";
import { DrizzleTransactionCategoryRepository } from "./DrizzleTransactionCategoryRepository.js";

export class DrizzleTransactionRepository implements ITransactionRepository {
  private readonly transactionCategoryRepository: ITransactionCategoryRepository;

  constructor(
    private readonly db: DrizzleDB,
    private readonly userId: string,
  ) {
    this.transactionCategoryRepository = new DrizzleTransactionCategoryRepository(db, userId);
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.db.query.transactionTable.findMany({
      where: and(eq(transactionTable.userId, this.userId)),
      with: {
        category: true,
      },
    });

    return transactions.map((transaction) => {
      return TransactionMapper.toEntity(transaction, transaction.category);
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.db.query.transactionTable.findFirst({
      where: and(eq(transactionTable.id, id), eq(transactionTable.userId, this.userId)),
      with: {
        category: true,
      },
    });

    if (!transaction) return null;

    return TransactionMapper.toEntity(transaction, transaction.category);
  }

  async create(data: Transaction): Promise<Transaction> {
    const category = await this.transactionCategoryRepository.findById(data.category.id.value);

    if (!category) {
      throw new Error("Category not found");
    }

    await this.db.insert(transactionTable).values({
      id: data.id.value,
      groupId: data.groupId.value,
      categoryId: data.category.id.value,
      userId: this.userId,
      name: data.name,
      type: data.type as TransactionTypeDbEnum,
      amount: data.amount,
      description: undefined,
      installment: 1,
      installments: undefined,
      recurrence: data.recurrence as RecurrenceTypeDbEnum,
      date: data.date.toISOString(),
    });

    const transaction = await this.findById(data.id.value);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(transactionTable)
      .where(and(eq(transactionTable.id, id), eq(transactionTable.userId, this.userId)));
  }
}
