/*==============================================================
 *  @desc: Main Controller 
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/

var PB = PB || {}

PB.Main = function() {
    
    var topMenu = new PB.UI.TopMenu("pb");
    var oNodeHandler = new PB.Object.ObjectNodeHandler();
    var that = this;
    var formCollection = new PB.FormCollection();
    
    this.getFormCollection = function() {
        return formCollection;
    }


    function init() {
        
        //assign frame object
        PB.FrameCommunication.frameObject = document.getElementById('page_designer');
        
        
        //click on the menu
        topMenu.onMenuClick = function(obj) {
            handleTopMenuNavigation(obj.id);
        }
        
        //initialize dialogs
        formCollection.initialize();
        formCollection.pageNavigator.onItemClick = handleItemClick;
        formCollection.pageNavigator.onMapButtonClick = handleMenuBar;
        
        //subscribe page navigator
        oNodeHandler.addObserver(that,'nodeUpdate');
        
        //load the template
        loadPage();
    }
    
    /*===============================================================================
    *   @description: a double functions first it loads the page base on the existing
    *   page otherwise load a fresh new page
     *=============================================================================*/
    function loadPage() { 
        /***************************************************************
        *load the new template 
        ****************************************************************/
        
        //must check if there's a page on editing
        //if there is call the editing page else reset = 0;
        //this is to refresh preventing to reset while you're editing
        var id = PB.Storage.isExist('pageId') ? PB.Storage.getValue('pageId') : 0; 
        
        //load the page or reset to a new fresh template
        PB.Server.load(id,function(obj) {
            
            var css = obj.cssContent;
            var body = obj.pageContent;
            
            PB.Object.PageInformation.cssContent = css; //get the information first
            PB.FrameCommunication.setCss(css); //setting up css of the page designer
            
            //checking the fetchLoad  = true means
            //pulling the current editing page
            // page is xml format
            if(obj.fetchLoad) {
                //store information to the page info object
                PB.Object.PageInformation.pageTitle = obj.pageTitle;
                PB.Object.PageInformation.pageDescription = obj.pageDescription;
                
                //we parse the xml format into object 
                //that will understand by the object node
                var xmlObjectNode = PB.Helper.XmlUtil.parse(body,'node');
                oNodeHandler.loadXml(xmlObjectNode);
                
            }else {
                //otherwise new page loaded begin parsing
                oNodeHandler.parse(body,false);
            }
        })
    }
    
    /*===============================================================================
    *   @description: call the function to save/update the page
    *   the page will set the url parameter and send to server
     *=============================================================================*/
    function savePage() {
        var data = (function() {
                        var uriObject = {
                            pageTitle : PB.Object.PageInformation.pageTitle || "",
                            pageDescription : PB.Object.PageInformation.pageDescription || "",
                            cssContent : (PB.Object.PageInformation) ? encodeURI(PB.Object.PageInformation.cssContent) : "",
                            dataContent : encodeURI(PB.Object.ObjectNodeUtilities.serialize(oNodeHandler.getRoot()))
                        }
        
                        if(PB.Storage.isExist('pageId')) {
                            uriObject.pageId = PB.Storage.getValue('pageId');
            
                        }
                        return uriObject;
                });
        PB.Server.save(data, function(o) {
            if(o.success) {
                //store a value
                PB.Storage.setValue('pageId', o.pageId); 
                alert("Your page has been save!!!");
            }
        })
    }
    
    
    /*******************************
     * Menu Header bar event handler 
     ********************************/
    function handleMenuBar(command) {
        
        var elementDialog,htmlFragment;
        var currentObjectNode = oNodeHandler.getCurrentObjectNode();
        var validator = new PB.Validator();
        
        try {
            switch (command) {
                case PB.MenuCommand.ToolbarCommand.PB_INSERT_ELEMENT:
                    
                    validator.messageId = 0;
                    validator.validateMatchingValue(currentObjectNode.nodeTag.toLowerCase(), 'text');
                    if(!validator.isError) {
                        elementDialog = formCollection.elementBuilder;
                        elementDialog.show(100,100,1);
                        elementDialog.onActionClick = function(obj) {
                            //build new node
                            var appendMode = parseInt(obj.appendMode);
                            var newObjectNode = oNodeHandler.buildObjectNode(obj);

                            //append new element
                            oNodeHandler.appendObjectNode(newObjectNode,parseInt(appendMode));
                        }
                    }
                    else {
                        throw validator.getError();
                    }
                    break;
                case PB.MenuCommand.ToolbarCommand.PB_EDIT_ELEMENT:
                    
                    validator.messageId = 1;
                    validator.validateMatchingValue(currentObjectNode.nodeTag.toLowerCase(), 'text');
                    if(!validator.isError) {
                        var properties = {
                            nodeTag : currentObjectNode.nodeTag,
                            nodeAttributes : currentObjectNode.nodeAttributes,
                            type : currentObjectNode.type
                        }
                        elementDialog = formCollection.elementBuilder;
                        elementDialog.edit(properties);
                        elementDialog.show(100,100,1);

                        elementDialog.onActionClick = function(obj) {
                            //modify object
                            oNodeHandler.modify(obj);
                        }
                    }else {
                        throw validator.getError();
                    }
                    break;
                case PB.MenuCommand.ToolbarCommand.PB_REMOVE_ELEMENT:
                    validator.messageId = 2;
                    validator.validateMatchingValue(currentObjectNode.id,oNodeHandler.getRoot().id);
                    if(!validator.isError) {
                        var confirmation = confirm("do you want to remove the " + currentObjectNode.caption + " object?");
                        if(confirmation == true) {
                            oNodeHandler.remove();
                        }
                    }else {
                        throw validator.getError();
                    }
                    break;
                case PB.MenuCommand.ToolbarCommand.PB_HTML_FRAGMENT:
                    validator.messageId = 0;
                    validator.validateMatchingValue(currentObjectNode.nodeTag.toLowerCase(), 'text');
                    if(!validator.isError) { 
                        htmlFragment = formCollection.htmlFragment;
                        htmlFragment.show(100,100,1);

                        htmlFragment.onActionClick = function(obj) {
                            oNodeHandler.parse(obj.getValue(),true);
                        }
                    }
                    else 
                    {
                        throw validator.getError();
                    }
                    break;
                case PB.MenuCommand.ToolbarCommand.PB_INSERT_TEXT:
                    var textEditor = formCollection.textEditor;
                    if(currentObjectNode.nodeTag.toLowerCase() == 'text') {
                        if(currentObjectNode.nodeAttributes != '' && currentObjectNode.nodeAttributes != null) {
                            textEditor.edit(currentObjectNode.nodeAttributes);
                        }
                    }

                    textEditor.show(100,100,1);
                    textEditor.onActionClick = function(obj) {
                        if(obj.editMode) {
                            oNodeHandler.modify(obj);
                        }else {
                            oNodeHandler.buildText(obj);
                        }
                    }
                    break;
                case PB.MenuCommand.ToolbarCommand.PB_OBJECT_MAPPING:
                    
                    if(currentObjectNode.type.toLowerCase() == 'element') {
                        throw "You cannot map element";
                    }
                    formCollection.formMapping.show(100,100,1);
                    break;

            }
        }catch(e) {
            alert(e);
        }
    }
    
    /*******************************
     * page navigation click 
     ********************************/
    function handleItemClick(obj) {
        //need enhancement
        var nodeId = obj.id;
        oNodeHandler.select(nodeId);
        PB.FrameCommunication.selectElement(nodeId);
        
    }
        
    /*******************************
     * Top Header Menu event handler
     ********************************/
    function handleTopMenuNavigation(target) {
        
        switch(target) {
            case  PB.MenuCommand.TopMenuCommand.PB_NEW_PAGE:
                PB.Storage.removeItem('pageId');
                PB.Browser.reload(300);
                break;
            case PB.MenuCommand.TopMenuCommand.PB_SAVE_PAGE:
                savePage();
                break;
            case PB.MenuCommand.TopMenuCommand.PB_LOAD_PAGE:
                PB.Storage.setValue('pageId',29);
                PB.Browser.reload(300);
                break;
            case PB.MenuCommand.TopMenuCommand.PB_PAGE_PROPERTIES:
                (function() {
                    var pageProperties = formCollection.pageProperties;
                    var properties = {}
                
                    properties.pageTitle = PB.Object.PageInformation.pageTitle;
                    properties.pageDescription = PB.Object.PageInformation.pageDescription;
                    pageProperties.edit(properties);
                
                    formCollection.pageProperties.show(100,100,1);
                    formCollection.pageProperties.onActionClick = function(obj) 
                    {
                        PB.Object.PageInformation.pageTitle = obj.pageTitle;
                        PB.Object.PageInformation.pageDescription = obj.pageDescription;
                    }
                }());
                break;
        }
    }
    
    init();
}

PB.Main.prototype.nodeUpdate = function(obj) {
    
    var pageRoot = obj.getRoot();
    var pageNavigator = this.getFormCollection().pageNavigator;
    var currentObjectNode = obj.getCurrentObjectNode();
    
    //update first the content before updating navigation
    var htmlContent = PB.Object.ObjectNodeUtilities.convertToHtml(pageRoot).outerHTML; //convert object to html
    PB.FrameCommunication.render(htmlContent); //render template
    
    //update navigation and select
    pageNavigator.nodeUpdate(pageRoot);
    pageNavigator.nodeSelect(currentObjectNode.id);
}




