import { IsEmail, IsString, MinLength } from "class-validator"

export class CreateStoreUserDTO {
  @IsString()
  firstName: string
  @IsString()
  lastName: string
  @IsString()
  phone: string
  @IsString()
  @IsEmail()
  email: string
  @IsString()
  @MinLength(10)
  password: string
}