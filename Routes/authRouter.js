const route = require("express").Router();
const authController = require("../Controllers/authController");
const check_auth = require("../Middlewares/check_authentification");

route.post("/registerUser", authController.registerUser);

route.post("/login", authController.logIn);

route.post("/refreshToken", check_auth, authController.refreshToken);



module.exports = route;

