import type { Account } from "#domain/account/entities/Account.js";

export interface IAccountRepository {
  findAll(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
}
