import { IconArrowDown, IconArrowUp, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { TransactionService } from "@/services/TransactionService";
import { AddTransactionDialog } from "./AddTransactionDialog";

type TransactionListProps = {
  page: number;
  limit?: number;
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
        page: props.page,
        limit: props.limit,
        category_id: props.category_id,
        date: format(props.date, "yyyy-MM"),
      },
    ],
    queryFn: ({ signal }) => {
      return TransactionService.getTransactions(
        {
          page: props.page,
          limit: props.limit,
          category_id: props.category_id,
          start_date: startOfMonth(props.date),
          end_date: endOfMonth(props.date),
        },
        signal,
      );
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationKey: ["delete-transaction"],
    mutationFn: TransactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        exact: false,
        refetchType: "active",
      });
    },
  });

  const transactions = transactionsQuery.data?.transactions ?? [];

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
        <ul className="flex flex-col gap-4 px-4 pb-3">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <Item variant="muted" className="border-input">
                <ItemMedia variant="icon" className="self-center! size-10">
                  {transaction.type === "income" && <IconArrowUp className="size-4 text-green-500" />}
                  {transaction.type === "expense" && <IconArrowDown className="size-4 text-red-500" />}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="flex items-center gap-2">
                    {transaction.name}{" "}
                    {transaction.recurrence === "monthly" && (
                      <Badge variant="secondary">
                        {transaction.installment} / {transaction.installments}
                      </Badge>
                    )}
                  </ItemTitle>
                  <ItemDescription>
                    {transaction.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTransactionMutation.mutate(transaction.id)}
                  >
                    <IconTrash />
                  </Button>
                </ItemActions>
              </Item>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
