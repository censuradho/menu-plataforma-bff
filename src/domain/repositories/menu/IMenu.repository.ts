import { FindManyMenuQueryDTO } from "@/domain/dto/menu.dto";
import { MenuWithProductsEntity } from "@/domain/entity/Menu.entity";
import { MenuListPaginateModel } from "@/domain/models/MenuListPaginateModel";
import { Paginate } from "@/domain/models/Paginate.model";

export interface IMenuRepository {
  findById(storeId: number, menuId: number): Promise<MenuWithProductsEntity | null>
  findManyPaginated(
    storeId: number, 
    query: FindManyMenuQueryDTO
  ): Promise<Paginate<MenuListPaginateModel[]>>
}