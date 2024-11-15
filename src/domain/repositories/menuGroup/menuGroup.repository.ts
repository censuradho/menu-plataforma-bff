import { StoreRepository } from '@/domain/repositories/store/store.repository';
import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto";
import { PrismaClient } from "@prisma/client";
import { HttpException } from '@/domain/models/HttpException';
import { ERRORS } from '@/shared/errors';

export class MenuGroupRepository {
  constructor (
    private prisma: PrismaClient,
    private storeRepository: StoreRepository
  ) {}

  async create (
    userId: string,
    payload: CreateMenuGroupDTO
  ) {

    const store = await this.storeRepository.findStoreByOwnerId(userId)

    if (!store) throw new HttpException(404, ERRORS.STORE.NOT_FOUND)

    const menuGroup =  await this.prisma.menuGroup.create({
      data: {
        label: payload.label,
        hourFrom: payload.hourFrom,
        hourTo: payload.hourTo,
        visible: payload.visible,
        storeId: store.id,
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
}