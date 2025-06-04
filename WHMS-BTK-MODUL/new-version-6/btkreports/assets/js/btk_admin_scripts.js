/**
 * WHMCS BTK Raporlama Modülü - Özel JavaScript Fonksiyonları
 * Version: 6.0.1 BETA
 */

jQuery(document).ready(function($) {

    // Bootstrap Sekme Yönetimi (TPL'deki href ve data-toggle="tab" ile çalışır)
    // Bu kısım genellikle Bootstrap'in kendisi tarafından halledilir.
    // Eğer özel bir davranış gerekmiyorsa, bu JS koduna ihtiyaç olmayabilir.
    // Ancak, sayfa action'ına göre doğru sekmeyi aktif etmek için:
    var currentAction = new URLSearchParams(window.location.search).get('action');
    if (currentAction) {
        $('#btkModuleTabs a[href="' + btkModuleLink + '&action=' + currentAction + '"]').tab('show');
        // Eğer href'ler #id formatındaysa:
        // $('#btkModuleTabs a[href="#' + currentAction + '_content"]').tab('show');
    } else {
         $('#btkModuleTabs a[href="#anasayfa_content"]').tab('show'); // Varsayılan
    }

    // Sekme linklerine tıklandığında sayfa değiştirmesi için (eğer data-toggle="tab" yetmiyorsa)
    $('#btkModuleTabs a[data-action]').on('click', function (e) {
        var action = $(this).data('action');
        if (action && action !== '#') { // Placeholder olmayanlar için
            e.preventDefault();
            window.location.href = btkModuleLink + '&action=' + action;
        }
    });


    // Yedek FTP alanlarını göster/gizle
    var $yedekFtpToggle = $('#ftp_yedek_aktif_toggle');
    var $yedekFtpFields = $('.btk-yedek-ftp-fields');
    function toggleYedekFtpFields() {
        if ($yedekFtpToggle.is(':checked')) {
            $yedekFtpFields.removeClass('hidden').slideDown();
        } else {
            $yedekFtpFields.slideUp(function() { $(this).addClass('hidden'); });
        }
    }
    if($yedekFtpToggle.length) { // Element varsa çalıştır
        toggleYedekFtpFields();
        $yedekFtpToggle.on('change', function() {
            toggleYedekFtpFields();
        });
    }


    // FTP Bağlantı Testi (Hem config hem de index sayfası için)
    function performFtpTest(buttonId, ftpType) {
        var $button = $('#' + buttonId);
        var $resultDiv = $('#' + $button.data('resultdiv')); // Result div ID'sini butondan al
        var originalButtonText = $button.html();

        $button.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true); // Sadece ikon
        $resultDiv.removeClass('alert-success alert-danger alert-info').addClass('alert-info').html(BtkLang.lutfen_bekleyin || 'Lütfen bekleyin...').show();

        var formData = {
            'action': 'ftp_test',
            'token': $('input[name="token"]').val() || btkCsrfToken, // Ana sayfada form olmayabilir
            'ftp_type': ftpType
        };

        // config.tpl içindeki değerleri al (eğer config sayfasındaysak)
        // Ana sayfa testi için bu değerler PHP'den (kayıtlı config) gelmeli
        // Bu JS sadece buton tıklamasıyla anlık formdaki değerleri alır
        if (ftpType === 'ana') {
            formData.ftp_host = $('#ftp_host').val();
            formData.ftp_port = $('#ftp_port').val();
            formData.ftp_username = $('#ftp_username').val();
            formData.ftp_password = $('#ftp_password').val();
            formData.ftp_use_ssl = $('#ftp_use_ssl_toggle').is(':checked');
            formData.ftp_passive_mode = $('#ftp_passive_mode_toggle').is(':checked');
        } else if (ftpType === 'yedek') {
            formData.ftp_host_yedek = $('#ftp_host_yedek').val();
            formData.ftp_port_yedek = $('#ftp_port_yedek').val();
            formData.ftp_username_yedek = $('#ftp_username_yedek').val();
            formData.ftp_password_yedek = $('#ftp_password_yedek').val();
            formData.ftp_use_ssl_yedek = $('#ftp_use_ssl_yedek_toggle').is(':checked');
            formData.ftp_passive_mode_yedek = $('#ftp_passive_mode_yedek_toggle').is(':checked');
        }
        // Ana sayfadaki testler için, formData'ya host, user, pass gibi bilgileri
        // PHP'den gelen $currentConfig'den alıp JS'e aktarmak ve buradan göndermek gerekebilir.
        // Şimdilik config sayfasındaki anlık değerlerle test yapacak şekilde bırakıyorum.
        // Ana sayfa testi için $currentConfig'den gelen değerlerle test yapılır.

        $.ajax({
            url: btkModuleLink, // Global JS değişkeninden al
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                var messageText = '';
                if (response.status === 'success') {
                    messageText = (BtkLang.ftp_test_basarili || 'FTP bağlantısı başarılı!') + (response.message ? ' (' + response.message + ')' : '');
                    $resultDiv.removeClass('alert-info alert-danger').addClass('alert-success').html(messageText);
                    // Ana sayfadaki durum metnini de güncelle (eğer varsa)
                    if (buttonId === 'testFtpAnaIndex') $('#ftpStatusAnaText').text(BtkLang.btkreports_aktif).removeClass('status-pasif text-muted').addClass('status-aktif');
                    if (buttonId === 'testFtpYedekIndex') $('#ftpStatusYedekText').text(BtkLang.btkreports_aktif).removeClass('status-pasif text-muted').addClass('status-aktif');

                } else {
                    messageText = (BtkLang.ftp_test_basarisiz || 'FTP bağlantısı başarısız: ') + (response.message ? response.message : 'Bilinmeyen bir hata oluştu.');
                    $resultDiv.removeClass('alert-info alert-success').addClass('alert-danger').html(messageText);
                    if (buttonId === 'testFtpAnaIndex') $('#ftpStatusAnaText').text(BtkLang.btkreports_pasif).removeClass('status-aktif text-muted').addClass('status-pasif');
                    if (buttonId === 'testFtpYedekIndex') $('#ftpStatusYedekText').text(BtkLang.btkreports_pasif).removeClass('status-aktif text-muted').addClass('status-pasif');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg = (BtkLang.ftp_test_basarisiz || 'FTP bağlantısı başarısız: ') + 'Sunucu ile iletişim kurulamadı. AJAX Hatası: ' + textStatus + ' - ' + errorThrown;
                $resultDiv.removeClass('alert-info alert-success').addClass('alert-danger').html(errorMsg);
                console.error("FTP Test AJAX Hatası:", jqXHR, textStatus, errorThrown);
                if (buttonId === 'testFtpAnaIndex') $('#ftpStatusAnaText').text(BtkLang.btkreports_pasif).removeClass('status-aktif text-muted').addClass('status-pasif');
                if (buttonId === 'testFtpYedekIndex') $('#ftpStatusYedekText').text(BtkLang.btkreports_pasif).removeClass('status-aktif text-muted').addClass('status-pasif');
            },
            complete: function() {
                $button.html('<i class="fas fa-sync-alt"></i>').prop('disabled', false); // Sadece ikon
            }
        });
    }

    // Config sayfasındaki butonlar için
    $('#testFtpAna').data('resultdiv', 'ftpTestResultAna').on('click', function() { performFtpTest('testFtpAna', 'ana'); });
    $('#testFtpYedek').data('resultdiv', 'ftpTestResultYedek').on('click', function() { performFtpTest('testFtpYedek', 'yedek'); });

    // Index sayfasındaki butonlar için
    $('#testFtpAnaIndex').data('resultdiv', 'ftpTestResultAnaIndex').on('click', function() { performFtpTest('testFtpAnaIndex', 'ana'); });
    $('#testFtpYedekIndex').data('resultdiv', 'ftpTestResultYedekIndex').on('click', function() { performFtpTest('testFtpYedekIndex', 'yedek'); });

    // CSRF token'ını global bir değişkende tut (ana sayfada form olmayabilir)
    var btkCsrfToken = $('input[name="token"]').val();
});