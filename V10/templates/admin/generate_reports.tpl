{*
    WHMCS BTK Raporlama Modülü - Manuel Rapor Oluşturma ve Gönderme Sayfası
    Sürüm: 8.2.0 (Operasyon Merkezi)
*}

<div id="btk-report-global-flash-message">
{if $flashMessage}
    <div class="alert alert-{$flashMessage.type|default:'info'} text-center" role="alert">
        <i class="fas {if $flashMessage.type == 'success'}fa-check-circle{elseif $flashMessage.type == 'error'}fa-exclamation-circle{else}fa-info-circle{/if}"></i>
        {$flashMessage.message}
    </div>
{/if}
</div>

<p>{$LANG.generateReportsIntro}</p>

<div class="panel-group" id="accordionGenerate" role="tablist" aria-multiselectable="true">

    {* ABONE REHBER RAPORU *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingRehber">
            <h4 class="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#accordionGenerate" href="#collapseRehber" aria-expanded="true" aria-controls="collapseRehber">
                    <i class="fas fa-address-book"></i> {$LANG.generateRehberReportTitle}
                </a>
            </h4>
        </div>
        <div id="collapseRehber" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingRehber">
            <div class="panel-body">
                <p class="help-block">{$LANG.generateRehberReportHelpText|default:'Seçili Yetki Türü için TÜM abonelerin (aktif/iptal) güncel bilgilerini içeren kümülatif REHBER raporunu oluşturur.'}</p>
                <form method="post" action="{$modulelink}&action=do_generate_report" class="form-inline report-generation-form">
                    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                    <input type="hidden" name="report_type" value="REHBER">
                    <div class="form-group">
                        <label for="rehber_yetki_tipi">{$LANG.selectBtkAuthTypeForReportLabel}:</label>
                        <select name="yetki_tipi_kodu" id="rehber_yetki_tipi" class="form-control" required>
                            <option value="">{$LANG.selectOption}</option>
                            {foreach from=$activeBtkAuthTypesForReports item=authType}
                                <option value="{$authType.yetki_kodu}">{$authType.yetki_adi} ({$authType.grup|default:$authType.yetki_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                    <button type="submit" name="generation_action" value="generate_only" class="btn btn-info"><i class="fas fa-cogs"></i> {$LANG.generateOnlyButton}</button>
                    <button type="submit" name="generation_action" value="send_main" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                    {if $settings.backup_ftp_enabled == '1'}
                    <button type="submit" name="generation_action" value="send_backup" class="btn btn-warning"><i class="fas fa-archive"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    {/if}
                </form>
                <div class="report-result" id="rehberReportResult"></div>
            </div>
        </div>
    </div>

    {* ABONE HAREKET RAPORU *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingHareket">
            <h4 class="panel-title">
                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionGenerate" href="#collapseHareket" aria-expanded="false" aria-controls="collapseHareket">
                    <i class="fas fa-exchange-alt"></i> {$LANG.generateHareketReportTitle}
                </a>
            </h4>
        </div>
        <div id="collapseHareket" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingHareket">
            <div class="panel-body">
                <p class="help-block">{$LANG.generateHareketReportHelpText|default:'Seçili Yetki Türü için son gönderimden bu yana oluşan veya gönderilmemiş tüm abone hareketlerini içeren HAREKET raporunu oluşturur.'}</p>
                <form method="post" action="{$modulelink}&action=do_generate_report" class="form-inline report-generation-form">
                    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                    <input type="hidden" name="report_type" value="HAREKET">
                     <div class="form-group">
                        <label for="hareket_yetki_tipi">{$LANG.selectBtkAuthTypeForReportLabel}:</label>
                        <select name="yetki_tipi_kodu" id="hareket_yetki_tipi" class="form-control" required>
                            <option value="">{$LANG.selectOption}</option>
                            {foreach from=$activeBtkAuthTypesForReports item=authType}
                                <option value="{$authType.yetki_kodu}">{$authType.yetki_adi} ({$authType.grup|default:$authType.yetki_kodu})</option>
                            {/foreach}
                        </select>
                    </div>
                    <button type="submit" name="generation_action" value="generate_only" class="btn btn-info"><i class="fas fa-cogs"></i> {$LANG.generateOnlyButton}</button>
                    <button type="submit" name="generation_action" value="send_main" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                    {if $settings.backup_ftp_enabled == '1'}
                    <button type="submit" name="generation_action" value="send_backup" class="btn btn-warning"><i class="fas fa-archive"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    {/if}
                </form>
                <div class="report-result" id="hareketReportResult"></div>
            </div>
        </div>
    </div>

    {* PERSONEL LİSTESİ RAPORU *}
    <div class="panel panel-default btk-widget">
        <div class="panel-heading" role="tab" id="headingPersonel">
            <h4 class="panel-title">
                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordionGenerate" href="#collapsePersonel" aria-expanded="false" aria-controls="collapsePersonel">
                    <i class="fas fa-users-cog"></i> {$LANG.generatePersonelReportTitle}
                </a>
            </h4>
        </div>
        <div id="collapsePersonel" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingPersonel">
            <div class="panel-body">
                <p class="help-block">{$LANG.generatePersonelReportHelpText|default:'BTK\'ya gönderilecek formatta güncel personel listesi Excel dosyasını oluşturur.'}</p>
                <form method="post" action="{$modulelink}&action=do_generate_report" class="form-inline report-generation-form">
                    <input type="hidden" name="{$csrfTokenName}" value="{$csrfToken}">
                    <input type="hidden" name="report_type" value="PERSONEL">
                    <button type="submit" name="generation_action" value="generate_only" class="btn btn-info"><i class="fas fa-cogs"></i> {$LANG.generateOnlyButton}</button>
                    <button type="submit" name="generation_action" value="send_main" class="btn btn-primary"><i class="fas fa-upload"></i> {$LANG.generateAndSendMainFtpButton}</button>
                    {if $settings.backup_ftp_enabled == '1'}
                    <button type="submit" name="generation_action" value="send_backup" class="btn btn-warning"><i class="fas fa-archive"></i> {$LANG.generateAndSendBackupFtpButton}</button>
                    {/if}
                </form>
                <div class="report-result" id="personelReportResult"></div>
            </div>
        </div>
    </div>
</div>