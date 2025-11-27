import { format } from "date-fns";
import { api } from "@/lib/api";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
};

type GetTransactionsOptions = {
  page?: number;
  limit?: number;
  category_id?: string;
  start_date?: Date;
  end_date?: Date;
};

type TransactionsResponse = {
  transactions: Transaction[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type CreateTransactionRequest = {
  name: string;
  category_id: string;
  type: "income" | "expense";
  amount: number;
  date: Date;
};

export class TransactionService {
  static async getTransactions(options?: GetTransactionsOptions, signal?: AbortSignal) {
    const { page = 1, limit, category_id, start_date, end_date } = options ?? {};

    const response = await api.get<TransactionsResponse>("transactions", {
      searchParams: {
        page,
        limit,
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
      },
    });

    return response.json();
  }

  static async deleteTransaction(id: string) {
    const response = await api.delete(`transactions/${id}`);

    return response.text();
  }
}
