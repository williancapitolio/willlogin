const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const publicRoute = (req, res) => {
    return res.render("index");
    //res.status(200).json({ msg: "Bem vindo a API" });
};

const loginRoute = (req, res) => {
    return res.render("login");
    //res.status(200).json({ msg: "Bem vindo a API" });
};

const registerRoute = (req, res) => {
    return res.render("register");
    //res.status(200).json({ msg: "Bem vindo a API" });
};

const privateRoute = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, "-password");
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
    res.status(200).json({ user, userLogged: req.User });
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
        res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
        //return res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde!" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    } else if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha incorreta!" });
    }
    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id
            },
            secret,
            {
                //expiresIn: "1800s" // expires in 30min
                //expiresIn: "600s" // expires in 10min
                expiresIn: "60s" // expires in 1min
            }
        );
        res.status(200).json({ msg: "Autenticação realizada com sucesso!", auth: true, token });
        //return res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde!" });
    }
};

module.exports = {
    publicRoute,
    registerRoute,
    loginRoute,
    privateRoute,
    authRegister,
    loginUser
};