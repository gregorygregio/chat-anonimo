var _randomSequence=function(length){
  sequencia=[];
  for(i=0;i<length;i++){
    sequencia.push(getRandomNumber());
  }

  return sequencia.join('');
}
var getRandomNumber=function(){
  return Math.floor((Math.random()*9)+1);
}

module.exports={
  randomSequence:_randomSequence
}
