import { api } from "@/lib/api";

type SignInResponse = {
  access_token: string;
  expires_at: number;
};

export class AuthService {
  static async signIn(email: string, password: string) {
    const data = await api
      .post("auth/sign-in", {
        json: {
          email,
          password,
        },
        context: {
          auth: false,
        },
      })
      .json<SignInResponse>();

    return data;
  }
}
