import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { CreateProductDTO } from "./product.dto";

export class CreateMenuDTO {
  @IsString()
  label: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDTO)
  products: CreateProductDTO[]
}