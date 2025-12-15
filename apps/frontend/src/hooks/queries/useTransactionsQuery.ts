import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { TransactionsService } from "@/services/TransactionsService";

export const useTransactionsQueryOptions = (month: number, year: number) => {
  return queryOptions({
    queryKey: ["transactions", month, year],
    queryFn: () => TransactionsService.getTransactions(month, year),
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useTransactionsQuery = (month: number, year: number) => {
  return useQuery(useTransactionsQueryOptions(month, year));
};

export const useTransactionsSuspenseQuery = (month: number, year: number) => {
  return useSuspenseQuery(useTransactionsQueryOptions(month, year));
};
