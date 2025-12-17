import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthUserId } from "@src/common/decorator/auth-user-id.decorator";
import { JwtAuthGuard } from "@src/modules/auth/guards/jwt-auth.guard";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionsCacheService } from "./transactions.cache.service";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionsCacheService: TransactionsCacheService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto, @AuthUserId() userId: string) {
    const transaction = await this.transactionsService.create(userId, createTransactionDto);

    await this.transactionsCacheService.deleteTransactions(userId);

    return transaction.toJSON();
  }

  @Get()
  async findAll(@AuthUserId() userId: string, @Query("month") month: number, @Query("year") year: number) {
    const cachedTransactions = await this.transactionsCacheService.getTransactions(userId, month, year);

    if (cachedTransactions) {
      return cachedTransactions;
    }

    const transactions = await this.transactionsService.findAllByUserId(userId, month, year);

    const response = transactions.map((transaction) => transaction.toJSON());

    await this.transactionsCacheService.setTransactions(userId, month, year, response);

    return response;
  }

  @Get(":id")
  async findOne(@AuthUserId() userId: string, @Param("id") id: string) {
    const cachedTransaction = await this.transactionsCacheService.getTransaction(userId, id);

    if (cachedTransaction) {
      return cachedTransaction;
    }

    const transaction = await this.transactionsService.findOneByUserId(userId, id);

    const response = transaction.toJSON();

    await this.transactionsCacheService.setTransaction(userId, response);

    return response;
  }

  @Delete(":id")
  async delete(@AuthUserId() userId: string, @Param("id") id: string) {
    await this.transactionsService.delete(userId, id);

    await this.transactionsCacheService.deleteTransactions(userId);
    await this.transactionsCacheService.deleteTransaction(userId, id);

    return { message: "Transaction deleted successfully" };
  }
}
