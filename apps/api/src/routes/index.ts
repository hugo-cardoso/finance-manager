import type { Hono } from "hono";

import { createAuthRoutes } from "./auth.routes.js";
import { createTransactionsRoutes } from "./transactions.routes.js";
import { createTransactionsCategoriesRoutes } from "./transactions-categories.routes.js";
import { createTransactionsReportsRoutes } from "./transactions-reports.routes.js";
import { createUserRoutes } from "./user.routes.js";

export const createRoutes = (app: Hono) => {
  createAuthRoutes(app);
  createTransactionsReportsRoutes(app);
  createTransactionsCategoriesRoutes(app);
  createTransactionsRoutes(app);
  createUserRoutes(app);
};
