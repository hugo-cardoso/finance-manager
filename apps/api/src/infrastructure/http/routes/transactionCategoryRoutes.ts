import { CreateTransactionCategory } from "@application/transaction/use-cases/CreateTransactionCategory.js";
import { DeleteTransactionCategory } from "@application/transaction/use-cases/DeleteTransactionCategory.js";
import { GetAllTransactionsCategory } from "@application/transaction/use-cases/GetAllTransactionsCategory.js";
import { GetTransactionCategoryById } from "@application/transaction/use-cases/GetTransactionCategoryById.js";
import { UpdateTransactionCategory } from "@application/transaction/use-cases/UpdateTransactionCategory.js";
import type { TransactionType } from "@domain/transaction/enums/TransactionType.js";
import { zValidator } from "@hono/zod-validator";
import { db } from "@infrastructure/database/drizzle/db.js";
import { TransactionCategoryMapper } from "@infrastructure/database/mappers/TransactionCategory.js";
import { DrizzleTransactionCategoryRepository } from "@infrastructure/database/repositories/DrizzleTransactionCategoryRepository.js";
import { DrizzleTransactionRepository } from "@infrastructure/database/repositories/DrizzleTransactionRepository.js";
import { verifyJwt } from "@infrastructure/http/middlewares/verify-jwt.js";
import { Hono } from "hono";
import { Dependency } from "hono-simple-di";
import z from "zod";

export const transactionCategoryRoutes = (_app: Hono) => {
  const app = new Hono()
    .use(verifyJwt)
    .use(
      new Dependency((c) => new DrizzleTransactionRepository(db, c.var.jwt.sub)).middleware("transactionRepository"),
    );

  const categoriesRepository = new DrizzleTransactionCategoryRepository(db);

  app.get("/", async (c) => {
    const categories = await new GetAllTransactionsCategory(categoriesRepository).execute();

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

      const category = await new CreateTransactionCategory(categoriesRepository).execute({
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

    const category = await new GetTransactionCategoryById(categoriesRepository).execute(id);

    return c.json(TransactionCategoryMapper.toResponseDTO(category));
  });

  app.patch("/:id", zValidator("json", z.object({ name: z.string() })), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");

    const category = await new UpdateTransactionCategory(categoriesRepository).execute(id, {
      name: body.name,
    });

    return c.json(TransactionCategoryMapper.toResponseDTO(category));
  });

  app.delete("/:id", async (c) => {
    const { id } = c.req.param();
    const { transactionRepository } = c.var;

    await new DeleteTransactionCategory(categoriesRepository, transactionRepository).execute(id);

    return c.text("Category deleted successfully", 200);
  });

  _app.route("/transactions/categories", app);
};
