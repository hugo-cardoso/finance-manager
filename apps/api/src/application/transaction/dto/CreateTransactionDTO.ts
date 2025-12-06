export type CreateTransactionDTO = {
  name: string;
  description?: string;
  categoryId: string;
  amount: number;
  date: Date;
  recurrence: "once" | "installment" | "recurring";
  installments?: number;
  endDate?: Date;
};
