<?php


class PB_Header extends Module {

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }

    public function getKeys() {
        return array("id","class","title","subTitle");
    }

    public function getContent() {
        
        
        $class = ($this->class != "") ? "class=" . $this->class : "";
        $title = $this->title;
        
        //tab menu header
        $tabheaderModule = Module::get('pb_tabheader',$this);
        $tabheaderModule->class = "header_bar";
        $tabheaderModule->id = $this->id;
        $tabheader = $tabheaderModule->getContent();
        
        $htmlContent = <<<EOD
   <div id="{$this->id}_header" {$class}>
        
        <div id="{$this->id}_logo" class="pb_logo">
            <hgroup>
                <h1 id="{$this->id}_top_logo">{$this->title}</h1>
                <h3>{$this->subTitle}</h3>
            </hgroup>
            <div id="{$this->id}_top_navigation" class="top_navigation">
                <ul>
                    <li><a id='new_page' href='javascript:void(0)'>New Page</a></li>
                    <li><a id='save_page' href='javascript:void(0)'>Save Page</a></li>
                    <li><a id='load_page' href='javascript:void(0)'>Load Page</a></li>
                    <li class='no_line'><a id='page_property' href='javascript:void(0)'>Page Properties</a></li>
                </ul>
            </div>
        </div>
        <div class="pb_publish">
            <a href="javascript:void(0)">Publish</a>
            <a href="javascript:void(0)">HTML</a>
            <a href="javascript:void(0)">CSS</a>
        </div>    
        <div style='clear:both'></div>
    </div>
EOD;
        return $htmlContent;
    }

}

?>
