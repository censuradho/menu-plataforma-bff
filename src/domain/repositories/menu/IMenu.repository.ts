import { MenuWithProductsEntity } from "@/domain/entity/Menu.entity";

export interface IMenuRepository {
  findById(storeId: number, menuId: number): Promise<MenuWithProductsEntity | null>
}