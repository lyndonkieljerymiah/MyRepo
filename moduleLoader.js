var ModuleLoader = function(moduleName, externalCallback, isPost, immediate1){
	var that = this;
	var internalJs =  '';
	var externalJs = '';
	var internalCss = '';
	var externalCss = '';
	var body = '';
	var immediate = true;
	var moduleName = moduleName;
	var variables = '';
	var getVariables = '';
	var postVariables = '';
	if(!moduleName){
		return null;
	}
	
	if(immediate1 == null){
		immediate = true;
	}
	else{
		immediate = immediate1;
	}
	
	if(!isPost){
		isPost == false;
	}
	
	this.addGetVariable = function(key, value){
		getVariables = getVariables+key+'='+value+'&';
	}
	this.addPostVariable = function(key, value){
		postVariables = postVariables+key+'='+value+'&';
	}
	this.addVariable = function(key, value){
		variables = variables+key+'='+value+'&';
	}
	this.addFormVariables = function(form){
		variables = variables+ window.serializer(form)+'&';
	}
	this.addPostFormVariables = function(form){
		postVariables = postVariables+ window.serializer(form)+'&';
	}
	this.loadCss = function(){
		loadjscssscript(internalCss, 'css');
	}
	
	this.loadJs = function(){
		loadJs();
	}
	
	
	this.executeDelayedActivity = function(){
		executeDelayedActivity();
	}
	
	function executeDelayedActivity(){
		
		if(filerefCounter != 0){
			//console.log(filerefCounter);
			window.setTimeout(executeDelayedActivity, 10);
		}
		else{
			
			executeFunc();
		}
	}
	this.getJs = function(){
		return internalJs;
	}
	this.getCss = function(){
		return internalCss;
	}
	function loadJs(){
		if(filerefCounter != 0){
			window.setTimeout(loadJs, 10);
		}
		else{
			//console.log(internalJs);
			loadjscssscript(internalJs, 'js');
		}
	}
	var executeFunc = null;
	this.setExecutionScriptAfterExternalJsLoad = function(func){
		executeFunc = func;
	}
	this.getBody = function(){
		return body;
	}
	var responseText = '';
	this.getResponseText = function(){
		return responseText;
	}
	
	this.send = function(){
		var handler = AjaxTool.handler.getInstance();
		var that = this;
		var request = {};
		var callback = {};
		callback.success = function(xhr){
			
			console.log(xhr.responseText);
			responseText = xhr.responseText;
			var xmlDoc = xhr.responseXML;
			//console.log(xhr.responseXML);
			//alert(xmlDoc);
			if(xmlDoc){
				
			
				internalJs = xmlDoc.getElementsByTagName('internal_js')[0].childNodes[0].data;
				externalJs = xmlDoc.getElementsByTagName('external_js')[0].childNodes;
				
				var totalExternalJs = externalJs.length;
				
				for(var i=0; i<totalExternalJs; i++){
					if(externalJs[i].getAttribute){
						checkloadjscssfile(externalJs[i].getAttribute('src'), 'js');
					}
				}
				internalCss = xmlDoc.getElementsByTagName('internal_css')[0].childNodes[0].data;
				externalCss = xmlDoc.getElementsByTagName('external_css')[0].childNodes;
				
				var totalExternalCss = externalCss.length;
				
				for(i=0; i<totalExternalCss; i++){
					if(externalCss[i].getAttribute){
						
						checkloadjscssfile(externalCss[i].getAttribute('href'), 'css');
					}
				}
				body = xmlDoc.getElementsByTagName('body_content')[0].childNodes[0].data;
				//bodyNode = xmlDoc.getElementsByTagName('body_content')[0].childNodes[0].data;
			}
			if(externalCallback){
				externalCallback(that);
			}
		};
		callback.failure = function(){alert('fail')};
		request.callback = callback;
		if(isPost){
			request.method = 'POST';
			request.url = '/etmas/sub/'+moduleName+'?'+getVariables;
			request.postVars = variables+'&'+postVariables;
			
		}
		else{
			
			request.method = 'GET';
			request.url = '/etmas/sub/'+moduleName+'?'+variables+'&'+getVariables;
			request.postVars = '';
		}
		
		if(immediate){
			
			handler.setRequest(request);
			
		}
		
		else{
		
			handler.addRequest(request);
			
		}
		//alert(filesadded);
	}
	
}

var ModuleLoader2 = function(moduleName, externalCallback, isPost, immediate){
	var that = this;
	var internalJs =  '';
	var externalJs = '';
	var internalCss = '';
	var externalCss = '';
	var body = '';
	
	var moduleName = moduleName;
	var variables = '';
	var getVariables = '';
	var postVariables = '';
	if(!moduleName){
		return null;
	}
	if(!immediate){
		immediate = false;
	}
	if(!isPost){
		isPost == false;
	}
	this.addGetVariable = function(key, value){
		getVariables = getVariables+key+'='+value+'&';
	}
	this.addPostVariable = function(key, value){
		postVariables = postVariables+key+'='+value+'&';
	}
	this.addVariable = function(key, value){
		variables = variables+key+'='+value+'&';
	}
	this.addFormVariables = function(form){
		variables = variables+ window.serializer(form)+'&';
	}
	this.addPostFormVariables = function(form){
		postVariables = postVariables+ window.serializer(form)+'&';
	}
	this.loadCss = function(){
		loadjscssscript(internalCss, 'css');
	}
	
	this.loadJs = function(){
		loadJs();
	}
	
	this.executeDelayedActivity = function(){
		executeDelayedActivity();
	}
	
	function executeDelayedActivity(){
		
		if(filerefCounter != 0){
			//console.log(filerefCounter);
			window.setTimeout(executeDelayedActivity, 10);
		}
		else{
			
			executeFunc();
		}
	}
	function loadJs(){
		if(filerefCounter != 0){
			window.setTimeout(loadJs, 10);
		}
		else{
			//console.log(internalJs);
			loadjscssscript(internalJs, 'js');
		}
	}
	var executeFunc = null;
	this.setExecutionScriptAfterExternalJsLoad = function(func){
		executeFunc = func;
	}
	this.getBody = function(){
		return body;
	}
	this.send = function(){
		var handler = AjaxTool.handler.getInstance();
		var that = this;
		var request = {};
		var callback = {};
		callback.success = function(xhr){
			console.log(xhr.responseText);
			var xmlDoc = xhr.responseXML;
			//console.log(xhr.responseXML);
			//alert(xmlDoc);
			
			internalJs = xmlDoc.getElementsByTagName('internal_js')[0].childNodes[0].data;
			externalJs = xmlDoc.getElementsByTagName('external_js')[0].childNodes;
			
			var totalExternalJs = externalJs.length;
			
			for(var i=0; i<totalExternalJs; i++){
				if(externalJs[i].getAttribute){
					checkloadjscssfile(externalJs[i].getAttribute('src'), 'js');
				}
			}
			internalCss = xmlDoc.getElementsByTagName('internal_css')[0].childNodes[0].data;
			externalCss = xmlDoc.getElementsByTagName('external_css')[0].childNodes;
			
			var totalExternalCss = externalCss.length;
			
			for(i=0; i<totalExternalCss; i++){
				if(externalCss[i].getAttribute){
					checkloadjscssfile(externalCss[i].getAttribute('src'), 'css');
				}
			}
			body = xmlDoc.getElementsByTagName('body_content')[0].childNodes[0].data;
			externalCallback(that);
		};
		callback.failure = function(){alert('fail')};
		request.callback = callback;
		if(isPost){
			request.method = 'POST';
			request.url = 'subpage2.php?module='+moduleName+'&'+getVariables;
			request.postVars = 'module='+moduleName+'&'+variables+'&'+postVariables;
		}
		else{
			request.method = 'GET';
			request.url = 'subpage2.php?module='+moduleName+'&'+variables+'&'+getVariables;
			request.postVars = '';
		}
		if(immediate){
			handler.setRequest(request);
			
		}
		else{
			handler.addRequest(request);
			
		}
		//alert(filesadded);
	}
	
}

