import { randomUUID } from "node:crypto";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: varchar("email").notNull(),
  first_name: varchar("first_name").notNull(),
  last_name: varchar("last_name").notNull(),
});
