import { Menu, Product } from '@prisma/client'

export type MenuEntity = Menu

export type ProductEntity = Product

export type MenuWithProductsEntity  = MenuEntity & {
  products: ProductEntity[]
}