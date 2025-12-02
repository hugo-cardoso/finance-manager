import type { InferSelectModel } from "drizzle-orm";
import type { UserResponseDTO } from "../../../application/user/dto/UserResponseDTO.js";
import { User } from "../../../domain/user/entities/User.js";
import { Email } from "../../../domain/user/value-objects/Email.js";
import { Uuid } from "../../../shared/domain/value-objects/Uuid.js";
import type { userTable } from "../drizzle/schema/user.js";

type UserPersistence = InferSelectModel<typeof userTable>;

export class UserMapper {
  static toEntity(user: UserPersistence): User {
    return User.create({
      id: Uuid.create(user.id),
      email: Email.create(user.email),
      firstName: user.rawUserMetadata?.first_name ?? "",
      lastName: user.rawUserMetadata?.last_name ?? "",
    });
  }

  static toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id.value,
      email: user.email.value,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }
}
