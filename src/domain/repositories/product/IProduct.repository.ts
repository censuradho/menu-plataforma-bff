export interface IProductRepository {
  delete(storeId: number, productId: number, menuId: number, groupId: number): Promise<void>
}