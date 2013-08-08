<?php

class div0formModule extends Module { 
    
    public function __construct($parentModule) { 
        parent::__construct($parentModule);
    }
    
    public function getJsLink() { 
        
    }
    public function getContent() { 
        
    $htmlContent = EOF
    <div>
<input type="text" value="hello" data-index="1"><input type="date" value="2013-01-01" data-index="2">{$div4formModule}{$div6formModule}</div>

EOF;
        
    
    }
}

?>
      