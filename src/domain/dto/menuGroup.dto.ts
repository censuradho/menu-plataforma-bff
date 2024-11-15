import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateMenuDTO } from "./menu.dto";
import { Type } from "class-transformer";

export class CreateMenuGroupDTO {
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
  @Type(() => CreateMenuDTO)
  menus: CreateMenuDTO[]
}