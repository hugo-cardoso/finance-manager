import { relations } from "drizzle-orm";

import { recurrenceRulesTable } from "./recurrence-rules";
import { transactionsTable } from "./transaction";
import { usersTable } from "./user";

export const userRelations = relations(usersTable, ({ many }) => ({
  recurrences: many(recurrenceRulesTable),
  transactions: many(transactionsTable),
}));
