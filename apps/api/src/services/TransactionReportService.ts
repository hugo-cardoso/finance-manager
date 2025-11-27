import { endOfMonth, startOfMonth } from "date-fns";

import { UserTransactionRespository } from "../repositories/UserTransactionRespository.js";

type MonthlyReport = {
  income: number;
  expenses: number;
  balance: number;
};

export class TransactionReportService {
  private readonly transactionRepository: UserTransactionRespository;

  constructor(userId: string) {
    this.transactionRepository = new UserTransactionRespository(userId);
  }

  async generateMonthlyReport(date: Date): Promise<MonthlyReport> {
    try {
      const { income, expenses } = await this.transactionRepository.getMonthlyTotals(
        startOfMonth(date),
        endOfMonth(date),
      );

      return {
        income,
        expenses,
        balance: income - expenses,
      };
    } catch (_) {
      throw new Error("Failed to generate monthly report");
    }
  }
}
