<?php

$hook = array(
    'hook' => 'ClientAreaHeadOutput',
    'function' => 'ClientAreaHeadOutputWa',
    'description' => '',
    'type' => 'conf',
    'extra' => '',
    'defaultmessage' => '',
    'variables' => ''
);
if(!function_exists('ClientAreaHeadOutputWa')){
    function ClientAreaHeadOutputWa($vars){
        return <<<HTML
    <link href="/modules/addons/wamessenger/css/Style.css" rel="stylesheet" type="text/css" />
HTML;
    }    
}

return $hook;
