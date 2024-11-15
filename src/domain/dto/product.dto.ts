import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProductDTO {
  @IsOptional()
  id?: number
  
  @IsString()
  label: string

  @IsString()
  value: string

  @IsOptional()
  @IsBoolean()
  visible: boolean

  @IsOptional()
  @IsBoolean()
  limitAge: boolean
}