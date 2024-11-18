import { Request, Response } from 'express';

import { ProductRepository } from '@/domain/repositories/product/Product.repository';
import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { DeleteProductDTO } from '@/domain/dto/product.dto';
import { ERRORS } from '@/shared/errors';

export class ProductController {
  constructor (
    private productRepository: ProductRepository
  ) {}

  async delete (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload
      
      const { productId, menuId  } = req.params as unknown as DeleteProductDTO

      await this.productRepository.delete(
        user.storeId!!,
        Number(productId),
        Number(menuId)
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

  async uploadImage (req: Request, res: Response) {
    try {
      if (!req.file) return res
      .status(400)
      .json({
        message: ERRORS.FILE_UPLOAD.REQUIRED
      })

      const user = req.user as JWTPayload

      const { productId, menuId  } = req.params as unknown as DeleteProductDTO

      await this.productRepository.updateImage(
        user.storeId!!,
        Number(productId),
        Number(menuId),
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
}