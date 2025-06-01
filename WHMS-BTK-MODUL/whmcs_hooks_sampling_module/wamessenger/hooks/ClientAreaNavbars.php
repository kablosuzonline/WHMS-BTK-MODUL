<?php

$hook = array(
    'hook' => 'ClientAreaNavbars',
    'function' => 'ClientAreaNavbarsWa',
    'description' => 'Visible text on the frontend when Prevent WhatsApp Banned is enabled.<br>Code: {code}, Admin whatsapp number: {adminwhatsapp}, client whatsapp number: {clientwhatsapp}',
    'type' => 'admin',
    'extra' => '',
    'defaultmessage' => 'We need to confirm your WhatsApp number. Please send the code "{code}" to "{adminwhatsapp}" from your WhatsApp number "{clientwhatsapp}" and then click on the "confirm" button.',
    'variables' => '{code}, {adminwhatsapp},{clientwhatsapp}'
);
if(!function_exists('ClientAreaNavbarsWa')){
    function ClientAreaNavbarsWa(){
        require_once (dirname(__FILE__) . '/../lang/english.php');
        //require('modules/addons/wamessenger/lang/english.php');
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
                if (isset($_POST['wacheck'])) {
                    $request = '1';
                    if($_POST['warequest'] === null){
                        $request = '0';
                    }
                    $api->updaterequest($gsmnumber,$request);
                    header( "Location: clientarea.php" );
                    exit;
                }
                if($wantwhatsappfield != 0 || $permissionsend != 0){
                    $codeotp = $code['otp'];
                    if($codeotp === null){
                        $codeotp = $api->randomString(6,true);
                        $api->insertcode($codeotp,$gsmnumber);
                    }
                }

                if($wantwhatsappfield != 0 && $code['status'] != 1 ){    
                    $adminwhatsapp = $settings['adminwhatsapp'];
                    $template = $api->getTemplateDetails(__FUNCTION__);
                    $template['variables'] = str_replace(" ","",$template['variables']);
                    $replacefrom = explode(",",$template['variables']);
                    $replaceto = array($codeotp,$adminwhatsapp,$gsmnumber);
                    $message = str_replace($replacefrom,$replaceto,$template['template']);
                    
                    echo '
<div class="wacard">
<div class="container" style="width: 80% !important;">
                    <form action="" method="post" id="form">
                    <input type="hidden" name="waparams" value="0"/>
                    <span class="wacolor">'.$message.'</span>
                    <div class="btn-container">
                    <input type="submit" value="'.$_ADDONLANG['confirm'].'" class="btn btn-primary-wa" />
                    </div>
                    </form>';
                    
                    if (isset($_POST['waparams'])) {
                        $validationcheck = $api->wacurl('/showAllGetMessages/','?phonenumber='.$gsmnumber);
                		$obj = json_decode($validationcheck);
                		$objdata = $obj->data;
                		if($objdata){
                    		foreach (array_slice($obj->data, 0, 1) as $item) {
                                if (strpos($item->chat, $codeotp) !== false ) {
                        		    $api->updatecode($gsmnumber,1);
                        		    echo'<span class="wacolor">'.$_ADDONLANG['WhatsAppconfirmed'].'</span>';
                        		    
                        		}else{
                        		    echo'<span class="wacolor">'.$_ADDONLANG['WhatsAppnonconfirmed'].'</span>';
                        		}
                            }
                		} else{
                        		    echo'<span class="wacolor">'.$_ADDONLANG['WhatsAppnonconfirmed'].'</span>';
                        }	
                    }
echo'</div>
</div>';
                }
                if($permissionsend != 0 && $code['request'] ==''){
                    $permissionsend_text = $settings['permissionsend_text'];
                    if(!$permissionsend_text){
                        $permissionsend_text = $_ADDONLANG['wantnotification'];
                    }
                    echo'
                    <div class="wacard">
                    <div class="container" style="width: 80% !important;">
                    <form action="" method="post" id="form2">
                    <input type="hidden" name="wacheck" value="0"/>
                    <div class="internalDiv">
                    <tr>
                    <td><input type="checkbox" value="1" name="warequest" checked = "checked"></td>
                    <td class="fieldlabel wacolor">'.$permissionsend_text.'</td>
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
