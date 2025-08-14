<?php
class Response { 
private $p_response = array(); 
private $p_returnCode = HTTP_STATUS_OK; 
private $p_returnMessage =' OK'; 
public function __construct($p_rfcCompliant = true) { 
if ($p_rfcCompliant) { 
$this->p_response['jsonrpc'] = '2.0'; 
} 
} 
public function p_setId($p_id) { 
$this->p_response['id'] = $p_id; 
} 
public function p_setResult($p_data) { 
$this->p_response['result'] = $p_data; 
} 
public function p_setError($p_data) { 
$this->p_response['error'] = $p_data; 
} 
public function p_setHeaderParams($p_returnCode, $p_returnMessage) { 
$this->p_returnCode = $p_returnCode; 
$this->p_returnMessage = $p_returnMessage; 
} 
public function p_getResponse() { 
return $this->p_response; 
} 
public function p_print($p_response = '') { 
header("HTTP/1.1 {$this->p_returnCode} {$this->p_returnMessage}"); 
header('Content-Type: application/json-rpc'); 
$p_output = json_encode($p_response ? $p_response : $this->p_response); 
header('Content-Length: ' . strlen($p_output)); 
echo $p_output; 
} 
} 
?>