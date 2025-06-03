<form method="post" action="">
    <input name="save" type="hidden" value="1">
    <div>
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#generaltab" aria-controls="generaltab" role="tab" data-toggle="tab">{$WALANG.General}</a></li>
            <li role="presentation"><a href="#productstab" aria-controls="productstab" role="tab" data-toggle="tab">{$WALANG.Services}</a></li>
            <li role="presentation"><a href="#domainstab" aria-controls="domainstab" role="tab" data-toggle="tab">{$WALANG.Domains}</a></li>
            <li role="presentation"><a href="#invoicestab" aria-controls="invoicestab" role="tab" data-toggle="tab">{$WALANG.Invoices}</a></li>
            <li role="presentation"><a href="#ticketstab" aria-controls="ticketstab" role="tab" data-toggle="tab">{$WALANG.Tickets}</a></li>
            <li role="presentation"><a href="#admintab" aria-controls="admintab" role="tab" data-toggle="tab">{$WALANG.Admin}</a></li>
            <li role="presentation"><a href="#otherstab" aria-controls="otherstab" role="tab" data-toggle="tab">{$WALANG.Others}</a></li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="generaltab">
                {include file="$templatefolder/general_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">                    
                    {foreach from=$list.general item=item}
                        {$item}
                    {/foreach}
                </table>
            </div>
            <div role="tabpanel" class="tab-pane" id="productstab">
                {include file="$templatefolder/services_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    {foreach from=$list.products item=item}
                        {$item}
                    {/foreach}                
                </table>
            </div>
            <div role="tabpanel" class="tab-pane" id="domainstab">
                {include file="$templatefolder/domains_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    {foreach from=$list.domains item=item}
                        {$item}
                    {/foreach}                 
                </table>                
            </div>
            <div role="tabpanel" class="tab-pane" id="invoicestab">
                {include file="$templatefolder/invoices_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    {foreach from=$list.invoices item=item}
                        {$item}
                    {/foreach}                  
                </table>                
            </div>
            <div role="tabpanel" class="tab-pane" id="ticketstab"> 
                {include file="$templatefolder/tickets_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    {foreach from=$list.tickets item=item}
                        {$item}
                    {/foreach}                  
                </table>  
            </div>
            <div role="tabpanel" class="tab-pane" id="admintab">
                {include file="$templatefolder/admin_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    {foreach from=$list.admin item=item}
                        {$item}
                    {/foreach}                 
                </table>  
            </div>
            <div role="tabpanel" class="tab-pane" id="otherstab">
                {include file="$templatefolder/other_merges.tpl"}
                <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                    {foreach from=$list.others item=item}
                        {$item}
                    {/foreach}                   
                </table>                  
            </div>
        </div>
    </div>
    {literal}
        <script>
            $(function () {
                $('[type="checkbox"]').bootstrapSwitch();
            });
        </script>
    {/literal}
    <div class="btn-container">
        <input id="saveChanges" type="submit" value="{$WALANG.SaveChanges}" class="btn btn-primary">
    </div>
</form>
<script type='text/javascript'>
    //<![CDATA[
    function hideOtherLanguage(id) {
        $('.translatable-field').hide();
        $('.lang-' + id).show();
    }
    //]]>
</script>