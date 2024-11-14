import { Router } from "express";
import { authRoutes } from "./auth/auth.routes";

const routes = Router()

routes.use(authRoutes)

export {
  routes
}