import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";

export const useUserQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: () => UserService.getUser(),
  staleTime: Number.POSITIVE_INFINITY,
});

export const useUserQuery = () => {
  return useQuery(useUserQueryOptions);
};

export const useUserSuspenseQuery = () => {
  return useSuspenseQuery(useUserQueryOptions);
};
