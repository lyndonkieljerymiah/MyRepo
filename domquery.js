dq = function () {
    
    function _$(query) {
        this.elements = [];
        var i = 0;
        if (typeof query === 'string') {
            var results = document.querySelectorAll(query);
            if (results) {
                for (; i < results.length; i++) {
                    this.elements.push(results[i]);
                };
            }
        }
        else if (query.nodeType === 1 || query.nodeType === 9) {
            this.elements.push(query);
        }
        else if (query.length) {
            for (; i < query.length; i++) {
                this.elements.push(query[i]);
            }
        }
        else {
            this.elements.push(document);
        }

        this.selector = query;
        this.context = document;
        this.length = this.elements.length;
    }

    _$.prototype = {
        each: function (fn) {
            for (var i = 0; i < this.elements.length; i++) {
                fn.call(this, this.elements[i], i);
            };
            return this;
        },
        getElements: function (id) {
            var elements = new Array();
            this.each(function (el) {
                elements.push(el);
            })
            return elements;
        },
        find: function (query) {
            var results = [];
            this.each(function (el) {
                var nodes = el.querySelectorAll(query);
                if (nodes) {
                    results.push(new _$(nodes));
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
            return new _$(result);
        },
        first: function () {
            var result = [];
            this.each(function (el) {
                if (el.childNodes.length > 0) {
                    for (var i = 0; i < el.childNodes.length; i++) {
                        if (el.childNodes[i].nodeType == 1) {
                            result.push(new _$(el.childNodes[1]));
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
                    result.push(new _$(el.childNode[el.childNodes.length - 1]));
                }
            });
            return result;
        },
        data: function (dataKey, dataVal) {
            var object;
            var result = [];
            this.each(function (el) {
                if (el.dataset[dataKey] == dataVal) {
                    result.push(el);
                }
            })
            return new _$(result);
        },
        getProp: function (propertyName) {
            var propertyName = new Array();
            this.each(function (el) {
                propertyName.push(el[propertyName]);
            })
            return propertyName;
        },
        setProp: function (propertyName, value) {
            this.each(function (el) {
                el[propertyName] = value;
            })
        },
        getAttr: function (prop) {
            var property;
            var attributes = new Array();
            this.each(function (el) {
                attributes.push(el.getAttribute(prop) || false);
            });
            if (attributes.length == 1) {
                return attributes[0];
            }
            return attributes
        },
        setAttr: function (prop, value) {
            this.each(function (el) {
                el.setAttribute(prop) = value;
            });
            return this;
        },
        removeAttr: function (prop) {
            this.each(function (el) {
                el.removeAttribute(prop);
            })
        },
        count: function () {
            return this.elements.length;
        },
        addClass: function (className) {
            this.each(function (el) {
                if (el.className)
                    el.className = el.className.concat(' ' + className);
                else
                    el.className = className;
            })
            return this;
        },
        hasClass: function (className) {
            var hasClass = false;
            var classes = this.elements[0].className.split(className);
            for (var i = 0; i < classes.length; i++) {
                if (classes[i] == className) {
                    hasClass = true;
                }
            }
            return hasClass;
        },
        setStyle: function (prop, value) {
            this.each(function (el) {
                el.style[prop] = value;
            });
            return this;
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
        getParent: function () {
            var parentNode;
            this.each(function (el) {
                parentNode = el.parentNode;
            })
            return new _$(parentNode);
        },
        iterateAttr: function (prop, val) {
            var newTarget;
            this.each(function (el) {
                var target = el;
                while (typeof target !== 'undefined') {
                    if (typeof val !== "undefined") {
                        if (target.getAttribute(prop) == val) {
                            newTarget = new _$(target);
                            break;
                        }
                    } else {
                        if (target.hasAttribute(prop)) {
                            newTarget = new _$(target);
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
        create: function (tag) {

        },
        append: function (el, as) {

        }
    }
    _$.prototype.show = function () {
        this.each(function (el) {
            el.style.display = "block"
        })
    }
    _$.prototype.hide = function () {
        this.each(function (el) {
            el.style.display = "none"
        })
    }

    _$.prototype.getByCommonAttr = function (prop) {
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

    _$.prototype.getText = function () {
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

   return new _$(query);
} 

/*
    Request thru the server
*/
dq.Server = (function () {

    function createXhr() {

    }

    return {
        response : null,
        request: function (moduleName, variables, isFormData) {
            var mod = new ModuleLoader(moduleName, handleResponse, true, true);
            if (variables) {
                if (isFormData) {
                    mod.addFormVariables(variables);
                }
                else {
                    for (var key in variables) {
                        mod.addVariable(key, variables[key]);
                    }
                }
            }
            //mod.send();
            function handleResponse(obj) {
                if($.Server.response) 
                    $.Server.response(obj);
            }
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

    function isStackExist(key) {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].key == key) {
                return true;
            }
        }
        return false;
    }

    
    function addStack(key, obj) {
        if (!isStackExist(key)) {
            var object = {
                key: key,
                value: obj
            }
            stack.push(object);
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