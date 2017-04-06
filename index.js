var express=require('express');
var app =express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');
var command=require('./command.js');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/chat.html');
});

var connections={freeIds:[]};

io.on('connection', function(socket){
  if(connections.freeIds.length===0){
    var userNumber=Object.keys(connections).length;
  }else{
    var userNumber=connections.freeIds.shift();
  }
  socket.emit("Conectado",userNumber);
  io.emit('serverMensagem',"Anon"+userNumber+" conectado");

  connections[userNumber]=socket;

  socket.on('disconnect', function(){
    var user=0;
    Object.keys(connections).forEach(function(conn){
      if(connections[conn]===socket){
        user=conn;
        delete connections[conn];
        connections.freeIds.push(conn);
      }
    });
    io.emit('serverMensagem',"Anon"+user+" desconectado");
  });

  socket.on('mensagem',function(incomingMessage){
      if(incomingMessage.msg.indexOf('/')===0){
        command.run(incomingMessage,connections);
        return;
      }
		  socket.broadcast.emit('mensagem',incomingMessage);
	});
  var a=setTimeout();
  socket.on('digitando',function(){
    clearTimeout(a);
    socket.broadcast.emit('digitando');
    a=setTimeout(function(){
      socket.broadcast.emit('stopDigitando');
    },1000);

  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
