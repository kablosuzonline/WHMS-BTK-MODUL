{*
    WHMCS BTK Raporlama Modülü - Modül Günlük Kayıtları Sayfası
    Dosya: templates/admin/view_logs.tpl
    Sürüm: 6.5
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<p>{$LANG.viewLogsIntro|default:'Modülün çalışma kayıtlarını ve olası hataları buradan takip edebilirsiniz.'}</p>

{* Filtreleme Seçenekleri *}
<form method="get" action="{$modulelink}&action=view_logs" class="form-inline well well-sm" id="logFilterForm">
    <input type="hidden" name="module" value="btkreports">
    <input type="hidden" name="action" value="view_logs">
    <input type="hidden" name="filter_log" value="1">

    <div class="form-group">
        <label for="s_log_type">{$LANG.logTypeFilterLabel|default:'Log Türü'}:</label>
        <select name="s_log_type" id="s_log_type" class="form-control input-sm">
            <option value="">{$LANG.allLogTypesOption|default:'Tüm Türler'}</option>
            <option value="FTP" {if $filter.s_log_type == 'FTP'}selected{/if}>{$LANG.logTypeFtp|default:'FTP'}</option>
            <option value="GENERAL" {if $filter.s_log_type == 'GENERAL'}selected{/if}>{$LANG.logTypeGeneral|default:'Genel'}</option>
            <option value="NVI" {if $filter.s_log_type == 'NVI'}selected{/if}>{$LANG.logTypeNvi|default:'NVİ'}</option>
            <option value="CRON" {if $filter.s_log_type == 'CRON'}selected{/if}>{$LANG.logTypeCron|default:'Cron'}</option>
            <option value="REPORTING" {if $filter.s_log_type == 'REPORTING'}selected{/if}>{$LANG.logTypeReporting|default:'Raporlama'}</option>
            <option value="AUTH" {if $filter.s_log_type == 'AUTH'}selected{/if}>{$LANG.logTypeAuth|default:'Yetkilendirme'}</option>
        </select>
    </div>

    <div class="form-group">
        <label for="s_log_level">{$LANG.logLevelFilterLabel|default:'Seviye'}:</label>
        <select name="s_log_level" id="s_log_level" class="form-control input-sm">
            <option value="">{$LANG.allLogLevelsOption|default:'Tüm Seviyeler'}</option>
            <option value="INFO" {if $filter.s_log_level == 'INFO'}selected{/if}>INFO</option>
            <option value="WARNING" {if $filter.s_log_level == 'WARNING'}selected{/if}>WARNING</option>
            <option value="ERROR" {if $filter.s_log_level == 'ERROR'}selected{/if}>ERROR</option>
            <option value="CRITICAL" {if $filter.s_log_level == 'CRITICAL'}selected{/if}>CRITICAL</option>
            <option value="DEBUG" {if $filter.s_log_level == 'DEBUG'}selected{/if}>DEBUG</option>
        </select>
    </div>

    <div class="form-group">
        <label for="s_log_date_range">{$LANG.dateRangeFilterLabel|default:'Tarih Aralığı'}:</label>
        <input type="text" name="s_log_date_range" id="s_log_date_range" value="{$filter.s_log_date_range|escape}" class="form-control input-sm date-range-picker" placeholder="{$LANG.dateRangePlaceholder|default:'Tarih aralığı seçin'}">
    </div>

    <div class="form-group">
        <label for="s_log_search_term">{$LANG.searchTermFilterLabel|default:'Arama'}:</label>
        <input type="text" name="s_log_search_term" id="s_log_search_term" value="{$filter.s_log_search_term|escape}" class="form-control input-sm" placeholder="{$LANG.searchTermPlaceholder|default:'Mesajda ara...'}">
    </div>

    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-filter"></i> {$LANG.filterButton|default:'Filtrele'}</button>
    <a href="{$modulelink}&action=view_logs&clearfilter_log=1" class="btn btn-default btn-sm"><i class="fas fa-sync-alt"></i> {$LANG.resetFilterButton|default:'Sıfırla'}</a>
</form>

<ul class="nav nav-tabs" id="logTabs" role="tablist">
    <li role="presentation" class="{if $log_type_to_display != 'FTP'}active{/if}"><a href="#moduleLogs" aria-controls="moduleLogs" role="tab" data-toggle="tab">{$LANG.generalLogsTitle}</a></li>
    <li role="presentation" class="{if $log_type_to_display == 'FTP'}active{/if}"><a href="#ftpLogs" aria-controls="ftpLogs" role="tab" data-toggle="tab">{$LANG.ftpLogsTitle}</a></li>
</ul>

<div class="tab-content">
    <div role="tabpanel" class="tab-pane {if $log_type_to_display != 'FTP'}active{/if}" id="moduleLogs">
        {if $generalLogs}
            <div class="table-responsive">
                <table id="tblGeneralLogs" class="datatable table table-striped table-bordered" width="100%">
                    <thead>
                        <tr>
                            <th style="width:15%;">{$LANG.logDateHeader}</th>
                            <th style="width:10%;">{$LANG.logLevelHeader}</th>
                            <th style="width:25%;">{$LANG.logActionHeader}</th>
                            <th>{$LANG.logMessageHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$generalLogs item=log}
                            <tr>
                                <td data-order="{$log.log_zamani|strtotime}">{$log.log_zamani|date_format:$smarty.const.MYSQL_DATETIME_FORMAT}</td>
                                <td>
                                    {if $log.log_seviyesi == 'ERROR' || $log.log_seviyesi == 'CRITICAL'}
                                        <span class="label label-danger">{$log.log_seviyesi}</span>
                                    {elseif $log.log_seviyesi == 'WARNING'}
                                        <span class="label label-warning">{$log.log_seviyesi}</span>
                                    {elseif $log.log_seviyesi == 'DEBUG'}
                                        <span class="label label-default">{$log.log_seviyesi}</span>
                                    {else}
                                        <span class="label label-info">{$log.log_seviyesi}</span>
                                    {/if}
                                </td>
                                <td>{$log.islem|escape}</td>
                                <td><small class="text-muted">{$log.mesaj|escape|nl2br}</small></td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
             {$pagination_output_general|default:''}
        {else}
            <div class="alert alert-info text-center" style="margin-top:15px;">
                {$LANG.noLogsFoundForFilter|default:'Seçili filtrelere uygun genel log kaydı bulunamadı.'}
            </div>
        {/if}
    </div>
    <div role="tabpanel" class="tab-pane {if $log_type_to_display == 'FTP'}active{/if}" id="ftpLogs">
        {if $ftpLogs}
            <div class="table-responsive">
                <table id="tblFtpLogs" class="table table-striped table-bordered" width="100%">
                    <thead>
                        <tr>
                            <th style="width:15%;">{$LANG.logDateHeader}</th>
                            <th style="width:10%;">{$LANG.logReportTypeHeader}</th>
                            <th>{$LANG.logFileNameHeader}</th>
                            <th style="width:10%;">{$LANG.logFtpServerTypeHeader}</th>
                            <th style="width:5%;">{$LANG.logCntHeader}</th>
                            <th style="width:10%;">{$LANG.logStatusHeader}</th>
                            <th>{$LANG.logMessageHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$ftpLogs item=log}
                            <tr>
                                <td data-order="{$log.gonderim_zamani|strtotime}">{$log.gonderim_zamani|date_format:$smarty.const.MYSQL_DATETIME_FORMAT}</td>
                                <td>{$log.rapor_turu}</td>
                                <td>{$log.dosya_adi|escape}</td>
                                <td>{$log.ftp_sunucu_tipi}</td>
                                <td>{$log.cnt_numarasi}</td>
                                <td>
                                    {if $log.durum == 'Basarili'}
                                        <span class="label label-success">{$LANG.statusSuccess}</span>
                                    {else}
                                        <span class="label label-danger" title="{$log.hata_mesaji|escape}">{$LANG.statusError}</span>
                                    {/if}
                                </td>
                                <td><small class="text-muted" title="{$log.hata_mesaji|escape}">{$log.hata_mesaji|truncate:100:"...":true|escape|nl2br}</small></td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
            {$pagination_output_ftp|default:''}
        {else}
            <div class="alert alert-info text-center" style="margin-top:15px;">
                {$LANG.noFtpLogsFound|default:'Seçili filtrelere uygun FTP log kaydı bulunamadı.'}
            </div>
        {/if}
    </div>
</div>

<div class="text-center" style="margin-top: 20px; margin-bottom: 20px;">
    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#confirmDeleteAllLogsModal">
        <i class="fas fa-trash-alt"></i> {$LANG.deleteAllLogsButton}
    </button>
</div>

{* Logları Silme Onay Modalı *}
<div class="modal fade" id="confirmDeleteAllLogsModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteAllLogsModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content panel-danger">
            <div class="modal-header panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h4 class="modal-title" id="confirmDeleteAllLogsModalLabel">{$LANG.confirmDeleteLogsModalTitle}</h4>
            </div>
            <div class="modal-body">
                <p>{$LANG.confirmDeleteLogsModalText}</p>
                <p class="text-danger"><strong>{$LANG.warningIrreversibleAction}</strong></p>
            </div>
            <div class="modal-footer">
                <form method="post" action="{$modulelink}&action=delete_all_logs" id="deleteAllLogsForm" style="display:inline;">
                    <input type="hidden" name="token" value="{$csrfToken}">
                    <button type="submit" class="btn btn-danger"><i class="fas fa-trash-alt"></i> {$LANG.confirmButton}</button>
                </form>
                <button type="button" class="btn btn-default" data-dismiss="modal" style="margin-left: 5px;">{$LANG.cancelButton}</button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
{* JS kodları btk_admin_scripts.js içine taşındı. *}
</script>