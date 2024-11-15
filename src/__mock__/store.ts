import { CreateStoreDTO } from "@/domain/dto/store.dto";
import { StoreEntity } from "@/domain/entity/Store.entity";

export const createStoreDTOMock: CreateStoreDTO = {
  cuisineType: "cuisineType",
  document: "document",
  documentType: "documentType",
  establishmentTime: "establishmentTime",
  name: "name",
  revenueEstimate: "revenueEstimate",
  numberOfEmployees: 10,
}

export const storeEntityMock: StoreEntity = {
  ...createStoreDTOMock,
  ownerId: "ownerId",
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
}
