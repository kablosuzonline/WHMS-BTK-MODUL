<?php
/**
 * WHMCS BTK Raporlama Modülü - Abone REHBER Raporu Cron Job Dosyası
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata yönetimi ve loglama, merkezi LogManager ile tam entegre hale getirildi.
 * - Rapor oluşturma ve gönderme mantığı, BtkRaporFactory ve FtpManager sınıflarına
 *   tamamen delege edilerek kodun kararlılığı ve okunabilirliği artırıldı.
 * - Aktif yetki gruplarını dinamik olarak ConfigManager'dan alarak esneklik sağlandı.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

// --- GÜVENLİK KONTROLÜ ---
// Bu script'in sadece sunucu üzerinden (CLI) çalıştırılmasını zorunlu kıl.
if (php_sapi_name() != 'cli' && php_sapi_name() != 'cgi-fcgi') {
    die("This script can only be run via the command line or a similar SAPI.");
}

// --- WHMCS ORTAMINI BAŞLATMA ---
// BU YOL, SUNUCUNUZDAKİ WHMCS KURULUMUNUN GERÇEK VE TAM YOLU OLMALIDIR.
$whmcsInitPath = '/var/www/vhosts/kablosuzonline.com.tr/httpdocs/wisp/init.php';

if (file_exists($whmcsInitPath)) {
    require_once $whmcsInitPath;
} else {
    // WHMCS bulunamazsa, kritik bir hata logla ve çık.
    error_log("[BTK-Entegre] Rehber Cron CRITICAL ERROR: WHMCS init.php not found at: " . $whmcsInitPath);
    exit(1);
}

// OPERASYON ZAMAN SENKRONİZASYONU
date_default_timezone_set('Europe/Istanbul');

// Modülün ana dosyalarını ve kütüphanelerini yükle
require_once __DIR__ . '/../vendor/autoload.php';

use BtkReports\Helper\BtkHelper;
use BtkReports\Factory\BtkRaporFactory;
use BtkReports\Manager\FtpManager;
use BtkReports\Manager\ConfigManager;
use BtkReports\Manager\LogManager;

LogManager::logAction('Abone Rehber Cron Başladı', 'INFO');
echo "BTK Abone Rehber Cron has started...\n";

try {
    // 1. Gerekli ayarları ve yöneticileri başlat
    $settings = BtkHelper::getAllBtkSettings();
    $ftpManager = new FtpManager($settings);
    $aktifGruplar = ConfigManager::getAktifYetkiTurleri('array_grup_names_only');

    // 2. Raporlanacak aktif bir yetki grubu yoksa, işlemi sonlandır
    if (empty($aktifGruplar)) {
        LogManager::logAction('Abone Rehber Cron Atlandı', 'UYARI', 'Raporlanacak aktif bir yetki grubu bulunamadı.');
        echo "No active authorization groups found to report. Exiting.\n";
        exit(0);
    }
    
    $toplamGonderim = 0;

    // 3. Her aktif yetki grubu için Rehber raporunu oluştur ve gönder
    foreach ($aktifGruplar as $grup) {
        // Personel raporunun kendi cron'u olduğu için bu döngüde atla
        if ($grup === 'PERSONEL') {
            continue;
        }

        echo "Processing REHBER report for group: {$grup}...\n";
        
        // Rapor nesnesini fabrika (factory) aracılığıyla oluştur
        $rapor = BtkRaporFactory::create('REHBER', $settings, $ftpManager, $grup);
        
        // Ana FTP sunucusuna gönderim
        $resultMain = $rapor->olusturVeGonder('main');
        if ($resultMain['status']) {
            $message = $resultMain['skipped'] ?? false ? "Ana FTP'ye gönderim atlandı (veri yok)." : "Ana FTP'ye başarıyla gönderildi.";
            echo " - Main FTP: Success. {$message}\n";
            $toplamGonderim++;
        } else {
            echo " - Main FTP: FAILED. Reason: {$resultMain['message']}\n";
        }
        
        // Yedek FTP sunucusu aktifse, oraya da gönderim
        if (!empty($settings['backup_ftp_enabled']) && $settings['backup_ftp_enabled'] === '1') {
            $resultBackup = $rapor->olusturVeGonder('backup');
            if ($resultBackup['status']) {
                 $message = $resultBackup['skipped'] ?? false ? "Yedek FTP'ye gönderim atlandı (veri yok)." : "Yedek FTP'ye başarıyla gönderildi.";
                 echo " - Backup FTP: Success. {$message}\n";
            } else {
                 echo " - Backup FTP: FAILED. Reason: {$resultBackup['message']}\n";
            }
        }
    }

    LogManager::logAction('Abone Rehber Cron Tamamlandı', 'INFO', $toplamGonderim . ' adet rapor gönderimi denendi.');
    echo "BTK Abone Rehber Cron has finished.\n";
    
} catch (\Exception $e) {
    // Tüm süreçte beklenmedik bir hata olursa logla ve çık
    LogManager::logAction('Abone Rehber Cron Genel Hata', 'KRITIK', $e->getMessage());
    echo "A critical error occurred: " . $e->getMessage() . "\n";
    exit(1);
}

// Başarılı çıkış
exit(0);