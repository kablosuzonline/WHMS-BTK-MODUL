<?php
$hook = array(
    'hook' => 'ClientAdd',
    'function' => 'ClientAddWa',
    'description' => 'Executes as a client is being added to WHMCS.<br>Client Related<br>First Name: {firstname}, Last Name: {lastname}, Email: {email}',
    'type' => 'client',
    'extra' => '',
    'defaultmessage' => 'Hi {firstname} {lastname}, Thank you for registering with us. The details of your account are- Email: {email}',
    'variables' => '{firstname},{lastname},{email}'
);
if(!function_exists('ClientAddWa')){
    function ClientAddWa($args){
        $api = new wamessenger();
        $template = $api->getTemplateDetails(__FUNCTION__);
        if($template['active'] == 0){
            return null;
        }
        $settings = $api->apiSettings();
        if(!$settings['api_key'] || !$settings['api_token'] ){
            return null;
        }

        $result = $api->getClientDetailsBy($args['user_id']);
        $num_rows = mysql_num_rows($result);

        if($num_rows == 1){
            $UserInformation = mysql_fetch_assoc($result);

            $template['variables'] = str_replace(" ","",$template['variables']);
            $replacefrom = explode(",",$template['variables']);
            $replaceto = array($UserInformation['firstname'],$UserInformation['lastname'],$args['email']);
            $message = str_replace($replacefrom,$replaceto,$template['template']);
            $gsmnumber = $UserInformation['gsmnumber'];
            if($settings['gsmnumberfield'] > 0){
                $gsmnumber = $api->customfieldsvalues($args['user_id'], $settings['gsmnumberfield']);
            }

            $api->setCountryCode($UserInformation['country']);
            $api->setGsmnumber($gsmnumber);
            $api->setMessage($message);
            $api->setUserid($args['user_id']);
            $api->send();
        }
    }
}

return $hook;