import { MailchimpTransactionalService } from './../../../../services/MailchimpTransactional.service';
import { EmailValidationTokenRepository } from './../../emailValidationToken/EmailValidationToken.repository';
import { compare } from 'bcrypt';

import { IsValidEmailDTO, SignInWithEmailAndPasswordDTO } from '@/domain/dto/authStoreuser.dto';
import { CreateStoreUserDTO } from '@/domain/dto/StoreUser.dto';
import { StoreUserEntity } from '@/domain/entity/StoreUser.entity';
import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { StoreUserRepository } from '@/domain/repositories/storeUser/User.repository';
import { StoreUserModel } from '@/domain/models/StoreUserModel';
import { StoreRepository } from '@/domain/repositories/store/store.repository';


import { ERRORS } from '@/shared/errors';
import { Jwt } from '@/shared/jwt';

import { IAuthStoreUserRepository } from './IAuthStoreUser.repository';
import { randomUUID } from 'crypto';
import { CreateEmailValidationTokenByEmailDTO, CreateEmailValidationTokenDTO } from '@/domain/dto/emailValidationToken.dto';
import { environment } from '@/shared/environment';
import { resolvePath } from '@/shared/utils/resolvePath';

export class AuthStoreUserRepository implements IAuthStoreUserRepository {
  constructor (
    private storeUserRepository: StoreUserRepository,
    private storeRepository: StoreRepository,
    private emailValidationTokenRepository: EmailValidationTokenRepository,
    private mailchimpTransactionalService: MailchimpTransactionalService
  ) {}

  private async sendEmailConfirmationToken (code: string, entity: StoreUserEntity) {
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

  private generateJWT (user: StoreUserEntity, storeId?: number) {

    const jwtPayload = new JWTPayload(
      user.id,
      storeId,
    )

    const token = Jwt.generateAccessToken(
      jwtPayload,
      {
        jwtid: randomUUID(),
      }
    )

    return token
  }
  
  private async generateAndSendEmailValidation (user?: StoreUserEntity | null) {
    if (!user) throw new HttpException(404, ERRORS.STORE_USER.NOT_FOUND)
    if (user.isVerified) throw new HttpException(401, ERRORS.EMAIL_VERIFICATION_TOKEN.ACCOUNT_ALREADY_VERIFIED)

    const token = await this.emailValidationTokenRepository.generate({
      userId: user.id
    })
    await this.sendEmailConfirmationToken(token.code, user)

    return token
  }

  async signUpWithEmailAndPassword(payload: CreateStoreUserDTO) {
    const entity = await this.storeUserRepository.create(payload)

    const token = await this.emailValidationTokenRepository.generate({
      userId: entity.id
    })

    await this.sendEmailConfirmationToken(token.code, entity)

    return this.generateJWT(entity)
  }

  async isValidEmail (payload: IsValidEmailDTO) {
    const entity = await this.storeUserRepository.findByEmail(payload.email)

    if (entity) throw new HttpException(400, ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER)

    return true
  }
  
  async signInWithEmailAndPassword (payload: SignInWithEmailAndPasswordDTO) {
    const entity = await this.storeUserRepository.findByEmail(payload.email)

    if (!entity) throw new HttpException(401, ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD)

    const isPasswordMatched = await compare(payload.password, entity.password)

    if (!isPasswordMatched) throw new HttpException(401, ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD)

    const store = await this.storeRepository.findStoreIdByOwnerId(entity.id)

    return {
      token: this.generateJWT(entity, store?.id),
      user: new StoreUserModel(entity)
    }
  }

  async me(id: string) {
    const entity = await this.storeUserRepository.findById(id)

    if (!entity) return null

    return new StoreUserModel(entity)
  }

  async resendEmailValidation (payload: CreateEmailValidationTokenDTO) {
    const user = await this.storeUserRepository.findById(payload.userId)

    const token = await this.generateAndSendEmailValidation(user)

    await this.sendEmailConfirmationToken(token.code, user!!)
  }

  async resendEmailValidationByEmail (payload: CreateEmailValidationTokenByEmailDTO) {
    const user = await this.storeUserRepository.findByEmail(payload.email)

    const token = await this.generateAndSendEmailValidation(user)

    await this.sendEmailConfirmationToken(token.code, user!!)
  }

  async validateEmailByToken (token: string) {
    const emailValidationTokenEntity = await this.emailValidationTokenRepository.expireAtValidation(token)
    
    await this.emailValidationTokenRepository.destroy(emailValidationTokenEntity.id)
    await this.storeUserRepository.markAsEmailVerified(emailValidationTokenEntity.userId)

    const user  = await this.storeUserRepository.findById(emailValidationTokenEntity.userId)
    const store = await this.storeRepository.findStoreIdByOwnerId(user!!.id)

    return this.generateJWT(user!!, store?.id)
  }
}