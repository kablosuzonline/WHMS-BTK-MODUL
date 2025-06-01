<?php
$hook = array(
    'hook' => 'AfterRegistrarRenewal',
    'function' => 'AfterRegistrarRenewal_adminWa',
    'description' => 'Executes after a successful domain renewal command.<br>Client Related<br>First Name: {firstname}, Last Name: {lastname}<br>Service Related<br>Domain: {domain}',
    'type' => 'admin',
    'extra' => '',
    'defaultmessage' => 'The domain name {domain} has been renewed.',
    'variables' => '{domain}'
);
if(!function_exists('AfterRegistrarRenewal_adminWa')){
    function AfterRegistrarRenewal_adminWa($args){
        $api = new wamessenger();
        $template = $api->getTemplateDetails(__FUNCTION__);
        if($template['active'] == 0){
            return null;
        }
        $settings = $api->apiSettings();
        if(!$settings['api_key'] || !$settings['api_token'] ){
            return null;
        }
        $admingsm = explode(",",$template['admingsm']);

        $template['variables'] = str_replace(" ","",$template['variables']);
        $replacefrom = explode(",",$template['variables']);
        $replaceto = array($args['params']['sld'].".".$args['params']['tld']);
        $message = str_replace($replacefrom,$replaceto,$template['template']);

        foreach($admingsm as $gsm){
            if(!empty($gsm)){
                $api->setGsmnumber( trim($gsm));
                $api->setUserid(0);
                $api->setMessage($message);
                $api->send();
            }
        }
    }
}

return $hook;