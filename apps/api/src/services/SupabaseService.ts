import ky from "ky";

import { supabase } from "../lib/supabase/index.js";

type SignUpOptions = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignInResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export class SupabaseService {
  private readonly authApi = ky.create({
    prefixUrl: new URL("/auth/v1", process.env.SUPABASE_URL as string).toString(),
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_ANON_KEY as string,
    },
  });

  async signIn(email: string, password: string): Promise<SignInResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at as number,
    };
  }

  async signUp(options: SignUpOptions) {
    const { error } = await supabase.auth.signUp({
      email: options.email,
      password: options.password,
      options: {
        data: {
          first_name: options.firstName,
          last_name: options.lastName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async verifyEmailOtp(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async resendEmailOtp(email: string) {
    const { error } = await supabase.auth.resend({
      email,
      type: "signup",
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async refreshToken(refreshToken: string): Promise<SignInResponse> {
    try {
      const response = await this.authApi
        .post<SignInResponse>("token", {
          searchParams: {
            grant_type: "refresh_token",
          },
          json: {
            refresh_token: refreshToken,
          },
        })
        .json();

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Internal Server Error");
    }
  }
}
