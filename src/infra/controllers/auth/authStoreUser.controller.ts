import { addDays } from 'date-fns';
import { Request, Response } from 'express';

import { HttpException } from '@/domain/models/HttpException';
import { AuthStoreUserRepository } from '@/domain/repositories/auth/storeuser/AuthStoreUser.repository';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { signOutMethod } from '@/shared/signOut';
export class AuthStoreUserController {
  constructor (
    private authStoreUserRepository: AuthStoreUserRepository
  ) {}

  private generateAuthCookie (cookie: string, res: Response) {
    res.clearCookie('auth')
    res.cookie('auth', cookie, {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: process.env.NODE_ENV !== 'development',
      expires: addDays(new Date(), 2),
      sameSite: 'none',
      path: '/'
    })
  }

  async signUpWithEmailAndPassword (req: Request, res: Response) {
    try {
      const token = await this.authStoreUserRepository.signUpWithEmailAndPassword(req.body)

      this.generateAuthCookie(token, res)

      return res.sendStatus(201)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)    
    }
  }

  async signInWithEmailAndPassword(req: Request, res: Response) {
    try {
      const { token, user } = await this.authStoreUserRepository.signInWithEmailAndPassword(req.body)

      this.generateAuthCookie(token, res)

      return res.json({
        isVerified: user?.isVerified
      })

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

  async me (req: Request, res: Response) {
    const user = req.user as JWTPayload

    try {
      const me = await this.authStoreUserRepository.me(user.id)

      return res.json(me)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)    
    }
  }

  logout (req: Request, res: Response) {
    signOutMethod(req, res)
    return res.sendStatus(204)
  }

  async resendEmailValidation (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload

      await this.authStoreUserRepository.resendEmailValidation({
        userId: user.id
      })
      return res.sendStatus(200)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
  async resendEmailValidationByEmail (req: Request, res: Response) {
    try {
      const token = await this.authStoreUserRepository.resendEmailValidationByEmail(req.body)
      this.generateAuthCookie(token, res)

      return res.sendStatus(200)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async verifyEmailValidationIntegrityByUserId (req: Request, res: Response) {
    try {
      const { token } = req.params

      await this.authStoreUserRepository.validateEmailByUserId(token)

      return res.sendStatus(200)

    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }
}