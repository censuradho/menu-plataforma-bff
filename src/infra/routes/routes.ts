import { Router } from "express";
import { authRoutes } from "./auth/auth.routes";
import { storeRoutes } from "./store.routes";
import { menuGroupRoutes } from "./menuGroup.route";

const routes = Router()

routes.use(authRoutes)
routes.use(storeRoutes)
routes.use(menuGroupRoutes)

export {
  routes
}