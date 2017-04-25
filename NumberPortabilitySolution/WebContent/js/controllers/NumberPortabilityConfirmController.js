app.controller('NumberPortabilityConfirmCtrl',['$scope','$routeParams','$http','ModalService','MessageSplit', function ($scope, $routeParams,$http,ModalService,MessageSplit) {
	    var data = {
			mobNo: $routeParams.number,
			serviceProviderOld:$routeParams.providerOld,
			serviceProviderNew:$routeParams.providerNew
		};
		$scope.oldData={
				provider:null,
				plan:null,
				ttBal:null,
				dataBal:null,
				smsBal:null,
				serviceVal:null				
		};
		$scope.newData={
				provider:null,
				plan:null,
				ttBal:null,
				dataBal:null,
				smsBal:null,
				serviceVal:null				
		};

		$scope.number = null;
		
		$http({		    
		    url:'https://nodejs-bci01.mybluemix.net/track',
		    method: "Get",
		    params: data
			})
			.then(function (response2) {
				var obj = JSON.parse(response2.data);
				var message = JSON.parse(obj.result.message);
				
				//var messageObj = MessageSplit.split(obj.result.message);
				$scope.number=message.Number;					
				$scope.oldData={
						provider:message.ServiceProviderOld,
						plan:message.PlanOld,
						serviceVal:message.ServiceValidityOld,
						ttBal:message.TalktimeBalanceOld,
						smsBal:message.SMSbalanceOld,
						dataBal:message.DataBalanceOld				
				};
				$scope.newData={
						provider:message.ServiceProviderNew,
						plan:message.PlanNew,
						serviceVal:message.ServiceValidityNew,
						ttBal:message.TalktimeBalanceNew,
						smsBal:message.SMSbalanceNew,
						dataBal:message.DataBalanceNew				
				};
			},function (response) {	
				console.log("failed : ", response);	
		});
		
		var isClicked = false;
		
		$scope.acceptPortability = function () {
			if(!isClicked){
				isClicked = true;
				var data ={
						mobNo:$scope.number,
						serviceProviderOld:$scope.oldData.provider,
						serviceProviderNew:$scope.newData.provider,
						planOld:$scope.oldData.plan,
						planNew:$scope.newData.plan,
						serviceValidityOld:$scope.oldData.serviceVal,
						serviceValidityNew:$scope.newData.serviceVal,
						talktimeBalanceOld:$scope.oldData.ttBal,
						talktimeBalanceNew:$scope.newData.ttBal,
						dataBalanceOld:$scope.oldData.dataBal,
						dataBalanceNew:$scope.newData.dataBal,
						smsBalanceOld:$scope.oldData.smsBal,
						smsBalanceNew:$scope.newData.smsBal,
						customerAcceptance:true					
				};
				$http({
				    url:'https://nodejs-bci01.mybluemix.net/invoke_UserAcceptance',
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
							    		  message:'Portability Request Completed Successfully'
							    	  }
							      }
							    }).then(function(modal) {
							      modal.element.modal();
							      modal.close.then(function(result) {
							    	  window.location='#/track';
							      });
							    });
							
						}	
						isClicked = false;
							//window.location= '#/success';
			
					},function (response) {	
						console.log("failed : ", response);
						isClicked = false;
			
				});	
			}
		};
		
		$scope.rejectPortability = function () {
			if(!isClicked){
				isClicked = true;
				var data ={
						mobNo:$scope.number,
						serviceProviderOld:$scope.oldData.provider,
						serviceProviderNew:$scope.newData.provider,
						planOld:$scope.oldData.plan,
						planNew:$scope.newData.plan,
						serviceValidityOld:$scope.oldData.serviceVal,
						serviceValidityNew:$scope.newData.serviceVal,
						talktimeBalanceOld:$scope.oldData.ttBal,
						talktimeBalanceNew:$scope.newData.ttBal,
						dataBalanceOld:$scope.oldData.dataBal,
						dataBalanceNew:$scope.newData.dataBal,
						smsBalanceOld:$scope.oldData.smsBal,
						smsBalanceNew:$scope.newData.smsBal,
						customerAcceptance:false					
				};
				$http({
				    url:'https://nodejs-bci01.mybluemix.net/invoke_UserAcceptance',
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
							    		  message:'Portability Request Cancelled'
							    	  }
							      }
							    }).then(function(modal) {
							      modal.element.modal();
							      modal.close.then(function(result) {
							    	  window.location='#/track';
							      });
							    });
							
						}	
						isClicked = false;
							//window.location= '#/success';
			
					},function (response) {	
						console.log("failed : ", response);
						isClicked = false;
			
				});	
			}
		};
		


}]);