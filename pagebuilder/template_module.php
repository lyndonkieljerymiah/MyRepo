<?php

/**
 * Description of pagedesign_module
 *
 * @author Arnold
 */

Cls::load('PBTemplateModel');


class PB_Template extends Module {
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
        $this->template = array();
    }
    
    public function getKeys() {
        return array("id","template");
    }
        
    public function getCss() { 
        
        $cssContent = (isset($this->template['cssContent'])) ? $this->template['cssContent'] : "";
        if($cssContent == "") {
            
            $cssContent = <<<EOD
   

EOD;
            
            
        }
        return <<<EOD
        {$cssContent}
EOD;
    }
   
    
    public function getContent() {
        
        $pageId = (isset($this->template['pageId'])) ? '<pageId>' . $this->template['pageId'] .'</pageId>' : "";
        $pageTitle = (isset($this->template['pageTitle'])) ? '<pageTitle>' . $this->template['pageTitle'] .'</pagetitle>' : "";
        $pageDescription = (isset($this->template['pageDescription'])) ? '<pageDescription>' . $this->template['pageDescription'] . '</pageDescription>' : "";
        
        if(isset($this->template['dataContent'])) {
            $htmlContent = $this->template['dataContent'];
        }
        else { 
            $htmlContent = <<<EOD
  <div data-role="form"></div>
EOD;
        }

        return <<<EOD
{$pageId}
{$pageTitle}
{$pageDescription}
{$htmlContent}
EOD;
    }
    
}

?>
