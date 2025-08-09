<?php
/**
 * WHMCS BTK Raporlama Modülü - POP Noktası İzleme Cron Job Dosyası
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - İzleme mantığı, sorumlulukların ayrılması ilkesi gereği, yeni
 *   `BtkReports\Monitor\PopMonitor` sınıfına taşındı.
 * - Hata yönetimi ve loglama, merkezi LogManager ile tam entegre hale getirildi.
 * - Global izleme ayarı kontrolü eklenerek, özellik kapalıyken cron'un
 *   boşuna çalışması engellendi.
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
    error_log("[BTK-Entegre] Monitor Cron CRITICAL ERROR: WHMCS init.php not found at: " . $whmcsInitPath);
    exit(1);
}

// OPERASYON ZAMAN SENKRONİZASYONU
date_default_timezone_set('Europe/Istanbul');

// Modülün ana dosyalarını ve kütüphanelerini yükle
require_once __DIR__ . '/../vendor/autoload.php';

use BtkReports\Helper\BtkHelper;
use BtkReports\Monitor\PopMonitor;
use BtkReports\Manager\PopManager;
use BtkReports\Manager\LogManager;

// 1. Global izleme ayarını kontrol et
$settings = BtkHelper::getAllBtkSettings();
if (empty($settings['pop_monitoring_enabled']) || $settings['pop_monitoring_enabled'] !== '1') {
    // Özellik kapalıysa, hiçbir işlem yapmadan sessizce çık.
    // Loglamaya gerek yok çünkü bu normal bir durum.
    echo "POP Monitoring feature is globally disabled in module settings. Exiting.\n";
    exit(0);
}

LogManager::logAction('POP Monitor Cron Başladı', 'INFO');
echo "BTK POP Monitoring Cron has started...\n";

try {
    // 2. İzleme ayarlarını yapılandır
    $monitorConfig = [
        'timeout_sec' => (int)($settings['pop_monitoring_timeout_sec'] ?? 2),
        'high_latency_threshold_ms' => (int)($settings['pop_monitoring_high_latency_threshold_ms'] ?? 500),
    ];

    // 3. Veritabanından izlenecek tüm aktif POP noktalarını al
    $popsToMonitor = PopManager::getAllActivePopsForMonitoring();

    // 4. İzlenecek POP noktası yoksa, işlemi sonlandır
    if (empty($popsToMonitor)) {
        LogManager::logAction('POP Monitor Cron Tamamlandı', 'INFO', 'İzlenecek aktif POP noktası bulunamadı.');
        echo "No active POP points to monitor found. Exiting.\n";
        exit(0);
    }
    
    $monitoredCount = 0;
    
    // 5. Her bir POP noktası için izleme işlemini başlat
    foreach ($popsToMonitor as $popArray) {
        try {
            // İzleme işini yapan asıl sınıfı (PopMonitor) oluştur
            $monitor = new PopMonitor($popArray, $monitorConfig);
            
            // Kontrolü gerçekleştir
            $result = $monitor->checkStatus();
            
            // Sonucu veritabanına kaydet
            PopManager::updatePopMonitoringResult($popArray['id'], $result);
            
            $monitoredCount++;
            
        } catch (\Exception $singlePopError) {
            // Eğer tek bir POP izlenirken hata olursa, bu hatayı logla
            // ama diğer POP'ları izlemeye devam et.
            LogManager::logAction('Tekil POP İzleme Hatası', 'HATA', "POP ID: {$popArray['id']} izlenirken hata: " . $singlePopError->getMessage());
        }
    }

    LogManager::logAction('POP Monitor Cron Tamamlandı', 'INFO', $monitoredCount . ' adet POP noktası başarıyla izlendi.');
    echo "$monitoredCount POP points were successfully monitored.\n";

} catch (\Exception $e) {
    // Tüm süreçte beklenmedik bir hata olursa logla ve çık
    LogManager::logAction('POP Monitor Cron Genel Hata', 'KRITIK', $e->getMessage());
    echo "A critical error occurred: " . $e->getMessage() . "\n";
    exit(1);
}

// Başarılı çıkış
exit(0);