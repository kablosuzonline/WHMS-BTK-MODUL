<?php
class TechnicalSupport { 
private $p_parameters = array( 
'getInfo' => array( 
'userInfo' => 'out', 
'productInfo' => 'out', 
'systemInfo' => 'out', 
'isUploadServerAvailable' => 'out' 
), 
'addSystemInfoToTicket' => array ( 
'ticketId' => 'string', 
'email' => 'string' 
) 
); 
public function p_getMethodParams($p_methodName) { 
return $this->p_parameters[$p_methodName]; 
} 
public function getInfo(&$userInfo, &$productInfo, &$systemInfo, &$isUploadServerAvailable) { 
$p_handler = kerio('kerio::web::TechnicalSupport'); 
$p_handler->getInfo(&$userInfo, &$productInfo, &$systemInfo, &$isUploadServerAvailable); 
} 
public function addSystemInfoToTicket($ticketId, $email) { 
$p_handler = kerio('kerio::web::TechnicalSupport'); 
$p_handler->addSystemInfoToTicket($ticketId, $email); 
} 
} 
?>