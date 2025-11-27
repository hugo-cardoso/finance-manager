import { api } from "@/lib/api";

type TransactionCategory = {
  id: string;
  name: string;
};

export class TransactionCategoryService {
  static async getTransactionCategories() {
    const response = await api.get<TransactionCategory[]>("transactions/categories");
    return response.json();
  }
}
