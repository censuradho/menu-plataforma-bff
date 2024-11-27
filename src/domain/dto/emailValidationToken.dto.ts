import { IsDate, IsString } from "class-validator";

export class CreateEmailValidationTokenDTO {
  @IsString()
  userId: string
}