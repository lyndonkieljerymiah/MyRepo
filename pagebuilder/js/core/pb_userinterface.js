
/*==============================================================
 *  @desc: Page Builder UI Package
 *  PB.UI: comprises of all interface tools
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/

var PB = PB || {}

PB.UI = {};

PB.UI.Control = {};

PB.UI.Control.TabObject = function() {
    
    var that = this;
    var tabElements = new Array();
    
    this.onClick = null;
    this.onHover = null;
    
    this.setItems = function(el) {
        tabElements.push(el);
    }
    
    
    /*****************************
     *set the root of the tab
     *****************************/
    this.init = function() {
        var totalTabs = tabElements.length;
        
        for(var i=0; i < totalTabs; i++) {
            tabElements[i].addEventListener("click", function() {
                that.onClick(this);
            }, false)
        }
    }
}
PB.UI.Control.Tree = function() {
   
    
    this.createItem = function(key,value,style) { 
	
        var li = document.createElement('li');
        var anc = document.createElement('a');
	
        anc.id = key;
        anc.href = 'javascript:void(0)';
        anc.innerText = value;
        if(style != "") 
            anc.className = style;
        li.appendChild(anc);
        
        return li;
    }
    
    this.wrapItem = function(item) {
        var wrapList = document.createElement('ul');
        wrapList.appendChild(item);
        return wrapList;
    }
    
    this.appendItem = function(item,parentItem) {
        parentItem.appendChild(item);
    }
}


PB.UI.TopMenu = function(id) {
    
    
    var that = this;
    var logo = document.getElementById(id + '_top_logo');
    var menu = document.getElementById(id + '_top_navigation');
    
    this.onMenuClick = null;
    
    function init() {
        
        menu.style.display = 'none';
        
        var navigation = menu.getElementsByTagName('a');
        
        for(var i=0;i < navigation.length;i++) { 
            navigation[i].onclick = function(obj) {
                toggleMenu();
                that.onMenuClick(this);
            }
        }
        logo.onclick = function() {
            toggleMenu();
        }
        
        
    }
    
    function toggleMenu() { 
        if(menu.style.display == 'none') {
            menu.style.display = 'block';
        }else {
            menu.style.display = 'none'; 
        }
        
    }
    init();
}
/****************** End Header Category******************/



/*===================================================
 * @name: Dialog Form
 * @desc: abstract of the dialog form
 * @ver: since 2.0
 ====================================================*/
PB.UI.Dialog = {}
PB.UI.Dialog.Form = function() {
    
    var dialogForm = {
        body : (function() {
            var elBody = document.createElement('div');
            elBody.className = 'dialog_box' 
            return elBody;
        }()),
        content : (function(){ 
            var elContent = document.createElement('div');
            elContent.className = 'content'; 
            return elContent;
        }()),
        headBar : (function() {
            var elHeading = document.createElement('div'),
            nodeText = document.createElement('h3');
            
            elHeading.appendChild(nodeText);
            elHeading.id = "header";
            elHeading.className = 'header';
            elHeading.style.height = '25px';
            
            return elHeading;
        }()),
        closeButton : (function() {
            var elClose = document.createElement('div'),
            nodeText = document.createTextNode('x');
            elClose.appendChild(nodeText);
            elClose.className = 'mini';
            return elClose;            
        }()),
        minimizeButton : (function() { 
            var miniButton = document.createElement('div'),
            nodeText = document.createTextNode('-');
            miniButton.appendChild(nodeText);
            miniButton.className = 'mini';
            return miniButton;
        }())
    }
    
    var mouseLocked = false;
    var startPositionX = 0;
    var startPositionY = 0;
    var dragging = null;
    var diffX = 0;
    var diffY = 0;
    var currentHeight = 0;
    var that = this;
    
    this.dialogForm = (function() {
        return dialogForm;
    }());
    
    this.onActionClick = null;
    this.onClose = null;
    this.onMinimize = null;
    this.isEditMode = false;
    this.formActive = false;
    
    this.close = function() {
        buttonClose();
    }
    
    this.initEvent = function() {
        //close and minimize event
        dialogForm.minimizeButton.onclick = buttonMin;
        dialogForm.closeButton.onclick = buttonClose;
                
        
        //mouse event listener 
        dialogForm.headBar.onmouseover = dragHandler;
        dialogForm.headBar.onmouseout = dragHandler;
        dialogForm.headBar.onmousedown = dragHandler;
    }
    
    function init() {
        dialogForm.headBar.appendChild(dialogForm.closeButton);
        dialogForm.headBar.appendChild(dialogForm.minimizeButton);
        dialogForm.body.appendChild(dialogForm.headBar);
        dialogForm.body.appendChild(dialogForm.content);
    }
    function buttonClose() {
        //clean up the garbage in memory
        if(typeof this.destruct == 'function') this.destruct(); //close variable
        destruct();
    }
    function destruct() {
        
        //remove close and minimize event
        dialogForm.minimizeButton.onclick = null;
        dialogForm.closeButton.onclick = null;
        
        //remove mouse event listener 
        dialogForm.headBar.onmouseover = null;
        dialogForm.headBar.onmouseout = null;
        dialogForm.headBar.onmousedown = null;
        
        
        var htmlBody = document.getElementsByTagName('body')[0];
        htmlBody.removeChild(dialogForm.body);
        
        that.formActive = false;
    } 
    function buttonMin() {
        if (dialogForm.content.style.display == 'none') { 
            dialogForm.content.style.display = 'block';
        }
        else {
            dialogForm.content.style.display = 'none';
        }
    }
    function startMouseTracking(e) {
        diffY = e.clientY -  e.target.parentNode.offsetTop;
        diffX = e.clientX - e.target.parentNode.offsetLeft;
        mouseLocked = true;
        document.onmousemove = startMoving;
        document.onmouseup = stopMoving;
    }
    function startMoving(e) {
        if(mouseLocked) { 
            dialogForm.body.style.top = (e.clientY - diffY) + 'px';
            dialogForm.body.style.left = (e.clientX - diffX) + 'px';
            e.stopPropagation();
        }
    }
    function stopMoving() {
        document.onmousemove = null;
        document.onmouseup = null;
        mouseLocked = false;
    }
    function dragHandler(event) {
        
        var target = event.target.id;
        var type = event.type;
        
        if(target == "header") {
            switch (type) {
                case "mouseover":
                    event.target.style.cursor = 'move';
                    event.stopPropagation();
                    break;
                case "mouseout":
                    event.target.style.cursor = 'default';
                    event.stopPropagation();
                    break;
                case "mousedown":
                    startMouseTracking(event);
                    event.stopPropagation();
                    break;
            }
        }
    }
    
    init();
}
PB.UI.Dialog.Form.prototype = {
    formText : function(value) {
        var textHeader = this.dialogForm.headBar.getElementsByTagName('h3');
        textHeader[0].textContent = value;
    },
    show : function(top,left,level) {
        
        
        
        //preventing for memory dump
        if(!this.formActive) {
            //initialize event
            this.initEvent();
            var argLength = arguments.length;
        
            if(argLength == 1) { 
                this.dialogForm.body.style.top = top + 'px'; 
            }else if(argLength == 2) {
                this.dialogForm.body.style.top = top + 'px';
                this.dialogForm.body.style.left = left + 'px';
            }else if(argLength == 3) {
                this.dialogForm.body.style.top = top + 'px';
                this.dialogForm.body.style.left = left + 'px';
                this.dialogForm.body.style.zIndex = level;
            }
        
            var htmlBody = document.getElementsByTagName('body')[0];
            htmlBody.appendChild(this.dialogForm.body); 
            this.dialogForm.body.style.display = 'block';
            
            //check if need to initialize 
            if(typeof this.init == 'function') this.init(); //initialize all variable
        
            //form is active
            this.formActive = true;
        }
    },
    init: function() {
        
    },
    update : function() {},
    attach : function(htmlContent) {
        this.dialogForm.content.innerHTML  = htmlContent;
    },
    getContent : function() {
        return this.dialogForm.content;
    },
    setDialogType : function(type) {
        if(type == 0) {
            //fixed dialog
            this.dialogForm.minimizeButton.style.display = 'block';
            this.dialogForm.closeButton.style.display = 'block';
        } 
        else if(type == 1) {
            //fixed dialog
            this.dialogForm.minimizeButton.style.display = 'none';
            this.dialogForm.closeButton.style.display = 'none';
        }
        else if(type == 2) {
            //fixed dialog
            this.dialogForm.closeButton.style.display = 'none';
        }
    }
}


/**************************************************** 
 * @name: Dialog Element Builder
 * @ver: since 2.0
 ***************************************************/
PB.UI.Dialog.ElementBuilder = function() {
    
    var that = this;
    
    var inputFields = {}
    var buttons = {}
    var properties = {};
    var editMode = false;
        
    
    PB.UI.Dialog.Form.call(this);
    this.formText("Element Builder");
    
    this.init = function() {
        
        inputFields.Tag = document.getElementById('element_builder_tag');
        inputFields.Id = document.getElementById('element_builder_id');
        inputFields.Type = document.getElementById('element_builder_object_type');
        inputFields.Attribs = document.getElementById('element_builder_attribs');
        
        buttons.Child = document.getElementById('element_builder_child_btn');
        buttons.Parent = document.getElementById('element_builder_parent_btn');
        buttons.Sibling = document.getElementById('element_builder_sibling_btn');
        
        //event initialize
        inputFields.Type.onchange = function() {
            properties.type = this.value;
        }
        
        buttons.Child.onclick = handleClick;
        buttons.Parent.onclick = handleClick;
        buttons.Sibling.onclick = handleClick;
        
        clearInputs();
        if(editMode) {
            inputFields.Tag.value = properties.nodeTag;
            inputFields.Attribs.value = properties.nodeAttributes;
            
            var options = inputFields.Type.options;
            for(var i = 0; i < options.length;i++) {
                if(options[i].value == properties.type) { 
                    options[i].selected = true;
                }
            }
            
            buttons.Parent.style.display = 'none';
            buttons.Sibling.style.display = 'none';
            editMode = false;
        }else {
            buttons.Parent.removeAttribute('style');
            buttons.Sibling.removeAttribute('style');
        }
    }
    this.destruct = function() {
        properties = {} //empty the value
        //remove event 
        inputFields.Type.onchange = null;
        buttons.Child.onclick = null;
        buttons.Parent.onclick = null;
        buttons.Sibling.onclick = null;
    }
    
    this.edit = function(obj) {
        editMode = true;
        
        properties.nodeTag = obj.nodeTag;
        properties.nodeAttributes = obj.nodeAttributes;
        properties.type = obj.type;
    }
    
    function handleClick(e) {
        
        var appendMode = e.target.getAttribute('data-field');
        
        properties.nodeTag = inputFields.Tag.value;
        properties.caption = inputFields.Id.value || "";
        properties.nodeAttributes = mergeAttributes();
        properties.appendMode = appendMode;
        
        that.onActionClick(properties);
        that.close();
    }
    
    function clearInputs() {
        inputFields.Tag.value = '';
        inputFields.Id.value = '';
        inputFields.Attribs.value = '';
        inputFields.Type.selectedIndex = 0;
    }
    function mergeAttributes() {
        
        var stringAttributes = "";
        if(inputFields.Id.value != null && inputFields.Id.value != "") {
            stringAttributes = stringAttributes + PB.Helper.StringUtil.createAttributes("id", inputFields.Id.value);
        }
        if(inputFields.Attribs.value != null && inputFields.Attribs.value != "" ) {
            stringAttributes = stringAttributes + inputFields.Attribs.value;
        }
        
        return stringAttributes;
    }
}
PB.UI.Dialog.ElementBuilder.prototype = new PB.UI.Dialog.Form();



/**************************************************** 
 * @name: Dialog Page Properties
 * @ver: since 2.0
 ***************************************************/
PB.UI.Dialog.PageProperties = function() {
    
    PB.UI.Dialog.Form.call(this);
    this.formText("Page Properties");
    var that = this;
    var inputFields = {}
    var buttonUpdate;
    var properties = {}
    var editMode = false;
    
    this.init = function() {
        inputFields.pageTitle = this.getContent().querySelector('#page_properties_input_title');
        inputFields.pageDescription = this.getContent().querySelector('#page_properties_input_description');
        buttonUpdate = this.getContent().querySelector('#page_properties_update_btn');
        buttonUpdate.onclick = handleClick;
        
        clearInputs();
        if(editMode) {
            inputFields.pageTitle.value = properties.pageTitle;
            inputFields.pageDescription.value = properties.pageDescription;
            editMode = false;
        }
    }
    
    this.destruct = function() {
        
    }
    
    this.edit = function(obj) {
        editMode = true;
        properties.pageTitle = obj.pageTitle;
        properties.pageDescription = obj.pageDescription;
    }
    
    function clearInputs() {
        inputFields.pageTitle.value = '';
        inputFields.pageDescription.value = '';
    }
    
    function handleClick(e) {
        
        properties.pageTitle = inputFields.pageTitle.value;
        properties.pageDescription = inputFields.pageDescription.value;
        
        that.onActionClick(properties);
        that.close();
    }
    
}

PB.UI.Dialog.PageProperties.prototype = new PB.UI.Dialog.Form();

/**************************************************** 
 * @name: Dialog Page Navigator
 * @ver: since 2.0
 ***************************************************/
PB.UI.Dialog.PageNavigator = function() {
    
    var that = this;
    var navTabs,ulTabs;
    
    
    
    this.nodeSelected = null;
    this.onItemClick = null;
    this.onMapButtonClick = null;
    this.htmlPanel = null;
    
    PB.UI.Dialog.Form.call(this);
    
    this.formText("Page Navigator");
    this.init = function() {
        
        //get the html panel
        this.htmlPanel = document.getElementById('page_navigator_html_nav');
        navTabs = document.getElementById('page_navigator_tab').getElementsByTagName('a');
        ulTabs = document.getElementById('page_navigator_panel').getElementsByTagName('li');
        
        (function(){
            //attaching nav tab event
            if(navTabs) {
                for(var i=0, l = navTabs.length ; i < l;i++) {
                    navTabs[i].onclick = function(e) {
                        for(var i=0; i < ulTabs.length;i++) { 
                            ulTabs[i].removeAttribute('class');
                            if(ulTabs[i].getAttribute('data-tabindex') == this.id) {
                                ulTabs[i].className = "show";
                            }
                        }
                    }
                }
            }
        }());
        
        (function() {
            //attaching event on toolbar
            var toolBars = document.getElementById('page_navigator_toolbar').getElementsByTagName('a');
            if(toolBars) {
                for(var i=0, l = toolBars.length; i < l;i++) {
                    toolBars[i].onclick = function(e) {
                        var command = this.getAttribute('data-variable');
                        if(that.onMapButtonClick)
                            that.onMapButtonClick(command);
                    }
                }
            }
        }())
    }
    this.nodeSelect = function(obj,callback) {
        
        if(this.nodeSelected) {
            this.nodeSelected.style.cssText = "";
            this.nodeSelected.removeAttribute('style');
        }
        
        var currentSelection = (function() {
            if(typeof obj == 'object') {
                return obj
            }
            return that.htmlPanel.querySelector('a[id="' + obj.toString() + '"]');
        }()) ;
        
        currentSelection.style.backgroundColor = 'whitesmoke';
        currentSelection.style.borderRadius = '5px';
        currentSelection.style.boxShadow = '1px 1px 1px gray';
        currentSelection.style.color = 'gray';
        
        this.nodeSelected = currentSelection;
        
        if(callback) {
            callback(this.nodeSelected);
        }
        this.onItemClick(this.nodeSelected);
    }
    this.destruct = function() {
    //do nothing for now
    }
}
PB.UI.Dialog.PageNavigator.prototype = new PB.UI.Dialog.Form();

PB.UI.Dialog.PageNavigator.prototype.nodeUpdate = function(objectNode) {
        
    var that = this;
    var listOfNodes = createTreeView(objectNode);
    
    this.htmlPanel.innerHTML = "";
    this.htmlPanel.appendChild(listOfNodes);
        
    var navigation = this.htmlPanel.getElementsByTagName('a');
    for(var i=0,l=navigation.length;i < l;i++) {
        navigation[i].onclick = function() {
            that.nodeSelect(this);
        }
    }
    
    function createTreeView(nodes) {
        
        var treeView = new PB.UI.Control.Tree();
        var totalChildNodes = nodes.count();
        var caption = nodes.nodeTag.toLowerCase() + "-" + nodes.caption;
        var className = "";
                
        if(nodes.nodeTag.toLowerCase() != 'text' && nodes.type != 'element') {
            className = "special";
        }
        
        var treeNode = treeView.createItem(nodes.id,caption,className);
        
        if(totalChildNodes > 0) {
            //call itself to dig child
            for(var index=0;index < totalChildNodes; index++) 
            {
                var child = nodes.nodeItems[index]; //get child
                var node = arguments.callee(child); //dig it and wrap to parents
                treeNode.appendChild(node);
            }
        }
        return  treeView.wrapItem(treeNode);
    }
}


/**************************************************** 
 * @name: Dialog HTML Fragment
 * @ver: since 2.0
 ***************************************************/
PB.UI.Dialog.HtmlFragment = function() {

    var that = this;
    var button,textEditor;
    
    PB.UI.Dialog.Form.call(this);
    this.formText("Html Element Fragment");
        
    this.init = function() {
        
        button = this.getContent().querySelector('#html_fragment_update');
        textEditor = this.getContent().querySelector('#html_fragment_text');
        textEditor.value = '';
        
        button.onclick = function() {
            that.onActionClick(that);
            that.close();
        }
    }
    this.getValue = function() {
        return textEditor.value;
    }
    this.destruct = function() {
        button.onclick = null;
    }
    
}
PB.UI.Dialog.HtmlFragment.prototype = new PB.UI.Dialog.Form();

/**************************************************** 
 * @name: Text Editor
 * @ver: since 2.0
 ***************************************************/
PB.UI.Dialog.TextEditor = function() {
    
    var that = this;
    var editMode = false;
    var inputText,btnUpdate;
    var properties = {}
    
    PB.UI.Dialog.Form.call(this);
    
    this.init = function() {
        this.formText('Text Editor');
        inputText = document.getElementById('text_editor_text');
        btnUpdate = document.getElementById('text_editor_update_button');
        
        btnUpdate.onclick = function() {
            properties.editMode = editMode;
            properties.nodeAttributes = inputText.value;
            that.onActionClick(properties);
            editMode = false;
            that.close();
        }
        inputText.value = "";
        if(editMode) {
            inputText.value = properties.value;
        }
    }
    this.destruct = function() {
        btnUpdate.onclick = null
    }
    this.edit = function(value) {
        editMode = true;
        properties.value = value;
    }
}
PB.UI.Dialog.TextEditor.prototype = new PB.UI.Dialog.Form();
/**************************************************** 
 * @name: Dialog Form Mapping
 * @ver: since 2.0
 ***************************************************/
PB.UI.Dialog.FormMapping = function() {
    
    var that = this;
    
    PB.UI.Dialog.Form.call(this);
    
    
    this.init = function() {
        
        var navTabs = this.getContent().querySelector('#map_object_tab').getElementsByTagName('a');
        var ulTabs = this.getContent().querySelector('#map_object_panel').getElementsByTagName('li');
        var saveButton = this.getContent().querySelector('#map_object_save_btn')
        
        //add event on navigation
        if(navTabs) {
            for(var i=0; i < navTabs.length;i++) {
                navTabs[i].onclick = function(e) {
                    for(var i=0; i < ulTabs.length;i++) { 
                        ulTabs[i].removeAttribute('class');
                        if(ulTabs[i].getAttribute('data-tabindex') == this.id) {
                            ulTabs[i].className = "show";
                        }
                    }
                };
            }
        }
        
    //
        
    }
    
    this.destruct = function() {
        
    }
}
PB.UI.Dialog.FormMapping.prototype = new PB.UI.Dialog.Form();