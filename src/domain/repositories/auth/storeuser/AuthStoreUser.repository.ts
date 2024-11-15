import { IsValidEmailDTO, SignInWithEmailAndPasswordDTO } from '@/domain/dto/authStoreuser.dto';
import { CreateStoreUserDTO } from '@/domain/dto/StoreUser.dto';
import { StoreUserEntity } from '@/domain/entity/StoreUser.entity';
import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { StoreUserRepository } from '@/domain/repositories/storeUser/User.repository';
import { ERRORS } from '@/shared/errors';
import { Jwt } from '@/shared/jwt';
import { compare } from 'bcrypt';
import { IAuthStoreUserRepository } from './IAuthStoreUser.repository';
import { StoreUserModel } from '@/domain/models/StoreUserModel';
import { StoreRepository } from '../../store/store.repository';

export class AuthStoreUserRepository implements IAuthStoreUserRepository {
  constructor (
    private storeUserRepository: StoreUserRepository,
    private storeRepository: StoreRepository
  ) {}

  async signUpWithEmailAndPassword(payload: CreateStoreUserDTO) {
    await this.storeUserRepository.create(payload)
  }

  async isValidEmail (payload: IsValidEmailDTO) {
    const entity = await this.storeUserRepository.findByEmail(payload.email)

    if (entity) throw new HttpException(400, ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER)

    return true
  }

  private generateJWT (user: StoreUserEntity, storeId?: number) {

    const jwtPayload = new JWTPayload(
      user.id,
      storeId
    )

    const token = Jwt.generateAccessToken(
      jwtPayload
    )

    return token
  }

  async signInWithEmailAndPassword (payload: SignInWithEmailAndPasswordDTO) {
    const entity = await this.storeUserRepository.findByEmail(payload.email)

    if (!entity) throw new HttpException(401, ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD)

    const isPasswordMatched = await compare(payload.password, entity.password)

    if (!isPasswordMatched) throw new HttpException(401, ERRORS.AUTH.INCORRECT_EMAIL_OR_PASSWORD)

    const store = await this.storeRepository.findStoreIdByOwnerId(entity.id)

    return this.generateJWT(entity, store?.id)
  }

  async me(id: string) {
    const entity = await this.storeUserRepository.findById(id)

    if (!entity) return null

    return new StoreUserModel(entity)
  }
}