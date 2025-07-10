<?php
/**
 * WHMCS BTK Raporlama Modülü - POP Noktası İzleme Cron Job Dosyası
 *
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 * İzlenmesi aktif edilen POP noktalarının canlı durumunu (ping/soket kontrolü) kontrol eder.
 * Bu dosya, ana raporlama cron'undan bağımsız çalışır.
 * Sürüm: 7.2.5 (Operatör - Kritik Hata Düzeltmeleri)
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2.5
 */

// WHMCS'i CLI ortamında başlat
if (php_sapi_name() != 'cli' && php_sapi_name() != 'cgi-fcgi') {
    die("This script can only be run via the command line or a similar SAPI.");
}

// WHMCS Kök dizinini bulmaya çalış
$whmcsRootDir = '';
if (file_exists(__DIR__ . '/../../../../init.php')) {
    $whmcsRootDir = __DIR__ . '/../../../..';
} elseif (file_exists(dirname(dirname(dirname(dirname(__DIR__)))) . '/init.php')) {
    $whmcsRootDir = dirname(dirname(dirname(dirname(__DIR__))));
}

if (!empty($whmcsRootDir) && file_exists($whmcsRootDir . '/init.php')) {
    require_once $whmcsRootDir . '/init.php';
} else {
    // Bu cron opsiyonel olduğu için ana loga yazmak yerine sadece error_log'a yazalım
    error_log("BTK Reports Monitor Cron Error: WHMCS init.php not found. Cron cannot run. Searched relative to: " . __DIR__);
    exit(1);
}

// Composer autoload'u dahil et
require_once __DIR__ . '/vendor/autoload.php';

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;
use BtkReports\Monitor\PopMonitor;

// --- 1. Ana Kontrol: Özellik global olarak aktif mi? ---
$settings = BtkHelper::getAllBtkSettings();
if (empty($settings['pop_monitoring_enabled']) || $settings['pop_monitoring_enabled'] !== '1') {
    echo "POP Monitoring feature is globally disabled in module settings. Exiting.\n";
    exit(0);
}

BtkHelper::logAction('POP Monitor Cron Başladı', 'INFO');
echo "BTK POP Monitoring Cron has started...\n";

try {
    // --- 2. Gerekli Ayarları ve İzlenecek POP'ları Al ---
    $monitorConfig = [
        'timeout_sec' => (float)($settings['pop_monitoring_timeout_sec'] ?? 2), // Saniye cinsinden zaman aşımı
        'high_latency_threshold_ms' => (int)($settings['pop_monitoring_high_latency_threshold_ms'] ?? 500), // Milisaniye
        'general_monitoring_port' => (int)($settings['pop_monitoring_port'] ?? 80), // Genel ayardan izleme portu
    ];

    $popsToMonitor = Capsule::table('mod_btk_iss_pop_noktalari')->where('izleme_aktif', 1)->get()->map(fn($item) => (array)$item)->all();

    if (empty($popsToMonitor)) {
        BtkHelper::logAction('POP Monitor Cron Tamamlandı', 'INFO', 'İzlenecek aktif POP noktası bulunamadı.');
        echo "No active POP points to monitor found. Exiting.\n";
        exit(0);
    }
    
    $monitoredCount = 0;
    // --- 3. Her bir POP noktasını döngüde izle ---
    foreach ($popsToMonitor as $pop) {
        try {
            // Cihaza özel port varsa onu kullan, yoksa genel ayardan gelen portu kullan
            $currentPopMonitorConfig = $monitorConfig;
            $currentPopMonitorConfig['monitoring_port'] = (int)($pop['izleme_portu'] ?? $monitorConfig['general_monitoring_port']);

            $monitor = new PopMonitor($pop, $currentPopMonitorConfig);
            $result = $monitor->checkStatus();
            
            // Veritabanını anlık durumla güncelle
            Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $pop['id'])->update([
                'canli_durum' => $result['status'],
                'son_ping_gecikmesi_ms' => $result['latency'],
                'son_izleme_zamani' => gmdate('Y-m-d H:i:s')
            ]);

            // İzleme geçmişi için log kaydı oluştur
            Capsule::table('mod_btk_pop_monitoring_logs')->insert([
                'pop_id' => $pop['id'],
                'durum' => $result['status'],
                'gecikme_ms' => $result['latency'],
                'detay' => $result['detail'] ?? null
            ]);
            
            $monitoredCount++;

        } catch (\Exception $singlePopError) {
            // Tek bir POP izlenirken hata olursa logla ve devam et
            BtkHelper::logAction('Tekil POP İzleme Hatası', 'HATA', "POP ID: {$pop['id']} izlenirken hata: " . $singlePopError->getMessage());
        }
    }

    BtkHelper::logAction('POP Monitor Cron Tamamlandı', 'INFO', $monitoredCount . ' adet POP noktası başarıyla izlendi.');
    echo "$monitoredCount POP points were successfully monitored.\n";

} catch (\Exception $e) {
    BtkHelper::logAction('POP Monitor Cron Genel Hata', 'KRITIK', $e->getMessage());
    echo "A critical error occurred: " . $e->getMessage() . "\n";
    exit(1);
}

exit(0);