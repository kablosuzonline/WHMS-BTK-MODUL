<?php
/**
 * WHMCS BTK Raporlama Modülü - Cron Job Dosyası
 *
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 * ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını oluşturur ve FTP'ye yükler.
 */

// WHMCS kök dizinini bul ve WHMCS'i başlat (CLI ortamında çalıştırılacak)
if (php_sapi_name() != 'cli' && php_sapi_name() != 'cgi-fcgi') { // cgi-fcgi de bazı sunucularda cron için kullanılabilir
    die("This script can only be run via the command line or a similar SAPI.");
}

// WHMCS Kök dizinini bulmaya çalış
$currentDir = __DIR__; // modules/addons/btkreports
$whmcsRootDir = '';
// Genellikle addon modülünden 4 seviye yukarıdadır.
if (file_exists($currentDir . '/../../../../init.php')) {
    $whmcsRootDir = $currentDir . '/../../../..';
} elseif (file_exists($currentDir . '/../../../init.php')) { // WHMCS kök dizini modules/addons içinde ise
    $whmcsRootDir = $currentDir . '/../../..';
} elseif (file_exists(dirname(dirname(dirname(dirname($currentDir)))) . '/init.php')) { // Daha genel bir arama
    $whmcsRootDir = dirname(dirname(dirname(dirname($currentDir))));
}


if (!empty($whmcsRootDir) && file_exists($whmcsRootDir . '/init.php')) {
    require_once $whmcsRootDir . '/init.php';
} else {
    echo "BTK Reports Cron Error: WHMCS init.php dosyası bulunamadı. Cron çalıştırılamıyor.\n";
    error_log("BTK Reports Cron Error: WHMCS init.php not found. Searched relative to: " . $currentDir);
    exit(1);
}

// Gerekli yardımcı dosyaları ve sınıfları dahil et
$baseLibPath = __DIR__ . '/lib/';
$helperLoaded = false; $excelLoaded = false; $composerLoaded = false;

if (file_exists($baseLibPath . 'BtkHelper.php')) {
    require_once $baseLibPath . 'BtkHelper.php';
    if (class_exists('BtkHelper')) $helperLoaded = true;
}
if (file_exists($baseLibPath . 'ExcelExporter.php')) {
    // ExcelExporter PhpSpreadsheet'e bağımlı, o yüzden önce composer autoload
    $tempComposerAutoloadPath = __DIR__ . '/vendor/autoload.php';
    if (file_exists($tempComposerAutoloadPath)) {
        require_once $tempComposerAutoloadPath;
        if (class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) $composerLoaded = true; // PhpSpreadsheet kontrolü
    }
    require_once $baseLibPath . 'ExcelExporter.php';
    if (class_exists('ExcelExporter')) $excelLoaded = true;
}
// Composer autoload'u bir daha yüklemeye gerek yok, ExcelExporter içinde yüklendi.
// if (!$composerLoaded && file_exists(__DIR__ . '/vendor/autoload.php')) {
//    require_once __DIR__ . '/vendor/autoload.php';
//    if (class_exists('Cron\CronExpression')) $composerLoaded = true;
// }


if (!$helperLoaded) {
    echo "BtkHelper.php bulunamadı veya yüklenemedi. Cron çalıştırılamıyor.\n";
    error_log("BTK Reports Cron Critical Error: BtkHelper.php not found or failed to load.");
    exit(1);
}
if (!$composerLoaded) {
    BtkHelper::logAction('BTK Cron Hatası', 'CRITICAL', 'Composer autoload.php veya temel kütüphaneler (CronExpression/PhpSpreadsheet) bulunamadı!');
    echo "Composer autoload.php veya temel kütüphaneler bulunamadı. Cron çalıştırılamıyor.\n";
    exit(1);
}

BtkHelper::logAction('BTK Cron Başladı', 'INFO', 'BTK Raporlama Otomatik Cron Job başlatıldı.');
echo "BTK Raporlama Otomatik Cron Job başlatıldı...\n";

// ------------------- CRON İŞLEMLERİ -------------------
$operatorCode = BtkHelper::get_btk_setting('operator_code');
$operatorName = BtkHelper::get_btk_setting('operator_name');
$sendEmptyReports = (BtkHelper::get_btk_setting('send_empty_reports') === '1');
$tempDir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR); // Güvenlik için WHMCS'in temp dizini de kullanılabilir: $templates_compiledir

if (empty($operatorCode) || empty($operatorName)) {
    $errorMsg = 'Operatör Kodu veya Operatör Adı ayarlanmamış. Raporlar oluşturulamıyor.';
    BtkHelper::logAction('BTK Cron Hatası', 'CRITICAL', $errorMsg);
    echo $errorMsg . "\n";
    exit(1);
}

$now = new DateTime('now', new DateTimeZone('UTC')); 
$aktifYetkiGruplari = BtkHelper::getAktifYetkiTurleri('array_grup_names_only'); // ['ISS', 'AIH', ...]

// --- ABONE REHBER Raporu ---
try {
    $rehberCronSchedule = BtkHelper::get_btk_setting('rehber_cron_schedule', '0 10 1 * *'); // Varsayılan: Her ayın 1'i saat 10:00 UTC
    if (empty($rehberCronSchedule) || !Cron\CronExpression::isValidExpression($rehberCronSchedule)) {
        BtkHelper::logAction('ABONE REHBER Cron Hatası', 'HATA', "Geçersiz cron zamanlaması: '$rehberCronSchedule'");
    } else {
        $cronRehber = Cron\CronExpression::factory($rehberCronSchedule);
        if ($cronRehber->isDue($now)) {
            BtkHelper::logAction('ABONE REHBER Cron', 'INFO', 'ABONE REHBER raporu oluşturulma zamanı geldi.');
            
            if (empty($aktifYetkiGruplari) && !$sendEmptyReports) {
                 BtkHelper::logAction('ABONE REHBER Cron', 'INFO', 'Aktif yetki türü grubu bulunamadı ve boş rapor gönderimi kapalı. REHBER raporu atlanıyor.');
            } else {
                $gruplarToProcess = !empty($aktifYetkiGruplari) ? $aktifYetkiGruplari : ['GENEL_TIP_YOK']; // Aktif grup yoksa ve boş rapor gönderilecekse

                foreach ($gruplarToProcess as $grup) {
                    BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "'$grup' grubu için REHBER raporu oluşturuluyor...");
                    
                    $rehberData = BtkHelper::getAboneRehberData($grup);
                    
                    if (!empty($rehberData) || $sendEmptyReports) {
                        $cntMain = BtkHelper::getNextCnt($operatorName, $operatorCode, $grup, 'ABONE_REHBER', 'ANA', $now->getTimestamp());
                        $filenameBaseMain = BtkHelper::generateReportFilename($operatorName, $operatorCode, $grup, 'ABONE_REHBER', $cntMain, $now->getTimestamp(), 'main');
                        if(!$filenameBaseMain) { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "Dosya adı oluşturulamadı. Grup: $grup"); continue; }

                        $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBaseMain; // .abn uzantısı generateReportFilename'den gelir
                        
                        $abnContent = "";
                        $btkAlanSiralamasi = BtkHelper::getBtkAlanSiralamasi('REHBER', $grup);
                        if (empty($btkAlanSiralamasi)) { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$grup grubu için BTK alan sıralaması alınamadı."); continue; }
                        
                        foreach ($rehberData as $row) { $abnContent .= BtkHelper::formatAbnRow((array)$row, $btkAlanSiralamasi) . "\n"; }
                        
                        if (empty(trim($abnContent)) && !$sendEmptyReports) {
                             BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "$grup grubu için REHBER içeriği boş ve boş rapor gönderimi kapalı.");
                             continue;
                        }
                        file_put_contents($abnFilePath, $abnContent);
                        
                        $gzFilePath = BtkHelper::compressToGz($abnFilePath);
                        if ($gzFilePath) {
                            $gzFileName = basename($gzFilePath);
                            $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main', 'REHBER');
                            BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : ($uploadResultMain['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultMain['message'], $grup);

                            if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                                // Yedek için dosya adı veya CNT farklı olabilir, şimdilik aynı kullanılıyor
                                $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup', 'REHBER');
                                BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : ($uploadResultBackup['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultBackup['message'], $grup);
                            }
                            @unlink($abnFilePath); @unlink($gzFilePath);
                        } else { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$grup için $abnFilePath sıkıştırılamadı."); }
                    } else { BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "$grup için REHBER verisi yok ve boş rapor kapalı."); }
                }
            }
            BtkHelper::set_btk_setting('last_rehber_submission', gmdate('Y-m-d H:i:s'));
        } else { echo "ABONE REHBER rapor zamanı henüz gelmedi. Sonraki Çalışma: " . $cronRehber->getNextRunDate()->format('Y-m-d H:i:s') . "\n"; }
    }
} catch (Exception $e) { BtkHelper::logAction('ABONE REHBER Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); }

// --- ABONE HAREKET Raporu ---
try {
    $hareketCronSchedule = BtkHelper::get_btk_setting('hareket_cron_schedule', '0 1 * * *'); // Varsayılan: Her gün 01:00 UTC
    if (empty($hareketCronSchedule) || !Cron\CronExpression::isValidExpression($hareketCronSchedule)) {
        BtkHelper::logAction('ABONE HAREKET Cron Hatası', 'HATA', "Geçersiz cron zamanlaması: '$hareketCronSchedule'");
    } else {
        $cronHareket = Cron\CronExpression::factory($hareketCronSchedule);
        if ($cronHareket->isDue($now)) {
            BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', 'ABONE HAREKET raporu oluşturulma zamanı geldi.');
            BtkHelper::archiveOldHareketler(); 

            if (empty($aktifYetkiGruplari) && !$sendEmptyReports) {
                 BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', 'Aktif yetki türü grubu bulunamadı ve boş rapor gönderimi kapalı. HAREKET raporu atlanıyor.');
            } else {
                $gruplarToProcess = !empty($aktifYetkiGruplari) ? $aktifYetkiGruplari : ['GENEL_TIP_YOK'];

                foreach ($gruplarToProcess as $grup) {
                    BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "'$grup' grubu için HAREKET raporu oluşturuluyor...");
                    $hareketData = BtkHelper::getAboneHareketData($grup);
                    
                    if (!empty($hareketData) || $sendEmptyReports) {
                        $gonderilecekHareketIdleri = array_map(function($h){ return $h['id'] ?? ($h->id ?? null); }, $hareketData); // BtkHelper::getAboneHareketData dizi veya obje listesi dönebilir
                        $gonderilecekHareketIdleri = array_filter($gonderilecekHareketIdleri);


                        $cntMain = BtkHelper::getNextCnt($operatorName, $operatorCode, $grup, 'ABONE_HAREKET', 'ANA', $now->getTimestamp());
                        $filenameBaseMain = BtkHelper::generateReportFilename($operatorName, $operatorCode, $grup, 'ABONE_HAREKET', $cntMain, $now->getTimestamp(), 'main');
                        if(!$filenameBaseMain) { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "Dosya adı oluşturulamadı. Grup: $grup"); continue; }
                        
                        $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBaseMain;
                        $abnContent = "";
                        $btkAlanSiralamasi = BtkHelper::getBtkAlanSiralamasi('HAREKET', $grup);
                        if (empty($btkAlanSiralamasi)) { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$grup için BTK alan sıralaması alınamadı."); continue; }
                        
                        foreach ($hareketData as $row) { $abnContent .= BtkHelper::formatAbnRow((array)$row, $btkAlanSiralamasi, true) . "\n"; }

                        if (empty(trim($abnContent)) && !$sendEmptyReports) {
                             BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "$grup için HAREKET içeriği boş ve boş rapor gönderimi kapalı.");
                             continue;
                        }
                        file_put_contents($abnFilePath, $abnContent);
                        
                        $gzFilePath = BtkHelper::compressToGz($abnFilePath);
                        if ($gzFilePath) {
                            $gzFileName = basename($gzFilePath);
                            $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main', 'HAREKET');
                            BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : ($uploadResultMain['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultMain['message'], $grup);

                            if ($uploadResultMain['status'] === 'success' && !empty($gonderilecekHareketIdleri)) {
                                BtkHelper::markHareketAsGonderildi($gonderilecekHareketIdleri, $gzFileName, $cntMain);
                            }

                            if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                                $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup', 'HAREKET');
                                BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : ($uploadResultBackup['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultBackup['message'], $grup);
                            }
                            @unlink($abnFilePath); @unlink($gzFilePath);
                        } else { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$grup için $abnFilePath sıkıştırılamadı."); }
                    } else { BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "$grup için HAREKET verisi yok ve boş rapor kapalı.");}
                }
            }
            BtkHelper::set_btk_setting('last_hareket_submission', gmdate('Y-m-d H:i:s'));
        } else { echo "ABONE HAREKET rapor zamanı henüz gelmedi. Sonraki Çalışma: " . $cronHareket->getNextRunDate()->format('Y-m-d H:i:s') . "\n"; }
    }
} catch (Exception $e) { BtkHelper::logAction('ABONE HAREKET Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); }

// --- BÖLÜM 3/3 Sonu ---