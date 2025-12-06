import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";

type DeleteTransactionDTO = {
  id: string;
  behavior: "one" | "all" | "nexts";
};

export class DeleteTransaction {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(data: DeleteTransactionDTO): Promise<void> {
    const transaction = await this.transactionRepository.findById(data.id);
    const hasGroup = transaction?.groupId !== undefined;
    const hasBill = transaction?.bill !== undefined;

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (data.behavior === "one" && (!hasGroup || !hasBill)) {
      await this.transactionRepository.delete(data.id);
      return;
    }

    if (data.behavior === "all") {
      if (hasGroup) {
        await this.transactionRepository.deleteByGroupId(transaction.groupId!.value);
      }
      if (hasBill) {
        await this.transactionRepository.deleteByBillId(transaction.bill!.id.value);
      }
      return;
    }

    const refDate = transaction.date;
    const transactions = await this.transactionRepository.findAll();

    const nextTransactions = transactions.filter((t) => t.date > refDate);

    await this.transactionRepository.delete(data.id);

    for (const nextTransaction of nextTransactions) {
      await this.transactionRepository.delete(nextTransaction.id.value);
    }
  }
}
