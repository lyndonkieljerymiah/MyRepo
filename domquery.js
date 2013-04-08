/*  DOM QUERY ver 1.0*/
(function () {
    function _dq(query) {
        this.elements = [];
        var i = 0;

        if (typeof query === 'string') {
            var results = document.querySelectorAll(query);
            if (results) {
                this.elements = results;
            }
        }
        else if (typeof query.nodeType !== "undefined") {
            if (query.nodeType === 1 || query.nodeType === 9) {
                this.elements.push(query);
            }
        }
        else if (query.length) {
            for (; i < query.length; i++) {
                this.elements.push(query[i]);
            }
        }
        this.selector = query;
        this.context = document;
        this.length = this.elements.length;
    }

    _dq.prototype = {
        each: function (fn) {
            if (this.length > 0) {
                for (var i = 0; i < this.elements.length; i++) {
                    fn.call(this, this.elements[i], i);
                };
                return this;
            }
            return false;
        },
        items: function (index) {
            var elements = [];
            this.each(function (el, i) {
                if (arguments.length > 0) {
                    if (typeof arguments[0] === "string") {
                        if (el.id === index) {
                            elements = el;
                        }
                    } else {
                        if (i == index) {
                            elements = el;
                        }
                    }
                } else {
                    elements.push(el);
                }
            })
            return elements;
        },
        children: function () {
            /*arguments(attribute,value)*/
            var childItems = [];
            var args = arguments;
            this.each(function (el) {
                var total = el.childNodes.length;
                if (total > 0) {
                    for (var i = 0; i < total; i++) {
                        if (el.childNodes[i].nodeType == 1) {
                            if (args.length == 0) {
                                childItems.push(el.childNodes[i]);
                            }
                            else if (args.length == 1) {
                                if (el.childNodes[i].hasAttribute(arguments[0])) {
                                    childItems.push(el.childNodes[i]);
                                }
                            } else if (args.length > 1) {
                                var childAttrVal = el.childNodes[i].getAttribute(args[0]);
                                if (childAttrVal == args[1]) {
                                    childItems.push(el.childNodes[i]);
                                }
                            }
                        }
                    }
                }
            })
            return new _dq(childItems);
        },
        find: function (query) {
            var results = [];
            this.each(function (el) {
                var nodes = el.querySelectorAll(query);
                if (nodes) {
                    results.push(new _dq(nodes));
                }
            })
            return results;
        },
        filter: function (prop, value) {
            var result = [];
            this.each(function (el) {
                var isExist = false;
                if (typeof value !== 'undefined') {
                    if (el.getAttribute(prop) == value) {
                        result.push(el);
                    }
                }
            })
            return new _dq(result);
        },
        first: function () {
            var result = [];
            this.each(function (el) {
                if (el.childNodes.length > 0) {
                    for (var i = 0; i < el.childNodes.length; i++) {
                        if (el.childNodes[i].nodeType == 1) {
                            result.push(new _dq(el.childNodes[1]));
                            break;
                        }
                    }
                }
            });
            return result;
        },
        last: function () {
            var result = [];
            this.each(function (el) {
                if (el.childNodes.length > 0) {
                    result.push(new _dq(el.childNode[el.childNodes.length - 1]));
                }
            });
            return result;
        },
        parent: function () {
            var parentNode;
            this.each(function (el) {
                parentNode = el.parentNode;
            })
            return new _dq(parentNode);
        },
        data: function (dataKey, dataVal) {
            var object;
            var result = [];
            this.each(function (el) {
                if (el.dataset) {
                    if (el.dataset[dataKey] == dataVal) {
                        result.push(el);
                    }
                } else {
                    if (el.getAttribute(dataKey) == dataVal) {
                        result.push(el);
                    }
                }
            })
            return new _dq(result);
        },
        getProp: function (propertyName) {
            var propertyName = new Array();
            this.each(function (el) {
                propertyName.push(el[propertyName]);
            })
            return propertyName;
        },
        setProp: function (propertyName, value) {
            return this.each(function (el) {
                el[propertyName] = value;
            })
        },
        getAttr: function (prop, index) {
            var property;
            var attributes = new Array();
            this.each(function (el) {
                if (typeof prop === "object") {
                    for (var i = 0; i < prop.length; i++) {
                        attributes.push(el.getAttribute(prop[i]));
                    }
                } else {
                    attributes.push(el.getAttribute(prop));
                }
            });
            if (index) return attributes[index];
            return attributes;
        },
        setAttr: function (prop, value) {
            return this.each(function (el) {
                el.setAttribute(prop) = value;
            });
        },
        removeAttr: function (prop) {
            return this.each(function (el) {
                el.removeAttribute(prop);
            })
        },
        addClass: function (className) {
            return this.each(function (el) {
                if (el.className)
                    el.className = el.className.concat(' ' + className);
                else
                    el.className = className;
            });
        },
        hasClass: function (className) {
            var hasClass = false;
            var classes = this.elements[0].className.split(" ");
            for (var i = 0; i < classes.length; i++) {
                if (classes[i] == className) {
                    hasClass = true;
                }
            }
            return hasClass;
        },
        setStyle: function (prop, value) {
            return this.each(function (el) {
                el.style[prop] = value;
            });
        },
        getStyle: function (prop) {
            var styles = [];
            this.each(function (el) {
                styles.push(el.style[prop]);
            });
            return styles;
        },
        removeClass: function (className) {
            this.each(function (el) {
                if (el.className)
                    el.className = el.className.replace(className, '').trim();
            })
            return this;
        },
        addEvent: function (type, handler) {
            this.each(function (el) {
                if (el.addEventListener)
                    el.addEventListener(type, handler, false);
                else if (element.attachEvent)
                    el.attachEvent("on" + type, handler);
                else
                    element["on" + type] = handler;
            })
            return this;
        },
        removeEvent: function (type, fn) {
            this.each(function (el) {
                el.removeEventListener(type, fn);
            })
            return this;
        },
        bubble: function (prop, val) {
            var newTarget;
            this.each(function (el) {
                var target = el;
                while (typeof target !== 'undefined') {
                    if (typeof val !== "undefined") {
                        if (target.getAttribute(prop) == val) {
                            newTarget = new _dq(target);
                            break;
                        }
                    } else {
                        if (prop instanceof Array) {
                            var isFound = false;
                            for (var i = 0, l = prop.length; i < l; i++) {
                                if (target.hasAttribute(prop[i])) {
                                    newTarget = new _dq(target);
                                    isFound = true;
                                    break;
                                }
                            }
                            if (isFound) break;
                        } else {
                            if (target.hasAttribute(prop)) {
                                newTarget = new _dq(target);
                                break;
                            }
                        }

                    }
                    if (target.tagName.toLowerCase() === 'body') {
                        break;
                    }
                    target = target.parentNode;
                }
            });
            return newTarget;
        },
        append: function (node, nodeRelative) {
            this.each(function (el) {
                node.each(function (nodeEl) {
                    if (!nodeRelative) {
                        el.appendChild(nodeEl);
                    } else if (nodeRelative == 'parent') {
                        nodeEl.appendChild(el);
                    } else {
                        el.appendChild(nodeEl);
                    }
                })
            })
        }
    }
    _dq.prototype.show = function () {
        return this.each(function (el) {
            el.style.display = "block"
        })
    }
    _dq.prototype.hide = function () {
        return this.each(function (el) {
            el.style.display = "none"
        })
    }
    _dq.prototype.getCommonAttr = function (prop) {
        var props = [];
        this.each(function (el) {
            var isExist = false;
            if (props.length > 0) {
                props.sort();
                for (var i = 0; i < props.length; i++) {
                    if (props[i] == el.getAttribute(prop)) {
                        isExist = true;
                        break;
                    }
                }
            }
            if (!isExist)
                props.push(el.getAttribute(prop));
        })
        return props;
    }
    _dq.prototype.getInputText = function () {
        var textValue = "";
        this.each(function (el) {
            switch (el.type) {
                case "radio":
                    if (el.checked == true) {
                        textValue = el.value;
                    }
                    break;
                case "select":
                    textValue = el.value;
                    break;
                default:
                    textValue = el.value;
                    break;
            }
        });
        return textValue;
    }
    window.dq = function () {
        return new _dq(arguments[0]);
    }
} ());

window.$ = dq;

/******************
    Request thru the server
***********************/
dq.StringUtil = {

    splitAttributeEquation: function (text, delimeter) {
        delimeter = delimeter || "=";
        var keypos = text.indexOf(delimeter),
            props,
            _key = "",
            _value = "";

        if (keypos >= 0) {
            props = text.split(delimeter);
            _key = props[0];

            if (_key.charAt(0) === ",") {
                _key = _key.trim().substr(1, _key.length);
            }

            //use for object notation
            if (delimeter === ":") {
                //strictly rules check for string single quote as one of the rules
                if (props[1].charAt(0) === "'" && props[1].charAt(props[1].length - 1) === "'") {
                    _value = props[1].trim().substr(1, props[1].length - 2);
                    //inspect the value since we cater for array as well
                    if (_value.charAt(0) === '[' && _value.charAt(_value.length - 1) == ']') {
                        //understood that the string is array literal convert to array
                        _value = _value.trim().substr(1, _value.length - 2);
                        _value = _value.split(',');
                    }
                }
            } else {
                _value = props[1].trim();
            }

        }

        return {
            key: _key,
            value: _value
        }
    },
    parsing: function (value) {
        var properties = {}
        if (typeof value == 'string' && value != "") {
            var attribResult = value.match(/[a-z,A-Z]+?:\'.+?\'/g);
            if (attribResult instanceof Array) {
                //get each attributes
                for (var index = 0; index < attribResult.length; index++) {
                    if (attribResult[index] != "") {
                        //get each property and the element
                        var attribute = this.splitAttributeEquation(attribResult[index]);
                        //make sure that don't include the whitespace
                        if (attribute.key != "") {
                            properties[attribute.key] = attribute.value;
                        }
                    }
                }
            }
        }
        return properties;
    },
    objectParsing: function (value) {
        var properties = {};
        if (typeof value == 'string' && value != "") {
            var attribResult = value.match(/[a-z,A-Z]+?:\'.+?\'/g) || false;
            if (attribResult instanceof Array) {
                //get each attributes
                for (var index = 0; index < attribResult.length; index++) {
                    if (attribResult[index] != "") {
                        //get each property and the element
                        var attribute = this.splitAttributeEquation(attribResult[index], ":");
                        //make sure that don't include the whitespace
                        if (attribute.key != "") {
                            properties[attribute.key] = attribute.value;
                        }
                    }
                }
            }
        }
        return properties;
    },
    urlSplit: function (uri) {
        var urls = uri.split('&');
        var properties = {}
        if (urls instanceof Array) {
            for (var index = 0; index < urls.length; index++) {
                //get each property and the element
                var attribute = this.splitAttributeEquation(urls[index], "=");
                //make sure that don't include the whitespace
                if (attribute.key != "") {
                    properties[attribute.key] = attribute.value;
                }
            }
        }
        return properties;
    }
}
dq.Util = {
    augment: function (recClass, givClass) {
        if (arguments.length > 2) {
            for (var i = 2, len = arguments.length; i < len; i++) {
                recClass.prototype[arguments[i]] = givClass.prototype[arguments[i]];
            }
        }
        else {
            for(var methodName in givClass.prototype) {
                if(!recClass.prototype[methodName]){
                    recClass.prototype[arguments[methodName]] = givClass.prototype[arguments[methodName]];
                }
            }
        }
    }
}
dq.Server = (function () {

    function request(moduleName, variables, form, isPost, immediate) {
        var formObject;
        if (form) isPost = true;
        var mod = new ModuleLoader(moduleName, handleResponse, isPost, immediate);
        if (form) {
            if (form instanceof Array) {
                for (var i = 0; i < form.length; i++) {
                    formObject = document.getElementById(form[i]);
                    mod.addPostFormVariables(formObject);
                }
            }else if(typeof form === "object" ) {
                mod.addPostFormVariables(form);
            } else  {
                formObject = document.getElementById(form);
                mod.addPostFormVariables(formObject);
            }
        }

        if (typeof variables === "object") {
            for (var key in variables) {
                mod.addGetVariable(key, variables[key]);
            }
        }
        mod.send();

        function handleResponse(obj) {
            if (dq.Server.response)
                dq.Server.response(obj);
        }
    }
    function createAjaxRequest(args) {
        var counter,
            stopLoading = false,
            def = {
                module: null,
                variables: null,
                form: null,
                isPost: false,
                immediate: true
            }

        function init() {
            if (args) {
                def.module = args.module;
                if (typeof args.variables === "object") {
                    //make reference to object 
                    def.variables = args.variables;
                }

                def.isPost = (typeof args.isPost !== "undefined" && args.isPost === "true") ? true : false;
                def.immediate = (typeof args.immediate === "undefined") ? def.immediate : (args.immediate === "true") ? true : false;
                console.log(def.immediate);
                if (args.form) {
                    def.form = args.form;
                }
                if (args.counter) counter = args.counter;
            }
        }

        function execute(callback) {
            var varObject = {};
            for (var key in def.variables) {
                if (key) {
                    var pattern = /%n+/g;
                    varObject[key] = def.variables[key];
                    if (pattern.test(def.variables[key])) {
                        varObject[key] = def.variables[key].replace("%n", counter);
                    }
                }
            }
            dq.Server.request(def.module, varObject, def.form, def.isPost, def.immediate);
            dq.Server.response = function (obj) {
                if (callback) callback(obj)
            }
        }
        init();
        return {
            execute: function (callback) {
                execute(callback);
            },
            setCounter: function (counters) {
                counter = counters;
            }
        }
    }

    return {
        response: null,
        request: function (moduleName, variables, form, isPost, immediate) {
            request(moduleName, variables, form, isPost, immediate);
        },
        createAjaxRequest: function (args) {
            if (args.module) {
                //converting string to object
                if (args.variables) args.variables = dq.StringUtil.urlSplit(args.variables);
                return new createAjaxRequest(args);
            }
            return false;
        }
    }
})();
dq.Stack = function () {
    var stack = new Array();

    this.exist = function (key) {
        return isStackExist(key);
    }
    this.addStack = function (key, obj) {
        return addStack(key, obj);
    }
    this.removeStack = function (key) {
        return removeStack(key);
    }
    this.printStack = function () {
        printStack();
    }
    this.getStack = function (key) {
        return getStack(key);
    }
    this.iterate = function (fn) {
        var total = stack.length;
        if (total > 0) {
            for (var i = 0; i < total; i++) {
                fn.call(this, stack[i].value, stack[i].key);
            }
        }
    }
    this.count = function () {
        return stack.length;
    }

    function isStackExist(key) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                return true;
            }
        }
        return false;
    }

    function addStack(key, obj, replace) {
        var object;
        if (!isStackExist(key)) {
            object = {
                key: key,
                value: obj
            }
            stack.push(object);
            return true;
        }

        if (typeof replace === "boolean" && replace === true) {
            object = getStack(key);
            object.key = key;
            object.value = obj;
            return true;
        }

        return false;
    }

    function getStack(key) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                return stack[i].value;
            }
        }
        return false;
    }

    function removeStack(key) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                var indexOfStack = stack.indexOf(stack[i]);
                stack.splice(indexOfStack, 1);
                return true;
            }
        }
        return false;
    }
    
    function printStack() {
        console.log(stack);
    }


}
dq.Document = (function () {
    
    var eventStack = new dq.Stack();
    var eventActivated = new Array();
    var isActivate = false;
    var hasEventPriority = false;
    var observers = new Array();

    function eventHandler(e) {
        if (hasEventPriority) return false;
        notify(e.target, e);
        return true;
    }
        
    function notify(el, event) {
        if (observers.length > 0) {
            for (var i = 0, l = observers.length; i < l; i++) {
                observers[i].update(el, event);
            }
        }
    }

    return {
        subscribe: function (observer) {
           if (observers.indexOf(observer) == -1) {
                if (typeof observer === 'object')
                    observers.push(observer);
            }
        },
        isSubscriberExist: function(observer) {
            if(observers.indexOf(observer) > -1){
    		    return true;
		    }
		    return false;    
        },
        addAction: function (type, callback, key) {
            var types = type.split(',');
            for (var i = 0; i < types.length; i++) {
                if (eventActivated.indexOf(types[i]) < 0) {
                    dq(document).addEvent(types[i], eventHandler);
                    eventActivated.push(types[i]);
                }
            }
        },
        removeAction: function (key) {
            return eventStack.removeStack(key);
        },
        addOwnEvent: function (type, fn) {
            dq(document).addEvent(type, fn);
            hasEventPriority = true;
        },
        removeOwnEvent: function (type, fn) {
            dq(document).removeEvent(type, fn);
            hasEventPriority = false;
        }
    }
})();
dq.Parser = {
    objectIdentifier: function (component) {
        return dq("[data-ui-bind*=\"component:'" + component + "'\"]");
    },
    customIdentifier: function (param, value) {
        return dq("[data-ui-bind=\"" + param + ":'" + value + "'\"]");
    },
    ajaxParsing: function (el) {
        var attr = el.getAttr("data-ajax-bind")[0];
        var object = dq.StringUtil.objectParsing(attr);
        return object;
    },
    uiParsing: function (el) {
        var attr = el.getAttr("data-ui-bind")[0];
        var object = dq.StringUtil.objectParsing(attr);
        return object;
    },
    customParsing: function (el, custom) {
        var attr = el.getAttr(custom)[0];
        var object = dq.StringUtil.objectParsing(attr);
        return object;
    },
    applyBinding: function () {

    }
}


/**********************
Element Selection
*************************/
var Marker = function() {
	
	var mark = document.createElement('div');
	var self = this;
    
    var elInfo = {
        top : 0,
        left : 0,
        height: 0
    }

	this.setElementDimension = function(el) {
        if(el.getAttribute('data-marker')) {
			return false;
		}
		
        var top = el.offsetTop,
			left = el.offsetLeft,
			height = el.offsetHeight,
			width = el.offsetWidth;
		
        var target = el;
		
		resetPosition();
		
		while(target=target.offsetParent) 
			left += target.offsetLeft;
		target = el;
		while(target=target.offsetParent)
			top += target.offsetTop;
		
		left += document.body.offsetLeft;
		top += document.body.offsetTop;

        //store element information
        elInfo.top = top;
        elInfo.left = left;
        
		mark.style.top = top;
		mark.style.left = left;
		mark.style.height = height;
		mark.style.width = width;
		
        return this;
	}

	function resetPosition() {
		mark.style.top = 0;
		mark.style.left = 0;
		mark.style.height = 0;
		mark.style.width = 0;	
	}

	this.show = function() {
		mark.style.display = "block";
		mark.addEventListener('dblclick',hide,false);
	}

	function hide() {
		mark.style.display = "none";
		mark.removeEventListener('dblclick',hide);
	}

    this.destroy =function() {
        var markersEl = $("[data-marker]");
        console.log(markersEl);
        markersEl.each(function(el) {
            document.body.removeChild(el);
        })
    }

	function markerNavigation() {
		var but = document.createElement('button');
		but.innerHTML = "edit";
		but.style.cssText = "position:absolute;top:-5px;right:-40px";
		but.setAttribute('data-marker','true');
		return but;
	}
	function init() {
		mark.style.cssText = "position:absolute; border: 1px dashed white; box-sizing: border-box;background:rgba(120,120,120,.5)";
		mark.style.display = "none";
		mark.setAttribute('data-marker','true');
		var but = markerNavigation();

		document.getElementsByTagName("body")[0].appendChild(mark);
	}

	init();
}
var MarkerCollection = function() {
    var markerArray = new Array();
    
    this.createMarker =function() {
        var markObj = new Marker();
        markerArray.push(markObj);
        return markObj;
    }

    this.clearMarker = function() {
        if(markerArray.length > 0) {
            for(var i=0; i < markerArray.length;i++) {
                markerArray[i].destroy();
            }    
        }
        markerArray = new Array();
    }
}
var ElementSelection = (function() {
    var markers = null;
    
	function init() {
		markers = new MarkerCollection();
        attachedEvents();
	}

    function attachedEvents() {
        
        dq(document).addEvent('click',function(event) {
            var target = event.target;
            
            //create marker
            markers.clearMarker();
			var marker = markers.createMarker();
            marker.setElementDimension(target).show();
        });


        
    }
	


	return {
		init : init
	}
})();
