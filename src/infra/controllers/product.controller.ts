import { Request, Response } from 'express';
import { ProductRepository } from './../../domain/repositories/product/Product.repository';
import { HttpException } from '@/domain/models/HttpException';
import { JWTPayload } from '@/domain/models/JWTPayload';
import { DeleteProductDTO } from '@/domain/dto/product.dto';

export class ProductController {
  constructor (
    private productRepository: ProductRepository
  ) {}

  async delete (req: Request, res: Response) {
    try {
      const user = req.user as JWTPayload
      
      const { productId, menuId, groupId  } = req.params as unknown as DeleteProductDTO

      await this.productRepository.delete(
        user.storeId!!,
        Number(productId),
        Number(menuId),
        Number(groupId)
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