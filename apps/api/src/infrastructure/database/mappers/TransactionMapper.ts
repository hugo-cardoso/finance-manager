import type { InferSelectModel } from "drizzle-orm";
import type { TransactionResponseDTO } from "#application/transaction/dto/TransactionResponseDTO.js";
import { Transaction } from "#domain/transaction/entities/Transaction.js";
import { TransactionCategory } from "#domain/transaction/entities/TransactionCategory.js";
import type { transactionTable } from "#infrastructure/database/drizzle/schema/transaction.js";
import { Uuid } from "#shared/domain/value-objects/Uuid.js";

import { type BillDbModel, BillMapper } from "./BillMapper.js";
import { type TransactionCategoryDbModel, TransactionCategoryMapper } from "./TransactionCategory.js";

export type TransactionDbModel = InferSelectModel<typeof transactionTable>;

export class TransactionMapper {
  static toEntity(
    dbModel: TransactionDbModel,
    categoryDbModel: TransactionCategory | TransactionCategoryDbModel,
    billDbModel?: BillDbModel,
  ): Transaction {
    const category =
      categoryDbModel instanceof TransactionCategory
        ? categoryDbModel
        : TransactionCategoryMapper.toEntity(categoryDbModel);
    const bill = billDbModel ? BillMapper.toEntity(billDbModel, category) : undefined;

    return Transaction.create({
      id: Uuid.create(dbModel.id),
      groupId: dbModel.installment_group_id ? Uuid.create(dbModel.installment_group_id) : undefined,
      name: dbModel.name,
      description: dbModel.description ?? undefined,
      category: category,
      amount: Number(dbModel.amount),
      date: new Date(dbModel.date),
      installment: undefined,
      bill: bill,
      recurrence: dbModel.recurrence,
    });
  }

  static toResponseDTO(transaction: Transaction): TransactionResponseDTO {
    return {
      id: transaction.id.value,
      name: transaction.name,
      description: transaction.description ?? undefined,
      category: TransactionCategoryMapper.toResponseDTO(transaction.category),
      amount: transaction.amount,
      date: transaction.date.toISOString().split("T")[0],
      recurrence: transaction.recurrence,
      installment: transaction.installment
        ? {
            number: transaction.installment.number,
            total: transaction.installment.total,
          }
        : undefined,
    };
  }
}
