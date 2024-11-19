import { IsValidEmailDTO, SignInWithEmailAndPasswordDTO } from "@/domain/dto/authStoreuser.dto"
import { CreateStoreUserDTO } from "@/domain/dto/StoreUser.dto"
import { StoreUserModel } from "@/domain/models/StoreUserModel"

export interface IAuthStoreUserRepository {
  isValidEmail(payload: IsValidEmailDTO): Promise<boolean>
  me(id: string): Promise<StoreUserModel | null>
  signInWithEmailAndPassword(payload: SignInWithEmailAndPasswordDTO): Promise<string>
  signUpWithEmailAndPassword(payload: CreateStoreUserDTO): Promise<string>
}