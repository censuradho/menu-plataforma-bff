import { HttpException } from "@/domain/models/HttpException";
import { FileUploadService } from "@/services/FileUpload.service";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";
import { execPath } from "process";

export class ProductRepository {
  constructor (
    private prisma: PrismaClient,
    private fileUploadService: FileUploadService
  ) {}

  async validate (
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
      select: {
        id: true
      }
    })

    if (!groupExist) throw new HttpException(404, ERRORS.MENU_GROUP.NOT_FOUND)

    const menu = await this.prisma.menu.findFirst({
      where: {
        id: menuId,
        groupId
      },
      select: {
        id: true
      }
    })

    if (!menu) throw new HttpException(404, ERRORS.MENU.NOT_FOUND)

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        menuId
      },
      select: {
        id: true
      }
    })

    if (!product) throw new HttpException(404, ERRORS.PRODUCT.NOT_FOUND)
  }

  async delete (
    storeId: number,
    productId: number,
    menuId: number,
    groupId: number,
  ) {
    await this.validate(
      storeId,
      productId,
      menuId,
      groupId
    )

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        menuId
      }
    })

    if (!product) throw new HttpException(404, ERRORS.PRODUCT.NOT_FOUND)

    if (product.image) {
      await this.fileUploadService.removeFile(product.image)
    }
    
    await this.prisma.product.delete({
      where: {
        id: productId,
        menuId
      }
    })
  }

  async updateImage (
    storeId: number,
    productId: number,
    menuId: number,
    groupId: number,
    file: Express.Multer.File
  ) {
    await this.validate(
      storeId,
      productId,
      menuId,
      groupId,
    )

    const product = await this.prisma.product.findFirst({
      where: {
        menuId,
        id: productId
      }
    })

    if (product?.image) {
      await this.fileUploadService.removeFile(product.image)
    }

    await this.prisma.product.update({
      where: {
        menuId,
        id: productId
      },
      data: {
        image: file.path
      }
    })
  }
}