import { getApi } from "@/lib/api";

type SignInResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export class AuthService {
  static async signIn(email: string, password: string) {
    const data = await getApi()
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

  static async refreshToken(refreshToken: string) {
    const data = await getApi()
      .post("auth/refresh", {
        json: {
          refresh_token: refreshToken,
        },
        context: {
          auth: false,
        },
      })
      .json<SignInResponse>();

    return data;
  }
}
