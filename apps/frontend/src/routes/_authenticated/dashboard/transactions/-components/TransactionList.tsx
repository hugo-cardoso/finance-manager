import { useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { TransactionService } from "@/services/TransactionService";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { TransactionsTable } from "./TransactionsTable";

type TransactionListProps = {
  category_id?: string;
  date: Date;
  onChangeCategory?: (category_id?: string) => void;
};

export function TransactionList(props: TransactionListProps) {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: [
      "transactions",
      {
        category_id: props.category_id,
        date: format(props.date, "yyyy-MM"),
      },
    ],
    queryFn: ({ signal }) => {
      return TransactionService.getTransactions(
        {
          category_id: props.category_id,
          start_date: startOfMonth(props.date),
          end_date: endOfMonth(props.date),
        },
        signal,
      );
    },
  });

  const transactions = transactionsQuery.data ?? [];

  const transactionsListTitle = useMemo(() => {
    if (transactions.length === 0) return "";

    if (transactions.length === 1) return "1 transação";

    return `${transactions.length} transações`;
  }, [transactions.length]);

  if (transactionsQuery.isLoading) {
    return (
      <div className="flex-1 grid place-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 flex-1">
      <div className="flex flex-col">
        <div className="flex justify-between gap-4 px-4 py-5">
          <p className="self-center text-sm text-muted-foreground">{transactionsListTitle}</p>
          <div className="flex justify-end gap-5">
            <Button variant="secondary" disabled>
              Categorias
            </Button>
            <AddTransactionDialog
              onSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: ["transactions"],
                  exact: false,
                  refetchType: "all",
                });
              }}
            >
              <Button size="default">Adicionar</Button>
            </AddTransactionDialog>
          </div>
        </div>
        <Separator />
      </div>

      {transactions.length === 0 && (
        <div className="flex-1 grid place-items-center min-h-[200px] -mt-6">
          <p className="text-sm text-muted-foreground">Nenhuma transação encontrada</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="px-4">
          <TransactionsTable transactions={transactions} />
        </div>
      )}
    </section>
  );
}
