// --- BÖLÜM 1 / 3 BAŞI - (config.tpl, Operatör Bilgileri ve Ana FTP Ayarları)
{*
    WHMCS BTK Raporlama Modülü - Genel Ayarlar Sayfası
    Dosya: templates/admin/config.tpl
*}

{if $flashMessage}
    {if $flashMessage.type == 'success'}
        <div class="alert alert-success text-center" role="alert">
            <i class="fas fa-check-circle"></i> {$flashMessage.message}
        </div>
    {elseif $flashMessage.type == 'error'}
        <div class="alert alert-danger text-center" role="alert">
            <i class="fas fa-exclamation-circle"></i> {$flashMessage.message}
        </div>
    {else}
        <div class="alert alert-info text-center" role="alert">
            <i class="fas fa-info-circle"></i> {$flashMessage.message}
        </div>
    {/if}
{/if}

<form method="post" action="{$modulelink}&action=save_config" id="btkConfigForm">
    <input type="hidden" name="token" value="{$csrfToken}"> {* CSRF Token - btkreports.php'den atanmalı *}

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-tie"></i> {$LANG.operatorInfoTitle}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="operator_code">{$LANG.operatorCodeLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.operatorCodeTooltip|escape}"></i></label>
                        <input type="text" name="settings[operator_code]" id="operator_code" value="{$settings.operator_code|escape}" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="operator_name">{$LANG.operatorNameLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.operatorNameTooltip|escape}"></i></label>
                        <input type="text" name="settings[operator_name]" id="operator_name" value="{$settings.operator_name|escape}" class="form-control" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="operator_title">{$LANG.operatorTitleLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.operatorTitleTooltip|escape}"></i></label>
                        <input type="text" name="settings[operator_title]" id="operator_title" value="{$settings.operator_title|escape}" class="form-control" placeholder="{$LANG.operatorTitlePlaceholder}">
                        <span class="help-block">{$LANG.operatorTitleHelpText}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-upload"></i> {$LANG.mainFtpSettingsTitle} (BTK FTP)</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ftp_host_main">{$LANG.ftpHostLabel}</label>
                        <input type="text" name="settings[ftp_host_main]" id="ftp_host_main" value="{$settings.ftp_host_main|escape}" class="form-control">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ftp_user_main">{$LANG.ftpUserLabel}</label>
                        <input type="text" name="settings[ftp_user_main]" id="ftp_user_main" value="{$settings.ftp_user_main|escape}" class="form-control">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ftp_pass_main">{$LANG.ftpPassLabel}</label>
                        <input type="password" name="settings[ftp_pass_main]" id="ftp_pass_main" value="{$settings.ftp_pass_main|escape}" class="form-control" autocomplete="new-password">
                         <span class="help-block">{$LANG.ftpPassHelpText}</span>
                    </div>
                </div>
                 <div class="col-md-6">
                    <button type="button" id="btnTestMainFtp" class="btn btn-info" style="margin-top: 25px;">
                        <i class="fas fa-plug"></i> {$LANG.testFtpConnectionButton}
                    </button>
                    <span id="mainFtpTestResult" style="margin-left:10px;"></span>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="ftp_rehber_path_main">{$LANG.ftpRehberPathLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.ftpPathTooltip|escape}"></i></label>
                        <input type="text" name="settings[ftp_rehber_path_main]" id="ftp_rehber_path_main" value="{$settings.ftp_rehber_path_main|default:'/REHBER/'|escape}" class="form-control">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="ftp_hareket_path_main">{$LANG.ftpHareketPathLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.ftpPathTooltip|escape}"></i></label>
                        <input type="text" name="settings[ftp_hareket_path_main]" id="ftp_hareket_path_main" value="{$settings.ftp_hareket_path_main|default:'/HAREKET/'|escape}" class="form-control">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="ftp_personel_path_main">{$LANG.ftpPersonelPathLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.ftpPathTooltip|escape}"></i></label>
                        <input type="text" name="settings[ftp_personel_path_main]" id="ftp_personel_path_main" value="{$settings.ftp_personel_path_main|default:'/PERSONEL/'|escape}" class="form-control">
                    </div>
                </div>
            </div>
        </div>
    </div>
// --- BÖLÜM 1 / 3 SONU - (config.tpl, Operatör Bilgileri ve Ana FTP Ayarları)

// --- BÖLÜM 2 / 3 BAŞI - (config.tpl, Yedek FTP Ayarları ve BTK Yetki Türleri Seçimi)
    <div class="form-group">
        <label>{$LANG.useBackupFtpLabel}</label>
        <div>
            <input type="checkbox" name="settings[ftp_use_backup]" id="ftp_use_backup" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" {if $settings.ftp_use_backup == '1' || $settings.ftp_use_backup == 'on'}checked{/if}>
        </div>
    </div>

    <div id="backupFtpSettings" {if !($settings.ftp_use_backup == '1' || $settings.ftp_use_backup == 'on')}style="display:none;"{/if}>
        <div class="panel panel-warning">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-archive"></i> {$LANG.backupFtpSettingsTitle}</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="ftp_host_backup">{$LANG.ftpHostLabel}</label>
                            <input type="text" name="settings[ftp_host_backup]" id="ftp_host_backup" value="{$settings.ftp_host_backup|escape}" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="ftp_user_backup">{$LANG.ftpUserLabel}</label>
                            <input type="text" name="settings[ftp_user_backup]" id="ftp_user_backup" value="{$settings.ftp_user_backup|escape}" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="ftp_pass_backup">{$LANG.ftpPassLabel}</label>
                            <input type="password" name="settings[ftp_pass_backup]" id="ftp_pass_backup" value="{$settings.ftp_pass_backup|escape}" class="form-control" autocomplete="new-password">
                             <span class="help-block">{$LANG.ftpPassHelpText}</span>
                        </div>
                    </div>
                     <div class="col-md-6">
                        <button type="button" id="btnTestBackupFtp" class="btn btn-info" style="margin-top: 25px;">
                            <i class="fas fa-plug"></i> {$LANG.testFtpConnectionButton}
                        </button>
                        <span id="backupFtpTestResult" style="margin-left:10px;"></span>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="ftp_rehber_path_backup">{$LANG.ftpRehberPathLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.ftpPathTooltip|escape}"></i></label>
                            <input type="text" name="settings[ftp_rehber_path_backup]" id="ftp_rehber_path_backup" value="{$settings.ftp_rehber_path_backup|default:'/REHBER/'|escape}" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="ftp_hareket_path_backup">{$LANG.ftpHareketPathLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.ftpPathTooltip|escape}"></i></label>
                            <input type="text" name="settings[ftp_hareket_path_backup]" id="ftp_hareket_path_backup" value="{$settings.ftp_hareket_path_backup|default:'/HAREKET/'|escape}" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="ftp_personel_path_backup">{$LANG.ftpPersonelPathLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.ftpPathTooltip|escape}"></i></label>
                            <input type="text" name="settings[ftp_personel_path_backup]" id="ftp_personel_path_backup" value="{$settings.ftp_personel_path_backup|default:'/PERSONEL/'|escape}" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-tasks"></i> {$LANG.btkAuthTypesTitle}</h3>
        </div>
        <div class="panel-body">
            <p>{$LANG.btkAuthTypesHelpText}</p>
            <div class="row">
                {if $yetkiTurleri}
                    {assign var="column_count" value=0}
                    {foreach from=$yetkiTurleri item=yetki}
                        {if $column_count % 2 == 0 && $column_count != 0}
                            </div><div class="row">
                        {/if}
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="yetki_{$yetki->yetki_kodu}">
                                    {$yetki->yetki_adi} ({$yetki->yetki_kodu})
                                    {if $yetki->is_bildirim === 1} (B) {elseif $yetki->is_bildirim === 0} (K) {/if}
                                    <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.yetkiInfoPrefix|cat:$yetki->yetki_adi|escape}"></i>
                                </label>
                                <div>
                                    <input type="checkbox" name="yetkiler_aktif[]" id="yetki_{$yetki->yetki_kodu}" value="{$yetki->yetki_kodu}" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.active}" data-off="{$LANG.passive}" {if $yetki->aktif == 1}checked{/if}>
                                </div>
                            </div>
                        </div>
                        {assign var="column_count" value=$column_count+1}
                    {/foreach}
                {else}
                    <div class="col-md-12">
                        <p class="text-danger">{$LANG.noAuthTypesFound}</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
// --- BÖLÜM 2 / 3 SONU - (config.tpl, Yedek FTP Ayarları ve BTK Yetki Türleri Seçimi)

// --- BÖLÜM 3 / 3 BAŞI - (config.tpl, Diğer Ayarlar, Cron Zamanlamaları ve Kaydet Butonu)
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-cogs"></i> {$LANG.otherSettingsTitle}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label>{$LANG.sendEmptyReportsLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.sendEmptyReportsTooltip|escape}"></i></label>
                <div>
                     <input type="checkbox" name="settings[send_empty_reports]" id="send_empty_reports" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" {if $settings.send_empty_reports == '1' || $settings.send_empty_reports == 'on'}checked{/if}>
                </div>
            </div>
            <hr>
             <div class="form-group">
                <label>{$LANG.personelFilenameAddYearMonthMainLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.personelFilenameAddYearMonthTooltip|escape}"></i></label>
                <div>
                     <input type="checkbox" name="settings[personel_filename_add_yearmonth_main]" id="personel_filename_add_yearmonth_main" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" {if $settings.personel_filename_add_yearmonth_main == '1' || $settings.personel_filename_add_yearmonth_main == 'on'}checked{/if}>
                </div>
            </div>
            {if $settings.ftp_use_backup == '1' || $settings.ftp_use_backup == 'on'}
            <div class="form-group">
                <label>{$LANG.personelFilenameAddYearMonthBackupLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.personelFilenameAddYearMonthTooltip|escape}"></i></label>
                <div>
                     <input type="checkbox" name="settings[personel_filename_add_yearmonth_backup]" id="personel_filename_add_yearmonth_backup" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" {if $settings.personel_filename_add_yearmonth_backup == '1' || $settings.personel_filename_add_yearmonth_backup == 'on'}checked{/if}>
                </div>
            </div>
            {/if}
            <hr>
            <div class="form-group">
                <label>{$LANG.deleteDataOnDeactivateLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.deleteDataOnDeactivateTooltip|escape}" style="color:red;"></i></label>
                <div>
                     <input type="checkbox" name="settings[delete_data_on_deactivate]" id="delete_data_on_deactivate" class="btk-toggle" data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" data-onstyle="danger" data-offstyle="success" {if $settings.delete_data_on_deactivate == '1' || $settings.delete_data_on_deactivate == 'on'}checked{/if}>
                </div>
            </div>
            <hr>
            <h4>{$LANG.cronSettingsTitle} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.cronSettingsTooltip|escape}"></i></h4>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="cron_rehber_schedule">{$LANG.cronRehberScheduleLabel}</label>
                        <input type="text" name="cron[rehber]" id="cron_rehber_schedule" value="{$cronSchedules.rehber|default:'0 10 1 * *'|escape}" class="form-control" placeholder="* * * * *">
                         <span class="help-block"><a href="https://crontab.guru/" target="_blank">crontab.guru</a></span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="cron_hareket_schedule">{$LANG.cronHareketScheduleLabel}</label>
                        <input type="text" name="cron[hareket]" id="cron_hareket_schedule" value="{$cronSchedules.hareket|default:'0 1 * * *'|escape}" class="form-control" placeholder="* * * * *">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="cron_personel_schedule">{$LANG.cronPersonelScheduleLabel}</label>
                        <input type="text" name="cron[personel]" id="cron_personel_schedule" value="{$cronSchedules.personel|default:'0 16 L 6,12 *'|escape}" class="form-control" placeholder="* * * * *">
                         <span class="help-block">{$LANG.cronPersonelHelpText}</span>
                    </div>
                </div>
            </div>
             <hr>
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="hareket_live_table_day_limit">{$LANG.hareketLiveTableDayLimitLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.hareketLiveTableDayLimitTooltip|escape}"></i></label>
                        <input type="number" name="settings[hareket_live_table_day_limit]" id="hareket_live_table_day_limit" value="{$settings.hareket_live_table_day_limit|default:7}" class="form-control" min="1">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="hareket_archive_table_day_limit">{$LANG.hareketArchiveTableDayLimitLabel} <i class="fas fa-info-circle" data-toggle="tooltip" title="{$LANG.hareketArchiveTableDayLimitTooltip|escape}"></i></label>
                        <input type="number" name="settings[hareket_archive_table_day_limit]" id="hareket_archive_table_day_limit" value="{$settings.hareket_archive_table_day_limit|default:180}" class="form-control" min="1">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="form-group text-center">
        <button type="submit" class="btn btn-success btn-lg"><i class="fas fa-save"></i> {$LANG.saveChangesButton}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg"><i class="fas fa-times"></i> {$LANG.cancelButton}</a>
    </div>
</form>

{* Gerekli JavaScript kodları btk_admin_scripts.js içine taşınabilir veya burada kalabilir *}
<script type="text/javascript">
$(document).ready(function() {
    // Bootstrap Toggle switch'lerini etkinleştir
    $('.btk-toggle').bootstrapToggle();

    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip();

    // Yedek FTP ayarlarını göster/gizle
    $('#ftp_use_backup').change(function() {
        if($(this).is(':checked')) {
            $('#backupFtpSettings').slideDown();
        } else {
            $('#backupFtpSettings').slideUp();
        }
    }).trigger('change'); // Sayfa yüklendiğinde de durumu kontrol et

    // FTP Bağlantı Testi Butonları
    $('#btnTestMainFtp').click(function() {
        var button = $(this);
        var resultSpan = $('#mainFtpTestResult');
        resultSpan.html('<i class="fas fa-spinner fa-spin"></i> {$LANG.testingFtpConnection}');
        button.prop('disabled', true);

        $.post("{$modulelink}&ajax=1&action=test_ftp_connection", {
            {literal}
            csrfToken: getWhmcsCSRFToken(),
            ftp_type: 'main',
            host: $('#ftp_host_main').val(),
            user: $('#ftp_user_main').val(),
            pass: $('#ftp_pass_main').val()
            {/literal}
        }, function(data) {
            if (data.status === 'success') {
                resultSpan.html('<span class="text-success"><i class="fas fa-check-circle"></i> ' + data.message + '</span>');
            } else {
                resultSpan.html('<span class="text-danger"><i class="fas fa-exclamation-circle"></i> ' + (data.message || '{$LANG.ftpTestFailed}') + '</span>');
            }
        }, "json").fail(function() {
            resultSpan.html('<span class="text-danger"><i class="fas fa-times-circle"></i> {$LANG.ajaxRequestFailed}</span>');
        }).always(function() {
            button.prop('disabled', false);
        });
    });

    $('#btnTestBackupFtp').click(function() {
        var button = $(this);
        var resultSpan = $('#backupFtpTestResult');
        resultSpan.html('<i class="fas fa-spinner fa-spin"></i> {$LANG.testingFtpConnection}');
        button.prop('disabled', true);

        $.post("{$modulelink}&ajax=1&action=test_ftp_connection", {
             {literal}
            csrfToken: getWhmcsCSRFToken(),
            ftp_type: 'backup',
            host: $('#ftp_host_backup').val(),
            user: $('#ftp_user_backup').val(),
            pass: $('#ftp_pass_backup').val()
            {/literal}
        }, function(data) {
            if (data.status === 'success') {
                resultSpan.html('<span class="text-success"><i class="fas fa-check-circle"></i> ' + data.message + '</span>');
            } else {
                resultSpan.html('<span class="text-danger"><i class="fas fa-exclamation-circle"></i> ' + (data.message || '{$LANG.ftpTestFailed}') + '</span>');
            }
        }, "json").fail(function() {
            resultSpan.html('<span class="text-danger"><i class="fas fa-times-circle"></i> {$LANG.ajaxRequestFailed}</span>');
        }).always(function() {
            button.prop('disabled', false);
        });
    });
});
</script>
// --- BÖLÜM 3 / 3 SONU - (config.tpl, Diğer Ayarlar, Cron Zamanlamaları ve Kaydet Butonu)