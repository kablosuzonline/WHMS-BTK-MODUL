{*
    WHMCS BTK Raporlama Modülü - Modül Günlük Kayıtları Şablonu
    modules/addons/btkreports/templates/admin/view_logs.tpl
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* DataTables gibi kütüphaneler için CSS dosyası da buraya eklenebilir *}

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.viewlogstitle|default:'Modül Günlük Kayıtları'}
    </div>
    <div class="btk-header-actions">
        {* Belki "Tüm Logları Temizle" gibi bir buton eklenebilir (dikkatli kullanılmalı) *}
        {* <button type="button" class="btn btn-danger btn-xs" id="clearAllLogsBtn"><i class="fas fa-trash-alt"></i> Tüm Logları Temizle</button> *}
    </div>
</div>

{if $successMessage}
    <div class="alert alert-success text-center"><i class="fas fa-check-circle"></i> {$successMessage}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> {$errorMessage}</div>
{/if}

<div class="btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-history"></i> {$LANG.moduleLogsTitle|default:'İşlem ve Hata Logları'} ({$LANG.lastXLogs|replace:'%s':$log_limit_placeholder|default:'Son 100 Kayıt'})</h3>
    </div>
    <div class="panel-body">
        {* Log Filtreleme Formu Buraya Eklenebilir *}
        {*
        <form method="get" action="{$modulelink}&action=viewlogs" class="form-inline bottom-margin-10">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="viewlogs">
            <div class="form-group">
                <label for="log_level_filter">{$LANG.logLevel|default:'Seviye:'}</label>
                <select name="log_level" id="log_level_filter" class="form-control input-sm">
                    <option value="">{$LANG.all|default:'Tümü'}</option>
                    <option value="INFO" {if $smarty.get.log_level == 'INFO'}selected{/if}>INFO</option>
                    <option value="WARNING" {if $smarty.get.log_level == 'WARNING'}selected{/if}>WARNING</option>
                    <option value="ERROR" {if $smarty.get.log_level == 'ERROR'}selected{/if}>ERROR</option>
                    <option value="DEBUG" {if $smarty.get.log_level == 'DEBUG'}selected{/if}>DEBUG</option>
                    <option value="CRITICAL" {if $smarty.get.log_level == 'CRITICAL'}selected{/if}>CRITICAL</option>
                </select>
            </div>
            <div class="form-group">
                <label for="log_islem_filter" style="margin-left:10px;">{$LANG.logActionFilter|default:'İşlem:'}</label>
                <input type="text" name="log_islem" id="log_islem_filter" value="{$smarty.get.log_islem|escape}" class="form-control input-sm" placeholder="İşlem adı içerir...">
            </div>
            <button type="submit" class="btn btn-default btn-sm" style="margin-left:10px;">{$LANG.filter|default:'Filtrele'}</button>
        </form>
        *}
        <div class="table-responsive">
            <table class="table table-striped table-condensed" id="moduleLogsTable">
                <thead>
                    <tr>
                        <th style="width:160px;">{$LANG.logDateTime|default:'Tarih/Saat'}</th>
                        <th style="width:100px;">{$LANG.logLevel|default:'Seviye'}</th>
                        <th>{$LANG.logAction|default:'İşlem'}</th>
                        <th>{$LANG.logMessage|default:'Mesaj'}</th>
                        <th style="width:100px;">{$LANG.logUserId|default:'Kullanıcı ID'}</th>
                        <th style="width:120px;">{$LANG.logIpAddress|default:'IP Adresi'}</th>
                    </tr>
                </thead>
                <tbody>
                    {if $module_logs}
                        {foreach from=$module_logs item=log}
                            <tr class="log-level-{$log.log_seviyesi|lower}">
                                <td>{$log.log_zamani}</td>
                                <td><span class="label log-label-{$log.log_seviyesi|lower}">{$log.log_seviyesi}</span></td>
                                <td>{$log.islem|escape}</td>
                                <td style="word-break: break-all;">{$log.mesaj|escape|nl2br}</td>
                                <td>{$log.kullanici_id|default:$LANG.notApplicableShort}</td>
                                <td>{$log.ip_adresi|default:'-'}</td>
                            </tr>
                        {/foreach}
                    {else}
                        <tr>
                            <td colspan="6" class="text-center">{$LANG.noModuleLogsFound|default:'Modül log kaydı bulunamadı.'}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        {* Sayfalandırma (Pagination) Buraya Eklenebilir *}
    </div>
</div>

<div class="btk-widget top-margin-20">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-upload"></i> {$LANG.ftpLogsTitle|default:'FTP Gönderim Logları'} ({$LANG.lastXLogs|replace:'%s':$ftp_log_limit_placeholder|default:'Son 50 Kayıt'})</h3>
    </div>
    <div class="panel-body">
        {* FTP Log Filtreleme Formu Buraya Eklenebilir *}
        <div class="table-responsive">
            <table class="table table-striped table-condensed" id="ftpLogsTable">
                <thead>
                    <tr>
                        <th style="width:160px;">{$LANG.logDateTime|default:'Tarih/Saat'}</th>
                        <th>{$LANG.logFilename|default:'Dosya Adı'}</th>
                        <th style="width:100px;">{$LANG.reportType|default:'Rapor Türü'}</th>
                        <th style="width:120px;">{$LANG.ftpServerType|default:'FTP Sunucusu'}</th>
                        <th style="width:100px;">{$LANG.logStatus|default:'Durum'}</th>
                        <th>{$LANG.logErrorMessage|default:'Hata Mesajı'}</th>
                        <th style="width:60px;">CNT</th>
                    </tr>
                </thead>
                <tbody>
                    {if $ftp_logs}
                        {foreach from=$ftp_logs item=log}
                            <tr class="log-level-{$log.durum|lower}">
                                <td>{$log.gonderim_zamani}</td>
                                <td>{$log.dosya_adi|escape}</td>
                                <td>{$log.rapor_turu} {if $log.yetki_turu_grup}({$log.yetki_turu_grup}){/if}</td>
                                <td>{$LANG[$log.ftp_sunucu_tipi|lower ~ 'FtpServerShort']|default:$log.ftp_sunucu_tipi}</td>
                                <td>
                                    {if $log.durum == 'Basarili'}
                                        <span class="label label-success">{$log.durum}</span>
                                    {else}
                                        <span class="label label-danger">{$log.durum}</span>
                                    {/if}
                                </td>
                                <td style="word-break: break-all;">{$log.hata_mesaji|escape|nl2br}</td>
                                <td>{$log.cnt_numarasi}</td>
                            </tr>
                        {/foreach}
                    {else}
                        <tr>
                            <td colspan="7" class="text-center">{$LANG.noFtpLogsFound|default:'FTP gönderim log kaydı bulunamadı.'}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        {* Sayfalandırma (Pagination) Buraya Eklenebilir *}
    </div>
</div>

{* DataTables gibi kütüphaneler için JS ve log seviyelerine göre renklendirme için CSS *}
<style type="text/css">
.log-label-error, .log-level-error td:first-child, .log-level-basarisiz td:first-child { color: #a94442; background-color: #f2dede !important; }
.log-label-critical, .log-level-critical td:first-child { color: #a94442; font-weight: bold; background-color: #e4b9b9 !important; }
.log-label-warning, .log-level-warning td:first-child { color: #8a6d3b; background-color: #fcf8e3 !important; }
.log-label-info, .log-level-info td:first-child { /* color: #31708f; background-color: #d9edf7 !important; */ }
.log-label-debug, .log-level-debug td:first-child { color: #777; background-color: #f9f9f9 !important; }
.log-label-success, .log-level-basarili td:first-child { color: #3c763d; background-color: #dff0d8 !important; }
.table-condensed > tbody > tr > td.log-level-error { background-color: #f2dede !important; }
</style>

<script type="text/javascript">
$(document).ready(function() {
    // DataTables entegrasyonu (opsiyonel)
    // if (typeof $.fn.DataTable == 'function') {
    //     $('#moduleLogsTable').DataTable({"order": [[ 0, "desc" ]]});
    //     $('#ftpLogsTable').DataTable({"order": [[ 0, "desc" ]]});
    // }
});
</script>