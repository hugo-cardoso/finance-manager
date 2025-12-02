import { randomUUID } from "node:crypto";
import { type InferEnum, relations } from "drizzle-orm";
import { date, integer, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { transactionCategoryTable } from "./transaction-category.js";
import { userTable } from "./user.js";

export const transactionType = pgEnum("transaction_type", ["expense", "income"]);

export const recurrenceType = pgEnum("recurrence_type", ["none", "weekly", "monthly", "yearly"]);

export const transactionTable = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: uuid("user_id").notNull(),
  categoryId: uuid("category_id").notNull(),
  groupId: uuid("group_id").notNull(),
  type: transactionType().notNull(),
  amount: numeric({ mode: "number" }).notNull().default(0),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  installment: integer().notNull().default(1),
  installments: integer(),
  recurrence: recurrenceType().notNull().default("none"),
  date: date().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionRelations = relations(transactionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [transactionTable.userId],
    references: [userTable.id],
  }),
  category: one(transactionCategoryTable, {
    fields: [transactionTable.categoryId],
    references: [transactionCategoryTable.id],
  }),
}));

export type TransactionTypeDbEnum = InferEnum<typeof transactionType>;

export type RecurrenceTypeDbEnum = InferEnum<typeof recurrenceType>;
