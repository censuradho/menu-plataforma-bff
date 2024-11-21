import { JWTPayload } from "@/domain/models/JWTPayload"
import { ERRORS } from "@/shared/errors"
import { Jwt } from "@/shared/jwt"
import { signOutMethod } from "@/shared/signOut"
import { NextFunction, Request, Response } from "express"
import { JsonWebTokenError } from "jsonwebtoken"

export async function storeMiddleware (req: Request<any, any, JWTPayload>, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.auth

    if (!token) return res.status(401).json({
      message: ERRORS.AUTH.PROVIDE_TOKEN
    })

    const payload = Jwt.verifyAccessToken(token) as JWTPayload
  
    if (!payload.storeId) return res
      .status(404)
      .json({
        message: ERRORS.STORE.NOT_FOUND
      })

    next()
  } catch (error: any) {
    req.log.error(error)

    if (error instanceof JsonWebTokenError) {
      signOutMethod(req, res)

      return res.sendStatus(401)
    } 

    return res.sendStatus(500)
  }
}
