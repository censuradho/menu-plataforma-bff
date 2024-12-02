import { IsEmail, IsString, MinLength } from "class-validator";

export class CreatePasswordRecoveryDTO {
  @IsEmail()
  email: string
}

export class ChangePasswordDTO {
  @IsString()
  code: string

  
  @IsString()
  @MinLength(10)
  password: string
}