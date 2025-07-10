<?php
/**
 * WHMCS BTK Raporlama Modülü - Raporlama Cron Job Dosyası
 *
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 * ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını oluşturur ve FTP'ye yükler.
 * Sürüm: 7.2 (Operatör) - Modern, nesne yönelimli ve fabrikasyon tabanlı yapı.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2
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
    error_log("BTK Reports Cron Error: WHMCS init.php not found. Cron cannot run. Searched relative to: " . __DIR__);
    exit(1);
}

// Composer autoload'u dahil et
require_once __DIR__ . '/vendor/autoload.php';

use BtkReports\Factory\BtkRaporFactory;
use BtkReports\Manager\FtpManager;
use BtkReports\Helper\BtkHelper;
use Cron\CronExpression;

BtkHelper::logAction('BTK Raporlama Cron v7.2 Başladı', 'INFO');
echo "BTK Reporting Cron v7.2 has started...\n";

try {
    // --- 1. Hazırlık Aşaması: Ayarları ve Yöneticileri Yükle ---
    $settings = BtkHelper::getAllBtkSettings();
    if (empty($settings['operator_code']) || empty($settings['operator_name'])) {
        throw new \Exception('Operatör Kodu veya Adı ayarlanmamış. Cron işlemi durduruldu.');
    }
    
    $ftpManager = new FtpManager($settings);
    $now = new \DateTime('now', new \DateTimeZone('UTC'));

    // --- 2. Görevleri Tanımla ve Zaman Kontrolü Yap ---
    $cronTasks = [
        'REHBER' => $settings['rehber_cron_schedule'] ?? '0 10 1 * *',
        'HAREKET' => $settings['hareket_cron_schedule'] ?? '0 1 * * *',
        'PERSONEL' => $settings['personel_cron_schedule'] ?? '0 16 L 6,12 *',
    ];

    $aktifYetkiGruplari = BtkHelper::getAktifYetkiTurleri('array_grup_names_only');

    // --- 3. REHBER ve HAREKET Raporları (Yetki Grubu Bazında) ---
    foreach (['REHBER', 'HAREKET'] as $raporTuru) {
        $schedule = $cronTasks[$raporTuru];
        if (!CronExpression::isValidExpression($schedule) || !CronExpression::factory($schedule)->isDue($now)) {
            echo "{$raporTuru} report time has not come yet. Skipping...\n";
            continue;
        }

        BtkHelper::logAction("{$raporTuru} Cron Tetiklendi", 'INFO');

        if ($raporTuru === 'HAREKET') {
            BtkHelper::archiveOldHareketler();
        }

        if (empty($aktifYetkiGruplari)) {
            BtkHelper::logAction("{$raporTuru} Cron Atlandı", 'UYARI', 'Raporlanacak aktif yetki grubu bulunmuyor.');
            continue;
        }

        foreach ($aktifYetkiGruplari as $grup) {
            try {
                BtkHelper::logAction("{$raporTuru} Raporu Oluşturuluyor", 'INFO', "Yetki Grubu: {$grup}");
                
                // Fabrika ile doğru rapor nesnesini oluştur
                $rapor = BtkRaporFactory::create($raporTuru, $settings, $ftpManager, $grup);
                
                // Raporu oluştur ve gönder. Tüm karmaşık mantık kendi sınıfında.
                $sonuc = $rapor->olusturVeGonder();

                if ($sonuc['status']) {
                    BtkHelper::logAction("{$raporTuru} Raporu Başarılı ({$grup})", 'BAŞARILI', $sonuc['message']);
                } else {
                    BtkHelper::logAction("{$raporTuru} Raporu Hatalı ({$grup})", 'HATA', $sonuc['message']);
                }
            } catch (\Exception $e) {
                BtkHelper::logAction("{$raporTuru} Rapor Hatası ({$grup})", 'KRITIK', $e->getMessage());
            }
        }
        BtkHelper::set_btk_setting('last_' . strtolower($raporTuru) . '_submission', gmdate('Y-m-d H:i:s'));
    }

    // --- 4. PERSONEL Raporu (Genel) ---
    $personelSchedule = $cronTasks['PERSONEL'];
    if (CronExpression::isValidExpression($personelSchedule) && CronExpression::factory($personelSchedule)->isDue($now)) {
        BtkHelper::logAction("PERSONEL Cron Tetiklendi", 'INFO');
        try {
            $rapor = BtkRaporFactory::create('PERSONEL', $settings, $ftpManager);
            $sonuc = $rapor->olusturVeGonder();

            if ($sonuc['status']) {
                BtkHelper::logAction("PERSONEL Raporu Başarılı", 'BAŞARILI', $sonuc['message']);
            } else {
                BtkHelper::logAction("PERSONEL Raporu Hatalı", 'HATA', $sonuc['message']);
            }
        } catch (\Exception $e) {
            BtkHelper::logAction("PERSONEL Rapor Hatası", 'KRITIK', $e->getMessage());
        }
        BtkHelper::set_btk_setting('last_personel_submission', gmdate('Y-m-d H:i:s'));
    } else {
        echo "PERSONEL report time has not come yet. Skipping...\n";
    }

} catch (\Exception $e) {
    BtkHelper::logAction('BTK Raporlama Cron Genel Hata', 'KRITIK', $e->getMessage());
    echo "A critical error occurred: " . $e->getMessage() . "\n";
    exit(1);
}

BtkHelper::logAction('BTK Raporlama Cron v7.2 Tamamlandı', 'INFO');
echo "BTK Reporting Cron v7.2 has completed.\n";

exit(0);
?>