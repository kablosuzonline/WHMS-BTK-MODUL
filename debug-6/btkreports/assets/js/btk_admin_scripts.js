/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Admin JavaScript Kodları
 * Sürüm: 6.5.2 - Tüm fonksiyonlar dolduruldu, personel modal hatası düzeltildi.
 */

(function($, window, document, undefined) {
    "use strict";

    var btkModule = {
        vars: {
            moduleLink: '',
            csrfToken: '',
            lang: {},
            allEk3HizmetTipleri: []
        },
        
        init: function() {
            // Varsayılan değişkenleri ata
            this.vars.moduleLink = typeof window.btkModuleLink !== 'undefined' ? window.btkModuleLink : '';
            this.vars.csrfToken = typeof window.btkCsrfToken !== 'undefined' ? window.btkCsrfToken : '';
            this.vars.lang = typeof window.btkLang !== 'undefined' ? window.btkLang : {};
            this.vars.allEk3HizmetTipleri = typeof window.btkAllEk3HizmetTipleri !== 'undefined' ? window.btkAllEk3HizmetTipleri : [];
            
            if (!this.vars.moduleLink) {
                console.error("BTK Reports JS Error: 'modulelink' (window.btkModuleLink) tanımlanmamış.");
                return;
            }

            this.initDataTables(); 
            this.initTooltips();
            this.initDynamicAddressDropdowns('body'); 

            if ($('#btkConfigForm').length) this.initBtkConfigPage();
            if ($('#tblPersonelList').length) this.initPersonelPage();
            if ($('#tblPopDefinitions').length) this.initIssPopPage();
            if ($('#productGroupMappingTable').length) this.initProductGroupMappingsPage();
            if ($('#accordionGenerate').length) this.initGenerateReportsPage();
            if ($('#logTabs').length) this.initLogsPage();
            
            this.initInjectedForms();
            this.initDeleteConfirmations();

            // Bootstrap Toggle switch'leri için
            if (typeof $.fn.bootstrapToggle == 'function') {
                $('.btk-switch input[type="checkbox"]').bootstrapToggle();
            }

            console.log('BTK Raporlama Modülü Scriptleri v6.5.2 başarıyla yüklendi.');
        },
        
        initDataTables: function() {
            if (typeof $.fn.DataTable != 'function') {
                return;
            }
            var dtLang = { "language": { "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json" } };
            var dtOptions = {
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "columnDefs": [ { "targets": 'no-sort', "orderable": false } ]
            };

            if ($('#tblPopDefinitions').length) {
                $('#tblPopDefinitions').DataTable($.extend({}, dtOptions, dtLang, { "order": [[ 0, "asc" ]] }));
            }
            if ($('#tblPersonelList').length) {
                $('#tblPersonelList').DataTable($.extend({}, dtOptions, dtLang, { "order": [[ 1, "asc" ]] }));
            }
            if ($('#tblGeneralLogs').length) {
                $('#tblGeneralLogs').DataTable($.extend({}, dtOptions, dtLang, { "order": [[ 0, "desc" ]] }));
            }
            if ($('#tblFtpLogs').length) {
                $('#tblFtpLogs').DataTable($.extend({}, dtOptions, dtLang, { "order": [[ 0, "desc" ]] }));
            }
            if ($('#productGroupMappingTable').length) {
                $('#productGroupMappingTable').DataTable($.extend({}, dtLang, { "paging": false, "info": false, "searching": false, "ordering": false }));
            }
        },

        initTooltips: function() {
            if (typeof $.fn.tooltip == 'function') {
                $('body').tooltip({
                    selector: '[data-toggle="tooltip"]', placement: 'top', container: 'body'
                });
            }
        },
        
        escapeHtml: function(str) {
            if (typeof str !== 'string' && typeof str !== 'number') return '';
            var str_val = String(str);
            var tagsToReplace = { '&': '&', '<': '<', '>': '>' };
            return str_val.replace(/[&<>]/g, function(tag) { return tagsToReplace[tag] || tag; });
        },

        initDynamicAddressDropdowns: function(containerSelector) {
            var $container = $(containerSelector);
            if (!$container.length) return;

            $container.off('change.btkadres').on('change.btkadres', '.adres-il-select', function() {
                var $ilSelect = $(this);
                var ilId = $ilSelect.val();
                var targetIlceId = $ilSelect.data('target-ilce');
                var $ilceSelect = $('#' + targetIlceId);
                var selectedIlceId = $ilceSelect.data('preselect-id');
                $ilceSelect.data('preselect-id', null);
                btkModule.populateDropdown($ilSelect, targetIlceId, 'get_ilceler', ilId, 'selectIlceOption', selectedIlceId);
            }).on('change.btkadres', '.adres-ilce-select', function() {
                var $ilceSelect = $(this);
                var ilceId = $ilceSelect.val();
                var targetMahalleId = $ilceSelect.data('target-mahalle');
                var $mahalleSelect = $('#' + targetMahalleId);
                var selectedMahalleId = $mahalleSelect.data('preselect-id');
                $mahalleSelect.data('preselect-id', null);
                btkModule.populateDropdown($ilceSelect, targetMahalleId, 'get_mahalleler', ilceId, 'selectMahalleOption', selectedMahalleId);
            });
        },

        populateDropdown: function(sourceElement, targetElementId, actionSuffix, parentIdValue, defaultOptionLangKey, selectedValue) {
            var targetElement = $('#' + targetElementId);
            var defaultOptionText = btkModule.vars.lang[defaultOptionLangKey] || 'Lütfen Seçiniz...';
            targetElement.html('<option value="">' + defaultOptionText + '</option>').prop('disabled', true);
    
            if (parentIdValue) {
                targetElement.prop('disabled', false);
                targetElement.html('<option value="">' + (btkModule.vars.lang.loadingData || 'Yükleniyor...') + '</option>');
                $.post(btkModule.vars.moduleLink, {
                    action: actionSuffix,
                    parent_id: parentIdValue,
                    token: btkModule.vars.csrfToken
                }, function(data) {
                    targetElement.html('<option value="">' + defaultOptionText + '</option>');
                    if (data.status === 'success' && data.items) {
                        $.each(data.items, function(key, item) {
                            var option = $('<option></option>').attr('value', item.id).text(item.name);
                            if (selectedValue && item.id == selectedValue) {
                                option.prop('selected', true);
                            }
                            targetElement.append(option);
                        });
                        if (selectedValue && targetElement.val() == selectedValue) {
                            targetElement.trigger('change.btkadres');
                        }
                    } else {
                        targetElement.html('<option value="">' + (data.message || btkModule.vars.lang.noDataFound) + '</option>');
                    }
                }, "json").fail(function() {
                    targetElement.html('<option value="">' + (btkModule.vars.lang.ajaxRequestFailed || 'İstek Başarısız') + '</option>');
                });
            } else {
                targetElement.html('<option value="">' + defaultOptionText + '</option>').prop('disabled', true);
            }
        },

        initBtkConfigPage: function() {
            $('#backup_ftp_enabled').change(function() {
                $('#backup_ftp_details').slideToggle($(this).is(':checked'));
            }).trigger('change');

            $('.btk-ftp-test-btn').click(function(e) {
                e.preventDefault();
                var ftpType = $(this).data('ftp-type');
                var resultContainer = $('#' + ftpType + '_ftp_test_result');
                var button = $(this);
                resultContainer.html('<i class="fas fa-spinner fa-spin"></i> ' + btkModule.vars.lang.testingFtpConnection);
                button.prop('disabled', true);
                
                $.post(btkModule.vars.moduleLink, {
                    action: 'test_ftp_connection', 
                    ftp_type: ftpType, 
                    host: $('#' + ftpType + '_ftp_host').val(), 
                    user: $('#' + ftpType + '_ftp_user').val(), 
                    pass: $('#' + ftpType + '_ftp_pass').val(),
                    port: $('#' + ftpType + '_ftp_port').val(), 
                    ssl: $('#' + ftpType + '_ftp_ssl').is(':checked') ? '1' : '0', 
                    token: btkModule.vars.csrfToken 
                }, function(response) {
                    if (response && response.status === 'success') {
                        resultContainer.html('<i class="fas fa-check-circle text-success"></i> ' + btkModule.escapeHtml(response.message));
                    } else {
                        resultContainer.html('<i class="fas fa-times-circle text-danger"></i> ' + btkModule.escapeHtml(response.message || 'Bilinmeyen Hata'));
                    }
                }, 'json').fail(function() {
                    resultContainer.html('<i class="fas fa-exclamation-triangle text-danger"></i> ' + btkModule.vars.lang.ajaxRequestFailed);
                }).always(function() {
                    button.prop('disabled', false);
                });
            });
        },

        initPersonelPage: function() {
             $('#editPersonelModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var mode = button.data('mode');
                var personelId = button.data('personel-id');
                var modal = $(this);
                
                modal.find('#editPersonelForm')[0].reset();
                modal.find('#personel_id_modal').val('');
                modal.find('#modal_btk_listesine_eklensin_toggle').bootstrapToggle('on');

                if (mode === 'edit') {
                    modal.find('.modal-title').text(btkModule.vars.lang.editPersonelModalTitle || 'Personel Düzenle');
                    modal.find('#personel_id_modal').val(personelId);
                    
                    $.post(btkModule.vars.moduleLink, {
                        action: 'get_personel_details',
                        personel_id: personelId,
                        token: btkModule.vars.csrfToken
                    }, function(data) {
                        if (data.status === 'success' && data.personel) {
                            var p = data.personel;
                            modal.find('#modal_ad').val(p.ad || '');
                            modal.find('#modal_soyad').val(p.soyad || '');
                            modal.find('#modal_tc_kimlik_no').val(p.tckn || '');
                            modal.find('#modal_email').val(p.email || '');
                            modal.find('#modal_unvan').val(p.unvan || '');
                            modal.find('#modal_departman_id').val(p.departman_id || '');
                            modal.find('#modal_mobil_tel').val(p.mobil_tel || '');
                            modal.find('#modal_sabit_tel').val(p.sabit_tel || '');
                            modal.find('#modal_ise_baslama_tarihi').val(p.ise_baslama_tarihi_formatted || '');
                            modal.find('#modal_isten_ayrilma_tarihi').val(p.isten_ayrilma_tarihi_formatted || '');
                            modal.find('#modal_ev_adresi').val(p.ev_adresi || '');
                            modal.find('#modal_acil_durum_kisisi').val(p.acil_durum_kisi_iletisim || '');
                            modal.find('#modal_is_birakma_nedeni').val(p.is_birakma_nedeni || '');
                            
                            if (p.btk_listesine_eklensin == 1) {
                                modal.find('#modal_btk_listesine_eklensin_toggle').bootstrapToggle('on');
                            } else {
                                modal.find('#modal_btk_listesine_eklensin_toggle').bootstrapToggle('off');
                            }
                        } else {
                             alert(btkModule.vars.lang.errorFetchingPersonelDetails || 'Personel bilgileri alınamadı.');
                        }
                    }, 'json').fail(function(){
                         alert(btkModule.vars.lang.ajaxRequestFailed || 'Sunucu isteği başarısız oldu.');
                    });
                } else {
                     modal.find('.modal-title').text(btkModule.vars.lang.addNewPersonelButton || 'Yeni Personel Ekle');
                }
            });
        },

        initIssPopPage: function() {
            $('#addEditPopModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var mode = button.data('mode');
                var popId = button.data('pop-id');
                var modal = $(this);
        
                modal.find('#popDefinitionForm')[0].reset();
                modal.find('#pop_id_modal').val('');
                $('#modal_aktif_pasif_durum_toggle').bootstrapToggle('on');
                $('#modal_ilce_id, #modal_mahalle_id').html('<option value="">' + btkModule.vars.lang.selectOption + '</option>').prop('disabled', true);
        
                if (mode === 'edit') {
                    modal.find('.modal-title').text(btkModule.vars.lang.editPopModalTitle || 'POP Düzenle');
                    modal.find('#pop_id_modal').val(popId);
        
                    $.post(btkModule.vars.moduleLink, {
                        action: 'get_pop_details',
                        pop_id: popId,
                        token: btkModule.vars.csrfToken
                    }, function(data) {
                        if (data.status === 'success' && data.pop) {
                            var p = data.pop;
                            $('#modal_pop_adi').val(p.pop_adi || '');
                            $('#modal_yayin_yapilan_ssid').val(p.yayin_yapilan_ssid || '');
                            $('#modal_pop_tipi').val(p.pop_tipi || '');
                            $('#modal_ip_adresi').val(p.ip_adresi || '');
                            
                            if (p.il_id) {
                                $('#modal_il_id').val(p.il_id);
                                $('#modal_ilce_id').data('preselect-id', p.ilce_id);
                                $('#modal_mahalle_id').data('preselect-id', p.mahalle_id);
                                $('#modal_il_id').trigger('change.btkadres');
                            }
                            $('#modal_tam_adres_detay').val(p.tam_adres || '');
                            if (p.koordinatlar && p.koordinatlar.includes(',')) {
                                var coords = p.koordinatlar.split(',');
                                $('#modal_enlem').val(coords[0] || '');
                                $('#modal_boylam').val(coords[1] || '');
                            }
                            $('#modal_cihaz_turu').val(p.cihaz_turu || '');
                            $('#modal_cihaz_markasi').val(p.cihaz_markasi || '');
                            $('#modal_cihaz_modeli').val(p.cihaz_modeli || '');
                            
                            if (p.aktif_pasif_durum == 1) {
                                $('#modal_aktif_pasif_durum_toggle').bootstrapToggle('on');
                            } else {
                                $('#modal_aktif_pasif_durum_toggle').bootstrapToggle('off');
                            }
                        }
                    }, "json");
                } else {
                    modal.find('.modal-title').text(btkModule.vars.lang.addNewPopButton || 'Yeni POP Ekle');
                }
            });
        },

        initProductGroupMappingsPage: function() {
            $('#productGroupMappingTable').on('change', '.btk-ana-yetki-select', function() {
                var selectedAnaYetkiGrup = $(this).find('option:selected').data('grup');
                var ek3Select = $(this).closest('tr').find('.btk-ek3-hizmet-tipi-select');

                ek3Select.empty().append($('<option>', { value: '', text: btkModule.vars.lang.selectAnaYetkiFirst || 'Önce Ana Yetki Türü Seçin' }));
                ek3Select.prop('disabled', true);

                if (selectedAnaYetkiGrup && btkModule.vars.allEk3HizmetTipleri && btkModule.vars.allEk3HizmetTipleri.length > 0) {
                    var hasOptions = false;
                    $.each(btkModule.vars.allEk3HizmetTipleri, function(index, ek3) {
                        if (ek3.ana_yetki_grup == selectedAnaYetkiGrup) {
                            ek3Select.append($('<option>', {
                                value: ek3.hizmet_tipi_kodu,
                                text: btkModule.escapeHtml(ek3.hizmet_tipi_aciklamasi) + ' (' + btkModule.escapeHtml(ek3.hizmet_tipi_kodu) + ')'
                            }));
                            hasOptions = true;
                        }
                    });
                    if (hasOptions) { ek3Select.prop('disabled', false); } 
                    else { ek3Select.empty().append($('<option>', { value: '', text: btkModule.vars.lang.noEk3ForSelectedAuth || 'Bu yetki için EK-3 hizmet tipi yok.' })); }
                }
            });
             $('.btk-ana-yetki-select').trigger('change');
        },

        initGenerateReportsPage: function() {
            $('.report-generation-form').submit(function(e) {
                e.preventDefault();
                var form = $(this);
                var reportType = form.find('input[name="report_type"]').val().toLowerCase();
                var resultDiv = $('#' + reportType + 'ReportResult');
                var submitButton = $(document.activeElement);
        
                resultDiv.html('<p class="text-info"><i class="fas fa-spinner fa-spin"></i> ' + (btkModule.vars.lang.generatingReportPleaseWait || 'Rapor oluşturuluyor...') + '</p>');
                form.find('button').prop('disabled', true);
        
                var formData = form.serializeArray();
                if (submitButton.attr('name')) {
                    formData.push({ name: submitButton.attr('name'), value: submitButton.val() });
                }
        
                $.post(form.attr('action'), formData, function(data) {
                    if (data.type === 'success' || data.type === 'info' || data.type === 'warning') {
                        var alertClass = 'alert-' + data.type;
                        var iconClass = 'fa-check-circle';
                        if (data.type !== 'success') iconClass = 'fa-info-circle';

                        var message = '<div class="alert ' + alertClass + '"><i class="fas ' + iconClass + '"></i> ' + btkModule.escapeHtml(data.message);
                        if (data.file_path_download) {
                            message += ' <a href="' + btkModule.vars.moduleLink + '&action=download_file&file_path=' + encodeURIComponent(data.file_path_download) + '&token=' + btkModule.vars.csrfToken + '" class="btn btn-xs btn-success"><i class="fas fa-download"></i> ' + (btkModule.vars.lang.downloadFileButton || 'İndir') + '</a>';
                        }
                         if (data.file_name) {
                            message += '<br><strong>' + (btkModule.vars.lang.generatedFileName || 'Dosya Adı') + ':</strong> ' + btkModule.escapeHtml(data.file_name);
                        }
                        message += '</div>';
                        resultDiv.html(message);
                    } else {
                        resultDiv.html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> ' + (data.message ? btkModule.escapeHtml(data.message) : btkModule.vars.lang.reportGenerationFailed) + '</div>');
                    }
                }, "json").fail(function() {
                    resultDiv.html('<div class="alert alert-danger"><i class="fas fa-times-circle"></i> ' + btkModule.vars.lang.ajaxRequestFailed + '</div>');
                }).always(function() {
                    form.find('button').prop('disabled', false);
                });
            });
        },

        initLogsPage: function() {
            if (typeof $.fn.flatpickr != 'function') { return; }
            $(".date-range-picker").flatpickr({
                mode: "range",
                dateFormat: "Y-m-d",
                allowInput: true
            });
        },

        initDeleteConfirmations: function() {
            $('body').on('click', '.btn-delete-confirm', function(e) {
                var message = $(this).data('message') || 'Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!';
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
        },

        initInjectedForms: function() {
            // WHMCS Müşteri profili ve Hizmet detayları sayfalarına enjekte edilen formlar için
            $('#tesis_adresi_yerlesimle_ayni').change(function() {
                var formArea = $('#tesisAdresiFormAlani');
                if ($(this).is(':checked')) {
                    formArea.slideUp();
                    formArea.find('select, input[type="text"]').prop('required', false);
                } else {
                    formArea.slideDown();
                    formArea.find('#tesis_il_id, #tesis_ilce_id, #tesis_mahalle_id').prop('required', true);
                }
            }).trigger('change');

            $('#musteri_tipi').change(function(){
                var kurumsalAlanlar = $('#kurumsalYetkiliBilgileri');
                if ($(this).val() === 'T-SIRKET') {
                    kurumsalAlanlar.slideDown();
                } else {
                    kurumsalAlanlar.slideUp();
                }
            }).trigger('change');
        }
    };

    $(document).ready(function() {
        if(typeof window.btkModuleLink !== 'undefined') {
            btkModule.init();
        }
    });

})(jQuery, window, document);