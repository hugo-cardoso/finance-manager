import crypto from "node:crypto";
import z from "zod";

export class Uuid {
  private constructor(private _value: string) {}

  static create(value: string) {
    const parsed = z.uuid().safeParse(value);

    if (!parsed.success) {
      throw new Error("Invalid UUID");
    }

    return new Uuid(value);
  }

  get value() {
    return this._value;
  }

  static generate() {
    return Uuid.create(crypto.randomUUID());
  }
}
