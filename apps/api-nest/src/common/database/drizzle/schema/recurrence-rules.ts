import { randomUUID } from "node:crypto";
import { boolean, integer, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const recurrenceRulesTable = pgTable("recurrence_rules", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  user_id: uuid("user_id").notNull(),
  category_id: uuid("category_id").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  day_of_month: integer("day_of_month").notNull(),
});
