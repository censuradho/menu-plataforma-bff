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

  async findById (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload
      const { id } = req.params

      const data = await this.menuRepository.findById(user.storeId!!, Number(id))

      return res.status(200).json(data)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async findProductById (req: Request, res: Response) {
    const { id, menuId  } = req.params
    const user = req.user as JWTPayload

    try {
      const data = await this.menuRepository.findProductById(
        user.storeId!!, 
        Number(menuId), 
        Number(id)
      )
      return res.status(200).json(data)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }

  }
}