const routes = require("express").Router();
const LoginController = require("../controller/LoginController");

routes.get("/", LoginController.publicRoute);
routes.get("/register", LoginController.registerRoute);
routes.get("/login", LoginController.loginRoute);
routes.get("/user/:id", LoginController.checkToken, LoginController.privateRoute);
routes.post("/auth/register", LoginController.authRegister);
routes.post("/auth/login", LoginController.loginUser);

module.exports = routes;