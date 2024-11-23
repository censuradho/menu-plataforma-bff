import { MenuEntity } from "../entity/Menu.entity";

export interface MenuListPaginateModel extends MenuEntity {
  _count: {
    products: number
  }
}