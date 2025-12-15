import { IconChevronsDown, IconChevronsUp, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { type Transaction, TransactionsService } from "@/services/TransactionsService";

type TransactionItemProps = {
  transaction: Transaction;
};

export function TransactionItem(props: TransactionItemProps) {
  const queryClient = useQueryClient();
  const type = props.transaction.category.type;

  const deleteTransactionMutation = useMutation({
    mutationKey: ["delete-transaction"],
    mutationFn: TransactionsService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(props.transaction.amount);
  }, [props.transaction.amount]);

  return (
    <Item variant="muted">
      <ItemMedia className="self-center!">
        {type === "income" && <IconChevronsUp className="self-center text-green-500" />}
        {type === "expense" && <IconChevronsDown className="self-center text-red-500" />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{props.transaction.name}</ItemTitle>
        <ItemDescription>{formattedAmount}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => deleteTransactionMutation.mutate(props.transaction.id)}
        >
          <IconTrash />
        </Button>
      </ItemActions>
    </Item>
  );
}
