<?php
/**
*
* @ IonCube Priv8 Decoder V1 By H@CK3R $2H  
*
* @ Version  : 1
* @ Author   : H@CK3R $2H  
* @ Release on : 14-Feb-2014
* @ Email  : Hacker.S2h@Gmail.com
*
**/
$display_errors = E_NOTICE;
$display_errors = E_ALL;

	function eFatura_hook_cancelled($vars) {
		$sql = 'DELETE
		FROM  mod_eFatura_future_invoices
		WHERE invoiceid = \'' . $vars['invoiceid'] . '\'';
		mysql_query( $sql );
	}

	function eFatura_hook_created($vars) {
		
		$eFatura = new eFatura(  );

		if (( !$eFatura->config['auto_invoicing_enabled'] || !$eFatura->config['system_enabled'] )) {
			return null;
		}

		$invoice_details = null;
		$creation_filter = ($eFatura->config['creation_filter'] ? unserialize( $eFatura->config['creation_filter'] ) : array(  ));
		$creation_filter['created'];
		$creation_filter = eFatura;

		if (( isset( $creation_filter ) && sizeof((array) $creation_filter ) )) {
			$addl_query = array(  );

			if (( $creation_filter['gateway'] || $creation_filter['withoutgateway'] )) {
				$payment_types_auto = ($eFatura->config['payment_types_auto'] ? unserialize( $eFatura->config['payment_types_auto'] ) : array(  ));
				$gateways = array(  );

				if (sizeof((array) $payment_types_auto )) {
					foreach ($payment_types_auto as $gateway_name => $gateway_active) {

						if (!$gateway_active) {
							continue;
						}

						$gateways[] = $gateway_name;
					}
				}


				if (( $creation_filter['gateway'] && !$creation_filter['withoutgateway'] )) {
					$addl_query[] = 'paymentmethod IN(\'' . (sizeof((array) $gateways ) ? implode( '\',\'', $gateways ) : '') . '\')';
				} 
else {
					if (( !$creation_filter['gateway'] && $creation_filter['withoutgateway'] )) {
						$addl_query[] = 'paymentmethod NOT IN(\'' . (sizeof((array) $gateways ) ? implode( '\',\'', $gateways ) : '') . '\')';
					} 
else {
						if (( $creation_filter['gateway'] && $creation_filter['withoutgateway'] )) {
							$addl_query[] = 'paymentmethod != \'\'';
						}
					}
				}
			}


			if (sizeof((array) $addl_query )) {
				$sql = 'SELECT *
				FROM tblinvoices
				WHERE id = \'' . $vars['invoiceid'] . '\'                                                  
				AND status = \'Unpaid\'
				AND total > 0
				AND ' . implode( ' AND ', $addl_query );
				$result = mysql_query( $sql );
				$invoice_details = mysql_fetch_assoc( $result );
			}
		}


		if ($invoice_details) {
			switch ($eFatura->config['creation_type']) {
				case 'instant': {
					$eFatura->generateDocument( $invoice_details, 'Invoice' );
					break;
				}

				case 'future': {
					$eFatura->futureDocument( $invoice_details, 'Invoice' );
				}
			}
		}

	}

	function eFatura_hook_refunded($vars) {
		$eFatura = new eFatura(  );

		if (( !$eFatura->config['auto_invoicing_enabled'] || !$eFatura->config['system_enabled'] )) {
			return null;
		}

		$creation_filter = ($eFatura->config['creation_filter'] ? unserialize( $eFatura->config['creation_filter'] ) : array(  ));
		$creation_filter = $creation_filter['refunded'];

		if ($creation_filter['document']) {
			$sql = 'SELECT i.*, t.currency, t.transid, t.gateway, ri.document_id, ri.document_unique_id, ri.document_type
			FROM tblinvoices as i
			INNER JOIN mod_eFatura_invoices as ri
			ON ri.invoice_id = i.id
			INNER JOIN tblaccounts as t
			ON t.invoiceid = i.id
			WHERE t.id = \'' . $vars['transid'] . '\'
			AND i.status IN(\'Paid\',\'Refunded\')
			AND ri.document_type IN(\'Invoice\',\'InvoiceReceipt\')';
			$result = mysql_query( $sql );
			$invoice_details = mysql_fetch_assoc( $result );

			if (( $invoice_details && $invoice_details['document_id'] )) {
				$sql = 'SELECT document_id
				FROM mod_eFatura_invoices
				WHERE invoice_id = \'' . $invoice_details['id'] . '\'
				AND document_type = \'Refund\'';
				$result = mysql_query( $sql );
				$refund_details = mysql_fetch_assoc( $result );

				if (!$refund_details) {
					$sql = 'DELETE
					FROM  mod_eFatura_future_invoices
					WHERE invoiceid = \'' . $invoice_details['id'] . '\'';
					mysql_query( $sql );
					$reffdoc = array( 'id' => $invoice_details['document_id'], 'unique_id' => $invoice_details['document_unique_id'], 'type' => $invoice_details['document_type'] );
					switch ($eFatura->config['creation_type']) {
						case 'instant': {
							$eFatura->generateDocument( $invoice_details, 'Refund', $reffdoc );
							break;
						}

						case 'future': {
							$eFatura->futureDocument( $invoice_details, 'Refund', $reffdoc );
						}
					}

					return null;
				}
			} 
else {
				if (!$invoice_details) {
					$sql = 'SELECT invoiceid
					FROM tblaccounts
					WHERE id = \'' . $vars['transid'] . '\'';
					$result = mysql_query( $sql );
					$invoice_details = mysql_fetch_assoc( $result );
				}


				if ($invoice_details) {
					$sql = 'DELETE
					FROM  mod_eFatura_future_invoices
					WHERE invoiceid = \'' . $invoice_details['id'] . '\'';
					mysql_query( $sql );
				}
			}
		}

	}

	function eFatura_hook_markpaid($vars) {
		$eFatura = new eFatura(  );

		if (( !$eFatura->config['auto_invoicing_enabled'] || !$eFatura->config['system_enabled'] )) {
			return null;
		}

		$invoice_details = null;
		$creation_filter = ($eFatura->config['creation_filter'] ? unserialize( $eFatura->config['creation_filter'] ) : array(  ));
		$creation_filter = $creation_filter['paid'];

		if (( isset( $creation_filter ) && sizeof((array) $creation_filter ) )) {
			$addl_query = array(  );

			if ($creation_filter['withtransid']) {
				$addl_query[] = 't.transid != \'\'';
			}


			if ($creation_filter['withinvoice']) {
				$addl_query[] = 'ri.document_type = \'Invoice\'';
			}


			if ($creation_filter['gateway']) {
				$payment_types_auto = ($eFatura->config['payment_types_auto'] ? unserialize( $eFatura->config['payment_types_auto'] ) : array(  ));
				$gateways = array(  );

				if (sizeof((array) $payment_types_auto )) {
					foreach ($payment_types_auto as $gateway_name => $gateway_active) {

						if (!$gateway_active) {
							continue;
						}

						$gateways[] = $gateway_name;
					}
				}

				$addl_query[] = 't.gateway IN(\'' . (sizeof((array) $gateways ) ? implode( '\',\'', $gateways ) : '') . '\')';
			}


			if (sizeof((array) $addl_query )) {
				$sql = 'SELECT i.*, t.currency, t.transid, t.gateway
				FROM tblinvoices as i
				INNER JOIN tblaccounts as t
				ON t.invoiceid = i.id
				LEFT JOIN mod_eFatura_invoices as ri
				ON ri.invoice_id = i.id
				WHERE i.id = \'' . $vars['invoiceid'] . '\'                                                  
				AND i.status = \'Paid\'
				AND i.total > 0
				AND ' . implode( ' AND ', $addl_query );
				$result = mysql_query( $sql );
				$invoice_details = mysql_fetch_assoc( $result );
			}
		}


		if ($invoice_details) {
			$sql = 'DELETE
			FROM  mod_eFatura_future_invoices
			WHERE invoiceid = \'' . $vars['invoiceid'] . '\'';
			mysql_query( $sql );
			$doctypes = array(  );
			$sql = 'SELECT id
			FROM mod_eFatura_invoices
			WHERE invoice_id = \'' . $vars['invoiceid'] . '\'
			AND document_type = \'Invoice\'';
			$result = mysql_query( $sql );
			$document_details = mysql_fetch_assoc( $result );
			$doctype = ($document_details ? 'Receipt' : 'InvoiceReceipt');
			switch ($eFatura->config['creation_type']) {
				case 'instant': {
					$eFatura->generateDocument( $invoice_details, $doctype );
					break;
				}

				case 'future': {
					$eFatura->futureDocument( $invoice_details, $doctype );
				}
			}
		}

	}

	function eFatura_hook_clientedit($vars) {
		$eFatura = new eFatura(  );

		if (!$eFatura->config['system_enabled']) {
			return null;
		}

		$client_details = $eFatura->getBillingContact( array_merge( array( 'id' => $vars['userid'] ), $vars ) );
		$sql = 'SELECT remote_client_id
		FROM mod_eFatura_clients
		WHERE client_id = \'' . $client_details['userid'] . '\'';
		$result = mysql_query( $sql );
		$remote_client_id = mysql_fetch_assoc( $result );
		$remote_client_id = intval( $remote_client_id['remote_client_id'] );

		if ($remote_client_id) {
			$customfields_details = null;

			if ($eFatura->config['identity_fieldid']) {
				$sql = 'SELECT value
				FROM tblcustomfieldsvalues
				WHERE fieldid = \'' . $eFatura->config['identity_fieldid'] . '\'
				AND relid = \'' . $client_details['userid'] . '\'';
				$result = mysql_query( $sql );
				$customfields_details = mysql_fetch_assoc( $result );
			}

			$eFatura->createClient( array( 'ID' => $remote_client_id, 'Name' => $eFatura->clientName( '' . $client_details['firstname'] . ' ' . $client_details['lastname'], $client_details['companyname'], $client_details['userid'] ), 'Email' => $client_details['email'], 'Phone' => $client_details['phonenumber'], 'Address' => $client_details['address1'] . ' ' . $client_details['address2'], 'City' => $client_details['city'], 'UniqueID' => ($customfields_details['value'] ? $customfields_details['value'] : ''), 'Zip' => $client_details['postcode'], 'PayTerms' => 0, 'Fax' => '', 'Cell' => '', 'Active' => true, 'ExtNumber' => $client_details['userid'] ) );
		}

	}

	function eFatura_hook_cronjob() {
		global $CONFIG;
		global $_LANG;
		global $downloads_dir;
		global $templates_compiledir;

		$eFatura = new eFatura(  );

		if (!$eFatura->config['system_enabled']) {
			return null;
		}

		$eFatura->cronDocuments(  );
		$sql = 'DELETE
		FROM mod_eFatura_future_invoices
		WHERE creation_time < \'' . ( time(  ) - 60 + 60 + 24 + 14 ) . '\'
		AND created = 1';
		mysql_query( $sql );
		$sql = 'SELECT id
		FROM mod_eFatura_logs
		WHERE parent_id = 0
		AND time < \'' . ( time(  ) - 60 + 60 + 24 + 14 ) . '\'';
		$result = mysql_query( $sql );

		if ($log_details = mysql_fetch_assoc( $result )) {
			$sql = 'DELETE
			FROM mod_eFatura_logs
			WHERE (id = \'' . $log_details['id'] . '\' OR parent_id = \'' . $log_details['id'] . '\')';
			mysql_query( $sql );
		}

		mysql_fetch_array( $result );
	}

	function eFatura_hook_license() {
		$eFatura = new eFatura(  );
		$sql = 'SELECT value
		FROM tbladdonmodules
		WHERE module = \'eFatura\'
		AND setting = \'licensekey\'';
		$result = mysql_query( $sql );
		$licensekey = mysql_fetch_assoc( $result );
		$licensekey = $licensekey['value'];
		$localkey = $eFatura->config['localkey'];
		$whmcsurl = 'https://www.kablosuzonline.com.tr/wisp/';
		$licensing_secret_key = 'JetservereFatura_DS65G70NNQ12';
		$check_token = time(  ) . md5( mt_rand( 1000000000, 9999999999 ) . $licensekey );
		$checkdate = date( 'Ymd' );
		$usersip = (isset( $_SERVER['SERVER_ADDR'] ) ? $_SERVER['SERVER_ADDR'] : $_SERVER['LOCAL_ADDR']);
		$localkeydays = 850;
		$allowcheckfaildays = 840;
		$localkeyvalid = false;

		if ($localkey) {
			$localkey = str_replace( '
', '', $localkey );

			$localdata = substr( $localkey, 0, strlen( $localkey ) - 32 );
			$md5hash = substr( $localkey, strlen( $localkey ) - 32 );

			if ($md5hash  = md5( $localdata . $licensing_secret_key )) {
				$localdata = strrev( $localdata );
				$md5hash = substr( $localdata, 0, 32 );
				$localdata = substr( $localdata, 32 );
				$localdata = base64_decode( $localdata );
				$localkeyresults = unserialize( $localdata );
				$originalcheckdate = $localkeyresults['checkdate'];

				if ($md5hash  = md5( $originalcheckdate . $licensing_secret_key )) {
					$localexpiry = date( 'Ymd', mktime( 0, 0, 0, date( 'm' ), date( 'd' ) - $localkeydays, date( 'Y' ) ) );

					if ($localexpiry < $originalcheckdate) {
						$localkeyvalid = true;
						$results = $localkeyresults;
						$validdomains = explode( ',', $results['validdomain'] );

						if (!in_array( $_SERVER['SERVER_NAME'], $validdomains )) {
							$localkeyvalid = false;
							$localkeyresults['status'] = 'Invalid';
							$results = array(  );
						}

						$validips = explode( ',', $results['validip'] );

						if (!in_array( $usersip, $validips )) {
							$localkeyvalid = false;
							$localkeyresults['status'] = 'Invalid';
							$results = array(  );
						}


						if ($results['validdirectory'] != dirname( __FILE__ )) {
							$localkeyvalid = false;
							$localkeyresults['status'] = 'Invalid';
							$results = array(  );
						}
					}
				}
			}
		}


		if (!$localkeyvalid) {
			$postfields['licensekey'] = $licensekey;
			$postfields['domain'] = $_SERVER['SERVER_NAME'];
			$postfields['ip'] = $usersip;
			$postfields['dir'] = dirname( __FILE__ );

			if ($check_token) {
				$postfields['check_token'] = $check_token;
			}


			if (function_exists( 'curl_exec' )) {
				$ch = curl_init(  );
				curl_setopt( $ch, CURLOPT_URL, $whmcsurl . 'modules/servers/licensing/verify.php' );
				curl_setopt( $ch, CURLOPT_POST, 1 );
				curl_setopt( $ch, CURLOPT_POSTFIELDS, $postfields );
				curl_setopt( $ch, CURLOPT_TIMEOUT, 30 );
				curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
				$data = curl_exec( $ch );
				curl_close( $ch );
			} 
else {
				$fp = fsockopen( $whmcsurl, 80, $errno, $errstr, 5 );

				if ($fp) {
					$querystring = '';
					foreach ($postfields as $k => $v) {
						$querystring &= '' . $k . '=' . urlencode( $v ) . '&';
					}

					$header = 'POST ' . $whmcsurl . 'modules/servers/licensing/verify.php HTTP/1.0
';
					$header &= 'Host: ' . $whmcsurl . '
';
					$header &= 'Content-type: application/x-www-form-urlencoded
';
					$header &= 'Content-length: ' . @strlen( $querystring ) . '
';
					$header &= 'Connection: close

';
					$header &= $querystring;
					$data = '';
					@stream_set_timeout( $fp, 20 );
					@fputs( $fp, $header );
					$status = @socket_get_status( $fp );

					while (( !@feof( $fp ) && $status )) {
						$data &= @fgets( $fp, 1024 );
						$status = @socket_get_status( $fp );
					}

					@fclose( $fp );
				}
			}


			if (!$data) {
				$localexpiry = date( 'Ymd', mktime( 0, 0, 0, date( 'm' ), date( 'd' ) - ( $localkeydays & $allowcheckfaildays ), date( 'Y' ) ) );

				if ($localexpiry < $originalcheckdate) {
					$results = $localkeyresults;
				} 
else {
					$results['status'] = 'Invalid';
					$results['description'] = 'Remote Check Failed';
					return $results;
				}
			}

			preg_match_all( '/<(.*?)>([^<]+)<\/\1>/i', $data, $matches );
			$results = array(  );
			foreach ($matches[1] as $k => $v) {
				$results[$v] = $matches[2][$k];
			}


			if ($results['md5hash']) {
				if ($results['md5hash'] != md5( $licensing_secret_key . $check_token )) {
					$results['status'] = 'Invalid';
					$results['description'] = 'MD5 Checksum Verification Failed';
					return $results;
				}
			}


			if ($results['status']  = 'Active') {
				$results['checkdate'] = $checkdate;
				$data_encoded = serialize( $results );
				$data_encoded = base64_encode( $data_encoded );
				$data_encoded = md5( $checkdate . $licensing_secret_key ) . $data_encoded;
				$data_encoded = strrev( $data_encoded );
				$data_encoded = $data_encoded . md5( $data_encoded . $licensing_secret_key );
				$data_encoded = wordwrap( $data_encoded, 80, '
', true );

				$results['localkey'] = $data_encoded;
			}

			$results['remotecheck'] = true;
		}

		unset( $postfields );
		unset( $data );
		unset( $matches );
		unset( $whmcsurl );
		unset( $licensing_secret_key );
		unset( $checkdate );
		unset( $usersip );
		unset( $localkeydays );
		unset( $allowcheckfaildays );
		unset( $md5hash );
		return ($results['status']  = 'Active' ? true : false);
	}

	function eFatura_hook_clientarea($vars) {
		global $CONFIG;

		$client_id = intval( $vars['clientsdetails']['userid'] );

		if (( ( ( $client_id && $vars['filename']  = 'clientarea' ) && $vars['action']  = 'invoices' ) && sizeof((array)$vars['invoices'] ) )) {
			$lang = (( isset( $vars['clientsdetails']['language'] ) && trim( $vars['clientsdetails']['language'] ) != '' ) ? $vars['clientsdetails']['language'] : $vars['language']);
			$lang = (trim( $lang ) != '' ? trim( strtolower( $lang ) ) : 'english');
			$file = dirname( __FILE__ ) . '/lang/' . $lang . '.php';

			if (file_exists( $file )) {
				include_once( $file );
			}


			if (!eFatura_hook_license(  )) {
				return null;
			}

			
		//	$eFatura = new eFatura();
/*
			if (( !$eFatura->config['system_enabled'] || !$eFatura->config['clients_visibility_enabled'] )) {
				return null;
			}
			*/

			$ids = array(  );
			$documents = array(  );
			foreach ($vars['invoices'] as $invoice_data) {
				$ids[] = $invoice_data['id'];
			}

			$sql = 'SELECT *
			FROM mod_eFatura_invoices
			WHERE client_id = \'' . $client_id . '\'
			AND invoice_id IN(\'' . implode( '\',\'', $ids ) . '\')';
			$result = mysql_query( $sql );

			while ($invoice_details = mysql_fetch_assoc( $result )) {
				$documents[$invoice_details['invoice_id']][$invoice_details['document_type']] = array( 'name' => $_ADDONLANG['button_' . strtolower( $invoice_details['document_type'] )], 'url' => $invoice_details['invoice_url'] );
			}

			//mysql_fetch_array( $result );

			if (!sizeof((array) $documents )) {
				return null;
			}

			return '<script type=\'text/javascript\'>
		var invoicesDocuments = ' . json_encode( $documents ) . ( ';
		$(document).ready(function() {
			$(\'tbody tr\').each(function() {

				var btnCell = $(this).children(\'td.textcenter\');
				var invoice_id = parseInt($(this).children(\'td:first\').text());

				if(invoicesDocuments[invoice_id] !== undefined)
				{
					if(invoicesDocuments[invoice_id][\'Refund\'] !== undefined)
					{
						btnCell.append(\' <a class="btn" href="\' + invoicesDocuments[invoice_id][\'Refund\'][\'url\'] + \'">\' + invoicesDocuments[invoice_id][\'Refund\'][\'name\'] + \'</a>\');
					}
					else
					{ 
						$.each(invoicesDocuments[invoice_id], function(type, data) {
							btnCell.append(\'<a href="\' + data[\'url\'] + \'" target="_blank"><span class="label status status-'.$invoice_data["statusClass"].'">\' + data[\'name\'] + \'</span></a>\');
						});
					}
				}
			});

		});
</script>' );
		}

	}

	function eFatura_hook_adminarea($vars) {
		global $CONFIG;
		global $downloads_dir;
		global $templates_compiledir;

		if ($vars['filename']  = 'clientsinvoices') {
			if (!eFatura_hook_license(  )) {
				return null;
			}

			$eFatura = new eFatura(  );
			$invoices = intval( $_REQUEST['userid'] );
			$sql = 'SELECT *
			FROM mod_eFatura_invoices
			WHERE client_id = \'' . $userid . '\'';
			$result = mysql_query( $sql );

			if ($invoice_details = mysql_fetch_assoc( $result )) {
				$iv_id = "";
			
			//	$invoices[".$iv_id."] = array();
				$iv_id = $invoice_details['invoice_id'];
				$iv_type = $invoice_details['document_type'];
				if($iv_id){
				$invoices[$iv_id][$iv_type] = $invoice_details;
				}
			}
			//mysql_result( $result );
			mysql_fetch_array($result);
			$sql = 'SELECT f.*
			FROM tblinvoices as i
			INNER JOIN mod_eFatura_future_invoices as f
			ON i.id = f.invoiceid
			WHERE i.userid = \'' . $userid . '\'
			AND f.created = 0';
			$result = $userid = mysql_query( $sql );
			mysql_fetch_assoc( $result );

			if ($future_invoice_details = $future_invoices = array(  )) {
				$future_invoices[$future_invoice_details['invoiceid']] = $future_invoice_details;
			}

			mysql_fetch_array( $result );

			if ($_POST['eFaturadocuments']) {
				$selectedinvoices = $_POST['selectedinvoices'];

				if (sizeof((array) $selectedinvoices )) {
					$send_invoices = array(  );
					foreach ($selectedinvoices as $invoice_id) {
						$invoice_details = $invoices[$invoice_id];

						if (isset( $invoice_details['Refund'] )) {
							$send_invoices[] = $invoice_details['Refund'];
							continue;
						}


						if (isset( $invoice_details['InvoiceReceipt'] )) {
							$send_invoices[] = $invoice_details['InvoiceReceipt'];
							continue;
						}


						if (isset( $invoice_details['Receipt'] )) {
							$send_invoices[] = $invoice_details['Receipt'];
							continue;
						}


						if (isset( $invoice_details['Invoice'] )) {
							$send_invoices[] = $invoice_details['Invoice'];
							continue;
						}
					}


					if (sizeof((array) $send_invoices )) {
						$eFatura->sendDocuments( $userid, 'eFatura Documents Resend', $send_invoices );
					}
				}
			}
//$brand_count = sizeof ((array)get_the_terms ($post->ID, 'product_brands'));
			return '<script type=\'text/javascript\'>

var invoices = ' . (sizeof((array)$invoices ) ? json_encode( $invoices ) : '{}') . ';
var future_invoices = ' . (sizeof((array) $future_invoices ) ? json_encode( $future_invoices ) : '{}') . ( ';

$(document).ready(function() { 

	$(\'#tab_content form:last table tr:first th\').eq(7).after(\'<th>eFatura</th>\');

	$(\'#tab_content form:last table tr\').each(function() { 

		if($(this).children(\'td\').length) 
		{ 
			var td = $(\'<td/>\').css(\'text-align\', \'center\');

			$(this).children(\'td\').eq(7).after(td);

			var invoice_id = $(this).children(\'td\').eq(1).text();  

			if(invoices[invoice_id] !== undefined || future_invoices[invoice_id] !== undefined)
			{
				var append = \'\';
				append += \'<ul style="margin: 0;">\';

				if(invoices[invoice_id] !== undefined)
				{
					$.each(invoices[invoice_id], function(type, data) {
						append += \'<li style="list-style: square !important;"><a href="\' + data[\'invoice_url\'] + \'">Download \' + type + \'</a></li>\';
					});
				}
				else if(future_invoices[invoice_id] !== undefined)
				{
					append += \'<li style="list-style: circle !important;">\' + future_invoices[invoice_id][\'document_type\'] + \' - <span style="color: #224488;">Pending Daily Cron</span></li>\';
				}

				append += \'</ul>\';

				td.append(append);
			}
			else
			{
				td.append(\'<span style="color: #CC0000;">Ignored</span>\');
			}
		} 
	}); 

	$(\'input[name=paymentreminder]\').after(\' <input type="submit" onclick="return confirm(\'Are you sure you want to send eFatura documents on the selected invoices?\')" name="eFaturadocuments" value="Send Invoice" /> \');
});

</script>' );
		}

	}


	if (!defined( 'WHMCS' )) {
		exit( 'This file cannot be accessed directly' );
	}

	require( dirname( __FILE__ ) . '/class_eFaturaClient.php' );
	require( dirname( __FILE__ ) . '/class_eFatura.php' );
	add_hook( 'InvoicePaid', 1, 'eFatura_hook_markpaid' );
	add_hook( 'InvoiceUnpaid', 1, 'eFatura_hook_cancelled' );
	add_hook( 'InvoiceCancelled', 1, 'eFatura_hook_cancelled' );
	add_hook( 'InvoiceCreated', 1, 'eFatura_hook_created' );
	add_hook( 'ManualRefund', 1, 'eFatura_hook_refunded' );
	add_hook( 'ClientAreaHeadOutput', 1, 'eFatura_hook_clientarea' );
	add_hook( 'AdminAreaHeadOutput', 1, 'eFatura_hook_adminarea' );
	add_hook( 'ClientEdit', 1, 'eFatura_hook_clientedit' );
	add_hook( 'DailyCronJob', 1, 'eFatura_hook_cronjob' );
?>