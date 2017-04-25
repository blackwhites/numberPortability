app.controller('NumberPortabilityRequestSuccessCtrl',['$scope','details','$http','close', function ($scope, details,$http,close) {	  
		$scope.message = details.message;
		$scope.close = function(result) {
		 	  close(result, 500); // close, but give 500ms for bootstrap to animate		 	  
		};

}]);