import { ChangePasswordDTO, CreatePasswordRecoveryDTO } from "@/domain/dto/passwordRecovery.dto"
import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export async function generatePasswordRecoveryValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as CreatePasswordRecoveryDTO

    const validation = new CreatePasswordRecoveryDTO()
  
    validation.email = payload.email

    await validateOrReject(validation)

    req.body = validation

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}


export async function changePasswordValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as ChangePasswordDTO

    const validation = new ChangePasswordDTO()
  
    validation.password = payload.password
    validation.code = payload.code

    await validateOrReject(validation)

    req.body = validation

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}

