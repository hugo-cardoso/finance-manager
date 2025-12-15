import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { TransactionsService } from "@/services/TransactionsService";

export const useCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: () => TransactionsService.getCategories(),
    staleTime: Number.POSITIVE_INFINITY,
  });
};

export const useCategoriesQuery = () => {
  return useQuery(useCategoriesQueryOptions());
};

export const useCategoriesSuspenseQuery = () => {
  return useSuspenseQuery(useCategoriesQueryOptions());
};
