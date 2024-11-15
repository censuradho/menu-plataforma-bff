import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { MenuGroupRepository } from '@/domain/repositories/menuGroup/menuGroup.repository';
import { Request, Response } from 'express';

export class MenuGroupController {
  constructor (
    private menuGroupRepository: MenuGroupRepository
  ) {}

  async create (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload

      const menuGroup = await this.menuGroupRepository.create(user.id, req.body)

      return res.status(201).json(menuGroup)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
}