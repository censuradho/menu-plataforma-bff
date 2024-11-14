import { IsInt, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateStoreDTO {
  @IsString()
  name: string

  @IsString()
  document: string

  @IsString()
  documentType: string

  @IsString()
  cuisineType: string

  @IsString()
  establishmentTime: string

  @IsString()
  revenueEstimate: string

  @IsNumber()
  @IsInt()
  @IsPositive()
  numberOfEmployees: number
}