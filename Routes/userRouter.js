import { Router } from "express";
import userController from "../Controllers/userController.js";
import check_auth from "../Middlewares/check_authentification.js";

const route = Router();

route.get("", check_auth, userController.GetAllUsers);
route.get("/:id", check_auth, userController.GetUserById)
route.put("/:id", check_auth, userController.UpdateUser)
route.delete("/:id", check_auth, userController.DeleteUser)



export default route;
