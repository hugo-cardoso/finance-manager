import type { TransactionType } from "@domain/transaction/enums/TransactionType.js";

export type CreateTransactionCategoryDTO = {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
};
