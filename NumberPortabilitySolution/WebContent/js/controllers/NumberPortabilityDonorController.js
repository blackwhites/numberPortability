
app.controller('NumberPortabilityDonorCtrl',['$scope','$http','ModalService','MessageSplit', function ($scope, $http,ModalService,MessageSplit) {	
	$scope.number = null;
	$scope.oldprovider = null;
	$scope.approveResult={
		status:false,
		value:'InitiationConfirmed'
	};
	$scope.clear = function(){
		$scope.number = null;	
		$scope.oldprovider = null;		
	};
	$http({
	    //url:'https://NodeJS-BCI01.mybluemix.net/getWorkListByStatus?status=InitiationConfirmed',
		url:'https://NodeJS-BCI01.mybluemix.net/getWorkListByStatus?status=InitiationConfirmed',
	    method: "Get"
		})
		.then(function (response) {	
			if (response.data){						
				var obj = JSON.parse(response.data);
				if(obj.docs){
					var messageObj = obj.docs;
					var users = [];
					if(messageObj.length > 0){
		                for (var i = 0; i < messageObj.length; i++) {
		                	users.push({number:messageObj[i]._id,oldProvider:messageObj[i].serviceProvider,newProvider:messageObj[i].serviceProviderNew,status:'InitiationConfirmed'});
		                }
		                $scope.users= users;
					}
				}
			}
		},function (response) {	
			console.log("failed : ", response);	
		});
	
	isClicked = false;
	//$scope.showApproveReject = function(id,number,oldProvider,newProvider,plan,serviceVal,ttBal,smsBal,dataBal) {
	$scope.showApproveReject = function(id,number,oldProvider,newProvider) {
		if(!isClicked){
			isClicked = true;
			var data = {		
				mobNo: number,
				serviceProviderOld: oldProvider,
				serviceProviderNew: newProvider,
				//plan:plan,
	        	//talktimeBal:ttBal,
	        	//serviceValidity:serviceVal,
	        	//smsBal:smsBal,
	        	//dataBal:dataBal,
	        	id:id
			};
					
			var headers={};//Call the services
			 ModalService.showModal({
			      templateUrl: "views/usageDetails.htm",
			      controller: "NumberPortabilityUsageDetailsCtrl",
		    	  inputs: {
		    	        details: {
		    	        	/*number:message.Number,
		    	        	oldprovider:message.ServiceProviderOld,
		    	        	newprovider:message.ServiceProviderNew,					    	        	
		    	        	plan:message.Plan,
		    	        	talktimeBal:message.TalktimeBalance,
		    	        	serviceValidity:message.ServiceValidity,
		    	        	smsBal:message.SMSbalance,
		    	        	dataBal:message.DataBalance,*/
		    	        	number:data.mobNo,
		    	        	oldprovider:data.serviceProviderOld,
		    	        	newprovider:data.serviceProviderNew,
		    	        	plan:'PlanA',
		    	        	talktimeBal:'200',
		    	        	serviceValidity:'30',
		    	        	smsBal:'150',
		    	        	dataBal:'225',
		    	        	id:data.id
		    	        	/*number:'9231546719',
		    	        	provider:'Airtel',
		    	        	plan:'PlanA',
		    	        	talktimeBal:'34',
		    	        	serviceValidity:'30',
		    	        	smsBal:'5',
		    	        	dataBal:'50'*/
		    	        }
		    		  //details:data
		    	  }
			    }).then(function(modal) {
			      modal.element.modal();
			      modal.close.then(function(result) {
			        $scope.approveResult = result;
			      });
			    });
			/*
			$http({
			    url:'https://nodejs-bci01.mybluemix.net/query_Query',
			    method: "Get",
			    params: data
				})
				.then(function (response) {	
					if (response.data){
						
						var obj = JSON.parse(response.data);
						if(obj.result){
							var message = JSON.parse(obj.result.message);
							//var messageObj = MessageSplit.split(obj.result.message);				
						//var url = '#/usagedetails/'+messageObj[0]+'/'+messageObj[1]+'/'+messageObj[2]+'/'+messageObj[3]+'/'+messageObj[4]+'/'+messageObj[5]+'/'+messageObj[6];
						//var url = '#/usagedetails/'+'9231546719'+'/'+'Airtel'+'/'+'PlanA'+'/'+'30'+'/'+'44'+'/'+'20'+'/'+'45';
						//window.location= url;
						
						}
						isClicked = false;
					}
				},function (response) {	
					console.log("failed : ", response);
		
				});*/
			}
		  };
		 
}]);