<?php

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Require any libraries needed for the module to function.
// require_once __DIR__ . '/path/to/library/loader.php';
//
// Also, perform any initialization required by the service's library.

/**
 * Define module related meta data.
 *
 * Values returned here are used to determine module related abilities and
 * settings.
 *
 * @see http://docs.whmcs.com/Provisioning_Module_Meta_Data_Parameters
 *
 * @return array
 */
function ssg_provisioner_MetaData()
{
    return array(
        'DisplayName' => 'Kerio Control Server Module',
        'APIVersion' => '1.1', // Use API Version 1.1
        'RequiresServer' => true, // Set true if module requires a server to work
        'DefaultNonSSLPort' => '4080', // Default Non-SSL Connection Port
        'DefaultSSLPort' => '4081', // Default SSL Connection Port
        'ServiceSingleSignOnLabel' => 'Login to Panel as User',
        'AdminSingleSignOnLabel' => 'Login to Panel as Admin',
    );
}

/**
 * Define product configuration options.
 *
 * The values you return here define the configuration options that are
 * presented to a user when configuring a product for use with the module. These
 * values are then made available in all module function calls with the key name
 * configoptionX - with X being the index number of the field from 1 to 24.
 *
 * You can specify up to 24 parameters, with field types:
 * * text
 * * password
 * * yesno
 * * dropdown
 * * radio
 * * textarea
 *
 * Examples of each and their possible configuration parameters are provided in
 * this sample function.
 *
 * @return array
 */
function ssg_provisioner_ConfigOptions()
{
    return array( 
	"Grup ADI" => array( "Type" => "text", "Size" => "30" ),"Grup Kodu" => array( "Type" => "text", "Size" => "30" ), 
	"Kullanıcı Aktif mi" => array( "Type" => "yesno", "Description" => "Kerio üzerinde oluşturulacak kullanıcı hemen aktif edilsin mi?" ),"Kerio Şablon" => array( "Type" => "yesno", "Description" => "Şablon aktif edilirse aşağıda tanımladığınız kotalar kullanılamayacaktır" ),
	"Günlük Kota Uygula" => array( "Type" => "yesno", "Description" => "Günlük kotanın uygulanmasını istiyorsanız seçili hale getiriniz ve günlük kota belirleyiniz" ), "Günlük Kota" => array( "Type" => "text", "Size" => "2", "Description" => "GigaBytes" ), 
	"Haftalık Kota Uygula" => array( "Type" => "yesno", "Description" => "Haftalık kotanın uygulanmasını istiyorsanız seçili hale getiriniz ve haftalık kota belirleyiniz" ), "Haftalık Kota" => array( "Type" => "text", "Size" => "2", "Description" => "GigaBytes" ),
	"Aylık Kota Uygula" => array( "Type" => "yesno", "Description" => "Aylık kotanın uygulanmasını istiyorsanız seçili hale getiriniz ve aylık kota belirleyiniz" ), "Aylık Kota" => array( "Type" => "text", "Size" => "2", "Description" => "GigaBytes" ),
	"Ürün Hız Değeri - Download" => array( "Type" => "yesno", "Description" => "Anlık Download limiti" ), "Download Limit" => array( "Type" => "text", "Size" => "2", "Description" => "Mbps" ),
	"Ürün Hız Değeri - Upload" => array( "Type" => "yesno", "Description" => "Anlık Upload limiti" ), "Upload Limit" => array( "Type" => "text", "Size" => "2", "Description" => "Mbps" )
	
	 );
}

/**
 * Provision a new instance of a product/service.
 *
 * Attempt to provision a new instance of a given product/service. This is
 * called any time provisioning is requested inside of WHMCS. Depending upon the
 * configuration, this can be any of:
 * * When a new order is placed
 * * When an invoice for a new order is paid
 * * Upon manual request by an admin user
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_CreateAccount(array $params)
{
	
    try {

		$username = $params["username"];
			$password = $params["password"];
			$email = $params["clientsdetails"]["email"];
			$name = $params["username"];
			$phone = $params["clientsdetails"]["phonenumber"];//"905064066422";
			$dt = $params["regdate"]; // core_get_datetime();
			$kredi	= $params['subscriptionid'];//$params["domain"]; 
			$lastname = $params["clientsdetails"]["lastname"];
			$firstname = $params["clientsdetails"]["firstname"];
		//	$clientip  = $params["clientsdetails"]["clientip"];
			
			
	
	
		$postfields = array();
		$postfields["program"] = "create-domain";
		$postfields["domain"] = $params["domain"];
		$postfields["user"] = $params["username"];
		$postfields["pass"] = $params["password"];
		$postfields["email"] = $params["clientsdetails"]["email"];                

		if ($params["configoption1"]) {
			$postfields["template"] = $params["configoption1"];
		}


		if ($params["configoption2"]) {
			$postfields["plan"] = $params["configoption2"];
		}


		if ($params["configoption3"]) {
			$postfields["allocate-ip"] = "";
		}

		$postfields["features-from-plan"] = "";
		require_once 'src/KerioControlApi.php';		
		$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');
		
		$mac  = $params["customfields"]["MAC Adresleri"];
		$macpieces = explode(";", $mac);
		$session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
	
		
	$userGroups = ssg_provisioner_groupgetir($api, $params);
    $date = date('d/m/Y', time());
    $date = 'Oluşturma Tarihi: '.$date;
	$useTemplate = true;
	$localEnabled = true;	
	$vpnAddress['enabled'] = false;
	// AYLIK KOTA
	$quotaMountly =  $params["configoption9"];
	$quotaMountly = (($quotaMountly == "on" || $quotaMountly == "Yes") ? true : false);
	if($quotaMountly){
	$quotaM = array(
                    'enabled' => $quotaMountly,
                    'type' => 'QuotaBoth',
                    'limit' => array(
                        'value' => (int)$params["configoption10"],
                        'units' => 'GigaBytes'
                    ));
				}else{ $quotaM = array( 'enabled' => $quotaMountly);	
			}	
	// HAFTALIK KOTA
	$quotaWeekly =  $params["configoption7"];
	$quotaWeekly = (($quotaWeekly == "on" || $quotaWeekly == "Yes") ? true : false);
		if($quotaWeekly){
	$quotaW = array(
                    'enabled' => $quotaWeekly,
                    'type' => 'QuotaBoth',
                    'limit' => array(
                        'value' => (int)$params["configoption8"],
                        'units' => 'GigaBytes'
                    ));
				}else{ $quotaW = array( 'enabled' => $quotaWeekly);	
			}
		// GÜNLÜK KOTA
	$quotaDaily =  $params["configoption5"];
	$quotaDaily = (($quotaDaily  == "on" || $quotaDaily  == "Yes") ? true : false);
		if($quotaDaily ){
	$quotaD = array(
                    'enabled' => $quotaDaily,
                    'type' => 'QuotaBoth',
                    'limit' => array(
                        'value' => (int)$params["configoption6"],
                        'units' => 'GigaBytes'
                    ));
				}else{ $quotaD = array( 'enabled' => $quotaDaily);	
			}			
				
				
					
//	$vpnAddress['value'] = '';
	if(!$params["configoption3"]){
		$localEnabled = false;	
		}
	if( $params["configoption4"]){
		$useTemplate = true;	
		}
		
    $newUser = array(
        'credentials' => array(
            'userName' => $username,
            'password' => $password,
            'passwordChanged' => true
        ),
        'fullName' => $firstname.' '.$lastname.' - '.$phone,
        //'fullName' => $params['clientsdetails']['firstname'] . ' ' . $params['clientsdetails']['lastname'],
        'description' => $date,
        'email' => $email,
        'authType' => 'Internal',
		
       'useTemplate' => $useTemplate,
        'adEnabled' => true,
       'localEnabled' =>  $localEnabled,//$params["configoption3"],
       'groups' => $userGroups,
		'conflictWithLocal' => true,
		'totpConfigured' => true,
	//	 'vpnAddress' => $vpnAddress

		'vpnAddress' => array(
            'enabled' => false
  //          'value' => null
        ),
       

	   'autoLogin' => array(
            'firewall' => false,
            'addresses' => array(
                'enabled' => false
       //         'value' => null
            ),
			'macAddresses' => array(
                'enabled' => true,
                'value' => $macpieces
				)
			,
            'addressGroup' => array(
                'enabled' => false
         //       'id' => null
            )
        )
		, 
     
		
        'data' => array(
            'rights' => array(
                'readConfig' => false,
                'writeConfig' => false,
                'overrideWwwFilter' => false,
                'unlockRule' => false,
                'dialRasConnection' => false,
                'connectVpn' => false,
                'connectSslVpn' => false,
                'useP2p' => false
            ),
            'quota' => array(
                'daily' => $quotaD,
                'weekly' => $quotaW,
				'blockTraffic' => false,
                'notifyUser' => false,
                'monthly' => $quotaM
            ),
            'wwwFilter' => array(
                'javaApplet' => false,
                'embedObject' => false,
                'script' => false,
                'popup' => false,
                'referer' => false
            ),
            'language' => 'detect' 
			
        ) 
    );
    $userList[] = $newUser;
    
    /* create user */
    $params2 = array(
        'domainId' => 'local',
        'users' => $userList
    );
	
    $sonuc = $api->sendRequest('Users.create', $params2);
	
	{
//	if($sonuc[result][0][id]){

		     $clientarray = $api->getConfigTimestamp();
	
			 $api->confirmConfig($clientarray);
		}
//	logModuleCall( "ssg_provisioner", 'TEST', $postfields, $sonuc[result][0][id] );
	
	

	
	
	$result = ssg_provisioner_bupdate($params);

	
	
	
	
	
	
	

    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }
	if (isset($session)) $api->logout();
    return 'success';
}


function ssg_provisioner_bupdate($params) {
//	ssg_provisioner_AdminServicesTabFieldsSave($params);
//	<input type="submit" value="Git" class="btn btn-success btn-sm" />
		require_once 'src/KerioControlApi.php';	
	$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	 	
//	ssg_provisioner_req( $params, $postfields);
	
	
try {
    $session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
    
		
    	
	$paramskerio = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'userName',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	$users = $api->sendRequest('Users.get', $paramskerio);

				$username = $params["username"];
			$password = $params["password"];
			$email = $params["clientsdetails"]["email"];
			$name = $params["username"];
			$phone = $params["clientsdetails"]["phonenumber"];//"905064066422";
			$dt = $params["regdate"]; // core_get_datetime();
			$kredi	= $params['subscriptionid'];//$params["domain"]; 
			$lastname = $params["clientsdetails"]["lastname"];
			$firstname = $params["clientsdetails"]["firstname"];
			$i = 0 ;
			
	foreach ($users['list'] as $user) {
		
		if ($user['credentials']['userName'] == $params["username"]){
			
			
			 
		$userid = $user['id'];
		 $newuser = Array('id' => $user['id'],
						  'name' => $user['fullName']
                                );
			 $traffic2 = Array
                        (
                            'type' => 'BMConditionUsers',
           
                            'dscp' => 0,
                            'trafficType' => 'BMTrafficEmail',
                            'user' => $newuser

                        );
			
						
		 $list = $api->sendRequest("BandwidthManagement.get");

		 $listcount = count($list['config']['rules']);
		 
		$list['config']['decryptVpnTunnels'] = false;
		$list['config']['rules'][$listcount]['enabled'] = true;
		$list['config']['rules'][ $listcount]['name'] = $user['fullName'];
		$list['config']['rules'][ $listcount]['description'] = $date.' Whmcs Module ';
		$list['config']['rules'][ $listcount]['color'] = 'FFFFFF';
		$list['config']['rules'][ $listcount]['traffic'][0] = $traffic2;
		$list['config']['rules'][ $listcount]['maximumDownload'] = Array
                (
                    'enabled' => true,
                    'value' => (int)$params["configoption12"],
                    'unit' => 'BandwidthUnitMegabits'
                );
		$list['config']['rules'][ $listcount]['maximumUpload'] = Array
                (
                    'enabled' => true,
                    'value' =>  (int)$params["configoption14"],
                    'unit' => 'BandwidthUnitMegabits'
                );				

		$list['config']['rules'][ $listcount]['chart'] = true;
		 $id1 = (int)$listcount -1 ;
		$id	= (int)$list['config']['rules'][$id1]['id'] + 1 ;

		 $api->sendRequest("BandwidthManagement.set", $list);
		
		 
	
		
	
		
		
		
		
		    	 $clientarray = $api->getConfigTimestamp();
	
			 $api->confirmConfig($clientarray);
				
		$result = "success";
		}
	//	$i++;	
		}
		
		
	
 
return $result;


}
catch (KerioApiException $e) {
   //$result = "error";
    // $result = $e->getMessage();
		$result= $e->getMessage();	
		
}

if (isset($session)) $api->logout();
return $result;
}



function ssg_provisioner_groupgetir($api, $params) {
	
		$paramsgroup = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'name',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	
    $groupgetir = $api->sendRequest('UserGroups.get', $paramsgroup);
//	logModuleCall( "ssg_provisioner", 'TEST', $groupgetir, $groupgetir );
	$i = 0;
	$gname = $params['configoption1'];
	$filitre = $params["configoptions"]["Aile Filitresi"];
	if($filitre == 'Pasif'){
		$gname = 'FILITRESIZ';
	}
	if(strtoupper($params['configoption1']) == 'ODEME GECIKME'){
		$gname = 'ODEME GECIKME';
	}
	foreach ($groupgetir['list'] as $group) {

		if (strtoupper($group['name']) == strtoupper($gname)){
		
		$groupid = $group['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
		$userGroups[$i] = array('id' => $groupid);
		$i++;
	//	logModuleCall( "ssg_provisioner", 'TEST', $groupid, $groupid );
			}	
		}
		if (isset($session)) $api->logout();
	return $userGroups;
}
/**
 * Suspend an instance of a product/service.
 *
 * Called when a suspension is requested. This is invoked automatically by WHMCS
 * when a product becomes overdue on payment or can be called manually by admin
 * user.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_SuspendAccount(array $params)
{
    try {
      	require_once 'src/KerioControlApi.php';	
		$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	
		$session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
    

    	
	$paramskerio = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'userName',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	$users = $api->sendRequest('Users.get', $paramskerio);
	$date = date('d/m/Y', time());
	$durdate = 'Hizmet askıya alma tarihi: '.$date;
	$params['configoption1'] = 'ODEME GECIKME';
	$userGroups = ssg_provisioner_groupgetir($api, $params);
	//$userGroups[] = array('id' => 'e5dab66b-21c3-41a1-a6ac-01eca476d173'); 
	foreach ($users['list'] as $user) {
		
		if ($user['credentials']['userName'] == $params["username"]){
		
		$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
		$up_user['userIds'] = array($userid);
		$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $durdate,
		'adEnabled' => true,
        //      'adEnabled' => true,
		'localEnabled' => true,
		'groups' => $userGroups  // array('usergroup' => '0',array('id' => 'e5dab66b-21c3-41a1-a6ac-01eca476d173')),
		
		);
		
	//	$up_user['groups'][] = array('id' => 'e5dab66b-21c3-41a1-a6ac-01eca476d173');
                    $up_user['domainId'] = 'local';
                    $response = $api->sendRequest('Users.set', $up_user);
		
			//$clientarray = array();


		    	 $clientarray = $api->getConfigTimestamp();
	
				$api->confirmConfig($clientarray);
		}
			
		}
		
		
		
		
		
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }
	if (isset($session)) $api->logout();
    return 'success';
}

/**
 * Un-suspend instance of a product/service.
 *
 * Called when an un-suspension is requested. This is invoked
 * automatically upon payment of an overdue invoice for a product, or
 * can be called manually by admin user.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_UnsuspendAccount(array $params)
{
    try {
		$postfields = array();
		$postfields["program"] = "enable-domain";
		$postfields["domain"] = $params["domain"];
		require_once 'src/KerioControlApi.php';	
		$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');
		 $session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
    

    	
	$paramskerio = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'userName',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	$users = $api->sendRequest('Users.get', $paramskerio);
	

	 $date = date('d/m/Y', time());
	 $aktifdate = 'Hizmeti askıdan alma tarihi: '.$date;
	foreach ($users['list'] as $user) {
		
		if ($user['credentials']['userName'] == $params["username"]){
		
		$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
		$up_user['userIds'] = array($userid);
		$userGroups = ssg_provisioner_groupgetir($api, $params);
		$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $aktifdate,
		'adEnabled' => true,
		'localEnabled' => true,
		'groups' => $userGroups,
		
		);
                    $up_user['domainId'] = 'local';
                    $response = $api->sendRequest('Users.set', $up_user);
	
		}
			
		}
			 $clientarray = $api->getConfigTimestamp();
	
				$api->confirmConfig($clientarray);
		
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }

    return 'success';
}



function ssg_provisioner_ChangeMac($params) {
			
		try {
			require_once 'src/KerioControlApi.php';	
			$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	 	
			$mac  = $params["customfields"]["MAC Adresleri"];
			$macpieces = explode(";", $mac);
			$session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
			

				
			$paramskerio = array(
				'query' => array(
					'combining' => 'And',
					'orderBy' => array(array(
						'columnName' => 'userName',
						'direction' => 'Asc'
					))
				),
				'domainId' => 'local' // local database
			);
			$users = $api->sendRequest('Users.get', $paramskerio);
			$date = date('d/m/Y', time());
			$durdate = 'MAC Change: '.$date;
			$userGroups[] = array('id' => '');
			foreach ($users['list'] as $user) {
				
				if ($user['credentials']['userName'] == $params["username"]){
				
				$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
				$up_user['userIds'] = array($userid);
				$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $durdate,
				 'autoLogin' => array(
		 
					'macAddresses' => array(
						'enabled' => true,
						'value' => $macpieces
						)
					
				  
				)
				
				);
						  $up_user['domainId'] = 'local';
							$res = $api->sendRequest('Users.set', $up_user);
				
						 $clientarray = $api->getConfigTimestamp();
			
					 $api->confirmConfig($clientarray);
				}
					
				}
				
				
				
			
				
				
			$result = "success";

		 



		}
		catch (KerioApiException $e) {
		   //$result = "error";
			 $result = $e->getMessage();
		}

		


			

	if (isset($session)) $api->logout();
 	return $result;
 }
/**
 * Terminate instance of a product/service.
 *
 * Called when a termination is requested. This can be invoked automatically for
 * overdue products if enabled, or requested manually by an admin user.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_TerminateAccount(array $params)
{
    try {
    	require_once 'src/KerioControlApi.php';	
		$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	
		$session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
			$paramskerio = array(
				'query' => array(
					'combining' => 'And',
					'orderBy' => array(array(
						'columnName' => 'userName',
						'direction' => 'Asc'
					))
				),
				'domainId' => 'local' // local database
			);
			$users = $api->sendRequest('Users.get', $paramskerio);
			$date = date('d/m/Y', time());
			$durdate = 'Hizmet durdurma tarihi: '.$date;
			$userGroups[] = array('id' => '');
			foreach ($users['list'] as $user) {
				
				if ($user['credentials']['userName'] == $params["username"]){
				
				$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
				$up_user['userIds'] = array($userid);
				$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $durdate,
				'adEnabled' => false,
				'localEnabled' => false,
			'groups' =>$userGroups,// array('usergroup' => '0',array('id' => '1e7b6346-f3e1-450c-b92c-f61d9cf1f29f')),
				
				);
							$up_user['domainId'] = 'local';
							$response = $api->sendRequest('Users.set', $up_user);
				
						 $clientarray = $api->getConfigTimestamp();
			
					 $api->confirmConfig($clientarray);
				}
					
				}
		
		
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }
	if (isset($session)) $api->logout();
    return 'success';
}

/**
 * Change the password for an instance of a product/service.
 *
 * Called when a password change is requested. This can occur either due to a
 * client requesting it via the client area or an admin requesting it from the
 * admin side.
 *
 * This option is only available to client end users when the product is in an
 * active status.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_ChangePassword(array $params)
{
    try {
			$username = $params["username"];
			$password = $params["password"];

			$postfields = array();
			$postfields["program"] = "modify-domain";
			$postfields["domain"] = $params["domain"];
			$postfields["pass"] = $params["password"];
			require_once 'src/KerioControlApi.php';	
			$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	 	
			  $session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
        
	$paramskerio = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'userName',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	$users = $api->sendRequest('Users.get', $paramskerio);
	$date = date('d/m/Y', time());
	$durdate = 'Hizmet şifresi değiştirildi: '.$date;
	foreach ($users['list'] as $user) {
		
		if ($user['credentials']['userName'] == $params["username"]){
		
		$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
		$up_user['userIds'] = array($userid);
		$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $durdate,

		);
                    $up_user['domainId'] = 'local';
                    $response = $api->sendRequest('Users.set', $up_user);
			
		    	 $clientarray = $api->getConfigTimestamp();
	
			 $api->confirmConfig($clientarray);
		}
			
		}
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }
	if (isset($session)) $api->logout();
    return 'success';
}

/**
 * Upgrade or downgrade an instance of a product/service.
 *
 * Called to apply any change in product assignment or parameters. It
 * is called to provision upgrade or downgrade orders, as well as being
 * able to be invoked manually by an admin user.
 *
 * This same function is called for upgrades and downgrades of both
 * products and configurable options.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_ChangePackage(array $params)
{
    try {
 $postfields = array();
	$postfields["program"] = "modify-domain";
	$postfields["domain"] = $params["domain"];
	$postfields["plan-features"] = "";

	if ($params["configoption1"]) {
		$postfields["template"] = $params["configoption1"];
	}


	if ($params["configoption2"]) {
		$postfields["apply-plan"] = $params["configoption2"];
	}



//	$result = ssg_provisioner_req( $params, $postfields );


	require_once 'src/KerioControlApi.php';	
	$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	 	
	 $session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
    

    	
	$paramskerio = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'userName',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	$users = $api->sendRequest('Users.get', $paramskerio);
	$groupids = ssg_provisioner_groupgetir($api, 'FILITRESIZ');
	$date = date('d/m/Y', time());
	$durdate = 'Paket Değişim Tarihi: '.$date;
	foreach ($users['list'] as $user) {
		
		if ($user['credentials']['userName'] == $params["username"]){
		
		$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
		$up_user['userIds'] = array($userid);
		$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $durdate,
		
		'groups' =>$groupids,
		
		);
                    $up_user['domainId'] = 'local';
                    $res = $api->sendRequest('Users.set', $up_user);
		
		    	 $clientarray = $api->getConfigTimestamp();
	
			 $result = $api->confirmConfig($clientarray);
		}
			
		}
		
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }

    return 'success';
}


function ssg_provisioner_fupdate($params) {
//	ssg_provisioner_AdminServicesTabFieldsSave($params);
//	<input type="submit" value="Git" class="btn btn-success btn-sm" />
		require_once 'src/KerioControlApi.php';	
	$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');	 	
//	ssg_provisioner_req( $params, $postfields);
	
try {
    $session = $api->login($params["serverip"], $params["serverusername"], $params["serverpassword"]);
    

    	
	$paramskerio = array(
		'query' => array(
			'combining' => 'And',
			'orderBy' => array(array(
				'columnName' => 'userName',
				'direction' => 'Asc'
			))
		),
		'domainId' => 'local' // local database
	);
	$users = $api->sendRequest('Users.get', $paramskerio);
	$date = date('d/m/Y', time());
	$durdate = 'Hizmet durdurma tarihi: '.$date;
	//$params['configoption1'] = $postfields['configoption1'];
//	$durum = $_POST['configoption'][1];
	//if(!$durum == "2"){
//	$params['configoption1'] = 'FILITRESIZ';
	//$params["configoptions"]["Aile Filitresi"]["selectedvalue"] = 1;
//	update_query( 'tblhosting', $params, array( 'id' => $id ));
	
	//}
	
	$userGroups = ssg_provisioner_groupgetir($api, $params); //array('id' => '');
	
	//$postfields["action"] = "updateclientproduct";
	foreach ($users['list'] as $user) {
		
		if ($user['credentials']['userName'] == $params["username"]){
		
		$userid = $user['id'];//array('195755f2-6438-4ebb-85a3-c763500b0ff8');
		$up_user['userIds'] = array($userid);
		$up_user['details'] = array('credentials' => array('userName' => $user['credentials']['userName'], 'password' => $params['password'], 'passwordChanged' => true), 'description' => $durdate,

	'groups' =>$userGroups,// array('usergroup' => '0',array('id' => '1e7b6346-f3e1-450c-b92c-f61d9cf1f29f')),
		
		);
                    $up_user['domainId'] = 'local';
                    $res = $api->sendRequest('Users.set', $up_user);
		
		    	 $clientarray = $api->getConfigTimestamp();
	
			 $api->confirmConfig($clientarray);
		}
			
		}
		
		
		
	
		
		
	$result = "success";

 



}
catch (KerioApiException $e) {
   //$result = "error";
     $result = $e->getMessage();
}

if (isset($session)) $api->logout();
return $result;
}



function ssg_provisioner_UsageUpdate($params) {
	

	$postfields = array();
	$postfields["program"] = "list-domains";
	$postfields["multiline"] = "";
	//$result = ssg_provisioner_req( $params, $postfields, true );
	$dataarray = explode( "
", $result );

	$arraydata = array();
	foreach ($dataarray as $line) {

		if (substr( $line, 0, 4 ) == "    ") {
			$line = trim( $line );
			$line = explode( ":", $line, 2 );
			$arraydata[trim( $line[0] )] = trim( $line[1] );
			continue;
		}

		$domainsarray[$domain] = $arraydata;
		$domain = trim( $line );
		$arraydata = array();
	}

	foreach ($domainsarray as $domain => $values) {
		$diskusage = $values["Server byte quota used"] / 1048576;
		$disklimit = $values["Server block quota"] / 1024;
		$bwlimit = $values["Bandwidth byte limit"] / 1048576;
		$bwused = $values["Bandwidth byte usage"] / 1048576;

		if ($domain) {
			update_query( "tblhosting", array( "diskusage" => $diskusage, "disklimit" => $disklimit, "bwusage" => $bwused, "bwlimit" => $bwlimit, "lastupdate" => "now()" ), array( "domain" => $domain, "server" => $params["serverid"] ) );
			continue;
		}
	}

}

/**
 * Test connection with the given server parameters.
 *
 * Allows an admin user to verify that an API connection can be
 * successfully made with the given configuration parameters for a
 * server.
 *
 * When defined in a module, a Test Connection button will appear
 * alongside the Server Type dropdown when adding or editing an
 * existing server.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return array
 */
 
function ssg_provisioner_TestConnection(array $params)
{
    try {
        // Call the service's connection test function.

        $success = true;
        $errorMsg = '';
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        $success = false;
        $errorMsg = $e->getMessage();
    }

    return array(
        'success' => $success,
        'error' => $errorMsg,
    );
}

/**
 * Additional actions an admin user can invoke.
 *
 * Define additional actions that an admin user can perform for an
 * instance of a product/service.
 *
 * @see ssg_provisioner_buttonOneFunction()
 *
 * @return array
 */
function ssg_provisioner_AdminCustomButtonArray() {
	 return array( 'Filitreyi Güncelle' => 'fupdate', 'Bandwidth Güncelle' => 'bupdate', 'MAC Adeslerini Güncelle' => 'ChangeMac' );
    
}

/**
 * Additional actions a client user can invoke.
 *
 * Define additional actions a client user can perform for an instance of a
 * product/service.
 *
 * Any actions you define here will be automatically displayed in the available
 * list of actions within the client area.
 *
 * @return array
 */
function ssg_provisioner_ClientAreaCustomButtonArray()
{
    return array(
        "Action 1 Display Value" => "actionOneFunction",
        "Action 2 Display Value" => "actionTwoFunction",
    );
}

/**
 * Custom function for performing an additional action.
 *
 * You can define an unlimited number of custom functions in this way.
 *
 * Similar to all other module call functions, they should either return
 * 'success' or an error message to be displayed.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 * @see ssg_provisioner_AdminCustomButtonArray()
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_buttonOneFunction(array $params)
{
    try {
        // Call the service's function, using the values provided by WHMCS in
        // `$params`.
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }

    return 'success';
}

/**
 * Custom function for performing an additional action.
 *
 * You can define an unlimited number of custom functions in this way.
 *
 * Similar to all other module call functions, they should either return
 * 'success' or an error message to be displayed.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 * @see ssg_provisioner_ClientAreaCustomButtonArray()
 *
 * @return string "success" or an error message
 */
function ssg_provisioner_actionOneFunction(array $params)
{
    try {
        // Call the service's function, using the values provided by WHMCS in
        // `$params`.
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return $e->getMessage();
    }

    return 'success';
}

/**
 * Admin services tab additional fields.
 *
 * Define additional rows and fields to be displayed in the admin area service
 * information and management page within the clients profile.
 *
 * Supports an unlimited number of additional field labels and content of any
 * type to output.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 * @see ssg_provisioner_AdminServicesTabFieldsSave()
 *
 * @return array
 */
function ssg_provisioner_AdminServicesTabFields(array $params)
{
    try {
        // Call the service's function, using the values provided by WHMCS in
        // `$params`.
        $response = array();

        // Return an array based on the function's response.
        return array(
            'Number of Apples' => (int) $response['numApples'],
            'Number of Oranges' => (int) $response['numOranges'],
            'Last Access Date' => date("Y-m-d H:i:s", $response['lastLoginTimestamp']),
            'Something Editable' => '<input type="hidden" name="ssg_provisioner_original_uniquefieldname" '
                . 'value="' . htmlspecialchars($response['textvalue']) . '" />'
                . '<input type="text" name="ssg_provisioner_uniquefieldname"'
                . 'value="' . htmlspecialchars($response['textvalue']) . '" />',
        );
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        // In an error condition, simply return no additional fields to display.
    }

    return array();
}

/**
 * Execute actions upon save of an instance of a product/service.
 *
 * Use to perform any required actions upon the submission of the admin area
 * product management form.
 *
 * It can also be used in conjunction with the AdminServicesTabFields function
 * to handle values submitted in any custom fields which is demonstrated here.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 * @see ssg_provisioner_AdminServicesTabFields()
 */
function ssg_provisioner_AdminServicesTabFieldsSave(array $params)
{
    // Fetch form submission variables.
    $originalFieldValue = isset($_REQUEST['ssg_provisioner_original_uniquefieldname'])
        ? $_REQUEST['ssg_provisioner_original_uniquefieldname']
        : '';

    $newFieldValue = isset($_REQUEST['ssg_provisioner_uniquefieldname'])
        ? $_REQUEST['ssg_provisioner_uniquefieldname']
        : '';

    // Look for a change in value to avoid making unnecessary service calls.
    if ($originalFieldValue != $newFieldValue) {
        try {
            // Call the service's function, using the values provided by WHMCS
            // in `$params`.
        } catch (Exception $e) {
            // Record the error in WHMCS's module log.
            logModuleCall(
                'ssg_provisioner',
                __FUNCTION__,
                $params,
                $e->getMessage(),
                $e->getTraceAsString()
            );

            // Otherwise, error conditions are not supported in this operation.
        }
    }
}

/**
 * Perform single sign-on for a given instance of a product/service.
 *
 * Called when single sign-on is requested for an instance of a product/service.
 *
 * When successful, returns a URL to which the user should be redirected.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return array
 */
function ssg_provisioner_ServiceSingleSignOn(array $params)
{
    try {
        // Call the service's single sign-on token retrieval function, using the
        // values provided by WHMCS in `$params`.
        $response = array();

        return array(
            'success' => true,
            'redirectTo' => $response['redirectUrl'],
        );
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return array(
            'success' => false,
            'errorMsg' => $e->getMessage(),
        );
    }
}

/**
 * Perform single sign-on for a server.
 *
 * Called when single sign-on is requested for a server assigned to the module.
 *
 * This differs from ServiceSingleSignOn in that it relates to a server
 * instance within the admin area, as opposed to a single client instance of a
 * product/service.
 *
 * When successful, returns a URL to which the user should be redirected to.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return array
 */
function ssg_provisioner_AdminSingleSignOn(array $params)
{
    try {
        // Call the service's single sign-on admin token retrieval function,
        // using the values provided by WHMCS in `$params`.
        $response = array();

        return array(
            'success' => true,
            'redirectTo' => $response['redirectUrl'],
        );
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        return array(
            'success' => false,
            'errorMsg' => $e->getMessage(),
        );
    }
}

/**
 * Client area output logic handling.
 *
 * This function is used to define module specific client area output. It should
 * return an array consisting of a template file and optional additional
 * template variables to make available to that template.
 *
 * The template file you return can be one of two types:
 *
 * * tabOverviewModuleOutputTemplate - The output of the template provided here
 *   will be displayed as part of the default product/service client area
 *   product overview page.
 *
 * * tabOverviewReplacementTemplate - Alternatively using this option allows you
 *   to entirely take control of the product/service overview page within the
 *   client area.
 *
 * Whichever option you choose, extra template variables are defined in the same
 * way. This demonstrates the use of the full replacement.
 *
 * Please Note: Using tabOverviewReplacementTemplate means you should display
 * the standard information such as pricing and billing details in your custom
 * template or they will not be visible to the end user.
 *
 * @param array $params common module parameters
 *
 * @see http://docs.whmcs.com/Provisioning_Module_SDK_Parameters
 *
 * @return array
 */
function ssg_provisioner_ClientArea(array $params)
{
    // Determine the requested action and set service call parameters based on
    // the action.
    $requestedAction = isset($_REQUEST['customAction']) ? $_REQUEST['customAction'] : '';

    if ($requestedAction == 'manage') {
        $serviceAction = 'get_usage';
        $templateFile = 'templates/manage.tpl';
    } else {
        $serviceAction = 'get_stats';
        $templateFile = 'templates/overview.tpl';
    }

    try {
        // Call the service's function based on the request action, using the
        // values provided by WHMCS in `$params`.
        $response = array();

        $extraVariable1 = 'abc';
        $extraVariable2 = '123';

        return array(
            'tabOverviewReplacementTemplate' => $templateFile,
            'templateVariables' => array(
                'extraVariable1' => $extraVariable1,
                'extraVariable2' => $extraVariable2,
            ),
        );
    } catch (Exception $e) {
        // Record the error in WHMCS's module log.
        logModuleCall(
            'ssg_provisioner',
            __FUNCTION__,
            $params,
            $e->getMessage(),
            $e->getTraceAsString()
        );

        // In an error condition, display an error page.
        return array(
            'tabOverviewReplacementTemplate' => 'error.tpl',
            'templateVariables' => array(
                'usefulErrorHelper' => $e->getMessage(),
            ),
        );
    }
}
