import type { TransactionCategoryResponseDTO } from "./TransactionCategoryResponseDTO.js";

export type TransactionResponseDTO = {
  id: string;
  name: string;
  category: TransactionCategoryResponseDTO;
  type: string;
  amount: number;
  recurrence: string;
  date: string;
};
