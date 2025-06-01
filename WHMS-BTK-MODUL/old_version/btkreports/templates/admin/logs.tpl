{* modules/addons/btkreports/templates/admin/logs.tpl (v1.0.23) *}

{if $action eq 'logs'}
    <div class="btk-header-container" style="margin-bottom: 15px;">
        <div class="btk-module-title">
            <i class="fas fa-clipboard-list" style="font-size: 1.5em; margin-right: 8px; vertical-align: middle;"></i>
            <h2 style="display: inline-block; vertical-align: middle; margin-top: 0; margin-bottom: 0;">{$_ADDONLANG.btkreports_tab_logs}</h2>
        </div>
    </div>
{/if}

{if isset($successMessage) && $successMessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successMessage}
    </div>
{/if}
{if isset($errorMessage) && $errorMessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errorMessage}
    </div>
{/if}

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-history"></i> {$_ADDONLANG.btkreports_logs_title|default:'Modül İşlem Logları'}</h3>
    </div>
    <div class="panel-body">
        <p>{$_ADDONLANG.btkreports_logs_description|default:'Modül tarafından gerçekleştirilen işlemlerin ve olası hataların kayıtları.'}</p>

        <form method="get" action="{$modulelink}" class="form-inline" style="margin-bottom: 20px;">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="logs">
            <div class="form-group">
                <label for="filter_description" class="sr-only">{$_ADDONLANG.btkreports_logs_filter_desc}</label>
                <input type="text" name="filter_description" id="filter_description" class="form-control" value="{$filter_description|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_logs_filter_desc}">
            </div>
            <div class="form-group">
                <label for="filter_username" class="sr-only">{$_ADDONLANG.btkreports_logs_filter_user}</label>
                <input type="text" name="filter_username" id="filter_username" class="form-control" value="{$filter_username|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_logs_filter_user}">
            </div>
            <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-filter"></i> {$_ADDONLANG.btkreports_filter}</button>
            <a href="{$modulelink}&action=logs" class="btn btn-default btn-sm"><i class="fas fa-eraser"></i> {$_ADDONLANG.btkreports_clear_filter}</a>
        </form>

        {if $logs && count($logs) > 0}
            <div class="table-responsive">
                <table class="table table-striped datatable" width="100%" id="tableLogs">
                    <thead>
                        <tr>
                            <th style="width:160px;">{$_ADDONLANG.btkreports_logs_table_date}</th>
                            <th>{$_ADDONLANG.btkreports_logs_table_description}</th>
                            <th style="width:150px;">{$_ADDONLANG.btkreports_logs_table_user}</th>
                            <th style="width:120px;">{$_ADDONLANG.btkreports_logs_table_ip}</th>
                            <th style="width:100px;" class="text-center">{$_ADDONLANG.btkreports_log_type|default:'Tip'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$logs item=log}
                            <tr>
                                <td>{$log->log_time|date_format:"%d.%m.%Y %H:%M:%S"}</td>
                                <td style="word-break: break-all;">{$log->description|escape:'html'}</td>
                                <td>{if $log->user_id && isset($admins[$log->user_id])}{$admins[$log->user_id]}{elseif $log->user_id}{$log->user_id}{else}System{/if}</td>
                                <td>{$log->ip_address}</td>
                                <td class="text-center">
                                    <span class="label label-{if $log->log_type == 'ERROR' || $log->log_type == 'FATAL_ERROR_SETUP' || $log->log_type == 'CSRF_FAIL'}danger
                                          {elseif $log->log_type == 'WARNING' || $log->log_type == 'WARNING_SETUP'}warning
                                          {elseif $log->log_type == 'SUCCESS_SETUP' || $log->log_type == 'NVI_SUCCESS' || $log->log_type == 'FTP'}success
                                          {else}info{/if}">
                                        {$log->log_type}
                                    </span>
                                </td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
            
            {* Sayfalama Navigasyonu *}
            {if $totalPages > 1}
                <div class="text-center">
                    <ul class="pagination">
                        {if $currentPage > 1}
                            <li><a href="{$modulelink}&action=logs&page={$currentPage-1}{if $filter_description}&filter_description={$filter_description|escape:'url'}{/if}{if $filter_username}&filter_username={$filter_username|escape:'url'}{/if}">&laquo;</a></li>
                        {else}
                            <li class="disabled"><span>&laquo;</span></li>
                        {/if}

                        {for $i=1 to $totalPages}
                            <li {if $i == $currentPage}class="active"{/if}><a href="{$modulelink}&action=logs&page={$i}{if $filter_description}&filter_description={$filter_description|escape:'url'}{/if}{if $filter_username}&filter_username={$filter_username|escape:'url'}{/if}">{$i}</a></li>
                        {/for}

                        {if $currentPage < $totalPages}
                            <li><a href="{$modulelink}&action=logs&page={$currentPage+1}{if $filter_description}&filter_description={$filter_description|escape:'url'}{/if}{if $filter_username}&filter_username={$filter_username|escape:'url'}{/if}">&raquo;</a></li>
                        {else}
                            <li class="disabled"><span>&raquo;</span></li>
                        {/if}
                    </ul>
                </div>
            {/if}

            <form method="post" action="{$modulelink}&action=deleteLogs" onsubmit="return confirm('{$_ADDONLANG.btkreports_logs_delete_confirm|escape:'javascript'}');" style="margin-top: 20px;">
                <input type="hidden" name="token" value="{$csrfToken}">
                <button type="submit" class="btn btn-danger"><i class="fas fa-trash"></i> {$_ADDONLANG.btkreports_logs_delete_all}</button>
            </form>

        {else}
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle"></i> {$_ADDONLANG.btkreports_records_not_found}
            </div>
        {/if}
    </div>
</div>
<script type="text/javascript">
$(document).ready(function() {
    // WHMCS admin teması zaten datatables içeriyorsa bu gereksiz olabilir,
    // ancak garantiye almak için ekliyoruz.
    if (typeof $.fn.dataTable !== 'undefined') {
        $('#tableLogs').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"
            },
            "paging": false, // WHMCS kendi sayfalama sistemini kullanıyoruz (veya bu script ile)
            "info": false, 
            "searching": false, // Kendi filtrelerimizi kullanıyoruz
            "order": [[ 0, "desc" ]] // Tarihe göre tersten sırala
        });
    }
});
</script>