{* modules/addons/btkreports/templates/admin/index.tpl *}
{* BTK Raporlama Modülü Ana Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

<div class="btk-dashboard">
    <div class="row">
        <div class="col-md-8">
            <h3><i class="fas fa-info-circle"></i> {$lang.welcome_message}</h3>
            <p>{$lang.module_description}</p>
            <p>
                {$lang.ftp_connection_status}:
                <span id="ftp_status_main_indicator">
                    {if isset($ftp_main_status_data) && $ftp_main_status_data.success}
                        <span class="label label-success">{$lang.ftp_status_active}</span>
                        {if $ftp_main_status_data.message && $ftp_main_status_data.message != $lang.ftp_test_success}
                            <small>({$ftp_main_status_data.message})</small>
                        {/if}
                    {elseif isset($ftp_main_status_data) && !$ftp_main_status_data.success && $ftp_main_status_data.message == $lang.ftp_status_not_configured}
                        <span class="label label-warning">{$lang.ftp_status_not_configured}</span>
                    {elseif isset($ftp_main_status_data) && !$ftp_main_status_data.success}
                        <span class="label label-danger">{$lang.ftp_status_inactive}</span>
                        {if $ftp_main_status_data.message}
                             <small>({$lang.ftp_test_failed} {$ftp_main_status_data.message})</small>
                        {/if}
                    {else}
                        <span class="label label-default">{$lang.ftp_status_checking}</span>
                         {* AJAX ile durumu kontrol etme çağrısı eklenecek *}
                    {/if}
                </span>
                <button id="check_main_ftp_status_btn" class="btn btn-xs btn-info" style="margin-left: 10px;" onclick="btkTestFtpConnection('main', 'ftp_status_main_indicator');">
                    <i class="fas fa-sync-alt"></i> {$lang.ftp_test_connection} (Ana)
                </button>
            </p>

            {if $settings.use_backup_ftp == '1'}
            <p>
                {$lang.backup_ftp_connection_status}:
                <span id="ftp_status_backup_indicator">
                    {if isset($ftp_backup_status_data) && $ftp_backup_status_data.success}
                        <span class="label label-success">{$lang.ftp_status_active}</span>
                         {if $ftp_backup_status_data.message && $ftp_backup_status_data.message != $lang.ftp_test_success}
                            <small>({$ftp_backup_status_data.message})</small>
                        {/if}
                    {elseif isset($ftp_backup_status_data) && !$ftp_backup_status_data.success && $ftp_backup_status_data.message == $lang.ftp_status_not_configured}
                        <span class="label label-warning">{$lang.ftp_status_not_configured}</span>
                    {elseif isset($ftp_backup_status_data) && !$ftp_backup_status_data.success}
                        <span class="label label-danger">{$lang.ftp_status_inactive}</span>
                        {if $ftp_backup_status_data.message}
                             <small>({$lang.ftp_test_failed} {$ftp_backup_status_data.message})</small>
                        {/if}
                    {else}
                        <span class="label label-default">{$lang.ftp_status_checking}</span>
                         {* AJAX ile durumu kontrol etme çağrısı eklenecek *}
                    {/if}
                </span>
                <button id="check_backup_ftp_status_btn" class="btn btn-xs btn-info" style="margin-left: 10px;" onclick="btkTestFtpConnection('backup', 'ftp_status_backup_indicator');">
                    <i class="fas fa-sync-alt"></i> {$lang.ftp_test_connection} (Yedek)
                </button>
            </p>
            {/if}

            <div class="panel panel-default" style="margin-top: 20px;">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-history"></i> {$lang.last_report_generation}</h3>
                </div>
                <div class="panel-body">
                    <p><strong>{$lang.last_abone_rehber_generation}:</strong>
                        {if isset($last_reports_info.rehber.dosya_adi)}
                            {$last_reports_info.rehber.dosya_adi} ({$last_reports_info.rehber.gonderim_baslangic_zamani|date_format:"%d.%m.%Y %H:%M"}) - {$lang.log_table_status}: {$last_reports_info.rehber.gonderim_durumu}
                        {else}
                            {$lang.never_generated}
                        {/if}
                    </p>
                    <p><strong>{$lang.last_abone_hareket_generation}:</strong>
                        {if isset($last_reports_info.hareket.dosya_adi)}
                            {$last_reports_info.hareket.dosya_adi} ({$last_reports_info.hareket.gonderim_baslangic_zamani|date_format:"%d.%m.%Y %H:%M"}) - {$lang.log_table_status}: {$last_reports_info.hareket.gonderim_durumu}
                        {else}
                            {$lang.never_generated}
                        {/if}
                    </p>
                    <p><strong>{$lang.last_personel_list_generation}:</strong>
                        {if isset($last_reports_info.personel.dosya_adi)}
                            {$last_reports_info.personel.dosya_adi} ({$last_reports_info.personel.gonderim_baslangic_zamani|date_format:"%d.%m.%Y %H:%M"}) - {$lang.log_table_status}: {$last_reports_info.personel.gonderim_durumu}
                        {else}
                            {$lang.never_generated}
                        {/if}
                    </p>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-chart-bar"></i> {$lang.statistics_title}</h3>
                </div>
                <div class="panel-body">
                    <p><strong>{$lang.total_clients_btk}:</strong> {if isset($btk_stats.total_clients)}{$btk_stats.total_clients}{else}N/A{/if}</p>
                    <p><strong>{$lang.total_services_btk}:</strong> {if isset($btk_stats.total_services)}{$btk_stats.total_services}{else}N/A{/if}</p>
                    <p><strong>{$lang.pending_hareket_reports}:</strong> {if isset($btk_stats.pending_hareket)}{$btk_stats.pending_hareket}{else}N/A{/if}</p>
                    <p><em>({$lang.statistics_title} yakında daha fazla detay içerecektir.)</em></p>
                </div>
            </div>

            <div class="panel panel-default">
                 <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-rocket"></i> {$lang.quick_actions}</h3>
                </div>
                <div class="list-group">
                    <a href="{$modulelink}&action=generate" class="list-group-item">
                        <i class="fas fa-file-export"></i> {$lang.go_to_generate_reports}
                    </a>
                    <a href="{$modulelink}&action=personnel" class="list-group-item">
                        <i class="fas fa-user-tie"></i> {$lang.go_to_personnel_management}
                    </a>
                     <a href="{$modulelink}&action=config" class="list-group-item">
                        <i class="fas fa-sliders-h"></i> {$lang.go_to_config}
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

{* Bu script bloğu btk_admin_scripts.js dosyasına taşınabilir *}
<script type="text/javascript">
function btkTestFtpConnection(ftpType, indicatorId) {
    var indicator = $('#' + indicatorId);
    var originalText = indicator.html();
    indicator.html('<span class="label label-default">{$lang.ftp_status_checking|escape:'javascript'}</span> <i class="fas fa-spinner fa-spin"></i>');
    $('#check_' + ftpType + '_ftp_status_btn').prop('disabled', true);

    $.ajax({
        url: '{$modulelink}&action=test_ftp_connection&ajax=1', // ajax=1 query string'de _output'u bypass etmesi için
        type: 'POST',
        data: {
            ftp_type: ftpType,
            token: '{$csrfToken}' // Genel bir token veya action'a özel token
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                indicator.html('<span class="label label-success">{$lang.ftp_status_active|escape:'javascript'}</span>');
                if (data.message && data.message !== '{$lang.ftp_test_success|escape:'javascript'}') {
                     indicator.append(' <small>(' + $('<div>').text(data.message).html() + ')</small>');
                }
            } else {
                indicator.html('<span class="label label-danger">{$lang.ftp_status_inactive|escape:'javascript'}</span>');
                 if (data.message) {
                     indicator.append(' <small>(' + $('<div>').text(data.message).html() + ')</small>');
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            indicator.html('<span class="label label-danger">{$lang.ftp_status_inactive|escape:'javascript'}</span> <small>(AJAX Hatası: ' + $('<div>').text(textStatus).html() + ')</small>');
        },
        complete: function() {
             $('#check_' + ftpType + '_ftp_status_btn').prop('disabled', false);
        }
    });
}

// Sayfa yüklendiğinde FTP durumlarını otomatik kontrol et (opsiyonel)
// $(document).ready(function() {
//     btkTestFtpConnection('main', 'ftp_status_main_indicator');
//     {if $settings.use_backup_ftp == '1'}
//     btkTestFtpConnection('backup', 'ftp_status_backup_indicator');
//     {/if}
// });
</script>