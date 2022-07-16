const jwt = require("jsonwebtoken");
const { primisify, promisify } = require("util");
const User = require("../models/User");

async function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(414).json({ msg: "Acesso negado!" });
    }
    try {
        const secret = process.env.SECRET;
        //jwt.verify(token, secret);
        const decode = await promisify(jwt.verify)(token, secret);
        req.User = decode.id;
        //localStorage.setItem('userData', JSON.stringify(token));
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Token inválido!" });
    }
};

module.exports = {
    checkToken
};