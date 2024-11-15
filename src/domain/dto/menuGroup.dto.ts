import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateMenuGroupDTO {
  @IsString()
  label: string

  @IsOptional()
  @IsBoolean()
  visible?: boolean

  @IsString()
  hourFrom: string

  @IsString()
  hourTo: string
}