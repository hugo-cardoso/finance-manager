import { eq, inArray } from "drizzle-orm";

import type { TransactionCategory } from "#domain/transaction/entities/TransactionCategory.js";
import type { ITransactionCategoryRepository } from "#domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { DrizzleDB } from "#infrastructure/database/drizzle/db.js";
import { transactionCategoryTable } from "#infrastructure/database/drizzle/schema/transaction-category.js";
import { TransactionCategoryMapper } from "#infrastructure/database/mappers/TransactionCategory.js";

type DrizzleTransactionCategoryRepositoryProps = {
  db: DrizzleDB;
};

export class DrizzleTransactionCategoryRepository implements ITransactionCategoryRepository {
  private readonly db: DrizzleDB;

  constructor(readonly props: DrizzleTransactionCategoryRepositoryProps) {
    this.db = props.db;
  }

  async findById(id: string): Promise<TransactionCategory | null> {
    const category = await this.db.query.transactionCategoryTable.findFirst({
      where: eq(transactionCategoryTable.id, id),
    });

    if (!category) return null;

    return TransactionCategoryMapper.toEntity(category);
  }

  async findByIds(ids: string[]): Promise<TransactionCategory[]> {
    const categories = await this.db.query.transactionCategoryTable.findMany({
      where: inArray(transactionCategoryTable.id, ids),
    });

    return categories.map(TransactionCategoryMapper.toEntity);
  }

  async findAll(): Promise<TransactionCategory[]> {
    const categories = await this.db.query.transactionCategoryTable.findMany();

    return categories.map(TransactionCategoryMapper.toEntity);
  }

  async create(category: TransactionCategory): Promise<TransactionCategory> {
    await this.db.insert(transactionCategoryTable).values({
      id: category.id.value,
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type,
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
      })
      .where(eq(transactionCategoryTable.id, category.id.value))
      .returning()
      .then(([category]) => category);

    return TransactionCategoryMapper.toEntity(updatedCategory);
  }
}
