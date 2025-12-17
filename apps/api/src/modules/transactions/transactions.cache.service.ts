import { Cache } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { Transaction } from "./entities/transaction.entity";

type TransactionResponse = ReturnType<Transaction["toJSON"]>;

@Injectable()
export class TransactionsCacheService {
  constructor(private readonly cacheManager: Cache) {}

  async getTransactions(userId: string, month: number, year: number) {
    const userCacheKey = `transactions:${userId}`;

    const cachedKeys =
      (await this.cacheManager.get<{ key: string; value: TransactionResponse[] }[]>(userCacheKey)) ?? [];
    const cachedKey = cachedKeys.find((key) => key.key === `${month}:${year}`);

    if (cachedKey) {
      return cachedKey.value;
    }

    return null;
  }

  async setTransactions(userId: string, month: number, year: number, transactions: TransactionResponse[]) {
    const userCacheKey = `transactions:${userId}`;

    const cachedKeys =
      (await this.cacheManager.get<{ key: string; value: TransactionResponse[] }[]>(userCacheKey)) ?? [];

    await this.cacheManager.set(
      userCacheKey,
      [...cachedKeys, { key: `${month}:${year}`, value: transactions }],
      60000 * 15,
    );
  }

  async deleteTransactions(userId: string) {
    const userCacheKey = `transactions:${userId}`;

    await this.cacheManager.del(userCacheKey);
  }

  async getTransaction(userId: string, transactionId: string) {
    const userCacheKey = `transaction:${userId}:${transactionId}`;

    return await this.cacheManager.get<TransactionResponse>(userCacheKey);
  }

  async setTransaction(userId: string, transaction: TransactionResponse) {
    const userCacheKey = `transaction:${userId}:${transaction.id}`;

    await this.cacheManager.set(userCacheKey, transaction, 60000 * 15);
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const userCacheKey = `transaction:${userId}:${transactionId}`;

    await this.cacheManager.del(userCacheKey);
  }
}
