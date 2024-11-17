import { Context, createMockContext, MockContext } from "@/__test__/setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductRepository } from "./Product.repository";
import e from "express";
import { HttpException } from "@/domain/models/HttpException";
import { ERRORS } from "@/shared/errors";
import { menuEntityMock, menuGroupEntityMock, productEntityMock } from "@/__mock__/menuGroup";
import { FileUploadService } from "@/services/FileUpload.service";
import { fileMock } from "@/__mock__/file";

vi.mock('@/services/FileUpload.service')

describe('ProductRepository', () => {
  let mock: MockContext
  let ctx: Context
  let repository: ProductRepository
  let uploadService: FileUploadService

  const storeId = 1
  const menuId = 1
  const groupId = 1
  const productId = 1


  beforeEach(() => {
    mock = createMockContext()
    ctx = mock as unknown as Context
    uploadService = new FileUploadService()

    repository = new ProductRepository(
      ctx.prisma,
      uploadService
    )
  })

  describe('.validate', () => {
    it ('Should throw an exception if MenuGroupEntity was not founded by storeId and groupId', async () => {
      mock.prisma.menuGroup.findFirst.mockResolvedValue(null)

      const request = repository.delete(storeId, productId, menuId, groupId)
      
      await expect(request).rejects.toBeInstanceOf(HttpException)
      await expect(request).rejects.toThrowError(
        expect.objectContaining({
          status: 404,
          message: ERRORS.MENU_GROUP.NOT_FOUND
        })
      )

      expect(mock.prisma.menuGroup.findFirst).toHaveBeenCalledWith({
        where: {
          storeId,
          id: groupId
        },
        select: {
          id: true
        }
      })
    })

    it ('Should throw an exception if MenuEntity was not founded by groupId and menuId', async () => {
      mock.prisma.menuGroup.findFirst.mockResolvedValue(menuGroupEntityMock)

      mock.prisma.menu.findFirst.mockResolvedValue(null)

      const request = repository.delete(storeId, productId, menuId, groupId)

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
          groupId
        },
        select: {
          id: true
        }
      })
    })

    it ('Should throw an exception if ProductEntity was not founded by productId and menuId', async () => {
      mock.prisma.menuGroup.findFirst.mockResolvedValue(menuGroupEntityMock)
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue(null)

      const request = repository.delete(storeId, productId, menuId, groupId)

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
      mock.prisma.menuGroup.findFirst.mockResolvedValue(menuGroupEntityMock)
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue(productEntityMock)

      const validateMethodMock = vi.spyOn(repository, 'validate')

      await repository.delete(storeId, productId, menuId, groupId)

      expect(validateMethodMock).toBeCalled()
      expect(mock.prisma.product.delete).toBeCalledWith({
        where: {
          id: productId,
          menuId
        }
      })
    })
  })

  describe('.updateImage', () => {
    it ('Should upload image', async () => {
      mock.prisma.menuGroup.findFirst.mockResolvedValue(menuGroupEntityMock)
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue(productEntityMock)

      const validateMethodMock = vi.spyOn(repository, 'validate')
  
      await repository.updateImage(
        storeId,
        productId,
        menuId,
        groupId,
        fileMock
      )

      expect(uploadService.removeFile).not.toHaveBeenCalled()
      expect(validateMethodMock).toBeCalledWith(
        storeId,
        productId,
        menuId,
        groupId,
      )
      expect(mock.prisma.product.update).toHaveBeenCalledWith({
        where: {
          menuId,
          id: productId
        },
        data: {
          image: fileMock.path
        }
      })
    })

    it ('Should remove previous file if product already have an image', async () => {
      mock.prisma.menuGroup.findFirst.mockResolvedValue(menuGroupEntityMock)
      mock.prisma.menu.findFirst.mockResolvedValue(menuEntityMock)
      mock.prisma.product.findFirst.mockResolvedValue({
        ...productEntityMock,
        image: fileMock.path
      })

      const validateMethodMock = vi.spyOn(repository, 'validate')

      await repository.updateImage(
        storeId,
        productId,
        menuId,
        groupId,
        fileMock
      )
      expect(uploadService.removeFile).toHaveBeenCalled()
      expect(validateMethodMock).toHaveBeenCalled()
    })
  })
})