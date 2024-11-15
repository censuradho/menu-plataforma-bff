import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto";

export const createMenuGroupDTOMock: CreateMenuGroupDTO = {
  hourFrom: '',
  hourTo: '',
  label: '',
  visible: true,
  menus: [
    {
      label: 'menu',
      products: [
        {
          label: 'product',
          limitAge: true,
          value: '100',
          visible: true,
        }
      ]
    }
  ]
}