{*
    WHMCS BTK Raporlama Modülü - Log Görüntüleme Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-logs-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.viewLogsIntro}</p>

<form method="get" action="{$modulelink}">
    <input type="hidden" name="module" value="btkreports">
    <input type="hidden" name="action" value="viewlogs">
    <div class="panel panel-default btk-widget">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-3">
                    <input type="text" name="s_log_search_term" value="{$filter.s_log_search_term|escape}" class="form-control" placeholder="{$LANG.searchTermPlaceholder}">
                </div>
                <div class="col-sm-3">
                    <select name="s_log_level" class="form-control">
                        <option value="">{$LANG.allLogLevelsOption}</option>
                        <option value="INFO" {if $filter.s_log_level == 'INFO'}selected{/if}>INFO</option>
                        <option value="UYARI" {if $filter.s_log_level == 'UYARI'}selected{/if}>UYARI</option>
                        <option value="HATA" {if $filter.s_log_level == 'HATA'}selected{/if}>HATA</option>
                        <option value="KRITIK" {if $filter.s_log_level == 'KRITIK'}selected{/if}>KRITIK</option>
                    </select>
                </div>
                <div class="col-sm-4">
                    <input type="text" name="s_log_date_range" value="{$filter.s_log_date_range|escape}" class="form-control date-picker-search" placeholder="{$LANG.dateRangeFilterLabel}">
                </div>
                <div class="col-sm-2">
                    <div class="btn-group" style="width:100%;">
                        <button type="submit" class="btn btn-primary" style="width: calc(100% - 40px);"><i class="fas fa-search"></i> {$LANG.filterButton}</button>
                        <a href="{$modulelink}&action=viewlogs" class="btn btn-default" style="width: 40px;" title="{$LANG.resetFilterButton}"><i class="fas fa-sync-alt"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>

<ul class="nav nav-tabs admin-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#generallogs" aria-controls="generallogs" role="tab" data-toggle="tab">Genel Modül Logları</a></li>
    <li role="presentation"><a href="#ftplogs" aria-controls="ftplogs" role="tab" data-toggle="tab">FTP Gönderim Logları</a></li>
</ul>

<div class="tab-content admin-tabs">
    <div role="tabpanel" class="tab-pane active" id="generallogs">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 80px;">{$LANG.logLevelHeader}</th>
                        <th>{$LANG.logActionHeader}</th>
                        <th>{$LANG.logMessageHeader}</th>
                        <th style="width: 120px;">IP Adresi</th>
                        <th style="width: 150px;">Tarih & Saat</th>
                    </tr>
                </thead>
                <tbody>
                    {foreach from=$logs.general.data item=log}
                        <tr>
                            <td><span class="label label-{$log.log_seviyesi|lower|replace:'uyari':'warning'|replace:'hata':'danger'|replace:'kritik':'danger'}">{$log.log_seviyesi}</span></td>
                            <td>{$log.islem|escape}</td>
                            <td><pre style="white-space: pre-wrap; word-break: break-all; background-color: transparent; border: none; padding: 0; margin: 0;">{$log.mesaj|escape}</pre></td>
                            <td>{$log.ip_adresi}</td>
                            <td>{$log.formatted_log_zamani}</td>
                        </tr>
                    {foreachelse}
                        <tr><td colspan="5" class="text-center">{$LANG.noGeneralLogsFound}</td></tr>
                    {/foreach}
                </tbody>
            </table>
        </div>
        {$logs.general.pagination}
    </div>

    <div role="tabpanel" class="tab-pane" id="ftplogs">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th style="width: 80px;">{$LANG.logStatusHeader}</th>
                        <th>{$LANG.logFileNameHeader}</th>
                        <th>{$LANG.logMessageHeader}</th>
                        <th style="width: 120px;">FTP Sunucusu</th>
                        <th style="width: 150px;">Tarih & Saat</th>
                    </tr>
                </thead>
                <tbody>
                    {foreach from=$logs.ftp.data item=log}
                         <tr>
                            <td>
                                {if $log.durum == 'Basarili'}
                                    <span class="label label-success">Başarılı</span>
                                {else}
                                     <span class="label label-danger">Başarısız</span>
                                {/if}
                            </td>
                            <td><strong>{$log.dosya_adi|escape}</strong><br><small>Rapor: {$log.rapor_turu} / Grup: {$log.yetki_turu_grup|default:'N/A'}</small></td>
                            <td><pre style="white-space: pre-wrap; word-break: break-all; background-color: transparent; border: none; padding: 0; margin: 0;">{$log.hata_mesaji|escape}</pre></td>
                            <td>{$log.ftp_sunucu_tipi}</td>
                            <td>{$log.formatted_gonderim_zamani}</td>
                        </tr>
                    {foreachelse}
                         <tr><td colspan="5" class="text-center">{$LANG.noFtpLogsFound}</td></tr>
                    {/foreach}
                </tbody>
            </table>
        </div>
        {$logs.ftp.pagination}
    </div>
</div>

<form method="post" action="{$modulelink}&action=delete_all_logs" style="margin-top: 20px;">
    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
    <button type="submit" class="btn btn-danger btn-delete-confirm" data-message="{$LANG.confirmDeleteLogsModalText|escape}">
        <i class="fas fa-trash-alt"></i> {$LANG.deleteAllLogsButton}
    </button>
</form>