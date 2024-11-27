import { environment } from '@/shared/environment';
import { v2 as cloudinary, TransformationOptions } from 'cloudinary';

export class CloudinaryService {
  constructor (
    private folder: string = "menu"
  ) {
    cloudinary.config({
      cloud_name: environment.cloudinary.name, 
      api_key: environment.cloudinary.apiKey, 
      api_secret: environment.cloudinary.secret
    })
  }

  async upload (path: string, transformation?: TransformationOptions) {
    const result = await cloudinary.uploader.upload(path, {
      folder: this.folder,
      transformation
    })

    return result
  }
}

