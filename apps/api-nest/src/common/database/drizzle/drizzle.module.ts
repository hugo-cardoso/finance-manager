import { Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export const DRIZZLE = Symbol("drizzle-connection");

@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory() {
        const DATABASE_URL = process.env.DATABASE_URL || "";

        const client = postgres(DATABASE_URL, { prepare: false });

        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
