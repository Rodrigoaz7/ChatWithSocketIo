const app = require('./config.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const controller = require(__dirname + '/app/controller/controllers.js');
const mongoose = require('mongoose');
require(__dirname + '/app/model/Message');
var Mensagem = mongoose.model("Mensagens");

//Doing routes here
app.get('/', controller.UserLogged, function(req, res){
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

io.on('connection', async function(socket){
  //console.log('Um user se conectou');
  //socket.on('disconnect', function(){
  //  console.log('user disconnected');
  //});
  // socket.on('chat message', function(msg){
  //   console.log('message: ' + msg);
  // });
  //socket.broadcast.emit('hi');//emite para todos, menos pra um em especial

  const mensagens = await Mensagem.find();
  io.emit('old messages', mensagens); // emite mensagem para todos, incluindo o cara que enviou

  socket.on('chat message', function(msg, sender, reciever){
    console.log(sender + "  " + msg + "  " + reciever);
    var newMessage = new Mensagem();
    newMessage.msg = msg;
    newMessage.sender = sender;
    newMessage.reciever = reciever;
    newMessage.save();

    socket.broadcast.emit('chat message', newMessage);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});