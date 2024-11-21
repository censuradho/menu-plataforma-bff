import { Router } from "express";


import { prisma } from "@/services/PrismaClient";

import { MenuController } from "@/infra/controllers/menu.controller";
import { storeUserJwtMiddleware } from "@/infra/middleware/auth/storeUserJWT.middleware";
import { createMenuValidation } from "@/infra/middleware/menu.validation";
import { MenuRepository } from "@/domain/repositories/menu/Menu.repository";
import { storeMiddleware } from "../middleware/auth/store.middleware";

const menuRoutes = Router()

const repository = new MenuRepository(prisma)
const controller = new MenuController(repository)

menuRoutes.post(
  '/menu', 
  storeUserJwtMiddleware,
  storeMiddleware,
  createMenuValidation,
  controller.upsert.bind(controller)
)

menuRoutes.get(
  '/menu', 
  storeUserJwtMiddleware,
  storeMiddleware,
  controller.findMany.bind(controller)
)

menuRoutes.get(
  '/menu/:menuId/product/:id', 
  storeUserJwtMiddleware,
  storeMiddleware,
  controller.findProductById.bind(controller)
)

menuRoutes.get(
  '/menu/:id', 
  storeUserJwtMiddleware,
  storeMiddleware,
  controller.findById.bind(controller)
)

menuRoutes.delete(
  '/menu/:id', 
  storeUserJwtMiddleware,
  storeMiddleware,
  controller.delete.bind(controller)
)

export {
  menuRoutes
};
