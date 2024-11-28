import { StoreUserEntity } from "../entity/StoreUser.entity";

export class StoreUserModel {
  firstName: string
  lastName: string
  email: string
  id: string
  isVerified?: boolean | null

  constructor (payload: StoreUserEntity) {
    this.id = payload.id
    this.firstName = payload.firstName
    this.email = payload.email
    this.lastName = payload.lastName
    this.isVerified = payload.isVerified
  }
}