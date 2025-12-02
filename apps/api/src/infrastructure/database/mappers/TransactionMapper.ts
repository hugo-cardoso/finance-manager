import type { InferSelectModel } from "drizzle-orm";

import type { TransactionResponseDTO } from "../../../application/transactions/dto/TransactionResponseDTO.js";
import { Transaction } from "../../../domain/transaction/entities/Transaction.js";
import type { TransactionRecurrence } from "../../../domain/transaction/enums/TransactionRecurrence.js";
import type { TransactionType } from "../../../domain/transaction/enums/TransactionType.js";
import { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { transactionTable } from "../drizzle/schema/transaction.js";
import { type TransactionCategoryDbModel, TransactionCategoryMapper } from "./TransactionCategory.js";

type TransactionDbModel = InferSelectModel<typeof transactionTable>;

export class TransactionMapper {
  static toEntity(dbModel: TransactionDbModel, categoryDbModel: TransactionCategoryDbModel): Transaction {
    const category = TransactionCategoryMapper.toEntity(categoryDbModel);

    return Transaction.create({
      id: Uuid.create(dbModel.id),
      groupId: Uuid.create(dbModel.groupId),
      name: dbModel.name,
      category: category,
      type: dbModel.type as TransactionType,
      amount: dbModel.amount,
      recurrence: dbModel.recurrence as TransactionRecurrence,
      date: new Date(dbModel.date),
    });
  }

  static toResponseDTO(transaction: Transaction): TransactionResponseDTO {
    return {
      id: transaction.id.value,
      name: transaction.name,
      category: TransactionCategoryMapper.toResponseDTO(transaction.category),
      type: transaction.type,
      amount: transaction.amount,
      recurrence: transaction.recurrence,
      date: transaction.date.toISOString(),
    };
  }
}
