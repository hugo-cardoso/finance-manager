import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import type { Bill } from "#domain/bill/entities/Bill.js";
import type { IBillRepository } from "#domain/bill/repositories/iBillRepository.js";
import type { ITransactionCategoryRepository } from "#domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { DrizzleDB } from "#infrastructure/database/drizzle/db.js";
import { billTable } from "#infrastructure/database/drizzle/schema/bill.js";
import { BillMapper } from "#infrastructure/database/mappers/BillMapper.js";
import { DrizzleTransactionCategoryRepository } from "#infrastructure/database/repositories/DrizzleTransactionCategoryRepository.js";

export class DrizzleBillRepository implements IBillRepository {
  private readonly transactionCategoryRepository: ITransactionCategoryRepository;

  constructor(
    private readonly db: DrizzleDB,
    private readonly accountId: string,
  ) {
    this.transactionCategoryRepository = new DrizzleTransactionCategoryRepository(db);
  }

  async findAll(): Promise<Bill[]> {
    const bills = await this.db.query.billTable.findMany({
      where: and(eq(billTable.account_id, this.accountId)),
      with: {
        category: true,
      },
    });

    return bills.map((bill) => {
      return BillMapper.toEntity(bill, bill.category);
    });
  }

  async findById(id: string): Promise<Bill | null> {
    const bill = await this.db.query.billTable.findFirst({
      where: and(eq(billTable.id, id), eq(billTable.account_id, this.accountId)),
      with: {
        category: true,
      },
    });

    if (!bill) return null;

    return BillMapper.toEntity(bill, bill.category);
  }

  async findByMonthAndYear(month: number, year: number): Promise<Bill[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bills = await this.db.query.billTable.findMany({
      where: and(
        eq(billTable.account_id, this.accountId),
        eq(billTable.is_active, true),
        lte(billTable.start_date, endDate.toISOString().split("T")[0]),
        or(isNull(billTable.end_date), gte(billTable.end_date, startDate.toISOString().split("T")[0])),
      ),
      with: {
        category: true,
      },
    });

    return bills.map((bill) => {
      return BillMapper.toEntity(bill, bill.category);
    });
  }

  async create(data: Bill): Promise<Bill> {
    const category = await this.transactionCategoryRepository.findById(data.category.id.value);

    if (!category) {
      throw new Error("Category not found");
    }

    await this.db.insert(billTable).values({
      id: data.id.value,
      account_id: this.accountId,
      category_id: data.category.id.value,
      name: data.name,
      is_active: data.isActive,
      description: data.description ?? null,
      amount: data.amount.toString(),
      day_of_month: data.dayOfMonth,
      start_date: data.startDate.toISOString().split("T")[0],
      end_date: data.endDate ? data.endDate.toISOString().split("T")[0] : null,
    });

    const bill = await this.findById(data.id.value);

    if (!bill) {
      throw new Error("Bill not found");
    }

    return bill;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(billTable).where(and(eq(billTable.id, id), eq(billTable.account_id, this.accountId)));
  }
}
