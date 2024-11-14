import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { corsConfig } from './shared/config/cors'
import { environment } from './shared/environment'
import { loggerHttp } from './shared/lib/logger'

const app = express()

app.use(loggerHttp)
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsConfig))

app.listen(environment.PORT, () => {
  console.log(`Listen on PORT: ${environment.PORT}/`);
})