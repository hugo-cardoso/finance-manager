import type { Transaction } from "@domain/transaction/entities/Transaction.js";
import type { ITransactionRepository } from "@domain/transaction/repositories/ITransactionRepository.js";

export class GetTransactionById {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }
}
