{* modules/addons/btkreports/templates/admin/config.tpl *}
{* BTK Raporlama Modülü Yapılandırma Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=config" id="btkConfigForm">
    <input type="hidden" name="save_btk_settings" value="1">
    <input type="hidden" name="token" value="{$csrfToken}">

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-cog"></i> {$lang.section_operator_info}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="operator_code">{$lang.operator_code} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.operator_code_desc|escape:'html'}"></i></label>
                        <input type="text" name="operator_code" id="operator_code" value="{$settings.operator_code|escape:'html'}" class="form-control" placeholder="örn: 701" required maxlength="3" pattern="[0-9]{3}">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="operator_name">{$lang.operator_name} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.operator_name_desc|escape:'html'}"></i></label>
                        <input type="text" name="operator_name" id="operator_name" value="{$settings.operator_name|escape:'html'}" class="form-control" placeholder="örn: IZMARBILISIM" required pattern="[A-Z0-9_]+">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="operator_title_official">{$lang.operator_title_official} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.operator_title_official_desc|escape:'html'}"></i></label>
                        <input type="text" name="operator_title_official" id="operator_title_official" value="{$settings.operator_title_official|escape:'html'}" class="form-control" placeholder="Şirketinizin Tam Resmi Unvanı">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-tasks"></i> {$lang.section_btk_authorizations}</h3>
        </div>
        <div class="panel-body">
            <p>{$lang.btk_authorizations_desc}</p>
            <div class="row">
                {if $allYetkiTurleri}
                    {foreach from=$allYetkiTurleri item=yetki}
                        <div class="col-md-4 col-sm-6">
                            <div class="form-group">
                                <label class="toggle-switch">
                                    <input type="checkbox" name="yetki_turleri[]" value="{$yetki->id}" {if isset($selectedYetkiTurleriIds[$yetki->id])}checked{/if}>
                                    <span class="slider round"></span>
                                </label>
                                <span style="margin-left: 5px;">{$yetki->yetki_adi|escape:'html'} ({$yetki->yetki_kodu_kisa|escape:'html'})</span>
                            </div>
                        </div>
                    {/foreach}
                {else}
                    <div class="col-md-12">
                        <div class="alert alert-warning">{$lang.no_records_found} (BTK Yetki Türleri için `mod_btk_yetki_turleri` tablosunu kontrol edin).</div>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-server"></i> {$lang.section_ftp_main}</h3>
        </div>
        <div class="panel-body">
            <p>{$lang.ftp_main_desc}</p>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ftp_host">{$lang.ftp_host} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_host_desc|escape:'html'}"></i></label>
                        <input type="text" name="ftp_host" id="ftp_host" value="{$settings.ftp_host|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="ftp_port">{$lang.ftp_port} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_port_desc|escape:'html'}"></i></label>
                        <input type="number" name="ftp_port" id="ftp_port" value="{$settings.ftp_port|escape:'html'}" class="form-control" placeholder="21" min="1" max="65535">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="ftp_passive_mode">{$lang.ftp_passive_mode} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_passive_mode_desc|escape:'html'}"></i></label>
                        <div>
                            <label class="toggle-switch">
                                <input type="checkbox" name="ftp_passive_mode" id="ftp_passive_mode" value="1" {if $settings.ftp_passive_mode == '1'}checked{/if}>
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ftp_username">{$lang.ftp_username} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_username_desc|escape:'html'}"></i></label>
                        <input type="text" name="ftp_username" id="ftp_username" value="{$settings.ftp_username|escape:'html'}" class="form-control" autocomplete="off">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ftp_password">{$lang.ftp_password} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_password_desc|escape:'html'}"></i></label>
                        <input type="password" name="ftp_password" id="ftp_password" value="" class="form-control" placeholder="Değiştirmek istemiyorsanız boş bırakın" autocomplete="new-password">
                         {if $settings.ftp_password != ''}<small class="text-muted">Mevcut bir şifre kayıtlı.</small>{/if}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="ftp_path_abone_rehber">{$lang.ftp_path_abone_rehber} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_path_abone_rehber_desc|escape:'html'} {$lang.tooltip_ftp_path|escape:'html'}"></i></label>
                        <input type="text" name="ftp_path_abone_rehber" id="ftp_path_abone_rehber" value="{$settings.ftp_path_abone_rehber|escape:'html'}" class="form-control" placeholder="/REHBER/">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="ftp_path_abone_hareket">{$lang.ftp_path_abone_hareket} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_path_abone_hareket_desc|escape:'html'} {$lang.tooltip_ftp_path|escape:'html'}"></i></label>
                        <input type="text" name="ftp_path_abone_hareket" id="ftp_path_abone_hareket" value="{$settings.ftp_path_abone_hareket|escape:'html'}" class="form-control" placeholder="/HAREKET/">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="ftp_path_personel_excel">{$lang.ftp_path_personel_excel} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.ftp_path_personel_excel_desc|escape:'html'} {$lang.tooltip_ftp_path|escape:'html'}"></i></label>
                        <input type="text" name="ftp_path_personel_excel" id="ftp_path_personel_excel" value="{$settings.ftp_path_personel_excel|escape:'html'}" class="form-control" placeholder="/PERSONEL/">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-info btn-sm" onclick="btkTestFtpConnection('main', 'main_ftp_test_result_area');">
                    <i class="fas fa-plug"></i> {$lang.ftp_test_connection} (Ana FTP)
                </button>
                <span id="main_ftp_test_result_area" style="margin-left:10px;"></span>
            </div>
        </div>
    </div>

    {* BÖLÜM 1 SONU - Devamı sonraki bölümde *}
</form>

{* Bu script bloğu btk_admin_scripts.js dosyasına taşınabilir *}
<script type="text/javascript">
$(document).ready(function(){
    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip();

    // Yedek FTP ayarlarını göster/gizle
    $('#use_backup_ftp').change(function(){
        if($(this).is(":checked")) {
            $('#backup_ftp_settings_panel_body').slideDown();
        } else {
            $('#backup_ftp_settings_panel_body').slideUp();
        }
    }).trigger('change'); // Sayfa yüklendiğinde de çalıştır
});

// FTP Test Fonksiyonu (index.tpl'deki ile aynı, merkezi bir yere taşınabilir)
function btkTestFtpConnection(ftpType, indicatorId) {
    var indicator = $('#' + indicatorId);
    var button = $('button[onclick*="' + ftpType + '"]'); // İlgili butonu bul
    var originalButtonText = button.html();
    
    indicator.html('<span class="text-info">{$lang.ftp_status_checking|escape:'javascript'} <i class="fas fa-spinner fa-spin"></i></span>');
    button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> {$lang.please_wait|escape:'javascript'}');

    var formData = {
        ftp_type: ftpType,
        token: '{$csrfToken}' // Genel token kullanılabilir veya action'a özel
    };
    // Formdaki mevcut FTP bilgilerini de gönderelim ki test güncel bilgilerle yapılsın
    if (ftpType === 'main') {
        formData.ftp_host = $('#ftp_host').val();
        formData.ftp_port = $('#ftp_port').val();
        formData.ftp_username = $('#ftp_username').val();
        formData.ftp_password = $('#ftp_password').val(); // Şifreyi göndermek güvenlik riski olabilir, PHP tarafında DB'den okunmalı.
                                                            // Ya da sadece bağlantı testi için şifre girilip o an test edilebilir.
                                                            // Şimdilik, PHP tarafı DB'den okuyacak şekilde bırakıyorum.
                                                            // Bu AJAX isteği sadece tipi gönderecek.
    } else if (ftpType === 'backup') {
        formData.ftp_host = $('#backup_ftp_host').val();
        // ... diğer yedek ftp alanları
    }


    $.ajax({
        url: '{$modulelink}&action=test_ftp_connection&ajax=1',
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                indicator.html('<span class="text-success"><i class="fas fa-check-circle"></i> ' + $('<div>').text(data.message).html() + '</span>');
            } else {
                indicator.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + $('<div>').text(data.message).html() + '</span>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            indicator.html('<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> AJAX Hatası: ' + $('<div>').text(textStatus).html() + '</span>');
        },
        complete: function() {
             button.prop('disabled', false).html(originalButtonText);
        }
    });
}
</script>

{* modules/addons/btkreports/templates/admin/config.tpl *}
{* BTK Raporlama Modülü Yapılandırma Sayfası *}
{* BÖLÜM 2 / 2 (SON BÖLÜM) *}

    {* --- ÖNCEKİ BÖLÜMÜN DEVAMI --- *}

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">
                <i class="fas fa-archive"></i> {$lang.section_ftp_backup}
                <label class="toggle-switch pull-right" data-toggle="tooltip" title="{$lang.use_backup_ftp_desc|escape:'html'}">
                    <input type="checkbox" name="use_backup_ftp" id="use_backup_ftp" value="1" {if $settings.use_backup_ftp == '1'}checked{/if}>
                    <span class="slider round"></span>
                </label>
            </h3>
        </div>
        <div class="panel-body" id="backup_ftp_settings_panel_body" {if $settings.use_backup_ftp != '1'}style="display:none;"{/if}>
            <p>{$lang.ftp_backup_desc}</p>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="backup_ftp_host">{$lang.backup_ftp_host}</label>
                        <input type="text" name="backup_ftp_host" id="backup_ftp_host" value="{$settings.backup_ftp_host|escape:'html'}" class="form-control">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="backup_ftp_port">{$lang.backup_ftp_port}</label>
                        <input type="number" name="backup_ftp_port" id="backup_ftp_port" value="{$settings.backup_ftp_port|escape:'html'}" class="form-control" placeholder="21" min="1" max="65535">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="backup_ftp_passive_mode">{$lang.backup_ftp_passive_mode}</label>
                        <div>
                            <label class="toggle-switch">
                                <input type="checkbox" name="backup_ftp_passive_mode" id="backup_ftp_passive_mode" value="1" {if $settings.backup_ftp_passive_mode == '1'}checked{/if}>
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="backup_ftp_username">{$lang.backup_ftp_username}</label>
                        <input type="text" name="backup_ftp_username" id="backup_ftp_username" value="{$settings.backup_ftp_username|escape:'html'}" class="form-control" autocomplete="off">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="backup_ftp_password">{$lang.backup_ftp_password}</label>
                        <input type="password" name="backup_ftp_password" id="backup_ftp_password" value="" class="form-control" placeholder="Değiştirmek istemiyorsanız boş bırakın" autocomplete="new-password">
                        {if $settings.backup_ftp_password != ''}<small class="text-muted">Mevcut bir şifre kayıtlı.</small>{/if}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="backup_ftp_path_abone_rehber">{$lang.backup_ftp_path_abone_rehber} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.tooltip_ftp_path|escape:'html'}"></i></label>
                        <input type="text" name="backup_ftp_path_abone_rehber" id="backup_ftp_path_abone_rehber" value="{$settings.backup_ftp_path_abone_rehber|escape:'html'}" class="form-control" placeholder="/ARSIV/REHBER/">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="backup_ftp_path_abone_hareket">{$lang.backup_ftp_path_abone_hareket} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.tooltip_ftp_path|escape:'html'}"></i></label>
                        <input type="text" name="backup_ftp_path_abone_hareket" id="backup_ftp_path_abone_hareket" value="{$settings.backup_ftp_path_abone_hareket|escape:'html'}" class="form-control" placeholder="/ARSIV/HAREKET/">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="backup_ftp_path_personel_excel">{$lang.backup_ftp_path_personel_excel} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.tooltip_ftp_path|escape:'html'}"></i></label>
                        <input type="text" name="backup_ftp_path_personel_excel" id="backup_ftp_path_personel_excel" value="{$settings.backup_ftp_path_personel_excel|escape:'html'}" class="form-control" placeholder="/ARSIV/PERSONEL/">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-info btn-sm" onclick="btkTestFtpConnection('backup', 'backup_ftp_test_result_area');">
                    <i class="fas fa-plug"></i> {$lang.backup_ftp_test_connection}
                </button>
                <span id="backup_ftp_test_result_area" style="margin-left:10px;"></span>
            </div>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="far fa-clock"></i> {$lang.section_cron_jobs}</h3>
        </div>
        <div class="panel-body">
            <p>{$lang.cron_desc}</p>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="cron_abone_rehber_time">{$lang.cron_abone_rehber_time} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.cron_abone_rehber_time_desc|escape:'html'}"></i></label>
                        <input type="text" name="cron_abone_rehber_time" id="cron_abone_rehber_time" value="{$settings.cron_abone_rehber_time|escape:'html'}" class="form-control" placeholder="0 10 1 * *">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="cron_abone_hareket_time">{$lang.cron_abone_hareket_time} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.cron_abone_hareket_time_desc|escape:'html'}"></i></label>
                        <input type="text" name="cron_abone_hareket_time" id="cron_abone_hareket_time" value="{$settings.cron_abone_hareket_time|escape:'html'}" class="form-control" placeholder="0 1 * * *">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="cron_personel_excel_time">{$lang.cron_personel_excel_time} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.cron_personel_excel_time_desc|escape:'html'}"></i></label>
                        <input type="text" name="cron_personel_excel_time" id="cron_personel_excel_time" value="{$settings.cron_personel_excel_time|escape:'html'}" class="form-control" placeholder="0 16 L 6,12 *">
                    </div>
                </div>
            </div>
            <div class="alert alert-info">
                <p><strong>{$lang.cron_command_info}</strong></p>
                <ul style="font-family: monospace; font-size: 0.9em;">
                    <li>{$lang.cron_command_abone_rehber|replace:'/path/to/whmcs/':$smarty.const.ROOTDIR}</li>
                    <li>{$lang.cron_command_abone_hareket|replace:'/path/to/whmcs/':$smarty.const.ROOTDIR}</li>
                    <li>{$lang.cron_command_personel_excel|replace:'/path/to/whmcs/':$smarty.const.ROOTDIR}</li>
                </ul>
                <em>{$lang.cron_path_notice} (Yukarıda otomatik olarak güncellenmiştir.)</em>
            </div>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$lang.section_reporting_options}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="send_empty_reports">{$lang.send_empty_reports} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.send_empty_reports_desc|escape:'html'}"></i></label>
                        <div>
                            <label class="toggle-switch">
                                <input type="checkbox" name="send_empty_reports" id="send_empty_reports" value="1" {if $settings.send_empty_reports == '1'}checked{/if}>
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="personel_excel_filename_format">{$lang.personel_excel_filename_format} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.personel_excel_filename_format_desc|escape:'html'}"></i></label>
                        <select name="personel_excel_filename_format" id="personel_excel_filename_format" class="form-control">
                            <option value="default" {if $settings.personel_excel_filename_format == 'default'}selected{/if}>{$lang.personel_excel_format_default}</option>
                            <option value="yearly_period" {if $settings.personel_excel_filename_format == 'yearly_period'}selected{/if}>{$lang.personel_excel_format_yearly_period}</option>
                            <option value="yearly_monthly" {if $settings.personel_excel_filename_format == 'yearly_monthly'}selected{/if}>{$lang.personel_excel_format_yearly_monthly}</option>
                            <option value="timestamp" {if $settings.personel_excel_filename_format == 'timestamp'}selected{/if}>{$lang.personel_excel_format_timestamp}</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="log_level">{$lang.log_level} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.log_level_desc|escape:'html'}"></i></label>
                        <select name="log_level" id="log_level" class="form-control">
                            <option value="error" {if $settings.log_level == 'error'}selected{/if}>{$lang.log_level_error}</option>
                            <option value="info" {if $settings.log_level == 'info'}selected{/if}>{$lang.log_level_info}</option>
                            <option value="debug" {if $settings.log_level == 'debug'}selected{/if}>{$lang.log_level_debug}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="hareket_report_days_to_keep_in_live">{$lang.hareket_report_days_to_keep_in_live} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.hareket_report_days_to_keep_in_live_desc|escape:'html'} {$lang.tooltip_hareket_days_to_keep|escape:'html'}"></i></label>
                        <input type="number" name="hareket_report_days_to_keep_in_live" id="hareket_report_days_to_keep_in_live" value="{$settings.hareket_report_days_to_keep_in_live|escape:'html'}" class="form-control" min="2" placeholder="örn: 7">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="max_execution_time_cron">{$lang.max_execution_time_cron} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.max_execution_time_cron_desc|escape:'html'}"></i></label>
                        <input type="number" name="max_execution_time_cron" id="max_execution_time_cron" value="{$settings.max_execution_time_cron|escape:'html'}" class="form-control" min="30" placeholder="örn: 300">
                    </div>
                </div>
                 <div class="col-md-4">
                    <div class="form-group">
                        <label for="auto_retry_failed_ftp">{$lang.auto_retry_failed_ftp} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.auto_retry_failed_ftp_desc|escape:'html'}"></i></label>
                        <div>
                            <label class="toggle-switch">
                                <input type="checkbox" name="auto_retry_failed_ftp" id="auto_retry_failed_ftp" value="1" {if $settings.auto_retry_failed_ftp == '1'}checked{/if}>
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
             <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="retry_failed_ftp_count">{$lang.retry_failed_ftp_count} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.retry_failed_ftp_count_desc|escape:'html'}"></i></label>
                        <input type="number" name="retry_failed_ftp_count" id="retry_failed_ftp_count" value="{$settings.retry_failed_ftp_count|escape:'html'}" class="form-control" min="0" placeholder="örn: 3">
                    </div>
                </div>
                <div class="col-md-8">
                    {* Boş sütun veya gelecekteki ayarlar için *}
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-danger">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-exclamation-triangle"></i> Modül Verilerini Yönetme</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="delete_tables_on_deactivate_confirm">{$lang.deactivation_confirm_delete_tables} <i class="fas fa-info-circle text-danger" data-toggle="tooltip" title="Bu seçenek işaretliyse, modül WHMCS eklentiler sayfasından 'Devre Dışı Bırak'ıldığında TÜM modül verileri (ayarlar, loglar, rapor arşivleri vb.) SİLİNECEKTİR. Dikkatli kullanın!"></i></label>
                <div>
                    <label class="toggle-switch">
                        <input type="checkbox" name="delete_tables_on_deactivate_confirm" id="delete_tables_on_deactivate_confirm" value="1" {if $settings.delete_tables_on_deactivate_confirm == '1'}checked{/if}>
                        <span class="slider round"></span>
                    </label>
                    <span class="text-danger" style="margin-left: 5px;"><strong>{$lang.yes}, modül devre dışı bırakıldığında tüm verileri sil.</strong></span>
                </div>
                <small class="text-muted">Bu ayar işaretli olsa bile, modülü devre dışı bırakırken size ek bir JavaScript onayı sorulacaktır (eğer tarayıcınızda JS etkinse). Onay vermezseniz veriler silinmez.</small>
            </div>
            <p class_text-muted>
                <strong>Not:</strong> Modülü WHMCS Eklentiler sayfasından "Devre Dışı Bırak" yerine doğrudan "Kaldır" (Uninstall) seçeneği ile kaldırırsanız,
                WHMCS'in standart davranışı olarak modül dosyaları silinir ancak veritabanı tabloları genellikle kalır.
                Veritabanı tablolarını da tamamen kaldırmak için yukarıdaki seçeneği işaretleyip, ardından "Devre Dışı Bırak" işlemini yapmanız ve gelen onayı kabul etmeniz önerilir.
            </p>
        </div>
    </div>


    <div class="form-group text-center">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$lang.save_changes}</button>
    </div>
</form>

{* Bu script bloğu btk_admin_scripts.js dosyasına taşınabilir *}
{* Önceki bölümde zaten vardı, burada tekrar eklemeye gerek yok eğer birleştirilecekse. *}
{* Ancak her bölümün kendi içinde tam olması adına tekrar ekliyorum. *}
<script type="text/javascript">
$(document).ready(function(){
    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body' // Tooltip'lerin bazen yanlış konumlanmasını engeller
    });

    // Yedek FTP ayarlarını göster/gizle
    $('#use_backup_ftp').change(function(){
        if($(this).is(":checked")) {
            $('#backup_ftp_settings_panel_body').slideDown('fast');
        } else {
            $('#backup_ftp_settings_panel_body').slideUp('fast');
        }
    });
    // Sayfa yüklendiğinde de durumu kontrol et (eğer checkbox işaretli geliyorsa)
    if (!$('#use_backup_ftp').is(":checked")) {
         $('#backup_ftp_settings_panel_body').hide();
    }


    // FTP Test Fonksiyonu (index.tpl'deki ile benzer, merkezi bir JS dosyasına taşınabilir)
    // Global bir fonksiyona ihtiyaç var, bu yüzden window altına ekliyorum.
    window.btkTestFtpConnection = function(ftpType, indicatorId) {
        var indicator = $('#' + indicatorId);
        var button = $('button[onclick*="btkTestFtpConnection(\'' + ftpType + '\'"]');
        var originalButtonHtml = button.html();
        
        indicator.html('<span class="text-info">{$lang.ftp_status_checking|escape:'javascript'} <i class="fas fa-spinner fa-spin"></i></span>');
        button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> {$lang.please_wait|escape:'javascript'}');

        var formData = {
            ftp_type: ftpType,
            token: '{$csrfToken}' // Bu token _output'tan gelen genel token
        };
        // Test edilecek güncel form verilerini de gönder
        if (ftpType === 'main') {
            formData.host = $('#ftp_host').val();
            formData.port = $('#ftp_port').val();
            formData.username = $('#ftp_username').val();
            formData.password = $('#ftp_password').val(); // Test için şifre gönderiliyor, PHP tarafında DB'den okumak daha güvenli olabilir.
            formData.passive_mode = $('#ftp_passive_mode').is(':checked') ? '1' : '0';
        } else if (ftpType === 'backup') {
            formData.host = $('#backup_ftp_host').val();
            formData.port = $('#backup_ftp_port').val();
            formData.username = $('#backup_ftp_username').val();
            formData.password = $('#backup_ftp_password').val();
            formData.passive_mode = $('#backup_ftp_passive_mode').is(':checked') ? '1' : '0';
        }

        $.ajax({
            url: '{$modulelink}&action=test_ftp_connection&ajax=1', // _output'ta bu action'ı yakalayacağız
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    indicator.html('<span class="text-success"><i class="fas fa-check-circle"></i> ' + $('<div>').text(data.message).html() + '</span>');
                } else {
                    indicator.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + $('<div>').text(data.message).html() + '</span>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                indicator.html('<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> {$lang.error_unexpected|escape:'javascript'} (AJAX: ' + $('<div>').text(textStatus).html() + ')</span>');
            },
            complete: function() {
                button.prop('disabled', false).html(originalButtonHtml);
            }
        });
    }
});
</script>

    {* --- FORMUN SONU --- *}