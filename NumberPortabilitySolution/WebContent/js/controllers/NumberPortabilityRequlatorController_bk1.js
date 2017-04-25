
app.controller('NumberPortabilityRegulatorCtrl', function ($scope, $http) {
		
	$scope.number = null;	
	$scope.providerOld = null;
	$scope.providerNew = null;
	
	$scope.clear = function(){
		$scope.number = null;		
		$scope.providerOld = null;
		$scope.providerNew = null;		
	};
	
	$scope.postRegulatorRequest = function (number,providerOld,providerNew) {		
		window.location= '#/regulatorview/'+number+'/'+providerOld+'/'+providerNew;
	};

});