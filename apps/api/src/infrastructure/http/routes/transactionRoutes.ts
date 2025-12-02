import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Dependency } from "hono-simple-di";
import z from "zod";

import { CreateTransaction } from "../../../application/transactions/use-cases/CreateTransaction.js";
import { DeleteTransaction } from "../../../application/transactions/use-cases/DeleteTransaction.js";
import { GetAllTransactions } from "../../../application/transactions/use-cases/GetAllTransactions.js";
import { GetTransactionById } from "../../../application/transactions/use-cases/GetTransactionById.js";
import { db } from "../../database/drizzle/db.js";
import { TransactionMapper } from "../../database/mappers/TransactionMapper.js";
import { DrizzleTransactionCategoryRepository } from "../../database/repositories/DrizzleTransactionCategoryRepository.js";
import { DrizzleTransactionRepository } from "../../database/repositories/DrizzleTransactionRepository.js";
import { verifyJwt } from "../middlewares/verify-jwt.js";

export const transactionRoutes = (_app: Hono) => {
  const app = new Hono()
    .use(verifyJwt)
    .use(new Dependency((c) => new DrizzleTransactionRepository(db, c.var.jwt.sub)).middleware("transactionRepository"))
    .use(
      new Dependency((c) => new DrizzleTransactionCategoryRepository(db, c.var.jwt.sub)).middleware(
        "transactionCategoryRepository",
      ),
    );

  app.get("/", async (c) => {
    const { transactionRepository } = c.var;

    const transactions = await new GetAllTransactions(transactionRepository).execute();

    return c.json(transactions.map(TransactionMapper.toResponseDTO));
  });

  app.post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        category_id: z.string(),
        type: z.enum(["expense", "income"]),
        amount: z.number(),
        recurrence: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
        date: z.iso.date(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const { transactionRepository, transactionCategoryRepository } = c.var;

      const transaction = await new CreateTransaction(transactionRepository, transactionCategoryRepository).execute({
        name: body.name,
        categoryId: body.category_id,
        type: body.type,
        amount: body.amount,
        recurrence: body.recurrence,
        date: new Date(body.date),
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

  app.delete("/:id", async (c) => {
    const { id } = c.req.param();
    const { transactionRepository } = c.var;

    await new DeleteTransaction(transactionRepository).execute(id);

    return c.text("Transaction deleted successfully", 200);
  });

  _app.route("/transactions", app);
};
