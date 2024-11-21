import { Type } from "class-transformer";
import { 
  IsArray, 
  IsBoolean, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  IsUrl, 
  ValidateNested 
} from "class-validator";

export class CreateProductDTO {
  @IsOptional()
  id?: number
  
  @IsString()
  label: string
    
  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  value: string

  @IsOptional()
  @IsBoolean()
  visible: boolean

  @IsOptional()
  @IsBoolean()
  limitAge: boolean
}
export class DeleteProductDTO {
  @IsNumber()
  @IsPositive()
  menuId: number

  @IsNumber()
  @IsPositive()
  productId: number
}

export class DeleteManyProductsDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeleteProductDTO)
  products: DeleteProductDTO[]
}