import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRoutes } from "./infrastructure/http/routes/authRoutes.js";
import { transactionCategoryRoutes } from "./infrastructure/http/routes/transactionCategoryRoutes.js";
import { transactionRoutes } from "./infrastructure/http/routes/transactionRoutes.js";
import { userRoutes } from "./infrastructure/http/routes/userRoutes.js";

const app = new Hono().basePath("/api");

app.use("*", cors());

authRoutes(app);
userRoutes(app);
transactionCategoryRoutes(app);
transactionRoutes(app);

export default app;
