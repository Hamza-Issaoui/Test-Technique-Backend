const route = require("express").Router();
const userController = require("../Controllers/userController");
const check_auth = require("../Middlewares/check_authentification");


route.get("", userController.GetAllUsers);
route.get("/:id", userController.GetUserById)
route.put("/:id", userController.UpdateUser)
route.delete("/:id", userController.DeleteUser)



module.exports = route;