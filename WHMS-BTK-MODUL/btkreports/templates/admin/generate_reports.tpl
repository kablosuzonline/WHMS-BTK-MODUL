{* WHMCS BTK Raporları Modülü - Rapor Oluşturma ve Gönderme Sayfası *}

{include file="./shared/alert_messages.tpl"} {* Ortak uyarı/bilgi mesajları şablonunu dahil et *}

<div class="btk-admin-page-container">
    <div class="btk-admin-page-header">
        <div class="btk-header-left">
            {if file_exists($modulepath|cat:'/logo.png')}
                <img src="{$modulelink|replace:'addonmodules.php?module=btkreports':''}/modules/addons/btkreports/logo.png" alt="{$LANG.btk_module_name} Logo" class="btk-header-logo">
            {/if}
            <h2>{$LANG.btk_generate_reports_title}</h2>
        </div>
        <div class="btk-header-right">
            <span class="btk-version-info">v{$version}</span>
        </div>
    </div>

    {include file="./shared/admin_header_menu.tpl" active_tab="generatereport"} {* Ortak navigasyon menüsünü dahil et ve aktif sekmeyi belirt *}

    <p style="margin-top: 20px;">{$LANG.btk_generate_report_page_desc}</p>

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-file-alt icon-spacer"></i>{$LANG.btk_generate_reports_title}</h3>
        </div>
        <div class="panel-body">
            <form method="post" action="{$modulelink}&action=generatereport" id="generateReportForm">
                <input type="hidden" name="token" value="{$csrfToken}" />
                <input type="hidden" name="generate_report_submit" value="1" />

                <div class="form-group">
                    <label for="report_type_to_generate">{$LANG.btk_report_type_label}:</label>
                    <select name="report_type_to_generate" id="report_type_to_generate" class="form-control" style="max-width: 400px;">
                        <option value="rehber">{$LANG.btk_report_type_rehber}</option>
                        <option value="hareket">{$LANG.btk_report_type_hareket}</option>
                        <option value="personel">{$LANG.btk_report_type_personel}</option>
                    </select>
                </div>

                {* ABONE HAREKET Raporu için Tarih Aralığı Seçenekleri (Opsiyonel) *}
                <div id="hareketReportOptions" style="display:none;" class="btk-report-options-group">
                    <h4>{$LANG.btk_report_options_title} - {$LANG.btk_report_type_hareket}</h4>
                    <p><small>{$LANG.btk_report_date_range_desc_hareket}</small></p>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="hareket_start_date">{$LANG.btk_report_date_range_start}:</label>
                                <input type="text" name="hareket_start_date" id="hareket_start_date" class="form-control date-picker" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="hareket_end_date">{$LANG.btk_report_date_range_end}:</label>
                                <input type="text" name="hareket_end_date" id="hareket_end_date" class="form-control date-picker" placeholder="YYYY-AA-GG">
                            </div>
                        </div>
                    </div>
                </div>

                {* PERSONEL LİSTESİ Raporu için Yıl ve Dönem Seçenekleri *}
                <div id="personelReportOptions" style="display:none;" class="btk-report-options-group">
                    <h4>{$LANG.btk_report_options_title} - {$LANG.btk_report_type_personel}</h4>
                     <p><small>{$LANG.btk_report_personel_info}</small></p>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="personel_report_year">{$LANG.btk_report_personel_year_label}:</label>
                                <select name="personel_report_year" id="personel_report_year" class="form-control" style="max-width: 150px;">
                                    {assign var=currentYear value="Y"|date}
                                    {section name=yearloop start=$currentYear-5 loop=$currentYear+1 step=-1}
                                        <option value="{$smarty.section.yearloop.index}" {if $smarty.section.yearloop.index == $currentYear}selected{/if}>{$smarty.section.yearloop.index}</option>
                                    {/section}
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="personel_report_period">{$LANG.btk_report_personel_period_label}:</label>
                                <select name="personel_report_period" id="personel_report_period" class="form-control" style="max-width: 250px;">
                                    <option value="1">{$LANG.btk_report_personel_period_june}</option>
                                    <option value="2">{$LANG.btk_report_personel_period_december}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                {*
                FTP Gönderme Seçenekleri - Bu beta sürümünde varsayılan olarak Ana FTP'ye gönderim aktif olacak,
                bu seçenekler ileride daha detaylı kontrol için eklenebilir.
                <div class="form-group">
                    <label>{$LANG.btk_report_send_to_ftp}:</label>
                    <div>
                        <label class="btk-switch btk-switch-inline">
                            <input type="checkbox" name="send_to_main_ftp" value="1" checked>
                            <span class="btk-slider round"></span>
                            <span class="btk-switch-label">{$LANG.btk_report_send_to_main_ftp}</span>
                        </label>
                    </div>
                    {if isset($settings.yedek_ftp_kullan) && $settings.yedek_ftp_kullan == '1'}
                    <div style="margin-top: 5px;">
                        <label class="btk-switch btk-switch-inline">
                            <input type="checkbox" name="send_to_backup_ftp" value="1" {if $settings.personel_excel_ad_format_yedek == '1'}checked{/if}>
                            <span class="btk-slider round"></span>
                            <span class="btk-switch-label">{$LANG.btk_report_send_to_backup_ftp}</span>
                        </label>
                    </div>
                    {/if}
                </div>
                *}

                <button type="submit" class="btn btn-success btn-lg" id="btnGenerateReport">
                    <i class="fas fa-cogs icon-spacer"></i>{$LANG.btk_button_generate_and_send}
                </button>
                <span id="reportGenerationSpinner" style="display:none; margin-left:15px;"><i class="fas fa-spinner fa-spin fa-lg"></i> {$LANG.btk_report_generating_please_wait}</span>
            </form>
        </div>
    </div>

    {* Arşivden Rapor Yeniden Gönderme Bölümü - İleride detaylandırılacak *}
    <div class="panel panel-info" style="margin-top: 30px;">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-history icon-spacer"></i>{$LANG.btk_resend_archive_title}</h3>
        </div>
        <div class="panel-body">
            <p>{$LANG.btk_resend_archive_desc}</p>
            <p class="text-muted"><em>Bu özellik yakında eklenecektir.</em></p>
            {* Arama formu ve sonuç listesi buraya gelecek *}
        </div>
    </div>
</div>

{* Bu şablon için gerekli JavaScript kodları btk_admin_scripts.js dosyasına taşınmıştır. *}
{* (Rapor tipine göre opsiyonları göster/gizle, tarih seçiciler, form submit spinner) *}

{* Gerekli Smarty Değişkenleri (btkreports.php -> generatereport action'ında atanmalı):
   - $flash_message (opsiyonel)
   - $modulepath, $modulelink, $version, $LANG, $csrfToken (standart)
   - $settings.yedek_ftp_kullan (Yedek FTP checkbox'ını göstermek için)
*}