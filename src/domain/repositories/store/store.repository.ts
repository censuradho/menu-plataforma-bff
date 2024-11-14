import { CreateStoreDTO } from "@/domain/dto/store.dto";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

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
        id: randomUUID(),
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
}