import type { TransactionCategory } from "#domain/transaction/entities/TransactionCategory.js";

export interface ITransactionCategoryRepository {
  findAll(): Promise<TransactionCategory[]>;
  findById(id: string): Promise<TransactionCategory | null>;
  findByIds(ids: string[]): Promise<TransactionCategory[]>;
  create(data: TransactionCategory): Promise<TransactionCategory>;
  delete(id: string): Promise<void>;
  update(data: TransactionCategory): Promise<TransactionCategory>;
}
