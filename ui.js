/***********************************************************************
@Name: UI Framework Ver 2.0
@Author: Arnold G. Mercado
@Component:
    AjaxBindLoader
    Tabs
    Button
    Input - on conceptual stage
************************************************************************/


/*******************************************
    @name: 
*/
function convertingCallback(stringCallback) {
    
    //check if the object is calling
    var arCallback = stringCallback.split(".") || new Array();
    var ex = window;
    if(arCallback.length > 0) {
        for (var i = 0; i < arCallback.length; i++) {
            ex = ex[arCallback[i]];
        }
        return ex;
    }
    return false;
    
}
function getElementFullOffset(el) {
		
	var patt1=/[0-9]*/i;
    var ele = el;
    var top = 0;
    var left = 0;
	var np = null;
    while(ele.tagName != "BODY") {
		
        top += ele.offsetTop;
        left += ele.offsetLeft;
		
		np = ele.parentNode;
		ele = ele.offsetParent;
		
		
            while(np != ele){
                try {
			        if(window.getComputedStyle(np,null)){
				        var borderLeft = window.getComputedStyle(np,null).getPropertyValue("border-left-width");
				        var regBorderLeft = borderLeft.match(patt1);
				        var borderTop = window.getComputedStyle(np,null).getPropertyValue("border-top-width");
				        var regBorderTop = borderLeft.match(patt1);
				
				        left += new Number(regBorderLeft[0]);
				        top += new Number(regBorderTop[0]);
			        }
			
			        if(np.scrollLeft > 0){
				        left -= np.scrollLeft;
				
			        }
			        if(np.scrollTop > 0){
				        top -= np.scrollTop;
			        }
			        np = np.parentNode;
                } catch(e) {
                    break;
                }
		    }
        
		if(window.getComputedStyle(np,null)){
			var borderLeft = window.getComputedStyle(np,null).getPropertyValue("border-left-width");
			var regBorderLeft = borderLeft.match(patt1);
			var borderTop = window.getComputedStyle(np,null).getPropertyValue("border-top-width");
			var regBorderTop = borderLeft.match(patt1);
			
			left += new Number(regBorderLeft[0]);
			top += new Number(regBorderTop[0]);
		}
		if(ele == null){
			ele = document.body;
		}
    }
  
    return { top: top, left: left };
   
}

function formPrinting() {
    var targetPrintOut = dq('[print-target]');
    console.log(targetPrintOut);
    var targetContent = "";
    if(targetPrintOut.length == 0) {
        return false;
    }
    targetPrintOut.each(function (e) {
        console.log(e.tagName);
        if (e.style.display !== "none") {
            targetContent = e.innerHTML;
        }
    });
    
   
    if(targetContent != "") {
        var cssSource = dq("[rel=stylesheet]");
        var htmlRef = cssSource.items(0).getAttribute('href');
        var printWindowPreview = window.open('', 'print_preview');
        var printDocument = printWindowPreview.document;
        printDocument.write("<html><head><link href=" + htmlRef + " rel='stylesheet' text/type='text/css'></head><body style='width:957px;color:black'></body></html>");
        printDocument.body.innerHTML = targetContent;
	    printWindowPreview.focus();
	    printWindowPreview.print();
    }
}


var UI = UI || {}

UI.FrameLayout = {
    noFrame: function () {
        var layoutFrame = dq("#mainLayoutFrame");
        if (layoutFrame.length > 0) {
            layoutFrame.removeClass("frame");
        }
    },
    disableHome: function () {
        var btnHome = dq("#homePathButton");
        btnHome.removeFromParent();
    },
    disablePrinter: function () {
        var btnPrinter = dq("#printerPathButton");
        btnPrinter.removeFromParent();
    },
    disableTitle: function () {
        var title = dq("#mainLayoutLabel");
        title.removeFromParent();
    },
    setDefault: function () {
        this.disableHome();
        this.disablePrinter();
        this.disableTitle();
        this.noFrame();
    }
}

UI.Components = {

    start: function () {
        var _registerEvents = Array("click", "change");
        if (!dq.Document.isSubscriberExist(this)) {
            dq.Document.subscribe(this);
            if (arguments.length >= 1 && arguments[0] instanceof Array) {
                _registerEvents = arguments[0];
            }
            dq.Document.addAction(_registerEvents);
        }
    },

    update: function (target, e) {
        var target = dq(target).bubble(new Array("data-ui-bind"));
        if (target) {
            if (target.getAttr("data-ui-bind").length > 0) {
                var dataBind = dq.Parser.uiParsing(target);
                if (dataBind.component) {
                    switch (dataBind.component) {
                        case "tab":
                            UI.Tabs.handleEvent(target, e)
                            break;
                        case "button":
                            UI.Navs.handleEvent(target, e)
                            break;
                        case "formfield":
                            break;
                    }
                }
            }
        }
        return true;
    }
}

UI.Page = {

    clearPage: function (targetElement) {
        if (targetElement) {
            var dataGroup = targetElement.getAttribute("data-group") || false;
            if (dataGroup) {
                var tabGroup = dq(document).find("[data-group]")[0];
                if (tabGroup.length > 0) {
                    tabGroup.each(function (el) {
                        var elDataGroup = el.getAttribute("data-group");
                        if (elDataGroup == dataGroup) {
                            el.style.display = "none";
                        }
                    });
                }
                targetElement.style.display = null;
            }
            else {
                parent = targetElement.parentNode;
                var nodes = parent.childNodes;
                var length = nodes.length;
                for (var i = 0; i < length; i++) {
                    if (nodes[i].tagName) {
                        var pagem = nodes[i].getAttribute('pagem');
                        if (pagem == 1) {
                            nodes[i].style.display = 'none';
                        }
                    }
                }
            }
            targetElement.style.display = null;
        }
    }
}

UI.AjaxBindLoader = (function () {

    var ajaxCounter = 0,
        _variables = '',
        _form = '',
        _module = '',
        _arg = false,
        isEventLoaded = false,
        hasMultipleRequest = false,
        customActionStack = null,
        hookStack = null,
        waitingStack = null,
        globalElement = null,
        _immediate = null,
        customVariableStack = null;

    function init() {

        customActionStack = new dq.Stack();
        customVariableStack = new dq.Stack();
        ajaxRequestStack = new dq.Stack();
        hookStack = new dq.Stack();
        waitingStack = new Array();
        autoload();
    }

    function startAjaxLoading(element) {
        var elLoader = null;
        var targetArgs,
        targetLoader;
        if (element.getAttr("data-var")[0] != null) {
            targetArgs = element.getAttr("data-var")[0];
            targetArgs = dq.StringUtil.objectParsing(targetArgs);
            if (typeof targetArgs.targetLoader !== "undefined") {
                targetLoader = targetArgs.targetLoader || "";
            }
            else {
                targetArgs = element.getAttr("data-target")[0];
                targetArgs = dq.StringUtil.objectParsing(targetArgs);
                targetLoader = targetArgs.target || "";
            }

        }
        else {
            targetArgs = element.getAttr("data-target")[0];
            targetArgs = dq.StringUtil.objectParsing(targetArgs);
            targetLoader = targetArgs.target || "";

        }
        var targetElement = document.getElementById(targetLoader) || false;
        if (!targetElement) return false;
        var elPos = getElementFullOffset(targetElement);
        elPos.width = targetElement.offsetWidth;
        elPos.height = targetElement.offsetHeight;
        dq.LoadingAnimationHandler.start(elPos);
    }

    function stopAjaxLoading() {
        dq.LoadingAnimationHandler.stop();
    }

    function autoload() {
        var ajaxElement = dq("[data-ajax-bind]");
        if (ajaxElement.length > 0) {
            ajaxElement.each(function (el) {
                var ajaxBind = dq.Parser.ajaxParsing(dq(el));
                if (ajaxBind.load) {
                    preExecute(ajaxElement);
                }
            });
        }
    }

    function requestProcess(ajaxBind, element) {
        ajaxRequest = dq.Server.createAjaxRequest(ajaxBind);
        if (ajaxRequest) {
            ajaxRequest.setCounter(ajaxCounter);
            startAjaxLoading(element);
            ajaxRequest.execute(function (obj) {
                stopAjaxLoading();
                if (handleResponse(obj, element)) {
                    ajaxCounter++;
                    triggerEvent(element, "onLoaded");
                }
            });
        }
    }


    function preProcessing(element, e) {

        var ajaxBind = dq.Parser.ajaxParsing(element);
        var cancel = triggerEvent(element, "onRequest");
        if (!cancel) {
            preExecute(element);
        }
        else {
            waitingStack.push(element);
        }
    }

    /*checking and preparing for all the variables the need to send to the server*/
    function preExecute(element) {

        waitingStack = new Array(); //clear stack
        var bind = dq.Parser.ajaxParsing(element);
        var getVar = element.getAttr('get_var')[0];
        var postVar = element.getAttr('post_var')[0];
        if (getVar) {
            bind.variables = (bind.variables) ? bind.variables + "&" + getVar : getVar;
        }
        if (postVar) {
            bind.postVariables = (bind.postVariables) ? bind.postVariables + "&" + postVar : postVar;
        }

        if (_variables.length > 0) bind.variables = _variables;
        if (_immediate != null) bind.immediate = _immediate;
        if (_form.length > 0) bind.form = _form || '';
        if (_module.length > 0) bind.module = _module || '';
        if (_arg) bind = _arg;
        execute(element, bind);
        clearVariables();
    }

    function clearVariables() {
        _variables = '';
        _form = '';
        _module = '';
        _arg = false;
        _immediate = null;
    }

    function execute(element, bind) {

        var ajaxBind = bind || false;

        if (ajaxBind.map) {
            ajaxBind = customVariableStack.getStack(ajaxBind.map);
        }

        if (!ajaxBind) return false;
        hasMultipleRequest = false;

        //checking for multiple request
        if (ajaxBind.multipleRequest) {
            //set hasMultiple to prevent target delegation
            hasMultipleRequest = true;

            var arModules = ajaxBind.module,
                arVariables = ajaxBind.variables || null,
                arForms = ajaxBind.form || [];

            for (var i = 0; i < arModules.length; i++) {
                ajaxBind.module = arModules[i];
                if (typeof arVariables === 'string') {
                    ajaxBind.variables = arVariables;
                } else if (arVariables instanceof Array) {
                    ajaxBind.variables = arVariables[i] || null;
                }

                ajaxBind.form = arForms[i] || null;
                ajaxBind.immediate = false;
                requestProcess(ajaxBind, element);
            }
        }
        else {
            requestProcess(ajaxBind, element);
        }
    }

    function triggerEvent(source, trigger, loader) {
        var args = {
            source: source.items(0),
            bind: dq.Parser.ajaxParsing(source),
            cancel: false,
            loader: loader || null
        }
        switch (trigger) {
            case "onRequest":
                var onRequest;
                if (args.bind.onRequest) {
                    onRequest = customActionStack.getStack(args.bind.onRequest);
                    if (!onRequest) {
                        onRequest = convertingCallback(args.bind.onRequest);
                    }
                } else if (args.bind.onRequestObject) {
                    onRequest = args.bind.onRequestObject; //get the string function or object
                } else if (source.getAttr('data-onrequest')[0]) {
                    onRequest = convertingCallback(source.getAttr('data-onrequest')[0]);
                }
                if (onRequest) onRequest(args, UI.AjaxBindLoader);
                break;
            case "onLoading":
                var onLoading;
                if (args.bind.onLoading) {
                    onLoading = customActionStack.getStack(args.bind.onLoading);
                    if (!onLoading) {
                        onLoading = convertingCallback(args.bind.onLoading);
                    }
                }
                else if (source.getAttr('data-onloading')[0]) {
                    onLoading = convertingCallback(source.getAttr('data-onloading')[0]);
                }
                if (onLoading) onLoading(args);
                break;
            case "onLoaded":
                var onLoaded;
                if (args.bind.onLoaded) {
                    onLoaded = customActionStack.getStack(args.bind.onLoaded);
                    if (!onLoaded) {
                        onLoaded = convertingCallback(args.bind.onLoaded);
                    }
                }
                else if (source.getAttr('data-onloaded')[0]) {
                    onLoaded = convertingCallback(source.getAttr('data-onloaded')[0]);
                }
                if (onLoaded) onLoaded(args);
                break;
        }
        return args.cancel;
    }

    function insertContentToTarget(strTarget, content, args) {
        //hook on inserting into target
        if (hookStack.exist("onInsertingContentToTarget")) {
            var hookFunction = hookStack.getStack("onInsertingContentToTarget");
            var targetElement = hookFunction(strTarget, content, args) || false;
        }
        else {
            var targetElement = document.getElementById(strTarget) || false;
            if (targetElement) targetElement.innerHTML = content.innerHTML;
        }
        return targetElement;
    }



    function handleResponse(obj, element) {
        //trigger the onload first
        var cancel = triggerEvent(element, "onLoading", obj);
        if (cancel == true) return false;

        //store body temporarily
        var targetArgs = element.getAttr("data-target")[0];
        var targetElement = null;
        var hookFunction;

        if (!targetArgs) return false;

        targetArgs = dq.StringUtil.objectParsing(targetArgs);
        var temp = targetArgs.temp || "div";
        temp = document.createElement(temp);
        temp.innerHTML = obj.getBody().trim().replace(";;", ";");

        //loading pre load
        if (hookStack.exist("onFetching")) {
            hookFunction = hookStack.getStack("onFetching");
            hookFunction(temp, targetArgs);
        }


        if (targetArgs.target) {
            if (targetArgs.target instanceof Array) {
                for (var i = 0; i < targetArgs.target.length; i++) {
                    insertContentToTarget(targetArgs.target[i], temp, targetArgs);
                }
            }
            else {
                targetElement = insertContentToTarget(targetArgs.target, temp, targetArgs);
            }
        }


        //after loading filter
        if (hookStack.exist("afterFetching")) {
            hookFunction = hookStack.getStack("afterFetching");
            hookFunction(element, targetArgs);
        }

        if (typeof targetArgs.loadJs !== 'undefined' && targetArgs.loadJs === "true") obj.loadJs();
        if (typeof targetArgs.loadCss !== 'undefined' && targetArgs.loadCss === "true") obj.loadCss();
        if (targetArgs.singleLoad) {
            element.items(0).removeAttribute("data-ajax-bind");
            element.items(0).setAttribute("data-ajax-bind", "clearPage:'true'");
        }
        return true;
    }

    function buttonClose(e) {
        var targ = dq(e.target);
        if (targ.hasClass('lightbox')) {
            targ.items(0).innerHTML = 0;
            targ.items(0).style.display = "none";
            dq(document).removeEvent('click', buttonClose);
        }
    }

    function clearPage(el) {
        var parent = null;
        var targetArgs = el.getAttr("data-target")[0];
        if (targetArgs == null) {
            return false;
        }
        targetArgs = dq.StringUtil.objectParsing(targetArgs);
        var targetElement = document.getElementById(targetArgs.target) || false;
        if (targetElement) {
            parent = targetElement.parentNode;
            var nodes = parent.childNodes;
            var length = nodes.length;
            for (var i = 0; i < length; i++) {
                if (nodes[i].tagName) {
                    var pagem = nodes[i].getAttribute('pagem');
                    if (pagem == 1) {
                        nodes[i].style.display = 'none';
                    }
                }
            }
        }
        targetElement.style.display = null;
    }

    return {
        load: function () {
            //do one time load only
            if (!isEventLoaded) {
                var eventNames;
                if (arguments.length > 0) {
                    eventNames = arguments[0];
                }
                else {
                    //get object and register it
                    eventNames = new Array('click', 'change', 'blur', 'dblclick', 'mousedown', 'mouseover', 'mouseup');
                }

                //register
                if (!dq.Document.isSubscriberExist(this)) {
                    dq.Document.subscribe(this);
                    dq.Document.addAction(eventNames);
                }

                init();
                isEventLoaded = true;


            }
        },
        autoload: function () {
            autoload();
        },
        update: function (element, e) {
            var hookFunction;
            var dqElement = dq.Parser.isUIValid(element, "data-ajax-bind");
            if (!dqElement) return false;
            //get the event 
            var dataBind = dq.Parser.ajaxParsing(dqElement);

            //custom event
            var customEvent = dataBind.eventType || 'click';
            if (customEvent != e.type) return false;

            //trigger clear 
            if (hookStack.exist("onUpdating")) {
                hookFunction = hookStack.getStack("onUpdating");
                var isCancel = hookFunction(dqElement, dataBind, e) || false;
                if (!isCancel) {
                    preProcessing(dqElement, e);
                }
            }
            else {
                preProcessing(dqElement, e);
            }
            return true;
        },
        setVariables: function (variables) {
            _variables = variables;
        },
        setForm: function (form) {
            _form = form;
        },
        setModule: function (module) {
            _module = module;
        },
        setArgument: function (arg) {
            _arg = arg;
        },
        setImmediate: function (value) {
            _immediate = value;
        },
        preProcessing: function (element, e) {
            preProcessing(element, e);
        },
        executeQueue: function (bind) {
            if (waitingStack.length > 0) {
                for (var i = 0; i < waitingStack.length; i++) {
                    if (arguments.length == 0) {
                        preExecute(waitingStack[i]);
                    } else {
                        preExecute(waitingStack[i], bind);
                    }

                }
            }
            waitingStack = new Array(); //clear stack
        },
        bindVariable: function (key, obj) {
            if (typeof obj === "object") {
                customVariableStack.addStack(key, obj);
            }
        },
        bindAction: function (key, eventFn) {
            customActionStack.addStack(key, eventFn);
        },
        getBindAction: function (key) {
            return customActionStack.getStack(key);
        },
        removeAction: function (key) {
            customEventStack.removeStack(key);
        },
        hook: function (key, eventFn) {

            hookStack.addStack(key, eventFn);
        }
    }
})();

/***********************************************************************
@name: UI.Controls.Tabs 

@description:
    Collection of Tab Control uses to create controller for the tab structure 

@method:
    load() : create a class function based on the given structure
    activateTab(groupName,key): activate selected group of tab
        groupName : specify group of tab to be activated
        key : specify the button tab to be activated
************************************************************************/
UI.Tabs = (function () {

    var isEventLoaded = false,
        initialize = false,
        customEventStack = null,
        that = this,
        panels,
        selectionClass = "selected",
        buttonAjaxCounter = 0;

    function init() {
        customEventStack = new dq.Stack();
        var buttonTabs = dq.Parser.objectIdentifier("tab");
        panels = UI.Panels.getInstance();
        clearButton();
        buttonTabs.each(function (el) {
            var dataBind = dq.Parser.uiParsing(dq(el));
            if (dataBind.selectionClass) selectionClass = dataBind.selectionClass;
            if (dataBind.selected) {
                activateTab(dq(el), dataBind);
            }
        })
        initizialize = true;
    }


    function handleEvent(target, e) {
        var dataBind = dq.Parser.uiParsing(target);
        if (dataBind.component && dataBind.component == "tab") {
            if (dataBind.selectionClass) selectionClass = dataBind.selectionClass;
            switch (e.type) {
                case "click":
                    //preventing select to click
                    if (target.items(0).tagName.toLowerCase() !== "select")
                        activateTab(target, dataBind);
                    break;
                case "change":
                    activateTab(target, dataBind);
                    break;
            }
        }
    }
    function triggerEvent(button, trigger, objArgs) {
        var args = {
            source: button.items(0),
            bind: dq.Parser.uiParsing(button),
            cancel: false
        }

        switch (trigger) {
            case "beforeActive":
                var beforeActive;
                if (args.bind) {
                    if (args.bind.beforeActive) {
                        beforeActive = customEventStack.getStack(args.bind.beforeActive);
                        if (!beforeActive) {
                            beforeActive = convertingCallback(args.bind.beforeActive) || false;
                        }
                        beforeActive(args);
                    }
                }
                break;
            case "onActive":
                if (args.bind) {
                    if (args.bind.onActive) {
                        var onActive = customEventStack.getStack(args.bind.onActive);
                        if (!onActive) {
                            onActive = convertingCallback(args.bind.onActive);
                        }
                        onActive(args);
                    }
                }
                break;
        }
        return args.cancel;
    }
    function activateTab(button, dataBind) {
        var beforeActive, onActive;
        var key, groupName;
        
        //escape if selected
        if (button.hasClass(selectionClass)) return false;
        //trigger the before active event
        var cancel = triggerEvent(button, "beforeActive");
        if (cancel) return true;
        //var dataBind = dq.Parser.uiParsing(button);
        groupName = dataBind.name || "";
        if (button.items(0).tagName.toLowerCase() === "select") {
            key = button.text();
        } else {
            activateButtonTab(button, groupName);
            if (dataBind.key) {
                key = dataBind.key;
            } else {
                key = button.getAttr("id", 0);
            }

        }

        triggerEvent(button, "onActive");
        if (!dataBind.hasNoPanel) {
            panels.activatePanel(groupName, key, function (childKey) {
                var newButton = getButtonTab(childKey);
                if (newButton && !newButton.hasClass("selected")) activateTab(newButton);
            }, dataBind.isAnimation || false, dataBind.autoClear);
        }

        return true;
    }
    function activateButtonTab(button, groupName) {
        //diff handlers
        if (button.items(0).tagName.toLowerCase() === "select") {
        } else {
            //remove all selected
            clearButton(groupName);
            //dont add if it's input
            button.addClass(selectionClass);
        }
    }
    function getButtonTab(key) {
        var buttonTab = dq("#" + key);
        if (buttonTab.length > 0) {
            var dataBind = dq.Parser.uiParsing(buttonTab);
            if (dataBind && dataBind.component == 'tab') {
                return buttonTab;
            }
        }
        return false;
    }
    function clearButton(groupName) {
        var buttonGroup = dq.Parser.objectIdentifier("tab");
        if (buttonGroup) {
            buttonGroup.each(function (el) {
                var dataBind = dq.Parser.uiParsing(dq(el));
                if (arguments.length > 0) {
                    if (dataBind.name && dataBind.name == groupName) {
                        dq(el).removeClass(selectionClass);
                    }
                } else {
                    dq(el).removeClass(selectionClass);
                }
                //clear panel as well
                //panels.clearPanel(dataBind.name);
            });
        }
    }

    return {
        load: function () {
            if (!isEventLoaded) {
                UI.Components.start();
                isEventLoaded = true;
                init();
            }
        },
        handleEvent: function (target, e) {
            handleEvent(target, e);
        },
        clear: function (groupName) {
            clearButton(groupName);
            UI.Panels.clearPanel(groupName);
        },
        activateTab: function (key) {
            var button = getButtonTab(key);
            activateTab(button);
        },
        getBindAction: function (key) {
            return customEventStack.getStack(key);
        },
        bindAction: function (key, fnEvent) {
            customEventStack.addStack(key, fnEvent);
        },
        removeAction: function (key) {
            customEventStack.removeStack(key);
        }
    }
})()

UI.Panels = (function () {

    var instance;

    function construct() {
        var panel,
        that = this;

        function getPanels(ref) {
            var panelTab = dq.Parser.customIdentifier("panel", ref);
            if (panelTab.length > 0)
                return panelTab;
            return false;
        }

        function clearPanel(groupName) {
            panel = getPanels(groupName);
            if (panel.length > 0) {
                //clear children
                panel.each(function (el) {
                    var panelChild = dq(el).children();
                    var isPanelActivate = false;
                    panelChild.each(function (childElement) {
                        dq(childElement).setStyle("display", "none");
                    });
                });
            }
        }

        function activatePanel(groupName, key, callback, isAnimation, isAutoClear) {
            panel = getPanels(groupName);
            if (panel.length > 0) {
                //clear children
                panel.each(function (el) {
                    var panelChild = dq(el).children();
                    var isPanelActivate = false;
                    panelChild.each(function (childElement) {
                        var panelChildBind = dq.Parser.uiParsing(dq(childElement));
                        if (panelChildBind) {
                            if (panelChildBind.key && panelChildBind.key == key) {
                                if (isAnimation) {
                                    var makeVisibleAnimation = new Animations.Accelerate(
                                       function (dqp) {
                                           return function (animation) {
                                               var dq = dqp;
                                               if (animation.hasStarted()) {
                                                   dq(childElement).setStyle("opacity", makeVisibleAnimation.currentValue);
                                               }

                                               if (animation.getTime() >= 1000) {
                                                   makeVisibleAnimation.destroy();
                                               }

                                           }
                                       } (dq), 1, 0, 0, 1, 0, 1000);
                                    makeVisibleAnimation.start();
                                    dq(childElement).setStyle("display", "block");
                                    dq(childElement).setStyle("opacity", 0);
                                    isPanelActivate = true;
                                }
                                else {
                                    dq(childElement).setStyle("display", "block");
                                }
                            }
                            else {
                                dq(childElement).setStyle("display", "none");
                                if (isAutoClear) {
                                    dq(childElement).items(0).innerHTML = "";
                                }

                            }
                        }
                    });

                    if (isPanelActivate) {
                        //checking if its a child tab
                        var panelContainer = dq(el).parent().bubble("data-ui-bind");
                        if (panelContainer) {
                            var panelDataBind = dq.Parser.uiParsing(panelContainer);
                            if (panelDataBind.panel && panelDataBind.panel == "child") {
                                if (callback) setTimeout(callback(panelDataBind.key), 10);
                            }
                        }
                    }
                });
            }
        }

        
        return {
            activatePanel: function (groupName, key, callback,isAnimation,isAutoClear) {
                activatePanel(groupName, key, callback,isAnimation,isAutoClear);
            },
            clearPanel: function (groupName) {
                //clearPanel(groupName);
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) instance = new construct();
            return instance;
        }
    }
})();
/***********************************************************************
@description: SwitchMenu Class 
@method:
    toggleSwitch: toggle the switch
        buttons : list of button to toggle ie[new Array('button_home')]
        toggle : set toggle ['on'|'off'|'auto']
	reset : turn the switch button off
        buttons : list of buttons that need not to turn off
    setCustomFunction : set an event
        onClick : trigger when menu clicked
        onMouseOver: trigger when mouse is over on menu
    setButtonSwitch : set button to switch 
        buttonId : specify which button menu 
**********************************************************************/
UI.Navs = (function () {

    var customEventStack = null,
        buttonAjaxCounter = 0,
        hookStack = null,
        that = this;
    var isEventLoaded = false;

    function init() {
        customEventStack = new dq.Stack();
        hookStack = new dq.Stack();
    }

    function triggerEvent(button, trigger) {
        //trigger event
        var args = {
            source: button.items(0),
            cancel: false,
            state: button.hasClass("switch"),
            bind: dq.Parser.uiParsing(button)
        }

        switch (trigger) {
            case "onClick":
                if (args.bind.onClick) {
                    var clickEvent = customEventStack.getStack(args.bind.onClick);
                    clickEvent.call(this, args);
                }
                break;
        }
        return false;
    }

    function execute(button, e) {
        if (hookStack.exist("onClick")) {
            var hookFunction = hookStack.getStack("onClick");
            var isTrigger = hookFunction(button, e);
            if (isTrigger) {
                triggerEvent(button, "onClick");
            }
        }
        else {
            triggerEvent(button, "onClick");
        }
    }

    function handleEvent(target, e) {
        execute(target, e);
    }

    return {
        load: function () {
            if (!isEventLoaded) {
                UI.Components.start();
                init();
                isEventLoaded = true;
            }
        },
        buttonSwitch: function () {
            return buttonSwitch;
        },
        handleEvent: function (target, e) {
            if (e.type != "click") return false;
            
            var dataBind = dq.Parser.uiParsing(target);
            if (dataBind) {
                if (dataBind.component && dataBind.component == "button") {
                    //check if data confirmation
                    if (dataBind.message) {
                        var message = dataBind.message || "Uknown message";
                        UI.AlertDialog.confirm(message);
                        UI.AlertDialog.setCustomFunction(function (result) {
                            if (result == true) {
                                handleEvent(target, e);
                            }

                        });
                    } else {
                        handleEvent(target, e);
                    }
                }
            }
            return true;
        },
        bindAction: function (key, eventFn) {
            customEventStack.addStack(key, eventFn);
        },
        removeAction: function (key) {
            customEventStack.removeStack(key);
        },
        hook: function (key, eventFn) {
            hookStack.addStack(key, eventFn);
        }
    }
})();



/***********************************************************************
	@desc: Validator
	@method:
		addValidationRule 	: add validation rules of the input
            id: id of the input
            rule: validation rule [required:false pattern:/[a-z]/g]
        validates:  validates the value according to the rule that has been setup
            targetObj: the target to validate
		getCurrentState: get the current state [this property is useful when performing the validation event]
        getState: get all input state before submiting the form
            
	@Events:
		onValidation	: fires when the element changes
		onMouseOver : trigger when the 

************************************************************************/
UI.DataValidation = function (groupName) {

    var that = this;
    var validationStack = null;
    var validationEventStack = null;
    var emailPattern = /^([^\^\"\'\|\\])+?@([a-z]+?)\.([a-z]{2,4})dq/i;
    var currencyPattern;

    function init() {
        validationEventStack = new dq.Stack();
    }



    function preExecute(target, e) {

        var dataBind = dq.Parser.customParsing(target, "data-validation") || false;
        if (!dataBind) return false;

        var validateAt = dataBind.validateAt || 'client';
        var targetValue = target.text(); //get the input data

        if (validateAt == "client") {
            var pattern = (target.getAttr('data-pattern')) ? new RegExp(target.getAttr('data-pattern'), 'i') : getPattern(dataBind.dataType);
            var validationType = dataBind.type || "optional";
            var matchAt = dataBind.matchAt || false;
            //validate
            var result = doValidation(targetValue, validationType, pattern);
            //output the validation

        }
        else if (validateAt == "server") {

        }
    }

    function getPattern(inputType) {
        var pattern;
        switch (inputType) {
            case 'currency':
                pattern = /^(\d*?)(\.\d{1,2})?$/;
                break;
            default:
                pattern = false;

        }
    }


    function getInputValidation(id) {
        return validationStack.getStack(id);
    }

    function doValidation(value, validationType, pattern) {
        valResult = {
            state: true,
            errorTrace: ''
        }

        switch (validationType) {
            case 'required':
                if (value.trim().length > 0) {
                    valResult.state = true;
                } else {
                    valResult.state = false;
                    valResult.errorTrace = 'required';
                }
                break;
            case 'optional':
                if (value.trim().length > 0) {
                    if (pattern) {
                        valResult.state = pattern.test(value);
                        if (!valResult.state)
                            valResult.errorTrace = 'pattern';
                    }
                } else {
                    valResult.state = true;
                }
                break;
            case 'strict':
                if (value.trim().length > 0) {
                    var patternTest = true;
                    //check if comply with the pattern rules
                    if (valResult.pattern) {
                        patternTest = pattern.test(value);
                    }

                    if (patternTest) {
                        valResult.state = true;
                    } else {
                        valResult.state = false;
                        valResult.errorTrace = "pattern";
                    }
                } else {
                    valResult.state = false;
                    valResult.errorTrace = 'required';
                }
                break;
            default:
                break;
        }
        return valResult;
    }

    function autoFocus() {
        var input = document.querySelector('[autofocus]');
        input.focus();
    }

    init();

    return {
        autoFocus: function () {
            alert("Hello");
            autoFocus();
        }
    }
}




UI.AlertDialog = (function () {

    var resultCallback;
    var dialog = null;
    var blackCover = (function () {
        var blackDiv = document.createElement('div');
        blackDiv.style.width = '100%';
        blackDiv.style.height = '100%';
        blackDiv.style.position = 'fixed';
        blackDiv.style.top = '0px';
        blackDiv.style.left = '0px';
        blackDiv.style.zIndex = 999999;
        blackDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        return blackDiv;
    })();

    var htmlDialog = (function () {
        var htmlContent = "<div class='container' style='text-align:center'><div class='row'><h3 id='title' style='color:whitesmoke'></h3></div>";
        htmlContent += "<div class='row panel panel-solid' style='width: 350px; margin: 0px 5px 5px 5px; position:relative'>";
        htmlContent += "<img id='alertCloseForm' src='imgs/_active__no.png' class='img-mini-logo' style='position:absolute; top:5px;right:5px; cursor:pointer'></span>";
        htmlContent += "<div class='row'>";
        htmlContent += "<table>";
        htmlContent += "<tr>";
        htmlContent += "<td><img id='imageTitle' src='imgs/close_form.png' class='img-menu-size'></span></td>";
        htmlContent += "<td style='min-height:100px;color:#000' ><p id='message'></p></td>";
        htmlContent += "</tr>";
        htmlContent += "</table>";
        htmlContent += "</div>";
        htmlContent += "<div id='buttonContainer' class='right-grid'><button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Yes</button><button id='alertConfirmNo' class='btn btn-blue' style='width:60px;'>No</button></div>";
        htmlContent += "</div></div>";
        var dialogContainer = document.createElement("div");
        dialogContainer.className = "frame popup";
        dialogContainer.style.cssText = "position: absolute; top:30%; left:40%; border-radius:10px";
        dialogContainer.innerHTML = htmlContent;

        return {
            addHtmlButton: function (htmlButton) {
                dq(dialogContainer).find("#buttonContainer")[0].inner(htmlButton);
                return this;
            },
            addImageSource: function (imageSrc) {
                var imageElement = dq(dialogContainer).find('#imageTitle')[0].items(0);
                imageElement.src = imageSrc;
                return this;
            },
            addTitle: function (title) {
                dq(dialogContainer).find("#title")[0].inner(title);
            },
            get: function (message) {
                dq(dialogContainer).find("#message")[0].inner(message);
                return dialogContainer;
            }
        }
    })();

    function createDialog(message) {
        var htmlContent = "<div class='container' style='text-align:center'><div class='row'><h3 id='title' style='color:whitesmoke'></h3></div>";
        htmlContent += "<div class='row panel panel-solid' style='width: 350px; margin: 0px 5px 5px 5px; position:relative'>";
        htmlContent += "<img id='alertCloseForm' src='imgs/_active__no.png' class='img-mini-logo' style='position:absolute; top:5px;right:5px; cursor:pointer'></span>";
        htmlContent += "<div class='row'>";
        htmlContent += "<table>";
        htmlContent += "<tr>";
        htmlContent += "<td><img id='imageTitle' src='imgs/close_form.png'></span></td>";
        htmlContent += "<td style='min-height:100px;color:#000' >" + message + "</td>";
        htmlContent += "</tr>";
        htmlContent += "</table>";
        htmlContent += "</div>";
        htmlContent += "<div id='buttonContainer' class='right-grid'><button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Yes</button><button id='alertConfirmNo' class='btn btn-blue' style='width:60px;'>No</button></div>";
        htmlContent += "</div></div>";
        var ad = document.createElement('div');
        ad.className = "frame popup";
        ad.style.cssText = "position: absolute; top:30%; left:40%; border-radius:10px";
        ad.innerHTML = htmlContent;
        return ad;
    }


    function showConfirmDialog(message) {
        var button = "<button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Yes</button><button id='alertConfirmNo' class='btn btn-blue' style='width:60px;'>No</button>"
        var imageSrc = 'imgs/lightbulb.png';
        htmlDialog.addHtmlButton(button);
        htmlDialog.addImageSource(imageSrc);
        htmlDialog.addTitle("Confirm");
        dialog = htmlDialog.get(message);
        dialog.addEventListener("click", handleClick, false);
        dq.Document.addOwnEvent('click', handleClick);
        blackCover.appendChild(dialog);
        document.getElementsByTagName("body")[0].appendChild(blackCover);
    }

    function showAlertDialog(message) {
        var button = "<button id='alertConfirmYes' class='btn btn-blue' style='width:60px; margin-right:5px'>Ok</button>"
        var imageSrc = 'imgs/lightbulb.png';
        htmlDialog.addHtmlButton(button);
        htmlDialog.addImageSource(imageSrc);
        htmlDialog.addTitle("Alert");
        dialog = htmlDialog.get(message);
        dialog.addEventListener("click", handleClick, false);
        dq.Document.addOwnEvent('click', handleClick);
        blackCover.appendChild(dialog);
        document.getElementsByTagName("body")[0].appendChild(blackCover);
    }

    function closeConfirmDialog() {
        dialog.removeEventListener("click", handleClick);
        dq.Document.removeOwnEvent('click', handleClick);
        document.getElementsByTagName("body")[0].removeChild(blackCover);
        dialog = null; //freeing the memory
    }

    function handleClick(e) {
        var result = false;
        var target = e.target;
        var currentTarget = e.currentTarget;
        e.stopPropagation();
        if (currentTarget.nodeType !== 9) {
            if (target.id === 'alertCloseForm') {
                closeConfirmDialog();
            } else if (target.id === 'alertConfirmNo') {
                closeConfirmDialog();
            } else if (target.id === 'alertConfirmYes') {
                closeConfirmDialog();
                result = true;
            }
        } else {
            closeConfirmDialog();
        }
        if (resultCallback) resultCallback(result);
    }

    return {
        setCustomFunction: function (fn) {
            resultCallback = fn;
        },
        confirm: function (message) {
            resultCallback = null;
            showConfirmDialog(message);
        },
        alert: function (message) {
            resultCallback = null;
            showAlertDialog(message);
        }
    }

})();

