import { Menu, MenuGroup, Product } from '@prisma/client'

export type MenuEntity = Menu

export type ProductEntity = Product

export type MenuGroupEntity = MenuGroup

export type MenuGroupWithMenuEntity = MenuGroup & {
  menus: MenuEntity[]
}

type MenuWithProductsEntity  = MenuEntity & {
  products: ProductEntity[]
}

export type MenuGrouWithMenuAndProducts = MenuGroup & {
  menus: MenuWithProductsEntity[]
}