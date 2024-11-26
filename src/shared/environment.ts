 
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
  }
}