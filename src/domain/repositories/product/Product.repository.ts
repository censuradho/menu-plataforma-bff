import { DeleteManyProductsDTO } from "@/domain/dto/product.dto";
import { HttpException } from "@/domain/models/HttpException";
import { CloudflareR2Service } from "@/services/CloudflareR2.service";
import { FileUploadService } from "@/services/FileUpload.service";
import { environment } from "@/shared/environment";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";

export class ProductRepository {
  constructor (
    private prisma: PrismaClient,
    private fileUploadService: FileUploadService,
    private cloudflareR2Service: CloudflareR2Service
  ) {}

  async validate (
    storeId: number,
    productId: number,
    menuId: number
  ) {
 

    const menu = await this.prisma.menu.findFirst({
      where: {
        id: menuId,
        storeId
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
  ) {
    await this.validate(
      storeId,
      productId,
      menuId,
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

  async deleteMany (storeId: number, payload: DeleteManyProductsDTO) {
    const requests = payload.products.map(product => 
      this.prisma.store.update({
        where: {
          id: storeId,
        },
        data: {
          menus: {
            update: {
              where: {
                id: product.menuId
              },
              data: {
                products: {
                  delete: {
                    id: product.productId
                  }
                }
              }
            },
          }
        }
      })
    )

    await Promise.all(requests)
  }

  async updateImage (
    storeId: number,
    productId: number,
    menuId: number,
    file: Express.Multer.File
  ) {
    await this.validate(
      storeId,
      productId,
      menuId,
    )

    const product = await this.prisma.product.findFirst({
      where: {
        menuId,
        id: productId
      }
    })

    if (product?.image) {
      const filePath = product
        ?.image
        .split(environment.cloudFlare.r2.publicAccessUrl)[1]
        .replace('/', '')

      await this.cloudflareR2Service.deleteFile(filePath)

      await this.prisma.asset.delete({
        where: {
          id: product.assetId!!
        }
      })
    }

    const uploadedFile = await this.cloudflareR2Service.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      'products'
    )

    const asset = await this.prisma.asset.create({
      data: {
        path: uploadedFile.url,
        size: file.size,
      }
    })

    await this.prisma.product.update({
      where: {
        menuId,
        id: productId
      },
      data: {
        image: asset.path,
        assetId: asset.id
      }
    })
  }
}