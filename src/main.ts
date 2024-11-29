import 'reflect-metadata';

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import { corsConfig } from './shared/config/cors'
import { environment } from './shared/environment'
import { loggerHttp } from './shared/lib/logger'
import { routes } from './infra/routes/routes'
import path from 'path';
import { helmetConfig } from './shared/config/helmet';
import { CloudflareR2Service } from './services/CloudflareR2.service';

const app = express()

// app.use(helmet(helmetConfig))

app.use(loggerHttp)
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsConfig))

app.use(routes)

app.use(
  '/images', 
  express.static(
    path.join(__dirname, 'shared/tmp')
  )
)
app.listen(environment.PORT, () => {
  console.log(`Listen on PORT: ${environment.PORT}/`);
})
