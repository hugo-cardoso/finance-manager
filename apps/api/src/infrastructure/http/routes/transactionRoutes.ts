import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

import { CreateTransaction } from "#application/transaction/use-cases/CreateTransaction.js";
import { DeleteTransaction } from "#application/transaction/use-cases/DeleteTransaction.js";
import { GetMonthTransactions } from "#application/transaction/use-cases/GetMonthTransactions.js";
import { GetTransactionById } from "#application/transaction/use-cases/GetTransactionById.js";
import { TransactionMapper } from "#infrastructure/database/mappers/TransactionMapper.js";

import { dependencyInject } from "../middlewares/dependency-inject.js";
import { verifyJwt } from "../middlewares/verify-jwt.js";

export const transactionRoutes = (_app: Hono) => {
  const app = new Hono().use(verifyJwt).use(dependencyInject);

  app.get(
    "/",
    zValidator(
      "query",
      z.object({
        month: z.coerce.number(),
        year: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { transactionRepository, billRepository } = c.var;
      const query = c.req.valid("query");

      const transactions = await new GetMonthTransactions(transactionRepository, billRepository).execute({
        month: Number(query.month),
        year: Number(query.year),
      });

      return c.json(transactions.map(TransactionMapper.toResponseDTO));
    },
  );

  app.post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category_id: z.string(),
        amount: z.number(),
        recurrence: z.enum(["once", "installment", "recurring"]),
        installments: z.number().optional(),
        date: z.iso.date(),
        end_date: z.iso.date().optional(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const { transactionRepository, billRepository, transactionCategoryRepository } = c.var;

      const transaction = await new CreateTransaction(
        transactionRepository,
        transactionCategoryRepository,
        billRepository,
      ).execute({
        name: body.name,
        description: body.description,
        categoryId: body.category_id,
        amount: body.amount,
        date: new Date(body.date),
        recurrence: body.recurrence,
        installments: body.installments,
        endDate: body.end_date ? new Date(body.end_date) : undefined,
      });

      return c.json(TransactionMapper.toResponseDTO(transaction));
    },
  );

  app.get("/:id", async (c) => {
    const { id } = c.req.param();
    const { transactionRepository } = c.var;

    const transaction = await new GetTransactionById(transactionRepository).execute(id);

    return c.json(TransactionMapper.toResponseDTO(transaction));
  });

  app.delete(
    "/:id",
    zValidator(
      "query",
      z.object({
        behavior: z.enum(["one", "all", "nexts"]),
      }),
    ),
    async (c) => {
      const { id } = c.req.param();
      const query = c.req.valid("query");
      const { transactionRepository } = c.var;

      await new DeleteTransaction(transactionRepository).execute({
        id,
        behavior: query.behavior,
      });

      return c.text("Transaction deleted successfully", 200);
    },
  );

  _app.route("/transactions", app);
};
