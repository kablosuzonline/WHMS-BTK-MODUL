<?php
require_once 'src/KerioControlApi.php';		
$api = new KerioControlApi('Log Clear', 'KablosuzOnline', '1.0');
$session = $api->login("82.222.181.122", "admin", "U/0boYS61Nc");
try {

		$paramskerio = array(
		'logName' => 'connection',
	);
     $api->sendRequest('Logs.clear', $paramskerio);
     $api->logout();
} catch (KerioApiException $error) {
    print $error->getMessage();
}
?>