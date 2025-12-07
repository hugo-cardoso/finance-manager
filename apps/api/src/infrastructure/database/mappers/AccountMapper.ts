import type { InferSelectModel } from "drizzle-orm";
import { Account } from "#domain/account/entities/Account.js";
import { Email } from "#domain/account/value-objects/Email.js";
import type { accountTable } from "#infrastructure/database/drizzle/schema/account.js";
import { Uuid } from "#shared/domain/value-objects/Uuid.js";

type AccountPersistence = InferSelectModel<typeof accountTable>;

export class AccountMapper {
  static toEntity(account: AccountPersistence): Account {
    return Account.create({
      id: Uuid.create(account.id),
      email: Email.create(account.email),
      firstName: account.first_name,
      lastName: account.last_name,
    });
  }

  static toResponseDTO(account: Account) {
    return {
      id: account.id.value,
      email: account.email.value,
      firstName: account.firstName,
      lastName: account.lastName,
    };
  }
}
