import { IsEmail, IsString, MinLength } from "class-validator";

export class IsValidEmailDTO {
  @IsEmail()
  email: string
}

export class SignInWithEmailAndPasswordDTO {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(10)
  password: string
}