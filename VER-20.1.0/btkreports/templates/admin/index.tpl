{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    Sürüm: 20.0.0 (Operasyon PHOENIX)
*}

<link href="{$assets_url}/css/btk_admin_style.css?v={$module_version}" rel="stylesheet">

<div id="btk-dashboard-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<div class="row">
    <div class="col-md-8">
        <div class="panel panel-default btk-widget">
            <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-satellite-dish"></i> {$LANG.lastReportSubmissions}</h3></div>
            <div class="panel-body">
                {if empty($aktif_yetki_gruplari_for_index)}
                    <div class="alert alert-warning text-center">Raporlama için aktif edilmiş BTK Yetki Türü bulunmamaktadır. Lütfen <a href="{$modulelink}&action=config">Genel Ayarlar</a> sayfasından seçim yapın.</div>
                {else}
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>{$LANG.yetkiTuruGrubu}</th>
                            <th>{$LANG.reportType}</th>
                            <th>{$LANG.lastSubmissionDate}</th>
                            <th>{$LANG.lastSubmittedFile}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foreach $aktif_yetki_gruplari_for_index as $grup}
                        <tr>
                            <td rowspan="2" style="vertical-align: middle;"><strong>{$grup}</strong></td>
                            <td>{$LANG.rehberReportLabel}</td>
                            <td>{$last_submissions[$grup]['REHBER']['tarih_saat']}</td>
                            <td>{$last_submissions[$grup]['REHBER']['dosya_adi']}</td>
                        </tr>
                        <tr>
                            <td>{$LANG.hareketReportLabel}</td>
                            <td>{$last_submissions[$grup]['HAREKET']['tarih_saat']}</td>
                            <td>{$last_submissions[$grup]['HAREKET']['dosya_adi']}</td>
                        </tr>
                        {/foreach}
                        <tr style="border-top: 2px solid #ddd;">
                             <td rowspan="1" style="vertical-align: middle;"><strong>TÜMÜ</strong></td>
                             <td>{$LANG.personelReportLabel}</td>
                             <td>{$last_submissions['PERSONEL']['tarih_saat']}</td>
                             <td>{$last_submissions['PERSONEL']['dosya_adi']}</td>
                        </tr>
                    </tbody>
                </table>
                {/if}
            </div>
        </div>

        <div class="panel panel-default btk-widget">
            <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-clock"></i> {$LANG.nextCronRunsTitle}</h3></div>
            <div class="panel-body">
                 <table class="table">
                    <tbody>
                        <tr><td width="30%"><strong>{$LANG.rehberReportLabel}</strong></td><td>{$next_cron_runs['rehber']}</td></tr>
                        <tr><td><strong>{$LANG.hareketReportLabel}</strong></td><td>{$next_cron_runs['hareket']}</td></tr>
                        <tr><td><strong>{$LANG.personelReportLabel}</strong></td><td>{$next_cron_runs['personel']}</td></tr>
                        {if $settings.pop_monitoring_enabled == '1'}
                        <tr><td><strong>Ağ (POP) İzleme</strong></td><td>{$next_cron_runs['monitor']}</td></tr>
                        {/if}
                    </tbody>
                </table>
                <span class="help-block">Bu zamanlar sunucu saatinize göredir ve cron job yapılandırmanızın doğru olduğunu varsayar.</span>
            </div>
        </div>

    </div>
    <div class="col-md-4">
        <div class="panel panel-default btk-widget">
            <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle}</h3></div>
            <div class="panel-body text-center">
                <h4>{$LANG.btk_reports_addon}</h4>
                <p><strong>{$LANG.moduleVersionLabel}:</strong> <span class="label label-info">{$module_version}</span></p>
                <p><a href="{$modulelink}&action=config" class="btn btn-default"><i class="fas fa-cogs"></i> {$LANG.goToSettingsButton}</a></p>
            </div>
        </div>
        <div class="panel panel-default btk-widget">
            <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.ftpServerStatusTitle}</h3></div>
            <div class="panel-body">
                <p><strong>{$LANG.ftpMainServerLabel}:</strong>
                    {if $ftp_main_status.status == 'success'}
                        <span class="label label-success pull-right"><i class="fas fa-check"></i> Bağlı</span>
                    {elseif $ftp_main_status.status == 'info'}
                         <span class="label label-default pull-right"><i class="fas fa-info-circle"></i> Ayarlanmamış</span>
                    {else}
                        <span class="label label-danger pull-right" title="{$ftp_main_status.message|escape}"><i class="fas fa-times"></i> Hata</span>
                    {/if}
                </p>
                <hr>
                <p><strong>{$LANG.ftpBackupServerLabel}:</strong>
                     {if $ftp_backup_status.status == 'success'}
                        <span class="label label-success pull-right"><i class="fas fa-check"></i> Bağlı</span>
                    {elseif $ftp_backup_status.status == 'info'}
                         <span class="label label-default pull-right"><i class="fas fa-power-off"></i> Etkin Değil</span>
                    {else}
                        <span class="label label-danger pull-right" title="{$ftp_backup_status.message|escape}"><i class="fas fa-times"></i> Hata</span>
                    {/if}
                </p>
            </div>
        </div>
        
        {if $settings.pop_monitoring_enabled == '1'}
        <div class="panel panel-default btk-widget">
            <div class="panel-heading"><h3 class="panel-title"><i class="fas fa-network-wired"></i> {$LANG.popMonitoringStatusTitle}</h3></div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-xs-12 stat-box"><span class="stat-num">{$monitoring_stats.total|default:0}</span><span class="stat-label">{$LANG.totalMonitored}</span></div>
                    <div class="col-xs-6 stat-box-success"><span class="stat-num">{$monitoring_stats.online|default:0}</span><span class="stat-label">{$LANG.popOnline}</span></div>
                    <div class="col-xs-6 stat-box-danger"><span class="stat-num">{$monitoring_stats.offline|default:0}</span><span class="stat-label">{$LANG.popOffline}</span></div>
                    <div class="col-xs-12 stat-box-warning"><span class="stat-num">{$monitoring_stats.high_latency|default:0}</span><span class="stat-label">{$LANG.popHighLatency}</span></div>
                </div>
            </div>
        </div>
        {/if}
        
    </div>
</div>