/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Admin JavaScript Kodları
 * Sürüm: 7.2.5 (Operatör) - Kritik Hata Düzeltmeleri ve Geliştirilmiş Dinamiklik
 */

(function($, window, document, undefined) {
    "use strict";

    var btkModule = {
        vars: {
            moduleLink: '',
            csrfToken: '',
            csrfTokenName: '',
            lang: {},
            allEk3HizmetTipleri: [] // Ürün grubu eşleştirme için EK3 verileri
        },
        
        init: function() {
            this.vars.moduleLink = typeof window.btkModuleLink !== 'undefined' ? window.btkModuleLink : '';
            this.vars.csrfToken = typeof window.btkCsrfToken !== 'undefined' ? window.btkCsrfToken : '';
            this.vars.csrfTokenName = typeof window.btkCsrfTokenName !== 'undefined' ? window.btkCsrfTokenName : 'token';
            this.vars.lang = typeof window.btkLang !== 'undefined' ? window.btkLang : {};
            this.vars.allEk3HizmetTipleri = typeof window.btkAllEk3HizmetTipleri !== 'undefined' ? window.btkAllEk3HizmetTipleri : [];
            
            if (!this.vars.moduleLink) {
                console.error("BTK Reports JS Error: 'modulelink' (window.btkModuleLink) tanımlanmamış. Script başlatılamadı.");
                return;
            }

            // Genel başlatıcılar
            this.initDataTables(); 
            this.initTooltips();
            this.initDeleteConfirmations();
            // Adres dropdown'ları modül genelinde ve enjekte edilen formlarda çalışmalı
            this.initDynamicAddressDropdowns('body'); // Sayfa genelinde adres dropdown olaylarını dinle

            // Sayfa yüklendiğinde Bootstrap Toggle'ı manuel olarak başlatıyoruz.
            $('input[type="checkbox"][data-toggle="toggle"]').bootstrapToggle();

            // Sayfaya özel başlatıcılar
            if ($('#btkConfigForm').length) this.initConfigPage();
            if ($('#tblPersonelList').length) this.initPersonelPage();
            if ($('#tblPopDefinitions').length) this.initIssPopPage();
            if ($('#productGroupMappingTable').length) this.initProductGroupMappingsPage();
            if ($('#accordionGenerate').length) this.initGenerateReportsPage();
            if ($('#logTabs').length) this.initLogsPage();
            
            // WHMCS Admin paneli içindeki enjekte edilecek formlar
            this.initInjectedForms(); // Bu fonksiyon artık sayfa kontrolü yapmıyor, doğrudan enjeksiyonu deniyor

            console.log('BTK Raporlama Modülü Scriptleri v7.2.5 başarıyla yüklendi.');
        },
        
        initDataTables: function() {
            if (typeof $.fn.DataTable != 'function') {
                console.warn("DataTables kütüphanesi yüklenmedi. Tablolar varsayılan HTML olarak görüntülenecek.");
                return;
            }
            var dtLang = { "language": { "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json" } };
            var dtOptions = {
                "paging": true, "lengthChange": true, "searching": true,
                "ordering": true, "info": true, "autoWidth": false, "responsive": true,
                "columnDefs": [ { "targets": 'no-sort', "orderable": false } ]
            };

            if ($('#tblPopDefinitions').length) $('#tblPopDefinitions').DataTable($.extend(true, {}, dtOptions, dtLang, { "order": [[ 0, "asc" ]] }));
            if ($('#tblPersonelList').length) $('#tblPersonelList').DataTable($.extend(true, {}, dtOptions, dtLang, { "order": [[ 0, "asc" ]] }));
            if ($('#tblGeneralLogs').length) $('#tblGeneralLogs').DataTable($.extend(true, {}, dtOptions, dtLang, { "order": [[ 0, "desc" ]], "searching": false, "ordering": false }));
            if ($('#tblFtpLogs').length) $('#tblFtpLogs').DataTable($.extend(true, {}, dtOptions, dtLang, { "order": [[ 0, "desc" ]], "searching": false, "ordering": false }));
            if ($('#productGroupMappingTable').length) $('#productGroupMappingTable').DataTable($.extend(true, {}, dtOptions, dtLang, { "paging": false, "info": false, "searching": false, "ordering": true }));
        },

        initTooltips: function() {
            if (typeof $.fn.tooltip == 'function') {
                $('body').tooltip({ selector: '[data-toggle="tooltip"]', placement: 'top', container: 'body' });
            }
        },
        
        escapeHtml: function(str) {
            if (typeof str !== 'string' && typeof str !== 'number') return '';
            var str_val = String(str);
            var tagsToReplace = { '&': '&', '<': '<', '>': '>', '"': '"', "'": ''' };
            return str_val.replace(/[&<>"']/g, function(tag) { return tagsToReplace[tag] || tag; });
        },

        // Dinamik adres dropdown'ları (İl, İlçe, Mahalle)
        initDynamicAddressDropdowns: function(containerSelector) {
            var $container = $(containerSelector);
            // İl seçimi değiştiğinde ilçe dropdown'ını doldur
            // Event delegation kullanarak, dinamik yüklenen/modifiye edilen elementler için çalışır.
            $container.off('change.btkadres.il').on('change.btkadres.il', '.adres-il-select', function() {
                var $ilSelect = $(this);
                // selectedValue'yu data attribute'den alıyoruz, doldurulduktan sonra null yapıyoruz.
                var preselectIlceId = $ilSelect.data('preselect-ilce-id'); 
                btkModule.populateDropdown($ilSelect, $ilSelect.data('target-ilce'), 'get_ilceler', $ilSelect.val(), 'selectIlceOption', preselectIlceId);
                $ilSelect.data('preselect-ilce-id', null); // Sadece bir kez kullanıldığından emin ol
            });
            // İlçe seçimi değiştiğinde mahalle dropdown'ını doldur
            $container.off('change.btkadres.ilce').on('change.btkadres.ilce', '.adres-ilce-select', function() {
                var $ilceSelect = $(this);
                // selectedValue'yu data attribute'den alıyoruz, doldurulduktan sonra null yapıyoruz.
                var preselectMahalleId = $ilceSelect.data('preselect-mahalle-id');
                btkModule.populateDropdown($ilceSelect, $ilceSelect.data('target-mahalle'), 'get_mahalleler', $ilceSelect.val(), 'selectMahalleOption', preselectMahalleId);
                $ilceSelect.data('preselect-mahalle-id', null); // Sadece bir kez kullanıldığından emin ol
            });
        },

        // Dropdown doldurma AJAX fonksiyonu
        populateDropdown: function(sourceElement, targetElementId, action, parentId, langKey, selectedValue) {
            var $target = $('#' + targetElementId);
            var defaultText = btkModule.vars.lang[langKey] || 'Lütfen Seçiniz...';
            $target.html('<option value="">' + defaultText + '</option>').prop('disabled', true);

            if (parentId && parentId !== '') {
                $target.prop('disabled', false).html('<option value="">' + (btkModule.vars.lang.loadingData || 'Yükleniyor...') + '</option>');
                var postData = { action: action, parent_id: parentId };
                postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                $.post(btkModule.vars.moduleLink, postData, function(data) {
                    $target.html('<option value="">' + defaultText + '</option>');
                    if (data && data.status === 'success' && data.items) {
                        $.each(data.items, function(key, item) {
                            var option = $('<option></option>').val(item.id).text(btkModule.escapeHtml(item.name));
                            if (selectedValue && item.id == selectedValue) {
                                option.prop('selected', true);
                            }
                            $target.append(option);
                        });
                        // Eğer önceden seçili bir değer varsa ve bu değer şu anki dropdown'a aitse,
                        // bir sonraki dropdown'ı tetiklemek için change olayını tetikle.
                        if (selectedValue && $target.val() == selectedValue) {
                            // Sadece adres zincirinde bir sonraki elemanı tetikle
                            if (action === 'get_ilceler') { // Eğer ilçe doldurulduysa, mahalleleri tetikle
                                $target.trigger('change.btkadres.ilce');
                            }
                        }
                    } else {
                        $target.html('<option value="">' + (data.message || btkModule.vars.lang.noDataFound) + '</option>');
                    }
                }, "json").fail(function() {
                    $target.html('<option value="">' + (btkModule.vars.lang.ajaxRequestFailed || 'İstek Başarısız') + '</option>');
                });
            }
        },
        
        initConfigPage: function() {
            var $configForm = $('#btkConfigForm');

            // Yedek FTP detaylarını başlangıçta doğru şekilde göster/gizle
            $('#backup_ftp_details').toggle($('#backup_ftp_enabled').is(':checked'));

            // Yedek FTP etkinleştirme/devre dışı bırakma anahtarı için olay dinleyici (event delegation)
            $configForm.on('change', '#backup_ftp_enabled', function() {
                $('#backup_ftp_details').slideToggle($(this).is(':checked'));
            });

            // FTP bağlantı testi butonları için olay dinleyici (event delegation)
            $configForm.on('click', '.btk-ftp-test-btn', function(e) {
                e.preventDefault();
                var ftpType = $(this).data('ftp-type');
                var $resultContainer = $('#' + ftpType + '_ftp_test_result');
                var $button = $(this);
                $resultContainer.html('<i class="fas fa-spinner fa-spin"></i> ' + (btkModule.vars.lang.testingFtpConnection || 'Bağlantı test ediliyor...'));
                $button.prop('disabled', true);

                var postData = { 
                    action: 'test_ftp_connection', 
                    ftp_type: ftpType, 
                    host: $('#' + ftpType + '_ftp_host').val(), 
                    user: $('#' + ftpType + '_ftp_user').val(), 
                    pass: $('#' + ftpType + '_ftp_pass').val(),
                    port: $('#' + ftpType + '_ftp_port').val(), 
                    ssl: $('#' + ftpType + '_ftp_ssl').is(':checked') ? '1' : '0' 
                };
                postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                $.post(btkModule.vars.moduleLink, postData, function(response) {
                    var iconClass = response.status === 'success' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
                    $resultContainer.html('<i class="fas ' + iconClass + '"></i> ' + btkModule.escapeHtml(response.message || 'Bilinmeyen Hata'));
                }, 'json').fail(function() {
                    $resultContainer.html('<i class="fas fa-exclamation-triangle text-danger"></i> ' + (btkModule.vars.lang.ajaxRequestFailed || 'Sunucu isteği başarısız oldu.'));
                }).always(function() {
                    $button.prop('disabled', false);
                });
            });
        },

        initPersonelPage: function() {
            var $personelModal = $('#editPersonelModal');
            
            $personelModal.on('show.bs.modal', function (event) {
                var $button = $(event.relatedTarget);
                var mode = $button.data('mode');
                var personelId = $button.data('personel-id') || 0;
                var $modal = $(this);
                
                $modal.find('form')[0].reset();
                $modal.find('#personel_id_modal').val(personelId);
                $modal.find('.tckn-validation-status-modal').html('');

                if (mode === 'edit') {
                    $modal.find('.modal-title').text(btkModule.vars.lang.editPersonelModalTitle || 'Personel Düzenle');
                    var postData = { action: 'get_personel_details', id: personelId };
                    postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                    $.post(btkModule.vars.moduleLink, postData, function(data) {
                        if (data && data.status === 'success' && data.data) {
                            var p = data.data; // PHP'den zaten array olarak geliyor
                            for (var key in p) {
                                var $input = $modal.find('[name="modal_personel_data[' + key + ']"]');
                                if ($input.length) { // Elementin varlığını kontrol et
                                    if ($input.is(':checkbox')) {
                                        $input.prop('checked', p[key] == 1).bootstrapToggle(p[key] == 1 ? 'on' : 'off');
                                    } else {
                                        $input.val(p[key]);
                                    }
                                }
                            }
                            // Tarih alanları (Flatpickr)
                            if (p.ise_baslama_tarihi) $modal.find('#modal_ise_baslama_tarihi').val(p.ise_baslama_tarihi.substring(0, 10));
                            if (p.isten_ayrilma_tarihi) $modal.find('#modal_isten_ayrilma_tarihi').val(p.isten_ayrilma_tarihi.substring(0, 10));
                            if (p.dogum_tarihi) $modal.find('#modal_dogum_tarihi').val(p.dogum_tarihi.substring(0, 10));

                            if (p.tckn_dogrulama_durumu && p.tckn_dogrulama_durumu !== 'Dogrulanmadi') {
                                var msgClass = p.tckn_dogrulama_durumu === 'Dogrulandi' ? 'text-success' : 'text-danger';
                                $modal.find('.tckn-validation-status-modal').html('<span class="' + msgClass + '">Durum: ' + btkModule.escapeHtml(p.tckn_dogrulama_mesaji) + '</span>');
                            }
                        } else {
                            alert(btkModule.vars.lang.errorFetchingPersonelDetails || 'Personel bilgileri alınamadı.');
                        }
                    }, 'json').fail(function() {
                        alert(btkModule.vars.lang.ajaxRequestFailed || 'Sunucu isteği başarısız oldu.');
                    });
                } else {
                     $modal.find('.modal-title').text(btkModule.vars.lang.addNewPersonelButton || 'Yeni Personel Ekle');
                     $modal.find('#modal_btk_listesine_eklensin').bootstrapToggle('on');
                }
            });

            $personelModal.on('click', '#validateNviButton', function() {
                var $modal = $(this).closest('.modal-content');
                var tckn = $modal.find('#modal_tc_kimlik_no').val();
                var ad = $modal.find('#modal_ad').val();
                var soyad = $modal.find('#modal_soyad').val();
                var dogumYili = $modal.find('#modal_dogum_yili').val();
                var $statusDiv = $modal.find('.tckn-validation-status-modal');

                if (!tckn || !ad || !soyad || !dogumYili) {
                    $statusDiv.html('<span class="text-danger">' + (btkModule.vars.lang.tcknInvalidInput || 'Tüm zorunlu alanları doldurun.') + '</span>');
                    return;
                }

                $statusDiv.html('<span class="text-info"><i class="fas fa-spinner fa-spin"></i> Doğrulanıyor...</span>');
                var postData = { action: 'validate_tckn_personel', tckn: tckn, ad: ad, soyad: soyad, dogum_yili: dogumYili };
                postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                $.post(btkModule.vars.moduleLink, postData, function(response) {
                    var msgClass = response.status === 'success' ? 'text-success' : 'text-danger';
                    $statusDiv.html('<span class="' + msgClass + '">' + btkModule.escapeHtml(response.message) + '</span>');
                }, 'json').fail(function() {
                    $statusDiv.html('<span class="text-danger">' + (btkModule.vars.lang.ajaxRequestFailed || 'Doğrulama servisine ulaşılamadı.') + '</span>');
                });
            });

            // Date picker'ları başlat (Flatpickr)
            if (typeof $.fn.flatpickr == 'function') {
                $personelModal.find('.date-picker').flatpickr({ dateFormat: "Y-m-d", allowInput: true });
            }
        },

        initIssPopPage: function() {
            var $popModal = $('#addEditPopModal');
            
            $popModal.on('show.bs.modal', function (event) {
                var $button = $(event.relatedTarget);
                var mode = $button.data('mode');
                var popId = $button.data('pop-id') || 0;
                var $modal = $(this);
        
                $modal.find('form')[0].reset();
                $modal.find('#pop_id_modal').val(popId);
                
                // Adres dropdown'larını temizle ve disable et
                $modal.find('#modal_ilce_id, #modal_mahalle_id').html('<option value="">' + btkModule.vars.lang.selectOption + '</option>').prop('disabled', true);
        
                if (mode === 'edit') {
                    $modal.find('.modal-title').text(btkModule.vars.lang.editPopModalTitle || 'POP Düzenle');
                    var postData = { action: 'get_pop_details', id: popId };
                    postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                    $.post(btkModule.vars.moduleLink, postData, function(data) {
                        if (data && data.status === 'success' && data.data) {
                            var p = data.data; // PHP'den zaten array olarak geliyor
                            for (var key in p) {
                                var $input = $modal.find('[name="popdata[' + key + ']"]');
                                if ($input.length) {
                                    if ($input.is(':checkbox')) {
                                        $input.prop('checked', p[key] == 1).bootstrapToggle(p[key] == 1 ? 'on' : 'off');
                                    } else {
                                        $input.val(p[key]);
                                    }
                                }
                            }

                            if (p.il_id) {
                                $modal.find('#modal_il_id').val(p.il_id);
                                $modal.find('#modal_il_id').data('preselect-ilce-id', p.ilce_id);
                                $modal.find('#modal_ilce_id').data('preselect-mahalle-id', p.mahalle_id);
                                // İl değişimini tetikleyerek ilçe ve mahalleleri doldur
                                $modal.find('#modal_il_id').trigger('change.btkadres.il');
                            }
                        } else {
                            alert(btkModule.vars.lang.errorFetchingPopDetails || 'POP bilgileri alınamadı.');
                        }
                    }, "json").fail(function(){
                         alert(btkModule.vars.lang.ajaxRequestFailed || 'Sunucu isteği başarısız oldu.');
                    });
                } else {
                    $modal.find('.modal-title').text(btkModule.vars.lang.addNewPopButton || 'Yeni POP Ekle');
                    $modal.find('#modal_aktif_pasif_durum').bootstrapToggle('on');
                    $modal.find('#modal_izleme_aktif').bootstrapToggle('off');
                }
            });

            // POP izleme durumunu anında değiştirme (AJAX ile event delegation)
            $('#tblPopDefinitions').on('change', '.btk-pop-monitor-toggle', function() {
                var $switch = $(this);
                var popId = $switch.data('pop-id');
                var newStatus = $switch.is(':checked'); // true/false

                var postData = { action: 'toggle_pop_monitoring', id: popId, status: newStatus };
                postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                $.post(btkModule.vars.moduleLink, postData, function(response) {
                    if (response.status !== 'success') {
                        alert(response.message || 'İzleme durumu değiştirilirken bir hata oluştu.');
                        $switch.bootstrapToggle(newStatus ? 'off' : 'on');
                    }
                }, 'json').fail(function() {
                    alert(btkModule.vars.lang.ajaxRequestFailed || 'Sunucu isteği başarısız oldu.');
                    $switch.bootstrapToggle(newStatus ? 'off' : 'on');
                });
            });
        },

        initProductGroupMappingsPage: function() {
            var $productGroupMappingTable = $('#productGroupMappingTable');

            // EK-3 dropdown'larını ana yetki seçimine göre doldurma mantığı
            $productGroupMappingTable.on('change', '.btk-ana-yetki-select', function() {
                var selectedAnaYetkiKodu = $(this).val();
                // Data attribute'den yetki grubunu al
                var selectedAnaYetkiGrup = $(this).find('option:selected').data('grup');
                var $ek3Select = $(this).closest('tr').find('.btk-ek3-hizmet-tipi-select');
                var currentEk3SelectedValue = $ek3Select.val(); // Mevcut seçimi korumak için

                $ek3Select.empty().append($('<option>', { value: '', text: btkModule.vars.lang.selectAnaYetkiFirst || 'Önce Ana Yetki Türü Seçin' }));
                $ek3Select.prop('disabled', true);

                if (selectedAnaYetkiGrup) { // Sadece geçerli bir yetki grubu seçildiğinde devam et
                    var hasOptions = false;
                    $.each(btkModule.vars.allEk3HizmetTipleri, function(index, ek3) {
                        // Seçilen ana yetki grubuna ait EK-3 hizmet tiplerini filtrele
                        if (ek3.ana_yetki_grup == selectedAnaYetkiGrup) {
                            var option = $('<option></option>').val(ek3.hizmet_tipi_kodu).text(btkModule.escapeHtml(ek3.hizmet_tipi_aciklamasi) + ' (' + btkModule.escapeHtml(ek3.hizmet_tipi_kodu) + ')');
                            if (currentEk3SelectedValue && ek3.hizmet_tipi_kodu == currentEk3SelectedValue) {
                                option.prop('selected', true);
                            }
                            $ek3Select.append(option);
                            hasOptions = true;
                        }
                    });
                    if (hasOptions) { $ek3Select.prop('disabled', false); } 
                    else { $ek3Select.empty().append($('<option>', { value: '', text: btkModule.vars.lang.noEk3ForSelectedAuth || 'Bu yetki için EK-3 hizmet tipi yok.' })); }
                }
            });
            // Sayfa yüklendiğinde mevcut seçimlere göre EK-3 dropdown'larını doldurmak için tetikle
            // Her select elementi için ayrı ayrı tetikleme yapıyoruz.
            $('.btk-ana-yetki-select').each(function() {
                // Sadece önceden seçili bir yetki kodu varsa tetikle
                if ($(this).val()) {
                    $(this).trigger('change');
                }
            });
        },
        
        initGenerateReportsPage: function() {
            $('.report-generation-form').submit(function(e) {
                e.preventDefault();
                var $form = $(this);
                var reportType = $form.find('input[name="report_type"]').val();
                var $resultDiv = $form.closest('.panel-body').find('.report-result');
                var $submitButton = $(document.activeElement);

                $resultDiv.html('<p class="text-info"><i class="fas fa-spinner fa-spin"></i> ' + (btkModule.vars.lang.generatingReportPleaseWait || 'Rapor oluşturuluyor, lütfen bekleyin...') + '</p>');
                $form.find('button').prop('disabled', true);
        
                var formData = $form.serializeArray();
                formData.push({ name: 'generation_action', value: $submitButton.attr('name') });

                var postData = {};
                $.each(formData, function() {
                    if (postData[this.name]) {
                        if (!postData[this.name].push) {
                            postData[this.name] = [postData[this.name]];
                        }
                        postData[this.name].push(this.value || '');
                    } else {
                        postData[this.name] = this.value || '';
                    }
                });
                postData[btkModule.vars.csrfTokenName] = btkModule.vars.csrfToken;

                $.post($form.attr('action'), postData, function(response) {
                    var alertClass = 'alert-' + (response.status === true ? 'success' : 'danger');
                    var iconClass = response.status === true ? 'fa-check-circle' : 'fa-exclamation-circle';
                    var message = '<div class="alert ' + alertClass + '" style="margin-top: 15px;"><i class="fas ' + iconClass + '"></i> ' + btkModule.escapeHtml(response.message || 'Bilinmeyen yanıt.');
                    
                    if (response.file_path && reportType !== 'PERSONEL') { // Sadece .abn dosyaları için indirme linki
                        message += ' <a href="' + btkModule.vars.moduleLink + '&action=download_file&file=' + encodeURIComponent(response.file_name) + '&' + btkModule.vars.csrfTokenName + '=' + btkModule.vars.csrfToken + '" class="btn btn-xs btn-success" style="margin-left:10px;"><i class="fas fa-download"></i> ' + (btkModule.vars.lang.downloadFileButton || 'Dosyayı İndir') + '</a>';
                    } else if (reportType === 'PERSONEL' && response.file_path) { // Personel Excel için indirme linki (farklı bir aksiyon üzerinden)
                         message += ' <a href="' + btkModule.vars.moduleLink + '&action=download_file&file=' + encodeURIComponent(response.file_name) + '&' + btkModule.vars.csrfTokenName + '=' + btkModule.vars.csrfToken + '" class="btn btn-xs btn-success" style="margin-left:10px;"><i class="fas fa-download"></i> ' + (btkModule.vars.lang.downloadFileButton || 'Dosyayı İndir') + '</a>';
                    }
                    if (response.file_name) {
                        message += '<br><strong>' + (btkModule.vars.lang.generatedFileName || 'Oluşturulan Dosya Adı') + ':</strong> ' + btkModule.escapeHtml(response.file_name);
                    }
                    message += '</div>';
                    $resultDiv.html(message);
                }, "json").fail(function() {
                    $resultDiv.html('<div class="alert alert-danger" style="margin-top: 15px;"><i class="fas fa-times-circle"></i> ' + (btkModule.vars.lang.ajaxRequestFailed || 'Sunucu isteği başarısız oldu.') + '</div>');
                }).always(function() {
                    $form.find('button').prop('disabled', false);
                });
            });
        },

        initLogsPage: function() {
            if (typeof $.fn.flatpickr == 'function') {
                console.warn("Flatpickr kütüphanesi yüklenmedi. Tarih seçiciler çalışmayacak.");
                return;
            }
            $(".date-range-picker").flatpickr({
                mode: "range",
                dateFormat: "Y-m-d",
                allowInput: true
            });
        },

        initDeleteConfirmations: function() {
            $('body').on('click', '.btn-delete-confirm', function(e) {
                var message = $(this).data('message') || btkModule.vars.lang.confirmDeleteDefault || 'Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!';
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
        },

        initInjectedForms: function() {
            // Müşteri Profili Enjeksiyonu
            if ($('#btkClientProfilePlaceholder').length) {
                var btkData = window.btkClientProfileData || {};
                var lang = btkModule.vars.lang;
                var kimlikTipleri = btkData.kimlikTipleri || [];
                var meslekKodlari = btkData.meslekKodlari || [];
                var iller = btkData.iller || []; // Populate dropdowns for initial load
                var yerlesimIlceler = btkData.yerlesimIlceler || [];
                var yerlesimMahalleler = btkData.yerlesimMahalleler || [];

                var htmlContent = `
                    <div class="clientssummarybox">
                        <div class="title"><i class="fas fa-user-tag"></i> ${lang.aboneTemelBtkBilgileri}</div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.personelTcKimlikNoHeader}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_tc_kimlik_no]" value="${btkData.abone_tc_kimlik_no || ''}" class="form-control input-sm" maxlength="11" placeholder="${lang.tcKimlikNoPlaceholder}"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.abonePasaportNoLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_pasaport_no]" value="${btkData.abone_pasaport_no || ''}" class="form-control input-sm" placeholder="${lang.abonePasaportNoPlaceholder}"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.musteriTipiLabel}</div>
                                <div class="col-sm-9">
                                     <select name="btk_profile_data[musteri_tipi]" id="musteri_tipi_select" class="form-control input-sm">
                                        <option value="">${lang.selectOption}</option>
                                        <option value="G-SAHIS" ${btkData.musteri_tipi == 'G-SAHIS' ? 'selected' : ''}>${lang.musteriTipiGSahis}</option>
                                        <option value="T-SIRKET" ${btkData.musteri_tipi == 'T-SIRKET' ? 'selected' : ''}>${lang.musteriTipiTSirket}</option>
                                     </select>
                                </div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneCinsiyetLabel}</div>
                                <div class="col-sm-9">
                                     <select name="btk_profile_data[abone_cinsiyet]" class="form-control input-sm">
                                        <option value="">${lang.selectOption}</option>
                                        <option value="E" ${btkData.abone_cinsiyet == 'E' ? 'selected' : ''}>${lang.genderMale}</option>
                                        <option value="K" ${btkData.abone_cinsiyet == 'K' ? 'selected' : ''}>${lang.genderFemale}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneUyrukLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_uyruk]" value="${btkData.abone_uyruk || 'TUR'}" class="form-control input-sm" maxlength="3" placeholder="Örn: TUR, DEU"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneBabaAdiLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_baba_adi]" value="${btkData.abone_baba_adi || ''}" class="form-control input-sm"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneAnaAdiLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_ana_adi]" value="${btkData.abone_ana_adi || ''}" class="form-control input-sm"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneDogumYeriLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_dogum_yeri]" value="${btkData.abone_dogum_yeri || ''}" class="form-control input-sm"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneDogumTarihiLabel} (YYYYMMDD)</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_dogum_tarihi]" value="${btkData.abone_dogum_tarihi || ''}" class="form-control input-sm date-picker-yyyymmdd" placeholder="Örn: 19851231"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneMeslekLabel}</div>
                                <div class="col-sm-9">
                                    <select name="btk_profile_data[abone_meslek]" class="form-control input-sm">
                                        <option value="">${lang.selectOption}</option>
                                        ${meslekKodlari.map(m => `<option value="${m.kod}" ${btkData.abone_meslek == m.kod ? 'selected' : ''}>${btkModule.escapeHtml(m.aciklama)} (${m.kod})</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneKimlikTipiLabel}</div>
                                <div class="col-sm-9">
                                    <select name="btk_profile_data[abone_kimlik_tipi]" class="form-control input-sm">
                                        <option value="">${lang.selectOption}</option>
                                        ${kimlikTipleri.map(k => `<option value="${k.kod}" ${btkData.abone_kimlik_tipi == k.kod ? 'selected' : ''}>${btkModule.escapeHtml(k.aciklama)} (${k.kod})</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.aboneKimlikSeriNoLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[abone_kimlik_seri_no]" value="${btkData.abone_kimlik_seri_no || ''}" class="form-control input-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div id="btkKurumsalAlanlari" class="clientssummarybox" style="margin-top:15px; display:${btkData.musteri_tipi == 'T-SIRKET' ? 'block' : 'none'};">
                        <div class="title"><i class="fas fa-user-shield"></i> ${lang.kurumYetkilisiBilgileriTitle}</div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.kurumYetkiliAdiLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_adi]" value="${btkData.kurum_yetkili_adi || ''}" class="form-control input-sm"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.kurumYetkiliSoyadiLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_soyadi]" value="${btkData.kurum_yetkili_soyadi || ''}" class="form-control input-sm"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.kurumYetkiliTcKimlikNoLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_tckimlik_no]" value="${btkData.kurum_yetkili_tckimlik_no || ''}" class="form-control input-sm" maxlength="11"></div>
                            </div>
                        </div>
                        <div class="fieldarea">
                            <div class="row">
                                <div class="col-sm-3">${lang.kurumYetkiliTelefonLabel}</div>
                                <div class="col-sm-9"><input type="text" name="btk_profile_data[kurum_yetkili_telefon]" value="${btkData.kurum_yetkili_telefon || ''}" class="form-control input-sm" placeholder="905xxxxxxxxx"></div>
                            </div>
                        </div>
                    </div>
                `;
                // Nereye enjekte edeceğiz? Genellikle "#client-summary" div'inin sonuna veya uygun bir yere
                // WHMCS'in yapılandırmasına göre uygun yer belirlenmeli.
                // Burada en uygun yerin genellikle .clientssummarybox:last elementinden sonra olduğu varsayılmıştır.
                $('#client-summary .clientssummarybox:last').after(htmlContent);

                // Enjekte edilen HTML'deki dinamik elementleri başlat
                $('#client-summary').find('.date-picker-yyyymmdd').flatpickr({ dateFormat: "Ymd", allowInput: true });
                $('#client-summary').on('change', '#musteri_tipi_select', function(){
                    $('#btkKurumsalAlanlari').slideToggle($(this).val() === 'T-SIRKET');
                });
            }

            // Hizmet Detayları Enjeksiyonu
            if ($('#btkServiceDetailsPlaceholder').length) {
                var btkData = window.btkServiceDetailsData || {};
                var lang = btkModule.vars.lang;
                var whmcsService = btkData.whmcsService || {};
                var mapping = btkData.mapping || {};
                var uygunHizmetTipleri = btkData.uygunHizmetTipleri || [];
                var uygunPopNoktalari = btkData.uygunPopNoktalari || [];
                var iller = btkData.iller || [];
                var tesisIlceler = btkData.tesisIlceler || [];
                var tesisMahalleler = btkData.tesisMahalleler || [];

                var htmlContent = `
                    <div class="clientssummarybox">
                        <div class="title"><i class="fas fa-concierge-bell"></i> ${lang.btkServiceInformationTitle}</div>
                        <table class="form" width="100%" border="0" cellspacing="2" cellpadding="3">
                            <tbody>
                                <tr>
                                    <td class="fieldlabel" width="20%">${lang.serviceHatNoLabel} *</td>
                                    <td class="fieldarea">
                                        <input type="text" name="btk_service_data[hat_no]" value="${btkData.hat_no || whmcsService.domain || whmcsService.dedicatedip || ''}" class="form-control input-sm" required>
                                        <small class="text-muted">${lang.serviceHatNoTooltip || ''}</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="fieldlabel">${lang.serviceHizmetTipiLabel} *</td>
                                    <td class="fieldarea">
                                        <select name="btk_service_data[hizmet_tipi]" id="service_hizmet_tipi_select" class="form-control select-inline" required>
                                            <option value="">${lang.selectOption}</option>
                                            ${uygunHizmetTipleri.map(h => `<option value="${h.hizmet_tipi_kodu}" ${btkData.hizmet_tipi == h.hizmet_tipi_kodu ? 'selected' : ''}>${btkModule.escapeHtml(h.hizmet_tipi_aciklamasi)} (${h.hizmet_tipi_kodu})</option>`).join('')}
                                        </select>
                                        ${uygunHizmetTipleri.length === 0 ? `<small class="text-danger">${lang.noMatchingServiceType || ''}</small>` : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="fieldlabel">${lang.serviceAboneBaslangicLabel}</td>
                                    <td class="fieldarea">
                                        <input type="text" name="btk_service_data[abone_baslangic]" value="${btkData.abone_baslangic || ''}" class="form-control input-sm date-picker-yyyymmdd" placeholder="YYYYMMDDHHMMSS">
                                        <small class="text-muted">(Format: YYYYMMDDHHMMSS UTC)</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="fieldlabel">${lang.serviceAboneTarifeLabel}</td>
                                    <td class="fieldarea"><input type="text" name="btk_service_data[abone_tarife]" value="${btkData.abone_tarife || (whmcsService.product ? whmcsService.product.name : '')}" class="form-control input-sm"></td>
                                </tr>
                                <tr>
                                    <td class="fieldlabel">${lang.serviceStatikIpLabel}</td>
                                    <td class="fieldarea"><input type="text" name="btk_service_data[statik_ip]" value="${btkData.statik_ip || whmcsService.dedicatedip || ''}" class="form-control input-sm"></td>
                                </tr>
                                ${mapping.grup == 'ISS' ? `
                                <tr>
                                    <td class="fieldlabel">${lang.issHizProfiliLabel}</td>
                                    <td class="fieldarea"><input type="text" name="btk_service_data[iss_hiz_profili]" value="${btkData.iss_hiz_profili || ''}" class="form-control input-sm" placeholder="Örn: 100 Mbps'e kadar"></td>
                                </tr>
                                <tr>
                                    <td class="fieldlabel">${lang.issKullaniciAdiLabel}</td>
                                    <td class="fieldarea"><input type="text" name="btk_service_data[iss_kullanici_adi]" value="${btkData.iss_kullanici_adi || whmcsService.username || ''}" class="form-control input-sm"></td>
                                </tr>
                                <tr>
                                    <td class="fieldlabel">${lang.issPopNoktasiLabel}</td>
                                    <td class="fieldarea">
                                         <select name="btk_service_data[iss_pop_noktasi_id]" class="form-control select-inline">
                                            <option value="">${lang.selectOption}</option>
                                            ${(uygunPopNoktalari || []).map(pop => `<option value="${pop.id}" ${btkData.iss_pop_noktasi_id == pop.id ? 'selected' : ''}>${btkModule.escapeHtml(pop.pop_adi)} (${btkModule.escapeHtml(pop.yayin_yapilan_ssid)})</option>`).join('')}
                                        </select>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td class="fieldlabel" rowspan="2">${lang.serviceTesisAdresiTitle}</td>
                                    <td class="fieldarea">
                                        <label class="checkbox-inline">
                                            <input type="checkbox" name="btk_service_data[tesis_adresi_yerlesimle_ayni]" id="tesis_adresi_yerlesimle_ayni" ${btkData.tesisAdresiYerlesimleAyni ? 'checked' : ''}>
                                            ${lang.tesisAdresiYerlesimleAyniLabel}
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="fieldarea" id="tesisAdresiFormAlani" style="display:${btkData.tesisAdresiYerlesimleAyni ? 'none' : 'block'};">
                                        <div class="row">
                                            <div class="col-sm-4"><select name="btk_service_data[tesis_il_id]" id="tesis_il_id" class="form-control input-sm adres-il-select" data-target-ilce="tesis_ilce_id" data-preselect-ilce-id="${btkData.tesis_ilce_id || ''}"><option value="">${lang.selectIlOption}</option>${(iller || []).map(il => `<option value="${il.id}" ${btkData.tesis_il_id == il.id ? 'selected' : ''}>${btkModule.escapeHtml(il.il_adi)}</option>`).join('')}</select></div>
                                            <div class="col-sm-4"><select name="btk_service_data[tesis_ilce_id]" id="tesis_ilce_id" class="form-control input-sm adres-ilce-select" data-target-mahalle="tesis_mahalle_id" data-preselect-mahalle-id="${btkData.tesis_mahalle_id || ''}"><option value="">${lang.selectIlceOption}</option>${(tesisIlceler || []).map(ilce => `<option value="${ilce.id}" ${btkData.tesis_ilce_id == ilce.id ? 'selected' : ''}>${btkModule.escapeHtml(ilce.ilce_adi)}</option>`).join('')}</select></div>
                                            <div class="col-sm-4"><select name="btk_service_data[tesis_mahalle_id]" id="tesis_mahalle_id" class="form-control input-sm adres-mahalle-select"><option value="">${lang.selectMahalleOption}</option>${(tesisMahalleler || []).map(mahalle => `<option value="${mahalle.id}" ${btkData.tesis_mahalle_id == mahalle.id ? 'selected' : ''}>${btkModule.escapeHtml(mahalle.mahalle_adi)}</option>`).join('')}</select></div>
                                        </div>
                                        <div class="row" style="margin-top: 10px;">
                                            <div class="col-sm-12"><input type="text" name="btk_service_data[tesis_cadde]" value="${btkData.tesis_cadde || ''}" class="form-control input-sm" placeholder="${lang.adresCaddeSokakLabel || 'Cadde / Sokak'}"></div>
                                        </div>
                                         <div class="row" style="margin-top: 10px;">
                                            <div class="col-sm-6"><input type="text" name="btk_service_data[tesis_dis_kapi_no]" value="${btkData.tesis_dis_kapi_no || ''}" class="form-control input-sm" placeholder="${lang.adresDisKapiNoLabel || 'Dış Kapı No'}"></div>
                                            <div class="col-sm-6"><input type="text" name="btk_service_data[tesis_ic_kapi_no]" value="${btkData.tesis_ic_kapi_no || ''}" class="form-control input-sm" placeholder="${lang.adresIcKapiNoLabel || 'İç Kapı No'}"></div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                // Hedef div'i bul ve HTML'i yerleştir
                // WHMCS 7.x/8.x'de hizmet detaylarında "Module Commands" divi altında uygun bir yer bulmak daha güvenli olabilir.
                // Burada tabdetails div'ine ekliyoruz, ancak bu WHMCS sürümüne göre değişebilir.
                // Daha güvenli bir yer bulmak için WHMCS DOM yapısı incelenmeli.
                // Eğer bu kod çalışmazsa, #serviceDetails tablosu altına veya .clientssummarybox:last sonrasına eklenmeli.
                $('#tabdetails').append(htmlContent); // Example: Add to a specific tab

                // Enjekte edilen HTML'deki dinamik elementleri başlat
                // Adres dropdown'larını başlangıç değerleriyle tetikle
                if (btkData.tesis_il_id) {
                    $('#tesis_il_id').val(btkData.tesis_il_id).trigger('change.btkadres.il');
                }
                // Tarih seçicileri başlat
                $('#btkServiceDetailsPlaceholder').find('.date-picker-yyyymmdd').flatpickr({ dateFormat: "YmdHis", enableTime: true, enableSeconds: true, noCalendar: false, allowInput: true, time_24hr: true, defaultHour: 0, defaultMinute: 0, defaultSecond: 0 });
                $('#btkServiceDetailsPlaceholder').find('.date-picker').flatpickr({ dateFormat: "Y-m-d", allowInput: true });
                // Toggle'ları yeniden başlat
                $('#btkServiceDetailsPlaceholder').find('input[data-toggle="toggle"]').bootstrapToggle();
            }
        }
    };

    $(document).ready(function() {
        // Bootstrap Toggle'ın kendi init'i $(function(){ ... }) içinde çalışır.
        // Bizim init fonksiyonumuzun, Bootstrap Toggle'ın DOM manipülasyonu bittikten sonra çalışmasını garantilemek için.
        setTimeout(function() {
             if (typeof window.btkModuleLink !== 'undefined') {
                btkModule.init();
            }
        }, 100); // 100ms gecikme genellikle yeterlidir.
    });

})(jQuery, window, document);