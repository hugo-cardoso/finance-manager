import KeyvRedis from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheableMemory } from "cacheable";
import { Keyv } from "keyv";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        if (process.env.NODE_ENV === "production") {
          return {
            stores: [new KeyvRedis(process.env.REDIS_URL!)],
          };
        }

        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 0 }),
            }),
          ],
        };
      },
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
