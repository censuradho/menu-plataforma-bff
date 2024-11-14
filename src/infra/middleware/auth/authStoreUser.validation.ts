import { IsValidEmailDTO, SignInWithEmailAndPasswordDTO } from "@/domain/dto/authStoreuser.dto";
import { CreateStoreUserDTO } from "@/domain/dto/StoreUser.dto";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";

export async function authStoreUserSignUpWithEmailAndPasswordValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as CreateStoreUserDTO

    const validation = new CreateStoreUserDTO()
  
    validation.email = payload.email
    validation.firstName = payload.firstName
    validation.lastName = payload.lastName
    validation.password = payload.password
    validation.phone = payload.phone
  
    await validateOrReject(validation)

    req.body = validation

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}

export async function isValidEmailValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as IsValidEmailDTO

    const validation = new IsValidEmailDTO()
  
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

export async function signInWithEmailAndPasswordRequestBodyValidation (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body) return res.status(400).json({
      message: 'MISSING_REQUEST_BODY'
    })

    const validation = new SignInWithEmailAndPasswordDTO()

    const body = req.body as SignInWithEmailAndPasswordDTO


    validation.email = body.email
    validation.password = body.password

    await validateOrReject(validation)

    req.body = validation
    next()

  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}

