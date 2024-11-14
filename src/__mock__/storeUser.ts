import { SignInWithEmailAndPasswordDTO } from "@/domain/dto/authStoreuser.dto";
import { CreateStoreUserDTO } from "@/domain/dto/StoreUser.dto";
import { StoreUserEntity } from "@/domain/entity/StoreUser.entity";

export const createStoreUserDTOPayloadMock: CreateStoreUserDTO = {
  email: 'email@email.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'passwordasdasd',
  phone: '+5551987237465',
}

export const loginStoreUserDTOMock: SignInWithEmailAndPasswordDTO = {
  email: 'email@email.com',
  password: 'passwordasdasd',
}

export const storeUserEntityMock: StoreUserEntity = {
  ...createStoreUserDTOPayloadMock,
  password: '$2b$10$gDh9nnInFPhMVXxmbc.JuOpkypDWMlYxOlm48TkR/NhV31RyvqoFG',
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date()
}