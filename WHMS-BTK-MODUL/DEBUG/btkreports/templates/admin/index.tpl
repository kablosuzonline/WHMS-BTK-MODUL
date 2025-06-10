{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    modules/addons/btkreports/templates/admin/index.tpl
    (btkreports.php içindeki btk_page_index() fonksiyonu tarafından doldurulur)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">

{if $successMessage}
    <div class="alert alert-success text-center" role="alert">
        <i class="fas fa-check-circle"></i> {$successMessage|nl2br}
    </div>
{/if}
{if $infoMessage}
    <div class="alert alert-info" role="alert">
        <i class="fas fa-info-circle"></i> {$infoMessage|nl2br}
    </div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle"></i> {$errorMessage|nl2br}
    </div>
{/if}

{* Ana Sayfa İçeriği *}
<div class="btk-dashboard">

    {* Bilgi ve Durum Kutuları - 3'lü Grid Yapısı (Bootstrap) *}
    <div class="row">
        {* 1. Kutu: Modül Genel Bilgileri / Sürüm Notları *}
        <div class="col-md-4 col-sm-6">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle|default:'Modül Bilgileri'}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleDescriptionText|default:'Bu modül, BTK yasal raporlama yükümlülüklerinizi WHMCS üzerinden yönetmenizi sağlar.'}</p>
                    <ul class="list-unstyled">
                        <li><strong>{$LANG.moduleversion|default:'Sürüm'}:</strong> {$module_version_placeholder|default:'Bilinmiyor'}</li>
                        <li><strong>{$LANG.developedBy|default:'Geliştiren'}:</strong> {$LANG.developerName|default:'KablosuzOnline & Gemini AI'}</li>
                    </ul>
                    <p class="top-margin-10">
                        <a href="{$setting_surum_notlari_link_placeholder}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-file-alt"></i> {$LANG.surumNotlariDetayLink|default:'Tüm Sürüm Notlarını Görüntüle'}
                        </a>
                    </p>
                </div>
            </div>
        </div>

        {* 2. Kutu: BTK FTP Sunucu Bilgileri / Durumu *}
        <div class="col-md-4 col-sm-6">
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
                                    {if isset($ftp_main_status.status) && $ftp_main_status.status == 'success'}
                                        <span class="label label-success" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.aktif|default:'AKTİF'}</span>
                                    {else}
                                        <span class="label label-danger" title="{$ftp_main_status.message|escape:'html'|default:($LANG.ftpConnectionFailed|default:'Bağlantı Hatası')}"><i class="fas fa-times-circle"></i> {$LANG.pasif|default:'PASİF'}</span>
                                    {/if}
                                </td>
                            </tr>
                            {if isset($settings.backup_ftp_enabled) && $settings.backup_ftp_enabled == '1'}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServer|default:'Yedek FTP'}</strong></td>
                                    <td>
                                        {if isset($ftp_backup_status.status) && $ftp_backup_status.status == 'success'}
                                            <span class="label label-success" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.aktif|default:'AKTİF'}</span>
                                        {else}
                                            <span class="label label-danger" title="{$ftp_backup_status.message|escape:'html'|default:($LANG.ftpConnectionFailed|default:'Bağlantı Hatası')}"><i class="fas fa-times-circle"></i> {$LANG.pasif|default:'PASİF'}</span>
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
        <div class="col-md-4 col-sm-12">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-question-circle"></i> {$LANG.moduleHelpTitle|default:'Modül Kullanım Bilgileri'}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.moduleHelpText1|default:'Modülün doğru çalışması için lütfen öncelikle "Genel Ayarlar" bölümünden gerekli tüm yapılandırmaları yapın.'}</p>
                    <p>{$LANG.moduleHelpText2|default:'Daha sonra "Ürün Grubu - BTK Yetki Eşleştirme" bölümünden WHMCS ürün gruplarınızı ilgili BTK Yetki Türleri ve EK-3 Hizmet Tipleri ile eşleştirin.'}</p>
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
                    {if $aktif_yetki_gruplari_for_index || (isset($last_submissions.PERSONEL) && $last_submissions.PERSONEL.dosya_adi != '-')}
                        <div class="table-responsive">
                            <table class="table table-striped table-hover table-btk-reports">
                                <thead>
                                    <tr>
                                        <th>{$LANG.reportGroupAndType|default:'Rapor Grubu / Türü'}</th>
                                        <th>{$LANG.lastSubmissionDate|default:'Son Gönderim'}</th>
                                        <th>{$LANG.lastSubmittedFile|default:'Dosya Adı'}</th>
                                        <th>CNT</th>
                                        <th>{$LANG.nextCronRun|default:'Sonraki Otomatik Çalışma'}</th>
                                        <th class="text-center">{$LANG.actions|default:'İşlemler'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {if $aktif_yetki_gruplari_for_index}
                                        {foreach $aktif_yetki_gruplari_for_index as $grup}
                                            {assign var="rehberInfo" value=$last_submissions[$grup]['REHBER']|default:['tarih_saat' => ($LANG.notSubmittedYet|default:'-'), 'dosya_adi' => '-', 'cnt' => '-']}
                                            <tr>
                                                <td>{$LANG.reportAboneRehber} ({$grup|escape:'html'})</td>
                                                <td>{$rehberInfo.tarih_saat}</td>
                                                <td title="{$rehberInfo.dosya_adi|escape:'html'}">{$rehberInfo.dosya_adi|truncate:45:"...":true}</td>
                                                <td><span class="label label-default">{$rehberInfo.cnt}</span></td>
                                                <td>{$next_rehber_cron_run|default:'-'}</td>
                                                <td class="text-center">
                                                    <a href="{$modulelink}&action=generatereports&report_type=REHBER&yetki_grup={$grup|escape:'url'}&token={$csrfToken}" class="btn btn-xs btn-info">
                                                        <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur/Gönder'}
                                                    </a>
                                                </td>
                                            </tr>
                                            {assign var="hareketInfo" value=$last_submissions[$grup]['HAREKET']|default:['tarih_saat' => ($LANG.notSubmittedYet|default:'-'), 'dosya_adi' => '-', 'cnt' => '-']}
                                            <tr style="border-bottom: 1px solid #ddd;">
                                                <td>{$LANG.reportAboneHareket} ({$grup|escape:'html'})</td>
                                                <td>{$hareketInfo.tarih_saat}</td>
                                                <td title="{$hareketInfo.dosya_adi|escape:'html'}">{$hareketInfo.dosya_adi|truncate:45:"...":true}</td>
                                                <td><span class="label label-default">{$hareketInfo.cnt}</span></td>
                                                <td>{$next_hareket_cron_run|default:'-'}</td>
                                                <td class="text-center">
                                                    <a href="{$modulelink}&action=generatereports&report_type=HAREKET&yetki_grup={$grup|escape:'url'}&token={$csrfToken}" class="btn btn-xs btn-info">
                                                        <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur/Gönder'}
                                                    </a>
                                                </td>
                                            </tr>
                                        {/foreach}
                                    {/if}
                                    
                                    {assign var="personelInfo" value=$last_submissions.PERSONEL|default:['tarih_saat' => ($LANG.notSubmittedYet|default:'-'), 'dosya_adi' => '-', 'cnt' => '-']}
                                    <tr>
                                        <td>{$LANG.reportPersonelListesi|default:'PERSONEL LİSTESİ'}</td>
                                        <td>{$personelInfo.tarih_saat}</td>
                                        <td title="{$personelInfo.dosya_adi|escape:'html'}">{$personelInfo.dosya_adi|truncate:45:"...":true}</td>
                                        <td><span class="label label-default">{$personelInfo.cnt}</span></td>
                                        <td>{$next_personel_cron_run|default:'-'}</td>
                                        <td class="text-center">
                                            <a href="{$modulelink}&action=generatereports&report_type=PERSONEL&token={$csrfToken}" class="btn btn-xs btn-info">
                                                <i class="fas fa-cogs"></i> {$LANG.generateReport|default:'Oluştur/Gönder'}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    {else}
                        <p class="text-center">{$LANG.noActiveAuthGroupForReports|default:'Raporlama için aktif edilmiş ve ürün grubuyla eşleştirilmiş bir BTK Yetki Türü Grubu bulunmuyor veya henüz hiç başarılı rapor gönderilmemiş.'}</p>
                    {/if}
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