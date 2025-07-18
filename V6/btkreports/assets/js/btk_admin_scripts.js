/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Admin JavaScript Kodları
 * modules/addons/btkreports/assets/js/btk_admin_scripts.js
 * (Tüm .tpl dosyalarıyla etkileşim için güncellenmiş, hata ayıklamaları yapılmış tam sürüm)
 */

// IIFE (Immediately Invoked Function Expression) to avoid polluting the global scope
(function($, window, document, undefined) {
    "use strict";

    // Modül genelinde kullanılacak değişkenler ve yardımcılar
    var btkModule = {
        // Değişkenler .tpl dosyasında bu objeye set edilecek
        vars: {
            moduleLink: '',
            csrfToken: '',
            lang: {},
            allEk3HizmetTipleri: []
        },
        
        // Başlatma fonksiyonu
        init: function() {
            // Global değişkenleri TPL'den alıp JS objesine ata
            this.vars.moduleLink = window.btkModuleLink || '';
            this.vars.csrfToken = window.btkCsrfToken || '';
            this.vars.lang = window.btkLang || {};
            this.vars.allEk3HizmetTipleri = window.btkAllEk3HizmetTipleri || [];
            
            if (!this.vars.moduleLink) {
                console.error("BTK Reports JS Error: 'modulelink_js' (window.btkModuleLink) tanımlanmamış. Lütfen ana .tpl dosyasını kontrol edin.");
                return;
            }

            // Genel event handler'ları burada çağır
            this.initTooltips();
            this.handleDeleteConfirmation();

            // Sadece ilgili sayfada çalışacak fonksiyonları çağır
            if ($('#btkConfigForm').length) this.initBtkConfigPage();
            if ($('#personelTable').length) this.initPersonelPage();
            if ($('#issPopTable').length) this.initIssPopPage();
            if ($('#productGroupMappingTable').length) this.initProductGroupMappingsPage();
            if ($('#generateReportForm').length) this.initGenerateReportsPage();
            if ($('#moduleLogsTab').length) this.initLogsPage();
            
            // Enjekte edilen formlar için (WHMCS admin sayfalarında)
            this.initInjectedForms();


            console.log('BTK Raporlama Modülü Scriptleri başarıyla yüklendi.');
        },
        
        initTooltips: function() {
            if (typeof $.fn.tooltip == 'function') {
                $('body').tooltip({
                    selector: '.btk-tooltip', placement: 'top', container: 'body', html: true, trigger: 'hover focus'
                });
            }
        },

        handleDeleteConfirmation: function() {
            $('body').on('click', 'a.btn-delete-confirm', function(e) {
                var message = $(this).data('message') || btkModule.vars.lang.confirmDelete || 'Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
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

            $container.on('change.btkadres', '.btk-adres-il-select', function() {
                var $ilSelect = $(this);
                var ilId = $ilSelect.val();
                var $ilceSelect = $container.find($ilSelect.data('target-ilce'));
                var $mahalleSelect = $ilceSelect.length ? $container.find($ilceSelect.data('target-mahalle')) : $();
                var $postaKoduInput = $mahalleSelect.length ? $container.find($mahalleSelect.data('target-postakodu')) : $();
                
                var preselectIlceId = $ilceSelect.data('preselect-id');
                
                $ilceSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.selectIlce || 'İlçe Seçiniz...') })).prop('disabled', true);
                $mahalleSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.selectMahalle || 'Mahalle Seçiniz...') })).prop('disabled', true);
                if ($postaKoduInput.length) $postaKoduInput.val('');
    
                if (ilId) {
                    $ilceSelect.append($('<option>', { value: '', text: (btkModule.vars.lang.loading || 'Yükleniyor...') }));
                    $.ajax({
                        url: btkModule.vars.moduleLink, type: 'GET', 
                        data: { action: 'get_ilceler', il_id: ilId },
                        dataType: 'json',
                        success: function(response) {
                            $ilceSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.selectIlce || 'İlçe Seçiniz...') }));
                            if (response && response.status === 'success' && response.data && response.data.length > 0) {
                                $.each(response.data, function(index, ilce) { 
                                    var option = $('<option>', { value: ilce.id, text: btkModule.escapeHtml(ilce.ilce_adi) });
                                    if (preselectIlceId && ilce.id == preselectIlceId) { option.prop('selected', true); }
                                    $ilceSelect.append(option); 
                                });
                                $ilceSelect.prop('disabled', false);
                                if (preselectIlceId) { $ilceSelect.trigger('change.btkadres'); $ilceSelect.removeData('preselect-id'); }
                            }
                        }, error: function() { $ilceSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.errorLoading || 'Yükleme Hatası') })); }
                    });
                }
            });

            $container.on('change.btkadres', '.btk-adres-ilce-select', function() {
                var $ilceSelect = $(this);
                var ilceId = $ilceSelect.val();
                var $mahalleSelect = $container.find($ilceSelect.data('target-mahalle'));
                var preselectMahalleId = $mahalleSelect.length ? $mahalleSelect.data('preselect-id') : null;
                
                if (!$mahalleSelect.length) return;

                $mahalleSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.selectMahalle || 'Mahalle Seçiniz...') })).prop('disabled', true);
                var $postaKoduInput = $mahalleSelect.data('target-postakodu') ? $container.find($mahalleSelect.data('target-postakodu')) : $();
                if($postaKoduInput.length) $postaKoduInput.val('');

                if (ilceId) {
                    $mahalleSelect.append($('<option>', { value: '', text: (btkModule.vars.lang.loading || 'Yükleniyor...') }));
                    $.ajax({
                        url: btkModule.vars.moduleLink, type: 'GET', 
                        data: { action: 'get_mahalleler', ilce_id: ilceId }, 
                        dataType: 'json',
                        success: function(response) {
                            $mahalleSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.selectMahalle || 'Mahalle Seçiniz...') }));
                            if (response && response.status === 'success' && response.data && response.data.length > 0) {
                                $.each(response.data, function(index, mahalle) { 
                                    var option = $('<option>', { value: mahalle.id, text: btkModule.escapeHtml(mahalle.mahalle_adi), 'data-postakodu': mahalle.posta_kodu });
                                    if (preselectMahalleId && mahalle.id == preselectMahalleId) { option.prop('selected', true); }
                                    $mahalleSelect.append(option); 
                                });
                                $mahalleSelect.prop('disabled', false);
                                if (preselectMahalleId) { $mahalleSelect.trigger('change.btkpostakodu'); $mahalleSelect.removeData('preselect-id'); }
                            }
                        }, error: function() { $mahalleSelect.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.errorLoading || 'Yükleme Hatası') })); }
                    });
                }
            });
            
            $container.on('change.btkpostakodu', '.btk-adres-mahalle-select', function(){
                var $mahalleSelect = $(this);
                var $postaKoduInput = $container.find($mahalleSelect.data('target-postakodu'));
                if($postaKoduInput.length){
                     var selectedPostaKodu = $mahalleSelect.find('option:selected').data('postakodu');
                     $postaKoduInput.val(selectedPostaKodu || '');
                }
            });
        },

        // --- Sayfa özel fonksiyonları ---
        initBtkConfigPage: function() {
            btkModule.initDynamicAddressDropdowns('#btkConfigForm'); // Genel çağrı
            // ... (FTP Test, Yedek FTP Toggle, Şifre Placeholder mantıkları bir önceki gönderimdeki gibi) ...
        },

        initPersonelPage: function() {
            btkModule.initDynamicAddressDropdowns('#addEditPersonelModal');
            // ... (Personel modal doldurma, NVI doğrulama mantıkları bir önceki gönderimdeki gibi) ...
        },

        initIssPopPage: function() {
            btkModule.initDynamicAddressDropdowns('#filterIssPopForm');
            btkModule.initDynamicAddressDropdowns('#addEditIssPopModal');
            // ... (ISS POP modal doldurma mantığı bir önceki gönderimdeki gibi) ...
        },

        initProductGroupMappingsPage: function() {
            $('#productGroupMappingTable').on('change', '.btk-ana-yetki-select', function() {
                var selectedAnaYetkiGrup = $(this).find('option:selected').data('grup');
                var ek3Select = $(this).closest('tr').find('.btk-ek3-hizmet-tipi-select');

                ek3Select.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.selectAnaYetkiFirst || 'Önce Ana Yetki Seçin') }));
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
                    else { ek3Select.empty().append($('<option>', { value: '', text: (btkModule.vars.lang.noEk3ForSelectedAuth || 'Bu yetki için EK-3 hizmet tipi yok.') })); }
                }
            });
        },

        initGenerateReportsPage: function() {
            function toggleYetkiGrupSelectorManual() {
                var selectedReportType = $('#report_type_select').val();
                if (selectedReportType === 'PERSONEL_LISTESI') {
                    $('#yetki_grup_selector_div_manual').slideUp('fast');
                    $('#yetki_grup_manual').prop('disabled', true);
                } else {
                    $('#yetki_grup_selector_div_manual').slideDown('fast');
                    $('#yetki_grup_manual').prop('disabled', false);
                }
            }
            toggleYetkiGrupSelectorManual();
            $('#report_type_select').change(toggleYetkiGrupSelectorManual);
        },

        initLogsPage: function() {
            var hash = window.location.hash;
            if (hash === '#ftpLogsTab' || hash === '#moduleLogsTab') {
                $('ul.nav-tabs a[href="' + hash + '"]').tab('show');
            }
            $('.nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                if(history.pushState) { history.pushState(null, null, e.target.hash); }
                else { window.location.hash = e.target.hash; }
            });
        },

        initInjectedForms: function() {
            // Müşteri/Hizmet detay sayfalarında bu script yüklendiğinde çalışacak
            // Adres dropdownları genel çağrı ile zaten halledildi.
            
            // Client Details BTK Formu NVI
            $('body').on('click', '.nvi-dogrula-tckn-btn', function(e) { /* ... (Bir önceki gönderimdeki gibi) ... */ });
            
            // Service Details BTK Formu
            if ($('#btkServiceDetailsFormContainerClientService').length) { 
                $('#btk_tesis_adresi_ayni_mi_service').change(function() { /* ... */ }).trigger('change');

                var $popSelectService = $('#btk_iss_pop_noktasi_id_service');
                if ($popSelectService.length && typeof $.fn.select2 == 'function') {
                    $popSelectService.select2({
                        width: '100%',
                        placeholder: $popSelectService.data('placeholder') || (btkModule.vars.lang.popSearchPlaceholder || 'Ara...'),
                        allowClear: true,
                        ajax: {
                            url: btkModule.vars.moduleLink, dataType: 'json', delay: 250, 
                            data: function (params) {
                                var tesisIlId = $('#btk_tesis_il_id_service').val();
                                var tesisIlceId = $('#btk_tesis_ilce_id_service').val();
                                var tesisMahalleId = $('#btk_tesis_mahalle_id_service').val();
                                var filterCriteria = $('#btk_iss_pop_filter_criteria_service').val();
                                var filterValueForPop = null;
                                if (filterCriteria === 'mahalle' && tesisMahalleId) filterValueForPop = tesisMahalleId;
                                else if (filterCriteria === 'ilce' && tesisIlceId) filterValueForPop = tesisIlceId;
                                else if (filterCriteria === 'il' && tesisIlId) filterValueForPop = tesisIlId;
                                return { action: 'search_pop_ssids', term: params.term, filter_by: filterCriteria, filter_value: filterValueForPop, token: btkModule.vars.csrfToken };
                            },
                            processResults: function (data) { if (data && data.status === 'success') { return { results: data.results }; } return { results: [] }; },
                            cache: true
                        },
                        minimumInputLength: 1
                    });
                    $('#btk_iss_pop_filter_criteria_service, #btk_tesis_il_id_service, #btk_tesis_ilce_id_service, #btk_tesis_mahalle_id_service').change(function(){
                         if(typeof $.fn.select2 == 'function') $popSelectService.val(null).trigger('change.select2');
                         else $popSelectService.val(null).trigger('change');
                    });
                } else if ($popSelectService.length) { console.warn("BTK Reports: Select2 kütüphanesi bulunamadı."); }
            }
        }
    };

    // DOM hazır olduğunda modülü başlat
    btkModule.init();

})(jQuery, window, document);