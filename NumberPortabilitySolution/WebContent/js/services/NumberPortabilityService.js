app.service('MessageSplit',function(){
	  this.split = function(message){
		  message = message.replace("{", '');
		  message = message.replace("}", '');
		  var messageObj = message.split(' ') ;
		  return messageObj
	  };
});


