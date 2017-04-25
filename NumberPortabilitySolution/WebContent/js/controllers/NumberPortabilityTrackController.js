
app.controller('NumberPortabilityTrackCtrl',['$scope' ,'$http','ModalService',function ($scope, $http,ModalService) {
	
	$scope.number = null;	
	$scope.providerOld = null;
	$scope.providerNew = null;
	
	
	$scope.clearTrackData = function(){
		$scope.number = null;		
		$scope.providerOld = null;
		$scope.providerNew = null;		
	};
	$scope.users= [];
	$http({
	    url:'https://NodeJS-BCI01.mybluemix.net/getWorkListByStatus?status=DonorApproved',
	    method: "Get"
		})
		.then(function (response) {	
			if (response.data){						
				var obj = JSON.parse(response.data);
				if(obj.docs){
					var messageObj = obj.docs;
					//var users = [];
					if(messageObj.length > 0){
		                for (var i = 0; i < messageObj.length; i++) {
		                	$scope.users.push({number:messageObj[i]._id,oldProvider:messageObj[i].serviceProvider,newProvider:messageObj[i].serviceProviderNew,status:'DonorApproved'});
		                }		                
					}
				}
				$http({
				    url:'https://NodeJS-BCI01.mybluemix.net/getWorkListByStatus?status=AcceptorApproved',
				    method: "Get"
					})
					.then(function (response) {	
						if (response.data){						
							var obj = JSON.parse(response.data);
							if(obj.docs){
								var messageObj = obj.docs;
								//var users = [];
								if(messageObj.length > 0){
					                for (var i = 0; i < messageObj.length; i++) {
					                	$scope.users.push({number:messageObj[i]._id,oldProvider:messageObj[i].serviceProvider,newProvider:messageObj[i].serviceProviderNew,status:'AcceptorApproved'});
					                }
					                
								}
							}
						}
					},function (response) {	
						console.log("failed : ", response);	
					});
			}
		},function (response) {	
			console.log("failed : ", response);	
		});
	
	
	
	var isClicked = false;
	
	$scope.trackRequest = function (number,providerOld,providerNew) {
		if(!isClicked){
			isClicked = true;
			var data = {
					mobNo: number,
					serviceProviderOld:providerOld,
					serviceProviderNew:providerNew
				};
			/*$http({
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
							if(message.Status != 'DonorApproved' && message.Status != 'AcceptorApproved'){
								ModalService.showModal({
								      templateUrl: "views/initiateRequestSuccess.htm",
								      controller: "NumberPortabilityRequestSuccessCtrl",
								      inputs:{
								    	  details:{
								    		  message:'Request not in Donor Approved status'
								    	  }
								      }
								    }).then(function(modal) {
								      isClicked =  false;
								      modal.element.modal();
								      modal.close.then(function(result) {
								    	  window.location='#/track';
								      });
								    });	
								isClicked =  false;
							}else{*/
								$http({		    
								    url:'https://nodejs-bci01.mybluemix.net/track',
								    method: "Get",
								    params: data
									})
									.then(function (response) {
										if(response.data){
											var obj = JSON.parse(response.data);
											if(obj.result){
												isClicked =  false;
												window.location= '#/confirmportability/'+number+'/'+providerOld+'/'+providerNew;
											}	
											isClicked =  false	;											
										}
									},function (response) {	
										console.log("failed : ", response);
										isClicked =  false;
									});
								/*}
						}else{
							ModalService.showModal({
							      templateUrl: "views/initiateRequestSuccess.htm",
							      controller: "NumberPortabilityRequestSuccessCtrl",
							      inputs:{
							    	  details:{
							    		  message:'No Data found for specified Number'
							    	  }
							      }
							    }).then(function(modal) {
							      modal.element.modal();
							      modal.close.then(function(result) {
							    	  window.location='#/track';
							      });
							    });	
							isClicked =  false;
						}
						
					}
				},function (response) {	
					console.log("failed : ", response);					
					isClicked =  false;
				});*/
		}
	};

}]);