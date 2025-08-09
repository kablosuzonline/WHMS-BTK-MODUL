<?php
/**
 * WHMCS BTK Raporlama Modülü - Güvenli Dosya İndirme Yöneticisi
 * Sürüm: 21.0.0 (Operasyon ZÜMRÜT-Ü ANKA)
 *
 * BU DOSYA, PROJENİN GÜVENLİK DUVARIDIR.
 *
 * Amaç: Modül tarafından oluşturulan ve web'den erişilemeyen güvenli bir
 * `temp` klasöründe bulunan rapor dosyalarını (.abn.gz, .xlsx), sadece
 * yetkili ve oturum açmış yöneticilerin indirebilmesini sağlamak.
 *
 * İş Akışı:
 * 1. WHMCS ortamını başlatarak yönetici oturumunu doğrular.
 * 2. CSRF token'ını kontrol ederek isteğin geçerli bir modül sayfasından
 *    geldiğini teyit eder.
 * 3. Dosya adı parametresini alıp, dizin traversal saldırılarını ("../")
 *    önlemek için `basename()` ile temizler.
 * 4. `BtkHelper` aracılığıyla doğru ve dinamik temp klasörü yolunu bulur.
 * 5. Dosyanın varlığını kontrol eder.
 * 6. Varsa, tarayıcıyı indirmeye zorlayacak HTTP başlıklarını gönderir.
 * 7. Dosya içeriğini okur ve tarayıcıya gönderir.
 * 8. İndirme tamamlandıktan sonra geçici dosyayı sunucudan siler.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    21.0.0
 */

// WHMCS ortamını başlat. Bu, veritabanı, oturum ve güvenlik
// fonksiyonlarına erişim sağlar.
require_once __DIR__ . '/../../../init.php';

// Composer autoloader'ını ve gerekli sınıfları dahil et
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/btk_config.php';

use BtkReports\Helper\BtkHelper;

// Güvenlik Adım 1: Yönetici Oturum Kontrolü
// Eğer bir yönetici oturumu yoksa, script'i sofort sonlandır.
if (!isset($_SESSION['adminid']) || !is_numeric($_SESSION['adminid']) || $_SESSION['adminid'] <= 0) {
    header("HTTP/1.1 401 Unauthorized");
    die("Yetkisiz erişim.");
}

// Güvenlik Adım 2: CSRF (Cross-Site Request Forgery) Doğrulaması
// WHMCS'in kendi yerleşik güvenlik mekanizmasını kullanarak, linkin geçerli
// bir WHMCS oturumundan oluşturulduğunu doğrula.
try {
    \WHMCS\Utility\CSRF::verify();
} catch (\Exception $e) {
    header("HTTP/1.1 403 Forbidden");
    die("Geçersiz veya süresi dolmuş güvenlik anahtarı.");
}

// Güvenlik Adım 3: Dosya Adı Parametresini Al ve Temizle
// basename() fonksiyonu, "../" gibi yolları temizleyerek sadece
// dosya adını bırakır. Bu, dizin traversal saldırılarını önler.
$fileName = isset($_GET['file']) ? basename((string) $_GET['file']) : '';

if (empty($fileName)) {
    header("HTTP/1.1 400 Bad Request");
    die("Geçersiz dosya talebi. Dosya adı belirtilmemiş.");
}

// 4. Modülün güvenli temp klasörünün tam yolunu al
try {
    $tempPath = BtkHelper::getModuleTempPath();
} catch (\Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    die("Modülün geçici klasör yolu yapılandırılamadı: " . $e->getMessage());
}

$fullPath = $tempPath . DIRECTORY_SEPARATOR . $fileName;

// 5. Dosyanın varlığını ve okunabilirliğini kontrol et
if (file_exists($fullPath) && is_readable($fullPath)) {
    // 6. Tarayıcıyı indirmeye zorlamak için gerekli HTTP başlıklarını gönder
    header('Content-Description: File Transfer');
    // application/octet-stream, tarayıcıya bunun genel bir ikili dosya olduğunu
    // ve açmak yerine indirmesi gerektiğini söyler.
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $fileName . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($fullPath));
    
    // 7. Dosya içeriğini temizle ve tarayıcıya gönder
    ob_clean();
    flush();
    readfile($fullPath);
    
    // 8. İndirme tamamlandıktan sonra güvenlik ve temizlik için dosyayı sil
    @unlink($fullPath);
    
    // İşlem bitti, script'i sonlandır
    exit;
} else {
    // Dosya bulunamazsa, 404 Hatası gönder
    header("HTTP/1.0 404 Not Found");
    die("İstenen dosya sunucuda bulunamadı veya silinmiş olabilir.");
}