import type { Transaction } from "@domain/transaction/entities/Transaction.js";

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  findByCategoryId(categoryId: string): Promise<Transaction[]>;
  findByGroupId(groupId: string): Promise<Transaction[]>;
  findByMonthAndYear(month: number, year: number): Promise<Transaction[]>;
  create(data: Transaction): Promise<Transaction>;
  createMany(data: Transaction[]): Promise<Transaction[]>;
  delete(id: string): Promise<void>;
  deleteByGroupId(groupId: string): Promise<void>;
  deleteByBillId(billId: string): Promise<void>;
}
