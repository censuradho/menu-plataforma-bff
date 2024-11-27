import { StoreRepository } from '@/domain/repositories/store/store.repository';
import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { describe, expect, it, vi, beforeEach, Mock } from "vitest";
import { AuthStoreUserRepository } from "./AuthStoreUser.repository";

import { StoreUserRepository } from "@/domain/repositories/storeUser/User.repository";
import { createStoreUserDTOPayloadMock, loginStoreUserDTOMock, storeUserEntityMock } from "@/__mock__/storeUser";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { StoreUserModel } from "@/domain/models/StoreUserModel";
import { storeEntityMock } from '@/__mock__/store';
import { FileUploadService } from '@/services/FileUpload.service';
import { CloudflareR2Service } from '@/services/CloudflareR2.service';

vi.mock('@/domain/repositories/storeUser/User.repository')
vi.mock('@/domain/repositories/store/store.repository')

describe('AuthStoreUserRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: AuthStoreUserRepository
  let storeUserRepository: StoreUserRepository
  let storeRepository: StoreRepository
  let cloudflareService: CloudflareR2Service

  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    storeUserRepository = new StoreUserRepository(ctx.prisma)
    cloudflareService = new CloudflareR2Service()

    storeRepository = new StoreRepository(ctx.prisma, cloudflareService)

    repository = new AuthStoreUserRepository(
      storeUserRepository,
      storeRepository
    )
  })

  describe('.signUpWithEmailAndPassword', () => {
    it ('Should sign up with email and password', async () => {
      vi.mocked(storeUserRepository.create).mockResolvedValue(
        storeUserEntityMock
      )

      await repository.signUpWithEmailAndPassword(createStoreUserDTOPayloadMock)

      expect(storeUserRepository.create).toBeCalledWith(createStoreUserDTOPayloadMock)
    })
  })

  describe('.signInWithEmailAndPassword', () => {
    it ('Should throw an exception if user is not found by email', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(null)

      const request = repository.signInWithEmailAndPassword(loginStoreUserDTOMock)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 401,
          message: ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD
        })
      )
    })

    it ('Should throw an exception if password not match with hash saved', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(storeUserEntityMock)

      const request = repository.signInWithEmailAndPassword({
        ...loginStoreUserDTOMock,
        password: '1234'
      })

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 401,
          message: ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD
        })
      )
    })

    it ('Should return a token if login is successful', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(storeUserEntityMock)

      const token = await repository.signInWithEmailAndPassword(loginStoreUserDTOMock)

      expect(storeRepository.findStoreIdByOwnerId).toHaveBeenCalledWith(storeUserEntityMock.id)
      expect(token).toBeTruthy()
    })
  })

  describe('.isValidEmail', () => {
    it ('Should throw an exception if email already register', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(storeUserEntityMock)

      const request = repository.isValidEmail(storeUserEntityMock)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 400,
          message: ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER
        })
      )
    })

    it ('Should return true if email is valid (not entity found with provided e-mail)', async () => {
      vi.mocked(storeUserRepository.findByEmail).mockResolvedValue(null)

      const isValid = await repository.isValidEmail(storeUserEntityMock)

      expect(isValid).toBe(true)
    })
  })

  describe ('.me', () => {
    it ('Should return StoreModel by id', async () => {
      vi.mocked(storeUserRepository.findById).mockResolvedValue(storeUserEntityMock)

      const me = await repository.me(storeUserEntityMock.id)

      expect(me).toStrictEqual(new StoreUserModel(storeUserEntityMock))
      expect(storeUserRepository.findById).toHaveBeenCalledWith(storeUserEntityMock.id)
    })

    it ('Should return null if not found StoreModel by id', async () => {
      vi.mocked(storeUserRepository.findById).mockResolvedValue(null)

      const me = await repository.me(storeUserEntityMock.id)

      expect(me).toBe(null)
      expect(storeUserRepository.findById).toHaveBeenCalledWith(storeUserEntityMock.id)
    })
  })
})