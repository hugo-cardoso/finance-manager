import { TransactionCategory } from "../../../domain/transaction/entities/TransactionCategory.js";
import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";
import { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { CreateTransactionCategoryDTO } from "../dto/CreateTransactionCategoryDTO.js";

export class CreateTransactionCategory {
  constructor(private readonly transactionCategoryRepository: ITransactionCategoryRepository) {}

  async execute(data: CreateTransactionCategoryDTO): Promise<TransactionCategory> {
    const category = TransactionCategory.create({
      id: Uuid.generate(),
      name: data.name,
    });

    return this.transactionCategoryRepository.create(category);
  }
}
