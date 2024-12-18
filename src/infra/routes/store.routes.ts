import { CloudflareR2Service } from '@/services/CloudflareR2.service';
import { Router } from 'express';

import { StoreController } from '@/infra/controllers/store.controller';
import { storeUserJwtMiddleware } from '@/infra/middleware/auth/storeUserJWT.middleware';

import { StoreRepository } from '@/domain/repositories/store/store.repository';

import { createStoreValidation } from '@/infra/middleware/store.middleware';
import { prisma } from '@/services/PrismaClient';
import { storeMiddleware } from '../middleware/auth/store.middleware';
import { uploadSingleFileMiddleware } from '../middleware/fileUpload.middleware';

const storeRoutes = Router()

const repository = new StoreRepository(prisma, new CloudflareR2Service())
const controller = new StoreController(repository)

storeRoutes.post(
  '/store', 
  storeUserJwtMiddleware,
  createStoreValidation,
  controller.create.bind(controller)
)

storeRoutes.get(
  '/store', 
  storeUserJwtMiddleware,
  controller.findByOwnerId.bind(controller)
)

storeRoutes.put(
  '/store/logo', 
  storeUserJwtMiddleware,
  storeMiddleware,
  uploadSingleFileMiddleware,
  controller.logoUpload.bind(controller)
)

storeRoutes.put(
  '/store', 
  storeUserJwtMiddleware,
  storeMiddleware,
  createStoreValidation,
  controller.update.bind(controller)
)

storeRoutes.get(
  '/store/public', 
  controller.findMany.bind(controller)
)

storeRoutes.get(
  '/store/public/:id', 
  controller.findStoreWithMenu.bind(controller)
)



export {
  storeRoutes
};
