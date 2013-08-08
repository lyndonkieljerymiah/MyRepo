<?php


/**
 * Description of barpanel_module
 *
 * @author Arnold
 */
class TBForm_Module extends Module {
    
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getKeys() {
        return array("id","class","imageUrls","variables");
    }
    
    
    public function getJsLink() {
        return array("pb_tab_headers");
    }
    
    public function getContent() {
        
        $imageUrls = isset($this->imageUrls) ? $this->imageUrls : array();
        $toolTip = isset($this->toolTips) ? $this->toolTips : array();
        
        
        $elList = "";
        if(count($imageUrls)) { 
            foreach($imageUrls as $key => $value) {
                $elList .= "<li id='$key' data-variables='" . $this->variables[$key] .   "'>$value</li>";
            }
        }
        
        
        return <<<EOD
   
   <div id="tb_panel_{$this->id}" class="{$this->class}">
        <ul>
            {$elList}
        </ul>
       
   </div>
   
EOD;
    }
}

?>
