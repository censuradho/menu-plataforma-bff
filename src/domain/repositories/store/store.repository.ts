import { CreateStoreDTO } from "@/domain/dto/store.dto";
import { HttpException } from "@/domain/models/HttpException";
import { FileUploadService } from "@/services/FileUpload.service";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";

export class StoreRepository {
  constructor (
    private prisma: PrismaClient,
    private fileUploadService: FileUploadService
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
        id: true
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
        facebook: payload?.facebookUrl,
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

    if (store?.logo) {
      await this.fileUploadService.removeFile(store.logo)
    }

    await this.prisma.store.update({
      where: {
        id
      },
      data: {
        logo: file.filename
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