<?php
  
	class eFaturaClient {
	//	var $wsdl = 'https://efaturatest.edoksis.net/';
		var $username = null;
		var $password = null;
		var $token = null;
		var $error = array(  );
		var $loggedin = false;

		function soapcall($wsdl, $service, $params) {
			 
			$client = new SoapClient($wsdl, array( 'trace' => true, 'exceptions' => true, 'cache_wsdl' => WSDL_CACHE_NONE, 'connection_timeout' => 10 ) );
			$response = $client->$service($params);
			$service = '' . $service . 'Result';
			return $response->$service;
			
		}

	function gen_uuid() {
			$uuid = '';
				$uuid = sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
	return $uuid;
					}
		function createDocument($params = array ()) {
			$this->error = array(  );	
		$uuid = '';
		$uuid = $this->gen_uuid();
		
		$item = $params['Items'][0];	
		
		
			
	//	logModuleCall('eFatura',$action, $params,'test',$params['config']['X509Certificate'],$replacevars);
			$taxtotal = 	$item['detaylar']['tax'] + $item['detaylar']['tax2'];
			//$vergi[0] = $item['detaylar']['taxrate']
		
		$isEArchiveInvoice = true;
		
		$vkn = "00000000000";
		if($params['UniqueID'])$vkn  = $params['UniqueID'];
		$isDraft = true;
	
		 $Mgirdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['config']['username'], 'Sifre'=> $params['config']['password']),
										'VKN' => $vkn
										));			
			
				$soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
				$mukellefUrl ='https://wsmukellef.edoksis.net/MukellefService.asmx?WSDL';
			if($params['config']['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
			}
			$Mresult[] = $this->soapcall($mukellefUrl, 'FirmaSorgula', $Mgirdi);
	
			 logModuleCall('eFatura',$action,$Mresult,"",  "",$replacevars);  
	
	
	// $eArchiveSendMethod ( FATURA GÖNDERME METHODU =  1 KAĞIT FATURA , 2 ELEKTRONİK FATURA)
		$eArchiveSendMethod = 2;
		$tipi = 'TUZEL';
		if(!$params['ClientDetails']['companyname']){
			$params['ClientDetails']['companyname']= $params['ClientDetails']['firstname'];
			$tipi = 'GERCEK';
			
			}else{
				
				$params['ClientDetails']['lastname'] = "";
			}
		
		
		$command = "GetClientsDetails";
					
						$values = array(
										'clientid' =>  $params['ClientDetails']['id'],
										'stats' => true,
									);
				$results = eFaturaWHMCS($command,$values);
				
				 if ($results['result'] != 'success') {
					
				$results['status'] = 'Hata';
				$results['error'] = 'Fatura Kesilecek Müşteri Bilgilerine Ulaşılamadı !';
				return false;
			  //  echo 'An Error Occurred: ' . $results['message'];
			}
		
			if($params['Currency'] == 'USD'){
			$kur_code = 'USD';
		$sql = 'SELECT code, rate	FROM tblcurrencies WHERE code = \'TRY\'';
			$query = mysql_query( $sql );
			$currate = mysql_fetch_assoc($query);

		
	}else{
			$kur_code = 'TRY';
			$sql = 'SELECT code, rate	FROM tblcurrencies WHERE code = \'USD\'';
			$query = mysql_query( $sql );
			$currate = mysql_fetch_assoc($query);
			
		
	}

			$isDraft = true;
	
	// $eArchiveSendMethod ( FATURA GÖNDERME METHODU =  1 KAĞIT FATURA , 2 ELEKTRONİK FATURA)
			$eArchiveSendMethod = 2;
		

			try {

					$yaziyla = new yaziyla("TÜRK LİRASI", "KURUŞ");
				//	$totalhesapla = $item['detaylar']['total'];
						$totalhesapla = $item['detaylar']['subtotal'] + $taxtotal;
					if($currate['rate'])$totalhesapla = $currate['rate'] * $totalhesapla;
					//var_dump($currate['rate']);
					
					//$yaztotal = $yaziyla->yaz($totalhesapla);
					$rkam = str_replace(".",",",$totalhesapla);
					$oku = new rakamoku();
					$yaztotal = $oku->sayiyiYaziyaCevir($rkam,2,"Türk Lirası","Kuruş","",null,null,null);
 
//Yazdırma işlemi
 
					
				
					$Vergi[0] = ['Matrah' => '0',	
															'HesaplananVergiTutari' =>  $item['detaylar']['tax'],
															'HesaplamaSiraNo' => '1',
															'HesaplananVergiTutariBPB' =>  $item['detaylar']['tax'],
															'VergiOrani' => round($item['detaylar']['taxrate']),
															'VergiTipi' => array('Kodu'=> '0015')];
				if($item['detaylar']['tax2'] != '0.00'){
					
				$Vergi[1] =	[	'Matrah' => '0',	
															'HesaplananVergiTutari' =>  $item['detaylar']['tax2'],
															'HesaplamaSiraNo' => '2',
															'HesaplananVergiTutariBPB' =>  $item['detaylar']['tax2'],
															'VergiOrani' => $item['detaylar']['taxrate2'],
															'VergiTipi' => array('Kodu'=> '4080')];
				
				}	
			
				$vergiToplami= array('VergiToplami'=> array(
											'ToplamVergiTutari' => $taxtotal,
											'VergiAraToplamlari' => $Vergi ));
						
					  $currentDateTime = date('H:i:s');
					  $item['detaylar']['date'] = $item['detaylar']['date'].' '. $currentDateTime;
					   $item['detaylar']['date'] = strtotime($item['detaylar']['date']);
					   $uuid = '';
					$fettn = $this->gen_uuid();
				$gidenFatura= array(
							'Senaryo'  => 'TEMELFATURA',
							'FaturaDuzenlemeZamani'  => $item['detaylar']['date'],
							'FaturaTipi'  => 'SATIS',
							'BelgeParaBirimiKodu'  => 'TRY',
							'BelgeParaBirimiKoduDonusmus'  => $kur_code,
							'VergiKuru'  => array(
										'ParaBirimiKodu'  => 'TRY',
										'ParaBirimiKoduDonusmus'  => $kur_code,
										'KurTarihi'  => $item['detaylar']['date'],	
										'DovizKuru' => floatval($currate['rate']),
										'HedefParaBirimiKoduDonusmus'  => 'TRY'
											),
							'OdemeKuru'  => array(
										'ParaBirimiKodu'  => 'TRY',
										'ParaBirimiKoduDonusmus'  => $kur_code,
										'KurTarihi'  => $item['detaylar']['date'],	
										'DovizKuru' => floatval($currate['rate']),
										'HedefParaBirimiKoduDonusmus'  => 'TRY'
											),									
							'FiyatlandirmaKuru'  => array(
										'ParaBirimiKodu'  => 'TRY',
										'ParaBirimiKoduDonusmus'  => $kur_code,
										'KurTarihi'  => $item['detaylar']['date'],	
										'DovizKuru' => floatval($currate['rate']),
										'HedefParaBirimiKoduDonusmus'  => 'TRY'
											),		
							'FaturaNo'  => $params['FaturaNo'],
							'FaturaETTN' => $fettn,
							'VergiToplamlari' => $vergiToplami,
							'ToplamVergiTutari' => $taxtotal,
							'ToplamTutar' => $item['detaylar']['subtotal'],
							'VergiMatrahi' => $item['detaylar']['subtotal'],
							'ToplamTutarVergiDahil' => $item['detaylar']['subtotal'] + $taxtotal,
							'OdenecekTutar' => $item['detaylar']['subtotal'] + $taxtotal,
							'FaturaDokumanlari'  => array(
										'DokumanID'  => $item['detaylar']['id'],
										'DokumanTipiID'  => '1',
										'BelgeTipi'  => 'PROFORMA',	
										'DuzenlemeTarihi' => floatval($currate['rate'])),
										
							'Notlar' => array($item['detaylar']['notes'],'SON ÖDEME TARİHİ: '.  date("d-m-Y",strtotime($item['detaylar']['duedate']))
							),
							'Satici' => array(
								'KimlikNO' => $params['config']['invoice_company_vn'],
								'Tipi' => $params['config']['invoice_company_tipi'],
								'Adi' => $params['config']['invoice_company'],
								'WebSitesi' => $params['config']['invoice_company_web'],
								'BinaNo' => $params['config']['invoice_company_bn'],
								'BinaAdi' => $params['config']['invoice_company_badi'],
								'Ilce' => $params['config']['invoice_company_ilce'],
								'Sehir' => $params['config']['invoice_company_sehir'],
								'PostaKodu' => $params['config']['invoice_company_pk'],
								'VergiDairesi' => $params['config']['invoice_company_vd'],
								'MERSISNO' => $params['config']['invoice_company_mn'],
								'TICARETSICILNO' => $params['config']['invoice_company_tn'],								
								'Telefon' => $params['config']['invoice_company_tel'],
								'FaxNo' => $params['config']['invoice_company_fax'],
								'EMail' => $params['config']['invoice_company_email'],
								'Mahalle' => $params['config']['invoice_company_mahalle'],
								'Sokak' => $params['config']['invoice_company_sokak'],
							/*	'Kasaba' => $params['config']['invoice_company_kasaba'], */
								'IcKapiNo' => $params['config']['invoice_company_kn'],
								'SabitTanimlamaNo' => 'sabit tanımlama no',
							/*	'TarafKimlikleri' => array('TarafKimlikleri' => array(
																'KimlikTipi' => 'BAYINO',
																'KimlikNo' => '9999999996'
																)), */
								'NACEKodu' => 'nace kodu',
								'BlokAdi' => 'blok adi',
								/*'Kasaba' => 'kasaba'*/
								),
							'Alici' => array(
								'KimlikNO' => $vkn,
								'Tipi' => $tipi,
								'Adi' => $params['ClientDetails']['companyname'],
								'Soyadi' => $params['ClientDetails']['lastname'],
								'WebSitesi' => '',
							/*	'BinaNo' => $params['ClientDetails']['address2'],
								'BinaAdi' => $params['ClientDetails']['address2'], */
								'Ilce' => $params['ClientDetails']['state'],
								'Sehir' => $params['ClientDetails']['city'],
								'PostaKodu' => $params['ClientDetails']['postcode'],
								'VergiDairesi' => $params['UniqueVD'],
								'Telefon' => $params['ClientDetails']['phonenumber'],
								'FaxNo' => $params['ClientDetails']['fax'],
								'EMail' => $params['ClientDetails']['email'],
							/*	'Mahalle' => $params['ClientDetails']['address2'],*/
								'Sokak' => $params['ClientDetails']['address1'] .' '.$params['ClientDetails']['address2'],
							/*	'IcKapiNo' => 'iç kapı no', */
								'SabitTanimlamaNo' => 'sabit tanımlama no',
								'TarafKimlikleri' => array('TarafKimlikleri' => array(
																'KimlikTipi' => 'MUSTERINO',
																'KimlikNo' => $item['detaylar']['userid']+120000
																)),
					/*			'NACEKodu' => 'nace kodu',
								'BlokAdi' => 'blok adi',
								'Kasaba' => 'kasaba', */
								'Etiket' => 'urn:mail:'.$params['config']['etiket']),
								'FaturaDuzenlemeTarihi'  => $item['detaylar']['date'],
								
							'ERPFaturaReferansi' => $item['detaylar']['id'],	
							'YaziIleFaturaTutari' => $yaztotal,
							);
							$this->error[] = 'BIMSA::Faturaoluşturma - :';
						if (is_array($Mresult[0]->Firmalar->EFaturaFirma)){
							//var_dump($Mresult[0]->Firmalar->EFaturaFirma);
							
									$array1 = $Mresult[0]->Firmalar->EFaturaFirma[0]->Alias;
						} else{
							$array1 = $Mresult[0]->Firmalar->EFaturaFirma->Alias;
						}
					//	var_dump($Mresult[0]->Firmalar->EFaturaFirma->Alias);
						if($array1){
							$gidenFatura['Alici']['Etiket'] = $array1;// 'urn:mail:'.$params['config']['etiket'];
							$gidenFatura['Alici']['XSLTRumuzu'] = 'efatura';
						}else{
							$gidenFatura['Alici']['XSLTRumuzu'] = 'earsiv';
						}
			        
			//	if($item['detaylar']['paymentmethod'])	
				switch ($item['detaylar']['paymentmethod']){
				case "banktransfer": $odememetodu = "EFT_HAVALE"; break;
				case "garantinew":
				case "garantibank":
				case "garanti":
				case "ziraat3dn":  $odememetodu = "KREDIKARTI_BANKAKARTI"; break;
				
				default: $odememetodu = "DIGER"; break;
				}
			//	$odememetodu = ($odememetodu = "DIGER" ? $odememetodu : 0);
				if($odememetodu == "DIGER") $dometodu = $item['detaylar']['paymentmethod'];
				$eArsivFatura = array(
				'GonderimSekli' => 'ELEKTRONIK',
			/*	'TesisatNumarasi' => 'tesisat no', */
				'FaturayiEmailIleGonder' => 'false',
				'OdemeKosulu'  => array(
										'Aciklamasi'  => 'Ödeme Koşulları',
										'GecikmeCezaOrani'  => '0,02',
										'GecikmeCezaTutari'  => '',	
										'Tutar' => '',
										'SonOdemeTarihi'  => $item['detaylar']['duedate']
											)//,			
		//		'InternetSatisBilgileri' => array(
			//			'WebAdresi' => $params['config']['invoice_company_web'],
				//		'OdemeSekli' => $odememetodu,
					//	'DigerOdemeSekli' => $dometodu,
						//'OdemeTarihi' => $item['detaylar']['date']
						/*,
						'GonderimTarihi' => $item['detaylar']['date'],
						'GonderiTasiyanVKN' => '4650005258',
						'GonderiTasiyanUnvan' => 'aaaa' */
					//	)
									);
									
			$i = 0;
	//		logModuleCall('eFatura',$action, $params['Items'],  $params['Items'],  $params['Items'],$replacevars);
									
				foreach ($params['Items'] as $item) {
				
				$taxamount  = $item['Price'] * $item['detaylar']['taxrate'] /100;
				
				$Vergi[0] = ['Matrah' => '321',
									'HesaplananVergiTutari' => $taxamount,
									'HesaplamaSiraNo' => '1',
									'HesaplananVergiTutariBPB' => $taxamount,
									'VergiOrani' => $item['detaylar']['taxrate'],
									'VergilemeOlcuTarifesi' => '1',
									'VergilemeOlcuBirimi' => 'C62',
									'VergilemeTutarTarifesi' => '1',
									'VergiTipi' => array('Kodu'=> '0015',
														 'VergiAdi'=> 'KDV',
														 'Kisaltma'=> 'KDV'),
									'Matrah_ParaBirimi' => $kur_code,
									'HesaplananVergiTutari_ParaBirimi' => $kur_code,
									'VergilemeTutarTarifesi_ParaBirimi' => $kur_code];
					if($item['detaylar']['tax2'] != '0.00'){
					$taxamount  = $item['Price'] * $item['detaylar']['taxrate2'] /100;	
					$Vergi[1] = ['Matrah' => '321',
									'HesaplananVergiTutari' => $taxamount,
									'HesaplamaSiraNo' => '1',
									'HesaplananVergiTutariBPB' =>$taxamount,
									'VergiOrani' => $item['detaylar']['taxrate2'],
									'VergilemeOlcuTarifesi' => '1',
									'VergilemeOlcuBirimi' => 'C62',
									'VergilemeTutarTarifesi' => '1',
									'VergiTipi' => array('Kodu'=> '4080',
														 'VergiAdi'=> 'Ö.İLETİŞİM V',
														 'Kisaltma'=> 'ÖİV'),
									'Matrah_ParaBirimi' => $kur_code,
									'HesaplananVergiTutari_ParaBirimi' => $kur_code,
									'VergilemeTutarTarifesi_ParaBirimi' => $kur_code];	
						
				}
				
					
					$GidenFaturaKalemi[$i] = [
						'KalemID' => $i,
						'Miktar' => $item['Quantity'],
						'OlcuBirimiKoduDonusmus' => 'NIU',
						'ToplamVergiTutari' => $taxtotal,
						'BirimFiyat' => $item['Price'],
						'Tutar' => $item['Price'],
						'VergiMatrahi' => $item['detaylar']['subtotal'],
						'Not' => 'kalem not 1',
						'Aciklama' => 'kalem açıklama 1',
						'MalHizmetAdi' => $item['Name'],
						'Marka' => '',
						'Model' => '',
						'AliciTanimlama' => '',
						'SaticiTanimlama' => '',
						'UreticiTanimlama' => '',
						'EmtiaSiniflandirmaBilgisi' => '',
						'Vergiler' => array(
							'Vergi' => $Vergi),
						'ToplamVergiTutari_ParaBirimi' => $kur_code,
						'BirimFiyat_ParaBirimi' => $kur_code,
						'Tutar_ParaBirimi' => $kur_code,
						'VergiMatrahi_ParaBirimi' => $kur_code
						/*,
						'IskontoArtirimlar' => array(
						'IskontoArttirim' => array(
							'Artirim' => 'false',
							'Tutar' => '0',
							'Nedeni' => '',
							'Oran' => '0',
							'UygulananTutar' => '0',
							'Tutar_ParaBirimi' => $kur_code,
							'UygulananTutar_ParaBirimi' => $kur_code,
							'SiraNumarasi' => '0',
							'IskontoAdedi' => '0'
						))
						*/
				
				]; 
					
					$i++;
				}						
									
									
									
									
									
									
									
				$kalemler = array(
				'GidenFaturaKalemi' => $GidenFaturaKalemi
				);
				
				
									 logModuleCall('eFatura',$action,$params['Items'], $params['Items'],  $params['Items'],$replacevars);   
								
						  
								   
		 $girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['config']['username'], 'Sifre'=> $params['config']['password']),
										'Fatura' => array('GidenFatura' => $gidenFatura,
														  'EArsivFatura'=> $eArsivFatura,
														  'Kalemler'=> $kalemler
										
										
										)
										));
										
			//E-FATURA MUKELLEF SORGULA START
			/*
		 $Mgirdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['config']['username'], 'Sifre'=> $params['config']['password']),
										'VKN' => $params['UniqueID']
										));			
			
			 $soapurl = 'https://efatura.edoksis.net/FaturaService.asmx?WSDL';
			if($params['config']['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
			}
			$Mresult[] = $this->soapcall($soapurl, 'EFaturaFirmalari', $Mgirdi);
			*/
			
			if($array1){
				//logModuleCall('eFatura',$action, $Mresult[0]->Firmalar->,  '','');
				
				//$Mresult[0]->Firmalar->EFaturaFirma->Alias
				//$Mresult[0]->Firmalar->EFaturaFirma->Title
				//$Mresult[0]->Firmalar->EFaturaFirma->Title
					$uuid = '';
					$zarfettn = $this->gen_uuid();

				//print_r($Mresult[0]->Firmalar->EFaturaFirma->Alias);
				
					 $Fgirdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['config']['username'], 'Sifre'=> $params['config']['password']),
										'Zarf' => array('ZarfETTN'=>$zarfettn,
										'Gonderen'=> array('KimlikNO' => $params['config']['invoice_company_vn'],
														  'Tipi'=> $params['config']['invoice_company_tipi'],
														  'Adi'=> $params['config']['invoice_company'],
														  'Ilce'=> $params['config']['invoice_company_ilce'],
														  'Sehir'=> $params['config']['invoice_company_sehir'],
														  'Ulke'=> 'Türkiye'),
														  
										'Alici'=> array('Etiket' => $array1,
														  'KimlikNO' => $vkn,
														  'Tipi'=>  $tipi,
														  'Adi'=> $params['ClientDetails']['companyname'],
														  'Ilce'=> $params['ClientDetails']['state'],
														  'Sehir'=> $params['ClientDetails']['city'],
														  'Ulke'=> 'Türkiye')
										
										
										),
										'Faturalar' => array('GidenFaturaComplex' => array('Fatura' => $gidenFatura,'Kalemler'=> $kalemler)
										)));
				 $soapurl = 'https://efatura.edoksis.net/FaturaService.asmx?WSDL';
				$result[] = $this->soapcall($soapurl, 'ZarfGonder', $Fgirdi);
					$faturabilgileri[] = $result[0]->SistemTarafindanVerilenFaturaNumaralari->OlusanFaturaNumarasi;
			//	$this->error[] = 'eFatura::createDocument - ' . $result['Errors']['CommonError']['Error'];
			//	print_r($result[0]);
						$girdi =array('Girdi' => array('Kimlik' => array('Sistem'=>'TURKHOST', 'Kullanici'=> $params['config']['username'], 'Sifre'=> $params['config']['password']),
										'Gelen' => false,
										'Giden' => true,
										'FaturaETTN' => $fettn
										));
					
					 $soapurl = 'https://efatura.edoksis.net/FaturaService.asmx?WSDL';
						if($params['config']['system_demo']){
					$soapurl = 'https://efaturatest.edoksis.net/FaturaService.asmx?WSDL';	
						}
					$sonuc[] = $this->soapcall($soapurl, 'FaturaGoruntule', $girdi);
					$faturaUrl = $sonuc[0]->URL;		
					//var_dump($sonuc[0]);
			}
			
			//E-FATURA MUKELLEF SORGULA END
				else{
		
			 $soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
			if($params['config']['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/earchiveservice.asmx?WSDL';	
			}
			$result[] = $this->soapcall($soapurl, 'EarsivFaturaGonder', $girdi);
				$faturabilgileri[] = $result[0]->SistemTarafindanVerilenFatura->SistemTarafindanVerilenFaturaNumarasi;
				$faturaUrl = $result[0]->SistemTarafindanVerilenFatura->URL;
			
			}	
		
					
			
			
			if($result[0]->Sonuc == '1'){
			$result['ID'] =  $fettn;
			$result['invoiceid'] = $params['invoice_id'];
			$result['unique_id'] =  $params['FaturNo'];
			
			
			
		 logModuleCall('eFatura',$action, $result[0]->SistemTarafindanVerilenFatura,  $result[0]->SistemTarafindanVerilenFatura,  $result[0],$replacevars);
			}
	
			if($result[0]->Sonuc == '2'){
					
				logModuleCall('eFatura',$action, $exception,$result,$result['Sonuc'],$replacevars);
				// var_dump($result[0]->Sonuc);
				// logModuleCall('eFatura',$action,$result,$params,$exception,$replacevars);
				$this->error[] = 'BIMSA::Faturaoluşturma - :'. $result[0]->Mesaj;
			//	$result[]
				$results['status'] = 'Hata';
				
					var_dump( $result[0]->Mesaj);
					$results['description'] = $result[0]->Mesaj;
					$results['error'] = $result[0]->Mesaj;
					$error[] = $result[0]->Mesaj;
					$this->error[] = 'BIMSA::Faturaoluşturma - Bu fatura no sistemde zaten kayitlidir:2 '. $result;
				return false;
			}

			 } catch (SoapFault $exception) {
				 
				 logModuleCall('eFatura',$action, $exception,$result,$result['Sonuc'],$replacevars);
				 var_dump($result);
				// logModuleCall('eFatura',$action,$result,$params,$exception,$replacevars);
				$this->error[] = 'BIMSA::Faturaoluşturma - Soap Hatası: '. $exception;
				return false;
				}
			if (!$result['invoiceid']) {
				$this->error[] = 'eFatura::createDocument - No response from the API system';
				return false;
			}
			//$result = $this->object2array( $result );
		//	logModuleCall('eFatura',$action,$result,$params,$result,$replacevars);
			//$result = $this->object2array( $result );

			if ($result['Errors']['CommonError']) {
				if (isset( $result['Errors']['CommonError'][0] )) {
					foreach ($result['Errors']['CommonError'] as $error_data) {
						$this->error[] = 'eFatura::createDocument - ' . $error_data['Error'];
					}
				} 
else {
					$this->error[] = 'eFatura::createDocument - ' . $result['Errors']['CommonError']['Error'];
				}

				return false;
			}
			
			return array( 'id' => $result['ID'], 'unique_id' => $params['FaturaNo'], 'url' => $faturaUrl, 
			              'fatura_belgesi' => $pdfdata, 'companyname' => $params['ClientDetails']['companyname'] );
		
		}

		function object2array($data) {
			if (( is_array( $data ) || is_object( $data ) )) {
				$result = array(  );
				foreach ($data as $key => $value ) {
					$result[$key] = $this->object2array( $value );
				}

				return $result;
			}

			return $data;
		}

		function createClient($params) {
			$this->error = array(  );
             $vergino = (string)trim($params['UniqueID']);
			if (!$result) {
				$this->error[] = 'eFatura::createClient - No response from the API system';
				return false;
			}


			if ($result->Errors->CommonError) {
				foreach ($result->Errors as $error) {
					$this->error[] = 'eFatura::createClient - ' . (bool)$error->Error;
				}

				return false;
			}
// Müşteri id var mi 
			return (int)$params['UniqueID'];
		
		}
		
		
		
// FATURA PDF GETIR START

		function GidenFaturaPdfAl2($id) {
			$this->error = array(  );
             $faturano = (string)trim($params['ID']);
			if (!$result) {
				$this->error[] = 'eFatura::createClient - No response from the API system';
				return false;
			}


			if ($result->Errors->CommonError) {
				foreach ($result->Errors as $error) {
					$this->error[] = 'eFatura::createClient - ' . (bool)$error->Error;
				}

				return false;
			}
// Müşteri id var mi 
			return  $result;
		}
	

//SOAP GÖNDER FUNCTION START	
		function soapgonder($params, $function,$arr_query) {
			$this->error = array(  );

		//	logModuleCall('eFatura',$action,$result,$params,$params['UniqueID'],$replacevars);
             $vergino = (string)trim($params['UniqueID']);
			 //'kimlikNo' => $vergino
			 // array('token' => $this->token, 'kimlikNo' => $vergino)
			  $soapurl = 'https://efatura.edoksis.net/earchiveservice.asmx?WSDL';
			if($params['config']['system_demo']){
			$soapurl = 'https://efaturatest.edoksis.net/earchiveservice.asmx?WSDL';	
			}
			$result = $this->soapcall($soapurl, $function, $arr_query );
			//$sonuc = 	simplexml_load_string($result);
				//logModuleCall('eFatura',$sonuc,$sonuc,$sonuc,$sonuc,$replacevars);
				
			if (!$result) {
				$this->error[] = 'eFatura::'.$function.' - No response from the API system';
				return false;
			}


			if ($result->Errors->CommonError) {
				foreach ($result->Errors as $error) {
					$this->error[] = 'eFatura::'.$function.' - ' . (bool)$error->Error;
				}

				return false;
			}
// Müşteri id var mi 

			//return  (int)$result->ID;
			return  $result; //(int)$params['UniqueID'];
		}
		
		
		
		

		function getLink($id, $doc_num) {
			$pdf = fopen(dirname( __FILE__ ).$id.'.pdf', 'w') or die("Unable to open file!");
			fwrite ($pdf,$pdf_base64);
//close output file
			fclose ($pdf);
			
			
			$link = dirname( __FILE__ ).$id.'.pdf';
			return $link;
		}
	}


	if (!defined( 'WHMCS' )) {
		exit( 'This file cannot be accessed directly' );
	}

?>