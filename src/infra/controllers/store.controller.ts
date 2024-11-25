import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { StoreRepository } from '@/domain/repositories/store/store.repository';
import { ERRORS } from '@/shared/errors';
import { Request, Response } from 'express';

export class StoreController {
  constructor (
    private storeRepository: StoreRepository
  ) {}

  async create (req: Request, res: Response) {
    const user = req.user as JWTPayload

    try {
       const store = await this.storeRepository.create(user.id, req.body)

       req.user!!['storeId'] = store.id

       return res.sendStatus(201)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async findByOwnerId (req: Request, res: Response) {
    const user = req.user as JWTPayload

    try {
      const store = await this.storeRepository.findStoreByOwnerId(user.id)

      return res.json(store)
    } catch (error) {
      req.log.error(error)

      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async update (req: Request, res: Response) {
    const user = req.user as JWTPayload

    try {
      await this.storeRepository.update(
        user.storeId!!,
        user.id,
        req.body
      )

      return res.sendStatus(200)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
  async logoUpload (req: Request, res: Response) {
    try {
      if (!req.file) return res
      .status(400)
      .json({
        message: ERRORS.FILE_UPLOAD.REQUIRED
      })

      const user = req.user as JWTPayload

      await this.storeRepository.logoUpload(
        user.storeId!!,
        req.file
      )
      return res.sendStatus(204)
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
      const store = await this.storeRepository.findMany()

      return res.json(store)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async findStoreWithMenu (req: Request, res: Response) {
    try {
      const { id } = req.params

      const store = await this.storeRepository.findStoreWithMenu(id)

      return res.json(store)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
}