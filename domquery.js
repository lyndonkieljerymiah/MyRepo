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
            if (index) {
                return attributes[index];
            }
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
        addEvent: function (type, fn) {
            this.each(function (el) {
                el.addEventListener(type, fn, false);
            })
            return this;
        },
        removeEvent: function (type, fn) {
            this.each(function (el) {
                el.removeEventListener(type, fn);
            })
            return this;
        },
        iterateAttr: function (prop, val) {
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
                        if (target.hasAttribute(prop)) {
                            newTarget = new _dq(target);
                            break;
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
        create: function (tag, attr) {

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

    _dq.prototype.extractDataBind = function (dataName) {
        var dataBindObject;
        this.each(function (el) {
            var dataBindAttr = el.getAttribute(dataName);
            if (dataBindAttr) {
                dataBindObject = dq.StringUtil.objectParsing(dataBindAttr);
            }
        });
        return dataBindObject;
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

    _dq.prototype.getText = function () {
        var textValue = "";
        this.each(function (el) {
            switch (el.type) {
                case "radio":
                    if (el.checked == true) {
                        textValue = el.value;
                    }
                    break;
                default:
                    textValue = el.value;
                    break;
            }
        });
        return textValue;
    }

    _dq.prototype.getAJAXContent = function (moduleName, variables, options, fn) {

        return this.each(function (el) {

            var defaults = {
                isPost: false,
                immediate: false,
                isAppend: false
            }

            if (options) {
                if (options.isPost) defaults.isPost = true;
                if (options.immediate) defaults.immediate = true;
                if (options.isAppend) defaults.isAppend = true;
            }

            dq.Server.request(moduleName, variables, defaults.isPost, defaults.immediate);
            dq.Server.response = function (obj) {
                if (defaults.isAppend) {
                    var resp = document.createElement("div");
                    resp.innerHTML = obj.getBody();
                    el.appendChild(resp);
                } else {
                    el.innerHTML = obj.getBody();
                }
                if (fn) fn.call(this, obj);
            }
        })
    }
    
    window.dq = function () {
        return new _dq(arguments[0]);
    }
} ());

window.$ = dq;

/*
    Request thru the server
*/
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
            //string quote
            if(props[1].charAt(0) == "'" && props[1].charAt(props[1].length-1) == "'" ) {
                _value = props[1].trim().substr(1, props[1].length-1);    
            }else {
                //assuming that no string represented
                _value = props[1].trim().substr(0, props[1].length);
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
            var attribResult = value.match(/[a-z].+?=[^"\s]+/g);
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
        var properties = {}
        if (typeof value == 'string' && value != "") {
            var attribResult = value.match(/[a-z].+?:[^",]+/g);
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
                var attribute = this.splitAttributeEquation(urls[index]);
                //make sure that don't include the whitespace
                if (attribute.key != "") {
                    properties[attribute.key] = attribute.value;
                }
            }
        }
        return properties;
    }
}

dq.Server = (function () {

    function request(moduleName, variables, form, isPost, immediate) {

        if (form) isPost = true;
        var mod = new ModuleLoader(moduleName, handleResponse, isPost, immediate);

        if (form) mod.addFormVariables(form);

        if (typeof variables === "object") {
            for (var key in variables) {
                mod.addVariable(key, variables[key]);
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
                immediate: false
            }

        function init() {
            if (args) {
                def.module = args.module;
                if (typeof args.variables === "object") {
                    //make reference to object 
                    def.variables = args.variables;
                }
                
                def.isPost = (typeof args.isPost !== "undefined" && args.isPost === "true") ? true : false;
                def.immediate = (typeof args.immediate !== "undefined" && args.immediate === "true") ? true : false;
                
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
                if (args.form) args.form = document.getElementById(args.form);
                return new createAjaxRequest(args);
            }
            return false;
        },
        extractRequest: function (target, obj) {
            target = dq.StringUtil.parsing(target);
            target.target = document.getElementById(target.target);
            if (target.isAppend === "true") {
                var mdiv = document.createElement("div");
                mdiv.innerHTML = obj.getBody().trim();
                //get only the html request
                for (var i = 0; i < mdiv.childNodes.length; i++) {
                    target.target.appendChild(mdiv.childNodes[i]);
                }
            } else {
                target.target.innerHTML = obj.getBody();
            }
            if (typeof target.loadJs !== 'undefined' && target.loadJs === "true") obj.loadJs();
            if (typeof target.loadCss !== 'undefined' && target.loadCss === "true") obj.loadCss();
            return target;
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

    function eventHandler(e) {
        if (hasEventPriority) {
            return false;
        }
        var target = dq(e.target).iterateAttr("data-ui-bind");
        if (target) {
            var dataBind = target.extractDataBind("data-ui-bind");
            if(dataBind.component) {
                var eventLabel = dataBind.component + "-" + e.type;
                targFunction = eventStack.getStack(eventLabel);
                if (targFunction) {
                    targFunction(target.items(0), e);
                }
            }
        }
        return true;
    }

    return {
        addAction: function (type, callback, key) {
            var types = type.split(',');
            for (var i = 0; i < types.length; i++) {
                if (eventActivated.indexOf(types[i]) < 0) {
                    dq(document).addEvent(types[i], eventHandler);
                    eventActivated.push(types[i]);
                }
                eventStack.addStack(key + "-" + types[i], callback);
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
        },
        attached: function (el, parent) {
            if (typeof el == 'string') {
                var elString = el;
                el = document.createElement('div');
                el.innerHTML = elString;
            }
            if (parent)
                document.getElementById(parent).appendChild(el);
            else
                document.getElementsByTagName('body')[0].appendChild(el);

        }
    }

})();
