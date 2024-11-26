import { DeleteManyProductsDTO } from "@/domain/dto/product.dto";
import { MenuEntity, MenuWithProductsEntity, ProductEntity } from "@/domain/entity/Menu.entity";

export const menuEntityMock: MenuEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
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
  description: '',
  visible: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const menuWithProductsMockEntity: MenuWithProductsEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  id: 1,
  label: 'label',
  visible: true,
  storeId: 1,
  products: [
    {
      description: '',
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

export const deleteManyProductsPayloadMock: DeleteManyProductsDTO = {
  products: [
    {
      menuId: 1,
      productId: 2
    },
    {
      menuId: 3,
      productId: 4
    }
  ]
}