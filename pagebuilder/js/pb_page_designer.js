



var PB = PB || {}
window.onload = function() { 
    window.addEventListener('message', handleMessage,false);
    function handleMessage(event) { 
        var data = event.data;
        PB.CommandHandler.fetchCommand(data.command,data.args);
    }
}

PB.PageDesigner = function() { 
    
    var htmlBody;
    var htmlHead;
    var innerStyle;
    var selectedElement;
    var latestSelected;
    
    this.contentSource = "";
    this.contentCss = "";
    
    
    this.searchElement = function(id) {
        
        selectedElement = searchElement(htmlBody,id);
        if(selectedElement) {
            if (selectedElement != latestSelected) {
                selectedElement.style.cssText = "padding: 4px; border: 1px dashed orange; box-sizing: border-box";
                if(latestSelected != null) {
                    latestSelected.style.cssText = "";
                    latestSelected.removeAttribute('style');
                }
                latestSelected = selectedElement; 
            }
        }
    }
    
    this.init = function() {
        innerStyle.innerText = this.contentCss || "";
    }
    
    this.render = function() {
        
        //prevent user to accidentally replace 
        //the design
        if(htmlBody.innerHtml != "" && htmlBody.innerHtml != null) {
            
        }
        htmlBody.innerHTML = this.contentSource;
    }
    
    this.addElement = function(el) {
        
        //add the new child element 
        selectedElement.appendChild(el);
    }
    
    function init() {
        
        //add the new child element 
        htmlBody = document.getElementsByTagName("body")[0];
        if(!document.getElementsByTagName("style")) {
            var style = document.createElement("style");
            document.getElementsByTagName("head")[0].appendChild(style);
        }
        
        innerStyle = document.getElementsByTagName("style")[0];
    }
    
    
    function searchElement(root,id) {
        var dataIndex;
        if(root.nodeType == 1) {
            dataIndex = root.getAttribute('data-index');
        }
        
        if(dataIndex == id) return root;
        
        if(root.nodeType == 1) {
            var totalChildNode = root.childNodes.length;
            if(totalChildNode > 0) {
                for(var i =0; i < totalChildNode;i++) { 
                    var child = root.childNodes[i];
                    var selectedItem = arguments.callee(child,id);
                    if(selectedItem != null) {
                        return selectedItem;
                    }
                }
            }
        }
        return null;
    }
    
    
    init();
}

PB.CommandHandler = (function(){
    
    
    var pageDesigner = new PB.PageDesigner();
    var parameters = new Array();
    var command = "";
    
    function execute() {
        switch(command) {
            case "setCss":
                pageDesigner.contentCss = parameters[0];
                pageDesigner.init();
                break;
            case "render":
                pageDesigner.contentSource = parameters[0];
                pageDesigner.render();
                break;
            case "select":
                pageDesigner.searchElement(parameters[0]);
                break;
        }
    }
    
    return {
        fetchCommand : function(strCommand,arParam) {
            if(arParam != null) {
                parameters = arParam;
            }
            command = strCommand;
            execute();
        }
    }
}())

