import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthUserId } from "@src/common/decorator/auth-user-id.decorator";
import { JwtAuthGuard } from "@src/modules/auth/guards/jwt-auth.guard";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto, @AuthUserId() userId: string) {
    const transaction = await this.transactionsService.create(userId, createTransactionDto);

    return transaction.toJSON();
  }

  @Get()
  async findAll(@AuthUserId() userId: string, @Query("month") month: number, @Query("year") year: number) {
    const transactions = await this.transactionsService.findAllByUserId(userId, month, year);

    return transactions.map((transaction) => transaction.toJSON());
  }

  @Get(":id")
  async findOne(@AuthUserId() userId: string, @Param("id") id: string) {
    const transaction = await this.transactionsService.findOneByUserId(userId, id);

    return transaction.toJSON();
  }

  @Delete(":id")
  async delete(@AuthUserId() userId: string, @Param("id") id: string) {
    await this.transactionsService.delete(userId, id);

    return { message: "Transaction deleted successfully" };
  }
}
