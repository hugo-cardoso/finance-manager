import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";

export class DeleteTransaction {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
