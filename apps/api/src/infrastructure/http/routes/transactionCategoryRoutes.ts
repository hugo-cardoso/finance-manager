import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

import { CreateTransactionCategory } from "#application/transaction/use-cases/CreateTransactionCategory.js";
import { DeleteTransactionCategory } from "#application/transaction/use-cases/DeleteTransactionCategory.js";
import { GetAllTransactionsCategory } from "#application/transaction/use-cases/GetAllTransactionsCategory.js";
import { GetTransactionCategoryById } from "#application/transaction/use-cases/GetTransactionCategoryById.js";
import { UpdateTransactionCategory } from "#application/transaction/use-cases/UpdateTransactionCategory.js";
import type { TransactionType } from "#domain/transaction/enums/TransactionType.js";
import { TransactionCategoryMapper } from "#infrastructure/database/mappers/TransactionCategory.js";
import { verifyJwt } from "#infrastructure/http/middlewares/verify-jwt.js";

import { dependencyInject } from "../middlewares/dependency-inject.js";

export const transactionCategoryRoutes = (_app: Hono) => {
  const app = new Hono().use(verifyJwt).use(dependencyInject);

  app.get("/", async (c) => {
    const { transactionCategoryRepository } = c.var;

    const categories = await new GetAllTransactionsCategory(transactionCategoryRepository).execute();

    return c.json(categories.map(TransactionCategoryMapper.toResponseDTO));
  });

  app.post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        icon: z.string(),
        color: z.string(),
        type: z.enum(["expense", "income"]),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const { transactionCategoryRepository } = c.var;

      const category = await new CreateTransactionCategory(transactionCategoryRepository).execute({
        name: body.name,
        icon: body.icon,
        color: body.color,
        type: body.type as TransactionType,
      });

      return c.json(TransactionCategoryMapper.toResponseDTO(category));
    },
  );

  app.get("/:id", async (c) => {
    const { id } = c.req.param();
    const { transactionCategoryRepository } = c.var;

    const category = await new GetTransactionCategoryById(transactionCategoryRepository).execute(id);

    return c.json(TransactionCategoryMapper.toResponseDTO(category));
  });

  app.patch("/:id", zValidator("json", z.object({ name: z.string() })), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    const { transactionCategoryRepository } = c.var;

    const category = await new UpdateTransactionCategory(transactionCategoryRepository).execute(id, {
      name: body.name,
    });

    return c.json(TransactionCategoryMapper.toResponseDTO(category));
  });

  app.delete("/:id", async (c) => {
    const { id } = c.req.param();
    const { transactionCategoryRepository, transactionRepository } = c.var;

    await new DeleteTransactionCategory(transactionCategoryRepository, transactionRepository).execute(id);

    return c.text("Category deleted successfully", 200);
  });

  _app.route("/transactions/categories", app);
};
