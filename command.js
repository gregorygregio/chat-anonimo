

var _run=function(linha,connections){
  var fimDoComando=linha.msg.indexOf(" ");
  if(fimDoComando===-1){
    var comando = linha.msg.slice(1);
  }else{
    var comando = linha.msg.slice(1,fimDoComando);
  }

  switch (true){
    case ((/Anon[0-9]/).test(comando)): enviarMsgPrivada(linha,connections);
      break;
    case ((/usersonline/).test(comando)):contarUsuarios(linha,connections);
      break;
    case ((/help/).test(comando)):exibirHelp(linha,connections);
      break;
    default: exibirHelp(linha,connections);
  }
};

var exibirHelp=function(msg,connections){
    var fs = require('fs');
    var content=fs.readFileSync("./public/help.json");
    content=JSON.parse(content);
    var mensagem="COMANDOS<br>"
    Object.keys(content).forEach(function(key){
      mensagem+=key+" :  "+content[key]+"<br>";
    });
    connections[msg.user].emit('serverMensagem',mensagem);
}

var contarUsuarios=function(msg,connections){
    var count=Object.keys(connections).length-1;
    connections[msg.user].emit('serverMensagem',count+" usuários online");
}
var enviarMsgPrivada=function(Message,connections){
  var user=Message.msg.slice(5,Message.msg.indexOf(" "));
  connections[user].emit('privateMsg',{user:Message.user,msg:Message.msg.slice(7)})
  return;
}

module.exports={
  run:_run
};
