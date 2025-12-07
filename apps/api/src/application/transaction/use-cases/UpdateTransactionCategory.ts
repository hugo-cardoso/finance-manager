import type { TransactionCategory } from "@domain/transaction/entities/TransactionCategory.js";
import type { ITransactionCategoryRepository } from "@domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { UpdateTransactionCategoryDTO } from "../dto/UpdateTransactionCategoryDTO.js";

export class UpdateTransactionCategory {
  constructor(private readonly transactionCategoryRepository: ITransactionCategoryRepository) {}

  async execute(id: string, data: UpdateTransactionCategoryDTO): Promise<TransactionCategory> {
    const category = await this.transactionCategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    if (data.name) {
      category.setName(data.name);
    }

    return this.transactionCategoryRepository.update(category);
  }
}
