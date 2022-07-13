const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const publicRoute = (req, res) => {
    //return res.render("index");
    res.status(200).json({ msg: "Bem vindo a API" });
};

const authRegister = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" });
    } else if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" });
    } else if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    } else if (!confirmpassword) {
        return res.status(422).json({ msg: "A confirmação da senha é obrigatória" });
    } else if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não batem!" });
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ msg: "E-mail já cadastrado!" });
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
        name,
        email,
        password: passwordHash
    });
    try {
        await user.save();
        res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde!" });
    }
};

module.exports = {
    publicRoute,
    authRegister
};