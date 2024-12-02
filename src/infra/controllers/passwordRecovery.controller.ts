import { HttpException } from "@/domain/models/HttpException";
import { PasswordRecoveryRepository } from "@/domain/repositories/passwordRecovery/PasswordRecovery.repository";
import { signOutMethod } from "@/shared/signOut";
import { Request, Response } from "express";

export class PasswordRecoveryController {
  constructor (
    private repository: PasswordRecoveryRepository
  ) {}

  async generate (req: Request, res: Response) {
    try {
      await this.repository.generate(req.body)

      return res.sendStatus(200)
    } catch (error) {
      req.log.error(error)
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message })
      }

      return res.sendStatus(500)   
    }
  }

  async changePassword (req: Request, res: Response)  {
    try {
      await this.repository.changePassword(req.body)

      signOutMethod(req, res)

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