<?php
define('MIN_HTTP_STATUS', 1); 
define('MAX_HTTP_STATUS', 999); 
require_once('Response.inc'); 
require_once('JsonRpcException.inc'); 
class Request { 
protected $p_className = ''; 
protected $p_methodName = ''; 
private $p_params; 
private $p_includePath; 
private $p_isBatch; 
private $p_plainBatchMode; 
private $p_response; 
private $p_partialResponse; 
private $p_id; 
private $p_ignoreErrors; 
private $p_origRequestDecoded; 
private $p_session = null; 
private $p_methodsWithoutSession = array(); 
private $p_emptyArrayChecking; 
private $p_checkPermission; 
private $p_methodsWithEmptyParams = array(); 
private $p_methodsWithOptionalParams = array(); 
private $p_deepValidation = false; 
private $p_deepValidationStrict = false; 
private $p_deepValidationIgnore = array(); 
private $p_deepValidationOptional = array(); 
private $p_deepValidationPrefix = ''; 
const p_MAX_BATCH_COMMANDS = 100; 
const p_DELIMITER = '.'; 
public function __construct($p_path, $p_sessionObject, $p_checkPermission = false) { 
$this->p_isBatch = false; 
$this->p_plainBatchMode = false; 
$this->p_includePath = $p_path; 
$this->p_session = kerio($p_sessionObject); 
$this->p_checkPermission = $p_checkPermission; 
$this->p_emptyArrayChecking = true; 
$this->p_ignoreErrors = true; 
$this->p_optionalParametersChecking = true; 
} 
public function p_unsetEmptyArrayChecking() { 
$this->p_emptyArrayChecking = false; 
} 
public function p_unsetOptionalParametersChecking() { 
$this->p_optionalParametersChecking = false; 
} 
public function p_setMethodsWithEmptyArrays($p_methodNames) { 
$this->p_methodsWithEmptyParams = $p_methodNames; 
} 
public function p_setMethodsWithOptionalParams($p_methodNames) { 
$this->p_methodsWithOptionalParams = $p_methodNames; 
} 
protected function p_checkAccess($p_methodName) { 
} 
public function p_setMethodsWithoutSession($p_methods = array()) { 
$this->p_methodsWithoutSession = $p_methods; 
} 
public function p_dispatch() { 
try { 
$this->p_response = new Response(); 
$this->p_origRequestDecoded = json_decode($GLOBALS['HTTP_RAW_POST_DATA']); 
$this->p_parseData($this->p_origRequestDecoded); 
if ($this->p_isBatchRequest()) { 
foreach ($this->p_params['commandList'] as $p_partialRequest) { 
$p_isError = false; 
$this->p_partialResponse = new Response($this->p_plainBatchMode); 
try { 
$this->p_parseData($p_partialRequest); 
$this->p_execute(); 
$this->p_partialResponse->p_setResult($this->p_params); 
} 
catch (JsonRpcException $e) { 
$this->p_partialResponse->p_setError($this->p_formatError($e)); 
$p_isError = true; 
} 
catch (ApiException $e) { 
$this->p_partialResponse->p_setError($this->p_formatError($e)); 
$p_isError = true; 
} 
$p_partialResult = $this->p_partialResponse->p_getResponse(); 
if (isset($p_partialResult['result']) && (is_array($p_partialResult['result']) && count($p_partialResult['result']) == 0)) { 
$p_emptyObject['result'] = (object) array(); 
$p_result[] = $p_emptyObject; 
} else { 
$p_result[] = $p_partialResult; 
} 
if (!$this->p_ignoreErrors && $p_isError) { 
break; 
} 
} 
if ($this->p_plainBatchMode) { 
$this->p_response->p_print($p_result); 
exit(0); 
} 
} 
else { 
$this->p_execute(); 
$p_result = (is_array($this->p_params) && count($this->p_params) == 0) ? (object) $this->p_params : $this->p_params; 
} 
$this->p_response->p_setResult($p_result); 
$this->p_response->p_print(); 
} 
catch (JsonRpcException $e) { 
$p_error = $this->p_formatError($e); 
$this->p_printError($p_error, $e->getHttpStatus()); 
} 
catch (ApiException $e) { 
$p_error = $this->p_formatError($e); 
$p_httpStatusCode = $p_error['code']; 
if (($p_httpStatusCode < MIN_HTTP_STATUS)) { 
Logs::log('warning', 'HTTP status is out of range - ' . $p_httpStatusCode); 
$p_httpStatusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR; 
} elseif ($p_httpStatusCode > MAX_HTTP_STATUS) { 
$p_httpStatusCode = HTTP_STATUS_OK; 
} 
$this->p_printError($p_error, $p_httpStatusCode); 
} 
catch (Exception $e) { 
$p_error = array( 
'code' => ERROR_SERVER, 
'message' => QT_TRANSLATE_NOOP('serverMessage', 'Error:') . ' ' . $e->getMessage(), 
'data' => array( 
'messageParameters' => array( 
'positionalParameters' => array(), 
'plurality' => 1 
) 
) 
); 
$this->p_printError($p_error, HTTP_STATUS_INTERNAL_SERVER_ERROR, 'Internal Server Error'); 
} 
} 
private function p_formatError($p_exception) { 
return array( 
'code' => $p_exception->getCode(), 
'message' => $p_exception->getMessage(), 
'data' => array('messageParameters' => $p_exception->getMessageParameters()) 
); 
} 
private function p_printError($p_error, $p_httpStatusCode, $p_message = '') { 
if ($p_httpStatusCode === 200) { 
$p_message = 'OK'; 
} 
$this->p_response->p_setHeaderParams($p_httpStatusCode, $p_message ? $p_message: $p_error['message']); 
$this->p_response->p_setError($p_error); 
$this->p_response->p_print(); 
} 
private function p_parseData($p_decodedData) { 
if (null == $p_decodedData) { 
throw new JsonRpcException(ERROR_PARSE); 
} 
if (is_array($p_decodedData) && !$this->p_isBatch) { 
return; 
} 
if (!$this->p_isBatch) { 
$this->p_response->p_setId($p_decodedData->id); 
} 
elseif ($this->p_plainBatchMode) { 
$this->p_partialResponse->p_setId($p_decodedData->id); 
} 
if (isset($p_decodedData->id)) { 
$this->p_id = $p_decodedData->id; 
} 
if ((!$this->p_isBatch || $this->p_plainBatchMode) 
&& ('2.0' != $p_decodedData->jsonrpc || !isset($p_decodedData->method) || !isset($p_decodedData->id))) { 
throw new JsonRpcException(ERROR_INVALID_REQUEST); 
} 
if (1 !== preg_match('/^[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*$/', $p_decodedData->method)) { 
throw new JsonRpcException(ERROR_INVALID_REQUEST); 
} 
if (false === in_array($p_decodedData->method, $this->p_methodsWithoutSession)) { 
if (is_null($this->p_session)) { 
if (class_exists('Logs')) { 
Logs::log('warning', 'API call security issue (' . ERROR_INVALID_SESSION . '): Session expired.'); 
} 
throw new JsonRpcException(ERROR_INVALID_SESSION); 
} 
$p_token = ''; 
$this->p_session->getCsrfToken($p_token); 
if ($p_token != $_SERVER['HTTP_X-TOKEN']) { 
if (class_exists('Logs')) { 
if (empty($_SERVER['HTTP_X-TOKEN'])) { 
$p_messageDetails = 'The token is empty.'; 
} else { 
$p_messageDetails = 'Value of the token is: ' . $_SERVER['HTTP_X-TOKEN']; 
} 
Logs::log('warning', 'API call security issue (' . ERROR_INVALID_SESSION . '): Invalid token. ' . $p_messageDetails); 
} 
throw new JsonRpcException(ERROR_INVALID_SESSION); 
} 
} 
if ($this->p_checkPermission) { 
$this->p_checkAccess($p_decodedData->method); 
} 
list($this->p_className, $this->p_methodName) = explode(self::p_DELIMITER, $p_decodedData->method); 
if (isset($p_decodedData->params)) { 
$this->p_params = (array) $p_decodedData->params; 
} 
else { 
$this->p_params = array(); 
} 
} 
private function p_isBatchRequest() { 
if ($this->p_className == 'Batch' && $this->p_methodName == 'run') { 
if (!isset($this->p_params['commandList']) || !is_array($this->p_params['commandList']) || 0 == count($this->p_params['commandList'])) { 
throw new JsonRpcException(ERROR_BATCH_INVALID); 
} 
if (count($this->p_params['commandList']) > self::p_MAX_BATCH_COMMANDS) { 
throw new JsonRpcException(ERROR_BATCH_EXCEEDED, array(self::p_MAX_BATCH_COMMANDS)); 
} 
$this->p_ignoreErrors = isset($this->p_params['ignoreErrors']) ? $this->p_params['ignoreErrors'] : true; 
$this->p_isBatch = true; 
} 
elseif (is_array($this->p_origRequestDecoded)) { 
$this->p_params['commandList'] = $this->p_origRequestDecoded; 
if (count($this->p_params['commandList']) > self::p_MAX_BATCH_COMMANDS) { 
throw new JsonRpcException(ERROR_BATCH_EXCEEDED, array(self::p_MAX_BATCH_COMMANDS)); 
} 
$this->p_plainBatchMode = true; 
$this->p_isBatch = true; 
} 
return $this->p_isBatch; 
} 
protected function p_methodCallWrapper($p_instance, $p_methodName, $p_argumentList) { 
call_user_func_array(array($p_instance, $p_methodName), $p_argumentList); 
} 
private function p_execute(){ 
$this->p_loadClass(); 
$p_instance = new $this->p_className; 
if (method_exists($p_instance, $this->p_methodName)) { 
if (method_exists($p_instance, 'p_getMethodParams')) { 
$p_params = $this->p_prepareParams($p_instance->p_getMethodParams($this->p_methodName)); 
} 
else { 
throw new JsonRpcException(ERROR_METHOD_UNAVAILABLE, array('p_getMethodParams')); 
} 
} 
else { 
throw new JsonRpcException(ERROR_METHOD_UNAVAILABLE, array($this->p_className, $this->p_methodName)); 
} 
$this->p_responseParamList = array(); 
$p_argumentList = array(); 
$p_outputParams = array(); 
$p_localVariable = array(); 
foreach ($p_params as $p_paramName => $p_paramType) { 
$p_localVariable[$p_paramName] = null; 
$p_argumentList[] = &$p_localVariable[$p_paramName]; 
if ($p_paramType !== 'out' && isset($this->p_params[$p_paramName])) { 
$p_localVariable[$p_paramName] = $this->p_params[$p_paramName]; 
} 
} 
$this->p_methodCallWrapper($p_instance, $this->p_methodName, $p_argumentList); 
$p_removeColumns = false; 
foreach ($p_params as $p_paramName => $p_paramType) { 
if ($p_paramType === 'out') { 
$p_outputParams[$p_paramName] = 
$p_localVariable[$p_paramName]; 
if ($p_paramName == 'list') { 
$p_removeColumns = true; 
} 
} 
} 
if ($p_removeColumns) { 
$this->p_params = $this->p_removeUnwantedFields($p_outputParams); 
} else { 
$this->p_params = $p_outputParams; 
} 
} 
private function p_loadClass() { 
$p_files = array_merge(glob($this->p_includePath . '*.inc'), glob(dirname(__FILE__) . '/*.inc')); 
if ($p_files !== false) { 
foreach ($p_files as $p_fileName) { 
if (0 == strcmp(basename($p_fileName), $this->p_className . '.inc')) { 
require_once($p_fileName); 
return; 
} 
} 
} 
throw new JsonRpcException(ERROR_FILE_NOT_EXISTS, array($this->p_className)); 
} 
private function p_cleanObjectPath($p_objectPath) { 
return preg_replace('|\[\d+/\d+\]|', '[]', $p_objectPath); 
} 
private function p_deepCheck($p_givenParam, $p_expectedType, $p_objectPath) { 
$p_typeGiven = gettype($p_givenParam); 
$p_typeExpected = ($p_expectedType === 'array') ? $p_expectedType : gettype($p_expectedType); 
if (($p_typeGiven !== $p_typeExpected) && !(($p_typeGiven === 'object') && ($p_typeExpected === 'array'))) { 
Logs::log('warning', $this->p_deepValidationPrefix . $p_objectPath .' - expecting: '. $p_typeExpected .', given: '. $p_typeGiven); 
return; 
} 
if (in_array($this->p_cleanObjectPath($p_objectPath), $this->p_deepValidationIgnore)) { 
return; 
} 
if ($p_expectedType === 'array') { 
Logs::log('warning', $this->p_deepValidationPrefix . $p_objectPath .' is using DEPRECATED expected type \'array\', value given: '. json_encode($p_givenParam)); 
return; 
} 
if (is_object($p_givenParam)) { 
$p_givenParam = get_object_vars($p_givenParam); 
} 
if (count($p_expectedType) == 1) { 
$p_items = count($p_givenParam); 
$p_i = 0; 
if (is_string($p_expectedType[0])) { 
foreach ($p_givenParam as $p_param) { 
$p_type = gettype($p_param); 
if ($p_type !== $p_expectedType[0]) { 
Logs::log('warning', $this->p_deepValidationPrefix . $p_objectPath .'->['. $p_i .'/'. $p_items .']' . 
': value '. json_encode($p_param) .' has invalid type - '. $p_type .', expected is '. json_encode($p_expectedType[0])); 
} 
$p_i++; 
} 
} 
if (is_array($p_expectedType[0]) || is_object($p_expectedType[0])) { 
foreach ($p_givenParam as $p_param) { 
$this->p_deepCheck($p_param, $p_expectedType[0], $p_objectPath .'->['. $p_i .'/'. $p_items .']'); 
$p_i++; 
} 
} 
} 
else { 
if ($this->p_deepValidationStrict) { 
$p_requiredKeys = array_flip(array_keys($p_expectedType)); 
$p_path = $this->p_cleanObjectPath($p_objectPath); 
if (isset($this->p_deepValidationOptional[$p_path])) { 
$p_optional = $this->p_deepValidationOptional[$p_path]; 
$p_max = count($p_optional); 
for ($i=0; $i<$p_max; $i++) { 
$p_field = $p_optional[$i]; 
if (isset($p_requiredKeys[$p_field])) { 
unset($p_requiredKeys[$p_field]); 
} 
} 
} 
} 
foreach ($p_givenParam as $p_key => $p_value) { 
if (!isset($p_expectedType[$p_key])) { 
Logs::log('warning', $this->p_deepValidationPrefix . $p_objectPath .'->'. $p_key .': value '. json_encode($p_value) .' given but not defined'); 
continue; 
} 
if ($this->p_deepValidationStrict && isset($p_expectedType[$p_key])) { 
if (isset($p_requiredKeys[$p_key])) { 
unset($p_requiredKeys[$p_key]); 
} 
} 
$p_type = gettype($p_value); 
if (is_array($p_value) || is_object($p_value)) { 
$this->p_deepCheck($p_value, $p_expectedType[$p_key], $p_objectPath .'->'. $p_key); 
} elseif ($p_type !== $p_expectedType[$p_key]) { 
Logs::log('warning', $this->p_deepValidationPrefix . $p_objectPath .'->'. $p_key . 
': value '. json_encode($p_value) .' has invalid type - '. $p_type .', expected is '. json_encode($p_expectedType[$p_key])); 
} 
} 
if ($this->p_deepValidationStrict && (count($p_requiredKeys) > 0)) { 
Logs::log('warning', $this->p_deepValidationPrefix . $p_objectPath .' - missing fields: \''. implode('\', \'', array_keys($p_requiredKeys)) .'\''); 
} 
} 
} 
private function p_prepareParams($p_expectedParams) { 
$p_inParamsMin = 0; 
$p_inParamsMax = 0; 
$p_count = 0; 
$p_givenParams = (array) $this->p_params; 
$p_params = array(); 
$p_currentParam = null; 
foreach ($p_expectedParams as $p_key => $p_expectedType) { 
if ($p_expectedType !== 'out') { 
$p_currentParam = $this->p_className . '.' . $this->p_methodName . '.' . $p_key; 
$p_inParamsMax++; 
if (false == $this->p_optionalParametersChecking || !in_array($p_currentParam, $this->p_methodsWithOptionalParams)){ 
$p_inParamsMin++; 
} 
$p_value = $p_givenParams[$p_key]; 
$p_params[$p_key] = $p_value; 
$p_givenType = getType($p_value); 
$p_isExpectedTypeArray = (is_array($p_expectedType) || $p_expectedType === 'array'); 
$p_expectedTypeFlat = ($p_isExpectedTypeArray) ? 'array' : $p_expectedType; 
if ($p_givenType !== $p_expectedTypeFlat && !($p_givenType === 'object' && $p_isExpectedTypeArray)) { 
if (!empty($p_value) || !in_array($p_currentParam, $this->p_methodsWithOptionalParams)) { 
throw new JsonRpcException(ERROR_INVALID_PARAM_TYPE, 
array($p_key, $p_expectedType, $p_givenType, $this->p_className, $this->p_methodName, $p_givenParams) 
); 
} 
} 
if ($this->p_emptyArrayChecking) { 
if (!in_array($this->p_className . '.' . $this->p_methodName, $this->p_methodsWithEmptyParams)) { 
if ($p_isExpectedTypeArray && empty($p_value)) { 
throw new JsonRpcException(ERROR_INVALID_PARAM_TYPE, 
array($p_key, 'non empty array', 'empty array', $this->p_className, $this->p_methodName, $p_givenParams) 
); 
} 
} 
} 
if ($this->p_deepValidation && $p_isExpectedTypeArray) { 
$this->p_deepCheck($p_value, $p_expectedType, $this->p_className .'.'. $this->p_methodName .'()->'. $p_key); 
} 
} 
else { 
$p_params[$p_key] = $p_expectedType; 
} 
$p_count++; 
} 
if ($p_inParamsMax === $p_inParamsMin && $p_inParamsMin != count($p_givenParams)) { 
throw new JsonRpcException(ERROR_INVALID_PARAMS, array($p_inParamsMin, count($p_givenParams))); 
} 
else if ($p_inParamsMin > count($p_givenParams)) { 
throw new JsonRpcException(ERROR_INVALID_PARAMS_MIN, array($p_inParamsMin, count($p_givenParams))); 
} 
else if ($p_inParamsMax < count($p_givenParams)) { 
throw new JsonRpcException(ERROR_INVALID_PARAMS_MAX, array($p_inParamsMax, count($p_givenParams))); 
} 
return $p_params; 
} 
private function p_removeUnwantedFields($p_params) { 
$p_inputParams = $this->p_params; 
if (array_key_exists('query', $p_inputParams) && array_key_exists('fields', $p_inputParams['query'])) { 
foreach ($p_params['list'] as $p_row => $p_rowValues) { 
foreach ($p_rowValues as $p_fieldKey => $p_fieldValue) { 
if (!in_array($p_fieldKey, $p_inputParams['query']->fields)) { 
unset($p_params['list'][$p_row][$p_fieldKey]); 
} 
} 
} 
} 
return $p_params; 
} 
public function p_enableDeepValidation() { 
$this->p_deepValidation = true; 
} 
public function p_enableStrictDeepValidation() { 
$this->p_deepValidationStrict = true; 
} 
public function p_setDeepValidationIgnoreList($p_ignoreList) { 
$this->p_deepValidationIgnore = $p_ignoreList; 
} 
public function p_setDeepValidationOptionalList($p_optionalList) { 
$this->p_deepValidationOptional = $p_optionalList; 
} 
public function p_setDeepValidationPrefix($p_prefix) { 
$this->p_deepValidationPrefix = $p_prefix; 
} 
} 
?>