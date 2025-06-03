<form method="post" action="">
    <input type="hidden" name="save" value="1">
    <div class="alert alert-warning">
        {$WALANG.adminhelp}
    </div>
    <div class="col-md-4">
        {foreach from=$glist key=k item=v}
            <div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">{$WALANG[ucfirst($k)]}</div>
                    <div class="panel-body">
                        {foreach from=$v key=kk item=vv}
                            <div class="col-md-7" style="padding: 8px;">
                                <label for="{$vv.name}">{$vv.name} </label> 
                            </div>
                            <div class="col-md-5">
                                <input data-switch-set="size" data-switch-value="small" {$vv.checked} type="checkbox" name="{$kk}"  value="on">
                            </div>
                        {/foreach}
                        <br>
                        <br>
                    </div>
                </div>
            </div>
        {/foreach}    
    </div>
    <div class="col-md-8">
        {foreach from=$list key=k item=v}
            <div class="col-md-6">
                <div class="panel panel-default">
                    <div class="panel-heading">{$WALANG.adminSupportTicket}{$k}</div>
                    <div class="panel-body">
                        {foreach from=$v key=kk item=vv}
                            <div class="col-md-7" style="padding: 8px;">
                                <label for="{$vv.name}">{$vv.name} </label> 
                            </div>
                            <div class="col-md-5">
                                <input data-switch-set="size" data-switch-value="small" {$vv.checked} type="checkbox" name="{$kk}[{$vv.id}]"  value="on">
                            </div>
                        {/foreach}
                        <br>
                        <br>
                    </div>
                </div>
            </div>
        {/foreach}
    </div>
    <div class="col-md-12">
        <center><input type="submit" name="save" value="{$WALANG.Save}" class="btn btn-primary">  <a class="btn btn-danger" href="?module=whatsappnotify&controller=WhatsAppAdmin">{$WALANG.Back}</a></center>
    </div>
    {literal}
        <script>
            $(function () {
                $('[type="checkbox"]').bootstrapSwitch();
            });
        </script>
    {/literal}
</form>