import { AuthStoreUserController } from "@/infra/controllers/auth/authStoreUser.controller";
import { AuthStoreUserRepository } from "@/domain/repositories/auth/storeuser/AuthStoreUser.repository";
import { StoreUserRepository } from "@/domain/repositories/storeUser/User.repository";
import { prisma } from "@/services/PrismaClient";
import { Router } from "express";
import { authStoreUserSignUpWithEmailAndPasswordValidation, isValidEmailValidation } from "../middleware/auth/authStoreUser.validation";

const authStoreUserRoute = Router()

const storeUserRepository = new StoreUserRepository(prisma)
const repository = new AuthStoreUserRepository(storeUserRepository)
const controller = new AuthStoreUserController(repository)

authStoreUserRoute.post(
  '/store-user/register',
  authStoreUserSignUpWithEmailAndPasswordValidation, 
  controller.signUpWithEmailAndPassword.bind(controller)
)

authStoreUserRoute.post(
  '/store-user/email-validation', 
  isValidEmailValidation, 
  controller.isValidEmail.bind(controller)
)

export {
  authStoreUserRoute
}