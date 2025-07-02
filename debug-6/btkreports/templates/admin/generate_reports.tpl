{*
    WHMCS BTK Raporlama Modülü - Manuel Rapor Oluşturma ve Gönderme Sayfası
    Dosya: templates/admin/generate_reports.tpl
    Sürüm: 6.5
*}

{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}

<p>{$LANG.generateReportsIntro}</p>

<div class="panel-group" id="accordionGenerate" role="tablist" aria-multiselectable="true">

    {* ABONE REHBER RAPORU *}
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingRehber">
            <h4 class="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#accordionGenerate" href="#collapseRehber" aria-expanded="true" aria-controls="collapseRehber">
                    <i class="fas fa-address-book"></i> {$LANG.generateRehberReportTitle}
                </a>
            </h4>
        </div>
        <div id="collapseRehber" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingRehber">
            <div class="panel-body">
                <p>{$LANG.generateRehberReportHelpText}</p>
                <form method="post" action="{$modulelink}&action=do_generate_report" class="form-inline report-generation-form">
                    <input type="hidden" name="token" value="{$csrfToken}">
                    <input type="hidden" name="report_type" value="REHBER">
                    <div class="form-group">
                        <label for="rehber_yetki_tipi">{$LANG.selectBtkAuthTypeForReportLabel}:</label>
                        <select name="yetki_tipi_kodu" id="rehber_yetki_tipi" class="form-control" required>
                            <option value="">{$LANG.selectOption}</option>
                            {foreach from=$activeBtkAuthTypesForReports item=authType}
                                <option value="{$authType->yetki_kodu}">{$authType->yetki_adi} ({$authType->rapor_tipi_eki|default:$authType->yetki_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                    <button type="submit" name="generate_only" value="1" class="btn btn-info"><i class="fas fa-cogs"></i> {$LANG.generateOnlyButton}</button>
                    <button type="submit" name="generate_and_send_main" value="1" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                    {if $settings.backup_ftp_enabled == '1'}
                    <button type="submit" name="generate_and_send_backup" value="1" class="btn btn-warning"><i class="fas fa-archive"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    {/if}
                </form>
                <div class="report-result" id="rehberReportResult" style="margin-top:15px;"></div>
            </div>
        </div>
    </div>

    {* ABONE HAREKET RAPORU *}
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingHareket">
            <h4 class="panel-title">
                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionGenerate" href="#collapseHareket" aria-expanded="false" aria-controls="collapseHareket">
                    <i class="fas fa-exchange-alt"></i> {$LANG.generateHareketReportTitle}
                </a>
            </h4>
        </div>
        <div id="collapseHareket" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingHareket">
            <div class="panel-body">
                <p>{$LANG.generateHareketReportHelpText}</p>
                <form method="post" action="{$modulelink}&action=do_generate_report" class="form-inline report-generation-form">
                    <input type="hidden" name="token" value="{$csrfToken}">
                    <input type="hidden" name="report_type" value="HAREKET">
                     <div class="form-group">
                        <label for="hareket_yetki_tipi">{$LANG.selectBtkAuthTypeForReportLabel}:</label>
                        <select name="yetki_tipi_kodu" id="hareket_yetki_tipi" class="form-control" required>
                            <option value="">{$LANG.selectOption}</option>
                            {foreach from=$activeBtkAuthTypesForReports item=authType}
                                <option value="{$authType->yetki_kodu}">{$authType->yetki_adi} ({$authType->rapor_tipi_eki|default:$authType->yetki_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                    <button type="submit" name="generate_only" value="1" class="btn btn-info"><i class="fas fa-cogs"></i> {$LANG.generateOnlyButton}</button>
                    <button type="submit" name="generate_and_send_main" value="1" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                    {if $settings.backup_ftp_enabled == '1'}
                    <button type="submit" name="generate_and_send_backup" value="1" class="btn btn-warning"><i class="fas fa-archive"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    {/if}
                </form>
                <div class="report-result" id="hareketReportResult" style="margin-top:15px;"></div>
            </div>
        </div>
    </div>

    {* PERSONEL LİSTESİ RAPORU *}
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" id="headingPersonel">
            <h4 class="panel-title">
                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionGenerate" href="#collapsePersonel" aria-expanded="false" aria-controls="collapsePersonel">
                    <i class="fas fa-users-cog"></i> {$LANG.generatePersonelReportTitle}
                </a>
            </h4>
        </div>
        <div id="collapsePersonel" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingPersonel">
            <div class="panel-body">
                <p>{$LANG.generatePersonelReportHelpText}</p>
                <form method="post" action="{$modulelink}&action=do_generate_report" class="form-inline report-generation-form">
                    <input type="hidden" name="token" value="{$csrfToken}">
                    <input type="hidden" name="report_type" value="PERSONEL">
                    <button type="submit" name="generate_only" value="1" class="btn btn-info"><i class="fas fa-cogs"></i> {$LANG.generateOnlyButton}</button>
                    <button type="submit" name="generate_and_send_main" value="1" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                    {if $settings.backup_ftp_enabled == '1'}
                    <button type="submit" name="generate_and_send_backup" value="1" class="btn btn-warning"><i class="fas fa-archive"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    {/if}
                </form>
                <div class="report-result" id="personelReportResult" style="margin-top:15px;"></div>
            </div>
        </div>
    </div>
</div>

{* YEDEK FTP'DEN RAPOR ÇEKME VE GÖNDERME (İleri Aşama Özelliği) *}
{if $settings.backup_ftp_enabled == '1'}
<hr>
<h3>{$LANG.resendFromBackupFtpTitle}</h3>
<p>{$LANG.resendFromBackupFtpHelpText}</p>
<form method="post" action="{$modulelink}&action=resend_from_backup" class="form-horizontal">
    <input type="hidden" name="token" value="{$csrfToken}">
    <div class="form-group">
        <label class="col-md-3 control-label" for="backup_report_type">{$LANG.reportTypeLabel}</label>
        <div class="col-md-5">
            <select name="backup_report_type" id="backup_report_type" class="form-control">
                <option value="REHBER">{$LANG.rehberReportLabel}</option>
                <option value="HAREKET">{$LANG.hareketReportLabel}</option>
                <option value="PERSONEL">{$LANG.personelReportLabel}</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-md-3 control-label" for="backup_dosya_adi_filter">{$LANG.fileNameFilterLabel}</label>
        <div class="col-md-5">
            <input type="text" name="backup_dosya_adi_filter" id="backup_dosya_adi_filter" class="form-control" placeholder="{$LANG.fileNameFilterPlaceholder}">
        </div>
    </div>
    <div class="form-group">
        <label class="col-md-3 control-label" for="backup_date_range">{$LANG.dateRangeLabel}</label>
        <div class="col-md-5">
            <input type="text" name="backup_date_range" id="backup_date_range" class="form-control date-range-picker" placeholder="{$LANG.dateRangePlaceholder}">
        </div>
    </div>
    <div class="form-group text-center">
        <button type="submit" name="search_backup_ftp" value="1" class="btn btn-info"><i class="fas fa-search"></i> {$LANG.searchBackupFtpButton}</button>
    </div>
</form>

<div id="backupFtpSearchResults" style="margin-top:20px;">
    {* AJAX ile arama sonuçları buraya yüklenecek *}
</div>
{/if}


<script type="text/javascript">
{* JS kodları btk_admin_scripts.js içine taşındı. *}
</script>