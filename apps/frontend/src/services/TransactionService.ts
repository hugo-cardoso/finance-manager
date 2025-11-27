import { format } from "date-fns";
import { api } from "@/lib/api";

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  recurrence: "none" | "weekly" | "monthly" | "yearly";
  installment: number;
  installments: number | null;
  category: {
    name: string;
  };
};

type GetTransactionsOptions = {
  page?: number;
  limit?: number;
  category_id?: string;
  start_date?: Date;
  end_date?: Date;
};

type CreateTransactionRequest = {
  name: string;
  category_id: string;
  type: "income" | "expense";
  amount: number;
  date: Date;
  recurrence: "none" | "weekly" | "monthly" | "yearly";
  installments: number | undefined;
};

export class TransactionService {
  static async getTransactions(options?: GetTransactionsOptions, signal?: AbortSignal) {
    const { category_id, start_date, end_date } = options ?? {};

    const response = await api.get<Transaction[]>("transactions", {
      searchParams: {
        category_id,
        start_date: format(start_date ?? new Date(), "yyyy-MM-dd"),
        end_date: format(end_date ?? new Date(), "yyyy-MM-dd"),
      },
      signal,
    });

    return response.json();
  }

  static async createTransaction(request: CreateTransactionRequest) {
    const response = await api.post("transactions", {
      json: {
        name: request.name,
        category_id: request.category_id,
        type: request.type,
        amount: request.amount,
        date: format(request.date, "yyyy-MM-dd"),
        recurrence: request.recurrence,
        installments: request.installments,
      },
    });

    return response.json();
  }

  static async deleteTransaction(id: string) {
    const response = await api.delete(`transactions/${id}`);

    return response.text();
  }
}
