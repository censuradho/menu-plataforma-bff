import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { StoreRepository } from "./store.repository";
import { createStoreDTOMock, storeEntityMock } from "@/__mock__/store";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";

describe('StoreRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: StoreRepository

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    repository = new StoreRepository(ctx.prisma)
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
})