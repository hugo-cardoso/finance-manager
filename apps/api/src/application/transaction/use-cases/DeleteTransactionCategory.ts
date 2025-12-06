import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";
import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";

export class DeleteTransactionCategory {
  constructor(
    private readonly transactionCategoryRepository: ITransactionCategoryRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const transactions = await this.transactionRepository.findByCategoryId(id);

    if (transactions.length > 0) {
      throw new Error("Category has transactions");
    }

    await this.transactionCategoryRepository.delete(id);
  }
}
