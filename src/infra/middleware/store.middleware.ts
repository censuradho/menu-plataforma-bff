import { CreateStoreDTO } from "@/domain/dto/store.dto"
import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export async function createStoreValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as CreateStoreDTO

    const validation = new CreateStoreDTO()
  
    validation.cuisineType = payload.cuisineType
    validation.document = payload.document
    validation.documentType = payload.documentType
    validation.establishmentTime = payload.establishmentTime
    validation.hourFrom = payload?.hourFrom
    validation.hourTo = payload?.hourTo
    validation.name = payload.name
    validation.numberOfEmployees = payload.numberOfEmployees
    validation.revenueEstimate = payload.revenueEstimate
    validation.facebookUrl = payload.facebookUrl
    validation.instagramUrl = payload.instagramUrl
    validation.twitterUrl = payload.twitterUrl
    validation.tikTokUrl = payload.tikTokUrl


    await validateOrReject(validation)

    req.body = validation

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}
