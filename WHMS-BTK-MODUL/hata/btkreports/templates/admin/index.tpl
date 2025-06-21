// --- BÖLÜM 1 / 1 BAŞI - (index.tpl, Modül Ana Sayfa (Dashboard))
{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard)
    Dosya: templates/admin/index.tpl
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
    {elseif $flashMessage.type == 'warning'}
        <div class="alert alert-warning text-center" role="alert">
            <i class="fas fa-exclamation-triangle"></i> {$flashMessage.message}
        </div>
    {else}
        <div class="alert alert-info text-center" role="alert">
            <i class="fas fa-info-circle"></i> {$flashMessage.message}
        </div>
    {/if}
{/if}

<div class="row">
    {* Sol Sütun - Modül Bilgileri ve FTP Durumu *}
    <div class="col-md-6">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-cubes"></i> {$LANG.moduleInfoTitle}</h3>
            </div>
            <div class="panel-body">
                <table class="table table-condensed">
                    <tbody>
                        <tr>
                            <td width="40%"><strong>{$LANG.moduleVersionLabel}</strong></td>
                            <td>v{$module_version|default:'6.0.0'}</td> {* module_version değişkeni btkreports.php'den atanmalı *}
                        </tr>
                        <tr>
                            <td><strong>{$LANG.releaseNotesLabel}</strong></td>
                            <td>
                                {if $readme_link_exists} {* btkreports.php'den atanmalı *}
                                    <a href="{$readme_file_url}" target="_blank" class="btn btn-xs btn-info">
                                        <i class="fas fa-file-alt"></i> {$LANG.viewReleaseNotesButton}
                                    </a>
                                {else}
                                    {$LANG.releaseNotesNotFound}
                                {/if}
                            </td>
                        </tr>
                        {* Buraya başka modül genel bilgileri eklenebilir *}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.ftpServerStatusTitle}</h3>
            </div>
            <div class="panel-body">
                <div id="ftpStatusCheckArea">
                    <p class="text-center"><i class="fas fa-spinner fa-spin"></i> {$LANG.checkingFtpStatus}</p>
                </div>
                {* FTP Durumları AJAX ile yüklenecek *}
                <table class="table table-condensed" id="ftpStatusTable" style="display:none;">
                    <thead>
                        <tr>
                            <th>{$LANG.ftpServerTypeLabel}</th>
                            <th>{$LANG.ftpHostLabel}</th>
                            <th>{$LANG.statusLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{$LANG.ftpMainServerLabel}</td>
                            <td id="mainFtpHost">{$settings.ftp_host_main|default:$LANG.notConfigured}</td>
                            <td id="mainFtpStatus"><span class="label label-warning">{$LANG.statusPending}</span></td>
                        </tr>
                        {if $settings.ftp_use_backup == '1' || $settings.ftp_use_backup == 'on'}
                        <tr>
                            <td>{$LANG.ftpBackupServerLabel}</td>
                            <td id="backupFtpHost">{$settings.ftp_host_backup|default:$LANG.notConfigured}</td>
                            <td id="backupFtpStatus"><span class="label label-warning">{$LANG.statusPending}</span></td>
                        </tr>
                        {/if}
                    </tbody>
                </table>
                 <button id="btnCheckFtpStatus" class="btn btn-sm btn-default btn-block">
                    <i class="fas fa-sync-alt"></i> {$LANG.refreshFtpStatusButton}
                </button>
            </div>
        </div>
    </div>

    {* Sağ Sütun - Son Gönderimler ve Hızlı Erişim *}
    <div class="col-md-6">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-history"></i> {$LANG.lastSubmissionsTitle}</h3>
            </div>
            <div class="panel-body">
                {* Bu kısım btkreports.php'den mod_btk_ftp_logs tablosundan çekilecek son kayıtlarla doldurulacak *}
                <p><strong>{$LANG.rehberReportLabel}:</strong>
                    {if $last_rehber_submission}
                        {$last_rehber_submission.dosya_adi} ({$last_rehber_submission.gonderim_tarihi|date_format:"%d.%m.%Y %H:%M"} - CNT: {$last_rehber_submission.cnt})
                        <span class="label label-{if $last_rehber_submission.durum == 'BASARILI'}success{else}danger{/if}">{$last_rehber_submission.durum}</span>
                    {else}
                        {$LANG.noSubmissionYet}
                    {/if}
                </p>
                <hr>
                <p><strong>{$LANG.hareketReportLabel}:</strong>
                    {if $last_hareket_submission}
                        {$last_hareket_submission.dosya_adi} ({$last_hareket_submission.gonderim_tarihi|date_format:"%d.%m.%Y %H:%M"} - CNT: {$last_hareket_submission.cnt})
                         <span class="label label-{if $last_hareket_submission.durum == 'BASARILI'}success{else}danger{/if}">{$last_hareket_submission.durum}</span>
                    {else}
                        {$LANG.noSubmissionYet}
                    {/if}
                </p>
                <hr>
                <p><strong>{$LANG.personelReportLabel}:</strong>
                     {if $last_personel_submission}
                        {$last_personel_submission.dosya_adi} ({$last_personel_submission.gonderim_tarihi|date_format:"%d.%m.%Y %H:%M"})
                         <span class="label label-{if $last_personel_submission.durum == 'BASARILI'}success{else}danger{/if}">{$last_personel_submission.durum}</span>
                    {else}
                        {$LANG.noSubmissionYet}
                    {/if}
                </p>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fas fa-cogs"></i> {$LANG.quickAccessTitle}</h3>
            </div>
            <div class="panel-body text-center">
                <a href="{$modulelink}&action=config" class="btn btn-primary">
                    <i class="fas fa-tools"></i> {$LANG.goToSettingsButton}
                </a>
                <a href="{$modulelink}&action=generate_reports" class="btn btn-success">
                    <i class="fas fa-file-export"></i> {$LANG.goToGenerateReportButton}
                </a>
                <a href="{$modulelink}&action=view_logs" class="btn btn-info">
                    <i class="fas fa-clipboard-list"></i> {$LANG.goToLogsButton}
                </a>
            </div>
        </div>
    </div>
</div>

{* BTK Sunucularına Veri Gönderim Modülü Hakkında Yardım ve Bilgilendirme - TemaAnaSayfa.png'deki bölüm *}
<div class="panel panel-info">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.btkInfoTitle}</h3>
    </div>
    <div class="panel-body">
        <p>{$LANG.btkInfoText1}</p>
        <p>{$LANG.btkInfoText2}</p>
        <p>{$LANG.btkInfoText3}</p>
        <p>{$LANG.btkInfoText4}</p>
    </div>
</div>

{*
    AJAX ile FTP durumunu kontrol etmek için JavaScript.
    Bu kısım btk_admin_scripts.js dosyasına taşınabilir veya burada kalabilir.
*}
<script type="text/javascript">
    function checkFtpStatuses() {
        $('#ftpStatusCheckArea').html('<p class="text-center"><i class="fas fa-spinner fa-spin"></i> {$LANG.checkingFtpStatus}</p>');
        $('#ftpStatusTable').hide();

        $.post("{$modulelink}&ajax=1&action=test_ftp_connection_all", {literal}{ csrfToken: getWhmcsCSRFToken() }{/literal}, function(data) {
            $('#ftpStatusCheckArea').hide();
            $('#ftpStatusTable').show();

            if (data.main_status) {
                var mainLabelClass = data.main_status.status === 'success' ? 'label-success' : 'label-danger';
                $('#mainFtpStatus').html('<span class="label ' + mainLabelClass + '">' + data.main_status.message + '</span>');
            } else {
                 $('#mainFtpStatus').html('<span class="label label-danger">{$LANG.errorOccurred}</span>');
            }

            {if $settings.ftp_use_backup == '1' || $settings.ftp_use_backup == 'on'}
            if (data.backup_status) {
                var backupLabelClass = data.backup_status.status === 'success' ? 'label-success' : 'label-danger';
                $('#backupFtpStatus').html('<span class="label ' + backupLabelClass + '">' + data.backup_status.message + '</span>');
            } else {
                $('#backupFtpStatus').html('<span class="label label-danger">{$LANG.errorOccurred}</span>');
            }
            {/if}
        }, "json").fail(function() {
            $('#ftpStatusCheckArea').hide();
            $('#ftpStatusTable').show();
            $('#mainFtpStatus').html('<span class="label label-danger">{$LANG.ajaxRequestFailed}</span>');
            {if $settings.ftp_use_backup == '1' || $settings.ftp_use_backup == 'on'}
            $('#backupFtpStatus').html('<span class="label label-danger">{$LANG.ajaxRequestFailed}</span>');
            {/if}
        });
    }

    $(document).ready(function() {
        checkFtpStatuses(); // Sayfa yüklendiğinde kontrol et

        $('#btnCheckFtpStatus').click(function() {
            checkFtpStatuses();
        });
    });
</script>
// --- BÖLÜM 1 / 1 SONU - (index.tpl, Modül Ana Sayfa (Dashboard))