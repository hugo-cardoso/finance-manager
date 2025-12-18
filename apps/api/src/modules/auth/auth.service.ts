import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@src/common/database/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "../users/entities/user.entity";
import type { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private getAccessTokenExpiresAt() {
    return Math.floor(Date.now() / 1000) + 3600; // 1 hour
  }

  private getAccessToken(payload: { email: string; sub: string }) {
    return this.jwtService.sign(payload, { expiresIn: "1h" });
  }

  private getRefreshToken(payload: { email: string; sub: string }) {
    return this.jwtService.sign(payload, { expiresIn: "7d" });
  }

  private buildTokens(payload: { email: string; sub: string }) {
    return {
      access_token: this.getAccessToken(payload),
      refresh_token: this.getRefreshToken(payload),
      expires_at: this.getAccessTokenExpiresAt(),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return User.create({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload = { email: user.email, sub: user.id };
    return this.buildTokens(payload);
  }

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        password: hashedPassword,
        firstName: signUpDto.first_name,
        lastName: signUpDto.last_name,
      },
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ email: string; sub: string }>(refreshToken);

      return this.buildTokens({
        email: payload.email,
        sub: payload.sub,
      });
    } catch {
      throw new Error("Invalid refresh token");
    }
  }
}
