<?php

	header('Content-Type: text/html; charset=UTF-8');
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
	header("Cache-Control: private, no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache"); // HTTP/1.0
	function eFatura_config() {
		return array( 'name' => 'eFatura', 'description' => 'TürkHost WHMCS eFatura Entegrasyon Modulü ', 'version' => '1.0.17', 'author' => 'Ali ALKANER', 'language' => 'turkish', 'fields' => array( 'licensekey' => array( 'FriendlyName' => 'License Key', 'Type' => 'text', 'Size' => '60', 'Description' => '', 'Default' => 'Turkhost-XXXXXXXXXXXXXXXXXXXXXXXXX' ) ) );
	}
	//	global $CONFIG;
 
	
  function eFaturaGetir($selecteddocuments){
	    foreach ($selecteddocuments as $documentid) {
			
						$sql = 'SELECT *
									FROM mod_eFatura_invoices
									WHERE id = \'' . $documentid . '\'';
						$result = mysql_query( $sql );

									while($document_details = mysql_fetch_array( $result )) {
									$documents[$document_details['id']] = $document_details;
									
									}
									
									
		}							
									
									return $documents;
	 
				return $documents;
  }
	function eFatura_activate() {
		$error = array(  );
		$error_step = '';
		$emailids = array(  );
		$sql = 'INSERT INTO `tblemailtemplates` (`type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`, `disabled`, `custom`, `language`, `copyto`, `plaintext`) VALUES
		(\'invoice\', \'eFatura Refund Confirmation\', \'Invoce refund confirmation\', \'Dear {$client_name},<br><br>This is confirmation that a {if $invoice_status eq Refunded}full{else}partial{/if} refund has been processed for Invoice #{$invoice_num}<br>The refund has been {if $invoice_refund_type eq credit}credited to your account balance with us{else}returned via the payment method you originally paid with{/if}.<br><br>{$invoice_html_contents}<br><br>Amount Refunded: {$invoice_last_payment_amount}{if $invoice_last_payment_transid}<br>Transaction #: {$invoice_last_payment_transid}{/if}<br><br>You may review your invoice history at any time by logging in to your client area.<br>PDF copy of your invoice is attached to this message.<br><br>{$signature}<br>\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', 0)';
		$result = mysql_query( $sql );

		if ($result) {
			$emailids[] = mysql_insert_id(  );
		}

		$sql = 'INSERT INTO `tblemailtemplates` (`type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`, `disabled`, `custom`, `language`, `copyto`, `plaintext`) VALUES
		(\'invoice\', \'eFatura Invoice Confirmation\', \'Invoice created.\', \'Dear {$client_name},<br><br>This is a notice that an invoice has been generated on {$invoice_date_created}.<br>Your payment method is: {$invoice_payment_method}<br><br>Internal order #{$invoice_num}<br>Amount Due: {$invoice_total}<br>Due Date: {$invoice_date_due}<br><br>Invoice Items<br><br>{$invoice_html_contents}<br>------------------------------------------------------<br><br>PDF copy of your invoice is attached to this message.<br>You can login to your client area to view and pay the invoice at {$invoice_link}.<br><br>{$signature}<br>\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', 0)';
		$result = mysql_query( $sql );

		if ($result) {
			$emailids[] = mysql_insert_id(  );
		}

		$sql = 'INSERT INTO `tblemailtemplates` (`type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`, `disabled`, `custom`, `language`, `copyto`, `plaintext`) VALUES
		(\'invoice\', \'eFatura InvoiceReceipt Confirmation\', \'Invoice payment confirmation\', \'Dear {$client_name},<br><br>This is a payment receipt for order #{$invoice_num} sent on {$invoice_date_created}<br><br>{$invoice_html_contents}<br><br>Amount: {$invoice_last_payment_amount}<br>Total Paid: {$invoice_amount_paid}<br>Remaining Balance: {$invoice_balance}<br>Status: {$invoice_status}<br><br>You may review your invoice history at any time by logging in to your client area.<br>PDF copy of your invoice is attached to this message.<br><br>Note: This email will serve as an official receipt for this payment.<br><br>{$signature}<br>\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', 0)';
		$result = mysql_query( $sql );

		if ($result) {
			$emailids[] = mysql_insert_id(  );
		}

		$sql = 'INSERT INTO `tblemailtemplates` (`type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`, `disabled`, `custom`, `language`, `copyto`, `plaintext`) VALUES
		(\'invoice\', \'eFatura Receipt Confirmation\', \'Invoice payment confirmation.\', \'Dear {$client_name},<br><br>This is a payment receipt for order #{$invoice_num} sent on {$invoice_date_created}<br><br>{$invoice_html_contents}<br><br>Amount: {$invoice_last_payment_amount}<br>Total Paid: {$invoice_amount_paid}<br>Remaining Balance: {$invoice_balance}<br>Status: {$invoice_status}<br><br>You may review your invoice history at any time by logging in to your client area.<br>PDF copy of your invoice is attached to this message.<br><br>Note: This email will serve as an official receipt for this payment.<br><br>{$signature}<br>\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', 0)';
		$result = mysql_query( $sql );

		if ($result) {
			$emailids[] = mysql_insert_id(  );
		}

		$sql = 'INSERT INTO `tblemailtemplates` (`type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`, `disabled`, `custom`, `language`, `copyto`, `plaintext`) VALUES
		(\'invoice\', \'eFatura Documents Resend\', \'Your requested documents are attached.\', \'Dear {$client_name},<br><br>Following your request, the documents are attached to this email as a PDF.<br><br>{$signature}<br>\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', 0)';
		$result = mysql_query( $sql );

		if ($result) {
			$emailids[] = mysql_insert_id(  );
		}


		if (sizeof((array) $emailids ) < 4) {
			$error_step = 'emails';
			$error[] = 'Can\'t insert email templates. SQL Error: ' . mysql_error(  );
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_clients` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`remote_client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'clients';
				$error[] = 'Can\'t create the table `mod_eFatura_clients`. SQL Error: ' . mysql_error(  );
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_config` (
				`name` varchar(255) NOT NULL,
				`value` text NOT NULL,
			PRIMARY KEY (`name`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'config';
				$error[] = 'Can\'t create the table `mod_eFatura_config`. SQL Error: ' . mysql_error(  );
			} 
else {
				$sql = 'INSERT INTO `mod_eFatura_config` (`name`, `value`) VALUES
				(\'creation_filter\', \'a:3:{s:7:"created";a:2:{s:7:"gateway";s:1:"0";s:14:"withoutgateway";s:1:"0";}s:4:"paid";a:3:{s:11:"withtransid";s:1:"1";s:14:"withouttransid";s:1:"0";s:7:"gateway";s:1:"1";}s:8:"refunded";a:1:{s:8:"document";s:1:"1";}}\'),
				(\'creation_type\', \'future\'),
				(\'emailtemplates\', \'' . (sizeof((array) $emailids ) ? implode( ',', $emailids ) : '') . '\'),
				(\'identity_fieldid\', \'0\'),
				(\'identity_fieldname\', \'0\'),
				(\'modulus\', \'0\'),
				(\'exponent\', \'0\'),	
				(\'ClaimedRole\', \'0\'),
				(\'CopyIndicator\', \'0\'),
				(\'CustomizationID\', \'0\'),		
				(\'ProfileID\', \'0\'),
				(\'UBLVersionID\', \'0\'),
				(\'X509Certificate\', \'0\'),
				(\'X509IssuerName\', \'0\'),
				(\'X509SerialNumber\', \'0\'),
				(\'X509SubjectName\', \'0\'),
				(\'invoice_comments\', \'\'),
				(\'invoice_language\', \'user\'),
				(\'invoice_subject\', \'Invoice Items\'),
				(\'invoice_company\', \'Firma Adı\'),
				(\'invoice_company_tipi\', \'TÜZEL\'),
				(\'invoice_company_vd\', \'Vergi Daireniz\'),
				(\'invoice_company_vn\', \'9999999999\'),
				(\'invoice_company_mn\', \'8888888888\'),
				(\'invoice_company_tel\', \'02125424521\'),
				(\'invoice_company_fax\', \'02125424521\'),
				(\'invoice_company_badi\', \'Bina Adı\'),
				(\'invoice_company_bn\', \'Bina No\'),
				(\'invoice_company_mahalle\', \'Mahalle\'),
				(\'invoice_company_sokak\', \'Sokak\'),
				(\'invoice_company_kn\', \'İç Kapı Daire No\'),
				(\'invoice_company_ilce\', \'ilceniz\'),
				(\'invoice_company_sehir\', \'İL\'),
				(\'invoice_company_pk\', \'34640\'),
				(\'invoice_company_web\', \'Web Adresiniz\'),
				(\'invoice_company_email\', \'7777777777\'),
				(\'invoice_company_tn\', \'7777777777\'),
				(\'invoice_start_n\', \'0\'),
				(\'invoice_remote_dates\', \'0\'),
				(\'auto_invoicing_enabled\', 1),
				(\'system_enabled\', 1),
				(\'system_demo\', 1),
				(\'auto_sms\', 0),
				(\'clients_visibility_enabled\', 1),
				(\'invoice_calculate_tax\', 0),
				(\'invoice_client_name\', 7),
				(\'invoice_client_name_fieldid\', 0),
				(\'localkey\', \'\'),
				(\'override_language\', \'turkish\'),
				(\'password\', \'\'),
				(\'payment_types\', \'\'),
				(\'payment_types_auto\', \'\'),
				(\'version_check\', \'0\'),
				(\'version_new\', \'\'),
				(\'pdf_prefix\', \'\'),
				(\'etiket\', \'default@default.com\'),
				(\'gonderici\', \'default@default.com\'),
				(\'username\', \'\')';
				$result = mysql_query( $sql );

				if (!$result) {
					$error_step = 'configdata';
					$error[] = 'Can\'t insert data into table `mod_eFatura_config`. SQL Error: ' . mysql_error(  );
				}
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_future_invoices` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`invoiceid` int(11) unsigned NOT NULL DEFAULT \'0\',
				`document_type` varchar(255) NOT NULL,
				`document_data` varchar(255) NOT NULL,
				`invoice_details` text NOT NULL,
				`creation_time` int(11) unsigned NOT NULL DEFAULT \'0\',
				`created` tinyint(1) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'futureinvoices';
				$error[] = 'Can\'t create the table `mod_eFatura_future_invoices`. SQL Error: ' . mysql_error(  );
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_history_clients` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`username` varchar(255) NOT NULL,
				`client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`remote_client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'clientshistory';
				$error[] = 'Can\'t create the table `mod_eFatura_history_clients`. SQL Error: ' . mysql_error(  );
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_history_invoices` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`username` varchar(255) NOT NULL,
				`client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`invoice_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`document_id` varchar(255) NOT NULL,
				`document_unique_id` varchar(255) NOT NULL,
				`invoice_url` varchar(300) NOT NULL,
				`document_type` varchar(255) NOT NULL,
				`time` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'invoiceshistory';
				$error[] = 'Can\'t create the table `mod_eFatura_history_invoices`. SQL Error: ' . mysql_error(  );
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_invoices` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`invoice_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`document_id` varchar(255) NOT NULL,
				`document_unique_id` varchar(255) NOT NULL,
				`invoice_url` varchar(255) NOT NULL,
				`document_type` varchar(255) NOT NULL,
				`time` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'invoices';
				$error[] = 'Can\'t create the table `mod_eFatura_invoices`. SQL Error: ' . mysql_error(  );
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_logs` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`parent_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`message` text NOT NULL,
				`time` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			$result = mysql_query( $sql );

			if (!$result) {
				$error_step = 'logs';
				$error[] = 'Can\'t create the table `mod_eFatura_logs`. SQL Error: ' . mysql_error(  );
			}
		}


		if (!sizeof((array) $error )) {
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_branches` (
			`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			`country` varchar(255) CHARACTER SET utf8 NOT NULL,
			`branch_id` int(11) unsigned NOT NULL DEFAULT \'0\',
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			mysql_query( $sql );

			if (!$result) {
				$error_step = 'branches';
				$error[] = 'Can\'t create the table `mod_eFatura_branches`. SQL Error: ' . mysql_error(  );
			}
		}


		if (sizeof((array) $error )) {
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_clients`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_future_invoices`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_logs`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_history_invoices`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_history_clients`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_invoices`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_config`' );
			mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_branches`' );

			if (sizeof((array) $emailids )) {
				mysql_query( 'DELETE FROM `tblemailtemplates` WHERE id IN(\'' . implode( '\',\'', $emailids ) . '\')' );
			}
		}

		return array( 'status' => (sizeof((array) $error ) ? 'error' : 'success'), 'description' => (sizeof((array) $error ) ? implode( '<br />', $error ) : 'eFatura activated successfully') );
	}

	function eFatura_deactivate() {
		if (!class_exists( 'eFatura' )) {
			require( dirname( __FILE__ ) . '/class_eFatura.php' );
		}

		$eFatura = new eFatura(  );
		$emailids = ($eFatura->config['emailtemplates'] ? explode( ',', $eFatura->config['emailtemplates'] ) : array(  ));
		mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_logs`' );
		mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_future_invoices`' );
		mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_config`' );
		mysql_query( 'DROP TABLE IF EXISTS `mod_eFatura_branches`' );

		if (sizeof((array) $emailids )) {
			mysql_query( 'DELETE FROM `tblemailtemplates` WHERE id IN(\'' . implode( '\',\'', $emailids ) . '\')' );
		}

		return array( 'status' => 'success', 'description' => 'eFatura deactivated successfully' );
	}

	function eFatura_upgrade($vars) {
		$version = ($vars['version'] ? $vars['version'] : $vars['eFatura']['version']);

		if (!$version) {
			return null;
		}


		if (!class_exists( 'eFatura' )) {
			require( dirname( __FILE__ ) . '/class_eFatura.php' );
		}

		$eFatura = new eFatura(  );

		if (version_compare( $version, '1.0.1' ) < 0) {
			$sql = 'INSERT INTO `mod_eFatura_config` (`name`, `value`) VALUES
			(\'invoice_remote_dates\', 0),
			(\'auto_invoicing_enabled\', 1),
			(\'system_enabled\', 1),
			(\'system_demo\', 1),
			(\'auto_sms\', 0),
			(\'clients_visibility_enabled\', 1),
			(\'invoice_calculate_tax\', 0)';
			mysql_query( $sql );
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_history_clients` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`username` varchar(255) NOT NULL,
				`client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`remote_client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			mysql_query( $sql );
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_history_invoices` (
				`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
				`username` varchar(255) NOT NULL,
				`client_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`invoice_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`document_id` int(11) unsigned NOT NULL DEFAULT \'0\',
				`document_unique_id` varchar(255) NOT NULL,
				`invoice_url` varchar(255) NOT NULL,
				`document_type` varchar(255) NOT NULL,
				`time` int(11) unsigned NOT NULL DEFAULT \'0\',
			PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			mysql_query( $sql );
			$sql = 'ALTER TABLE `mod_eFatura_logs` CHANGE `message` `message` text NOT NULL';
			mysql_query( $sql );
		}


		if (version_compare( $version, '1.0.4' ) < 0) {
			$sql = 'INSERT INTO `mod_eFatura_config` (`name`, `value`) VALUES
			(\'invoice_client_name\', 7),
			(\'invoice_client_name_fieldid\', 0)';
			mysql_query( $sql );
		}


		if (version_compare( $version, '1.0.5' ) < 0) {
			$sql = 'DELETE
			FROM `mod_eFatura_config`
			WHERE name = \'invoice_client_name_fieldid\'';
			mysql_query( $sql );
		}


		if (version_compare( $version, '1.0.10' ) < 0) {
			$sql = 'INSERT INTO `mod_eFatura_config` (`name`, `value`) VALUES
			(\'branch\', \'\')';
			mysql_query( $sql );
		}


		if (version_compare( $version, '1.0.13' ) < 0) {
			$sql = 'INSERT INTO `tblemailtemplates` (`type`, `name`, `subject`, `message`, `attachments`, `fromname`, `fromemail`, `disabled`, `custom`, `language`, `copyto`, `plaintext`) VALUES
			(\'invoice\', \'eFatura Documents Resend\', \'Your requested documents are attached.\', \'Dear {$client_name},<br><br>Following your request, the documents are attached to this email as a PDF.<br><br>{$signature}<br>\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', 0)';
			mysql_query( $sql );
			$emailids = ($eFatura->config['emailtemplates'] ? explode( ',', $eFatura->config['emailtemplates'] ) : array(  ));
			$emailids[] = mysql_insert_id(  );
			$eFatura->setConfig( 'emailtemplates', implode( ',', $emailids ) );
		}


		if (version_compare( $version, '1.0.16' ) < 0) {
			$sql = 'INSERT INTO `mod_eFatura_config` (`name`, `value`) VALUES
			(\'pdf_prefix\', \'Jetserver\')';
			mysql_query( $sql );
			$sql = 'CREATE TABLE IF NOT EXISTS `mod_eFatura_branches` (
			`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			`country` varchar(255) CHARACTER SET utf8 NOT NULL,
			`branch_id` int(11) unsigned NOT NULL DEFAULT \'0\',
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1';
			mysql_query( $sql );
		}

	}

	function eFatura_output($vars) {
		$modulelink = $vars['modulelink'];

		if (!class_exists( 'eFatura' )) {
			require( dirname( __FILE__ ) . '/class_eFaturaClient.php' );
			require( dirname( __FILE__ ) . '/class_eFatura.php' );
		}

		$eFatura = new eFatura(  );
		//$license = eFatura_license( $vars['licensekey'], $eFatura->config['localkey'] );
		$license['status'] = 'Active';



		if ($eFatura->config['version_check'] < time(  ) - 60 * 60 * 24) {
			$newversion = '';// (string) file_get_contents( 'http://www.turkhost.net.tr/version/eFatura.txt' );

			if (trim( $newversion )) {
				$eFatura->setConfig( 'version_new', trim( $newversion ) );
				$eFatura->setConfig( 'version_check', time(  ) );
			}
		}


		if (version_compare( $vars['version'], $eFatura->config['version_new'] ) < 0) {
			echo '<div class="infobox">
	<strong><span class="title">'.$vars['_lang']['info'].'</span></strong>
	<br />
	';
			echo sprintf( $vars['_lang']['version_check'], $eFatura->config['version_new'] ).'</div>
';
		}

		$page = $_REQUEST['page'];
		$pages = array( 'invoices', 'documents', 'logs', 'branches', 'settings' );
		$page = (in_array( $page, $pages ) ? $page : $pages[0]);
		$action = $_REQUEST['action'];
		
		echo '<script type="text/javascript">
$(document).ready(function() {

	$("#checkall").click(function () {
		$(".checkall").attr("checked",this.checked);
	});
});
</script>

<div id="tabs" style="margin-bottom: 10px;">
	<ul class="nav nav-pills">
		';
		foreach ($pages as $page_name) {
			$selected = ($page_name == $page ? true : false);
			echo '<li role="presentation" ';

			if ($selected) {
				echo ' class="active"';
			}

			echo '"><a href="'.$modulelink.'&page='.$page_name.'">'.$vars['_lang']['page_' . strtolower( $page_name )].'</a></li>';
		}

		echo '	</ul>
</div>

';
		switch ($page) {
			
			default:{break;}
			case 'invoices': {
				$success = $error = $info = array(  );
				$selectedinvoices = $_REQUEST['selectedinvoices'];
				$invoicing_action = (isset( $_REQUEST['generate'] ) ? 'generate' : '');
				$invoicing_action = (isset( $_REQUEST['refund'] ) ? 'refund' : $invoicing_action);
				$invoicing_action = (isset( $_REQUEST['cancel'] ) ? 'cancel' : $invoicing_action);
				$invoicing_action = (isset( $_REQUEST['create'] ) ? 'create' : $invoicing_action);
				$invoicing_action = (isset( $_REQUEST['emukellef'] ) ? 'emukellef' : $invoicing_action);

				if (sizeof((array)$selectedinvoices )) {
					switch ($invoicing_action) {
						case 'cancel': {
							$sql = 'SELECT id
							FROM mod_eFatura_future_invoices
							WHERE invoiceid IN(\'' . implode( '\',\'', $selectedinvoices ) . '\')
							AND created = 0';
							$result = mysql_query( $sql );
							$future_invoice_details = mysql_fetch_array( $result );

							if ($future_invoice_details) {
								$sql = 'DELETE
								FROM mod_eFatura_future_invoices
								WHERE invoiceid IN(\'' . implode( '\',\'', $selectedinvoices ) . '\')
								AND created = 0';

								if (mysql_query( $sql )) {
									$success[] = $vars['_lang']['future_canceled'];
								} 
else {
									$error[] = sprintf( $vars['_lang']['future_cancel_error'], mysql_error(  ) );
								}
							} 
else {
								$info[] = $vars['_lang']['no_valid_invoices'];
							}

							break;
					}
					
					
							case 'emukellef': {
							$sql = 'SELECT id
							FROM mod_eFatura_future_invoices
							WHERE invoiceid IN(\'' . implode( '\',\'', $selectedinvoices ) . '\')
							AND created = 0';
							$result = mysql_query( $sql );
							$future_invoice_details = mysql_fetch_array( $result );

							if ($future_invoice_details) {
								/*
								$sql = 'DELETE
								FROM mod_eFatura_future_invoices
								WHERE invoiceid IN(\'' . implode( '\',\'', $selectedinvoices ) . '\')
								AND created = 0';
								
								*/
								 $sql = 'UPDATE mod_eFatura_future_invoices SET tip=2 
								 WHERE invoiceid IN(\'' . implode( '\',\'', $selectedinvoices ) . '\')   ';
					
								if (mysql_query( $sql )) {
									$success[] = $vars['_lang']['future_canceled'];
								} 
else {
									$error[] = sprintf( $vars['_lang']['future_cancel_error'], mysql_error(  ) );
								}
								
								
								
							} 
else {
								$info[] = $vars['_lang']['no_valid_invoices'];
							}

							break;
					}
									

						case 'generate': {
							require_once("class_eFatura.php");
							foreach ($selectedinvoices as $invoice_id) {
								
								$sql = 'SELECT * FROM `mod_eFatura_invoices` WHERE invoice_id='.$invoice_id;
								$result = mysql_query( $sql );
							//	$faturavar = mysql_fetch_assoc( $result );
								
								if($faturavar = mysql_fetch_assoc( $result )){				
								
								$error[] = sprintf( $vars['_lang']['faturavar'], $invoice_id, $faturavar['document_unique_id']);
								
								}else{
							if($eFatura->cronDocuments( array($invoice_id))){
									//logModuleCall('eFatura',"TEST33",$eresult,"",  "",$replacevars);  
								$result = mysql_query( $sql );
									
									if($faturavar = mysql_fetch_assoc( $result ))$success[] = sprintf( $vars['_lang']['future_created'], $invoice_id, $faturavar['document_unique_id']);
									//mysql_fetch_array( $result );
								}else{
									$error[] = sprintf( $vars['_lang']['faturala'], $invoice_id);
									
									//"Seçtiğiniz #".$invoice_id.'numaralı siparişi Öncelikleri  e-Fatura Yap butonuna tıklayıp faturalaştırmalısınız';
									
								}
									
									
								
								//$vars['_lang']['future_created'];	
									
								}
							
							}	
							
							
							
							break;
					
	}

						case 'refund': {
						
						/*
						foreach ($selectedinvoices as $invoice_id) {
								$sql = 'SELECT i.*, t.currency, t.transid, t.gateway
								FROM tblinvoices as i
								LEFT JOIN tblaccounts as t
								ON t.invoiceid = i.id
								WHERE i.id = \'' . $invoice_id . '\'
								AND i.total > 0';
								$result = mysql_query( $sql );
								

								while($invoice_details = mysql_fetch_array( $result )) {
									$documents = array(  );
									$sql = 'SELECT *
									FROM mod_eFatura_invoices
									WHERE invoice_id = \'' . $invoice_id . '\'';
									$result = mysql_query( $sql );

									while ($document_details = mysql_fetch_array( $result )) {
										$documents[$document_details['document_type']] = $document_details;
									}

									mysql_fetch_array( $result );

									if (( ( $invoice_details['status'] == 'Refunded' && ( in_array( 'Invoice', array_keys( $documents ) ) || in_array( 'InvoiceReceipt', array_keys( $documents ) ) ) ) && !in_array( 'Refund', array_keys( $documents ) ) )) {
										$document_details = array(  );

										if (isset( $documents['Invoice'] )) {
											$document_details = $documents['Invoice'];
										} 
else {
											if (isset( $documents['InvoiceReceipt'] )) {
												$document_details = $documents['InvoiceReceipt'];
											}
										}

										$sql = 'DELETE
										FROM mod_eFatura_future_invoices
										WHERE invoiceid = \'' . $invoice_id . '\'
										AND created = 0';
										mysql_query( $sql );
										$reffdoc = array( 'id' => $document_details['document_id'], 'unique_id' => $document_details['document_unique_id'], 'type' => $document_details['document_type'] );

										if ($eFatura->futureDocument( $invoice_details, 'Refund', $reffdoc )) {
											$success[] = sprintf( $vars['_lang']['invoice_mgs_added_to_future'], $invoice_id );
											continue;
										}

										$error[] = sprintf( $vars['_lang']['invoice_mgs_cant_add_future'], $invoice_id, mysql_error(  ) );
										continue;
									}


									if ($invoice_details['status'] != 'Refunded') {
										$error[] = sprintf( $vars['_lang']['invoice_mgs_not_refunded'], $invoice_id );
										continue;
									}


									if (in_array( 'Refund', array_keys( $documents ) )) {
										$error[] = sprintf( $vars['_lang']['invoice_mgs_have_refund'], $invoice_id );
										continue;
									}


									if (( !in_array( 'Invoice', array_keys( $documents ) ) && !in_array( 'InvoiceReceipt', array_keys( $documents ) ) )) {
										$error[] = sprintf( $vars['_lang']['invoice_mgs_no_invoice_or_receipt_doc'], $invoice_id );
										continue;
									}

									continue;
								}

								$error[] = sprintf( $vars['_lang']['invoice_mgs_invoice_not_exists'], $invoice_id );
							}
							
							*/

							break;
						}

						case 'create': {
							foreach ($selectedinvoices as $invoice_id) {
								
								$sql = 'SELECT * FROM `mod_eFatura_invoices` WHERE invoice_id='.$invoice_id;
								$result = mysql_query( $sql );
								$efaturavar = mysql_fetch_assoc( $result );
								
								if(!$efaturavar){				
								$sql = 'SELECT i.*, t.currency, t.transid, t.gateway
								FROM tblinvoices as i
								LEFT JOIN tblaccounts as t
								ON t.invoiceid = i.id
								WHERE i.id = \'' . $invoice_id . '\'
								';
							//	$result = mysql_query( $sql );
								//$invoice_details = mysql_fetch_assoc( $result );
								
								//API
								$command = "GetInvoice";
								
									$values = array(
													'invoiceid' => $invoice_id,
													
													
												);
							$invoice_details = eFaturaWHMCS($command,$values);
								

								if ($invoice_details) {
								// BAŞLA
								$source = $invoice_details["date"];
								$faturatarihi = new DateTime($source);
								$faturatarihi->format('Y-m-d'); 

								$sql = 'SELECT * FROM `mod_eFatura_future_invoices` ORDER BY id DESC LIMIT 1';
								$result = mysql_query( $sql );
								$sonfaturaid = mysql_fetch_assoc( $result );
								//$faturatarihi = date( 'y-m-d',$invoice_details["date"] );
								
								
								$sql = 'SELECT * FROM `tblinvoices` WHERE id='.$sonfaturaid['invoiceid'];
								$result = mysql_query( $sql );
								$sonfatura = mysql_fetch_assoc( $result );
								//var_dump($sonfatura["date"]);
								
								$source = $sonfatura["date"];
								
								$sonfaturaTarihi = new DateTime($source);
								$sonfaturaTarihi->format('Y-m-d');
								
								/*
								$sonfaturasource = date( 'Y-m-d',$sonfatura['time'] );
								$sonfaturaTarihi = new DateTime($sonfaturasource);
								$sonfaturaTarihi->format('Y-m-d'); 
								
								var_dump($sonfaturaTarihi);
								*/
								
								//  E-FATURA MÜKELLEF SORGULA START

				try{
											
					//$c_f = $eFatura->config["identity_fieldid"];
				$command = "GetClientsDetails";
					
						$values = array(
										'clientid' => $invoice_details["userid"],
										'stats' => true,
									);
				$results = eFaturaWHMCS($command,$values);
				
					foreach ($customfields as $fieldid => $fieldname) {
					$selected = ($fieldid == $eFatura->config['identity_fieldid'] ? true : false);
				
					if ($selected) {
						$c_f = $fieldid;
					}

					
				}
				
					/*
				foreach($results["customfields"] as $c_field){
					
					if($c_field["id"] == $c_f){
					//var_dump($c_field["value"]);	
					$vn = $c_field["value"]; break;	
					}
				}
				*/
				//$eFatura->config['identity_fieldid']
				
				$c_fieldid ="customfields".$eFatura->config['identity_fieldid'];
				$vkn = "00000000000";
				if($results["client"][$c_fieldid])$vkn=$results["client"][$c_fieldid];
				
				//var_dump($results["client"][$c_fieldid]);
			//	var_dump($results["client"]);
			$eFatura->config = $eFatura->getConfig();
				$mukellefUrl ='https://wsmukellef.edoksis.net/MukellefService.asmx?WSDL';
					$soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
						if($params['config']['system_demo']){
					$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
						}
			
			 $egirdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $eFatura->config['username'], 'Sifre'=> $eFatura->config['password']),
											'VKN' => $vkn
											));
			
			$Mgirdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $eFatura->config['username'], 'Sifre'=> $eFatura->config['password']),
										'VKN' => $vkn
										));		
			
			if($results["client"][$c_fieldid] && $results["client"][$c_fieldid] !="00000000000"){
			//	var_dump("test");
			$eresult[] = $eFatura->soapcall($mukellefUrl, 'FirmaSorgula', $Mgirdi);
		///	var_dump($eresult);
			 logModuleCall('eFatura',$action,$eresult,"",  "",$replacevars);  
			//	logModuleCall('eFatura',$action,$eresult, $eresult, $Mresult, $Mgirdi);  
			//var_dump($eresult[0]->Firmalar->EFaturaFirma->Identifier);
			}
			
		//	var_dump($eresult[0]->Firmalar->EFaturaFirma[0]->Identifier);
		//	var_dump($eresult[0]->Firmalar->EFaturaFirma->Identifier);
			
			if($eresult[0]->Firmalar->EFaturaFirma->Identifier){
				$e_tip = 2;		
					
			}else{
				$e_tip = 1;	
			}
			
			$command = "GetInvoice";
						$values = array('invoiceid' => $invoice_id,
						);
				$results = eFaturaWHMCS($command,$values);
				
			
			 if ($results['result'] != 'success') {
				$error[] = 'Fatura Bilgileri Alınamadı !';
			}
			
				
			$command = "GetClientsDetails";
					
						$values = array(
										'clientid' => $results['userid'],
										'stats' => true,
									);
				$results = eFaturaWHMCS($command,$values);
				
				 if ($results['result'] != 'success') {
				$error[] = 'Fatura Kesilecek Müşteri Bilgilerine Ulaşılamadı !';
			  //  echo 'An Error Occurred: ' . $results['message'];
			}
			
		
		
					/*
					foreach($eFirmalar as $firma){
					//	var_dump($firma->Identifier);

						
					if ($firma->Identifier == $vn) {
							                           
							$e_tip = 2;
							 break;
								}	
							
							
						}	
						*/
						
					
					
					
						
		
				
			}	catch (SoapFault $exception) {
				 
					$error[] = 'SOAP ERROR 210';
				$valid = false;
				}
								
								
								//E-FATURA MÜKELLEF SORGULA END
								
								
								if($faturatarihi >= $sonfaturaTarihi or $sonfatura == NULL)	{
								
								//BITIR date( 'd-m-Y H:i', $remote_invoice['time'] )
									
									$valid = false;
									$documents = array(  );
									$reffdoc = array(  );
									$sql = 'SELECT *
									FROM mod_eFatura_invoices
									WHERE invoice_id = \'' . $invoice_id . '\'';
									$result = mysql_query( $sql );

									while ($document_details = mysql_fetch_assoc( $result )) {
										$documents[$document_details['document_type']] = $document_details;
									}

									mysql_fetch_array( $result );
									switch ($invoice_details['status']) {
										case 'Unpaid': {
											if (!isset( $documents['Invoice'] )) {
												$valid = true;
												$doctype = 'Invoice';
											} 
else {
												$valid_error = sprintf( $vars['_lang']['invoice_mgs_have_invoice'], $invoice_id );
											}

											break;
										}

										case 'Paid': {
											if (( isset( $documents['Invoice'] ) && !isset( $documents['Receipt'] ) )) {
												$valid = true;
												$doctype = 'Receipt';
											} 
else {
												if (( !isset( $documents['Invoice'] ) && !isset( $documents['InvoiceReceipt'] ) )) {
													$valid = true;
													$doctype = 'InvoiceReceipt';
												} 
else {
													if (isset( $documents['InvoiceReceipt'] )) {
														$valid_error = sprintf( $vars['_lang']['invoice_mgs_have_invoicereceipt'], $invoice_id );
													}


													if (isset( $documents['Receipt'] )) {
														$valid_error = sprintf( $vars['_lang']['invoice_mgs_have_receipt'], $invoice_id );
													}
												}
											}

											break;
										}

										case 'Refunded': {
											if (( ( isset( $documents['Invoice'] ) || isset( $documents['InvoiceReceipt'] ) ) && !isset( $documents['Refund'] ) )) {
												$valid = true;
												$doctype = 'Refund';
												$document_details = array(  );

												if (isset( $documents['Invoice'] )) {
													$document_details = $documents['Invoice'];
												} 
else {
													if (isset( $documents['InvoiceReceipt'] )) {
														$document_details = $documents['InvoiceReceipt'];
													}
												}

												$reffdoc = array( 'id' => $document_details['document_id'], 'unique_id' => $document_details['document_unique_id'], 'type' => $document_details['document_type'] );
												break;
											} 
else {
												if (( !isset( $documents['Invoice'] ) && !isset( $documents['InvoiceReceipt'] ) )) {
													$valid_error = sprintf( $vars['_lang']['invoice_mgs_no_invoice_or_receipt_doc'], $invoice_id );
												}


												if (isset( $documents['Refund'] )) {
													$valid_error = sprintf( $vars['_lang']['invoice_mgs_have_refund'], $invoice_id );
												}
											}
										}
									}


									if ($valid) {
										$sql = 'DELETE
										FROM mod_eFatura_future_invoices
										WHERE invoiceid = \'' . $invoice_id . '\'
										AND created = 0';
										mysql_query( $sql );
									$invoice_details['id'] = $invoice_details['invoiceid'];
										if ($eFatura->futureDocument( $invoice_details, $doctype, $e_tip, $reffdoc )) {
											$success[] = sprintf( $vars['_lang']['invoice_mgs_added_to_future'], $invoice_id );
											continue;
										}

										$error[] = sprintf( $vars['_lang']['invoice_mgs_cant_add_future'], $invoice_id, mysql_error(  ) );
										continue;
									}

									$error[] = $valid_error;
									continue;
								
								}$error[] = sprintf( 'Son Fatura Tarihinden önceki bir tarihe fatura kesilemez. Son Fatura Tarihi : '.$sonfatura["date"].' Son Fatura ID : '.$sonfatura["id"] , $invoice_id );
								break;
								
								}$error[] = sprintf( $vars['_lang']['invoice_mgs_invoice_not_exists'], $invoice_id );
								break;
								}
//////////// test
								$error[] = sprintf( $vars['_lang']['invoice_mgs_invoice_not_exists'], $invoice_id );
								
							}

							break;
						}

						default: {
							$error[] = $vars['_lang']['invalid_action'];
							break;
						}
					}
				} 
else {
					if ($invoicing_action) {
						$info[] = $vars['_lang']['no_invoices_selected'];
					}
				}

				$search_post = (( sizeof((array)$_REQUEST['search'] ) && is_array( $_REQUEST['search'] ) ) ? $_REQUEST['search'] : array(  ));
				$search = array_merge( array( 'clientname' => '', 'status' => '', 'invoiceid' => '', 'paymentmethod' => '' ), $search_post );
				$search['status'] = (in_array( $search['status'], array( 'Unpaid', 'Paid', 'Refunded' ) ) ? $search['status'] : '');
				$search['invoiceid'] = (intval( $search['invoiceid'] ) ? intval( $search['invoiceid'] ) : '');
				
				//whmcs payment list
					$command = "GetPaymentMethods";
					$values = array();
				$whmcs_response = eFaturaWHMCS($command,$values);
				$paymentmethods = $whmcs_response['paymentmethods'];
				$gateways =  $paymentmethods['paymentmethod'];
				//whmcs payment list finish
			//	$gateways = showpaymentgatewayslist();
				$search['paymentmethod'] = (in_array( $search['paymentmethod'], array_keys( $gateways ) ) ? $search['paymentmethod'] : '');
				$pagenum = intval( $_REQUEST['pagenum'] );
				$pagenum = ($pagenum ? $pagenum : 1);
				$limit = 1200;
				$invoices = array(  );
				if ($_GET['sort'] == "DESC"){$sort = "ASC";} 
				else {$sort = "DESC";} 
				if (!empty($_GET['sortfield']))
				{
				$short.= "ORDER BY `".str_replace("`","``",$_GET['sortfield'])."` ".$sort;
				} else {
				$short .= "ORDER BY i.date ASC";
					}
				
				
				if ($search['enddate']){
				$ikimount = str_replace("/","-",$search['enddate']);
				$d = new DateTime($ikimount);

				$timestamp = $d->getTimestamp(); // Unix timestamp
				$enddate = $d->format('Y-m-d'); 
				$startdate = str_replace("/","-",$search['startdate']);
				$e = new DateTime($startdate);

				$timestamp = $e->getTimestamp(); // Unix timestamp
				$startdate = $e->format('Y-m-d'); 
			//	echo $search['startdate'];	
					
				}else{
					
					$enddate = date('Y-m-d',time());
					$search['enddate'] = date('d/m/Y',time());
					$startdate = date('Y-m-d', strtotime('-2 months'));
					$search['startdate'] = date('d/m/Y', strtotime('-2 months'));
				}

				$sql = 'SELECT i.*, c.firstname, c.lastname, c.companyname, IF(cy.code IS NOT NULL, cy.code, cry.code) as currency_code, IF(cy.prefix IS NOT NULL, cy.prefix, cry.prefix) as currency_prefix
				FROM tblinvoices as i
				INNER JOIN tblclients as c
				ON i.userid = c.id
				LEFT JOIN tblaccounts as t
				ON t.invoiceid = i.id
				LEFT JOIN tblcurrencies as cy
				ON c.currency = cy.id
				LEFT JOIN tblcurrencies as cry
				ON cry.default = 1
				WHERE date_format( i.date, \'%Y-%m-%d\') between "'.$startdate.'" and "'.$enddate.'"  AND  
				i.status ' . ($search['status'] ? ' = \'' . $search['status'] . '\'' : 'IN(\'Paid\',\'Unpaid\',\'Refunded\')') . '
				' . ($search['clientname'] ? 'AND UPPER(CONCAT_WS(\' \', c.firstname, c.lastname, c.companyname)) LIKE UPPER(\'%' . mysql_real_escape_string( $search['clientname'] ) . '%\')' : '') . '
				' . ($search['invoiceid'] ? 'AND i.id = \'' . $search['invoiceid'] . '\'' : '') . '
				' . ($search['paymentmethod'] ? 'AND i.paymentmethod = \'' . $search['paymentmethod'] . '\'' : '') . '
				
				GROUP BY i.id '.$short;
				$result = mysql_query( $sql );
				$total_invoices = mysql_num_rows( $result );
				$sql .= ' LIMIT ' . ( $pagenum * $limit - $limit ) . ( ',' . $limit );
				$result = mysql_query( $sql );
				
				while ($invoice_details = mysql_fetch_array( $result )) {
					$remote_invoices = array(  );
					$sql = 'SELECT document_type, invoice_url, time
					FROM mod_eFatura_invoices
					WHERE invoice_id = \'' . $invoice_details['id'] . '\'
					ORDER BY id ASC';
					$result2 = mysql_query( $sql );
				
					while ($remote_invoice_details = mysql_fetch_array( $result2 )) {
						$remote_invoices[] = $remote_invoice_details;
						
					}

					mysql_fetch_array( $result2 );
					$future_invoices = array(  );
					$sql = 'SELECT document_type, tip
					FROM mod_eFatura_future_invoices
					WHERE invoiceid = \'' . $invoice_details['id'] . '\'
					';
					$result2 = mysql_query( $sql );

					while ($future_invoice_details = mysql_fetch_array( $result2 )) {
						$future_invoices[] = $future_invoice_details;
						
					}

					mysql_fetch_array( $result2 );
					$invoices[] = array_merge( $invoice_details, array( 'invoices' => $remote_invoices, 'future_invoices' => $future_invoices ) );
			//		++$i;
				}

				mysql_fetch_array( $result );
				$total_pages = ceil( $total_invoices / $limit );
				$addl_url = ($search['startdate'] ? '&search[startdate]=' . $startdate : '') .($search['enddate'] ? '&search[enddate]=' . $enddate : '') .($search['clientname'] ? '&search[clientname]=' . $search['clientname'] : '') . ($search['status'] ? '&search[status]=' . $search['status'] : '') . ($search['invoiceid'] ? '&search[invoiceid]=' . $search['invoiceid'] : '') . ($search['paymentmethod'] ? '&search[paymentmethod]=' . $search['paymentmethod'] : '');
				$addl_url = $addl_url.'&sortfield='.$_GET['sortfield'].'&sort='.$_GET['sort'];

				if (sizeof((array) $error )) {
					echo '<div class="errorbox">
	<strong><span class="title">'.$vars['_lang']['error'].'</span></strong><br />
	';
					echo implode( '<br />', $error ).'</div>
';
				}

				

				if (sizeof((array) $success )) {
					echo '<div class="successbox">
	<strong><span class="title">'.$vars['_lang']['success'].'</span></strong><br />
	';
					echo implode( '<br />', $success ).'</div>
';
				}

				

				if (sizeof((array) $info )) {
					echo '<div class="infobox">
	<strong><span class="title">'.$vars['_lang']['info'].'</span></strong><br />
	';
					echo implode( '<br />', $info ).'</div>
';
				}
				

	

				echo '

<form method="post" action="'.$modulelink.'&page=invoices'.$addl_url.'">

<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
<tr>
	<td width="15%" class="fieldlabel">'.$vars['_lang']['client_name'].'</td>
	<td class="fieldarea"><input type="text" value="'.$search['clientname'].'" size="25" name="search[clientname]" /></td>
	<td class="fieldlabel">'.$vars['_lang']['status'].'</td>
	<td class="fieldarea">
		<select name="search[status]">
			<option value="">- Any -</option>
			<option ';

				if ($search['status'] == 'Unpaid') {
					echo 'selected="selected" ';
				}

				echo 'value="Unpaid">Ödenmedi</option>
			<option ';

				if ($search['status'] == 'Paid') {
					echo 'selected="selected" ';
				}

				echo 'value="Paid">Ödendi</option>
			<option ';

				if ($search['status'] == 'Refunded') {
					echo 'selected="selected" ';
				}

				echo 'value="Refunded">İade</option>
		</select>
	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_number'].'</td>
	<td class="fieldarea"><input type="text" value="'.$search['invoiceid'].'" size="8" name="search[invoiceid]" /></td>
	<td class="fieldlabel">'.$vars['_lang']['payment_method'].'</td>
	<td class="fieldarea">
		<select name="search[paymentmethod]">
			<option value="">- Any -</option>
			';
				foreach ($paymentmethods['paymentmethod'] as $gateway_sys => $gateway_data) {
					echo '			<option ';

					if ($search['paymentmethod'] == $gateway_data['displayname']) {
						echo 'selected="selected" ';
					}

					echo 'value="'.$gateway_data['module'].'">'.$gateway_data['displayname'].'</option>
			';
				}
			
				

				echo '		</select>
	</td>
</tr>



	<td class="fieldlabel">Tarih Aralığı</td>
	<td class="fieldarea">Başlangıç Tarihi: <input type="text"  value="'.$search['startdate'].'" size="8" name="search[startdate]"  class="datepick" /> Bitiş Tarihi: <input type="text" value="'.$search['enddate'].'" size="8" name="search[enddate]" class="datepick"/></td>

</tr>



</tbody>
</table>

<img width="1" height="5" src="images/spacer.gif"><br>

<div align="center">
	<input type="submit" class="btn btn-default" value="Search" />
</div>
</form>

<form action="'.$modulelink.'&page=invoices.'.$addl_url.'" method="post">

<table width="100%" cellspacing="0" cellpadding="3" border="0">
<tbody>
<tr>
	<td width="50%" align="left">'.$total_invoices.' Kayıt bulundu, Bulunduğunuz sayfa '.$pagenum.' toplam sayfa '.$total_pages.'</td>
	<td width="50%" align="right">
		Bulunduğunuz Sayfa: 
		<select onchange="submit()" name="pagenum">
			';
				$i = 0;

				while ($i < $total_pages + 1) {
					echo '			<option ';

					if ($i == $pagenum) {
						echo 'selected="selected" ';
					}

					echo 'value="'.$i.'">'.$i.'</option>
			';
					++$i;
				}
			$ilerilink = $modulelink.'&page=invoices&pagenum='.$pageno . $addl_url;
				echo '		</select> 
		<input type="submit" value="Git" />
	</td>
</tr>
</tbody>
</table>

<input type="hidden" name="search[clientname]" value="'.$search['clientname'].'" />
<input type="hidden" name="search[status]" value="'.$search['status'].'" />
<input type="hidden" name="search[invoiceid]" value="'.$search['invoiceid'].'" />
<input type="hidden" name="search[paymentmethod]" value="'.$search['paymentmethod'].'" />

</form>
<script type="text/javascript" src="../modules/addons/eFatura/waitingfor.js"></script>

<form action="'.$modulelink.'&page=invoices'.$addl_url.'" method="post">
	<div class="tablebg">
		<table width="100%" cellspacing="1" cellpadding="3" border="0" class="datatable">
		<tbody>
		<tr>

			<th width="20"><input type="checkbox" id="checkall" /></th>
			<th><a href="'.$ilerilink.'&sortfield=id&sort='.$sort.'">'.$vars['_lang']['invoice_number'].'</a></th>
			<th><a href="'.$ilerilink.'&sortfield=date&sort='.$sort.'">Fatura Tipi</th>
			<th><a href="'.$ilerilink.'&sortfield=firstname&sort='.$sort.'">'.$vars['_lang']['client_name'].'</a></th>
			
			<th><a href="'.$ilerilink.'&sortfield=date&sort='.$sort.'">'.$vars['_lang']['invoice_date'].'</a></th>
			<!--th>'.$vars['_lang']['due_date'].'</th-->
			<th><a href="'.$ilerilink.'&sortfield=datepaid&sort='.$sort.'">'.$vars['_lang']['date_paid'].'</a></th>
			<th>'.$vars['_lang']['total'].'</th>
			<th>'.$vars['_lang']['payment_method'].'</th>
			<th>'.$vars['_lang']['status'].'</th>
			<th>'.$vars['_lang']['creation_log'].'</th>
			<th>'.$vars['_lang']['documents'].'</th>
		</tr>
		';
		
				if (sizeof((array) $invoices )) {
				//	echo '		';
					foreach ($invoices as $invoice) {
						if($invoice['companyname'])
						{
						$names = $invoice['firstname'] . ' ' . $invoice['lastname'].' - ' . $invoice['companyname'];
						}else{$names = $invoice['firstname'] . ' ' . $invoice['lastname'];}

						$gateway_details = getGatewayVariables( $invoice['paymentmethod'] );
					//	$invoice_details['tip']
				
						echo '<tr>
			<td><input type="checkbox" class="checkall" value="'.$invoice['id'].'" name="selectedinvoices[]" /></td>
			<td><a href="invoices.php?action=edit&amp;id='.$invoice['id'].'">'.$invoice['id'].'</a></td>
			<td><a href="invoices.php?action=edit&amp;id='.$invoice['id'].'"><span class="text';
					//$tip = 'e-Arşiv';
					foreach ($invoice['future_invoices'] as $future_invoice) {
						
						//	var_dump($future_invoice['tip']);
					if($future_invoice['tip'] == 1) {
							$tip = 'e-Arşiv';
							echo 'green';
						} elseif($future_invoice['tip'] == 2) {
							$tip = 'e-Fatura';
							echo 'green';
							
						}elseif($future_invoice['tip'] == 3) {
							$tip = 'e-Arşiv';
							echo 'red';
							
						}elseif($future_invoice['tip'] == 4) {
							$tip = 'e-Arşiv';
							echo 'red';
							
						}
							}
			
			
			 if($invoice['datepaid']== "0000-00-00 00:00:00") $datepaid = ''; else $datepaid = date("d/m/Y H:i", strtotime($invoice['datepaid']));
					
						echo '">'.$tip.'</span></a></td>
			<td><a href="clientssummary.php?userid='.$invoice['userid'].'">'.$names.'</a></td>
			<td>'.date("d/m/Y", strtotime($invoice['date'])).'</td>
			<td>'.$datepaid.'</td>
			<td>'.$invoice['currency_prefix'] . ($invoice['total'] + $invoice['credit']) . ' ' . $invoice['currency_code'].'</td>
			<td style="text-align: center;">'.$gateway_details['name'].'</td>
			<td style="text-align: center;"><span class="text';

						if ($invoice['status'] == 'Paid') {
							echo 'green';
						} 
else {
							if ($invoice['status'] == 'Unpaid') {
								echo 'red';
							} 
else {
								echo 'blue';
							}
						}

						echo '">'.$invoice['status'].'</span></td>
			<td>
				';

						if (( sizeof((array) $invoice['invoices'] ) || sizeof((array) $invoice['future_invoices'] ) )) {
							echo '<ul>
					';
							foreach ($invoice['invoices'] as $remote_invoice) {
								echo '<li style="list-style: square !important;">'.$tip.'- <span class="textgreen">'.$vars['_lang']['created'].'</span> '.$vars['_lang']['on'].' ';
								echo date( 'd-m-Y H:i', $remote_invoice['time'] ).'</li>
					';
							}

							echo '	';
							foreach ($invoice['future_invoices'] as $future_invoice) {
								echo '	<li style="list-style: circle !important;">'.$tip.' - <span class="textblue">'.$vars['_lang']['pending_daily_cron'].'</span></li>
					';
							}

							echo '</ul>
				';
						} 
else {
							echo '<span class="textred">'.$vars['_lang']['ignored'].'</span>
				';
						}

						echo '</td>	<td>';

						if (sizeof((array) $invoice['invoices'] )) {
							echo '<ul>';
							foreach ($invoice['invoices'] as $remote_invoice) {
								echo '<li><a target="_blank" href="'.$remote_invoice['invoice_url'].'">'.$vars['_lang']['button_' . strtolower( $remote_invoice['document_type'] )].'</a></li>
					';
							}

							echo '</ul>';
						} 
else {
							echo '-';
						}

						echo '			</td>
		</tr>
		';
					}

					echo '		';
				} else {
					echo '		<tr>
			<td colspan="100">'.$vars['_lang']['no_records'].'</td>
		</tr>
		';
				}

				echo '		</tbody>
		</table>
	</div>'.$vars['_lang']['with_selected'].':
	<input type="submit" onclick="return confirm(\''.$vars['_lang']['create_documents_confirm'].'\')"  name="create" class="btn btn-default" value="'.$vars['_lang']['create_documents'].'" /> 
	<input type="submit" onclick="return confirm(\'E-Fatura Mükellef\')"  name="emukellef" class="btn btn-default" value="E-Fatura Mükellef" /> 
	<input type="submit" onclick="return confirm(\''.$vars['_lang']['create_refund_confirm'].'\')" name="refund" class="btn btn-info" value="'.$vars['_lang']['create_refund'].'" /> 
	<input type="submit" onclick="return confirm(\''.$vars['_lang']['cancel_all_future_confirm'].'\')" name="cancel" class="btn btn-danger" value="'.$vars['_lang']['cancel_all_future'].'" /> 
	<input type="submit" onclick="waitingDialog.show(\'Faturanız Gönderiliyor Lütfen Bekleyiniz..\', {progressType: \'success\'});" name="generate" class="btn btn-success" value="'.$vars['_lang']['create_all_future'].'" /> 
		
	
	<input type="hidden" name="pagenum" value="'.$pagenum.'" />
	<input type="hidden" name="search[clientname]" value="'.$search['clientname'].'" />
	<input type="hidden" name="search[status]" value="'.$search['status'].'" />
	<input type="hidden" name="search[invoiceid]" value="'.$search['invoiceid'].'" />
	<input type="hidden" name="search[paymentmethod]" value="'.$search['paymentmethod'].'" />
</form>

<p align="center">	';

	if (1 < $pagenum) {
			$pageno = $pagenum - 1;
			$gerilink = $modulelink.'&page=invoices&pagenum='.$pageno . $addl_url;
			$geri ="previous";
		} else {
					$gerilink ='#';
					$geri = 'previous disabled';	
				}

	if ($pagenum < $total_pages) {
			$pageno = $pagenum + 1;
			$ileri = "next";
			$ilerilink = $modulelink.'&page=invoices&pagenum='.$pageno . $addl_url;
				
		} else {
					$ilerilink ='#';
					$ileri = 'next disabled';
				}

				echo '</p>
				<ul class="pager"><li class="'.$geri.'"><a href="'.$gerilink.'">&laquo; &laquo; Önceki Sayfa</a></li><li class="'.$ileri.'"><a href="'.$ilerilink.'">Sonraki Sayfa &raquo; &raquo;</a></li></ul>

';
				break;
			}

	
			case 'documents': {
				$action = $_REQUEST['action'];
				$document_id = intval( $_REQUEST['id'] );
				switch ($action) {
					case 'delete': {
						if ($document_id) {
							$sql = 'DELETE
							FROM mod_eFatura_invoices
							WHERE id = \'' . $document_id . '\'';

							if (mysql_query( $sql )) {
								$success[] = 'Document deleted successfully';
								break;
							} 
else {
								$error[] = 'SQL Error: ' . mysql_error(  );
								break;
							}
						} 
else {
							$error[] = 'You didn\'t provided any document id';
						}
					}
					case 'esend': {
						if ($document_id) {
							$sql = 'DELETE
							FROM mod_eFatura_invoices
							WHERE id = \'' . $document_id . '\'';

							if (mysql_query( $sql )) {
								$success[] = 'Document deleted successfully';
								break;
							} 
else {
								$error[] = 'SQL Error: ' . mysql_error(  );
								break;
							}
						} 
else {
							$error[] = 'You didn\'t provided any document id';
						}
					}
			case 'smssend': {
				
				/*
						if ($document_id) {
							$sql = 'DELETE
							FROM mod_eFatura_invoices
							WHERE id = \'' . $document_id . '\'';

							if (mysql_query( $sql )) {
								$success[] = 'Document deleted successfully';
								break;
							} 
						else {
								$error[] = 'SQL Error: ' . mysql_error(  );
								break;
							}
						} 
				else {
							$error[] = 'You didn\'t provided any document id';
						}
					*/	
						
						
					}
					
				}
			$selecteddocuments = array();
				$selecteddocuments = $_REQUEST['selecteddocuments'];

				if (sizeof((array)$selecteddocuments )) {
					foreach ($selecteddocuments as $documentid) {
						$sql = 'SELECT * FROM `mod_eFatura_invoices` WHERE id='.$documentid;
								$result = mysql_query( $sql );
							//	$faturavar = mysql_fetch_assoc( $result );
								
					if($faturavar = mysql_fetch_assoc( $result )){
					if (isset( $_REQUEST['delete'] )) {
						$sql = 'DELETE
						FROM mod_eFatura_invoices
						WHERE id='.$documentid;

						if (mysql_query( $sql )) {
							$success[] = 'The selected documents was deleted successfully';
						} 
else {
							$error[] = 'SQL Error: ' . mysql_error(  );
						}
					} 
					
					elseif (isset( $_REQUEST['esend'] )) {
						require_once("class_eFatura.php");
						$efatura = new efatura();
						
						
						
							
						//$sonuc = $efatura->sendEmails('e-Fatura Bilgilendirme', $faturavar['invoice_id'], $efatura->config); 
						//$sonuc = $efatura->sendInvoice($userid, $func_messagename, $faturavar, $client_details, $invoice_data);
						//$sonuc = $efatura->sendDocuments( $faturavar['client_id'], 'eFatura ' . $doctype . ' Confirmation', array( $invoice_details ), $client_details, $invoice_data, $this->config);
					//	$sonuc = $efatura->sendDocuments( 1, 'e-Fatura Bilgilendirme', array( $invoice_details ), $client_details, $invoice_data);
						
						$sonuc = $efatura->sendDocuments2($faturavar, 'eFatura Documents Resend', $eFatura->config);
						
						if ($sonuc){$success[] = sprintf( $vars['_lang']['future_created_mail'], $faturavar['invoice_id'], $faturavar['document_unique_id']);}
						else{$error[] =sprintf( $vars['_lang']['mail_send_error'], $faturavar['invoice_id'], $faturavar['document_unique_id']);}
						
						
						
						}
				
					elseif (isset( $_REQUEST['smssend'] )) {
						require_once("class_eFatura.php");
						$efatura = new efatura();
							
						$sonuc = $efatura->sendSMS('e-Fatura Bilgilendirme',array($documentid), $efatura->config);
						if ($sonuc){$success[] = sprintf( $vars['_lang']['future_created_sms'], $faturavar['invoice_id'], $faturavar['document_unique_id']);}
						else{$error[] =sprintf( $vars['_lang']['sms_send_error'], $faturavar['invoice_id'], $faturavar['document_unique_id']);}
						
						
						
						}  
else {
						$error[] = $vars['_lang']['invalid_action'];
					}
					
				}	
					
				}
			}	
else {
					if ($_REQUEST['delete'] || $_REQUEST['esend'] || $_REQUEST['smssend']) {
						$info[] = $vars['_lang']['no_invoices_selected'];
					}
				}

				$search_post = (( sizeof((array) $_REQUEST['search'] ) && is_array( $_REQUEST['search'] ) ) ? $_REQUEST['search'] : array(  ));
				$search = array_merge( array( 'clientname' => '', 'documentid' => '', 'invoiceid' => '' ), $search_post );
				$search['invoiceid'] = (intval( $search['invoiceid'] ) ? intval( $search['invoiceid'] ) : '');
				$search['documentid'] = (intval( $search['documentid'] ) ? intval( $search['documentid'] ) : '');
				$pagenum = intval( $_REQUEST['pagenum'] );
				$pagenum = ($pagenum ? $pagenum : 1);
				$limit = 1200;
				$documents = array(  );
					if ($_GET['sort'] == "DESC"){$sort = "ASC";} 
				else {$sort = "DESC";} 
				if (!empty($_GET['sortfield']))
				{
				$short.= "ORDER BY `".str_replace("`","``",$_GET['sortfield'])."` ".$sort."";
				} else {
				$short .= "ORDER BY d.document_unique_id DESC";
					}
				$sql = 'SELECT d.*, i.id as invoice_exists, i.total, c.id as userid, c.firstname, c.lastname, IF(cy.code IS NOT NULL, cy.code, cry.code) as currency_code, IF(cy.prefix IS NOT NULL, cy.prefix, cry.prefix) as currency_prefix
				FROM mod_eFatura_invoices as d
				LEFT JOIN tblinvoices as i
				ON i.id = d.invoice_id
				LEFT JOIN tblclients as c
				ON d.client_id = c.id
				LEFT JOIN tblaccounts as t
				ON t.invoiceid = i.id
				LEFT JOIN tblcurrencies as cy
				ON c.currency = cy.id
				LEFT JOIN tblcurrencies as cry
				ON cry.default = 1
				WHERE d.id > 0
				' . ($search['clientname'] ? 'AND UPPER(CONCAT_WS(\' \', c.firstname, c.lastname)) LIKE UPPER(\'%' . mysql_real_escape_string( $search['clientname'] ) . '%\')' : '') . '
				' . ($search['documentid'] ? 'AND d.document_id = \'' . $search['documentid'] . '\'' : '') . '
				' . ($search['invoiceid'] ? 'AND i.id = \'' . $search['invoiceid'] . '\'' : '') . '
				GROUP BY d.id '.$short;
				$result = mysql_query( $sql );
				$total_documents = mysql_num_rows( $result );
				$sql .= ' LIMIT ' . ( $pagenum * $limit - $limit ) . ( ',' . $limit );
				$result = mysql_query( $sql );
				$z = 0;
				while ($document_details = mysql_fetch_array( $result )) {
					$documents[$z] = $document_details;
					++$z;
				}

				mysql_fetch_array( $result );
				$total_pages = ceil( $total_documents / $limit );
				$addl_url = ($search['clientname'] ? '&search[clientname]=' . $search['clientname'] : '') . ($search['documentid'] ? '&search[documentid]=' . $search['documentid'] : '') . ($search['invoiceid'] ? '&search[invoiceid]=' . $search['invoiceid'] : '');
				$addl_url = $addl_url.'&sortfield='.$_GET['sortfield'].'&sort='.$_GET['sort'];
				
				if (sizeof((array) $error )) {
					echo '<div class="errorbox">
	<strong><span class="title">'.$vars['_lang']['error'].'</span></strong><br />
	';
					echo implode( '<br />', $error ).'</div>
';
				}

				

				if (sizeof((array)$success )) {
					echo '<div class="successbox">
	<strong><span class="title">'.$vars['_lang']['success'].'</span></strong><br />
	';
					echo implode( '<br />', $success ).'</div>
';
				}

				

				if (sizeof((array) $info )) {
					echo '<div class="infobox">
	<strong><span class="title">'.$vars['_lang']['info'].'</span></strong><br />
	';
					echo implode( '<br />', $info ).'</div>
';
				}

				echo '
<form method="post" action="'.$modulelink.'&page=documents">

<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['document_number'].'</td>
	<td class="fieldarea"><input type="text" value="'.$search['documentid'].'" size="8" name="search[documentid]" /></td>
	<td width="15%" class="fieldlabel">'.$vars['_lang']['client_name'].'</td>
	<td class="fieldarea"><input type="text" value="'.$search['clientname'].'" size="25" name="search[clientname]" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_number'].'</td>
	<td class="fieldarea"><input type="text" value="'.$search['invoiceid'].'" size="8" name="search[invoiceid]" /></td>
</tr>
</tbody>
</table>

<img width="1" height="5" src="images/spacer.gif"><br>

<div align="center">
	<input type="submit" class="btn btn-default" value="Search" />
</div>
</form>

<form action="'.$modulelink.'&page=documents" method="post">

<table width="100%" cellspacing="0" cellpadding="3" border="0">
<tbody>
<tr>
	<td width="50%" align="left">'.$total_documents.' kayıt bulundu, Bulunduğunuz sayfa '.$pagenum.' toplam Sayfa '.$total_pages.'</td>
	<td width="50%" align="right">
		Bulunduğunuz sayfa: 
		<select onchange="submit()" name="pagenum">
			';
				$i = 0;

				while ($i < $total_pages + 1) {
					echo '			<option ';

					if ($i == $pagenum) {
						echo 'selected="selected" ';
					}

					echo 'value="'.$i.'">'.$i.'</option>
			';
					++$i;
				}

				echo '		</select> 
		<input type="submit" value="Git" />
	</td>
</tr>
</tbody>
</table>

<input type="hidden" name="search[clientname]" value="'.$search['clientname'].'" />
<input type="hidden" name="search[invoiceid]" value="'.$search['invoiceid'].'" />
<input type="hidden" name="search[documentid]" value="'.$search['documentid'].'" />

</form>

<form action="'.$modulelink.'&page=documents" method="post">
	<div class="tablebg">
		<table width="100%" cellspacing="1" cellpadding="3" border="0" class="datatable">
		<tbody>
		<tr>
			<th width="20"><input type="checkbox" id="checkall" /></th>
			<th>'.$vars['_lang']['document_number'].'</th>
			<th><a href="addonmodules.php?module=eFatura&page=documents&sortfield=invoice_id&sort='.$sort.'">'.$vars['_lang']['invoice_number'].'</a></th>
			<th><a href="addonmodules.php?module=eFatura&page=documents&sortfield=document_unique_id&sort='.$sort.'">'.$vars['_lang']['r_invoice_number'].'</a></th>
			<th>'.$vars['_lang']['invoice_total'].'</th>
			<th><a href="addonmodules.php?module=eFatura&page=documents&sortfield=firstname&sort='.$sort.'">'.$vars['_lang']['client_name'].'</a></th>
			<th><a href="addonmodules.php?module=eFatura&page=documents&sortfield=time&sort='.$sort.'">'.$vars['_lang']['document_date'].'</a></th>
			<th>'.$vars['_lang']['downloads'].'</th>
			<th width="20"></th>
		</tr>
		';

				if (sizeof((array) $documents )) {
					echo '		';
					foreach ($documents as $document) {
						echo '		<tr>
			<td><input type="checkbox" class="checkall" value="'.$document['id'].'" name="selecteddocuments[]" /></td>
			<td style="text-align: center;"><a style="width: 90px;text-decoration: none; color: #000;" target="_blank" href="'.$document['invoice_url'].'">'.$document['document_id'].'</a></td>
			
			<td style="text-align: center;">
				';

						if ($document['invoice_exists']) {
							echo '<a href="invoices.php?action=edit&amp;id='.$document['invoice_id'].'">'.$document['invoice_id'].'</a>
				';
						} 
else {
							echo ''.$document['invoice_id'].'';
						}

						echo '			</td>
<td style="text-align: center;">
				';

						if ($document['invoice_exists']) {
							echo '<a href="invoices.php?action=edit&amp;id='.$document['document_unique_id'].'">'.$document['document_unique_id'].'</a>
				';
						} 
else {
							echo ''.$document['document_unique_id'].'';
						}

						echo '			</td>						
						
			<td style="text-align: center;">
				';

						if ($document['invoice_exists']) {
							echo ''.$document['currency_prefix'] . $document['total'] . ' ' . $document['currency_code'].'';
						} 
else {
							echo '<span style="font-weight: bold;" class="textred">'.$vars['_lang']['invoice_deleted'].'</span>
				';
						}

						echo '			</td>
			<td style="text-align: center;">
				';

						if ($document['userid']) {
							echo '<a href="clientssummary.php?userid='.$document['userid'].'">'.$document['firstname'] . ' ' . $document['lastname'].'</a>
				';
						} 
else {
							echo '<span style="font-weight: bold;" class="textred">'.$vars['_lang']['client_deleted'].'</span>
				';
						}

						echo '			</td>
			<td style="text-align: center;">'.date( 'd F Y H:i', $document['time'] );
						echo '</td>
			<td style="text-align: center;"><a class="btn" style="width: 90px;text-decoration: none; color: #000;" target="_blank" href="'.$document['invoice_url'].'">'.$document['document_type'].'</a></td>
			<td>
				<a  onclick="return confirm(\''.$vars['_lang']['delete_document_confirm'].'\')" href="'.$modulelink.'&page=documents&action=delete&id='.$document['id'].($pagenum ? '&pagenum=' . $pagenum : '');
						echo '">
					<img width="16" height="16" border="0" alt="Delete" src="images/delete.gif" />
				</a>
			</td>
		</tr>
		';
					}

					echo '		';
				} 
else {
					echo '		<tr>
			<td colspan="100">'.$vars['_lang']['no_records'].'</td>
		</tr>
		';
				}

				echo '		</tbody>
		</table>
	</div>
<script type="text/javascript" src="../modules/addons/eFatura/waitingfor.js"></script>
	'.$vars['_lang']['with_selected'].':
	
	esend_documents_confirm
 
	<input type="submit" onclick="if(!confirm(\'Seçilen e-faturaların SMS olarak gönderilmesini istiyor musunuz?\'))return false; waitingDialog.show(\'Seçilen faturalar SMS olarak gönderiliyor..\', {progressType: \'success\'});" name="smssend" class="btn btn-success" value="SMS Gönder" /> 
	<input type="submit" onclick="if(!confirm(\''.$vars['_lang']['esend_documents_confirm'].'\'))return false; waitingDialog.show(\''.$vars['_lang']['esend_documents_confirm_wait'].'\', {progressType: \'success\'});" name="esend" class="btn btn-success" value="'.$vars['_lang']['esend_documents'].'" /> 
	<input type="submit" onclick="return confirm(\''.$vars['_lang']['delete_documents_confirm'].'\')" name="delete" class="btn btn-danger" value="'.$vars['_lang']['delete_documents'].'" /> 
	
	<input type="hidden" name="pagenum" value="'.$pagenum.'" />
	<input type="hidden" name="search[clientname]" value="'.$search['clientname'].'" />
	<input type="hidden" name="search[invoiceid]" value="'.$search['invoiceid'].'" />
	<input type="hidden" name="search[documentid]" value="'.$search['documentid'].'" />
</form>

<p align="center">
	';

				if (1 < $pagenum) {
			$pageno = $pagenum - 1;
			$gerilink = $modulelink.'&page=documents&pagenum='.$pageno . $addl_url;
			$geri ="previous";
		} else {
					$gerilink ='#';
					$geri = 'previous disabled';	
				}

	if ($pagenum < $total_pages) {
			$pageno = $pagenum + 1;
			$ileri = "next";
			$ilerilink = $modulelink.'&page=documents&pagenum='.$pageno . $addl_url;
				
		} else {
					$ilerilink ='#';
					$ileri = 'next disabled';
				}

				echo '</p>
				<ul class="pager"><li class="'.$geri.'"><a href="'.$gerilink.'">&laquo; &laquo; Önceki Sayfa</a></li><li class="'.$ileri.'"><a href="'.$ilerilink.'">Sonraki Sayfa &raquo; &raquo;</a></li></ul>

';
				break;
			}

			case 'logs': {
				
				$logs = array(  );
				$sql = 'SELECT *
				FROM mod_eFatura_logs
				WHERE parent_id = 0
				ORDER BY id DESC LIMIT 10';
				$result = mysql_query( $sql );
				$i = 0;
				while ($log_details = mysql_fetch_array( $result )) {
					$sublogs = array(  );
					$sql = 'SELECT *
					FROM mod_eFatura_logs
					WHERE parent_id = \'' . $log_details['id'] . '\'
					ORDER BY id ASC';
					$result2 = mysql_query( $sql );
					$v = 0;
					while ($sublog_details = mysql_fetch_array( $result2 )) {
						$sublogs[$v] = $sublog_details;
						++$v;
					}

					mysql_fetch_array( $result2 );
					$logs[$i] = array_merge( $log_details, array( 'sublogs' => $sublogs ) );
					++$i;
				}

				mysql_fetch_array( $result ).'<div class="tablebg">
	<table width="100%" cellspacing="1" cellpadding="3" border="0" class="datatable">
	<tbody>
	<tr>
		<th style="width: 50px;">'.$vars['_lang']['log_number'].'</th>
		<th style="width: 160px;">'.$vars['_lang']['log_date'].'</th>
		<th>'.$vars['_lang']['message'].'</th>
	</tr>
	';

				if (sizeof((array) $logs )) {
					echo '	';
					foreach ($logs as $log) {
						echo '	<tr>
		<td>'.$log['id'].'</td>
		<td>'.date( 'd F Y H:i:s', $log['time'] );
						echo '</td>
		<td style="text-align: left;">'.$log['message'].'</td>
	</tr>
		';
						foreach ($log['sublogs'] as $sublog) {
							echo '		<tr>
			<td>'.$log['id'].'</td>
			<td>'.date( 'd F Y H:i:s', $sublog['time'] );
							echo '</td>
			<td style="text-align: left;">'.$sublog['message'].'</td>
		</tr>
		';
						}

						echo '	<tr>
		<td colspan="4" style="text-align: center; background: #fff !important;"><div style="border-top: 1px solid #000; margin-top: 10px;"><span style="background: #fff; margin-top: -10px; display: inline-block; padding: 0 10px;">'.sprintf( $vars['_lang']['end_of_log'], $log['id'] );
						echo '</span></div></td>
	</tr>
	';
					}

					echo '

	';
				} 
else {
					echo '	<tr>
		<td colspan="100">'.$vars['_lang']['no_records'].'</td>
	</tr>
	';
				}

				echo '	</tbody>
	</table>
</div>
';
				break;
			}

			case 'branches': {
				require_once( '../includes/countries.php' );
				$success = $error = $branches = $excludeCountries = array(  );
				$availableCountries = $countries;
				$sql = 'SELECT *
				FROM mod_eFatura_branches';
				$result = mysql_query( $sql );

				while ($branch_details = mysql_fetch_array( $result )) {
					$branches[$branch_details['id']] = $branch_details;
					$excludeCountries[$branch_details['country']] = $countries[$branch_details['country']];
					unset( $availableCountries[$branch_details['country']] );
				}

				mysql_fetch_array( $result );

				if ($_POST['submit']) {
					$defaultBranch = intval( $_POST['config']['branch'] );

					if ($defaultBranch != $eFatura->config['branch']) {
						$eFatura->setConfig( 'branch', $defaultBranch );
						$success[] = 'Default branch updated successfully';
					}

					$postBranches = $_POST['branches'];

					if (( ( isset( $postBranches ) && is_array( $postBranches ) ) && sizeof((array) $postBranches ) )) {
						foreach ($postBranches as $branch_id => $branch_data) {

							if (in_array( $branch_id, array_keys( $branches ) )) {
								if (isset( $branch_data['delete'] )) {
									$sql = 'DELETE
									FROM mod_eFatura_branches
									WHERE id = \'' . $branch_id . '\'';
									mysql_query( $sql );
									$success[] = '' . $countries[$branches[$branch_id]['country']] . ' branch delete successfully';
									$availableCountries[$branches[$branch_id]['country']] = $excludeCountries[$branches[$branch_id]['country']];
									unset( $excludeCountries[$branches[$branch_id]['country']] );
									unset( $branches[$branch_id] );
									continue;
								}


								if (0 < intval( $branch_data['branch'] )) {
									if (intval( $branch_data['branch'] ) != $branches[$branch_id]['branch_id']) {
										$sql = 'UPDATE mod_eFatura_branches
										SET branch_id = \'' . intval( $branch_data['branch'] ) . '\'
										WHERE id = \'' . intval( $branch_id ) . '\'';
										mysql_query( $sql );
										$branches[$branch_id] = array_merge( $branches[$branch_id], array( 'branch_id' => intval( $branch_data['branch'] ) ) );
										$success[] = '' . $countries[$branches[$branch_id]['country']] . ' branch updated successfully';
										continue;
									}

									continue;
								}

								$error[] = 'No branch id provided for ' . $countries[$branches[$branch_id]['country']] . ' branch';
								continue;
							}

							$error[] = 'The branch that you provided (#' . $branch_id . ') not exists';
						}
					}

					$newBranch = $_POST['newbranch'];

					if (( ( $newBranch['country'] && isset( $countries[$newBranch['country']] ) ) && 0 < intval( $newBranch['branch'] ) )) {
						$sql = 'INSERT INTO mod_eFatura_branches (`country`,`branch_id`) VALUES
						(\'' . mysql_real_escape_string( $newBranch['country'] ) . '\',\'' . intval( $newBranch['branch'] ) . '\')';
						mysql_query( $sql );
						$branch_details = array( 'id' => mysql_insert_id(  ), 'country' => $newBranch['country'], 'branch_id' => intval( $newBranch['branch'] ) );
						$branches[$branch_details['id']] = $branch_details;
						$success[] = '' . $countries[$newBranch['country']] . ' branch Created successfully';
					}
				}


				if (sizeof((array) $error )) {
					echo '<div class="errorbox">
	<strong><span class="title">'.$vars['_lang']['error'].'</span></strong><br />
	';
					echo implode( '<br />', $error ).'</div>
';
				}

				

				if (sizeof((array) $success )) {
					echo '<div class="successbox">
	<strong><span class="title">'.$vars['_lang']['success'].'</span></strong><br />
	';
					echo implode( '<br />', $success ).'</div>
';
				}

				echo '
<form action="'.$modulelink.'&page=branches" method="post">

<div class="tablebg">
	<table width="100%" cellspacing="1" cellpadding="3" border="0" class="datatable">
	<tbody>
	<tr>
		<th>Country</th>
		<th style="width: 200px;">eFatura Branch ID</th>
		<th style="width: 50px;">Delete</th>
	</tr>
	<tr>
		<td>Default</td>
		<td style="text-align: center;"><input type="text" name="config[branch]" value="'.$eFatura->config['branch'].'" /></td>
		<td></td>
	</tr>
	';
				foreach ($branches as $branch_details) {
					echo '	<tr>
		<td>'.$countries[$branch_details['country']].'</td>
		<td style="text-align: center;"><input type="text" name="branches['.$branch_details['id'].'][branch]" value="'.$branch_details['branch_id'].'" /></td>
		<td style="text-align: center;"><input type="checkbox" name="branches['.$branch_details['id'].'][delete]" value="1" /></td>
	</tr>
	';
				}

				echo '	<tr>
		<td colspan="3"><strong>Add New Country Branch</strong></td>
	</tr>
	<tr>
		<td>
			<select name="newbranch[country]">
				<option value="">- Select Country -</option>
				';
				foreach ($availableCountries as $country_iso => $country_name) {
					echo '<option value="'.$country_iso.'">'.$country_name.'</option>
				';
				}

				echo '			</select>
		</td>
		<td style="text-align: center;"><input type="text" name="newbranch[branch]" value="" /></td>
		<td></td>
	</tr>
	</tbody>
	</table>
</div>

<p align="center">
	<input type="submit" name="submit" class="btn btn-default" value="'.$vars['_lang']['save_changes'].'" />
</p>

</form>


';
				break;
			}

			case 'settings': {
			//	$efatura = new efatura();
			if (!class_exists( 'eFatura' )) {
			require( dirname( __FILE__ ) . '/class_eFatura.php' );
		}	
			$eFatura = new eFatura();
			
			$x = array(  );
			$sql = 'SELECT *
			FROM mod_eFatura_config';
			$result = mysql_query( $sql );
			
			while($config_details = mysql_fetch_array($result)) {
				$x[$config_details['name']] = $config_details['value'];
			}
			//$eFatura->config = mysql_fetch_array($result);
			//$conf1 = $efatura->getConfig();
		//	$eFatura->config = $x;
			//$X = $eFatura->getConfig();
			$eFatura->config = $eFatura->getConfig();
			var_dump($X);//x['username']);
				$success = $error = array(  );
				switch ($action) {
					case 'log_delete': {
						$sql = 'TRUNCATE mod_eFatura_logs';
									mysql_query( $sql );
					}
					
					case 'save': {
						$config_values = $_REQUEST['config'];

						if (sizeof((array) $config_values )) {
							$config_values['payment_types'] = (sizeof((array) $config_values['payment_types'] ) ? serialize( $config_values['payment_types'] ) : '');
							$config_values['payment_types_auto'] = (sizeof((array) $config_values['payment_types_auto'] ) ? serialize( $config_values['payment_types_auto'] ) : '');
							$config_values['creation_filter'] = (sizeof((array) $config_values['creation_filter'] ) ? serialize( $config_values['creation_filter'] ) : '');
							$old_username = $eFatura->config['username'];

							if (( ( $config_values['username'] && $config_values['password'] ) && $config_values['invoice_subject'] )) {
								if (( $old_username && $config_values['username'] != $old_username )) {
									$sql = 'TRUNCATE mod_eFatura_logs';
									mysql_query( $sql );
									$eFatura->changeUsername( $config_values['username'], $old_username, 'invoices' );
									$eFatura->changeUsername( $config_values['username'], $old_username, 'clients' );
								}

								foreach ($config_values as $config_key => $config_value) {
									$eFatura->setConfig( $config_key, $config_value );
								}

								$success[] = $vars['_lang']['settings_saved'];
							} 
else {
								if (!$config_values['username']) {
									$error[] = $vars['_lang']['api_username_empty'];
								}


								if (!$config_values['password']) {
									$error[] = $vars['_lang']['api_password_empty'];
								}


								if (!$config_values['invoice_subject']) {
									$error[] = $vars['_lang']['invoice_subject_empty'];
								}
								if (!$config_values['invoice_company']) {
									$error[] = $vars['_lang']['invoice_company_empty'];
								}
								if (!$config_values['invoice_company_vd']) {
									$error[] = $vars['_lang']['invoice_company_empty_vd'];
								}
								if (!$config_values['invoice_company_vn']) {
									$error[] = $vars['_lang']['invoice_company_empty_vn'];
								}
							}

							$eFatura->config = array_merge( $eFatura->config, $config_values );
							break;
						} 
else {
							$error[] = $vars['_lang']['no_config_values'];
						}
					}
				}

				$payment_types_auto = ($eFatura->config['payment_types_auto'] ? unserialize( $eFatura->config['payment_types_auto'] ) : array(  ));
				$payment_types = ($eFatura->config['payment_types'] ? unserialize( $eFatura->config['payment_types'] ) : array(  ));
				$creation_filter = ($eFatura->config['creation_filter'] ? unserialize( $eFatura->config['creation_filter'] ) : array(  ));
				$admins = array(  );
				$sql = 'SELECT username FROM tbladmins ORDER BY id ASC';
				$result = mysql_query( $sql );

				while ($admin_details = mysql_fetch_array( $result )) {
					$admins[] = $admin_details['username'];
				}

				mysql_fetch_assoc( $result );
				$customfields = array(  );
				$sql = 'SELECT id, fieldname
				FROM tblcustomfields
				WHERE type = \'client\'
				ORDER BY id ASC';
				$result = mysql_query($sql);
				
				while ($customfields_details = mysql_fetch_array($result)) {
					$customfields[$customfields_details['id']] = $customfields_details['fieldname'];
				}
			if (!class_exists( 'eFatura' )) {
			require( dirname( __FILE__ ) . '/class_eFatura.php' );
		}
				
	
				
				
				 logModuleCall('eFatura',$action,mysql_fetch_assoc($result), $params['Items'],  $params['Items'],$replacevars);  
				mysql_fetch_assoc( $result ).'';

				if (sizeof((array) $error )) {
					echo '<div class="errorbox">
	<strong><span class="title">'.$vars['_lang']['error'].'</span></strong><br />
	';
					echo implode( '<br />', $error ).'</div>
';
				}

				

				if (sizeof((array) $success )) {
					echo '<div class="successbox">
	<strong><span class="title">'.$vars['_lang']['success'].'</span></strong><br />
	';
					echo implode( '<br />', $success ).'</div>
';
				}

				echo '
<form action="'.$modulelink.'&page=settings" method="post">

<h2 style="margin: 20px 0 5px; font-weight: bold;">'.$vars['_lang']['general_settings'].'</h2>
<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['system_enabled'].'</td>
	<td class="fieldarea">
		<input type="radio"';
			
				if ($eFatura->config['system_enabled']) {
					echo ' checked="checked"';
				}
echo ' checked="checked"';
				echo ' name="config["system_enabled"]" value="1" /> '.$vars['_lang']['yes'].'		<input type="radio"';

				if (!$eFatura->config['system_enabled']) {
					echo ' checked="checked"';
				}

				echo '  name="config["system_enabled"]" value="0" /> '.$vars['_lang']['no'].'	</td>
</tr>
<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['demo'].'</td>
	<td class="fieldarea">
		<input type="radio"';

				if ($eFatura->config['system_demo']) {
					echo ' checked="checked"';
				}

				echo ' name="config[system_demo]" value="1" /> '.$vars['_lang']['yes'].'		<input type="radio"';

				if (!$eFatura->config['system_demo']) {
					echo ' checked="checked"';
				}

				echo '  name="config[system_demo]" value="0" /> '.$vars['_lang']['no'].'	</td>
</tr>
<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['auto_sms'].'</td>
	<td class="fieldarea">
		<input type="radio"';

				if ($eFatura->config['auto_sms']) {
					echo ' checked="checked"';
				}

				echo ' name="config[auto_sms]" value="1" /> '.$vars['_lang']['yes'].'		<input type="radio"';

				if (!$eFatura->config['auto_sms']) {
					echo ' checked="checked"';
				}

				echo '  name="config[auto_sms]" value="0" /> '.$vars['_lang']['no'].'	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['clients_visibility_enabled'].'</td>
	<td class="fieldarea">
		<input type="radio"';

				if ($eFatura->config['clients_visibility_enabled']) {
					echo ' checked="checked"';
				}

				echo ' name="config[clients_visibility_enabled]" value="1" /> '.$vars['_lang']['yes'].'		<input type="radio"';

				if (!$eFatura->config['clients_visibility_enabled']) {
					echo ' checked="checked"';
				}

				echo '  name="config[clients_visibility_enabled]" value="0" /> '.$vars['_lang']['no'].'	</td>
</tr>
<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['id_number'].'</td>	<td class="fieldarea">
				<select name="config[identity_fieldid]">
			<option value="0">'.$vars['_lang']['no_id_number'].'</option>
			';
				foreach ($customfields as $fieldid => $fieldname) {
					$selected = ($fieldid == $eFatura->config['identity_fieldid'] ? true : false);
					echo '<option value="'.$fieldid.'"';

					if ($selected) {
						echo ' selected="selected"';
					}

					echo '>'.$fieldname.'</option>';
				}

				echo '</select>
	</td>
</tr>

<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['id_name'].'</td>	<td class="fieldarea">
				<select name="config[identity_fieldname]">
			<option value="0">'.$vars['_lang']['no_id_name'].'</option>
			';
				foreach ($customfields as $fieldid => $fieldname) {
					$selected = ($fieldid == $eFatura->config['identity_fieldname'] ? true : false);
					echo '<option value="'.$fieldid.'"';

					if ($selected) {
						echo ' selected="selected"';
					}

					echo '>'.$fieldname.'</option>';
				}

				echo '</select>
	</td>
</tr>

<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['invoice_client_name'].'</td>
	<td class="fieldarea">
		<select name="config[invoice_client_name]">
			<option value="1"';

				if ($eFatura->config['invoice_client_name'] == 1) {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['fullname'].'</option>
			<option value="2"';

				if ($eFatura->config['invoice_client_name'] == 2) {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['companyname'].'</option>
			<option value="3"';

				if ($eFatura->config['invoice_client_name'] == 3) {
					echo ' selected="selected"';
				}

				echo '>('.$vars['_lang']['fullname'].') '.$vars['_lang']['companyname'].'</option>
			<option value="4"';

				if ($eFatura->config['invoice_client_name'] == 4) {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['fullname'].' ('.$vars['_lang']['companyname'].')</option>
			<option value="5"';

				if ($eFatura->config['invoice_client_name'] == 5) {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['fullname'].' - '.$vars['_lang']['companyname'].'</option>
			<option value="6"';

				if ($eFatura->config['invoice_client_name'] == 6) {
					echo ' selected="selected"';
				}

				echo '>('.$vars['_lang']['companyname'].') '.$vars['_lang']['fullname'].'</option>
			<option value="7"';

				if ($eFatura->config['invoice_client_name'] == 7) {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['companyname'].' ('.$vars['_lang']['fullname'].')</option>
			<option value="8"';

				if ($eFatura->config['invoice_client_name'] == 8) {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['companyname'].' - '.$vars['_lang']['fullname'].'</option>
		</select>
	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['api_username'].'</td>
	<td class="fieldarea"><input type="text" name="config[username]" value="'.$eFatura->config['username'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['api_password'].'</td>
	<td class="fieldarea"><input type="password" name="config[password]" value="'.$eFatura->config['password'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">Posta Kutusu Etiket</td>
	<td class="fieldarea"><input type="text" name="config[etiket]" value="'.$eFatura->config['etiket'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">Gönderici Birimi</td>
	<td class="fieldarea"><input type="text" name="config[gonderici]" value="'.$eFatura->config['gonderici'].'" /></td>
</tr>
</tbody>
</table>



<h2 style="margin: 20px 0 5px; font-weight: bold;">'.$vars['_lang']['cert_settings'].'</h2>
<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['exponent'].'</td>
	<td class="fieldarea"><input type="text" name="config[exponent]" value="'.$eFatura->config['exponent'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['DigestValue'].'</td>
	<td class="fieldarea"><input type="text" style="width: 500px;" name="config[DigestValue]" value="'.$eFatura->config['DigestValue'].'" /></td>
</tr>

<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['cert_modulus'].'</td>
	<td class="fieldarea"><textarea style="width: 700px; height: 105px;" name="config[modulus]">'.$eFatura->config['modulus'].'</textarea></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['X509SubjectName'].'</td>
	<td class="fieldarea"><input type="text" style="width: 500px;" name="config[X509SubjectName]" value="'.$eFatura->config['X509SubjectName'].'" /></td>
</tr>


<tr>
	<td class="fieldlabel">'.$vars['_lang']['X509SerialNumber'].'</td>
	<td class="fieldarea"><input type="text" style="width: 500px;" name="config[X509SerialNumber]" value="'.$eFatura->config['X509SerialNumber'].'" /></td>
</tr>

<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['X509Certificate'].'</td>
	<td class="fieldarea"><textarea style="width: 700px; height: 405px;" name="config[X509Certificate]">'.$eFatura->config['X509Certificate'].'</textarea></td>
</tr>

<tr>
	<td class="fieldarea"><input type="text" style="width: 500px;" name="config[X509IssuerName]" value="'.$eFatura->config['X509SubjectName'].'" /></td>
	<td class="fieldlabel">'.$vars['_lang']['X509IssuerName'].'</td>
</tr>

</tbody>
</table>



<h2 style="margin: 20px 0 5px; font-weight: bold;">'.$vars['_lang']['invoice_settings'].'</h2>
<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_tipi'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_tipi]" value="'.$eFatura->config['invoice_company_tipi'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company]" value="'.$eFatura->config['invoice_company'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_vd'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_vd]" value="'.$eFatura->config['invoice_company_vd'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_vn'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_vn]" value="'.$eFatura->config['invoice_company_vn'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_mn'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_mn]" value="'.$eFatura->config['invoice_company_mn'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_sn'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_tn]" value="'.$eFatura->config['invoice_company_tn'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_web'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_web]" value="'.$eFatura->config['invoice_company_web'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_email'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_email]" value="'.$eFatura->config['invoice_company_email'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_tel'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_tel]" value="'.$eFatura->config['invoice_company_tel'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_fax'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_fax]" value="'.$eFatura->config['invoice_company_fax'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_kn'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_kn]" value="'.$eFatura->config['invoice_company_kn'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_bn'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_bn]" value="'.$eFatura->config['invoice_company_bn'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_badi'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_badi]" value="'.$eFatura->config['invoice_company_badi'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_mahalle'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_mahalle]" value="'.$eFatura->config['invoice_company_mahalle'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_sokak'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_sokak]" value="'.$eFatura->config['invoice_company_sokak'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_ilce'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_ilce]" value="'.$eFatura->config['invoice_company_ilce'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_sehir'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_sehir]" value="'.$eFatura->config['invoice_company_sehir'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_company_pk'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_company_pk]" value="'.$eFatura->config['invoice_company_pk'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_start_n'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_start_n]" value="'.$eFatura->config['invoice_start_n'].'" /></td>
</tr>
<tr>

	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['invoice_language'].'</td>
	<td class="fieldarea">
		<select name="config[invoice_language]">
			<option value="user"';

				if ($eFatura->config['invoice_language'] == 'user') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['client_language'].'</option>
			<option value="default"';

				if ($eFatura->config['invoice_language'] == 'default') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['default_language'].'</option>
			<option value="override"';

				if ($eFatura->config['invoice_language'] == 'override') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['override_language'].'</option>
		</select>
	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['override_language'].'</td>
	<td class="fieldarea"><select name="config[override_language]">
			<option value="english"';

				if ($eFatura->config['override_language'] == 'english') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['english'].'</option>
			
			<option value="turkish"';

				if ($eFatura->config['override_language'] == 'turkish') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['turkish'].'</option>	
				
				<option value="hebrew"';

				if ($eFatura->config['override_language'] == 'hebrew') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['hebrew'].'</option>
		</select>
	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['pdf_prefix'].'</td>
	<td class="fieldarea"><input type="text" name="config[pdf_prefix]" value="'.$eFatura->config['pdf_prefix'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_calculate_tax'].'</td>
	<td class="fieldarea">
		<input type="radio" name="config[invoice_calculate_tax]"';

				if (!$eFatura->config['invoice_calculate_tax']) {
					echo ' checked="checked"';
				}

				echo ' value="0" /> '.$vars['_lang']['calculate_tax_no'].'		<input type="radio" name="config[invoice_calculate_tax]"';

				if ($eFatura->config['invoice_calculate_tax']) {
					echo ' checked="checked"';
				}

				echo ' value="1" /> '.$vars['_lang']['calculate_tax_yes'].'	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_remote_dates'].'</td>
	<td class="fieldarea">
		<input type="hidden" name="config[invoice_remote_dates]" value="0" />
		<input type="checkbox" name="config[invoice_remote_dates]"';

				if ($eFatura->config['invoice_remote_dates']) {
					echo ' checked="checked"';
				}

				echo ' value="1" /> '.$vars['_lang']['invoice_remote_dates_explain'].'	</td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_subject'].'</td>
	<td class="fieldarea"><input type="text" style="width: 400px;" name="config[invoice_subject]" value="'.$eFatura->config['invoice_subject'].'" /></td>
</tr>
<tr>
	<td class="fieldlabel">'.$vars['_lang']['invoice_comments'].'</td>
	<td class="fieldarea"><textarea style="width: 400px;" name="config[invoice_comments]">'.$eFatura->config['invoice_comments'].'</textarea></td>
</tr>
</tbody>
</table>

<script type="text/javascript">
$(document).ready(function() {

	$(\'input[name=config\\[auto_invoicing_enabled\\]]\').change(function() {

		if($(this).val() == 1)
		{
			$(\'.autoinvoicing\').fadeIn(\'slow\');
		}
		else
		{
			$(\'.autoinvoicing\').fadeOut(\'slow\');
		}
	});
});
</script>

<h2 style="margin: 20px 0 5px; font-weight: bold;">'.$vars['_lang']['auto_invoicing_creation'].'</h2>
<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
<tr>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['auto_invoicing_enabled'].'</td>
	<td class="fieldarea">
		<input type="radio"';

				if ($eFatura->config['auto_invoicing_enabled']) {
					echo ' checked="checked"';
				}

				echo ' name="config[auto_invoicing_enabled]" value="1" /> '.$vars['_lang']['yes'].'		<input type="radio"';

				if (!$eFatura->config['auto_invoicing_enabled']) {
					echo ' checked="checked"';
				}

				echo '  name="config[auto_invoicing_enabled]" value="0" /> '.$vars['_lang']['no'].'	</td>
</tr>
<tr class="autoinvoicing"';

				if (!$eFatura->config['auto_invoicing_enabled']) {
					echo ' style="display: none;"';
				}

				echo '>
	<td class="fieldlabel" style="width: 30%;">'.$vars['_lang']['creation_type'].'</td>
	<td class="fieldarea">
		<select name="config[creation_type]">
			<option value="instant"';

				if ($eFatura->config['creation_type'] == 'instant') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['instant_creation'].'</option>
			<option value="future"';

				if ($eFatura->config['creation_type'] == 'future') {
					echo ' selected="selected"';
				}

				echo '>'.$vars['_lang']['future_creation'].'</option>
		</select>
	</td>
</tr>
<tr class="autoinvoicing"';

				if (!$eFatura->config['auto_invoicing_enabled']) {
					echo ' style="display: none;"';
				}

				echo '>
	<td class="fieldlabel">'.$vars['_lang']['creation_conditions'].'</td>
	<td class="fieldarea">

		<!-- Defaults -->
		<input type="hidden" name="config[creation_filter][created][gateway]" value="0" />
		<input type="hidden" name="config[creation_filter][created][withoutgateway]" value="0" />
		<input type="hidden" name="config[creation_filter][paid][withtransid]" value="0" />
		<input type="hidden" name="config[creation_filter][paid][withinvoice]" value="0" />
		<input type="hidden" name="config[creation_filter][paid][gateway]" value="0" />
		<input type="hidden" name="config[creation_filter][refunded][document]" value="0" />

		<ul style="padding-left: 5px;">
			<li>
				';
				$filteractive = false;
				foreach ($creation_filter['created'] as $filter_active) {

					if ($filter_active) {
						$filteractive = true;
						break;
					}
				}

				echo '<strong>'.$vars['_lang']['on_invoice_created'];

				if (!$filteractive) {
					echo ' <span style="color: #CC0000;">('.$vars['_lang']['disabled'].')</span>';
				}

				echo '</strong>
				<div style="font-size: 10px;">('.$vars['_lang']['creating_invoice_doc'].' <span style="color: #CC0000;">'.$vars['_lang']['only_on_cron'].'</span>)</div>
				<ul style="margin: 10px 0;">
					<li><input type="checkbox"';

				if ($creation_filter['created']['gateway']) {
					echo ' checked="checked"';
				}

				echo ' name="config[creation_filter][created][gateway]" value="1" /> '.$vars['_lang']['with_selected_gateways'].'</li>
					<li><input type="checkbox"';

				if ($creation_filter['created']['withoutgateway']) {
					echo ' checked="checked"';
				}

				echo ' name="config[creation_filter][created][withoutgateway]" value="1" /> '.$vars['_lang']['with_unselected_gateways'].'</li>
				</ul>
			</li>
			<li>
				';
				$filteractive = false;
				foreach ($creation_filter['paid'] as $filter_active) {

					if ($filter_active) {
						$filteractive = true;
						break;
					}
				}

				echo '<strong>'.$vars['_lang']['on_invoice_paid'];

				if (!$filteractive) {
					echo ' <span style="color: #CC0000;">('.$vars['_lang']['disabled'].')</span>';
				}

				echo '</strong>
				<div style="font-size: 10px;">('.$vars['_lang']['creating_invoicereceipt_doc'].')</div>
				<ul style="margin: 10px 0;">
					<li><input type="checkbox"';

				if ($creation_filter['paid']['withtransid']) {
					echo ' checked="checked"';
				}

				echo ' name="config[creation_filter][paid][withtransid]" value="1" /> '.$vars['_lang']['require_gateway'].'</li>
					<li><input type="checkbox"';

				if ($creation_filter['paid']['gateway']) {
					echo ' checked="checked"';
				}

				echo ' name="config[creation_filter][paid][gateway]" value="1" /> '.$vars['_lang']['with_selected_gateways'].'</li>
					<li><input type="checkbox"';

				if ($creation_filter['paid']['withinvoice']) {
					echo ' checked="checked"';
				}

				echo ' name="config[creation_filter][paid][withinvoice]" value="1" /> '.$vars['_lang']['with_invoice_doc'].'</li>
				</ul>
			</li>
			<li>
				';
				$filteractive = false;
				foreach ($creation_filter['refunded'] as $filter_active) {

					if ($filter_active) {
						$filteractive = true;
						break;
					}
				}

				echo '<strong>'.$vars['_lang']['on_invoice_refunded'];

				if (!$filteractive) {
					echo ' <span style="color: #CC0000;">('.$vars['_lang']['disabled'].')</span>';
				}

				echo '</strong>
				<div style="font-size: 10px;">('.$vars['_lang']['creating_refund_doc'].')</div>
				<ul style="margin: 10px 0;">
					<li><input type="checkbox"';

				if ($creation_filter['refunded']['document']) {
					echo ' checked="checked"';
				}

				echo ' name="config[creation_filter][refunded][document]" value="1" /> '.$vars['_lang']['with_invoicereceipt_doc'].'</li>
				</ul>
			</li>
		</ul>
	</td>
</tr>
</tbody>
</table>

<h2 style="margin: 20px 0 5px; font-weight: bold;">'.$vars['_lang']['payment_gateways_types'].'</h2>
<table width="100%" cellspacing="2" cellpadding="3" border="0" class="form">
<tbody>
';
			//WHMCS API	paymentmethods
				$command = "GetPaymentMethods";
				$values = array();
				$whmcs_response = eFaturaWHMCS($command,$values);
				$paymentmethods = $whmcs_response['paymentmethods'];
				$gateways =  $paymentmethods['paymentmethod'];
				
			//WHMCS API	paymentmethods FINIS

			
				//$gateways = showpaymentgatewayslist(  );

				if (sizeof((array) $gateways )) {
					foreach ($gateways as $gateway => $gateway_data) {
						echo '<tr>
	<td class="fieldlabel" style="width: 30%;">'.$gateway_data['displayname'].'</td>
	<td class="fieldarea">
		<select name="config[payment_types]['.$gateway;
						echo ']">
			<option value="1"';

						if ($payment_types[$gateway] == 1) {
							echo ' selected="selected"';
						}

						echo '>'.$vars['_lang']['creditcard'].'</option>
			<option value="2"';

						if ($payment_types[$gateway] == 2) {
							echo ' selected="selected"';
						}

						echo '>'.$vars['_lang']['check'].'</option>
			<option value="3"';

						if ($payment_types[$gateway] == 3) {
							echo ' selected="selected"';
						}

						echo '>'.$vars['_lang']['money_transfer'].'</option>
			<option value="4"';

						if ($payment_types[$gateway] == 4) {
							echo ' selected="selected"';
						}

						echo '>'.$vars['_lang']['cash'].'</option>
		</select>
		- '.$vars['_lang']['auto_invoicing'].'		<input type="radio"';

						if ($payment_types_auto[$gateway]) {
							echo ' checked="checked"';
						}

						echo ' name="config[payment_types_auto]['.$gateway;
						echo ']" value="1" /> '.$vars['_lang']['yes'].'		<input type="radio"';

						if (!$payment_types_auto[$gateway]) {
							echo ' checked="checked"';
						}

						echo '  name="config[payment_types_auto]['.$gateway;
						echo ']" value="0" /> '.$vars['_lang']['no'].'	</td>
</tr>
';
					}
				} 
else {
					echo '<tr>
	<td style="text-align: center;">'.$vars['_lang']['no_payment_gateways_types'].'</td>
</tr>
';
				}

				echo '</tbody>
</table>

<p align="center">
	<input type="hidden" name="action" value="save" />
	<input type="submit" name="submit" class="btn btn-default" value="'.$vars['_lang']['save_changes'].'" />
	
	<input type="hidden" name="action" value="log_delete" />
	<input type="submit" name="submit" class="btn btn-default" value="LOGS Delete" />
</p>
<p align="center">
	
</p>
</form>

';
				break;
				echo '	<div style="text-align: center;">';
				echo sprintf( $vars['_lang']['version'], $vars['version'] ).'</div>

';
				return null;
			}
		}
	}

	function eFatura_license3($licensekey, $localkey = '') {
		$whmcsurl = 'https://www.turkhost.net.tr/';
		$remoteip = $_SERVER['SERVER_ADDR'];//$_SERVER['SERVER_ADDR']; //'188.132.208.45';
		$licensing_secret_key = 'TurkHosteFatura_XS65G70NNQ12';
		$check_token = time(  ) . md5( mt_rand( 1000000000, 9999999999 ) . $licensekey );
		$checkdate = date( 'Ymd' );
		$usersip = (isset( $_SERVER['SERVER_ADDR'] ) ? $_SERVER['SERVER_ADDR'] : $_SERVER['LOCAL_ADDR']);
		$localkeydays = 911;
		$allowcheckfaildays = 911;
		$localkeyvalid = false;

		if ($localkey) {
			$localkey = str_replace( '
', '', $localkey );

			$localdata = substr( $localkey, 0, strlen( $localkey ) - 32 );
			$md5hash = substr( $localkey, strlen( $localkey ) - 32 );

			if ($md5hash == md5( $localdata . $licensing_secret_key )) {
				$localdata = strrev( $localdata );
				$md5hash = substr( $localdata, 0, 32 );
				$localdata = substr( $localdata, 32 );
				$localdata = base64_decode( $localdata );
				$localkeyresults = unserialize( $localdata );
				$originalcheckdate = $localkeyresults['checkdate'];

				if ($md5hash == md5( $originalcheckdate . $licensing_secret_key )) {
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

			$method = $method_error = '';

			if (function_exists( 'curl_exec' )) {
				$ch = curl_init(  );
				curl_setopt( $ch, CURLOPT_URL, '' . $whmcsurl . 'modules/servers/licensing/verify.php' );
				curl_setopt( $ch, CURLOPT_POST, 1 );
				curl_setopt( $ch, CURLOPT_POSTFIELDS, $postfields );
				curl_setopt( $ch, CURLOPT_TIMEOUT, 30 );
				curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );
				curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
				curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
				$data = curl_exec( $ch );
				$method_error = curl_error( $ch );
				curl_close( $ch );
				$method = 'curl';
			} 
else {
				if (( function_exists( 'file_get_contents' ) && function_exists( 'stream_context_create' ) )) {
					$context = stream_context_create( array( 'http' => array( 'method' => 'POST', 'header' => 'Content-type: application/x-www-form-urlencoded', 'content' => http_build_query( $postfields ) ) ) );
					stream_context_set_option( $context, 'ssl', 'allow_self_signed', true );
					stream_context_set_option( $context, 'ssl', 'verify_peer', false );
					$data = file_get_contents( '' . $whmcsurl . 'modules/servers/licensing/verify.php', false, $context, 0 - 1, 40000 );
					$method = 'file_get_contents';
				} 
else {
					if (( function_exists( 'fopen' ) && function_exists( 'stream_context_create' ) )) {
						$context = stream_context_create( array( 'http' => array( 'method' => 'POST', 'header' => 'Content-type: application/x-www-form-urlencoded', 'content' => http_build_query( $postfields ) ) ) );
						stream_context_set_option( $context, 'ssl', 'allow_self_signed', true );
						stream_context_set_option( $context, 'ssl', 'verify_peer', false );
						$fp = @fopen( '' . $whmcsurl . 'modules/servers/licensing/verify.php', 'rb', false, $context );
						$data = @stream_get_contents( $fp );
						$method = 'fopen';
					}
				}
			}


			if (!$data) {
				$localexpiry = date( 'Ymd', mktime( 0, 0, 0, date( 'm' ), date( 'd' ) - ( $localkeydays + $allowcheckfaildays ), date( 'Y' ) ) );

				if ($localexpiry < $originalcheckdate) {
					$results = $localkeyresults;
				} 
else {
					$ssl_validation = '';

					if (function_exists( 'fsockopen' )) {
						$connection = @fsockopen( @str_replace( array( 'https://', 'http://', '/' ), '', $whmcsurl ), 443, $errno, $errstr, 30 );

						if (is_resource( $connection )) {
							$ssl_validation = 'Outgoing communication to port 443 is open';
							fclose( $connection );
						} 
else {
							$ssl_validation = $errstr;
						}
					} 
else {
						$ssl_validation = 'fsockopen function is disabled';
					}

					$results['status'] = 'Invalid';
					$results['description'] = ($method ? '<br />Could not resolve host (' . $whmcsurl . '), Please whitelist our ip: ' . $remoteip . ' and check again. <br /><br /><strong>If you would like to contact our support, please supply the following debug information:</strong> <br/><br/> Server IP: ' . $_SERVER['SERVER_ADDR'] . ' <br />PHP Version: ' . phpversion(  ) . ' <br />Disabled Functions: ' . ini_get( 'disable_functions' ) . ( ' <br />Connection to SSL port: ' . $ssl_validation . '<br />Method: ' . $method . ' :: ' . $method_error ) : 'One of the following functions must be enabled (curl_exec, file_get_contents with stream_context_create or fopen with stream_context_create)');
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


			if ($results['status'] == 'Active') {
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
		return $results;
	}


	if (!defined( 'WHMCS' )) {
		exit( 'This file cannot be accessed directly' );
	}

?>