{*
    WHMCS BTK Raporlama Modülü - Modül Günlük Kayıtları Şablonu
    modules/addons/btkreports/templates/admin/view_logs.tpl
    Bu şablon, btkreports.php içindeki btk_page_view_logs() fonksiyonu tarafından doldurulur.
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* DataTables veya Flatpickr CSS'i gerekirse buraya eklenebilir *}

{if $successMessage}
    <div class="alert alert-success text-center" role="alert"><i class="fas fa-check-circle"></i> {$successMessage|nl2br}</div>
{/if}
{if $infoMessage}
    <div class="alert alert-info" role="alert"><i class="fas fa-info-circle"></i> {$infoMessage|nl2br}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger" role="alert"><i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}</div>
{/if}

<div class="btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-history"></i> {$LANG.moduleLogsTitle|default:'Modül İşlem ve Hata Logları'}</h3>
    </div>
    <div class="panel-body">
        <form method="get" action="{$modulelink}&action=viewlogs" class="form-inline" style="margin-bottom: 20px;">
            <input type="hidden" name="module" value="btkreports">
            <input type="hidden" name="action" value="viewlogs">
            <input type="hidden" name="filter_module_log" value="1">
            <input type="hidden" name="tab" value="module"> {* Aktif sekmeyi korumak için *}

            <div class="row">
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_log_level_module">{$LANG.logLevel|default:'Seviye'}</label>
                    <select name="s_log_level" id="s_log_level_module" class="form-control input-sm" style="width:100%;">
                        <option value="">-- {$LANG.all|escape:'html'} --</option>
                        <option value="INFO" {if $filters_module.s_log_level == 'INFO'}selected{/if}>INFO</option>
                        <option value="WARNING" {if $filters_module.s_log_level == 'WARNING'}selected{/if}>WARNING</option>
                        <option value="HATA" {if $filters_module.s_log_level == 'HATA'}selected{/if}>HATA</option> {* DB'de HATA olarak saklıyoruz *}
                        <option value="DEBUG" {if $filters_module.s_log_level == 'DEBUG'}selected{/if}>DEBUG</option>
                        <option value="CRITICAL" {if $filters_module.s_log_level == 'CRITICAL'}selected{/if}>CRITICAL</option>
                    </select>
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_log_islem_module">{$LANG.logActionFilter|default:'İşlem İçeriği'}</label>
                    <input type="text" name="s_log_islem" id="s_log_islem_module" value="{$filters_module.s_log_islem|escape:'html'}" class="form-control input-sm" placeholder="Örn: Ayar Kaydetme" style="width:100%;">
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_log_mesaj_module">{$LANG.logMessageFilter|default:'Mesaj İçeriği'}</label>
                    <input type="text" name="s_log_mesaj" id="s_log_mesaj_module" value="{$filters_module.s_log_mesaj|escape:'html'}" class="form-control input-sm" placeholder="Mesajda ara..." style="width:100%;">
                </div>
                 <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_log_date_from_module">{$LANG.dateFrom|default:'Başlangıç Tarihi'}</label>
                    <input type="text" name="s_log_date_from" id="s_log_date_from_module" value="{$filters_module.s_log_date_from|escape:'html'}" class="form-control input-sm btk-datepicker-yyyy-mm-dd" placeholder="YYYY-AA-GG" style="width:100%;">
                </div>
            </div>
            <div class="row top-margin-10">
                <div class="col-md-3 col-sm-6 form-group">
                    <label for="s_log_date_to_module">{$LANG.dateTo|default:'Bitiş Tarihi'}</label>
                    <input type="text" name="s_log_date_to" id="s_log_date_to_module" value="{$filters_module.s_log_date_to|escape:'html'}" class="form-control input-sm btk-datepicker-yyyy-mm-dd" placeholder="YYYY-AA-GG" style="width:100%;">
                </div>
                <div class="col-md-9 col-sm-6 form-group text-right" style="padding-top: 20px;">
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> {$LANG.filter|escape:'html'}</button>
                    <a href="{$modulelink}&action=viewlogs&clearfilter_module_log=1&tab=module" class="btn btn-default btn-sm"><i class="fas fa-times"></i> {$LANG.clearFilter|default:'Filtreyi Temizle'}</a>
                </div>
            </div>
        </form>
        <hr>
        <div class="table-responsive">
            <table class="table table-striped table-condensed table-btk-list" id="moduleLogsTable">
                <thead>
                    <tr>
                        <th style="width:150px;">{$LANG.logDateTime|default:'Tarih/Saat'}</th>
                        <th style="width:90px;">{$LANG.logLevel|default:'Seviye'}</th>
                        <th>{$LANG.logAction|default:'İşlem'}</th>
                        <th>{$LANG.logMessage|default:'Mesaj'}</th>
                        <th style="width:80px;">{$LANG.logUserId|default:'K. ID'}</th>
                        <th style="width:110px;">{$LANG.logIpAddress|default:'IP Adresi'}</th>
                    </tr>
                </thead>
                <tbody>
                    {if $module_logs}
                        {foreach from=$module_logs item=log}
                            <tr class="log-level-{$log.log_seviyesi|lower}">
                                <td>{$log.log_zamani|date_format:"%d.%m.%Y %H:%M:%S"}</td>
                                <td><span class="label log-label-{$log.log_seviyesi|lower}">{$log.log_seviyesi}</span></td>
                                <td title="{$log.islem|escape:'html'}">{$log.islem|escape:'html'|truncate:50:"...":true}</td>
                                <td style="word-break: break-all;" title="{$log.mesaj|escape:'html'}">{$log.mesaj|escape:'html'|truncate:100:"...":true|nl2br}</td>
                                <td>{$log.kullanici_id|default:($LANG.notApplicableShort|default:'N/A')}</td>
                                <td>{$log.ip_adresi|default:'-'}</td>
                            </tr>
                        {/foreach}
                    {else}
                        <tr>
                            <td colspan="6" class="text-center">{$LANG.noModuleLogsFound|default:'Modül işlem/hata log kaydı bulunamadı.'}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        {* Modül Logları Sayfalandırma *}
        {if $total_pages_module > 1}
            <nav aria-label="Module Log Page navigation">
                <ul class="pagination">
                    {if $current_page_module > 1}
                        <li><a href="{$modulelink}&action=viewlogs&tab=module&pagem={$current_page_module-1}&{$pagination_params_module}">« {$LANG.previous}</a></li>
                    {else}
                        <li class="disabled"><span>« {$LANG.previous}</span></li>
                    {/if}
                    {for $i=1 to $total_pages_module}
                        <li {if $i == $current_page_module}class="active"{/if}><a href="{$modulelink}&action=viewlogs&tab=module&pagem={$i}&{$pagination_params_module}">{$i}</a></li>
                    {/for}
                    {if $current_page_module < $total_pages_module}
                        <li><a href="{$modulelink}&action=viewlogs&tab=module&pagem={$current_page_module+1}&{$pagination_params_module}">{$LANG.next} »</a></li>
                    {else}
                        <li class="disabled"><span>{$LANG.next} »</span></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </div>
</div>

<div class="btk-widget top-margin-20">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-upload"></i> {$LANG.ftpLogsTitle|default:'FTP Gönderim Logları'} ({$total_ftp_logs|default:0} {$LANG.kayitBulundu})</h3>
    </div>
    <div class="panel-body">
        {* FTP Log Filtreleme Formu Buraya Eklenebilir (benzer şekilde) *}
        <div class="table-responsive">
            <table class="table table-striped table-condensed table-btk-list" id="ftpLogsTable">
                <thead>
                    <tr>
                        <th style="width:150px;">{$LANG.logDateTime}</th>
                        <th>{$LANG.logFilename|default:'Dosya Adı'}</th>
                        <th style="width:100px;">{$LANG.reportType}</th>
                        <th style="width:120px;">{$LANG.ftpServerType|default:'FTP Sunucusu'}</th>
                        <th style="width:100px;">{$LANG.logStatus|default:'Durum'}</th>
                        <th>{$LANG.logErrorMessage|default:'Hata Mesajı'}</th>
                        <th style="width:60px;">CNT</th>
                    </tr>
                </thead>
                <tbody>
                    {if $ftp_logs}
                        {foreach from=$ftp_logs item=log}
                            <tr class="log-level-{$log.durum|lower|replace:'ı':'i'}"> {* Basarili, Basarisiz için *}
                                <td>{$log.gonderim_zamani|date_format:"%d.%m.%Y %H:%M:%S"}</td>
                                <td title="{$log.dosya_adi|escape:'html'}">{$log.dosya_adi|escape:'html'|truncate:60:"...":true}</td>
                                <td>{$log.rapor_turu} {if $log.yetki_turu_grup}({$log.yetki_turu_grup|escape:'html'}){/if}</td>
                                <td>{$LANG[$log.ftp_sunucu_tipi|lower ~ 'FtpServerShort']|default:$log.ftp_sunucu_tipi}</td>
                                <td>
                                    {if $log.durum == 'Basarili'}
                                        <span class="label label-success">{$log.durum}</span>
                                    {elseif $log.durum == 'Skipped'}
                                        <span class="label label-info">{$LANG.skipped|default:'Atlandı'}</span>
                                    {else}
                                        <span class="label label-danger" title="{$log.hata_mesaji|escape:'html'}">{$log.durum}</span>
                                    {/if}
                                </td>
                                <td style="word-break: break-all;" title="{$log.hata_mesaji|escape:'html'}">{$log.hata_mesaji|escape:'html'|truncate:100:"...":true|nl2br}</td>
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
         {* FTP Logları Sayfalandırma *}
        {if $total_pages_ftp > 1}
            <nav aria-label="FTP Log Page navigation">
                <ul class="pagination">
                    {if $current_page_ftp > 1}
                        <li><a href="{$modulelink}&action=viewlogs&tab=ftp&pagef={$current_page_ftp-1}&{$pagination_params_ftp}">« {$LANG.previous}</a></li>
                    {else}
                        <li class="disabled"><span>« {$LANG.previous}</span></li>
                    {/if}
                    {for $i=1 to $total_pages_ftp}
                        <li {if $i == $current_page_ftp}class="active"{/if}><a href="{$modulelink}&action=viewlogs&tab=ftp&pagef={$i}&{$pagination_params_ftp}">{$i}</a></li>
                    {/for}
                    {if $current_page_ftp < $total_pages_ftp}
                        <li><a href="{$modulelink}&action=viewlogs&tab=ftp&pagef={$current_page_ftp+1}&{$pagination_params_ftp}">{$LANG.next} »</a></li>
                    {else}
                        <li class="disabled"><span>{$LANG.next} »</span></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </div>
</div>

{* Log seviyelerine göre renklendirme için CSS (btk_admin_style.css'e de taşınabilir) *}
<style type="text/css">
.log-label-hata, .log-label-critical, .log-label-basarisiz { background-color: #d9534f !important; color: white !important; }
.log-label-uyari, .log-label-warning { background-color: #f0ad4e !important; color: white !important; }
.log-label-bi̇lgi̇, .log-label-info { background-color: #5bc0de !important; color: white !important; } /* Türkçe İ için */
.log-label-debug { background-color: #777 !important; color: white !important; }
.log-label-başarili, .log-label-success { background-color: #5cb85c !important; color: white !important; } /* Türkçe ı için */
.log-label-skipped { background-color: #5bc0de !important; color: white !important; }

/* Satır bazlı renklendirme (opsiyonel) */
/*
tr.log-level-hata td, tr.log-level-critical td, tr.log-level-basarisiz td { background-color: #f2dede !important; }
tr.log-level-uyari td, tr.log-level-warning td { background-color: #fcf8e3 !important; }
*/
</style>

<script type="text/javascript">
$(document).ready(function() {
    // DataTables entegrasyonu (opsiyonel, daha gelişmiş filtreleme ve sıralama için)
    // if (typeof $.fn.DataTable == 'function') {
    //     $('#moduleLogsTable').DataTable({"order": [[ 0, "desc" ]], "pageLength": {$log_limit_placeholder|default:50} });
    //     $('#ftpLogsTable').DataTable({"order": [[ 0, "desc" ]], "pageLength": {$ftp_log_limit_placeholder|default:50} });
    // }

    // Tarih seçiciler için (flatpickr veya WHMCS'in kendi datepicker'ı)
    // if (typeof flatpickr !== "undefined") {
    //     $(".btk-datepicker-yyyy-mm-dd").flatpickr({ dateFormat: "Y-m-d", altInput: true, altFormat: "d.m.Y", allowInput: true });
    // }

    // Aktif sekmeyi korumak için (eğer Bootstrap sekmeleri kullanılacaksa)
    // var activeTab = '{$smarty.get.tab|default:"module"}';
    // $('#btkLogsTabs a[href="#' + activeTab + '_logs"]').tab('show');
    // $('.pagination a').click(function(e){
    //     var currentTab = $('.nav-tabs .active a').attr('href').replace('#','').replace('_logs','');
    //     var href = $(this).attr('href');
    //     if (href.indexOf('tab=') === -1) {
    //         $(this).attr('href', href + '&tab=' + currentTab);
    //     }
    // });
});
</script>