 
import { config } from 'dotenv'

config()

export const environment = {
  PORT: process.env.PORT,
  CORS: process.env.CORS?.split(',') || [],
  cloudFlare: {
    r2: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      url: process.env.CLOUDFLARE_R2_URL,
    }
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    name: process.env.CLOUDINARY_NAME,
    secret: process.env.CLOUDINARY_SECRET,
  }
}