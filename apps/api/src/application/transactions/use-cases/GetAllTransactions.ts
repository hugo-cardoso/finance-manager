import type { Transaction } from "../../../domain/transaction/entities/Transaction.js";
import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";

export class GetAllTransactions {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }
}
