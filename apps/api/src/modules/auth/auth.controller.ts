import { Body, Controller, Post, UseGuards, ValidationPipe } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("sign-in")
  signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("sign-up")
  async signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
  }

  @Post("refresh")
  refresh(@Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }
}
