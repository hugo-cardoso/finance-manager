import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Dependency } from "hono-simple-di";
import z from "zod";

import { CreateTransactionCategory } from "../../../application/transactions/use-cases/CreateTransactionCategory.js";
import { DeleteTransactionCategory } from "../../../application/transactions/use-cases/DeleteTransactionCategory.js";
import { GetAllTransactionsCategory } from "../../../application/transactions/use-cases/GetAllTransactionsCategory.js";
import { GetTransactionCategoryById } from "../../../application/transactions/use-cases/GetTransactionCategoryById.js";
import { UpdateTransactionCategory } from "../../../application/transactions/use-cases/UpdateTransactionCategory.js";
import { db } from "../../database/drizzle/db.js";
import { TransactionCategoryMapper } from "../../database/mappers/TransactionCategory.js";
import { DrizzleTransactionCategoryRepository } from "../../database/repositories/DrizzleTransactionCategoryRepository.js";
import { verifyJwt } from "../middlewares/verify-jwt.js";

export const transactionCategoryRoutes = (_app: Hono) => {
  const app = new Hono()
    .use(verifyJwt)
    .use(
      new Dependency((c) => new DrizzleTransactionCategoryRepository(db, c.var.jwt.sub)).middleware(
        "transactionCategoryRepository",
      ),
    );

  app.get("/", async (c) => {
    const { transactionCategoryRepository } = c.var;

    const categories = await new GetAllTransactionsCategory(transactionCategoryRepository).execute();

    return c.json(categories.map(TransactionCategoryMapper.toResponseDTO));
  });

  app.post("/", zValidator("json", z.object({ name: z.string() })), async (c) => {
    const body = c.req.valid("json");
    const { transactionCategoryRepository } = c.var;

    const category = await new CreateTransactionCategory(transactionCategoryRepository).execute({
      name: body.name,
    });

    return c.json(TransactionCategoryMapper.toResponseDTO(category));
  });

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
    const { transactionCategoryRepository } = c.var;

    await new DeleteTransactionCategory(transactionCategoryRepository).execute(id);

    return c.text("Category deleted successfully", 200);
  });

  _app.route("/transactions/categories", app);
};
