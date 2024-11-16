import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductRepository } from "@/domain/repositories/product/Product.repository";
import { prisma } from "@/services/PrismaClient";
import { deleteManyProductValidation } from "../middleware/product.validation";
import { storeUserJwtMiddleware } from "../middleware/auth/storeUserJWT.middleware";


const productRoutes = Router()

const repository = new ProductRepository(prisma)
const controller = new ProductController(repository)

productRoutes.delete(
  '/product/:productId/menu/:menuId/menuGroup/:groupId',
  storeUserJwtMiddleware,
  deleteManyProductValidation,
  controller.delete.bind(controller)
)

export {
  productRoutes
}