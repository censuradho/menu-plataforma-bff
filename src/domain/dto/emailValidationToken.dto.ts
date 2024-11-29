import { IsDate, IsString } from "class-validator";

export class CreateEmailValidationTokenDTO {
  @IsString()
  userId: string
}


export class CreateEmailValidationTokenByEmailDTO {
  @IsString()
  email: string
}