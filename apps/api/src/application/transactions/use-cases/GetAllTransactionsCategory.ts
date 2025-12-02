import type { TransactionCategory } from "../../../domain/transaction/entities/TransactionCategory.js";
import type { ITransactionCategoryRepository } from "../../../domain/transaction/repositories/ITransactionCategoryRepository.js";

export class GetAllTransactionsCategory {
  constructor(private readonly transactionCategoryRepository: ITransactionCategoryRepository) {}

  async execute(): Promise<TransactionCategory[]> {
    return this.transactionCategoryRepository.findAll();
  }
}
