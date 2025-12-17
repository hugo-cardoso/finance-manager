import { ActionIcon, Badge, Flex, Group, Paper, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowDownRight, IconArrowUpRight, IconEye, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
          <ThemeIcon color={type === "income" ? "teal" : "red"} variant="light" size="lg" radius="md">
            {type === "income" ? <IconArrowUpRight size={20} /> : <IconArrowDownRight size={20} />}
          </ThemeIcon>

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

        <Flex gap="xs" align="center">
          <Tooltip label="Visualizar transação" withArrow>
            <ActionIcon
              variant="light"
              color="gray"
              size="lg"
              aria-label="View transaction"
              renderRoot={(buttonProps) => (
                <Link {...buttonProps} to="/dashboard/transacoes/$id" params={{ id: props.transaction.id }} />
              )}
            >
              <ThemeIcon color="gray" variant="transparent">
                <IconEye size={18} />
              </ThemeIcon>
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Deletar transação" withArrow>
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              aria-label="Delete transaction"
              onClick={() => deleteTransactionMutation.mutate(props.transaction.id)}
              loading={deleteTransactionMutation.isPending}
            >
              <ThemeIcon color="red" variant="transparent">
                <IconTrash size={18} />
              </ThemeIcon>
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Group>
    </Paper>
  );
}
