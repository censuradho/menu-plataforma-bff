import sharp from 'sharp'

import { DeleteManyProductsDTO } from "@/domain/dto/product.dto";
import { HttpException } from "@/domain/models/HttpException";
import { CloudflareR2Service } from "@/services/CloudflareR2.service";
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
    const products = await Promise.all(
        payload.products.map(value => this.find(
          storeId,
          value.productId,
          value.menuId,
        )
      )
    )

    const productsWithImage = products.filter(value => !!value?.image)

    const requestToDeleteAssets = productsWithImage.map( value =>
      this.deleteFile(
        value!!.image!!,
        value?.assetId!!
      )
    )
    
    const requestsToDeleteProducts = payload.products.map(product => 
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

    await Promise.all([
      ...requestsToDeleteProducts,
      ...requestToDeleteAssets
    ])
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

    const optimizedImage = await sharp(file.buffer)
      .jpeg({ mozjpeg: true })
      .resize({
        width: 500,
        height: 500,
        fit: 'cover',
        position: 'center'
      })
      .toBuffer()
      

    const uploadedFile = await this.cloudflareR2Service.uploadFile(
      optimizedImage,
      file.originalname,
      file.mimetype,
      'products'
    )

    const asset = await this.prisma.asset.create({
      data: {
        path: uploadedFile.fileName,
        size: file.size,
      }
    })

    await this.prisma.product.update({
      where: {
        menuId,
        id: productId
      },
      data: {
        image: uploadedFile.fileName,
        assetId: asset.id
      }
    })
  }

  async deleteFile (fileName: string, assetId: number) {
    await this.cloudflareR2Service.deleteByKey(fileName)

    await this.prisma.asset.delete({
      where: {
        id: assetId!!
      }
    })
  }
}