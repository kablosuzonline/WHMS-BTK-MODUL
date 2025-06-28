<?php
/* WHMCS Whatsapp Addon with GNU/GPL Licence
 * wamessenger - https://wamessenger.net
 * 
 * 
 * Licence: GPLv3 (http://www.gnu.org/licenses/gpl-3.0.txt)
 * */
 
if (!defined("WHMCS"))
	die("This file cannot be accessed directly");

require_once("api.php");
$api = new wamessenger();
$lists = $api->getLists();
$settings = $api->apiSettings();
$disable = $settings['disable'];

if($disable != 1){
    foreach($lists as $lists){
        add_hook($lists['hook'], 1, $lists['function'], "");
    }
}