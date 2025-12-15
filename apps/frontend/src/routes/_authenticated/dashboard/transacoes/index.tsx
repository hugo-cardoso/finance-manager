import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTransactionsQuery, useTransactionsQueryOptions } from "@/hooks/queries/useTransactionsQuery";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";
import { CreateTransactionDrawer } from "./-components/CreateTransactionDrawer";
import { MonthSelector } from "./-components/MonthSelector";
import { TransactionItem } from "./-components/TransactionItem";

const searchSchema = z
  .object({
    mes: z
      .number()
      .min(1)
      .max(12)
      .optional()
      .default(new Date().getMonth() + 1),
    ano: z.number().optional().default(new Date().getFullYear()),
  })
  .catch(() => ({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  }));

export const Route = createFileRoute("/_authenticated/dashboard/transacoes/")({
  component: () => (
    <PrivateLayoutContent title="Transações">
      <RouteComponent />
    </PrivateLayoutContent>
  ),
  loaderDeps: ({ search }) => ({ mes: search.mes, ano: search.ano }),
  loader: async ({ context, deps }) => {
    const { queryClient } = context;

    queryClient.prefetchQuery({
      ...useTransactionsQueryOptions(deps.mes, deps.ano),
      staleTime: 0,
    });
  },
  validateSearch: zodValidator(searchSchema),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { mes, ano } = Route.useSearch();

  const transactionsQuery = useTransactionsQuery(mes, ano);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <MonthSelector
          month={mes}
          year={ano}
          onChange={(month, year) => {
            navigate({
              search: {
                mes: month,
                ano: year,
              },
            });
          }}
        />

        <CreateTransactionDrawer onCreate={() => transactionsQuery.refetch()}>
          <Button>
            <IconPlus /> Nova transação
          </Button>
        </CreateTransactionDrawer>
      </div>
      {transactionsQuery.isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      )}
      {transactionsQuery.isSuccess && (
        <div className="flex flex-1 flex-col gap-4">
          {transactionsQuery.data.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}
