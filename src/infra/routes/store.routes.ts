import { Router } from 'express';

import { StoreController } from '@/infra/controllers/store.controller';
import { storeUserJwtMiddleware } from '@/infra/middleware/auth/storeUserJWT.middleware';

import { StoreRepository } from '@/domain/repositories/store/store.repository';

import { prisma } from '@/services/PrismaClient';

const storeRoutes = Router()

const repository = new StoreRepository(prisma)
const controller = new StoreController(repository)

storeRoutes.post(
  '/store', 
  storeUserJwtMiddleware,
  controller.create.bind(controller)
)

export {
  storeRoutes
}