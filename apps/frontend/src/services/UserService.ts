import { getApi } from "@/lib/api";

type UserResponse = {
  id: string;
  email: string;
  name: string;
};

export class UserService {
  static async getUser() {
    const response = await getApi().get("users/me").json<UserResponse>();

    return response;
  }
}
