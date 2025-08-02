<?php 
if (!function_exists('sendmail_message'))   {
function sendmail_message($CONFIG, $whmcs_invoice_details, $invoice_details, $client_details,$invoice_data){
	
	if($client_details['companyname']) {
		$dear = $client_details["firstname"] . " ".$client_details["lastname"]." (".$client_details['companyname'].")";
	} else{
		$dear = $client_details["firstname"] . " ".$client_details["lastname"];
	}
	
		
//	logModuleCall('eFatura',"TEST88",$CONFIG,"",  "",$replacevars);
/*	
	$date = date_create($whmcs_invoice_details['datepaid']);
	$datepaid =  date_format($date, 'd/m/Y');
	
	$date = date_create($whmcs_invoice_details['duedate']);
	$duedate =  date_format($date, 'd/m/Y');
	
	//$date = date_create($whmcs_invoice_details['date']);
	//$cdate =  date_format($date, 'd/m/Y');
	*/
	//$invoice_details[invoice_url];
if($whmcs_invoice_details['status']=="Paid"){
	$odeme_desc = "<br /> Faturanız  ".$whmcs_invoice_details['datepaid']." tarihinde ödenmiştir. <strong>Ödeme için teşekkür ederiz.</strong>";
}else{
	$odeme_desc = "<br />Son ödeme tarihi ".$whmcs_invoice_details['duedate']." olan faturanız henüz ÖDENMEMİŞTİR. <strong>Almakta olduğunuz hizmetin aksamaması için son ödeme tarihinden önce ödeme yapmanızı rica ederiz.</strong><br />";
}
	$logo = $CONFIG['SystemURL'].'/modules/addons/eFatura/turkhost-logo.png';
	$line =  $CONFIG['SystemURL'].'/modules/addons/eFatura/line.png';
	return $email_description = "
           <p>Sayın ".$dear.";</p>
<br />
<br /><br />  <strong>TÜRKHOST İNTERNET BİLİŞİM HİZ. SAN. VE DIŞ TİC. LTD. ŞTİ.</strong> tarafından ".$whmcs_invoice_details['date']." tarihli <strong>".$invoice_details["document_unique_id"]."</strong> numaralı E-arşiv faturası tarafınıza gönderilmiştir. Mail içerisine eklenmiş fatura dokuman var ise ekte bulabilirsiniz. <br />
".$odeme_desc."
<span class='im'><br /> Faturayı görüntülemek için <a href='".$invoice_details["invoice_url"]."' target='_blank'>tıklayınız </a>. <br /> <br />  
<strong>Fatura ETTN:</strong> ".$invoice_details["document_id"]."
<br /> <br /> 
<strong>Not:</strong> 433 sıra no’lu VUK Genel Tebliği gereğince e-posta ile gönderilen bu faturaların mali değeri ve geçerliliği
    bulunmakta olup, e-fatura gönderimi tercih etmiş müşterilerimiz için ayrıca kağıt fatura gönderilmesine gerek bulunmamaktadır.   <br /><br />Saygılarımızla<br /> </span></div>
<div style='clear: both; width: 800px; font-size: 11px; float: left;'>
<p><strong> **Bu ileti sistem tarafından otomatik olarak gönderilmektedir. Lütfen bu maile cevap göndermeyiniz. <span style='color: #cc0000;'>  ".$CONFIG["CompanyName"]." </span> üzerinden iletişim kurabilirsiniz. </strong></p>
</div>
								
								</p>";
								}
								
								}
								
			//SMS METNİ					
								
if (!function_exists('sendsms_message'))   {
	
	function sendsms_message($invoice_details, $invo, $shortDWName, $client_details){
			$subject = 'Sayın '.$client_details['firstname']." ".$client_details['lastname'].", ".$invo['duedate'].' son ödeme tarihli '.$invoice_details['document_unique_id'].' numaralı e-Faturanız oluşturulmuştur. 
			Faturanızı turkhost.net.tr Online İşlemler sayfasınıza şifrenizle giriş yaparak görüntüleyip ödeyebilirsiniz.';
		if($invo['status'] == "Paid"  ){
		$subject = 'Sayın '.$client_details['firstname']." ".$client_details['lastname'].", ".$invoice_details['document_unique_id'].' Numaralı e-Faturanız '.$invo['datepaid'].' tarihinde ödenmiştir.
					Faturalarınızı turkhost.net.tr Online İşlemler sayfasınıza şifrenizle giriş yaparak görüntüleyebilirsiniz.';
		}
					
		return $subject;
	}
	
}