{* modules/addons/btkreports/templates/admin/generate.tpl (v1.0.23) *}

{if $action eq 'generate'} {* Bu başlık sadece bu action için görünsün *}
    <div class="btk-header-container" style="margin-bottom: 15px;">
        <div class="btk-module-title">
            <i class="fas fa-file-export" style="font-size: 1.5em; margin-right: 8px; vertical-align: middle;"></i>
            <h2 style="display: inline-block; vertical-align: middle; margin-top: 0; margin-bottom: 0;">{$_ADDONLANG.btkreports_tab_generate_report}</h2>
        </div>
    </div>
{/if}

{if isset($successMessage) && $successMessage}
    <div class="alert alert-success text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-check-circle"></i> {$successMessage}
    </div>
{/if}
{if isset($errorMessage) && $errorMessage}
    <div class="alert alert-danger text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-times-circle"></i> {$errorMessage}
    </div>
{/if}
{if isset($infoMessage) && $infoMessage}
    <div class="alert alert-info text-center alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <i class="fas fa-info-circle"></i> {$infoMessage}
    </div>
{/if}


<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title"><i class="fas fa-cogs"></i> {$_ADDONLANG.btkreports_generate_title|default:'Manuel Rapor Oluşturma ve Gönderme'}</h3>
    </div>
    <div class="panel-body">
        <form method="post" action="{$modulelink}&action=generate" class="form-horizontal" role="form" id="generateReportForm">
            <input type="hidden" name="token" value="{$csrfToken}">

            <div class="form-group">
                <label for="report_type" class="col-sm-3 control-label">{$_ADDONLANG.btkreports_generate_report_type}</label>
                <div class="col-sm-5">
                    <select name="report_type" id="report_type" class="form-control" required>
                        <option value="">{$_ADDONLANG.btkreports_generate_select_report_type|default:'-- Rapor Türü Seçin --'}</option>
                        <option value="rehber" {if isset($smarty.post.report_type) && $smarty.post.report_type == 'rehber'}selected{/if}>{$_ADDONLANG.btkreports_generate_report_type_rehber|default:'REHBER (Tüm Aboneler)'}</option>
                        <option value="hareket" {if isset($smarty.post.report_type) && $smarty.post.report_type == 'hareket'}selected{/if}>{$_ADDONLANG.btkreports_generate_report_type_hareket|default:'HAREKET (Değişiklikler)'}</option>
                        {* Personel raporu için de bir seçenek eklenebilir, ancak onun kendi sayfasında butonu vardı. *}
                        {* <option value="personel">{$_ADDONLANG.btkreports_generate_report_type_personnel|default:'PERSONEL Listesi'}</option> *}
                    </select>
                </div>
            </div>

            <div id="hareketTarihAlani" style="{if !(isset($smarty.post.report_type) && $smarty.post.report_type == 'hareket')}display:none;{/if}">
                <div class="form-group">
                    <label class="col-sm-3 control-label">{$_ADDONLANG.btkreports_generate_date_range}</label>
                    <div class="col-sm-4">
                        <div class="input-group date">
                            <input type="text" name="date_from" class="form-control date-picker-generate" value="{$smarty.post.date_from|default:date('Y-m-d')}" placeholder="YYYY-AA-GG">
                            <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                        <span class="help-block">{$_ADDONLANG.btkreports_generate_date_from}</span>
                    </div>
                    <div class="col-sm-4">
                        <div class="input-group date">
                            <input type="text" name="date_to" class="form-control date-picker-generate" value="{$smarty.post.date_to|default:date('Y-m-d')}" placeholder="YYYY-AA-GG">
                            <span class="input-group-addon"><i class="fas fa-calendar-alt"></i></span>
                        </div>
                        <span class="help-block">{$_ADDONLANG.btkreports_generate_date_to}</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-3 control-label">{$_ADDONLANG.btkreports_generate_action}</label>
                <div class="col-sm-9">
                    <div class="radio">
                        <label>
                            <input type="radio" name="generate_action" value="generate_download" checked>
                            {$_ADDONLANG.btkreports_generate_action_download|default:'Oluştur ve İndir (.gz)'}
                        </label>
                    </div>
                    <div class="radio">
                        <label>
                            <input type="radio" name="generate_action" value="generate_ftp">
                            {$_ADDONLANG.btkreports_generate_action_ftp|default:'Oluştur ve FTP\'ye Yükle'}
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="form-group text-center" style="margin-top: 20px;">
                <button type="submit" id="btnGenerateReport" class="btn btn-primary btn-lg" data-loading-text="<i class='fas fa-spinner fa-spin'></i> {$_ADDONLANG.btkreports_generating_report|default:'Rapor Oluşturuluyor...'}">
                    <i class="fas fa-cogs"></i> {$_ADDONLANG.btkreports_generate_button|default:'Rapor Oluştur'}
                </button>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
$(document).ready(function() {
    // Rapor türü seçimine göre tarih alanlarını göster/gizle
    $('#report_type').on('change', function() {
        if ($(this).val() === 'hareket') {
            $('#hareketTarihAlani').slideDown();
            $('#hareketTarihAlani input[name="date_from"]').prop('required', true);
            $('#hareketTarihAlani input[name="date_to"]').prop('required', true);
        } else {
            $('#hareketTarihAlani').slideUp();
            $('#hareketTarihAlani input[name="date_from"]').prop('required', false);
            $('#hareketTarihAlani input[name="date_to"]').prop('required', false);
        }
    }).trigger('change'); // Sayfa yüklendiğinde de durumu kontrol et

    // Tarih alanları için datepicker
    if (typeof $.fn.datepicker === 'function') {
        $('.date-picker-generate').datepicker({
            dateFormat: 'yy-mm-dd', // WHMCS ve MySQL ile uyumlu format
            changeMonth: true,
            changeYear: true,
            yearRange: "-5:+0" // Son 5 yıl ve bu yıl
        });
    }

    // Form gönderildiğinde butonu loading durumuna getir
    $('#generateReportForm').on('submit', function() {
        var isValid = true;
        if ($('#report_type').val() === '') {
            alert('{$_ADDONLANG.btkreports_generate_select_report_type_alert|escape:"javascript"}');
            isValid = false;
        }
        if ($('#report_type').val() === 'hareket') {
            if ($('input[name="date_from"]').val() === '' || $('input[name="date_to"]').val() === '') {
                 alert('{$_ADDONLANG.btkreports_generate_date_range_alert|escape:"javascript"}');
                isValid = false;
            }
        }
        
        if (isValid) {
            $('#btnGenerateReport').button('loading');
        } else {
            return false; // Formu gönderme
        }
        // Eğer AJAX ile gönderilecekse, burada e.preventDefault() ve AJAX kodu olmalı.
        // Şimdilik normal form submit ile çalışıyor.
    });
});
</script>