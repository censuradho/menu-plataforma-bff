import { MenuGrouWithMenuAndProductsEntity } from '@/domain/entity/MenuGroup.entity';
import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto";

export interface IMenuGroupRepository {
  upsert(storeId: number, payload: CreateMenuGroupDTO): Promise<MenuGrouWithMenuAndProductsEntity>
  findMany(storeId: number): Promise<MenuGrouWithMenuAndProductsEntity[]>
}