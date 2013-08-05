window.AjaxTool = {};

AjaxTool.createXHR = function(){
	if(typeof XMLHttpRequest != "undefined"){
		this.createXHR = new XMLHttpRequest();
		return new XMLHttpRequest();
	}else if(typeof ActiveXObject !="undefined"){
		if(typeof arguments.callee.activeXString != "string"){
			var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];
        			
			for(var i=0, len=versions.length; i<len; i++){
				try{
					var xhr = new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
					this.createXHR = xhr;
					return xhr;
				}catch (ex){
    						
				}
        			
			}
		}
	}
}

AjaxTool.handler = (function(){
	var uniqueInstance;
	function constructor(){
		var xhr;
		var request = new ECollection(this);
		var firstRequest = null;
		var inProgress = false;
		if(typeof AjaxTool.createXHR == 'function'){
			xhr = AjaxTool.createXHR();
		}
		else{
			xhr = AjaxTool.createXHR;
		}
		xhr.onload = function(event){
			inProgress = false;
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				firstRequest.callback.success(xhr);
				processRequest();
			}
			else{
				firstRequest.callback.failure(xhr);
				//addRequest(firstRequest);
			}
			
			
		};

		var hold = false;
		function setRequest(newRequest){
			var totalRequest = request.length;
			request.splice(0,totalRequest);
			
		}
		function addRequest(newRequest){
			request.addItem(newRequest);
			processRequest();
		}
		function processRequest(){
			
			if(inProgress){
				return;
			}
			else{
				inProgress = true;
			}

			firstRequest = request.getCollection().shift();
			var fr = firstRequest;
			if(!fr){
				inProgress = false;
				return;
			}
			var timeDelay;
			if(!fr.timeDelay){
				timeDelay = 0;
			}
			else{
				timeDelay = fr.timeDelay;
			}
			
			setTimeout(
				function(){
					
					xhr.open(fr.method, fr.url, true);
					if(fr.method !== 'POST'){
						fr.postVars = null;
					}
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
					//alert(fr.postVars);
					console.log(fr.postVars);
					xhr.send(fr.postVars);
				}, 0);
		}
		
		return{
			addRequest: function(newRequest){
				request.addItem(newRequest);
				processRequest();
			},
			setRequest: function(newRequest){
				
				var collection = request.getCollection();
				var totalRequest = collection.length;
				collection.splice(0,totalRequest);
				request.addItem(newRequest);
				inProgress = false;
				processRequest();
			},
			cancelRequest: function(existingRequest){
				request.removeItem(existingRequest);
			},
			holdRequest: function(holdValue){
				hold = holdValue;
				if(holdValue == false){
					processRequest();
				}
			}

		}
	}
	return{
		getInstance:function(){
			if(!uniqueInstance){
				uniqueInstance = constructor();
			}
			return uniqueInstance;
		}
	}
})();
