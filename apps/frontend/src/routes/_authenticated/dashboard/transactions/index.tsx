import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import z from "zod";

import { AppSidebarContent } from "@/components/app-sidebar-content";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { TransactionReportService } from "@/services/TransactionReportService";
import { MonthCarrousel } from "./-components/MonthCarrousel";
import { TransactionList } from "./-components/TransactionList";

const createMonthReportQueryOptions = (options: { month: number; year: number }) => {
  return queryOptions({
    queryKey: ["transactions", "month-report", options],
    queryFn: () => {
      return TransactionReportService.getMonthReport({ month: options.month, year: options.year });
    },
  });
};

const pageSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).optional(),
  month: z.coerce
    .number()
    .optional()
    .default(new Date().getMonth() + 1),
  year: z.coerce.number().optional().default(new Date().getFullYear()),
});

export const Route = createFileRoute("/_authenticated/dashboard/transactions/")({
  component: RouteComponent,
  pendingComponent: () => (
    <Layout>
      <div className="flex-1 flex items-center justify-center h-full">
        <Spinner />
      </div>
    </Layout>
  ),
  validateSearch: zodValidator(pageSearchSchema),
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
    month: search.month,
    year: search.year,
  }),
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient;

    await queryClient.ensureQueryData(
      createMonthReportQueryOptions({
        month: ctx.deps.month,
        year: ctx.deps.year,
      }),
    );
  },
  pendingMinMs: 0,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page, limit, month, year } = Route.useSearch();

  const monthReportQuery = useSuspenseQuery(createMonthReportQueryOptions({ month, year }));

  const monthReport = monthReportQuery.data;

  const date = new Date(year, month - 1, 15);

  return (
    <Layout>
      <section className="flex flex-col gap-4 pt-5 md:gap-6">
        <div className="px-4 flex justify-center">
          <MonthCarrousel
            defaultDate={date}
            onChange={(values) => {
              console.log(values);
              navigate({
                search: (search) => ({ ...search, month: values.month, year: values.year }),
              });
            }}
          />
        </div>
        <Separator />
      </section>

      <section className="flex flex-col gap-6 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 px-4 gap-5">
          <CardTransaction title="Receitas" amount={monthReport.income} type="income" />
          <CardTransaction title="Despesas" amount={monthReport.expenses} type="expense" />
          <CardTransaction title="Balanço" amount={monthReport.balance} />
        </div>
        <Separator />
      </section>

      <TransactionList
        page={page}
        limit={limit}
        date={date}
        onChangeCategory={(value) => {
          navigate({
            search: (search) => ({ ...search, category_id: value }),
          });
        }}
      />
    </Layout>
  );
}

type CardTransactionProps = {
  title: string;
  amount: number;
  type?: "income" | "expense";
};

function CardTransaction(props: CardTransactionProps) {
  return (
    <Card className="@container/card bg-input/30">
      <CardHeader>
        <CardDescription>{props.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
          {props.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </CardTitle>
        <CardAction>
          {props.type === "income" && <ArrowUpIcon className="size-4 text-green-500" />}
          {props.type === "expense" && <ArrowDownIcon className="size-4 text-red-500" />}
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function Layout({ children }: React.PropsWithChildren) {
  return (
    <AppSidebarContent title="Lançamentos" className="flex flex-col">
      {children}
    </AppSidebarContent>
  );
}
