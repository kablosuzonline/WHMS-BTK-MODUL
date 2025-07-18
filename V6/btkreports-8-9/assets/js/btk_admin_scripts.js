/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Admin JavaScript Kodları
 * Sürüm: 8.0.8 (Gerçek Eşleştirme) - Tüm JS hataları giderildi.
 */

(function($, window, document, undefined) {
    "use strict";

    var btkModule = {
        vars: {
            moduleLink: '',
            csrfToken: '',
            csrfTokenName: '',
            lang: {},
            allEk3HizmetTipleri: []
        },
        
        init: function() {
            this.vars.moduleLink = window.btkModuleLink || '';
            this.vars.csrfToken = window.btkCsrfToken || '';
            this.vars.csrfTokenName = window.btkCsrfTokenName || 'token';
            this.vars.lang = window.btkLang || {};
            this.vars.allEk3HizmetTipleri = window.btkAllEk3HizmetTipleri || [];
            
            if (!this.vars.moduleLink) {
                console.error("BTK Reports JS Error: 'modulelink' (window.btkModuleLink) tanımlanmamış. Script başlatılamadı.");
                return;
            }

            this.initTooltips();
            this.bindEvents();
            
            // Sayfa yüklendiğinde, var olan seçimlere göre arayüzü hazırla
            if ($('#productGroupMappingTable').length) {
                this.initProductGroupMappingsPage();
            }
            if ($('#tesis_adresi_yerlesimle_ayni').length) {
                $('#tesisAdresiFormAlani').toggle(!$('#tesis_adresi_yerlesimle_ayni').is(':checked'));
            }
             if ($('#musteri_tipi_select').length) {
                $('#btkKurumsalAlanlari').toggle($('#musteri_tipi_select').val() === 'T-SIRKET');
            }
             if ($('#backup_ftp_enabled').length) {
                $('#backup_ftp_details').toggle($('#backup_ftp_enabled').is(':checked'));
            }
            if (typeof $.fn.flatpickr == 'function') {
                $('.date-picker').flatpickr({ dateFormat: "Y-m-d", allowInput: true });
                $('.date-picker-yyyymmdd').flatpickr({ dateFormat: "Ymd", allowInput: true });
            }

            console.log('BTK Raporlama Modülü Scriptleri v8.0.8 başarıyla yüklendi.');
        },
        
        bindEvents: function() {
            var self = this;
            var doc = $(document);

            doc.on('click', '.btn-delete-confirm', function(e) {
                var message = $(this).data('message') || 'Bu öğeyi silmek istediğinizden emin misiniz?';
                if (!confirm(message)) { e.preventDefault(); }
            });

            doc.on('change', '#backup_ftp_enabled', function() {
                $('#backup_ftp_details').slideToggle($(this).is(':checked'));
            });

            doc.on('click', '.btk-ftp-test-btn', function(e) {
                e.preventDefault();
                self.testFtpConnection($(this));
            });

            doc.on('show.bs.modal', '#editPersonelModal', function(event) {
                self.handlePersonelModalOpen(event);
            });
            doc.on('click', '#validateNviButton', function() {
                self.validateNviForPersonel($(this));
            });
            
            doc.on('show.bs.modal', '#addEditPopModal', function(event) {
                self.handlePopModalOpen(event);
            });
            doc.on('change', '.btk-pop-monitor-toggle', function() {
                 self.togglePopMonitoring($(this));
            });

             doc.on('change', '.btk-ana-yetki-select', function() {
                 self.populateEk3Dropdown($(this));
            });
            
            doc.on('submit', '.report-generation-form', function(e) {
                e.preventDefault();
                self.handleReportGeneration($(this), $(document.activeElement));
            });

            doc.on('change', '.adres-il-select', function() {
                var $this = $(this);
                self.populateDropdown($this.data('target-ilce'), 'get_ilceler', $this.val(), 'selectIlceOption', $this.data('preselect-ilce-id'));
                $this.data('preselect-ilce-id', null);
            });
            doc.on('change', '.adres-ilce-select', function() {
                 var $this = $(this);
                self.populateDropdown($this.data('target-mahalle'), 'get_mahalleler', $this.val(), 'selectMahalleOption', $this.data('preselect-mahalle-id'));
                $this.data('preselect-mahalle-id', null);
            });
             
            doc.on('change', '#tesis_adresi_yerlesimle_ayni', function() {
                $('#tesisAdresiFormAlani').slideToggle(!$(this).is(':checked'));
            });

            doc.on('change', '#musteri_tipi_select', function(){
                $('#btkKurumsalAlanlari').slideToggle($(this).val() === 'T-SIRKET');
            });
        },
        
        initTooltips: function() {
            if (typeof $.fn.tooltip === 'function') {
                $('body').tooltip({ selector: '[data-toggle="tooltip"]', placement: 'top', container: 'body' });
            }
        },

        escapeHtml: function(str) {
            if (typeof str !== 'string' && typeof str !== 'number') return '';
            var str_val = String(str);
            var entityMap = { '&': '&', '<': '<', '>': '>', '"': '"', "'": ''', '/': '/' };
            return str_val.replace(/[&<>"'/]/g, function (s) { return entityMap[s]; });
        },

        populateDropdown: function(targetElementId, action, parentId, langKey, selectedValue) {
            var self = this;
            var $target = $('#' + targetElementId);
            var defaultText = self.vars.lang[langKey] || 'Lütfen Seçiniz...';
            $target.html('<option value="">' + defaultText + '</option>').prop('disabled', true);

            if (parentId && parentId !== '') {
                $target.prop('disabled', false).html('<option value="">' + (self.vars.lang.loadingData || 'Yükleniyor...') + '</option>');
                var postData = { action: action, parent_id: parentId };
                postData[self.vars.csrfTokenName] = self.vars.csrfToken;

                $.post(self.vars.moduleLink, postData, function(data) {
                    $target.html('<option value="">' + defaultText + '</option>');
                    if (data && data.status === 'success' && data.items) {
                        $.each(data.items, function(key, item) {
                            var option = $('<option></option>').val(item.id).text(self.escapeHtml(item.name || item.ilce_adi || item.mahalle_adi));
                            if (selectedValue && item.id == selectedValue) {
                                option.prop('selected', true);
                            }
                            $target.append(option);
                        });
                        if (selectedValue && $target.val() == selectedValue) {
                            $target.trigger('change');
                        }
                    }
                }, "json").fail(function() {
                    $target.html('<option value="">Hata!</option>');
                });
            }
        },
        
        testFtpConnection: function($button) {
            var self = this;
            var ftpType = $button.data('ftp-type');
            var $resultContainer = $('#' + ftpType + '_ftp_test_result');
            $resultContainer.html('<i class="fas fa-spinner fa-spin"></i> Test ediliyor...');
            $button.prop('disabled', true);
            
            var postData = {
                action: 'test_ftp_connection', ftp_type: ftpType,
                host: $('#' + ftpType + '_ftp_host').val(), user: $('#' + ftpType + '_ftp_user').val(),
                pass: $('#' + ftpType + '_ftp_pass').val(), port: $('#' + ftpType + '_ftp_port').val(),
                ssl: $('#' + ftpType + '_ftp_ssl').is(':checked') ? '1' : '0'
            };
            postData[self.vars.csrfTokenName] = self.vars.csrfToken;

            $.post(self.vars.moduleLink, postData, function(response) {
                var icon = response.status === 'success' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
                $resultContainer.html('<i class="fas ' + icon + '"></i> ' + self.escapeHtml(response.message || 'Bilinmeyen Hata'));
            }, 'json').fail(function() {
                $resultContainer.html('<i class="fas fa-exclamation-triangle text-danger"></i> İstek Başarısız');
            }).always(function() {
                $button.prop('disabled', false);
            });
        },

        handlePersonelModalOpen: function(event) {
            var self = this;
            var button = $(event.relatedTarget);
            var mode = button.data('mode');
            var personelId = button.data('personel-id') || 0;
            var modal = $('#editPersonelModal');

            modal.find('form')[0].reset();
            modal.find('#personel_id_modal').val(personelId);
            modal.find('.tckn-validation-status-modal').html('');

            if (mode === 'edit') {
                modal.find('.modal-title').text('Personel Düzenle');
                var postData = { action: 'get_personel_details', id: personelId };
                postData[self.vars.csrfTokenName] = self.vars.csrfToken;

                $.post(self.vars.moduleLink, postData, function(data) {
                    if (data && data.status === 'success' && data.data) {
                        var p = data.data;
                        for (var key in p) {
                            var $input = modal.find('[name="modal_personel_data[' + key + ']"]');
                            if ($input.length) {
                                if ($input.is(':checkbox')) {
                                    $input.prop('checked', p[key] == 1).change();
                                } else {
                                    $input.val(p[key]);
                                }
                            }
                        }
                    }
                }, 'json');
            } else {
                 modal.find('.modal-title').text('Yeni Personel Ekle');
                 modal.find('#modal_btk_listesine_eklensin').prop('checked', true).change();
            }
        },
        
        handlePopModalOpen: function(event) {
            var self = this;
            var button = $(event.relatedTarget);
            var mode = button.data('mode');
            var popId = button.data('pop-id') || 0;
            var modal = $('#addEditPopModal');
    
            modal.find('form')[0].reset();
            modal.find('#pop_id_modal').val(popId);
    
            modal.find('#modal_ilce_id, #modal_mahalle_id').html('<option value="">' + self.vars.lang.selectOption + '</option>').prop('disabled', true);
    
            if (mode === 'edit') {
                modal.find('.modal-title').text(self.vars.lang.editPopModalTitle || 'POP Düzenle');
                var postData = { action: 'get_pop_details', id: popId };
                postData[self.vars.csrfTokenName] = self.vars.csrfToken;

                $.post(self.vars.moduleLink, postData, function(data) {
                    if (data && data.status === 'success' && data.data) {
                        var p = data.data;
                        for (var key in p) {
                            var $input = modal.find('[name="popdata[' + key + ']"]');
                            if ($input.length) {
                                if ($input.is(':checkbox')) {
                                    $input.prop('checked', p[key] == 1).change();
                                } else {
                                    $input.val(p[key]);
                                }
                            }
                        }

                        if (p.il_id) {
                            modal.find('#modal_il_id').val(p.il_id).data('preselect-ilce-id', p.ilce_id);
                            modal.find('#modal_ilce_id').data('preselect-mahalle-id', p.mahalle_id);
                            modal.find('#modal_il_id').trigger('change');
                        }
                    }
                }, "json");
            } else {
                modal.find('.modal-title').text(self.vars.lang.addNewPopButton || 'Yeni POP Ekle');
                modal.find('#modal_aktif_pasif_durum').prop('checked', true).change();
                modal.find('#modal_izleme_aktif').prop('checked', false).change();
            }
        },
        
        togglePopMonitoring: function($switch) {
            var self = this;
            var popId = $switch.data('pop-id');
            var newStatus = $switch.is(':checked');

            var postData = { action: 'toggle_pop_monitoring', id: popId, status: newStatus };
            postData[self.vars.csrfTokenName] = self.vars.csrfToken;

            $.post(self.vars.moduleLink, postData, function(response) {
                if (response.status !== 'success') {
                    alert(response.message || 'Hata oluştu.');
                    $switch.prop('checked', !newStatus).change();
                }
            }, 'json').fail(function() {
                alert('Sunucu hatası.');
                $switch.prop('checked', !newStatus).change();
            });
        },
        
        initProductGroupMappingsPage: function() {
            var self = this;
            $('.btk-ana-yetki-select').each(function() {
                var $this = $(this);
                // Sayfa yüklendiğinde, her satırın mevcut seçili EK-3 değerini al ve dropdown'ı doldururken kullan.
                self.populateEk3Dropdown($this, $this.data('preselected-ek3'));
            });
        },

        populateEk3Dropdown: function($anaYetkiSelect, preSelectedEk3Value) {
            var self = this;
            var selectedGrup = $anaYetkiSelect.find('option:selected').data('grup');
            var $ek3Select = $anaYetkiSelect.closest('tr').find('.btk-ek3-hizmet-tipi-select');
            
            $ek3Select.empty().prop('disabled', true);

            if (selectedGrup) {
                var optionsHtml = '<option value="">' + (self.vars.lang.selectOption || 'Lütfen Seçiniz...') + '</option>';
                var hasOptions = false;
                $.each(self.vars.allEk3HizmetTipleri, function(index, ek3) {
                    if (ek3.ana_yetki_grup == selectedGrup) {
                        var selectedAttr = (preSelectedEk3Value && preSelectedEk3Value == ek3.hizmet_tipi_kodu) ? ' selected="selected"' : '';
                        optionsHtml += '<option value="' + self.escapeHtml(ek3.hizmet_tipi_kodu) + '"' + selectedAttr + '>' +
                                       self.escapeHtml(ek3.hizmet_tipi_aciklamasi) + ' (' + self.escapeHtml(ek3.hizmet_tipi_kodu) + ')' +
                                       '</option>';
                        hasOptions = true;
                    }
                });
                
                $ek3Select.html(optionsHtml);
                if (hasOptions) {
                    $ek3Select.prop('disabled', false);
                } else {
                    $ek3Select.html('<option value="">' + (self.vars.lang.noEk3ForSelectedAuth || 'Uygun Hizmet Tipi Yok') + '</option>');
                }
            } else {
                $ek3Select.html('<option value="">' + (self.vars.lang.selectAnaYetkiFirst || 'Önce Yetki Türü Seçin') + '</option>');
            }
        },

        handleReportGeneration: function($form, $submitButton) {
            var self = this;
            var reportType = $form.find('input[name="report_type"]').val();
            var $resultDiv = $form.closest('.panel-body').find('.report-result');

            $resultDiv.html('<p class="text-info"><i class="fas fa-spinner fa-spin"></i> Rapor oluşturuluyor...</p>');
            $form.find('button').prop('disabled', true);
    
            var formData = $form.serializeArray();
            formData.push({ name: 'generation_action', value: $submitButton.attr('name') });

            var postData = {};
            $.each(formData, function() {
                postData[this.name] = this.value || '';
            });
            postData[self.vars.csrfTokenName] = self.vars.csrfToken;

            $.post($form.attr('action'), postData, function(response) {
                var alertClass = response.status ? 'alert-success' : 'alert-danger';
                var iconClass = response.status ? 'fa-check-circle' : 'fa-exclamation-circle';
                var message = '<div class="alert ' + alertClass + '" style="margin-top: 15px;"><i class="fas ' + iconClass + '"></i> ' + self.escapeHtml(response.message || 'Bilinmeyen yanıt.');
                
                if (response.file_path && response.status) {
                    message += ' <a href="' + self.vars.moduleLink + '&action=download_file&file=' + encodeURIComponent(response.file_name) + '&' + self.vars.csrfTokenName + '=' + self.vars.csrfToken + '" class="btn btn-xs btn-success" style="margin-left:10px;"><i class="fas fa-download"></i> İndir</a>';
                }
                message += '</div>';
                $resultDiv.html(message);
            }, "json").fail(function() {
                $resultDiv.html('<div class="alert alert-danger" style="margin-top: 15px;"><i class="fas fa-times-circle"></i> Sunucu isteği başarısız oldu.</div>');
            }).always(function() {
                $form.find('button').prop('disabled', false);
            });
        },

        validateNviForPersonel: function($button) {
            var self = this;
            var $modal = $button.closest('.modal-content');
            var tckn = $modal.find('#modal_tc_kimlik_no').val();
            var ad = $modal.find('#modal_ad').val();
            var soyad = $modal.find('#modal_soyad').val();
            var dogumYili = $modal.find('#modal_dogum_yili').val();
            var $statusDiv = $modal.find('.tckn-validation-status-modal');

            if (!tckn || !ad || !soyad || !dogumYili) {
                $statusDiv.html('<span class="text-danger">TCKN, Ad, Soyad ve Doğum Yılı alanları zorunludur.</span>');
                return;
            }

            $statusDiv.html('<span class="text-info"><i class="fas fa-spinner fa-spin"></i> Doğrulanıyor...</span>');
            var postData = { action: 'validate_tckn_personel', tckn: tckn, ad: ad, soyad: soyad, dogum_yili: dogumYili };
            postData[self.vars.csrfTokenName] = self.vars.csrfToken;

            $.post(self.vars.moduleLink, postData, function(response) {
                var msgClass = response.status === 'success' ? 'text-success' : 'text-danger';
                $statusDiv.html('<span class="' + msgClass + '">' + self.escapeHtml(response.message) + '</span>');
            }, 'json').fail(function() {
                $statusDiv.html('<span class="text-danger">Doğrulama servisine ulaşılamadı.</span>');
            });
        }
    };

    $(document).ready(function() {
        if (window.btkModuleLink) {
            btkModule.init();
        }
    });

})(jQuery, window, document);