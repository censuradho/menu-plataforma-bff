import { CreateMenuGroupDTO } from "@/domain/dto/menuGroup.dto"
import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export async function createMenuGroupValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const payload = req.body as CreateMenuGroupDTO

    const validation = new CreateMenuGroupDTO()
  
    validation.id = payload.id
    validation.hourFrom = payload.hourFrom
    validation.hourTo = payload.hourTo
    validation.label = payload.label
    validation.menus = payload.menus
    validation.visible = payload.visible

    await validateOrReject(validation)

    req.body = validation

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}