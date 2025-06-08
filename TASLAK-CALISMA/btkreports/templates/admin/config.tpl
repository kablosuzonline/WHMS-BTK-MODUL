{*
    WHMCS BTK Raporlama Modülü - Genel Ayarlar Şablonu
    modules/addons/btkreports/templates/admin/config.tpl
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$setting_version_placeholder}" rel="stylesheet">
{* Select2 gibi kütüphaneler için CSS dosyası da buraya eklenebilir *}

<div class="btk-admin-page-header">
    <div class="btk-page-title">
        <img src="modules/addons/btkreports/logo.png" alt="BTK Modül Logo" style="height: 32px; vertical-align: middle; margin-right: 10px;">
        {$LANG.configtitle}
    </div>
</div>

{if $successMessage}
    <div class="alert alert-success text-center">
        <i class="fas fa-check-circle"></i> {$successMessage}
    </div>
{/if}
{if $errorMessage}
    <div class="alert alert-danger">
        <i class="fas fa-exclamation-triangle"></i> {$errorMessage}
    </div>
{/if}

<form method="post" action="{$modulelink}&action=save_config" id="btkConfigForm">
    {* CSRF Token eklenebilir: <input type="hidden" name="token" value="{$csrfToken}" /> *}

    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-cogs"></i> {$LANG.generalSettings}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="operator_code">{$LANG.operatorCode} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.operatorCodeDesc}"></i></label>
                        <input type="text" name="operator_code" id="operator_code" value="{$settings.operator_code|escape}" class="form-control">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="operator_name">{$LANG.operatorName} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.operatorNameDesc}"></i></label>
                        <input type="text" name="operator_name" id="operator_name" value="{$settings.operator_name|escape}" class="form-control">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="operator_title">{$LANG.operatorTitle} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.operatorTitleDesc}"></i></label>
                <input type="text" name="operator_title" id="operator_title" value="{$settings.operator_title|escape}" class="form-control">
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.mainFtpSettings}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-6"><input type="text" name="main_ftp_host" placeholder="{$LANG.ftpHost}" value="{$settings.main_ftp_host|escape}" class="form-control bottom-margin-5"></div>
                <div class="col-md-6"><input type="text" name="main_ftp_user" placeholder="{$LANG.ftpUser}" value="{$settings.main_ftp_user|escape}" class="form-control bottom-margin-5"></div>
            </div>
            <div class="row">
                <div class="col-md-5"><input type="password" name="main_ftp_pass" placeholder="{$LANG.ftpPassPlaceholder}" class="form-control bottom-margin-5"></div>
                <div class="col-md-2"><input type="number" name="main_ftp_port" placeholder="{$LANG.ftpPort}" value="{$settings.main_ftp_port|default:21}" class="form-control bottom-margin-5"></div>
                <div class="col-md-5">
                    <label class="btk-switch">
                        <input type="checkbox" name="main_ftp_ssl" {if $settings.main_ftp_ssl == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    {$LANG.ftpSSL} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.ftpSSLDesc}"></i>
                </div>
            </div>
            <div class="row top-margin-10">
                <div class="col-md-4"><input type="text" name="main_ftp_rehber_path" placeholder="{$LANG.ftpRehberPath}" value="{$settings.main_ftp_rehber_path|escape}" class="form-control bottom-margin-5"></div>
                <div class="col-md-4"><input type="text" name="main_ftp_hareket_path" placeholder="{$LANG.ftpHareketPath}" value="{$settings.main_ftp_hareket_path|escape}" class="form-control bottom-margin-5"></div>
                <div class="col-md-4"><input type="text" name="main_ftp_personel_path" placeholder="{$LANG.ftpPersonelPath}" value="{$settings.main_ftp_personel_path|escape}" class="form-control bottom-margin-5"></div>
            </div>
            <div class="row top-margin-10">
                 <div class="col-md-12">
                    <label class="btk-switch">
                        <input type="checkbox" name="personel_filename_add_year_month_main" {if $settings.personel_filename_add_year_month_main == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    {$LANG.personelFilenameAddYearMonth} (Ana FTP)
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.personelFilenameAddYearMonthDesc}"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title">
                <label class="btk-switch btk-switch-panel-title">
                    <input type="checkbox" name="backup_ftp_enabled" id="backup_ftp_enabled_toggle" {if $settings.backup_ftp_enabled == '1'}checked{/if}>
                    <span class="btk-slider round"></span>
                </label>
                <i class="fas fa-archive"></i> {$LANG.backupFtpSettings} <small>({$LANG.optional})</small>
            </h3>
        </div>
        <div class="panel-body" id="backup_ftp_details" {if $settings.backup_ftp_enabled != '1'}style="display:none;"{/if}>
            <div class="row">
                <div class="col-md-6"><input type="text" name="backup_ftp_host" placeholder="{$LANG.ftpHost}" value="{$settings.backup_ftp_host|escape}" class="form-control bottom-margin-5"></div>
                <div class="col-md-6"><input type="text" name="backup_ftp_user" placeholder="{$LANG.ftpUser}" value="{$settings.backup_ftp_user|escape}" class="form-control bottom-margin-5"></div>
            </div>
            <div class="row">
                <div class="col-md-5"><input type="password" name="backup_ftp_pass" placeholder="{$LANG.ftpPassPlaceholder}" class="form-control bottom-margin-5"></div>
                <div class="col-md-2"><input type="number" name="backup_ftp_port" placeholder="{$LANG.ftpPort}" value="{$settings.backup_ftp_port|default:21}" class="form-control bottom-margin-5"></div>
                <div class="col-md-5">
                    <label class="btk-switch">
                        <input type="checkbox" name="backup_ftp_ssl" {if $settings.backup_ftp_ssl == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    {$LANG.ftpSSL}
                </div>
            </div>
            <div class="row top-margin-10">
                <div class="col-md-4"><input type="text" name="backup_ftp_rehber_path" placeholder="{$LANG.ftpRehberPath}" value="{$settings.backup_ftp_rehber_path|escape}" class="form-control bottom-margin-5"></div>
                <div class="col-md-4"><input type="text" name="backup_ftp_hareket_path" placeholder="{$LANG.ftpHareketPath}" value="{$settings.backup_ftp_hareket_path|escape}" class="form-control bottom-margin-5"></div>
                <div class="col-md-4"><input type="text" name="backup_ftp_personel_path" placeholder="{$LANG.ftpPersonelPath}" value="{$settings.backup_ftp_personel_path|escape}" class="form-control bottom-margin-5"></div>
            </div>
            <div class="row top-margin-10">
                 <div class="col-md-12">
                    <label class="btk-switch">
                        <input type="checkbox" name="personel_filename_add_year_month_backup" {if $settings.personel_filename_add_year_month_backup == '1' || $settings.backup_ftp_enabled != '1'}checked{/if}> {$LANG.personelFilenameAddYearMonth} (Yedek FTP)
                    </label>
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.personelFilenameAddYearMonthDesc}"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-user-shield"></i> {$LANG.btkYetkilendirmeSecenekleri}</h3>
        </div>
        <div class="panel-body">
            <p>{$LANG.btkYetkilendirmeDesc}</p>
            <div class="row btk-yetki-list">
                {assign var="col_count" value=0}
                {foreach from=$yetki_turleri item=yt}
                    {if $col_count % 2 == 0 && $col_count != 0}
                        </div><div class="row btk-yetki-list">
                    {/if}
                    <div class="col-md-6">
                        <div class="btk-yetki-item">
                            <label class="btk-switch">
                                <input type="checkbox" name="yetkiler[{$yt.kod}]" {if $yt.aktif == 1}checked{/if}>
                                <span class="btk-slider round"></span>
                            </label>
                            <span class="btk-yetki-name">{$yt.ad} ({$yt.kod})</span>
                            <i class="fas fa-info-circle btk-tooltip" title="{$LANG['yetki_'|cat:$yt.kod|lower]|default:$LANG.yetkiDefaultDesc}"></i>
                        </div>
                    </div>
                    {assign var="col_count" value=$col_count+1}
                {/foreach}
            </div>
        </div>
    </div>

    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-clock"></i> {$LANG.cronSettings}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4 form-group">
                    <label for="rehber_cron_schedule">{$LANG.rehberCronSchedule} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.cronScheduleDesc}"></i></label>
                    <input type="text" name="rehber_cron_schedule" id="rehber_cron_schedule" value="{$settings.rehber_cron_schedule|default:'0 10 1 * *'}" class="form-control">
                </div>
                <div class="col-md-4 form-group">
                    <label for="hareket_cron_schedule">{$LANG.hareketCronSchedule} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.cronScheduleDesc}"></i></label>
                    <input type="text" name="hareket_cron_schedule" id="hareket_cron_schedule" value="{$settings.hareket_cron_schedule|default:'0 1 * * *'}" class="form-control">
                </div>
                <div class="col-md-4 form-group">
                    <label for="personel_cron_schedule">{$LANG.personelCronSchedule} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.cronScheduleDesc}"></i></label>
                    <input type="text" name="personel_cron_schedule" id="personel_cron_schedule" value="{$settings.personel_cron_schedule|default:'0 16 L 6,12 *'}" class="form-control">
                </div>
            </div>
        </div>
    </div>
    
    <div class="panel panel-default btk-widget">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-sliders-h"></i> {$LANG.otherSettings}</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4">
                    <label class="btk-switch">
                        <input type="checkbox" name="send_empty_reports" {if $settings.send_empty_reports == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    {$LANG.sendEmptyReports}
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.sendEmptyReportsDesc}"></i>
                </div>
                 <div class="col-md-4">
                    <label class="btk-switch">
                        <input type="checkbox" name="debug_mode" {if $settings.debug_mode == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    {$LANG.debugMode}
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.debugModeDesc}"></i>
                </div>
                <div class="col-md-4">
                    <label class="btk-switch">
                        <input type="checkbox" name="delete_data_on_deactivate" {if $settings.delete_data_on_deactivate == '1'}checked{/if}>
                        <span class="btk-slider round"></span>
                    </label>
                    {$LANG.deleteDataOnDeactivate}
                    <i class="fas fa-info-circle btk-tooltip" title="{$LANG.deleteDataOnDeactivateDesc}"></i>
                </div>
            </div>
             <div class="row top-margin-10">
                <div class="col-md-6 form-group">
                    <label for="hareket_live_table_days">{$LANG.hareketLiveTableDays} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.hareketLiveTableDaysDesc}"></i></label>
                    <input type="number" name="hareket_live_table_days" id="hareket_live_table_days" value="{$settings.hareket_live_table_days|default:7}" class="form-control" min="1">
                </div>
                <div class="col-md-6 form-group">
                    <label for="hareket_archive_table_days">{$LANG.hareketArchiveTableDays} <i class="fas fa-info-circle btk-tooltip" title="{$LANG.hareketArchiveTableDaysDesc}"></i></label>
                    <input type="number" name="hareket_archive_table_days" id="hareket_archive_table_days" value="{$settings.hareket_archive_table_days|default:180}" class="form-control" min="1">
                </div>
            </div>
        </div>
    </div>

    <div class="text-center">
        <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-save"></i> {$LANG.saveChanges}</button>
        <a href="{$modulelink}" class="btn btn-default btn-lg">{$LANG.cancel}</a>
    </div>
</form>

<script type="text/javascript">
$(document).ready(function() {
    // Yedek FTP detaylarını göster/gizle
    $('#backup_ftp_enabled_toggle').change(function() {
        if($(this).is(":checked")) {
            $('#backup_ftp_details').slideDown();
        } else {
            $('#backup_ftp_details').slideUp();
        }
    });

    // Tooltip'leri etkinleştir (Bootstrap tooltip)
    // WHMCS'in kendi tooltip mekanizması da olabilir, ona göre uyarlanır.
    // Bu jQuery UI tooltip kullanır, eğer WHMCS'de varsa.
    // Veya basit bir CSS tooltip de yapılabilir.
    // Şimdilik Bootstrap varsayımıyla:
    $('.btk-tooltip').tooltip({
        placement: 'top',
        container: 'body' // Tooltip'in doğru konumlanması için
    });

    // Gerekirse Select2 gibi kütüphaneler burada initialize edilebilir
    // $('.select2-enable').select2();
});
</script>