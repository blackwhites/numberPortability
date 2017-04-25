
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
				var messageObj = JSON.parse(obj.result.message);
				$scope.name = messageObj.CustomerName;		
				$scope.number = messageObj.Number;		
				$scope.provider ="Airtel";
				$scope.ssn = messageObj.SSNNumber;
				//$scope.portabilityIndicator = messageObj.PortabilityIndicator;
				$scope.portabilityIndicator = true;
			}

		},function (response) {	
			console.log("failed : ", response);

		});
	
	$http({
	    url:'https://nodejs-bci01.mybluemix.net/query_Query',
	    method: "Get",
	    params: querydata
		})
		.then(function (response) {	
			if (response.data){						
				var obj = JSON.parse(response.data);
				if(obj.result){
					var message = JSON.parse(obj.result.message);
					$scope.oldData={
							/*provider:message.ServiceProviderOld,
							plan:message.Plan,
							serviceVal:message.ServiceValidity,
							ttBal:message.TalktimeBalance,
							smsBal:message.SMSbalance,
							dataBal:message.DataBalance	*/	
							provider:'Airtel',
							plan:'PlanA',
							serviceVal:'30',
							ttBal:'100',
							smsBal:'25',
							dataBal:'200'
					};
				}
			}
		},function (response) {	
			console.log("failed : ", response);					
			isClicked =  false;
		});
	
	
	$scope.postRequest = function (name,number,provider,ssn,portabilityIndicator) {
		if(!isClicked){
			isClicked = true;
			var data = {
				customerName:name,
				mobNo: number,
				ssnNumber: ssn,
				serviceProviderOld: provider,
				serviceProviderNew: 'Vodafone',
				portabilityIndicator:portabilityIndicator
			};
			
			var headers={};//Call the services
			if(portabilityIndicator == 'true'){
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