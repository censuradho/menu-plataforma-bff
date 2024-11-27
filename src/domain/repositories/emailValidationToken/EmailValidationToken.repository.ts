import { CreateEmailValidationTokenDTO } from '@/domain/dto/emailValidationToken.dto';
import { PrismaClient } from '@prisma/client';

export class EmailValidationTokenRepository {
  constructor (
    private prisma: PrismaClient
  ) {}

  create (payload: CreateEmailValidationTokenDTO) {
    
  }

}