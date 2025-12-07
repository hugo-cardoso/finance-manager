import type { TransactionCategory } from "@domain/transaction/entities/TransactionCategory.js";
import type { ITransactionCategoryRepository } from "@domain/transaction/repositories/ITransactionCategoryRepository.js";

export class GetTransactionCategoryById {
  constructor(private readonly transactionCategoryRepository: ITransactionCategoryRepository) {}

  async execute(id: string): Promise<TransactionCategory> {
    const category = await this.transactionCategoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }
}
