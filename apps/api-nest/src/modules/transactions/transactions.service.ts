import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { DateUtils } from "@src/common/utils/DateUtils";
import { CategoriesService } from "@src/modules/categories/categories.service";
import { addMonths } from "date-fns";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionMapper } from "./mapper/transaction.mapper";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const category = await this.categoriesService.findOne(createTransactionDto.category_id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (createTransactionDto.recurrence === "installment") {
      if (!createTransactionDto.installments) {
        throw new BadRequestException("Installments are required for installment recurrence");
      }

      const installmentAmount = createTransactionDto.amount / createTransactionDto.installments;
      const installmentId = crypto.randomUUID();

      const transactions = await this.prisma.transaction.createManyAndReturn({
        data: new Array(createTransactionDto.installments).fill(true).map((_, i) => {
          const date = addMonths(DateUtils.fromDateString(createTransactionDto.date), i);

          return {
            name: createTransactionDto.name,
            amount: installmentAmount,
            categoryId: category.id,
            date: date,
            recurrenceType: "installment",
            status: "active",
            installmentId,
            installmentNumber: i + 1,
            installmentTotal: createTransactionDto.installments,
            userId,
          };
        }),
      });

      const firstTransaction = transactions[0];

      return this.transactionMapper.toEntity(firstTransaction, category);
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        name: createTransactionDto.name,
        amount: createTransactionDto.amount,
        categoryId: category.id,
        date: DateUtils.fromDateString(createTransactionDto.date),
        recurrenceType: createTransactionDto.recurrence,
        status: "active",
        userId,
      },
    });

    return this.transactionMapper.toEntity(transaction, category);
  }

  async findAllByUserId(userId: string, month: number, year: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0),
        },
        status: "active",
      },
    });

    const categoriesIds = new Set(transactions.map((transaction) => transaction.categoryId));
    const categories = await this.categoriesService.findManyById([...categoriesIds]);
    const categoryMap = new Map(categories.map((category) => [category.id, category]));

    return transactions.map((transaction) => {
      return this.transactionMapper.toEntity(transaction, categoryMap.get(transaction.categoryId)!);
    });
  }

  async findOneByUserId(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    const category = await this.categoriesService.findOne(transaction.categoryId);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return this.transactionMapper.toEntity(transaction, category);
  }

  async delete(userId: string, id: string) {
    const transaction = await this.findOneByUserId(userId, id);

    if (transaction.recurrence === "installment") {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          installmentId: transaction.installment?.id,
          date: {
            gte: transaction.date,
          },
        },
      });

      await this.prisma.transaction.deleteMany({
        where: {
          id: {
            in: transactions.map((transaction) => transaction.id),
          },
        },
      });
      return;
    }

    await this.prisma.transaction.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
