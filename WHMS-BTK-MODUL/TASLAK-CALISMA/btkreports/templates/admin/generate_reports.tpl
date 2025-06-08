{*
    WHMCS BTK Raporlama Modülü - Manuel Rapor Oluşturma ve Gönderme Şablonu
    modules/addons/btkreports/templates/admin/generate_reports.tpl
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.generatereportstitle|default:'Manuel Rapor Oluşturma ve Gönderme'}
    </div>
</div>

{if $successMessage}
    <div class="alert alert-success text-center"><i class="fas fa-check-circle"></i> {$successMessage}</div>
{/if}
{if $infoMessage}
    <div class="alert alert-info"><i class="fas fa-info-circle"></i> {$infoMessage}</div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger"><i class="fas fa-exclamation-triangle"></i> {$errorMessage}</div>
{/if}

<div class="btk-widget">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-cogs"></i> {$LANG.selectReportAndAction|default:'Rapor Türü Seçin ve İşlemi Başlatın'}</h3>
    </div>
    <div class="panel-body">
        <form method="post" action="{$modulelink}&action=do_generate_report" id="generateReportForm">
            {* CSRF Token eklenebilir *}
            <div class="row">
                <div class="col-md-4 form-group">
                    <label for="report_type">{$LANG.reportType|default:'Rapor Türü'}</label>
                    <select name="report_type" id="report_type" class="form-control">
                        <option value="rehber">{$LANG.reportAboneRehber|default:'ABONE REHBER'}</option>
                        <option value="hareket">{$LANG.reportAboneHareket|default:'ABONE HAREKET'}</option>
                        <option value="personel">{$LANG.reportPersonelListesi|default:'PERSONEL LİSTESİ'}</option>
                    </select>
                </div>

                {* ABONE REHBER ve ABONE HAREKET için Yetki Türü Grubu Seçimi *}
                <div class="col-md-4 form-group" id="yetki_grup_selector_div" style="display:none;">
                    <label for="yetki_grup">{$LANG.yetkiTuruGrubu|default:'Yetki Türü Grubu'}</label>
                    <select name="yetki_grup" id="yetki_grup" class="form-control">
                        <option value="">{$LANG.allActiveGroups|default:'Tüm Aktif Gruplar İçin Tek Tek'}</option>
                        {* Burası PHP tarafında aktif yetki gruplarıyla doldurulacak *}
                        {foreach from=$aktif_yetki_gruplari item=grup}
                            <option value="{$grup.kod|escape}">{$grup.ad|escape}</option>
                        {/foreach}
                    </select>
                    <span class="help-block">{$LANG.yetkiGrupSecimNotu|default:"Personel raporu için bu alan dikkate alınmaz."}</span>
                </div>

                <div class="col-md-4 form-group">
                    <label for="ftp_target">{$LANG.ftpTarget|default:'FTP Hedefi'}</label>
                    <select name="ftp_target" id="ftp_target" class="form-control">
                        <option value="main">{$LANG.mainFtpServer|default:'Ana BTK FTP'}</option>
                        {if $settings.backup_ftp_enabled == '1'}
                        <option value="backup">{$LANG.backupFtpServer|default:'Yedek FTP'}</option>
                        <option value="both">{$LANG.bothFtpServers|default:'Her İki FTP Sunucusu Birden'}</option>
                        {/if}
                        <option value="none">{$LANG.ftpDoNotSend|default:'FTPye Gönderme (Sadece Oluştur)'}</option>
                    </select>
                </div>
            </div>

            <div class="row top-margin-10">
                <div class="col-md-4 form-group">
                    <label for="cnt_override">{$LANG.cntOverride|default:'CNT Değeri (Opsiyonel)'}</label>
                    <input type="text" name="cnt_override" id="cnt_override" class="form-control" placeholder="Örn: 02 (Boş bırakılırsa otomatik)">
                    <span class="help-block">{$LANG.cntOverrideDesc|default:"BTK'nın özel talebiyle belirli bir CNT ile göndermek için. Normalde boş bırakın."}</span>
                </div>
                {* Belirli bir tarih aralığı için hareket raporu gibi opsiyonlar eklenebilir *}
            </div>

            <div class="text-center top-margin-20">
                <button type="submit" class="btn btn-primary btn-lg" onclick="return confirm('{$LANG.generateReportConfirm|default:\'Seçili rapor(lar) oluşturulup FTP\'ye gönderilsin mi?\'}');">
                    <i class="fas fa-rocket"></i> {$LANG.generateAndSendReport|default:'Raporu Oluştur ve Gönder'}
                </button>
            </div>
        </form>
    </div>
</div>

{* Yedek FTP'den Eski Raporları Yeniden Gönderme Bölümü (İleri Aşama) *}
<div class="btk-widget top-margin-20">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-history"></i> {$LANG.resendOldReportTitle|default:'Yedek FTP\'den Eski Raporu Yeniden Gönder'}</h3>
    </div>
    <div class="panel-body">
        <p>{$LANG.resendOldReportDesc|default:'Bu özellik, daha önce yedek FTP sunucusuna gönderilmiş bir raporu, dosya adındaki CNT değerini bir artırarak Ana BTK FTP sunucusuna yeniden göndermenizi sağlar. (İleri aşamada geliştirilecektir).'}</p>
        {*
        <form method="post" action="{$modulelink}&action=do_resend_report">
            <div class="row">
                <div class="col-md-3 form-group">
                    <label for="resend_report_type">{$LANG.reportType}</label>
                    <select name="resend_report_type" id="resend_report_type" class="form-control">
                        <option value="rehber">{$LANG.reportAboneRehber}</option>
                        <option value="hareket">{$LANG.reportAboneHareket}</option>
                        <option value="personel">{$LANG.reportPersonelListesi}</option>
                    </select>
                </div>
                <div class="col-md-4 form-group">
                    <label for="resend_filename_search">{$LANG.filenameSearch|default:'Dosya Adında Ara'}</label>
                    <input type="text" name="resend_filename_search" id="resend_filename_search" class="form-control" placeholder="Örn: REHBER_202301">
                </div>
                <div class="col-md-3 form-group">
                    <label for="resend_date_range">{$LANG.dateRange|default:'Tarih Aralığı'}</label>
                    <input type="text" name="resend_date_range" id="resend_date_range" class="form-control daterangepicker" placeholder="Tarih Aralığı Seçin">
                </div>
                <div class="col-md-2 form-group">
                    <label> </label>
                    <button type="button" class="btn btn-info btn-block" id="search_backup_ftp_btn">{$LANG.searchInBackup|default:'Yedekte Ara'}</button>
                </div>
            </div>
            <div id="backup_ftp_search_results">
                {* AJAX ile arama sonuçları buraya gelecek *}
            </div>
        </form>
        *}
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    function toggleYetkiGrupSelector() {
        if ($('#report_type').val() === 'personel') {
            $('#yetki_grup_selector_div').slideUp('fast');
            $('#yetki_grup').prop('disabled', true);
        } else {
            $('#yetki_grup_selector_div').slideDown('fast');
            $('#yetki_grup').prop('disabled', false);
        }
    }
    toggleYetkiGrupSelector(); // Sayfa yüklendiğinde kontrol et
    $('#report_type').change(toggleYetkiGrupSelector);

    // Date range picker için (eğer WHMCS admin teması veya harici bir kütüphane ile destekleniyorsa)
    // if (typeof $.fn.daterangepicker == 'function') {
    //     $('.daterangepicker').daterangepicker({
    //         autoUpdateInput: false,
    //         locale: { cancelLabel: 'Clear' }
    //     });
    //     $('.daterangepicker').on('apply.daterangepicker', function(ev, picker) {
    //         $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    //     });
    //     $('.daterangepicker').on('cancel.daterangepicker', function(ev, picker) {
    //         $(this).val('');
    //     });
    // }
});
</script>