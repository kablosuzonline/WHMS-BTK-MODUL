<?php
/* WHMCS Whatsapp Addon with GNU/GPL Licence
 * wamessenger - https://wamessenger.net
 * 
 * 
 * Licence: GPLv3 (http://www.gnu.org/licenses/gpl-3.0.txt)
 * */
 
if (!defined("WHMCS"))
	die("This file cannot be accessed directly");
	
	use WHMCS\Database\Capsule;
	
	

function wamessenger_config() {
    $configarray = [
            "name" => "WhatsApp Notify",
            "description" => "WaMessenger- WHMCS Whastapp Addon. To Create Account <a href=\"https://wamessenger.net/\" target='_blank'>WaMessenger</a>",
            "version" => "1.5.8",
            "author" => "<img src='https://wamessenger.net/wp-content/uploads/2022/07/logo-wamessenger-v3.png' width='80'>",
            "language" => "english",
        ];
    return $configarray;
}


function wamessenger_activate() {
    
    try {
            $query = "CREATE TABLE IF NOT EXISTS `mod_wamessenger_settings` (`id` int(11) NOT NULL AUTO_INCREMENT,`permissionsend_text` varchar(1500) CHARACTER SET utf8 NOT NULL,`api_key` varchar(500) CHARACTER SET utf8 NOT NULL,`api_token` varchar(500) CHARACTER SET utf8 NOT NULL,`sender_id` varchar(500) CHARACTER SET utf8 NULL,`wantwhatsappfield` int(11) DEFAULT NULL,`gsmnumberfield` int(11) DEFAULT 0,`dateformat` varchar(12) CHARACTER SET utf8 DEFAULT NULL,`adminwhatsapp` varchar(40) NOT NULL,`calender` varchar(40) CHARACTER SET utf8 DEFAULT 'gregorian',`permissionsend` tinyint(1) NULL,`active_deactive` tinyint(1) NOT NULL,`all_delete` tinyint(1) NOT NULL,`disable` tinyint(1) NOT NULL,`autoupdate` tinyint(1) NOT NULL DEFAULT '1',`version` varchar(6) CHARACTER SET utf8 DEFAULT NULL,PRIMARY KEY (`id`)) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;";
            full_query($query);
        
            $query = "CREATE TABLE IF NOT EXISTS `mod_wamessenger_messages` (`id` int(11) NOT NULL AUTO_INCREMENT,`group_id` varchar(40) NOT NULL,`to` varchar(15) DEFAULT NULL,`text` text,`uid` varchar(50) DEFAULT NULL,`attachment` varchar(25) DEFAULT NULL,`status` varchar(150) DEFAULT NULL,`errors` text,`logs` text,`user` int(11) DEFAULT NULL,`datetime` datetime NOT NULL,PRIMARY KEY (`id`)) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
        	full_query($query);
        
            $query = "INSERT IGNORE  INTO `mod_wamessenger_settings` (`id`, `api_key`, `api_token`,`sender_id`, `wantwhatsappfield`, `gsmnumberfield`,`dateformat`, `calender`, `version`, `all_delete`, `disable`, `autoupdate`, adminwhatsapp,permissionsend,permissionsend_text,active_deactive) VALUES ('1', 'none', 'none','none', 'none', 0,'%d.%m.%y','gregorian','1.5.8',0,0,'1','','','','');";
        	full_query($query);
        
            $query = "CREATE TABLE IF NOT EXISTS `mod_wamessenger_templates` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(50) CHARACTER SET utf8 NOT NULL,`type` enum('client','admin') CHARACTER SET utf8 NOT NULL,`admingsm` varchar(255) CHARACTER SET utf8 NOT NULL,`template` varchar(1500) CHARACTER SET utf8 NOT NULL,`variables` varchar(1000) CHARACTER SET utf8 NOT NULL,`active` tinyint(1) NOT NULL,`extra` varchar(3) CHARACTER SET utf8 NOT NULL,`attachment` tinyint(1) NOT NULL,`description` text CHARACTER SET utf8,PRIMARY KEY (`id`)) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;";
        	full_query($query);
        
            $query = "CREATE TABLE IF NOT EXISTS `mod_wamessenger_otp` (`id` int(11) NOT NULL AUTO_INCREMENT,`otp` varchar(50) CHARACTER SET utf8 NOT NULL,`type` enum('client','admin') CHARACTER SET utf8 DEFAULT 'client',`relid` int(10) DEFAULT 0,`request` varchar(50) CHARACTER SET utf8 NOT NULL,`text` text,`status` tinyint(1) DEFAULT 0, `datetime` datetime NOT NULL, `phonenumber` text, PRIMARY KEY (`id`)) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;";
        	full_query($query);
            
            require_once("api.php");
            $api = new wamessenger();
            $api->checkLists();

            $update = array(
                "active_deactive" => '1'
            );
            update_query("mod_wamessenger_settings", $update, "");
            
            return array('status'=>'success','description'=>'wamessenger Addon successfully activated');
            return [
            'status' => "success",
            'description' => 'wamessenger Addon successfully activated',
        ];
        

    }catch (\Exception $e) {
        return [
            'status' => "error",
            'description' => 'Unable to create wamessenger Addon: ' . $e->getMessage(),
        ];
    }    
}

function wamessenger_deactivate() {
    require_once("api.php");
    $api = new wamessenger();
    $settings = $api->apiSettings();
    if($settings['all_delete'] == 1){
    
        try {
            Capsule::schema()->dropIfExists('mod_wamessenger_templates');
            Capsule::schema()->dropIfExists('mod_wamessenger_settings');
            Capsule::schema()->dropIfExists('mod_wamessenger_messages');
            Capsule::schema()->dropIfExists('mod_wamessenger_otp');
            
            return [
                'status' => 'success',
                'description' => 'wamessenger Addon successfully full deactivated',
            ];
        } catch (\Exception $e) {
            return [
                "status" => "error",
                "description" => "Unable to drop wamessenger Addon table: {$e->getMessage()}",
            ];
        }
    }else{
            return [
                "status" => "success",
                "description" => "wamessenger Addon successfully deactivated",
            ];
    }
}

function wamessenger_upgrade($vars)
{
    require_once("api.php");
    $api = new wamessenger();
    $api->upgrade($vars);
    
    $update = array(
        "active_deactive" => '0'
    );
    update_query("mod_wamessenger_settings", $update, "");
}



function wamessenger_clientarea($vars) {
 
}


function wamessenger_output($vars){
    require_once("api.php");
	$modulelink = $vars['modulelink'];
	$version = $vars['version'];
	$LANG = $vars['_lang'];
	putenv("TZ=Asia/Colombo");
    $api = new wamessenger();
    $tab = $_GET['tab'];
    $settings = $api->apiSettings();

    if($settings['active_deactive'] != 1){
        echo '<div class="detail">
        <span style="font-weight: 700; color: red;" >Note: After updating, you must deactivate and activate the module.</span>
        </div>';
    }
    echo '<div id="newsletters_whatsapp_system">
    
    <style>
    .contentarea{
        background: #f5f5f5 !important;
    }
    #clienttabs *{
        margin: inherit;
        padding: inherit;
        border: inherit;
        color: inherit;
        background: inherit;
        background-color: inherit;
    }
  

    #clienttabs{position: relative; z-index: 99;}
     #clienttabs ul li {
        display: inline-block;
        margin-right: 3px;
        border: 1px solid #ddd;
        border-bottom:0px;
        padding: 12px;
        margin-bottom: -1px;
     }
     #clienttabs ul a {
     border: 0px;;
     }
     #clienttabs ul {
        float:left;
        margin-bottom:0px;
     }
     #clienttabs{
        float:left;
     }
     

    </style>

    
    <div id="clienttabs">
        <ul>
            <li class="' . (($tab == "settings" || (@$_GET['type'] == "" && $tab == ""))?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&tab=settings">'.$LANG['settings'].'</a></li>
            <li class="' . ((@$_GET['type'] == "client")?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&tab=templates&type=client">'.$LANG['clientwhatsapptemplates'].'</a></li>
            <li class="' . ((@$_GET['type'] == "admin")?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&tab=templates&type=admin">'.$LANG['adminwhatsapptemplates'].'</a></li>
            <li class="' . (($tab == "sendwhatsapp")?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&tab=sendwhatsapp">'.$LANG['sendwhatsapp'].'</a></li>
            <li class="' . (($tab == "bulkwhatsapp")?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&tab=bulkwhatsapp">'.$LANG['bulkwhatsapp'].'</a></li>
            <li class="' . (($tab == "messages")?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&amp;tab=messages">'.$LANG['messages'].'</a></li>
            <li class="' . (($tab == "c")?"tabselected":"tab") . '"><a href="addonmodules.php?module=wamessenger&amp;tab=support">'.$LANG['support'].'</a></li>
        </ul>
    </div>
    <div style="clear:both;"></div>
    ';
   
    if (!isset($tab) || $tab == "settings")
    {
        /* UPDATE SETTINGS */
        if (isset($_POST['params'])) {
            $update = array(
                "api_key" => $_POST['api_key'],
                "api_token" => $_POST['api_token'],
                "sender_id" => $_POST['sender_id'],
                'gsmnumberfield' => $_POST['gsmnumberfield'],
                'dateformat' => $_POST['dateformat'],
				'calender' => $_POST['calender'],
				'all_delete' => $_POST['all_delete'],
				'disable' => $_POST['disable'],
				'autoupdate' => $_POST['autoupdate'],
				'wantwhatsappfield' => $_POST['whatsappotp'],
				'adminwhatsapp' => $_POST['adminwhatsapp'],
				'permissionsend' => $_POST['permissionsend'],
				'permissionsend_text' => $_POST['permissionsend_text']
            );
            update_query("mod_wamessenger_settings", $update, "");
            
            if($_POST['whatsappotp'] == 1){
                $receive = 'on';
            }else if ($_POST['whatsappotp'] == 0 || $_POST['whatsappotp'] === null){
                $receive = 'off';
            }
            $api->wacurl('/receive/','?receive='.$receive);
        }
        /* UPDATE SETTINGS */
        
        
        $settings = $api->apiSettings();
        $api_key=$settings['api_key'];
        $api_token=$settings['api_token'];
        $sender_id=$settings['sender_id'];
        
        
        $result = Capsule::table('tblcustomfields')->where([
			['fieldtype', '=', 'text'],
			['type', '=', 'client'],
		])->get();
		
		$gsmnumber = '<option value="0" selected >Default Profile Field : Phone Number</option>';
		
        foreach($result as $customfield){
    		if ($customfield->id == $settings['gsmnumberfield']) {
    			$selected = 'selected="selected"';
    		} else {
    			$selected = "";
    		}
    		$gsmnumber .= '<option value="' . $customfield->id . '" ' . $selected . '>Custom Field : ' . $customfield->fieldname . '</option>';
		}
		
		
		$calender = array("gregorian", "jalali");
		
        foreach($calender as $item){
    		if ($item == $settings['calender']) {
    			$selected = 'selected="selected"';
    		} else {
    			$selected = "";
    		}
    		$calender .= '<option value="' . $item . '" ' . $selected . '>' . $item . '</option>';
		}		
		
            if ($settings['all_delete'] == 1) {
                $all_delete = 'checked = "checked"';
            } else {
                $all_delete = '';
            }
            
            if ($settings['disable'] == 1) {
                $disable = 'checked = "checked"';
            } else {
                $disable = '';
            }
            
            if ($settings['autoupdate'] == 1) {
                $autoupdate = 'checked = "checked"';
            } else {
                $autoupdate = '';
            }
            
            if ($settings['wantwhatsappfield'] == 1) {
                $whatsappotp = 'checked = "checked"';
            } else {
                $whatsappotp = '';
            }
            if ($settings['permissionsend'] == 1) {
                $permissionsend = 'checked = "checked"';
            } else {
                $permissionsend = '';
            }



        
    //Please setup your api akey
        echo '
        <style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  width: 100%;
}


.container {
  padding: 2px 16px;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
</style>
        <div class="card">
         <div class="container" style="width: 37% !important;">
        <form action="" method="post" id="form">
        <input type="hidden" name="action" value="save" />
            <div class="internalDiv">
            <span id="responsemsg"></span>
			<input type="hidden" name="params" value="0"/>
                        <tr>
                            <td class="fieldlabel" >'.$LANG['apikey'].'</td>
                            <input type="text" name="api_key" class="form-control"  value="' . $settings['api_key'] . '">'.$LANG['buy_service'].'
                        </tr>
                        
                        <tr>
                            <td class="fieldlabel" >' .$LANG['gsmnumberfield']. '</td>
                                <select name="gsmnumberfield" class="form-control">
                                    ' . $gsmnumber . '
                                </select>
                            <a target="_blank" href="configcustomfields.php">' .$LANG['addgsmnumberfield']. '</a>
                        </tr><p><br>
						    
							<td class="fieldlabel" >'.$LANG['calender'].'</td>
							<input type="text" name="dateformat" class="form-control" value="' . $settings['dateformat'] . '"/><p>
                            <select name="calender" class="form-control">
                                ' . $calender . '
                            </select>
                            <p><br>
                            
                            <input type="hidden" name="api_token" value="none"/>
			                <input type="hidden" name="sender_id" value="none"/>


			                <tr>
                                <td class="fieldlabel" >'.$LANG['disable'].'</td>
                                <td><input type="checkbox" value="1" name="disable" ' . $disable . '></td>
                            </tr><br>'.$LANG['disable_des'].'<p><br>
                            
                            <tr>
                                <td class="fieldlabel" >'.$LANG['all_delete'].'</td>
                                <td><input type="checkbox" value="1" name="all_delete" ' . $all_delete . '></td>
                            </tr><br>'.$LANG['all_delete_des'].'<p><br>
                            
                            <tr>
                                <td class="fieldlabel" >'.$LANG['autoupdate'].'</td>
                                <td><input type="checkbox" value="1" name="autoupdate" ' . $autoupdate . '></td>
                            </tr><p><br>
                            
                            <tr>
                                <td class="fieldlabel">'.$LANG['permissionsend'].'</td>
                                <td><input type="checkbox" value="1" name="permissionsend" ' . $permissionsend . '>
                                <textarea cols="50" name="permissionsend_text" class="form-control" placeholder="'.$LANG['permissionsend_text'].'">' . $settings['permissionsend_text'] . '</textarea>
                                '.$LANG['permissionsenddec'].'
                            </tr><p><br>
                            
                            <tr>
                                <td class="fieldlabel">'.$LANG['whatsappotp'].'</td>
                                <td><input type="checkbox" value="1" name="whatsappotp" ' . $whatsappotp . '>
                                <input type="text" name="adminwhatsapp" class="form-control" value="' . $settings['adminwhatsapp'] . '" placeholder="'.$LANG['adminwhatsapp'].'">
                                '.$LANG['whatsappotpdec'].'
                            </tr>
                            
                        	


                           
                            </div>
            <div class="btn-container">
                <input type="submit" value="'.$LANG['save'].'" class="btn btn-primary" />
            </div>
        </form>
        </div>
        </div>
        ';


    }
    elseif ($tab == "templates")
    {
        if (isset($_POST['params'])) { 
            $where = array("type" => array("sqltype" => "LIKE", "value" => $_GET['type']));
            $result = select_query("mod_wamessenger_templates", "*", $where);
            while ($data = mysql_fetch_array($result)) {
                if ($_POST[$data['id'] . '_active'] == "on") {
                    $tmp_active = 1;
                } else {
                    $tmp_active = 0;
                }
                if ($_POST[$data['id'] . '_attachment'] == "on") {
                    $tmp_attachment = 1;
                } else {
                    $tmp_attachment = 0;
                }
                $update = array(
                    "template" => $_POST[$data['id'] . '_template'],
                    "active" => $tmp_active,
                    "attachment" => $tmp_attachment
                );

                if(isset($_POST[$data['id'] . '_extra'])){
                    $update['extra']= trim($_POST[$data['id'] . '_extra']);
                }
                if(isset($_POST[$data['id'] . '_admingsm'])){
                    $update['admingsm']= $_POST[$data['id'] . '_admingsm'];
                    $update['admingsm'] = str_replace(" ","",$update['admingsm']);
                }
                update_query("mod_wamessenger_templates", $update, "id = " . $data['id']);
            }
        }

        echo '<form action="" method="post">
        <input type="hidden" name="action" value="save" />
        <input type="hidden" name="params" value="0"/>
            <div class="internalDiv">
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3" style="margin:0px;border: 0px;">
                    <tbody>';
        $where = array("type" => array("sqltype" => "LIKE", "value" => $_GET['type']));
        $result = select_query("mod_wamessenger_templates", "*", $where);

        while ($data = mysql_fetch_array($result)) {
            if ($data['active'] == 1) {
                $active = 'checked = "checked"';
            } else {
                $active = '';
            }
            if ($data['attachment'] == 1) {
                $attachment = 'checked = "checked"';
            } else {
                $attachment = '';
            }
            $desc = json_decode($data['description']);
            if(isset($desc->$LANG['lang'])){
                $name = $desc->$LANG['lang'];
            }else{
                $name = $data['name'];
            }
            echo '
                <tr>
                    <td class="fieldlabel" width="30%">' . substr($name, 0, -2) . '</td>
                    <td class="fieldarea">
                        <textarea cols="50" name="' . $data['id'] . '_template">' . $data['template'] . '</textarea>
                    </td>
                </tr>';
            echo '
            <tr>
                <td class="fieldlabel"  style="float:right;">'.$LANG['parameter'].'</td>
                <td>' . $data['description'] . '</td>
            </tr>
            ';
            if(!empty($data['extra'])){
                echo '
                <tr>
                    <td class="fieldlabel" width="30%">'.$LANG['ekstra'].'</td>
                    <td class="fieldarea">
                        <input type="text" name="'.$data['id'].'_extra" value="'.$data['extra'].'">
                    </td>
                </tr>
                ';
            }
            if($_GET['type'] == "admin" && !str_contains($data['name'], 'ClientAreaNavbarsWa')){
                echo '
                <tr>
                    <td class="fieldlabel" width="30%">'.$LANG['admingsm'].'</td>
                    <td class="fieldarea">
                        <input type="text" class="extraField" name="'.$data['id'].'_admingsm" placeholder="'.$LANG['admin_placeholder'].'" value="'.$data['admingsm'].'">
                    </td>
                </tr>
                ';
            }
            echo '
            <tr>
                <td class="fieldlabel" width="30%" style="float:right;">'.$LANG['active'].'</td>
                <td><input type="checkbox" value="on" name="' . $data['id'] . '_active" ' . $active . '></td>
            </tr>
            ';
            if (str_contains($data['name'], 'Invoice')) {
                echo '
            <tr>
                <td class="fieldlabel"  style="float:right;">'.$LANG['attachment'].'</td>
                <td><input type="checkbox" value="on" name="' . $data['id'] . '_attachment" ' . $attachment . '></td>
            </tr>
            ';
            }




            echo '<tr>
                <td colspan="2"><hr></td>
            </tr>';
        }
        echo '
        </tbody>
                </table>
        
            </div>
            <div class="btn-container">
                <input type="submit" value="'.$LANG['save'].'" class="btn btn-primary" />
            </div>
            </form>
            ';

    }
    elseif ($tab == "messages")
    {
		$settings = $api->apiSettings();
		
        if(!empty($_GET['deletewhatsapp'])){
            foreach (explode(",",$_GET['deletewhatsapp']) as $n) {
            $sql = "DELETE FROM mod_wamessenger_messages WHERE id ='$n'";
            full_query($sql);
            }
        }
        if(!empty($_GET['updatestatus'])){
            $whatsappid = (int) $_GET['updatestatus'];
            $status = $api->wacurl('/getStatus/','?id='.$whatsappid);
    		$obj = json_decode($status);
    		$statusInfo= $obj->statusInfo;
    		if(!empty($statusInfo)){
        		$values = array(
                    "status" => $statusInfo
                );
        		update_query("mod_wamessenger_messages", $values, "uid = '" . $whatsappid."'");
    		}else{
    		    echo $LANG['errorwhatsappsent'];
    		}
        }
        
        if(!empty($_GET['resend'])){
            $gsmnumber = array($_GET['resend']);
            $message = $_GET['text'];
            $userid = $_GET['userid'];
            $invoiceid = $_GET['invoiceid'];
            if($invoiceid){
                $invoice_pdf_file = $api->pdfInvoice($invoiceid);
            }
            $api->setGsmnumber($gsmnumber);
            $api->setMessage($message, $invoice_pdf_file, $invoiceid);
            $api->setUserid($userid);

            $result = $api->send();
        		
            if($result == false){
                $responseToShow =  $LANG['errorwhatsappsent'];
            }else{
                $responseToShow =  $LANG['whatsappsent'];
            }
        }
        
        echo  '
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <script>
        $(document).ready(function(){
jQuery("#master").on("click", function(e) {
	if($(this).is(":checked",true))  
	{
		$(".sub_chk").prop("checked", true);  
	}  
	else  
	{  
		$(".sub_chk").prop("checked",false);  
	}  
});

jQuery(".delete_all").on("click", function(e) { 
var allVals = [];  
		$(".sub_chk:checked").each(function() {  
			allVals.push($(this).attr("data-id"));
		});  
		//alert(allVals.length); return false;  
		if(allVals.length <=0)  
		{  
			alert("Please select row.");  
		}  
		else {  
			//$("#loading").show(); 
			WRN_PROFILE_DELETE = "Are you sure you want to delete this row?";  
			var check = confirm(WRN_PROFILE_DELETE);  
			if(check == true){  
				//for server side
				/*
				var join_selected_values = allVals.join(","); 
				
				$.ajax({   
				  
					type: "POST",  
					url: "delete.php",  
					cache:false,  
					data: "ids="+join_selected_values,  
					success: function(response)  
					{   
						$("#loading").hide();  
						$("#msgdiv").html(response);
						//referesh table
					}   
				});*/
              //for client side
			  $.each(allVals, function( index, value ) {
				  $("table tr").filter("[data-row-id=" + value + "]").remove();
				  window.location.href = "addonmodules.php?module=wamessenger&tab=messages&deletewhatsapp="+ allVals;
			  });
				

			}  
		}  
	});

jQuery(".remove-row").on("click", function(e) {
		WRN_PROFILE_DELETE = "Are you sure you want to delete this row?";  
			var check = confirm(WRN_PROFILE_DELETE);  
			if(check == true){
				$("table tr").filter("[data-row-id=" + $(this).attr("data-id") + "]").remove();
				 window.location.href = "addonmodules.php?module=wamessenger&tab=messages&deletewhatsapp="+ $(this).attr("data-id");
			}
	});
});

        </script>
        
        <div class="internalDiv" style="padding:20px !important;">
        <div class="row well">
            '.$LANG['reoport_group'].'<p>
            '.$responseToShow.'
        </div>
        <a type="button" class="btn btn-primary pull-right delete_all">Delete Selected</a>
        <table id="employee_grid" class="table table-condensed table-hover table-striped bootgrid-table" width="60%" cellspacing="0">
        <thead>
            <tr>
                <th><input type="checkbox" id="master"></th>
                <th>'.$LANG['gsmnumber'].'</th>
                <th width="45%" >'.$LANG['message'].'</th>
                <th><center>'.$LANG['datetime'].'</center></th>
                <th width="15%"><center>'.$LANG['reportstatus'].'</center></th>
                <th width="15%"><center>'.$LANG['resend'].'</center></th>
                <th><center>Delete</center></th>
            </tr>
        </thead>
        <tbody>
        ';

        // Getting pagination values.
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = (isset($_GET['limit']) && $_GET['limit']<=50) ? (int)$_GET['limit'] : 10;
        $start  = ($page > 1) ? ($page*$limit)-$limit : 0;
        $order = isset($_GET['order']) ? $_GET['order'] : 'DESC';
        /* Getting messages order by date desc */
        $sql = "SELECT `m`.*
        FROM `mod_wamessenger_messages` as `m`
        ORDER BY `m`.`datetime` {$order} limit {$start},{$limit}";
        $result = full_query($sql);
        $i = 0;

        //Getting total records
        $total = "SELECT count(id) as toplam FROM `mod_wamessenger_messages`";
        $sonuc = full_query($total);
        $sonuc = mysql_fetch_array($sonuc);
        $toplam = $sonuc['toplam'];

        //Page calculation
        $sayfa = ceil($toplam/$limit);

        while ($data = mysql_fetch_array($result)) {

            $i++;
		
		
		// Convert time    
        include_once('jdf.php');
        $date = $data['datetime'];
        $array = explode(' ', $date);
        list($year, $month, $day) = explode('-', $array[0]);
        list($hour, $minute, $second) = explode(':', $array[1]);
        $timestamp = mktime($hour, $minute, $second, $month, $day, $year);
        $jalali_date = jdate("Y/m/d H:i:s", $timestamp);

            echo  '<tr data-row-id="'.$data['id'].'">

            <td><input type="checkbox" class="sub_chk" data-id="'.$data['id'].'"></td>';
            if ($data['to'] =='group'){
               echo'<td>'.$data['to'].'</a></td>'; 
            }else{
            echo'<td><a href="clientssummary.php?userid='.$data['user'].'">'.$data['to'].'</a></td>';
            }
            echo'<td>'.$data['text'].'</td>';
			if ($settings['calender'] == "jalali"){
            echo '<td><center>'.$jalali_date.'</center></td>';
            }else{
                echo '<td><center>'.$data['datetime'].'</center></td>';
            }
            if($data['uid'] > 1000 && $data['status'] == 'success' || $data['status'] == 'Pending' && $data['to'] !='group'){
                echo'<td><center>'.$LANG['sent'].'<br><a href="addonmodules.php?module=wamessenger&tab=messages&updatestatus='.$data['uid'].'" class="btn btn-primary">'.$LANG['updatestatus'].'</a></center></td>';
            }else if($data['uid'] > 1000){
                echo'<td><center>'.$data['status'].'</center></td>';
            }//else if($data['to'] !='group'){
                //echo'<td><center>'.$LANG['errorstatus'].'<br><a href="addonmodules.php?module=wamessenger&tab=messages&resend='.$data['to'].'&text='.$data['text'].'&userid='.$data['user'].'&invoiceid='.$data['attachment'].'" class="btn btn-warning">'.$LANG['resend'].'</a></center></center></td>';}
            else{
                echo'<td><center>'.$api->errors($data['errors']).'</center></td>';
            }
            if($data['to'] !='group'){
                echo'<td><center><a href="addonmodules.php?module=wamessenger&tab=messages&resend='.$data['to'].'&text='.$data['text'].'&userid='.$data['user'].'&invoiceid='.$data['attachment'].'" class="btn btn-warning">'.$LANG['resend'].'</a></center></center></td>';
            }
            echo'<td><center><a class="remove-row pull-right" targetDiv="" data-id="'.$data['id'].'" href="javascript: void(0)"><i class="glyphicon glyphicon-trash"></i></a></center></td>';
            //echo '<td><center><a href="addonmodules.php?module=wamessenger&tab=messages&deletewhatsapp='.$data['id'].'" title="'.$LANG['delete'].'"><img src="images/delete.gif" width="16" height="16" border="0" alt="Delete"></a></center></td></tr>';
        }
        /* Getting messages order by date desc */

        echo '
        </tr>
        </tbody>
        </table>
        ';  
        $list="";
        for($a=1;$a<=$sayfa;$a++)
        {
            $selected = ($page==$a) ? 'selected="selected"' : '';
            $list.="<option value='addonmodules.php?module=wamessenger&tab=messages&page={$a}&limit={$limit}&order={$order}' {$selected}>{$a}</option>";
        }
        echo "Show page <select  onchange=\"this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);\">{$list}</select></div>";

    }
    elseif($tab=="sendwhatsapp")
    {
        $settings = $api->apiSettings();

        if(!empty($_POST['client'])){
            $haystack = $_POST['message'];
            $needleone   = '{firstname}';
            $needletwo   = '{lastname}';
            if(strpos($haystack, $needleone) !== false or strpos($haystack, $needletwo) !== false){
                foreach ($_POST['client'] as $value){
                    $userinf = explode("_",$value);
                    $userid = $userinf[0];
                    $gsmnumber = array($userinf[1]);
                    if($settings['gsmnumberfield'] > 0){
                        $gsmnumber = $api->customfieldsvalues($userid, $settings['gsmnumberfield']);
                    }                    
                    $replacefrom = array("{firstname}","{lastname}");
                    $replaceto = array($userinf[2],$userinf[3]);
                    $country = $userinf[4];
                    $message = str_replace($replacefrom,$replaceto,$_POST['message']);
                    $api->setCountryCode($country);
                    $api->setGsmnumber($gsmnumber);
                    $api->setMessage($message);
                    $api->setUserid($userid);

                    $result = $api->send();
        		
                    if($result == false){
                        $responseToShow =  $LANG['errorwhatsappsent'];
                    }else{
                        $responseToShow =  $LANG['whatsappsent'];
                    }
                
        
                    if($_POST["debug"] == "ON"){
                        $debug = 1;
                    }
                }
            }else{
                        foreach ($_POST['client'] as $value){
                            $message = $_POST['message'];
                            $userinf = explode("_",$value);
                            $userid = $userinf[0];
                            $gsmnumber = array($userinf[1]);
                            if($settings['gsmnumberfield'] > 0){
                                $gsmnumber = $api->customfieldsvalues($userid, $settings['gsmnumberfield']);
                            }
                            $country = $userinf[4];
                            $api->setCountryCode($country);
                            $api->setGsmnumber($gsmnumber);
                            $api->setMessage($message);
                            $api->setUserid($userid);
                        
                            $result = $api->send();
                            
                            if($result == false){
                                $responseToShow =  $LANG['errorwhatsappsent'];
                            }else{
                                $responseToShow =  $LANG['whatsappsent'];
                            }
                            
                            if($_POST["debug"] == "ON"){
                                $debug = 1;
                            }
                        }
                    
            }
        }
        
        $userSql = "SELECT `a`.`id`,`a`.`firstname`, `a`.`lastname`, `a`.`country`, `a`.`phonenumber` as `gsmnumber`
        FROM `tblclients` as `a` order by `a`.`firstname`";

        $clients = '';
        $result = full_query($userSql);
        while ($data = mysql_fetch_array($result)) {
            $clients .= '<option value="'.$data['id'].'_'.$data['gsmnumber'].'_'.$data['firstname'].'_'.$data['lastname'].'_'.$data['country'].'">'.$data['firstname'].' '.$data['lastname'].' (#'.$data['id'].')</option>';
        }

        echo '
        <script>
        jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
          return this.each(function() {
            var select = this;
            var options = [];
            $(select).find("option").each(function() {
              options.push({value: $(this).val(), text: $(this).text()});
            });
            $(select).data("options", options);
            $(textbox).bind("change keyup", function() {
              var options = $(select).empty().scrollTop(0).data("options");
              var search = $.trim($(this).val());
              var regex = new RegExp(search,"gi");

              $.each(options, function(i) {
                var option = options[i];
                if(option.text.match(regex) !== null) {
                  $(select).append(
                     $("<option>").text(option.text).val(option.value)
                  );
                }
              });
              if (selectSingleMatch === true && 
                  $(select).children().length === 1) {
                $(select).children().get(0).selected = true;
              }
            });
          });
        };
        $(function() {
          $("#clientdrop").filterByText($("#textbox"), true);
        });  
        </script>';



        echo '<form action="" method="post">
        <input type="hidden" name="action" value="save" />
            <div class="internalDiv" >'.$responseToShow.'
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3" style="margin:0px;border: 0px;">
                    <tbody>
                        <tr>
                            <td class="fieldlabel" width="30%">'.$LANG['client'].'</td>
                            <td class="fieldarea">
                                <input id="textbox" type="text" placeholder="'.$LANG['typeclient'].'" style="width:498px;padding:5px"><br>
                                <select name="client[]" required class="sel" multiple id="clientdrop" style="padding:5px">
                                    <option value="">'.$LANG['selectclient'].'</option>
                                    ' . $clients . '
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="fieldlabel" width="30%">'.$LANG['message'].'</td>
                            <td class="fieldarea">
                               <textarea cols="70" rows="5" required name="message" style="width:498px;padding:5px"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td class="fieldlabel" width="30%">'.$LANG['parameter'].'</td>
                            <td class="fieldarea">
                                {firstname},{lastname}
                            </td>
                        </tr>
                    </tbody>
                </table>
           
            </div>
            <div class="btn-container">
                <input type="submit" value="'.$LANG['send'].'" class="btn btn-primary" />
            </div>
        </form>';


    }
    elseif($tab=="bulkwhatsapp")
    {
        $settings = $api->apiSettings();

        if(!empty($_POST['numbers'])){

                $phonenumber = explode(",",$_POST['numbers']);
                $gsmnumber = $phonenumber;
                $message = $_POST['message'];
                $api->setGsmnumber($gsmnumber);
                $api->setMessage($message);
                $result = $api->send();
                if($result == false){
                    $responseToShow =  $LANG['errorwhatsappsent'];
                }else{
                    $responseToShow =  $LANG['whatsappsent'];
                }
            
    
                if($_POST["debug"] == "ON"){
                    $debug = 1;
                }
        }
        
        echo '<form action="" method="post">
        <input type="hidden" name="action" value="save" />
            <div class="internalDiv" >'.$responseToShow.'
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3" style="margin:0px;border: 0px;">
                    <tbody>
                        <tr>
                            <td class="fieldlabel" width="30%">'.$LANG['numbers'].'</td>
                            <td class="fieldarea">
                                <input id="numbers" name="numbers" pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]" required type="text" placeholder="'.$LANG['phnumbers'].'" style="width:498px;padding:5px"><br>

                            </td>
                        </tr>
                        <tr>
                            <td class="fieldlabel" width="30%">'.$LANG['message'].'</td>
                            <td class="fieldarea">
                               <textarea cols="70" rows="5" name="message" required style="width:498px;padding:5px"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
           
            </div>
            <div class="btn-container">
                <input type="submit" value="'.$LANG['send'].'" class="btn btn-primary" />
            </div>
        </form>';


    }
    elseif($tab == "support"){
        $settings = $api->apiSettings();
        echo '<div class="internalDiv" style="padding:20px !important;">';
        echo $LANG['cmodulesversion'].$settings['version'].'<br>';
        echo $LANG['latestmodules'];
        echo $LANG['phoneus'];
        echo $LANG['emailus'];
        echo $LANG['website'];
        echo $LANG['clientportal'];
        echo $LANG['whatsappportal'];

        echo '<br>Contact us through this form:<br><br><script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script>
<script>
  hbspt.forms.create({
    region: "na1",
    portalId: "22264756",
    formId: "a89ec94c-4e33-4716-a87f-8b4a286b500c",
    version: "V2_PRERELEASE"
  });
</script>
</div> ';


    }

	echo $LANG['lisans'];
    echo '</div>';
    
    
}
