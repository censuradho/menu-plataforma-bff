import { Router } from "express";


import { prisma } from "@/services/PrismaClient";

import { MenuController } from "@/infra/controllers/menu.controller";
import { storeUserJwtMiddleware } from "@/infra/middleware/auth/storeUserJWT.middleware";
import { createMenuValidation } from "@/infra/middleware/menu.validation";
import { MenuRepository } from "@/domain/repositories/menu/Menu.repository";

const menuRoutes = Router()

const repository = new MenuRepository(prisma)
const controller = new MenuController(repository)

menuRoutes.post(
  '/menu', 
  storeUserJwtMiddleware,
  createMenuValidation,
  controller.upsert.bind(controller)
)

menuRoutes.get(
  '/menu', 
  storeUserJwtMiddleware,
  controller.findMany.bind(controller)
)

menuRoutes.get(
  '/menu/:menuId/product/:id', 
  storeUserJwtMiddleware,
  controller.findProductById.bind(controller)
)

menuRoutes.get(
  '/menu/:id', 
  storeUserJwtMiddleware,
  controller.findById.bind(controller)
)



export {
  menuRoutes
};
