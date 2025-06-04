<form method="post">
    <input type="hidden" name="save" value="1">
    <div class="row">
        <div class="col-md-6">
            <div class="panel panel-primary">
                <div class="panel-heading">{$WALANG.Configurations}</div>
                <div class="panel-body">
                    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                        <tbody>
                            <tr>
                                <td class="fieldlabel" width='40%'>{$WALANG.MobileField}</td>
                                <td class="fieldarea">
                                    <select name="mobile_id" class="form-control">
                                        {$customfields}
                                    </select>
                                </td>
                            </tr>
                            <tr><td class="fieldlabel">{$WALANG.ActiveLanguages}</td>
                                <td class="fieldarea">
                                    <select size="5" multiple="multiple" name="active_Languages[]" class="form-control">
                                        {$llist}
                                    </select>
                                </td>
                            </tr>                            
                            <tr><td class="fieldlabel">{$WALANG.DefaultEnabledWHATSAPPAlert}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.allowall}checked="checked"{/if} name="allowall" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.DefaultEnabledWHATSAPPAlertDesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr>                              
                            <tr><td class="fieldlabel">{$WALANG.EnableClientNotifications}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.allowopt}checked="checked"{/if} name="allowopt" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.EnableClientNotificationsdesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr>                             
                            <tr><td class="fieldlabel">{$WALANG.EnableContactNotifications}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.contactallow}checked="checked"{/if} name="contactallow" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.EnableContactNotificationsdesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr> 
                            <tr><td class="fieldlabel">{$WALANG.prmenu}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.primenu}checked="checked"{/if} name="primenu" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.prmenud}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr>              
                            <tr><td class="fieldlabel">{$WALANG.EnableContactSubaccount2FA}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.contact2fa}checked="checked"{/if} name="contact2fa" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.EnableContactSubaccount2FAdesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr>
                            <tr><td class="fieldlabel">{$WALANG.c2FA}</td>
                                <td class="fieldarea">
                                    <input type="number" class="input-50" min="1" name="contact2falen" value="{if $settings.contact2falen > 0}{$settings.contact2falen}{else}6{/if}">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.c2FAd}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr>
                            <tr><td class="fieldlabel">{$WALANG.Requiredmobile}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.requiredmobile}checked="checked"{/if} name="requiredmobile" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.Requiredmobiledesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr> 
                            <tr><td class="fieldlabel">{$WALANG.InvoiceUrl}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.invoiceurl}checked="checked"{/if} name="invoiceurl" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.InvoiceUrldesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr> 
                            <tr><td class="fieldlabel">{$WALANG.DebugMode}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.debugmode}checked="checked"{/if} name="debugmode" value="on">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.DebugModedesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                
                                </td>
                            </tr> 
                            <tr><td class="fieldlabel">{$WALANG.DisableFreeInvoices}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.notfreeinvoice}checked="checked"{/if} name="notfreeinvoice" value="on">
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.DisableFreeInvoicesdesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                
                                </td>
                            </tr>  
                            <tr><td class="fieldlabel">{$WALANG.BirthdayWHATSAPP}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $settings.birthdaysms}checked="checked"{/if} name="birthdaysms" value="yes">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.BirthdayWHATSAPPdesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                                                
                                </td>
                            </tr>     
                            <tr><td class="fieldlabel">{$WALANG.Birthdayfield}</td>
                                <td class="fieldarea">
                                    <select name="birthdayid">
                                        {$brcustomfields}
                                    </select> 
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.Birthdayfielddesc}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                                                
                                </td>
                            </tr>                        
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-primary">
                <div class="panel-heading">{$WALANG.PrimaryWHATSAPPGateway}</div>
                <div class="panel-body">
                    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                        <tbody>
                            <tr>
                                <td width='30%' class="fieldlabel">{$WALANG.Gateway}</td>
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
        <div class="col-md-12" style="margin-bottom: 15px;">
            <center><input type="submit" name="save" value="{$WALANG.Save}" class="btn btn-primary"></center>
        </div>
    </div>
</form>
<script src="../modules/addons/whatsappnotify/assets/js/gateways.js"></script>
<script>
    $(function () {
        $('[type="checkbox"]').bootstrapSwitch();
    });
</script>