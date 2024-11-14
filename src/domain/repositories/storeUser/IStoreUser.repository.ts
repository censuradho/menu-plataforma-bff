import { CreateStoreUserDTO } from "@/domain/dto/StoreUser.dto";
import { StoreUserEntity } from "@/domain/entity/StoreUser.entity";

export interface IStoreUSerRepository {
  findByEmail(email: string): Promise<StoreUserEntity | null>
  create(payload: CreateStoreUserDTO): Promise<string>
}