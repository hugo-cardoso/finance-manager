import { queryOptions, useQuery } from "@tanstack/react-query";
import { TransactionCategoryService } from "@/services/TransactionCategoryService";

export const transactionsCategoriesQueryOptions = queryOptions({
  queryKey: ["transactions-categories"],
  queryFn: () => TransactionCategoryService.getTransactionCategories(),
});

export function useTransactionsCategories() {
  return useQuery(transactionsCategoriesQueryOptions);
}
