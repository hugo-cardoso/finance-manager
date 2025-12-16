import { ActionIcon, Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronsDown, IconChevronsUp, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

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
      notifications.show({
        title: "Transação deletada",
        message: "A transação foi deletada com sucesso",
        color: "red",
        icon: <IconTrash size={18} />,
        autoClose: 5000,
      });
    },
  });

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(props.transaction.amount);
  }, [props.transaction.amount]);

  const formattedDate = useMemo(() => {
    const date = new Date(props.transaction.date);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }, [props.transaction.date]);

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
          {type === "income" && <IconChevronsUp size={24} color="var(--mantine-color-green-6)" />}
          {type === "expense" && <IconChevronsDown size={24} color="var(--mantine-color-red-6)" />}

          <Stack gap={6} style={{ flex: 1 }}>
            <Group gap="xs" align="center">
              <Text fw={500} size="sm">
                {props.transaction.name}
              </Text>
              {props.transaction.installment && (
                <Badge size="xs" variant="light" color="blue">
                  {props.transaction.installment.number}/{props.transaction.installment.total}
                </Badge>
              )}
            </Group>

            <Group gap="sm">
              <Text size="xs" c="dimmed">
                {formattedDate}
              </Text>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                {props.transaction.category.name}
              </Text>
            </Group>

            <Text size="sm" fw={500} c={type === "income" ? "green" : "red"}>
              {formattedAmount}
            </Text>
          </Stack>
        </Group>

        <ActionIcon
          variant="subtle"
          color="red"
          size="lg"
          aria-label="Delete transaction"
          onClick={() => deleteTransactionMutation.mutate(props.transaction.id)}
          loading={deleteTransactionMutation.isPending}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
