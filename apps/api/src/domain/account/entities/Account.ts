import type { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { Email } from "../value-objects/Email.js";

type AccountProps = {
  id: Uuid;
  email: Email;
  firstName: string;
  lastName: string;
};

export class Account {
  private constructor(private props: AccountProps) {}

  static create(props: AccountProps) {
    return new Account(props);
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

  setFirstName(firstName: string) {
    this.props.firstName = firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  setLastName(lastName: string) {
    this.props.lastName = lastName;
  }

  get name() {
    return `${this.props.firstName} ${this.props.lastName}`.trim();
  }
}
