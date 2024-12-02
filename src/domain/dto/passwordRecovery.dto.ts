import { IsEmail } from "class-validator";

export class CreatePasswordRecoveryDTO {
  @IsEmail()
  email: string
}