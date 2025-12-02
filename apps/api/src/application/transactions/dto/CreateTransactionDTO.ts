import type { TransactionRecurrence } from "../../../domain/transaction/enums/TransactionRecurrence.js";
import type { TransactionType } from "../../../domain/transaction/enums/TransactionType.js";

export type CreateTransactionDTO = {
  name: string;
  categoryId: string;
  type: TransactionType | string;
  amount: number;
  recurrence: TransactionRecurrence | string;
  date: Date;
};
