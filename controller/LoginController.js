const publicRoute = (req, res) => {
    //return res.render("index");
    res.status(200).json({ msg: "Bem vindo a API" });
};

const authRegister = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" })
    }
};

module.exports = {
    publicRoute,
    authRegister
};