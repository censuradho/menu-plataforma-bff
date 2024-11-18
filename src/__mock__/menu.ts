import { MenuEntity, MenuWithProductsEntity, ProductEntity } from "@/domain/entity/Menu.entity";

export const menuEntityMock: MenuEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  hourFrom: 'hourFrom',
  hourTo: 'hourTo',
  id: 1,
  label: 'label',
  visible: true,
  storeId: 1,
}

export const productEntityMock: ProductEntity = {
  id: 1,
  image: null,
  label: 'label',
  limitAge: true,
  menuId: 1,
  value: '100',
  visible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const menuWithProductsMockEntity: MenuWithProductsEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  hourFrom: 'hourFrom',
  hourTo: 'hourTo',
  id: 1,
  label: 'label',
  visible: true,
  storeId: 1,
  products: [
    {
      id: 1,
      image: null,
      label: 'label',
      limitAge: true,
      menuId: 1,
      value: '100',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]
}