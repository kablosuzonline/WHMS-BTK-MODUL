{* modules/addons/btkreports/templates/admin/config.tpl (Nihai Sürüm) *}

{if $action eq 'config'} 
    <div class="btk-header-container" style="margin-bottom: 15px;">
        <div class="btk-module-title">
            <i class="fas fa-cogs" style="font-size: 1.5em; margin-right: 8px; vertical-align: middle;"></i>
            <h2 style="display: inline-block; vertical-align: middle; margin-top: 0; margin-bottom: 0;">{$_ADDONLANG.btkreports_tab_settings}</h2>
        </div>
    </div>
{/if}

{if isset($errorMessage) && $errorMessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errorMessage}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=config" id="btkConfigForm" class="form-horizontal" role="form">
    <input type="hidden" name="token" value="{$csrfToken}">

    {* Genel İşletmeci Bilgileri Paneli *}
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-building"></i> {$_ADDONLANG.btkreports_config_general_settings|default:'Genel İşletmeci Bilgileri'}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="operatorName" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_operator_name_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="operatorName" id="operatorName" class="form-control" value="{$config->operator_name|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_config_operator_name_placeholder|default:'Örn: İZMAR BİLİŞİM HİZMETLERİ'}">
                    <p class="help-block">{$_ADDONLANG.btkreports_config_operator_name_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <label for="operatorCode" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_operator_code_label} <span class="text-danger">*</span></label>
                <div class="col-sm-3">
                    <input type="text" name="operatorCode" id="operatorCode" class="form-control" value="{$config->operator_code|escape:'html'}" maxlength="3" placeholder="Örn: 701 (3 rakam)" title="Lütfen 3 haneli sayısal operatör kodunu giriniz." required>
                    <p class="help-block">{$_ADDONLANG.btkreports_config_operator_code_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <label for="operator_unvani" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_operator_unvani_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="operator_unvani" id="operator_unvani" class="form-control" value="{$config->operator_unvani|escape:'html'}" placeholder="{$_ADDONLANG.btkreports_config_operator_unvani_placeholder|default:'Örn: İZMAR BİLİŞİM LTD. ŞTİ.'}">
                    <p class="help-block">{$_ADDONLANG.btkreports_config_operator_unvani_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_auth_types_label}</label>
                <div class="col-sm-9">
                    <div class="row">
                        {foreach from=$allYetkiTurleri item=yetki}
                            <div class="col-md-4 col-sm-6">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" name="active_auth_types[]" value="{$yetki->yetki_kodu}"
                                               {if $config->active_auth_types && is_array($config->active_auth_types) && in_array($yetki->yetki_kodu, $config->active_auth_types)}checked{/if}>
                                        {$yetki->yetki_adi} ({$yetki->yetki_kodu} - {$yetki->kapsam})
                                    </label>
                                </div>
                            </div>
                        {foreachelse}
                            <div class="col-xs-12">
                                <p class="text-muted">{$_ADDONLANG.btkreports_config_no_auth_types_defined|default:'Sistemde tanımlı BTK Yetki Türü bulunamadı. Lütfen initial_reference_data.sql dosyasını kontrol edin.'}</p>
                            </div>
                        {/foreach}
                    </div>
                    <p class="help-block">{$_ADDONLANG.btkreports_config_auth_types_desc}</p>
                </div>
            </div>
        </div>
    </div>

    {* FTP Sunucu Ayarları Paneli *}
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-server"></i> {$_ADDONLANG.btkreports_config_ftp_settings}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="ftp_host" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_ftp_host_label} <span class="text-danger">*</span></label>
                <div class="col-sm-7">
                    <input type="text" name="ftp_host" id="ftp_host" class="form-control" value="{$config->ftp_host|escape:'html'}" required>
                    <p class="help-block">{$_ADDONLANG.btkreports_config_ftp_host_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <label for="ftp_username" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_ftp_username_label} <span class="text-danger">*</span></label>
                <div class="col-sm-5">
                    <input type="text" name="ftp_username" id="ftp_username" class="form-control" value="{$config->ftp_username|escape:'html'}" required autocomplete="off">
                </div>
            </div>
            <div class="form-group">
                <label for="ftp_password" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_ftp_password_label}</label>
                <div class="col-sm-5">
                    <input type="password" name="ftp_password" id="ftp_password" class="form-control" placeholder="{$_ADDONLANG.btkreports_config_ftp_password_placeholder|default:'Değiştirmek istemiyorsanız boş bırakın'}" autocomplete="new-password">
                    <p class="help-block">{$_ADDONLANG.btkreports_config_ftp_password_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <label for="ftp_rehber_path" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_ftp_rehber_path_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="ftp_rehber_path" id="ftp_rehber_path" class="form-control" value="{$config->ftp_rehber_path|default:'/REHBER/'|escape:'html'}" placeholder="/REHBER/">
                    <p class="help-block">{$_ADDONLANG.btkreports_config_ftp_rehber_path_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <label for="ftp_hareket_path" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_ftp_hareket_path_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="ftp_hareket_path" id="ftp_hareket_path" class="form-control" value="{$config->ftp_hareket_path|default:'/HAREKET/'|escape:'html'}" placeholder="/HAREKET/">
                    <p class="help-block">{$_ADDONLANG.btkreports_config_ftp_hareket_path_desc}</p>
                </div>
            </div>
             <div class="form-group">
                <label for="personel_ftp_path" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_personel_ftp_path_label}</label>
                <div class="col-sm-7">
                    <input type="text" name="personel_ftp_path" id="personel_ftp_path" class="form-control" value="{$config->personel_ftp_path|default:'/PERSONEL/'|escape:'html'}" placeholder="/PERSONEL/">
                    <p class="help-block">{$_ADDONLANG.btkreports_config_personel_ftp_path_desc}</p>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-3 col-sm-9">
                    <button type="button" id="testFtpButtonConfig" class="btn btn-info"><i class="fas fa-network-wired"></i> {$_ADDONLANG.btkreports_config_test_ftp_button}</button>
                    <span id="ftpTestStatusConfig" style="margin-left: 10px;"></span>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$_ADDONLANG.btkreports_config_other_settings|default:'Diğer Raporlama Ayarları'}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="send_empty_file" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_send_empty_file_label}</label>
                <div class="col-sm-9">
                    <label class="checkbox-inline">
                        <input type="checkbox" name="send_empty_file" id="send_empty_file" value="1" {if $config->send_empty_file == '1'}checked{/if}>
                        {$_ADDONLANG.btkreports_config_send_empty_file_desc}
                    </label>
                </div>
            </div>
        </div>
    </div>
    
    <div class="panel panel-warning">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-trash-alt"></i> {$_ADDONLANG.btkreports_config_deactivation_settings|default:'Modül Deaktivasyon Ayarları'}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="delete_data_on_uninstall" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_config_delete_data_on_uninstall_label|default:'Deaktivasyonda Verileri Sil'}</label>
                <div class="col-sm-9">
                    <label class="checkbox-inline">
                        <input type="checkbox" name="delete_data_on_uninstall" id="delete_data_on_uninstall" value="1" {if $config->delete_data_on_uninstall == '1'}checked{/if}>
                        {$_ADDONLANG.btkreports_config_delete_data_on_uninstall_desc|default:'Modül deaktive edilirken/kaldırılırken tüm BTK veritabanı tabloları silinsin.'}
                    </label>
                     <p class="help-block text-danger" style="margin-top:10px;"><strong><i class="fas fa-exclamation-triangle"></i> {$_ADDONLANG.btkreports_warning|upper}:</strong> {$_ADDONLANG.btkreports_config_delete_data_warning|default:'Bu seçenek işaretlenirse, modül kaldırıldığında tüm BTK verileriniz kalıcı olarak silinir!'}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="form-group text-center" style="margin-top: 20px; margin-bottom: 20px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$_ADDONLANG.btkreports_save_changes}</button>
        <a href="{$modulelink}&action=index" class="btn btn-default btn-lg" style="margin-left: 10px;">{$_ADDONLANG.btkreports_go_back}</a>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    $('#testFtpButtonConfig').on('click', function() {
        var btn = $(this);
        var statusSpan = $('#ftpTestStatusConfig');
        var originalButtonText = btn.html();

        btn.attr('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> ' + (typeof btkLang !== 'undefined' && btkLang.btkreports_config_ftp_testing ? btkLang.btkreports_config_ftp_testing : 'Test ediliyor...'));
        statusSpan.html('').removeClass('text-success text-danger text-warning');

        var formData = {
            ftp_host: $('#ftp_host').val(),
            ftp_username: $('#ftp_username').val(),
            ftp_password: $('#ftp_password').val() || '********', 
            ftp_path_to_test: $('#ftp_rehber_path').val(), 
            token: $('input[name="token"]').val(), 
            action: 'getFtpStatus'
        };

        $.ajax({
            url: typeof btkModuleLink !== 'undefined' ? btkModuleLink : 'addonmodules.php?module=btkreports', 
            type: 'POST', 
            data: formData,
            dataType: 'json',
            timeout: 20000, 
            success: function(response) {
                if (response && typeof response.message !== 'undefined') {
                    if (response.success) {
                        statusSpan.html('<i class="fas fa-check-circle"></i> ' + response.message).addClass('text-success');
                    } else {
                        statusSpan.html('<i class="fas fa-times-circle"></i> ' + response.message).addClass('text-danger');
                    }
                } else {
                     statusSpan.html('<i class="fas fa-question-circle"></i> ' + (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_error_unknown ? btkLang.btkreports_ftp_error_unknown : 'Bilinmeyen bir FTP yanıtı alındı.')).addClass('text-danger');
                }
            },
            error: function(xhr, status, error) {
                var errorMessage = (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_test_fail_ajax ? btkLang.btkreports_ftp_test_fail_ajax : 'FTP testinde AJAX hatası:') + ' ';
                if (status === 'timeout') {
                    errorMessage += (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_error_timeout ? btkLang.btkreports_ftp_error_timeout : 'Sunucu zaman aşımına uğradı.');
                } else {
                    // Sunucudan gelen hatayı göstermek için (güvenlik riski olabilir, dikkatli kullanın)
                    var responseText = xhr.responseText || (typeof btkLang !== 'undefined' && btkLang.btkreports_ftp_error_unknown ? btkLang.btkreports_ftp_error_unknown : 'Bilinmeyen bir hata oluştu.');
                    if (xhr.status !== 0 && xhr.statusText && xhr.statusText !== 'error') { // Gerçek HTTP hatalarını önceliklendir
                        errorMessage += xhr.status + ' ' + xhr.statusText;
                    } else if (error) {
                         errorMessage += error;
                    }
                    // Çok uzun HTML yanıtlarını gösterme
                    if (responseText.length < 500 && responseText.toLowerCase().indexOf('<html') === -1 && responseText.toLowerCase().indexOf('<!doctype') === -1 ) {
                        errorMessage += ' Detay: ' + responseText;
                    } else if (xhr.status !== 0) {
                        // Eğer HTML ise, sadece status text'i göster
                    } else {
                         errorMessage += ' (Sunucudan detay alınamadı veya yanıt çok uzun.)';
                    }
                }
                statusSpan.html('<i class="fas fa-exclamation-triangle"></i> ' + errorMessage).addClass('text-danger');
            },
            complete: function() {
                btn.attr('disabled', false).html(originalButtonText);
            }
        });
    });
});
</script>