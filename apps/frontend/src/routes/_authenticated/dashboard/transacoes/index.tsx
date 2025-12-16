import { Button, Center, Divider, Flex, Loader, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { useTransactionsQuery, useTransactionsQueryOptions } from "@/hooks/queries/useTransactionsQuery";
import { useIsMobile } from "@/hooks/use-mobile";
import { PrivateLayoutContent } from "@/layouts/PrivateLayout/content";
import { CreateTransactionDrawer } from "./-components/CreateTransactionDrawer";
import { MonthReport } from "./-components/MonthReport";
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
  const isMobile = useIsMobile();

  const transactionsQuery = useTransactionsQuery(mes, ano);

  return (
    <div className="flex h-full flex-col flex-1">
      <Stack gap={0}>
        <Flex justify="space-between" align="center" gap="md">
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

          <CreateTransactionDrawer>
            {isMobile ? (
              <Button variant="filled" radius="md">
                <IconPlus size={14} />
              </Button>
            ) : (
              <Button leftSection={<IconPlus size={14} />} variant="filled" radius="md">
                Nova transação
              </Button>
            )}
          </CreateTransactionDrawer>
        </Flex>
        <Divider my="md" />
      </Stack>

      {transactionsQuery.isLoading && (
        <Center flex={1}>
          <Loader size="sm" />
        </Center>
      )}

      {transactionsQuery.isSuccess && (
        <Stack gap={0}>
          <MonthReport transactions={transactionsQuery.data} />

          <Divider my="md" />

          <Stack>
            {transactionsQuery.data.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </Stack>
        </Stack>
      )}
    </div>
  );
}
