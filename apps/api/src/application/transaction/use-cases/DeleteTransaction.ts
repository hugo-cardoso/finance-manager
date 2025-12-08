import type { Transaction } from "#domain/transaction/entities/Transaction.js";
import type { ITransactionRepository } from "#domain/transaction/repositories/ITransactionRepository.js";

type DeleteTransactionDTO = {
  id: string;
  behavior: "one" | "all" | "nexts";
};

export class DeleteTransaction {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(data: DeleteTransactionDTO): Promise<void> {
    const transaction = await this.transactionRepository.findById(data.id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    switch (data.behavior) {
      case "one":
        await this.deleteOneTransaction(transaction);
        break;
      case "all":
        await this.deleteAllTransactions(transaction);
        break;
      case "nexts":
        await this.deleteNextTransactions(transaction);
        break;
    }
  }

  private async deleteOneTransaction(transaction: Transaction) {
    await this.transactionRepository.delete(transaction.id.value);
  }

  private async deleteAllTransactions(transaction: Transaction) {
    const hasGroup = transaction?.groupId !== undefined;
    const hasBill = transaction?.bill !== undefined;

    if (!hasGroup && !hasBill) {
      throw new Error("Transaction has no group or bill");
    }

    if (hasGroup) {
      const groupTransactions = await this.transactionRepository.findByGroupId(transaction.groupId!.value);
      await this.transactionRepository.deleteMany(groupTransactions.map((t) => t.id.value));
    }

    if (hasBill) {
      const billTransactions = await this.transactionRepository.findByBillId(transaction.bill!.id.value);
      await this.transactionRepository.deleteMany(billTransactions.map((t) => t.id.value));
    }
  }

  private async deleteNextTransactions(transaction: Transaction) {
    const transactions = await this.transactionRepository.findByDateRange(transaction.date);

    await this.transactionRepository.deleteMany([transaction, ...transactions].map((t) => t.id.value));
  }
}
