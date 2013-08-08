<?php

class PB_Panel extends Module {
    
    public $labelItems;
    public $variables;
    public $imageItems;
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
        $this->labelItems = new Collection();
        $this->imageItems = new Collection();
        $this->variables = new Collection();
    }
   
    public function getCssLink() { 
        return array("dialogstyle");
    }
    
    public function getKeys() { 
        return array("id","labelItems","variables");
    }

    public function getContent() {
        
        $figure = "<ul>";
        foreach($keys = $this->labelItems->keys() as $key => $keyValue) {
            $label = $this->labelItems->getItem($keyValue);
            $figure .= "<li><a href='javascript:void(0)' data-variable='". $this->variables->getItem($keyValue) . "'><div></div><p>$label</p></a></li>"; 
        }
        $figure .= "</ul>";
        return <<<EOD
<div id="panel_{$this->id}" class="{$this->class}">
    {$figure}
</div>
EOD;
    }

}

?>
