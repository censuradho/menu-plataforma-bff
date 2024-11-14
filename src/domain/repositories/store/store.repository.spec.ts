import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { beforeEach, describe, it } from "vitest";
import { StoreRepository } from "./store.repository";

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
      
    })
  })
})