import { IsValidEmailDTO } from '@/domain/dto/authStoreuser.dto';
import { CreateStoreUserDTO } from '@/domain/dto/StoreUser.dto';
import { HttpException } from '@/domain/models/HttpException';
import { StoreUserRepository } from '@/domain/repositories/storeUser/User.repository';
import { ERRORS } from '@/shared/errors';

export class AuthStoreUserRepository {
  constructor (
    private storeUserRepository: StoreUserRepository
  ) {}

  async signUpWithEmailAndPassword(payload: CreateStoreUserDTO) {
    await this.storeUserRepository.create(payload)
  }

  async isValidEmail (payload: IsValidEmailDTO) {
    const entity = await this.storeUserRepository.findByEmail(payload.email)

    if (entity) throw new HttpException(400, ERRORS.STORE_USER.EMAIL_ALREADY_REGISTER)

    return true
  }
}