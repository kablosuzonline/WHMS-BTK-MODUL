{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    modules/addons/btkreports/templates/admin/index.tpl
    (Nihai Sürüm - btk_page_index() ile tam uyumlu)
*}

{* CSS dosyası admin_header_menu.tpl tarafından yönetiliyor *}
{* Sayfa başlığı ve menü admin_header_menu.tpl tarafından sağlanıyor *}
{* Flash mesajlar admin_header_menu.tpl tarafından sağlanıyor *}

{* Ana Sayfa İçeriği *}
<div class="btk-dashboard">

    {* Bilgi ve Durum Kutuları - 3'lü Grid Yapısı (Bootstrap) *}
    <div class="row">
        {* 1. Kutu: Modül Genel Bilgileri *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle|default:'Modül Bilgileri'}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleDescriptionText|default:'Bu modül, BTK yasal raporlama yükümlülüklerinizi WHMCS üzerinden yönetmenizi sağlar.'}</p>
                    <ul class="list-unstyled">
                        <li><strong>{$LANG.moduleversion|default:'Modül Sürümü'}:</strong> {$module_version_placeholder}</li>
                        <li><strong>{$LANG.dbVersion|default:'Veritabanı Sürümü'}:</strong> {$setting_version_placeholder}</li>
                        <li><strong>{$LANG.developedBy|default:'Geliştiren'}:</strong> {$LANG.developerName|default:'KablosuzOnline & Gemini AI'}</li>
                    </ul>
                    {if $setting_surum_notlari_link_placeholder && $setting_surum_notlari_link_placeholder != '#'}
                    <p class="top-margin-10">
                        <a href="{$setting_surum_notlari_link_placeholder}" class="btn btn-primary btn-sm" target="_blank">
                            <i class="fas fa-file-alt"></i> {$LANG.surumNotlariDetayLink|default:'Tüm Sürüm Notlarını Görüntüle'}
                        </a>
                    </p>
                    {/if}
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
                                <td class="text-right">
                                    {if $ftp_main_status.status == 'success'}
                                        <span class="label label-success" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.aktif}</span>
                                    {elseif $ftp_main_status.status == 'error'}
                                        <span class="label label-danger" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-times-circle"></i> {$LANG.pasif}</span>
                                    {else}
                                         <span class="label label-warning" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-question-circle"></i> {$LANG.bilinmiyor|default:'Bilinmiyor'}</span>
                                    {/if}
                                </td>
                            </tr>
                            {if $settings.backup_ftp_enabled == '1'}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServer|default:'Yedek FTP'}</strong></td>
                                    <td class="text-right">
                                        {if $ftp_backup_status.status == 'success'}
                                            <span class="label label-success" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.aktif}</span>
                                        {elseif $ftp_backup_status.status == 'error'}
                                            <span class="label label-danger" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-times-circle"></i> {$LANG.pasif}</span>
                                        {else}
                                            <span class="label label-warning" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-question-circle"></i> {$LANG.bilinmiyor|default:'Bilinmiyor'}</span>
                                        {/if}
                                    </td>
                                </tr>
                            {else}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServer|default:'Yedek FTP'}</strong></td>
                                    <td class="text-right"><span class="label label-default">{$LANG.ayarlardanEtkinlestirin|default:'Ayarlardan Etkin Değil'}</span></td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                    <p class="small text-muted">{$LANG.ftpStatusNote|default:'FTP bağlantı durumları periyodik olarak kontrol edilir veya ayarlar sayfasından test edilebilir.'}</p>
                    <p class="text-right"><a href="{$modulelink}&action=config" class="btn btn-default btn-xs">{$LANG.goToFtpSettings|default:'FTP Ayarlarına Git'}</a></p>
                </div>
            </div>
        </div>

        {* 3. Kutu: Modül Kullanım Bilgileri *}
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-question-circle"></i> {$LANG.moduleHelpTitle|default:'Modül Kullanım Bilgileri'}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleHelpText1|default:'Modülün doğru çalışması için lütfen öncelikle "Genel Ayarlar" bölümünden gerekli tüm yapılandırmaları yapın.'}</p>
                    <p>{$LANG.moduleHelpText2|default:'Daha sonra "Ürün Grubu Eşleştirme" bölümünden WHMCS ürün gruplarınızı ilgili BTK kategorileri ile eşleştirin.'}</p>
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
                    {if $aktif_yetki_gruplari_for_index|@count > 0}
                        <div class="table-responsive">
                            <table class="table table-striped table-hover table-btk-reports">
                                <thead>
                                    <tr>
                                        <th>{$LANG.yetkiTuruGrubu|default:'Yetki Grubu'}</th>
                                        <th>{$LANG.reportType|default:'Rapor Türü'}</th>
                                        <th>{$LANG.lastSubmissionDate|default:'Son Gönderim'}</th>
                                        <th>{$LANG.lastSubmittedFile|default:'Dosya Adı'}</th>
                                        <th>CNT</th>
                                        <th class="text-center">{$LANG.actions|default:'İşlemler'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foreach from=$aktif_yetki_gruplari_for_index item=grup}
                                        <tr>
                                            <td rowspan="2" style="vertical-align: middle; border-bottom: 2px solid #ddd;"><strong>{$grup|escape:'html'}</strong></td>
                                            <td>{$LANG.reportAboneRehber|default:'ABONE REHBER'}</td>
                                            <td>{$last_submissions[$grup]['REHBER']['tarih_saat']}</td>
                                            <td title="{$last_submissions[$grup]['REHBER']['dosya_adi']|escape:'html'}">{$last_submissions[$grup]['REHBER']['dosya_adi']|truncate:40:"...":true}</td>
                                            <td><span class="label label-default">{$last_submissions[$grup]['REHBER']['cnt']}</span></td>
                                            <td class="text-center">
                                                <a href="{$modulelink}&action=generatereports&report_type=REHBER&yetki_grup={$grup|escape:'url'}" class="btn btn-xs btn-info" title="{$LANG.generateReportTooltip|default:'Bu raporu manuel oluştur/gönder'}">
                                                    <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur'}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr style="border-bottom: 2px solid #ddd;">
                                            <td>{$LANG.reportAboneHareket|default:'ABONE HAREKET'}</td>
                                            <td>{$last_submissions[$grup]['HAREKET']['tarih_saat']}</td>
                                            <td title="{$last_submissions[$grup]['HAREKET']['dosya_adi']|escape:'html'}">{$last_submissions[$grup]['HAREKET']['dosya_adi']|truncate:40:"...":true}</td>
                                            <td><span class="label label-default">{$last_submissions[$grup]['HAREKET']['cnt']}</span></td>
                                            <td class="text-center">
                                                <a href="{$modulelink}&action=generatereports&report_type=HAREKET&yetki_grup={$grup|escape:'url'}" class="btn btn-xs btn-info" title="{$LANG.generateReportTooltip|default:'Bu raporu manuel oluştur/gönder'}">
                                                    <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur'}
                                                </a>
                                            </td>
                                        </tr>
                                    {/foreach}
                                    {* Personel Raporu Ayrı Satırda *}
                                    <tr>
                                        <td><strong>{$LANG.reportPersonelListesi|default:'PERSONEL LİSTESİ'}</strong></td>
                                        <td><em>({$LANG.genelRapor|default:'Genel Rapor'})</em></td>
                                        <td>{$last_submissions.PERSONEL.tarih_saat}</td>
                                        <td title="{$last_submissions.PERSONEL.dosya_adi|escape:'html'}">{$last_submissions.PERSONEL.dosya_adi|truncate:40:"...":true}</td>
                                        <td><span class="label label-default">{$last_submissions.PERSONEL.cnt}</span></td>
                                        <td class="text-center">
                                            <a href="{$modulelink}&action=generatereports&report_type=PERSONEL_LISTESI" class="btn btn-xs btn-info" title="{$LANG.generateReportTooltip|default:'Bu raporu manuel oluştur/gönder'}">
                                                <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur'}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    {else}
                        <p class="text-center">{$LANG.noActiveAuthGroupsForReports|default:'Raporlama için aktif edilmiş BTK Yetki Türü Grubu bulunmamaktadır. Lütfen Genel Ayarlar\'dan seçim yapın.'}</p>
                    {/if}
                    <hr>
                    <h4>{$LANG.nextCronRunsTitle|default:'Sonraki Otomatik Raporlama Zamanları'}</h4>
                    <ul class="list-inline">
                        <li><strong>{$LANG.reportAboneRehber}:</strong> <span class="text-info">{$next_rehber_cron_run}</span></li>
                        <li><strong>{$LANG.reportAboneHareket}:</strong> <span class="text-info">{$next_hareket_cron_run}</span></li>
                        <li><strong>{$LANG.reportPersonelListesi}:</strong> <span class="text-info">{$next_personel_cron_run}</span></li>
                    </ul>
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
    $(document).ready(function() {
        if (typeof $.fn.tooltip == 'function') {
            $('.btk-tooltip').tooltip({
                placement: 'top',
                container: 'body',
                html: true
            });
        }
    });
</script>