{*
    WHMCS BTK Raporlama Modülü - Modül Günlük Kayıtları Sayfası
    Sürüm: 7.2.4 (Operatör - Kritik Hata Düzeltmeleri)
*}

<div id="btk-logs-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.viewLogsIntro}</p>

{* Filtreleme Seçenekleri *}
<div class="panel panel-default btk-widget">
    <div class="panel-body btk-filter-panel">
        <form method="get" action="{$modulelink}&action=view_logs" class="form-inline" id="logFilterForm">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="view_logs">
            <input type="hidden" name="filter_log" value="1">

            <div class="form-group">
                <label for="s_log_level" class="sr-only">{$LANG.logLevelFilterLabel}</label>
                <select name="s_log_level" id="s_log_level" class="form-control input-sm">
                    <option value="">{$LANG.allLogLevelsOption}</option>
                    <option value="KRITIK" {if $filter.s_log_level == 'KRITIK'}selected{/if}>KRITIK</option>
                    <option value="HATA" {if $filter.s_log_level == 'HATA'}selected{/if}>HATA</option>
                    <option value="UYARI" {if $filter.s_log_level == 'UYARI'}selected{/if}>UYARI</option>
                    <option value="INFO" {if $filter.s_log_level == 'INFO'}selected{/if}>INFO</option>
                    <option value="DEBUG" {if $filter.s_log_level == 'DEBUG'}selected{/if}>DEBUG</option>
                </select>
            </div>

            <div class="form-group">
                <label for="s_log_date_range" class="sr-only">{$LANG.dateRangeFilterLabel}</label>
                <input type="text" name="s_log_date_range" id="s_log_date_range" value="{$filter.s_log_date_range|escape}" class="form-control input-sm date-range-picker" placeholder="{$LANG.dateRangeFilterLabel}">
            </div>

            <div class="form-group">
                <label for="s_log_search_term" class="sr-only">{$LANG.searchTermFilterLabel}</label>
                <input type="text" name="s_log_search_term" id="s_log_search_term" value="{$filter.s_log_search_term|escape}" class="form-control input-sm" placeholder="{$LANG.searchTermPlaceholder}">
            </div>

            <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-filter"></i> {$LANG.filterButton}</button>
            <a href="{$modulelink}&action=view_logs" class="btn btn-default btn-sm"><i class="fas fa-sync-alt"></i> {$LANG.resetFilterButton}</a>
        </form>
    </div>
</div>

<ul class="nav nav-tabs" id="logTabs" role="tablist">
    <li role="presentation" class="active"><a href="#moduleLogs" aria-controls="moduleLogs" role="tab" data-toggle="tab">{$LANG.logTypeGeneral}</a></li>
    <li role="presentation"><a href="#ftpLogs" aria-controls="ftpLogs" role="tab" data-toggle="tab">{$LANG.logTypeFtp}</a></li>
</ul>

<div class="tab-content" style="margin-top: 20px;">
    <div role="tabpanel" class="tab-pane active" id="moduleLogs">
        {if $logs.general.data}
            <div class="table-responsive">
                <table class="table table-striped table-bordered" width="100%">
                    <thead>
                        <tr>
                            <th style="width:20%;">{$LANG.logDateHeader}</th>
                            <th style="width:10%;">{$LANG.logLevelHeader}</th>
                            <th style="width:25%;">{$LANG.logActionHeader}</th>
                            <th>{$LANG.logMessageHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$logs.general.data item=log}
                            <tr>
                                <td>{$log.log_zamani|date_format:"%d.%m.%Y %H:%M:%S"} <small class="text-muted">({$log.log_zamani|substr:-6}s)</small></td>
                                <td>
                                    {if $log.log_seviyesi == 'HATA' || $log.log_seviyesi == 'KRITIK'}
                                        <span class="label label-danger">{$log.log_seviyesi}</span>
                                    {elseif $log.log_seviyesi == 'UYARI'}
                                        <span class="label label-warning">{$log.log_seviyesi}</span>
                                    {elseif $log.log_seviyesi == 'DEBUG'}
                                        <span class="label label-default">{$log.log_seviyesi}</span>
                                    {else}
                                        <span class="label label-info">{$log.log_seviyesi}</span>
                                    {/if}
                                </td>
                                <td>{$log.islem|escape}</td>
                                <td><small class="text-muted" style="white-space: pre-wrap; word-break: break-all;">{$log.mesaj|escape}</small></td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
             {$logs.general.pagination}
        {else}
            <div class="alert alert-info text-center">{$LANG.noGeneralLogsFound|default:'Genel log kaydı bulunamadı.'}</div>
        {/if}
    </div>
    <div role="tabpanel" class="tab-pane" id="ftpLogs">
        {if $logs.ftp.data}
            <div class="table-responsive">
                <table class="table table-striped table-bordered" width="100%">
                    <thead>
                        <tr>
                            <th style="width:20%;">{$LANG.logDateHeader}</th>
                            <th>{$LANG.logFileNameHeader}</th>
                            <th style="width:10%;">FTP Sunucu</th>
                            <th style="width:5%;">CNT</th>
                            <th style="width:10%;">{$LANG.logStatusHeader}</th>
                            <th>{$LANG.logMessageHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach from=$logs.ftp.data item=log}
                            <tr>
                                <td>{$log.gonderim_zamani|date_format:"%d.%m.%Y %H:%M:%S"} <small class="text-muted">({$log.gonderim_zamani|substr:-6}s)</small></td>
                                <td>{$log.dosya_adi|escape} <br><small class="text-muted">{$log.rapor_turu} / {$log.yetki_turu_grup}</small></td>
                                <td><span class="label label-default">{$log.ftp_sunucu_tipi}</span></td>
                                <td>{$log.cnt_numarasi}</td>
                                <td>
                                    {if $log.durum == 'Basarili'}
                                        <span class="label label-success">{$LANG.statusSuccess}</span>
                                    {elseif $log.durum == 'Atlandi'}
                                        <span class="label label-info">Atlandı</span>
                                    {else}
                                        <span class="label label-danger" title="{$log.hata_mesaji|escape}">{$LANG.statusError}</span>
                                    {/if}
                                </td>
                                <td><small class="text-muted">{$log.hata_mesaji|truncate:120:"...":true|escape}</small></td>
                            </tr>
                        {/foreach}
                    </tbody>
                </table>
            </div>
            {$logs.ftp.pagination}
        {else}
            <div class="alert alert-info text-center">{$LANG.noFtpLogsFound|default:'FTP log kaydı bulunamadı.'}</div>
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
                    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                    <button type="submit" class="btn btn-danger"><i class="fas fa-trash-alt"></i> {$LANG.confirmButton}</button>
                </form>
                <button type="button" class="btn btn-default" data-dismiss="modal" style="margin-left: 5px;">{$LANG.cancelButton}</button>
            </div>
        </div>
    </div>
</div>