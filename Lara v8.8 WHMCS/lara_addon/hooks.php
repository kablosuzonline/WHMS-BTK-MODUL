<?php
/**
 * Lara Theme Settings Hook
 *
 * Setting module for the Lara admin template.
 * Please refer to the full documentation @ http://www.whmcsadmintheme.com for more details.
 *
 * @package    WHMCS
 * @author     Amr M. Ibrahim <mailamr@gmail.com>
 * @copyright  Copyright (c) WHMCSAdminTheme 2016
 * @link       http://www.whmcsadmintheme.com
 */
if (!defined("WHMCS")){
	die("This file cannot be accessed directly");
}

function lara_hook_check_environment(){
	$ioncube_version = 0;
	if (function_exists('ioncube_loader_version')) {
		$ioncube_version = intval(ioncube_loader_version());
	}	
	if ((version_compare( PHP_VERSION, '7.4', '>=' ))  && ($ioncube_version >= 12)){
		require("addon_hooks.php");
		return true;
	}else{ return false; }
}
lara_hook_check_environment();
?>