import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, IsUrl, ValidateNested } from "class-validator";

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

class DeleteProductItemDTO {
  @IsNumber()
  @IsPositive()
  menuId: number

  @IsNumber()
  @IsPositive()
  groupId: number
}

export class DeleteProductDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeleteProductItemDTO)
  products: DeleteProductItemDTO[]
}