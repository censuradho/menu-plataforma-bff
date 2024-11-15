import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto";
import { PrismaClient } from "@prisma/client";
import { IMenuGroupRepository } from "./IMenuGroup.repository";

export class MenuGroupRepository implements IMenuGroupRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async upsert (
    storeId: number,
    payload: CreateMenuGroupDTO
  ) {

    const menuGroup = await this.prisma.menuGroup.upsert({
      where: {
        storeId,
        id: payload?.id || 0
      },
      update: {
        hourFrom: payload.hourFrom,
        hourTo: payload.hourTo,
        label: payload.label,
        visible: payload.visible,
        updatedAt: new Date(),
        menus: {
          upsert: payload.menus.map(menu => ({
            where: {
              id: menu?.id || 0
            },
            update: {
              label: menu.label,
              updatedAt: new Date(),
              products: {
                upsert: menu.products.map(product => ({
                  where: {
                    id: product?.id || 0
                  },
                  update: {
                    label: product.label,
                    limitAge: product.limitAge,
                    value: product.value,
                    visible: product.visible,
                    updatedAt: new Date()
                  },
                  create: {
                    label: product.label,
                    limitAge: product.limitAge,
                    value: product.value,
                    visible: product.visible,
                  }
                }))
              },
            },
            create: {
              label: menu.label,
              products: {
                create: menu.products.map(product => ({
                  label: product.label,
                  limitAge: product.limitAge,
                  value: product.value,
                  visible: product.visible,
                }))
              }
            }
          }))
        }
      },
      create: {
        hourFrom: payload.hourFrom,
        hourTo: payload.hourTo,
        label: payload.label,
        visible: payload.visible,
        storeId,
        menus: {
          create: payload.menus.map(menu => ({
            label: menu.label,
            products: {
              create: menu.products.map(product => ({
                label: product.label,
                limitAge: product.limitAge,
                value: product.value,
                visible: product.visible,
              }))
            }
          }))
        }
      },
      include: {
        menus: {
          include: {
            products: true
          }
        }
      }
    })

    return menuGroup
  }

  async findMany (storeId: number) {
    return await this.prisma.menuGroup.findMany({
      where: {
        storeId
      },
      include: {
        menus: {
          include: {
            products: true
          }
        }
      }
    })
  }
}