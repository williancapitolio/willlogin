const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(414).json({ msg: "Acesso negado!" })
    }
    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Token inválido!" });
    }
}

const publicRoute = (req, res) => {
    //return res.render("index");
    res.status(200).json({ msg: "Bem vindo a API" });
};

const privateRoute = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, "-password");
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
    res.status(200).json({ user });
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde!" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" });
    } else if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
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
        );
        res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro, tente novamente mais tarde!" });
    }
};

module.exports = {
    checkToken,
    publicRoute,
    privateRoute,
    authRegister,
    loginUser
};