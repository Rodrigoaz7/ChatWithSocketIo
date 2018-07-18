const app = require('./config.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const controller = require(__dirname + '/app/controller/controllers.js');
const mongoose = require('mongoose');
require(__dirname + '/app/model/Message');
var Mensagem = mongoose.model("Mensagens");

//Doing routes here
app.get('/', controller.UserLogged, async function(req, res){
  const users = await controller.AllUsers(app, req, res);
  res.render(__dirname + '/app/views/home.ejs', {user: req.session, users: users});
});

app.get('/publico', controller.UserLogged, function(req, res){
	res.render(__dirname + '/app/views/index.ejs', {user: req.session});
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/app/views/login.html');
});

app.post('/login', function(req, res){
  controller.realizarLogin(app, req, res);
});

app.get('/cadastro', function(req, res){
  res.sendFile(__dirname + '/app/views/cadastro.html');
});

app.post('/cadastro', function(req, res){
  controller.cadastroUser(app, req, res);
});

var msgs = []; //buffer de mensagens privadas antigas entre dois users

app.get('/privado', controller.UserLogged, async function(req, res){
  console.log(req.query.rv + "    " + req.session.username);
  msgs = await Mensagem.find(
  {$or: 
      [{sender: req.session.username, reciever: req.query.rv, publica: false},
      {sender: req.query.rv, reciever: req.session.username, publica: false}
  ]});

  res.render(__dirname + '/app/views/privado.ejs', {user: req.session, reciever: req.query.rv});
});


io.on('connection', async function(socket){

  // Mensagens antigas publicas
  const mensagens_publicas = await Mensagem.find({publica: true});

  io.emit('old messages', mensagens_publicas); // carrega mensagens publicas publicas

  io.emit('old private messages', msgs);  //carrega mensagens privadas antigas

  // Salva nova mensagem publica
  socket.on('chat message', function(msg, sender, reciever){
    console.log(sender + "  " + msg + "  " + reciever);
    var newMessage = new Mensagem();
    newMessage.msg = msg;
    newMessage.sender = sender;
    newMessage.reciever = reciever;
    newMessage.publica = true;
    newMessage.save();

    socket.broadcast.emit('chat message', newMessage);
  });

  // Salva nova mensagem privada
  socket.on('chat send private message', function(msg, sender, reciever){
    console.log(sender + "  " + msg + "  " + reciever);
    var newMessage = new Mensagem();
    newMessage.msg = msg;
    newMessage.sender = sender;
    newMessage.reciever = reciever;
    newMessage.publica = false;
    newMessage.save();

    socket.broadcast.emit('chat send private message', newMessage);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});