const publicRoute = (req, res) => {
    //return res.render("index");
    res.status(200).json({msg: 'Bem vindo a API'});
};

module.exports = {
    publicRoute
};