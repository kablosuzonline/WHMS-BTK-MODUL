<div class="row">
    <div class="col-md-4">
        <div class="panel panel-success">
            <div class="panel-heading">{$WALANG.sendmansms}</div>
            <div class="panel-body">
                {if $sent == 'success'}
                    <div class="alert alert-success">{$WALANG.sendsmssuccess}</div>
                {/if}
                {if $sent == 'error'}
                    <div class="alert alert-danger">{$WALANG.sendsmsnotsuccess}</div>
                {/if}  
                {if $balance && $balance != 'NOAPI'}
                    <div class="col-md-12" style="margin: 10px 0px 10px 0px;text-align: center">
                        {$WALANG.remainingcreditbalance} <b>{$balance}</b>                    
                    </div>
                {/if}
                <input name="country" value="{$WHCONFIG.DefaultCountry}" type="hidden">
                <form method="POST" id="sform" action="addonmodules.php?module=whatsappnotify&manual=true">
                    <p>
                        <input type="tel" id="phone" class="form-control" name="phonenumber" required>
                    </p>
                    <p>
                        <textarea id="textbox1" rows="6" class="form-control" name="message" placeholder="{$WALANG.message}" cols="25" required></textarea></p>
                        <p>
                            <input type="url" id="url" class="form-control" name="url" placeholder="Media url with https://"></p>
                    <center>
                        <input type="submit" class="btn btn-success" value="{$WALANG.sendmessage}" name="send">
                    </center>
                </form>
            </div>
        </div>             
    </div>
    <div class="col-md-8">
        <div class="panel panel-primary">
            <div class="panel-heading">{$WALANG.search}</div>
            <div class="panel-body">
                <form action="?module=whatsappnotify&controller=WhatsAppLogs&search=true" method="post">
                    <center>
                        <div style="width: 89%; float:left;">
                            <input type="text" value="" placeholder="{$WALANG.enterclientemailadd}" class="form-control" name="q">
                        </div>
                        <div style="width: 5%; float:left;">
                            <input type="submit" style="margin-left:5px;" class="btn btn-success" name="search" value="{$WALANG.search}">
                        </div>
                    </center>
                </form>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">{$WALANG.latestsentmessages}</div>
            <div class="panel-body">
                {$latesttable}
            </div>        
        </div>        
    </div>            
</div>
<script src="../modules/addons/whatsappnotify/assets/js/dashboard.js"></script>

