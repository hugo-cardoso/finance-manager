import { getApi } from "@/lib/api";

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string; // ISO 8601
  category: TransactionCategory;
  installment?: {
    number: number;
    total: number;
  };
};

type TransactionCategory = {
  id: string;
  name: string;
  icon: string;
  type: "expense" | "income";
};

type TransactionsResponse = Transaction[];

type TransactionCategoriesResponse = TransactionCategory[];

type CreateTransactionDto = {
  name: string;
  amount: number;
  date: string;
  categoryId: string;
  recurrence: "single" | "installment";
  installments?: number;
};

export class TransactionsService {
  static async getTransactions(month: number, year: number) {
    const response = await getApi()
      .get("transactions", {
        searchParams: {
          month,
          year,
        },
      })
      .json<TransactionsResponse>();

    return response;
  }

  static async getTransaction(id: string) {
    const response = await getApi().get(`transactions/${id}`).json<Transaction>();

    return response;
  }

  static async getCategories() {
    const response = await getApi().get("categories").json<TransactionCategoriesResponse>();

    return response;
  }

  static async createTransaction(createTransactionDto: CreateTransactionDto) {
    const response = await getApi()
      .post("transactions", {
        json: {
          name: createTransactionDto.name,
          category_id: createTransactionDto.categoryId,
          date: createTransactionDto.date,
          recurrence: createTransactionDto.recurrence,
          installments: createTransactionDto.installments,
          amount: createTransactionDto.amount,
        },
      })
      .json<Transaction>();

    return response;
  }

  static async deleteTransaction(id: string) {
    await getApi().delete(`transactions/${id}`);
  }
}
