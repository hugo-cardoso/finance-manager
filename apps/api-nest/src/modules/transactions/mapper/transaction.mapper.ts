import { Injectable } from "@nestjs/common";
import { DateUtils } from "@src/common/utils/DateUtils";
import type { Transaction as PrismaTransaction } from "@src/generated/prisma/client";
import { Category } from "@src/modules/categories/entities/category.entity";
import { Transaction } from "../entities/transaction.entity";

@Injectable()
export class TransactionMapper {
  toEntity(transaction: PrismaTransaction, category: Category): Transaction {
    return Transaction.create({
      id: transaction.id,
      name: transaction.name,
      amount: Number(transaction.amount),
      date: DateUtils.toLocalDate(transaction.date),
      recurrence: transaction.recurrenceType,
      status: transaction.status,
      installment: transaction.installmentId
        ? {
            id: transaction.installmentId,
            number: transaction.installmentNumber!,
            total: transaction.installmentTotal!,
          }
        : undefined,
      category,
    });
  }
}
