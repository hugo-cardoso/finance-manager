import type { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { TransactionType } from "../enums/TransactionType.js";

type TransactionCategoryProps = {
  id: Uuid;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
};

export class TransactionCategory {
  private constructor(private props: TransactionCategoryProps) {}

  static create(props: TransactionCategoryProps) {
    return new TransactionCategory(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get icon() {
    return this.props.icon;
  }

  get color() {
    return this.props.color;
  }

  get type() {
    return this.props.type;
  }

  setName(name: string) {
    this.props.name = name;
  }
}
