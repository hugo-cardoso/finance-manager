import { getApi } from "@/lib/api";

type UserResponse = {
  id: string;
  email: string;
  name: string;
};

type UpdateUserRequest = {
  firstName: string;
  lastName: string;
};

export class UserService {
  static async getUser() {
    const response = await getApi().get("users/me").json<UserResponse>();

    return response;
  }

  static async updateUser(data: UpdateUserRequest) {
    const response = await getApi().patch("users/me", { json: data }).json<UserResponse>();

    return response;
  }
}
