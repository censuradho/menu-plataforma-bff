export interface IAuthStoreUserRepository {
  isValidEmail(email: string): Promise<boolean>
}