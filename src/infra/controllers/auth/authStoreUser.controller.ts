import { HttpException } from '@/domain/models/HttpException';
import { AuthStoreUserRepository } from '@/domain/repositories/auth/storeuser/AuthStoreUser.repository';
import { Request, Response } from 'express';

export class AuthStoreUserController {
  constructor (
    private authStoreUserRepository: AuthStoreUserRepository
  ) {}

  async signUpWithEmailAndPassword (req: Request, res: Response) {
    try {
      await this.authStoreUserRepository.signUpWithEmailAndPassword(req.body)

      return res.sendStatus(201)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)    
    }
  }

  async isValidEmail (req: Request, res: Response) {
    try {
      
      await this.authStoreUserRepository.isValidEmail(req.body)

      return res.sendStatus(204)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)    
    }
  }
}