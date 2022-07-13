const routes = require("express").Router();
const LoginController = require("../controller/LoginController");

routes.get("/", LoginController.publicRoute);
routes.post("/auth/register", LoginController.authRegister);

module.exports = routes;