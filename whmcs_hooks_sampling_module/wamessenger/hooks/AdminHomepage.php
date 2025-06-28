<?php
$hook = array(
    'hook' => 'AdminHomepage',
    'function' => 'AdminHomepageWa',
    'type' => 'conf',
    'extra' => '',
    'defaultmessage' => '',
    'variables' => ''
);
if(!function_exists('AdminHomepageWa')){
    function AdminHomepageWa($args){
        $path = dirname( __DIR__ )  . DIRECTORY_SEPARATOR . 'files'. DIRECTORY_SEPARATOR;
        if ($handle = opendir($path)) {
            while (false !== ($file = readdir($handle))) { 
                $filelastmodified = filemtime($path . $file);
                //24 hours in a day * 3600 seconds per hour
                if((time() - $filelastmodified) > 24*3600)
                {
                   unlink($path . $file);
                }
            }
            closedir($handle); 
        }
        
		global $CONFIG;
		$URL = $CONFIG['SystemURL'];
        $api = new wamessenger();
        $checkupdate = $api->checkupdate();
        $settings = $api->apiSettings();
        if($checkupdate === true and $settings['autoupdate'] == '1'){
            $autoupdate = $api->autoupdate();
            if($autoupdate === true){
                return'<div class="health-status-block status-badge-orange clearfix">
                    <div class="detail">
                            <span>WhatsApp Notify Addon successfully autoupdated<br>Note: Please deactivate and activate the module.<a href="https://whmcs.feedback.wamessenger.net/changelog/" target="_blank">View changes</a></span>
                    </div>
                </div>';
            } elseif ($autoupdate === false){
                return'<div class="health-status-block status-badge-orange clearfix">
                <div class="detail">
                        <span>Unable to autoupdate WhatsApp Notify Addon.</span>
                </div>
                </div>';
            }
        } elseif ($checkupdate === true){
            return'<div class="health-status-block status-badge-orange clearfix">
                    <div class="detail">
                            <span>There is a new update for WhatsApp Notify Addon.<a href="https://wamessenger.net/whmcs/last/whmcs_wamessenger.zip?v='.$settings['version'].'">please click here to download new update.</a><p><a href="https://whmcs.feedback.wamessenger.net/changelog/" target="_blank">View changes</a></span>
                    </div>
                </div>';
        }
    }    
}

return $hook;
