import { HttpException } from '@/domain/models/HttpException'
import multer, { Multer } from 'multer'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

export class FileUploadService {
  upload: Multer

  constructor () {
    const storage = multer.diskStorage({
      destination: (req, files, cb) => {
        cb(
          null, 
          path.resolve(__dirname, '..', 'shared', 'tmp')
        )
      },
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, uniqueSuffix + '-' + file.originalname)
      }
    })

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
    if (!fs.existsSync(path)) return
    
    const unlinkAsync =  promisify(fs.unlink)

    await unlinkAsync(path)
  }
}
