import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { MenuRepository } from '@/domain/repositories/menu/Menu.repository';
import { Request, Response } from 'express';

export class MenuController {
  constructor (
    private menuRepository: MenuRepository
  ) {}

  async upsert (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload

      const data = await this.menuRepository.upsert(user.storeId!!, req.body)

      return res.status(201).json(data)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async findMany (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload

      const data = await this.menuRepository.findMany(user.storeId!!)

      return res.status(201).json(data)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
}