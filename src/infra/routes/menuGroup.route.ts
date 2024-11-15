import { Router } from "express";

import { MenuGroupRepository } from "@/domain/repositories/menuGroup/menuGroup.repository";

import { prisma } from "@/services/PrismaClient";

import { MenuGroupController } from "@/infra/controllers/menuGroup.controller";
import { storeUserJwtMiddleware } from "@/infra/middleware/auth/storeUserJWT.middleware";
import { createMenuGroupValidation } from "@/infra/middleware/menuGroup.validation";

const menuGroupRoutes = Router()

const repository = new MenuGroupRepository(prisma)
const controller = new MenuGroupController(repository)

menuGroupRoutes.post(
  '/menu-group', 
  storeUserJwtMiddleware,
  createMenuGroupValidation,
  controller.upsert.bind(controller)
)

menuGroupRoutes.get(
  '/menu-group', 
  storeUserJwtMiddleware,
  controller.findMany.bind(controller)
)

export {
  menuGroupRoutes
};
