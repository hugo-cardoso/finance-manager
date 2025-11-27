import { api } from "@/lib/api";

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

type SignUpRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class AuthService {
  static async signIn(request: SignInRequest) {
    const response = await api.post<SignInResponse>("auth/sign-in", {
      json: {
        email: request.email,
        password: request.password,
      },
      context: {
        auth: false,
      },
    });

    return response.json();
  }

  static async signUp(request: SignUpRequest) {
    await api.post("auth/sign-up", {
      json: {
        first_name: request.firstName,
        last_name: request.lastName,
        email: request.email,
        password: request.password,
      },
      context: {
        auth: false,
      },
    });
  }

  static async confirmSignUp(token: string) {
    await api.post("auth/sign-up/confirm", {
      json: {
        token,
      },
      context: {
        auth: false,
      },
    });
  }

  static async refreshToken(refreshToken: string) {
    const response = await api.post<SignInResponse>("auth/refresh-token", {
      json: {
        refresh_token: refreshToken,
      },
      context: {
        auth: false,
      },
    });

    return response.json();
  }
}
