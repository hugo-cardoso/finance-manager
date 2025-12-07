import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "#infrastructure/http/routes/authRoutes.js";
import { transactionCategoryRoutes } from "#infrastructure/http/routes/transactionCategoryRoutes.js";
import { transactionRoutes } from "#infrastructure/http/routes/transactionRoutes.js";
import { userRoutes } from "#infrastructure/http/routes/userRoutes.js";

export const app = new Hono().basePath("/api");

app.use("*", cors());

app.get("/", (c) => c.json({ status: "ok" }));

authRoutes(app);
userRoutes(app);
transactionCategoryRoutes(app);
transactionRoutes(app);

app.notFound((c) => c.json({ message: "Not Found" }, 404));

export default app;
