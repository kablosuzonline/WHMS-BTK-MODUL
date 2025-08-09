/**
 * WHMCS BTK Raporlama Modülü - Ortak Yönetici Paneli Script Dosyası
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Silme işlemleri için standartlaştırılmış bir onay mekanizması eklendi.
 *   Bu, her .tpl dosyasına ayrı ayrı `confirm()` yazma ihtiyacını ortadan kaldırır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

// Bu dosya, tüm modül yönetici sayfalarında çalışacak olan ve
// Smarty değişkenlerine ihtiyaç duymayan genel JavaScript fonksiyonlarını içerir.
// Onay diyalogları gibi tekrar eden işlemler burada merkezileştirilmiştir.

$(document).ready(function() {
    /**
     * Silme onayı gerektiren tüm linkler ve butonlar için genel bir onay mekanizması.
     * Bu mekanizmayı kullanmak için, silme butonuna/linkine `btn-delete-confirm`
     * class'ını ve opsiyonel olarak `data-message` attribute'unu eklemek yeterlidir.
     *
     * Örnek Kullanım:
     * <a href="..." class="btn btn-danger btn-delete-confirm"
     *    data-message="Bu özel kaydı silmek istediğinizden emin misiniz?">Sil</a>
     */
    $(document).on('click', '.btn-delete-confirm', function(e) {
        // Butonun `data-message` attribute'undan özel mesajı al.
        // Eğer özel mesaj yoksa, standart bir mesaj kullan.
        var message = $(this).data('message') || 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
        
        // Kullanıcıya onay penceresini göster.
        if (!confirm(message)) {
            // Eğer kullanıcı "İptal" derse, linkin/butonun varsayılan
            // eylemini (örneğin, linke gitmek) engelle.
            e.preventDefault();
        }
    });
});