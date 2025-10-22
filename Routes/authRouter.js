import { Router } from "express";
import authController from "../Controllers/authController.js";
import check_auth from "../Middlewares/check_authentification.js";

const route = Router();

route.post("/registerUser", authController.registerUser);
route.post("/login", authController.logIn);
route.post("/refreshToken", check_auth, authController.refreshToken);

export default route;

