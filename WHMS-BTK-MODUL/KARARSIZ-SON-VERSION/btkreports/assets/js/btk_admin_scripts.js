/**
 * WHMCS BTK Raporlama Modülü - Özel JavaScript Fonksiyonları
 * Version: 6.0.3 (Tasarım ve TPL değişikliklerine uyumlu v2)
 */

jQuery(document).ready(function($) {

    // Global değişkenlerin varlığını kontrol et (TPL dosyasında tanımlanmalı)
    var MODULE_LINK = (typeof btkModuleLink !== 'undefined') ? btkModuleLink : './addonmodules.php?module=btkreports';
    var CSRF_TOKEN = (typeof btkCsrfToken !== 'undefined') ? btkCsrfToken : $('input[name="token"]').first().val();

    var LANG_STR = {
        test_ediliyor: (typeof BtkLang !== 'undefined' && BtkLang.test_ediliyor) ? BtkLang.test_ediliyor : 'Test ediliyor...',
        lutfen_bekleyin: (typeof BtkLang !== 'undefined' && BtkLang.lutfen_bekleyin) ? BtkLang.lutfen_bekleyin : 'Lütfen bekleyin...',
        ftp_test_basarili: (typeof BtkLang !== 'undefined' && BtkLang.ftp_test_basarili) ? BtkLang.ftp_test_basarili : 'FTP bağlantısı başarılı!',
        ftp_test_basarisiz: (typeof BtkLang !== 'undefined' && BtkLang.ftp_test_basarisiz) ? BtkLang.ftp_test_basarisiz : 'FTP bağlantısı başarısız: ',
        aktif: (typeof BtkLang !== 'undefined' && BtkLang.btkreports_aktif) ? BtkLang.btkreports_aktif : 'Aktif',
        pasif: (typeof BtkLang !== 'undefined' && BtkLang.btkreports_pasif) ? BtkLang.btkreports_pasif : 'Pasif',
        initial_data_loading: (typeof BtkLang !== 'undefined' && BtkLang.btk_initial_data_loading) ? BtkLang.btk_initial_data_loading : 'Başlangıç verileri yükleniyor...',
        initial_data_error_generic: (typeof BtkLang !== 'undefined' && BtkLang.btk_initial_data_error_generic) ? BtkLang.btk_initial_data_error_generic : 'Veri yüklenirken bir hata oluştu.'
    };

    // Sekme linklerine tıklama olayını yönet (WHMCS Admin sekmeleri için genel)
    // Bu, Bootstrap tab'larının zaten yaptığı bir işlevsellik, ancak
    // URL'den action parametresini alıp doğru sekmeyi aktif etmek için faydalı olabilir.
    var currentUrlAction = new URLSearchParams(window.location.search).get('action');
    if (!currentUrlAction) { // Eğer action yoksa (modüle ilk giriş), dashboard'u aktif et
        currentUrlAction = 'dashboard';
    }
    $('#btkModuleTabs a[data-action="' + currentUrlAction + '"]').tab('show'); // Bootstrap'in tab gösterme fonksiyonu

    // Sekme linklerine tıklandığında doğru sayfaya yönlendir (eğer data-toggle="tab" ile çözülmüyorsa)
    $('#btkModuleTabs a[data-action]').on('click', function(e) {
        var $this = $(this);
        var action = $this.data('action');
        var targetHref = $this.attr('href'); // href="#config_content_tab" veya href="modulelink&action=..." olabilir

        if (targetHref && !targetHref.startsWith('#')) { // Eğer bir linkse
            e.preventDefault();
            if (window.location.href !== targetHref) { // Zaten o sayfada değilsek
                window.location.href = targetHref;
            }
        }
        // Eğer href="#..." ise Bootstrap zaten sekmeyi değiştirecektir.
    });


    // Yedek FTP alanlarını göster/gizle (config.tpl için)
    var $yedekFtpToggleInput = $('#ftp_yedek_aktif_toggle'); // Bu config.tpl'deki checkbox'ın input ID'si
    var $yedekFtpFieldsContainer = $('.btk-yedek-ftp-fields');  // TPL'deki sarmalayıcı div'in sınıfı

    function toggleYedekFtpFields() {
        if ($yedekFtpToggleInput.is(':checked')) {
            $yedekFtpFieldsContainer.removeClass('btk-hidden').slideDown('fast');
        } else {
            $yedekFtpFieldsContainer.slideUp('fast', function() { $(this).addClass('btk-hidden'); });
        }
    }

    if ($yedekFtpToggleInput.length) { // Element varsa çalıştır
        toggleYedekFtpFields(); // Sayfa yüklendiğinde durumu ayarla
        $yedekFtpToggleInput.on('change', toggleYedekFtpFields); // Değişiklikte durumu ayarla
    }


    // FTP Bağlantı Testi Fonksiyonu
    function performFtpTest(buttonId, ftpType) {
        var $button = $('#' + buttonId);
        var $resultDiv = $('#' + $button.data('resultdiv')); // config.tpl'de data-resultdiv tanımlı olmalı
        var originalButtonHtml = $button.html();

        $button.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
        $resultDiv.removeClass('alert-success alert-danger alert-info').addClass('alert-info').html(LANG_STR.lutfen_bekleyin).show();

        var formData = {
            'action': 'ftp_test',
            'token': CSRF_TOKEN,
            'ftp_type': ftpType
        };

        // Parametreleri o anki formdan (config.tpl için) veya global JS değişkeninden (index.tpl için) al
        if (buttonId.indexOf('Index') !== -1 && typeof btkConfigDataForIndexTest !== 'undefined') { // Ana sayfa testi
            var configSource = (ftpType === 'ana') ? btkConfigDataForIndexTest.ana : btkConfigDataForIndexTest.yedek;
            formData.ftp_host = configSource.host;
            formData.ftp_port = configSource.port;
            formData.ftp_username = configSource.username;
            // Şifre btkConfigDataForIndexTest'ten gelmeyecek, PHP tarafı DB'den çözecek
            // Biz test isteğinde şifreyi boş göndeririz, PHP tarafı bunu anlar ve DB'dekini kullanır
            formData.ftp_password = ''; // Önemli: Ana sayfadan test için şifreyi boş gönder
            formData.ftp_use_ssl = configSource.use_ssl;         // Zaten 'true'/'false' string
            formData.ftp_passive_mode = configSource.passive_mode; // Zaten 'true'/'false' string
        } else { // Config sayfası testi, formdaki anlık değerleri kullan
            var formPrefix = (ftpType === 'ana') ? '' : '_yedek';
            formData.ftp_host = $('#ftp_host' + formPrefix).val();
            formData.ftp_port = $('#ftp_port' + formPrefix).val();
            formData.ftp_username = $('#ftp_username' + formPrefix).val();
            formData.ftp_password = $('#ftp_password' + formPrefix).val(); // Config sayfasında kullanıcı yeni şifre girebilir
            formData.ftp_use_ssl = $('#ftp_use_ssl' + formPrefix + '_toggle').is(':checked').toString();
            formData.ftp_passive_mode = $('#ftp_passive_mode' + formPrefix + '_toggle').is(':checked').toString();
        }

        $.ajax({
            url: MODULE_LINK,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                var messageText = '';
                var statusClass = 'alert-info';

                if (response && response.status) {
                    if (response.status === 'success') {
                        messageText = LANG_STR.ftp_test_basarili + (response.message ? ' ' + response.message : '');
                        statusClass = 'alert-success';
                        if (buttonId.indexOf('Index') !== -1) {
                            $('#ftpStatus' + (ftpType.charAt(0).toUpperCase() + ftpType.slice(1)) + 'Text')
                                .html('<i class="fas fa-check-circle"></i> ' + LANG_STR.aktif)
                                .removeClass('text-danger text-muted status-pasif status-pending')
                                .addClass('text-success status-aktif');
                        }
                    } else { // error veya info
                        messageText = LANG_STR.ftp_test_basarisiz + (response.message ? response.message : 'Bilinmeyen bir hata.');
                        statusClass = 'alert-danger';
                         if (buttonId.indexOf('Index') !== -1) {
                             $('#ftpStatus' + (ftpType.charAt(0).toUpperCase() + ftpType.slice(1)) + 'Text')
                                .html('<i class="fas fa-times-circle"></i> ' + LANG_STR.pasif)
                                .removeClass('text-success text-muted status-aktif status-pending')
                                .addClass('text-danger status-pasif');
                        }
                    }
                } else {
                    messageText = LANG_STR.ftp_test_basarisiz + 'Beklenmedik bir sunucu yanıtı alındı.';
                    statusClass = 'alert-danger';
                }
                $resultDiv.removeClass('alert-success alert-danger alert-info').addClass(statusClass).html(messageText).show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var errorMsg = LANG_STR.ftp_test_basarisiz + 'Sunucu ile iletişim kurulamadı. Hata: ' + textStatus + (errorThrown ? ' - ' + errorThrown : '');
                $resultDiv.removeClass('alert-success alert-danger alert-info').addClass('alert-danger').html(errorMsg).show();
                console.error("FTP Test AJAX Hatası:", formData, jqXHR.responseText); // Hataları konsola yazdır
                if (buttonId.indexOf('Index') !== -1) {
                     $('#ftpStatus' + (ftpType.charAt(0).toUpperCase() + ftpType.slice(1)) + 'Text')
                        .html('<i class="fas fa-exclamation-triangle"></i> ' + LANG_STR.pasif)
                        .removeClass('text-success text-muted status-aktif status-pending')
                        .addClass('text-danger status-pasif');
                }
            },
            complete: function() {
                $button.html(originalButtonHtml).prop('disabled', false);
            }
        });
    }

    // FTP Test Butonlarına event listener ata (Hem config hem de index sayfasındaki butonlar için)
    $(document).on('click', 'button[id^="testFtp"]', function() {
        var $button = $(this);
        var buttonId = $button.attr('id');
        var ftpType = (buttonId.indexOf('Ana') !== -1) ? 'ana' : 'yedek';
        performFtpTest(buttonId, ftpType);
    });


    // Başlangıç Verilerini Yükle Butonu (index.tpl için)
    $('#loadInitialDataBtn').on('click', function() {
        var $button = $(this);
        var $statusDiv = $('#initialDataStatus');
        var originalButtonHtml = $button.html();

        $button.html('<i class="fas fa-spinner fa-spin"></i> ' + LANG_STR.initial_data_loading).prop('disabled', true);
        $statusDiv.removeClass('text-success text-danger').html(LANG_STR.lutfen_bekleyin);

        $.ajax({
            url: MODULE_LINK,
            type: 'POST',
            data: {
                action: 'setup_initial_data_action',
                token: CSRF_TOKEN
            },
            dataType: 'json',
            success: function(response) {
                if (response && response.status === 'success') {
                    $statusDiv.addClass('text-success').text(response.message_display || LANG_STR.initial_data_error_generic); // message_display'i kullan
                    $button.fadeOut('slow', function() { $(this).closest('.btk-warning-section').slideUp('slow', function(){$(this).remove();}); });
                    // Sayfayı yenilemek yerine bir başarı mesajı göster
                    var successAlert = '<div class="alert alert-success text-center global-success-msg" role="alert" style="margin: 15px 0;"><i class="fas fa-check-circle"></i> ' + (response.message_display || LANG_STR.initial_data_error_generic) + '</div>';
                    $('.btk-dashboard-row').first().before(successAlert); // İlk widget satırının üstüne ekle
                    setTimeout(function() { $('.global-success-msg').fadeOut('slow', function(){ $(this).remove(); }); }, 7000);


                } else {
                    var errorMsg = (response && response.message_display) ? response.message_display : LANG_STR.initial_data_error_generic;
                    $statusDiv.addClass('text-danger').text(errorMsg);
                    $button.html(originalButtonHtml).prop('disabled', false);
                }
            },
            error: function(jqXHR) {
                $statusDiv.addClass('text-danger').text(LANG_STR.initial_data_error_generic + ' (Sunucu Hatası)');
                console.error("Initial Data Load AJAX Hatası:", jqXHR.responseText);
                $button.html(originalButtonHtml).prop('disabled', false);
            }
        });
    });

    // Tooltip'leri etkinleştir (Bootstrap tooltip)
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body', // Pozisyonlama sorunlarını önlemek için
            html: true // Eğer title içinde HTML varsa
        });
    }
});