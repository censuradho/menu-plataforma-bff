import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductRepository } from "@/domain/repositories/product/Product.repository";
import { prisma } from "@/services/PrismaClient";
import { deleteManyProductValidation } from "../middleware/product.validation";
import { storeUserJwtMiddleware } from "../middleware/auth/storeUserJWT.middleware";
import { FileUploadService } from "@/services/FileUpload.service";
import { uploadSingleFileMiddleware } from "../middleware/fileUpload.middleware";


const productRoutes = Router()

const repository = new ProductRepository(
  prisma,
  new FileUploadService()
)
const controller = new ProductController(repository)

productRoutes.delete(
  '/product/:productId/menu/:menuId/menuGroup/:groupId',
  storeUserJwtMiddleware,
  deleteManyProductValidation,
  controller.delete.bind(controller)
)

productRoutes.put(
  '/product/image/:productId/menu/:menuId/menuGroup/:groupId',
  storeUserJwtMiddleware,
  uploadSingleFileMiddleware,
  controller.uploadImage.bind(controller)
)

export {
  productRoutes
}