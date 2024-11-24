import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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

  @IsString()
  numberOfEmployees: string
  
  @IsOptional()
  @IsString()
  hourFrom?: string
  
  @IsOptional()
  @IsString()
  hourTo?: string


  @IsOptional()
  @IsString()
  instagramUrl?: string

  @IsOptional()
  @IsString()
  facebookUrl?: string

  @IsOptional()
  @IsString()
  twitterUrl?: string

  @IsOptional()
  @IsString()
  tikTokUrl?: string
}