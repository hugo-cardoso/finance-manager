import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { TransactionsService } from "@/services/TransactionsService";

export const useTransactionQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["transaction", id],
    queryFn: () => TransactionsService.getTransaction(id),
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useTransactionQuery = (id: string) => {
  return useQuery(useTransactionQueryOptions(id));
};

export const useTransactionSuspenseQuery = (id: string) => {
  return useSuspenseQuery(useTransactionQueryOptions(id));
};
