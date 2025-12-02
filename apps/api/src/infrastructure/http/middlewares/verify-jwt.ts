import type { JwtPayload } from "@supabase/supabase-js";
import type { Context, MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";

export const verifyJwt: MiddlewareHandler<{
  Variables: {
    jwt: JwtPayload;
  };
}> = async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token || token === "null") {
    return c.text("Unauthorized", 401);
  }

  try {
    const payload = await verify(token, process.env.SUPABASE_JWT_SECRET as string);

    c.set("jwt", payload as JwtPayload);
    c.set("jwtPayload", payload as JwtPayload);

    await next();
  } catch (_) {
    return c.text("Unauthorized", 401);
  }
};

export const getJwtPayload = (c: Context) => {
  const payload = c.get("jwtPayload");

  if (!payload) {
    throw new Error("JWT payload not found");
  }

  return payload as JwtPayload;
};
