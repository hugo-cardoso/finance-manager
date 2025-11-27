import { api } from "@/lib/api";

type MonthReportRequest = {
  month: number;
  year: number;
};

type MonthReportResponse = {
  income: number;
  expenses: number;
  balance: number;
};

export class TransactionReportService {
  static async getMonthReport(options: MonthReportRequest) {
    const response = await api.get<MonthReportResponse>("transactions/reports/monthly", {
      searchParams: {
        month: options.month,
        year: options.year,
      },
    });

    return response.json();
  }
}
