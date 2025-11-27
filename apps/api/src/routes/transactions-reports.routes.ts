import { setMonth, setYear } from "date-fns";
import { Hono } from "hono";
import { validator } from "hono/validator";
import z from "zod";

import { getJwtPayload, validateJwt } from "../middlewares/validate-jwt.js";
import { TransactionReportService } from "../services/TransactionReportService.js";

export const createTransactionsReportsRoutes = (appRoot: Hono) => {
  const app = new Hono().basePath("/reports");

  app.get(
    "/monthly",
    validateJwt,
    validator("query", (value, c) => {
      const parsed = z
        .object({
          year: z.coerce.number(),
          month: z.coerce.number(),
        })
        .safeParse(value);

      if (!parsed.success) {
        return c.text("Invalid!", 400);
      }

      return parsed.data;
    }),
    async (c) => {
      const jwtPayload = getJwtPayload(c);
      const query = c.req.valid("query");

      const transactionReportService = new TransactionReportService(jwtPayload.sub);

      const date = setYear(setMonth(new Date(), query.month - 1), query.year);

      const report = await transactionReportService.generateMonthlyReport(date);

      return c.json(report);
    },
  );

  appRoot.route("/transactions", app);
};
