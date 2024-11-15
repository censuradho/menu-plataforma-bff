import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto";
import { MenuGrouWithMenuAndProducts } from "@/domain/entity/MenuGroup.entity";

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

  export const menuGroupWithMenuAndProductsMock: MenuGrouWithMenuAndProducts = {
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
        products: [
          {
            id: 1,
            image: null,
            label: 'label',
            limitAge: true,
            menuId: 1,
            value: '100',
            visible: true
          }
        ]
      }
    ],
  }