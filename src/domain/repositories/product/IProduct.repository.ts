export interface IProductRepository {
  delete(storeId: number, productId: number, menuId: number): Promise<void>
}