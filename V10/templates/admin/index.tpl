{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    Sürüm: 8.2.0 (Operasyon Merkezi)
*}

<div id="btk-dashboard-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<div class="btk-dashboard">
    <div class="row">
        <div class="col-md-6">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle}</h3>
                </div>
                <div class="panel-body">
                    <ul class="list-unstyled">
                        <li><strong>{$LANG.moduleVersionLabel}</strong> {$module_version}</li>
                        <li><strong>{$LANG.developedBy}:</strong> KablosuzOnline & Gemini AI</li>
                    </ul>
                    <p class="top-margin-10">
                        <a href="{$modulelink}&action=config" class="btn btn-primary btn-sm">
                            <i class="fas fa-cogs"></i> {$LANG.goToSettingsButton}
                        </a>
                    </p>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.ftpServerStatusTitle}</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-btk-status">
                        <tbody>
                            <tr>
                                <td><strong>{$LANG.ftpMainServerLabel}</strong></td>
                                <td class="text-right">
                                    {if $ftp_main_status.status == 'success'}
                                        <span class="label label-success" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.active}</span>
                                    {elseif $ftp_main_status.status == 'error'}
                                        <span class="label label-danger" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-times-circle"></i> {$LANG.statusError}</span>
                                    {else}
                                         <span class="label label-warning" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-question-circle"></i> {$LANG.bilinmiyor}</span>
                                    {/if}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>{$LANG.backupFtpServerLabel}</strong></td>
                                <td class="text-right">
                                    {if $settings.backup_ftp_enabled != '1'}
                                        <span class="label label-default">{$LANG.passive}</span>
                                    {elseif $ftp_backup_status.status == 'success'}
                                        <span class="label label-success" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.active}</span>
                                    {else}
                                        <span class="label label-danger" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-times-circle"></i> {$LANG.statusError}</span>
                                    {/if}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    {if $monitoring_stats.is_enabled}
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-heartbeat"></i> {$LANG.popMonitoringStatusTitle}</h3>
                </div>
                <div class="panel-body">
                    <div class="row text-center">
                        <div class="col-md-3 col-sm-6"><div class="stat-box"><span class="stat-num">{$monitoring_stats.total}</span><span class="stat-label">{$LANG.totalMonitored}</span></div></div>
                        <div class="col-md-3 col-sm-6"><div class="stat-box-success"><span class="stat-num">{$monitoring_stats.online}</span><span class="stat-label">{$LANG.popOnline}</span></div></div>
                        <div class="col-md-3 col-sm-6"><div class="stat-box-danger"><span class="stat-num">{$monitoring_stats.offline}</span><span class="stat-label">{$LANG.popOffline}</span></div></div>
                        <div class="col-md-3 col-sm-6"><div class="stat-box-warning"><span class="stat-num">{$monitoring_stats.high_latency}</span><span class="stat-label">{$LANG.popHighLatency}</span></div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}

    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-paper-plane"></i> {$LANG.lastReportSubmissions}</h3>
                </div>
                <div class="panel-body">
                    {if $aktif_yetki_gruplari_for_index|@count > 0}
                        <div class="table-responsive">
                            <table class="table table-striped table-hover table-btk-reports">
                                <thead>
                                    <tr>
                                        <th>{$LANG.yetkiTuruGrubu}</th>
                                        <th>{$LANG.reportType}</th>
                                        <th>{$LANG.lastSubmissionDate}</th>
                                        <th>{$LANG.lastSubmittedFile}</th>
                                        <th>CNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foreach from=$aktif_yetki_gruplari_for_index item=grup}
                                        <tr>
                                            <td rowspan="2" style="vertical-align: middle; border-bottom: 2px solid #ddd;"><strong>{$grup|escape:'html'}</strong></td>
                                            <td>{$LANG.rehberReportLabel}</td>
                                            <td>{$last_submissions[$grup]['REHBER']['tarih_saat']|default:$LANG.noSubmissionYet}</td>
                                            <td title="{$last_submissions[$grup]['REHBER']['dosya_adi']|escape:'html'}">{$last_submissions[$grup]['REHBER']['dosya_adi']|truncate:50:"...":true}</td>
                                            <td><span class="label label-default">{$last_submissions[$grup]['REHBER']['cnt']|default:'-'}</span></td>
                                        </tr>
                                        <tr style="border-bottom: 2px solid #ddd;">
                                            <td>{$LANG.hareketReportLabel}</td>
                                            <td>{$last_submissions[$grup]['HAREKET']['tarih_saat']|default:$LANG.noSubmissionYet}</td>
                                            <td title="{$last_submissions[$grup]['HAREKET']['dosya_adi']|escape:'html'}">{$last_submissions[$grup]['HAREKET']['dosya_adi']|truncate:50:"...":true}</td>
                                            <td><span class="label label-default">{$last_submissions[$grup]['HAREKET']['cnt']|default:'-'}</span></td>
                                        </tr>
                                    {/foreach}
                                    <tr>
                                        <td colspan="2"><strong>{$LANG.personelReportLabel}</strong></td>
                                        <td>{$last_submissions.PERSONEL.tarih_saat|default:$LANG.noSubmissionYet}</td>
                                        <td title="{$last_submissions.PERSONEL.dosya_adi|escape:'html'}">{$last_submissions.PERSONEL.dosya_adi|truncate:50:"...":true}</td>
                                        <td><span class="label label-default">{$last_submissions.PERSONEL.cnt|default:'-'}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    {else}
                        <p class="text-center text-muted">{$LANG.noActiveAuthGroupsForReports|default:'Raporlama için aktif edilmiş BTK Yetki Türü Grubu bulunmamaktadır. Lütfen Genel Ayarlar\'dan seçim yapın.'}</p>
                    {/if}
                    <hr>
                    <h4><i class="fas fa-forward"></i> {$LANG.nextCronRunsTitle}</h4>
                    <ul class="list-inline">
                        <li><strong>{$LANG.rehberReportLabel}:</strong> <span class="text-info">{$next_cron_runs.rehber}</span></li>
                        <li><strong>{$LANG.hareketReportLabel}:</strong> <span class="text-info">{$next_cron_runs.hareket}</span></li>
                        <li><strong>{$LANG.personelReportLabel}:</strong> <span class="text-info">{$next_cron_runs.personel}</span></li>
                        {if isset($next_cron_runs.monitor) && $next_cron_runs.monitor != $LANG.notConfigured}
                        <li><strong>POP İzleme:</strong> <span class="text-info">{$next_cron_runs.monitor}</span></li>
                        {/if}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>