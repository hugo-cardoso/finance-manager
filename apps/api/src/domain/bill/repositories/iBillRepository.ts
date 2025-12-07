import type { Bill } from "#domain/bill/entities/Bill.js";

export interface IBillRepository {
  findAll(): Promise<Bill[]>;
  findById(id: string): Promise<Bill | null>;
  findByMonthAndYear(month: number, year: number): Promise<Bill[]>;
  create(data: Bill): Promise<Bill>;
  delete(id: string): Promise<void>;
}
