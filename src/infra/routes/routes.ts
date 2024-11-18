import { Router } from "express";
import { authRoutes } from "./auth/auth.routes";
import { storeRoutes } from "./store.routes";
import { menuRoutes } from "./menu.route";
import { productRoutes } from "./product.routes";

const routes = Router()

routes.use(authRoutes)
routes.use(storeRoutes)
routes.use(menuRoutes)
routes.use(productRoutes)

export {
  routes
}