import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProductDTO {
  @IsString()
  label: string

  @IsString()
  value: string

  @IsOptional()
  @IsUrl()
  image?: string

  @IsOptional()
  @IsBoolean()
  visible: string

  @IsOptional()
  @IsBoolean()
  limitAge: string
}