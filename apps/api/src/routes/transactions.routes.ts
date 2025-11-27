import { Hono } from "hono";
import { validator } from "hono/validator";
import z from "zod";

import { NotFoundError } from "../errors/NotFoundError.js";
import { TransactionMapper } from "../mappers/transaction.js";
import { getJwtPayload, validateJwt } from "../middlewares/validate-jwt.js";
import { UserTransactionCategoryRespository } from "../repositories/UserTransactionCategoryRespository.js";
import { UserTransactionRespository } from "../repositories/UserTransactionRespository.js";
import type { RecurrenceType } from "../types/transaction.js";

const getTransactionsQuerySchema = z.object({
  type: z.enum(["expense", "income"]).optional(),
  category_id: z.string().optional(),
  start_date: z.iso
    .date()
    .optional()
    .transform((date) => (date ? new Date(date) : undefined)),
  end_date: z.iso
    .date()
    .optional()
    .transform((date) => (date ? new Date(date) : undefined)),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

const createTransactionBodySchema = z.object({
  name: z.string(),
  category_id: z.string(),
  type: z.enum(["expense", "income"]),
  amount: z.number(),
  description: z.string().optional(),
  installment: z.coerce.number().optional(),
  installments: z.coerce.number().optional(),
  recurrence: z.enum(["none", "daily", "weekly", "monthly", "yearly"]).optional(),
  date: z.iso.date(),
});

export const createTransactionsRoutes = (appRoot: Hono) => {
  const app = new Hono().basePath("/transactions");

  app.get(
    "/",
    validateJwt,
    validator("query", (value, c) => {
      const parsed = getTransactionsQuerySchema.safeParse(value);

      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }

      return parsed.data;
    }),
    async (c) => {
      try {
        const jwtPayload = getJwtPayload(c);
        const query = c.req.valid("query");

        const transactionRepository = new UserTransactionRespository(jwtPayload.sub);

        const transactions = await transactionRepository.find({
          filters: {
            type: query.type,
            categoryId: query.category_id,
            startDate: query.start_date,
            endDate: query.end_date,
          },
        });

        return c.json(
          transactions.map((transaction) => TransactionMapper.repoToResponse(transaction, transaction.category)),
        );
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.get("/:id", validateJwt, async (c) => {
    try {
      const { id } = c.req.param();
      const jwtPayload = getJwtPayload(c);

      const transactionRepository = new UserTransactionRespository(jwtPayload.sub);

      const transaction = await transactionRepository.findById(id);

      return c.json(TransactionMapper.repoToResponse(transaction, transaction.category));
    } catch (error) {
      if (error instanceof Error) {
        return c.text(error.message, 400);
      }

      if (error instanceof NotFoundError) {
        return c.text(error.message, 404);
      }

      return c.text("Internal Server Error", 500);
    }
  });

  app.delete("/:id", validateJwt, async (c) => {
    try {
      const { id } = c.req.param();
      const jwtPayload = getJwtPayload(c);

      const transactionRepository = new UserTransactionRespository(jwtPayload.sub);

      await transactionRepository.delete(id);

      return c.text("Transaction deleted successfully", 200);
    } catch (error) {
      if (error instanceof Error) {
        return c.text(error.message, 400);
      }

      return c.text("Internal Server Error", 500);
    }
  });

  app.post(
    "/",
    validateJwt,
    validator("json", (value, c) => {
      const parsed = createTransactionBodySchema.safeParse(value);
      if (!parsed.success) {
        console.log(parsed.error);
        return c.text("Invalid!", 400);
      }

      return parsed.data;
    }),
    async (c) => {
      try {
        const body = c.req.valid("json");

        const jwtPayload = getJwtPayload(c);

        const transactionRepository = new UserTransactionRespository(jwtPayload.sub);
        const transactionCategoryRespository = new UserTransactionCategoryRespository(jwtPayload.sub);

        const category = await transactionCategoryRespository.findById(body.category_id);

        const transaction = await transactionRepository.create({
          name: body.name,
          categoryId: body.category_id,
          type: body.type,
          amount: body.amount,
          description: body.description,
          installment: body.installment,
          installments: body.installments,
          recurrence: body.recurrence as RecurrenceType,
          date: new Date(body.date),
        });

        return c.json(TransactionMapper.repoToResponse(transaction, category));
      } catch (error) {
        if (error instanceof NotFoundError) {
          return c.text(error.message, 404);
        }

        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  appRoot.route("/", app);
};
