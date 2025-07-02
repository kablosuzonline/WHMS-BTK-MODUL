<?php
/**
 * WHMCS BTK Raporlama Modülü - Cron Job Dosyası
 *
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 * ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını oluşturur ve FTP'ye yükler.
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    6.5
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

use WHMCS\Database\Capsule;
use Cron\CronExpression;

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
    if (empty($rehberCronSchedule) || !CronExpression::isValidExpression($rehberCronSchedule)) {
        BtkHelper::logAction('ABONE REHBER Cron Hatası', 'HATA', "Geçersiz cron zamanlaması: '$rehberCronSchedule'");
    } else {
        $cronRehber = CronExpression::factory($rehberCronSchedule);
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

                        $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBaseMain; 
                        
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
                            $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main', 'REHBER', $grup);
                            BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : ($uploadResultMain['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultMain['message'], $grup);

                            if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                                $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup', 'REHBER', $grup);
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
    if (empty($hareketCronSchedule) || !CronExpression::isValidExpression($hareketCronSchedule)) {
        BtkHelper::logAction('ABONE HAREKET Cron Hatası', 'HATA', "Geçersiz cron zamanlaması: '$hareketCronSchedule'");
    } else {
        $cronHareket = CronExpression::factory($hareketCronSchedule);
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
                        $gonderilecekHareketIdleri = array_column($hareketData, 'id'); 
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
                            $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main', 'HAREKET', $grup);
                            BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : ($uploadResultMain['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultMain['message'], $grup);

                            if ($uploadResultMain['status'] === 'success' && !empty($gonderilecekHareketIdleri)) {
                                BtkHelper::markHareketAsGonderildi($gonderilecekHareketIdleri, $gzFileName, $cntMain);
                            }

                            if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                                $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup', 'HAREKET', $grup);
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


// --- PERSONEL Raporu ---
try {
    $personelCronSchedule = BtkHelper::get_btk_setting('personel_cron_schedule', '0 16 L 6,12 *'); // Varsayılan: Haziran ve Aralık son günü 16:00 UTC
    if (empty($personelCronSchedule) || !CronExpression::isValidExpression($personelCronSchedule)) {
        BtkHelper::logAction('PERSONEL Cron Hatası', 'HATA', "Geçersiz cron zamanlaması: '$personelCronSchedule'");
    } else {
        $cronPersonel = CronExpression::factory($personelCronSchedule);
        if ($cronPersonel->isDue($now)) {
            BtkHelper::logAction('PERSONEL Cron', 'INFO', 'PERSONEL raporu oluşturulma zamanı geldi.');
            
            $personelData = BtkHelper::getPersonelDataForReport();
            
            if (!empty($personelData) || $sendEmptyReports) {
                $cntMain = '01'; // Personel raporu için CNT her zaman 01
                $filename = BtkHelper::generateReportFilename($operatorName, $operatorCode, null, 'PERSONEL_LISTESI', $cntMain, $now->getTimestamp(), 'main');
                $filePath = $tempDir . DIRECTORY_SEPARATOR . $filename;
                
                if (!$excelLoaded) {
                    BtkHelper::logAction('PERSONEL Cron Hatası', 'CRITICAL', 'ExcelExporter kütüphanesi yüklenemedi. Personel raporu oluşturulamıyor.');
                } else {
                    $exportSuccess = ExcelExporter::exportPersonelList($personelData, $filename, false, $tempDir);
                    if ($exportSuccess) {
                        $uploadResultMain = BtkHelper::uploadFileToFtp($filePath, $filename, 'main', 'PERSONEL');
                        BtkHelper::logFtpSubmission($filename, 'PERSONEL', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : ($uploadResultMain['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultMain['message'], null);

                        if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                            $filenameBackup = BtkHelper::generateReportFilename($operatorName, $operatorCode, null, 'PERSONEL_LISTESI', $cntMain, $now->getTimestamp(), 'backup');
                            $filePathBackup = $tempDir . DIRECTORY_SEPARATOR . $filenameBackup;
                            $exportSuccessBackup = ExcelExporter::exportPersonelList($personelData, $filenameBackup, false, $tempDir); 
                            if ($exportSuccessBackup) {
                                $uploadResultBackup = BtkHelper::uploadFileToFtp($filePathBackup, $filenameBackup, 'backup', 'PERSONEL');
                                BtkHelper::logFtpSubmission($filenameBackup, 'PERSONEL', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : ($uploadResultBackup['status'] === 'skipped' ? 'Atlandi' : 'Basarisiz'), $cntMain, $uploadResultBackup['message'], null);
                                @unlink($filePathBackup);
                            }
                        }
                        @unlink($filePath);
                    } else { BtkHelper::logAction('PERSONEL Cron Hatası', 'HATA', 'Personel listesi Excel\'e aktarılırken hata oluştu.'); }
                }
            } else { BtkHelper::logAction('PERSONEL Cron', 'INFO', 'PERSONEL verisi yok ve boş rapor kapalı.'); }
            BtkHelper::set_btk_setting('last_personel_submission', gmdate('Y-m-d H:i:s'));
        } else { echo "PERSONEL rapor zamanı henüz gelmedi. Sonraki Çalışma: " . $cronPersonel->getNextRunDate()->format('Y-m-d H:i:s') . "\n"; }
    }
} catch (Exception $e) { BtkHelper::logAction('PERSONEL Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); }

BtkHelper::logAction('BTK Cron Tamamlandı', 'INFO', 'BTK Raporlama Otomatik Cron Job tamamlandı.');
echo "BTK Raporlama Otomatik Cron Job tamamlandı.\n";

?>