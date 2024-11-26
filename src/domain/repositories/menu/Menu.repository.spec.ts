import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { MenuRepository } from "./Menu.repository";
import { createMenuMockPayload, menuWithProductsMockEntity } from "@/__mock__/menu";

describe('MenuRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: MenuRepository

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context

    repository = new MenuRepository(
      ctx.prisma
    )
  })

  describe('.upsert', () => {
    it ('Should upsert menu entry', async () => {
      mock.prisma.menu.upsert.mockResolvedValue(menuWithProductsMockEntity)

      const storeId = 2

      await repository.upsert(storeId, createMenuMockPayload)
      
      expect(mock.prisma.menu.update).toHaveBeenCalledWith({
        where: {
          storeId,
          id: expect.any(Number)
        }
      })
    })
  })
})