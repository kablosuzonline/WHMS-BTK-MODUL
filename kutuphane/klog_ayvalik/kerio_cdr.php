<?php

		require_once 'src/KerioControlApi.php';		
		$api = new KerioControlApi('Create user', 'KablosuzOnline', '1.0');
		
	//	$mac  = $params["customfields"]["MAC Adresleri"];
		//$macpieces = explode(";", $mac);
		$session = $api->login("82.222.181.122", "admin", "U/0boYS61NcRjG");
		/*
		void kerio::web::Logs::get 	( 	
		out LogRowList  	viewport,
		out long  	totalItems,
		in LogType  	logName,
		in long  	fromLine,
		in long  	countLines 
	) 		
		*/
		
		
		/*
						
			$paramskerio = array(
				'query' => array(
					'combining' => 'And',
					'orderBy' => array(array(
						'columnName' => 'loginName',
						'direction' => 'Asc'
					))
				),
				'domainId' => 'local' // local database
			);
					$users = $api->sendRequest('Users.get', $paramskerio);
					
			*/		
		
		
		
			//var_dump($session);
		$paramskerio = array(
		'logName' => 'connection',
		'fromLine' => 0,
		'countLines'=> 50000,
	);
	$logs = $api->sendRequest('Logs.get', $paramskerio);
		//	var_dump($users);
			$i = 0;
	
		
		
		$namedate = date("YmdHis", time());
		
		$veriler = 'IZMAR_NAT_IPDR_'.$namedate.'.log';
		
			 if (is_file('./'.$veriler)){

				unlink('./'.$veriler);
			}
		define( 'BASE_DIR', $_SERVER['DOCUMENT_ROOT'] );				
			$dosya = fopen($veriler,"w");
						$dst = array();
						$id = "";
						$ozel = array();
						$local_ip ="";
						$local_port = "";
						$username  = "";
						$datetime2 ="";
						$final_array = array();
						$final_data = array();
						$dst_ip = "";
						$dst_port = "";
						$user_id = "";
						$sec = 0;
						$download = 0;
						$upload = 0;
						$session = "session_stop";

			$i = 0 ;			
		  foreach ($logs['viewport'] as $log){
			  
			  $final_data = explode(' ',$log['content']);
			  	$final_array['date']  =   str_replace('[', '',  $final_data[0]);
				$final_array['time']  = str_replace(']', '',  $final_data[1]);
	
				$t = $final_array['date'].' '.$final_array['time'];
				$date3 = DateTime::createFromFormat('d/M/Y H:i:s', $t);
				$datetime2 =  $date3->format('YmdHis');
				
			  
				$id_id = array_search('[ID]', $final_data);
				$id = $final_data[$id_id+1];
				
				$rule_id = array_search('[Rule]', $final_data);
				
				$services_id = array_search('[Service]', $final_data);
			   
				$user_id = array_search('[User]', $final_data);
				$username = $final_data[$user_id+1];
				
				$connection_id = array_search('[Connection]', $final_data);
				$local = $final_data[$connection_id + 2];
				
				
				if($locals  = explode(':',$local)){
					//$dst_ip = str_replace("(","",$locals[0]);
					//$dst_ip = str_replace(")","",$dst_ip);
				$local_ip = $locals[0];
				if(isset($locals[1])){
				$local_port = $locals[1];	
				}else {
					$local_port =  53;
				}
									
				}else{
					
					//$dsts  = explode(':',$dst);
					//$dst_ip = str_replace("(","",$dst);
					//$dst_ip = str_replace(")","",$dst_ip);
					$local_ip = $local;
					$local_port = 53;
					
				}
				
				
			//	$connection_id = $final_data[$connection_id+1];
				
				
				//if($connection_id == "ICMP")
				/*
				$dst = array_search('->', $final_data);
				$dst= $final_data[$dst+1];
				$dst_array = explode(' ',$dst);
				echo $dst;
				*/
				
				
			    $iface_id = array_search('[Iface]', $final_data);
				$dst = $final_data[$iface_id-1];
				$iface_id = $final_data[$iface_id+1];
				
				if($dsts  = explode(':',$dst)){
					$dst_ip = str_replace("(","",$dsts[0]);
					$dst_ip = str_replace(")","",$dst_ip);
					
					if(isset($dsts[1])){
					$dst_port = $dsts[1];	
				//	$dst_port = str_replace(":","",$dsts[1]);
					}else{
						$dst_port = 53;
					} 
					
				}else{
					
					//$dsts  = explode(':',$dst);
					$dst_ip = str_replace("(","",$dst);
					$dst_ip = str_replace(")","",$dst_ip);
					
					
				}
				
			//	echo $dst_ip;
				
				
			    $duraction_id = array_search('[Duration]', $final_data);
				$duraction = $final_data[$duraction_id+1];
				
				if(trim($duraction) != 0)
				{
				
				//$date3->modify($duraction." Sec");
				$sec_d = date("YmdHis",strtotime($datetime2)+ $duraction);
			//	$sec_d = $date2;	
				
				}else{
				$sec_d = $datetime2;
				$session = "session_start";
				}
				
				
				$byte_id = array_search('[Bytes]', $final_data);
				$byte_id = $final_data[$byte_id+1];
						if($byte  = explode('/',$byte_id)){
						$upload = $byte[0];
						$download = $byte[1];	
						}
						//else{$upload = 0; $download = 0; }
							
				
				$packets_id = array_search('[Packets]', $final_data);
			 // if(!isset($a))$a = array_search('sp', $final_data);
			  
			  //$final_data = explode(' ',$log['content']);
			
			  
			  
			  
		// $cdr_text = $username.'@izmar|'. $local_ip.'|'. $local_port.'|'. $local_port.'|'.$dst_ip.'|'.$dst_port.'|'.$dst_port.'|'.$datetime2.'|'.$sec_d.'|'.$upload.'|'.$download.'|user_request|session_stop|'.$iface_id.'| |'.$id.'"\n"';	
		  $cdr_text = "$username@izmar|$local_ip|$local_port|$local_port|$dst_ip|$dst_port|$dst_port|$datetime2|$sec_d|$upload|$download|user_request|$session|$iface_id||$id\n";	
			fwrite($dosya,$cdr_text);
				$i++ ;
		  }
				fclose($dosya);
			//	[İŞLETMECİ]_NAT_IPDR_[TARIH_ZAMAN]_[TEKİL_DEĞER].log.gz 
				$file = $veriler  ;
				//'IZMAR_NAT_IPDR_'.$namedate.'.log';

						// Name of the gz file we are creating
						$gzfile = 'ipdr/'.$file.".gz";

						// Open the gz file (w9 is the highest compression)
						$fp = gzopen($gzfile, 'w9');

						// Compress the file
						gzwrite($fp, file_get_contents($file));

						// Close the gz file and we are done
						gzclose($fp);
						
						 if (is_file('./'.$veriler)){
		//	echo (unlink('./veriler.cdr') ? "File Deleted" : "Problem deleting file";
				unlink('./'.$veriler);
			}
				

			/*
				$final_data = explode(' ',$log['content']);
				$final_array['date']  =   str_replace('[', '',  $final_data[0]);
				$final_array['time']  = str_replace(']', '',  $final_data[1]);
	
			$t = $final_array['date'].' '.$final_array['time'];
			
			$date3 = DateTime::createFromFormat('d/M/Y H:i:s', $t);
			$datetime2 =  $date3->format('YmdHis');
			$id   = $final_data[3];
				
						
					if($log['highlight']){
						
						
											
						//$sec = 44444;
						$sec = $final_data[19];	
				
				
				//	echo	print_r($sec_d." ".$datetime2);
				  $username  = $final_data[9];
						 
				  $sec = $final_data[19];
				
					$local_ip = $final_data[12];
				  if(strstr($final_data[12], ":"))
				  {
					  
					  $ozel = explode(':',$final_data[12]);
					   $local_ip = $ozel[0];
					$local_port = $ozel[1];
				 $sec = $final_data[19];
				// echo	print_r($sec)."1";
		//			if ($sec = $final_data[19]) echo	print_r($sec)."66666666666666666666666666666666";	
				  }
				// if($ozel[1])
				
				
			//	  echo	print_r($final_data[12])."0000000000000000000000000000000000000000000000";
					//echo print_r($final_array['datetime2'])."<p>";
							 
							$dst = $final_data[15];
							  if(strstr($final_data[15], ":")){
								  $dst =  explode(':',$final_data[15]);
								  //  echo	print_r($final_data[19])."99999999999999999999999999999999999999999999";
							  
							  $byte  = explode('/',$final_data[22]);
							$upload = $byte[0];
							$download = $byte[1];
							$baglanti_pvc  = $final_data[17];
							// echo print_r($baglanti_pvc.'yyyyyyyyyyyyyyyyyyyy');	
							 
							 
								$sec = $final_data[19];
								$date3->modify($sec." Sec");
								$sec_d = $date3->format('YmdHis');
								
							//	echo print_r($sec_d.'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');	
							 
							 
							  }else{
								  $baglanti_pvc  = $final_data[16];
								  				  
								  
							  }
							
						//	echo	print_r($dst)."111111111111111111111111111111111111111111111111111111111111";
							if($dst[1]){
								$dst[0] = str_replace(")","",$dst[0]);
							$dst_ip = str_replace("(","",$dst[0]);
							
							$dst_port = $dst[1];
							
							
							
						//	$baglanti_pvc = $final_data[14];

								}else{
									
								 $baglanti_pvc  = $final_data[16];
								echo print_r($baglanti_pvc.'xxxxxxxxxxxxxxxxxxxxxxxx');		
								$byte  = explode('/',$final_data[22]);
								$upload = $byte[0];
								$download = $byte[1];	
									
								$dst =  explode(':',$final_data[14]);
								
							//	echo	print_r($dst)."2222222222222222222222222222222222222222222222222222222222";
								$dst[0] = str_replace(")","",$dst[0]);
								$dst_ip = str_replace("(","",$dst[0]);
								
								$dst_port = $dst[1];
								
								$sec = $final_data[19];
								$date3->modify($sec." Sec");
								$sec_d = $date3->format('YmdHis');
								
								echo print_r($sec_d.'6666666666666666666666666666666666666666');	
							
						//	$baglanti_
								
							//	$baglanti_pvc  = $final_data[15];
							}

					


				
					
					} else{
						 $ozel = explode(':',$final_data[10]);
						$local_ip = $ozel[0];
						$local_port = $ozel[1];
						$username  = $final_data[7];
						
						$dst = $final_data[13];
							  if(strstr($final_data[13], ":")){
								  
								$byte  = explode('/',$final_data[20]);
								$upload = $byte[0];
								$download = $byte[1];
								  
								  $dst =  explode(':',$final_data[13]);
								   $baglanti_pvc  = $final_data[15];
							//	echo print_r($baglanti_pvc.'bbbbbbbbbbbbbbbbbbbbbbbbbbbbb');	

									$sec = $final_data[17];
								$date3->modify($sec." Sec");
								$sec_d = $date3->format('YmdHis');
								
							//	echo print_r($sec_d.'9999999999999999999999999999999999999');	
								
							  }else{
								    $baglanti_pvc  = $final_data[14];
							//	echo print_r($baglanti_pvc.'zzzzzzzzzzzzzzzzzzzzzzzzzzzz');	
							
									$sec = $final_data[16];
								$date3->modify($sec." Sec");
								$sec_d = $date3->format('YmdHis');
								
						//		echo print_r($sec_d.'5555555555555555555555555555555555');	
							  }
					//	echo	print_r($dst);
							if($dst[1]){
								$dst[0] = str_replace(")","",$dst[0]);
							$dst_ip = str_replace("(","",$dst[0]);
						
							$dst_port = $dst[1];
							//	echo	print_r($dst_port)."33333333333333333333333333333333333333333333333333333333333333";
				//			$baglanti_pvc  = $final_data[14];

								}else{
								$dst =  explode(':',$final_data[12]);
						
								$dst[0] = str_replace(")","",$dst[0]);
								$dst_ip = str_replace("(","",$dst[0]);
									
						
								$dst_port = $dst[1];
							//				echo	print_r($dst_port)."4444444444444444444444444444444444444444444444444444444";	
					//			$baglanti_pvc  = $final_data[15];
							}
						
				  
					//echo print_r($final_array['datetime2'])."<p>";
					}		
					
							
				//echo "IZMAR||$tparty3||77.92.148.246|195.142.118.99|||N|M|$status11|$calltime12||$ntime14||||$ord_ac_id17||||$tcarrier21|KM|YI|YI|908504170289|$call_id26|RTS|$pparty| \n";
			//echo $cdr_text = $final_array['datetime2']."\n"; //"IZMAR|$sanalno|$p_dst||77.92.148.246|195.142.118.99|||N|M|$status11|$calltime12||$ntime14||||$ord_ac_id17||IZMAR|$tcarrier21|$mtipi|YI|YI|908504170289|$call_id26|RTS|$senderid\n";	
            	
				//	echo $cdr_text = $final_array['datetime2']."\n";
				$indis = 0 ;
						while ($users['list']["$indis"]) {
			//		foreach ($users['list'] as $user) {
				
					if($users['list'][$indis]['credentials']['userName'] == $username) 
						
						{
							$user_id = $users['list'][$indis]['id'];  break;
						}
					
						
					
					
					 $indis++;
				}
				
					if($final_data[17] == "sec"){
								$sec = 0;
								$date3->modify($sec." Sec");
								$sec_d = $date3->format('YmdHis');
							//	echo	print_r($sec_d."4444444444444444444444444444444444444444444444444444444");	
					}
						if($final_data[11]== "ICMP")
						{
						$dst_ip	= 0;
						$dst_port = 0;
						$d = str_replace(")","",$final_data[15]);
						$dst_ip = str_replace("(","",$d);
					//	echo	print_r($dst_ip."4444444444444444444444444444444444444444444444444444444");	
						$baglanti_pvc  = $final_data[17];
						}
						if($dst_ip == "["){
							
								$dst =  explode(':',$final_data[14]);
						
								$dst[0] = str_replace(")","",$dst[0]);
								$dst_ip = str_replace("(","",$dst[0]);
								$dst_port = 0;
								if(isset($dst[1]))$dst_port = $dst[1];
					//	echo	print_r($dst_ip."4444444444444444444444444444444444444444444444444444444");	
							
						}
			//	var_dump($final_data[11]."................");

					echo $cdr_text = $username.'@izmar|'. $local_ip.'|'. $local_port.'|'. $local_port.'|'.$dst_ip.'|'.$dst_port.'|'.$dst_port.'|'.$datetime2.'|'.$sec_d.'|'.$upload.'|'.$download.'|user_request|session_stop|'.$baglanti_pvc.'|'.$user_id.'|'.$id.'<p>';
					//echo $cdr_text = $final_array['datetime2']."<p>";
				//fwrite($dosya,$cdr_text);
				//fwrite($dosya,"\n");
			 $i++;
			}
			*/
		//	fclose($dosya);
try {

		$paramskerio = array(
		'logName' => 'connection',
	);
     $api->sendRequest('Logs.clear', $paramskerio);
     $api->logout();
} catch (KerioApiException $error) {
    print $error->getMessage();
}