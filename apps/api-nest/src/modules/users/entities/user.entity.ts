type UserProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps) {
    return new User(props);
  }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get name() {
    return `${this.props.firstName} ${this.props.lastName}`.trim();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }
}
