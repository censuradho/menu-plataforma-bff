import { NextFunction, Request, Response } from "express";

import { ERRORS } from "@/shared/errors";
import { FileUploadService } from "@/services/FileUpload.service";

export function uploadSingleFileMiddleware (req: Request, res: Response, next: NextFunction) {
  const repository = new FileUploadService()

  return repository.singleUpload('file')(req, res, error => {
    if (error) {
      req.log.error(error, 'uploadSingleFileMiddleware')

      return res
        .status(400)
        .json({
          message: ERRORS.FILE_UPLOAD.REQUIRED
        })
    }

    next();

  })
  next()
}