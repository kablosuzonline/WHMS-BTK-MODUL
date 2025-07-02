{*
    WHMCS BTK Raporlama Modülü - Ana Sayfa (Dashboard) Şablonu
    modules/addons/btkreports/templates/admin/index.tpl
    Sürüm: 6.5
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<div class="btk-dashboard">
    <div class="row">
        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-info-circle"></i> {$LANG.moduleInfoTitle}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.btkInfoTitle}</p>
                    <ul class="list-unstyled">
                        <li><strong>{$LANG.moduleVersionLabel}</strong> {$module_version_placeholder}</li>
                        <li><strong>{$LANG.dbVersion|default:'Veritabanı Sürümü'}:</strong> {$setting_version_placeholder}</li>
                        <li><strong>{$LANG.developedBy|default:'Geliştiren'}:</strong> KablosuzOnline & Gemini AI</li>
                    </ul>
                    {if $setting_surum_notlari_link_placeholder && $setting_surum_notlari_link_placeholder != '#'}
                    <p class="top-margin-10">
                        <a href="{$setting_surum_notlari_link_placeholder}" class="btn btn-primary btn-sm" target="_blank">
                            <i class="fas fa-file-alt"></i> {$LANG.viewReleaseNotesButton}
                        </a>
                    </p>
                    {/if}
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-server"></i> {$LANG.ftpServerStatusTitle}</h3>
                </div>
                <div class="panel-body">
                    <table class="table table-btk-status">
                        <tbody>
                            <tr>
                                <td><strong>{$LANG.mainFtpServerLabel}</strong></td>
                                <td class="text-right">
                                    {if $ftp_main_status.status == 'success'}
                                        <span class="label label-success" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.statusActive}</span>
                                    {elseif $ftp_main_status.status == 'error'}
                                        <span class="label label-danger" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-times-circle"></i> {$LANG.statusPassive}</span>
                                    {else}
                                         <span class="label label-warning" title="{$ftp_main_status.message|escape:'html'}"><i class="fas fa-question-circle"></i> {$LANG.bilinmiyor|default:'Bilinmiyor'}</span>
                                    {/if}
                                </td>
                            </tr>
                            {if $settings.backup_ftp_enabled == '1'}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServerLabel}</strong></td>
                                    <td class="text-right">
                                        {if $ftp_backup_status.status == 'success'}
                                            <span class="label label-success" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-check-circle"></i> {$LANG.statusActive}</span>
                                        {elseif $ftp_backup_status.status == 'error'}
                                            <span class="label label-danger" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-times-circle"></i> {$LANG.statusPassive}</span>
                                        {else}
                                            <span class="label label-warning" title="{$ftp_backup_status.message|escape:'html'}"><i class="fas fa-question-circle"></i> {$LANG.bilinmiyor|default:'Bilinmiyor'}</span>
                                        {/if}
                                    </td>
                                </tr>
                            {else}
                                <tr>
                                    <td><strong>{$LANG.backupFtpServerLabel}</strong></td>
                                    <td class="text-right"><span class="label label-default">{$LANG.ayarlardanEtkinlestirin|default:'Ayarlardan Etkin Değil'}</span></td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                    <p class="text-right"><a href="{$modulelink}&action=config" class="btn btn-default btn-xs">{$LANG.goToSettingsButton}</a></p>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="panel panel-default btk-widget">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fas fa-question-circle"></i> {$LANG.btkInfoTitle}</h3>
                </div>
                <div class="panel-body">
                    <p>{$LANG.btkInfoText1}</p>
                    <p>{$LANG.btkInfoText2}</p>
                    <p class="small text-muted">{$LANG.btkInfoText3}</p>
                </div>
            </div>
        </div>
    </div>

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
                                        <th>{$LANG.yetkiTuruGrubu|default:'Yetki Grubu'}</th>
                                        <th>{$LANG.reportType|default:'Rapor Türü'}</th>
                                        <th>{$LANG.lastSubmissionDate|default:'Son Gönderim'}</th>
                                        <th>{$LANG.lastSubmittedFile|default:'Dosya Adı'}</th>
                                        <th>CNT</th>
                                        <th class="text-center">{$LANG.actionsHeader}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foreach from=$aktif_yetki_gruplari_for_index item=grup}
                                        <tr>
                                            <td rowspan="2" style="vertical-align: middle; border-bottom: 2px solid #ddd;"><strong>{$grup|escape:'html'}</strong></td>
                                            <td>{$LANG.rehberReportLabel}</td>
                                            <td>{$last_submissions[$grup]['REHBER']['tarih_saat']}</td>
                                            <td title="{$last_submissions[$grup]['REHBER']['dosya_adi']|escape:'html'}">{$last_submissions[$grup]['REHBER']['dosya_adi']|truncate:40:"...":true}</td>
                                            <td><span class="label label-default">{$last_submissions[$grup]['REHBER']['cnt']}</span></td>
                                            <td class="text-center">
                                                <a href="{$modulelink}&action=generatereports" class="btn btn-xs btn-info" title="{$LANG.generateReportTooltip|default:'Bu raporu manuel oluştur/gönder'}">
                                                    <i class="fas fa-cogs"></i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr style="border-bottom: 2px solid #ddd;">
                                            <td>{$LANG.hareketReportLabel}</td>
                                            <td>{$last_submissions[$grup]['HAREKET']['tarih_saat']}</td>
                                            <td title="{$last_submissions[$grup]['HAREKET']['dosya_adi']|escape:'html'}">{$last_submissions[$grup]['HAREKET']['dosya_adi']|truncate:40:"...":true}</td>
                                            <td><span class="label label-default">{$last_submissions[$grup]['HAREKET']['cnt']}</span></td>
                                            <td class="text-center">
                                                <a href="{$modulelink}&action=generatereports" class="btn btn-xs btn-info" title="{$LANG.generateReportTooltip|default:'Bu raporu manuel oluştur/gönder'}">
                                                    <i class="fas fa-cogs"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    {/foreach}
                                    <tr>
                                        <td><strong>{$LANG.personelReportLabel}</strong></td>
                                        <td><em>({$LANG.genelRapor|default:'Genel Rapor'})</em></td>
                                        <td>{$last_submissions.PERSONEL.tarih_saat}</td>
                                        <td title="{$last_submissions.PERSONEL.dosya_adi|escape:'html'}">{$last_submissions.PERSONEL.dosya_adi|truncate:40:"...":true}</td>
                                        <td><span class="label label-default">{$last_submissions.PERSONEL.cnt}</span></td>
                                        <td class="text-center">
                                            <a href="{$modulelink}&action=generatereports" class="btn btn-xs btn-info" title="{$LANG.generateReportTooltip|default:'Bu raporu manuel oluştur/gönder'}">
                                                <i class="fas fa-cogs"></i>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    {else}
                        <p class="text-center">{$LANG.noActiveAuthGroupsForReports|default:'Raporlama için aktif edilmiş BTK Yetki Türü Grubu bulunmamaktadır. Lütfen Genel Ayarlar\'dan seçim yapın.'}</p>
                    {/if}
                    <hr>
                    <h4>{$LANG.nextCronRunsTitle}</h4>
                    <ul class="list-inline">
                        <li><strong>{$LANG.rehberReportLabel}:</strong> <span class="text-info">{$next_rehber_cron_run}</span></li>
                        <li><strong>{$LANG.hareketReportLabel}:</strong> <span class="text-info">{$next_hareket_cron_run}</span></li>
                        <li><strong>{$LANG.personelReportLabel}:</strong> <span class="text-info">{$next_personel_cron_run}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>