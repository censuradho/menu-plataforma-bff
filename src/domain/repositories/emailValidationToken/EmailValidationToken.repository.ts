import { CreateEmailValidationTokenDTO } from '@/domain/dto/emailValidationToken.dto';
import { HttpException } from '@/domain/models/HttpException';
import { ERRORS } from '@/shared/errors';
import { PrismaClient } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns'

export class EmailValidationTokenRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async findFirst (code: string, userId: string) {
    return this.prisma.emailValidationToken.findFirst({
      where: {
        code,
        userId
      }
    })
  }

  async create (payload: CreateEmailValidationTokenDTO) {
    const alreadyExist = await this
      .findFirst(payload.code, payload.userId)

    if (alreadyExist && alreadyExist.expireAt) {
      // TODO: Regerar o token
    }

    if (alreadyExist && isBefore(new Date(), alreadyExist.expireAt))
  }

}