{* WHMCS BTK Raporlama Modülü - Manuel Rapor Oluşturma (generate_reports.tpl) - V3.0.0 - Tam Sürüm *}

{if $successmessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successmessage}
    </div>
{/if}
{if $errormessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errormessage}
    </div>
{/if}
{if $infomessage}
    <div class="alert alert-info text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-info-circle"></i> {$infomessage}
    </div>
{/if}

<div class="panel panel-default btk-reports-page" style="margin-top:15px;">
    <div class="panel-heading">
        <h3 class="panel-title" style="margin:0; font-size:16px; font-weight:bold;"><i class="fas fa-file-export"></i> {$_LANG.btk_generate_reports_title|default:"Manuel Rapor Oluşturma ve Gönderme"}</h3>
    </div>
    <div class="panel-body">
        <p>{$_LANG.btk_manual_report_page_desc|default:"Bu bölümden istediğiniz rapor türünü seçerek manuel olarak oluşturabilir ve BTK FTP sunucusuna (ve yapılandırılmışsa yedek FTP'ye) gönderebilirsiniz. Bu işlem, cron zamanlamasını beklemeden anlık raporlama yapmanızı sağlar."}</p>
        <p class="text-warning"><i class="fas fa-exclamation-triangle"></i> {$_LANG.btk_manual_report_warning|default:"Lütfen dikkat: Manuel rapor oluşturma işlemi, özellikle çok sayıda abone veya hareket verisi varsa sunucunuzda ek yük oluşturabilir ve zaman alabilir."}</p>
        <hr>

        <form method="post" action="{$modulelink}&action=do_manual_report_generation" id="manualReportForm" class="form-horizontal">
            <input type="hidden" name="token" value="{$csrfToken}">

            <div class="form-group row">
                <label for="report_type" class="col-sm-3 control-label">{$_LANG.btk_report_type|default:"Rapor Türü"}</label>
                <div class="col-sm-7">
                    <select name="report_type" id="report_type" class="form-control" required>
                        <option value="">{$_LANG.btk_pleaseselectone|default:"Lütfen Seçiniz..."}</option>
                        <option value="ABONE_REHBER">{$_LANG.btk_report_type_rehber|default:"Abone Rehber Raporu"}</option>
                        <option value="ABONE_HAREKET">{$_LANG.btk_report_type_hareket|default:"Abone Hareket Raporu"}</option>
                        <option value="PERSONEL_LISTESI">{$_LANG.btk_report_type_personel|default:"Personel Listesi Raporu"}</option>
                    </select>
                </div>
            </div>

            <div class="form-group row" id="yetkiTipiSelectGroup" style="display:none;">
                <label for="yetki_kodu_report" class="col-sm-3 control-label">{$_LANG.btk_yetki_tipi_for_report|default:"Yetki Tipi (Rapor için)"}</label>
                <div class="col-sm-7">
                    <select name="yetki_kodu_report" id="yetki_kodu_report" class="form-control">
                        <option value="">{$_LANG.btk_yetki_tipi_for_report_all|default:"Tüm Aktif Yetki Tipleri İçin Oluştur"}</option>
                         {foreach from=$yetki_turleri_listesi item=yetki}
                            <option value="{$yetki->btk_dosya_tip_kodu}">{$yetki->yetki_kullanici_adi} ({$yetki->btk_dosya_tip_kodu})</option>
                        {/foreach}
                    </select>
                    <small class="form-text text-muted">{$_LANG.btk_yetki_tipi_for_report_desc|default:"Sadece Abone Rehber ve Abone Hareket raporları için geçerlidir. \"Tüm Aktif Yetki Tipleri İçin Oluştur\" seçilirse, ayarlı ve aktif olan her yetki için ayrı dosya oluşturulur. Personel Listesi için bu alan dikkate alınmaz."}</small>
                </div>
            </div>
            
            <div class="form-group row">
                <div class="col-sm-9 offset-sm-3">
                     <button type="submit" class="btn btn-primary btn-lg" onclick="return confirm('{$_LANG.btk_confirm_manual_report|default:"Seçili rapor(lar)ı şimdi oluşturup FTP\'ye göndermek istediğinizden emin misiniz? Bu işlem biraz zaman alabilir."}');">
                        <i class="fas fa-cogs"></i> {$_LANG.btk_btn_generate_and_send_report|default:"Raporu Oluştur ve Gönder"}
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    $('#report_type').on('change', function() {
        if ($(this).val() === 'ABONE_REHBER' || $(this).val() === 'ABONE_HAREKET') {
            $('#yetkiTipiSelectGroup').slideDown();
            // Yetki kodu seçimi zorunlu değil, boş bırakılırsa tüm yetkiler için çalışır.
            // $('#yetki_kodu_report').prop('required', true); 
        } else {
            $('#yetkiTipiSelectGroup').slideUp();
            // $('#yetki_kodu_report').prop('required', false);
            $('#yetki_kodu_report').val(''); // Personel için yetki seçimi olmamalı
        }
    }).trigger('change'); // Sayfa yüklendiğinde durumu ayarla

    // Tooltip'leri etkinleştir (Bootstrap tooltip'leri için)
    if (typeof $().tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
    }
});
</script>