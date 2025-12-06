import { z } from "zod";

export class Email {
  private constructor(private _value: string) {}

  static create(value: string) {
    const parsed = z.email().safeParse(value);

    if (!parsed.success) {
      throw new Error("Invalid email");
    }

    return new Email(parsed.data);
  }

  get value() {
    return this._value;
  }
}
