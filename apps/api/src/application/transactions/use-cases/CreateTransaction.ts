import { Transaction } from "../../../domain/transaction/entities/Transaction.js";
import type { TransactionRecurrence } from "../../../domain/transaction/enums/TransactionRecurrence.js";
import type { TransactionType } from "../../../domain/transaction/enums/TransactionType.js";
import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";
import { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { CreateTransactionDTO } from "../dto/CreateTransactionDTO.js";

export class CreateTransaction {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
  ) {}

  async execute(data: CreateTransactionDTO): Promise<Transaction> {
    const category = await this.transactionCategoryRepository.findById(data.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    const transaction = Transaction.create({
      id: Uuid.generate(),
      groupId: Uuid.generate(),
      name: data.name,
      category: category,
      type: data.type as TransactionType,
      amount: data.amount,
      recurrence: data.recurrence as TransactionRecurrence,
      date: data.date,
    });

    return this.transactionRepository.create(transaction);
  }
}
