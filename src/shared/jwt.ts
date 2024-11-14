import { JWTPayload } from '@/domain/models/JWTPayload'
import jwt from 'jsonwebtoken';
import { jwtConfig } from './config/jwt.config';

export class Jwt {
  static generateAccessToken (payload: JWTPayload) {
    return jwt.sign({ ...payload }, process.env.JWT_SECRET as string, jwtConfig)
  }

  static verifyAccessToken (token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string)
  }
}