<?php
/**
 * Description of tabheader_module
 *
 * @author Arnold
 */
Cls::load("PBControlModel");
class PB_TabHeader extends Module {
    
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getCssLink() { 
        return array("mainstyle", "dialogstyle");        
    }
    
    public function getKeys() {
        return array('id','class');
    }

/*
    public function getJs() {
        
        return <<<EOD
   window.addEventListener('load',function() {
       if(document.getElementById('header_panel_{$this->id}')) { 
           if(!objTabHeaderPanel) { 
                var objTabHeaderPanel = new PB.TabHeader('{$this->id}');
           }
       }
   },false);
EOD;
    }*/
    
    public function getJsLink() { 
        return array("pb_tab_headers");
    }
    
    
    
    
    public function getContent() { 
        
        
        
        $pbControlModel = PBControlModel::getInstance();
        $groups = $pbControlModel->getControlGroup();
        $tbPanel = "";
        
        foreach($groups as $grouKey => $groupValue) {
            $controls = $pbControlModel->getControlByGroup($groupValue);
            
            $tbPanelModule = Module::get("pb_panel",$this);
            $tbPanelModule->id = $groupValue;
            $tbPanelModule->class = "mini_panel";
            foreach($controls as $control) {
                $tbPanelModule->labelItems->addItem($control['ctl_name'],$control['ctl_id']);
                $variable = $control['ctl_code'];
                $tbPanelModule->variables->addItem($variable,$control['ctl_id']);
            }
            $tbPanel .= $tbPanelModule->getContent();
        }
        
        
        
        
        return <<<EOD
<div id="{$this->id}_header_panel" class="{$this->class}">
    <div>
        <nav id="{$this->id}_header_tab">
            <a id="{$this->id}_tb_link" data-activetab="toolbar">Toolbar</a>
            <a id="{$this->id}_des_link">Design</a>
            <a id="{$this->id}_com_link">Component</a>
        </nav>
    </div>
    <div id="panel_container_{$this->id}" class="panel_container">
        <div id="{$this->id}_tb_panel" class="panel_bar">{$tbPanel}</div>
        <div id="{$this->id}_des_panel" class="panel_bar">this is designer</div>
        <div id="{$this->id}_com_panel" class="panel_bar">this is component</div>
    </div>
    <div style="clear:both"></div>
</div>
EOD;
    }
}

?>
