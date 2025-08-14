<?php
require_once('Translator.inc'); 
define('HTTP_STATUS_OK', 200); 
define('HTTP_STATUS_BAD_REQUEST', 400); 
define('HTTP_STATUS_NOT_FOUND', 404); 
define('HTTP_STATUS_INTERNAL_SERVER_ERROR', 500); 
define('ERROR_SERVER', -32000); 
define('ERROR_INVALID_SESSION', -32001); 
define('ERROR_INVALID_REQUEST', -32600); 
define('ERROR_UNKNOWN_METHOD', -32601); 
define('ERROR_INVALID_PARAMS', -32602); 
define('ERROR_INTERNAL', -32603); 
define('ERROR_FILE_NOT_EXISTS', -32604); 
define('ERROR_BATCH_INVALID', -32605); 
define('ERROR_BATCH_EXCEEDED', -32606); 
define('ERROR_INVALID_PARAM_TYPE', -32607); 
define('ERROR_METHOD_UNAVAILABLE', -32608); 
define('ERROR_INVALID_PARAMS_MIN', -32609); 
define('ERROR_INVALID_PARAMS_MAX', -32610); 
define('ERROR_PARSE', -32700); 
class JsonRpcException extends Exception { 
private $p_errors = array(); 
private $messageParameters; 
public function __construct($p_code, $p_positionalParams = array(), $p_plurality = 1) { 
$this->httpStatus = HTTP_STATUS_INTERNAL_SERVER_ERROR; 
switch ($p_code) { 
case ERROR_INVALID_SESSION: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid session.'); 
break; 
case ERROR_PARSE: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Parse error.'); 
break; 
case ERROR_INVALID_PARAM_TYPE: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid parameter. Parameter "%1" of unexpected type (expected "%2", "%3" given) in "%4::%5"'); 
if (isset($p_positionalParams[5])) { 
$this->message .= ' [' . serialize($p_positionalParams[5]) . ']'; 
} 
break; 
case ERROR_FILE_NOT_EXISTS: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Class file "%1" does not exist.'); 
break; 
case ERROR_INTERNAL: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Internal error.'); 
break; 
case ERROR_INVALID_PARAMS: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid count of input parameters. Expected %1, %2 given.'); 
break; 
case ERROR_INVALID_PARAMS_MIN: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid count of input parameters. Expected at least %1, %2 given.'); 
break; 
case ERROR_INVALID_PARAMS_MAX: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid count of input parameters. Expected at most %1, %2 given.'); 
break; 
case ERROR_UNKNOWN_METHOD: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Method not found.'); 
$this->httpStatus = HTTP_STATUS_NOT_FOUND; 
break; 
case ERROR_METHOD_UNAVAILABLE: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Class "%1" does not contain method "%2".'); 
break; 
case ERROR_INVALID_REQUEST: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid request.'); 
$this->httpStatus = HTTP_STATUS_BAD_REQUEST; 
break; 
case ERROR_SERVER: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Server error.'); 
break; 
case ERROR_BATCH_INVALID: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid batch request. Parameter "commandList" not found or contains invalid data type.'); 
break; 
case ERROR_BATCH_EXCEEDED: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Invalid batch request. Count of commands in batch exceeded %1.'); 
break; 
default: 
$this->message = QT_TRANSLATE_NOOP('serverMessage', 'Undefined message'); 
$this->httpStatus = HTTP_STATUS_OK; 
break; 
} 
$p_messageToLog = $this->message; 
if (count($p_positionalParams)) { 
$p_count = 0; 
while(preg_match('(\%[0-9]+)', $p_messageToLog, $p_matches)) { 
$p_messageToLog = str_replace($p_matches[0], $p_positionalParams[$p_count], $p_messageToLog); 
$p_count++; 
} 
} 
if ($p_code != ERROR_INVALID_SESSION) { 
$p_errorMessage = 'API call error (' . $p_code . '): ' . $p_messageToLog; 
if (empty($GLOBALS['HTTP_RAW_POST_DATA'])) { 
$p_errorMessage .= "\n" . 'The request is empty.'; 
$p_logDevice = 'debug'; 
} else { 
$p_string = $GLOBALS['HTTP_RAW_POST_DATA']; 
$p_pattern = '/"password"\s*:\s*"[^"]*"/i'; 
$p_replacement = '"password":"******"'; 
$p_errorMessage .= "\n" . preg_replace($p_pattern, $p_replacement, $p_string); 
$p_logDevice = 'error'; 
} 
$p_errorMessage .= "\n" . 'Sent from: ' . $_SERVER['REMOTE_ADDR']; 
Logs::log($p_logDevice, $p_errorMessage); 
} 
$this->code = $p_code; 
$this->messageParameters = array( 
'positionalParameters' => $p_positionalParams, 
'plurality' => $p_plurality 
); 
} 
public function getHttpStatus() { 
return $this->httpStatus; 
} 
public function getMessageParameters() { 
return $this->messageParameters; 
} 
} 
?>