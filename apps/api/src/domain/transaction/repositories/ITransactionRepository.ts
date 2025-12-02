import type { Transaction } from "../entities/Transaction.js";

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  create(data: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
