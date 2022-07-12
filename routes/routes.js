const routes = require("express").Router();
const LoginController = require("../controller/LoginController");

routes.get("/", LoginController.publicRoute);

module.exports = routes;