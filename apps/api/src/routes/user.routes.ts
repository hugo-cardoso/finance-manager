import { Hono } from "hono";
import { validator } from "hono/validator";
import z from "zod";

import { getJwtPayload, validateJwt } from "../middlewares/validate-jwt.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { SupabaseService } from "../services/SupabaseService.js";

const changePasswordSchema = z.object({
  current_password: z.string().min(8),
  new_password: z.string().min(8),
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

  app.post(
    "/change-password",
    validateJwt,
    validator("json", (value, c) => {
      const parsed = changePasswordSchema.safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }

      return parsed.data;
    }),
    async (c) => {
      try {
        const jwtPayload = getJwtPayload(c);
        const email = jwtPayload.email as string;

        const body = c.req.valid("json");

        await supabaseService.signIn(email, body.current_password);
        await supabaseService.changePassword(jwtPayload.sub, body.new_password);

        return c.json({ message: "Password updated successfully" });
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  appRoot.route("/", app);
};
