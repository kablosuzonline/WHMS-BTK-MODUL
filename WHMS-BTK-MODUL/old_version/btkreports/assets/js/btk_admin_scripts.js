// modules/addons/btkreports/assets/js/btk_admin_scripts.js (v1.0.22)

$(document).ready(function() {
    // Global Değişkenler (btkreports.php'den $smarty->assign ile gelen modulelink ve csrfToken)
    // Bu değişkenlerin TPL dosyasında <script> bloğu içinde tanımlanması ve
    // bu JS dosyasından önce yüklenmesi gerekir.
    // Örnek:
    // <script type="text/javascript">
    //     var btkModuleLink = '{$modulelink|escape:"javascript"}';
    //     var btkCsrfToken = '{$csrfToken|escape:"javascript"}';
    //     var btkLang = {
    //         ftp_status_checking: '{$_ADDONLANG.btkreports_ftp_status_checking|escape:"javascript"}',
    //         ftp_status_active: '{$_ADDONLANG.btkreports_ftp_status_active|escape:"javascript"}',
    //         ftp_status_passive: '{$_ADDONLANG.btkreports_ftp_status_passive|escape:"javascript"}',
    //         ftp_status_not_configured: '{$_ADDONLANG.btkreports_ftp_status_not_configured|escape:"javascript"}',
    //         ftp_status_passive_error: '{$_ADDONLANG.btkreports_ftp_status_passive_error|escape:"javascript"}',
    //         ftp_status_unknown: '{$_ADDONLANG.btkreports_ftp_status_unknown|escape:"javascript"}',
    //         ftp_test_fail_ajax: '{$_ADDONLANG.btkreports_ftp_test_fail_ajax|escape:"javascript"}',
    //         ftp_error_timeout: '{$_ADDONLANG.btkreports_ftp_error_timeout|escape:"javascript"}',
    //         ftp_error_unknown: '{$_ADDONLANG.btkreports_ftp_error_unknown|escape:"javascript"}',
    //         personnel_sync_inprogress: '{$_ADDONLANG.btkreports_personnel_sync_inprogress|escape:"javascript"|default:"Senkronize Ediliyor..."}',
    //         generating_report: '{$_ADDONLANG.btkreports_generating_report|escape:"javascript"|default:"Rapor Oluşturuluyor..."}'
    //     };
    // </script>
    // Bu yapı index.tpl içine eklendi.

    // Aktif sekmeyi URL'den al ve ayarla (index.tpl içine taşındı)
    // var currentUrl = window.location.href;
    // $('#btkModuleTabs a').each(function() {
    //     var tabLink = $(this).attr('href');
    //     if (currentUrl.includes(tabLink)) {
    //         $(this).parent().addClass('active');
    //     } else {
    //         $(this).parent().removeClass('active');
    //     }
    // });
    // if ($('#btkModuleTabs li.active').length === 0) {
    //     $('#btkModuleTabs li:first-child').addClass('active');
    // }

    // FTP Durum Kontrolü (index.tpl içine taşındı, çünkü {$modulelink} gibi Smarty değişkenlerine ihtiyacı var)
    /*
    function checkFtpStatus() {
        var statusIndicator = $('#ftpStatusIndicator');
        if (!statusIndicator.length) return;

        var loadingText = '<i class="fas fa-sync fa-spin"></i> ' + (btkLang.ftp_status_checking || 'FTP durumu kontrol ediliyor...');
        statusIndicator.html(loadingText).removeClass('ftp-status-active ftp-status-passive ftp-status-error ftp-status-not-configured');

        $.ajax({
            url: btkModuleLink + '&action=getFtpStatus&token=' + btkCsrfToken,
            type: 'GET',
            dataType: 'json',
            timeout: 15000,
            success: function(response) {
                if (response && typeof response.message !== 'undefined') {
                    if (response.success) {
                        statusIndicator.html('<i class="fas fa-check-circle"></i> ' + response.message).addClass('ftp-status-active');
                    } else {
                        var notConfiguredMsg = btkLang.ftp_status_not_configured || 'Ayarlanmadı';
                        if (response.message.includes(notConfiguredMsg)) {
                             statusIndicator.html('<i class="fas fa-exclamation-triangle"></i> ' + response.message).addClass('ftp-status-not-configured');
                        } else {
                             statusIndicator.html('<i class="fas fa-times-circle"></i> ' + response.message).addClass('ftp-status-passive');
                        }
                    }
                } else {
                     statusIndicator.html('<i class="fas fa-question-circle"></i> ' + (btkLang.ftp_status_unknown || 'FTP Durumu Bilinmiyor')).addClass('ftp-status-error');
                }
            },
            error: function(xhr, status, error) {
                var errorMessage = (btkLang.ftp_test_fail_ajax || 'FTP testinde AJAX hatası:') + ' ';
                if (status === 'timeout') {
                    errorMessage += (btkLang.ftp_error_timeout || 'Sunucu zaman aşımına uğradı.');
                } else {
                    errorMessage += error || (btkLang.ftp_error_unknown || 'Bilinmeyen bir hata oluştu.');
                }
                statusIndicator.html('<i class="fas fa-exclamation-triangle"></i> ' + errorMessage).addClass('ftp-status-error');
            }
        });
    }

    if ($('#ftpStatusIndicator').length) {
        checkFtpStatus();
        setInterval(checkFtpStatus, 3 * 60 * 1000);
    }
    */

    // Config Sayfası: FTP Test Butonu (config.tpl içine taşındı)
    /*
    $('#testFtpButtonConfig').on('click', function() {
        // ... (config.tpl içindeki script) ...
    });
    */

    // Personel Sayfası: Senkronizasyon Butonu (personel.tpl içine taşındı)
    /*
    $('#syncPersonelButton').on('click', function() {
        var btn = $(this);
        btn.button('loading'); 
        window.location.href = btkModuleLink + '&action=syncPersonel&token=' + btkCsrfToken;
    });
    */

    // Personel Sayfası: Rapor Oluşturma Butonu (personel.tpl içine taşındı)
    /*
    $('#generatePersonelReportButton').on('click', function() {
        // ... (personel.tpl içindeki script) ...
    });
    */


    // Dinamik adres dropdown'ları (client_details.tpl ve service_details.tpl için)
    function fetchIlceler(ilSelect, ilceSelect, mahalleSelect, selectedIlceId, selectedMahalleId) {
        var ilId = $(ilSelect).val();
        $(ilceSelect).empty().append($('<option>').text(btkLang.select_option_ilce || '-- İlçe Seçin --').val(''));
        $(mahalleSelect).empty().append($('<option>').text(btkLang.select_option_mahalle || '-- Mahalle Seçin --').val(''));

        if (ilId) {
            $.ajax({
                url: btkModuleLink + "&action=getIlceler&il_id=" + ilId + "&token=" + btkCsrfToken,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    if (data.success && data.ilceler) {
                        $.each(data.ilceler, function(key, ilce) {
                            var option = $('<option>').val(ilce.id).text(ilce.ilce_adi);
                            if (selectedIlceId && ilce.id == selectedIlceId) {
                                option.prop('selected', true);
                            }
                            $(ilceSelect).append(option);
                        });
                        if (selectedIlceId) { // Eğer başlangıçta ilçe seçiliyse, mahalleleri de yükle
                            fetchMahalleler(ilceSelect, mahalleSelect, selectedMahalleId);
                        }
                    } else {
                        // Opsiyonel: Hata mesajı göster
                    }
                }
            });
        }
    }

    function fetchMahalleler(ilceSelect, mahalleSelect, selectedMahalleId) {
        var ilceId = $(ilceSelect).val();
        $(mahalleSelect).empty().append($('<option>').text(btkLang.select_option_mahalle || '-- Mahalle Seçin --').val(''));

        if (ilceId) {
            $.ajax({
                url: btkModuleLink + "&action=getMahalleler&ilce_id=" + ilceId + "&token=" + btkCsrfToken,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    if (data.success && data.mahalleler) {
                        $.each(data.mahalleler, function(key, mahalle) {
                            var option = $('<option>').val(mahalle.id).text(mahalle.mahalle_adi);
                            if (selectedMahalleId && mahalle.id == selectedMahalleId) {
                                option.prop('selected', true);
                            }
                            $(mahalleSelect).append(option);
                        });
                    } else {
                        // Opsiyonel: Hata mesajı göster
                    }
                }
            });
        }
    }

    // Client Details - Yerleşim Adresi
    var initialIlIdYerlesim = $('#yerlesim_il_id').data('initial');
    var initialIlceIdYerlesim = $('#yerlesim_ilce_id').data('initial');
    var initialMahalleIdYerlesim = $('#yerlesim_mahalle_id').data('initial');

    if (initialIlIdYerlesim) {
        $('#yerlesim_il_id').val(initialIlIdYerlesim);
        fetchIlceler('#yerlesim_il_id', '#yerlesim_ilce_id', '#yerlesim_mahalle_id', initialIlceIdYerlesim, initialMahalleIdYerlesim);
    }
    $('#yerlesim_il_id').on('change', function() {
        fetchIlceler(this, '#yerlesim_ilce_id', '#yerlesim_mahalle_id', null, null);
    });
    $('#yerlesim_ilce_id').on('change', function() {
        fetchMahalleler(this, '#yerlesim_mahalle_id', null);
    });

    // Client Details - Kurum Adresi
    var initialIlIdKurum = $('#kurum_il_id').data('initial');
    var initialIlceIdKurum = $('#kurum_ilce_id').data('initial');
    var initialMahalleIdKurum = $('#kurum_mahalle_id').data('initial');

    if (initialIlIdKurum) {
        $('#kurum_il_id').val(initialIlIdKurum);
        fetchIlceler('#kurum_il_id', '#kurum_ilce_id', '#kurum_mahalle_id', initialIlceIdKurum, initialMahalleIdKurum);
    }
    $('#kurum_il_id').on('change', function() {
        fetchIlceler(this, '#kurum_ilce_id', '#kurum_mahalle_id', null, null);
    });
    $('#kurum_ilce_id').on('change', function() {
        fetchMahalleler(this, '#kurum_mahalle_id', null);
    });
    
    // Client Details - Kimlik NVI İl/İlçe
    var initialKimlikIlId = $('#abone_kimlik_il_id').data('initial');
    var initialKimlikIlceId = $('#abone_kimlik_ilce_id').data('initial');
    if (initialKimlikIlId) {
        $('#abone_kimlik_il_id').val(initialKimlikIlId);
        fetchIlceler('#abone_kimlik_il_id', '#abone_kimlik_ilce_id', null, initialKimlikIlceId, null); // Mahalle yok
    }
     $('#abone_kimlik_il_id').on('change', function() {
        fetchIlceler(this, '#abone_kimlik_ilce_id', null, null, null); // Mahalle yok
    });


    // Service Details - Tesis Adresi
    var initialIlIdTesis = $('#tesis_il_id').data('initial');
    var initialIlceIdTesis = $('#tesis_ilce_id').data('initial');
    var initialMahalleIdTesis = $('#tesis_mahalle_id').data('initial');

    if (initialIlIdTesis) {
        $('#tesis_il_id').val(initialIlIdTesis);
        fetchIlceler('#tesis_il_id', '#tesis_ilce_id', '#tesis_mahalle_id', initialIlceIdTesis, initialMahalleIdTesis);
    }
    $('#tesis_il_id').on('change', function() {
        fetchIlceler(this, '#tesis_ilce_id', '#tesis_mahalle_id', null, null);
    });
    $('#tesis_ilce_id').on('change', function() {
        fetchMahalleler(this, '#tesis_mahalle_id', null);
    });

    // Tesis adresi yerleşimle aynı checkbox'ı
    $('#tesis_adresi_ayni').on('change', function() {
        if ($(this).is(':checked')) {
            $('#tesisAdresiManuelGiris').hide();
        } else {
            $('#tesisAdresiManuelGiris').show();
        }
    }).trigger('change'); // Sayfa yüklendiğinde de durumu kontrol et


    // NVI Doğrulama Butonları (client_details.tpl)
    $('#btnNviTcknDogrula').on('click', function() {
        var btn = $(this);
        btn.button('loading');
        var statusDiv = $('#nviTcknDogrulamaSonuc');
        statusDiv.html('').removeClass('alert-success alert-danger');

        $.ajax({
            url: btkModuleLink + "&action=nviTcknDogrula",
            type: "POST",
            data: {
                token: btkCsrfToken, // Ana CSRF token (form submit için)
                nvi_token_name: $('#nviCsrfTokenNameClient').val(), // AJAX'a özel CSRF token
                nvi_token_value: $('#nviCsrfTokenValueClient').val(),
                client_id: $('input[name="client_id"]').val(),
                tckn: $('#abone_tc_kimlik_no').val(),
                ad: $('#firstname').val() || $('#abone_adi_nvi_tckn').val(), // WHMCS'ten veya formdan al
                soyad: $('#lastname').val() || $('#abone_soyadi_nvi_tckn').val(),
                dogum_yili: $('#abone_dogum_tarihi_nvi_tckn_yil').val() // Yıl için ayrı input
            },
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    statusDiv.html('<i class="fas fa-check-circle"></i> ' + response.message).addClass('alert-success').show();
                } else {
                    statusDiv.html('<i class="fas fa-times-circle"></i> ' + response.message).addClass('alert-danger').show();
                }
            },
            error: function() {
                statusDiv.html('<i class="fas fa-exclamation-triangle"></i> NVI TCKN doğrulama sırasında bir hata oluştu.').addClass('alert-danger').show();
            },
            complete: function() {
                btn.button('reset');
                 // AJAX sonrası yeni NVI token'larını alıp güncellemek gerekebilir (eğer tek kullanımlıksa)
                // Şu anki btkreports.php yapısında sayfa her yüklendiğinde yeni NVI token üretiliyor.
            }
        });
    });
    
    $('#btnNviYknDogrula').on('click', function() {
        // Benzer AJAX yapısı YKN için
    });

    // Tarih alanları için datepicker (eğer WHMCS admin teması jQuery UI içeriyorsa)
    if ($.fn.datepicker) {
        $('.date-picker').datepicker({
            dateFormat: 'yy-mm-dd', // WHMCS ve MySQL ile uyumlu format
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+10" // Geçmiş ve gelecek için geniş bir aralık
        });
    }
    // Sayısal alanlar için sadece sayı girişi
    $('#tc_kimlik_no_personel, #mobil_telefonu_personel, #sabit_telefonu_personel').on('input', function() { // personel.tpl için ID'ler
        this.value = this.value.replace(/[^0-9]/g, '');
    });
     $('#abone_tc_kimlik_no, #abone_vergi_numarasi, #abone_mersis_numarasi, #abone_kimlik_cilt_no, #abone_kimlik_kutuk_no, #abone_kimlik_sayfa_no, #kurum_yetkili_tckimlik_no').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    $('#irtibat_tel_no_1, #irtibat_tel_no_2, #kurum_yetkili_telefon').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });


});