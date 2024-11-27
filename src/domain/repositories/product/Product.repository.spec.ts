import { fileMock } from "@/__mock__/file";
import { deleteManyProductsPayloadMock, menuEntityMock, productEntityMock } from "@/__mock__/menu";
import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { HttpException } from "@/domain/models/HttpException";
import { CloudflareR2Service } from "@/services/CloudflareR2.service";
import { FileUploadService } from "@/services/FileUpload.service";
import { ERRORS } from "@/shared/errors";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductRepository } from "./Product.repository";

vi.mock('@/services/FileUpload.service')

describe('ProductRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: ProductRepository
  let cloudflareR2Service: CloudflareR2Service

  const storeId = 1
  const menuId = 1
  const productId = 1


  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    cloudflareR2Service = new CloudflareR2Service()


    repository = new ProductRepository(
      ctx.prisma,
      cloudflareR2Service
    )
  })

  describe('.validate', () => {
    it ('Should throw an exception if MenuGroupEntity was not founded by storeId and groupId', async () => {

      const request = repository.delete(storeId, productId, menuId)
      
      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 404,
          message: ERRORS.MENU.NOT_FOUND
        })
      )

      expect(mock.prisma.menu.findFirst).toHaveBeenCalledWith({
        where: {
          storeId,
          id: menuId
        },
        select: {
          id: true
        }
      })
    })

    it ('Should throw an exception if MenuEntity was not founded by groupId and menuId', async () => {
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)

      mock.prisma.menu.findFirst.mockResolvedValue(null)

      const request = repository.delete(storeId, productId, menuId)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 404,
          message: ERRORS.MENU.NOT_FOUND
        })
      )
      expect(mock.prisma.menu.findFirst).toHaveBeenCalledWith({
        where: {
          id: menuId,
          storeId
        },
        select: {
          id: true
        }
      })
    })

    it ('Should throw an exception if ProductEntity was not founded by productId and menuId', async () => {
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue(null)

      const request = repository.delete(storeId, productId, menuId)

      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 404,
          message: ERRORS.PRODUCT.NOT_FOUND
        })
      )
      expect(mock.prisma.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: productId,
          menuId
        },
        select: {
          id: true
        }
      })
    })

  })

  describe('.delete', () => {
    it ('Should delete product', async () => {
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue(productEntityMock)

      const validateMethodMock = vi.spyOn(repository, 'validate')

      await repository.delete(storeId, productId, menuId)

      expect(validateMethodMock).toBeCalled()
      expect(mock.prisma.product.delete).toBeCalledWith({
        where: {
          id: productId,
          menuId
        }
      })
    })
  })

  describe('.deleteMany', () => {
    it ('Should delete many products', async () => {

      await repository.deleteMany(storeId, deleteManyProductsPayloadMock)

      expect(mock.prisma.store.update).toHaveBeenCalledTimes(deleteManyProductsPayloadMock.products.length)
    })
  })

  describe('.updateImage', () => {
    it ('Should upload image', async () => {
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue(productEntityMock)

      const validateMethodMock = vi.spyOn(repository, 'validate')
  
      await repository.updateImage(
        storeId,
        productId,
        menuId,
        fileMock
      )

      expect(validateMethodMock).toBeCalledWith(
        storeId,
        productId,
        menuId,
      )
      expect(mock.prisma.product.update).toHaveBeenCalledWith({
        where: {
          menuId,
          id: productId
        },
        data: {
          image: fileMock.filename
        }
      })
    })
    
    it ('Should remove previous file if product already have an image', async () => {
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue({
        ...productEntityMock,
        image: fileMock.filename
      })

      const validateMethodMock = vi.spyOn(repository, 'validate')

      await repository.updateImage(
        storeId,
        productId,
        menuId,
        fileMock
      )
      expect(validateMethodMock).toHaveBeenCalled()
    })
  })
})