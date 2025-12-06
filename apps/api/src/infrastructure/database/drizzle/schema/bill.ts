import { randomUUID } from "node:crypto";
import { boolean, date, integer, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const billTable = pgTable("bills", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  account_id: uuid("account_id").notNull(),
  category_id: uuid("category_id").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  name: varchar("name").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  day_of_month: integer("day_of_month").notNull(),
  start_date: date("start_date").notNull(),
  end_date: date("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
