import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

export class CreateMenuDTO {
  @IsString()
  label: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type
}