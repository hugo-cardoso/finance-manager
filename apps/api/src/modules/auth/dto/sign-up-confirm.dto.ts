import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SignUpConfirmDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  token: string;
}
