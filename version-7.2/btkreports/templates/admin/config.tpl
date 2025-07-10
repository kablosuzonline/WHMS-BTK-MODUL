{*
    WHMCS BTK Raporlama Modülü - Genel Ayarlar Şablonu
    Sürüm: 7.2.2 (Modern Arayüz - Hata Düzeltmeleri)
*}

{* Harici kütüphaneleri çağıran bölüm. LOKAL YOLLAR KULLANILIYOR *}
<link href="{$assets_url}/vendor/bootstrap-toggle/css/bootstrap-toggle.min.css" rel="stylesheet">
<script src="{$assets_url}/vendor/bootstrap-toggle/js/bootstrap-toggle.min.js"></script>

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

    {* --- Operatör Bilgileri --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-user-cog"></i> {$LANG.operatorInfoTitle}</h3></div>
        <div class="panel-body">
             <div class="form-group">
                <label for="operator_code" class="col-sm-3 control-label required">{$LANG.operatorCodeLabel}</label>
                <div class="col-sm-8"><input type="text" name="operator_code" id="operator_code" value="{$settings.operator_code|escape}" class="form-control" required><span class="help-block">{$LANG.operatorCodeTooltip}</span></div>
            </div>
             <div class="form-group">
                <label for="operator_name" class="col-sm-3 control-label required">{$LANG.operatorNameLabel}</label>
                <div class="col-sm-8"><input type="text" name="operator_name" id="operator_name" value="{$settings.operator_name|escape}" class="form-control" required><span class="help-block">{$LANG.operatorNameTooltip}</span></div>
            </div>
            <div class="form-group">
                <label for="operator_title" class="col-sm-3 control-label">{$LANG.operatorTitleLabel}</label>
                <div class="col-sm-8"><input type="text" name="operator_title" id="operator_title" value="{$settings.operator_title|escape}" class="form-control"><span class="help-block">{$LANG.operatorTitleTooltip}</span></div>
            </div>
        </div>
    </div>

    {* --- Ana FTP Sunucu Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.mainFtpSettingsTitle}</h3></div>
        <div class="panel-body">
            <div class="form-group"><label for="main_ftp_host" class="col-sm-3 control-label">{$LANG.ftpHostLabel}</label><div class="col-sm-8"><input type="text" name="main_ftp_host" id="main_ftp_host" value="{$settings.main_ftp_host|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="main_ftp_user" class="col-sm-3 control-label">{$LANG.ftpUserLabel}</label><div class="col-sm-8"><input type="text" name="main_ftp_user" id="main_ftp_user" value="{$settings.main_ftp_user|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="main_ftp_pass" class="col-sm-3 control-label">{$LANG.ftpPassLabel}</label><div class="col-sm-8"><input type="password" name="main_ftp_pass" id="main_ftp_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassHelpText|escape}"></div></div>
            <div class="form-group">
                <label for="main_ftp_port" class="col-sm-3 control-label">{$LANG.ftpPort}</label>
                <div class="col-sm-3"><input type="number" name="main_ftp_port" id="main_ftp_port" value="{$settings.main_ftp_port|default:21}" class="form-control"></div>
                <div class="col-sm-5" style="padding-top:7px;"><input type="checkbox" name="main_ftp_ssl" id="main_ftp_ssl" value="1" {if $settings.main_ftp_ssl == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" data-onstyle="success" data-offstyle="danger"></div>
            </div>
            <div class="form-group"><div class="col-sm-offset-3 col-sm-8"><button type="button" class="btn btn-info btk-ftp-test-btn" data-ftp-type="main"><i class="fas fa-plug"></i> {$LANG.testFtpConnectionButton}</button><span id="main_ftp_test_result" class="help-block" style="display:inline; margin-left:15px;"></span></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpRehberPathLabel}</label><div class="col-sm-8"><input type="text" name="main_ftp_rehber_path" value="{$settings.main_ftp_rehber_path|default:'/REHBER/'}" class="form-control"></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpHareketPathLabel}</label><div class="col-sm-8"><input type="text" name="main_ftp_hareket_path" value="{$settings.main_ftp_hareket_path|default:'/HAREKET/'}" class="form-control"></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpPersonelPathLabel}</label><div class="col-sm-8"><input type="text" name="main_ftp_personel_path" value="{$settings.main_ftp_personel_path|default:'/PERSONEL/'}" class="form-control"></div></div>
        </div>
    </div>
    
    {* --- Yedek FTP Sunucu Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><input type="checkbox" name="backup_ftp_enabled" id="backup_ftp_enabled" value="1" {if $settings.backup_ftp_enabled == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.active}" data-off="{$LANG.passive}" data-onstyle="success" data-offstyle="danger"><label for="backup_ftp_enabled" style="font-weight:600; cursor:pointer; margin-left:10px;"><i class="fas fa-archive"></i> {$LANG.backupFtpSettingsTitle}</label></h3></div>
        <div class="panel-body" id="backup_ftp_details" {if !$settings.backup_ftp_enabled}style="display:none;"{/if}>
            <div class="form-group"><label for="backup_ftp_host" class="col-sm-3 control-label">{$LANG.ftpHostLabel}</label><div class="col-sm-8"><input type="text" name="backup_ftp_host" id="backup_ftp_host" value="{$settings.backup_ftp_host|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="backup_ftp_user" class="col-sm-3 control-label">{$LANG.ftpUserLabel}</label><div class="col-sm-8"><input type="text" name="backup_ftp_user" id="backup_ftp_user" value="{$settings.backup_ftp_user|escape}" class="form-control"></div></div>
            <div class="form-group"><label for="backup_ftp_pass" class="col-sm-3 control-label">{$LANG.ftpPassLabel}</label><div class="col-sm-8"><input type="password" name="backup_ftp_pass" id="backup_ftp_pass" value="********" class="form-control" autocomplete="new-password" placeholder="{$LANG.ftpPassHelpText|escape}"></div></div>
            <div class="form-group"><label for="backup_ftp_port" class="col-sm-3 control-label">{$LANG.ftpPort}</label><div class="col-sm-3"><input type="number" name="backup_ftp_port" id="backup_ftp_port" value="{$settings.backup_ftp_port|default:21}" class="form-control"></div><div class="col-sm-5" style="padding-top:7px;"><input type="checkbox" name="backup_ftp_ssl" id="backup_ftp_ssl" value="1" {if $settings.backup_ftp_ssl == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" data-onstyle="success" data-offstyle="danger"></div></div>
            <div class="form-group"><div class="col-sm-offset-3 col-sm-8"><button type="button" class="btn btn-info btk-ftp-test-btn" data-ftp-type="backup"><i class="fas fa-plug"></i> {$LANG.testFtpConnectionButton}</button><span id="backup_ftp_test_result" class="help-block" style="display:inline; margin-left:15px;"></span></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpRehberPathLabel}</label><div class="col-sm-8"><input type="text" name="backup_ftp_rehber_path" value="{$settings.backup_ftp_rehber_path|default:'/REHBER_YEDEK/'}" class="form-control"></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpHareketPathLabel}</label><div class="col-sm-8"><input type="text" name="backup_ftp_hareket_path" value="{$settings.backup_ftp_hareket_path|default:'/HAREKET_YEDEK/'}" class="form-control"></div></div>
            <div class="form-group"><label class="col-sm-3 control-label">{$LANG.ftpPersonelPathLabel}</label><div class="col-sm-8"><input type="text" name="backup_ftp_personel_path" value="{$settings.backup_ftp_personel_path|default:'/PERSONEL_YEDEK/'}" class="form-control"></div></div>
        </div>
    </div>

    {* --- BTK Yetkilendirme Seçenekleri --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-user-shield"></i> {$LANG.btkAuthTypesTitle}</h3></div>
        <div class="panel-body"><p class="help-block">{$LANG.btkAuthTypesHelpText}</p><div class="row">
                {if $yetki_turleri}
                    {foreach from=$yetki_turleri item=yt}
                    <div class="col-md-6 form-group" style="margin-left:0; margin-right:0;"><input type="checkbox" name="yetkiler[{$yt.yetki_kodu}]" id="yetki_{$yt.yetki_kodu|escape:'url'}" {if $yt.aktif}checked{/if} data-toggle="toggle" data-on="{$LANG.active}" data-off="{$LANG.passive}" data-onstyle="success" data-offstyle="default" data-size="small"><label for="yetki_{$yt.yetki_kodu|escape:'url'}" style="margin-left:10px; font-weight:normal;">{$yt.yetki_adi} <strong>({$yt.yetki_kodu})</strong></label></div>
                    {/foreach}
                {/if}
            </div></div>
    </div>

    {* --- Cron Job Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-clock"></i> {$LANG.cronSettingsTitle}</h3></div>
        <div class="panel-body"><p class="help-block">{$LANG.cronSettingsTooltip}</p>
            <div class="form-group"><label for="rehber_cron_schedule" class="col-sm-3 control-label">{$LANG.cronRehberScheduleLabel}</label><div class="col-sm-7"><input type="text" name="rehber_cron_schedule" id="rehber_cron_schedule" value="{$settings.rehber_cron_schedule|default:'0 10 1 * *'}" class="form-control"></div></div>
            <div class="form-group"><label for="hareket_cron_schedule" class="col-sm-3 control-label">{$LANG.cronHareketScheduleLabel}</label><div class="col-sm-7"><input type="text" name="hareket_cron_schedule" id="hareket_cron_schedule" value="{$settings.hareket_cron_schedule|default:'0 1 * * *'}" class="form-control"></div></div>
            <div class="form-group"><label for="personel_cron_schedule" class="col-sm-3 control-label">{$LANG.personelReportLabel} Cron</label><div class="col-sm-7"><input type="text" name="personel_cron_schedule" id="personel_cron_schedule" value="{$settings.personel_cron_schedule|default:'0 16 L 6,12 *'}" class="form-control"></div></div>
        </div>
    </div>

    {* --- Diğer Ayarlar ve Opsiyonel Özellikler --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$LANG.otherSettingsTitle}</h3></div>
        <div class="panel-body">
            <div class="form-group"><label class="col-sm-4 control-label">{$LANG.sendEmptyReportsLabel}</label><div class="col-sm-8"><input type="checkbox" name="send_empty_reports" value="1" {if $settings.send_empty_reports == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}"><span class="help-block">{$LANG.sendEmptyReportsTooltip}</span></div></div>
            <div class="form-group"><label class="col-sm-4 control-label">{$LANG.personelKimlikDogrulamaYapilsin}</label><div class="col-sm-8"><input type="checkbox" name="personel_nvi_verification_enabled" value="1" {if $settings.personel_nvi_verification_enabled == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}"><span class="help-block">{$LANG.personelKimlikDogrulamaHelpText}</span></div></div>
            <div class="form-group"><label class="col-sm-4 control-label">{$LANG.showBtkInfoClientArea}</label><div class="col-sm-8"><input type="checkbox" name="show_btk_info_if_empty_clientarea" value="1" {if $settings.show_btk_info_if_empty_clientarea == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}"></div></div>
            <div class="form-group"><label class="col-sm-4 control-label text-danger">{$LANG.deleteDataOnDeactivateLabel}</label><div class="col-sm-8"><input type="checkbox" name="delete_data_on_deactivate" value="1" {if $settings.delete_data_on_deactivate == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.yes}" data-off="{$LANG.no}" data-onstyle="danger"><span class="help-block">{$LANG.deleteDataOnDeactivateTooltip}</span></div></div>
        </div>
    </div>
    
    {* --- POP İzleme Ayarları --- *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-satellite-dish"></i> {$LANG.popMonitoringSettingsTitle}</h3></div>
        <div class="panel-body">
            <div class="form-group"><label class="col-sm-4 control-label">{$LANG.popMonitoringEnableLabel}</label><div class="col-sm-8"><input type="checkbox" name="pop_monitoring_enabled" value="1" {if $settings.pop_monitoring_enabled == '1'}checked{/if} data-toggle="toggle" data-on="{$LANG.active}" data-off="{$LANG.passive}"><span class="help-block">{$LANG.popMonitoringEnableHelpText}</span></div></div>
            <div class="form-group"><label for="pop_monitoring_cron_schedule" class="col-sm-4 control-label">{$LANG.popMonitoringScheduleLabel}</label><div class="col-sm-8"><input type="text" name="pop_monitoring_cron_schedule" id="pop_monitoring_cron_schedule" value="{$settings.pop_monitoring_cron_schedule|default:'*/5 * * * *'}" class="form-control"><span class="help-block">{$LANG.popMonitoringScheduleHelpText}</span></div></div>
            <div class="form-group"><label for="pop_monitoring_high_latency_threshold_ms" class="col-sm-4 control-label">{$LANG.popMonitoringHighLatencyLabel}</label><div class="col-sm-4"><input type="number" name="pop_monitoring_high_latency_threshold_ms" id="pop_monitoring_high_latency_threshold_ms" value="{$settings.pop_monitoring_high_latency_threshold_ms|default:500}" class="form-control"><span class="help-block">{$LANG.popMonitoringHighLatencyHelpText}</span></div></div>
        </div>
    </div>

    <div class="form-group text-center" style="margin-top: 30px;">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
    </div>
</form>