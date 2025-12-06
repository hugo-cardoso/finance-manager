import { randomUUID } from "node:crypto";
import { date, integer, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const recurrenceType = pgEnum("recurrence_type", ["once", "installment", "recurring"]);

export const transactionTable = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  account_id: uuid("account_id").notNull(),
  category_id: uuid("category_id").notNull(),
  bill_id: uuid("bill_id"),
  name: varchar("name").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  date: date("date").notNull(),
  installment_group_id: uuid("installment_group_id"),
  installment_number: integer("installment_number"),
  total_installments: integer("total_installments"),
  recurrence: recurrenceType("recurrence").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
