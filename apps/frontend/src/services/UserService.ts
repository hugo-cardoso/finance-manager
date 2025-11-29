import { api } from "@/lib/api";

type UserResponse = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export class UserService {
  static async getUser() {
    const response = await api.get<UserResponse>("user/me");
    return response.json();
  }

  static async changePassword(request: ChangePasswordRequest) {
    await api.post("user/change-password", {
      json: {
        current_password: request.currentPassword,
        new_password: request.newPassword,
      },
    });
  }
}
