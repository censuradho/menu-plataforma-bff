import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto";
import { MenuEntity, MenuGroupEntity, MenuGrouWithMenuAndProductsEntity, ProductEntity } from "@/domain/entity/MenuGroup.entity";

  export const createMenuGroupDTOMock: CreateMenuGroupDTO = {
    "hourFrom": "",
    "hourTo": "",
    "label": "",
    "visible": true,
    "menus": [
      {
        "label": "menu",
        "products": [
          {
            "label": "product",
            "limitAge": true,
            "value": "100",
            "visible": true,
          }
        ]
      }
    ]
  }

  export const menuGroupEntityMock: MenuGroupEntity = {
    createdAt: new Date(),
    updatedAt: new Date(),
    hourFrom: 'hourFrom',
    hourTo: 'hourTo',
    id: 1,
    label: 'label',
    visible: true,
    storeId: 1,
  }

  export const menuEntityMock: MenuEntity = {
    groupId: 1,
    id: 1,
    label: '',
    createdAt: new Date(),
    updatedAt: new Date(),
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

  export const menuGroupWithMenuAndProductsMock: MenuGrouWithMenuAndProductsEntity = {
    createdAt: new Date(),
    updatedAt: new Date(),
    hourFrom: 'hourFrom',
    hourTo: 'hourTo',
    id: 1,
    label: 'label',
    visible: true,
    storeId: 1,
    menus: [
      {
        groupId: 1,
        id: 1,
        label: '',
        createdAt: new Date(),
        updatedAt: new Date(),
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
    ],
  }