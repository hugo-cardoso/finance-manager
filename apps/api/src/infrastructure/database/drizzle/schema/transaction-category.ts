import { randomUUID } from "node:crypto";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const transactionType = pgEnum("transaction_type", ["expense", "income"]);

export const transactionCategoryTable = pgTable("transactions_categories", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name").notNull(),
  icon: varchar("icon").notNull(),
  color: varchar("color").notNull(),
  type: transactionType().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
