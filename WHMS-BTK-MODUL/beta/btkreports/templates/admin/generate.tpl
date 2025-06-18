{* modules/addons/btkreports/templates/admin/generate.tpl *}
{* BTK Raporlarını Oluştur ve Gönder Sayfası *}

{if $moduleMessage}
    <div class="alert alert-{if $moduleMessage.type == 'success'}success{else}danger{/if}" role="alert">
        {$moduleMessage.message}
    </div>
{/if}

{if $action_result_generate}
    <div class="alert alert-{if $action_result_generate.status == 'success'}success{else}danger{/if}" id="generateActionResultArea">
        {$action_result_generate.message}
    </div>
{/if}

<div id="reportGenerationStatusArea" style="margin-bottom: 15px;">
    {* AJAX ile rapor oluşturma/gönderme durumu burada gösterilecek *}
</div>

<form method="post" action="{$modulelink}&action=generate&sub_action=create_report" id="generateReportForm">
    <input type="hidden" name="token" value="{$csrfToken}">

    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-file-signature"></i> {$lang.generate_reports_title}</h3>
        </div>
        <div class="panel-body">
            <p>{$lang.generate_reports_description}</p>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="report_type">{$lang.select_report_type}*</label>
                        <select name="report_type" id="report_type" class="form-control" required>
                            <option value="">{$lang.select_option}</option>
                            <option value="rehber" {if $smarty.post.report_type == 'rehber'}selected{/if}>{$lang.report_type_abone_rehber}</option>
                            <option value="hareket" {if $smarty.post.report_type == 'hareket'}selected{/if}>{$lang.report_type_abone_hareket}</option>
                            <option value="personel" {if $smarty.post.report_type == 'personel'}selected{/if}>{$lang.report_type_personel_list}</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-4" id="yetkiTuruSelectionArea" style="display:none;">
                    <div class="form-group">
                        <label for="yetki_turu_id_report">{$lang.select_yetki_turu_for_report}* <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.select_yetki_turu_for_report_desc|escape:'html'}"></i></label>
                        <select name="yetki_turu_id_report" id="yetki_turu_id_report" class="form-control">
                            <option value="">{$lang.select_option}</option>
                            <option value="all">-- {$lang.all_active_yetki_turleri} --</option>
                            {if $yetki_turleri_for_select}
                                {foreach from=$yetki_turleri_for_select item=yetki}
                                    <option value="{$yetki->id}" {if $smarty.post.yetki_turu_id_report == $yetki->id}selected{/if}>
                                        {$yetki->yetki_adi|escape:'html'} ({$yetki->yetki_kodu_kisa|escape:'html'})
                                    </option>
                                {/foreach}
                            {/if}
                        </select>
                    </div>
                </div>
                <div class="col-md-4" id="cntValueArea" style="display:none;">
                     <div class="form-group">
                        <label for="cnt_value">{$lang.cnt_value_auto} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.cnt_value_auto_desc|escape:'html'} {$lang.tooltip_cnt_value|escape:'html'}"></i></label>
                        <input type="text" name="cnt_value" id="cnt_value" value="{$smarty.post.cnt_value|escape:'html'}" class="form-control" placeholder="örn: 01 (Boş bırakılırsa otomatik)" maxlength="2" pattern="[0-9]{2}">
                    </div>
                </div>
            </div>

            <div class="row" id="hareketDateRangeArea" style="display:none;">
                <div class="col-md-12">
                    <label>{$lang.date_range_for_hareket} <i class="fas fa-info-circle text-info" data-toggle="tooltip" title="{$lang.date_range_for_hareket_desc|escape:'html'}"></i></label>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="start_date_hareket">{$lang.start_date}</label>
                        <div class="input-group date date-picker-range">
                            <input type="text" name="start_date_hareket" id="start_date_hareket" value="{$smarty.post.start_date_hareket|escape:'html'}" class="form-control">
                            <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="end_date_hareket">{$lang.end_date}</label>
                         <div class="input-group date date-picker-range">
                            <input type="text" name="end_date_hareket" id="end_date_hareket" value="{$smarty.post.end_date_hareket|escape:'html'}" class="form-control">
                            <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group" style="margin-top: 15px;">
                <button type="submit" name="report_action_btn" value="download_abn" class="btn btn-default actionButton" disabled><i class="fas fa-download"></i> {$lang.generate_and_download}</button>
                <button type="submit" name="report_action_btn" value="download_gz" class="btn btn-default actionButton" disabled><i class="fas fa-file-archive"></i> {$lang.generate_and_download_gz}</button>
                <button type="submit" name="report_action_btn" value="ftp_main" class="btn btn-primary actionButton" disabled><i class="fas fa-upload"></i> {$lang.generate_and_ftp_main}</button>
                {if $settings.use_backup_ftp == '1'}
                <button type="submit" name="report_action_btn" value="ftp_backup" class="btn btn-info actionButton" disabled><i class="fas fa-hdd"></i> {$lang.generate_and_ftp_backup}</button>
                <button type="submit" name="report_action_btn" value="ftp_both" class="btn btn-success actionButton" disabled><i class="fas fa-share-square"></i> {$lang.generate_and_ftp_both}</button>
                {/if}
            </div>
        </div>
    </div>
</form>

<hr>

{* BÖLÜM 1 SONU - Devamı sonraki bölümde (Arşivden Yeniden Gönderme) *}
{* modules/addons/btkreports/templates/admin/generate.tpl *}
{* BTK Raporlarını Oluştur ve Gönder Sayfası *}
{* BÖLÜM 2 / 2 (SON BÖLÜM) *}

    {* --- ÖNCEKİ BÖLÜMÜN DEVAMI --- *}

    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title"><i class="fas fa-history"></i> {$lang.resend_old_reports_title}</h3>
        </div>
        <div class="panel-body">
            <p>{$lang.resend_old_reports_desc}</p>
            <form method="post" action="{$modulelink}&action=generate&sub_action=search_archive" id="searchArchiveForm">
                <input type="hidden" name="token" value="{$csrfToken}">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="search_filename">{$lang.search_archived_reports_label}</label>
                            <input type="text" name="search_filename" id="search_filename" value="{$smarty.post.search_filename|escape:'html'}" class="form-control" placeholder="{$lang.search_filename_placeholder}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="search_report_type">{$lang.search_report_type_label}</label>
                            <select name="search_report_type" id="search_report_type" class="form-control">
                                <option value="">{$lang.all}</option>
                                <option value="REHBER" {if $smarty.post.search_report_type == 'REHBER'}selected{/if}>{$lang.report_type_abone_rehber}</option>
                                <option value="HAREKET" {if $smarty.post.search_report_type == 'HAREKET'}selected{/if}>{$lang.report_type_abone_hareket}</option>
                                <option value="PERSONEL" {if $smarty.post.search_report_type == 'PERSONEL'}selected{/if}>{$lang.report_type_personel_list}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label>{$lang.search_date_range_label}</label>
                            <div class="row">
                                <div class="col-xs-6">
                                     <div class="input-group date date-picker-range">
                                        <input type="text" name="search_start_date" id="search_start_date" value="{$smarty.post.search_start_date|escape:'html'}" class="form-control" placeholder="{$lang.start_date}">
                                        <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="input-group date date-picker-range">
                                        <input type="text" name="search_end_date" id="search_end_date" value="{$smarty.post.search_end_date|escape:'html'}" class="form-control" placeholder="{$lang.end_date}">
                                        <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label> </label>
                        <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-search"></i> {$lang.search_reports_button}</button>
                    </div>
                </div>
            </form>

            <div id="archiveSearchResultsArea" style="margin-top: 20px;">
                <h4>{$lang.archived_files_list_title}</h4>
                {if isset($archived_reports_list)}
                    {if $archived_reports_list}
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>{$lang.archived_filename}</th>
                                        <th>{$lang.archived_generation_date}</th>
                                        <th>FTP Sunucu</th>
                                        <th>{$lang.archived_original_cnt}</th>
                                        <th width="150">{$lang.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foreach from=$archived_reports_list item=report_file}
                                        <tr>
                                            <td>{$report_file.dosya_adi|escape:'html'}</td>
                                            <td>{$report_file.gonderim_baslangic_zamani|date_format:"%d.%m.%Y %H:%M"}</td>
                                            <td>{$report_file.ftp_sunucu_tipi|escape:'html'}</td>
                                            <td>{$report_file.cnt_degeri|escape:'html'}</td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-warning resend-report-btn"
                                                        data-fileid="{$report_file.id}"
                                                        data-filename="{$report_file.dosya_adi|escape:'html'}"
                                                        data-currentcnt="{$report_file.cnt_degeri|escape:'html'}"
                                                        data-toggle="tooltip" title="{$lang.resend_to_btk_ftp_button|escape:'html'}">
                                                    <i class="fas fa-redo-alt"></i> {$lang.resend_to_btk_ftp_button}
                                                </button>
                                            </td>
                                        </tr>
                                    {/foreach}
                                </tbody>
                            </table>
                        </div>
                        {* Sayfalama eklenebilir: {$pagination_archive} *}
                    {else}
                        <div class="alert alert-info">{$lang.no_records_found}</div>
                    {/if}
                {else}
                     <div class="alert alert-info">Arama yapmak için yukarıdaki filtreleri kullanın.</div>
                {/if}
            </div>
        </div>
    </div>

<script type="text/javascript">
$(document).ready(function() {
    // Tooltip'leri etkinleştir
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });

    // Tarih seçicileri etkinleştir
    if ($.fn.datepicker && typeof $.datepicker.regional['tr'] !== 'undefined') {
        $('.date-picker-range').datepicker({
            dateFormat: 'yy-mm-dd', // YYYY-AA-GG formatı
            monthNames: $.datepicker.regional['tr'].monthNames,
            dayNamesMin: $.datepicker.regional['tr'].dayNamesMin,
            firstDay: 1,
            changeMonth: true,
            changeYear: true,
            yearRange: "-5:+0" // Son 5 yıl
        });
    } else {
        console.warn("jQuery UI Datepicker veya TR regional bulunamadı.");
    }

    // Rapor türü seçimine göre alanları göster/gizle
    $('#report_type').change(function() {
        var selectedType = $(this).val();
        if (selectedType === 'rehber' || selectedType === 'hareket') {
            $('#yetkiTuruSelectionArea').slideDown('fast');
            $('#cntValueArea').slideDown('fast');
            $('.actionButton').prop('disabled', false); // Butonları genel olarak etkinleştir, yetki seçimi zorunlu olacak
            if (selectedType === 'hareket') {
                $('#hareketDateRangeArea').slideDown('fast');
            } else {
                $('#hareketDateRangeArea').slideUp('fast');
            }
        } else if (selectedType === 'personel') {
            $('#yetkiTuruSelectionArea').slideUp('fast');
            $('#hareketDateRangeArea').slideUp('fast');
            $('#cntValueArea').slideUp('fast'); // Personel için CNT genellikle dosya adı içinde yönetilir, manuel değil
            $('.actionButton').prop('disabled', false);
        } else {
            $('#yetkiTuruSelectionArea').slideUp('fast');
            $('#hareketDateRangeArea').slideUp('fast');
            $('#cntValueArea').slideUp('fast');
            $('.actionButton').prop('disabled', true);
        }
    }).trigger('change'); // Sayfa yüklendiğinde de çalıştır

    // Yeni Rapor Oluşturma Formu AJAX ile Gönderim (İsteğe Bağlı, şimdilik standart form submit)
    // Bu kısım, sayfa yenilenmeden işlem yapmak istenirse daha sonra eklenebilir.
    // $('#generateReportForm').submit(function(e) {
    //     e.preventDefault();
    //     var formData = $(this).serialize();
    //     var actionButtonValue = $(document.activeElement).val(); // Hangi butona tıklandığını al
    //     formData += '&report_action_btn=' + actionButtonValue;

    //     $('#reportGenerationStatusArea').html('<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> {$lang.report_generating_please_wait|escape:"javascript"}</div>');
    //     $('.actionButton').prop('disabled', true);

    //     $.ajax({
    //         url: $(this).attr('action'),
    //         type: 'POST',
    //         data: formData,
    //         dataType: 'json', // PHP tarafı JSON dönmeli
    //         success: function(data) {
    //             var alertClass = data.success ? 'alert-success' : 'alert-danger';
    //             $('#reportGenerationStatusArea').html('<div class="alert ' + alertClass + '">' + $('<div>').text(data.message).html() + '</div>');
    //             if (data.download_url) { // Eğer indirme linki varsa
    //                 window.location.href = data.download_url;
    //             }
    //         },
    //         error: function(jqXHR, textStatus, errorThrown) {
    //             $('#reportGenerationStatusArea').html('<div class="alert alert-danger">{$lang.error_unexpected|escape:"javascript"} (AJAX: ' + $('<div>').text(textStatus).html() + ')</div>');
    //         },
    //         complete: function() {
    //             $('.actionButton').prop('disabled', false);
    //             // Rapor türü seçimine göre butonları tekrar ayarla
    //             $('#report_type').trigger('change');
    //         }
    //     });
    // });


    // Arşivden Raporu Yeniden Gönder
    $('.resend-report-btn').click(function() {
        var fileId = $(this).data('fileid');
        var fileName = $(this).data('filename');
        var currentCnt = $(this).data('currentcnt');
        var newCnt = ('0' + (parseInt(currentCnt, 10) + 1)).slice(-2); // CNT'yi bir artır ve iki haneli yap

        var confirmMsg = '{$lang.resend_confirm_message|escape:"javascript"}';
        confirmMsg = confirmMsg.replace('{filename}', fileName).replace('{new_cnt}', newCnt);

        if (confirm(confirmMsg)) {
            var btn = $(this);
            var originalBtnText = btn.html();
            btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');

            $('#reportGenerationStatusArea').html('<div class="alert alert-info"><i class="fas fa-spinner fa-spin"></i> ' + fileName + ' FTP\'ye gönderiliyor...</div>');

            $.ajax({
                url: '{$modulelink}&action=generate&sub_action=resend_archive&ajax=1',
                type: 'POST',
                data: {
                    file_id_to_resend: fileId,
                    new_cnt_value: newCnt,
                    token: '{$csrfToken}' // Genel token kullanılabilir
                },
                dataType: 'json',
                success: function(data) {
                    var alertClass = data.success ? 'alert-success' : 'alert-danger';
                    $('#reportGenerationStatusArea').html('<div class="alert ' + alertClass + '">' + $('<div>').text(data.message).html() + '</div>');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                     $('#reportGenerationStatusArea').html('<div class="alert alert-danger">{$lang.error_unexpected|escape:"javascript"} (AJAX: ' + $('<div>').text(textStatus).html() + ')</div>');
                },
                complete: function() {
                    btn.prop('disabled', false).html(originalBtnText);
                }
            });
        }
    });

});
</script>