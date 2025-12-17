import { Cache } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

type UserResponse = ReturnType<User["toJSON"]>;

@Injectable()
export class UserCacheService {
  constructor(private readonly cacheManager: Cache) {}

  private getUserCacheKey(userId: string) {
    return `users:${userId}`;
  }

  async getUser(userId: string) {
    return await this.cacheManager.get<UserResponse>(this.getUserCacheKey(userId));
  }

  async setUser(userId: string, user: UserResponse) {
    await this.cacheManager.set(this.getUserCacheKey(userId), user);
  }

  async deleteUser(userId: string) {
    await this.cacheManager.del(this.getUserCacheKey(userId));
  }
}
