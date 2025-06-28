<?php

$hook = array(
    'hook' => 'AfterModuleChangePassword',
    'function' => 'AfterModuleChangePasswordWa',
    'description' => 'Executes upon successful completion of a remote module API password change.<br>Client Related<br>First Name: {firstname}, Last Name: {lastname}, Email: {email}<br>Service Related<br>Service Id: {serviceid}',
    'type' => 'client',
    'extra' => '',
    'defaultmessage' => 'Hi {firstname} {lastname}, password for the {serviceid} has been changed successfully.',
    'variables' => '{firstname}, {lastname}, {email}, {serviceid}'
);
if(!function_exists('AfterModuleChangePasswordWa')){
    function AfterModuleChangePasswordWa($args){
        if($args['serviceid']){
            $api = new wamessenger();
            $template = $api->getTemplateDetails(__FUNCTION__);
            if($template['active'] == 0){
                return null;
            }
            $settings = $api->apiSettings();
            if(!$settings['api_key'] || !$settings['api_token']){
                return null;
            }

        
            $result = $api->getClientDetailsBy(\WHMCS\Session::get("uid"));
            $num_rows = mysql_num_rows($result);
            if($num_rows == 1){
                $UserInformation = mysql_fetch_assoc($result);
                $template['variables'] = str_replace(" ","",$template['variables']);
                $replacefrom = explode(",",$template['variables']);
                $replaceto = array($UserInformation['firstname'],$UserInformation['lastname'],$UserInformation['email'],$args['serviceid']);
                $message = str_replace($replacefrom,$replaceto,$template['template']);
                $gsmnumber = $UserInformation['gsmnumber'];
                if($settings['gsmnumberfield'] > 0){
                    $gsmnumber = $api->customfieldsvalues(\WHMCS\Session::get("uid"), $settings['gsmnumberfield']);
                }
    
                $api->setCountryCode($UserInformation['country']);
                $api->setGsmnumber($gsmnumber);
                $api->setUserid(\WHMCS\Session::get("uid"));
                $api->setMessage($message);
                $api->send();
            }
        }
    }
}
return $hook;
