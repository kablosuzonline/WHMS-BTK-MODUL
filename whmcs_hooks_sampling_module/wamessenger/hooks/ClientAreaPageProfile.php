<?php

$hook = array(
    'hook' => 'ClientAreaPageProfile',
    'function' => 'ClientAreaPageProfileWa',
    'type' => 'conf',
    'extra' => '',
    'defaultmessage' => '',
    'variables' => ''
);
if(!function_exists('ClientAreaPageProfileWa')){
    function ClientAreaPageProfileWa(){
        require('modules/addons/wamessenger/lang/english.php');
        $clientAreaLoggedIn = defined("CLIENTAREA") && (\WHMCS\Session::get("uid") || \WHMCS\Session::get("cid"));
        if ($clientAreaLoggedIn) {
            $api = new wamessenger();
            $settings = $api->apiSettings();
            $wantwhatsappfield = $settings['wantwhatsappfield'];
            $permissionsend = $settings['permissionsend'];
            $userid = \WHMCS\Session::get("uid");
            $result = $api->getClientDetailsBy($userid);
            $num_rows = mysql_num_rows($result);
            if($num_rows == 1){
                $UserInformation = mysql_fetch_assoc($result);
                $gsmnumber = $api->util_gsmnumber($UserInformation['gsmnumber']);
                if($settings['gsmnumberfield'] > 0){
                    $gsmnumber = $api->util_gsmnumber($api->customfieldsvalues($userid, $settings['gsmnumberfield']));
                }
                $code = mysql_fetch_assoc($api->checkcode($gsmnumber));
                if (isset($_POST['pwacheck'])) {
                    $request = '1';
                    if($_POST['warequest'] === null){
                        $request = '0';
                    }
                    $api->updaterequest($gsmnumber,$request);
                    header( "Location: clientarea.php?action=details" );
                    exit;
                }
                if($permissionsend != 0 && $code['request'] !='' ){
                    if ($code['request'] == 1) {
                        $request = 'checked = "checked"';
                    } else {
                        $request = '';
                    }
                    
                    $permissionsend_text = $settings['permissionsend_text'];
                    if(!$permissionsend_text){
                        $permissionsend_text = $_ADDONLANG['wantnotification'];
                    }
                    
echo '
<div class="wacard">
<div class="container" style="width: 80% !important;">
<form action="" method="post" id="form2">
<input type="hidden" name="pwacheck" value="0"/>
<div class="internalDiv">
<tr>
<td><input type="checkbox" value="1" name="warequest" ' . $request . '></td>
<td class="wacolor">'.$permissionsend_text.'</td>
</tr>
</div>
<div class="btn-container">
<input type="submit" value="'.$_ADDONLANG['save'].'" class="btn btn-primary-wa" />
</div>
</form>
</div>
</div>';                    
                }    
            }  
        }    
    }    
}

return $hook;
