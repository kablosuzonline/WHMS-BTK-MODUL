/**
 * WHMCS BTK Raporlama Modülü - Özel JavaScript Fonksiyonları
 * Version: 6.0.0
 */

jQuery(document).ready(function($) {
    // Sekmeli arayüz
    $('.btk-nav-tabs a').click(function (e) {
        e.preventDefault();
        var targetTab = $(this).attr('href');
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        $(targetTab).addClass('active').siblings('.btk-tab-pane').removeClass('active');
    });
    if ($('.btk-nav-tabs li.active').length === 0) {
        $('.btk-nav-tabs li:first').addClass('active');
        $('.btk-tab-content .btk-tab-pane:first').addClass('active');
    }

    var $yedekFtpToggle = $('#ftp_yedek_aktif_toggle');
    var $yedekFtpFields = $('.btk-yedek-ftp-fields');
    function toggleYedekFtpFields() {
        if ($yedekFtpToggle.is(':checked')) {
            $yedekFtpFields.removeClass('hidden').slideDown();
        } else {
            $yedekFtpFields.slideUp(function() { $(this).addClass('hidden'); });
        }
    }
    toggleYedekFtpFields();
    $yedekFtpToggle.on('change', function() {
        toggleYedekFtpFields();
    });

    $('#testFtpAna, #testFtpYedek').click(function(e) {
        e.preventDefault();
        var $button = $(this);
        var ftpType = $button.attr('id') === 'testFtpAna' ? 'ana' : 'yedek';
        var $resultDiv = ftpType === 'ana' ? $('#ftpTestResultAna') : $('#ftpTestResultYedek');
        var originalButtonText = $button.html();

        $button.html('<i class="fas fa-spinner fa-spin"></i> ' + (BtkLang.test_ediliyor || 'Test ediliyor...')).prop('disabled', true);
        $resultDiv.removeClass('alert-success alert-danger alert-info').addClass('alert-info').html(BtkLang.lutfen_bekleyin || 'Lütfen bekleyin...').show();

        var formData = {
            'action': 'ftp_test',
            'token': $('input[name="token"]').val(),
            'ftp_type': ftpType
        };

        if (ftpType === 'ana') {
            formData.ftp_host = $('#ftp_host').val();
            formData.ftp_port = $('#ftp_port').val();
            formData.ftp_username = $('#ftp_username').val();
            formData.ftp_password = $('#ftp_password').val();
            formData.ftp_use_ssl = $('#ftp_use_ssl_toggle').is(':checked');
            formData.ftp_passive_mode = $('#ftp_passive_mode_toggle').is(':checked');
        } else {
            formData.ftp_host_yedek = $('#ftp_host_yedek').val(); // TPL'deki ID ile aynı olmalı
            formData.ftp_port_yedek = $('#ftp_port_yedek').val();
            formData.ftp_username_yedek = $('#ftp_username_yedek').val();
            formData.ftp_password_yedek = $('#ftp_password_yedek').val();
            formData.ftp_use_ssl_yedek = $('#ftp_use_ssl_yedek_toggle').is(':checked');
            formData.ftp_passive_mode_yedek = $('#ftp_passive_mode_yedek_toggle').is(':checked');
        }

        // **** YENİ LOGLAMA ****
        console.log("FTP Testi için Gönderilecek AJAX Verisi (" + ftpType + "):", JSON.stringify(formData, null, 2));
        // **** YENİ LOGLAMA SONU ****

        $.ajax({
            url: $('form[action*="btkreports"]').attr('action') || window.location.href, // Formun action URL'sini alalım
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                // ... (önceki success kısmı aynı)
                if (response.status === 'success') {
                    $resultDiv.removeClass('alert-info alert-danger').addClass('alert-success').html((BtkLang.ftp_test_basarili || 'FTP bağlantısı başarılı!') + (response.message ? ' (' + response.message + ')' : ''));
                } else {
                    $resultDiv.removeClass('alert-info alert-success').addClass('alert-danger').html((BtkLang.ftp_test_basarisiz || 'FTP bağlantısı başarısız: ') + (response.message ? response.message : 'Bilinmeyen bir hata oluştu.'));
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $resultDiv.removeClass('alert-info alert-success').addClass('alert-danger').html((BtkLang.ftp_test_basarisiz || 'FTP bağlantısı başarısız: ') + 'Sunucu ile iletişim kurulamadı. AJAX Hatası: ' + textStatus + ' - ' + errorThrown);
                console.error("FTP Test AJAX Hatası:", jqXHR, textStatus, errorThrown); // Detaylı AJAX hatası
            },
            complete: function() {
                $button.html(originalButtonText).prop('disabled', false);
            }
        });
    });
});