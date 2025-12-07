import type { Account } from "@domain/account/entities/Account.js";
import type { IAccountRepository } from "@domain/account/repositories/IAccountRepository.js";

export class GetAccountById {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(id: string): Promise<Account> {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }
}
