import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import ky, { type KyInstance } from "ky";

import type { AuthOutput, IAuthService, SignUpInput } from "../../application/interfaces/IAuthService.js";

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export class SupabaseAuthService implements IAuthService {
  private readonly supabase: SupabaseClient;
  private readonly authApi: KyInstance;

  constructor(config: SupabaseConfig) {
    this.supabase = createClient(config.url, config.anonKey);
    this.authApi = ky.create({
      prefixUrl: new URL("/auth/v1", config.url).toString(),
      headers: {
        "Content-Type": "application/json",
        apikey: config.anonKey,
      },
    });
  }

  async signIn(email: string, password: string): Promise<AuthOutput> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
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

  async signUp(data: SignUpInput): Promise<void> {
    const { error } = await this.supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async verifyEmailOtp(email: string, token: string): Promise<void> {
    const { error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async resendEmailOtp(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resend({
      email,
      type: "signup",
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthOutput> {
    const data = await this.authApi
      .post<AuthOutput>("token", {
        searchParams: {
          grant_type: "refresh_token",
        },
        json: {
          refresh_token: refreshToken,
        },
      })
      .json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
  }
}
