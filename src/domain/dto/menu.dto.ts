import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { CreateProductDTO } from "./product.dto";

export class CreateMenuDTO {
  @IsOptional()
  id?: number
  
  @IsString()
  label: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDTO)
  products: CreateProductDTO[]
}