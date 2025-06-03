{if $template eq "lagom"}
    <style>
        .checkbox-styled, .radio-styled{
            display: inline-grid;
        }
    </style>
{/if}
{if $template eq "allure"}
    <style>
        .allure-nav{
            display: none;
        }
        .allure-container .allure-main{
            margin-left: 0px;
        }
    </style>
{/if}
{if $template eq "swiftmodders"}
    <style>
        .sm-nav{
            display: none;
        }
        body:not(.login) .sm-content-container .sm-content{
            margin-left: 0px;
        }
    </style>
{/if}
<link href="{$systemurl}/modules/addons/whatsappnotify/templates/front/styles.css" rel="stylesheet">
<div class="" style="background-color: #fff">
    <div class="col-md-12 pull-md-right main-content">
        {assign var="pageheader" value="$template/includes/pageheader.tpl"}
        {if file_exists($pageheader)}
            {include file="$template/includes/pageheader.tpl" title=$displayTitle desc=$tagline showbreadcrumb=true}        
        {/if}
        {if $loggedin}
            {$alert}
            <form method="POST" action="index.php?m=whatsappnotify&amp;action=confirm">
                <div class="whatsappnotifyarea" style="background-color: #fff">
                    <div>
                        <h4>{$lang.EnableWHATSAPPAlerts}</h4>
                        <p>{$lang.EnableWHATSAPPAlertsdesc}</p>
                        <input type="checkbox" name="smsalerts" value="1" {if $status == '1'}checked{/if} class="no-icheck toggle-switch-success" data-size="small" data-on-text="{$lang.clientareayes}" data-off-text="{$lang.clientareano}">                    
                        <br><br>
                        {if $status == '1'}
                            <div class="col-md-12">
                                <div class="form-group">
                                    <h3>{$lang.WHATSAPPPreferences}</h3>
                                    <div class="controls checkbox">
                                        <div class="row">
                                            {foreach from=$smslist item=sms key=smskey}
                                                <div class="col-md-6">
                                                    <label>
                                                        <input type="checkbox" {if count($alloweditems) && in_array($smskey,$alloweditems)}checked="checked"{elseif count($alloweditems) <= 0}checked="checked"{/if} name="allows[{$smskey}]" value="1">
                                                        <b>{$sms.name}</b> <br> {$sms.details}
                                                    </label>
                                                </div>
                                            {/foreach}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>            
                    <div class="form-group text-center">
                        <input class="btn btn-primary" type="submit" name="save" value="{$lang.SaveChanges}">
                        <input class="btn btn-default" type="reset" value="{$lang.Cancel}">
                    </div> 
            </form>
        {/if}
    </div>
</div>
</div>