import { Inject, Injectable } from "@nestjs/common";
import { SUPABASE_CLIENT } from "@src/supabase/supabase.provider";
import { SupabaseClient } from "@supabase/supabase-js";
import type { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignUpConfirmDto } from "./dto/sign-up-confirm.dto";

@Injectable()
export class AuthService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async signIn(signInDto: SignInDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: signInDto.email,
      password: signInDto.password,
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

  async signUp(signUpDto: SignUpDto) {
    const { data: user } = await this.supabase.from("accounts").select("id").eq("email", signUpDto.email).single();

    if (user) {
      throw new Error("User already exists");
    }

    const { error } = await this.supabase.auth.signUp({
      email: signUpDto.email,
      password: signUpDto.password,
      options: {
        data: {
          first_name: signUpDto.first_name,
          last_name: signUpDto.last_name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async signUpConfirm(signUpConfirmDto: SignUpConfirmDto) {
    const { error } = await this.supabase.auth.verifyOtp({
      email: signUpConfirmDto.email,
      token: signUpConfirmDto.token,
      type: "signup",
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
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
}
