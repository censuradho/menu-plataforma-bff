import { beforeEach, expect, it, vi, describe } from "vitest";

import { Context, createMockContext, MockContext } from "@/__test__/setup";

import { MenuGroupRepository } from "./menuGroup.repository";
import { StoreRepository } from "@/domain/repositories/store/store.repository";
import { storeEntityMock } from "@/__mock__/store";
import { createMenuGroupDTOMock, menuGroupWithMenuAndProductsMock } from "@/__mock__/menuGroup";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";

vi.mock('@/domain/repositories/store/store.repository')

describe('MenuGroupRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: MenuGroupRepository

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    repository = new MenuGroupRepository(
      ctx.prisma
    )
  })

  describe('.upsert', () => {
    it('Should create or update if entity provide id', async () => {
      mock.prisma.menuGroup.upsert.mockResolvedValueOnce(menuGroupWithMenuAndProductsMock)

      const storeId = 1

      const result = await repository.upsert(storeId, createMenuGroupDTOMock)

      expect(result).toStrictEqual(menuGroupWithMenuAndProductsMock)
      expect(mock.prisma.menuGroup.upsert).toHaveBeenCalledWith({
        where: {
          storeId,
          id: 0,
        },
        update: expect.any(Object),
        create: expect.any(Object),
        include: {
          menus: {
            include: {
              products: true,
            },
          },
        },
      })
    })
  })

  describe('.findMany', () => {
    it ('Should return many menuGroup results by storeId', async () => {
      mock.prisma.menuGroup.findMany.mockResolvedValueOnce([ menuGroupWithMenuAndProductsMock ])

      const storeId = 1

      const result = await repository.findMany(storeId)

      expect(result).toStrictEqual(result)
      expect(mock.prisma.menuGroup.findMany).toHaveBeenCalledWith({
        where: {
          storeId
        },
        include: {
          menus: {
            include: {
              products: true
            }
          }
        }
      })
    })
  })
})