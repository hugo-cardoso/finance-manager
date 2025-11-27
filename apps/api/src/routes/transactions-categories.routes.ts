import { Hono } from "hono";
import { validator } from "hono/validator";
import z from "zod";

import { NotFoundError } from "../errors/NotFoundError.js";
import { TransactionCategoryMapper } from "../mappers/transaction-category.js";
import { getJwtPayload, validateJwt } from "../middlewares/validate-jwt.js";
import { UserTransactionCategoryRespository } from "../repositories/UserTransactionCategoryRespository.js";
import { UserTransactionRespository } from "../repositories/UserTransactionRespository.js";

const createTransactionCategorySchema = z.object({
  name: z.string(),
});

const updateTransactionCategorySchema = z.object({
  name: z.string(),
});

export const createTransactionsCategoriesRoutes = (appRoot: Hono) => {
  const app = new Hono().basePath("/categories");

  app.get("/", validateJwt, async (c) => {
    const jwtPayload = getJwtPayload(c);

    const transactionCategoryRepository = new UserTransactionCategoryRespository(jwtPayload.sub);

    const categories = await transactionCategoryRepository.findAll();

    return c.json(categories.map(TransactionCategoryMapper.repoToResponse));
  });

  app.get("/:id", validateJwt, async (c) => {
    try {
      const { id } = c.req.param();
      const jwtPayload = getJwtPayload(c);

      const transactionCategoryRepository = new UserTransactionCategoryRespository(jwtPayload.sub);

      const category = await transactionCategoryRepository.findById(id);

      return c.json(TransactionCategoryMapper.repoToResponse(category));
    } catch (error) {
      if (error instanceof NotFoundError) {
        return c.text(error.message, 404);
      }

      return c.text("Internal Server Error", 500);
    }
  });

  app.post(
    "/",
    validateJwt,
    validator("json", (value, c) => {
      const parsed = createTransactionCategorySchema.safeParse(value);

      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }

      return parsed.data;
    }),
    async (c) => {
      try {
        const { name } = c.req.valid("json");
        const jwtPayload = getJwtPayload(c);

        const transactionCategoryRepository = new UserTransactionCategoryRespository(jwtPayload.sub);

        const category = await transactionCategoryRepository.create({ name });

        return c.json(TransactionCategoryMapper.repoToResponse(category));
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.patch(
    "/:id",
    validateJwt,
    validator("json", (value, c) => {
      const parsed = updateTransactionCategorySchema.safeParse(value);

      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }

      return parsed.data;
    }),
    async (c) => {
      try {
        const { name } = c.req.valid("json");
        const { id } = c.req.param();

        const jwtPayload = getJwtPayload(c);

        const transactionCategoryRepository = new UserTransactionCategoryRespository(jwtPayload.sub);

        const category = await transactionCategoryRepository.update(id, { name });

        return c.json(TransactionCategoryMapper.repoToResponse(category));
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.delete("/:id", validateJwt, async (c) => {
    try {
      const { id } = c.req.param();
      const jwtPayload = getJwtPayload(c);

      const transactionRepository = new UserTransactionRespository(jwtPayload.sub);
      const transactionCategoryRepository = new UserTransactionCategoryRespository(jwtPayload.sub);

      const transactionsWithCategory = await transactionRepository.findByCategoryId(id);

      if (transactionsWithCategory.length > 0) {
        return c.text("Category has transactions!", 400);
      }

      await transactionCategoryRepository.delete(id);

      return c.status(204);
    } catch (error) {
      if (error instanceof Error) {
        return c.text(error.message, 400);
      }

      return c.text("Internal Server Error", 500);
    }
  });

  appRoot.route("/transactions", app);
};
