import { api } from "@/lib/api";

type UserResponse = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export class UserService {
  static async getUser() {
    const response = await api.get<UserResponse>("user/me");
    return response.json();
  }
}
