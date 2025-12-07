import { Hono } from "hono";
import { GetAccountById } from "#application/accounts/use-cases/GetAccountById.js";
import { db } from "#infrastructure/database/drizzle/db.js";
import { AccountMapper } from "#infrastructure/database/mappers/AccountMapper.js";
import { DrizzleAccountRepository } from "#infrastructure/database/repositories/DrizzleAccountRepository.js";
import { verifyJwt } from "#infrastructure/http/middlewares/verify-jwt.js";

export const userRoutes = (_app: Hono) => {
  const app = new Hono();
  const accountRepository = new DrizzleAccountRepository(db);

  app.get("/me", verifyJwt, async (c) => {
    const account = await new GetAccountById(accountRepository).execute(c.var.jwt.sub);

    return c.json(AccountMapper.toResponseDTO(account));
  });

  _app.route("/user", app);
};
