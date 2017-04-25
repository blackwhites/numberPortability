app.controller('NumberPortabilityRegViewCtrl',['$scope','$routeParams','$http','ModalService','MessageSplit', function ($scope, $routeParams,$http,ModalService,MessageSplit) {
	    var regulatordata = {
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

		$scope.user={
				name:null,
				provider:null,
				ssn:null,
				portabilityIndicator:null,
				status:null			
		};

		
		$scope.number = null;
		
		$http({
		    url:'https://nodejs-bci01.mybluemix.net/invoke_RegulatorQuery',
			method: "Get",
		    params: regulatordata
			})
			.then(function (response) {
				if(response.data){
					var obj = JSON.parse(response.data);
					if(obj.result){
						var messageObj = JSON.parse(obj.result.message);
						$scope.number=messageObj.Number;
						$scope.status=messageObj.Status;
						if(messageObj.Status == 'InitiationConfirmed'){
							$scope.user={
									name:messageObj.CustomerName,
									provider:messageObj.ServiceProviderOld,
									ssn:messageObj.SSNNumber,
									portabilityIndicator:messageObj.PortabilityIndicator											
							};
						}else if(messageObj.Status == 'DonorApproved'){
							$scope.oldData={
									provider:messageObj.ServiceProviderOld,
									newprovider:messageObj.ServiceProviderNew,
									plan:messageObj.Plan,
									ttBal:messageObj.TalktimeBalance,
									dataBal:messageObj.DataBalance,
									smsBal:messageObj.SMSbalance,
									serviceVal:messageObj.ServiceValidity				
							};
						}else{
							$scope.oldData={
									provider:messageObj.ServiceProviderOld,
									newprovider:messageObj.ServiceProviderNew,
									plan:messageObj.PlanOld,
									ttBal:messageObj.TalktimeBalanceOld,
									dataBal:messageObj.DataBalanceOld,
									smsBal:messageObj.SMSbalanceOld,
									serviceVal:messageObj.ServiceValidityOld				
							};
							$scope.newData={
									provider:messageObj.ServiceProviderNew,
									plan:messageObj.PlanNew,
									ttBal:messageObj.TalktimeBalanceNew,
									dataBal:messageObj.DataBalanceNew,
									smsBal:messageObj.SMSbalanceNew,
									serviceVal:messageObj.ServiceValidityNew				
							};
						}
					}else{
						ModalService.showModal({
						      templateUrl: "views/initiateRequestSuccess.htm",
						      controller: "NumberPortabilityRequestSuccessCtrl",
						      inputs:{
						    	  details:{
						    		  message:'No Data Found for the Input Customer Number: '+$routeParams.number
						    	  }
						      }
						    }).then(function(modal) {
						      modal.element.modal();
						      modal.close.then(function(result) {						    	  
						    	  window.location='#/regulator';
						      });
						    });
					}
				}
			},function (response) {	
				console.log("failed : ", response);			
	
			});
		

}]);