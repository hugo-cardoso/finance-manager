import type { Uuid } from "../../../shared/domain/value-objects/Uuid.js";

type TransactionCategoryProps = {
  id: Uuid;
  name: string;
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

  setName(name: string) {
    this.props.name = name;
  }
}
