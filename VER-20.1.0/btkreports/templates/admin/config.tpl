{*
    WHMCS BTK Raporlama Modülü - Genel Ayarlar Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-config-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<form method="post" action="{$modulelink}&action=save_config" id="btkConfigForm" class="form-horizontal">
    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">

    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-user-cog"></i> {$LANG.generalSettings}</h3></div>
        <div class="panel-body">
            <div class="form-group"><label for="operator_code" class="col-sm-3 control-label required">{$LANG.operatorCode}</label><div class="col-sm-8"><input type="text" name="operator_code" id="operator_code" value="{$settings.operator_code|escape}" class="form-control" required><span class="help-block">{$LANG.operatorCodeDesc}</span></div></div>
            <div class="form-group"><label for="operator_name" class="col-sm-3 control-label required">{$LANG.operatorName}</label><div class="col-sm-8"><input type="text" name="operator_name" id="operator_name" value="{$settings.operator_name|escape}" class="form-control" required><span class="help-block">{$LANG.operatorNameDesc}</span></div></div>
            <div class="form-group"><label for="operator_title" class="col-sm-3 control-label">{$LANG.operatorTitle}</label><div class="col-sm-8"><input type="text" name="operator_title" id="operator_title" value="{$settings.operator_title|escape}" class="form-control"><span class="help-block">{$LANG.operatorTitleDesc}</span></div></div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.mainFtpSettings}</h3></div>
        <div class="panel-body">
            <div class="form-group"><label for="main_ftp_host" class="col-sm-3 control-label">{$LANG.ftpHost}</label><div class="col-sm-8"><input type="text" name="main_ftp_host" id="main_ftp_host" value="{$settings.main_ftp_host|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="main_ftp_user" class="col-sm-3 control-label">{$LANG.ftpUser}</label><div class="col-sm-8"><input type="text" name="main_ftp_user" id="main_ftp_user" value="{$settings.main_ftp_user|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="main_ftp_pass" class="col-sm-3 control-label">Şifre</label><div class="col-sm-8"><input type="password" name="main_ftp_pass" id="main_ftp_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassPlaceholder|escape}"></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpPort}</label><div class="col-sm-8"><div class="row"><div class="col-sm-3"><input type="number" name="main_ftp_port" id="main_ftp_port" value="{$settings.main_ftp_port|default:21}" class="form-control"></div><div class="col-sm-4" style="padding-top:7px;"><label class="btk-switch" for="main_ftp_ssl"><input type="checkbox" name="main_ftp_ssl" id="main_ftp_ssl" value="1" {if $settings.main_ftp_ssl == '1'}checked{/if}><span class="btk-slider round"></span></label><label for="main_ftp_ssl" style="margin-left:5px; font-weight:normal; cursor:pointer;">{$LANG.ftpSSL}</label></div><div class="col-sm-5" style="padding-top:7px;"><label class="btk-switch" for="main_ftp_pasv"><input type="checkbox" name="main_ftp_pasv" id="main_ftp_pasv" value="1" {if $settings.main_ftp_pasv == '1'}checked{/if}><span class="btk-slider round"></span></label><label for="main_ftp_pasv" style="margin-left:5px; font-weight:normal; cursor:pointer;">{$LANG.ftpPasv}</label></div></div></div></div>
            <hr>
            <h4><i class="fas fa-folder-open"></i> Rapor Klasör Yolları (Ana Sunucu)</h4>
            <div class="form-group"><label for="main_ftp_rehber_path" class="col-sm-3 control-label">Rehber Raporu Yolu</label><div class="col-sm-8"><input type="text" name="main_ftp_rehber_path" id="main_ftp_rehber_path" value="{$settings.main_ftp_rehber_path|default:'/REHBER/'|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="main_ftp_hareket_path" class="col-sm-3 control-label">Hareket Raporu Yolu</label><div class="col-sm-8"><input type="text" name="main_ftp_hareket_path" id="main_ftp_hareket_path" value="{$settings.main_ftp_hareket_path|default:'/HAREKET/'|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="main_ftp_personel_path" class="col-sm-3 control-label">Personel Raporu Yolu</label><div class="col-sm-8"><input type="text" name="main_ftp_personel_path" id="main_ftp_personel_path" value="{$settings.main_ftp_personel_path|default:'/PERSONEL/'|escape}" class="form-control"></div></div>
            <hr>
            <div class="form-group"><div class="col-sm-offset-3 col-sm-8"><button type="button" class="btn btn-info btk-ftp-test-btn" data-ftp-type="main"><i class="fas fa-plug"></i> {$LANG.testFtpConnection}</button><span id="main_ftp_test_result" class="help-block" style="display:inline; margin-left:15px;"></span></div></div>
        </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"> <h3 class="panel-title"> <label class="btk-switch" for="backup_ftp_enabled_toggle"> <input type="checkbox" name="backup_ftp_enabled" id="backup_ftp_enabled_toggle" value="1" {if $settings.backup_ftp_enabled == '1'}checked{/if}> <span class="btk-slider round"></span> </label> <label for="backup_ftp_enabled_toggle" style="display:inline; font-weight:inherit; color:inherit; cursor:pointer;"><i class="fas fa-archive"></i> {$LANG.backupFtpSettings}</label> </h3> </div>
        <div class="panel-body" id="backup_ftp_details" {if !$settings.backup_ftp_enabled}style="display:none;"{/if}>
            <div class="form-group"><label for="backup_ftp_host" class="col-sm-3 control-label">{$LANG.ftpHost}</label><div class="col-sm-8"><input type="text" name="backup_ftp_host" id="backup_ftp_host" value="{$settings.backup_ftp_host|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="backup_ftp_user" class="col-sm-3 control-label">{$LANG.ftpUser}</label><div class="col-sm-8"><input type="text" name="backup_ftp_user" id="backup_ftp_user" value="{$settings.backup_ftp_user|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="backup_ftp_pass" class="col-sm-3 control-label">Şifre</label><div class="col-sm-8"><input type="password" name="backup_ftp_pass" id="backup_ftp_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassPlaceholder|escape}"></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpPort}</label><div class="col-sm-8"><div class="row"><div class="col-sm-3"><input type="number" name="backup_ftp_port" id="backup_ftp_port" value="{$settings.backup_ftp_port|default:21}" class="form-control"></div><div class="col-sm-4" style="padding-top:7px;"><label class="btk-switch" for="backup_ftp_ssl"><input type="checkbox" name="backup_ftp_ssl" id="backup_ftp_ssl" value="1" {if $settings.backup_ftp_ssl == '1'}checked{/if}><span class="btk-slider round"></span></label><label for="backup_ftp_ssl" style="margin-left: 5px; font-weight:normal; cursor:pointer;">{$LANG.ftpSSL}</label></div><div class="col-sm-5" style="padding-top:7px;"><label class="btk-switch" for="backup_ftp_pasv"><input type="checkbox" name="backup_ftp_pasv" id="backup_ftp_pasv" value="1" {if $settings.backup_ftp_pasv == '1'}checked{/if}><span class="btk-slider round"></span></label><label for="backup_ftp_pasv" style="margin-left:5px; font-weight:normal; cursor:pointer;">{$LANG.ftpPasv}</label></div></div></div></div>
            <hr>
            <h4><i class="fas fa-folder-open"></i> Rapor Klasör Yolları (Yedek Sunucu)</h4>
            <div class="form-group"><label for="backup_ftp_rehber_path" class="col-sm-3 control-label">Rehber Raporu Yolu</label><div class="col-sm-8"><input type="text" name="backup_ftp_rehber_path" id="backup_ftp_rehber_path" value="{$settings.backup_ftp_rehber_path|default:'/REHBER_YEDEK/'|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="backup_ftp_hareket_path" class="col-sm-3 control-label">Hareket Raporu Yolu</label><div class="col-sm-8"><input type="text" name="backup_ftp_hareket_path" id="backup_ftp_hareket_path" value="{$settings.backup_ftp_hareket_path|default:'/HAREKET_YEDEK/'|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="backup_ftp_personel_path" class="col-sm-3 control-label">Personel Raporu Yolu</label><div class="col-sm-8"><input type="text" name="backup_ftp_personel_path" id="backup_ftp_personel_path" value="{$settings.backup_ftp_personel_path|default:'/PERSONEL_YEDEK/'|escape}" class="form-control"></div></div>
            <hr>
            <div class="form-group"><div class="col-sm-offset-3 col-sm-8"><button type="button" class="btn btn-info btk-ftp-test-btn" data-ftp-type="backup"><i class="fas fa-plug"></i> {$LANG.testFtpConnection}</button><span id="backup_ftp_test_result" class="help-block" style="display:inline; margin-left:15px;"></span></div></div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading"> <h3 class="panel-title"> <i class="fas fa-id-card"></i> {$LANG.nviSettings} <div class="pull-right"> <span class="mode-label {if $settings.nvi_kps_mode != 'canli'}mode-active{/if}">{$LANG.mode_test}</span> <label class="btk-switch" for="nvi_kps_mode"> <input type="checkbox" name="nvi_kps_mode" id="nvi_kps_mode" {if $settings.nvi_kps_mode == 'canli'}checked{/if}> <span class="btk-slider round"></span> </label> <span class="mode-label {if $settings.nvi_kps_mode == 'canli'}mode-active{/if}">{$LANG.mode_canli}</span> </div> </h3> </div>
        <div class="panel-body"> <p class="help-block" style="margin-bottom: 20px;">{$LANG.nviSettingsDesc}</p> <div class="form-group"> <label for="nviKpsUser" class="col-sm-3 control-label">{$LANG.nviKpsUserLabel}</label> <div class="col-sm-8"><input type="text" name="nviKpsUser" id="nviKpsUser" value="{$settings.nviKpsUser|escape}" class="form-control"></div> </div> <div class="form-group"> <label for="nviKpsPass" class="col-sm-3 control-label">{$LANG.nviKpsPassLabel}</label> <div class="col-sm-8"><input type="password" name="nviKpsPass" id="nviKpsPass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassPlaceholder|escape}"></div> </div> </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"> <h3 class="panel-title"> <i class="fas fa-file-signature"></i> {$LANG.eSozlesmeSettingsTitle} <div class="pull-right"> <span class="mode-label {if $settings.btk_ekayit_mode != 'canli'}mode-active{/if}">{$LANG.mode_test}</span> <label class="btk-switch" for="btk_ekayit_mode"> <input type="checkbox" name="btk_ekayit_mode" id="btk_ekayit_mode" {if $settings.btk_ekayit_mode == 'canli'}checked{/if}> <span class="btk-slider round"></span> </label> <span class="mode-label {if $settings.btk_ekayit_mode == 'canli'}mode-active{/if}">{$LANG.mode_canli}</span> </div> </h3> </div>
        <div class="panel-body">
            <p class="help-block">{$LANG.eSozlesmeSettingsDesc}</p>
            <hr>
            <h4><i class="fas fa-key"></i> Entegrasyon Kodları</h4>
            <div class="form-group"> <label for="ekayit_kurum_kodu" class="col-sm-3 control-label">Kurum Kodu</label> <div class="col-sm-8"><input type="text" name="ekayit_kurum_kodu" id="ekayit_kurum_kodu" value="{$settings.ekayit_kurum_kodu|escape}" class="form-control"></div> </div>
            <div class="form-group"> <label for="ekayit_isletmeci_kodu" class="col-sm-3 control-label">İşletmeci Kodu</label> <div class="col-sm-8"><input type="text" name="ekayit_isletmeci_kodu" id="ekayit_isletmeci_kodu" value="{$settings.ekayit_isletmeci_kodu|escape}" class="form-control"></div> </div>
            <div id="ekayit_test_veri_alani" {if $settings.btk_ekayit_mode == 'canli'}style="display:none;"{/if}>
                <hr>
                <h4><i class="fas fa-flask"></i> E-Kayıt Test Verileri</h4>
                <div class="form-group"> <label for="ekayit_test_tckn" class="col-sm-3 control-label">Test Gerçek Kişi TCKN</label> <div class="col-sm-8"><input type="text" name="ekayit_test_tckn" id="ekayit_test_tckn" value="{$settings.ekayit_test_tckn|escape}" class="form-control" maxlength="11"></div> </div>
                <div class="form-group"> <label for="ekayit_test_ad" class="col-sm-3 control-label">Test Gerçek Kişi Adı</label> <div class="col-sm-8"><input type="text" name="ekayit_test_ad" id="ekayit_test_ad" value="{$settings.ekayit_test_ad|escape}" class="form-control"></div> </div>
                <div class="form-group"> <label for="ekayit_test_soyad" class="col-sm-3 control-label">Test Gerçek Kişi Soyadı</label> <div class="col-sm-8"><input type="text" name="ekayit_test_soyad" id="ekayit_test_soyad" value="{$settings.ekayit_test_soyad|escape}" class="form-control"></div> </div>
                <div class="form-group"> <label for="ekayit_test_vkn" class="col-sm-3 control-label">Test Tüzel Kişi VKN</label> <div class="col-sm-8"><input type="text" name="ekayit_test_vkn" id="ekayit_test_vkn" value="{$settings.ekayit_test_vkn|escape}" class="form-control" maxlength="10"></div> </div>
                <div class="form-group"> <label for="ekayit_test_unvan" class="col-sm-3 control-label">Test Tüzel Kişi Ünvanı</label> <div class="col-sm-8"><input type="text" name="ekayit_test_unvan" id="ekayit_test_unvan" value="{$settings.ekayit_test_unvan|escape}" class="form-control"></div> </div>
                <div class="form-group"> <label for="ekayit_test_mersis" class="col-sm-3 control-label">Test Tüzel Kişi MERSIS</label> <div class="col-sm-8"><input type="text" name="ekayit_test_mersis" id="ekayit_test_mersis" value="{$settings.ekayit_test_mersis|escape}" class="form-control" maxlength="16"></div> </div>
                <div class="form-group"> <label for="ekayit_test_islemYapanYetkiTur" class="col-sm-3 control-label">İşlem Yapan Yetki Türü</label> <div class="col-sm-8"><input type="text" name="ekayit_test_islemYapanYetkiTur" id="ekayit_test_islemYapanYetkiTur" value="{$settings.ekayit_test_islemYapanYetkiTur|default:'MUSTERI'|escape}" class="form-control"><span class="help-block">Örn: MUSTERI, MUSTERI_TEMSILCISI</span></div> </div>
                <div class="form-group"> <label for="ekayit_test_islemYapanDogumTarihi" class="col-sm-3 control-label">İşlem Yapan Doğum Tarihi</label> <div class="col-sm-8"><input type="text" name="ekayit_test_islemYapanDogumTarihi" id="ekayit_test_islemYapanDogumTarihi" value="{$settings.ekayit_test_islemYapanDogumTarihi|default:'01/01/1980'|escape}" class="form-control date-picker"><span class="help-block">Format: GG/AA/YYYY</span></div> </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-user-shield"></i> {$LANG.btkYetkilendirmeSecenekleri}</h3></div>
        <div class="panel-body"> <p class="help-block" style="margin-bottom: 20px;">{$LANG.btkYetkilendirmeDesc}</p> <div class="row btk-yetki-list"> {foreach from=$yetki_turleri item=yt} <div class="col-md-6"> <div class="form-group"> <label class="btk-switch" for="yetki_toggle_{$yt.yetki_kodu|escape:'url'}"> <input type="checkbox" name="yetkiler[{$yt.yetki_kodu}]" id="yetki_toggle_{$yt.yetki_kodu|escape:'url'}" value="1" {if $yt.aktif}checked{/if}> <span class="btk-slider round"></span> </label> <label for="yetki_toggle_{$yt.yetki_kodu|escape:'url'}"> {$yt.yetki_adi} <strong>({$yt.grup})</strong> </label> </div> </div> {/foreach} </div> </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$LANG.otherSettings}</h3></div>
        <div class="panel-body">
           <div class="form-group"> <label class="col-sm-4 control-label">Ağ (POP) İzleme Özelliği</label> <div class="col-sm-8"> <label class="btk-switch" for="pop_monitoring_enabled"> <input type="checkbox" name="pop_monitoring_enabled" id="pop_monitoring_enabled" value="1" {if $settings.pop_monitoring_enabled == '1'}checked{/if}> <span class="btk-slider round"></span> </label> <span class="help-block" style="display: inline-block; margin-left: 10px;">POP noktalarının canlı durumunu ve yanıt süresini periyodik olarak kontrol eder.</span> </div> </div>
           <div class="form-group"><label class="col-sm-4 control-label">{$LANG.sendEmptyReports}</label><div class="col-sm-8"><label class="btk-switch" for="send_empty_reports"><input type="checkbox" name="send_empty_reports" id="send_empty_reports" value="1" {if $settings.send_empty_reports == '1'}checked{/if}><span class="btk-slider round"></span></label><span class="help-block" style="display: inline-block; margin-left: 10px;">{$LANG.sendEmptyReportsDesc}</span></div></div>
           <div class="form-group"><label class="col-sm-4 control-label">{$LANG.debugMode}</label><div class="col-sm-8"><label class="btk-switch" for="debug_mode"><input type="checkbox" name="debug_mode" id="debug_mode" value="1" {if $settings.debug_mode == '1'}checked{/if}><span class="btk-slider round"></span></label><span class="help-block" style="display: inline-block; margin-left: 10px;">{$LANG.debugModeDesc}</span></div></div>
           <div class="form-group"><label class="col-sm-4 control-label text-danger">{$LANG.deleteDataOnDeactivate}</label><div class="col-sm-8"><label class="btk-switch" for="delete_data_on_deactivate"><input type="checkbox" name="delete_data_on_deactivate" id="delete_data_on_deactivate" value="1" {if $settings.delete_data_on_deactivate == '1'}checked{/if}><span class="btk-slider round"></span></label><span class="help-block text-danger" style="display: inline-block; margin-left: 10px;">{$LANG.deleteDataOnDeactivateDesc}</span></div></div>
        </div>
    </div>

    <div class="text-center" style="margin-top: 30px; margin-bottom: 30px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    var modulelink_js = '{$modulelink|escape:"javascript"}';
    var csrfToken_js = '{$csrfToken|escape:"javascript"}';
    var csrfTokenName_js = '{$csrfTokenName|escape:"javascript"}';
    var LANG_js = {
        ftpPassPlaceholder: '{$LANG.ftpPassPlaceholder|escape:"javascript"}',
        testingConnection: '{$LANG.testingConnection|escape:"javascript"}',
        ftpTestAjaxError: '{$LANG.ftpTestAjaxError|escape:"javascript"}'
    };
    function updateCsrfToken(newToken) { if (newToken) { csrfToken_js = newToken; $('input[name="' + csrfTokenName_js + '"]').val(newToken); } }
    function escapeHTML(str) { if (!str || typeof str !== 'string') return ''; var p = document.createElement("p"); p.appendChild(document.createTextNode(str)); return p.innerHTML; };
    $('#backup_ftp_enabled_toggle').on('change', function() { var backupDetails = $('#backup_ftp_details'); if($(this).is(":checked")) { backupDetails.slideDown('fast'); } else { backupDetails.slideUp('fast'); } });
    $('#btkConfigForm input[type="password"]').each(function() { var $this = $(this); $this.focus(function() { if ($(this).val() === '********') { $(this).val(''); } }).blur(function() { if ($(this).val() === '') { $(this).val('********'); } }); });
    $('.btk-ftp-test-btn').click(function(e) { e.preventDefault(); var ftpType = $(this).data('ftp-type'); var resultContainer = $('#' + ftpType + '_ftp_test_result'); var button = $(this); resultContainer.removeClass('text-success text-danger text-info').html('<i class="fas fa-spinner fa-spin"></i> ' + LANG_js.testingConnection); button.prop('disabled', true); var postData = { btk_ajax_action: 'test_ftp_connection', ftp_type: ftpType, host: $('#' + ftpType + '_ftp_host').val(), user: $('#' + ftpType + '_ftp_user').val(), pass: $('#' + ftpType + '_ftp_pass').val(), port: $('#' + ftpType + '_ftp_port').val(), ssl: $('#' + ftpType + '_ftp_ssl').is(':checked') ? '1' : '0', pasv: $('#' + ftpType + '_ftp_pasv').is(':checked') ? '1' : '0' }; postData[csrfTokenName_js] = csrfToken_js; $.post(modulelink_js, postData, function(response) { if (response && response.status === 'success') { resultContainer.addClass('text-success').html('<i class="fas fa-check-circle"></i> ' + escapeHTML(response.message)); } else if (response && response.status === 'info') { resultContainer.addClass('text-info').html('<i class="fas fa-info-circle"></i> ' + escapeHTML(response.message)); } else { resultContainer.addClass('text-danger').html('<i class="fas fa-times-circle"></i> ' + escapeHTML(response.message || 'Bilinmeyen Hata')); } if (response && response.new_token) { updateCsrfToken(response.new_token); } }, 'json').fail(function() { resultContainer.addClass('text-danger').html('<i class="fas fa-exclamation-triangle"></i> ' + LANG_js.ftpTestAjaxError); }).always(function() { button.prop('disabled', false); }); });
    $('#btk_ekayit_mode').on('change', function() { var testVeriAlani = $('#ekayit_test_veri_alani'); if($(this).is(":checked")) { testVeriAlani.slideUp('fast'); } else { testVeriAlani.slideDown('fast'); } });
});
</script>