
app.controller('NumberPortabilityConfirmRequestCtrl',['$scope','$routeParams','$http','ModalService','MessageSplit',  function ($scope, $routeParams,$http,ModalService,MessageSplit) {
	var data = {
			mobNo: $routeParams.number
	};
	
	$http({
	    url:'https://nodejs-bci01.mybluemix.net/query_EligibilityConfirmQuery?',
	    method: "Get",
	    params: data
		})
		.then(function (response) {	
			if (response.data)	{			
				var obj = JSON.parse(response.data);				
				var messageObj = obj.result.message;
				$scope.name = messageObj.CustomerName;		
				$scope.number = messageObj.Number;		
				$scope.provider =messageObj.ServiceProvider;
				$scope.ssn = messageObj.SSNNumber;
				$scope.portabilityIndicator = messageObj.PortabilityIndicator;
				var data = {
						customerName:messageObj.CustomerName,
						mobNo: messageObj.Number,
						ssnNumber: messageObj.SSNNumber,
						serviceProviderOld: messageObj.ServiceProvider,
						serviceProviderNew: 'Vodafone',
						portabilityIndicator:messageObj.PortabilityIndicator
					};
				if(data.portabilityIndicator == 'true'){
					$http({
					    url:'https://nodejs-bci01.mybluemix.net/invoke_ConfirmationOfMNPRequest',
					    method: "Get",
					    params: data
						})
						.then(function (response) {	
							if (response.data){
								ModalService.showModal({
								      templateUrl: "views/initiateRequestSuccess.htm",
								      controller: "NumberPortabilityRequestSuccessCtrl",
								      inputs:{
								    	  details:{
								    		  message:'Request Initiated Successfully'
								    	  }
								      }
								    }).then(function(modal) {
								      modal.element.modal();
								      modal.close.then(function(result) {						    	  
								    	  window.location='#/';
								      });
								    });
							}	
				
						},function (response) {	
							console.log("failed : ", response);
						});
				}else{
					ModalService.showModal({
					      templateUrl: "views/initiateRequestSuccess.htm",
					      controller: "NumberPortabilityRequestSuccessCtrl",
					      inputs:{
					    	  details:{
					    		  message:'Request for Portability cannot be initiated as Portability is not allowed for the specified number'
					    	  }
					      }
					    }).then(function(modal) {
					      modal.element.modal();
					      modal.close.then(function(result) {						    	  
					    	  window.location='#/';
					      });
					    });
				}
			}

		},function (response) {	
			console.log("failed : ", response);

		});

}]);