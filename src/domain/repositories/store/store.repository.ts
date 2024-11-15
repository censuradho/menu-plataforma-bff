import { CreateStoreDTO } from "@/domain/dto/store.dto";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";

export class StoreRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async create (ownerId: string, payload: CreateStoreDTO) {
    const alreadyHaveStore= await this.prisma.store.findFirst({
      where: {
        ownerId
      }
    })

    if (alreadyHaveStore) throw new HttpException(401, ERRORS.STORE.PROVIDED_OWNER_ID_ALREADY_HAVE_STORE)

    await this.prisma.store.create({
      data: {
        cuisineType: payload.cuisineType,
        document: payload.document,
        documentType: payload.documentType,
        establishmentTime: payload.establishmentTime,
        name: payload.name,
        revenueEstimate: payload.revenueEstimate,
        numberOfEmployees: payload.numberOfEmployees,
        ownerId,
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
}