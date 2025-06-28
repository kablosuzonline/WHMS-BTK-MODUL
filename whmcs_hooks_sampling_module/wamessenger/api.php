<?php
/* WHMCS Whatsapp Addon with GNU/GPL Licence
 * wamessenger - https://wamessenger.net
 * 
 * 
 * Licence: GPLv3 (http://www.gnu.org/licenses/gpl-3.0.txt)
 * */
use WHMCS\Database\Capsule;


class wamessenger{

    var $sender;
    public $api_key;
    public $api_token;
    public $sender_id;
    public $params;
    public $gsmnumber;
    public $message;
    public $countrycode;
    /** PHP Library */
    public $app;

    public $userid;
    var $errors = array();
    var $logs = array();

    public function __construct()
    {
        require_once("lib/wamessenger.class.php");
        $this->app=new wamessengerAPI();
    }

    /**
     * @param mixed $countrycode
     */
    public function setCountryCode($countrycode){
        $this->countrycode = $this->getCodeBy($countrycode);
    }

    /**
     * @return mixed
     */
    public function getCountryCode(){
        return $this->countrycode;
    }

    /**
     * @param mixed $gsmnumber
     */
    public function setGsmnumber($gsmnumber){
        $this->gsmnumber = $this->util_gsmnumber($gsmnumber);
    }

    /**
     * @return mixed
     */
    public function getGsmnumber(){
        return $this->gsmnumber;
    }

    /**
     * @param mixed $message
     */
    public function setMessage($message, $invoice_pdf_file = '' , $invoiceid = ''){
        //$this->message = $this->util_convert($message);
        $this->message = $message;
        $this->invoice_pdf_file = $invoice_pdf_file;
        $this->invoiceid = $invoiceid;
    }

    /**
     * @return mixed
     */
    public function getMessage(){
        return $this->message;
    }

    /**
     * @param int $userid
     */
    public function setUserid($userid){
        $this->userid = $userid;
    }

    /**
     * @return int
     */
    public function getUserid(){
        return $this->userid;
    }

  
    /**
     * @return mixed
     */
    public function getSender(){
        $settings = $this->apiSettings();
        if(!$settings['api_key'] && !$settings['api_token']){
            $this->addError("Invalid API Details");
            $this->addLog("Invalid API Details");
            return false;
        }else{
            return [
                'api_key'   =>  $settings['api_key'],
                'api_token' =>  $settings['api_token'],
                'sender_id' =>  $settings['sender_id']
            ];
        }
    }

    /**
     * @return array
     */
    public function apiSettings(){
        $result = select_query("mod_wamessenger_settings", "*","");

        return mysql_fetch_array($result);
    }

    function send(){
        $api_details = $this->getSender();
        if($api_details == false){
            return false;
        }else{
            $message = $this->message;
            $invoice_pdf_file = $this->invoice_pdf_file;
            $invoiceid = $this->invoiceid;
            $this->addLog("Sernder ID: ".$this->sender_id);
            $this->addLog("To: ".$this->getGsmnumber());
            $this->addLog("Message: ".$message);
            $this->addLog("SenderClass: ".$api_details);
            $this->app->setSenderID($api_details['sender_id']);
            $this->app->setUser($api_details['api_key'],$api_details['api_token']);
            $numbers = $this->getGsmnumber();
            if(!$numbers){
                return false;
            }
            $country_code = $this->getCountryCode();
            
            if (!is_array($numbers)){
                $numbers = explode(' ', $numbers);
            }

            $to = $numbers[0];

            if(substr( $numbers[0], 0, 1 ) === "0"){
                $numbers = array($country_code.substr($numbers[0],1 ));
                $to = $country_code.substr($to,1 );
            }
            
            $settings = $this->apiSettings();
            $request = mysql_fetch_assoc($this->checkcode($to));

            if( $settings['wantwhatsappfield'] == 1 && $request['status'] == 1){
                $send = $this->app->SendMessage($numbers,$message,$invoice_pdf_file);
            }else if($settings['wantwhatsappfield'] == 0 && $settings['permissionsend'] == 0){
                $send = $this->app->SendMessage($numbers,$message,$invoice_pdf_file);
            }else if($settings['permissionsend'] == 1 && $request['request'] == 1){
                $send = $this->app->SendMessage($numbers,$message,$invoice_pdf_file);
            }else{
                $send = 'permission to send';
            }
            
            if(count((array)$this->getGsmnumber()) > 1){
                $to = 'group';
            }
            
            if(empty($send) || !$this->isJSON($send)){
                $this->saveToDb(rand(1,9999999),'error',$send,'','',$to, $invoiceid);
                return false;
            }
            
            $send = json_decode($send);
            $uid = implode(array_column((array)$send, 'tracking_Code'));

            if(!empty($send) && count((array)$numbers) > 1){
                $uid = implode(",",array_column((array)$send, 'tracking_Code'));
            }

            $this->saveToDb(rand(1,9999999),'success','','', $uid, $to, $invoiceid);
            $this->addLog('Message has been sent');
            return true;
        }
    }
    
    function isJSON($string){
       return is_string($string) && is_array(json_decode($string, true)) && (json_last_error() == JSON_ERROR_NONE) ? true : false;
    }
    
    function getBalance(){
        $api_details = $this->getSender();
        if($api_details == false){
            return false;
        }else{
            $this->app->setSenderID($api_details['sernder_id']);
            $this->app->setUser($api_details['api_key'],$api_details['api_token']);
            $balance=$this->app->CheckBalance();
            if($balance == false){
                return false;
            }else{
                return $balance['balance'];
            }
        }
    }

    function getReport($uid){
        $result = full_query("SELECT group_id FROM mod_wamessenger_messages WHERE uid = '$uid' LIMIT 1");
        $result = mysql_fetch_array($result);
        $sender_function = $result['group_id'];
        if($sender_function == false){
            return false;
        }else{
            $st=$this->app->CheckStatus($result['group_id']);
            if($st['status'] == 'error'){
                return false;
            }else{
                return $st;
            }
        }
    }

    function getLists(){
        if ($handle = opendir(dirname(__FILE__).'/hooks')) {
            while (false !== ($entry = readdir($handle))) {
                if(substr($entry,strlen($entry)-4,strlen($entry)) == ".php"){
                    $file[] = require_once('hooks/'.$entry);
                }
            }
            closedir($handle);
        }
        return $file;
    }

    function saveToDb($group_id,$status,$errors = null,$logs = null, $uid = '', $to= '', $invoiceid){
        $now = date("Y-m-d H:i:s");
        $table = "mod_wamessenger_messages";
        
        $values = array(

            "to" => $to,
            "text" => $this->getMessage(),
            "group_id" => $group_id,
            "uid"   =>  $uid,
            "attachment" =>  $invoiceid,
            "status" => $status,
            "errors" => $errors,
            "logs" => $logs,
            "user" => $this->getUserid(),
            "datetime" => $now
        );

        Capsule::table($table)->insert($values);


        $this->addLog("Message saved to the database");
    }

    /* Main message convert function. Will be removed next release */
    function util_convert($message){
        $changefrom = array('ı', 'İ', 'ü', 'Ü', 'ö', 'Ö', 'ğ', 'Ğ', 'ç', 'Ç','ş','Ş');
        $changeto = array('i', 'I', 'u', 'U', 'o', 'O', 'g', 'G', 'c', 'C','s','S');
        return str_replace($changefrom, $changeto, $message);
    }

    /* Default number format */
    function util_gsmnumber($number){
        $replacefrom = array('-', '(',')', '.', ',', '+', ' ');
        $number = str_replace($replacefrom, '', $number);
       //$number=$this->app->RouteNumber($number);// Removed
        return $number;
    }

    public function addError($error){
        $this->errors[] = $error;
    }

    public function addLog($log){
        $this->logs[] = $log;
    }

    /**
     * @return array
     */
    public function getErrors()
    {
        $res = '<pre><p><ul>';
        foreach($this->errors as $d){
            $res .= "<li>$d</li>";
        }
        $res .= '</ul></p></pre>';
        return $res;
    }

    /**
     * @return array
     */
    public function getLogs()
    {
        $res = '<pre><p><strong>Debug Result</strong><ul>';
        foreach($this->logs as $d){
            $res .= "<li>$d</li>";
        }
        $res .= '</ul></p></pre>';
        return $res;
    }

    /*
     * Runs at addon install/update
     * This function controls that if there is any change at lists files. Such as new lists, variable changes at lists.
     */
    function checkLists($lists = null){
        if($lists == null){
            $lists = $this->getLists();
        }

        $i=0;
        foreach($lists as $lists){
            $sql = "SELECT `id` FROM `mod_wamessenger_templates` WHERE `name` = '".$lists['function']."' LIMIT 1";
            $result = full_query($sql);
            $num_rows = mysql_num_rows($result);
            if($num_rows == 0){
                if($lists['function']){
                    $values = array(
                        "name" => $lists['function'],
                        "type" => $lists['type'],
                        "template" => $lists['defaultmessage'],
                        "variables" => $lists['variables'],
                        "extra" => $lists['extra'],
                        "description" => $lists['description'],
                        "active" => 1
                    );
                    insert_query("mod_wamessenger_templates", $values);
                    $i++;
                }
            }else{
                $values = array(
                    "type" => $lists['type'],
                    "description" => $lists['description'],
                    "variables" => $lists['variables']
                );
                update_query("mod_wamessenger_templates", $values, "name = '" . $lists['function']."'");
            }
        }
        return $i;
    }

    function getTemplateDetails($template = null){
        $where = array("name" => $template);
        $result = select_query("mod_wamessenger_templates", "*", $where);
        $data = mysql_fetch_assoc($result);

        return $data;
    }

    function changeDateFormat($date = null){
        $settings = $this->apiSettings();
        $dateformat = $settings['dateformat'];
        if(!$dateformat){
            return $date;
        }

        $createDate = new DateTime($date);
        $date = $createDate->format('Y-m-d');
        
        $date = explode("-",$date);
        $year = $date[0];
        $month = $date[1];
        $day = $date[2];

        $dateformat = str_replace(array("%d","%m","%y"),array($day,$month,$year),$dateformat);
        return $dateformat;
    }

    function getClientDetailsBy($clientId){
            $userSql = "SELECT a.currency,a.email,`a`.`id`,`a`.`firstname`, `a`.`lastname`, `a`.`phonenumber` as `gsmnumber`, `a`.`country`
        FROM `tblclients` as `a` WHERE `a`.`id`  = '".$clientId."'
        LIMIT 1";
        return full_query($userSql);
    }
    function getClientAndInvoiceDetailsBy($clientId){
        $userSql = "
        SELECT a.date, a.datepaid, a.subtotal, a.tax, a.taxrate, a.status, a.paymentmethod, a.total,a.duedate,b.id as userid,b.firstname,b.lastname,`b`.`country`,b.credit,b.email,b.companyname,b.currency,`b`.`phonenumber` as `gsmnumber` FROM `tblinvoices` as `a`
        JOIN tblclients as b ON b.id = a.userid
        WHERE a.id = '".$clientId."' and a.status !='Draft'
        LIMIT 1
    ";
        return full_query($userSql);
    }

    function getClientAndTicketDetailsBy($ticketId){
        $userSql = "
        SELECT a.did, a.tid, a.date, a.title, a.message, a.status, a.service, a.lastreply,a.urgency,b.id as userid,b.firstname,b.lastname,`b`.`country`,b.credit,b.email,b.companyname,b.currency,`b`.`phonenumber` as `gsmnumber` FROM `tbltickets` as `a`
        JOIN tblclients as b ON b.id = a.userid
        WHERE a.id = '".$ticketId."'
        LIMIT 1
    ";
        return full_query($userSql);
    }
	
    function pdfInvoice($invoiceid){
        

        global $CONFIG;
        require_once ROOTDIR .'/includes/invoicefunctions.php';
        $pdfdata = pdfInvoice($invoiceid);
        $URL = $CONFIG['SystemURL'];
        $base_module_url = dirname( __DIR__ )  . DIRECTORY_SEPARATOR . 'wamessenger'. DIRECTORY_SEPARATOR. 'files'. DIRECTORY_SEPARATOR;
        $path = $base_module_url.$invoiceid.'.pdf';
        file_put_contents( $path, $pdfdata );
        $file_link = $URL.'/modules/addons/wamessenger/files/'.$invoiceid.'.pdf';
        return $file_link;

    }    

    function unlinkfile($folder,$filename) {
        $base_module_url = dirname( __DIR__ )  . DIRECTORY_SEPARATOR . 'wamessenger'. DIRECTORY_SEPARATOR.$folder. DIRECTORY_SEPARATOR;
        $path = $base_module_url.$filename;
        unlink($path);
    }
    
    function errors($errors) {
        switch($errors){
            case 'Unauthorized':
            return'APIKEY not valid';
            break;
            case 'permission to send':
            return'not permission to send';
            break;
            case 'Bad Request':
            return'Plan upgrade required';
            break;
              default:
            return "error sending";
        }
    }
    
    function wacurl($path,$params) {
        $api_details = $this->getSender();
        $this->app->setSenderID($api_details['sender_id']);$this->app->setUser($api_details['api_key'],$api_details['api_token']);
        $result = $this->app->Call3($path,$params);
        return $result;
    }
    
    function customfieldsvalues($userid,$fieldid) {
        $where = array("relid" => $userid, "fieldid" => $fieldid);
        $result = select_query("tblcustomfieldsvalues", "value", $where);
        $data = mysql_fetch_assoc($result);

        return $data['value'];

    }    
    
    function upgrade($vars) {
        
        $currentlyInstalledVersion = $vars['version'];
    
        if ($currentlyInstalledVersion < '1.5.1' ) {
            
            $query = "ALTER TABLE mod_wamessenger_templates MODIFY COLUMN template VARCHAR(1500) CHARACTER SET utf8 COLLATE utf8_general_ci;";
            full_query($query);
            $query = "ALTER TABLE mod_wamessenger_templates MODIFY COLUMN variables VARCHAR(1000) CHARACTER SET utf8 COLLATE utf8_general_ci;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_templates` ADD `attachment` tinyint(1) NOT NULL AFTER `extra`;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_messages` ADD `attachment` varchar(25) DEFAULT NULL AFTER `uid`;";
            full_query($query);
            $query = "ALTER TABLE mod_wamessenger_settings MODIFY COLUMN api_key VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_general_ci;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` CHANGE `gsmnumberfield` `gsmnumberfield` INT(11) NULL DEFAULT '0';";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` CHANGE `calender` `calender` varchar(40) CHARACTER SET utf8 DEFAULT 'gregorian';";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `all_delete` tinyint(1) NOT NULL AFTER `calender`;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `disable` tinyint(1) NOT NULL AFTER `all_delete`;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `autoupdate` tinyint(1) NOT NULL DEFAULT '1' AFTER `disable`;";
            full_query($query);
            $query = "DELETE IGNORE FROM `mod_wamessenger_templates` WHERE `name`='InvoiceCreationAdminAreaWa'";
            full_query($query);
            $query = "DELETE IGNORE FROM `mod_wamessenger_templates` WHERE `name`='AdminHomepageWa'";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `adminwhatsapp` varchar(40) NOT NULL AFTER `autoupdate`;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_templates` CHANGE `type` `type` ENUM('client','admin','conf') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;";
            full_query($query);
            
            
            $folder = 'hooks';
            $filename = 'invoicecreationadminarea.php';
            $this->unlinkfile($folder,$filename);
        }
        
        if ($currentlyInstalledVersion < '1.5.8' ) {
            $query = "UPDATE `mod_wamessenger_settings` SET `version` = '1.5.8';";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `permissionsend` tinyint(1) NULL AFTER `version`;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `permissionsend_text` VARCHAR(1500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL AFTER `permissionsend`;";
            full_query($query);
            $query = "ALTER TABLE `mod_wamessenger_settings` ADD `active_deactive` tinyint(1) NOT NULL AFTER `permissionsend_text`;";
            full_query($query);
            $query = "DELETE IGNORE FROM `mod_wamessenger_templates` WHERE `name`='AdminHomepageWa' OR `name`= 'ClientAreaPageProfileWa' or `name`= 'ClientAreaNavbarsWa'";
            full_query($query);
        }
        
        $this->checkLists();
        

        

    }
    
    function autoupdate() {
        $checkupdate = $this->checkupdate();
        $settings = $this->apiSettings();
        $version = $settings['version'];
        if($checkupdate === true){
            $base_module_url = dirname( __DIR__ )  . DIRECTORY_SEPARATOR . 'wamessenger'. DIRECTORY_SEPARATOR. 'files'. DIRECTORY_SEPARATOR;
            $getfile = file_put_contents($base_module_url.'Tmpfile.zip', file_get_contents("https://wamessenger.net/whmcs/last/whmcs_wamessenger.zip?v=".$version));
            if ($getfile > 0) {
                $zip = new ZipArchive;
                $res = $zip->open($base_module_url.'Tmpfile.zip');
                if ($res === TRUE) {
                    $zip->extractTo(dirname( __DIR__ ));
                    $zip->close();
                    $this->checkLists();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

    }   
    
    function checkupdate() {
        $settings = $this->apiSettings();
        $version = $settings['version'];
        $curl_handle=curl_init();
		curl_setopt_array($curl_handle, array(
		  CURLOPT_URL => 'http://wamessenger.net/whmcs/whmcs-version.txt',
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_FAILONERROR => true,
		));
        $checkupdate = curl_exec($curl_handle);
        curl_close($curl_handle);

        if($checkupdate > $version){ 
            return true;
        }else{
            return false;
        }
            
    } 
    
    function getCodeBy($countrycode){
        $countries = array();
        $countries["AF"]="93";
        $countries["AF"]="93";
        $countries["AL"]="355";
        $countries["DZ"]="213";
        $countries["AS"]="1";
        $countries["AD"]="376";
        $countries["AO"]="244";
        $countries["AI"]="1";
        $countries["AG"]="1";
        $countries["AR"]="54";
        $countries["AM"]="374";
        $countries["AW"]="297";
        $countries["AU"]="61";
        $countries["AT"]="43";
        $countries["AZ"]="994";
        $countries["BH"]="973";
        $countries["BD"]="880";
        $countries["BB"]="1";
        $countries["BY"]="375";
        $countries["BE"]="32";
        $countries["BZ"]="501";
        $countries["BJ"]="229";
        $countries["BM"]="1";
        $countries["BT"]="975";
        $countries["BO"]="591";
        $countries["BA"]="387";
        $countries["BW"]="267";
        $countries["BR"]="55";
        $countries["IO"]="246";
        $countries["VG"]="1";
        $countries["BN"]="673";
        $countries["BG"]="359";
        $countries["BF"]="226";
        $countries["MM"]="95";
        $countries["BI"]="257";
        $countries["KH"]="855";
        $countries["CM"]="237";
        $countries["CA"]="1";
        $countries["CV"]="238";
        $countries["KY"]="1";
        $countries["CF"]="236";
        $countries["TD"]="235";
        $countries["CL"]="56";
        $countries["CN"]="86";
        $countries["CO"]="57";
        $countries["KM"]="269";
        $countries["CK"]="682";
        $countries["CR"]="506";
        $countries["CI"]="225";
        $countries["HR"]="385";
        $countries["CU"]="53";
        $countries["CY"]="357";
        $countries["CZ"]="420";
        $countries["CD"]="243";
        $countries["DK"]="45";
        $countries["DJ"]="253";
        $countries["DM"]="1";
        $countries["DO"]="1";
        $countries["EC"]="593";
        $countries["EG"]="20";
        $countries["SV"]="503";
        $countries["GQ"]="240";
        $countries["ER"]="291";
        $countries["EE"]="372";
        $countries["ET"]="251";
        $countries["FK"]="500";
        $countries["FO"]="298";
        $countries["FM"]="691";
        $countries["FJ"]="679";
        $countries["FI"]="358";
        $countries["FR"]="33";
        $countries["GF"]="594";
        $countries["PF"]="689";
        $countries["GA"]="241";
        $countries["GE"]="995";
        $countries["DE"]="49";
        $countries["GH"]="233";
        $countries["GI"]="350";
        $countries["GR"]="30";
        $countries["GL"]="299";
        $countries["GD"]="1";
        $countries["GP"]="590";
        $countries["GU"]="1";
        $countries["GT"]="502";
        $countries["GN"]="224";
        $countries["GW"]="245";
        $countries["GY"]="592";
        $countries["HT"]="509";
        $countries["HN"]="504";
        $countries["HK"]="852";
        $countries["HU"]="36";
        $countries["IS"]="354";
        $countries["IN"]="91";
        $countries["ID"]="62";
        $countries["IR"]="98";
        $countries["IQ"]="964";
        $countries["IE"]="353";
        $countries["IL"]="972";
        $countries["IT"]="39";
        $countries["JM"]="1";
        $countries["JP"]="81";
        $countries["JO"]="962";
        $countries["KZ"]="7";
        $countries["KE"]="254";
        $countries["KI"]="686";
        $countries["XK"]="381";
        $countries["KW"]="965";
        $countries["KG"]="996";
        $countries["LA"]="856";
        $countries["LV"]="371";
        $countries["LB"]="961";
        $countries["LS"]="266";
        $countries["LR"]="231";
        $countries["LY"]="218";
        $countries["LI"]="423";
        $countries["LT"]="370";
        $countries["LU"]="352";
        $countries["MO"]="853";
        $countries["MK"]="389";
        $countries["MG"]="261";
        $countries["MW"]="265";
        $countries["MY"]="60";
        $countries["MV"]="960";
        $countries["ML"]="223";
        $countries["MT"]="356";
        $countries["MH"]="692";
        $countries["MQ"]="596";
        $countries["MR"]="222";
        $countries["MU"]="230";
        $countries["YT"]="262";
        $countries["MX"]="52";
        $countries["MD"]="373";
        $countries["MC"]="377";
        $countries["MN"]="976";
        $countries["ME"]="382";
        $countries["MS"]="1";
        $countries["MA"]="212";
        $countries["MZ"]="258";
        $countries["NA"]="264";
        $countries["NR"]="674";
        $countries["NP"]="977";
        $countries["NL"]="31";
        $countries["AN"]="599";
        $countries["NC"]="687";
        $countries["NZ"]="64";
        $countries["NI"]="505";
        $countries["NE"]="227";
        $countries["NG"]="234";
        $countries["NU"]="683";
        $countries["NF"]="672";
        $countries["KP"]="850";
        $countries["MP"]="1";
        $countries["NO"]="47";
        $countries["OM"]="968";
        $countries["PK"]="92";
        $countries["PW"]="680";
        $countries["PS"]="970";
        $countries["PA"]="507";
        $countries["PG"]="675";
        $countries["PY"]="595";
        $countries["PE"]="51";
        $countries["PH"]="63";
        $countries["PL"]="48";
        $countries["PT"]="351";
        $countries["PR"]="1";
        $countries["QA"]="974";
        $countries["CG"]="242";
        $countries["RE"]="262";
        $countries["RO"]="40";
        $countries["RU"]="7";
        $countries["RW"]="250";
        $countries["BL"]="590";
        $countries["SH"]="290";
        $countries["KN"]="1";
        $countries["MF"]="590";
        $countries["PM"]="508";
        $countries["VC"]="1";
        $countries["WS"]="685";
        $countries["SM"]="378";
        $countries["ST"]="239";
        $countries["SA"]="966";
        $countries["SN"]="221";
        $countries["RS"]="381";
        $countries["SC"]="248";
        $countries["SL"]="232";
        $countries["SG"]="65";
        $countries["SK"]="421";
        $countries["SI"]="386";
        $countries["SB"]="677";
        $countries["SO"]="252";
        $countries["ZA"]="27";
        $countries["KR"]="82";
        $countries["ES"]="34";
        $countries["LK"]="94";
        $countries["LC"]="1";
        $countries["SD"]="249";
        $countries["SR"]="597";
        $countries["SZ"]="268";
        $countries["SE"]="46";
        $countries["CH"]="41";
        $countries["SY"]="963";
        $countries["TW"]="886";
        $countries["TJ"]="992";
        $countries["TZ"]="255";
        $countries["TH"]="66";
        $countries["BS"]="1";
        $countries["GM"]="220";
        $countries["TL"]="670";
        $countries["TG"]="228";
        $countries["TK"]="690";
        $countries["TO"]="676";
        $countries["TT"]="1";
        $countries["TN"]="216";
        $countries["TR"]="90";
        $countries["TM"]="993";
        $countries["TC"]="1";
        $countries["TV"]="688";
        $countries["UG"]="256";
        $countries["UA"]="380";
        $countries["AE"]="971";
        $countries["GB"]="44";
        $countries["US"]="1";
        $countries["UY"]="598";
        $countries["VI"]="1";
        $countries["UZ"]="998";
        $countries["VU"]="678";
        $countries["VA"]="39";
        $countries["VE"]="58";
        $countries["VN"]="84";
        $countries["WF"]="681";
        $countries["YE"]="967";
        $countries["ZM"]="260";
        $countries["ZW"]="263";
        
        return $countries[$countrycode];
        
    }

	/*
	 * Create a random string
	 * @author	Karmandeep Singh <info@kayecommerce.com>
	 * @param $length the length of the string to create
	 * @return $str the string
	 */
	function randomString($length = 6 , $num_only = false) {
		$str = "";
		if($num_only):
			$characters = range('0','9');			
		else:
			$characters = array_merge(range('A','Z'), range('a','z'), range('0','9'));
		endif;
		$max = count($characters) - 1;
		for ($i = 0; $i < $length; $i++) {
			$rand = mt_rand(0, $max);
			$str .= $characters[$rand];
		}
		return $str;
	}
	
	function checkcode( $phonenumber ) {
	    $phonenumber = substr($phonenumber,4);
	    $query = "SELECT `otp`,`status`,`request` FROM `mod_wamessenger_otp` WHERE `phonenumber` LIKE '%".$phonenumber."%' LIMIT 1";
        return full_query($query);
	}
	
    function insertcode( $code,$gsmnumber ) {
        $now = date("Y-m-d H:i:s");
        $table = "mod_wamessenger_otp";
        $values = array(
            "otp" => $code,
            "type" => 'client',
            "datetime" => $now,
            "phonenumber"   =>  $gsmnumber,
        );

        Capsule::table($table)->insert($values);
	}
	
	function updatecode( $gsmnumber,$status ) {
	    $phonenumber = substr($gsmnumber,4);
	    $values = array(
            "status" => $status,
        );
        update_query("mod_wamessenger_otp", $values, "phonenumber LIKE '%". $phonenumber."%'");
	}  

	function updaterequest( $gsmnumber,$request ) {
	    $phonenumber = substr($gsmnumber,4);
	    $values = array(
            "request" =>$request
        );
        update_query("mod_wamessenger_otp", $values, "phonenumber LIKE '%". $phonenumber."%'");
	}  	

	function getUnverifiedOTP( $clientId ) {
		
		$result = select_query( "mod_wamessenger_otp", '', array( "relid" => $clientId , "type" => 'client' , 'status' => 1 ) );
		while($data = mysql_fetch_array( $result , MYSQL_ASSOC)) {
			$return_data[] = $data;
		}
		
        return $return_data;
	}
	
	function getOtp( $otpId ) {
		
		$result = select_query( "mod_wamessenger_otp", '', array( "id" => $otpId ) );
		return mysql_fetch_array( $result , MYSQL_ASSOC );		
	}
	
	function getClientOTP( $clientId ) {
		$result = select_query( "mod_wamessenger_otp", '', array( "relid" => $clientId , "type" => 'client' ) );
		while($data = mysql_fetch_array( $result , MYSQL_ASSOC)) {
			$return_data[] = $data;
		}
		
        return $return_data;
	}

}
