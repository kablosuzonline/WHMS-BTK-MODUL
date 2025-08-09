<?php
/**
 * WHMCS BTK Raporlama Modülü - Personel Raporu Cron Job Dosyası
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata yönetimi ve loglama, merkezi LogManager ile tam entegre hale getirildi.
 * - Rapor oluşturma ve gönderme mantığı, BtkRaporFactory ve FtpManager sınıflarına
 *   tamamen delege edilerek kodun kararlılığı ve okunabilirliği artırıldı.
 * - Cron başlamadan önce, WHMCS yönetici listesi ile BTK personel tablosu
 *   arasında tam senkronizasyon sağlanır.
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
    error_log("[BTK-Entegre] Personel Cron CRITICAL ERROR: WHMCS init.php not found at: " . $whmcsInitPath);
    exit(1);
}

// OPERASYON ZAMAN SENKRONİZASYONU
date_default_timezone_set('Europe/Istanbul');

// Modülün ana dosyalarını ve kütüphanelerini yükle
require_once __DIR__ . '/../vendor/autoload.php';

use BtkReports\Helper\BtkHelper;
use BtkReports\Factory\BtkRaporFactory;
use BtkReports\Manager\FtpManager;
use BtkReports\Manager\PersonelManager;
use BtkReports\Manager\LogManager;

LogManager::logAction('Personel Raporu Cron Başladı', 'INFO');
echo "BTK Personel Raporu Cron has started...\n";

try {
    // 1. Raporu oluşturmadan önce, WHMCS yöneticileri ile personel listesini senkronize et.
    // Bu işlem, yeni eklenen yöneticileri BTK personel tablosuna ekler ve
    // silinen/pasif edilen yöneticileri "işten ayrıldı" olarak işaretler.
    PersonelManager::syncAllAdminsToPersonel();
    echo "WHMCS admins have been synchronized with the BTK personel table.\n";

    // 2. Gerekli ayarları ve yöneticileri başlat
    $settings = BtkHelper::getAllBtkSettings();
    $ftpManager = new FtpManager($settings);
    
    echo "Processing PERSONEL report...\n";
    
    // 3. Rapor nesnesini fabrika (factory) aracılığıyla oluştur
    // Personel raporu bir gruba bağlı olmadığı için 'yetkiTuruGrup' null gönderilir.
    $rapor = BtkRaporFactory::create('PERSONEL', $settings, $ftpManager);
    
    // 4. Ana FTP sunucusuna gönderim
    $resultMain = $rapor->olusturVeGonder('main');
    if ($resultMain['status']) {
        $message = $resultMain['skipped'] ?? false ? "Ana FTP'ye gönderim atlandı (veri yok)." : "Ana FTP'ye başarıyla gönderildi.";
        echo " - Main FTP: Success. {$message}\n";
    } else {
        echo " - Main FTP: FAILED. Reason: {$resultMain['message']}\n";
    }
    
    // 5. Yedek FTP sunucusu aktifse, oraya da gönderim
    if (!empty($settings['backup_ftp_enabled']) && $settings['backup_ftp_enabled'] === '1') {
        $resultBackup = $rapor->olusturVeGonder('backup');
        if ($resultBackup['status']) {
             $message = $resultBackup['skipped'] ?? false ? "Yedek FTP'ye gönderim atlandı (veri yok)." : "Yedek FTP'ye başarıyla gönderildi.";
             echo " - Backup FTP: Success. {$message}\n";
        } else {
             echo " - Backup FTP: FAILED. Reason: {$resultBackup['message']}\n";
        }
    }

    LogManager::logAction('Personel Raporu Cron Tamamlandı', 'INFO', 'Rapor gönderimi denendi.');
    echo "BTK Personel Raporu Cron has finished.\n";
    
} catch (\Exception $e) {
    // Tüm süreçte beklenmedik bir hata olursa logla ve çık
    LogManager::logAction('Personel Raporu Cron Genel Hata', 'KRITIK', $e->getMessage());
    echo "A critical error occurred: " . $e->getMessage() . "\n";
    exit(1);
}

// Başarılı çıkış
exit(0);