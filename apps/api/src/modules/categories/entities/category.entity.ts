type CategoryProps = {
  id: string;
  name: string;
  icon: string;
  type: "expense" | "income";
};

export class Category {
  private constructor(private props: CategoryProps) {}

  static create(props: CategoryProps) {
    return new Category(props);
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

  get type() {
    return this.props.type;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      type: this.type,
    };
  }
}
