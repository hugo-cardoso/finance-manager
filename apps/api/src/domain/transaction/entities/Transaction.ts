import type { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { TransactionRecurrence } from "../enums/TransactionRecurrence.js";
import type { TransactionType } from "../enums/TransactionType.js";
import type { TransactionCategory } from "./TransactionCategory.js";

type TransactionProps = {
  id: Uuid;
  groupId: Uuid;
  name: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  recurrence: TransactionRecurrence;
  date: Date;
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

  get name() {
    return this.props.name;
  }

  get category() {
    return this.props.category;
  }

  get type() {
    return this.props.type;
  }

  get amount() {
    return this.props.amount;
  }

  get recurrence() {
    return this.props.recurrence;
  }

  get date() {
    return this.props.date;
  }
}
