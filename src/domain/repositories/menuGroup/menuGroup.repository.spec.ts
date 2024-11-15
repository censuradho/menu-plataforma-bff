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
  let storeRepository: StoreRepository

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    storeRepository = new StoreRepository(ctx.prisma)
    repository = new MenuGroupRepository(
      ctx.prisma,
      storeRepository
    )
  })

  describe('.create', () => {
    it ('Should throw an exception if store not found by logged user id', async () => {
      vi.mocked(storeRepository.findStoreByOwnerId).mockResolvedValue(null)
      const  userId = 'userId'

      const request = repository.create(userId, createMenuGroupDTOMock)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 404,
          message: ERRORS.STORE.NOT_FOUND
        })
      )
      expect(storeRepository.findStoreByOwnerId).toHaveBeenCalledWith(userId)
    })

    it ('Should create menu group', async () => {
      vi.mocked(storeRepository.findStoreByOwnerId).mockResolvedValue(storeEntityMock)
      mock.prisma.menuGroup.create.mockResolvedValue(menuGroupWithMenuAndProductsMock)

      const  userId = 'userId'

      const payload = await repository.create(userId, createMenuGroupDTOMock)

      expect(payload).toStrictEqual(menuGroupWithMenuAndProductsMock)
      expect(storeRepository.findStoreByOwnerId).toHaveBeenCalledWith(userId)
      expect(mock.prisma.menuGroup.create).toHaveBeenLastCalledWith({
        data: {
          label: createMenuGroupDTOMock.label,
          hourFrom: createMenuGroupDTOMock.hourFrom,
          hourTo: createMenuGroupDTOMock.hourTo,
          visible: createMenuGroupDTOMock.visible,
          storeId: expect.any(Number),
          menus: {
            create: createMenuGroupDTOMock.menus.map(menu => ({
              label: menu.label,
              products: {
                create: menu.products.map(product => ({
                  label: product.label,
                  limitAge: product.limitAge,
                  value: product.value,
                  visible: product.visible,
                }))
              }
            }))
          }
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