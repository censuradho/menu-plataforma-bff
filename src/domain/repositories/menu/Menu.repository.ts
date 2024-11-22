import { FindManyMenuQueryDTO } from './../../dto/menu.dto';
import { PrismaClient } from "@prisma/client";
import { IMenuRepository } from "./IMenu.repository";
import { CreateMenuDTO } from "@/domain/dto/menu.dto";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { Paginate } from '@/domain/models/Paginate.model';

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
              description: product?.description,
              label: product.label,
              limitAge: product.limitAge,
              value: product.value,
              visible: product.visible,
              updatedAt: new Date()
            },
            create: {
              label: product.label,
              description: product?.description,
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
            description: product?.description,
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
        storeId,
      },
      include: {
        products: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  async findManyPaginated (storeId: number, query: FindManyMenuQueryDTO) {
    const {
      page,
      size,
      label
    } = query

    const totalRecords = await this.prisma.menu.count({
      where: {
        storeId
      },
    });

    const _page = page || 1
    const _size = size || 10

    const skip = !label 
      ? (_page - 1) * _size 
      : 0

    const totalPages = Math.ceil(totalRecords / _size); 
    const currentPage = Math.max(1, Math.min(_page, totalPages));

    const data = await this.prisma.menu.findMany({
      where: {
        storeId,
        ...(label && ({
          label: {
            contains: label
          }
        }))
      },
      include: {
        products: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: _size,
      skip
    })

    return new Paginate(
      {
        totalRecords,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        size: _size
      },
      data,
    )
  }

  async findById(storeId: number, menuId: number) {
    const entity = await this.prisma.menu.findFirst({
      where: {
        storeId,
        id: menuId
      },
      include: {
        products: {
          orderBy: {
            updatedAt: 'desc'
          }
        }
      },
    })

    if (!entity) throw new HttpException(404, ERRORS.MENU.NOT_FOUND)

      return entity
  }

  async findProductById (storeId: number, menuId: number, productId: number) {
    const entity = await this.prisma.menu.findFirst({
      where: {
        storeId,
        id: menuId
      },
      select: {
        products: {
          where: {
            id: productId
          },
        }
      }
    })

    if (!entity) throw new HttpException(404, ERRORS.PRODUCT.NOT_FOUND)

    const [product] = entity.products

    return product
  }

  async delete (storeId: number, menuId: number) {
   
    await this.prisma.store.update({
      where: {
        id: storeId
      },
      data: {
        menus: {
          update: {
            where: {
              id: menuId
            },
            data: {
              products: {
                deleteMany: {}
              }
            }
          },
          delete: {
            id: menuId,
          }
        }
      }
    })
  }
}