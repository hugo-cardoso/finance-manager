import { Hono } from "hono";
import { GetAccountById } from "#application/accounts/use-cases/GetAccountById.js";
import { AccountMapper } from "#infrastructure/database/mappers/AccountMapper.js";
import { verifyJwt } from "#infrastructure/http/middlewares/verify-jwt.js";
import { dependencyInject } from "../middlewares/dependency-inject.js";

export const userRoutes = (_app: Hono) => {
  const app = new Hono().use(dependencyInject);

  app.get("/me", verifyJwt, async (c) => {
    const account = await new GetAccountById(c.get("accountRepository")).execute(c.var.jwt.sub);

    return c.json(AccountMapper.toResponseDTO(account));
  });

  _app.route("/user", app);
};
