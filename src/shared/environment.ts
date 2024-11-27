 
import { config } from 'dotenv'

config()

export const environment = {
  PORT: process.env.PORT,
  CORS: process.env.CORS?.split(',') || [],
  cloudFlare: {
    r2: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
      url: process.env.CLOUDFLARE_R2_URL as string,
      publicAccessUrl: process.env.CLOUDFLARE_R2_PUBLIC_ACCESS_URL as string
    }
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    name: process.env.CLOUDINARY_NAME,
    secret: process.env.CLOUDINARY_SECRET,
  },
  emailVerification: {
    /**
     * In milliseconds
     * @example 1000 * 60 * 10 // 10 min
     * */
    waitingTimeBeforeNew: 1000 * 60 * 10 
  }
}

environment.emailVerification.waitingTimeBeforeNew