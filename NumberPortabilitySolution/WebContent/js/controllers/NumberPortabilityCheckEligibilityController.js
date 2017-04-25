
app.controller('NumberPortabilityCheckEligibilityCtrl', function ($scope, $http) {
		
	
	$scope.Number = null;
	
	$scope.clear = function(){
		$scope.Number = null;		
	};
	
	$scope.checkEligibility = function (Number) {	
		window.location= '#/request/'+Number
		/*var data = {
				mobNo: number
		};
		
		var headers={};//Call the services
		
		$http({
		    url:'https://nodejs-bci01.mybluemix.net/invoke_EligibilityConfirm?',
		    method: "Get",
		    params: data
			})
			.then(function (response) {	
				if (response.data)				
					window.location= '#/request/'+data.mobNo;
	
			},function (response) {	
				console.log("failed : ", response);
	
			});*/
	
	};
	
	$scope.checkEligibilityDonor = function (Number,oldProvider,newProvider) {	
		window.location= '#/requestdonor/'+Number+'/'+oldProvider+'/'+newProvider
	};

});