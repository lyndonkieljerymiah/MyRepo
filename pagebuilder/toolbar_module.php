<?php

Cls::load('PBControlModel');
class PB_Toolbar extends Module {
    
        
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getKeys() { 
        return array("id","class");
    }
    
    

    public function getContent() {

        //load the toolbar
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
    <div id="{$this->id}_toolbar">
        <table>
            {$tbPanel}
        </table>
        
    </div>
EOD;
    }
    
    
}

?>
