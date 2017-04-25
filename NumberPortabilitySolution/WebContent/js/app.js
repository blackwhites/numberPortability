var app = angular.module('NumberPortabilityApp', ['angularModalService','ngRoute']);
app.config(function ($routeProvider) { 
	  $routeProvider 
	    .when('/', { 
	      controller: 'NumberPortabilityCheckEligibilityCtrl',
	      templateUrl: 'views/CheckEligibility.htm',
	      bgColor: '#325c80',
    	  pageColor: 'white',
	      logo: 'IBM_logo_white.png',
	      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	      blockcsshref:'css/blockchain.css'
	    }) 	
	    .when('/checkEligibilityDonor', { 
	      controller: 'NumberPortabilityCheckEligibilityCtrl',
	      templateUrl: 'views/CheckEligibilityDonor.htm',
	      bgColor: '#e68a00',
    	  pageColor: 'white',
	      logo: 'IBM_logo.png',
	      csshref:'css/donorbootstrap.min.css',
	      blockcsshref:'css/donorblockchain.css'
	    }) 	
	    .when('/regulator', { 
		      controller: 'NumberPortabilityRegulatorCtrl',
		      templateUrl: 'views/regulatorQuery.htm',
		      bgColor: '#0069cc',
		      pageColor: 'white',
		      logo: 'IBM_logo_blue.png',
		      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
		      blockcsshref:'css/blockchain.css'
		   })		      
	  .when('/donor', { 
	      controller: 'NumberPortabilityDonorCtrl',
	      templateUrl: 'views/donor.htm',
	      bgColor: '#e68a00',
    	  pageColor: 'white',
	      logo: 'IBM_logo.png',
	      csshref:'css/donorbootstrap.min.css',
	      blockcsshref:'css/donorblockchain.css'
	   }) 
	   .when('/track', { 
		      controller: 'NumberPortabilityTrackCtrl',
		      templateUrl: 'views/track.htm',
		      bgColor: '#325c80',
	    	  pageColor: 'white',
		      logo: 'IBM_logo_white.png',
		      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
		      blockcsshref:'css/blockchain.css'
		   })
	   .when('/success', {
	      templateUrl: 'views/portabilitySuccess.htm',
	      bgColor: '#325c80',
    	  pageColor: 'white',
	      logo: 'IBM_logo_white.png',
	      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	      blockcsshref:'css/blockchain.css'
	   })
	    .when('/request/:number', { 
	      controller: 'NumberPortabilityRequestCtrl',
	      templateUrl: 'views/request.htm',
	      bgColor: '#325c80',
    	  pageColor: 'white',
	      logo: 'IBM_logo_white.png',
	      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	      blockcsshref:'css/blockchain.css'
	    })
	    .when('/confirmrequest/:number', { 
	      controller: 'NumberPortabilityConfirmRequestCtrl',
	      templateUrl: 'views/confirmrequest.htm',
	      bgColor: '#325c80',
    	  pageColor: 'white',
	      logo: 'IBM_logo_white.png',
	      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	      blockcsshref:'css/blockchain.css'
	    })
	    .when('/requestdonor/:number/:providerOld/:providerNew', { 
		      controller: 'NumberPortabilityRequestCtrl',
		      templateUrl: 'views/requestdonor.htm',
		      bgColor: '#e68a00',
	    	  pageColor: 'white',
		      logo: 'IBM_logo.png',
		      csshref:'css/donorbootstrap.min.css',
		      blockcsshref:'css/donorblockchain.css'
		    })
	   .when('/regulatorview/:number/:providerOld/:providerNew', { 
	      controller: 'NumberPortabilityRegViewCtrl',
	      templateUrl: 'views/regulatorView.htm',
    	  bgColor: '#0069cc',
    	  pageColor: 'white',
	      logo: 'IBM_logo_blue.png',
	      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	      blockcsshref:'css/blockchain.css'
	   })
	   .when('/confirmportability/:number/:providerOld/:providerNew', { 
	      controller: 'NumberPortabilityConfirmCtrl',
	      templateUrl: 'views/confirmportability.htm',
	      bgColor: '#325c80',
    	  pageColor: 'white',
	      logo: 'IBM_logo_white.png',
	      csshref:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	      blockcsshref:'css/blockchain.css'
	   })
	   .when('/usagedetails/:number/:provider/:plan/:serviceValidity/:talktimeBal/:smsBal/:dataBal', { 
		      controller: 'NumberPortabilityUsageDetailsCtrl',
		      templateUrl: 'views/usageDetails.htm',
	    	  bgColor: 'black',
	    	  pageColor: '#e0e0d1',
		      logo: 'IBM_logo.png',
		      csshref:'css/donorbootstrap.min.css',
		      blockcsshref:'css/blockchain.css'
		   })		    
	    .otherwise({ 
	      redirectTo: '/' 
	    });
	});

app.run(function($rootScope) {
	$rootScope.$on("$routeChangeSuccess", function(event,currentRoute, previousRoute){
		$rootScope.pageColor = currentRoute.pageColor;
	    $rootScope.bgColor = currentRoute.bgColor;
	    $rootScope.logo = currentRoute.logo;
	    $rootScope.csshref=currentRoute.csshref;
	    $rootScope.blockcsshref=currentRoute.blockcsshref;
	  });
	});