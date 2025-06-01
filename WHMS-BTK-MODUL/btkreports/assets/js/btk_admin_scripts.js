/**
 * WHMCS BTK Raporlama Modülü - Admin Alanı Özel JavaScript Fonksiyonları - V2.0.1 - Beta
 */

$(document).ready(function() {
    // Genel olarak tüm sayfalarda tooltip'leri aktif et
    if (typeof $().tooltip === 'function') {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // Genel olarak tüm sayfalarda DataTable'ları Türkçe ayarlarıyla başlat
    // Not: Bu genel başlatma, her tablonun özel ayarlarını (örn: varsayılan sıralama) ezer.
    // Her TPL dosyasında DataTable'ı ayrı ayrı başlatmak daha fazla kontrol sağlayabilir.
    // if (typeof $().DataTable === 'function') {
    //     $('.datatable:not(#tableBtkLogs):not(#tablePersonelList)').DataTable({ // Özel ID'li tablolar hariç
    //         "language": {
    //             "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json"
    //         },
    //         "pageLength": 25,
    //         "responsive": true
    //     });
    // }

    // Genel olarak tüm sayfalarda datepicker'ları aktif et
    if (typeof $().datepicker === 'function') {
        $('.date-picker').datepicker({ 
            dateFormat: 'dd.mm.yy', 
            changeMonth: true, 
            changeYear: true, 
            yearRange: "-100:+5" // Geniş bir aralık
        });
    }

    // Sekmeli sayfalarda (config, service details) son aktif sekmeyi hatırla ve yükle
    // Bu genel bir yaklaşımdır, her TPL kendi özel sekme ID'sini kullanmalıdır.
    // Örneğin, config sayfası için:
    if ($('#btkConfigTabs').length) {
        $('#btkConfigTabs a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
          $('#current_tab_input').val($(this).attr('href').substring(1)); // config.tpl'deki hidden input
          localStorage.setItem('btk_last_config_tab', $(this).attr('href').substring(1));
        });
        var lastConfigTab = localStorage.getItem('btk_last_config_tab');
        if (lastConfigTab && $('#btkConfigTabs a[href="#' + lastConfigTab + '"]').length) {
          $('#btkConfigTabs a[href="#' + lastConfigTab + '"]').tab('show');
          $('#current_tab_input').val(lastConfigTab);
        } else {
             var currentUrlTab = window.location.hash;
             if(currentUrlTab && $('#btkConfigTabs a[href="' + currentUrlTab + '"]').length){
                  $('#btkConfigTabs a[href="' + currentUrlTab + '"]').tab('show');
                  $('#current_tab_input').val(currentUrlTab.substring(1));
             }
        }
    }
    // Hizmet detayları sayfası için benzer bir mantık TPL içinde zaten mevcut.
});


/**
 * Tarihi GG.AA.YYYY formatından YYYYMMDD formatına çevirir.
 * @param {string} displayDate GG.AA.YYYY formatında tarih.
 * @returns {string} YYYYMMDD formatında tarih veya boş string.
 */
function btkFormatDateToDb(displayDate) {
    if (displayDate && typeof displayDate === 'string' && displayDate.length === 10 && displayDate.includes('.')) {
        var parts = displayDate.split('.');
        if (parts.length === 3 && parts[2].length === 4 && parts[1].length === 2 && parts[0].length === 2) {
            return parts[2] + parts[1] + parts[0];
        }
    }
    return '';
}

/**
 * Tarihi YYYYMMDD formatından GG.AA.YYYY formatına çevirir.
 * @param {string} dbDate YYYYMMDD formatında tarih.
 * @returns {string} GG.AA.YYYY formatında tarih veya boş string.
 */
function btkFormatDateFromDb(dbDate) {
    if (dbDate && typeof dbDate === 'string' && dbDate.length === 8 && /^\d{8}$/.test(dbDate)) {
        var year = dbDate.substring(0, 4);
        var month = dbDate.substring(4, 6);
        var day = dbDate.substring(6, 8);
        return day + '.' + month + '.' + year;
    }
    return '';
}


/**
 * Belirli bir il için ilçeleri AJAX ile yükler ve select kutusunu doldurur.
 * @param {string} ilAdi Seçilen ilin adı.
 * @param {jQuery} ilceSelectElement Doldurulacak ilçe select jQuery nesnesi.
 * @param {string|null} selectedIlce Önceden seçili olması istenen ilçe adı.
 * @param {string} moduleLink Modül linki (AJAX çağrısı için).
 * @param {string} csrfToken CSRF token.
 * @param {object} lang Dil değişkenleri (pleaseselectone, loading vb.).
 */
function btkLoadIlceler(ilAdi, ilceSelectElement, selectedIlce, moduleLink, csrfToken, lang) {
    lang = lang || {}; // Dil değişkenleri yoksa boş obje ata
    var langPleaseSelectOne = lang.pleaseselectone || "Lütfen Seçiniz...";
    var langLoading = lang.loading || "Yükleniyor...";
    var langNoResults = lang.noresultsfound || "Sonuç bulunamadı";
    var langError = lang.error || "Hata!";
    var langPleaseSelectIl = lang.pleaseselectilfirst || "Önce İl Seçin";

    ilceSelectElement.empty().append($('<option>', { value: '', text: langLoading }));
    if (ilAdi) {
        $.ajax({
            url: moduleLink + '&action=get_ilceler', 
            type: 'POST',
            dataType: 'json',
            data: { il_adi: ilAdi, token: csrfToken },
            success: function(data) {
                ilceSelectElement.empty().append($('<option>', { value: '', text: langPleaseSelectOne }));
                if (data && data.status === 'success' && data.ilceler && data.ilceler.length > 0) {
                    $.each(data.ilceler, function(idx, ilce) {
                        ilceSelectElement.append($('<option>', {
                            value: ilce.ilce_adi, 
                            text: ilce.ilce_adi,
                            selected: (ilce.ilce_adi == selectedIlce)
                        }));
                    });
                    if (selectedIlce) ilceSelectElement.val(selectedIlce);
                } else {
                     ilceSelectElement.append($('<option>', { value: '', text: langNoResults}));
                }
            },
            error: function() {
                ilceSelectElement.empty().append($('<option>', { value: '', text: langError}));
            }
        });
    } else {
        ilceSelectElement.empty().append($('<option>', { value: '', text: langPleaseSelectIl}));
    }
}

/**
 * Genel NVI Doğrulama AJAX çağrısı.
 * @param {object} params NVI servisine gönderilecek parametreler (type, id_no, ad, soyad, dogum_input, token, clientId, serviceId, isPersonelCheck vb.)
 * @param {string} moduleLink Modül linki.
 * @param {jQuery} resultDiv Sonucun gösterileceği div jQuery nesnesi.
 * @param {jQuery} [hiddenStatusField] Doğrulama durumunun (0/1) yazılacağı hidden input jQuery nesnesi.
 * @param {jQuery} [hiddenTimestampField] Doğrulama zaman damgasının yazılacağı hidden input jQuery nesnesi.
 * @param {jQuery} [nviResultContainer] Genel NVI mesajlarının gösterileceği ana konteyner.
 * @param {function} [callback] AJAX tamamlandığında çağrılacak fonksiyon.
 */
function btkPerformNviAjaxVerification(params, moduleLink, resultDiv, hiddenStatusField, hiddenTimestampField, nviResultContainer, callback) {
    resultDiv.html('<span class="label label-info btk-nvi-status-label">Doğrulanıyor...</span>');
    if(nviResultContainer) nviResultContainer.hide().removeClass('alert-success alert-danger alert-warning');

    $.ajax({
        url: moduleLink + '&action=nvi_dogrula',
        type: 'POST',
        dataType: 'json',
        data: params,
        success: function(data) {
            var timestamp = new Date();
            var formattedTimestamp = timestamp.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            var dbTimestamp = timestamp.toISOString().slice(0, 19).replace('T', ' ');

            var messageToShow = data.message || 'Bilinmeyen bir NVI yanıtı alındı.';
            if (data && data.status === 'success') {
                if(hiddenStatusField) hiddenStatusField.val(data.isValid ? '1' : '0');
                if(hiddenTimestampField) hiddenTimestampField.val(dbTimestamp);

                if (data.isValid) {
                    resultDiv.html('<span class="label label-success btk-nvi-status-label"><i class="fas fa-check-circle"></i> NVI Doğrulandı (' + formattedTimestamp + ')</span>');
                    if(nviResultContainer) nviResultContainer.removeClass('alert-danger alert-warning').addClass('alert-success').html(messageToShow).show();
                } else {
                    resultDiv.html('<span class="label label-danger btk-nvi-status-label"><i class="fas fa-times-circle"></i> NVI Başarısız (' + formattedTimestamp + ')</span><br><small>' + messageToShow + '</small>');
                     if(nviResultContainer) nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(messageToShow).show();
                }
            } else {
                resultDiv.html('<span class="label label-danger btk-nvi-status-label">Doğrulama sırasında hata: ' + messageToShow + '</span>');
                if(nviResultContainer) nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(messageToShow).show();
                if(hiddenStatusField) hiddenStatusField.val('0');
            }
            if(typeof callback === 'function') callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) { 
            var errorMsg = 'NVI Doğrulama servisine ulaşılamadı veya sunucu hatası oluştu.';
            if(jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message){
                errorMsg = jqXHR.responseJSON.message;
            } else if (jqXHR && jqXHR.responseText){
                try {
                    var errData = JSON.parse(jqXHR.responseText);
                    if(errData && errData.message) errorMsg = errData.message;
                } catch (e){}
            }
            resultDiv.html('<span class="label label-danger btk-nvi-status-label">' + errorMsg + '</span>'); 
            if(nviResultContainer) nviResultContainer.removeClass('alert-success alert-warning').addClass('alert-danger').html(errorMsg).show();
            if(hiddenStatusField) hiddenStatusField.val('0'); 
            if(typeof callback === 'function') callback({ status: 'error', isValid: false, message: errorMsg });
        }
    });
}