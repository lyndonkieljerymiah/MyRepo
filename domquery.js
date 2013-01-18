/*  DOM QUERY ver 1.0*/
(function () {
    function _$(query) {
        this.elements = [];
        var i = 0;
        if (typeof query === 'string') {
            var results = document.querySelectorAll(query);
            if (results) {
                this.elements = results;
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
            return new _$(childItems);
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
        parent: function () {
            var parentNode;
            this.each(function (el) {
                parentNode = el.parentNode;
            })
            return new _$(parentNode);
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
        getAttr: function (prop, index) {
            var property;
            var attributes = new Array();
            this.each(function (el) {
                attributes.push(el.getAttribute(prop) || false);
            });
            if (index) {
                return attributes[index];
            }
            return attributes;
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
        getStyle: function(prop) {
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

    window.$ = function () {
        return new _$(arguments[0]);
    }
} ());
