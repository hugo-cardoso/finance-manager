import { Category } from "@src/modules/categories/entities/category.entity";
import { format } from "date-fns";

type TransactionProps = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  recurrence: "single" | "installment" | "recurrence";
  installment?: {
    id: string;
    number: number;
    total: number;
  };
  status: "active" | "deleted";
  recurrenceId?: string;
  category: Category;
};

export class Transaction {
  private constructor(private props: TransactionProps) {}

  static create(props: TransactionProps) {
    return new Transaction(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get amount() {
    return this.props.amount;
  }

  get date() {
    return this.props.date;
  }

  get recurrence() {
    return this.props.recurrence;
  }

  get installment() {
    return this.props.installment;
  }

  get status() {
    return this.props.status;
  }

  get recurrenceId() {
    return this.props.recurrenceId;
  }

  get category() {
    return this.props.category;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      date: format(this.date, "yyyy-MM-dd"),
      recurrence: this.recurrence,
      installment: this.installment,
      category: this.category.toJSON(),
    };
  }
}
