import { CorsOptions } from 'cors';
import { environment } from '../environment';

export const corsConfig: CorsOptions = {
  origin: environment.CORS,
  credentials: true
}