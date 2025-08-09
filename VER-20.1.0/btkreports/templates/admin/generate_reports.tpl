{*
    WHMCS BTK Raporlama Modülü - Manuel Rapor Oluşturma Sayfası
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-generate-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.generateReportsIntro}</p>

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingRehber">
            <h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseRehber" aria-expanded="true" aria-controls="collapseRehber"><i class="fas fa-address-book"></i> {$LANG.generateRehberReportTitle}</a></h4>
        </div>
        <div id="collapseRehber" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingRehber">
            <div class="panel-body">
                {foreach from=$activeBtkAuthTypesForReports item=yetki}
                    <div class="row" style="margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                        <div class="col-md-4" style="padding-top: 5px;"><strong>{$yetki.yetki_adi} ({$yetki.grup})</strong></div>
                        <div class="col-md-8 text-right">
                            <button class="btn btn-primary btn-generate-report" data-report-type="REHBER" data-yetki-grup="{$yetki.grup}" data-action="generate_only"><i class="fas fa-download"></i> {$LANG.generateOnlyButton}</button>
                            <button class="btn btn-info btn-generate-report" data-report-type="REHBER" data-yetki-grup="{$yetki.grup}" data-action="send_main"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                            <button class="btn btn-warning btn-generate-report" data-report-type="REHBER" data-yetki-grup="{$yetki.grup}" data-action="send_backup"><i class="fas fa-hdd"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                        </div>
                        <div class="col-xs-12">
                            <div id="result-REHBER-{$yetki.grup}" class="alert" style="display: none; margin-top: 10px;"></div>
                        </div>
                    </div>
                {foreachelse}
                    <div class="alert alert-warning text-center">{$LANG.noActiveAuthTypesForMapping}</div>
                {/foreach}
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingHareket">
            <h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseHareket" aria-expanded="false" aria-controls="collapseHareket"><i class="fas fa-exchange-alt"></i> {$LANG.generateHareketReportTitle}</a></h4>
        </div>
        <div id="collapseHareket" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingHareket">
             <div class="panel-body">
                {foreach from=$activeBtkAuthTypesForReports item=yetki}
                     <div class="row" style="margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                        <div class="col-md-4" style="padding-top: 5px;"><strong>{$yetki.yetki_adi} ({$yetki.grup})</strong></div>
                        <div class="col-md-8 text-right">
                            <button class="btn btn-primary btn-generate-report" data-report-type="HAREKET" data-yetki-grup="{$yetki.grup}" data-action="generate_only"><i class="fas fa-download"></i> {$LANG.generateOnlyButton}</button>
                            <button class="btn btn-info btn-generate-report" data-report-type="HAREKET" data-yetki-grup="{$yetki.grup}" data-action="send_main"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                            <button class="btn btn-warning btn-generate-report" data-report-type="HAREKET" data-yetki-grup="{$yetki.grup}" data-action="send_backup"><i class="fas fa-hdd"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                        </div>
                        <div class="col-xs-12">
                            <div id="result-HAREKET-{$yetki.grup}" class="alert" style="display: none; margin-top: 10px;"></div>
                        </div>
                    </div>
                {foreachelse}
                    <div class="alert alert-warning text-center">{$LANG.noActiveAuthTypesForMapping}</div>
                {/foreach}
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingPersonel">
            <h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapsePersonel" aria-expanded="false" aria-controls="collapsePersonel"><i class="fas fa-users-cog"></i> {$LANG.generatePersonelReportTitle}</a></h4>
        </div>
        <div id="collapsePersonel" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingPersonel">
             <div class="panel-body">
                 <div class="row">
                    <div class="col-md-4" style="padding-top: 5px;"><strong>Tüm Personel</strong></div>
                    <div class="col-md-8 text-right">
                        <button class="btn btn-primary btn-generate-report" data-report-type="PERSONEL" data-yetki-grup="PERSONEL" data-action="generate_only"><i class="fas fa-download"></i> {$LANG.generateOnlyButton}</button>
                        <button class="btn btn-info btn-generate-report" data-report-type="PERSONEL" data-yetki-grup="PERSONEL" data-action="send_main"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                        <button class="btn btn-warning btn-generate-report" data-report-type="PERSONEL" data-yetki-grup="PERSONEL" data-action="send_backup"><i class="fas fa-hdd"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    </div>
                    <div class="col-xs-12">
                        <div id="result-PERSONEL-PERSONEL" class="alert" style="display: none; margin-top: 10px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingMuhasebe">
            <h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseMuhasebe" aria-expanded="false" aria-controls="collapseMuhasebe"><i class="fas fa-calculator"></i> Muhasebe Raporları</a></h4>
        </div>
        <div id="collapseMuhasebe" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingMuhasebe">
             <div class="panel-body">
                 <form id="muhasebeReportForm" class="form-inline">
                    <div class="form-group">
                        <label for="muhasebe_date_range">Tarih Aralığı Seçin:</label>
                        <input type="text" id="muhasebe_date_range" class="form-control date-picker-search" style="width: 250px;">
                    </div>
                    <button class="btn btn-success btn-generate-muhasebe" style="margin-left: 15px;"><i class="fas fa-file-excel"></i> Giden Faturalar Raporunu Oluştur</button>
                 </form>
                 <div id="result-muhasebe" class="alert" style="display: none; margin-top: 20px;"></div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    var modulelink_js = '{$modulelink|escape:"javascript"}';
    var csrfToken_js = '{$csrfToken|escape:"javascript"}';
    var csrfTokenName_js = '{$csrfTokenName|escape:"javascript"}';
    
    function updateCsrfToken(newToken) {
        if (newToken) {
            csrfToken_js = newToken;
            $('input[name="' + csrfTokenName_js + '"]').val(newToken);
        }
    }

    $('.btn-generate-report').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var reportType = $button.data('report-type');
        var yetkiGrup = $button.data('yetki-grup');
        var action = $button.data('action');
        var $resultContainer = $('#result-' + reportType + '-' + yetkiGrup.replace(/\s+/g, '-'));
        
        $button.prop('disabled', true).addClass('disabled');
        $button.siblings().prop('disabled', true).addClass('disabled');
        $resultContainer.removeClass('alert-danger alert-success alert-info').addClass('alert-info').html('<i class="fas fa-spinner fa-spin"></i> Rapor oluşturuluyor, lütfen bekleyin...').slideDown();

        var postData = {
            btk_ajax_action: 'generate_report',
            report_type: reportType,
            yetki_grup: yetkiGrup,
            generation_action: action
        };
        postData[csrfTokenName_js] = csrfToken_js;

        $.post(modulelink_js, postData, function(response) {
            if (response && response.status === true) {
                var message = response.message;
                if (response.download_link) {
                    message += ' <a href="' + response.download_link + '" class="alert-link"><strong>Şimdi İndir</strong></a>';
                    window.location.href = response.download_link;
                }
                $resultContainer.removeClass('alert-info').addClass('alert-success').html('<i class="fas fa-check-circle"></i> ' + message);
            } else {
                var errorMessage = response.message || 'Bilinmeyen bir hata oluştu. Lütfen modül loglarını kontrol edin.';
                $resultContainer.removeClass('alert-info').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + errorMessage);
            }
            if (response && response.new_token) {
                updateCsrfToken(response.new_token);
            }
        }, 'json').fail(function() {
            $resultContainer.removeClass('alert-info').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> {$LANG.ftpTestAjaxError|escape:"javascript"}');
        }).always(function() {
            $button.prop('disabled', false).removeClass('disabled');
            $button.siblings().prop('disabled', false).removeClass('disabled');
        });
    });

    $('.btn-generate-muhasebe').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var dateRange = $('#muhasebe_date_range').val();
        var $resultContainer = $('#result-muhasebe');

        if (!dateRange) {
            alert('Lütfen bir tarih aralığı seçin.');
            return;
        }

        $button.prop('disabled', true).addClass('disabled');
        $resultContainer.removeClass('alert-danger alert-success alert-info').addClass('alert-info').html('<i class="fas fa-spinner fa-spin"></i> Rapor oluşturuluyor, lütfen bekleyin...').slideDown();

        var postData = {
            btk_ajax_action: 'generate_muhasebe_report',
            date_range: dateRange
        };
        postData[csrfTokenName_js] = csrfToken_js;
        
        $.post(modulelink_js, postData, function(response) {
            if (response && response.status === true) {
                var message = response.message;
                if (response.download_link) {
                    message += ' <a href="' + response.download_link + '" class="alert-link"><strong>Şimdi İndir</strong></a>';
                    window.location.href = response.download_link;
                }
                $resultContainer.removeClass('alert-info').addClass('alert-success').html('<i class="fas fa-check-circle"></i> ' + message);
            } else {
                var errorMessage = response.message || 'Bilinmeyen bir hata oluştu. Lütfen modül loglarını kontrol edin.';
                $resultContainer.removeClass('alert-info').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + errorMessage);
            }
             if (response && response.new_token) {
                updateCsrfToken(response.new_token);
            }
        }, 'json').fail(function() {
            $resultContainer.removeClass('alert-info').addClass('alert-danger').html('<i class="fas fa-exclamation-triangle"></i> {$LANG.ftpTestAjaxError|escape:"javascript"}');
        }).always(function() {
            $button.prop('disabled', false).removeClass('disabled');
        });
    });
});
</script>