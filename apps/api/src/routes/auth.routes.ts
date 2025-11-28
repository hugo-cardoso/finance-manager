import { Hono } from "hono";
import { validator } from "hono/validator";
import z from "zod";

import { SupabaseService } from "../services/SupabaseService.js";

const signInBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const signUpBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

const verifyEmailOtpSchema = z.object({
  email: z.email(),
  token: z
    .string()
    .length(6)
    .regex(/^\d{6}$/),
});

const resendEmailOtpSchema = z.object({
  email: z.email(),
});

export const createAuthRoutes = (appRoot: Hono) => {
  const app = new Hono().basePath("/auth");
  const supabaseService = new SupabaseService();

  app.post(
    "/sign-in",
    validator("json", (value, c) => {
      const parsed = signInBodySchema.safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }
      return parsed.data;
    }),
    async (c) => {
      try {
        const body = c.req.valid("json");

        const response = await supabaseService.signIn(body.email, body.password);

        return c.json({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_at: response.expires_at,
        });
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.post(
    "/sign-up",
    validator("json", (value, c) => {
      const parsed = signUpBodySchema.safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }
      return parsed.data;
    }),
    async (c) => {
      try {
        const body = c.req.valid("json");

        await supabaseService.signUp({
          email: body.email,
          password: body.password,
          firstName: body.first_name,
          lastName: body.last_name,
        });

        return c.json({ message: "User created successfully" }, 201);
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.post(
    "/verify-email-otp",
    validator("json", (value, c) => {
      const parsed = verifyEmailOtpSchema.safeParse(value);
      if (!parsed.success) {
        return c.text("Email ou código OTP inválido", 400);
      }
      return parsed.data;
    }),
    async (c) => {
      try {
        const body = c.req.valid("json");

        await supabaseService.verifyEmailOtp(body.email, body.token);

        return c.json({ message: "Email verificado com sucesso" }, 200);
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.post(
    "/resend-email-otp",
    validator("json", (value, c) => {
      const parsed = resendEmailOtpSchema.safeParse(value);
      if (!parsed.success) {
        return c.text("Email inválido", 400);
      }
      return parsed.data;
    }),
    async (c) => {
      try {
        const body = c.req.valid("json");

        await supabaseService.resendEmailOtp(body.email);

        return c.json({ message: "Código OTP reenviado com sucesso" }, 200);
      } catch (error) {
        if (error instanceof Error) {
          return c.text(error.message, 400);
        }

        return c.text("Internal Server Error", 500);
      }
    },
  );

  app.post(
    "/refresh-token",
    validator("json", (value, c) => {
      const parsed = z.object({ refresh_token: z.string() }).safeParse(value);
      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }
      return parsed.data;
    }),
    async (c) => {
      try {
        const body = c.req.valid("json");

        const response = await supabaseService.refreshToken(body.refresh_token);

        return c.json({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_at: response.expires_at,
        });
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
