import { eq } from "drizzle-orm";

import type { User } from "../../../domain/user/entities/User.js";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository.js";
import type { DrizzleDB } from "../drizzle/db.js";
import { userTable } from "../drizzle/schema/user.js";
import { UserMapper } from "../mappers/UserMapper.js";

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: DrizzleDB) {}

  async findAll(): Promise<User[]> {
    const users = await this.db.query.userTable.findMany();

    return users.map(UserMapper.toEntity);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.query.userTable.findFirst({
      where: eq(userTable.id, id),
    });

    if (!user) return null;

    return UserMapper.toEntity(user);
  }
}
