import type { Bill } from "../../../domain/bill/entities/Bill.js";
import type { IBillRepository } from "../../../domain/bill/repositories/iBillRepository.js";
import { Transaction } from "../../../domain/transaction/entities/Transaction.js";
import type { ITransactionRepository } from "../../../domain/transaction/repositories/ITransactionRepository.js";
import { Uuid } from "../../../shared/domain/value-objects/Uuid.js";

type GetMonthTransactionsDTO = {
  month: number;
  year: number;
};

export class GetMonthTransactions {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly billRepository: IBillRepository,
  ) {}

  async execute(data: GetMonthTransactionsDTO): Promise<Transaction[]> {
    const [transactions, bills] = await Promise.all([
      this.transactionRepository.findByMonthAndYear(data.month, data.year),
      this.billRepository.findByMonthAndYear(data.month, data.year),
    ]);

    const billsToCreate = this.getBillsToCreate(bills, transactions);

    const newTransactions = billsToCreate.map((bill) => {
      const date = new Date(data.year, data.month - 1, bill.dayOfMonth + 1);

      return Transaction.create({
        id: Uuid.generate(),
        name: bill.name,
        description: bill.description,
        category: bill.category,
        amount: bill.amount,
        date: date,
        bill,
        recurrence: "recurring",
      });
    });

    if (newTransactions.length > 0) {
      await this.transactionRepository.createMany(newTransactions);
    }

    const allTransactions = await this.transactionRepository.findByMonthAndYear(data.month, data.year);

    return allTransactions;
  }

  private getBillsToCreate(bills: Bill[], transactions: Transaction[]) {
    const existingBillIds = new Set(transactions.filter((t) => t.bill).map((t) => t.bill!.id.value));

    return bills.filter((bill) => !existingBillIds.has(bill.id.value));
  }
}
