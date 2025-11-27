import type { JwtPayload } from "@supabase/supabase-js";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export type JwtEnv = {
  Variables: {
    jwtPayload: JwtPayload;
  };
};

export const validateJwt = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token || token === "null") {
    return c.text("Unauthorized", 401);
  }

  try {
    const payload = await verify(token, process.env.SUPABASE_JWT_SECRET as string);
    c.set("jwtPayload", payload as unknown as JwtPayload);
  } catch (_) {
    return c.text("Unauthorized", 401);
  }

  await next();
});

export const getJwtPayload = (c: Context) => {
  const payload = c.get("jwtPayload");

  if (!payload) {
    throw new Error("JWT payload not found");
  }

  return payload as JwtPayload;
};
