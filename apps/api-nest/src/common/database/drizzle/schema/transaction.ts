import { randomUUID } from "node:crypto";
import { date, integer, numeric, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const recurrenceType = pgEnum("recurrence_type", ["single", "installment", "recurrence"]);

export const transactionStatus = pgEnum("transaction_status", ["active", "deleted"]);

export const transactionsTable = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  user_id: uuid("user_id").notNull(),
  category_id: uuid("category_id").notNull(),
  recurrence_id: uuid("recurrence_id"),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  date: date("date").notNull(),
  recurrence: recurrenceType("recurrence").notNull(),

  installment_id: uuid("installment_id"),
  installment_number: integer("installment_number"),
  installment_total: integer("installment_total"),

  status: transactionStatus("status").notNull(),
});
