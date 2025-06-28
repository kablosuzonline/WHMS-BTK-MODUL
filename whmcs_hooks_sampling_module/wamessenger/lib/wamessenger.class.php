<?php
/**
 * wamessenger 
 * Copyright @ 2022 wamessenger.net
 * Customer Service : +380947100686
 * Email : support@wamessenger.net
 */

class wamessengerAPI {

    private $user_token; // USER API TOKEN
    private $user_key; //USER API KEY
    private $sender_id="wamessenger"; //USER SENDER KEY AND DEFAULT Web
    private $country_code="";//Default Country Code with out +
    protected $url='https://api.wamessenger.net/'; // ALWAYS USE THIS LINK TO CALL API SERVICE
    
    public $msgType="whatsapp";// Message type whatsapp/voice/unicode/flash/music/mms/whatsapp
    public $route=0;// Your Routing Path Default 0
    public $file=false;// File URL for voice or whatsapp. Default not set
    public $scheduledate=false;//Date and Time to send message (YYYY-MM-DD HH:mm:ss) Default not use
    public $duration=false;//Duration of your voice message in seconds (required for voice)
    public $language=false;//Language of voice message (required for text-to-speach)

    /**
     * To Find your api details please log and go into https://wamessenger.net
     */
    /**
     * Call to site
     */
    public function Call3($path,$params){

            $curl_handle=curl_init();
			curl_setopt_array($curl_handle, array(
			  CURLOPT_URL => $this->url.$path.$this->user_key.$params,
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => '',
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 0,
			  CURLOPT_FOLLOWLOCATION => true,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => 'GET',
			));
            $buffer = curl_exec($curl_handle);
            curl_close($curl_handle);
            if($buffer){ 
                return $buffer;
            }else{
                return false;
            }
    }

    private function Call2($params,$Mobile,$TEXT,$invoice_pdf_file){
        
            $curl_handle=curl_init();
			$TEXT = str_replace("&#039;","'",$TEXT);
            $TEXT = str_replace("&quot;",'"',$TEXT);
            $data=array();
            if($invoice_pdf_file){
            $data=[
                'phonenumber' => $Mobile,
                'text' => $TEXT,
                'url' => $invoice_pdf_file,
             ];
            }else{
            $data=[
                'phonenumber' => $Mobile,
                'text' => $TEXT
             ];
            }

            curl_setopt_array($curl_handle, array(
			  CURLOPT_URL => $this->url.'/sendMessage/'.$this->user_key,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'POST',
              CURLOPT_POSTFIELDS => http_build_query($data)
            ));
            
            $buffer = curl_exec($curl_handle);
            curl_close($curl_handle);

            if($buffer){ 
                return $buffer;
            }else{
                return false;
            }
    }
    
    /**
     * Set user Credentials
     * @return boolen
     */
    public function setUser($key,$token){
        if($key && $token){
            $this->user_key=$key;
            $this->user_token=$token;
            return true;
        }else{
            return false;
        }
    }

    /**
     * Set Sender ID
     * @return boolen
     */
    public function setSenderID($sender_id){
        if($sender_id){
            $this->sender_id=$sender_id;
            return true;
        }else{
            return false;
        }
    }

    /**
     * Set Default Routing
     * @return boolen
     */
    public function RouteNumber($number){
        if($number){
            $explode=str_split($number);
            if($explode[0]=="+"){
                unset($explode[0]);
                $number=implode("",$explode);
            }else{
                if($explode[0]==0){
                    unset($explode[0]);
                    $number=implode("",$explode);
                }
                $number=$this->country_code.$number;
            }
            return $number;
        }else{
            return false;
        }
    }

    /**
     * Check avalible credit balance
     * @return array
     */
    public function CheckBalance($json=FALSE){
        $param='action=check-balance&api_key='.$this->user_key.'&apitoken='.$this->user_token;
        if($result=$this->Call2($param,$Mobile,$TEXT)){
            if($json===FALSE){
                $c=json_decode($result,true);
                if($c['balance'] !="error"){
                    return false;
                }else{
                    return $c;
                }
            }else{
                return $result;
            }
        }else{
            return false;
        }
    }

    /**
     * Check whatsapp status
     * group_id = The group_id returned by send whatsapp request
     * @return array
     */
    public function CheckStatus($group_id,$json=FALSE){
        if($group_id){
            $param="&groupstatus&apikey=".$this->user_key."&apitoken=".$this->user_token."&groupid=".$group_id;
            if($res=$this->Call2($param,$Mobile,$TEXT)){
                if($json===FALSE){
                    $c=json_decode($res);//You can also use direct json by call json as true
                    if($c['status']=="error"){
                        return false;
                    }else{
                        return $c;
                    }
                }else{
                    return $res;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    /**
     * Send Message
     * @return boolen
     */
    public function SendMessage($Mobile,$TEXT,$invoice_pdf_file,$json=FALSE){
       // $TEXT=urlencode($TEXT);
        if($this->sender_id !="" && $this->user_key !="" && $this->user_token !=""){
            if($Mobile){
                if($TEXT){
                   // $Mobile=$this->RouteNumber($Mobile); // Never used for whmcs  because this function already have
                    $param='ApiKey='.$this->user_key.'&ClientId='.$this->user_token.'&SenderId='.$this->sender_id.'&MobileNumbers='.$Mobile.'&type='.$this->msgType;if($this->route != 0) $param.='&route='.$this->route;
                    if($this->msgType=="whatsapp" || $this->msgType=="unicode"){
                        //whatsapp
                       $param.='&Message='.$TEXT;
                    }elseif($this->msgType=="voice" || $this->msgType=="mms"){
                        //Voice And MMS
                        if($this->file){
                            $param.='&text='.$TEXT.'&file='.$this->file;
                            if($this->msgType=="voice" && $this->duration !=false){
                                $param.='&duration='.$this->duration;
                            }
                        }else{
                            return false;
                        }
                    }elseif($this->msgType=="whatsapp"){
                        //WhatsAPP
                        $param.='&text='.$TEXT;
                        if($this->file){
                            $param.='&file='.$this->file;
                        }
                    }elseif($this->msgType=="flash"){
                        //Flash
                        $param.='&text='.$TEXT;
                        if($this->file){
                            $param.='&file='.$this->file;
                        }
                    }
                    if($this->scheduledate!=false){
                        $param.='&scheduledate='.$this->scheduledate;
                    }
                    if($this->language!=false){
                        $param.='&language='.$this->language;
                    }

                    if($res=$this->Call2($param,$Mobile,$TEXT,$invoice_pdf_file)){
                        if($json !=FALSE){
                            return $res;
                        }else{
                            $c=json_decode($res);
                            return $res;
                        }
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

}
?>