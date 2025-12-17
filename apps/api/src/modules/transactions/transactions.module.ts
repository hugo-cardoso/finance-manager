import { Module } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { CategoriesModule } from "../categories/categories.module";
import { TransactionMapper } from "./mapper/transaction.mapper";
import { TransactionsCacheService } from "./transactions.cache.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
  controllers: [TransactionsController],
  providers: [PrismaService, TransactionsService, TransactionMapper, TransactionsCacheService],
  imports: [CategoriesModule],
})
export class TransactionsModule {}
