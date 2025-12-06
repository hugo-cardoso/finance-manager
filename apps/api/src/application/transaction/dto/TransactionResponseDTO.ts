import type { TransactionCategoryResponseDTO } from "./TransactionCategoryResponseDTO.js";

export type TransactionResponseDTO = {
  id: string;
  name: string;
  description?: string;
  category: TransactionCategoryResponseDTO;
  amount: number;
  date: string;
  recurrence: string;
  installment?: {
    number: number;
    total: number;
  };
};
