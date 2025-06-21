// WHMCS BTK Raporlama Modülü - Admin Arayüzü JavaScript Dosyası
// Dosya: assets/js/btk_admin_scripts.js

// Global değişkenler (şablondan aktarıldığı varsayılıyor)
// `modulelink`, `LANG`, `csrfTokenGlobal` değişkenlerinin WHMCS şablon motoruyla
// sayfanın <head> veya <body> sonunda <script> etiketleri içinde tanımlandığını varsayıyoruz.
// Örnek: <script>var modulelinkGlobal = '{$modulelink}'; var LANG = {json_encode($LANG)}; var csrfTokenGlobal = '{$csrfToken}';</script>

function getBtkWhmcsCSRFToken() {
    if (typeof WHMCS !== 'undefined' && typeof WHMCS.security !== 'undefined' && typeof WHMCS.security.getToken === 'function') {
        return WHMCS.security.getToken();
    }
    var tokenInput = $('input[name="token"]').first();
    if (tokenInput.length) {
        return tokenInput.val();
    }
    if (typeof csrfTokenGlobal !== 'undefined') {
        return csrfTokenGlobal;
    }
    console.warn('CSRF Token could not be reliably found for AJAX request.');
    return '';
}

function getBtkLang(key, fallbackText) {
    if (typeof LANG !== 'undefined' && LANG[key]) {
        return LANG[key];
    }
    // console.warn("Dil anahtarı bulunamadı: " + key); // Geliştirme sırasında faydalı olabilir
    return fallbackText || key;
}

$(document).ready(function() {
    // modulelink'in global olarak tanımlandığını varsayıyoruz.
    // Eğer değilse, her AJAX çağrısında URL'yi dinamik olarak oluşturmak gerekebilir.
    var localModuleLink = (typeof modulelinkGlobal !== 'undefined') ? modulelinkGlobal : './addonmodules.php?module=btkreports';


    // --- Genel UI Elemanları Başlatma ---
    if (typeof $.fn.bootstrapToggle === 'function') {
        $('.btk-toggle').bootstrapToggle();
    } else {
        console.warn('BTK Reports: Bootstrap Toggle kütüphanesi yüklenmemiş.');
    }

    if (typeof $.fn.tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip({ container: 'body', trigger: 'hover' });
    } else {
        console.warn('BTK Reports: Bootstrap Tooltip kütüphanesi yüklenmemiş.');
    }

    if (typeof $.fn.DataTable === 'function') {
        var dtLangUrl = "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json";
        $('#tblPersonelList, #tblPopDefinitions, #tblGeneralLogs, #tblFtpLogs').DataTable({
            "language": { "url": dtLangUrl },
            "order": [[0, "desc"]],
            "responsive": true,
            "deferRender": true
        });
        if ($('#tblPopDefinitions').length) { // POP Adına göre sırala
            $('#tblPopDefinitions').DataTable().order([1, "asc"]).draw();
        }
    } else {
        console.warn('BTK Reports: DataTables kütüphanesi yüklenmemiş.');
    }

    if (typeof flatpickr !== 'undefined') {
        var fpLocale = (typeof flatpickr.l10ns !== 'undefined' && typeof flatpickr.l10ns.tr !== 'undefined') ? flatpickr.l10ns.tr : undefined;
        $(".date-picker").flatpickr({ dateFormat: "Y-m-d", allowInput: true, locale: fpLocale });
        $(".date-picker-yyyymmdd").flatpickr({ dateFormat: "Ymd", allowInput: true, locale: fpLocale });
        $(".datetime-picker").flatpickr({ enableTime: true, dateFormat: "YmdHis", time_24hr: true, allowInput: true, locale: fpLocale });
        $(".date-range-picker").flatpickr({ mode: "range", dateFormat: "Y-m-d", allowInput: true, locale: fpLocale });
    } else {
        console.warn('BTK Reports: Flatpickr kütüphanesi yüklenmemiş.');
    }

    // --- index.tpl için FTP Durum Kontrolü ---
    if ($('#btnCheckFtpStatus').length) {
        function checkAllFtpStatuses() {
            var statusArea = $('#ftpStatusCheckArea');
            var statusTable = $('#ftpStatusTable');
            statusArea.html('<p class="text-center"><i class="fas fa-spinner fa-spin"></i> ' + getBtkLang('checkingFtpStatus', 'FTP durumları kontrol ediliyor...') + '</p>').show();
            statusTable.hide();
            $.post(localModuleLink + "&ajax=1&action=test_ftp_connection_all", { token: getBtkWhmcsCSRFToken() }, function(data) {
                statusArea.hide(); statusTable.show();
                if (data.main_status) {
                    $('#mainFtpStatus').html('<span class="label ' + (data.main_status.status === 'success' ? 'label-success' : 'label-danger') + '">' + data.main_status.message + '</span>');
                } else {
                     $('#mainFtpStatus').html('<span class="label label-danger">' + getBtkLang('errorOccurred', 'Bir hata oluştu.') + '</span>');
                }
                if ($('#backupFtpStatus').length) {
                    if (data.backup_status) {
                        $('#backupFtpStatus').html('<span class="label ' + (data.backup_status.status === 'success' ? 'label-success' : 'label-danger') + '">' + data.backup_status.message + '</span>');
                    } else {
                        $('#backupFtpStatus').html('<span class="label label-danger">' + getBtkLang('errorOccurred', 'Bir hata oluştu.') + '</span>');
                    }
                }
            }, "json").fail(function() {
                statusArea.hide(); statusTable.show();
                $('#mainFtpStatus').html('<span class="label label-danger">' + getBtkLang('ajaxRequestFailed', 'İstek başarısız.') + '</span>');
                if ($('#backupFtpStatus').length) {
                    $('#backupFtpStatus').html('<span class="label label-danger">' + getBtkLang('ajaxRequestFailed', 'İstek başarısız.') + '</span>');
                }
            });
        }
        checkAllFtpStatuses();
        $('#btnCheckFtpStatus').click(checkAllFtpStatuses);
    }

    // --- config.tpl için Scriptler ---
    if ($('#btkConfigForm').length) {
        $('#ftp_use_backup').change(function() { $('#backupFtpSettings').slideToggle($(this).is(':checked')); }).trigger('change');
        $('#btnTestMainFtp, #btnTestBackupFtp').click(function() {
            var btn = $(this); var type = btn.attr('id') === 'btnTestMainFtp' ? 'main' : 'backup';
            var res = $('#' + type + 'FtpTestResult');
            res.html('<i class="fas fa-spinner fa-spin"></i> ' + getBtkLang('testingFtpConnection', 'Test ediliyor...')); btn.prop('disabled', true);
            $.post(localModuleLink + "&ajax=1&action=test_ftp_connection", {
                token: getBtkWhmcsCSRFToken(), ftp_type: type, host: $('#ftp_host_' + type).val(), user: $('#ftp_user_' + type).val(), pass: $('#ftp_pass_' + type).val()
            }, function(data) {
                res.html('<span class="' + (data.status === 'success' ? 'text-success' : 'text-danger') + '"><i class="fas ' + (data.status === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + data.message + '</span>');
            },"json").fail(function() { res.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + getBtkLang('ajaxRequestFailed', 'İstek başarısız.') + '</span>'); }).always(function() { btn.prop('disabled', false); });
        });
    }
// --- BÖLÜM 1 / 2 SONU - (btk_admin_scripts.js, Genel Başlatmalar ve Yardımcı Fonksiyonlar - authadmin Uyumlu)

// --- BÖLÜM 2 / 2 BAŞI - (btk_admin_scripts.js, Sayfa Özel Scriptleri ve AJAX İşlemleri - authadmin Uyumlu)
    // --- Dinamik Adres Dropdownları için Genel Fonksiyon ---
    function btkPopulateAdresDropdown(sourceElement, targetSelectId, ajaxActionSuffix, parentIdValue, defaultOptionLangKey, selectedValueForTarget) {
        var targetElement = $('#' + targetSelectId);
        var defaultOptionText = getBtkLang(defaultOptionLangKey, 'Seçiniz...');
        targetElement.html('<option value="">' + defaultOptionText + '</option>').prop('disabled', true);

        var currentDropdown = targetElement;
        var nextTargetId;
        // Zincirleme olarak alt dropdownları sıfırla
        while (true) {
            nextTargetId = currentDropdown.data('target-mahalle') || currentDropdown.data('target-sokak') || currentDropdown.data('target-bina') || currentDropdown.data('target-daire'); // Genişletilebilir
            if (nextTargetId && $('#' + nextTargetId).length) {
                currentDropdown = $('#' + nextTargetId);
                var nextDefaultKey = currentDropdown.data('default-option-key') || 'selectOption';
                currentDropdown.html('<option value="">' + getBtkLang(nextDefaultKey, 'Seçiniz...') + '</option>').prop('disabled', true);
            } else {
                break;
            }
        }

        if (parentIdValue && parentIdValue !== '' && parentIdValue != '0') { // 0 ID'li bir parent olmamalı
            targetElement.prop('disabled', false).html('<option value="">' + getBtkLang('loadingData', 'Yükleniyor...') + '</option>');
            $.post(localModuleLink + "&ajax=1&action=get_adres_data_" + ajaxActionSuffix, {
                token: getBtkWhmcsCSRFToken(),
                parent_id: parentIdValue
            }, function(data) {
                targetElement.html('<option value="">' + defaultOptionText + '</option>');
                if (data.status === 'success' && data.items && data.items.length > 0) {
                    $.each(data.items, function(key, item) {
                        var option = $('<option></option>').attr('value', item.id).text(item.name);
                        if (selectedValueForTarget && item.id == selectedValueForTarget) {
                            option.prop('selected', true);
                        }
                        targetElement.append(option);
                    });
                    if (selectedValueForTarget && targetElement.val() == selectedValueForTarget) {
                        targetElement.trigger('change');
                    }
                } else {
                    targetElement.append('<option value="" disabled>' + (data.message || getBtkLang('noDataFound', 'Veri bulunamadı.')) + '</option>');
                }
            }, "json").fail(function() {
                 targetElement.html('<option value="">' + getBtkLang('ajaxRequestFailed', 'İstek başarısız.') + '</option>');
            });
        }
    }

    $('body').on('change', 'select.adres-il-select', function() {
        var ilId = $(this).val();
        var targetIlceId = $(this).data('target-ilce');
        var selectedIlceId = $(this).data('original-ilce-id');
        if (targetIlceId) {
            btkPopulateAdresDropdown($(this), targetIlceId, 'ilceler', ilId, 'selectIlceOption', selectedIlceId);
        }
    });
    $('body').on('change', 'select.adres-ilce-select', function() {
        var ilceId = $(this).val();
        var targetMahalleId = $(this).data('target-mahalle');
        var selectedMahalleId = $(this).data('original-mahalle-id');
        if (targetMahalleId) {
            btkPopulateAdresDropdown($(this), targetMahalleId, 'mahalleler', ilceId, 'selectMahalleOption', selectedMahalleId);
        }
    });

    // Sayfa yüklendiğinde adres dropdownlarını tetikleme (önceden seçili değerler için)
    $('select.adres-il-select').each(function(){
        var $this = $(this);
        // `data-original-value` şablonda set edilmeli, `btkData.abone_adres_yerlesim_il_id` gibi
        var originalValue = $this.data('original-value'); 
        if (originalValue && $this.find('option[value="' + originalValue + '"]').length > 0) {
            $this.val(originalValue).trigger('change');
        } else if ($this.val() && $this.val() !== '') { // Eğer bir değer seçiliyse yine de tetikle
             $this.trigger('change');
        }
    });


    // --- TCKN Doğrulama (Genel Fonksiyon) ---
    function validateBtkTckn(tcknInput, statusSpan, adValue, soyadValue, dogumYiliValue, actionType) {
        var tckn = tcknInput.val();
        statusSpan.html(''); // Önceki durumu temizle
        if (tckn.length === 11) {
            statusSpan.html('<i class="fas fa-spinner fa-spin text-info"></i>');
            $.post(localModuleLink + "&ajax=1&action=" + actionType, {
                token: getBtkWhmcsCSRFToken(), tckn: tckn, ad: adValue, soyad: soyadValue, dogum_yili: dogumYiliValue
            }, function(data) {
                var iconClass = 'fas text-danger fa-times-circle';
                var titleText = data.message || getBtkLang('tcknInvalid', 'TCKN Geçersiz');
                if (data.status === 'success' && data.isValid) {
                    iconClass = 'fas text-success fa-check-circle';
                    titleText = data.message || getBtkLang('tcknValid', 'TCKN Geçerli');
                }
                statusSpan.html('<i class="' + iconClass + '" title="' + titleText + '"></i>');
                if (typeof $.fn.tooltip === 'function') { statusSpan.find('i').tooltip({container: 'body', trigger: 'hover'}); }
            }, "json").fail(function() {
                statusSpan.html('<i class="fas fa-exclamation-triangle text-warning" title="' + getBtkLang('tcknValidationFailedAjax', 'Doğrulama servisi hatası.') + '"></i>');
                if (typeof $.fn.tooltip === 'function') { statusSpan.find('i').tooltip({container: 'body', trigger: 'hover'}); }
            });
        } else if (tckn.length > 0) {
            statusSpan.html('<i class="fas fa-times-circle text-danger" title="' + getBtkLang('tcknMustBe11Digits', 'TCKN 11 haneli olmalıdır.') + '"></i>');
            if (typeof $.fn.tooltip === 'function') { statusSpan.find('i').tooltip({container: 'body', trigger: 'hover'}); }
        }
    }
    // Client Details TCKN
    $('#abone_tc_kimlik_no').on('blur', function() {
        var ad = WHMCS.clients.firstname || ''; var soyad = WHMCS.clients.lastname || '';
        var dogumTarihiFull = $('#abone_dogum_tarihi').val();
        var dogumYili = (dogumTarihiFull && dogumTarihiFull.length === 8) ? dogumTarihiFull.substring(0, 4) : '';
        validateBtkTckn($(this), $(this).closest('.form-group').find('.tckn-validation-status'), ad, soyad, dogumYili, 'validate_tckn_customer');
    });
    // Personel Modal TCKN
    $('#modal_tc_kimlik_no').on('blur', function() {
        var ad = $('#modal_adi').val(); var soyad = $('#modal_soyadi').val();
        validateBtkTckn($(this), $('.tckn-validation-status-modal'), ad, soyad, '', 'validate_tckn_personel');
    });

    // --- Form Gönderimlerinde TCKN Uyarısı ---
    $('form[action*="save_client_btk_details"], form[action*="save_service_btk_details"], #editPersonelForm, #popDefinitionForm').submit(function(e) {
        var tcknInput = $(this).find('.tckn-input, .tckn-input-modal'); // TCKN inputunu bul
        if (tcknInput.length > 0 && tcknInput.val().length > 0) { // Sadece TCKN girilmişse kontrol et
            var tcknStatusIcon = tcknInput.closest('.form-group').find('.tckn-validation-status i, .tckn-validation-status-modal i');
            if (tcknStatusIcon.length && (tcknStatusIcon.hasClass('fa-times-circle') || tcknStatusIcon.hasClass('fa-exclamation-triangle'))) {
                if (!confirm(getBtkLang('tcknNotValidatedWarningConfirm', 'TC Kimlik Numarası doğrulanmadı veya hatalı. Yine de kaydetmek istediğinize emin misiniz?'))) {
                    e.preventDefault();
                }
            }
        }
    });
    
    // --- Modal Yönetimi (Personel ve ISS POP için ortaklaştırma denemesi) ---
    $('#editPersonelModal, #addEditPopModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); var mode = button.data('mode'); var modal = $(this);
        var form = modal.find('form'); form[0].reset();
        modal.find('input[type="hidden"][id$="_modal"]').val(''); // Hidden ID'leri temizle
        modal.find('.btk-toggle').bootstrapToggle('off'); // Toggle'ları default off yap

        var ajaxAction = modal.attr('id') === 'editPersonelModal' ? 'get_personel_details' : 'get_pop_details';
        var idParamName = modal.attr('id') === 'editPersonelModal' ? 'personel_id' : 'pop_id';
        var recordId = button.data(idParamName.replace('_id',''));

        // Adres dropdownları için original-id'leri temizle (ekleme modu için)
        modal.find('select.adres-il-select').removeData('original-il-id').removeData('original-ilce-id').removeData('original-mahalle-id');
        modal.find('select.adres-ilce-select, select.adres-mahalle-select').html('<option value="">' + getBtkLang( $(this).data('default-option-key') || 'selectOption', 'Seçiniz') + '</option>').prop('disabled', true);


        if (mode === 'edit' && recordId) {
            modal.find('.modal-title').text(getBtkLang(modal.attr('id') === 'editPersonelModal' ? 'editPersonelModalTitle' : 'editPopModalTitle', 'Düzenle'));
            modal.find('input[name="' + idParamName + '_modal"]').val(recordId);
            
            $.post(localModuleLink + "&ajax=1&action=" + ajaxAction, { token: getBtkWhmcsCSRFToken(), [idParamName]: recordId }, function(data) {
                if (data.status === 'success') {
                    var record = data.personel || data.pop;
                    if (record) {
                        var formPrefix = modal.attr('id') === 'editPersonelModal' ? 'modal_personel_data' : 'popdata';
                        $.each(record, function(key, value) {
                            var field = modal.find('[name="' + formPrefix + '[' + key + ']"]');
                            if (field.is(':checkbox') && field.hasClass('btk-toggle')) {
                                field.bootstrapToggle(value == 1 ? 'on' : 'off');
                            } else if (field.is('select') && key === 'il_id') { // Adres İl için özel durum
                                field.data('original-il-id', value)
                                     .data('original-ilce-id', record.ilce_id) // PHP'den ilce_id ve mahalle_id gelmeli
                                     .data('original-mahalle-id', record.mahalle_id)
                                     .val(value).trigger('change');
                            } else if (field.is('select')) {
                                field.val(value);
                            } else {
                                field.val(value);
                            }
                        });
                        if(ajaxAction === 'get_personel_details') $('#modalPersonelName').text((record.adi || '') + ' ' + (record.soyadi || ''));
                    }
                } else { alert(data.message || getBtkLang('errorFetchingDetails', 'Detaylar alınırken hata.')); modal.modal('hide'); }
            }, "json").fail(function() { alert(getBtkLang('ajaxRequestFailed')); modal.modal('hide'); });
        } else { // Add mode
             modal.find('.modal-title').text(getBtkLang(modal.attr('id') === 'editPersonelModal' ? 'addNewPersonelButton' : 'addNewPopButton', 'Yeni Ekle'));
             if(modal.attr('id') === 'addEditPopModal') $('#modal_aktif_pasif_durum').bootstrapToggle('on');
        }
    });

    // --- iss_pop_management.tpl - POP Silme ---
    $('body').on('click', '.btn-delete-pop', function(e) {
        e.preventDefault(); var popId = $(this).data('pop-id'); var popName = $(this).data('pop-name');
        if (confirm(getBtkLang('confirmDeletePopText', "'%s' adlı POP noktasını silmek istediğinizden emin misiniz?").replace('%s', popName))) {
            var form = $('<form action="' + localModuleLink + '&action=delete_pop_definition" method="post">' +
                         '<input type="hidden" name="token" value="' + getBtkWhmcsCSRFToken() + '" />' +
                         '<input type="hidden" name="pop_id" value="' + popId + '" />' +
                         '</form>');
            $('body').append(form); form.submit(); // Bu submit sonrası sayfa yenilenecek, authadmin çalışacak.
        }
    });

    // --- generate_reports.tpl - Rapor Oluşturma ---
    if ($('.report-generation-form').length) {
        $('.report-generation-form').submit(function(e) {
            e.preventDefault(); var form = $(this); var resultDiv = form.next('.report-result'); var submitButton = $(document.activeElement);
            resultDiv.html('<p class="text-info"><i class="fas fa-spinner fa-spin"></i> ' + getBtkLang('generatingReportPleaseWait', 'Rapor oluşturuluyor...') + '</p>');
            form.find('button').prop('disabled', true); var formData = form.serializeArray();
            if (submitButton.attr('name')) formData.push({ name: submitButton.attr('name'), value: submitButton.val() });
            formData.push({ name: 'token', value: getBtkWhmcsCSRFToken() }); // Token'ı ekle

            $.post(form.attr('action') + "&ajax=1", formData, function(data) {
                var alertClass = data.status === 'success' ? 'alert-success' : 'alert-danger';
                var iconClass = data.status === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
                var message = '<div class="alert ' + alertClass + '"><i class="fas ' + iconClass + '"></i> ' + data.message;
                if (data.file_path_download) message += ' <a href="' + data.file_path_download + '" class="btn btn-xs btn-success" download><i class="fas fa-download"></i> ' + getBtkLang('downloadFileButton', 'Dosyayı İndir') + '</a>';
                if (data.file_name) message += '<br>' + getBtkLang('generatedFileName', 'Oluşturulan Dosya:') + ' <strong>' + data.file_name + '</strong>';
                message += '</div>'; resultDiv.html(message);
            }, "json").fail(function() {
                resultDiv.html('<div class="alert alert-danger"><i class="fas fa-times-circle"></i> ' + getBtkLang('ajaxRequestFailed') + '</div>');
            }).always(function() { form.find('button').prop('disabled', false); });
        });
    }

}); // End of document ready
// --- BÖLÜM 2 / 2 SONU - (btk_admin_scripts.js, Sayfa Özel Scriptleri ve AJAX İşlemleri - authadmin Uyumlu)