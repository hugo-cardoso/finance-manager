import { Hono } from "hono";

import { getJwtPayload, validateJwt } from "../middlewares/validate-jwt.js";
import { UserRepository } from "../repositories/UserRepository.js";

export const createUserRoutes = (appRoot: Hono) => {
  const app = new Hono().basePath("/user");
  const userRepository = new UserRepository();

  app.get("/me", validateJwt, async (c) => {
    const jwtPayload = getJwtPayload(c);

    const user = await userRepository.findById(jwtPayload.sub);

    return c.json({
      id: user.id,
      email: user.email,
      first_name: user.rawUserMetadata?.first_name,
      last_name: user.rawUserMetadata?.last_name,
    });
  });

  appRoot.route("/", app);
};
