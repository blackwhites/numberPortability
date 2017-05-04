/**
 * Generated Node.js application that can run on IBM Bluemix
 */


//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var request = require("request");

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
//app.listen(appEnv.port, '0.0.0.0', function() {
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var fs = require('fs');
var PropertiesReader = require('properties-reader');

init()

var config
var properties
var userDetails

var url = properties.get('url');
var chainID =properties.get('chainID');
var userType= properties.get('userType');

/**
 * Initializes the json file containing templates for request payloads for different services of Blockchain.
 * @returns
 */	
function init() {
    try {
        config = JSON.parse(fs.readFileSync(__dirname+'/config/payload.json'));
        properties = PropertiesReader(__dirname+'/config/blochchain.properties');
        userDetails =  PropertiesReader(__dirname+'/config/userdetails.properties');
    } catch (err) {    	
        console.log("payload.json is missing or invalid file, Rerun the program with right file")
        console.log(err);
        process.exit();
    }
}

app.get('/deploy_init', function (req, res) {	
	var requestData = JSON.stringify(config.deploy_init_requestData)	
	executeService(requestData, res) 
	  
})

app.get('/invoke_EligibilityConfirm', function (req, res) {	
	var mobNo = req.query.mobNo;

	if(mobNo == null ) {
		console.log("The Mobile Number is Empty")	
		res.end("The Mobile Number is Empty");
	}
	
	getUserDetailsByMobnum(mobNo, res);	
	  
})
	
	
	
	function getUserDetailsByMobnum(mobNo, res) {	
		request({
	        url: properties.get('cloudantDBURL')+mobNo,
			method: "GET",
			json: false,
			headers: {
				"content-type": "application/json",
			},
						
	    }, function (error, response, body) {
	    	try{
	    		console.log("AfterExecuting Cloudant service....... body = "+ body)
	    		jsonBody = JSON.parse(body);
		    	if(!error && res.statusCode === 200) { 
		    		var serviceProvider = jsonBody.serviceProvider;
		    		var customerName = jsonBody.customerName;
		    		var ssnNumber  =jsonBody.ssnNumber ;
		    		var portabilityIndicator  = jsonBody.portabilityIndicator;
		    		if(mobNo == null || serviceProvider == null || customerName== null || ssnNumber == null || portabilityIndicator == null ) {
		    			console.log("All required params are not set. Please check the input or userdetails.properties file")
		    			process.exit();
		    		}
		    		var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_EligibilityConfirm_requestData))
		    		requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProvider",serviceProvider).replace("customerName",customerName).replace("ssnNumber",ssnNumber).replace("portabilityIndicator",portabilityIndicator)
		    		
		    		request({
		    	        url: url,
		    			method: "POST",
		    			json: false,
		    			headers: {
		    				"content-type": "application/json",
		    			},
		    			body: requestData
		    			
		    	    }, function (error, response, body) {
		    	    	try{
		    	    		console.log("AfterExecuting blockchain service....... response.statusCode =  "+  response.statusCode +" body : "+ JSON.stringify(body))	    		
		    		    	if(!error && response.statusCode === 200) {
		    		    		 var responseBody = JSON.stringify(config.query_EligibilityConfirm_response).replace("mobNo", mobNo).replace("serviceProvider",jsonBody.serviceProvider).replace("customerName",jsonBody.customerName).replace("ssnNumber",jsonBody.ssnNumber).replace("portabilityIndicator",jsonBody.portabilityIndicator)
		    		    		 handleResponse(null, res, responseBody)  		    		    		
		    		    	}
		    	    	}catch(err) {
		    	    		console.log("Exception while handling response ... err="+err);
		    	    		res.end("Exception while handling response ... err="+err);
		    	    	}
		    	    }) 
		    	}
	    	}catch(err) {
	    		console.log("Exception while handling response in fucntion : getUserDetailsByMobnum... err="+err);
	    		res.end("Exception while handling response in fucntion : getUserDetailsByMobnum... err="+err);
	    	}
	    }) 	
	}

	
/*app.get('/invoke_EligibilityConfirm', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProvider = req.query.serviceProvider;
	var customerName = req.query.customerName ;
	var ssnNumber  = req.query.ssnNumber ;
	var portabilityIndicator  = req.query.portabilityIndicator;
	var key = mobNo+"_serviceProvider";
	console.log("Key = "+key)
	var serviceProvider = userDetails.get(key);
	console.log("serviceProvider = "+serviceProvider)
	var customerName = userDetails.get(mobNo+"_customerName") ;
	var ssnNumber  = userDetails.get(mobNo+"_ssnNumber") ;
	var portabilityIndicator  = userDetails.get(mobNo+"_portabilityIndicator");
	if(mobNo == null || serviceProvider == null || customerName== null || ssnNumber == null || portabilityIndicator == null ) {
		console.log("All required params are not set. Please check the input or userdetails.properties file")
		process.exit();
	}
	
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_EligibilityConfirm_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProvider",serviceProvider).replace("customerName",customerName).replace("ssnNumber",ssnNumber).replace("portabilityIndicator",portabilityIndicator)
    		request({
        url: url,
		method: "POST",
		json: false,
		headers: {
			"content-type": "application/json",
		},
		body: requestData
		
    }, function (error, response, body) {
    	try{
    		console.log("AfterExecuting blockchain service....... "+ JSON.stringify(body))
    		console.log("AfterExecuting blockchain service....... res.statusCode =  "+  res.statusCode)
    	if(!error && res.statusCode === 200) {
    		 var responseBody = JSON.stringify(config.query_EligibilityConfirm_response).replace("mobNo", mobNo).replace("serviceProvider",serviceProvider).replace("customerName",customerName).replace("ssnNumber",ssnNumber).replace("portabilityIndicator",portabilityIndicator)
    		 handleResponse(null, res, responseBody)  
    	}
    	}catch(err) {
    		console.log("Exception while handling response ... err="+err);
    	}
    })   
	  
})
*/

/*app.get('/query_EligibilityConfirmQuery', function (req, res) {	
	var mobNo = req.query.mobNo;
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_EligibilityConfirmQuery_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo) 
	
	executeService(requestData, res) 
	  
})*/

app.get('/query_EligibilityConfirmQuery', function (req, res) {	
	var mobNo = req.query.mobNo;
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_EligibilityConfirmQuery_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo) 
	
	request({
        url: properties.get('cloudantDBURL')+mobNo,
		method: "GET",
		json: false,
		headers: {
			"content-type": "application/json",
		},
					
    }, function (error, response, body) {
    	try{
    		console.log("AfterExecuting Cloudant service....... body = "+ body)
    		jsonBody = JSON.parse(body);
	    	if(!error && res.statusCode === 200) { 
	    		var serviceProvider = jsonBody.serviceProvider;
	    		var customerName = jsonBody.customerName;
	    		var ssnNumber  =jsonBody.ssnNumber ;
	    		var portabilityIndicator  = jsonBody.portabilityIndicator;
	    		if(mobNo == null || serviceProvider == null || customerName== null || ssnNumber == null || portabilityIndicator == null ) {
	    			console.log("All required params are not set. Please check the input or userdetails.properties file")
	    			process.exit();
	    		}
	    		var responseBody = JSON.stringify(config.query_EligibilityConfirm_response).replace("mobNo", mobNo).replace("serviceProvider",jsonBody.serviceProvider).replace("customerName",jsonBody.customerName).replace("ssnNumber",jsonBody.ssnNumber).replace("portabilityIndicator",jsonBody.portabilityIndicator)
	    		 handleResponse(null, res, responseBody)
	    	}
	    	
    	}catch(err) {
    		console.log("Exception while handling response in fucntion : query_EligibilityConfirmQuery... err="+err);
    		res.end("Exception while handling response in fucntion : query_EligibilityConfirmQuery... err="+err);
    	}
    }) 	 
    sendEmail(mobNo, "debojyoti.das@in.ibm.com", res, null);  
})

app.get('/invoke_ConfirmationOfMNPRequest', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;
	var customerName = req.query.customerName ;
	var ssnNumber  = req.query.ssnNumber ;
	var portabilityIndicator  = req.query.portabilityIndicator;
	
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_ConfirmationOfMNPRequest_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew).replace("customerName",customerName).replace("ssnNumber",ssnNumber).replace("portabilityIndicator",portabilityIndicator) 
	
	executeService(requestData, res) 
	updateStatusAndServiceProvider(mobNo, properties.get("invoke_ConfirmationOfMNPRequest_status"), serviceProviderNew);
	  
})


app.get('/query_QueryCSPDetails', function (req, res) {	
	var mobNo = req.query.mobNo;
	
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_QueryCSPDetails_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo)  
	
	executeService(requestData, res) 
	  
})

app.get('/invoke_UsageDetailsFromDonorCSP', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;
	var plan = req.query.plan;	 
	var serviceValidity = req.query.serviceValidity  ;
	var talktimeBalance  = req.query.talktimeBalance  ;
	var smsBalance  = req.query.smsBalance ;
	var dataBalance  = req.query.dataBalance ;
	
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_UsageDetailsFromDonorCSP_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew).replace("plan",plan).replace("serviceValidity",serviceValidity).replace("talktimeBalance",talktimeBalance).replace("smsBalance",smsBalance).replace("dataBalance",dataBalance)
		  
	executeService(requestData, res) 	
	updateStatus(mobNo, properties.get("invoke_UsageDetailsFromDonorCSP_status"));
	
})

app.get('/query_Query', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;
		
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_Query_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew)
	  
	executeService(requestData, res) 
	  
})



app.get('/track', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;
		
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_EntitlementFromRecipientCSP_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew)
		request({
        url: url,
		method: "POST",
		json: false,
		headers: {
			"content-type": "application/json",
		},
		body: requestData
		
    }, function (error, response, body) {
    	try{
    		console.log("After firing first service....... "+ JSON.stringify(body))
    		console.log("After firing first service....... res.statusCode =  "+  res.statusCode)
    	if(!error && res.statusCode === 200) {
    		var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_EntitlementFromRecipientCSPQuery_requestData))
    		console.log("requestfromConfig = "+requestfromConfig)
    		var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew)
    		  
    		executeService(requestData, res) 
    	}
    	}catch(err) {
    		console.log("Exception while handling response ... err="+err);
    	}
    })
    
    updateStatus(mobNo, properties.get("invoke_Track_status"));
	  
})

app.get('/invoke_EntitlementFromRecipientCSP', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;
		
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_EntitlementFromRecipientCSP_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew)	  
	executeService(requestData, res) 	
	
	  
})

app.get('/query_EntitlementFromRecipientCSPQuery', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;
		
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_EntitlementFromRecipientCSPQuery_requestData))
	console.log("requestfromConfig = "+requestfromConfig)
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew)
	  
	executeService(requestData, res) 
	  
})

/** Calls the Cloudant */
/*app.get('/invoke_UserAcceptance', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var planOld = req.query.planOld;
	var serviceValidityOld = req.query.serviceValidityOld;
	var talktimeBalanceOld = req.query.talktimeBalanceOld;
	var smsbalanceOld = req.query.smsbalanceOld;
	var dataBalanceOld = req.query.dataBalanceOld;
	
	var serviceProviderNew = req.query.serviceProviderNew;
	var planNew = req.query.planNew;
	var serviceValidityNew = req.query.serviceValidityNew;
	var talktimeBalanceNew = req.query.talktimeBalanceNew;
	var smsbalanceNew = req.query.smsbalanceNew;
	var dataBalanceNew = req.query.dataBalanceNew;
	var customerAcceptance = req.query.customerAcceptance;
		
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_UserAcceptance_requestData))
	 
	var requestData = requestfromConfig.replace("mobNo",mobNo).replace("ServiceProviderOld", serviceProviderOld).replace("PlanOld", planOld)
	.replace("ServiceValidityOld", serviceValidityOld).replace("TalktimeBalanceOld", talktimeBalanceOld).replace("SMSbalanceOld", smsbalanceOld)
	.replace("DataBalanceOld",dataBalanceOld).replace("ServiceProviderNew", serviceProviderNew).replace("PlanNew", planNew)
	.replace("ServiceValidityNew", serviceValidityNew).replace("TalktimeBalanceNew", talktimeBalanceNew).replace("SMSbalanceNew", smsbalanceNew)
	.replace("DataBalanceNew", dataBalanceNew).replace("CustomerAcceptance", customerAcceptance);
	
	request({
        url: properties.get('cloudantDBURL')+mobNo,
		method: "GET",
		json: false,
		headers: {
			"content-type": "application/json",
		},
					
    }, function (error, response, body) {
    	
    		console.log("AfterExecuting Cloudant get service....... body = "+ body)
    		var jsonBody = JSON.parse(body);    	
    		console.log("customerAcceptance="+customerAcceptance);
    		
    		if(customerAcceptance == "true") {
    			jsonBody.portabilityIndicator = "false";
    			jsonBody.serviceProvider = serviceProviderNew;
    		
	    		*//** Updating Cloudant -- Starts**//*
	    		request({
	    	        url: properties.get('cloudantDBURL')+mobNo,
	    			method: "PUT",
	    			json: true,
	    			headers: {
	    				"content-type": "application/json",
	    			},
	    			body: jsonBody
	    						
	    	    }, function (error, response, body) {
	    	    	try{
	    	    		console.log("AfterExecuting blockchain service update....... response.statusCode =  "+  response.statusCode +" body : "+ JSON.stringify(body))	    		
	    		    	if(!error && response.statusCode === 201) {
	    		    		executeService(requestData, res);	    		    		
	    		    	}
	    	    	}catch(err) {
	    	    		console.log("Exception while handling response ... err="+err);
	    	    		res.end("Exception while handling response ... err="+err);
	    	    	}
	    	    }) 
    		}
    	    
    	    *//** Updating Cloudant -- Ends**//*
    	
    }) 

	
	  
})*/
app.get('/invoke_UserAcceptance', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var planOld = req.query.planOld;
	var serviceValidityOld = req.query.serviceValidityOld;
	var talktimeBalanceOld = req.query.talktimeBalanceOld;
	var smsbalanceOld = req.query.smsBalanceOld;
	var dataBalanceOld = req.query.dataBalanceOld;
	
	var serviceProviderNew = req.query.serviceProviderNew;
	var planNew = req.query.planNew;
	var serviceValidityNew = req.query.serviceValidityNew;
	var talktimeBalanceNew = req.query.talktimeBalanceNew;
	var smsbalanceNew = req.query.smsBalanceNew;
	var dataBalanceNew = req.query.dataBalanceNew;
	var customerAcceptance = req.query.customerAcceptance;
		
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.invoke_UserAcceptance_requestData))
	 
	var requestData = requestfromConfig.replace("mobNo",mobNo).replace("ServiceProviderOld", serviceProviderOld).replace("PlanOld", planOld)
	.replace("ServiceValidityOld", serviceValidityOld).replace("TalktimeBalanceOld", talktimeBalanceOld).replace("SMSbalanceOld", smsbalanceOld)
	.replace("DataBalanceOld",dataBalanceOld).replace("ServiceProviderNew", serviceProviderNew).replace("PlanNew", planNew)
	.replace("ServiceValidityNew", serviceValidityNew).replace("TalktimeBalanceNew", talktimeBalanceNew).replace("SMSbalanceNew", smsbalanceNew)
	.replace("DataBalanceNew", dataBalanceNew).replace("CustomerAcceptance", customerAcceptance);
	  
	executeService(requestData, res) 
	updateStatusAndPortableInd(mobNo, properties.get("invoke_UserAcceptance_status"), customerAcceptance, serviceProviderNew );
	//sendEmail(mobNo, email, res);
	  
})


app.get('/invoke_RegulatorQuery', function (req, res) {	
	var mobNo = req.query.mobNo;
	var serviceProviderOld = req.query.serviceProviderOld;
	var serviceProviderNew = req.query.serviceProviderNew;	
  
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_RegulatorQuery_requestData))
	var requestData = requestfromConfig.replace("mobNo", mobNo).replace("serviceProviderOld",serviceProviderOld).replace("serviceProviderNew",serviceProviderNew)
	  
	executeService(requestData, res) 
	  
})

app.get('/getWorkListByStatus', function (req, res) {	
	var status = req.query.status;
	  
	var requestfromConfig = populateMandatoryAtrr(JSON.stringify(config.query_cloudant_with_status))
	var requestData = requestfromConfig.replace("status_value",status)
	console.log(requestData)
	request({
        url: properties.get('cloudantDBURL')+"_find",
		method: "POST",
		json: false,
		headers: {
			"content-type": "application/json",
		},
		body: requestData
					
    }, function (error, response, body) {    	
    		console.log("AfterExecuting Cloudant get service....... body = "+ body)    		    		
    		if (!error && res.statusCode === 200) {
    			 console.log(body)
    		 }
    		 else {
    		     console.log("error: " + error)
    		     /*console.log("response.statusCode: " + response.statusCode)
    		     console.log("response.statusText: " + response.statusText)*/
    			
    		 }
    	 	res.setHeader('Content-Type', 'application/json');
    		res.setHeader('Access-Control-Allow-Origin', '*');
    		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    		res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
    		/*console.log("Result  = "+JSON.parse(body).result)
    		console.log("Message  = "+JSON.parse(body).result.message)
    		console.log(JSON.parse(body).result.message.Number)*/
    		res.end(JSON.stringify(body));  		    	
    }) 
	  
})


/**
 * Execute the Webservice API
 * @param requestData
 * @param res
 * @returns
 */

function executeService(requestData, res) {
	console.log("Executing Bloch Chain Service .................requestData = "+ requestData);
	
	request({
        url: url,
		method: "POST",
		json: false,
		headers: {
			"content-type": "application/json",
		},
		body: requestData
		
    }, function (error, response, body) {
    	try{
    	handleResponse(error, res, body)
    	}catch(err) {
    		console.log("Exception while handling response ... err="+err);
    	}
    })
}

/**
 * Handle Response
 * @param error
 * @param res
 * @param body
 * @returns
 */
function handleResponse(error, res, body) {
	 if (!error && res.statusCode === 200) {
		 console.log(body)
	 }
	 else {
	     console.log("error: " + error)
	     /*console.log("response.statusCode: " + response.statusCode)
	     console.log("response.statusText: " + response.statusText)*/
		
	 }
 	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
	console.log("Result  = "+JSON.parse(body).result)
	console.log("Message  = "+JSON.parse(body).result.message)
	console.log(JSON.parse(body).result.message.Number)
	res.end(JSON.stringify(body));
	return body
}

/**
 * Adds String quotes for the request params.
 * @param value
 * @returns
 */
function addQuotes(value) {
	return "\""+value+"\""
}

/**
 * Populates the mandatory values in the request payload like ChainID and userType
 * @param requestPayload
 * @returns
 */
function populateMandatoryAtrr(requestPayload) {
	return requestPayload.replace("chainID",chainID).replace("userType",userType);
}

function updateStatus(mobNo, status) {
	updateStatusInCloudant(mobNo, status, null, null) 
}
function updateStatusAndServiceProvider(mobNo, status, serviceProviderNew) {
	updateStatusInCloudant(mobNo, status, null, serviceProviderNew) 
}
function updateStatusAndPortableInd(mobNo, status, customerAcceptance, serviceProviderNew) {
	updateStatusInCloudant(mobNo, status, customerAcceptance, serviceProviderNew) 
}

function updateStatusInCloudant(mobNo, status, customerAcceptance, serviceProviderNew ) {
	console.log("Inside updateStatusInCloudant fucntion");
	request({
        url: properties.get('cloudantDBURL')+mobNo,
		method: "GET",
		json: false,
		headers: {
			"content-type": "application/json",
		},
					
    }, function (error, response, body) {
    	
    		console.log("AfterExecuting Cloudant get service....... body = "+ body)
    		var jsonBody = JSON.parse(body);        		
    		console.log("Updating status to : "+status);
    		if(status != null) {
    			jsonBody.status = status;
    		}
    		
    		if(serviceProviderNew != null) {
    			jsonBody.serviceProviderNew = serviceProviderNew;
    		}
    		
    		if(customerAcceptance == "true") {
    			jsonBody.portabilityIndicator = "false";
    			//jsonBody.serviceProvider = serviceProviderNew;
    			//jsonBody.serviceProviderNew = "";
    		} 
    		
    		
    		console.log("Before updating Cloudant : jsonBody  = "+ JSON.stringify(jsonBody))
	    		//** Updating Cloudant -- Starts**//*
	    		request({
	    	        url: properties.get('cloudantDBURL')+mobNo,
	    			method: "PUT",
	    			json: true,
	    			headers: {
	    				"content-type": "application/json",
	    			},
	    			body: jsonBody
	    						
	    	    }, function (error, response, body) {
	    	    	try{
	    	    		console.log("AfterExecuting blockchain service update....... response.statusCode =  "+  response.statusCode +" body : "+ JSON.stringify(body))	    		
	    		    	if(!error && response.statusCode === 201) {
	    		    		console.log("Updated Cloudant Successfully.........");    		    		
	    		    	}
	    	    	}catch(err) {
	    	    		console.log("Exception while handling response ... err="+err);
	    	    		//res.end("Exception while handling response ... err="+err);
	    	    	}
	    	    }) 
    		
    	    
    	    //** Updating Cloudant -- Ends**//*
    	
    }) 
	
}



app.get('/getUserDetails', function (req, res) {	
	var mobNo = req.query.mobNo; 
	
	request({
		 url: properties.get('cloudantDBURL')+mobNo,
			method: "GET",
			json: false,
			headers: {
				"content-type": "application/json",
			},
					
    }, function (error, response, body) {    	
    		console.log("AfterExecuting getUserDetails Cloudant Service....... body = "+ body)    		    		
    		if (!error && res.statusCode === 200) {
    			 console.log(body)
    		 }
    		 else {
    		     console.log("error: " + error)
    		     /*console.log("response.statusCode: " + response.statusCode)
    		     console.log("response.statusText: " + response.statusText)*/
    			
    		 }
    	 	res.setHeader('Content-Type', 'application/json');
    		res.setHeader('Access-Control-Allow-Origin', '*');
    		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    		res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');    		
    		res.end(JSON.stringify(body));  		    	
    }) 
	  
})

app.get('/sendEmail', function (req, res) {	
	var mobNo = req.query.mobNo; 
	var email = req.query.email;
	sendEmail(mobNo, email, res, true);
	  
})


function sendEmail(mobNo, email, res, sendResponse) {
	console.log("Email URL..::"+properties.get('sendEmailURL')+"number="+mobNo+"&email="+email)
	request({
		 url: properties.get('sendEmailURL')+"number="+mobNo+"&email="+email,
			method: "GET",
			json: false,
			headers: {
				"content-type": "application/json",
			}
					
   }, function (error, response, body) {    	
   		console.log("AfterExecuting sendEmail Service....... body = "+ body)   		    		
   		console.log(body)
   		console.log("res.statusCode ::"+res.statusCode)
   		console.log("error ::"+error)
   		if(sendResponse != null) {
	   	 	res.setHeader('Content-Type', 'text/html');
	   		res.setHeader('Access-Control-Allow-Origin', '*');
	   		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
	   		res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');    		
	   		res.end(body);  
   		}
   }) 
}



