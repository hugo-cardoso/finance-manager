import { defineConfig } from "drizzle-kit";

const DATABASE_URL = `${process.env.DATABASE_URL}:5432/postgres`;

export default defineConfig({
  schema: "./src/infrastructure/database/drizzle/schema/*",
  out: "./src/infrastructure/database/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
