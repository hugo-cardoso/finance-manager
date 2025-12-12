import { randomUUID } from "node:crypto";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const transactionType = pgEnum("transaction_type", ["expense", "income"]);

export const transactionsCategoriesTable = pgTable("transactions_categories", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name").notNull(),
  icon: varchar("icon").notNull(),
  type: transactionType().notNull(),
});
