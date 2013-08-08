<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of tabcontrol_module
 *
 * @author user
 */
class PB_TabControl {
        
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
        $this->contents = new Collection();
        $this->tabItems = new Collection();
    }
    
    
    
    public function getContent() {
        
        //tab items
        $keys = $this->tabItems->keys();
        $tabAnchor = "";
        foreach($keys as $itemKey) {
            $tabItem = $this->tabItems->getItem($itemKey);
            $tabAnchor .= "<a id='$itemKey'>$tabItem</a>";
        }
        $nav = "<nav>$tabAnchor</nav>";
        
        //content
        $keys = $this->contents->keys();
        $content = "";
        foreach($keys as $itemKey) {
            $contentItem = $this->contents->getItem($itemKey);
            $content .= $contentItem;
        }
        
        return <<<EOD
<div id="{$this->id}_tabcontrol" class="{$this->class}">
    <div>
        {$nav}
    </div>
    <div id="panel_container_{$this->id}" class="panel_container">
        {$content}
    </div>
    <div style="clear:both"></div>
</div>
EOD;
    }
}

?>
