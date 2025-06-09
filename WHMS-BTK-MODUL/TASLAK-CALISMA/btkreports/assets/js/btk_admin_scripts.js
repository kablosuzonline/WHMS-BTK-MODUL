/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Admin JavaScript Kodları
 * modules/addons/btkreports/assets/js/btk_admin_scripts.js
 */

// Modülün temel URL'sini ve CSRF token'ını .tpl dosyasından almak için global değişkenler
// Bu değişkenler, ana .tpl dosyasında (örn: btkreports.php'nin output'unda veya header.tpl'de) tanımlanmalı:
// <script type="text/javascript">
//     var btkModuleLink = '{$modulelink}'; // Smarty'den gelen modulelink
//     var btkCsrfToken = '{$csrfToken}';   // Smarty'den gelen CSRF token
//     var btkLang = { // Gerekli dil anahtarları
//         selectOne: '{$LANG.selectOne|escape:"javascript"}',
//         onceIliSecin: '{$LANG.onceIliSecin|escape:"javascript"}',
//         onceIlceyiSecin: '{$LANG.onceIlceyiSecin|escape:"javascript"}',
//         dogrulaniyor: '{$LANG.dogrulaniyor|escape:"javascript"}',
//         nviDogrulamaBasarili: '{$LANG.nviDogrulamaBasarili|escape:"javascript"}',
//         nviDogrulamaBasarisiz: '{$LANG.nviDogrulamaBasarisiz|escape:"javascript"}',
//         nviDogrulamaHata: '{$LANG.nviDogrulamaHata|escape:"javascript"}',
//         nviGerekliAlanlar: '{$LANG.nviGerekliAlanlar|escape:"javascript"}',
//         editPersonelTitle: '{$LANG.editPersonelTitle|escape:"javascript"}',
//         addNewPersonel: '{$LANG.addNewPersonel|escape:"javascript"}',
//         editIssPopTitle: '{$LANG.editIssPopTitle|escape:"javascript"}',
//         addNewIssPop: '{$LANG.addNewIssPop|escape:"javascript"}',
//         popSearchPlaceholder: '{$LANG.popSearchPlaceholder|escape:"javascript"}'
//         // ... diğer gerekli dil anahtarları ...
//     };
// </script>
// Bu JS dosyasının YUKARISINDA bu script bloğu olmalı.

$(document).ready(function() {
    // CSRF token'ı tüm AJAX POST isteklerine ekle
    $.ajaxSetup({
        data: {
            token: typeof btkCsrfToken !== 'undefined' ? btkCsrfToken : '' // WHMCS CSRF token
        }
    });

    // --- Genel UI Etkileşimleri ---

    // config.tpl - Yedek FTP ayarlarını göster/gizle
    $('#backup_ftp_enabled_toggle').change(function() {
        if ($(this).is(":checked")) {
            $('#backup_ftp_details').slideDown('fast');
        } else {
            $('#backup_ftp_details').slideUp('fast');
        }
    }).trigger('change'); // Sayfa yüklendiğinde de çalışsın

    // Tooltip'leri etkinleştir (Bootstrap tooltip)
    if (typeof $.fn.tooltip == 'function') {
        $('.btk-tooltip').tooltip({
            placement: 'top',
            container: 'body',
            html: true
        });
    }

    // --- Dinamik Adres Dropdown'ları (İl -> İlçe -> Mahalle) ---
    // Hedef dropdown'lar: data-target-ilce, data-target-mahalle
    // Kaynak dropdown: data-source-il (ilçe için)
    // Posta kodu alanı: data-target-postakodu
    function loadIlceler(ilSelectElement, preselectIlceId, preselectMahalleId) {
        var ilId = $(ilSelectElement).val();
        var ilceSelectId = $(ilSelectElement).data('target-ilce');
        var mahalleSelectId = $(ilSelectElement).data('target-mahalle');
        var ilceSelect = $('#' + ilceSelectId);
        var mahalleSelect = mahalleSelectId ? $('#' + mahalleSelectId) : null;

        ilceSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.onceIliSecin : 'Önce İl Seçiniz') })).prop('disabled', true);
        if (mahalleSelect) {
            mahalleSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.onceIlceyiSecin : 'Önce İlçe Seçiniz') })).prop('disabled', true);
        }
        var postaKoduField = $(ilSelectElement).closest('form, .modal-body').find('[data-adres-postakodu-for="' + ilSelectId + '"]'); // İlişkili posta kodu alanı
        if(postaKoduField.length > 0) postaKoduField.val('');


        if (ilId && typeof btkModuleLink !== 'undefined') {
            ilceSelect.append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.loading : 'Yükleniyor...') }));
            $.ajax({
                url: btkModuleLink + '&action=get_ilceler',
                type: 'GET',
                data: { il_id: ilId, token: (typeof btkCsrfToken !== 'undefined' ? btkCsrfToken : '') /* GET için CSRF? */ },
                dataType: 'json',
                success: function(response) {
                    ilceSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.selectIlce : 'İlçe Seçiniz...') }));
                    if (response.status === 'success' && response.data && response.data.length > 0) {
                        $.each(response.data, function(index, ilce) {
                            ilceSelect.append($('<option>', { value: ilce.id, text: ilce.ilce_adi }));
                        });
                        ilceSelect.prop('disabled', false);
                        if (preselectIlceId) {
                            ilceSelect.val(preselectIlceId).trigger('btkLoadMahalleler', [preselectMahalleId]);
                        }
                    } else if (response.message) {
                        console.error("İlçe yükleme hatası: " + response.message);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    ilceSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.errorLoading : 'Yükleme Hatası!') }));
                    console.error("İlçe yükleme AJAX hatası: " + textStatus, errorThrown);
                }
            });
        }
    }

    function loadMahalleler(ilceSelectElement, preselectMahalleId) {
        var ilceId = $(ilceSelectElement).val();
        var mahalleSelectId = $(ilceSelectElement).data('target-mahalle');
        var mahalleSelect = $('#' + mahalleSelectId);
        var postaKoduField = $(ilceSelectElement).closest('form, .modal-body').find('[data-adres-postakodu-for="' + $(ilceSelectElement).attr('id') + '"]');

        mahalleSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.onceIlceyiSecin : 'Önce İlçe Seçiniz') })).prop('disabled', true);
        if(postaKoduField.length > 0) postaKoduField.val('');

        if (ilceId && typeof btkModuleLink !== 'undefined') {
            mahalleSelect.append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.loading : 'Yükleniyor...') }));
            $.ajax({
                url: btkModuleLink + '&action=get_mahalleler',
                type: 'GET',
                data: { ilce_id: ilceId, token: (typeof btkCsrfToken !== 'undefined' ? btkCsrfToken : '') },
                dataType: 'json',
                success: function(response) {
                    mahalleSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.selectMahalle : 'Mahalle Seçiniz...') }));
                    if (response.status === 'success' && response.data && response.data.length > 0) {
                        $.each(response.data, function(index, mahalle) {
                            mahalleSelect.append($('<option>', { value: mahalle.id, text: mahalle.mahalle_adi, 'data-postakodu': mahalle.posta_kodu }));
                        });
                        mahalleSelect.prop('disabled', false);
                        if (preselectMahalleId) {
                            mahalleSelect.val(preselectMahalleId).trigger('change'); // Posta kodunu da tetikle
                        }
                    } else if (response.message) {
                        console.error("Mahalle yükleme hatası: " + response.message);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                     mahalleSelect.empty().append($('<option>', { value: '', text: (typeof btkLang !== 'undefined' ? btkLang.errorLoading : 'Yükleme Hatası!') }));
                    console.error("Mahalle yükleme AJAX hatası: " + textStatus, errorThrown);
                }
            });
        }
    }
    
    // İl seçimi değiştiğinde ilçeleri yükle
    $('body').on('change', '.btk-adres-il-select', function() {
        loadIlceler(this);
    });
    // Düzenleme modunda önceden seçili ilçeyi ve mahalleyi yüklemek için özel event
    $('body').on('btkLoadIlceler', '.btk-adres-il-select', function(event, preselectIlceId, preselectMahalleId) {
        loadIlceler(this, preselectIlceId, preselectMahalleId);
    });

    // İlçe seçimi değiştiğinde mahalleleri yükle
    $('body').on('change', '.btk-adres-ilce-select', function() {
        loadMahalleler(this);
    });
    $('body').on('btkLoadMahalleler', '.btk-adres-ilce-select', function(event, preselectMahalleId) {
        loadMahalleler(this, preselectMahalleId);
    });
    
    // Mahalle seçildiğinde posta kodunu ilgili alana yaz (eğer varsa)
    $('body').on('change', '.btk-adres-mahalle-select', function() {
        var selectedOption = $(this).find('option:selected');
        var postaKodu = selectedOption.data('postakodu');
        var ilceSelectId = $(this).closest('form, .modal-body').find('.btk-adres-ilce-select').attr('id');
        var postaKoduField = $(this).closest('form, .modal-body').find('[data-adres-postakodu-for="' + ilceSelectId + '"]');
        if (postaKodu && postaKoduField.length > 0) {
            postaKoduField.val(postaKodu);
        }
    });


    // --- ISS POP Noktası Arama Özellikli Dropdown (Select2 ile - service_details_btk_form.tpl için) ---
    if (typeof $.fn.select2 == 'function' && typeof btkModuleLink !== 'undefined') {
        $('.btk-select2-searchable-pop').select2({
            placeholder: $(this).data('placeholder') || (typeof btkLang !== 'undefined' ? btkLang.popSearchPlaceholder : "SSID veya POP Adı ile ara..."),
            allowClear: true,
            width: '100%',
            ajax: {
                url: btkModuleLink + "&action=search_pop_ssids",
                dataType: 'json',
                delay: 300,
                data: function (params) {
                    var filterCriteriaSelect = $('#btk_iss_pop_filter_criteria'); // Filtre kriteri dropdown'ı
                    var filterBy = filterCriteriaSelect.val();
                    var filterValue = '';
                    if (filterBy === 'il') {
                        filterValue = $('#btk_tesis_il_id').val(); // Hizmetin tesis il ID'si
                    } else if (filterBy === 'ilce') {
                        filterValue = $('#btk_tesis_ilce_id').val(); // Hizmetin tesis ilçe ID'si
                    } else if (filterBy === 'mahalle') {
                        filterValue = $('#btk_tesis_mahalle_id').val(); // Hizmetin tesis mahalle ID'si
                    }
                    return {
                        term: params.term,
                        filter_by: filterBy,
                        filter_value: filterValue,
                        token: (typeof btkCsrfToken !== 'undefined' ? btkCsrfToken : '')
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: (data.status === 'success' && data.results) ? data.results : [], // Select2'nin beklediği format {results: [{id:x, text:y},...]}
                        pagination: {
                            more: (params.page * 20) < (data.total_count || 0) // Eğer varsa total_count
                        }
                    };
                },
                cache: true
            },
            minimumInputLength: 2
        });

        // Filtre kriteri değiştiğinde POP arama dropdown'ını temizle
        $('#btk_iss_pop_filter_criteria').change(function(){
            $('.btk-select2-searchable-pop').val(null).trigger('change');
        });
        // Tesis adresi (il/ilçe/mahalle) değiştiğinde de POP arama dropdown'ını temizle
        $('#btk_tesis_il_id, #btk_tesis_ilce_id, #btk_tesis_mahalle_id').change(function(){
            $('.btk-select2-searchable-pop').val(null).trigger('change');
        });

    } else if (typeof btkModuleLink !== 'undefined') {
       console.warn("BTK Reports: Select2 kütüphanesi bulunamadı. POP Noktası arama özelliği standart dropdown olarak çalışacak veya çalışmayacaktır.");
    }

    // --- NVI TCKN/YKN Doğrulama (AJAX ile) ---
    function nviDogrula(type, buttonElement) {
        var form = $(buttonElement).closest('form, .modal-body'); // Form veya modal body içinde ara
        var tckn_ykn = (type === 'TCKN') ? form.find('input[name="tckn"], input[id*="tckn_modal"]').val() : form.find('input[name="ykn"], input[id*="ykn_modal"]').val();
        var ad = form.find('input[name="ad"], input[id*="ad_modal"]').val();
        var soyad = form.find('input[name="soyad"], input[id*="soyad_modal"]').val();
        var dogumYili = form.find('input[name="dogum_yili_nvi"], input[id*="dogum_yili_nvi_modal"]').val(); // NVI için özel doğum yılı alanı
        var dogumGun = form.find('input[name="dogum_gun"], input[id*="dogum_gun_modal"]').val();
        var dogumAy = form.find('input[name="dogum_ay"], input[id*="dogum_ay_modal"]').val();
        var dogumYilYkn = form.find('input[name="dogum_yil"], input[id*="dogum_yil_modal"]').val(); // YKN için ayrı doğum yılı

        var resultContainer = $(buttonElement).closest('.input-group').next('.nvi-result-container, span[id*="Result"]');
        if(resultContainer.length === 0) resultContainer = $(buttonElement).parent().find('.nvi-result-container, span[id*="Result"]'); // Input-group-btn içinde değilse
        if(resultContainer.length === 0) resultContainer = $('<span></span>').addClass('nvi-result-container help-block').insertAfter($(buttonElement).closest('.input-group, input'));


        resultContainer.html('<i class="fas fa-spinner fa-spin"></i> ' + (typeof btkLang !== 'undefined' ? btkLang.dogrulaniyor : 'Doğrulanıyor...'));

        var ajaxData = { token: (typeof btkCsrfToken !== 'undefined' ? btkCsrfToken : '') };
        var ajaxAction = '';

        if (type === 'TCKN') {
            if (!tckn_ykn || !ad || !soyad || !dogumYili) {
                resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + (typeof btkLang !== 'undefined' ? btkLang.nviGerekliAlanlar : 'TCKN, Ad, Soyad ve Doğum Yılı (NVI) zorunludur.') + '</span>');
                return;
            }
            ajaxAction = 'nvi_tckn_dogrula';
            ajaxData.tckn = tckn_ykn;
            ajaxData.ad = ad;
            ajaxData.soyad = soyad;
            ajaxData.dogum_yili_nvi = dogumYili;
        } else if (type === 'YKN') {
            // YKN için gerekli alan kontrolleri eklenecek
            ajaxAction = 'nvi_ykn_dogrula';
            ajaxData.ykn = tckn_ykn;
            ajaxData.ad = ad;
            ajaxData.soyad = soyad;
            ajaxData.dogum_gun = dogumGun;
            ajaxData.dogum_ay = dogumAy;
            ajaxData.dogum_yil = dogumYilYkn;
        } else {
            resultContainer.html('<span class="text-danger">Geçersiz doğrulama türü.</span>');
            return;
        }
        
        if(typeof btkModuleLink === 'undefined') {
             resultContainer.html('<span class="text-danger">Modül linki tanımlanmamış!</span>');
             return;
        }

        $.ajax({
            url: btkModuleLink + '&action=' + ajaxAction,
            type: 'POST',
            data: ajaxData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    resultContainer.html('<span class="text-success"><i class="fas fa-check-circle"></i> ' + (response.message || (typeof btkLang !== 'undefined' ? btkLang.nviDogrulamaBasarili : 'Başarıyla Doğrulandı.')) + '</span>');
                } else {
                    resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + (response.message || (typeof btkLang !== 'undefined' ? btkLang.nviDogrulamaBasarisiz : 'Doğrulanamadı!')) + '</span>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                resultContainer.html('<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> ' + (typeof btkLang !== 'undefined' ? btkLang.nviDogrulamaHata : 'Doğrulama sırasında sunucu hatası.') + '</span>');
                console.error("NVI Doğrulama AJAX Hatası: " + textStatus, errorThrown, jqXHR.responseText);
            }
        });
    }

    // Personel ve Müşteri detaylarındaki NVI TCKN doğrulama butonları
    $('body').on('click', '.nvi-dogrula-tckn-btn-personel, .nvi-dogrula-tckn-btn', function(e) {
        e.preventDefault();
        nviDogrula('TCKN', this);
    });
    // YKN için buton sınıfı .nvi-dogrula-ykn-btn olabilir.


    // --- Modal Form Yönetimi (Personel ve ISS POP için Ekle/Düzenle) ---
    // Personel Modal
    $('#addEditPersonelModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Modalı tetikleyen buton
        var action = button.data('action');
        var modal = $(this);
        var form = modal.find('#personelFormModal');
        form[0].reset(); // Formu her zaman sıfırla
        modal.find('.nvi-result-container, #nviResultPersonelModal').html(''); // NVI sonucunu temizle
        $('#pop_il_id_modal, #pop_ilce_id_modal, #pop_mahalle_id_modal').val('').trigger('change'); // Adres dropdownlarını sıfırla
        $('#gorev_bolgesi_ilce_id_modal').val(''); // Görev bölgesi sıfırla


        if (action === 'add') {
            modal.find('.modal-title').text(typeof btkLang !== 'undefined' ? btkLang.addNewPersonel : 'Yeni Personel Ekle');
            modal.find('#personel_id_modal').val('0');
            modal.find('#whmcs_admin_id_db_modal').val('');
            modal.find('#whmcs_admin_id_select_modal').val(''); // WHMCS Admin dropdown'ını sıfırla
            modal.find('#btk_listesine_eklensin_modal').prop('checked', true); // Varsayılan işaretli
            modal.find('#firma_unvani_modal').val(typeof btkOperatorTitle !== 'undefined' ? btkOperatorTitle : ''); // Ayarlardan çekilen operatör ünvanı
        } else { // Edit
            modal.find('.modal-title').text(typeof btkLang !== 'undefined' ? btkLang.editPersonelTitle : 'Personel Bilgilerini Düzenle');
            modal.find('#personel_id_modal').val(button.data('personelid'));
            modal.find('#whmcs_admin_id_db_modal').val(button.data('whmcsadminid'));
            modal.find('#whmcs_admin_id_select_modal').val(button.data('whmcsadminid'));
            modal.find('#firma_unvani_modal').val(button.data('firmaunvani'));
            modal.find('#ad_modal').val(button.data('ad'));
            modal.find('#soyad_modal').val(button.data('soyad'));
            modal.find('#tckn_modal').val(button.data('tckn'));
            // dogum_yili_nvi_modal için bir değer atanabilir veya boş bırakılabilir
            modal.find('#unvan_modal').val(button.data('unvan'));
            modal.find('#departman_id_modal').val(button.data('departmanid'));
            modal.find('#mobil_tel_modal').val(button.data('mobiltel'));
            modal.find('#sabit_tel_modal').val(button.data('sabittel'));
            modal.find('#email_modal').val(button.data('email'));
            modal.find('#ev_adresi_modal').val(button.data('evadresi'));
            modal.find('#acil_durum_kisi_iletisim_modal').val(button.data('acildurum'));
            modal.find('#ise_baslama_tarihi_modal').val(button.data('isebaslama'));
            modal.find('#isten_ayrilma_tarihi_modal').val(button.data('istenayrilma'));
            modal.find('#is_birakma_nedeni_modal').val(button.data('isbirakmanedeni'));
            modal.find('#gorev_bolgesi_ilce_id_modal').val(button.data('gorevbolgesiilceid'));
            modal.find('#btk_listesine_eklensin_modal').prop('checked', button.data('btklistesineekle') == 1 || button.data('btklistesineekle') === 'true');
        }
    });

    // ISS POP Modal
    $('#addEditIssPopModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var action = button.data('action');
        var modal = $(this);
        var form = modal.find('#issPopFormModal'); // Form ID'si issPopFormModal olmalı
        form[0].reset();
        modal.find('#pop_il_id_modal').val('').trigger('change'); // Adres dropdownlarını sıfırla

        if (action === 'add') {
            modal.find('.modal-title').text(typeof btkLang !== 'undefined' ? btkLang.addNewIssPop : 'Yeni POP Noktası Ekle');
            modal.find('#pop_id_modal').val('0'); // Formdaki hidden input'un ID'si pop_id_modal olmalı
            modal.find('#aktif_pasif_durum_modal').prop('checked', true);
        } else { // Edit
            modal.find('.modal-title').text(typeof btkLang !== 'undefined' ? btkLang.editIssPopTitle : 'POP Noktası Bilgilerini Düzenle');
            modal.find('#pop_id_modal').val(button.data('popid'));
            modal.find('#pop_adi_modal').val(button.data('popadi'));
            modal.find('#yayin_yapilan_ssid_modal').val(button.data('ssid'));
            modal.find('#ip_adresi_modal').val(button.data('ipadresi'));
            modal.find('#cihaz_turu_modal').val(button.data('cihazturu'));
            modal.find('#cihaz_markasi_modal').val(button.data('cihazmarkasi'));
            modal.find('#cihaz_modeli_modal').val(button.data('cihazmodeli'));
            modal.find('#pop_tipi_modal').val(button.data('poptipi'));
            modal.find('#tam_adres_modal').val(button.data('tamadres'));
            modal.find('#koordinatlar_modal').val(button.data('koordinatlar'));
            modal.find('#aktif_pasif_durum_modal').prop('checked', button.data('aktif') == 1 || button.data('aktif') === 'true');
            
            var ilId = button.data('ilid');
            var ilceId = button.data('ilceid');
            var mahalleId = button.data('mahalleid');
            if(ilId){
                 $('#pop_il_id_modal').val(ilId).trigger('btkLoadIlceler', [ilceId, mahalleId]);
            }
        }
    });


    // --- Tarih Seçiciler (Datepicker) ---
    // WHMCS admin teması genellikle kendi datepicker'ını (örn: bootstrap-datepicker veya flatpickr) içerir.
    // Eğer yoksa, harici bir kütüphane eklenebilir.
    // Örnek Flatpickr kullanımı (flatpickr CSS ve JS dosyalarının yüklenmiş olması gerekir):
    // if (typeof flatpickr !== "undefined") {
    //     $(".btk-datepicker-yyyy-mm-dd").flatpickr({ dateFormat: "Y-m-d", allowInput: true });
    //     $(".btk-datepicker-yyyymmdd").flatpickr({ dateFormat: "Ymd", allowInput: true });
    // }

    // --- Service Details Formu için JS ---
    // Tesis Adresi Aynı Mı? checkbox'ı
    $('#btk_tesis_adresi_ayni_mi').change(function() {
        if ($(this).is(":checked")) {
            $('#btk_tesis_adresi_farkli_div').slideUp('fast');
            // TODO: İsteğe bağlı olarak, yerleşim adresi bilgilerini tesis adresi alanlarına
            // kopyalayabilir ve bu alanları readonly yapabiliriz.
            // Bu, PHP tarafında (BtkHelper::handlePreServiceEdit) da yapılabilir.
        } else {
            $('#btk_tesis_adresi_farkli_div').slideDown('fast');
            // TODO: Tesis adresi alanlarını temizleyebilir ve düzenlenebilir yapabiliriz.
        }
    }).trigger('change'); // Sayfa yüklendiğinde de çalışsın


    console.log("BTK Raporlama Modülü Admin Script'leri Tam Kapsamlı Olarak Yüklendi.");
});