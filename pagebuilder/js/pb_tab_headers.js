
var PB = PB || {}

PB.PanelComponents = function(id,callback) {
    var items = document.getElementById("tb_panel_" + id).getElementsByTagName("li");
    
    function init() {
        //attach form
        for(var i=0,l=items.length || 0;i< l;i++) {
            items[i].addEventListener("click", function(e) {
                if(callback)
                    callback(this);
            }, false) 
        }
    }
    
    init();
}



PB.TabHeader = function(id) { 
    
    var activeTab = "";
    var that = this;
    
    var tabObject = new PB.Control.TabObject();
    
    var tabParent = document.getElementById(id +"_header_panel") || document.getElementById("_header_panel");
    var panelContainer = document.getElementById(id + "_panel_container_") || document.getElementById("_panel_container");
    
    var panels = {
        toolbar : document.getElementById(id+ "_tb_panel"),
        designer : document.getElementById(id+ "_des_panel"),
        components : document.getElementById(id+ "_com_panel"),
        
        hide : function() {
            panels.toolbar.style.display = "none";
            panels.designer.style.display = "none";
            panels.components.style.display = "none";
        },
        show: function(id) {
            this.hide();
            if(id == "tb") {
                this.toolbar.style.display = "block";
            }else if (id == "des") {
                this.designer.style.display = "block";
            }else if (id == "com") {
                this.components.style.display = "block";
            }
        }
    }
    
    this.onComponentClick = null;
    
    
    function init() {
        
        panels.show("tb");
        //map event
        var items = document.getElementById(id + "_header_tab").getElementsByTagName("a");
        
        for(var i=0;i < items.length;i++) {
            tabObject.setItems(items[i]);
        }
        
        tabObject.init();
        tabObject.onClick = function(obj) {
            var code = obj.id.split("_");
            panels.show(code[1]);
        }
    }
    
    
    init();
}


