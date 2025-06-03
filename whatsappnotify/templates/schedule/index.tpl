<form method="post">
    <input type="hidden" name="save" value="1">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-primary">
                <div class="panel-heading">{$WALANG.SetupScheduleWHATSAPPsend}</div>
                <div class="panel-body">
                    <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                        <tbody>
                            <tr><td class="fieldlabel" width="40%">{$WALANG.EnableScheduleWHATSAPPsend}</td>
                                <td class="fieldarea">
                                    <input type="checkbox" {if $cronjob}checked="checked"{/if} name="cronjob" value="yes">                                
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.Schedulesendsmsonspecialtime}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                                                
                                </td>
                            </tr>  
                            <tr><td class="fieldlabel" width="40%">{$WALANG.scholiday}</td>
                                <td class="fieldarea">
                                    <select name="day[]" multiple="">
                                        {$cronday}
                                    </select>
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.Schedulesendsmsonspecialday}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                                                
                                </td>
                            </tr>  
                            <tr><td class="fieldlabel" width="40%">{$WALANG.SendnextdayHour}</td>
                                <td class="fieldarea">
                                    <select name="hour">
                                        {$hours}
                                    </select>
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.Schedulesendsmsonspecialhour}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                                                
                                </td>
                            </tr>
                            <tr><td class="fieldlabel" width="40%">{$WALANG.CronJobURlHourly}</td>
                                <td class="fieldarea">
                                    {$cronurl}<br>
                                    <a href="#" data-toggle="tooltip" title="{$WALANG.Cronjobneedtosetupdaily}"><img src="../modules/addons/whatsappnotify/assets/img/info.gif"></a>                                                                                                                                
                                </td>
                            </tr>                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <center><input type="submit" name="save" value="{$WALANG.Save}" class="btn btn-primary"></center>
        </div>
    </div>
</form>
<script>
    $(function () {
        $('[type="checkbox"]').bootstrapSwitch();
    });
</script>