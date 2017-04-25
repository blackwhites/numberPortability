
app.controller('NumberPortabilityRequestCtrl',['$scope','$routeParams','$http','ModalService','MessageSplit',  function ($scope, $routeParams,$http,ModalService,MessageSplit) {
	var data = {
			mobNo: $routeParams.number
	};
	var querydata = {
			mobNo: $routeParams.number,
			serviceProviderOld: $routeParams.providerOld,
			serviceProviderNew: $routeParams.providerNew
	};
	$scope.name = null;	
	$scope.number = null;	
	$scope.provider = null;
	$scope.ssn = null;
	$scope.portabilityIndicator = null;
	
	$scope.clear = function(){
		$scope.name = null;		
		$scope.number = null;		
		$scope.provider = null;
		$scope.ssn = null;
		$scope.portabilityIndicator = null;
	};
	
	var isClicked = false;
	$http({
	    url:'https://nodejs-bci01.mybluemix.net/query_EligibilityConfirmQuery?',
	    method: "Get",
	    params: data
		})
		.then(function (response) {	
			if (response.data)	{			
				//window.location= '#/donor/';
				var obj = JSON.parse(response.data);				
				//var messageObj = JSON.parse(obj.result.message);
				var messageObj = obj.result.message;
				$scope.name = messageObj.CustomerName;		
				$scope.number = messageObj.Number;		
				$scope.provider =messageObj.ServiceProvider;
				$scope.ssn = messageObj.SSNNumber;
				$scope.portabilityIndicator = messageObj.PortabilityIndicator;
			}

		},function (response) {	
			console.log("failed : ", response);

		});
	
	/*$http({
	    url:'https://nodejs-bci01.mybluemix.net/query_Query',
	    method: "Get",
	    params: querydata
		})
		.then(function (response) {	
			if (response.data){						
				var obj = JSON.parse(response.data);
				if(obj.result){
					//var message = JSON.parse(obj.result.message);
					var message = obj.result.message;
					$scope.oldData={
							provider:message.ServiceProviderOld,
							plan:message.Plan,
							serviceVal:message.ServiceValidity,
							ttBal:message.TalktimeBalance,
							smsBal:message.SMSbalance,
							dataBal:message.DataBalance				
					};
				}
			}
		},function (response) {	
			console.log("failed : ", response);					
			isClicked =  false;
		});*/
	
	
	$scope.postRequest = function (name,number,provider,ssn,portabilityIndicator) {
		if(!isClicked){
			isClicked = true;
			var data = {
				//customerName:name,
				mobNo: number,
				email: 'debojyoti.das@in.ibm.com',
				//serviceProviderOld: provider,
				//serviceProviderNew: 'Vodafone',
				//portabilityIndicator:portabilityIndicator
			};
			
			var headers={};//Call the services
			if(portabilityIndicator == 'true'){
				$http({
				    //url:'https://customerretention.mybluemix.net/sendemail?number=9231546718&email=neha.kedia@in.ibm.com',
					url:'https://nodejs-bci01.mybluemix.net/sendEmail?',
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
							    		  message:'Request Initiation Email Sent Successfully'
							    	  }
							      }
							    }).then(function(modal) {
							      modal.element.modal();
							      modal.close.then(function(result) {						    	  
							    	  window.location='#/';
							      });
							    });
							isClicked = false;
						}	
			
					},function (response) {	
						console.log("failed : ", response);
						isClicked = false;
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
				isClicked = false;
			}
		}
	
	};

}]);