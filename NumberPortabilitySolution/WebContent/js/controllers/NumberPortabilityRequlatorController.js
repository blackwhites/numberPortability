
app.controller('NumberPortabilityRegulatorCtrl', function ($scope, $http) {
		
	$scope.number = null;	
	$scope.providerOld = null;
	$scope.providerNew = null;
	
	$scope.clear = function(){
		$scope.number = null;		
		$scope.providerOld = null;
		$scope.providerNew = null;		
	};
	
	$scope.postRegulatorRequest = function (number) {
		
		$http({
		    //url:'https://32f40611-2ab2-44ac-a009-0ad81a0e1384-bluemix.cloudant.com/cloudantdb-mnp/'+number,
			url:'http://NodeJS-BCI01.mybluemix.net/getUserDetails?mobNo='+number,
			method: "Get"
			})
			.then(function (response) {
				if(response.data){
					var messageObj = JSON.parse(response.data);
					if(messageObj){
						var number=messageObj._id;
						var providerOld=messageObj.serviceProvider;
						var providerNew=messageObj.serviceProviderNew;
						window.location= '#/regulatorview/'+number+'/'+providerOld+'/'+providerNew;
					}	
				}
			},function (response) {	
				console.log("failed : ", response);
			});		
	};

});