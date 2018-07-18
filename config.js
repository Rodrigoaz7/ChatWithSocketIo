//  Importando o módulo do express.
const express = require('express');
//  Importando o bodyParser.
const bodyParser = require('body-parser');
//  Importando o módulo express-session.
const expressSession = require('express-session');
//  Importando o módulo do express-validation.
const expressValidator = require('express-validator');

const mongoose = require('mongoose');
//  Conecta com o banco de dados e lida com problemas de conexão
mongoose.connect("mongodb://localhost:27017/db_chat");
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error',err => {
	console.log(`🙅 🚫 → ${err.message}`);
});

//  Iniciando objeto do express.
const load = require('express-load');
const path = require('path');
//Precisamos o module.exports para retornarmos qualquer modulo a outro lugar do projeto
var app = express();

//  Configurando o middleware do express.static.
app.use(express.static(path.join(__dirname, '../app/public/')));
//Configurando o middleware do body-parser.
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//  Configurando o middleware do express-session.
app.use(expressSession({
	secret: "chave",
	resave: false,
	saveUninitialized: false
}));

//  Configurando o middleware do express-validator.
app.use(expressValidator());

app.set('view engine', 'ejs');
app.set('views','./app/views/');

// Carregamento automatico com express-load
load('routes', {cwd : 'app'})
	.then('app/views')
	.then('app/model')
	.then('app/controller')
	.into(app);

module.exports = app;