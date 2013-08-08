<?php

/**
 * Description of pagedesign_module
 *
 * @author Arnold
 */




class PB_PageDesigner extends Module {
    
   

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getJsLink() {
        return array("pb_page_designer");
    }
    
    public function getContent() {
        
        return <<<EOD
<div></div>
EOD;
    }
    
}

?>
