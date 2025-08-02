<?php
/**

*
**/

	class eFatura {
	    public $log_parent = 0;
    public $config = array( );
    public $document_types = array( 'Invoice' => 1, 'Receipt' => 2, 'InvoiceReceipt' => 3, 'Refund' => 4 );
    public $client_name_formats = array( "%1\$s", "%2\$s", "(%1\$s) %2\$s", "%1\$s (%2\$s)", "%1\$s - %2\$s", "(%2\$s) %1\$s", "%2\$s (%1\$s)", "%2\$s - %1\$s" );
    public $eFaturaClient = null;
		function eFatura() {
			$this->getConfig(  );
		}

		function addLog($message, $reset = false) {
			$sql = 'INSERT INTO mod_eFatura_logs (`parent_id`,`message`,`time`) VALUES
			(\'' . $this->log_parent . '\',\'' . mysql_real_escape_string( $message ) . '\',\'' . time(  ) . '\')';
			mysql_query( $sql );
			$logid = mysql_insert_id(  );

			if (( !$this->log_parent || $reset )) {
				$this->log_parent = $logid;
			}

			return $logid;
		}

		function getConfig() {
			//global $CONFIG;
			//$config = array(  );
			$sql = 'SELECT *
			FROM mod_eFatura_config';
			$result = mysql_query( $sql );
			
			while($config_details = mysql_fetch_assoc($result)) {
				$this->config[$config_details['name']] = $config_details['value'];
			}
		$eFatura['config'] = $this->config;
			return $eFatura['config'];
		//logModuleCall('eFatura','',$config_details['name'] , $config_details);
		//	return $this->config;
		}

		function setConfig($key, $value) {
			if (!isset( $this->config )) {
				$this->getConfig(  );
			}


			if (isset( $this->config[$key] )) {
				$sql = 'UPDATE mod_eFatura_config
				SET value = \'' . mysql_real_escape_string( $value ) . '\'
				WHERE name = \'' . mysql_real_escape_string( $key ) . '\'';
				mysql_query( $sql );
			} 
else {
				$sql = 'INSERT INTO mod_eFatura_config (`name`,`value`) VALUES
				(\'' . mysql_real_escape_string( $key ) . '\', \'' . mysql_real_escape_string( $value ) . '\')';
				mysql_query( $sql );
			}

			$this->config[$key] = $value;
		}

		function getBillingContact($details) {
			if (intval( $details['billingcid'] )) {
				$sql = 'SELECT *
				FROM tblcontacts
				WHERE id = \'' . intval( $details['billingcid'] ) . ( '\'
				AND userid = \'' . $details['id'] . '\'' );
				$result = mysql_query( $sql );
				$contact_details = mysql_fetch_assoc($result);

				if ($contact_details) {
					$details = array_merge( $contact_details, array( 'id' => $contact_details['userid'] ) );
				}
			}

			return $details;
		}

		function cronDocuments($selected = array(  )) {
			$sql = 'SELECT *
			FROM mod_eFatura_future_invoices
			WHERE created = 0
			' . ($selected ? 'AND invoiceid IN(\'' . implode( '\',\'', $selected ) . '\')' : '');
			$result = mysql_query( $sql );
		//	$future_invoice_details = array();
			//$future_invoice_details = mysql_fetch_array($result);
		//	logModuleCall('eFatura',"TEST33",$result,"",  "",$replacevars);  
			while ($future_invoice_details = mysql_fetch_assoc($result) ) {
				$sql = 'SELECT id
				FROM tblinvoices
				WHERE id = \'' . $future_invoice_details['invoiceid'] . '\'';
				$result2 = mysql_query( $sql );
				$ok = false;
			logModuleCall('eFatura',$action, $future_invoice_details,'test',$i,$replacevars);
				if ($locinvoice_details = mysql_fetch_assoc( $result2 )) {
					$invoice_details = ($future_invoice_details['invoice_details'] ? unserialize( $future_invoice_details['invoice_details'] ) : array(  ));
					$docuemnt_data = ($future_invoice_details['document_data'] ? unserialize( $future_invoice_details['document_data'] ) : array(  ));

					if ($this->generateDocument( $invoice_details, $future_invoice_details['document_type'], $docuemnt_data )) {
						$sql = 'UPDATE mod_eFatura_future_invoices
						SET creation_time = \'' . time(  ) . ( '\', created = 1
						WHERE id = \'' . $future_invoice_details['id'] . '\'' );
						mysql_query( $sql );
						$ok = true;
					}
				} 	else {
					$ok = false;
					$sql = 'DELETE
					FROM mod_eFatura_future_invoices
					WHERE id = \'' . $future_invoice_details['id'] . '\'';
					mysql_query( $sql );
				}

				sleep( 2 );
				++$i;
				//mysqli( $result2 );
			}

		//	mysqli_free_result($result);
			return $ok;
		}

		function futureDocument($details, $doctype, $e_tip, $reffdoc = array(  )) {
			$sql = 'INSERT INTO mod_eFatura_future_invoices (`invoiceid`,`document_type`,`tip`,`document_data`,`invoice_details`) VALUES
			(\'' . $details['id'] . '\',\'' . $doctype . '\',\'' . $e_tip . '\',\'' . serialize( $reffdoc ) . '\',\'' . serialize( $details ) . '\')';
			return mysql_query( $sql );
		}

		function createClient($params) {
			if (!$this->eFaturaClient) {
			 $this->eFaturaClient = new eFaturaClient( $this->config['username'], $this->config['password'] );
			}

			return $this->eFaturaClient->createClient( $params );
		}

		function clientName($full_name, $company_name, $client_id) {
			mb_internal_encoding( 'UTF-8' );
			mb_regex_encoding( 'UTF-8' );
			$client_number = ' | ' . $client_id;
			$format = $this->client_name_formats[$this->config['invoice_client_name']];

			if (( trim( $full_name ) && trim( $company_name ) )) {
				$client_name = sprintf( $format, trim( $full_name ), trim( $company_name ) );
			} 
else {
				$client_name = (trim( $full_name ) ? trim( $full_name ) : trim( $company_name ));
			}

			$client_name = htmlspecialchars_decode( $client_name );
			$client_name = mb_substr( $client_name, 0, 50 - mb_strlen( $client_number ) ) . $client_number;
			return $client_name;
		}
		
		function getFaturano(){
			$this->config = $this->getConfig();
			$faturano ='';
			$sql = 'SELECT *
			FROM mod_eFatura_invoices';
			$fat = mysql_query( $sql );
			$fatid =  mysql_num_rows($fat) + 1 + $this->config['invoice_start_n'];
		//	 mysqli_free_result( $fat );
			 
			$faturano = $this->config['pdf_prefix'].date("Y").str_pad($fatid, 9, "0", STR_PAD_LEFT);
			return $faturano ;
			
		}
		

		function generateDocument($details, $doctype, $reffdoc = array(  )) {
			//$this = $efatura;
			//global $CONFIG;
			$this->config = $this->getConfig();
			if (!$details) {
				//logModuleCall('eFatura',"TEST35",$eresult,"",  "",$replacevars);  
				return false;
			}
	
			$this->addLog( 'Generating ' . $doctype . ' Document ' . ($reffdoc['id'] ? 'for the ' . $reffdoc['type'] . ' Document number ' . $reffdoc['id'] . ' ' : '') . ( '(local invoice #' . $details['id'] . ') for the User ID ' . $details['userid'] ) );

			if (( !$this->config['username'] || !$this->config['password'] )) {
				logModuleCall('eFatura',"TEST27",$config,"",  "",$replacevars);  
				$this->addLog( 'eFatura API login details is not set. (username and/or password)', true );
				return false;
			}


			if (!$this->eFaturaClient) {
				 $this->eFaturaClient = new eFaturaClient( $this->config['username'], $this->config['password'] );
			}


			if ($this->eFaturaClient) {
				$this->addLog( 'Logged into eFatura API system' );
				$sql = 'SELECT remote_client_id
				FROM mod_eFatura_clients
				WHERE client_id = \'' . $details['userid'] . '\'';
				$result = mysql_query( $sql );
				$remote_client_id = mysql_fetch_assoc($result);
				$remote_client_id = $remote_client_id['remote_client_id'];
				$sql = 'SELECT *
				FROM tblclients
				WHERE id = \'' . $details['userid'] . '\'';
				$result = mysql_query( $sql );
				$client_details = $this->getBillingContact( mysql_fetch_assoc($result) );
					
				if (!$remote_client_id) {
					$this->addLog( 'Client not exists. creating new client' );

					if ($client_details) {
						$customfields_details = null;

						if ($this->config['identity_fieldid']) {
							$sql = 'SELECT value
							FROM tblcustomfieldsvalues
							WHERE fieldid = \'' . $this->config['identity_fieldid'] . '\'
							AND relid = \'' . $details['userid'] . '\'';
							$result = mysql_query( $sql );
							$customfields_details = mysql_fetch_assoc($result);
						}
						$customfields_vd = null;
						if ($this->config['identity_fieldname']) {
							$sql = 'SELECT value
							FROM tblcustomfieldsvalues
							WHERE fieldid = \'' . $this->config['identity_fieldname'] . '\'
							AND relid = \'' . $details['userid'] . '\'';
							$result = mysql_query( $sql );
							$customfields_vd = mysql_fetch_assoc($result);
						}

						$addl_request = array(  );
					//	$remote_client_id = $this->createClient( array_merge( $addl_request, array( 'Name' => $this->clientName( '' . $client_details['firstname'] . ' ' . $client_details['lastname'], $client_details['companyname'], $client_details['id'] ), 'UniqueID' => ($customfields_details['value'] ? $customfields_details['value'] : ''), 'Email' => $client_details['email'], 'PayTerms' => 0, 'Phone' => $client_details['phonenumber'], 'Fax' => '', 'Cell' => '', 'Active' => true, 'Address' => $client_details['address1'] . ' ' . $client_details['address2'], 'City' => $client_details['city'], 'Zip' => $client_details['postcode'] ) ) );
					$remote_client_id = $details['userid'];
					//$fieldid == $eFatura->config['identity_fieldid']
				//		$remote_client_id = $this->createClient($this->config['identity_fieldid']);
						//var_dump($remote_client_id);
						if ($remote_client_id) {
							$this->addLog( 'New client created: Client ID ' . $remote_client_id );
							$sql = 'INSERT INTO mod_eFatura_clients (`client_id`,`remote_client_id`) VALUES 
							(\'' . $details['userid'] . '\',\'' . $remote_client_id . '\')';

							if (!mysql_query( $sql )) {
								$remote_client_id = 0;
								$this->addLog( 'Can\'t insert the new client into the database. SQL Error: ' . mysql_error(  ) );
								logActivity( 'Can\'t create new client on eFatura system. SQL Error: ' . mysql_error(  ) );
							} 
else {
								$this->addLog( 'New client created (' . $remote_client_id . ') on eFatura system - <a href=\'clientssummary.php?userid=' . $details['userid'] . '\'>User ID ' . $details['userid'] . '</a>' );
								logActivity( 'New client created (' . $remote_client_id . ') on eFatura system - <a href=\'clientssummary.php?userid=' . $details['userid'] . '\'>User ID ' . $details['userid'] . '</a>' );
							}
						} 
else {
							$this->addLog( 'Can\'t create new client into eFatura API system' );

							if ($this->eFaturaClient->error) {
								foreach ($this->eFaturaClient->error as $error) {
									$this->addLog( 'eFatura API error: ' . $error );
								}
							}
						}
					} 
else {
						$this->addLog( 'Can\'t find the user in the WHMCS database (User ID #' . $details['userid'] . ')' );
					}
				} 
else {
					$this->addLog( 'Found the client on eFatura API system (Client ID #' . $remote_client_id . ')' );
					$this->addLog( 'Updating Client Details on eFatura API system' );

					if ($client_details) {
						$customfields_details = null;

						if ($this->config['identity_fieldid']) {
							$sql = 'SELECT value
							FROM tblcustomfieldsvalues
							WHERE fieldid = \'' . $this->config['identity_fieldid'] . '\'
							AND relid = \'' . $client_details['id'] . '\'';
							$result = mysql_query( $sql );
							$customfields_details = mysql_fetch_assoc($result);
						}
						$customfields_vd = null;
						if ($this->config['identity_fieldname']) {
							$sql = 'SELECT value
							FROM tblcustomfieldsvalues
							WHERE fieldid = \'' . $this->config['identity_fieldname'] . '\'
							AND relid = \'' . $details['userid'] . '\'';
							$result = mysql_query( $sql );
							$customfields_vd = mysql_fetch_assoc($result);
						}


						$this->createClient( array( 'ID' => $remote_client_id, 'Name' => $this->clientName( '' . $client_details['firstname'] . ' ' . $client_details['lastname'], $client_details['companyname'], $client_details['id'] ), 'UniqueID' => ($customfields_details['value'] ? $customfields_details['value'] : ''), 'Email' => $client_details['email'], 'PayTerms' => 0, 'Phone' => $client_details['phonenumber'], 'Fax' => '', 'Cell' => '', 'Active' => true, 'Address' => $client_details['address1'] . ' ' . $client_details['address2'], 'City' => $client_details['city'], 'Zip' => $client_details['postcode'], 'ExtNumber' => $remote_client_id ) );
					} 
else {
						$this->addLog( 'Can\'t find the user in the WHMCS database (User ID #' . $details['userid'] . ')' );
					}
				}

		
				if ($remote_client_id) {
					$items = array(  );
					$foreign = (( $details['total'] != $details['subtotal'] || $this->config['invoice_calculate_tax'] ) ? false : true);

					if (!$reffdoc) {
						$taxrate_data = 0;

						if (0 < floatval( $details['taxrate'] )) {
							$taxrate_data = floatval( $details['taxrate'] );
						} 
else {
							if ($this->config['invoice_calculate_tax']) {
								$sql = 'SELECT taxrate
							FROM tbltax
							ORDER BY id ASC';
								$result = mysql_query( $sql );
								$tax_details = mysql_fetch_assoc($result);
								$taxrate_data = ($tax_details['taxrate'] ? floatval( $tax_details['taxrate'] ) : 0);
								$taxname_data = ($tax_details['name'] ? $tax_details['name'] : 0);
							}
						}

						$sql = 'SELECT *
						FROM tblinvoiceitems
						WHERE invoiceid = \'' . $details['id'] . '\'';
						$result = mysql_query( $sql );

						while ($invoice_items = mysql_fetch_assoc($result)) {
							$item_name = ($this->config['invoice_remote_dates'] ? trim( preg_replace( '/\(([0-9\/\-\s]+)\)/', '', $invoice_items['description'] ) ) : trim( $invoice_items['description'] ));
							$price = floatval( $invoice_items['amount'] );

							if (( ( $this->config['invoice_calculate_tax'] && $taxrate_data ) && ( !$invoice_items['taxed'] || ( $invoice_items['taxed'] && $details['subtotal']  = $details['total'] ) ) )) {
								$invoice_items['taxed'] = 1;
								$taxrate = 1 & $taxrate_data / 100;

								if (( $price != 0 && $this->config['invoice_calculate_tax'] )) {
									$price = $price /$taxrate;
								}
							}

							$items[] = array( 'Code' => $invoice_items['id'], 'detaylar' => $details, 'Name' => $item_name, 'Quantity' => 1, 'Price' => $price, 'TaxPercentage' => ($invoice_items['taxed'] ? $taxrate_data : 0),'TaxPercentage1' => ($invoice_items['taxed'] ? $taxrate_data : 1), 'TaxName' => ($invoice_items['taxed'] ? $taxname_data : 0) );
						}

					//	mysqli_free_result($result);
					}
					
					
					
					$command = "GetClientsDetails";
					
						$values = array(
										'clientid' => $details['userid'],
										'stats' => true,
									);
									
									
				$results = eFaturaWHMCS($command,$values);
				
							 if ($results['result'] != 'success') {
							$error[] = 'Fatura Kesilecek Müşteri Detayları Yok !';
						  //  echo 'An Error Occurred: ' . $results['message'];
						}
						
					

					$sql = 'SELECT code, rate
					FROM tblcurrencies
					WHERE id ='.$results['client']['currency'];
					$result = mysql_query( $sql );
					$currency_details = mysql_fetch_assoc($result);


					if (( ($reffdoc || ( !$reffdoc && $items ) ) &&  $currency_details['code'] )) {
						$addl_request = array(  );
						$comments = array(  );

						if ($reffdoc) {
							$this->addLog( 'Document ID: ' . $reffdoc['unique_id'] );
							$this->addLog( 'Document Type: ' . $reffdoc['type'] . ' (' . $this->document_types[$reffdoc['type']] . ')' );
							$addl_request['Invoices'][0]['ID'] = $reffdoc['unique_id'];
							$addl_request['Invoices'][0]['ReceiptAmount'] = $details['total'];
							$addl_request['DocumentReffType'] = $this->document_types[$reffdoc['type']];
							$addl_request['Total'] = $details['total'];
						} 
else {
							$payment_types = ($this->config['payment_types'] ? unserialize( $this->config['payment_types'] ) : array(  ));
							$addl_request['Items'] = $items;
							$addl_request['Payments'] = array(  );
							$count = 0;
							$sql = 'SELECT *
							FROM tblaccounts
							WHERE invoiceid = \'' . $details['id'] . '\'';
							$result = mysql_query( $sql );

							 while ($transaction_details = mysql_fetch_assoc($result)) {
								$payment_type = (isset( $payment_types[$transaction_details['gateway']] ) ? intval( $payment_types[$transaction_details['gateway']] ) : 4);
								$addl_request['Payments'][$count] = array( 'Amount' => $transaction_details['amountin'], 'PaymentType' => $payment_type, 'Date' => date( 'Y-m-d\TH:i:s', strtotime( $transaction_details['date'] ) ) );

								if ($payment_type  = 1) {
									$addl_request['Payments'][$count]['PaymentNumber'] = '0000';
								}

								++$count;

								if ($transaction_details['transid']) {
									$comments[] = ucfirst( $transaction_details['gateway'] ) . ( ' Transaction ID: ' . $transaction_details['transid'] );
								}
							}

						//	mysqli_free_result($result);

							if (!$addl_request['Payments']) {
								$payment_type = (isset( $payment_types[$details['paymentmethod']] ) ? intval( $payment_types[$details['paymentmethod']] ) : 4);
								$addl_request['Payments'][0]['Amount'] = $details['total'];
								$addl_request['Payments'][0]['PaymentType'] = $payment_type;
								$addl_request['Payments'][0]['Date'] = date( 'Y-m-d\TH:i:s' );

								if ($payment_type  = 1) {
									$addl_request['Payments'][0]['PaymentNumber'] = '0000';
								}
							}
						}

						$sql = 'SELECT branch_id
						FROM mod_eFatura_branches
						WHERE country = \'' . $client_details['country'] . '\'';
						$result = mysql_query( $sql );
						$branch_details = mysql_fetch_assoc($result);

						if (( intval( $branch_details['branch_id'] ) || intval( $this->config['branch'] ) )) {
							$addl_request['BranchID'] = (intval( $branch_details['branch_id'] ) ? intval( $branch_details['branch_id'] ) : intval( $this->config['branch'] ));
						}

						$duedate = ($details['duedate'] ? strtotime( $details['duedate'] ) : 0);

						if (( $doctype  == 'Invoice' && $duedate )) {
							$addl_request['PaymentDueDate'] = date( 'Y-m-d\TH:i:s', $duedate );
							$this->addLog( 'Document Due Date: ' . $addl_request['PaymentDueDate'] );
						}


						if ($foreign) {
							$comments[] = 'Foreign Invoice No VAT';
						}


						if ($this->config['invoice_comments']) {
							$comments[] = $this->config['invoice_comments'];
						}
						$fatura= '';
						$fatura = $this->getFaturano();
						
						//array( 'Name' => $this->clientName( '' . $client_details['firstname'] . ' ' . $client_details['lastname'], $client_details['companyname'], $client_details['id'] ), 'UniqueID' => ($customfields_details['value'] ? $customfields_details['value'] : ''), 'Email' => $client_details['email'], 'PayTerms' => 0, 'Phone' => $client_details['phonenumber'], 'Fax' => '', 'Cell' => '', 'Active' => true, 'Address' => $client_details['address1'] . ' ' . $client_details['address2'], 'City' => $client_details['city'], 'Zip' => $client_details['postcode'] )
						$invoice_data = $this->eFaturaClient->createDocument( array_merge( $addl_request, array( 'ClientID' => $remote_client_id,'invoice_id' => $details['id'] ,
						'Subject' => $this->config['invoice_subject'],'Prefix' => $this->config['pdf_prefix'] , 'DocumentType' => $this->document_types[$doctype], 
						'Currency' => $currency_details['code'], 
						'CurrencyRate' => $currency_details['rate'], 'ExternalComments' => ( $comments ? implode( ' | ', $comments ) : ''), 
						'Language' => $this->invoiceLanguage( $client_details ),
						'UniqueID' => ($customfields_details['value'] ? $customfields_details['value'] : ''), 
						'UniqueVD' => ($customfields_vd['value'] ? $customfields_vd['value'] : ''),
						'FaturaNo' => $fatura,
						'ClientDetails' => $client_details, 
						'config' => $this->config, 
						'Discount' => array( 'Value' => $details['credit'], 'IsNominal' => true, 'BeforeTax' => false ) ) ) );
						//var_dump($invoice_data);
						if ($invoice_data) {
							
							$invoice_details = array( 'client_id' => $details['userid'], 'invoice_id' => $details['id'], 'document_id' => $invoice_data['id'], 'document_unique_id' => $invoice_data['unique_id'], 'document_type' => $doctype, 'invoice_url' => $invoice_data['url'], 'time' => time(  ) );
						/*	$sql = 'INSERT INTO mod_eFatura_invoices (`' . implode( '`,`', array_keys( $invoice_details ) ) . '`) VALUES 
							(\'' . implode( '\',\'', $invoice_details ) . '\')';
								$queryr = mysql_query( $sql );
								*/
								
							$insert = insert_query("mod_eFatura_invoices", $invoice_details);
						//		var_dump($insert);
								
							if (!$insert) {
								$this->addLog( 'Can\'t insert document URL into the database. SQL Error: ' . mysql_error(  ) );
								logActivity( 'Can\'t insert document URL into the database. SQL Error: ' . mysql_error(  ) );
							} 
else {
								
								//$documentfunct =  = $this->document_types[$doctype];
								$logid = mysql_insert_id(  );
							//	mysqli_free_result($queryr);
							$queryr = select_query( 'mod_eFatura_invoices', '', array( 'id' => $logid) );		
								$kayit = mysql_fetch_assoc($queryr);
							//	$results = $this->sendDocuments( $details['userid'], 'eFatura ' . $doctype . ' Confirmation', array( $invoice_details ), $client_details, $invoice_data, $this->config);
								$results = true;//$this->sendDocuments2($kayit, 'eFatura Documents Resend', $this->config);
						//			$sonuc = $efatura->sendDocuments2($faturavar, 'eFatura Documents Resend', $eFatura->config);
						if($results){
						
							if ($this->config['auto_sms']) {

							$smssonuc = $this->sendSMS('e-Fatura Bilgilendirme', array($logid), $this->config); 
							if (!$smssonuc){
								logActivity( 'SMS Failed - (User ID: ' . $details['userid'] . ' - Invoice ID: ' . $invoice_details['invoice_id'] . ')' , 'none' );
										}else{logActivity( 'SMS Succesfuly - (User ID: ' . $userid . ' - Invoice ID: ' . $invoice_details['invoice_id'] . ')' , 'none' );
												}
										
							}
								
								//var_dump($doctype);
								
								$this->addLog( 'E-Mail sent successfully: eFatura ' . $doctype . ' Confirmation' );
								$this->addLog( 'New ' . $doctype . ' Document created on eFatura system - <a href=\'clientssummary.php?userid=' . $details['userid'] . '\'>User ID ' . $details['userid'] . '</a> - <a href=\'' . $invoice_data['url'] . '\'>Download Document</a>', true );
								logActivity( 'New ' . $doctype . ' Document created on eFatura system - <a href=\'clientssummary.php?userid=' . $details['userid'] . '\'>User ID ' . $details['userid'] . '</a> - <a href=\'' . $invoice_data['url'] . '\'>Download Document</a>' );
								return true;
								
						}else{
							
							return false;
						}
								
								
							}
							// update_query("tblinvoices", array("invoicenum"=>$fatura), array("id"=>$details['id']));
						}

						$this->addLog( 'Can\'t create new ' . $doctype . ' Document into eFatura API system' );

						if ($this->eFaturaClient->error) {
							foreach ($this->eFaturaClient->error as $error) {
								$this->addLog( 'eFatura API error: ' . $error );
							}
						}
					} 
else {
						if (!$items) {
							$this->addLog( 'No invoice items was found' );
						}


						if (!$currency_details['code']) {
							$this->addLog( 'No valid currency was found' );
						}


						if (!$payment_type) {
							$this->addLog( 'No valid payment type was found' );
						}
					}
				}
			} 
else {
				$this->addLog( 'Can\'t login into eFatura API system' );

				if ($this->eFaturaClient->error) {
					foreach ($this->eFaturaClient->error as $error) {
						$this->addLog( 'eFatura API error: ' . $error );
					}
				}
			}

			$this->log_parent = 0;
			return false;
		}

		function invoiceLanguage($client_details, $force = '') {
			$languages = array( 'hebrew' => 1, 'english' => 2 );

			if (( $force && in_array( $force, array_keys( $languages ) ) )) {
				return $languages[$force];
			}

			$sql = 'SELECT value
			FROM tblconfiguration
			WHERE setting = \'Language\'';
			$result = mysql_query( $sql );
			$language_details = mysql_fetch_assoc($result);
			$language_ary = array( 'user' => strtolower( trim( $client_details['language'] ) ), 'default' => strtolower( trim( $language_details['value'] ) ), 'override' => strtolower( trim( $this->config['override_language'] ) ) );
			$language = $language_ary[$this->config['invoice_language']];

			if (( isset( $language ) && in_array( $language, array_keys( $languages ) ) )) {
				$language = $languages[$language];
			} 
else {
				foreach ($language_ary as $language_type => $language_name) {

					if (in_array( $language_name, array_keys( $languages ) )) {
						$language = $languages[$language_name];
						break;
					}
				}
			}

			return $language;
		}

		function changeUsername($new_username, $old_username, $table) {
			$table_prefix = 'mod_eFatura_';
			$hostory_prefix = 'history_';
			$history_table = '' . $table_prefix . $hostory_prefix . $table;
			$table = '' . $table_prefix . $table;
			$sql = 'DELETE 
			FROM ' . $history_table . '
			WHERE username = \'' . $old_username . '\'';
			mysql_query( $sql );
			$new_data = array(  );
			mysql_query( $sql );
			$result = $new_keys = '';
			mysql_fetch_assoc($result);

			if ($new_details = $sql = 'SELECT *	FROM ' . $table) {
				
				$i=0;
			foreach($new_details as $new_detail){
			//	$new_detail[$i] = $new_detail[$i][0];
				
				
			//	unset( $new_detail[$i]);
				

				if (!$new_keys) {
					$new_keys = '(`username`,`' . implode( '`,`', array_keys( $new_detail[$i] ) ) . '`)';
				}

				$new_data[] = '(\'' . $old_username . '\',\'' . implode( '\',\'', $new_detail[$i] ) . '\')';
				$i++;
				}
				
			}

		//	mysqli_free_result($result);

			if ($new_data) {
				$sql = 'INSERT INTO ' . $history_table . ' ' . $new_keys . ' VALUES 
' . implode( ',
', $new_data );
				mysql_query( $sql );
			}

			$sql = 'TRUNCATE ' . $table;
			mysql_query( $sql );
			$old_data = array(  );
			$old_keys = '';
			$result = mysql_query( $sql );
			mysql_fetch_assoc($result);

			if ($old_details = $sql = 'SELECT *
			FROM ' . $history_table . '
			WHERE username = \'' . $new_username . '\'') {
				
				$i=0;
			foreach($old_details as $old_detail){
			//	unset( $old_detail[$i][id] );
				//unset($old_detail[$i][username] );

				if (!$old_keys) {
					$old_keys = '(`' . implode( '`,`', array_keys( $old_detail[$i] ) ) . '`)';
				}

				$old_data[] = '(\'' . implode( '\',\'', $old_detail[$i] ) . '\')';
			$i++;
			
			}
			}

			//mysqli_free_result($result);

			if ( $old_data ) {
				$sql = 'INSERT INTO ' . $table . ' ' . $old_keys . ' VALUES 
' . implode( ',
', $old_data );
				mysql_query( $sql );
				$sql = 'DELETE 
				FROM ' . $history_table . '
				WHERE username = \'' . $new_username . '\'';
				mysql_query( $sql );
			}

		}
		
		// FATURA MAIL GONDER
		
			function sendInvoice($userid, $func_messagename, $invoices, $client_details, $invoice_data) {
			global $CONFIG;
			global $_LANG;
			global $downloads_dir;
			global $templates_compiledir;
			$downloads_dir = "/var/www/vhosts/turkhost.net.tr/turkhost_stroge/email_attachment/";
				$adminuser = 'yonet'; 
						/*		
								$command = "getclientsdetails";
								$values["clientid"] =  $details['userid'];
								$values["stats"] = true;
								$clientdetails = localAPI($command,$values,$adminuser);
						*///		
						$values["responsetype"] = "xml";
								
					// FATURA BILGILERINI Al
							
								$invoice_details = $invoices;
								 $command = "getinvoice";
								$values["invoiceid"] = $invoice_details['invoice_id'];
								$invoicedetails = localAPI($command,$values,$adminuser);
								
								
								 $command = "sendemail";
								
								$values["customtype"] = "general";
								$values["customsubject"] = "e-Arsiv Fatura Bilgilendirme";
								$values["custommessage"] = "
								<p>
								<div style='clear: both; width: 100%; margin: 20px 0;'>Sayın İlgili;<br /><br />
<p>Sayın ".$client_details["firstname"] . " ".$client_details["lastname"].";</p>
<p>This is a reminder that your 'SSL Certificate' will going to Renew in {$reminder_days} days. Below is the order details...</p>
<p>Domain Name: {$domain}<br />Product Code: {$productcode}<br />User Email: {$useremail}<br />Billing Cycle: {$billingcycle}<br />Payment Method: {$paymentmethod}</p>
<p>Thank you for using our services!</p>
<br /><br /> ".$CONFIG["CompanyName"]." firması tarafından ".$invoicedetails["date"]." tarihinde <strong>".$invoice_details["document_unique_id"]."</strong> numaralı earşiv faturası tarafınıza gönderilmiştir. Fatura içerisine eklenmiş dokuman var ise ekte bulabilirsiniz. <br /><span class='im'><br /> Faturayı görüntülemek için <a href='$invoice_data[url]' target='_blank'>tıklayınız </a>. <br /> <br /> Bilgilerinize.  <br /><br />{$signature}<br /> </span></div>
<div style='clear: both; width: 800px; font-size: 11px; float: left;'>
<p><strong> **Bu ileti sistem tarafından otomatik olarak gönderilmektedir. Lütfen bu maile cevap göndermeyiniz. <span style='color: #cc0000;'> İzmar Bilişim </span> üzerinden iletişim kurabilirsiniz. </strong></p>
</div>
								
								</p>";
								$values["customvars"] = array("custommerge"=>'12', "custommerge2"=>'13');
							//	$values["clientid"] = $details['userid'];
							//	$values["pid"] = $details['id'];
							//$values["id"] = $invoice_details['invoice_id'];
								$values["id"] = $client_details["id"];
							//	$attachmentfilename = ($this->config['pdf_prefix'] ? $this->config['pdf_prefix'] . '_' : '') . $invoice_details['document_type'] . '_' . $invoice_details['document_id'] . '.pdf';
								//$attachmentdata = file_get_contents( $invoice_data[url] );
								//$attach[0] = array($attachmentfilename, $attachmentdata);
								//$values["attachments"] = $attach;
								
								//$results = localAPI($command, $values, $adminuser);
			return $results;
			
			
			}
			function soapcall($wsdl, $service, $params) {
			$contextOptions = array(
			'ssl' => array(
			'verify_peer' => false,
			'verify_peer_name' => false,
			'allow_self_signed' => true
			));

			$sslContext = stream_context_create($contextOptions);
			$soapparams =  array(
			'trace' => 1,
			'exceptions' => true,
			'cache_wsdl' => WSDL_CACHE_NONE,
			'connection_timeout' => 30,
			'stream_context' => $sslContext
			); 
			$client = new SoapClient($wsdl, $soapparams );
			$response = $client->$service($params);
			$service = '' . $service . 'Result';
			return $response->$service;
			
		}
	
		function sendDocuments($userid, $func_messagename, $invoices, $client_details, $invoice_data, $params) {
			global $CONFIG;
			global $_LANG;
			global $downloads_dir;
			global $templates_compiledir;
			$downloads_dir = "/var/www/vhosts/turkhost.net.tr/turkhost_stroge/email_attachment/";
				/*
				if($func_messagename == 'efatura InvoiceReceipt Confirmation'){
					
					$func_messagename == 'efatura Invoice Confirmation'
				
				*/
			$func_messagename = trim($func_messagename);
		//	var_dump($func_messagename);
			$nosavemaillog = false;
			$sysurl = ($CONFIG['SystemSSLURL'] ? $CONFIG['SystemSSLURL'] : $CONFIG['SystemURL']);
			$sql = 'SELECT *
			FROM tblemailtemplates
			WHERE name = \'' . $func_messagename . '\'
			AND language = \'turkish\'';
			$result = mysql_query( $sql );
			$template_details = mysql_fetch_assoc($result);
			$type = $template_details['type'];
			
			$message = $template_details['message'];
			$tplattachments = $template_details['attachments'];
			$fromname = $template_details['fromname'];
			$fromemail = $template_details['fromemail'];
			$disabled = $template_details['disabled'];
			$copyto = $template_details['copyto'];
			$plaintext = $template_details['plaintext'];
			$emailtplid = $template_details['id'];
			$emailglobalheader = html_entity_decode( $CONFIG['EmailGlobalHeader'] );
			$emailglobalfooter = html_entity_decode( $CONFIG['EmailGlobalFooter'] );

			if ($emailglobalheader) {
				$message = $emailglobalheader . '
' . $message;
			}


			if ($emailglobalfooter) {
				$message = $message . '
' . $emailglobalfooter;
			}

			$sql = 'SELECT firstname, lastname, email, companyname
			FROM tblclients
			WHERE id = \'' . $userid . '\'';
			$result = mysql_query( $sql );
			$client_details = mysql_fetch_assoc($result);
			$lastname = $firstname = $client_details['firstname'];
			$email = $client_details['email'];
			if (!$fromname) {
				$fromname = $CONFIG['CompanyName'];
			}


			if (!$fromemail) {
				$fromemail = $CONFIG['Email'];
			}


			if (!class_exists( 'Smarty' )) {
				require( ROOTDIR . '/vendor/smarty/smarty/libs/Smarty.class.php' );
			}
			

			$smarty = new Smarty(  );
			$smarty->caching = 0;
			$smarty->compile_dir = $templates_compiledir;
			$smarty->compile_id = md5( $subject . $message );
			//$smarty->register_resource( 'emailtpl', array( 'emailtpl_template', 'emailtpl_timestamp', 'emailtpl_secure', 'emailtpl_trusted' ) );
			$smarty->registerResource("emailtpl", array("emailtpl_template", "emailtpl_timestamp", "emailtpl_secure", "emailtpl_trusted"));
			$smarty->assign( 'emailsubject', $subject );
			$smarty->assign( 'emailmessage', $message );
			$email_merge_fields = array(  );
			$email_merge_fields['client_name'] = $firstname . ' ' . $lastname;
			$email_merge_fields['company_name'] = $CONFIG['CompanyName'];
			$email_merge_fields['company_domain'] = $CONFIG['Domain'];
			$email_merge_fields['company_logo_url'] = $CONFIG['LogoURL'];
			$email_merge_fields['whmcs_url'] = $CONFIG['SystemURL'];
			$email_merge_fields['whmcs_link'] = '<a href="' . $CONFIG['SystemURL'] . '">' . $CONFIG['SystemURL'] . '</a>';
			$email_merge_fields['signature'] = nl2br( html_entity_decode( $CONFIG['Signature'] ) );
			$email_merge_fields['date'] = date( 'l, jS F Y' );
			$email_merge_fields['time'] = date( 'g:ia' );

			if (1 <  $invoices ) {
				foreach ($invoices as $invoice_details) {
					$attachmentfilename = $invoice_details['document_id'] . '.pdf';
					$attachmentdata = $invoice_data['fatura_belgesi']; // file_get_contents( $invoice_data['url'] );
				}
			} 
else {
				//include_once( ROOTDIR . '/host/includes/invoicefunctions.php' );
				include($_SERVER['DOCUMENT_ROOT'].'includes/invoicefunctions.php');
			//	include("../../../includes/invoicefunctions.php");
				$invoice_details = $invoices[0];
				$invoice = new WHMCS\Invoice( $invoice_details['invoice_id'] );
				
				$valid = $invoice->getData(  );

				if (!$valid) {
					return false;
				}

				$whmcs_invoice_details = $invoice->getOutput(  );
				$invoicedescription = '';
				$invoiceitems = $invoice->getLineItems(  );
				foreach ($invoiceitems as $item) {
					$invoicedescription &= $item['description'] . ' ' . $item['amount'] . '<br>
';
				}

				$invoicedescription &= '------------------------------------------------------<br>
';
				$invoicedescription &= $_LANG['invoicessubtotal'] . ': ' . $data['subtotal'] . '<br>
';

				if (0 < $whmcs_invoice_details['taxrate']) {
					$invoicedescription &= $whmcs_invoice_details['taxrate'] . '% ' . $whmcs_invoice_details['taxname'] . ': ' . $whmcs_invoice_details['tax'] . '<br>
';
				}


				if (0 < $whmcs_invoice_details['taxrate2']) {
					$invoicedescription &= $whmcs_invoice_details['taxrate2'] . '% ' . $whmcs_invoice_details['taxname2'] . ': ' . $whmcs_invoice_details['tax2'] . '<br>
';
				}
				
				if($whmcs_invoice_details['status']=="Paid"){
					$subject = 'e-Fatura Bilgilendirme -  '.$whmcs_invoice_details['date'].' Tarihli Ödenmiş Faturanız';
				}else{
					$subject = 'e-Fatura Bilgilendirme - Son Ödeme Tarihi: '.$whmcs_invoice_details['duedate'];
				}
				//$subject = 'e-Fatura Bilgilendirme - Son Ödeme Tarihi: '.$whmcs_invoice_details['duedate'];
				$email_merge_fields['invoice_id'] = $whmcs_invoice_details['invoiceid'];
				$email_merge_fields['invoice_num'] = $whmcs_invoice_details['invoicenum'];
				$email_merge_fields['invoice_date_created'] = $whmcs_invoice_details['date'];
				$email_merge_fields['invoice_date_due'] = $whmcs_invoice_details['duedate'];
				$email_merge_fields['invoice_date_paid'] = $whmcs_invoice_details['datepaid'];
				$email_merge_fields['invoice_items'] = $invoiceitems;
				$email_merge_fields['invoice_html_contents'] = $invoicedescription;
				$email_merge_fields['invoice_subtotal'] = $whmcs_invoice_details['subtotal'];
				$email_merge_fields['invoice_credit'] = $whmcs_invoice_details['credit'];
				$email_merge_fields['invoice_tax'] = $whmcs_invoice_details['tax'];
				$email_merge_fields['invoice_tax_rate'] = $whmcs_invoice_details['taxrate'] . '%';
				$email_merge_fields['invoice_tax2'] = $whmcs_invoice_details['tax2'];
				$email_merge_fields['invoice_tax_rate2'] = $whmcs_invoice_details['taxrate2'] . '%';
				$email_merge_fields['invoice_total'] = $whmcs_invoice_details['total'];
				$email_merge_fields['invoice_amount_paid'] = $whmcs_invoice_details['amountpaid'];
				$email_merge_fields['invoice_balance'] = $whmcs_invoice_details['balance'];
				$email_merge_fields['invoice_status'] = $whmcs_invoice_details['statuslocale'];
				$email_merge_fields['invoice_last_payment_amount'] = $whmcs_invoice_details['lastpaymentamount'];
				$email_merge_fields['invoice_last_payment_transid'] = $whmcs_invoice_details['lastpaymenttransid'];
				$email_merge_fields['invoice_payment_link'] = $paymentbutton;
				$email_merge_fields['invoice_payment_method'] = $whmcs_invoice_details['paymentmethod'];
				$email_merge_fields['invoice_link'] = '<a href="' . $sysurl . '/viewinvoice.php?id=' . $whmcs_invoice_details['id'] . '">' . $sysurl . '/viewinvoice.php?id=' . $whmcs_invoice_details['id'] . '</a>';
				$email_merge_fields['invoice_notes'] = $whmcs_invoice_details['notes'];
				$email_merge_fields['invoice_subscription_id'] = $whmcs_invoice_details['subscrid'];
				$email_merge_fields['invoice_previous_balance'] = $whmcs_invoice_details['clientpreviousbalance'];
				$email_merge_fields['invoice_all_due_total'] = $whmcs_invoice_details['clienttotaldue'];
				$email_merge_fields['invoice_total_balance_due'] = $whmcs_invoice_details['clientbalancedue'];
				
				
				//PDF AL
							$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['username'], 'Sifre'=> $params['password']),
										'FaturaETTN' => $invoice_details['document_id']
										));
				$sql = 'SELECT *
			FROM mod_eFatura_future_invoices
			WHERE invoiceid='.$invoice_details['invoice_id'];
			$result = mysql_query( $sql );
		//	$future_invoice_details = array();
			//$future_invoice_details = mysql_fetch_array( $result );
			
			$future_invoice_details = mysql_fetch_assoc( $result );
			
		if($future_invoice_details['tip']==2){
						
				
				$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['username'], 'Sifre'=> $params['password']),
										'ETTN' => $invoice_details['document_id'],
										'Gelen' => false,
										'Giden' => true
										
										));
					
					 $soapurl = 'https://efatura.edoksis.net/FaturaService.asmx?WSDL';
						if($params['config']['system_demo']){
					$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
						}
						
					$sonuc[] = $this->soapcall($soapurl, 'FaturaPDFGoruntule', $girdi);
					$attachmentdata = $sonuc[0]->Pdf;
					while(filesize($path) > 1 )
						{
						sleep(1);
						$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
						$attachmentdata = $sonuc[0]->Pdf;
						}
				
		}else{
			
			 $soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
			if($params['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/EarchiveService.asmx?WSDL';	
			
			}
			
			$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
			$attachmentdata = $sonuc[0]->Pdf;
			while(filesize($path) > 1 )
				{
				sleep(1);
				$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
				$attachmentdata = $sonuc[0]->Pdf;
				}
				
			
					
			}	 
				//$result[] = $this->soapcall( 'earchiveservice.asmx?WSDL', 'EarsivFaturaGonder', $girdi);
				

				//	$attachmentdata  = file_get_contents($pdfurl);
				//	$attachmentdata = $this->curl($pdfurl);
				//	var_dump($attachmentdata);
					//echo print_r($attachmentdata);
					
				$attachmentfilename = $invoice_details['document_id'].'.pdf'; 
				$path = $_SERVER['DOCUMENT_ROOT'].'/'.$attachmentfilename;
					
				//$dosya = fopen($path ,"a");
				fwrite($dosya,$attachmentdata);
				fclose($dosya);
					//$result2 = file_put_contents($path, $attachmentdata);
					
				
				
				
				
				
			}

			/*
			foreach ($email_merge_fields as $key => $value) {
				$smarty->assign( $key, $value );
			}
			*/
			foreach ($email_merge_fields as $mergefield => $mergevalue) {
			$smarty->assign($mergefield, $mergevalue);
				}
			
		//	$subject = $smarty->fetch("emailtpl:emailsubject");
		//	$message = $smarty->fetch("emailtpl:emailmessage");
		//	$subject = $smarty->fetch( 'emailtpl:emailsubject' );
			
		//	$smarty->fetch( 'emailtpl:emailmessage' );
		//	$message = $client_details['lastname'];

			if (( !trim( $subject ) && !trim( $message ) )) {
				logActivity( 'EMAILERROR: Email Message Empty so Aborting Sending - Template Name ' . $func_messagename );
				return false;
			}

			$mail = new PHPMailer( true );
			 try
			{
			$mail->From = $fromemail;
			$mail->FromName = str_replace( '&amp;', '&', $fromname );
			switch ($CONFIG['MailType']) {
				case 'mail': {
					$mail->Mailer = 'mail';
					break;
				}

				case 'smtp': {
					$mail->IsSMTP(  );
					$mail->Host = $CONFIG['SMTPHost'];
					$mail->Port = $CONFIG['SMTPPort'];
					$mail->Hostname = $_SERVER['SERVER_NAME'];

					if ($CONFIG['SMTPSSL']) {
						$mail->SMTPSecure = $CONFIG['SMTPSSL'];
					}


					if ($CONFIG['SMTPUsername']) {
						$mail->SMTPAuth = true;
						$mail->Username = $CONFIG['SMTPUsername'];
						$mail->Password = decrypt( $CONFIG['SMTPPassword'] );
					}

					$mail->Sender = $mail->From;

					if ($fromemail != $CONFIG['SMTPUsername']) {
						$mail->AddReplyTo( $fromemail, $fromname );
					}
				}
			}

			$mail->XMailer = $CONFIG['CompanyName'];
			$mail->CharSet = $CONFIG['Charset'];
			$mail->AddAddress( trim( $email ), $firstname . ' ' . $lastname );

			if ($CONFIG['BCCMessages']) {
				$bcc = $CONFIG['BCCMessages'] . ',';
				$bcc = end(explode( ',', $bcc ));
				foreach ($bcc as $value) {
					$ccaddress = trim( $value );

					if ($ccaddress) {
						$mail->AddBCC( $ccaddress );
						continue;
					}
				}
			}

			$additionalccs = '';
			$result = select_query( 'tblcontacts', '', array( 'userid' => $userid, $type . 'emails' => '1' ) );

			while ($data = mysql_fetch_array($result)) {
				$ccaddress = trim( $data['email'] );
				$mail->AddAddress( $ccaddress, $data['firstname'] . ' ' . $data['lastname'] );
				$additionalccs &= $ccaddress . ',';
			}


			if ($copyto) {
				$copytoarray = end(explode( ',', $copyto ));
					if ($CONFIG['MailType']  = 'mail') {
					foreach ($copytoarray as $copytoemail) {
						$mail->AddBCC( trim( $copytoemail ) );
					}
				} 
else {
					foreach ($copytoarray as $copytoemail) {
						$mail->AddCC( trim( $copytoemail ) );
					}
				}
			}


			if ($additionalccs) {
				if ($copyto) {
					$copyto &= ',';
				}

				$copyto = substr( $additionalccs, 0, 0 - 1 );
			}

			$mail->Subject = $subject;

			if ($plaintext) {
				$message = str_replace( '<br>', '', $message );
				$message = str_replace( '<br />', '', $message );
				$message = strip_tags( $message );
				$mail->Body = html_entity_decode( $message );
				$message = nl2br( $message );
			} 
else {
				$message_text = str_replace( '<p>', '', $message );
				$message_text = str_replace( '</p>', '', $message_text );
				
				$message_text = str_replace( '<br>', '', $message_text );

				$message_text = str_replace( '<br />', '', $message_text );

				$message_text = strip_tags( $message_text );
				$cssdata = '';

				if ($CONFIG['EmailCSS']) {
					$cssdata = '<style>
' . $CONFIG['EmailCSS'] . '
</style>';
				}

				$message = $cssdata . '
' . $message;

	
include( dirname( __FILE__ ) . '/email.php' );

$values["custommessage"] = sendmail_message($CONFIG, $whmcs_invoice_details, $invoice_details, $client_details,$invoice_data);

								$mail->Body = $values["custommessage"]; // html_entity_decode( $message );
				$mail->AltBody = $message_text;
			}


			if ($tplattachments) {
				$tplattachments = end(explode( ',', $tplattachments ));
				foreach ($tplattachments as $attachment) {
					$filename = $downloads_dir . $attachment;
					$displayname = substr( $attachment, 7 );
					$mail->AddAttachment( $filename, $displayname );
				}
			}


			if ($attachmentfilename) {
				if (is_array( $attachmentfilename )) {
					foreach ($attachmentfilename as $count => $filelist) {
						$mail->AddStringAttachment( $attachmentdata[$count], $filelist );
					}
				} 
else {
					$mail->AddStringAttachment( $attachmentdata, $attachmentfilename );
				}
			}

			$mail->Send(  );
			$sonuc = true;
			if (( $userid && !$nosavemaillog )) {
				$sql = 'INSERT INTO tblemails (`userid`,`subject`,`message`,`date`,`to`,`cc`,`bcc`) VALUES
					(\'' . $userid . '\', \'' . $subject . '\', \'' . $message . '\', now(), \'' . $email . '\', \'' . $copyto . '\', \'' . $CONFIG['BCCMessages'] . '\')';
				mysql_query( $sql );
			}

			logActivity( 'Email Sent to ' . $firstname . ' ' . $lastname . ' (' . $subject . ')' );
			//$mail->ClearAddresses(  );
			}
			
			 catch ( phpmailerException $e ){
				logActivity( 'Email Sending Failed - ' . $e->getMessage(  ) . ( ' (User ID: ' . $userid . ' - Subject: ' . $subject . ')' ), 'none' );
				 $sonuc = false;
				}
				catch ( Exception $e )
				{
					logActivity( 'Email Sending Failed - ' . $e->getMessage(  ) . ( ' (User ID: ' . $userid . ' - Subject: ' . $subject . ')' ), 'none' );
				$sonuc = false;
				}
			return $sonuc;
		}
	
	function parcala_ve_al($bas, $son, $yazi)
			{
				@preg_match_all('/' . preg_quote($bas, '/') .
				'(.*?)'. preg_quote($son, '/').'/i', $yazi, $m);
				return @$m[1];
			}
	function curl($url)
			{
				$ch = curl_init();  
			 
				curl_setopt($ch,CURLOPT_URL,$url);
				curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
			//  curl_setopt($ch,CURLOPT_HEADER, false); 
			 
				$output=curl_exec($ch);
			 
				curl_close($ch);
				return $output;
			}
		
	function sendSMS($func_messagename, $selecteddocuments, $params){
			global $CONFIG;
			global $_LANG;
			global $downloads_dir;
			global $templates_compiledir;
			$key = 'AIzaSyAlL7SMd28Tlflv3Z6MJ_SosVvCK2IVfdY';
			$adminuser = $_SESSION['adminid'];
			
			include( dirname( __FILE__ ) . '/email.php' );
			//require_once('Googl.class.php' );
			//$googer = new GoogleURLAPI($key);
			 foreach ($selecteddocuments as $documentid) {
				  $sonuc = true;
			
						$sql = 'SELECT *
									FROM mod_eFatura_invoices
									WHERE id ='.$documentid;
						$result = mysql_query( $sql );

									
			 $invoice_details = mysql_fetch_assoc($result); 	
			 $userid = $invoice_details['client_id'];
			
			$command = 'GetInvoice';
				$postData = array(
					'invoiceid' => $invoice_details['invoice_id'],
				);
				
				$invo = localAPI($command, $postData);
			//	print_r($results);
			$command = "getclientsdetails";
			 $values["clientid"] = $userid;
			$results = localAPI($command,$values,$adminuser);
			 if ($results['result'] != 'success') {
				  $sonuc = false;
			  //  echo 'An Error Occurred: ' . $results['message'];
			}
			
			
			$smsclass = new TurkhostSms();
			$smsclass->setGsmnumber($results["customfields"][1]["value"]);
			
			
//			var_dump($results["customfields"][1]["value"]);
			

			$lurl = $invoice_details['invoice_url'];
			
			require_once('shorturl.php' );
			//unset($googer);
			$shortDWName ="";
			$shortDWName = make_bitly_url($lurl,'o_7n3il3t6tk','R_3a952b05b4ec47edbc94e86458626bbd','json');
			// Shorten URL
			
			
				

				// Test: Shorten a URL
			//	$shortDWName = $googer->shorten($lurl);
			
			
			//var_dump($shortDWName);
			// Look up long URL document_id
			//$url2 = $googl->expand('http://goo.gl/fbsS');

			//unset($googer);
			$subject = sendsms_message($invoice_details, $invo, $shortDWName, $results);
            $smsclass->setMessage($subject);
            $smsclass->setUserid($userid);

           $result = $smsclass->send();
			
			if($result == false){
                echo $smsclass->getErrors();
				$sonuc = true;
            }else{
                echo $LANG['smssent'].' '.$gsmnumber;
            }

            if($_POST["debug"] == "ON"){
                $debug = 1;
            }
			 
			 }			

			return $sonuc;
		}
	// SEND EMAIL START

	
		function sendEmails($func_messagename, $invoice_id, $params) {
			global $CONFIG;
			global $_LANG;
			global $downloads_dir;
			global $templates_compiledir;
			$downloads_dir = "/var/www/vhosts/turkhost.net.tr/turkhost_stroge/email_attachment/";
			
		$command = 'GetInvoice';
		$postData = array(
			'invoiceid' => $invoice_id,
		);
		$adminUsername = 'yonet'; // Optional for WHMCS 7.2 and later
		
		$results = localAPI($command, $postData, $adminUsername);
			//var_dump($results["userid"]);
		$command = 'GetClientsDetails';
				$postData = array(
					'clientid' =>$results["userid"],
					'stats' => true,
				);
				$adminUsername = 'yonet'; // Optional for WHMCS 7.2 and later

				$results = localAPI($command, $postData, $adminUsername);	
		//var_dump($results[client][email]);
		
		
		$command = 'GetEmails';
			$postData = array(
				'clientid' => $results["userid"],
				
			);
			$adminUsername = 'yonet'; // Optional for WHMCS 7.2 and later

			$results = localAPI($command, $postData, $adminUsername);
			//var_dump($results[emails][email][0][id]);
		
		
		$command = 'SendEmail';
				$postData = array(
							'//example1' => 'example',
							'messagename' => 'Client Signup Email',
							'id' => '440',
							'userid' => '440',
							'//example2' => 'example',
							'customtype' => 'invoice',
							'customto' => 'webhosting@turkhost.net.tr',
							'customsubject' => 'eFatura Documents Resend',
							'custommessage' => '<p>Thank you for choosing us</p><p>Your custom is appreciated</p><p>{$custommerge}<br />{$custommerge2}</p>',
							'customvars' => base64_encode(serialize(array("custommerge"=>$populatedvar1, "custommerge2"=>$populatedvar2))),
						);
				$adminUsername = 'yonet'; // Optional for WHMCS 7.2 and later

			$results = localAPI($command, $postData, $adminUsername);
		var_dump($results);
			
		}
		
		
		
		function sendDocuments2($invoice_details, $func_messagename, $params) {
			global $CONFIG;
			global $_LANG;
			global $downloads_dir;
			global $templates_compiledir;
			$downloads_dir = "/var/www/vhosts/turkhost.net.tr/turkhost_stroge/email_attachment/";
				/*
				if($func_messagename == 'efatura InvoiceReceipt Confirmation'){
					
					$func_messagename == 'efatura Invoice Confirmation'
				
				*/
			$func_messagename = trim($func_messagename);
		//	
			$type = "general";
			

			
			
			$command = 'GetClientsDetails';
				$postData = array(
					'clientid' => $invoice_details["client_id"],
					'stats' => true,
				);
				$adminUsername = 'yonet'; // Optional for WHMCS 7.2 and later

				$client_details = localAPI($command, $postData, $adminUsername);
				$email = $client_details["client"]["email"];

	

				//include_once( ROOTDIR . '/host/includes/invoicefunctions.php' );
				include($_SERVER['DOCUMENT_ROOT'].'includes/invoicefunctions.php');
			//	include("../../../includes/invoicefunctions.php");
				//$invoice_details = $invoices[0];
				$invoice = new WHMCS\Invoice( $invoice_details['invoice_id'] );
				
				$valid = $invoice->getData(  );

				if (!$valid) {
					return false;
				}

				$whmcs_invoice_details = $invoice->getOutput(  );
		
				
				if($whmcs_invoice_details['status']=="Paid"){
					$subject = 'e-Fatura Bilgilendirme -  '.$whmcs_invoice_details['date'].' Tarihli Ödenmiş Faturanız';
				}else{
					$subject = 'e-Fatura Bilgilendirme - Son Ödeme Tarihi: '.$whmcs_invoice_details['duedate'];
				}
				//$subject = 'e-Fatura Bilgilendirme - Son Ödeme Tarihi: '.$whmcs_invoice_details['duedate'];
						
				
				//PDF AL
				$eFatura = new eFatura();
				$attachmentfilename = $invoice_details['document_id'].'.pdf';
				$path = $downloads_dir.$attachmentfilename;
				$mail_attachments = array();
				$dosya = fopen($path, "a");
				//$>config = getConfig();
				$params = $eFatura->getConfig();
				//$paramsgetConfig();
			//	logModuleCall('eFatura',"TEST77",$params,"",  "",$replacevars);  
		while(filesize($path) < 1){
				
			
			$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['username'], 'Sifre'=> $params['password']),
										'FaturaETTN' => $invoice_details['document_id']
										));
				$sql = 'SELECT *
			FROM mod_eFatura_future_invoices
			WHERE invoiceid='.$invoice_details['invoice_id'];
			$result = mysql_query( $sql );
		//	$future_invoice_details = array();
			//$future_invoice_details = mysql_fetch_array( $result );
			
			$future_invoice_details = mysql_fetch_assoc( $result );
			
			if($future_invoice_details['tip']==2){
				
				$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['username'], 'Sifre'=> $params['password']),
										'ETTN' => $invoice_details['document_id'],
										'Gelen' => false,
										'Giden' => true
										
										));
					
					 $soapurl = 'https://efatura.edoksis.net/FaturaService.asmx?WSDL';
						if($params['config']['system_demo']){
					$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
						}
						
				//	$sonuc[] = $this->soapcall($soapurl, 'FaturaPDFGoruntule', $girdi);
				//	$attachmentdata = $sonuc[0]->Pdf;
					while($attachmentdata == "")
						{
						
						$sonuc[] = $this->soapcall($soapurl, 'FaturaPDFGoruntule', $girdi);
						$attachmentdata = $sonuc[0]->Pdf;
						sleep(1);
						}	
				
				}else{
			
			 $soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
			if($params['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/EarchiveService.asmx?WSDL';	
			
			}
			
		
					
					$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
					
				//	var_dump($sonuc[0]);
					$attachmentdata = $sonuc[0]->Pdf;

					
			}
						if($sonuc[0]->Sonuc == '1'){
					fwrite($dosya,$attachmentdata);
					fclose($dosya);
					break;
					}else{
						
						sleep(2);
					}
				//$result[] = $this->soapcall( 'earchiveservice.asmx?WSDL', 'EarsivFaturaGonder', $girdi);
				

				//	$attachmentdata  = file_get_contents($pdfurl);
				//	$attachmentdata = $this->curl($pdfurl);
				//	var_dump($attachmentdata);
					//echo print_r($attachmentdata);
					
					
				//		if ($dosya){
						//	fwrite($dosya,$attachmentdata);
							//fclose($dosya);
					//	}
					//	fclose($dosya);
				
					
			//DOSYAYI SUNUCUYA KAYDET
					/*
			$dosya = fopen($path ,"a");
				fwrite($dosya,$attachmentdata);
				fclose($dosya);
				*/
				
					//$result2 = file_put_contents($path, $attachmentdata);
					
				
				
				}
				
				
			

			/*
			foreach ($email_merge_fields as $key => $value) {
				$smarty->assign( $key, $value );
			}
			*/
		
			
		//	$subject = $smarty->fetch("emailtpl:emailsubject");
		//	$message = $smarty->fetch("emailtpl:emailmessage");
		//	$subject = $smarty->fetch( 'emailtpl:emailsubject' );
			
		//	$smarty->fetch( 'emailtpl:emailmessage' );
		//	$message = $client_details['lastname'];

			if (( !trim( $subject ) && !trim( $message ) )) {
				logActivity( 'EMAILERROR: Email Message Empty so Aborting Sending - Template Name ' . $func_messagename );
				return false;
			}




			if ($plaintext) {
				$message = str_replace( '<br>', '', $message );
				$message = str_replace( '<br />', '', $message );
				$message = strip_tags( $message );
			//	$mail->Body = html_entity_decode( $message );
				$message = nl2br( $message );
			} 
else {
				$message_text = str_replace( '<p>', '', $message );
				$message_text = str_replace( '</p>', '', $message_text );
				
				$message_text = str_replace( '<br>', '', $message_text );

				$message_text = str_replace( '<br />', '', $message_text );

				$message_text = strip_tags( $message_text );
				$cssdata = '';

				if ($CONFIG['EmailCSS']) {
					$cssdata = '<style>
' . $CONFIG['EmailCSS'] . '
</style>';
				}

				$message = $cssdata . '
' . $message;

	
			include( dirname( __FILE__ ) . '/email.php' );
			
			
			$values["custommessage"] = sendmail_message($CONFIG, $whmcs_invoice_details, $invoice_details, $client_details,$invoice_data);

								$mail["Body"] = $values["custommessage"]; // html_entity_decode( $message );
				$mail["AltBody"] = $message_text;
			}





			//$mail->Send(  );
			/*
			delete_query("tblemailtemplates", array("name" => "Mass Mail Template"));
			$tmpid = insert_query("tblemailtemplates", array("type" => $type, "name" => "Mass Mail Template", "subject" => html_entity_decode($subject), "message" => html_entity_decode($values[custommessage]), "fromname" => "", "fromemail" => "", "copyto" => ""));
			*/			
						
		
							
				//delete_query("tblemailtemplates", array("name" => "eFatura Invoice Confirmation"));
				//$tmpid = insert_query("tblemailtemplates", array("type" => $type, "name" => "eFatura Invoice Confirmation", "subject" => html_entity_decode($subject), "message" => html_entity_decode($values[custommessage]), "attachments" => $attachmentfilename, "fromname" => "", "fromemail" => "", "copyto" => ""));
				$tmpid = update_query("tblemailtemplates", array("type" => $type, "name" => "eFatura Invoice Confirmation", "subject" => html_entity_decode($subject), "message" => html_entity_decode($values["custommessage"]), "attachments" => $attachmentfilename, "fromname" => "", "fromemail" => "", "copyto" => ""),array("name" => "eFatura Invoice Confirmation"));
					//	var_dump($tmpid);
			//include_once("../includes/functions.php")
			$arr  = array();
		//	$mail_attachments["path"] = $path;
		
		//$attachments[0] = $path;

			//var_dump($mail_attachments);
			$ss = sendMessage("eFatura Invoice Confirmation", $invoice_details["client_id"],$arr, true, $mail_attachments);	
			
			//$sonuc = true;
			if ($ss) {
				$sql = 'INSERT INTO tblemails (`userid`,`subject`,`message`,`date`,`to`,`cc`,`bcc`) VALUES
					(\'' . $invoice_details["client_id"] . '\', \'' . $subject . '\', \'' . $values["custommessage"] . '\', now(), \'' . $email . '\', \'' . $copyto . '\', \'' . $CONFIG['BCCMessages'] . '\')';
				mysql_query( $sql );
			}

			logActivity( 'Email Sent to ' . $firstname . ' ' . $lastname . ' (' . $subject . ')' );
			//$mail->ClearAddresses(  );
			return $ss;
		}
		
	
	function sendEmails3($func_messagename, $selecteddocuments, $params) {
			global $CONFIG;
			global $_LANG;
			global $downloads_dir;
			global $templates_compiledir;
				/*
				if($func_messagename == 'efatura InvoiceReceipt Confirmation'){
					
					$func_messagename == 'efatura Invoice Confirmation'
				
				*/
					    foreach ($selecteddocuments as $documentid) {
			
						$sql = 'SELECT *
									FROM mod_eFatura_invoices
									WHERE id ='.$documentid;
						$result = mysql_query( $sql );
						
								/*
								$sql = 'SELECT *
									FROM mod_eFatura_invoices
									 WHERE id IN(\'' . implode( '\',\'', $document ) . '\')';
									*/
									
									
									
								//	$document = mysql_fetch_array($result);
									/*
									while($document_details = mysql_fetch_array($result)) {
									$documents[$document_details['id']] = $document_details;
									
									}
									*/
									
							$invoice_details = mysql_fetch_assoc($result); 			
							
							$userid = $invoice_details['client_id'];
							$this->addLog( $userid , true );
			$func_messagename = 'eFatura Invoice Confirmation';
		//	var_dump($func_messagename);
			$nosavemaillog = false;
			$sysurl = ($CONFIG['SystemSSLURL'] ? $CONFIG['SystemSSLURL'] : $CONFIG['SystemURL']);
			$sql = 'SELECT *
			FROM tblemailtemplates
			WHERE name = \'' . $func_messagename . '\'
			AND language = \'turkish\'';
			$result = mysql_query( $sql );
			$template_details = mysql_fetch_assoc($result);
			$type = $template_details['type'];
			
			$message = $template_details['message'];
			$tplattachments = $template_details['attachments'];
			$fromname = $template_details['fromname'];
			$fromemail = $template_details['fromemail'];
			$disabled = $template_details['disabled'];
			$copyto = $template_details['copyto'];
			$plaintext = $template_details['plaintext'];
			$emailtplid = $template_details['id'];
			$emailglobalheader = html_entity_decode( $CONFIG['EmailGlobalHeader'] );
			$emailglobalfooter = html_entity_decode( $CONFIG['EmailGlobalFooter'] );

			if ($emailglobalheader) {
				$message = $emailglobalheader . '
' . $message;
			}


			if ($emailglobalfooter) {
				$message = $message . '
' . $emailglobalfooter;
			}

			$sql = 'SELECT firstname, lastname, email, companyname
			FROM tblclients
			WHERE id = \'' . $userid . '\'';
			$result = mysql_query( $sql );
			$client_details = mysql_fetch_assoc($result);
			$lastname = $firstname = $client_details['firstname'];
			$email = $client_details['email'];
				//mysqli_free_result($result);
			if (!$fromname) {
				$fromname = $CONFIG['CompanyName'];
			}


			if (!$fromemail) {
				$fromemail = $CONFIG['Email'];
			}


			if (!class_exists( 'Smarty' )) {
				require( ROOTDIR . '/vendor/smarty/smarty/libs/Smarty.class.php' );
			}
			

			$smarty = new Smarty(  );
			$smarty->caching = 0;
			$smarty->compile_dir = $templates_compiledir;
			$smarty->compile_id = md5( $subject . $message );
			//$smarty->register_resource( 'emailtpl', array( 'emailtpl_template', 'emailtpl_timestamp', 'emailtpl_secure', 'emailtpl_trusted' ) );
			$smarty->registerResource("emailtpl", array("emailtpl_template", "emailtpl_timestamp", "emailtpl_secure", "emailtpl_trusted"));
			$smarty->assign( 'emailsubject', $subject );
			$smarty->assign( 'emailmessage', $message );
			$email_merge_fields = array(  );
			$email_merge_fields['client_name'] = $firstname . ' ' . $lastname;
			$email_merge_fields['company_name'] = $CONFIG['CompanyName'];
			$email_merge_fields['company_domain'] = $CONFIG['Domain'];
			$email_merge_fields['company_logo_url'] = $CONFIG['LogoURL'];
			$email_merge_fields['whmcs_url'] = $CONFIG['SystemURL'];
			$email_merge_fields['whmcs_link'] = '<a href="' . $CONFIG['SystemURL'] . '">' . $CONFIG['SystemURL'] . '</a>';
			$email_merge_fields['signature'] = nl2br( html_entity_decode( $CONFIG['Signature'] ) );
			$email_merge_fields['date'] = date( 'l, jS F Y' );
			$email_merge_fields['time'] = date( 'g:ia' );

			if (1 < $document) {
			/*
				foreach ($invoices as $invoice_details) {
					$attachmentfilename = ($this->config['pdf_prefix'] ? $this->config['pdf_prefix'] . '_' : '') . $invoice_details['document_type'] . '_' . $invoice_details['document_id'] . '.pdf';
					$attachmentdata = $invoice_data['fatura_belgesi']; // file_get_contents( $invoice_data['url'] );
				}
			*/
		//	$attachmentfilename = ($this->config['pdf_prefix'] ? $this->config['pdf_prefix'] . '_' : '') . $invoice_details['document_type'] . '_' . $invoice_details['document_id'] . '.pdf';
			//$attachmentdata = $invoice_data['fatura_belgesi']; // file_get_contents( $invoice_data['url'] );
				}
 
else {
			//	include("../../../includes/invoicefunctions.php");
				include($_SERVER['DOCUMENT_ROOT'].'includes/invoicefunctions.php');
			//	include_once( ROOTDIR . '/host/includes/invoicefunctions.php' );
			//	$invoice_details = $invoices[0];
				$invoice = new WHMCS\Invoice( $invoice_details['invoice_id'] );
				$valid = $invoice->getData();

				if (!$valid) {
					return false;
				}

				$whmcs_invoice_details = $invoice->getOutput(  );
				$invoicedescription = '';
				$invoiceitems = $invoice->getLineItems(  );
				foreach ($invoiceitems as $item) {
					$invoicedescription &= $item['description'] . ' ' . $item['amount'] . '<br>
';
				}

				$invoicedescription &= '------------------------------------------------------<br>
';
				$invoicedescription &= $_LANG['invoicessubtotal'] . ': ' . $data['subtotal'] . '<br>
';

				if (0 < $whmcs_invoice_details['taxrate']) {
					$invoicedescription &= $whmcs_invoice_details['taxrate'] . '% ' . $whmcs_invoice_details['taxname'] . ': ' . $whmcs_invoice_details['tax'] . '<br>
';
				}


				if (0 < $whmcs_invoice_details['taxrate2']) {
					$invoicedescription &= $whmcs_invoice_details['taxrate2'] . '% ' . $whmcs_invoice_details['taxname2'] . ': ' . $whmcs_invoice_details['tax2'] . '<br>
';
				}
				if($whmcs_invoice_details['status']=="Paid"){
					$subject = 'e-Fatura Bilgilendirme -  '.$whmcs_invoice_details['date'].' Tarihli Ödenmiş Faturanız';
				}else{
					$subject = 'e-Fatura Bilgilendirme - Son Ödeme Tarihi: '.$whmcs_invoice_details['duedate'];
				}
				$email_merge_fields['invoice_id'] = $whmcs_invoice_details['invoiceid'];
				$email_merge_fields['invoice_num'] = $whmcs_invoice_details['invoicenum'];
				$email_merge_fields['invoice_date_created'] = $whmcs_invoice_details['date'];
				$email_merge_fields['invoice_date_due'] = $whmcs_invoice_details['duedate'];
				$email_merge_fields['invoice_date_paid'] = $whmcs_invoice_details['datepaid'];
				$email_merge_fields['invoice_items'] = $invoiceitems;
				$email_merge_fields['invoice_html_contents'] = $invoicedescription;
				$email_merge_fields['invoice_subtotal'] = $whmcs_invoice_details['subtotal'];
				$email_merge_fields['invoice_credit'] = $whmcs_invoice_details['credit'];
				$email_merge_fields['invoice_tax'] = $whmcs_invoice_details['tax'];
				$email_merge_fields['invoice_tax_rate'] = $whmcs_invoice_details['taxrate'] . '%';
				$email_merge_fields['invoice_tax2'] = $whmcs_invoice_details['tax2'];
				$email_merge_fields['invoice_tax_rate2'] = $whmcs_invoice_details['taxrate2'] . '%';
				$email_merge_fields['invoice_total'] = $whmcs_invoice_details['total'];
				$email_merge_fields['invoice_amount_paid'] = $whmcs_invoice_details['amountpaid'];
				$email_merge_fields['invoice_balance'] = $whmcs_invoice_details['balance'];
				$email_merge_fields['invoice_status'] = $whmcs_invoice_details['statuslocale'];
				$email_merge_fields['invoice_last_payment_amount'] = $whmcs_invoice_details['lastpaymentamount'];
				$email_merge_fields['invoice_last_payment_transid'] = $whmcs_invoice_details['lastpaymenttransid'];
				$email_merge_fields['invoice_payment_link'] = $paymentbutton;
				$email_merge_fields['invoice_payment_method'] = $whmcs_invoice_details['paymentmethod'];
				$email_merge_fields['invoice_link'] = '<a href="' . $sysurl . '/viewinvoice.php?id=' . $whmcs_invoice_details['id'] . '">' . $sysurl . '/viewinvoice.php?id=' . $whmcs_invoice_details['id'] . '</a>';
				$email_merge_fields['invoice_notes'] = $whmcs_invoice_details['notes'];
				$email_merge_fields['invoice_subscription_id'] = $whmcs_invoice_details['subscrid'];
				$email_merge_fields['invoice_previous_balance'] = $whmcs_invoice_details['clientpreviousbalance'];
				$email_merge_fields['invoice_all_due_total'] = $whmcs_invoice_details['clienttotaldue'];
				$email_merge_fields['invoice_total_balance_due'] = $whmcs_invoice_details['clientbalancedue'];
				
				
				//PDF AL
							$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['username'], 'Sifre'=> $params['password']),
										'FaturaETTN' => $invoice_details['document_id']
										));
	
		$sql = 'SELECT *
			FROM mod_eFatura_future_invoices
			WHERE invoiceid='.$invoice_details['invoice_id'];
			$result = mysql_query( $sql );
		//	$future_invoice_details = array();
			//$future_invoice_details = mysql_fetch_array( $result );
			
			$future_invoice_details = mysql_fetch_assoc( $result );
			
			if($future_invoice_details['tip']==2){
				
				$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['username'], 'Sifre'=> $params['password']),
										'ETTN' => $invoice_details['document_id'],
										'Gelen' => false,
										'Giden' => true
										));
					
					 $soapurl = 'https://efatura.edoksis.net/FaturaService.asmx?WSDL';
						if($params['config']['system_demo']){
					$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
						}
						
				$sonuc[] = $this->soapcall($soapurl, 'FaturaPDFGoruntule', $girdi);
			$pdfdata = $sonuc[0]->Pdf;	
			var_dump($future_invoice_details['tip']);
				sleep(2);
				}else{
			
			 $soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
			if($params['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/EarchiveService.asmx?WSDL';	
			}
						
						$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
						$pdfdata = $sonuc[0]->Pdf;
						while($pdfdata > 1 )
						{
							sleep(1);
							$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
							$pdfdata = $sonuc[0]->Pdf;
						}
						
			
		//	$sonuc[] = $this->soapcall($soapurl, 'EArsivFaturaPDFGoruntule', $girdi);
			
			//sleep(2);
			
			
			
			}
				 
				//$result[] = $this->soapcall( 'earchiveservice.asmx?WSDL', 'EarsivFaturaGonder', $girdi);
				
				$attachmentfilename = ($this->config['pdf_prefix'] ? $this->config['pdf_prefix'] . '_' : '') . $invoice_details['document_type'] . '_' . $invoice_details['document_id'] . '.pdf';
				$attachmentdata =  $pdfdata ;
				// $invoice_data['fatura_belgesi'];// file_get_contents( $invoice_data['fatura_belgesi']);
				//var_dump(base64_decode($attachmentdata));
			}

			/*
			foreach ($email_merge_fields as $key => $value) {
				$smarty->assign( $key, $value );
			}
			*/
			foreach ($email_merge_fields as $mergefield => $mergevalue) {
			$smarty->assign($mergefield, $mergevalue);
				}
			
		//	$subject = $smarty->fetch("emailtpl:emailsubject");
		//	$message = $smarty->fetch("emailtpl:emailmessage");
		//	$subject = $smarty->fetch( 'emailtpl:emailsubject' );
			
		//	$smarty->fetch( 'emailtpl:emailmessage' );
		//	$message = $client_details['lastname'];

			if (( !trim( $subject ) && !trim( $message ) )) {
				logActivity( 'EMAILERROR: Email Message Empty so Aborting Sending - Template Name ' . $func_messagename );
				return false;
			}

			$mail = new PHPMailer( true );
			 try
			{
			$mail->From = $fromemail;
			$mail->FromName = str_replace( '&amp;', '&', $fromname );
			switch ($CONFIG['MailType']) {
				case 'mail': {
					$mail->Mailer = 'mail';
					break;
				}

				case 'smtp': {
					$mail->IsSMTP(  );
					$mail->Host = $CONFIG['SMTPHost'];
					$mail->Port = $CONFIG['SMTPPort'];
					$mail->Hostname = $_SERVER['SERVER_NAME'];

					if ($CONFIG['SMTPSSL']) {
						$mail->SMTPSecure = $CONFIG['SMTPSSL'];
					}


					if ($CONFIG['SMTPUsername']) {
						$mail->SMTPAuth = true;
						$mail->Username = $CONFIG['SMTPUsername'];
						$mail->Password = decrypt( $CONFIG['SMTPPassword'] );
					}

					$mail->Sender = $mail->From;

					if ($fromemail != $CONFIG['SMTPUsername']) {
						$mail->AddReplyTo( $fromemail, $fromname );
					}
				}
			}

			$mail->XMailer = $CONFIG['CompanyName'];
			$mail->CharSet = $CONFIG['Charset'];
			$mail->AddAddress( trim( $email ), $firstname . ' ' . $lastname );

			if ($CONFIG['BCCMessages']) {
				$bcc = $CONFIG['BCCMessages'] . ',';
				$bcc = end(explode( ',', $bcc ));
				foreach ($bcc as $value) {
					$ccaddress = trim( $value );

					if ($ccaddress) {
						$mail->AddBCC( $ccaddress );
						continue;
					}
				}
			}

			$additionalccs = '';
			$result = select_query( 'tblcontacts', '', array( 'userid' => $userid, $type . 'emails' => '1' ) );

			while ($data = mysql_fetch_array($result)) {
				$ccaddress = trim( $data['email'] );
				$mail->AddAddress( $ccaddress, $data['firstname'] . ' ' . $data['lastname'] );
				$additionalccs &= $ccaddress . ',';
			}


			if ($copyto) {
				$copytoarray = end(explode( ',', $copyto ));
					if ($CONFIG['MailType']  = 'mail') {
					foreach ($copytoarray as $copytoemail) {
						$mail->AddBCC( trim( $copytoemail ) );
					}
				} 
else {
					foreach ($copytoarray as $copytoemail) {
						$mail->AddCC( trim( $copytoemail ) );
					}
				}
			}


			if ($additionalccs) {
				if ($copyto) {
					$copyto &= ',';
				}

				$copyto = substr( $additionalccs, 0, 0 - 1 );
			}

			$mail->Subject = $subject;

			if ($plaintext) {
				$message = str_replace( '<br>', '', $message );
				$message = str_replace( '<br />', '', $message );
				$message = strip_tags( $message );
				$mail->Body = html_entity_decode( $message );
				$message = nl2br( $message );
			} 
else {
				$message_text = str_replace( '<p>', '', $message );
				$message_text = str_replace( '</p>', '', $message_text );
				
				$message_text = str_replace( '<br>', '', $message_text );

				$message_text = str_replace( '<br />', '', $message_text );

				$message_text = strip_tags( $message_text );
				$cssdata = '';

				if ($CONFIG['EmailCSS']) {
					$cssdata = '<style>
' . $CONFIG['EmailCSS'] . '
</style>';
				}

				$message = $cssdata . '
' . $message;

require_once(dirname( __FILE__ ).'/email.php');
$values["custommessage"] = sendmail_message($CONFIG, $whmcs_invoice_details, $invoice_details, $client_details, $invoice_data);
								$mail->Body = $values["custommessage"]; // html_entity_decode( $message );
				$mail->AltBody = $message_text;
			}


			if ($tplattachments) {
				$tplattachments = end(explode( ',', $tplattachments ));
				foreach ($tplattachments as $attachment) {
					$filename = $downloads_dir . $attachment;
					$displayname = substr( $attachment, 7 );
					$mail->AddAttachment( $filename, $displayname );
				}
			}


			if ($attachmentfilename) {
				if (is_array( $attachmentfilename )) {
					foreach ($attachmentfilename as $count => $filelist) {
						$mail->AddStringAttachment( $attachmentdata[$count], $filelist );
					}
				} 
else {
					$mail->AddStringAttachment( $attachmentdata, $attachmentfilename );
				}
			}

			$mail->Send(  );
			
								
		//	require_once(ROOTDIR.'/host/modules/addons/turkhost_sms/smsclass.php');
		//	require ROOTDIR.'/host/modules/addons/turkhost_sms/smsclass.php';
			
			
			$sonuc = true;
			if (( $userid && !$nosavemaillog )) {
				$sql = 'INSERT INTO tblemails (`userid`,`subject`,`message`,`date`,`to`,`cc`,`bcc`) VALUES
					(\'' . $userid . '\', \'' . $subject . '\', \'' . $message . '\', now(), \'' . $email . '\', \'' . $copyto . '\', \'' . $CONFIG['BCCMessages'] . '\')';
				mysql_query( $sql );
			}

			logActivity( 'Email Sent to ' . $firstname . ' ' . $lastname . ' (' . $subject . ')' );
		//	$mail->ClearAddresses(  );
		}
			
			 catch ( phpmailerException $e ){
				logActivity( 'Email Sending Failed - ' . $e->getMessage(  ) . ( ' (User ID: ' . $userid . ' - Subject: ' . $subject . ')' ), 'none' );
				 $sonuc = false;
				}
				catch ( Exception $e )
				{
					logActivity( 'Email Sending Failed - ' . $e->getMessage(  ) . ( ' (User ID: ' . $userid . ' - Subject: ' . $subject . ')' ), 'none' );
				$sonuc = false;
				}
		
		}
		
	//	$this->addLog( 'Mail gonderildi: eFatura' );
	return $sonuc;
}


//SEND EMAIL STOP	
		
	}

		// RAKAM YAZIYA ÇEVİR
		function eFaturaWHMCS($command,$values){
		$adminuser = $_SESSION['adminid'];
		//	$command = "GetPaymentMethods";
		//	 $values = array();
			$whmcs_response = localAPI($command,$values,$adminuser);
			 if ($whmcs_response['result'] != 'success') {				
			 return 'WHMCS veri Bulunamadı';
			  //  echo 'An Error Occurred: ' . $results['message'];
			}
			else{
				//	$command = "GetPaymentMethods";
			//	$paymentmethods = $whmcs_response['paymentmethods'];
			return $whmcs_response;
			}
		}	 
	
class rakamoku{
function sayiyiYaziyaCevir($sayi, $kurusbasamak, $parabirimi, $parakurus, $diyez, $bb1, $bb2, $bb3) {
// kurusbasamak virgülden sonra gösterilecek basamak sayısı
// parabirimi = TL gibi , parakurus = Kuruş gibi
// diyez başa ve sona kapatma işareti atar # gibi

$b1 = array("", "Bir ", "İki ", "Üç ", "Dört ", "Beş ", "Altı ", "Yedi ", "Sekiz ", "Dokuz ");
$b2 = array("", "On ", "Yirmi ", "Otuz ", "Kırk ", "Elli ", "Altmış ", "Yetmiş ", "Seksen ", "Doksan ");
$b3 = array("", "Yüz ", "Bin ", "Milyon ", "Milyar ", "Trilyon ", "Katrilyon ");

if ($bb1 != null) { // farklı dil kullanımı yada farklı yazım biçimi için
$b1 = $bb1;
}
if ($bb2 != null) { // farklı dil kullanımı
$b2 = $bb2;
}
if ($bb3 != null) { // farklı dil kullanımı
$b3 = $bb3;
}

$say1="";
$say2 = ""; // say1 virgül öncesi, say2 kuruş bölümü
$sonuc = "";

$sayi = str_replace(",", ".",$sayi); //virgül noktaya çevrilir

$nokta = strpos($sayi,"."); // nokta indeksi

if ($nokta>0) { // nokta varsa (kuruş)

$say1 = substr($sayi,0, $nokta); // virgül öncesi
$say2 = substr($sayi,$nokta, strlen($sayi)); // virgül sonrası, kuruş

} else {
$say1 = $sayi; // kuruş yoksa
}

$son;
$w = 1; // işlenen basamak
$sonaekle = 0; // binler on binler yüzbinler vs. için sona bin (milyon,trilyon...) eklenecek mi?
$kac = strlen($say1); // kaç rakam var?
$sonint; // işlenen basamağın rakamsal değeri
$uclubasamak = 0; // hangi basamakta (birler onlar yüzler gibi)
$artan = 0; // binler milyonlar milyarlar gibi artışları yapar
$gecici;

if ($kac > 0) { // virgül öncesinde rakam var mı?

for ($i = 0; $i < $kac; $i++) {

$son = $say1[$kac - 1 - $i]; // son karakterden başlayarak çözümleme yapılır.
$sonint = $son; // işlenen rakam Integer.parseInt(

if ($w == 1) { // birinci basamak bulunuyor

$sonuc = $b1[$sonint] . $sonuc;

} else if ($w == 2) { // ikinci basamak

$sonuc = $b2[$sonint] . $sonuc;

} else if ($w == 3) { // 3. basamak

if ($sonint == 1) {
$sonuc = $b3[1] . $sonuc;
} else if ($sonint > 1) {
$sonuc = $b1[$sonint] . $b3[1] . $sonuc;
}
$uclubasamak++;
}

if ($w > 3) { // 3. basamaktan sonraki işlemler

if ($uclubasamak == 1) {

if ($sonint > 0) {
$sonuc = $b1[$sonint] . $b3[2 + $artan] . $sonuc;
if ($artan == 0) { // birbin yazmasını engelle
$sonuc = str_replace($b1[1] . $b3[2], $b3[2],$sonuc);
}
$sonaekle = 1; // sona bin eklendi
} else {
$sonaekle = 0;
}
$uclubasamak++;

} else if ($uclubasamak == 2) {

if ($sonint > 0) {
if ($sonaekle > 0) {
$sonuc = $b2[$sonint] . $sonuc;
$sonaekle++;
} else {
$sonuc = $b2[$sonint] . $b3[2 + $artan] . $sonuc;
$sonaekle++;
}
}
$uclubasamak++;

} else if ($uclubasamak == 3) {

if ($sonint > 0) {
if ($sonint == 1) {
$gecici = $b3[1];
} else {
$gecici = $b1[$sonint] . $b3[1];
}
if ($sonaekle == 0) {
$gecici = $gecici . $b3[2 + $artan];
}
$sonuc = $gecici . $sonuc;
}
$uclubasamak = 1;
$artan++;
}

}

$w++; // işlenen basamak

}
} // if(kac>0)

if ($sonuc=="") { // virgül öncesi sayı yoksa para birimi yazma
$parabirimi = "";
}

$say2 = str_replace(".", "",$say2);
$kurus = "";

if ($say2!="") { // kuruş hanesi varsa

if ($kurusbasamak > 3) { // 3 basamakla sınırlı
$kurusbasamak = 3;
}
$kacc = strlen($say2);
if ($kacc == 1) { // 2 en az
$say2 = $say2."0"; // kuruşta tek basamak varsa sona sıfır ekler.
$kurusbasamak = 2;
}
if (strlen($say2) > $kurusbasamak) { // belirlenen basamak kadar rakam yazılır
$say2 = substr($say2,0, $kurusbasamak);
}

$kac = strlen($say2); // kaç rakam var?
$w = 1;

for ($i = 0; $i < $kac; $i++) { // kuruş hesabı

$son = $say2[$kac - 1 - $i]; // son karakterden başlayarak çözümleme yapılır.
$sonint = $son; // işlenen rakam Integer.parseInt(

if ($w == 1) { // birinci basamak

if ($kurusbasamak > 0) {
$kurus = $b1[$sonint] . $kurus;
}

} else if ($w == 2) { // ikinci basamak
if ($kurusbasamak > 1) {
$kurus = $b2[$sonint] . $kurus;
}

} else if ($w == 3) { // 3. basamak
if ($kurusbasamak > 2) {
if ($sonint == 1) { // 'biryüz' ü engeller
$kurus = $b3[1] . $kurus;
} else if ($sonint > 1) {
$kurus = $b1[$sonint] . $b3[1] . $kurus;
}
}
}
$w++;
}
if ($kurus=="") { // virgül öncesi sayı yoksa para birimi yazma
$parakurus = "";
} else {
$kurus = $kurus . " ";
}
$kurus = $kurus . $parakurus; // kuruş hanesine 'kuruş' kelimesi ekler
}

$sonuc = $diyez . $sonuc . " " . $parabirimi . " " . $kurus . $diyez;
return $sonuc;
}
}
	
class yaziyla {
 
    var $sayi=0;
    var $kurus=0;
    var $eksi="";
    var $birim="TL";
    var $kurus_birim = "KR";
    var $bolukler;
    var $birler;
    var $onlar;
 
    function yaziyla($birim="TL", $kurus_birim="KR") {
 
        $this->birim          = $birim;
        $this->kurus_birim    = $kurus_birim;
        $this->bolukler       = array("","BİN","Milyon","Milyar","Trilyon","Katrilyon","Trilyar","Kentrilyon","Kentrilyar","Zontrilyar");
        $this->birler         = array("SIFIR","BİR","İKİ","ÜÇ","DÖRT","BEŞ","ALTI","YEDİ","SEKİZ","DOKUZ");
        $this->onlar          = array("","ON","YİRMİ","OTUZ","KIRK","ELLİ","ALTMIŞ","YETMİŞ","SEKSEN","DOKSAN","YÜZ");
 
    }
    function yaz($sayi) {
		  
 
        $tam="";
        $kurus="";
        if($this->sayi_cozumle($sayi)) {
 
        //return "Hatalı Sayı Formatı!";
        return "";
        }
 
        if(($this->sayi+$this->kurus) == 0) return $this->birler[0].' '.$this->birim;
 
        if($this->sayi>0) $tam = $this->oku($this->sayi);
        if($this->kurus>0) $kurus = $this->oku($this->kurus);
 
        if( $this->sayi == 0 ) return $this->eksi.' '.$kurus.' '.$this->kurus_birim;
        if( $this->kurus == 0 ) return $this->eksi.' '.$tam.' '.$this->birim;
        return $this->eksi.' '.$tam.' '.$this->birim.' '.$kurus.' '.$this->kurus_birim;
    }
    function oku($sayi) {
		
 
    if($sayi == 0) return $this->birler[0];
	logModuleCall('eFatura',"TEST43",$this->bolukler,"",  "",$replacevars);  
        $ubb = sizeof((array)$this->bolukler);
        $kac_sifir = 3 - (strlen($sayi) % 3);
        if($kac_sifir!=3) for($i=0;$i<$kac_sifir;++$i) { $sayi = "0$sayi"; }
 
        $k = 0; $sonuc = "";
        for($i = strlen($sayi); $i>0; $i-=3,++$k) {
 
           $boluk = $this->boluk_oku(substr($sayi, $i-3, 3));
           if($boluk) {
           if(($k == 1) && ($boluk == $this->birler[1])) $boluk = "";
           if(  $k > $ubb) $sonuc = $boluk ."Tanımsız(".($k*3).".Basamak) $sonuc";
           else $sonuc = $boluk . $this->bolukler[$k]." $sonuc";
           }
        }
        return $sonuc;
    }
    function boluk_oku($sayi) {
 
         $sayi = ((int)($sayi)) % 1000; $sonuc = "";
         $bir = $sayi % 10;
         $on_ = (int)($sayi / 10) % 10;
         $yuz = (int)($sayi / 100) % 10;
 
         if($yuz) { if($yuz == 1) $sonuc = $this->onlar[10];
         else $sonuc = $this->birler[$yuz].$this->onlar[10]; }
 
         if($on_) $sonuc = $sonuc.$this->onlar[$on_];
         if($bir) $sonuc = $sonuc.$this->birler[$bir];
         return $sonuc;
    }
    function sayi_cozumle($sayi) {
 
        $sayi = trim($sayi);
        if($sayi[0] == "-") { $this->eksi="Eksi"; $sayi = substr($sayi, 1); }
        if(preg_match("/^(0*\.0+|0*|\.0+)$/", $sayi)) { $this->sayi = $this->kurus = 0; return 0; }
        if(preg_match("/^(\d+)\.(\d+)$/", $sayi, $m))
        {
        $sayi = $m[1]; $this->sayi = (int)preg_replace("/^0+/","",$sayi);
        if(!preg_match("/^0+$/",$m[2])) $this->kurus = (int)$m[2];
        }
        else if(preg_match("/^0*(\d+)$/", $sayi, $m) || preg_match("/^0*(\d+)\.0+$/", $sayi, $m)) { $this->sayi = (int)$m[1]; }
        else if(preg_match("/^0*\.(\d+)$/", $sayi, $m)) { $this->sayi = 0; $this->kurus = (int)$m[1]; }
        else return 1;
        if($this->kurus>0) {
 
        $this->kurus= number_format('0.'.$this->kurus, 2);
        if( (int)$this->kurus == 1 ) { ++$this->sayi; $this->kurus = 0; }
        else $this->kurus = (int)str_replace("0.", "", $this->kurus);
        }
        return 0;
    }
}

 
//ÇIKTISI : İKİYÜZELLİALTI TÜRK LİRASI OTUZ KURUŞ
 

		
		
		// YAZIYA ÇEVİR STOP
  function xsltGetir()
  {
//  $xslt =  base64_encode(file_get_contents(dirname( __FILE__ ) .'/AAA2016000010000.xslt'));
  
    $xslt =  base64_encode(file_get_contents(dirname( __FILE__ ) .'/TURKHOST.xslt'));
  return $xslt;
    }

	if (!defined( 'WHMCS' )) {
		exit( 'This file cannot be accessed directly' );
	}

?>