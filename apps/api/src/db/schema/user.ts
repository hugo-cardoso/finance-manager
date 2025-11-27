import { relations } from "drizzle-orm";
import { jsonb, pgSchema, uuid, varchar } from "drizzle-orm/pg-core";
import { transactionTable } from "./transaction.js";

export const authSchema = pgSchema("auth");

export type RawUserMetadata = { first_name: string; last_name: string };

export const userTable = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email").notNull(),
  rawUserMetadata: jsonb("raw_user_meta_data").$type<RawUserMetadata>(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  transactions: many(transactionTable),
}));
