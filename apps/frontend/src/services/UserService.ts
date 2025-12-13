import { api } from "@/lib/api";

type UserResponse = {
  id: string;
  email: string;
  name: string;
};

export class UserService {
  static async getUser() {
    const response = await api.get<UserResponse>("users/me");
    return response.json();
  }
}
