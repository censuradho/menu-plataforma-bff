import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthStoreUserRepository } from "./AuthStoreUser.repository";

import { StoreUserRepository } from "../../storeUser/User.repository";
import { createStoreUserDTOPayloadMock, storeUserEntity } from "@/__mock__/storeUser";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";

vi.mock('@/domain/repositories/storeUser/User.repository')

describe('AuthStoreUserRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: AuthStoreUserRepository
  let storeUserRepository: StoreUserRepository

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    console.log(ctx)
    storeUserRepository = new StoreUserRepository(ctx.prisma)
    repository = new AuthStoreUserRepository(storeUserRepository)
  })

  describe('.signUpWithEmailAndPassword', () => {
    it ('Should sign up with email and password', async () => {

      await repository.signUpWithEmailAndPassword(createStoreUserDTOPayloadMock)

      expect(storeUserRepository.create).toBeCalledWith(createStoreUserDTOPayloadMock)
    })
  })

  describe('.isValidEmail', () => {
    it ('Should throw an exception if email already register', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(storeUserEntity)

      const request = repository.isValidEmail(storeUserEntity)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 400,
          message: ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER
        })
      )
    })

    it ('Should return true if email is valid (not entity found with related e-mail', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(null)

      const isValid = await repository.isValidEmail(storeUserEntity)

      expect(isValid).toBe(true)
    })
  })
})