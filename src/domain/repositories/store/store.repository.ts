import { CreateStoreDTO } from "@/domain/dto/store.dto";
import { HttpException } from "@/domain/models/HttpException";
import { CloudflareR2Service } from "@/services/CloudflareR2.service";
import { environment } from "@/shared/environment";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

export class StoreRepository {
  constructor (
    private prisma: PrismaClient,
    private cloudflareR2Service: CloudflareR2Service
  ) {}

  async findStoreByOwnerId (id: string) {
    return this.prisma.store.findFirst({
      where: {
        ownerId: id,
      }
    })
  }

  async findStoreIdByOwnerId (id: string) {
    return this.prisma.store.findFirst({
      where: {
        ownerId: id,
      },
      select: {
        id: true,
      }
    })
  }

  async create (ownerId: string, payload: CreateStoreDTO) {
    const alreadyHaveStore= await this.prisma.store.findFirst({
      where: {
        ownerId
      }
    })

    if (alreadyHaveStore) throw new HttpException(401, ERRORS.STORE.PROVIDED_OWNER_ID_ALREADY_HAVE_STORE)

    return await this.prisma.store.create({
      data: {
        cuisineType: payload.cuisineType,
        document: payload.document,
        documentType: payload.documentType,
        establishmentTime: payload.establishmentTime,
        name: payload.name,
        revenueEstimate: payload.revenueEstimate,
        numberOfEmployees: payload.numberOfEmployees,
        ownerId,
        hourFrom: payload?.hourFrom,
        hourTo: payload?.hourTo,
        facebook: payload?.facebook,
        instagramUrl: payload?.instagramUrl,
        tikTokUrl: payload?.tikTokUrl,
        twitterUrl: payload?.twitterUrl,
      }
    })
  }

  async update (storeId: number, ownerId: string, payload: CreateStoreDTO) {
    const store= await this.prisma.store.findFirst({
      where: {
        ownerId,
        id: storeId
      }
    })

    if (!store) throw new HttpException(404, ERRORS.STORE.NOT_FOUND)

    await this.prisma.store.update({
      data: {
        ...payload,
        updatedAt: new Date()
      },
      where: {
        ownerId,
        id: storeId,
      },
    })
  }

  async logoUpload (
    id: number,
    file: Express.Multer.File
  ) {

    const store = await this.prisma.store.findFirst({
      where: {
        id
      }
    })

    if (!store) throw new HttpException(404, ERRORS.STORE.NOT_FOUND)

      const optimizedImage = await sharp(file.buffer)
        .jpeg({ mozjpeg: true })
        .resize({
          width: 100,
          height: 100,
          fit: 'cover',
          position: 'center'
        })
        .toBuffer()

    if (store?.logo) {
      await this.cloudflareR2Service.deleteByKey(store?.logo)

      await this.prisma.asset.delete({
        where: {
          id: store.logoId!!
        }
      })
    }

    const uploadedFile = await this.cloudflareR2Service.uploadFile(
      optimizedImage,
      file.originalname,
      file.mimetype,
      'store-avatar'
    )

    const asset = await this.prisma.asset.create({
      data: {
        path: uploadedFile.fileName,
        size: file.size,
      }
    })

    await this.prisma.store.update({
      where: {
        id
      },
      data: {
        logo: asset.path,
        logoId: asset.id
      }
    })

  }

  async findMany () {
    return await this.prisma.store.findMany({
      select: {
        id: true
      },
    })
  }
  async findStoreWithMenu (storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: Number(storeId)
      },
      select: {
        hourFrom: true,
        hourTo: true,
        logo: true,
        cuisineType: true,
        instagramUrl: true,
        facebook: true,
        name: true,
        tikTokUrl: true,
        twitterUrl: true,
        menus: {
          include: {
            products: true
          }
        }
      },
    })

    if (!store) throw new HttpException(404, ERRORS.STORE.NOT_FOUND)

    return store
  }
}