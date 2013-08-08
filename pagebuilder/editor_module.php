<?php

/*----------------------------------------------
 * 
 * Class: Index Module
 *   
 -----------------------------------------------*/

class PB_Editor extends Module {
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    public function getKeys() {
        return array("id");
    }
    
    public function getJs() {
        
        return <<<EOD
   if(!pbMain) {
       var pbMain = new PB.Main();
       }
EOD;
    }
   
    public function getJsLink() {
        return array("pb_main","pb_server_request","pb_object","pb_userinterface","pb_helper");
    }
    
    public function getCssLink() {
        return array("mainstyle");
    }
        
    public function getContent() {
        
        /*
         * header Module
         */
        
        $headerModule = Module::get("pb_header",$this);
        $headerModule->title = "ETMAS";
        $headerModule->subTitle = "Page Builder ver 2.0";
        $headerModule->id = "pb";
        $headerModule->class = "header";
        $header = $headerModule->getContent();
        
        return <<<EOD
    <div id="pb_wrapper">   
        {$header}
        <div id="pb_body">
            <iframe id="page_designer" src='page.php?module=pb_pagedesigner'></iframe>
        </div>
    </div>
    
EOD;
    }
}



?>
