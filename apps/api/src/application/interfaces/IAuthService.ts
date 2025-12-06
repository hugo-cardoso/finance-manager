export type AuthOutput = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

export type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthOutput>;
  signUp(data: SignUpInput): Promise<void>;
  verifyEmailOtp(email: string, token: string): Promise<void>;
}
