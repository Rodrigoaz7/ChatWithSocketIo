const mongoose = require('mongoose');

require('./../model/Message');
require('./../model/Usuario');

var Usuario = mongoose.model("Usuarios");
var Mensagem = mongoose.model("Mensagens");


exports.cadastroUser = (application, req, res, next) => {

    req.assert('nome', 'O seu nome não pode ser vazio').notEmpty();
    req.assert('username', 'O username não pode ser vazio.').notEmpty();
    req.assert('senha', 'A senha não pode ser vazia.').notEmpty();
    //console.log(req.files);

    const erros = req.validationErrors();
    if(erros){
        res.status(400).json({erros:erros});
        return;
    }

    const buscaUsuarios = Usuario.find({username:req.body.username}, function(err, user) {
        if(user.length > 0){
            const erroUsuario = [{msg: "Usuário já cadastrado com esse email."}];
            return res.status(400).json({ erros: erroUsuario});
        } else {
            const novoUsuario = new Usuario(req.body);
            novoUsuario.save();

            return res.status(200).json({ sucesso: true, msg: "Usuário criado com sucesso." });
        }
    });
}

exports.realizarLogin = (application, req, res) => {

    req.assert('username', 'O username não pode ser vazio.').notEmpty();
    req.assert('senha', 'A senha não pode ser vazia.').notEmpty();

    const erros = req.validationErrors();
    if (erros) {
        res.status(500).json({ erros: erros });
        return;
    }

    const buscaUsuarios = Usuario.findOne({username:req.body.username, senha:req.body.senha}, function(err, user) {
        if(err){
            return res.status(500).json({erros:err});
        } else if(user == null){
            console.log("usuario nao existe  < < < ******");
            const erroUsuario = [{ status: false, msg: "Usuário ou senha inválidos" }];
            return res.status(500).json({erros:erroUsuario});
        } else {
            req.session.loggedUser = true;
            req.session.nome = user.nome;
            req.session.username = user.username;
            return res.status(200).json({ status: true, tipo: "usuarios", msg: "Login autorizado" });
        }
    });
};

exports.UserLogged = (req,res, next) =>{
    if (!req.session.loggedUser) {
        res.redirect('/login');
        return;
    }
    return next();
}

exports.sair = (application, req, res) => {
    req.session.destroy( err => {
        res.redirect('/');
    });
};
