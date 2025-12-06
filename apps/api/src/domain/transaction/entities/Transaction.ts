import type { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { Bill } from "../../bill/entities/Bill.js";
import type { TransactionCategory } from "./TransactionCategory.js";

type TransactionProps = {
  id: Uuid;
  groupId?: Uuid;
  name: string;
  description?: string;
  category: TransactionCategory;
  amount: number;
  date: Date;
  bill?: Bill;
  recurrence: "once" | "installment" | "recurring";
  installment?: {
    number: number;
    total: number;
  };
};

export class Transaction {
  private constructor(private props: TransactionProps) {}

  static create(props: TransactionProps) {
    return new Transaction(props);
  }

  get id() {
    return this.props.id;
  }

  get groupId() {
    return this.props.groupId;
  }

  get installment() {
    return this.props.installment;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get category() {
    return this.props.category;
  }

  get amount() {
    return this.props.amount;
  }

  get date() {
    return this.props.date;
  }

  get bill() {
    return this.props.bill;
  }

  get recurrence() {
    return this.props.recurrence;
  }
}
