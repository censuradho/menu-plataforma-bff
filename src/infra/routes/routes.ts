import { Router } from "express";
import { authRoutes } from "./auth/auth.routes";
import { storeRoutes } from "./store.routes";

const routes = Router()

routes.use(authRoutes)
routes.use(storeRoutes)

export {
  routes
}