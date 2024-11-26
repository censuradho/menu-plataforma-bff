import { CorsOptions } from 'cors';
import { environment } from '../environment';

const origin = (origin: any, callback: any) => {
    // Permitir se o domínio estiver na lista ou se não houver origin (ex.: requests do mesmo domínio)
    if (!origin || environment.CORS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
}

export const corsConfig: CorsOptions = {
  origin,
  credentials: true,
  optionsSuccessStatus: 200
}