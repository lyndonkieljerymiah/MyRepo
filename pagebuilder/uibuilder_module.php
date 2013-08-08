<?php

/*================================================
 * Description: Dialog and other html for user interface
 *
 * since ver: 2.0
 *================================================*/

Cls::load('PBTypeModel');

class PB_UIBuilder extends Module {

    public function __construct($parentModule) {
        parent::__construct($parentModule);
    }

    public function getKeys() {
        return array('id', 'uiType');
    }

    private function elementBuilder() {

        $typeData = PBTypeModel::getInstance();
        $records = $typeData->getType();
        $option = "<option>--select--</option>";
        foreach($records as $record) {
            $id = $record['id'];
            $type = $record['level_type'];
            $option .= "<option value='". strtolower($type) ."'>$type</option>";
        }
        
        return <<<EOD
        <div id="element_builder" class="form_width">
            <form id="element_builder_form" class="ctl_form">  
                <fieldset>
                    <legend>Properties</legend>
                    <ul>
                        <li>
                            <label for='tag'>Tag:</label>
                            <input id='element_builder_tag' type='text' class='input' />
                        </li>
                        <li>
                            <label for='id'>Id:</label>
                            <input id='element_builder_id' type='text' class='input' />
                        </li>
                        <li>
                            <label for='attributes'>Attributes:</label>
                            <input id='element_builder_attribs' type='text' class='input' />
                        </li>
                        <li>
                            <label for='objectType'>Object Type:</label>
                            <select id='element_builder_object_type' type='text' class='input' >
                            {$option}
                            </select>
                        </li>
                    </ul>
                    <div style="clear:both"></div>
                </fieldset>
                <div class='ctl_bottom_panel'>
                    <input id='element_builder_child_btn' class='ctl_button ctl_color_green' type='button'  value='Child' data-field='0'>
                    <input id='element_builder_parent_btn' class='ctl_button ctl_color_green' type='button' value='Parent' data-field='1'>
                    <input id='element_builder_sibling_btn' class='ctl_button ctl_color_green' type='button' value='Sibling' data-field='2'>
                </div>
            </form>
        </div>
EOD;
    }
    private function htmlFragment() {

        return <<<EOD
    <div id="html_fragment">
        <textarea id='html_fragment_text'   class="ctl_text_wider"></textarea>
        <div class='ctl_bottom_panel'>
            <button id='html_fragment_update' class="ctl_button ctl_color_green" >Update</button>
        </div>
    </div>
EOD;
    }
    
    private function navigator() {
        
        return <<<EOD
<div id="page_navigator">
    <div class="ctl_tab">
        <nav id="page_navigator_tab">
            <a id="page_navigator_html_link">Element</a>
            <a id="page_navigator_module_link">Properties</a>
            <a id="page_navigator_search_link">Search</a>
        </nav>
        <ul id="page_navigator_panel">
            <li class="show" data-tabindex='page_navigator_html_link'>
                <div id="page_navigator_html_nav" class="html_navigation"></div>
                <div id="page_navigator_toolbar" class='ctl_toolbar'>
                    <ul>
                        <li><a href="javascript:void(0)" data-variable="ie" title="Insert Element">[+]</a></li>
                        <li><a href="javascript:void(0)" data-variable="re" title="Remove Element">[-]</a></li>
                        <li><a href="javascript:void(0)" data-variable="ee" title="Edit Element">E</a></li>
                        <li><a href="javascript:void(0)" data-variable="iet" title="Insert Text">T</a></li>
                        <li><a href="javascript:void(0)" data-variable="html" title="HTML Fragment">H</a></li>
                        <li><a href="javascript:void(0)" data-variable='om' title="Object Mapping">M</a></li>
                    </ul>
                    <div style="clear:both"></div>
                </div>
            </li>

            <li data-tabindex='page_navigator_module_link'>
                <div id="module_panel" class="properties_navigation">
                    <form action='javascript:void(0)' class='ctl_form'>
                        <fieldset>
                            <legend>Element Properties</legend>
                            <ul>

                            </ul>
                        </fieldset>
                    </form>
                </div>
            </li>
            <li data-tabindex='page_navigator_search_link'>
                <div id="search_panel">this is search</div>
            </li>
        </ul>
    </div>
</div>
EOD;
    }
    private function pageProperties() { 
        return <<<EOD
        <div class="form_width">
            <form id='page_properties' class='ctl_form'>
                <fieldset>
                    <legend>Page Properties</legend>
                    <ul>
                        <li>
                            <label>Page Title</label>
                            <input id='page_properties_input_title' type='text' class="input">
                        </li>
                        <li>
                            <label>Page Description:</label>
                            <input id='page_properties_input_description' type='text' class="input">
                        </li>
                    </ul>    
                </fieldset>
                <div class='ctl_bottom_panel'>
                    <input id='page_properties_update_btn' class='ctl_button ctl_color_green' type='button'  value='Update' data-field='0'>
                    
                </div>
            </form>
        <div>
EOD;
    }
    
    private function mapForm() {
        
       
        
        return <<<EOD
    <div id='map_object' class='ctl_tab'>
        <nav id="map_object_tab">
            <a id="map_object_data_link">Data</a>
            <a id="map_object_action_link">Action</a>
        </nav>
        <ul id="map_object_panel">
            <li data-tabindex='map_object_data_link' class="show">
                <!-- data mapping form -->
                <div class="dialog_width">
                    <form id='map_object_form' class='ctl_form'>
                        <fieldset>
                            <legend>Data Mapping</legend>
                            <ul>
                                <li>
                                    <label>Form Name:</label>
                                    <input id='map_object_input_form' type='text' class="input"/>
                                </li>
                                <li>
                                    <label>Table Name:</label>
                                    <input id='map_object_input_table' type='text' class="input">
                                </li>
                                <li>
                                    <label>Field Name:</label>
                                    <input id='map_object_input_field' type='text' class="input">
                                </li>
                            </ul>    
                        </fieldset>
                    </form>
                <div>
                
            </li>
            <li data-tabindex='map_object_action_link'>
                <div class="dialog_width">
                    <form id='map_object_action' class='ctl_form'>
                        <fieldset>
                            <legend>Action Mapping</legend>
                            <ul>
                                <li>
                                    <label>On Load:</label>
                                    <select class='input'>
                                        <option>--select--</option>
                                        <option>New Module</option>
                                        <option>Save</option>
                                        <option>Get</option>
                                        <option>Delete</option>
                                    </select>
                                <li>
                                <li>
                                    <label>On Click:</label>
                                    <select class='input'>
                                        <option>--select--</option>
                                        <option>New Module</option>
                                        <option>Save</option>
                                        <option>Get</option>
                                        <option>Delete</option>
                                    </select>
                                <li>
                            </ul>
                        </fieldset>
                    </form>
                </div>
            </li>
        </ul>
        <div class='ctl_bottom_panel'>
            <input id='map_object_save_btn' class='ctl_button ctl_color_green' type='button'  value='Save Map' data-field='0'>
            
        </div>
    </div>
EOD;
    }
    
    private function textEditor() {
        
        return <<<EOD
    <div id="text_editor">
        <textarea id='text_editor_text'   class="ctl_text_wider"></textarea>
        <div class='ctl_bottom_panel'>
            <button id='text_editor_update_button' class="ctl_button ctl_color_green" >Update</button>
        </div>
    </div>
EOD;
    }
    
    
    
    public function getContent() {

        
        $htmlPageProperties = $this->pageProperties();
        $htmlPageNavigator = $this->navigator();
        $htmlFragmentPage = $this->htmlFragment();
        $htmlElementBuilder = $this->elementBuilder();
        $htmlMappingForm = $this->mapForm();
        $htmlTextEditor = $this->textEditor();
        
        return <<<EOD
        
        <!-- Page Page Properties -->
        {$htmlPageProperties}
        <!-- Page Navigator -->
        {$htmlPageNavigator}
        <!-- HTML Fragment -->
        {$htmlFragmentPage}
        <!-- HTML Text Editor -->
        {$htmlTextEditor}
        <!-- Element Builder -->
        {$htmlElementBuilder}
        <!-- Map Form -->
        {$htmlMappingForm}
            
EOD;
    }

}

?>
