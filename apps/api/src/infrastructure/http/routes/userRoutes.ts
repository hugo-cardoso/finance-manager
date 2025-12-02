import { Hono } from "hono";

import { GetUserById } from "../../../application/user/use-cases/GetUserById.js";
import { db } from "../../database/drizzle/db.js";
import { UserMapper } from "../../database/mappers/UserMapper.js";
import { DrizzleUserRepository } from "../../database/repositories/DrizzleUserRepository.js";
import { verifyJwt } from "../middlewares/verify-jwt.js";

export const userRoutes = (_app: Hono) => {
  const app = new Hono();
  const userRepository = new DrizzleUserRepository(db);

  app.get("/me", verifyJwt, async (c) => {
    const user = await new GetUserById(userRepository).execute(c.var.jwt.sub);

    return c.json(UserMapper.toResponseDTO(user));
  });

  _app.route("/user", app);
};
