import { Group, Paper, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight, IconScale } from "@tabler/icons-react";
import { useMemo } from "react";
import type { Transaction } from "@/services/TransactionsService";
import { formatCurrency } from "@/utils/format-currency";

type MonthReportProps = {
  transactions: Transaction[];
};

type ReportData = {
  income: number;
  expenses: number;
  balance: number;
};

export function MonthReport(props: MonthReportProps) {
  const reportData = useMemo<ReportData>(() => {
    const income = props.transactions
      .filter((transaction) => transaction.category.type === "income")
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const expenses = props.transactions
      .filter((transaction) => transaction.category.type === "expense")
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const balance = income - expenses;

    return {
      income: income,
      expenses: expenses,
      balance: balance,
    };
  }, [props.transactions]);

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              Entradas
            </Text>
            <Text fw={700} size="xl" mt={4}>
              {formatCurrency(reportData.income)}
            </Text>
          </div>
          <ThemeIcon color="teal" variant="light" size="lg" radius="md">
            <IconArrowUpRight size={20} />
          </ThemeIcon>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              Saídas
            </Text>
            <Text fw={700} size="xl" mt={4}>
              {formatCurrency(reportData.expenses)}
            </Text>
          </div>
          <ThemeIcon color="red" variant="light" size="lg" radius="md">
            <IconArrowDownRight size={20} />
          </ThemeIcon>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              Balanço
            </Text>
            <Text fw={700} size="xl" mt={4} c={reportData.balance >= 0 ? "teal" : "red"}>
              {formatCurrency(reportData.balance)}
            </Text>
          </div>
          <ThemeIcon color={reportData.balance >= 0 ? "teal" : "red"} variant="light" size="lg" radius="md">
            <IconScale size={20} />
          </ThemeIcon>
        </Group>
      </Paper>
    </SimpleGrid>
  );
}
