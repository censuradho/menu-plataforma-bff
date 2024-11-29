import { HttpException } from '@/domain/models/HttpException'
import multer, { Multer } from 'multer'
import path, { join } from 'path'
import fs from 'fs'
import { promisify } from 'util'

export class FileUploadService {
  upload: Multer

  constructor () {
    const storage = multer.memoryStorage()

    this.upload = multer({
      storage,
      limits: { fileSize: 1024 * 1024 * 5 },
      fileFilter: (req, file, cb) => {
          const allowedTypes = /jpeg|jpg|png|gif/;
          const mimeType = allowedTypes.test(file.mimetype);
          const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
          if (mimeType && extName) {
              return cb(null, true);
          }
          cb(new HttpException(400, 'FILE_EXTENSION_NOT_SUPORTE'));
      }
    })
  }
  
  singleUpload(fieldName: string) {
    return this.upload.single(fieldName);
  }
  
  multipleUpload(fieldName: string, maxCount: number) {
    return this.upload.array(fieldName, maxCount);
  }

  async removeFile (path: string) {
    const fullPath =join( __dirname, '..', 'shared', 'tmp', path)
    if (!fs.existsSync(fullPath)) return
    
    const unlinkAsync =  promisify(fs.unlink)

    await unlinkAsync(fullPath)
  }
}
