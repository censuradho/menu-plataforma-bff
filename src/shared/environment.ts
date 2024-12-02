 
import { config } from 'dotenv'

config()

export const environment = {
  PORT: process.env.PORT,
  CORS: process.env.CORS?.split(',') || [],
  urls: {
    menuUiUrl: process.env.URL_MENU_UI || '',
    emailConfirmationEndpoint:  process.env.URL_MENU_UI_EMAIL_CONFIRMATION_ENDPOINT || '',
    passwordRecovery: process.env.URL_PASSWORD_RECOVERY_UI
  },
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
    waitingTimeBeforeNew: 1000 * 60,
    maxAttempts: 7,
    penaltyTime: 1000 * 60 * 60 // 1h
  },
  passwordRecovery: {
    waitingTimeBeforeNew: 1000 * 60,
    maxAttempts: 7,
    penaltyTime: 1000 * 60 * 60 // 1h
  },
  mailchimp: {
    marketingApiKey: process.env.MAIL_CHIMP_MARKETING_API_KEY || '',
    mandrillApiKey: process.env.MANDRILL_API_KEY || '',
    norepleyEmail: process.env.MAIL_CHIMP_NOREPLY_EMAIL
  }
}

environment.emailVerification.waitingTimeBeforeNew