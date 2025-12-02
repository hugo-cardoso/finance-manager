import { and, eq, sql } from "drizzle-orm";

import type { TransactionCategory } from "../../../domain/transaction/entities/TransactionCategory.js";
import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { DrizzleDB } from "../drizzle/db.js";
import { transactionCategoryTable } from "../drizzle/schema/transaction-category.js";
import { TransactionCategoryMapper } from "../mappers/TransactionCategory.js";

export class DrizzleTransactionCategoryRepository implements ITransactionCategoryRepository {
  constructor(
    private readonly db: DrizzleDB,
    private readonly userId: string,
  ) {}

  async findById(id: string): Promise<TransactionCategory | null> {
    const category = await this.db.query.transactionCategoryTable.findFirst({
      where: and(eq(transactionCategoryTable.id, id), eq(transactionCategoryTable.userId, this.userId)),
    });

    if (!category) return null;

    return TransactionCategoryMapper.toEntity(category);
  }

  async findAll(): Promise<TransactionCategory[]> {
    const categories = await this.db.query.transactionCategoryTable.findMany({
      where: and(eq(transactionCategoryTable.userId, this.userId)),
    });

    return categories.map(TransactionCategoryMapper.toEntity);
  }

  async create(category: TransactionCategory): Promise<TransactionCategory> {
    await this.db.insert(transactionCategoryTable).values({
      id: category.id.value,
      userId: this.userId,
      name: category.name,
    });

    return category;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(transactionCategoryTable).where(eq(transactionCategoryTable.id, id));
  }

  async update(category: TransactionCategory): Promise<TransactionCategory> {
    const originalCategory = await this.findById(category.id.value);

    if (!originalCategory) {
      throw new Error("Category not found");
    }

    const updatedCategory = await this.db
      .update(transactionCategoryTable)
      .set({
        name: category.name,
        updatedAt: sql`now()`,
      })
      .where(and(eq(transactionCategoryTable.id, category.id.value), eq(transactionCategoryTable.userId, this.userId)))
      .returning()
      .then(([category]) => category);

    return TransactionCategoryMapper.toEntity(updatedCategory);
  }
}
