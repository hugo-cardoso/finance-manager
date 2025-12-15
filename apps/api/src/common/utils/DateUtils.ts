import { TZDate } from "@date-fns/tz";

export class DateUtils {
  private static readonly TIMEZONE = "America/Sao_Paulo";

  static toLocalDate(date: Date): Date {
    const [year, month, day] = date.toISOString().split("T")[0].split("-");

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  static fromDateString(dateString: string): Date {
    const [year, month, day] = dateString.split("-");

    return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  }
}
