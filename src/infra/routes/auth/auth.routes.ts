import { Router } from "express";
import { authStoreUserRoute } from "./authStoreUser.route";

const authRoutes = Router()

authRoutes.use(
  '/auth', 
  authStoreUserRoute
)

export {
  authRoutes
};

