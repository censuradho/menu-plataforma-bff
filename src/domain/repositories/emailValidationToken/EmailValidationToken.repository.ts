import { CreateEmailValidationTokenDTO } from '@/domain/dto/emailValidationToken.dto';
import { HttpException } from '@/domain/models/HttpException';
import { environment } from '@/shared/environment';
import { ERRORS } from '@/shared/errors';
import { PrismaClient } from '@prisma/client';
import { isAfter, isBefore, addMilliseconds } from 'date-fns'

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

    const compareDate = addMilliseconds(new Date(), environment.emailVerification.waitingTimeBeforeNew)

    if (alreadyExist && isBefore(alreadyExist.createdAt, compareDate)) throw new HttpException(401, ERRORS.EMAIL_VERIFICATION_TOKEN.WAITING_UNTIL_YOU_CAN_RESEND)

    
    if (alreadyExist && isAfter(new Date(), alreadyExist.expireAt)) await this.destroy(alreadyExist.id)

    
  }

  async destroy (id: number) {
    await this.prisma.emailValidationToken.delete({
      where: {
        id
      }
    })
  }
}