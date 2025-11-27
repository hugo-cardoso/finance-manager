import { IconArrowDown, IconArrowUp, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { type Transaction, TransactionService } from "@/services/TransactionService";

type TransactionListItemProps = {
  transaction: Transaction;
};

export function TransactionListItem(props: TransactionListItemProps) {
  const queryClient = useQueryClient();

  const hasInstallments = props.transaction.installments && props.transaction.installments > 1;

  const deleteTransactionMutation = useMutation({
    mutationKey: ["delete-transaction", props.transaction.id],
    mutationFn: TransactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        exact: false,
        refetchType: "active",
      });
    },
  });

  return (
    <div className="flex items-stretch justify-start gap-5 p-5 rounded-md border border-border bg-muted/50">
      <div className="flex items-center justify-center size-10 bg-muted rounded-sm self-center">
        {props.transaction.type === "income" ? (
          <IconArrowUp className="size-4 text-green-500" />
        ) : (
          <IconArrowDown className="size-4 text-red-500" />
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
        <div className="flex flex-col gap-2 justify-center w-1/2 md:w-[200px]">
          <p className="text-sm font-medium">{props.transaction.name}</p>
          <p className="text-sm text-muted-foreground md:hidden">
            {format(new Date(props.transaction.date), "dd/MM/yyyy")}
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center max-md:hidden">
          <p className="text-sm text-muted-foreground">{format(new Date(props.transaction.date), "dd/MM/yyyy")}</p>
        </div>

        <div className="flex flex-col gap-2 justify-center max-md:hidden">
          <Badge className="w-full" variant="secondary">
            {hasInstallments ? `${props.transaction.installment} / ${props.transaction.installments}` : "Única"}
          </Badge>
        </div>

        <div className="flex flex-col gap-2 justify-center items-center max-md:hidden">
          <Badge variant="default">{props.transaction.category.name}</Badge>
        </div>

        <div className="flex flex-col gap-2 justify-center items-end flex-1">
          <p className="text-sm font-bold">
            {props.transaction.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
          {hasInstallments && (
            <p className="text-sm text-muted-foreground">
              {props.transaction.installment} / {props.transaction.installments}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center size-10 bg-muted rounded-sm self-center">
        <Button
          variant="destructive"
          size="icon"
          onClick={() => deleteTransactionMutation.mutate(props.transaction.id)}
          disabled={deleteTransactionMutation.isPending}
        >
          {deleteTransactionMutation.isPending ? <Spinner /> : <IconTrash className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
