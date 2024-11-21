import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { CreateProductDTO } from "./product.dto";

export class CreateMenuDTO {
  @IsOptional()
  id?: number
  
  @IsString()
  label: string

  @IsOptional()
  @IsBoolean()
  visible?: boolean

  @IsString()
  hourFrom: string

  @IsString()
  hourTo: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDTO)
  products: CreateProductDTO[]
}
