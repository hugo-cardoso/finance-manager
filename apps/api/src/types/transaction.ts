import type { TransactionCategoryResponse } from "./transaction-category.js";

export type TransactionType = "expense" | "income";

export type RecurrenceType = "none" | "weekly" | "monthly" | "yearly";

export type TransactionResponse = {
  id: string;
  name: string;
  type: TransactionType;
  category: TransactionCategoryResponse;
  amount: number;
  description: string | null;
  installment: number;
  installments: number | null;
  recurrence: RecurrenceType;
  date: string;
};
