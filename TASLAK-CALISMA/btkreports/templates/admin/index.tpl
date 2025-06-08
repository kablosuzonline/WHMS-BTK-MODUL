{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    modules/addons/btkreports/templates/admin/index.tpl
*}

{* Modül CSS ve JS dosyalarını dahil et - Alternatif olarak _output içinde $headoutput/$footeroutput ile eklenebilir *}
<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
<script src="{$assets_url}/js/btk_admin_scripts.js?v={$setting_version_placeholder}"></script>

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.dashboardtitle}
    </div>
    <div class="btk-header-info">
        <span class="label label-info">{$LANG.moduleversion}: {$module_version_placeholder}</span>
        <a href="{$setting_surum_notlari_link_placeholder}" target="_blank" class="btn btn-xs btn-default" style="margin-left: 10px;">
            <i class="fas fa-file-alt"></i> {$LANG.surumNotlariLinkText}
        </a>
    </div>
</div>

{* Ana Sayfa İçeriği *}
<div class="btk-dashboard">

    {* Bilgi ve Durum Kutuları - 3'lü Grid Yapısı (Bootstrap) *}
    <div class="row">
        {* 1. Kutu: Modül Genel Bilgileri / Sürüm Notları *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleDescriptionText}</p>
                    <ul>
                        <li><strong>{$LANG.moduleversion}:</strong> {$module_version_placeholder}</li>
                        <li><strong>{$LANG.developedBy}:</strong> {$LANG.developerName}</li>
                    </ul>
                    <p><a href="{$setting_surum_notlari_link_placeholder}" class="btn btn-primary btn-sm" target="_blank">
                        <i class="fas fa-file-alt"></i> {$LANG.surumNotlariDetayLink}
                    </a></p>
                </div>
            </div>
        </div>

        {* 2. Kutu: BTK FTP Sunucu Bilgileri / Durumu *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.ftpServerStatusTitle}</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-btk-status">
                        <tbody>
                            <tr>
                                <td><strong>{$LANG.mainFtpServer}</strong></td>
                                <td>
                                    {if $ftp_main_status.status == 'success'}
                                        <span class="label label-success"><i class="fas fa-check-circle"></i> {$LANG.aktif}</span>
                                    {else}
                                        <span class="label label-danger" title="{$ftp_main_status.message|escape}"><i class="fas fa-times-circle"></i> {$LANG.pasif}</span>
                                    {/if}
                                </td>
                            </tr>
                            {if $settings.backup_ftp_enabled == '1'}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServer}</strong></td>
                                    <td>
                                        {if $ftp_backup_status.status == 'success'}
                                            <span class="label label-success"><i class="fas fa-check-circle"></i> {$LANG.aktif}</span>
                                        {else}
                                            <span class="label label-danger" title="{$ftp_backup_status.message|escape}"><i class="fas fa-times-circle"></i> {$LANG.pasif}</span>
                                        {/if}
                                    </td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                    <p class="small text-muted">{$LANG.ftpStatusNote}</p>
                </div>
            </div>
        </div>

        {* 3. Kutu: BTK Sunucularına Veri Gönderim Modülü Hakkında Yardım ve Bilgilendirme *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-question-circle"></i> {$LANG.moduleHelpTitle}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleHelpText1}</p>
                    <p>{$LANG.moduleHelpText2}</p>
                    <p>{$LANG.moduleHelpText3}</p>
                </div>
            </div>
        </div>
    </div>

    {* Son Rapor Gönderim Bilgileri ve Manuel Tetikleme - Yeni Satır *}
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-paper-plane"></i> {$LANG.lastReportSubmissions}</h3>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-btk-reports">
                            <thead>
                                <tr>
                                    <th>{$LANG.reportType}</th>
                                    <th>{$LANG.lastSubmissionDate}</th>
                                    <th>{$LANG.lastSubmittedFile}</th>
                                    <th>{$LANG.nextCronRun}</th>
                                    <th>{$LANG.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{$LANG.reportAboneRehber}</td>
                                    <td>{$last_rehber_info.tarih_saat_placeholder|default:$LANG.notSubmittedYet}</td>
                                    <td>{$last_rehber_info.dosya_adi_placeholder|default:'-'}</td>
                                    <td>{$next_rehber_cron_run_placeholder|default:'-'}</td>
                                    <td>
                                        <a href="{$modulelink}&action=generatereports&report_type=rehber" class="btn btn-xs btn-info">
                                            <i class="fas fa-cogs"></i> {$LANG.generateReport}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{$LANG.reportAboneHareket}</td>
                                    <td>{$last_hareket_info.tarih_saat_placeholder|default:$LANG.notSubmittedYet}</td>
                                    <td>{$last_hareket_info.dosya_adi_placeholder|default:'-'}</td>
                                    <td>{$next_hareket_cron_run_placeholder|default:'-'}</td>
                                    <td>
                                        <a href="{$modulelink}&action=generatereports&report_type=hareket" class="btn btn-xs btn-info">
                                            <i class="fas fa-cogs"></i> {$LANG.generateReport}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{$LANG.reportPersonelListesi}</td>
                                    <td>{$last_personel_info.tarih_saat_placeholder|default:$LANG.notSubmittedYet}</td>
                                    <td>{$last_personel_info.dosya_adi_placeholder|default:'-'}</td>
                                    <td>{$next_personel_cron_run_placeholder|default:'-'}</td>
                                    <td>
                                        <a href="{$modulelink}&action=generatereports&report_type=personel" class="btn btn-xs btn-info">
                                            <i class="fas fa-cogs"></i> {$LANG.generateReport}
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-right">
                        <a href="{$modulelink}&action=generatereports" class="btn btn-primary">
                            <i class="fas fa-rocket"></i> {$LANG.goToGenerateReportsPage}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>

    {* Hızlı Erişim Linkleri / İstatistikler vb. için ek bir satır eklenebilir *}
    {*
    <div class="row">
        <div class="col-md-6">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading"><h3 class="panel-title">Hızlı Erişim</h3></div>
                <div class="panel-body">
                    <a href="{$modulelink}&action=config" class="btn btn-default"><i class="fas fa-cog"></i> {$LANG.goToConfig}</a>
                    <a href="{$modulelink}&action=viewlogs" class="btn btn-default"><i class="fas fa-history"></i> {$LANG.goToLogs}</a>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading"><h3 class="panel-title">İstatistikler (Örnek)</h3></div>
                <div class="panel-body">
                    <p>Toplam Aktif Abone (Rehber): {$stats_aktif_abone_placeholder}</p>
                    <p>Bugünkü Hareket Sayısı: {$stats_bugunku_hareket_placeholder}</p>
                </div>
            </div>
        </div>
    </div>
    *}
</div>

{* Bu modül için özel stil ve script'ler (sayfa yüklendikten sonra çalışacak) *}
<script type="text/javascript">
    // Gerekirse bu sayfaya özel jQuery/Javascript kodları buraya eklenebilir.
    // Örneğin, FTP durumunu periyodik olarak AJAX ile yenilemek gibi.
    $(document).ready(function() {
        // console.log("BTK Modül Ana Sayfası Yüklendi.");
    });
</script>