import { ProductRepository } from "@/domain/repositories/product/Product.repository";
import { CloudflareR2Service } from "@/services/CloudflareR2.service";
import { prisma } from "@/services/PrismaClient";
import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { storeMiddleware } from "../middleware/auth/store.middleware";
import { storeUserJwtMiddleware } from "../middleware/auth/storeUserJWT.middleware";
import { uploadSingleFileMiddleware } from "../middleware/fileUpload.middleware";
import { deleteManyProductValidation, deleteProductValidation } from "../middleware/product.validation";


const productRoutes = Router()

const repository = new ProductRepository(
  prisma,
  new CloudflareR2Service()
)

const controller = new ProductController(repository)

productRoutes.delete(
  '/product/:productId/menu/:menuId',
  storeUserJwtMiddleware,
  storeMiddleware,
  deleteProductValidation,
  controller.delete.bind(controller)
)

productRoutes.put(
  '/product/:productId/menu/:menuId/image',
  storeUserJwtMiddleware,
  storeMiddleware,
  uploadSingleFileMiddleware,
  controller.uploadImage.bind(controller)
)


productRoutes.post(
  '/product/batch-delete',
  storeUserJwtMiddleware,
  storeMiddleware,
  deleteManyProductValidation,
  controller.deleteMany.bind(controller)
)

export {
  productRoutes
};

