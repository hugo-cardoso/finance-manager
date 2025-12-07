import { zValidator } from "@hono/zod-validator";
import { SupabaseAuthService } from "@infrastructure/auth/SupabaseAuthService.js";

import { Hono } from "hono";
import z from "zod";

export const authRoutes = (_app: Hono) => {
  const app = new Hono();

  const supabaseAuthService = new SupabaseAuthService({
    url: process.env.SUPABASE_URL as string,
    anonKey: process.env.SUPABASE_ANON_KEY as string,
  });

  app.post(
    "/sign-in",
    zValidator(
      "json",
      z.object({
        email: z.email(),
        password: z.string().min(8),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");

      const response = await supabaseAuthService.signIn(body.email, body.password);

      return c.json(response);
    },
  );

  app.post(
    "/sign-up",
    zValidator(
      "json",
      z.object({
        email: z.email(),
        password: z.string().min(8),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");

      await supabaseAuthService.signUp({
        email: body.email,
        password: body.password,
        firstName: body.first_name,
        lastName: body.last_name,
      });

      return c.json({ message: "User created successfully" }, 201);
    },
  );

  app.post(
    "/verify-email-otp",
    zValidator(
      "json",
      z.object({
        email: z.email(),
        token: z
          .string()
          .length(6)
          .regex(/^\d{6}$/),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");

      await supabaseAuthService.verifyEmailOtp(body.email, body.token);

      return c.json({ message: "Email verified successfully" }, 200);
    },
  );

  app.post(
    "/resend-email-otp",
    zValidator(
      "json",
      z.object({
        email: z.email(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");

      await supabaseAuthService.resendEmailOtp(body.email);

      return c.json({ message: "Email sent successfully" }, 200);
    },
  );

  app.post(
    "/refresh-token",
    zValidator(
      "json",
      z.object({
        refresh_token: z.string(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");

      const response = await supabaseAuthService.refreshToken(body.refresh_token);

      return c.json(response);
    },
  );

  _app.route("/auth", app);
};
