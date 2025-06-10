{*
    WHMCS BTK Raporlama Modülü - Manuel Rapor Oluşturma ve Gönderme Şablonu
    modules/addons/btkreports/templates/admin/generate_reports.tpl
    Bu şablon, btkreports.php içindeki btk_page_generate_reports() fonksiyonu tarafından doldurulur.
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Date range picker için CSS dosyası gerekirse buraya eklenebilir *}
{* <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" /> *}

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
        <h3 class="panel-title"><i class="fas fa-cogs"></i> {$LANG.selectReportAndAction|default:'Rapor Türü Seçin ve İşlemi Başlatın'}</h3>
    </div>
    <div class="panel-body">
        <form method="post" action="{$modulelink}&action=do_generate_report" id="generateReportForm">
            <input type="hidden" name="token" value="{$csrfToken}">
            <div class="row">
                <div class="col-md-3 form-group">
                    <label for="report_type_select">{$LANG.reportType|default:'Rapor Türü'}</label>
                    <select name="report_type" id="report_type_select" class="form-control">
                        <option value="REHBER">{$LANG.reportAboneRehber|default:'ABONE REHBER'}</option>
                        <option value="HAREKET">{$LANG.reportAboneHareket|default:'ABONE HAREKET'}</option>
                        <option value="PERSONEL">{$LANG.reportPersonelListesi|default:'PERSONEL LİSTESİ'}</option>
                    </select>
                </div>

                <div class="col-md-3 form-group" id="yetki_grup_selector_div_manual">
                    <label for="yetki_grup_manual">{$LANG.yetkiTuruGrubu|default:'Yetki Türü Grubu (Tip)'}</label>
                    <select name="yetki_grup" id="yetki_grup_manual" class="form-control">
                        <option value="ALL_ACTIVE_GROUPS">-- {$LANG.allActiveGroups|default:'Tüm Aktif Gruplar İçin Tek Tek'} --</option>
                        {if $aktif_yetki_gruplari}
                            {foreach from=$aktif_yetki_gruplari item=grup_details key=grup_kodu}
                                <option value="{$grup_kodu|escape:'html'}">{$grup_kodu|escape:'html'} 
                                    ({foreach $grup_details as $detay}{$detay.ad|escape:'html'}{if !$detay@last}, {/if}{/foreach})
                                </option>
                            {/foreach}
                        {else}
                             <option value="" disabled>{$LANG.noActiveAuthGroupForSelection|default:'Seçilecek aktif yetki grubu yok.'}</option>
                        {/if}
                    </select>
                    <span class="help-block">{$LANG.yetkiGrupSecimNotu|default:"Personel raporu için bu alan dikkate alınmaz."}</span>
                </div>

                <div class="col-md-3 form-group">
                    <label for="ftp_target_select">{$LANG.ftpTarget|default:'FTP Hedefi'}</label>
                    <select name="ftp_target" id="ftp_target_select" class="form-control">
                        <option value="main">{$LANG.mainFtpServer|default:'Ana BTK FTP'}</option>
                        {if isset($settings.backup_ftp_enabled) && $settings.backup_ftp_enabled == '1'}
                        <option value="backup">{$LANG.backupFtpServer|default:'Yedek FTP'}</option>
                        <option value="both">{$LANG.bothFtpServers|default:'Her İki FTP Sunucusu Birden'}</option>
                        {/if}
                        <option value="none">{$LANG.ftpDoNotSend|default:'FTP\'ye Gönderme (Sadece Oluştur ve İndir)'}</option>
                    </select>
                </div>
                <div class="col-md-3 form-group">
                    <label for="cnt_override_manual">{$LANG.cntOverride|default:'CNT Değeri (Opsiyonel)'}</label>
                    <input type="text" name="cnt_override" id="cnt_override_manual" class="form-control" placeholder="Örn: 02" maxlength="2">
                    <span class="help-block">{$LANG.cntOverrideDesc|default:"BTK'nın özel talebiyle belirli bir CNT ile göndermek için. Normalde boş bırakın (yeni rapor için '01' kullanılır)."}</span>
                </div>
            </div>

            {* İleride eklenebilecek ek filtreler: Tarih Aralığı (özellikle Hareket Raporu için), Müşteri ID vb. *}
            {*
            <div class="row top-margin-10" id="hareket_report_filters_div" style="display:none;">
                <div class="col-md-4 form-group">
                    <label for="hareket_date_range">{$LANG.dateRangeForHareket|default:'Hareket Tarih Aralığı'}</label>
                    <input type="text" name="hareket_date_range" id="hareket_date_range" class="form-control btk-daterangepicker" placeholder="YYYY-MM-DD - YYYY-MM-DD">
                </div>
            </div>
            *}

            <div class="text-center top-margin-20">
                <button type="submit" class="btn btn-primary btn-lg" id="btnGenerateReport">
                    <i class="fas fa-rocket"></i> {$LANG.generateAndSendReport|default:'Raporu Oluştur ve Gönder'}
                </button>
                <button type="button" class="btn btn-warning btn-lg" id="btnGenerateAndDownloadReport" style="margin-left:10px;">
                    <i class="fas fa-download"></i> {$LANG.generateAndDownloadReport|default:'Oluştur ve Tarayıcıya İndir (FTP Yok)'}
                </button>
            </div>
        </form>
    </div>
</div>

<div class="btk-widget top-margin-20" id="reportGenerationResult" style="display:none;">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-clipboard-list"></i> {$LANG.reportGenerationResultTitle|default:'Rapor Oluşturma Sonucu'}</h3>
    </div>
    <div class="panel-body">
        <div id="reportResultContent" class="alert"></div>
        <div id="downloadLinkContainer" style="display:none;">
            <a href="#" id="generatedFileDownloadLink" class="btn btn-success" target="_blank">
                <i class="fas fa-file-archive"></i> {$LANG.downloadGeneratedFile|default:'Oluşturulan Dosyayı İndir'}
            </a>
        </div>
    </div>
</div>


{* Yedek FTP'den Eski Raporları Yeniden Gönderme Bölümü (İleri Aşama) *}
<div class="btk-widget top-margin-20">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-history"></i> {$LANG.resendOldReportTitle|default:'Yedek FTP\'den Eski Raporu Yeniden Gönder'}</h3>
    </div>
    <div class="panel-body">
        <p class="text-muted">{$LANG.resendOldReportDesc|default:'Bu özellik, daha önce yedek FTP sunucusuna gönderilmiş bir raporu, dosya adındaki CNT değerini bir artırarak Ana BTK FTP sunucusuna yeniden göndermenizi sağlar. (Bu özellik geliştirme aşamasındadır).'}</p>
        {*
        <form method="post" action="{$modulelink}&action=do_resend_report_from_backup">
            <input type="hidden" name="token" value="{$csrfToken}">
            // Form elemanları buraya gelecek (rapor türü, dosya arama, tarih aralığı vb.)
        </form>
        <div id="backup_ftp_search_results"></div>
        *}
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    // Rapor türü değiştikçe Yetki Grubu seçicisini göster/gizle
    function toggleYetkiGrupSelectorManual() {
        var selectedReportType = $('#report_type_select').val();
        if (selectedReportType === 'PERSONEL') {
            $('#yetki_grup_selector_div_manual').slideUp('fast');
            $('#yetki_grup_manual').prop('disabled', true);
        } else {
            $('#yetki_grup_selector_div_manual').slideDown('fast');
            $('#yetki_grup_manual').prop('disabled', false);
        }
        // Hareket raporu için tarih aralığı filtresini göster/gizle (ileride)
        // if (selectedReportType === 'HAREKET') {
        //     $('#hareket_report_filters_div').slideDown('fast');
        // } else {
        //     $('#hareket_report_filters_div').slideUp('fast');
        // }
    }
    toggleYetkiGrupSelectorManual(); // Sayfa yüklendiğinde
    $('#report_type_select').change(toggleYetkiGrupSelectorManual);

    // "Oluştur ve İndir" butonu için FTP hedefini "none" yap
    $('#btnGenerateAndDownloadReport').click(function(e){
        e.preventDefault();
        $('#ftp_target_select').val('none'); // FTP hedefini "none" yap
        $('#generateReportForm').submit(); // Formu normal şekilde gönder
    });

    // Form gönderimi ve AJAX ile sonuç gösterme (İleri aşamada eklenecek)
    // $('#generateReportForm').submit(function(e) {
    //     e.preventDefault();
    //     var formData = $(this).serialize();
    //     var resultDiv = $('#reportResultContent');
    //     var downloadContainer = $('#downloadLinkContainer');
    //     var downloadLink = $('#generatedFileDownloadLink');
    //
    //     resultDiv.removeClass('alert-success alert-danger alert-info').html('<i class="fas fa-spinner fa-spin"></i> Rapor oluşturuluyor ve gönderiliyor...').addClass('alert-info').parent().show();
    //     downloadContainer.hide();
    //
    //     $.ajax({
    //         url: $(this).attr('action'),
    //         type: 'POST',
    //         data: formData,
    //         dataType: 'json',
    //         success: function(response) {
    //             if (response && response.type === 'success') {
    //                 resultDiv.removeClass('alert-info alert-danger').addClass('alert-success').html('<i class="fas fa-check-circle"></i> ' + response.message.escape());
    //                 if (response.download_url) {
    //                     downloadLink.attr('href', response.download_url);
    //                     downloadContainer.show();
    //                 }
    //             } else {
    //                 resultDiv.removeClass('alert-info alert-success').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + (response.message ? response.message.escape() : 'Bilinmeyen bir hata oluştu.'));
    //             }
    //         },
    //         error: function() {
    //             resultDiv.removeClass('alert-info alert-success').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> Sunucuya ulaşılamadı veya bir AJAX hatası oluştu.');
    //         }
    //     });
    // });

    // Tooltip'leri etkinleştir
    if (typeof $.fn.tooltip == 'function') {
        $('.btk-tooltip').tooltip({ placement: 'top', container: 'body', html: true });
    }

    // Daterangepicker (eğer kullanılacaksa)
    // if (typeof $.fn.daterangepicker == 'function') {
    //     $('.btk-daterangepicker').daterangepicker({
    //         autoUpdateInput: false,
    //         locale: { cancelLabel: 'Temizle', applyLabel: 'Uygula', format: 'YYYY-MM-DD' }
    //     }).on('apply.daterangepicker', function(ev, picker) {
    //         $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    //     }).on('cancel.daterangepicker', function(ev, picker) {
    //         $(this).val('');
    //     });
    // }
});
// Basit HTML escape fonksiyonu (eğer btk_admin_scripts.js'de genel olarak yoksa)
if (typeof String.prototype.escape !== 'function') {
    String.prototype.escape = function() { var tagsToReplace = { '&': '&', '<': '<', '>': '>' }; return this.replace(/[&<>]/g, function(tag) { return tagsToReplace[tag] || tag; }); };
}
</script>