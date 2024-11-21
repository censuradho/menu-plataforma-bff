import { DeleteManyProductsDTO, DeleteProductDTO } from "@/domain/dto/product.dto"
import { validateOrReject } from "class-validator"
import { NextFunction, Request, Response } from "express"

export async function deleteProductValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const { productId = '0', menuId = '0'  } = (req.params || {}) as unknown as DeleteProductDTO

    const validation = new DeleteProductDTO()
  
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

export async function deleteManyProductValidation (req: Request, res: Response, next: NextFunction) {
  if (!req.body) return res.status(400).json({
    message: 'MISSING_REQUEST_BODY'
  })

  try {
    const body = req.body as DeleteManyProductsDTO

    const validation = new DeleteManyProductsDTO()
  
    validation.products = body.products

    await validateOrReject(validation)

    next()
  } catch (error: any) {
    return res.status(400).json({
      message: Object.values(error[0].constraints)[0]
    })
  }
}


