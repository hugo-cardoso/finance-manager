import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignUpConfirmDto } from "./dto/sign-up-confirm.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("refresh-token")
  refreshToken(@Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post("sign-up")
  signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("sign-up/confirm")
  signUpConfirm(@Body(new ValidationPipe()) signUpConfirmDto: SignUpConfirmDto) {
    return this.authService.signUpConfirm(signUpConfirmDto);
  }
}
