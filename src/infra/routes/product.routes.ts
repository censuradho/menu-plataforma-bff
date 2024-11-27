import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductRepository } from "@/domain/repositories/product/Product.repository";
import { prisma } from "@/services/PrismaClient";
import { deleteManyProductValidation, deleteProductValidation } from "../middleware/product.validation";
import { storeUserJwtMiddleware } from "../middleware/auth/storeUserJWT.middleware";
import { FileUploadService } from "@/services/FileUpload.service";
import { uploadSingleFileMiddleware } from "../middleware/fileUpload.middleware";
import { storeMiddleware } from "../middleware/auth/store.middleware";
import { CloudinaryService } from "@/services/cloudinary.service";


const productRoutes = Router()

const repository = new ProductRepository(
  prisma,
  new FileUploadService(),
  new CloudinaryService()
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
}