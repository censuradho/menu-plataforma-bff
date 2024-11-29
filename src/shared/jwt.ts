import { JWTPayload } from '@/domain/models/JWTPayload'
import jwt from 'jsonwebtoken';
import { jwtConfig } from './config/jwt.config';

export class Jwt {
  static generateAccessToken (payload: JWTPayload, options?: jwt.SignOptions) {
    return jwt.sign({ ...payload }, process.env.JWT_SECRET as string, {
      ...jwtConfig,
      ...options
    })
  }

  static verifyAccessToken (token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string)
  }
}