import { DeleteProductDTO } from "@/domain/dto/product.dto"
import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export async function deleteManyProductValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const { productId = '0', menuId = '0', groupId = '0' } = (req.params || {}) as unknown as DeleteProductDTO

    const validation = new DeleteProductDTO()
  
    validation.groupId = Number(groupId)
    validation.menuId = Number(menuId)
    validation.productId = Number(productId)

    await validateOrReject(validation)

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}