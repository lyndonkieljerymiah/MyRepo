/*==============================================================
 *  @desc: Page Builder Server 
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/


var PB = PB || {}


/* Singleton Back End Request Handler */
PB.Server = {
    
    request: function(moduleName,fn,isFormData,variables) {
        
        var module = new ModuleLoader(moduleName,handleResponse,true,true);
        
        if(variables) {
            if(isFormData) {
                module.addFormVariables(variables);
            }
            else {
                for(var key in variables) {
                    module.addVariable(key,variables[key]);
                }
            }
        }
        module.send();
        
        function handleResponse(obj) {
            if(fn) {
                fn(obj);
            }
        }
    },
    save : function(variables,callback) {
        
        variables.mode = 'save';
        this.request('page_transaction', function(obj) {
            var xmlElement = document.createElement('body'); 
            xmlElement.innerHTML = obj.getBody();
            var result = { 
                success : (xmlElement.getElementsByTagName('success')[0].innerText == 'true') ? true : false,
                pageId : parseInt(xmlElement.getElementsByTagName('pageId')[0].innerText)
            }
            callback(result);
        }, false, variables)
    },
    load : function(pageId,callback) {
        
        this.request('page_transaction',function(obj) {
            
            var result = {}
            var xmlElement = document.createElement('body'); 
            xmlElement.innerHTML = obj.getBody();
            
            result.cssContent = obj.getCss();
            
            //check if the body contains xml node
            if(xmlElement.getElementsByTagName('object').length > 0) { 
                result.fetchLoad = true;
                result.pageId = xmlElement.getElementsByTagName('pageid')[0].innerText;
                result.pageTitle = xmlElement.getElementsByTagName('pagetitle')[0].innerText;
                result.pageDescription = xmlElement.getElementsByTagName('pagedescription')[0].innerText;
                result.pageContent = xmlElement;
            }else {
                result.pageContent = xmlElement.innerHTML;
                result.fetchLoad = false;
            }
            callback(result);
        },false,{mode: 'load',pageId : pageId})
    }
    
}









