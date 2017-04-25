app.controller('NumberPortabilityUsageDetailsCtrl',['$scope','details','$http','close', function ($scope, details,$http,close) {
	    var userData = {
			mobNo: details.number,
			serviceProviderOld: details.oldprovider,
			serviceProviderNew: details.newprovider,
			plan: details.plan,
			serviceValidity: details.serviceValidity,
			talktimeBalance: details.talktimeBal,
			smsBalance: details.smsBal,
			dataBalance: details.dataBal		
		};
	    
	    $scope.number= details.number;
		$scope.provider= details.oldprovider;
		$scope.plan= details.plan;
		$scope.serviceValidity= details.serviceValidity;
		$scope.talktimeBalance= details.talktimeBal;
		$scope.smsBalance=details.smsBal;
		$scope.dataBalance= details.dataBal;		
		
		var isClicked = false;
		
	    $scope.postUsageDetailsRequest = function () {
	    	if(!isClicked){
		    	isClicked = true;
		    	$http({
				    url: 'https://nodejs-bci01.mybluemix.net/invoke_UsageDetailsFromDonorCSP', 
				    method: "GET",
				    params: userData
					})
					.then(function (response) {	
						if (response.data){
							var obj = JSON.parse(response.data);
							if(obj.result){
								isClicked = false;
								close({status:true,value:'DonorApproved',id:details.id},500);
							}else{
								ModalService.showModal({
								      templateUrl: "views/initiateRequestSuccess.htm",
								      controller: "NumberPortabilityRequestSuccessCtrl",
								      inputs:{
								    	  details:{
								    		  message:'Request not in InitiatedRequest status'
								    	  }
								      }
								    }).then(function(modal) {
								      modal.element.modal();
								      modal.close.then(function(result) {
								    	  window.location='#/track';
								      });
								    });	
							}
						}
					}, function (response) {	
						console.log("failed : ", response);
						ModalService.showModal({
						      templateUrl: "views/initiateRequestSuccess.htm",
						      controller: "NumberPortabilityRequestSuccessCtrl",
						      inputs:{
						    	  details:{
						    		  message:'No Data found'
						    	  }
						      }
						    }).then(function(modal) {
						      modal.element.modal();
						      modal.close.then(function(result) {
						    	  window.location='#/track';
						      });
						    });	
						isClicked = false;
					});
	    	}
		};
		
		$scope.rejectRequest = function () {
	    	if(!isClicked){
		    	isClicked = true;
		    	close({status:true,value:'DonorRejected'},500);
		    	isClicked = false;
	    	}
		};
		
		$scope.close = function(result) {
		 	  close(result, 500); // close, but give 500ms for bootstrap to animate
		};

}]);