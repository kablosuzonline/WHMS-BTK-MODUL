{*
    WHMCS BTK Raporlama Modülü - Modül Günlük Kayıtları Sayfası
    Dosya: templates/admin/view_logs.tpl
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

    <div class="form-group">
        <label for="log_type_filter">{$LANG.logTypeFilterLabel|default:'Log Türü'}:</label>
        <select name="log_type" id="log_type_filter" class="form-control input-sm">
            <option value="">{$LANG.allLogTypesOption|default:'Tüm Türler'}</option>
            <option value="GENERAL" {if $filter.log_type == 'GENERAL'}selected{/if}>{$LANG.logTypeGeneral|default:'Genel'}</option>
            <option value="FTP" {if $filter.log_type == 'FTP'}selected{/if}>{$LANG.logTypeFtp|default:'FTP'}</option>
            <option value="NVI" {if $filter.log_type == 'NVI'}selected{/if}>{$LANG.logTypeNvi|default:'NVİ'}</option>
            <option value="CRON" {if $filter.log_type == 'CRON'}selected{/if}>{$LANG.logTypeCron|default:'Cron'}</option>
            <option value="REPORTING" {if $filter.log_type == 'REPORTING'}selected{/if}>{$LANG.logTypeReporting|default:'Raporlama'}</option>
            <option value="AUTH" {if $filter.log_type == 'AUTH'}selected{/if}>{$LANG.logTypeAuth|default:'Yetkilendirme'}</option>
        </select>
    </div>

    <div class="form-group">
        <label for="log_level_filter">{$LANG.logLevelFilterLabel|default:'Seviye'}:</label>
        <select name="log_level" id="log_level_filter" class="form-control input-sm">
            <option value="">{$LANG.allLogLevelsOption|default:'Tüm Seviyeler'}</option>
            <option value="INFO" {if $filter.log_level == 'INFO'}selected{/if}>INFO</option>
            <option value="WARNING" {if $filter.log_level == 'WARNING'}selected{/if}>WARNING</option>
            <option value="ERROR" {if $filter.log_level == 'ERROR'}selected{/if}>ERROR</option>
            <option value="CRITICAL" {if $filter.log_level == 'CRITICAL'}selected{/if}>CRITICAL</option>
            <option value="DEBUG" {if $filter.log_level == 'DEBUG'}selected{/if}>DEBUG</option>
        </select>
    </div>

    <div class="form-group">
        <label for="log_date_range_filter">{$LANG.dateRangeFilterLabel|default:'Tarih Aralığı'}:</label>
        <input type="text" name="log_date_range" id="log_date_range_filter" value="{$filter.log_date_range|escape}" class="form-control input-sm date-range-picker" placeholder="{$LANG.dateRangePlaceholder|default:'Tarih aralığı seçin'}">
    </div>

    <div class="form-group">
        <label for="log_search_term_filter">{$LANG.searchTermFilterLabel|default:'Arama'}:</label>
        <input type="text" name="log_search_term" id="log_search_term_filter" value="{$filter.log_search_term|escape}" class="form-control input-sm" placeholder="{$LANG.searchTermPlaceholder|default:'Mesajda ara...'}">
    </div>
    
    <div class="form-group">
        <label for="log_limit_filter">{$LANG.logLimitFilterLabel|default:'Kayıt Sayısı'}:</label>
        <select name="limit" id="log_limit_filter" class="form-control input-sm">
            <option value="25" {if $filter.limit == 25}selected{/if}>25</option>
            <option value="50" {if $filter.limit == 50}selected{/if}>50</option>
            <option value="100" {if $filter.limit == 100}selected{/if}>100</option>
            <option value="250" {if $filter.limit == 250}selected{/if}>250</option>
            <option value="500" {if $filter.limit == 500}selected{/if}>500</option>
        </select>
    </div>


    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-filter"></i> {$LANG.filterButton|default:'Filtrele'}</button>
    <a href="{$modulelink}&action=view_logs" class="btn btn-default btn-sm"><i class="fas fa-sync-alt"></i> {$LANG.resetFilterButton|default:'Sıfırla'}</a>
</form>

{if $log_type_to_display == 'FTP' && $ftpLogs}
    <h4>{$LANG.ftpLogsTitle|default:'FTP Gönderim Logları'}</h4>
    <div class="table-responsive">
        <table id="tblFtpLogs" class="datatable table table-striped table-bordered" width="100%">
            <thead>
                <tr>
                    <th style="width:15%;">{$LANG.logDateHeader|default:'Tarih'}</th>
                    <th style="width:10%;">{$LANG.logReportTypeHeader|default:'Rapor Türü'}</th>
                    <th>{$LANG.logFileNameHeader|default:'Dosya Adı'}</th>
                    <th style="width:10%;">{$LANG.logFtpServerTypeHeader|default:'FTP Sunucu'}</th>
                    <th style="width:5%;">{$LANG.logCntHeader|default:'CNT'}</th>
                    <th style="width:10%;">{$LANG.logStatusHeader|default:'Durum'}</th>
                    <th>{$LANG.logMessageHeader|default:'Mesaj'}</th>
                </tr>
            </thead>
            <tbody>
                {foreach from=$ftpLogs item=log}
                    <tr>
                        <td data-order="{$log->gonderim_tarihi|strtotime}">{$log->gonderim_tarihi|date_format:$smarty.const.MYSQL_DATETIME_FORMAT}</td>
                        <td>{$log->rapor_turu}</td>
                        <td>{$log->dosya_adi|escape}</td>
                        <td>{$log->ftp_sunucu_turu}</td>
                        <td>{$log->cnt}</td>
                        <td>
                            {if $log->durum == 'BASARILI'}
                                <span class="label label-success">{$LANG.statusSuccess|default:'Başarılı'}</span>
                            {else}
                                <span class="label label-danger" title="{$log->hata_mesaji|escape}">{$LANG.statusError|default:'Hatalı'}</span>
                            {/if}
                        </td>
                        <td><small class="text-muted" title="{$log->hata_mesaji|escape}">{$log->hata_mesaji|truncate:100:"...":true|escape|nl2br}</small></td>
                    </tr>
                {/foreach}
            </tbody>
        </table>
    </div>
    {$pagination_output_ftp|default:''}
{elseif $generalLogs}
    <h4>{$LANG.generalLogsTitle|default:'Genel İşlem Logları'}</h4>
    <div class="table-responsive">
        <table id="tblGeneralLogs" class="datatable table table-striped table-bordered" width="100%">
            <thead>
                <tr>
                    <th style="width:15%;">{$LANG.logDateHeader|default:'Tarih'}</th>
                    <th style="width:10%;">{$LANG.logLevelHeader|default:'Seviye'}</th>
                    <th style="width:25%;">{$LANG.logActionHeader|default:'İşlem'}</th>
                    <th>{$LANG.logMessageHeader|default:'Mesaj'}</th>
                </tr>
            </thead>
            <tbody>
                {foreach from=$generalLogs item=log}
                    <tr>
                        <td data-order="{$log->tarih|strtotime}">{$log->tarih|date_format:$smarty.const.MYSQL_DATETIME_FORMAT}</td>
                        <td>
                            {if $log->seviye == 'ERROR' || $log->seviye == 'CRITICAL'}
                                <span class="label label-danger">{$log->seviye}</span>
                            {elseif $log->seviye == 'WARNING'}
                                <span class="label label-warning">{$log->seviye}</span>
                            {elseif $log->seviye == 'DEBUG'}
                                <span class="label label-default">{$log->seviye}</span>
                            {else}
                                <span class="label label-info">{$log->seviye}</span>
                            {/if}
                        </td>
                        <td>{$log->islem|escape}</td>
                        <td><small class="text-muted">{$log->mesaj|escape|nl2br}</small></td>
                    </tr>
                {/foreach}
            </tbody>
        </table>
    </div>
     {$pagination_output_general|default:''}
{else}
    <div class="alert alert-info text-center">
        {$LANG.noLogsFoundForFilter|default:'Seçili filtrelere uygun log kaydı bulunamadı.'}
    </div>
{/if}


<div class="text-center" style="margin-top: 20px; margin-bottom: 20px;">
    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#confirmDeleteAllLogsModal">
        <i class="fas fa-trash-alt"></i> {$LANG.deleteAllLogsButton|default:'Tüm Logları Sil'}
    </button>
</div>

{* Logları Silme Onay Modalı *}
<div class="modal fade" id="confirmDeleteAllLogsModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteAllLogsModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content panel-danger">
            <div class="modal-header panel-heading">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h4 class="modal-title" id="confirmDeleteAllLogsModalLabel">{$LANG.confirmDeleteLogsModalTitle|default:'Tüm Logları Silmeyi Onayla'}</h4>
            </div>
            <div class="modal-body">
                <p>{$LANG.confirmDeleteLogsModalText|default:'Tüm modül günlük kayıtlarını (Genel ve FTP logları) kalıcı olarak silmek istediğinizden emin misiniz?'}</p>
                <p class="text-danger"><strong>{$LANG.warningIrreversibleAction|default:'Bu işlem geri alınamaz!'}</strong></p>
            </div>
            <div class="modal-footer">
                <form method="post" action="{$modulelink}&action=delete_all_logs" id="deleteAllLogsForm" style="display:inline;">
                    <input type="hidden" name="token" value="{$csrfToken}">
                    <button type="submit" class="btn btn-danger"><i class="fas fa-trash-alt"></i> {$LANG.confirmDeleteButton|default:'Evet, Tümünü Sil'}</button>
                </form>
                <button type="button" class="btn btn-default" data-dismiss="modal" style="margin-left: 5px;">{$LANG.cancelButton|default:'İptal'}</button>
            </div>
        </div>
    </div>
</div>

{*
    btk_admin_scripts.js içinde DataTables ve Flatpickr başlatmaları yapılacaktır.
    Bu sayfaya özel JavaScript gerekirse buraya eklenebilir.
*}