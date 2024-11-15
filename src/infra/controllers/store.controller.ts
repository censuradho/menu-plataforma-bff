import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { StoreRepository } from '@/domain/repositories/store/store.repository';
import { Request, Response } from 'express';

export class StoreController {
  constructor (
    private storeRepository: StoreRepository
  ) {}

  async create (req: Request, res: Response) {
    const user = req.user as JWTPayload

    try {
       await this.storeRepository.create(user.id, req.body)

       return res.sendStatus(201)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
}