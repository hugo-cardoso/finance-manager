import type { TransactionCategory } from "../entities/TransactionCategory.js";

export interface ITransactionCategoryRepository {
  findAll(): Promise<TransactionCategory[]>;
  findById(id: string): Promise<TransactionCategory | null>;
  create(data: TransactionCategory): Promise<TransactionCategory>;
  delete(id: string): Promise<void>;
  update(data: TransactionCategory): Promise<TransactionCategory>;
}
