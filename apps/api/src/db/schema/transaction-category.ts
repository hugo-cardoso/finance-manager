import { randomUUID } from "node:crypto";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const transactionCategoryTable = pgTable("transactions_categories", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: uuid("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
