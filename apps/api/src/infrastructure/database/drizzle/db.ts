import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.js";

const DATABASE_URL = `${process.env.DATABASE_URL}:6543/postgres`;

const client = postgres(DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
export type DrizzleDB = typeof db;
