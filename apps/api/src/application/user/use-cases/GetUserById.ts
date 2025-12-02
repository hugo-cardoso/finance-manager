import type { User } from "../../../domain/user/entities/User.js";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository.js";

export class GetUserById {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
