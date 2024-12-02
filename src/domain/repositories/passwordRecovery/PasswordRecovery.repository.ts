import { randomUUID } from "crypto"

import { CreatePasswordRecoveryDTO } from "@/domain/dto/passwordREcovery.dto";
import { PasswordRecoveryEntity } from "@/domain/entity/passwordRecovery.entity";
import { HttpException } from "@/domain/models/HttpException";
import { environment } from "@/shared/environment";
import { ERRORS } from "@/shared/errors";
import { PrismaClient } from "@prisma/client";
import { addMilliseconds, isBefore } from "date-fns";
import { StoreUserRepository } from "../storeUser/User.repository";
import { MailchimpTransactionalService } from "@/services/MailchimpTransactional.service";
import { StoreUserEntity } from "@/domain/entity/StoreUser.entity";
import { resolvePath } from "@/shared/utils/resolvePath";

export class PasswordRecoveryRepository {
  constructor (
    private prisma: PrismaClient,
    private userRepository: StoreUserRepository,
    private mailchimpTransactionalService: MailchimpTransactionalService
  ) {}

  private async sendEmail (entity: StoreUserEntity, code: string) {
    const urlWithCOde = `${environment.urls.menuUiUrl}${resolvePath(environment.urls.emailConfirmationEndpoint, { token: code })}`

    await this.mailchimpTransactionalService.sendTemplate({
      template_name: 'email-confirmation',
      template_content: [],
      message: {
        subject: "Confirme seu Email",
        from_email: environment.mailchimp.norepleyEmail,
        from_name: 'Menu',
        important: true,
        to: [
          {
            email: entity.email,
            type: 'to'
          }
        ],
        global_merge_vars: [
          {
            content: `${entity.firstName} ${entity.lastName}`,
            name: 'name'
          },
          {
            content: urlWithCOde,
            name: 'confirmLink'
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
        expireAt: addMilliseconds(new Date(), environment.passwordRecovery.waitingTimeBeforeNew)
      }
    })

    await this.sendEmail(userEntity, code)
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
        expireAt: addMilliseconds(new Date(), environment.passwordRecovery.waitingTimeBeforeNew),
        userId: user.id
      }
    })

    await this.sendEmail(user, randomDigits)
  }

  async destroy (id: string) {
    await this.prisma.passwordRecovery.delete({
      where: {
        id
      }
    })
  }
}