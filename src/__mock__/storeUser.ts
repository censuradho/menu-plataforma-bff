import { CreateStoreUserDTO } from "@/domain/dto/StoreUser.dto";
import { StoreUserEntity } from "@/domain/entity/StoreUser.entity";

export const createStoreUserDTOPayloadMock: CreateStoreUserDTO = {
  email: 'email@email.com',
  firstName: 'firstName',
  lastName: 'lastName',
  password: '1234567890',
  phone: '+5551987237465',
}

export const storeUserEntity: StoreUserEntity = {
  ...createStoreUserDTOPayloadMock,
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date()
}