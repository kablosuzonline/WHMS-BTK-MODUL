{*
    WHMCS BTK Raporlama Modülü - Genel Ayarlar Şablonu
    modules/addons/btkreports/templates/admin/config.tpl
    Sürüm: 7.0.2
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version_placeholder}" rel="stylesheet">
<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=save_config" id="btkConfigForm" class="form-horizontal">
    <input type="hidden" name="token" value="{$csrfToken}">

    {* --- Operatör ve Genel Ayarlar --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-cog"></i> {$LANG.operatorInfoTitle}</h3>
        </div>
        <div class="panel-body">
             <div class="form-group">
                <label for="operator_code" class="col-sm-3 control-label required">{$LANG.operatorCodeLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="operator_code" id="operator_code" value="{$settings.operator_code|escape}" class="form-control" required>
                    <span class="help-block">{$LANG.operatorCodeTooltip}</span>
                </div>
            </div>
             <div class="form-group">
                <label for="operator_name" class="col-sm-3 control-label required">{$LANG.operatorNameLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="operator_name" id="operator_name" value="{$settings.operator_name|escape}" class="form-control" required>
                    <span class="help-block">{$LANG.operatorNameTooltip}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="operator_title" class="col-sm-3 control-label">{$LANG.operatorTitleLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="operator_title" id="operator_title" value="{$settings.operator_title|escape}" class="form-control" placeholder="{$LANG.operatorTitlePlaceholder|escape}">
                    <span class="help-block">{$LANG.operatorTitleHelpText}</span>
                </div>
            </div>
        </div>
    </div>

    {* --- Ana BTK FTP Sunucu Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.mainFtpSettingsTitle}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label for="main_ftp_host" class="col-sm-3 control-label">{$LANG.ftpHostLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="main_ftp_host" id="main_ftp_host" value="{$settings.main_ftp_host|escape}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="main_ftp_user" class="col-sm-3 control-label">{$LANG.ftpUserLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="main_ftp_user" id="main_ftp_user" value="{$settings.main_ftp_user|escape}" class="form-control">
                </div>
            </div>
             <div class="form-group">
                <label for="main_ftp_pass" class="col-sm-3 control-label">{$LANG.ftpPassLabel}</label>
                <div class="col-sm-8">
                    <input type="password" name="main_ftp_pass" id="main_ftp_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassHelpText|escape}">
                </div>
            </div>
             <div class="form-group">
                <label for="main_ftp_port" class="col-sm-3 control-label">{$LANG.ftpPort}</label>
                <div class="col-sm-3">
                    <input type="number" name="main_ftp_port" id="main_ftp_port" value="{$settings.main_ftp_port|default:21}" class="form-control">
                </div>
                 <div class="col-sm-5" style="padding-top:7px;">
                    <input type="checkbox" name="main_ftp_ssl" id="main_ftp_ssl" value="1" {if $settings.main_ftp_ssl == '1'}checked{/if} data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-on="{$LANG.yes}" data-off="{$LANG.no}">
                    <label for="main_ftp_ssl" style="font-weight:normal; margin-left:10px;">{$LANG.ftpSSL}</label>
                 </div>
            </div>
            <div class="form-group">
                 <div class="col-sm-offset-3 col-sm-8">
                     <button type="button" class="btn btn-info btk-ftp-test-btn" data-ftp-type="main"><i class="fas fa-plug"></i> {$LANG.testFtpConnectionButton}</button>
                     <span id="main_ftp_test_result" class="help-block" style="display:inline; margin-left:15px;"></span>
                 </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.ftpRehberPathLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="main_ftp_rehber_path" value="{$settings.main_ftp_rehber_path|default:'/REHBER/'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.ftpHareketPathLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="main_ftp_hareket_path" value="{$settings.main_ftp_hareket_path|default:'/HAREKET/'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.ftpPersonelPathLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="main_ftp_personel_path" value="{$settings.main_ftp_personel_path|default:'/PERSONEL/'}" class="form-control">
                </div>
            </div>
        </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title">
                <input type="checkbox" name="backup_ftp_enabled" id="backup_ftp_enabled" value="1" {if $settings.backup_ftp_enabled == '1'}checked{/if} data-toggle="toggle" data-onstyle="success" data-offstyle="danger">
                <label for="backup_ftp_enabled" style="font-weight:600; cursor:pointer; margin-left:10px;">
                    <i class="fas fa-archive"></i> {$LANG.backupFtpSettingsTitle}
                </label>
            </h3>
        </div>
        <div class="panel-body" id="backup_ftp_details" {if !$settings.backup_ftp_enabled}style="display:none;"{/if}>
             <div class="form-group">
                <label for="backup_ftp_host" class="col-sm-3 control-label">{$LANG.ftpHostLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="backup_ftp_host" id="backup_ftp_host" value="{$settings.backup_ftp_host|escape}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="backup_ftp_user" class="col-sm-3 control-label">{$LANG.ftpUserLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="backup_ftp_user" id="backup_ftp_user" value="{$settings.backup_ftp_user|escape}" class="form-control">
                </div>
            </div>
             <div class="form-group">
                <label for="backup_ftp_pass" class="col-sm-3 control-label">{$LANG.ftpPassLabel}</label>
                <div class="col-sm-8">
                    <input type="password" name="backup_ftp_pass" id="backup_ftp_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassHelpText|escape}">
                </div>
            </div>
             <div class="form-group">
                <label for="backup_ftp_port" class="col-sm-3 control-label">{$LANG.ftpPort}</label>
                <div class="col-sm-3">
                    <input type="number" name="backup_ftp_port" id="backup_ftp_port" value="{$settings.backup_ftp_port|default:21}" class="form-control">
                </div>
                 <div class="col-sm-5" style="padding-top:7px;">
                    <input type="checkbox" name="backup_ftp_ssl" id="backup_ftp_ssl" value="1" {if $settings.backup_ftp_ssl == '1'}checked{/if} data-toggle="toggle" data-onstyle="success" data-offstyle="danger" data-on="{$LANG.yes}" data-off="{$LANG.no}">
                    <label for="backup_ftp_ssl" style="font-weight:normal; margin-left:10px;">{$LANG.ftpSSL}</label>
                 </div>
            </div>
            <div class="form-group">
                 <div class="col-sm-offset-3 col-sm-8">
                     <button type="button" class="btn btn-info btk-ftp-test-btn" data-ftp-type="backup"><i class="fas fa-plug"></i> {$LANG.testFtpConnectionButton}</button>
                     <span id="backup_ftp_test_result" class="help-block" style="display:inline; margin-left:15px;"></span>
                 </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.ftpRehberPathLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="backup_ftp_rehber_path" value="{$settings.backup_ftp_rehber_path|default:'/REHBER_YEDEK/'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.ftpHareketPathLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="backup_ftp_hareket_path" value="{$settings.backup_ftp_hareket_path|default:'/HAREKET_YEDEK/'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.ftpPersonelPathLabel}</label>
                <div class="col-sm-8">
                    <input type="text" name="backup_ftp_personel_path" value="{$settings.backup_ftp_personel_path|default:'/PERSONEL_YEDEK/'}" class="form-control">
                </div>
            </div>
        </div>
    </div>

    {* BTK Yetkilendirme Seçenekleri *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-shield"></i> {$LANG.btkAuthTypesTitle}</h3>
        </div>
        <div class="panel-body">
            <p class="help-block">{$LANG.btkAuthTypesHelpText}</p>
            <div class="row">
                {foreach from=$yetki_turleri item=yt}
                <div class="col-md-6 form-group" style="margin-left:0; margin-right:0;">
                     <input type="checkbox" name="yetkiler[{$yt.kod}]" id="yetki_{$yt.kod|escape:'url'}" {if $yt.aktif}checked{/if} data-toggle="toggle" data-onstyle="success" data-offstyle="danger">
                     <label for="yetki_{$yt.kod|escape:'url'}" style="margin-left:10px;">{$yt.ad} ({$yt.kod})</label>
                </div>
                {/foreach}
            </div>
        </div>
    </div>

    {* Otomatik Raporlama (Cron Job) Ayarları *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-clock"></i> {$LANG.cronSettingsTitle}</h3>
        </div>
        <div class="panel-body">
            <p class="help-block">{$LANG.cronSettingsTooltip}</p>
            <div class="form-group">
                <label for="rehber_cron_schedule" class="col-sm-3 control-label">{$LANG.cronRehberScheduleLabel}</label>
                <div class="col-sm-7">
                    <input type="text" name="rehber_cron_schedule" id="rehber_cron_schedule" value="{$settings.rehber_cron_schedule|default:'0 10 1 * *'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="hareket_cron_schedule" class="col-sm-3 control-label">{$LANG.cronHareketScheduleLabel}</label>
                <div class="col-sm-7">
                    <input type="text" name="hareket_cron_schedule" id="hareket_cron_schedule" value="{$settings.hareket_cron_schedule|default:'0 1 * * *'}" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="personel_cron_schedule" class="col-sm-3 control-label">{$LANG.cronPersonelScheduleLabel}</label>
                <div class="col-sm-7">
                    <input type="text" name="personel_cron_schedule" id="personel_cron_schedule" value="{$settings.personel_cron_schedule|default:'0 16 L 6,12 *'}" class="form-control">
                    <span class="help-block">{$LANG.cronPersonelHelpText}</span>
                </div>
            </div>
        </div>
    </div>
    
    {* Diğer Ayarlar *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$LANG.otherSettingsTitle}</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.sendEmptyReportsLabel}</label>
                <div class="col-sm-7">
                    <input type="checkbox" name="send_empty_reports" value="1" {if $settings.send_empty_reports == '1'}checked{/if} data-toggle="toggle" data-onstyle="success" data-offstyle="danger">
                </div>
            </div>
             <div class="form-group">
                <label class="col-sm-3 control-label">{$LANG.deleteDataOnDeactivateLabel}</label>
                <div class="col-sm-7">
                     <input type="checkbox" name="delete_data_on_deactivate" value="1" {if $settings.delete_data_on_deactivate == '1'}checked{/if} data-toggle="toggle" data-onstyle="success" data-offstyle="danger">
                     <span class="help-block text-danger">{$LANG.deleteDataOnDeactivateTooltip}</span>
                </div>
            </div>
            <div class="form-group">
                <label for="hareket_live_table_days" class="col-sm-3 control-label">{$LANG.hareketLiveTableDayLimitLabel}</label>
                <div class="col-sm-3">
                    <input type="number" name="hareket_live_table_days" id="hareket_live_table_days" value="{$settings.hareket_live_table_days|default:7}" class="form-control" min="1">
                </div>
            </div>
             <div class="form-group">
                <label for="hareket_archive_table_days" class="col-sm-3 control-label">{$LANG.hareketArchiveTableDayLimitLabel}</label>
                <div class="col-sm-3">
                    <input type="number" name="hareket_archive_table_days" id="hareket_archive_table_days" value="{$settings.hareket_archive_table_days|default:180}" class="form-control" min="1">
                </div>
            </div>
        </div>
    </div>

    <div class="form-group text-center" style="margin-top: 20px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>