
/*==============================================================
 *  @desc: Page Builder Helper Package
 *  PB.Helper comprise of all helper utilities to
 *  support for page builder development
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/


var PB = PB || {}

//constant decleration
PB.ObjectType = {
    PB_ELEMENT_TYPE : 'element',
    PB_FORM_TYPE : 'form',
    PB_INPUT_TYPE : 'input',
    PB_BUTTON_TYPE : 'button',
    PB_FIELD_TYPE : 'field',
    validate : function(value) {
        
        switch (value) {
            case this.PB_FORM_TYPE:
                return value;
            case this.PB_INPUT_TYPE:
                return value;
            case this.PB_FIELD_TYPE:
                return value;
            case this.PB_BUTTON_TYPE:
                return value;
        }
        return this.PB_ELEMENT_TYPE;
    }
}


PB.MenuCommand = {
    ToolbarCommand : {
        PB_INSERT_ELEMENT : 'ie',
        PB_INSERT_TEXT : 'iet',
        PB_REMOVE_ELEMENT : 're',
        PB_EDIT_ELEMENT : 'ee',
        PB_HTML_FRAGMENT : 'html',
        PB_OBJECT_MAPPING : 'om'
    },
    TopMenuCommand : {
        PB_NEW_PAGE : 'new_page',
        PB_SAVE_PAGE : 'save_page',
        PB_LOAD_PAGE : 'load_page',
        PB_PAGE_PROPERTIES : 'page_property'
    }
}

/*==================================================================
 *  @desc: Page Builder Validator
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *==================================================================*/
PB.Validator = function() {
    
    this.errorMessage = "";
    this.isError = false;
    this.messageId = 0;
    this.messages = [
    "Text should not contain child",
    "Please select Text Editor for editing Text!!!",
    "Attempting to Remove of root is not allowed"
    ]
        
    this.getError = function() {
        return this.errorMessage;
    }
}
PB.Validator.prototype.validateMatchingValue = function(value,compare) {
    //validate to matching value
    if(value === compare) {
        this.isError = true;
        this.errorMessage = this.messages[this.messageId];
    }
}
PB.Validator.prototype.validateNoneMatchingValue = function(value,compare) {
    
    //validate to none matching value
    
    }


/*==============================================================
 *  @desc: Page Builder Frame Communication
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/
PB.FrameCommunication = {
    frameObject : null,
    setCss : function(css) {
        this.sendCommand('setCss',new Array(css));
    },
    selectElement : function(id) {
        this.sendCommand('select',new Array(id));
    },
    render : function(htmlContent) {
        this.sendCommand('render', new Array(htmlContent));
    },
    sendCommand : function(cmd,args) {
        if(this.frameObject) {
            var message = {
                command : cmd,
                args : args
            }
            this.frameObject.contentWindow.postMessage(message,"*");
        }
    }
}


/*==============================================================
 *  @desc: Page Builder Form Collection
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/
PB.FormCollection = function() {
    
    var that = this;
    
    this.pageNavigator = new PB.UI.Dialog.PageNavigator();
    this.htmlFragment = new PB.UI.Dialog.HtmlFragment();
    this.elementBuilder = new PB.UI.Dialog.ElementBuilder();
    this.formMapping = new PB.UI.Dialog.FormMapping();
    this.pageProperties = new PB.UI.Dialog.PageProperties();
    this.textEditor = new PB.UI.Dialog.TextEditor();
    
    
    this.initialize = function() {
        PB.Server.request("pb_uibuilder", handleRequest, false);
    }
    
    function handleRequest(result) {
        
        var html = result.getBody();
        var content = document.createElement("body");
        content.innerHTML = html;
        
        //initialize navigation
        that.pageNavigator.attach(content.querySelector('#page_navigator').outerHTML);
        that.htmlFragment.attach(content.querySelector('#html_fragment').outerHTML);
        that.textEditor.attach(content.querySelector('#text_editor').outerHTML);
        that.elementBuilder.attach(content.querySelector("#element_builder").outerHTML);
        that.formMapping.attach(content.querySelector('#map_object').outerHTML);
        that.pageProperties.attach(content.querySelector('#page_properties').outerHTML);
                
        that.pageNavigator.setDialogType(2);
        that.pageNavigator.show(100,100,1);
    }
}

/*==============================================================
 *  @desc: Page Builder Browser
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/
PB.Browser = {
    reload : function(timer) {
        setTimeout(function() {
            window.location.reload(true);
        },timer);
    },
    redirect : function() {
        
    }
}


/*==============================================================
 *  @desc: Page Builder Observable
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/
PB.Observable = function() {
    
    var observers = new Array();
    var observersFunction = "";
    var that = this;
	
    this.addObserver = function(observer, func){
        observers.push(observer);
        if(func){
            observersFunction = func;
        }
        else{
            observersFunction = "";
        }
    }
    this.removeObserver = function(observer){
        var index = observers.indexOf(observer);
        if(index > -1){
            observers.splice(index, 1);
            observersFunction.splice(index, 1);
        }
    }
    this.removeAllObservers = function(){
        var observersTemp = observers;
        var totalObservers = observersTemp.length;
        for(i = 0; i<totalObservers; i++){
            observersTemp.splice(i, 1);
            observersFunction.splice(i, 1);
        }
    }
    this.observerExists = function(observer){
        if(observers.indexOf(observer) > -1){
            return true;
        }
        return false;
    }
    this.getObservers = function(){
        return observers;
    }
    this.notify = function(){
        //console.log(event.type);
        var i = 0;
        var totalObservers = observers.length;
        for(i = 0; i<totalObservers; i++){
            if(typeof observers[i] == 'function'){
                observers[i](that);
            }
            else if(typeof observers[i].update == 'function'){
                observers[i].update(that);
            }
            else if(observersFunction){
                var autoCode = 'observers[i].' + observersFunction + '(that);';
                eval(autoCode);
            }	
        }
    }
}

/*==============================================================
 *  @desc: Page Builder Session Storage
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/
PB.Storage =  {
    setValue : function(key,value) {
        sessionStorage.setItem(key,value);
    },
    getValue : function(key) {
        return sessionStorage.getItem(key)
    },
    isExist : function(key) {
        if(this.getValue(key)) {
            return true;
        }
        return false;
    },
    removeItem : function(key) {
        sessionStorage.removeItem(key);
    }
}

PB.Helper = {}


/*-------------------------------------------
 * @desc: String Utilities
 *  @methods: 
 *      parseSingleString - extracting string
 *      @param: 
 *          pattern
 *
 *-------------------------------------------*/



PB.Helper.StringUtil = { 
    createAttributes : function(key,value) { 
        return key + "=\"" + value + "\" ";
    },
    trim : function(value) { 
        var pattern = /^\s+|\s+$/g;
        return value.replace(pattern,'');
    },
    splitAttributeEquation : function(text) {
        var keypos = text.indexOf('=');
        var props;
        var _key = "";
        var _value = "";
        if(keypos >= 0) {
            props = text.split('=');
            _key =  props[0];
            _value = props[1].substr(1, props[1].length-2);
        }
        return {
            key : _key, 
            value : _value
        }
    },
    parseSingleString: function(text,pattern) { 
        var len = text.indexOf(pattern);
        var split = text.substr(len+1,(this.length-len-2));
        return split;
    },
    extractAttribute2 : function(value) {
        
        var set = new Array();
        if (typeof value == 'string' && value != "") 
        {   
            var attribResult = value.match(/[a-z].+?="[^"]+"/g);
            if(attribResult instanceof Array) { 
                //get each attributes
                for(var index=0;index < attribResult.length; index++) {
                    if(attribResult[index] != "") {
                        //get each property and the element
                        var attribute = this.splitAttributeEquation(attribResult[index]);
                        //make sure that don't include the whitespace
                        if(attribute.key != "") 
                        {
                            var properties = {}
                            properties.key = attribute.key;
                            properties.value = attribute.value;
                        }
                        set.push(properties);
                    }
                }
            }
        }
        return set;
    },
    extractAttribute : function(value) {
        var _properties = new Array();
        var _values = new Array();
        
        if (typeof value == 'string' && value != "") 
        {   
            var attribResult = value.match(/[a-z].+?="[^"]+"/g);
            if(attribResult instanceof Array) { 
                //get each attributes
                for(var index=0;index < attribResult.length; index++) {
                    if(attribResult[index] != "") {
                        //get each property and the element
                        var attribute = this.splitAttributeEquation(attribResult[index]);
                        //make sure that don't include the whitespace
                        if(attribute.key != "") 
                        {
                            _properties.push(attribute.key);
                            _values.push(attribute.value);
                        }
                    }
                }
            }
        }
        return {
            properties : _properties,
            values : _values
        }
    }
}


/*-------------------------------------------
 * @desc: Event Handler
 *  @methods: 
 *
 *-------------------------------------------*/
PB.Helper.EventUtil = { 
    addHandler: function(element,type,handler) {
        
        if(element.addEventListener) {
            element.addEventListener(type, handler,false);
        }else if(element.attachEvent) {
            element.attachEvent("on" + type,handler);
        }else { 
            element["on"+type] = handler;
        }
    },
    getEvent : function(event) {
        return event ? event : window.event;
    },
    getTarget : function(event) {
        return event.target || event.srcElement;
    },
    preventDefault : function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        }else {
            event.returnValue = false;
        }
    },
    removeHandler : function(element,type,handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler,false);
        }else if(element.detachEvent) {
            element.detachEvent("on" + type,handler);
        }else { 
            element["on"+type] = handler;
        }
    },
    stopPropagation : function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        }else { 
            event.cancelBubble = true;
        }
    }
}

/*-------------------------------------------
 * @desc: Xml Utilities
 *  @methods: 
 *      serialize
 *      parse
 *-------------------------------------------*/

PB.Helper.XmlUtil = {
    serialize : function() {
        
    },
    parse : function(xmlRoot,tag) {
        
        var node = xmlRoot.getElementsByTagName(tag) || null;
        var nodeCollection = new Array();
        
        try {
            if(node) {
                var totalNode = node.length;
                for(var i = 0; i < totalNode; i++) {
                    var childProperties = node[i].childNodes;
                    var propertyCollection = new Array();
                    var property = {}
                    for(var n =0; n < childProperties.length; n++) {
                        property[childProperties[n].tagName.toLowerCase()] = childProperties[n].innerText || '' ;
                    }
                    nodeCollection.push(property);
                }
            }
            return nodeCollection;
        }
        catch(e) {
            alert(e);
        }
    }
}









