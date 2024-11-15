import { Router } from "express";

import { MenuGroupRepository } from "@/domain/repositories/menuGroup/menuGroup.repository";
import { StoreRepository } from "@/domain/repositories/store/store.repository";

import { prisma } from "@/services/PrismaClient";

import { MenuGroupController } from "@/infra/controllers/menuGroup.controller";
import { storeUserJwtMiddleware } from "@/infra/middleware/auth/storeUserJWT.middleware";
import { createMenuGroupValidation } from "../middleware/menuGroup.validation";

const menuGroupRoutes = Router()

const storeRepository = new StoreRepository(prisma)
const repository = new MenuGroupRepository(prisma, storeRepository)
const controller = new MenuGroupController(repository)

menuGroupRoutes.post(
  '/menu-group', 
  storeUserJwtMiddleware,
  createMenuGroupValidation,
  controller.create.bind(controller)
)

export {
  menuGroupRoutes
}