{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    modules/addons/btkreports/templates/admin/index.tpl
    (btkreports.php içindeki btk_page_index() fonksiyonu tarafından doldurulur)
*}

{* Modül CSS dosyası her sayfada çağrılacaksa, ortak bir header.tpl'e taşınabilir *}
{* Ancak şimdilik her .tpl başında çağırıyoruz, menü şablonu da kendi çağırıyor. *}
{* <link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet"> *}
{* JS dosyası genellikle sayfa sonunda veya footer.tpl'de çağrılır *}

{* Sayfa Başlığı - Menü şablonu bunu zaten içeriyor olabilir, duruma göre ayarlanacak *}
{*
<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="{$logo_url}" alt="BTK Modül Logo" style="height: 36px; vertical-align: middle; margin-right: 12px;">
        {$LANG.dashboardtitle|default:'BTK Raporlama Ana Sayfa'}
    </div>
    <div class="btk-header-info">
        <span class="label label-info">{$LANG.moduleversion|default:'Sürüm'}: {$module_version_placeholder}</span>
        <a href="{$setting_surum_notlari_link_placeholder}" target="_blank" class="btn btn-xs btn-default" style="margin-left: 10px;">
            <i class="fas fa-file-alt"></i> {$LANG.surumNotlariLinkText|default:'Sürüm Notları'}
        </a>
    </div>
</div>
*}

{if $successMessage}
    <div class="alert alert-success text-center"><i class="fas fa-check-circle"></i> {$successMessage|nl2br}</div>
{/if}
{if $infoMessage}
    <div class="alert alert-info"><i class="fas fa-info-circle"></i> {$infoMessage|nl2br}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}</div>
{/if}

{* Ana Sayfa İçeriği *}
<div class="btk-dashboard">

    {* Bilgi ve Durum Kutuları - 3'lü Grid Yapısı (Bootstrap) *}
    <div class="row">
        {* 1. Kutu: Modül Genel Bilgileri / Sürüm Notları *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle|default:'Modül Bilgileri'}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleDescriptionText|default:'Bu modül, BTK yasal raporlama yükümlülüklerinizi WHMCS üzerinden yönetmenizi sağlar.'}</p>
                    <ul class="list-unstyled">
                        <li><strong>{$LANG.moduleversion|default:'Sürüm'}:</strong> {$module_version_placeholder}</li>
                        <li><strong>{$LANG.developedBy|default:'Geliştiren'}:</strong> {$LANG.developerName|default:'KablosuzOnline & Gemini AI'}</li>
                    </ul>
                    <p class="top-margin-10">
                        <a href="{$setting_surum_notlari_link_placeholder}" class="btn btn-primary btn-sm" target="_blank">
                            <i class="fas fa-file-alt"></i> {$LANG.surumNotlariDetayLink|default:'Tüm Sürüm Notlarını Görüntüle'}
                        </a>
                    </p>
                </div>
            </div>
        </div>

        {* 2. Kutu: BTK FTP Sunucu Bilgileri / Durumu *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.ftpServerStatusTitle|default:'FTP Sunucu Durumları'}</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-btk-status">
                        <tbody>
                            <tr>
                                <td><strong>{$LANG.mainFtpServer|default:'Ana BTK FTP'}</strong></td>
                                <td>
                                    {if $ftp_main_status.status == 'success'}
                                        <span class="label label-success" title="{$ftp_main_status.message|escape}"><i class="fas fa-check-circle"></i> {$LANG.aktif}</span>
                                    {else}
                                        <span class="label label-danger" title="{$ftp_main_status.message|escape}"><i class="fas fa-times-circle"></i> {$LANG.pasif}</span>
                                    {/if}
                                </td>
                            </tr>
                            {if $settings.backup_ftp_enabled == '1'}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServer|default:'Yedek FTP'}</strong></td>
                                    <td>
                                        {if $ftp_backup_status.status == 'success'}
                                            <span class="label label-success" title="{$ftp_backup_status.message|escape}"><i class="fas fa-check-circle"></i> {$LANG.aktif}</span>
                                        {else}
                                            <span class="label label-danger" title="{$ftp_backup_status.message|escape}"><i class="fas fa-times-circle"></i> {$LANG.pasif}</span>
                                        {/if}
                                    </td>
                                </tr>
                            {else}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServer|default:'Yedek FTP'}</strong></td>
                                    <td><span class="label label-default">{$LANG.pasif} ({$LANG.ayarlardanEtkinlestirin|default:'Ayarlardan Etkin Değil'})</span></td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                    <p class="small text-muted">{$LANG.ftpStatusNote|default:'FTP bağlantı durumları periyodik olarak kontrol edilir veya ayarlar sayfasından test edilebilir.'}</p>
                    <p class="text-right"><a href="{$modulelink}&action=config#ftpSettingsTab" class="btn btn-default btn-xs">{$LANG.goToFtpSettings|default:'FTP Ayarlarına Git'}</a></p>
                </div>
            </div>
        </div>

        {* 3. Kutu: BTK Sunucularına Veri Gönderim Modülü Hakkında Yardım ve Bilgilendirme *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-question-circle"></i> {$LANG.moduleHelpTitle|default:'Modül Kullanım Bilgileri'}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleHelpText1|default:'Modülün doğru çalışması için lütfen öncelikle "Genel Ayarlar" bölümünden gerekli tüm yapılandırmaları yapın.'}</p>
                    <p>{$LANG.moduleHelpText2|default:'Daha sonra "Ürün Grubu - BTK Yetki Eşleştirme" bölümünden WHMCS ürün gruplarınızı ilgili BTK kategorileri ile eşleştirin.'}</p>
                    <p class="small text-muted">{$LANG.moduleHelpText3|default:'Müşteri ve hizmet bazlı BTK verilerini, ilgili müşteri özet sayfasındaki "BTK Bilgileri" sekmesinden ve hizmet detay sayfasındaki "BTK Hizmet Bilgileri" bölümünden yönetebilirsiniz.'}</p>
                </div>
            </div>
        </div>
    </div>

    {* Son Rapor Gönderim Bilgileri ve Manuel Tetikleme - Yeni Satır *}
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-paper-plane"></i> {$LANG.lastReportSubmissions|default:'Son Başarılı Rapor Gönderimleri (Ana FTP)'}</h3>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover table-btk-reports">
                            <thead>
                                <tr>
                                    <th>{$LANG.reportType|default:'Rapor Türü'}</th>
                                    <th>{$LANG.lastSubmissionDate|default:'Son Gönderim'}</th>
                                    <th>{$LANG.lastSubmittedFile|default:'Dosya Adı'}</th>
                                    <th>CNT</th>
                                    <th>{$LANG.nextCronRun|default:'Sonraki Otomatik Çalışma'}</th>
                                    <th class="text-center">{$LANG.actions|default:'İşlemler'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{$LANG.reportAboneRehber|default:'ABONE REHBER'}</td>
                                    <td>{$last_rehber_info.tarih_saat}</td>
                                    <td title="{$last_rehber_info.dosya_adi|escape}">{$last_rehber_info.dosya_adi|truncate:50:"...":true}</td>
                                    <td><span class="label label-default">{$last_rehber_info.cnt}</span></td>
                                    <td>{$next_rehber_cron_run}</td>
                                    <td class="text-center">
                                        <a href="{$modulelink}&action=generatereports&report_type=rehber" class="btn btn-xs btn-info">
                                            <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur/Gönder'}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{$LANG.reportAboneHareket|default:'ABONE HAREKET'}</td>
                                    <td>{$last_hareket_info.tarih_saat}</td>
                                    <td title="{$last_hareket_info.dosya_adi|escape}">{$last_hareket_info.dosya_adi|truncate:50:"...":true}</td>
                                    <td><span class="label label-default">{$last_hareket_info.cnt}</span></td>
                                    <td>{$next_hareket_cron_run}</td>
                                    <td class="text-center">
                                        <a href="{$modulelink}&action=generatereports&report_type=hareket" class="btn btn-xs btn-info">
                                            <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur/Gönder'}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{$LANG.reportPersonelListesi|default:'PERSONEL LİSTESİ'}</td>
                                    <td>{$last_personel_info.tarih_saat}</td>
                                    <td title="{$last_personel_info.dosya_adi|escape}">{$last_personel_info.dosya_adi|truncate:50:"...":true}</td>
                                    <td><span class="label label-default">{$last_personel_info.cnt}</span></td>
                                    <td>{$next_personel_cron_run}</td>
                                    <td class="text-center">
                                        <a href="{$modulelink}&action=generatereports&report_type=personel" class="btn btn-xs btn-info">
                                            <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur/Gönder'}
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="text-right top-margin-10">
                        <a href="{$modulelink}&action=generatereports" class="btn btn-primary">
                            <i class="fas fa-rocket"></i> {$LANG.goToGenerateReportsPage|default:'Tüm Manuel Rapor İşlemleri'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    // Bu sayfaya özel JS kodları gerekirse buraya veya btk_admin_scripts.js'ye eklenebilir.
    $(document).ready(function() {
        // console.log("BTK Modül Ana Sayfası yüklendi ve scriptler çalışıyor.");
        // Tooltip'leri etkinleştir (eğer btk_admin_scripts.js içinde genel olarak yapılmadıysa)
        if (typeof $.fn.tooltip == 'function') {
            $('.btk-tooltip').tooltip({
                placement: 'top',
                container: 'body'
            });
        }
    });
</script>