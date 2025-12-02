import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";

export class DeleteTransactionCategory {
  constructor(private readonly transactionCategoryRepository: ITransactionCategoryRepository) {}

  async execute(id: string): Promise<void> {
    await this.transactionCategoryRepository.delete(id);
  }
}
