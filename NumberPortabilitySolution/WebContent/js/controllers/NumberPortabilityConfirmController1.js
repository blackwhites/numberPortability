app.controller('NumberPortabilityConfirmCtrl',['$scope','$routeParams','$http', function ($scope, $routeParams,$http) {
	    $scope.TRUE= true;
	    $scope.FALSE=false;
		var data = {
		mobNo: $routeParams.number
		};
		
		//$http.get('https://nodejs-bci01.mybluemix.net/add?mobNo=9831242287&name=neha&place=kol&id=nehashah').then(function (response) {
		$http({
		    url: 'https://nodejs-bci01.mybluemix.net/get', 
		    method: "GET",
		    params: data
			})
			.then(function (response) {	
				if (response.data)				
					$scope.details = " Data Submitted and Retrieved Successfully! " + response.data.result.message;
					//$scope.mobNo=response.data.result.message[0];
					//$scope.name=response.data.result.message[1];
					//$scope.id=response.data.result.message[2];
					//$scope.place=response.data.result.message[3];
			}, function (response) {	
				$scope.msg = "Service not Exists";
				$scope.Services1="test service" + data.number;
				
				$scope.statusval = response.status;
				
				$scope.statustext = response.statusText;
				
				$scope.headers = response.headers();
	
			});

}]);