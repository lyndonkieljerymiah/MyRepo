<?php

/*=========================================================
 * Description: Publish the Page
 *
 * Since ver: 2.0
 *=========================================================*/

class PB_Publisher extends Module {
    
    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }
    
    
    public function getKeys() {
        return array('pageId');
    }
    
    public function getContent() {
        Cls::load('PBXmlObjectNodeParser');
        Cls::load('PBModuleBuilder');
        Cls::load('PBPageModel');
        Cls::load('PBHtmlBuilder');
        
        //get the data 
        $pm = PBPageModel::getInstance();
        $result = $pm->get($this->pageId)->result();
        
        $dataContent = $result['dataContent'];
        $pageTitle = $result['pageTitle'];
        
        
        //read simple xml
        $xmlParser = new PBXmlObjectNodeParser($dataContent);
        $xmlStackNode = array();
        
        //filter all the form object in the element
        $xmlParser->filterForm($xmlParser->getFirstNode(), $xmlStackNode);
        
        $xmlCollection = array();
        $htmlModule = "";
        //scan each form
        foreach($xmlStackNode as $key => $form) {
            
            $xmlNodeCollection = array();
            
            $xmlParser->refine($form, $xmlNodeCollection, true, true); //get the child 
            
            
            $className = $form->nodeTag . $form->nodeId;    //get class name
            $variables = $xmlParser->getVariable(); //get variables
            $hb = new PBHtmlBuilder();
            $htmlContent = $hb->parseElement($form,$xmlNodeCollection,true); //create html 
            
            
            //create module
            $mb = new PBModuleBuilder($className);
            $mb->set_htmlContent($htmlContent);
            $mb->set_variables($variables);
            $moduleContent = $mb->execute();
            $htmlModule .= $moduleContent;
        }
        
        
        
        return <<<EOD
        <textarea>{$htmlModule}</textarea>
EOD;
    }
}

?>
