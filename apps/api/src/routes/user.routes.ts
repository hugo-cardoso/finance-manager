import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { getJwtPayload, validateJwt } from "../middlewares/validate-jwt.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { SupabaseService } from "../services/SupabaseService.js";

const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const createUserRoutes = (appRoot: Hono) => {
  const app = new Hono().basePath("/user");
  const userRepository = new UserRepository();
  const supabaseService = new SupabaseService();

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

  app.put("/password", validateJwt, zValidator("json", updatePasswordSchema), async (c) => {
    const jwtPayload = getJwtPayload(c);
    const { newPassword } = c.req.valid("json");

    try {
      await supabaseService.updatePassword(jwtPayload.sub, newPassword);
      return c.json({ message: "Senha atualizada com sucesso" }, 200);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Erro ao atualizar senha" }, 500);
    }
  });

  appRoot.route("/", app);
};
