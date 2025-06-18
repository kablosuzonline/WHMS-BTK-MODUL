{* modules/addons/btkreports/templates/admin/logs.tpl *}
{* BTK Modülü İşlem Logları Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

{if $action_result_logs}
    <div class="alert alert-{if $action_result_logs.status == 'success'}success{else}danger{/if}">
        {$action_result_logs.message}
    </div>
{/if}

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-clipboard-list"></i> {$lang.logs_view_title}</h3>
    </div>
    <div class="panel-body">
        <p>{$lang.logs_description}</p>

        <form method="get" action="{$modulelink}" class="form-inline" style="margin-bottom: 20px;">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="logs">

            <div class="form-group">
                <label for="log_start_date">{$lang.filter_logs_by_date}</label>
                <div class="input-group date date-picker-range">
                    <input type="text" name="log_start_date" id="log_start_date" value="{$smarty.get.log_start_date|escape:'html'}" class="form-control input-sm" style="width: 120px;" placeholder="{$lang.start_date}">
                    <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                </div>
                -
                <div class="input-group date date-picker-range">
                    <input type="text" name="log_end_date" id="log_end_date" value="{$smarty.get.log_end_date|escape:'html'}" class="form-control input-sm" style="width: 120px;" placeholder="{$lang.end_date}">
                    <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                </div>
            </div>

            <div class="form-group" style="margin-left: 10px;">
                <label for="log_type_filter">{$lang.filter_logs_by_type}</label>
                <select name="log_type_filter" id="log_type_filter" class="form-control input-sm">
                    <option value="">{$lang.log_type_all}</option>
                    <option value="FTP" {if $smarty.get.log_type_filter == 'FTP'}selected{/if}>{$lang.log_type_ftp}</option>
                    <option value="CRON" {if $smarty.get.log_type_filter == 'CRON'}selected{/if}>{$lang.log_type_cron}</option>
                    <option value="REPORT_GEN" {if $smarty.get.log_type_filter == 'REPORT_GEN'}selected{/if}>{$lang.log_type_report_generation}</option>
                    <option value="NVI" {if $smarty.get.log_type_filter == 'NVI'}selected{/if}>{$lang.log_type_nvi_verification}</option>
                    <option value="SETTINGS" {if $smarty.get.log_type_filter == 'SETTINGS'}selected{/if}>{$lang.log_type_settings_change}</option>
                    <option value="ERROR" {if $smarty.get.log_type_filter == 'ERROR'}selected{/if}>{$lang.log_type_error}</option>
                    {* Diğer log türleri eklenebilir *}
                </select>
            </div>
            
            {* Opsiyonel: Kullanıcı/IP ve Log Seviyesi filtreleri eklenebilir *}
            {*
            <div class="form-group" style="margin-left: 10px;">
                <label for="log_user_ip_filter">Kullanıcı/IP:</label>
                <input type="text" name="log_user_ip_filter" id="log_user_ip_filter" value="{$smarty.get.log_user_ip_filter|escape:'html'}" class="form-control input-sm" style="width: 150px;">
            </div>
            <div class="form-group" style="margin-left: 10px;">
                <label for="log_level_filter">Seviye:</label>
                <select name="log_level_filter" id="log_level_filter" class="form-control input-sm">
                    <option value="">Tümü</option>
                    <option value="INFO" {if $smarty.get.log_level_filter == 'INFO'}selected{/if}>{$lang.log_level_info_text}</option>
                    <option value="WARNING" {if $smarty.get.log_level_filter == 'WARNING'}selected{/if}>{$lang.log_level_warning_text}</option>
                    <option value="ERROR" {if $smarty.get.log_level_filter == 'ERROR'}selected{/if}>{$lang.log_level_error_text}</option>
                    <option value="DEBUG" {if $smarty.get.log_level_filter == 'DEBUG'}selected{/if}>{$lang.log_level_debug_text}</option>
                </select>
            </div>
            *}

            <button type="submit" class="btn btn-primary btn-sm" style="margin-left: 10px;"><i class="fas fa-filter"></i> {$lang.filter}</button>
            <a href="{$modulelink}&action=logs" class="btn btn-default btn-sm">{$lang.clear_filter}</a>
        </form>

        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover" id="logsTable">
                <thead>
                    <tr>
                        <th width="160">{$lang.log_table_date}</th>
                        <th>{$lang.log_table_user_ip}</th>
                        <th>{$lang.log_table_action_type}</th>
                        <th>{$lang.log_table_description}</th>
                        <th width="100" class="text-center">{$lang.log_table_status}</th>
                        {* <th width="100" class="text-center">Seviye</th> *}
                    </tr>
                </thead>
                <tbody>
                    {if $log_entries}
                        {foreach from=$log_entries item=log}
                            <tr>
                                <td>{$log.date|date_format:"%d.%m.%Y %H:%M:%S"}</td>
                                <td>
                                    {if $log.user_type == 'System' || $log.user_type == 'Cron'}
                                        {$log.user_type}
                                    {elseif $log.user_type == 'Admin'}
                                        <a href="clientssummary.php?userid=0&adminid={$log.user_id}">{$log.user_fullname|default:$log.user_name}</a> (Admin)
                                    {else}
                                        {$log.user_name|default:'Bilinmiyor'}
                                    {/if}
                                    {if $log.ip_address}<br><small class="text-muted">{$log.ip_address}</small>{/if}
                                </td>
                                <td>{$log.action_type|escape:'html'}</td>
                                <td><pre style="white-space: pre-wrap; word-break: break-all; max-height: 150px; overflow-y: auto; margin:0; padding: 5px; font-size: 0.9em;">{$log.description|escape:'html'}</pre></td>
                                <td class="text-center">
                                    {if $log.status == 'success'}
                                        <span class="label label-success">Başarılı</span>
                                    {elseif $log.status == 'error'}
                                        <span class="label label-danger">Hatalı</span>
                                    {elseif $log.status == 'warning'}
                                        <span class="label label-warning">Uyarı</span>
                                    {else}
                                        <span class="label label-info">{$log.status|default:'Bilgi'|escape:'html'}</span>
                                    {/if}
                                </td>
                            </tr>
                        {/foreach}
                    {else}
                        <tr>
                            <td colspan="5" class="text-center">{$lang.no_records_found}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>

        {* Sayfalama (Pagination) - Eğer PHP tarafında sayfalama varsa *}
        {if $pagination_output_logs}
            <div class="text-center">
                {$pagination_output_logs}
            </div>
        {/if}

        {if $log_entries && $can_clear_logs} {* Sadece yetkili adminler logları silebilsin *}
        <hr>
        <form method="post" action="{$modulelink}&action=logs&sub_action=clear_logs" onsubmit="return confirm('{$lang.clear_logs_confirm|escape:'javascript'}');">
            <input type="hidden" name="token" value="{$csrfToken}">
            <button type="submit" class="btn btn-danger"><i class="fas fa-trash-alt"></i> {$lang.clear_logs_button}</button>
        </form>
        {/if}

    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    // Tarih seçicileri etkinleştir
    if ($.fn.datepicker && typeof $.datepicker.regional['tr'] !== 'undefined') {
        $('.date-picker-range').datepicker({
            dateFormat: 'yy-mm-dd',
            monthNames: $.datepicker.regional['tr'].monthNames,
            dayNamesMin: $.datepicker.regional['tr'].dayNamesMin,
            firstDay: 1,
            changeMonth: true,
            changeYear: true,
            yearRange: "-5:+0" // Son 5 yıl
        });
    } else {
        console.warn("jQuery UI Datepicker veya TR regional bulunamadı.");
    }
});
</script>