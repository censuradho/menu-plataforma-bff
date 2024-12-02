import { randomUUID } from "crypto";

import { ChangePasswordDTO, CreatePasswordRecoveryDTO } from "@/domain/dto/passwordRecovery.dto";
import { PasswordRecoveryEntity } from "@/domain/entity/passwordRecovery.entity";
import { StoreUserEntity } from "@/domain/entity/StoreUser.entity";
import { HttpException } from "@/domain/models/HttpException";
import { MailchimpTransactionalService } from "@/services/MailchimpTransactional.service";
import { environment } from "@/shared/environment";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";
import { addMilliseconds, isBefore } from "date-fns";
import { StoreUserRepository } from "../storeUser/User.repository";

export class PasswordRecoveryRepository {
  constructor (
    private prisma: PrismaClient,
    private userRepository: StoreUserRepository,
    private mailchimpTransactionalService: MailchimpTransactionalService
  ) {}

  private async sendEmail (email: string, code: string) {
    await this.mailchimpTransactionalService.sendTemplate({
      template_name: 'recupera-o-de-senha',
      template_content: [],
      message: {
        subject: "Hora de recuperar sua senha",
        from_email: environment.mailchimp.norepleyEmail,
        from_name: 'Menu',
        important: true,
        to: [
          {
            email,
            type: 'to'
          }
        ],
        global_merge_vars: [
          {
            content: code,
            name: 'code'
          }
        ]
      }
    })
  }
  private async regenerate (payload: PasswordRecoveryEntity, userEntity: StoreUserEntity, code: string) {
    const waitDate = addMilliseconds(payload.createdAt, environment.passwordRecovery.waitingTimeBeforeNew)

    if (isBefore(new Date(), waitDate))
      throw new HttpException(403, ERRORS.PASSWORD_RECOVERY.WAITING_UNTIL_YOU_CAN_RESEND)

    const reachMAxAttempts = payload.attempts >= environment.passwordRecovery.maxAttempts

    const time = addMilliseconds(payload.createdAt, environment.passwordRecovery.penaltyTime)

    if (reachMAxAttempts && isBefore(new Date(), time))
      throw new HttpException(403, ERRORS.PASSWORD_RECOVERY.LIMIT_MAX_ATTEMPTS_REACHED)

    await this.destroy(payload.id)

    await this.prisma.passwordRecovery.create({
      data: {
        id: randomUUID(),
        code,
        attempts: reachMAxAttempts ? 0 : payload.attempts + 1,
        userId: payload.userId,
        expireAt: addMilliseconds(new Date(), environment.passwordRecovery.expireAt)
      }
    })

    await this.sendEmail(userEntity.email, code)
  }

  async generate (payload: CreatePasswordRecoveryDTO) {
    const { email } = payload

    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new HttpException(404, ERRORS.STORE_USER.NOT_FOUND)

    const recovery = await this.prisma.passwordRecovery.findFirst({
      where: {
        userId: user.id
      }
    })

    const randomDigits = String(Math.floor(1000 + Math.random() * 9000)) // generate 4 numeric digits

    if (recovery) return this.regenerate(recovery, user, randomDigits)

    await this.prisma.passwordRecovery.create({
      data: {
        id: randomUUID(),
        code: String(randomDigits),
        expireAt: addMilliseconds(new Date(), environment.passwordRecovery.expireAt),
        userId: user.id
      }
    })

    await this.sendEmail(user.email, randomDigits)
  }

  async expireAtValidation (code: string) {
    const exist = await this
      .prisma.passwordRecovery.findFirst({
        where: {
          code
        }
      })

    if (!exist) throw new HttpException(404, ERRORS.PASSWORD_RECOVERY.NOT_FOUND)

    if (isBefore(exist.expireAt, new Date())) throw new HttpException(403, ERRORS.PASSWORD_RECOVERY.EXPIRED)

    return exist
  }

  async changePassword (payload: ChangePasswordDTO) {
    const code = await this.expireAtValidation(payload.code)

    await this.userRepository.changePassword(code.userId, payload.password)

    await this.destroy(code.id)
  }

  async destroy (id: string) {
    await this.prisma.passwordRecovery.delete({
      where: {
        id
      }
    })
  }
}