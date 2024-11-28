import { CreateEmailValidationTokenDTO } from '@/domain/dto/emailValidationToken.dto';
import { EmailValidationTokenEntity } from '@/domain/entity/emailValidationToken.entity';
import { HttpException } from '@/domain/models/HttpException';
import { environment } from '@/shared/environment';
import { ERRORS } from '@/shared/errors';
import { PrismaClient } from '@prisma/client';
import { addMilliseconds, isBefore, } from 'date-fns';
import crypto from 'node:crypto';

export class EmailValidationTokenRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async findFirst (userId: string) {
    return this.prisma.emailValidationToken.findFirst({
      where: {
        userId
      }
    })
  }

  async regenerate (payload: EmailValidationTokenEntity, code: string) {
    const waitDate = addMilliseconds(payload.createdAt, environment.emailVerification.waitingTimeBeforeNew)

    if (isBefore(new Date(), waitDate))
      throw new HttpException(403, ERRORS.EMAIL_VERIFICATION_TOKEN.WAITING_UNTIL_YOU_CAN_RESEND)

    const reachMAxAttempts = payload.attempts >= environment.emailVerification.maxAttempts

    const time = addMilliseconds(payload.createdAt, environment.emailVerification.penaltyTime)

    if (reachMAxAttempts && isBefore(new Date(), time))
      throw new HttpException(403, ERRORS.EMAIL_VERIFICATION_TOKEN.LIMIT_MAX_ATTEMPTS_REACHED)

    await this.destroy(payload.id)

    return await this.prisma.emailValidationToken.create({
      data: {
        code,
        attempts: reachMAxAttempts ? 0 : payload.attempts + 1,
        userId: payload.userId,
        expireAt: addMilliseconds(new Date(), environment.emailVerification.waitingTimeBeforeNew)
      }
    })
  }

  async generate (payload: CreateEmailValidationTokenDTO) {
    const alreadyExist = await this
      .findFirst(payload.userId)

    const code = crypto.randomBytes(32).toString('hex');

    if (alreadyExist) return this.regenerate(alreadyExist, code)

    return await this.prisma.emailValidationToken.create({
      data: {
        code,
        userId: payload.userId,
        expireAt: addMilliseconds(new Date(), environment.emailVerification.waitingTimeBeforeNew)
      }
    })
  }

  async destroy (id: number) {
    await this.prisma.emailValidationToken.delete({
      where: {
        id
      }
    })
  }
}