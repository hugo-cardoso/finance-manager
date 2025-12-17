import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconArrowDownRight, IconArrowUpRight, IconRefresh } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTransactionQuery, useTransactionQueryOptions } from "@/hooks/queries/useTransactionQuery";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";

export const Route = createFileRoute("/_authenticated/dashboard/transacoes/$id/")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { queryClient } = context;

    queryClient.prefetchQuery(useTransactionQueryOptions(params.id));
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const transactionQuery = useTransactionQuery(id);

  const formattedAmount = useMemo(() => {
    if (!transactionQuery.data) return null;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(transactionQuery.data.amount);
  }, [transactionQuery.data]);

  const formattedDate = useMemo(() => {
    if (!transactionQuery.data) return null;
    const date = new Date(transactionQuery.data.date);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
  }, [transactionQuery.data]);

  const pageTitle = transactionQuery.data ? `Transação - ${transactionQuery.data.name}` : "Transação";
  const type = transactionQuery.data?.category.type;

  return (
    <PrivateLayoutContent title={pageTitle}>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text size="xs" c="dimmed">
              ID: {id}
            </Text>
            <Title order={3}>{transactionQuery.data?.name ?? "Detalhes da transação"}</Title>
          </div>

          <Button variant="light" renderRoot={(props) => <Route.Link {...props} to="/dashboard/transacoes" />}>
            Voltar
          </Button>
        </Group>

        {transactionQuery.isLoading && (
          <Paper shadow="xs" p="md" withBorder>
            <Stack gap="sm">
              <Skeleton height={18} width="60%" />
              <Skeleton height={14} width="40%" />
              <Divider my="xs" />
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" verticalSpacing="md">
                <Stack gap={6}>
                  <Skeleton height={12} width={60} />
                  <Skeleton height={18} width={140} />
                </Stack>
                <Stack gap={6}>
                  <Skeleton height={12} width={60} />
                  <Skeleton height={18} width={160} />
                </Stack>
                <Stack gap={6}>
                  <Skeleton height={12} width={80} />
                  <Skeleton height={18} width={180} />
                </Stack>
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        {transactionQuery.isError && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            color="red"
            variant="light"
            title="Não foi possível carregar a transação"
          >
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                {(transactionQuery.error as Error | undefined)?.message ?? "Tente novamente em alguns instantes."}
              </Text>

              <Group justify="flex-start">
                <Button
                  leftSection={<IconRefresh size={16} />}
                  onClick={() => transactionQuery.refetch()}
                  loading={transactionQuery.isFetching}
                >
                  Tentar novamente
                </Button>
              </Group>
            </Stack>
          </Alert>
        )}

        {transactionQuery.isSuccess && transactionQuery.data && (
          <Paper shadow="xs" p="md" withBorder>
            <Group gap="md" align="flex-start" wrap="nowrap">
              <ThemeIcon color={type === "income" ? "teal" : "red"} variant="light" size="lg" radius="md">
                {type === "income" ? <IconArrowUpRight size={20} /> : <IconArrowDownRight size={20} />}
              </ThemeIcon>

              <Stack gap="sm" style={{ flex: 1, minWidth: 0 }}>
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <div style={{ minWidth: 0 }}>
                    <Group gap="xs" align="center">
                      <Text fw={600} style={{ overflowWrap: "anywhere" }}>
                        {transactionQuery.data.name}
                      </Text>
                      {transactionQuery.data.installment && (
                        <Badge size="sm" variant="light" color="blue">
                          {transactionQuery.data.installment.number}/{transactionQuery.data.installment.total}
                        </Badge>
                      )}
                    </Group>
                    <Text size="sm" c="dimmed">
                      {transactionQuery.data.category.name}
                    </Text>
                  </div>

                  <Badge color={type === "income" ? "green" : "red"} variant="light">
                    {type === "income" ? "Receita" : "Despesa"}
                  </Badge>
                </Group>

                <Divider />

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" verticalSpacing="md">
                  <Stack gap={4} style={{ minWidth: 0 }}>
                    <Text size="xs" c="dimmed">
                      Valor
                    </Text>
                    <Text fw={600} c={type === "income" ? "green" : "red"}>
                      {formattedAmount}
                    </Text>
                  </Stack>

                  <Stack gap={4} style={{ minWidth: 0 }}>
                    <Text size="xs" c="dimmed">
                      Data
                    </Text>
                    <Text fw={500} style={{ overflowWrap: "anywhere" }}>
                      {formattedDate}
                    </Text>
                  </Stack>

                  <Stack gap={4} style={{ minWidth: 0 }}>
                    <Text size="xs" c="dimmed">
                      Categoria
                    </Text>
                    <Text fw={500} style={{ overflowWrap: "anywhere" }}>
                      {transactionQuery.data.category.name}
                    </Text>
                  </Stack>
                </SimpleGrid>
              </Stack>
            </Group>
          </Paper>
        )}
      </Stack>
    </PrivateLayoutContent>
  );
}
