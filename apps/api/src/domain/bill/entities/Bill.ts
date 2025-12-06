import type { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { TransactionCategory } from "../../transaction/entities/TransactionCategory.js";

type BillProps = {
  id: Uuid;
  name: string;
  isActive: boolean;
  description?: string;
  amount: number;
  dayOfMonth: number;
  category: TransactionCategory;
  startDate: Date;
  endDate?: Date;
};

export class Bill {
  private constructor(private props: BillProps) {}

  static create(props: BillProps) {
    return new Bill(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get isActive() {
    return this.props.isActive;
  }

  get description() {
    return this.props.description;
  }

  get amount() {
    return this.props.amount;
  }

  get dayOfMonth() {
    return this.props.dayOfMonth;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get category() {
    return this.props.category;
  }
}
