import { CloudflareR2Service } from '@/services/CloudflareR2.service';
import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { StoreRepository } from "./store.repository";
import { createStoreDTOMock, storeEntityMock } from "@/__mock__/store";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { FileUploadService } from "@/services/FileUpload.service";

describe('StoreRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: StoreRepository
  let cloudflareR2Service: CloudflareR2Service

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    cloudflareR2Service = new CloudflareR2Service()
    repository = new StoreRepository(ctx.prisma, cloudflareR2Service)
  })

  describe('.create', () => {
    it ('Should throw an exception if provided owner id already related to another store', async () => {
      mock.prisma.store.findFirst.mockResolvedValue(storeEntityMock)

      const ownerId = 'ownerId'

      const request = repository.create(ownerId, createStoreDTOMock)

      expect(mock.prisma.store.findFirst).toHaveBeenCalledWith({
        where: {
          ownerId
        }
      })

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 401,
          message: ERRORS.STORE.PROVIDED_OWNER_ID_ALREADY_HAVE_STORE
        })
      )
  
    })
  })

  describe('.update', () => {
    it ('Should throw an exception if store is not found by ownerId and storeId', async () => {
      mock.prisma.store.findFirst.mockResolvedValue(null)
      const ownerId = 'ownerId'


      const request = repository.update(storeEntityMock.id, ownerId, createStoreDTOMock)

      expect(mock.prisma.store.findFirst).toHaveBeenCalledWith({
        where: {
          ownerId,
          id: storeEntityMock.id
        }
      })

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 404,
          message: ERRORS.STORE.NOT_FOUND
        })
      )
    })

    it ('Should update store', async () => {
      mock.prisma.store.findFirst.mockResolvedValue(storeEntityMock)

      const ownerId = 'ownerId'

      await repository.update(storeEntityMock.id, ownerId, createStoreDTOMock)

      expect(mock.prisma.store.findFirst).toHaveBeenCalledWith({
        where: {
          ownerId,
          id: storeEntityMock.id
        }
      })

      expect(mock.prisma.store.update).toHaveBeenCalledWith({
        where: {
          ownerId,
          id: storeEntityMock.id
        },
        data: {
          ...createStoreDTOMock,
          updatedAt: expect.any(Date)
        }
      })
    })
  })

  describe('.findStoreByOwnerId', () => {
    it ('Should return store by owner id', async () => {
      mock.prisma.store.findFirst.mockResolvedValue(storeEntityMock)

      const store = await repository.findStoreByOwnerId(storeEntityMock.ownerId)

      expect(mock.prisma.store.findFirst).toHaveBeenLastCalledWith({
        where: {
          ownerId: storeEntityMock.ownerId
        }
      })
      expect(store).toStrictEqual(storeEntityMock)
    })

    it ('Should return null if not found store by owner id', async () => {
      mock.prisma.store.findFirst.mockResolvedValue(null)

      const store = await repository.findStoreByOwnerId(storeEntityMock.ownerId)

      expect(mock.prisma.store.findFirst).toHaveBeenLastCalledWith({
        where: {
          ownerId: storeEntityMock.ownerId
        }
      })

      expect(store).toBe(null)
    })
  })

  describe('.findStoreIdByOwnerId', () => {
    it ('Should return store id by owner id', async () => {

      mock.prisma.store.findFirst.mockResolvedValue({
        id: storeEntityMock.id
      } as any)

      const store = await repository.findStoreIdByOwnerId(storeEntityMock.ownerId)

      expect(mock.prisma.store.findFirst).toHaveBeenLastCalledWith({
        where: {
          ownerId: storeEntityMock.ownerId
        },
        select: {
          id: true
        }
      })
      expect(store).toStrictEqual({
        id: storeEntityMock.id
      })
    })

    it ('Should return null if not found store by owner id', async () => {
      mock.prisma.store.findFirst.mockResolvedValue(null)

      const store = await repository.findStoreIdByOwnerId(storeEntityMock.ownerId)

      expect(mock.prisma.store.findFirst).toHaveBeenLastCalledWith({
        where: {
          ownerId: storeEntityMock.ownerId
        },
        select: {
          id: true
        }
      })

      expect(store).toBe(null)
    })
  })
})