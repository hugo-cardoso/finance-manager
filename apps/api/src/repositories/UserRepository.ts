import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { type RawUserMetadata, userTable } from "../db/schema/index.js";
import { NotFoundError } from "../errors/NotFoundError.js";

type UpdateUser = {
  firstName?: string;
  lastName?: string;
};

export class UserRepository {
  async findById(id: string) {
    try {
      const user = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);

      if (user.length === 0) {
        throw new NotFoundError(`User with id ${id} not found`);
      }

      return user[0];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      console.log(error);

      throw new Error(`Can't get user with id ${id}`);
    }
  }

  async update(id: string, data: UpdateUser) {
    try {
      const user = await this.findById(id);

      const rawUserMetadata: Partial<RawUserMetadata> = {};

      if (data.firstName) {
        rawUserMetadata.first_name = data.firstName;
      }

      if (data.lastName) {
        rawUserMetadata.last_name = data.lastName;
      }

      const updatedUser = await db
        .update(userTable)
        .set({
          rawUserMetadata: {
            ...(user.rawUserMetadata as RawUserMetadata),
            ...rawUserMetadata,
          },
        })
        .where(eq(userTable.id, id))
        .returning()
        .then(([user]) => user);

      return updatedUser;
    } catch (error) {
      console.log(error);

      throw new Error(`Can't update user with id ${id}`);
    }
  }
}
