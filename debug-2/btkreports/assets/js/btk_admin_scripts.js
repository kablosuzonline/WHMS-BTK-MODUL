/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Admin JavaScript Kodları
 * modules/addons/btkreports/assets/js/btk_admin_scripts.js
 */

// Global değişkenler (tpl'den set edilebilir)
// var btkModuleLink = ''; // Örnek: btkreports_output içinde <script>var btkModuleLink = '{$modulelink}';</script> ile set edilir.
// var btkCsrfToken = ''; // Örnek: btkreports_output içinde <script>var btkCsrfToken = '{$csrfToken}';</script> ile set edilir.
// var btkLang = {};    // Örnek: Dil anahtarları için <script>var btkLang = { selectOne: '{$LANG.selectOne}' ... };</script>

// Basit HTML escape fonksiyonu
if (typeof String.prototype.escape !== 'function') {
    String.prototype.escape = function() {
        var tagsToReplace = { '&': '&', '<': '<', '>': '>' };
        return this.replace(/[&<>]/g, function(tag) { return tagsToReplace[tag] || tag; });
    };
}

$(document).ready(function() {
    // btkModuleLink ve btkCsrfToken değişkenlerinin tpl içinde tanımlandığını varsayıyoruz.
    // Eğer tanımlanmamışsa, bazı AJAX işlemleri çalışmayabilir.
    if (typeof btkModuleLink === 'undefined') {
        console.warn("BTK Reports JS: btkModuleLink global değişkeni tanımlanmamış!");
        // Fallback olarak window.location.pathname kullanılabilir ama action eklemek gerekir.
        // btkModuleLink = window.location.pathname + window.location.search.substring(0, window.location.search.indexOf('&action=') > -1 ? window.location.search.indexOf('&action=') : window.location.search.length);
    }
    if (typeof btkCsrfToken === 'undefined') {
        console.warn("BTK Reports JS: btkCsrfToken global değişkeni tanımlanmamış!");
    }
    // Dil değişkenleri için
    var langSelectOne = (typeof btkLang !== 'undefined' && btkLang.selectOne) ? btkLang.selectOne.escape() : 'Seçiniz...';
    var langOnceIliSecin = (typeof btkLang !== 'undefined' && btkLang.onceIliSecin) ? btkLang.onceIliSecin.escape() : 'Önce İl Seçiniz';
    var langOnceIlceyiSecin = (typeof btkLang !== 'undefined' && btkLang.onceIlceyiSecin) ? btkLang.onceIlceyiSecin.escape() : 'Önce İlçe Seçiniz';
    var langDogrulaniyor = (typeof btkLang !== 'undefined' && btkLang.dogrulaniyor) ? btkLang.dogrulaniyor.escape() : 'Doğrulanıyor...';
    var langNviDogrulamaBasarili = (typeof btkLang !== 'undefined' && btkLang.nviDogrulamaBasarili) ? btkLang.nviDogrulamaBasarili.escape() : 'TCKN Başarıyla Doğrulandı.';
    var langNviDogrulamaBasarisiz = (typeof btkLang !== 'undefined' && btkLang.nviDogrulamaBasarisiz) ? btkLang.nviDogrulamaBasarisiz.escape() : 'TCKN Doğrulanamadı!';
    var langNviDogrulamaHata = (typeof btkLang !== 'undefined' && btkLang.nviDogrulamaHata) ? btkLang.nviDogrulamaHata.escape() : 'NVI Doğrulama sırasında bir hata oluştu.';
    var langNviGerekliAlanlar = (typeof btkLang !== 'undefined' && btkLang.nviGerekliAlanlar) ? btkLang.nviGerekliAlanlar.escape() : 'TCKN, Ad, Soyad ve Doğum Yılı (NVI) zorunludur.';
    var langTestingConnection = (typeof btkLang !== 'undefined' && btkLang.testingConnection) ? btkLang.testingConnection.escape() : 'Bağlantı test ediliyor...';
    var langFtpTestFailed = (typeof btkLang !== 'undefined' && btkLang.ftpTestFailed) ? btkLang.ftpTestFailed.escape() : 'Bağlantı testi başarısız.';
    var langFtpTestAjaxError = (typeof btkLang !== 'undefined' && btkLang.ftpTestAjaxError) ? btkLang.ftpTestAjaxError.escape() : 'Sunucuya ulaşılamadı veya bir test hatası oluştu.';
    var langPopSearchPlaceholder = (typeof btkLang !== 'undefined' && btkLang.popSearchPlaceholder) ? btkLang.popSearchPlaceholder.escape() : 'SSID veya POP Adı ile ara...';
    var langNoEk3ForThisGroup = (typeof btkLang !== 'undefined' && btkLang.noEk3ForThisGroup) ? btkLang.noEk3ForThisGroup.escape() : 'Bu gruba uygun EK-3 hizmet tipi yok.';


    // Genel: Tooltip'leri etkinleştir
    if (typeof $.fn.tooltip == 'function') {
        $('.btk-tooltip').tooltip({
            placement: 'top',
            container: 'body',
            html: true
        });
    }

    // Genel: Tarih Seçiciler (Flatpickr örneği - kütüphane dahil edilmeli)
    if (typeof flatpickr !== "undefined") {
        $(".btk-datepicker-yyyymmdd").flatpickr({
            dateFormat: "Ymd", // BTK formatı
            altInput: true,    // Kullanıcı dostu format
            altFormat: "d.m.Y", // Gösterim formatı
            allowInput: true   // Manuel girişe izin ver
        });
        $(".btk-datepicker-yyyy-mm-dd").flatpickr({ // Normal format
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d.m.Y",
            allowInput: true
        });
    } else {
        // console.warn("BTK Reports JS: Flatpickr kütüphanesi bulunamadı. Tarih alanları metin olarak kalacak.");
    }

    // --- config.tpl için JavaScript ---
    if ($('#btkConfigForm').length) {
        // Yedek FTP detaylarını göster/gizle
        $('#backup_ftp_enabled_toggle').change(function() {
            var backupDetails = $('#backup_ftp_details');
            var backupTestBtn = $('button[data-ftp-type="backup"]');
            if($(this).is(":checked")) {
                backupDetails.slideDown('fast');
                backupTestBtn.prop('disabled', false);
            } else {
                backupDetails.slideUp('fast');
                backupTestBtn.prop('disabled', true);
                $('#backup_ftp_test_result').html('');
            }
        }).trigger('change'); // Sayfa yüklendiğinde de durumu doğru ayarla

        // Şifre alanları için placeholder davranışı
        $('#btkConfigForm input[type="password"]').each(function() {
            var $this = $(this);
            var placeholderText = langFtpPassPlaceholder || 'Değiştirmek istemiyorsanız boş bırakın';
            var isMainPassSet = ($this.attr('name') === 'main_ftp_pass' && $this.data('is-set') == '1');
            var isBackupPassSet = ($this.attr('name') === 'backup_ftp_pass' && $this.data('is-set') == '1');

            $this.attr('placeholder', placeholderText);
            if ( ($this.val() === '' || $this.val() === '********') && (isMainPassSet || isBackupPassSet) ) {
                $this.val('********');
            } else if ($this.val() === '********' && !(isMainPassSet || isBackupPassSet)) {
                 $this.val('');
            }
            $this.focus(function() { if ($(this).val() === '********') { $(this).val(''); } })
              .blur(function() { if ($(this).val() === '') { if ((isMainPassSet && $(this).attr('name') === 'main_ftp_pass') || (isBackupPassSet && $(this).attr('name') === 'backup_ftp_pass')) { $(this).val('********'); } } });
        });

        // FTP Bağlantı Testi Butonları
        $('.btk-ftp-test-btn').click(function() {
            var ftpType = $(this).data('ftp-type');
            var resultContainer = $('#' + ftpType + '_ftp_test_result');
            var button = $(this);
            resultContainer.html('<i class="fas fa-spinner fa-spin"></i> ' + langTestingConnection);
            button.prop('disabled', true);
            var ftpPassVal = $('#' + ftpType + '_ftp_pass').val();
            var ftpPass = (ftpPassVal === '********') ? '' : ftpPassVal; 

            $.ajax({
                url: btkModuleLink, 
                type: 'POST',
                data: { 
                    action: 'test_ftp_connection', 
                    ftp_type: ftpType, 
                    host: $('#' + ftpType + '_ftp_host').val(), 
                    user: $('#' + ftpType + '_ftp_user').val(), 
                    pass: ftpPass, 
                    port: $('#' + ftpType + '_ftp_port').val(), 
                    ssl: $('#' + ftpType + '_ftp_ssl_toggle').is(':checked') ? '1' : '0', 
                    token: btkCsrfToken 
                },
                dataType: 'json',
                success: function(response) {
                    if (response && response.status === 'success') { resultContainer.html('<span class="text-success"><i class="fas fa-check-circle"></i> ' + (response.message ? response.message.escape() : 'Başarılı') + '</span>'); } 
                    else { resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + (response.message ? response.message.escape() : langFtpTestFailed) + '</span>'); }
                },
                error: function(xhr, status, error) { resultContainer.html('<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> ' + langFtpTestAjaxError + ' (' + status + ': ' + error + ')</span>'); },
                complete: function() { button.prop('disabled', false); }
            });
        });
    } // config.tpl sonu

    // --- Dinamik Adres Dropdown'ları (Genel Fonksiyon) ---
    // Kullanım: data-target-ilce="#ilceSelectId" data-target-mahalle="#mahalleSelectId" data-target-postakodu="#postaKoduInputId"
    //           data-prefix="some_prefix_" (eğer ID'lerde prefix varsa)
    function updateAddressDropdowns(sourceSelect, prefix, targetIlceId, targetMahalleId, targetPostaKoduId, selectedIlceVal, selectedMahalleVal) {
        var ilId = $(sourceSelect).val();
        var ilceSelect = $('#' + (prefix || '') + targetIlceId);
        var mahalleSelect = $('#' + (prefix || '') + targetMahalleId);
        var postaKoduInput = $('#' + (prefix || '') + targetPostaKoduId);

        ilceSelect.empty().append($('<option>', { value: '', text: langOnceIliSecin })).prop('disabled', true);
        mahalleSelect.empty().append($('<option>', { value: '', text: langOnceIlceyiSecin })).prop('disabled', true);
        if(postaKoduInput.length) postaKoduInput.val('');

        if (ilId && ilId !== '') {
            ilceSelect.html('<option value="">' + langDogrulaniyor + '</option>'); // Yükleniyor...
            $.ajax({
                url: btkModuleLink + '&action=get_ilceler',
                type: 'GET',
                data: { il_id: ilId, token: btkCsrfToken /* GET için token opsiyonel */ },
                dataType: 'json',
                success: function(response) {
                    ilceSelect.empty().append($('<option>', { value: '', text: langSelectOne }));
                    if (response && response.status === 'success' && response.data && response.data.length > 0) {
                        $.each(response.data, function(index, ilce) {
                            ilceSelect.append($('<option>', { value: ilce.id, text: ilce.ilce_adi.escape() }));
                        });
                        ilceSelect.prop('disabled', false);
                        if (selectedIlceVal) {
                            ilceSelect.val(selectedIlceVal).trigger('change', [selectedMahalleVal]); // Mahalleleri yüklemek için trigger et
                        }
                    } else {
                        ilceSelect.empty().append($('<option>', { value: '', text: langOnceIliSecin }));
                        // console.error("İlçe yükleme hatası: " + (response.message || 'Veri yok'));
                    }
                },
                error: function() { ilceSelect.empty().append($('<option>', { value: '', text: 'Hata!' })); console.error("İlçe yükleme AJAX hatası."); }
            });
        }
    }

    $('.btk-adres-il-select').change(function(event, preselectIlceId, preselectMahalleId) {
        var prefix = $(this).data('prefix') || '';
        var targetIlceId = $(this).data('target-ilce').replace(prefix, '');
        var targetMahalleId = $(this).data('target-mahalle').replace(prefix, '');
        var targetPostaKoduId = $(this).data('target-postakodu') ? $(this).data('target-postakodu').replace(prefix, '') : null;
        updateAddressDropdowns(this, prefix, targetIlceId, targetMahalleId, targetPostaKoduId, preselectIlceId, preselectMahalleId);
    });

    $('.btk-adres-ilce-select').change(function(event, preselectMahalleId) {
        var ilceId = $(this).val();
        var prefix = $(this).data('prefix') || '';
        var targetMahalleId = $(this).data('target-mahalle').replace(prefix, '');
        var mahalleSelect = $('#' + prefix + targetMahalleId);
        var targetPostaKoduId = $(this).data('target-postakodu') ? $(this).data('target-postakodu').replace(prefix, '') : null;
        var postaKoduInput = $('#' + prefix + targetPostaKoduId);

        mahalleSelect.empty().append($('<option>', { value: '', text: langOnceIlceyiSecin })).prop('disabled', true);
        if(postaKoduInput.length) postaKoduInput.val('');

        if (ilceId && ilceId !== '') {
            mahalleSelect.html('<option value="">' + langDogrulaniyor + '</option>');
            $.ajax({
                url: btkModuleLink + '&action=get_mahalleler',
                type: 'GET',
                data: { ilce_id: ilceId, token: btkCsrfToken },
                dataType: 'json',
                success: function(response) {
                    mahalleSelect.empty().append($('<option>', { value: '', text: langSelectOne }));
                    if (response && response.status === 'success' && response.data && response.data.length > 0) {
                        $.each(response.data, function(index, mahalle) {
                            mahalleSelect.append($('<option>', { value: mahalle.id, text: mahalle.mahalle_adi.escape(), 'data-postakodu': mahalle.posta_kodu }));
                        });
                        mahalleSelect.prop('disabled', false);
                         if (preselectMahalleId) {
                            mahalleSelect.val(preselectMahalleId).trigger('change'); // Posta kodunu doldurmak için trigger et
                        }
                    } else {
                        mahalleSelect.empty().append($('<option>', { value: '', text: langOnceIlceyiSecin }));
                        // console.error("Mahalle yükleme hatası: " + (response.message || 'Veri yok'));
                    }
                },
                error: function() { mahalleSelect.empty().append($('<option>', { value: '', text: 'Hata!' })); console.error("Mahalle yükleme AJAX hatası.");}
            });
        }
    });

    $('.btk-adres-mahalle-select').change(function() {
        var prefix = $(this).data('prefix') || '';
        var selectedOption = $(this).find('option:selected');
        var postaKodu = selectedOption.data('postakodu');
        var targetPostaKoduId = $(this).data('target-postakodu') ? $(this).data('target-postakodu').replace(prefix, '') : null;
        var postaKoduInput = $('#' + prefix + targetPostaKoduId);

        if (postaKoduInput.length && postaKodu) {
            postaKoduInput.val(postaKodu);
        }
    });
// --- BÖLÜM 2/2 Sonu (Eğer bölünmesi gerekiyorsa) ---
// BÖLÜM 2/2 OLARAK DEVAM EDİYORUZ, AYNI DOSYA İÇİNDE.
// Javascript kodları genellikle tek parça halinde daha yönetilebilir olur.
// Eğer çok uzarsa mantıksal bölümlere ayrılabilir.
// ... btk_admin_scripts.js Bölüm 1/2 içeriğinin sonu (Dinamik Adres Dropdown'ları sonrası) ...

    // --- Personel Yönetimi (personel.tpl) için JavaScript ---
    if ($('#personelTable').length) {
        // Personel Ekle/Düzenle Modalını Doldurma
        $('.btn-edit-personel').click(function() {
            $('#addEditPersonelModalLabel').text(btkLang.editPersonelTitle || 'Personel Bilgilerini Düzenle');
            var modalForm = $('#personelFormModal');
            modalForm[0].reset(); // Formu temizle
            $('#nviResultPersonelModal').html(''); // NVI sonucunu temizle

            $('#personel_id_modal').val($(this).data('personelid'));
            $('#whmcs_admin_id_db_modal').val($(this).data('whmcsadminid')); // Orijinal admin ID'yi sakla
            $('#whmcs_admin_id_select_modal').val($(this).data('whmcsadminid'));
            $('#ad_modal').val($(this).data('ad'));
            $('#soyad_modal').val($(this).data('soyad'));
            $('#tckn_modal').val($(this).data('tckn'));
            $('#dogum_yili_nvi_modal_personel').val(''); // NVI için doğum yılı her seferinde girilmeli veya DB'den çekilmeli
            $('#unvan_modal').val($(this).data('unvan'));
            $('#departman_id_modal').val($(this).data('departmanid'));
            $('#mobil_tel_modal').val($(this).data('mobiltel'));
            $('#sabit_tel_modal').val($(this).data('sabittel'));
            $('#email_modal').val($(this).data('email'));
            $('#ev_adresi_modal').val($(this).data('evadresi'));
            $('#acil_durum_kisi_iletisim_modal').val($(this).data('acildurum'));
            $('#ise_baslama_tarihi_modal').val($(this).data('isebaslama'));
            $('#isten_ayrilma_tarihi_modal').val($(this).data('istenayrilma'));
            $('#is_birakma_nedeni_modal').val($(this).data('isbirakmanedeni'));
            $('#gorev_bolgesi_ilce_id_modal').val($(this).data('gorevbolgesiilceid'));
            $('#btk_listesine_eklensin_modal_toggle').prop('checked', $(this).data('btklistesineekle') == 1);
            
            // Firma ünvanı zaten readonly ve PHP'den geliyor
        });

        // Yeni Personel Ekle butonu için modalı sıfırla
        $('button[data-target="#addEditPersonelModal"][data-action="add"]').click(function() {
            $('#addEditPersonelModalLabel').text(btkLang.addNewPersonel || 'Yeni Personel Ekle');
            $('#personelFormModal')[0].reset();
            $('#personel_id_modal').val('0'); // Yeni kayıt
            $('#whmcs_admin_id_db_modal').val('');
            $('#whmcs_admin_id_select_modal').val(''); // WHMCS admin seçimini de sıfırla
            $('#btk_listesine_eklensin_modal_toggle').prop('checked', true); // Varsayılan olarak işaretli
            $('#nviResultPersonelModal').html('');
            $('#dogum_yili_nvi_modal_personel').val(''); // NVI doğum yılını temizle
        });

        // NVI TCKN Doğrulama Butonu (Personel Modal)
        $('#nviDogrulaBtnPersonelModal').click(function(e) {
            e.preventDefault();
            var tckn = $('#tckn_modal').val();
            var ad = $('#ad_modal').val();
            var soyad = $('#soyad_modal').val();
            var dogumYili = $('#dogum_yili_nvi_modal_personel').val();
            var resultContainer = $('#nviResultPersonelModal');
            resultContainer.html('<i class="fas fa-spinner fa-spin"></i> ' + langDogrulaniyor);

            if (!tckn || !ad || !soyad || !dogumYili) {
                resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + langNviGerekliAlanlar + '</span>');
                return;
            }

            $.ajax({
                url: btkModuleLink, type: 'POST',
                data: { action: 'nvi_tckn_dogrula', tckn: tckn, ad: ad, soyad: soyad, dogum_yili_nvi: dogumYili, token: btkCsrfToken },
                dataType: 'json',
                success: function(response) {
                    if (response && response.success) { resultContainer.html('<span class="text-success nvi-status-dogrulandi"><i class="fas fa-check-circle"></i> ' + (response.message || langNviDogrulamaBasarili) + '</span>'); } 
                    else { resultContainer.html('<span class="text-danger nvi-status-' + (response.nvi_status ? response.nvi_status.toLowerCase() : 'hata') + '"><i class="fas fa-times-circle"></i> ' + (response.message || langNviDogrulamaBasarisiz) + '</span>'); }
                },
                error: function() { resultContainer.html('<span class="text-danger nvi-status-hata"><i class="fas fa-exclamation-triangle"></i> ' + langNviDogrulamaHata + '</span>'); }
            });
        });
    } // personel.tpl sonu


    // --- ISS POP Noktası Yönetimi (iss_pop_management.tpl) için JavaScript ---
    if ($('#issPopTable').length) {
        // Filtreleme formundaki İl seçildiğinde İlçe dropdown'ını AJAX ile doldur
        // Bu genel .btk-adres-il-select handler'ı ile zaten çalışıyor olmalı.
        // $('#s_il_id_filter_isspop').change(function(){ ... }); // Tekrar tanımlamaya gerek yok.

        // ISS POP Ekle/Düzenle Modalını Doldurma
        $('.btn-edit-isspop').click(function() {
            $('#addEditIssPopModalLabel').text(btkLang.editIssPopTitle || 'POP Noktasını Düzenle');
            var modalForm = $('#issPopFormModal');
            modalForm[0].reset();

            $('#pop_id_modal').val($(this).data('popid'));
            $('#pop_adi_modal').val($(this).data('popadi'));
            $('#yayin_yapilan_ssid_modal').val($(this).data('ssid'));
            $('#ip_adresi_modal').val($(this).data('ipadresi'));
            $('#cihaz_turu_modal').val($(this).data('cihazturu'));
            $('#cihaz_markasi_modal').val($(this).data('cihazmarkasi'));
            $('#cihaz_modeli_modal').val($(this).data('cihazmodeli'));
            $('#pop_tipi_modal').val($(this).data('poptipi'));
            $('#tam_adres_modal').val($(this).data('tamadres'));
            $('#koordinatlar_modal').val($(this).data('koordinatlar'));
            $('#aktif_pasif_durum_modal_toggle').prop('checked', $(this).data('aktif') == 1);

            // Adres dropdownlarını ayarla (önce il, sonra ilçe, sonra mahalle)
            var ilId = $(this).data('ilid');
            var ilceId = $(this).data('ilceid');
            var mahalleId = $(this).data('mahalleid');

            var ilSelectModal = $('#pop_il_id_modal');
            ilSelectModal.val(ilId); // Önce il'i set et
            // İlçe ve mahallelerin yüklenmesi için il'in change event'ini tetikle
            // ve yüklendikten sonra doğru değerleri seç.
            // Bu, updateAddressDropdowns içinde preselect parametreleriyle yönetilecek.
            ilSelectModal.trigger('change', [ilceId, mahalleId]);
        });

        // Yeni POP Ekle butonu için modalı sıfırla
        $('button[data-target="#addEditIssPopModal"][data-action="add"]').click(function() {
            $('#addEditIssPopModalLabel').text(btkLang.addNewIssPop || 'Yeni POP Noktası Ekle');
            $('#issPopFormModal')[0].reset();
            $('#pop_id_modal').val('0');
            $('#pop_il_id_modal').val('').trigger('change'); // Adres dropdown'larını sıfırla
            $('#aktif_pasif_durum_modal_toggle').prop('checked', true);
        });
    } // iss_pop_management.tpl sonu


    // --- Hizmet Detayları BTK Formu (service_details_btk_form.tpl) için JavaScript ---
    // Bu form bir sayfaya enjekte edildiği için, ID'lerin unique olması önemli (serviceId ile prefixlendi).
    // Bu nedenle, seçiciler daha genel olmalı veya her hizmet için JS yeniden initialize edilmeli.
    // Şimdilik, her bir hizmet formu için bu kodların çalışacağını varsayıyoruz.
    // Unique ID'ler için data-serviceid attribute'u kullanılabilir.

    // Tesis Adresi Aynı Mı checkbox'ı
    $('input[id^="btk_tesis_adresi_ayni_mi_s"]').each(function(){
        var serviceId = $(this).attr('id').replace('btk_tesis_adresi_ayni_mi_s', '');
        var tesisAdresiFarkliDiv = $('#btk_tesis_adresi_farkli_div_s' + serviceId);
        
        $(this).change(function() {
            if ($(this).is(":checked")) {
                tesisAdresiFarkliDiv.slideUp('fast');
                // TODO: Yerleşim adresi bilgilerini (PHP'den $client_btk_data ile gelir)
                //       tesis adresi alanlarına (btk_tesis_*) kopyala ve readonly yap (opsiyonel).
                //       Veya PHP tarafı, bu checkbox işaretliyse tesis adresi alanlarını
                //       otomatik olarak yerleşim adresinden alır ve DB'ye boş kaydeder.
            } else {
                tesisAdresiFarkliDiv.slideDown('fast');
                // TODO: Tesis adresi alanlarını temizle ve düzenlenebilir yap.
            }
        });
        // Sayfa yüklendiğinde de durumu ayarla (triggerHandler event'i tetiklemez, sadece fonksiyonu çalıştırır)
        if ($(this).is(":checked")) { tesisAdresiFarkliDiv.hide(); } 
        else { tesisAdresiFarkliDiv.show(); }
    });
    
    // Hizmet Detaylarındaki ISS POP Noktası Filtreleme ve Arama (Select2 ile)
    // Bu, her bir hizmet için ayrı ayrı initialize edilmeli (eğer birden fazla hizmet formu aynı anda gösteriliyorsa)
    // .btk-select2-searchable-pop sınıfına sahip tüm select'ler için:
    if (typeof $.fn.select2 == 'function' && $('.btk-select2-searchable-pop').length > 0) {
        $('.btk-select2-searchable-pop').each(function() {
            var $selectPop = $(this);
            var serviceIdPrefix = $selectPop.data('serviceid'); // 's123' gibi
            var filterCriteriaSelect = $('#btk_iss_pop_filter_criteria_' + serviceIdPrefix);
            
            // Tesis adresi dropdown ID'lerini al (filter_value için)
            var tesisIlSelect = $('#btk_tesis_il_id_' + serviceIdPrefix);
            var tesisIlceSelect = $('#btk_tesis_ilce_id_' + serviceIdPrefix);
            var tesisMahalleSelect = $('#btk_tesis_mahalle_id_'s{$serviceid_placeholder|default:0});
            // İnitialize Select2 for this specific element
            $selectPop.select2({
                placeholder: $selectPop.data('placeholder') || langPopSearchPlaceholder,
                allowClear: true,
                width: '100%',
                ajax: {
                    url: btkModuleLink + "&action=search_pop_ssids",
                    dataType: 'json',
                    delay: 300,
                    data: function (params) {
                        var filterBy = filterCriteriaSelect.val(); // mahalle, ilce, il
                        var filterValue = '';
                        if (filterBy === 'mahalle' && tesisMahalleSelect.val()) filterValue = tesisMahalleSelect.val();
                        else if (filterBy === 'ilce' && tesisIlceSelect.val()) filterValue = tesisIlceSelect.val();
                        else if (filterBy === 'il' && tesisIlSelect.val()) filterValue = tesisIlSelect.val();
                        
                        return {
                            term: params.term, 
                            filter_by: filterBy,
                            filter_value: filterValue,
                            token: btkCsrfToken // GET için token opsiyonel
                        };
                    },
                    processResults: function (data) {
                        return { results: data.results || [] }; // Select2 bu formatı bekler
                    },
                    cache: true
                },
                minimumInputLength: 1 // Aramaya başlamak için en az 1 karakter
            });

            // Filtre kriteri değiştikçe Select2'yi sıfırla ve yeniden arama yapmaya hazırla
            filterCriteriaSelect.change(function(){
                $selectPop.val(null).trigger('change'); // Select2'yi temizle
            });
            // Tesis adresi değiştikçe de Select2 sıfırlanabilir (opsiyonel)
            tesisIlSelect.change(function(){ $selectPop.val(null).trigger('change'); });
            tesisIlceSelect.change(function(){ $selectPop.val(null).trigger('change'); });
            tesisMahalleSelect.change(function(){ $selectPop.val(null).trigger('change'); });
        });
    } else if ($('.btk-select2-searchable-pop').length > 0) {
        console.warn("BTK Reports JS: Select2 kütüphanesi bulunamadı. POP Noktası arama özelliği standart dropdown olarak çalışacak veya çalışmayacak.");
    }


    // --- Müşteri Detayları (client_details_btk_form.tpl) için NVI Doğrulama ---
    if ($('#btkClientDetailsFormContainerPage').length) {
         $('.nvi-dogrula-tckn-btn').click(function(e) { // Daha genel bir seçici
            e.preventDefault();
            var tcknFieldId = $(this).data('tckn-field-id');
            var adFieldId = $(this).data('ad-field-id');
            var soyadFieldId = $(this).data('soyad-field-id');
            var dogumYiliFieldId = $(this).data('dogumyili-field-id');
            var resultContainerId = $(this).data('result-container-id');

            var tckn = $('#' + tcknFieldId).val();
            var ad = $('#' + adFieldId).val();
            var soyad = $('#' + soyadFieldId).val();
            var dogumYili = $('#' + dogumYiliFieldId).val();
            var resultContainer = $('#' + resultContainerId);
            
            resultContainer.html('<i class="fas fa-spinner fa-spin"></i> ' + langDogrulaniyor);

            if (!tckn || !ad || !soyad || !dogumYili) {
                resultContainer.html('<span class="text-danger"><i class="fas fa-times-circle"></i> ' + langNviGerekliAlanlar + '</span>');
                return;
            }
            $.ajax({
                url: btkModuleLink, type: 'POST',
                data: { action: 'nvi_tckn_dogrula', tckn: tckn, ad: ad, soyad: soyad, dogum_yili_nvi: dogumYili, token: btkCsrfToken },
                dataType: 'json',
                success: function(response) {
                    if (response && response.success) { resultContainer.html('<span class="text-success nvi-status-dogrulandi"><i class="fas fa-check-circle"></i> ' + (response.message || langNviDogrulamaBasarili) + '</span>'); } 
                    else { resultContainer.html('<span class="text-danger nvi-status-' + (response.nvi_status ? response.nvi_status.toLowerCase() : 'hata') + '"><i class="fas fa-times-circle"></i> ' + (response.message || langNviDogrulamaBasarisiz) + '</span>'); }
                },
                error: function() { resultContainer.html('<span class="text-danger nvi-status-hata"><i class="fas fa-exclamation-triangle"></i> ' + langNviDogrulamaHata + '</span>'); }
            });
        });
    }

    // --- generate_reports.tpl için JavaScript ---
    if ($('#generateReportForm').length) {
        function toggleYetkiGrupSelectorManualPage() {
            var selectedReportType = $('#report_type_select').val();
            if (selectedReportType === 'PERSONEL') {
                $('#yetki_grup_selector_div_manual').slideUp('fast');
                $('#yetki_grup_manual').prop('disabled', true);
            } else {
                $('#yetki_grup_selector_div_manual').slideDown('fast');
                $('#yetki_grup_manual').prop('disabled', false);
            }
        }
        toggleYetkiGrupSelectorManualPage();
        $('#report_type_select').change(toggleYetkiGrupSelectorManualPage);

        $('#btnGenerateAndDownloadReport').click(function(e){
            e.preventDefault();
            var originalFtpTarget = $('#ftp_target_select').val(); // Orijinal değeri sakla
            $('#ftp_target_select').val('none');
            
            // Formu submit etmeden önce bir onay alalım
            if (confirm( (typeof btkLang !== 'undefined' && btkLang.generateReportConfirmNoFtp) ? btkLang.generateReportConfirmNoFtp.escape() : 'Seçili rapor(lar) oluşturulup tarayıcıya indirilsin mi (FTP\'ye GÖNDERİLMEDEN)?')) {
                 $('#generateReportForm').submit();
            } else {
                 $('#ftp_target_select').val(originalFtpTarget); // İptal edilirse eski değeri geri yükle
            }
        });
        // Normal submit butonu için onay zaten tpl'de onclick ile var.
    }

    console.log("BTK Raporlama Modülü Admin Script'leri tam olarak yüklendi ve çalışmaya hazır.");
}); // $(document).ready sonu