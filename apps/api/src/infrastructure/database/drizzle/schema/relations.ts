import { relations } from "drizzle-orm";

import { accountTable } from "./account.js";
import { billTable } from "./bill.js";
import { transactionTable } from "./transaction.js";
import { transactionCategoryTable } from "./transaction-category.js";

export const accountRelations = relations(accountTable, ({ many }) => ({
  bills: many(billTable),
  transactions: many(transactionTable),
}));

export const billRelations = relations(billTable, ({ one, many }) => ({
  account: one(accountTable, {
    fields: [billTable.account_id],
    references: [accountTable.id],
  }),
  transactions: many(transactionTable),
  category: one(transactionCategoryTable, {
    fields: [billTable.category_id],
    references: [transactionCategoryTable.id],
  }),
}));

export const transactionRelations = relations(transactionTable, ({ one }) => ({
  account: one(accountTable, {
    fields: [transactionTable.account_id],
    references: [accountTable.id],
  }),
  category: one(transactionCategoryTable, {
    fields: [transactionTable.category_id],
    references: [transactionCategoryTable.id],
  }),
  bill: one(billTable, {
    fields: [transactionTable.bill_id],
    references: [billTable.id],
  }),
}));

export const transactionCategoryRelations = relations(transactionCategoryTable, ({ many }) => ({
  transactions: many(transactionTable),
  bills: many(billTable),
}));
