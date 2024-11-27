import { IsDate, IsString } from "class-validator";

export class CreateEmailValidationTokenDTO {
  @IsString()
  userId: string

  @IsDate()
  expireAt: Date

  @IsString()
  code: string
}