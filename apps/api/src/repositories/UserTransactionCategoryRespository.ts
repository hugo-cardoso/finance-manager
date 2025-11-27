import { and, asc, eq, inArray, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import { transactionCategoryTable } from "../db/schema/index.js";
import { NotFoundError } from "../errors/NotFoundError.js";

type CreateTransactionCategory = {
  name: string;
};

type UpdateTransactionCategory = {
  name: string;
};

export class UserTransactionCategoryRespository {
  constructor(private readonly userId: string) {}

  async create(data: CreateTransactionCategory) {
    try {
      const category = await db
        .insert(transactionCategoryTable)
        .values({ ...data, userId: this.userId })
        .returning()
        .then(([category]) => category);

      return category;
    } catch (_) {
      throw new Error("Can't create user transaction category");
    }
  }

  async findById(id: string) {
    try {
      const category = await db
        .select()
        .from(transactionCategoryTable)
        .where(and(eq(transactionCategoryTable.userId, this.userId), eq(transactionCategoryTable.id, id)))
        .limit(1);

      if (category.length === 0) {
        throw new NotFoundError(`Transaction category with id ${id} not found`);
      }

      return category[0];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new Error(`Can't get user transaction category with id ${id}`);
    }
  }

  async findByIds(ids: string[]) {
    try {
      const categories = await db
        .select()
        .from(transactionCategoryTable)
        .where(and(eq(transactionCategoryTable.userId, this.userId), inArray(transactionCategoryTable.id, ids)));

      return categories;
    } catch (_) {
      throw new Error(`Can't get user transaction categories with ids ${ids.join(", ")}`);
    }
  }

  async findAll() {
    try {
      const categories = await db
        .select()
        .from(transactionCategoryTable)
        .orderBy(asc(transactionCategoryTable.name))
        .where(eq(transactionCategoryTable.userId, this.userId));

      return categories;
    } catch (_) {
      throw new Error("Can't get user transaction categories");
    }
  }

  async update(id: string, data: UpdateTransactionCategory) {
    try {
      const category = await db
        .update(transactionCategoryTable)
        .set({ name: data.name, updatedAt: sql`now()` })
        .where(and(eq(transactionCategoryTable.userId, this.userId), eq(transactionCategoryTable.id, id)))
        .returning()
        .then(([category]) => category);

      return category;
    } catch (_) {
      throw new Error(`Can't update user transaction category with id ${id}`);
    }
  }

  async delete(id: string) {
    try {
      await db
        .delete(transactionCategoryTable)
        .where(and(eq(transactionCategoryTable.userId, this.userId), eq(transactionCategoryTable.id, id)));
    } catch (_) {
      throw new Error(`Can't delete user transaction category with id ${id}`);
    }
  }
}
