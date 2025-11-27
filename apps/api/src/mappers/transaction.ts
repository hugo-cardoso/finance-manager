import type { InferSelectModel } from "drizzle-orm";

import type { transactionCategoryTable, transactionTable } from "../db/schema/index.js";
import type { TransactionResponse } from "../types/transaction.js";

export class TransactionMapper {
  static repoToResponse(
    transaction: InferSelectModel<typeof transactionTable>,
    category: InferSelectModel<typeof transactionCategoryTable>,
  ): TransactionResponse {
    return {
      id: transaction.id,
      name: transaction.name,
      type: transaction.type,
      category: {
        id: category.id,
        name: category.name,
      },
      amount: transaction.amount,
      description: transaction.description,
      installment: transaction.installment,
      installments: transaction.installments,
      recurrence: transaction.recurrence,
      date: transaction.date,
    };
  }
}
