
/*==============================================================
 *  @desc: Page Builder Object
 *  @date: Since ver 2.0
 *  Author: Arnold Mercado
 *  Copyright 2012 Emettra Applied Technologies
 *  ============================================================*/
 

var PB = PB || {}

PB.Object = {}

PB.Object.PageInformation = {
    pageTitle : "",
    pageDescription : "",
    headerInformation : "",
    cssContent : ""
}



PB.Object.ObjectNode = function() { 
    this.id = 0;
    this.parentId = 0;
    this.idTracker = 0;
    this.caption = "",
    this.nodeTag = "",
    this.nodeAttributes = "",
    this.type = "",
    this.nodeItems = new Array();
    this.tableMapping = new Array();
    this.fieldMapping = new Array();
    this.actionMapping = new Array();
}

PB.Object.ObjectNode.prototype = {
    register : function(newObjectNode) {
        //get the new id
        this.idTracker = this.idTracker  + 1;
        newObjectNode.id = this.idTracker;
    },
    append : function(newObjectNode,type,root) {
        
        var parentOfCurrentNode;
        var indexOfNode;
         
        //make sure the object is instance of elementobject
        if(newObjectNode instanceof PB.Object.ObjectNode) {
            //append as child
            if(type == 0) {
                newObjectNode.parentId = this.id;
                this.nodeItems.push(newObjectNode);
            }
            //append as parent
            else if(type == 1) {
                parentOfCurrentNode = root.searchNode(this.parentId);
                
                if(parentOfCurrentNode != null) 
                {
                    
                    //remove first the current object node in the root
                    indexOfNode = parentOfCurrentNode.nodeItems.indexOf(this);
                    parentOfCurrentNode.nodeItems.splice(indexOfNode,1);
                    
                    //copy the parent id 
                    newObjectNode.parentId = this.id;
                    this.parentId = newObjectNode.id;

                    //rearrange position
                    newObjectNode.nodeItems.push(this);
                    parentOfCurrentNode.nodeItems.push(newObjectNode);
                }
                
            }
            //append as sibling
            else if(type == 2) {
                parentOfCurrentNode = root.searchNode(this.parentId);
                if(parentOfCurrentNode != null) {
                    //copy the parent id 
                    newObjectNode.parentId = this.parentId;
                    //get the index of current object
                    indexOfNode = parentOfCurrentNode.nodeItems.indexOf(this);
                    parentOfCurrentNode.nodeItems.splice(indexOfNode,0,newObjectNode);
                }
            }
        }
    },
    removeChild : function(target,deep) {
        
        var parentId = target.parentId;
        if(parentId == this.id) {
            var index = this.nodeItems.indexOf(target)
            this.nodeItems.splice(index,1);
            return true;
        }
        if(deep) {
            var parentObjectNode = this.searchNode(parentId);
            return parentObjectNode.removeChild(target,false);
        }
        return false;
        
    },
    searchNode: function(id) {
        
        if(id == this.id) { 
            return this;
        }
        
        var totalChildNodes = this.nodeItems.length;
        if(totalChildNodes > 0) {
            for(var i =0; i < totalChildNodes; i++) { 
                var childObjectNode = this.nodeItems[i];
                var searchObjectNode = childObjectNode.searchNode(id);
                if(searchObjectNode) { 
                    return searchObjectNode;
                }
            }
        }
        return null;
    },
    getChild: function(index) {
        return this.nodeItems[index];  
    },
    count : function() {
        return this.nodeItems.length;  
    },
    hasChild : function() {
        var totalChild = this.nodeItems.length;
        return (totalChild > 0) ? true : false;
    },
    getXml: function() {
        var strXml =    '<node>';
        strXml +=       '<nodeId>' + this.id + '</nodeId>';
        strXml +=       '<nodeParentId>' + this.parentId + '</nodeParentId>';
        strXml +=       '<nodeTag>' + this.nodeTag + '</nodeTag>';
        strXml +=       '<nodeAttributes>' + this.nodeAttributes + '</nodeAttributes>';
        strXml +=       '<nodeCaption>' + this.caption + '</nodeCaption>';
        strXml +=       '<nodeType>' + this.type + '</nodeType>';
        strXml +=       '<nodeTracker>' + this.idTracker + '</nodeTracker>';
        
        if(this.actionMapping.length > 0) { 
            strXml +=       '<action>';
            for(var i =0, l = this.actionMapping.length; i < l; i++) {
                strXml +=       '<data>' + this.actionMapping[i] + '</data>';
            }
            strXml +=       '</action>';
        }
        
        
        strXml +=       '</node>';
        return strXml;
    },
    addActionMapping : function(actionMapping) {
        this.actionMapping.push(actionMapping);
    },
    clearMaps : function(actionMapping) {
        var len = this.actionMapping.length;
        if(len > 0) {
            //reset
            this.actionMapping = [];            
        }
    }
}



PB.Object.ObjectNodeHandler = function() {
    
    var pageRoot,currentObjectNode;
    var that = this;
    
    this.appendObjectNode = function(newObjectNode,appendMode) {
        //append new object
        currentObjectNode.append(newObjectNode,appendMode,pageRoot);
        this.select(newObjectNode.id);
        //changes made notify observers
        this.notify();
    }
    this.setRoot = function(newPageRoot) {
        pageRoot = null;
        pageRoot = newPageRoot; 
    }
    this.remove = function() {
        var parentId = currentObjectNode.parentId;
        if(pageRoot.removeChild(currentObjectNode,true)) {
            this.select(parentId);
        }
        this.notify();
    }
    
    this.buildText = function(properties) {
        properties.nodeTag = 'text'
        properties.type = PB.ObjectType.PB_ELEMENT_TYPE;
        var newObjectNode = this.buildObjectNode(properties);
        this.appendObjectNode(newObjectNode, 0);
    }
    
    this.buildObjectNode = function(properties) {
        
        var newObjectNode = new PB.Object.ObjectNode();
        
        if(properties) {
            if(properties.id) {
                newObjectNode.id = properties.id;
            }else {
                pageRoot.register(newObjectNode)
            }
            
            newObjectNode.nodeTag = properties.nodeTag;
            newObjectNode.nodeAttributes = properties.nodeAttributes;
            var caption = (properties.nodeId != '' && properties.nodeId != null) ? properties.nodeId : properties.nodeTag.toLowerCase() + newObjectNode.id;
            newObjectNode.caption = properties.caption || caption;
            newObjectNode.type = properties.type || '';
            
            //make sure not element
            if(properties.type != PB.ObjectType.PB_ELEMENT_TYPE) {
                if(properties.nodeAttributes) {
                    var attributes = PB.Helper.StringUtil.extractAttribute2(properties.nodeAttributes);
                    for(var i=0, l=attributes.length;i < l;i++) {
                        //check event
                        if(attributes[i].key == 'data-action') {
                            newObjectNode.addActionMapping(attributes[i].value);
                        }
                    }
                }
            }
            
        
        }else {
            pageRoot.register(newObjectNode);
        }
        
        return newObjectNode;
    }
    this.modify = function(properties,current,stopNotify) {
        
        if(!current) {
            current = currentObjectNode;
        }
        
        if(properties) {
            !!properties.nodeTag && (current.nodeTag = properties.nodeTag);
            !!properties.nodeAttributes && (current.nodeAttributes = properties.nodeAttributes);
            !!properties.caption && (current.caption = properties.caption);
            !!properties.type && (current.type = properties.type || '');
        }
        
        //make sure not element
        if(properties.type != PB.ObjectType.PB_ELEMENT_TYPE) {
            if(properties.nodeAttributes) {
                var attributes = PB.Helper.StringUtil.extractAttribute2(properties.nodeAttributes);
                for(var i=0, l=attributes.length;i < l;i++) {
                    current.clearMaps();
                    //check event
                    if(attributes[i].key == 'data-action') {
                        current.addActionMapping(attributes[i].value);
                    }
                }
            }
        }
        
        if(!stopNotify) {
            //changes made notify observers
            this.notify();
        }
        
    }
    this.select = function(id) {
        currentObjectNode = null;
        currentObjectNode = pageRoot.searchNode(id);
    }
    this.getCurrentObjectNode = function() {
        return currentObjectNode;
    }
    this.getRoot = function() {
        return pageRoot;
    }
    
    function init() {
        PB.Observable.call(that);
        
        //initialize pageroot
        pageRoot = new PB.Object.ObjectNode();
        pageRoot.id = 1;
        pageRoot.caption = "Main";
        pageRoot.idTracker = 1;
        pageRoot.parentId = 0;
        currentObjectNode = pageRoot;
    }
    
    init();
}
PB.Object.ObjectNodeHandler.prototype.parse = function(content, isPartial) {
    
    var hasRoot = false;
    var htmlContent = document.createElement("div");
    var elementUtil = PB.Object.ElementBuilder.getInstance();
    var pageRoot = this.getRoot();
    var currentObjectNode = this.getCurrentObjectNode();
    var that = this;
    
    
    htmlContent.innerHTML = content || "";
    htmlContent = elementUtil.cleanHtml(htmlContent).element; 
    if(isPartial) {
        parse(htmlContent,true,currentObjectNode);
    }
    else {
        //check if fragment or no child at all
        var totalChild = htmlContent.childNodes.length;
        if(totalChild == 1) {
            hasRoot = true;            
        }
            
        if(hasRoot) {
            //parse root
            htmlContent = htmlContent.childNodes[0];
        }
            
        parse(htmlContent,false,pageRoot);
    }
        
    //changes made notify observers
    this.notify();
    
    function parse(element,includeRoot,currentNode) {
        try {
            var objectNode;
            var elementBuilder = PB.Object.ElementBuilder.getInstance();
            var caption  = "";
            
            if(!includeRoot) {
                //strip element and convert to object node
                var elementObject = elementBuilder.strip(element);
                
                if(!currentNode) {
                    objectNode = that.buildObjectNode(elementObject);
                }else {
                    objectNode = currentNode; 
                    that.modify(elementObject,objectNode,true);
                }
            }else {
                objectNode = currentNode;
            }
            
            
            var elementChildNodeTotal = element.childNodes.length;
            if(elementChildNodeTotal > 0) { 
                for(var i = 0;i < elementChildNodeTotal;i++) { 
                    var elementChildNode = element.childNodes[i];
                    var returnObjectNode = arguments.callee(elementChildNode,false);
                    
                    //check if data-role is form
                    objectNode.append(returnObjectNode,0);
                }
            }
        }catch(e) { 
            alert("Error in Parse function... \n"+ e);
        }
        return objectNode;
    }
}
PB.Object.ObjectNodeHandler.prototype.loadXml = function(xmlObjectNodes) {
    
    var that = this;
    var pageRoot = loadXml(xmlObjectNodes,1);
    this.setRoot(pageRoot);
    this.notify();
    
    function loadXml(xmlObjectNodes,step) {
        
        var xmlObjectNode = getObjectNode(xmlObjectNodes,step);
        var childNodes = getChildNode(xmlObjectNodes,xmlObjectNode.nodeid);
        
        var objectNodeOrigin = {
            nodeTag : xmlObjectNode.nodetag,
            nodeAttributes : xmlObjectNode.nodeattributes,
            caption : xmlObjectNode.nodecaption,
            id : parseInt(xmlObjectNode.nodeid),
            type : xmlObjectNode.nodetype
        }
        var objectNode = that.buildObjectNode(objectNodeOrigin);
        if(objectNode.id == 1) {
            objectNode.idTracker = parseInt(xmlObjectNode.nodetracker);
        }
        
        var totalChildNode = childNodes.length;
        if(totalChildNode > 0) {
            for(var i=0;i < totalChildNode; i++) {
                objectNode.append(arguments.callee(xmlObjectNodes,parseInt(childNodes[i].nodeid)),0)
            }
        }
        return objectNode;
    }
    
    function getObjectNode(xmlObjectNodes,id) {
        for(var i=0,len=xmlObjectNodes.length;i < len; i++) {
            var objectNode = xmlObjectNodes[i];
            if(parseInt(objectNode.nodeid) == id) {
                return objectNode;
            }
        }
        return null;
    }
    
    function getChildNode(xmlObjectNodes,id) {
        var childNodes = new Array();
        for(var i=0,len=xmlObjectNodes.length;i < len; i++) {
            var objectNode = xmlObjectNodes[i];
            if(parseInt(objectNode.nodeparentid) == id) {
                childNodes.push(objectNode);
            }
        }
        return childNodes
    }
}


PB.Object.ObjectNodeUtilities = (function() {
   
    function htmlConversion(objectNode) {
        
        var elementUtil = PB.Object.ElementBuilder.getInstance();
        
        //converting to element
        var el = elementUtil.buildElement(objectNode.nodeTag,objectNode.nodeAttributes);
        if(el.nodeType == 1) {
            //adding data-index to control the element within the rendering
            el.setAttribute('data-index',objectNode.id);
        }
        
        var totalObjectNode = objectNode.count();
        if(totalObjectNode > 0) {
            for(var i=0; i < totalObjectNode;i++) {
                var childNode = objectNode.getChild(i);
                var elementNode = arguments.callee(childNode);
                el.appendChild(elementNode);
            }
        }
        
        return el;
    }
    function nodeSerialization(objectNode) {
        
        var strNodeXml = objectNode.getXml();
        var totalObjectNode = objectNode.count();
        
        if(totalObjectNode > 0) {
            for(var i=0; i < totalObjectNode;i++) {
                var childNode = objectNode.getChild(i);
                strNodeXml += arguments.callee(childNode);
            }
        }
        return strNodeXml;
    } 
    
    return {
        convertToHtml : function(objectNode) {
            return htmlConversion(objectNode);
        },
        serialize : function(objectNode) {
            var objectString = '<object>' + nodeSerialization(objectNode) + '</object>';
            return objectString;
        }
    }
}())

/*-----------------------------------
 * create HTML Element
 *------------------------------------------------------*/
PB.Object.ElementBuilder = (function() {
    
    var instance;
    
    function constructor() {
        
        function buildElement(tag,attributes) {
            var element = null;
            if(tag != "" && tag != null) 
            {
                if(tag.toLowerCase() != 'text') {
                    //create the element
                    element = document.createElement(tag) 
                    
                    //put the attributes
                    var attribs = PB.Helper.StringUtil.extractAttribute(attributes);
                    if(attribs.properties.length > 0) {
                        for(var index = 0;index < attribs.properties.length; index++) {
                            element.setAttribute(attribs.properties[index], attribs.values[index]);
                        }
                    }
                }else {
                    element = document.createTextNode(attributes);
                }
            }
            return element;
        }
        function strip(element) {
            
            //get the tag
            var elementTag;
            var elementAttributes;
            var elementId;
            var type;
            var elementType;
            var nodeAttributes = "";
        
            elementType = element.nodeType;
            if(elementType == 1) {
                elementTag = element.tagName;
                elementAttributes = element.attributes;
                elementId = element.id;
                type = PB.ObjectType.PB_ELEMENT_TYPE;
                if(elementAttributes.length > 0) {
                    for(var i=0, len=elementAttributes.length;i < len; i++) { 
                        //don't include the role'
                        if(elementAttributes[i].nodeName == 'data-role') {
                            type = PB.ObjectType.validate(elementAttributes[i].nodeValue.toLowerCase());
                        }else {
                            nodeAttributes += PB.Helper.StringUtil.createAttributes(elementAttributes.item(i).nodeName, elementAttributes.item(i).nodeValue);
                        }
                    }
                }
            }
            else if(elementType == 3) { 
                elementTag = "text";
                //make it trim
                nodeAttributes =  PB.Helper.StringUtil.trim(element.nodeValue);
                type = PB.ObjectType.PB_ELEMENT_TYPE;
            }
    
            return { 
                nodeTag : elementTag.toLowerCase(),
                type : type,
                nodeAttributes : nodeAttributes,
                nodeId : elementId
            }
        }
        function cleanHtml(element) {
            
            var hasWhiteSpace = false;
            if(element.nodeType == 3) {
                var value = PB.Helper.StringUtil.trim(element.nodeValue);
                //eliminate the white space
                if(value == '') {
                    hasWhiteSpace = true;
                }
            }
            
            var elementChildNodeTotal = element.childNodes.length;
            if(elementChildNodeTotal > 0) {
                var inc = 0;
                while (inc < elementChildNodeTotal) { 
                    var elementChild = element.childNodes[inc];
                    var result = arguments.callee(elementChild);
                    //remove white space
                    if(result.hasWhiteSpace) {
                        element.removeChild(result.element);
                        elementChildNodeTotal = element.childNodes.length || 0;
                    }else {
                        inc++;
                    }
                }
            }
            return {
                element : element,
                hasWhiteSpace : hasWhiteSpace
            }
        }
        
        return {
            buildElement : function(tag,attribute) {
                return buildElement(tag,attribute);
            },
            strip : function(element) {
                return strip(element);
            },
            cleanHtml : function(element) {
                return cleanHtml(element);
            }
        }
    };
    
    return {
        getInstance : function() {
            if(!instance) {
                instance = constructor();
            }
            return instance;
        }
    }
}());