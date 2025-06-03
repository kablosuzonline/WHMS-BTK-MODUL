<form method="post" action="?module=whatsappnotify&controller=WhatsAppConfig&action=SaveMutliCountry">
    <input type="hidden" value="{$defdata.id}" name="id">    
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-primary">
                <div class="panel-heading">{$WALANG.WHATSAPPGatewaySetup}</div>
                <div class="panel-body">
                    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                        <tbody>
                            <tr>
                                <td width='25%' class="fieldlabel">{$WALANG.Country}</td>
                                <td class="fieldarea">
                                    <select name="country" class="form-control">
                                        {$clist}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td width='25%' class="fieldlabel">{$WALANG.Gateway}</td>
                                <td class="fieldarea">
                                    <select name="default_gateway" class="form-control gateway">
                                        {$glist}
                                    </select>
                                </td>
                            </tr>
                            {$gatewayconfigs}
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
        <div class="col-md-12">
            <center><input type="submit" name="save" value="{$WALANG.Save}" class="btn btn-primary">  <a class="btn btn-danger" href="?module=whatsappnotify&controller=WhatsAppConfig&action=MultiCountry">{$WALANG.Back}</a></center>
        </div>
    </div>
</form>
<script src="../modules/addons/whatsappnotify/assets/js/gateways.js"></script>
