import { DeleteManyProductsDTO } from "@/domain/dto/product.dto";
import { HttpException } from "@/domain/models/HttpException";
import { CloudflareR2Service } from "@/services/CloudflareR2.service";
import { environment } from "@/shared/environment";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";

export class ProductRepository {
  constructor (
    private prisma: PrismaClient,
    private cloudflareR2Service: CloudflareR2Service
  ) {}
  async find (
    storeId: number,
    productId: number,
    menuId: number
  ) {
    const store  = await this.prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        menus: {
          where: {
            id: menuId
          },
          select: {
            products: {
              where: {
                id: productId
              },
            }
          }
        }
      }
    })

    const product = store?.menus[0].products[0]

    return product
  }

  async delete (
    storeId: number,
    productId: number,
    menuId: number,
  ) {
    const product = await this.find(
      storeId,
      productId,
      menuId,
    )

    if (!product) throw new HttpException(404, ERRORS.PRODUCT.NOT_FOUND)

    if (product.image) {
      await this.deleteFile(product.image, product.assetId!!)
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

    const product = await this.find(
      storeId,
      productId,
      menuId
    )

    if (product?.image) {
      await this.deleteFile(product.image, product.assetId!!)
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

  async deleteFile (url: string, assetId: number) {
    const filePath = url
    .split(environment.cloudFlare.r2.publicAccessUrl)[1]
    .replace('/', '')

    await this.cloudflareR2Service.deleteFile(filePath)

    await this.prisma.asset.delete({
      where: {
        id: assetId!!
      }
    })
  }
}