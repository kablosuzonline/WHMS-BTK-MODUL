<?php
$license = 'WHMCS-84849570f0d2f8901562';
$db_host = 'localhost';
$db_username = 'Tr-KablosuzUser';
$db_password = '9a95058ffcf7a9e0ca4945b34d853063';
$db_name = 'Tr-KablosuzData';
// $cc_encryption_hash = 'BxY5YvFnVVbPcH4CGYkemolhkO7BKIaqHt4cMQL7t4DDMluTmAXR1APuCuQxRWiW';
$cc_encryption_hash = 'wk5oDdOC3N68mvxCyCXyS52vnJODgyYXACczatdAzpTJIylwg91T5XK9593nJGkR';
$templates_compiledir = '/var/www/vhosts/kablosuzonline.com.tr/template_c';

$downloads_dir = '/var/www/vhosts/kablosuzonline.com.tr/yuklemeler/';
$crons_dir = '/var/www/vhosts/kablosuzonline.com.tr/gorev/';
$mysql_charset = 'utf8';
$customadminpath = 'yonet';
$overidephptimelimit = 500;

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
$display_errors = true; // veya E_ALL; (WHMCS versiyonuna göre değişebilir)

// $api_access_key = 'KALKANKAYA';
// Smarty custom email based template policy:
 $smarty_security_policy = array(
    'system' => array(
        'trusted_dir' => array(
                '/var/www/vhosts/kablosuzonline.com.tr/template_c',
        ),
    ),
 );