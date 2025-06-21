{* WHMCS BTK Raporları Modülü - İşlem Kayıtları (Loglar) Sayfası *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_view_logs_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="viewlogs"} {* Ortak navigasyon menüsünü dahil et *}

    <p style="margin-top: 20px;">{$LANG.btk_log_list_desc}</p>

    <form method="get" action="{$modulelink}">
        <input type="hidden" name="module" value="btkreports">
        <input type="hidden" name="action" value="viewlogs">
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-filter icon-spacer"></i>{$LANG.btk_log_filter_options}</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-3 col-sm-6">
                        <div class="form-group">
                            <label for="filter_level">{$LANG.btk_log_level}</label>
                            <select name="filter_level" id="filter_level" class="form-control input-sm">
                                <option value="">-- {$LANG.all|upper} --</option>
                                <option value="INFO" {if $smarty.get.filter_level == 'INFO'}selected{/if}>{$LANG.btk_log_level_info}</option>
                                <option value="WARNING" {if $smarty.get.filter_level == 'WARNING'}selected{/if}>{$LANG.btk_log_level_warning}</option>
                                <option value="ERROR" {if $smarty.get.filter_level == 'ERROR'}selected{/if}>{$LANG.btk_log_level_error}</option>
                                <option value="DEBUG" {if $smarty.get.filter_level == 'DEBUG'}selected{/if}>{$LANG.btk_log_level_debug}</option>
                                <option value="CRITICAL" {if $smarty.get.filter_level == 'CRITICAL'}selected{/if}>{$LANG.btk_log_level_critical}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <div class="form-group">
                            <label for="filter_message">{$LANG.btk_log_message} ({$LANG.contains})</label>
                            <input type="text" name="filter_message" id="filter_message" value="{$filter_message|escape:'html'}" class="form-control input-sm">
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-6">
                         <div class="form-group">
                            <label for="filter_admin_id">{$LANG.btk_log_admin_user} (ID)</label>
                            <input type="text" name="filter_admin_id" id="filter_admin_id" value="{$filter_admin_id|escape:'html'}" class="form-control input-sm">
                        </div>
                    </div>
                     <div class="col-md-2 col-sm-6">
                        <div class="form-group">
                            <label for="filter_date">{$LANG.btk_log_date}</label>
                            <input type="text" name="filter_date" id="filter_date" value="{$filter_date|escape:'html'}" class="form-control input-sm date-picker" placeholder="YYYY-AA-GG">
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-12">
                        <label> </label><br>
                        <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-search icon-spacer"></i>{$LANG.btk_button_search}</button>
                        <a href="{$modulelink}&action=viewlogs" class="btn btn-default btn-sm"><i class="fas fa-times icon-spacer"></i>{$LANG.btk_button_reset}</a>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="btk-page-actions pull-right" style="margin-bottom:15px;">
        <form method="post" action="{$modulelink}&action=viewlogs&subaction=clearlogs" style="display:inline;" id="clearLogsForm">
            <input type="hidden" name="token" value="{$csrfToken}" />
            <button type="submit" class="btn btn-danger btn-sm">
                <i class="fas fa-trash-alt icon-spacer"></i>{$LANG.btk_log_clear_logs_button}
            </button>
        </form>
    </div>
    <div class="clearfix"></div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-list-alt icon-spacer"></i>{$LANG.btk_log_list_title} ({$LANG.total}: {$numitems})</h3>
        </div>
        <div class="panel-body">
            {if $logs}
                <div class="table-responsive">
                    <table class="table table-striped table-bordered table-hover btk-logs-table">
                        <thead>
                            <tr>
                                <th width="160">{$LANG.btk_log_date}</th>
                                <th width="100" class="text-center">{$LANG.btk_log_level}</th>
                                <th>{$LANG.btk_log_operation}</th>
                                <th>{$LANG.btk_log_message}</th>
                                <th width="120">{$LANG.btk_log_admin_user}</th>
                                <th width="120">{$LANG.btk_log_ip_address}</th>
                                <th width="50" class="text-center">{$LANG.btk_log_details}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foreach from=$logs item=log_entry}
                                <tr>
                                    <td>{$log_entry->log_tarihi|date_format:"%d.%m.%Y %H:%M:%S"}</td>
                                    <td class="text-center">
                                        <span class="label label-{if $log_entry->log_seviyesi == 'ERROR' || $log_entry->log_seviyesi == 'CRITICAL'}danger{elseif $log_entry->log_seviyesi == 'WARNING'}warning{elseif $log_entry->log_seviyesi == 'INFO'}info{elseif $log_entry->log_seviyesi == 'DEBUG'}default{else}primary{/if}">
                                            {$log_entry->log_seviyesi}
                                        </span>
                                    </td>
                                    <td>{$log_entry->islem|escape:'html'|default:'-'}</td>
                                    <td>{$log_entry->mesaj|escape:'html'}</td>
                                    <td>{if $log_entry->whmcs_admin_id}{$log_entry->admin_fullname|default:$log_entry->whmcs_admin_id}{else}SYSTEM{/if}</td>
                                    <td>{$log_entry->ip_adresi|escape:'html'}</td>
                                    <td class="text-center">
                                        {if $log_entry->detay && $log_entry->detay != 'null' && $log_entry->detay != '[]'}
                                            <button class="btn btn-xs btn-default" data-toggle="modal" data-target="#logDetailModal{$log_entry->id}" aria-label="Detaylar">
                                                <i class="fas fa-search-plus"></i>
                                            </button>
                                            <!-- Log Detay Modal -->
                                            <div class="modal fade" id="logDetailModal{$log_entry->id}" tabindex="-1" role="dialog" aria-labelledby="logDetailModalLabel{$log_entry->id}">
                                                <div class="modal-dialog modal-lg" role="document">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                                            <h4 class="modal-title" id="logDetailModalLabel{$log_entry->id}">Log Detayı - ID: {$log_entry->id}</h4>
                                                        </div>
                                                        <div class="modal-body">
                                                            <pre style="white-space: pre-wrap; word-wrap: break-word;">{$log_entry->detay|escape:'html'}</pre>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.close}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/if}
                                    </td>
                                </tr>
                            {/foreach}
                        </tbody>
                    </table>
                </div>
                {include file="$template/includes/tablelist-pagination.tpl"} {* WHMCS pagination include *}
            {else}
                <div class="alert alert-info text-center">
                    {$LANG.btk_no_records_found}
                </div>
            {/if}
        </div>
    </div>
</div>

{* Bu şablon için gerekli JavaScript kodları (Flash mesajı, DataTables -opsiyonel-, Tarih Seçici, Silme Onayı)
   btk_admin_scripts.js dosyasına taşınmıştır veya taşınacaktır.
*}

{* Gerekli Smarty Değişkenleri (btkreports.php -> viewlogs action'ında atanmalı):
   - $flash_message (opsiyonel)
   - $modulepath, $modulelink, $version, $LANG, $csrfToken (standart)
   - $logs: mod_btk_logs tablosundan gelen log kayıtları (pagination için uygun şekilde)
   - $filter_message, $filter_admin_id, $filter_date: Mevcut filtre değerleri (GET'ten gelen)
   - $numitems, $prevpage, $nextpage, $prevpagelink, $nextpagelink, $pagelinks, $pagenumber, $totalpages: WHMCS pagination için.
*}