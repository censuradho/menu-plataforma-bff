import { PrismaClient } from "@prisma/client";
import { IMenuRepository } from "./IMenu.repository";
import { CreateMenuDTO } from "@/domain/dto/menu.dto";

export class MenuRepository implements IMenuRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async upsert (
    storeId: number,
    payload: CreateMenuDTO
  ) {

    return await this.prisma.menu.upsert({
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
        products: {
          upsert: payload.products.map(product => ({
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
        hourFrom: payload.hourFrom,
        hourTo: payload.hourTo,
        label: payload.label,
        visible: payload.visible,
        storeId,
        products: {
          create: payload.products.map(product => ({
            label: product.label,
            limitAge: product.limitAge,
            value: product.value,
            visible: product.visible,
          }))
        }
      },
      include: {
        products: true
      }
    })
  }

  async findMany (storeId: number) {
    return this.prisma.menu.findMany({
      where: {
        storeId
      },
      include: {
        products: true
      }
    })
  }
}