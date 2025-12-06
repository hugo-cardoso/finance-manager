import { Hono } from "hono";

import { GetAccountById } from "../../../application/accounts/use-cases/GetAccountById.js";
import { db } from "../../database/drizzle/db.js";
import { AccountMapper } from "../../database/mappers/AccountMapper.js";
import { DrizzleAccountRepository } from "../../database/repositories/DrizzleAccountRepository.js";
import { verifyJwt } from "../middlewares/verify-jwt.js";

export const userRoutes = (_app: Hono) => {
  const app = new Hono();
  const accountRepository = new DrizzleAccountRepository(db);

  app.get("/me", verifyJwt, async (c) => {
    const account = await new GetAccountById(accountRepository).execute(c.var.jwt.sub);

    return c.json(AccountMapper.toResponseDTO(account));
  });

  _app.route("/user", app);
};
