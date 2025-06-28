<?php
$hook = array(
    'hook' => 'UserChangePassword',
    'function' => 'ClientChangePasswordWa',
    'description' => 'Executed when a change of password occurs for a user.<br>Client Related<br>First Name: {firstname}, Last Name: {lastname}',
    'type' => 'client',
    'extra' => '',
    'variables' => '{firstname},{lastname}',
    'defaultmessage' => 'Hi {firstname} {lastname}, password has been changed successfully.',
);

if(!function_exists('ClientChangePasswordWa')){
    function ClientChangePasswordWa($args){
        $api = new wamessenger();
        $template = $api->getTemplateDetails(__FUNCTION__);
        if($template['active'] == 0){
            return null;
        }
        $settings = $api->apiSettings();
        if(!$settings['api_token'] || !$settings['api_key'] ){
            return null;
        }

        $result = $api->getClientDetailsBy($args['userid']);
        $num_rows = mysql_num_rows($result);
        if($num_rows == 1){
            $UserInformation = mysql_fetch_assoc($result);
            $template['variables'] = str_replace(" ","",$template['variables']);
            $replacefrom = explode(",",$template['variables']);
            $replaceto = array($UserInformation['firstname'],$UserInformation['lastname']);
            $message = str_replace($replacefrom,$replaceto,$template['template']);
            $gsmnumber = $UserInformation['gsmnumber'];
            if($settings['gsmnumberfield'] > 0){
                $gsmnumber = $api->customfieldsvalues($args['userid'], $settings['gsmnumberfield']);
            }

            $api->setCountryCode($UserInformation['country']);
            $api->setGsmnumber($gsmnumber);
            $api->setUserid($args['userid']);
            $api->setMessage($message);
            $api->send();
        }
    }
}

return $hook;