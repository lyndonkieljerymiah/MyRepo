<?php

/**
 * Manages the CRUD of Page Builder
 * Transaction
 *  save : insert page
 *  load : load page
 *
 * @author user
 * 
 */
Cls::load('PBPageModel');
Cls::load('PBSession');

class PB_Transaction extends Module {

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }

    public function getKeys() {
        return array('allVariables');
    }

    private function load($pageId) {

        $pageModel = PBPageModel::getInstance();
        $templateModule = Module::get('pb_template', $this);
        $isLoad = false;

        //check if it's new
        if ($pageId == 0) {
            if ($pageId != 0) {
                $isLoad = true;
            } 
        } else {
            $isLoad = true;
        }
        
        if($isLoad) {
            //load the pageid in session
            $rowFilter = $pageModel->get($pageId)->result();
            $templateData = array(
                'pageId' => $rowFilter['pageId'],
                'cssContent' => $rowFilter['cssContent'],
                'dataContent' => $rowFilter['dataContent'],
                'pageTitle' => $rowFilter['pageTitle'],
                'pageDescription' => $rowFilter['pageDescription']
            );
            $templateModule->template = $templateData;
        }
        
        return $templateModule->getContent();
    }

    private function save($fields = array(),$pageId = null) {
        
        $pageModel = PBPageModel::getInstance();
        
        $result= $pageModel->save($fields,$pageId)->result();
        if ($result) {
            return $result;
        }
        return false;
    }

    public function getContent() {

        $mode = $this->allVariables['mode'];
        $pageModel = PBPageModel::getInstance();
        
        switch ($this->mode) {
            case 'save':
                
                $pageId = (isset($this->allVariables['pageId'])) ? $this->allVariables['pageId'] : null;
                $pageTitle = $this->allVariables['pageTitle'];
                $pageDescription = $this->allVariables['pageDescription'];
                $cssContent = urldecode($this->allVariables['cssContent']);
                $dataContent = urldecode($this->allVariables['dataContent']);
                $userId = 1;

                $fields = array(
                    'userId' => $userId,
                    'pageTitle' => $pageTitle,
                    'pageDescription' => $pageDescription,
                    'cssContent' => $cssContent,
                    'dataContent' => $dataContent
                );
                $latestId = $this->save($fields,$pageId);
                if($latestId) {
                    $resultJson = json_encode(array("success" => TRUE,"pageId" => $latestId));
                    $result = "<success>true</success><pageId>$latestId</pageId>";
                }
                break;
            case 'load':
                
                $id = (int) $this->allVariables['pageId'];
                $result = $this->load($id);
                break;
        }

        return <<<EOD
   {$result}
EOD;
    }

}

?>
