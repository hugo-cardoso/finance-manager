import { eq } from "drizzle-orm";

import type { Account } from "../../../domain/account/entities/Account.js";
import type { IAccountRepository } from "../../../domain/account/repositories/IAccountRepository.js";
import type { DrizzleDB } from "../drizzle/db.js";
import { accountTable } from "../drizzle/schema/account.js";
import { AccountMapper } from "../mappers/AccountMapper.js";

export class DrizzleAccountRepository implements IAccountRepository {
  constructor(private readonly db: DrizzleDB) {}

  async findAll(): Promise<Account[]> {
    const accounts = await this.db.query.accountTable.findMany();

    return accounts.map(AccountMapper.toEntity);
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.db.query.accountTable.findFirst({
      where: eq(accountTable.id, id),
    });

    if (!account) return null;

    return AccountMapper.toEntity(account);
  }
}
