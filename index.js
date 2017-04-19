var express=require('express');
var app =express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');
var command=require('./command.js');
var fs=require('fs');
var random=require('./randomNumber.js')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/downloadImage/*',function(req,res){
  var imagem=req.path.split('/').pop();

  res.download(__dirname + '/temp/'+imagem,imagem,function(err){
    if(err){
      io.emit('serverMensagem',"A imagem "+imagem+" não existe mais")
    }
  })
})
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

  socket.on('imagem',function(file){

    var name=random.randomSequence(32)+"."+file.ext;
    var path=__dirname+"/temp/"+name;
    fs.open(path,"a",0755,function(err,fd){

      if(err){
        console.log(err);
      }
      else{
        fs.write(fd,file.data,null,"Binary",function(err,writen){
            if(err){
              console.log(err);
            }else{
              socket.broadcast.emit('imagemEnviada',{user:file.user,name:name})
              setTimeout(function(){
                fs.unlink(path);
              },1000*60*60)
            }
        })
      }

    });

  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
