
    myApp.controller('ChatCtrl',function($scope,$http){
        $scope.mensagens=[];
        var socket = io();
        var userMe={};
        $scope.enviar=function(myMsg){
          socket.emit("mensagem",{msg:myMsg,user:userMe.id});
          $scope.mensagens.push(createMessage(0,"You",myMsg,"texto"));
          $('#dialogo').animate({
              scrollTop: $('#dialogo').get(0).scrollHeight
          }, 1500);
          $scope.myMsg='';
        };

        socket.on('mensagem',function(serverMsg){
          $scope.mensagens.push(createMessage(serverMsg.user,"Anon"+serverMsg.user,serverMsg.msg,"msgOrdinaria"));
          $scope.$apply();
        });

        socket.on('Conectado',function(myId){
          userMe.id=myId;
        });

        socket.on('serverMensagem',function(serverMsg){
          $scope.mensagens.push(createMessage(0,"Servidor",serverMsg,"msgServidor"));
          $scope.$apply();
        });
        socket.on('privateMsg',function(privateMsg){
          $scope.mensagens.push(createMessage(privateMsg.user,"Anon"+privateMsg.user,privateMsg.msg,"msgPrivada"));
          $scope.$apply();
        });
        socket.on('digitando',function(){
          $scope.digitando=true;
          $scope.$apply();
        });
        socket.on('stopDigitando',function(){
          $scope.digitando=false;
          $scope.$apply();
        });
        socket.on('error',function(){
          console.log("Server desconectado");
        })

        $scope.privadoTo=function(nick,myMsg){
          if(myMsg===undefined) myMsg="";
          $scope.myMsg="/"+nick+" "+myMsg;
          document.getElementById('msg-input').focus();
        };
        $scope.digitando=false;

        var cores=["red","blue","yellow","green","lightblue","pink","purple","darkred","lightgreen","brown","darkgrey"]
        $scope.userColor=function(numb){
          if(numb>10) {
            numb=(numb%10)+1;
          }
          var cor=cores[numb];
          return {"color":cor};
        }

        $scope.sendDigitando=function(){
          socket.emit('digitando');
        }

        // $scope.carregarImagem=function(){
        //   var fr=new FileReader()
        //   fr.onload=function(content){
        //     io.emit('imagem',content);
        //   }
        //   fr.readAsBinaryString(document.getElementById('imagem').files[0]);
        // }

    });
