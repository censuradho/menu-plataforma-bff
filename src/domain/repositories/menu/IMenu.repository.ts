import { CreateMenuDTO, FindManyMenuQueryDTO } from "@/domain/dto/menu.dto";
import { MenuWithProductsEntity, ProductEntity } from "@/domain/entity/Menu.entity";
import { MenuListPaginateModel } from "@/domain/models/MenuListPaginateModel";
import { Paginate } from "@/domain/models/Paginate.model";
import { Menu } from "@prisma/client";

export interface IMenuRepository {
  findById(storeId: number, menuId: number): Promise<MenuWithProductsEntity | null>

  findManyPaginated(
    storeId: number, 
    query: FindManyMenuQueryDTO
  ): Promise<Paginate<MenuListPaginateModel[]>>

  upsert(storeId: number, payload: CreateMenuDTO): Promise<MenuWithProductsEntity>

  findMany(storeId: number): Promise<Menu[]>

  findManyPaginated(
    storeId: number, 
    query: FindManyMenuQueryDTO
  ): Promise<
    Paginate<
      Array<Menu & { _count: { products: number } }>
    >
  >

  findById(storeId: number, menuId: number): Promise<Menu>

  findProductById(
    storeId: number, 
    menuId: number, 
    productId: number
  ): Promise<ProductEntity>

  delete(
    storeId: number, 
    menuId: number
  ): Promise<void>
}