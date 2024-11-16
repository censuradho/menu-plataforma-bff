import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";

export class ProductRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async delete (
    storeId: number,
    productId: number,
    menuId: number,
    groupId: number,
  ) {
    const groupExist = await this.prisma.menuGroup.findFirst({
      where: {
        storeId,
        id: groupId
      },
    })

    if (!groupExist) throw new HttpException(404, ERRORS.MENU_GROUP.NOT_FOUND)

    const menu = await this.prisma.menu.findFirst({
      where: {
        id: menuId,
        groupId
      }
    })

    if (!menu) throw new HttpException(404, ERRORS.MENU.NOT_FOUND)

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        menuId
      }
    })

    if (!product) throw new HttpException(404, ERRORS.PRODUCT.NOT_FOUND)

    await this.prisma.product.delete({
      where: {
        id: productId,
        menuId
      }
    })
  }
}