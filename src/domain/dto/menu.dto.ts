import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from 'class-transformer';
import { CreateProductDTO } from "./product.dto";

export class CreateMenuDTO {
  @IsOptional()
  id?: number
  
  @IsString()
  label: string

  @IsOptional()
  @IsBoolean()
  visible?: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDTO)
  products: CreateProductDTO[]
}


export class FindManyMenuQueryDTO {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  size?: number

  @IsOptional()
  @IsString()
  label?: string
}