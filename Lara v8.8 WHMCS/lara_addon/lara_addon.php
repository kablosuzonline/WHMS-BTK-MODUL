<?php
/**
 * Lara Theme Settings
 *
 * Setting module for the Lara admin template.
 * Please refer to the full documentation @ http://www.whmcsadmintheme.com for more details.
 *
 * @package    WHMCS
 * @author     Amr M. Ibrahim <mailamr@gmail.com>
 * @copyright  Copyright (c) WHMCSAdminTheme 2016
 * @link       http://www.whmcsadmintheme.com
 */

if (!defined("WHMCS"))
    die("This file cannot be accessed directly");

define("currentLaraVersion", "8.8.0");
define("_LARA_ERR_MSG_", "This version requires PHP v7.4 or above, and ionCube v12 or above.");


function lara_check_environment(){
	$ioncube_version = 0;
	if (function_exists('ioncube_loader_version')) {
		$ioncube_version = intval(ioncube_loader_version());
	}	
	if ((version_compare( PHP_VERSION, '7.4', '>=' ))  && ($ioncube_version >= 12)){
		require_once("addon_actions.php");
		return true;
	}else{ return false; }
}

function lara_addon_config() {
     $configarray = array(
							"name"        => "Lara Theme Settings",
							"description" => "Setting module for the Lara admin template. <br><b>Important:</b> Make sure to permit access to all admin groups.",
							"version"     => currentLaraVersion,
							"author"      => "Amr M. Ibrahim",
							"language"    => "english",
							"fields"      => array( "general_header" => array("FriendlyName" => "<b>[*]</b>","Description" => "<br><h1><b>General Settings</b></h1>"),
													"license_key"    => array("FriendlyName" => "License key","Type" => "text","Size" => "35","Default" => ""),
													"log_level"      => array("FriendlyName" => "Log level",
																			  "Type"         => "dropdown",
																			  "Options"      => array("error"    => "[error]   - Fatal Errors (recommended).",
																									  "warning"  => "[warning] - Runtime Errors (not recommended for production use).",
																									  "debug"    => "[debug]   - Debug Logs (not recommended for production use)."),
																			  "Description"  => "<div>Select what should be logged to WHMCS Activity Log.</div>",
																			  "Default" => "error"))
						);

    return $configarray;
}

function lara_addon_activate() {
	$state = lara_check_environment();
	if ($state === true){
		lara_internal_addon_activate();
        return [
            'status' => 'success',
            'description' => 'Module successfully activated.',
        ];		
	}else{
        return [
            'status' => "error",
            'description' => "Lara module failed to load : " . _LARA_ERR_MSG_,
        ];
	}
}

function lara_addon_deactivate() {
	
	$state = lara_check_environment();
	if ($state === true){
		lara_internal_addon_deactivate();
        return [
            'status' => 'success',
            'description' => 'Module successfully deactivated.',
        ];		
	}else{
        return [
            'status' => "error",
            'description' => "Lara module failed to deactivate : " . _LARA_ERR_MSG_,
        ];
	}	
}

function lara_addon_upgrade($vars) {
	$state = lara_check_environment();
	if ($state === true){
		lara_internal_addon_upgrade($vars);
        return [
            'status' => 'success',
            'description' => 'Module successfully upgraded.',
        ];		
	}else{
        return [
            'status' => "error",
            'description' => "Lara module failed to upgrade : " . _LARA_ERR_MSG_,
        ];
	}	
}

function lara_addon_output($vars) {
	$state = lara_check_environment();
	if ($state === true){
		return lara_internal_addon_output($vars);
	}else{
		$results = array('errors'=>array("Lara module failed to output : " . _LARA_ERR_MSG_));
		if(!empty($_POST)){
			header('Content-Type: application/json');
			echo json_encode($results);
			exit;			
		}else{
			echo '<div class="callout callout-warning">
					<ul class="fa-ul">
						<li><i class="fa-li fa fa-warning"></i>Lara module failed to output : ' . _LARA_ERR_MSG_ . ' </li>
					</ul>
				</div>';
		}
	}	
}

?>