<?php
/**
 * WHMCS BTK Raporlama Modülü - Cron Job Dosyası
 *
 * Bu dosya, ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını
 * periyodik olarak oluşturur ve FTP sunucularına yükler.
 * WHMCS cron sistemi tarafından veya doğrudan sunucu cron'u ile çalıştırılabilir.
 */

// Sabitleri tanımla (WHMCS kök dizinine göre)
define('BTKREPORTS_MODULE_BASE_DIR', dirname(__FILE__));
define('WHMCS_ROOT_DIR', dirname(dirname(dirname(BTKREPORTS_MODULE_BASE_DIR)))); // modules/addons/btkreports -> whmcs_root

// WHMCS Ortamını Yükle
if (file_exists(WHMCS_ROOT_DIR . '/init.php')) {
    require_once WHMCS_ROOT_DIR . '/init.php';
} else {
    // Bu kritik bir hata, WHMCS ortamı olmadan devam edilemez.
    $errorMessage = "BTK Reports Cron FATAL ERROR: WHMCS environment (init.php) could not be loaded from " . WHMCS_ROOT_DIR . "/init.php. Cron job cannot proceed.";
    error_log($errorMessage); // Sunucu loguna yaz
    die($errorMessage); // Cron işlemini sonlandır
}

// Composer Autoload
if (file_exists(BTKREPORTS_MODULE_BASE_DIR . '/vendor/autoload.php')) {
    require_once BTKREPORTS_MODULE_BASE_DIR . '/vendor/autoload.php';
} else {
    $errorMessage = "BTK Reports Cron FATAL ERROR: Composer autoload.php not found in " . BTKREPORTS_MODULE_BASE_DIR . "/vendor/. Please run 'composer install' in the module directory.";
    error_log($errorMessage);
    // BtkHelper henüz instance edilmediği için WHMCS loguna yazamıyoruz.
    if (function_exists('logActivity')) { // WHMCS logActivity fonksiyonu varsa kullan
        logActivity($errorMessage, 0);
    }
    die($errorMessage);
}

// Gerekli sınıfları yükle (autoload sayesinde namespace'leri doğrudan kullanabiliriz)
require_once BTKREPORTS_MODULE_BASE_DIR . '/lib/BtkHelper.php';
require_once BTKREPORTS_MODULE_BASE_DIR . '/lib/ExcelExporter.php';
// NviSoapClient cron'da genellikle kullanılmaz.

use WHMCS\Database\Capsule;
use WHMCS\Module\Addon\Setting as AddonSetting; // WHMCS Setting sınıfı ile çakışmaması için alias
use Cron\CronExpression;

// Çalışma limitlerini ayarla
@set_time_limit(0); // Sınırsız çalışma süresi (dikkatli kullanılmalı)
@ini_set('memory_limit', '512M'); // Yeterli bellek

$start_time = microtime(true);
$cronOutput = "BTK Reports Cron Başladı: " . date('Y-m-d H:i:s') . PHP_EOL;

$btkHelper = new BtkHelper();
$excelExporter = new ExcelExporter($btkHelper);

// Modül ayarlarını çek
$operatorCode = $btkHelper->getSetting('operator_code');
$operatorName = $btkHelper->getSetting('operator_name');
$operatorUnvani = $btkHelper->getSetting('operator_title');

if (empty($operatorCode) || empty($operatorName)) {
    $msg = "Operatör Kodu veya Operatör Adı modül ayarlarında tanımlanmamış. Cron işlemi durduruldu.";
    $btkHelper->logMessage('ERROR', 'Cron Init', $msg);
    $cronOutput .= "HATA: " . $msg . PHP_EOL;
    echo $cronOutput; // CLI çıktısı için
    // WHMCS loguna da yazalım
    if (function_exists('logActivity')) logActivity("BTK Reports Cron Hata: " . $msg, 0);
    exit;
}

// FTP ve diğer ayarlar... (Önceki versiyondaki gibi)
$ftpHostMain = $btkHelper->getSetting('ftp_host_main');
$ftpUserMain = $btkHelper->getSetting('ftp_user_main');
$ftpPassMain = $btkHelper->getSetting('ftp_pass_main');
$ftpRehberPathMain = rtrim($btkHelper->getSetting('ftp_rehber_path_main', '/REHBER/'), '/') . '/';
$ftpHareketPathMain = rtrim($btkHelper->getSetting('ftp_hareket_path_main', '/HAREKET/'), '/') . '/';
$ftpPersonelPathMain = rtrim($btkHelper->getSetting('ftp_personel_path_main', '/PERSONEL/'), '/') . '/';

$useBackupFtp = $btkHelper->getSetting('ftp_use_backup', '0') == '1';
$ftpHostBackup = $btkHelper->getSetting('ftp_host_backup');
$ftpUserBackup = $btkHelper->getSetting('ftp_user_backup');
$ftpPassBackup = $btkHelper->getSetting('ftp_pass_backup');
$ftpRehberPathBackup = rtrim($btkHelper->getSetting('ftp_rehber_path_backup', '/REHBER/'), '/') . '/';
$ftpHareketPathBackup = rtrim($btkHelper->getSetting('ftp_hareket_path_backup', '/HAREKET/'), '/') . '/';
$ftpPersonelPathBackup = rtrim($btkHelper->getSetting('ftp_personel_path_backup', '/PERSONEL/'), '/') . '/';

$sendEmptyReports = $btkHelper->getSetting('send_empty_reports', '0') == '1';
$personelFilenameAddYearMonthMain = $btkHelper->getSetting('personel_filename_add_yearmonth_main', '0') == '1';
$personelFilenameAddYearMonthBackup = $btkHelper->getSetting('personel_filename_add_yearmonth_backup', '0') == '1';


$tempReportDir = BTKREPORTS_MODULE_BASE_DIR . '/temp_reports/';
if (!is_dir($tempReportDir)) {
    if (!@mkdir($tempReportDir, 0777, true) && !is_dir($tempReportDir)) {
        $msg = "Geçici rapor dizini oluşturulamadı veya yazılamıyor: {$tempReportDir}";
        $btkHelper->logMessage('ERROR', 'Cron Init', $msg);
        $cronOutput .= "HATA: " . $msg . PHP_EOL;
        if (function_exists('logActivity')) logActivity("BTK Reports Cron Hata: " . $msg, 0);
        echo $cronOutput;
        exit;
    }
}

/**
 * Belirtilen raporu oluşturur, FTP'ye yükler ve loglar.
 * (Bu fonksiyonun içeriği bir önceki cevaptakiyle büyük ölçüde aynı kalacaktır,
 *  önemli olan BtkHelper içindeki generate... fonksiyonlarının doğru çalışmasıdır.)
 */
function processAndUploadReport($raporTuru, $yetkiTipiKodu = null, $raporTipiEki = null) {
    global $btkHelper, $excelExporter, $operatorCode, $operatorName, $operatorUnvani, $tempReportDir, $cronOutput;
    global $ftpHostMain, $ftpUserMain, $ftpPassMain, $ftpRehberPathMain, $ftpHareketPathMain, $ftpPersonelPathMain;
    global $useBackupFtp, $ftpHostBackup, $ftpUserBackup, $ftpPassBackup, $ftpRehberPathBackup, $ftpHareketPathBackup, $ftpPersonelPathBackup;
    global $sendEmptyReports, $personelFilenameAddYearMonthMain, $personelFilenameAddYearMonthBackup;

    $logContext = "Cron - {$raporTuru}" . ($yetkiTipiKodu ? " [Yetki: {$yetkiTipiKodu}, Ek: {$raporTipiEki}]" : "");
    $btkHelper->logMessage('INFO', $logContext, "Rapor oluşturma işlemi başlatıldı.");
    $cronOutput .= "{$logContext}: Rapor oluşturma işlemi başlatıldı." . PHP_EOL;

    $dosyaIcerigi = "";
    $personelVerisi = [];
    $dosyaUzantisi = ".abn";
    $isReportEmpty = true;
    $hareketIdsToMark = [];

    // 1. Veriyi Çek ve Dosya İçeriğini Oluştur
    try {
        switch ($raporTuru) {
            case 'REHBER':
                $dosyaIcerigi = $btkHelper->generateRehberReportContent($yetkiTipiKodu);
                $isReportEmpty = empty($dosyaIcerigi);
                break;
            case 'HAREKET':
                $hareketResult = $btkHelper->generateHareketReportContent($yetkiTipiKodu);
                $dosyaIcerigi = $hareketResult['content'];
                $hareketIdsToMark = $hareketResult['hareket_ids'];
                $isReportEmpty = empty($dosyaIcerigi);
                break;
            case 'PERSONEL':
                $personelVerisi = Capsule::table('mod_btk_personel')
                                    ->where('btk_listesine_eklensin', 1)
                                    ->whereNull('isten_ayrilma_tarihi')
                                    ->get()->all(); // ->toArray() da kullanılabilir.
                $isReportEmpty = empty($personelVerisi);
                $dosyaUzantisi = ".xlsx";
                break;
            default:
                $btkHelper->logMessage('ERROR', $logContext, "Bilinmeyen rapor türü: {$raporTuru}");
                $cronOutput .= "{$logContext}: HATA - Bilinmeyen rapor türü: {$raporTuru}" . PHP_EOL;
                return;
        }
    } catch (\Exception $e) {
        $btkHelper->logMessage('ERROR', $logContext, "Rapor verisi çekilirken hata: " . $e->getMessage());
        $cronOutput .= "{$logContext}: HATA - Rapor verisi çekilirken: " . $e->getMessage() . PHP_EOL;
        return;
    }


    if ($isReportEmpty && !$sendEmptyReports) {
        $btkHelper->logMessage('INFO', $logContext, "Veri bulunamadı ve boş rapor gönderimi kapalı. İşlem atlandı.");
        $cronOutput .= "{$logContext}: Veri bulunamadı, boş rapor gönderimi kapalı." . PHP_EOL;
        return;
    }

    // 2. Dosya Adını Oluştur
    $timestampPrefix = $btkHelper->formatBtkDateTime();
    $fileContentHash = md5($dosyaIcerigi . serialize($personelVerisi)); // İçerik hash'i
    $cnt = $btkHelper->getNextCnt($raporTuru, $operatorName, $operatorCode, $raporTipiEki ?? 'PERSONEL', $timestampPrefix, $fileContentHash);

    $fileNameMain = "";
    $fileNameBackup = "";

    if ($raporTuru === 'PERSONEL') {
        $yil = date('Y');
        $donemAyi = date('n'); // Mevcut ay
        $baseFileName = $operatorName . '_Personel_Listesi';
        
        $fileNameMain = $personelFilenameAddYearMonthMain ? $baseFileName . '_' . $yil . '_' . $donemAyi . $dosyaUzantisi : $baseFileName . $dosyaUzantisi;
        $fileNameBackup = $personelFilenameAddYearMonthBackup ? $baseFileName . '_' . $yil . '_' . $donemAyi . $dosyaUzantisi : $baseFileName . $dosyaUzantisi;
    } else {
        $baseFileName = $operatorName . '_' . $operatorCode . '_' . ($raporTipiEki ?? 'HATA') . '_' . $raporTuru . '_' . $timestampPrefix;
        $fileNameMain = $baseFileName . '_' . $cnt . $dosyaUzantisi;
        $fileNameBackup = $fileNameMain;
    }
    
    $localFilePath = $tempReportDir . $fileNameMain;
    $localCompressedFilePath = $localFilePath . ($raporTuru !== 'PERSONEL' ? ".gz" : "");

    // 3. Dosyayı Oluştur/Kaydet (Önceki versiyondaki gibi)
    // ... (file_put_contents, compressFileGzip, excelExporter->createBtkPersonelExcel çağrıları) ...
    $fileCreated = false;
    if ($raporTuru === 'PERSONEL') {
        if ($excelExporter->createBtkPersonelExcel($personelVerisi, $operatorUnvani, $localFilePath, false)) {
            $fileCreated = true;
        }
    } else {
        if (file_put_contents($localFilePath, $dosyaIcerigi) !== false) {
            if ($btkHelper->compressFileGzip($localFilePath, $localCompressedFilePath)) {
                @unlink($localFilePath);
                $fileCreated = true;
            } else { /* log error */ @unlink($localFilePath); }
        } else { /* log error */ }
    }

    if (!$fileCreated) {
        $btkHelper->logMessage('ERROR', $logContext, "Lokal dosya oluşturulamadı/sıkıştırılamadı.");
        $cronOutput .= "{$logContext}: HATA - Lokal dosya oluşturma/sıkıştırma." . PHP_EOL;
        return;
    }
    $cronOutput .= "{$logContext}: Lokal dosya oluşturuldu: " . ($raporTuru === 'PERSONEL' ? $localFilePath : $localCompressedFilePath) . PHP_EOL;

    // 4. FTP'ye Yükle (Önceki versiyondaki gibi)
    // ... (uploadFileFtp çağrıları ve logFtpTransaction) ...
    $fileToUploadForMain = ($raporTuru === 'PERSONEL' ? $localFilePath : $localCompressedFilePath);
    // Eğer personel için yedek dosya ismi farklıysa, o dosyayı da oluşturmak veya kopyalamak gerekebilir.
    // Şimdilik ana dosyanın (veya kopyasının) yüklendiğini varsayalım.
    $fileToUploadForBackup = $fileToUploadForMain; 
    if ($raporTuru === 'PERSONEL' && $fileNameMain !== $fileNameBackup && $useBackupFtp) {
        $backupLocalPath = $tempReportDir . $fileNameBackup;
        if (!copy($localFilePath, $backupLocalPath)) {
            $btkHelper->logMessage('WARNING', $logContext, "Yedek personel dosyası kopyalanamadı: {$backupLocalPath}");
        } else {
            $fileToUploadForBackup = $backupLocalPath;
        }
    }


    $uploadSuccessMain = false;
    if ($ftpHostMain) {
        $remotePathMain = ($raporTuru === 'REHBER' ? $ftpRehberPathMain : ($raporTuru === 'HAREKET' ? $ftpHareketPathMain : $ftpPersonelPathMain)) . basename($fileNameMain);
        if ($btkHelper->uploadFileFtp($ftpHostMain, $ftpUserMain, $ftpPassMain, $fileToUploadForMain, $remotePathMain)) {
            $uploadSuccessMain = true;
            $btkHelper->logFtpTransaction($raporTuru, basename($fileNameMain), 'ANA', $cnt, 'BASARILI');
            $cronOutput .= "{$logContext}: Ana FTP'ye yüklendi: {$remotePathMain}" . PHP_EOL;
        } else { /* ... */ }
    }

    if ($useBackupFtp && $ftpHostBackup) {
        $remotePathBackup = ($raporTuru === 'REHBER' ? $ftpRehberPathBackup : ($raporTuru === 'HAREKET' ? $ftpHareketPathBackup : $ftpPersonelPathBackup)) . basename($fileNameBackup);
        if ($btkHelper->uploadFileFtp($ftpHostBackup, $ftpUserBackup, $ftpPassBackup, $fileToUploadForBackup, $remotePathBackup)) { /* ... */ } else { /* ... */ }
    }

    // 5. Hareketleri işaretle/arşivle (Önceki versiyondaki gibi)
    if ($raporTuru === 'HAREKET' && $uploadSuccessMain && !empty($hareketIdsToMark)) {
        if ($btkHelper->markHareketAsSentAndArchive($hareketIdsToMark, basename($fileNameMain), $cnt)) { /* ... */ } else { /* ... */ }
    }

    // 6. Geçici dosyaları temizle
    if (file_exists($fileToUploadForMain)) @unlink($fileToUploadForMain);
    if ($useBackupFtp && $fileToUploadForMain !== $fileToUploadForBackup && file_exists($fileToUploadForBackup)) {
        @unlink($fileToUploadForBackup);
    }


    $btkHelper->logMessage('INFO', $logContext, "Rapor işlemi tamamlandı.");
    $cronOutput .= "{$logContext}: Rapor işlemi tamamlandı." . PHP_EOL;
}
// --- BÖLÜM 1 / 2 SONU - (btkreports_cron.php, Başlangıç, Ayarlar ve processAndUploadReport Fonksiyonu - GÜNCEL)

// --- BÖLÜM 2 / 2 BAŞI - (btkreports_cron.php, Cron Zamanlama Kontrolü ve Çalıştırma - GÜNCEL)
// ------------------ CRON ZAMANLAMA KONTROLÜ VE ÇALIŞTIRMA ------------------

$now = new DateTime('now', new DateTimeZone('Europe/Istanbul'));

// ABONE REHBER Raporu
$cronRehberSchedule = $btkHelper->getSetting('cron_rehber_schedule', '0 10 1 * *');
if (CronExpression::isValidExpression($cronRehberSchedule)) {
    $cronRehber = CronExpression::factory($cronRehberSchedule);
    if ($cronRehber->isDue($now)) {
        $cronOutput .= "ABONE REHBER cron zamanı geldi (" . $now->format('Y-m-d H:i:s') . ")." . PHP_EOL;
        $aktifYetkiler = Capsule::table('mod_btk_yetki_turleri')->where('aktif', 1)->whereNotNull('rapor_tipi_eki')->where('rapor_tipi_eki', '!=', '')->get()->all();
        if ($aktifYetkiler && count($aktifYetkiler) > 0) {
            foreach ($aktifYetkiler as $yetki) {
                processAndUploadReport('REHBER', $yetki->yetki_kodu, $yetki->rapor_tipi_eki);
            }
        } else { /* ... */ }
    } else {
        $cronOutput .= "ABONE REHBER cron zamanı henüz gelmedi. Sonraki Çalışma: " . $cronRehber->getNextRunDate($now)->format('Y-m-d H:i:s') . PHP_EOL;
    }
} else {
    $msg = "Geçersiz REHBER cron zamanlama ifadesi: {$cronRehberSchedule}";
    $btkHelper->logMessage('ERROR', 'Cron - REHBER', $msg);
    $cronOutput .= "HATA: " . $msg . PHP_EOL;
}


// ABONE HAREKET Raporu
$cronHareketSchedule = $btkHelper->getSetting('cron_hareket_schedule', '0 1 * * *');
if (CronExpression::isValidExpression($cronHareketSchedule)) {
    $cronHareket = CronExpression::factory($cronHareketSchedule);
    if ($cronHareket->isDue($now)) {
        $cronOutput .= "ABONE HAREKET cron zamanı geldi (" . $now->format('Y-m-d H:i:s') . ")." . PHP_EOL;
        $aktifYetkiler = Capsule::table('mod_btk_yetki_turleri')->where('aktif', 1)->whereNotNull('rapor_tipi_eki')->where('rapor_tipi_eki', '!=', '')->get()->all();
        if ($aktifYetkiler && count($aktifYetkiler) > 0) {
            foreach ($aktifYetkiler as $yetki) {
                processAndUploadReport('HAREKET', $yetki->yetki_kodu, $yetki->rapor_tipi_eki);
            }
        } else { /* ... */ }
    } else {
        $cronOutput .= "ABONE HAREKET cron zamanı henüz gelmedi. Sonraki Çalışma: " . $cronHareket->getNextRunDate($now)->format('Y-m-d H:i:s') . PHP_EOL;
    }
} else {
    $msg = "Geçersiz HAREKET cron zamanlama ifadesi: {$cronHareketSchedule}";
    $btkHelper->logMessage('ERROR', 'Cron - HAREKET', $msg);
    $cronOutput .= "HATA: " . $msg . PHP_EOL;
}


// PERSONEL LİSTESİ Raporu
// PHP ile manuel gün/ay kontrolü daha güvenilir. Cron ayarı "0 16 * * *" (Her gün 16:00) olmalı.
$cronPersonelScheduleSetting = $btkHelper->getSetting('cron_personel_schedule', '0 16 * * *'); // Basit günlük cron
$isPersonelTime = false;
if (CronExpression::isValidExpression($cronPersonelScheduleSetting)) {
    $cronPersonel = CronExpression::factory($cronPersonelScheduleSetting);
    if ($cronPersonel->isDue($now)) {
        $currentMonth = (int)$now->format('n');
        $isLastDayOfMonth = ($now->format('j') == $now->format('t'));
        if ($isLastDayOfMonth && ($currentMonth == 6 || $currentMonth == 12)) {
            $isPersonelTime = true;
            $cronOutput .= "PERSONEL LISTESI (PHP Kontrolü ile) cron zamanı geldi (" . $now->format('Y-m-d H:i:s') . ")." . PHP_EOL;
        } else {
            $cronOutput .= "PERSONEL LISTESI (PHP Kontrolü ile) gün/ay koşulu sağlanmadı. Ay:{$currentMonth}, Gün:{$now->format('j')}/{$now->format('t')}" . PHP_EOL;
        }
    } else {
        $cronOutput .= "PERSONEL LISTESI (PHP Kontrolü ile) saat koşulu sağlanmadı. Sonraki 16:00: " . $cronPersonel->getNextRunDate($now)->format('Y-m-d H:i:s') . PHP_EOL;
    }
} else {
    $msg = "Geçersiz PERSONEL cron zamanlama ifadesi (basit günlük kontrol için): {$cronPersonelScheduleSetting}";
    $btkHelper->logMessage('ERROR', 'Cron - PERSONEL', $msg);
    $cronOutput .= "HATA: " . $msg . PHP_EOL;
}


if ($isPersonelTime) {
    $cronOutput .= "PERSONEL LISTESI raporu oluşturuluyor..." . PHP_EOL;
    processAndUploadReport('PERSONEL');
}


$end_time = microtime(true);
$execution_time = ($end_time - $start_time);
$finalMessage = "BTK Reports Cron tamamlandı. Toplam Süre: " . round($execution_time, 2) . " saniye.";
$btkHelper->logMessage('INFO', 'Cron End', $finalMessage);
$cronOutput .= $finalMessage . PHP_EOL;

// WHMCS Modül Loguna Kaydet
if (function_exists('logModuleCall')) {
    logModuleCall('btkreports', 'cron_execution_summary', $cronPersonelScheduleSetting, $cronOutput, null, null);
} else {
    logActivity("BTK Reports Cron Tamamlandı. Detaylar için modül loglarına bakınız.", 0);
}

// CLI için çıktıyı bas
if (php_sapi_name() === 'cli' || defined('STDIN')) {
    echo $cronOutput;
}
// --- BÖLÜM 2 / 2 SONU - (btkreports_cron.php, Cron Zamanlama Kontrolü ve Çalıştırma - GÜNCEL)
?>