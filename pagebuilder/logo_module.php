<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of logo_module
 *
 * @author Arnold
 */
class PB_Logo_Module extends Module {
    
    
    public function __construct($parentModule) {
        parent::__contstruct($parentModule);
    }
    
    public function getContent() {
        
        return <<<EOD
    <div id="{$this->id}_logo" class="pb_logo">
            <h1>{$title}</h1>
            <div>
                <ul>
                    <li>New Page</li>
                    <li>New Page</li>
                    <li>New Page</li>
                </ul>
            </div>
        </div>
EOD;
    }
}

?>
