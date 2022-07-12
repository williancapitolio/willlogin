require ("dotenv").config();

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const routes = require("./routes/routes");

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});