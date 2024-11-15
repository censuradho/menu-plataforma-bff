import { PrismaClient } from "@prisma/client";

export class ProductRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  async delete () {
    
  }
}