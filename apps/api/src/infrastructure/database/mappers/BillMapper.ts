import type { InferSelectModel } from "drizzle-orm";
import { Bill } from "#domain/bill/entities/Bill.js";
import { TransactionCategory } from "#domain/transaction/entities/TransactionCategory.js";
import type { billTable } from "#infrastructure/database/drizzle/schema/bill.js";
import { Uuid } from "#shared/domain/value-objects/Uuid.js";

import { type TransactionCategoryDbModel, TransactionCategoryMapper } from "./TransactionCategory.js";

export type BillDbModel = InferSelectModel<typeof billTable>;

export class BillMapper {
  static toEntity(dbModel: BillDbModel, categoryDbModel: TransactionCategoryDbModel | TransactionCategory): Bill {
    const category =
      categoryDbModel instanceof TransactionCategory
        ? categoryDbModel
        : TransactionCategoryMapper.toEntity(categoryDbModel);

    return Bill.create({
      id: Uuid.create(dbModel.id),
      name: dbModel.name,
      isActive: dbModel.is_active,
      description: dbModel.description ?? undefined,
      amount: Number(dbModel.amount),
      dayOfMonth: dbModel.day_of_month,
      category: category,
      startDate: new Date(dbModel.start_date),
      endDate: dbModel.end_date ? new Date(dbModel.end_date) : undefined,
    });
  }

  static toResponseDTO(bill: Bill) {
    return {
      id: bill.id.value,
      name: bill.name,
      isActive: bill.isActive,
      description: bill.description,
      amount: bill.amount,
      dayOfMonth: bill.dayOfMonth,
      category: TransactionCategoryMapper.toResponseDTO(bill.category),
      startDate: bill.startDate.toISOString(),
      endDate: bill.endDate?.toISOString(),
    };
  }
}
