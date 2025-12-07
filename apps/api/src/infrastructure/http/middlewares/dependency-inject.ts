import type { JwtPayload } from "@supabase/supabase-js";
import type { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";

import type { IAccountRepository } from "#domain/account/repositories/IAccountRepository.js";
import type { IBillRepository } from "#domain/bill/repositories/iBillRepository.js";
import type { ITransactionCategoryRepository } from "#domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { ITransactionRepository } from "#domain/transaction/repositories/ITransactionRepository.js";
import { db } from "#infrastructure/database/drizzle/db.js";
import { DrizzleAccountRepository } from "#infrastructure/database/repositories/DrizzleAccountRepository.js";
import { DrizzleBillRepository } from "#infrastructure/database/repositories/DrizzleBillRepository.js";
import { DrizzleTransactionCategoryRepository } from "#infrastructure/database/repositories/DrizzleTransactionCategoryRepository.js";
import { DrizzleTransactionRepository } from "#infrastructure/database/repositories/DrizzleTransactionRepository.js";

export const dependencyInject: MiddlewareHandler<{
  Variables: {
    accountRepository: IAccountRepository;
    transactionRepository: ITransactionRepository;
    billRepository: IBillRepository;
    transactionCategoryRepository: ITransactionCategoryRepository;
  };
}> = async (c, next) => {
  c.set("accountRepository", new DrizzleAccountRepository(db));

  const authToken = c.req.header("Authorization")?.split(" ")[1];

  if (authToken) {
    const payload = (await verify(authToken, process.env.SUPABASE_JWT_SECRET as string)) as JwtPayload;

    const transactionCategoryRepository = new DrizzleTransactionCategoryRepository({
      db,
    });
    const transactionRepository = new DrizzleTransactionRepository({
      db,
      accountId: payload.sub,
      transactionCategoryRepository: transactionCategoryRepository,
    });
    const billRepository = new DrizzleBillRepository({
      db,
      accountId: payload.sub,
      transactionCategoryRepository,
    });

    c.set("transactionRepository", transactionRepository);
    c.set("transactionCategoryRepository", transactionCategoryRepository);
    c.set("billRepository", billRepository);
  }

  await next();
};
