<?php
/**
 * WHMCS BTK Raporları Modülü - Ana Cron Job Script'i
 *
 * Bu script, sunucu cron'u ile düzenli aralıklarla (örn: saatte bir) çalıştırılmalıdır.
 * Modülün otomatik rapor oluşturma, gönderme ve bakım işlemlerini tetikler.
 *
 * Örnek Cron Komutu (sunucunuzun PHP CLI yoluna göre düzenleyin):
 * /usr/bin/php -q /path/to/your/whmcs/modules/addons/btkreports/cron/btkreports_cron.php
 * veya
 * php -q /path/to/your/whmcs/modules/addons/btkreports/cron/btkreports_cron.php
 */

// Script'in ne kadar süre çalışabileceğini ayarla (0 = sınırsız)
@set_time_limit(0);
// Kullanıcı bağlantıyı kesse bile script'in çalışmaya devam etmesini sağla
@ignore_user_abort(true);

// WHMCS Kök Dizinini Belirle
// Bu cron dosyası modules/addons/btkreports/cron/ altında olduğu için 4 seviye yukarı çıkıyoruz.
$whmcsRootDir = dirname(__DIR__, 4);

// WHMCS init.php dosyasını yükle
if (file_exists($whmcsRootDir . '/init.php')) {
    require_once $whmcsRootDir . '/init.php';
} else {
    // init.php bulunamazsa, loglamaya çalış ve çık
    $initErrorMsg = "KRİTİK HATA: WHMCS init.php dosyası bulunamadı. Beklenen yol: {$whmcsRootDir}/init.php. BTK Cron sonlandırılıyor.\n";
    if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) {
        \WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper::logActivity($initErrorMsg, 0, 'CRITICAL');
    } else {
        // Helper da yüklenememiş olabilir, basit bir echo yap
        echo $initErrorMsg;
        // Belki bir dosyaya log atmayı deneyebiliriz
        $logDir = dirname(__DIR__) . '/temp_reports/'; // Modülün temp klasörü
        if (is_dir($logDir) && is_writable($logDir)) {
            file_put_contents($logDir . 'btk_cron_critical_error.log', date('Y-m-d H:i:s') . ' - ' . $initErrorMsg, FILE_APPEND);
        }
    }
    exit(1); // Hata koduyla çık
}

// Gerekli Sınıfları Yükle (Composer autoload veya manuel)
// Composer autoload zaten init.php içinde veya CronJobService içinde çağrılmış olmalı.
// Eğer CronJobService içinde autoload çağrılmıyorsa, burada çağırmak daha güvenli olur.
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
}

// BtkHelper sınıfının varlığını kontrol et (autoload sonrası)
if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) {
    $helperErrorMsg = "KRİTİK HATA: BtkHelper sınıfı yüklenemedi. BTK Cron sonlandırılıyor.\n";
    echo $helperErrorMsg;
    // WHMCS loguna yazmayı deneyebiliriz (eğer logActivity fonksiyonu varsa)
    if (function_exists('logActivity')) { // WHMCS global logActivity
        logActivity("BTK Raporları Modülü - Cron: " . $helperErrorMsg, 0);
    }
    exit(1);
}

// CronJobService sınıfının varlığını kontrol et
if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\CronJobService')) {
    $serviceErrorMsg = "KRİTİK HATA: CronJobService sınıfı yüklenemedi. BTK Cron sonlandırılıyor.\n";
    \WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper::logActivity($serviceErrorMsg, 0, 'CRITICAL');
    echo $serviceErrorMsg;
    exit(1);
}

use WHMCS\Module\Addon\BtkRaporlari\Services\CronJobService;
use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper; // Tekrar use etmeye gerek yok ama zararı da olmaz.

// Lock File Mekanizması
$lockFilePath = BtkHelper::getTempReportsDir();
if ($lockFilePath === false) {
    BtkHelper::logActivity("BTK Cron Script: Geçici klasör oluşturulamadığı için lock dosyası ayarlanamadı. Cron sonlandırılıyor.", 0, 'CRITICAL');
    echo "HATA: Geçici klasör hatası.\n";
    exit(1);
}
$lockFilePath .= 'btk_main_cron.lock'; // CronJobService'deki lock'tan farklı bir isim olabilir veya aynı.

if (file_exists($lockFilePath)) {
    $lockFileTime = filemtime($lockFilePath);
    if (time() - $lockFileTime > 7200) { // 2 saatten eskiyse (başka bir cron takılı kalmış olabilir)
        BtkHelper::logActivity("BTK Cron Script: Eski ana cron lock dosyası bulundu ve silindi ({$lockFilePath}).", 0, 'WARNING');
        @unlink($lockFilePath);
    } else {
        BtkHelper::logActivity("BTK Cron Script: Başka bir ana cron işlemi zaten çalışıyor (lock dosyası mevcut: {$lockFilePath}). Cron sonlandırılıyor.", 0, 'INFO');
        echo "Başka bir ana cron işlemi zaten çalışıyor.\n";
        exit(0); // Hata değil, normal bir durum.
    }
}

if (file_put_contents($lockFilePath, date('Y-m-d H:i:s')) === false) {
    BtkHelper::logActivity("BTK Cron Script: Ana cron lock dosyası oluşturulamadı ({$lockFilePath}). İzinleri kontrol edin. Cron sonlandırılıyor.", 0, 'CRITICAL');
    echo "HATA: Lock dosyası oluşturulamadı.\n";
    exit(1);
}

// Hata durumunda veya script sonunda lock dosyasını silmek için
register_shutdown_function(function() use ($lockFilePath) {
    if (file_exists($lockFilePath)) {
        @unlink($lockFilePath);
    }
    // CronJobService kendi içinde zaten "Cron Job sonlandırıldı" logu atıyor.
});

// Ana Cron Görevlerini Çalıştır
try {
    echo "BTK Raporları Modülü Cron başlatılıyor...\n";
    CronJobService::runAllTasks();
    echo "BTK Raporları Modülü Cron başarıyla tamamlandı.\n";
    // CronJobService içindeki loglar zaten detayları verecektir.
} catch (\Exception $e) {
    $cronErrorMsg = "BTK Cron Script: runAllTasks sırasında beklenmedik bir hata oluştu: " . $e->getMessage();
    BtkHelper::logActivity($cronErrorMsg, 0, 'CRITICAL', ['exception' => (string)$e, 'trace' => $e->getTraceAsString()]);
    echo "HATA: Cron çalıştırılırken kritik bir hata oluştu. Detaylar modül loglarında.\n";
    // Lock dosyası shutdown fonksiyonu ile silinecek.
    exit(1); // Hata koduyla çık
}

exit(0); // Başarılı çıkış
?>