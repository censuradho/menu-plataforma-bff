import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Context, createMockContext, MockContext } from '@/__test__/setup'
import { StoreUserRepository } from './User.repository'
import { createStoreUserDTOPayloadMock, storeUserEntityMock } from '@/__mock__/storeUser'
import { HttpException } from '@/domain/models/HttpException'
import { ERRORS } from '@/shared/errors'

vi.mock('bcrypt')

describe('UserRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: StoreUserRepository

  
  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    repository = new StoreUserRepository(ctx.prisma)
  })


  describe('.findById', () => {
    it ('Should return store user by id', async () => {
      mock.prisma.storeUser.findFirst.mockResolvedValue(storeUserEntityMock)

      await repository.findById(storeUserEntityMock.id)

      expect(mock.prisma.storeUser.findFirst).toHaveBeenCalledWith({
        where: {
          id: storeUserEntityMock.id
        }
      })
    })
  })

  describe('.findByEmail', () => {
    it ('Should return store user by email', async () => {
      mock.prisma.storeUser.findFirst.mockResolvedValue(storeUserEntityMock)

      await repository.findByEmail(storeUserEntityMock.email)

      expect(mock.prisma.storeUser.findFirst).toHaveBeenCalledWith({
        where: {
          email: storeUserEntityMock.email
        }
      })
    })
  })

  describe('.create', () => {
    it ('Should throw an exception if already email related to a store user', async () => {
      mock.prisma.storeUser.findFirst.mockResolvedValue(storeUserEntityMock)

      const request = repository.create(createStoreUserDTOPayloadMock)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 400,
          message: ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER
        })
      )
    })

    it ('Should create a new store user', async () => {
      mock.prisma.storeUser.findFirst.mockResolvedValue(null)

      const passwordHashed = "hash"

      vi.mocked(bcrypt.hashSync).mockReturnValue(passwordHashed);

      await repository.create(createStoreUserDTOPayloadMock)
      
      expect(mock.prisma.storeUser.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          ...createStoreUserDTOPayloadMock,
          password: passwordHashed
        }
      })
      expect(bcrypt.hashSync).toHaveBeenCalledWith(createStoreUserDTOPayloadMock.password, 10);
    })
  })
})