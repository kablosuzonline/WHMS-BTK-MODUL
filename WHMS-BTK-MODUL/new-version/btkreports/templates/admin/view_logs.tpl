{* WHMCS BTK Raporlama Modülü - İşlem Logları (view_logs.tpl) - V3.0.0 - Tam Sürüm *}

{if $successmessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successmessage}
    </div>
{/if}
{if $errormessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errormessage}
    </div>
{/if}
{if $infomessage}
    <div class="alert alert-info text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-info-circle"></i> {$infomessage}
    </div>
{/if}

<div class="panel panel-default btk-logs-page" style="margin-top:15px;">
    <div class="panel-heading">
        <h3 class="panel-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fas fa-clipboard-list"></i> {$_LANG.btk_view_logs_title|default:"Modül İşlem Logları"}</h3>
    </div>
    <div class="panel-body">
        <p>{$_LANG.btk_logs_page_desc|default:"Bu sayfada, BTK Raporlama modülünün gerçekleştirdiği önemli işlemleri ve olası hataları takip edebilirsiniz."}</p>
        <hr>

        {if $btklogs && $btklogs|@count > 0}
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover datatable" id="tableBtkLogs" style="width:100%;">
                    <thead class="thead-light">
                        <tr>
                            <th style="width: 15%;">{$_LANG.btk_log_time|default:"Zaman"}</th>
                            <th style="width: 10%;">{$_LANG.btk_log_type|default:"Log Tipi"}</th>
                            <th>{$_LANG.btk_log_description|default:"Açıklama"}</th>
                            <th style="width: 8%;" class="text-center">{$_LANG.btk_log_admin_id|default:"Admin ID"}</th>
                            <th style="width: 8%;" class="text-center">{$_LANG.btk_log_client_id|default:"Müşteri ID"}</th>
                            <th style="width: 8%;" class="text-center">{$_LANG.btk_log_service_id|default:"Hizmet ID"}</th>
                            <th style="width: 10%;">{$_LANG.btk_log_ip_address|default:"IP Adresi"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$btklogs item=log}
                            <tr class="{if $log->log_type == 'ERROR' || $log->log_type == 'CRITICAL_ERROR' || $log->log_type == 'NVI_ERROR' || $log->log_type == 'FTP_ERROR'}danger{elseif $log->log_type == 'WARNING' || $log->log_type == 'FTP_WARNING' || $log->log_type == 'NVI_FAILURE' || $log->log_type == 'NVI_VALIDATION_ERROR' || $log->log_type == 'REPORT_NVI_SKIP'}warning{elseif $log->log_type == 'SUCCESS' || $log->log_type == 'CRON_SUCCESS' || $log->log_type == 'NVI_SUCCESS' || $log->log_type == 'FTP_SUCCESS'}success{else}info{/if}">
                                <td data-order="{$log->log_time|strtotime}">{$log->log_time|btk_datetime_format}</td>
                                <td><span class="label label-{if $log->log_type == 'ERROR' || $log->log_type == 'CRITICAL_ERROR' || $log->log_type == 'NVI_ERROR' || $log->log_type == 'FTP_ERROR'}danger{elseif $log->log_type == 'WARNING' || $log->log_type == 'FTP_WARNING' || $log->log_type == 'NVI_FAILURE' || $log->log_type == 'NVI_VALIDATION_ERROR' || $log->log_type == 'REPORT_NVI_SKIP'}warning{elseif $log->log_type == 'SUCCESS' || $log->log_type == 'CRON_SUCCESS' || $log->log_type == 'NVI_SUCCESS' || $log->log_type == 'FTP_SUCCESS'}success{else}info{/if}" style="font-size:0.9em; padding: .3em .6em .3em;">{$log->log_type}</span></td>
                                <td style="word-break: break-all;">{$log->description|escape:'html'}</td>
                                <td class="text-center">{$log->user_id|default:'-'}</td>
                                <td class="text-center">{if $log->client_id}<a href="clientssummary.php?userid={$log->client_id}" target="_blank">{$log->client_id}</a>{else}-{/if}</td>
                                <td class="text-center">{if $log->service_id}<a href="clientsservices.php?id={$log->service_id}" target="_blank">{$log->service_id}</a>{else}-{/if}</td>
                                <td>{$log->ip_address|default:'-'}</td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>

            {* Sayfalama *}
            {if $totalpages > 1}
                <div class="text-center">
                    <nav aria-label="Page navigation">
                        <ul class="pagination">
                            {if $currentpage > 1}
                                <li><a href="{$modulelink}&action=view_logs&page={$currentpage-1}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                            {else}
                                <li class="disabled"><span aria-hidden="true">&laquo;</span></li>
                            {/if}

                            {$startPage = max(1, $currentpage - 2)}
                            {$endPage = min($totalpages, $currentpage + 2)}
                            {if $currentpage == $totalpages && $totalpages > 4} {$startPage = max(1, $totalpages - 4)} {/if}
                            {if $currentpage == 1 && $totalpages > 4} {$endPage = min($totalpages, 5)} {/if}


                            {if $startPage > 1}
                                <li><a href="{$modulelink}&action=view_logs&page=1">1</a></li>
                                {if $startPage > 2}<li><span class="disabled">...</span></li>{/if}
                            {/if}

                            {for $i=$startPage to $endPage}
                                <li {if $i == $currentpage}class="active"{/if}><a href="{$modulelink}&action=view_logs&page={$i}">{$i}</a></li>
                            {/for}

                            {if $endPage < $totalpages}
                                {if $endPage < $totalpages - 1}<li><span class="disabled">...</span></li>{/if}
                                <li><a href="{$modulelink}&action=view_logs&page={$totalpages}">{$totalpages}</a></li>
                            {/if}


                            {if $currentpage < $totalpages}
                                <li><a href="{$modulelink}&action=view_logs&page={$currentpage+1}" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                            {else}
                                <li class="disabled"><span aria-hidden="true">&raquo;</span></li>
                            {/if}
                        </ul>
                    </nav>
                </div>
            {/if}

        {else}
            <p class="text-center">{$_LANG.btk_no_logs_found|default:"Görüntülenecek log kaydı bulunmamaktadır."}</p>
        {/if}
    </div>
</div>
<script type="text/javascript">
$(document).ready(function() {
    if ($.fn.dataTable && $('#tableBtkLogs').length > 0 && $('#tableBtkLogs tbody tr').length > 0) {
        $('#tableBtkLogs').DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"
            },
            "order": [[ 0, "desc" ]], 
            "pageLength": {$logs_per_page|default:50}, 
            "searching": true, 
            "lengthChange": false, 
            "info": true, 
            "paging": false, 
            "responsive": true,
            "autoWidth": false
        });
    }
     $('[data-toggle="tooltip"]').tooltip();
});
</script>