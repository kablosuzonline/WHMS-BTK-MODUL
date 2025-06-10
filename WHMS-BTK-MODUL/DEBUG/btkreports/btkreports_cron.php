<?php
/**
 * WHMCS BTK Raporlama Modülü - Cron Job Dosyası
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 */

// WHMCS kök dizinini bul ve WHMCS'i başlat
if (php_sapi_name() != 'cli') {
    die("This script can only be run via the command line.");
}

$whmcsRootDir = '';
// Kök dizini bulmak için çeşitli yollar deneyebiliriz
$pathChecks = [
    __DIR__ . '/../../../..', // modules/addons/btkreports/ -> kök
    dirname($_SERVER['SCRIPT_FILENAME']) . '/../../..', // Eğer crons/script.php ise
];
foreach ($pathChecks as $path) {
    if (file_exists(realpath($path) . '/init.php')) {
        $whmcsRootDir = realpath($path);
        break;
    }
}

if (empty($whmcsRootDir) || !file_exists($whmcsRootDir . '/init.php')) {
    echo "FATAL ERROR: WHMCS init.php dosyası bulunamadı. Cron çalıştırılamıyor. Kontrol edilen yollar: " . implode(', ', $pathChecks) . "\n";
    error_log("BTK Reports Cron FATAL Error: WHMCS init.php not found.");
    exit(1);
}

require_once $whmcsRootDir . '/init.php';

// Gerekli yardımcı dosyaları ve sınıfları dahil et
$baseAddonPath = __DIR__; // modules/addons/btkreports/
$helperLoaded = false; $excelLoaded = false; $composerLoaded = false;

if (file_exists($baseAddonPath . '/lib/BtkHelper.php')) {
    require_once $baseAddonPath . '/lib/BtkHelper.php';
    if (class_exists('BtkHelper')) $helperLoaded = true;
}
if (file_exists($baseAddonPath . '/lib/ExcelExporter.php')) {
    require_once $baseAddonPath . '/lib/ExcelExporter.php';
    if (class_exists('ExcelExporter')) $excelLoaded = true;
}
if (file_exists($baseAddonPath . '/vendor/autoload.php')) {
    require_once $baseAddonPath . '/vendor/autoload.php';
    if (class_exists('Cron\CronExpression')) $composerLoaded = true;
}

if (!$helperLoaded) {
    echo "FATAL ERROR: BtkHelper.php bulunamadı veya yüklenemedi. Cron çalıştırılamıyor.\n";
    error_log("BTK Reports Cron FATAL Error: BtkHelper.php not found or failed to load.");
    exit(1);
}
if (!$composerLoaded) {
    BtkHelper::logAction('BTK Cron Başlatma Hatası', 'CRITICAL', 'Composer autoload.php veya CronExpression kütüphanesi bulunamadı! Zamanlama kontrolü yapılamaz.');
    echo "UYARI: Composer autoload.php veya CronExpression kütüphanesi bulunamadı. Zamanlama kontrolü yapılamaz.\n";
    // Cron'u durdurmak yerine, zamanlama kontrolünü atlayıp her zaman çalıştırmayı deneyebiliriz (test için)
    // Veya sadece loglayıp devam edebiliriz. Şimdilik devam etsin ama loglasın.
}
// ExcelExporter sadece personel raporu için gerekli, o kısımda ayrıca kontrol edilecek.

// --- CRON BAŞLANGICI ---
BtkHelper::logAction('BTK Cron Başladı', 'INFO', 'BTK Raporlama Otomatik Cron Job başlatıldı.');
echo "BTK Raporlama Otomatik Cron Job başlatıldı...\n";

$operatorCode = BtkHelper::get_btk_setting('operator_code');
$operatorName = BtkHelper::get_btk_setting('operator_name');
$sendEmptyReports = (BtkHelper::get_btk_setting('send_empty_reports') === '1');
$tempDir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR); // Sonunda / olmadan

if (empty($operatorCode) || empty($operatorName)) {
    $errorMsg = 'Operatör Kodu veya Operatör Adı ayarlanmamış. Raporlar oluşturulamıyor.';
    BtkHelper::logAction('BTK Cron Hatası', 'CRITICAL', $errorMsg);
    echo "HATA: " . $errorMsg . "\n";
    exit(1);
}

$now = new DateTime('now', new DateTimeZone('UTC')); // Tüm zamanlamalar UTC'ye göre
$aktifYetkiGruplari = BtkHelper::getAktifYetkiTurleri('array_grup_names_only'); // ['ISS', 'AIH', ...]

// --- ABONE REHBER Raporu ---
$isRehberDue = false;
if ($composerLoaded) {
    try {
        $rehberCronSchedule = BtkHelper::get_btk_setting('rehber_cron_schedule', '0 2 1 * *'); // Varsayılan: Her ayın 1'i gece 02:00 (UTC)
        if (!Cron\CronExpression::isValidExpression($rehberCronSchedule)) {
            BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "Geçersiz cron ifadesi: '$rehberCronSchedule'. Varsayılan kullanılacak.");
            $rehberCronSchedule = '0 2 1 * *'; // Güvenli bir varsayılana dön
        }
        $cronRehber = Cron\CronExpression::factory($rehberCronSchedule);
        if ($cronRehber->isDue($now)) {
            $isRehberDue = true;
        }
    } catch (Exception $e) {
        BtkHelper::logAction('ABONE REHBER Cron Zamanlama Hatası', 'HATA', $e->getMessage());
    }
} else { $isRehberDue = true; /* Composer yoksa her cron çalışmasında dene (test amaçlı) */ }

if ($isRehberDue) {
    BtkHelper::logAction('ABONE REHBER Cron', 'INFO', 'ABONE REHBER raporu oluşturulma zamanı geldi.');
    if (empty($aktifYetkiGruplari) && !$sendEmptyReports) {
         BtkHelper::logAction('ABONE REHBER Cron', 'INFO', 'Aktif yetki türü grubu bulunamadı ve boş rapor gönderimi kapalı. REHBER raporu atlanıyor.');
    } else {
        $gruplarToProcess = !empty($aktifYetkiGruplari) ? $aktifYetkiGruplari : ['GENEL']; // Aktif grup yoksa ve boş rapor gönderilecekse.

        foreach ($gruplarToProcess as $grup) {
            BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "$grup grubu için REHBER raporu oluşturuluyor...");
            $rehberData = BtkHelper::getAboneRehberData($grup);
            
            if (!empty($rehberData) || $sendEmptyReports) {
                $cntMain = BtkHelper::getNextCnt($operatorName, $operatorCode, $grup, 'ABONE_REHBER', 'ANA');
                $filenameBase = BtkHelper::generateReportFilename($operatorName, $operatorCode, $grup, 'ABONE_REHBER', $cntMain, $now->getTimestamp(), 'main', false); // .abn döner
                
                if (!$filenameBase) { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$grup grubu için dosya adı oluşturulamadı."); continue; }

                $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBase;
                $abnContent = "";
                $btkAlanSiralamasi = BtkHelper::getBtkAlanSiralamasi('REHBER', $grup);
                if (empty($btkAlanSiralamasi)) { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$grup grubu için BTK alan sıralaması alınamadı."); continue; }
                
                foreach ($rehberData as $row) { $abnContent .= BtkHelper::formatAbnRow((array)$row, $btkAlanSiralamasi, false) . "\n"; }
                if (file_put_contents($abnFilePath, trim($abnContent)) === false) { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$abnFilePath dosyasına yazılamadı."); continue; }
                
                $gzFilePath = BtkHelper::compressToGz($abnFilePath);
                if ($gzFilePath) {
                    $gzFileName = basename($gzFilePath);
                    $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main', 'REHBER');
                    BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntMain, $uploadResultMain['message'], $grup);

                    if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                        $cntBackup = BtkHelper::getNextCnt($operatorName, $operatorCode, $grup, 'ABONE_REHBER', 'YEDEK'); // Yedek için ayrı CNT
                        $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup', 'REHBER');
                        BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntBackup, $uploadResultBackup['message'], $grup);
                    }
                    @unlink($abnFilePath); @unlink($gzFilePath);
                } else { BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$grup grubu için $abnFilePath dosyası sıkıştırılamadı.");}
            } else { BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "$grup grubu için REHBER verisi bulunamadı ve boş rapor gönderimi kapalı.");}
        }
        BtkHelper::set_btk_setting('last_rehber_submission', gmdate('Y-m-d H:i:s'));
    }
} catch (Exception $e) { BtkHelper::logAction('ABONE REHBER Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); }


// --- ABONE HAREKET Raporu ---
$isHareketDue = false;
if ($composerLoaded) {
    try {
        $hareketCronSchedule = BtkHelper::get_btk_setting('hareket_cron_schedule', '0 1 * * *');
        if (!Cron\CronExpression::isValidExpression($hareketCronSchedule)) { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "Geçersiz cron ifadesi: '$hareketCronSchedule'."); $hareketCronSchedule = '0 1 * * *';}
        $cronHareket = Cron\CronExpression::factory($hareketCronSchedule);
        if ($cronHareket->isDue($now)) { $isHareketDue = true; }
    } catch (Exception $e) { BtkHelper::logAction('ABONE HAREKET Cron Zamanlama Hatası', 'HATA', $e->getMessage()); }
} else { $isHareketDue = true; }

if ($isHareketDue) {
    BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', 'ABONE HAREKET raporu oluşturulma zamanı geldi.');
    BtkHelper::archiveOldHareketler(); 

    if (empty($aktifYetkiGruplari) && !$sendEmptyReports) { BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', 'Aktif yetki türü grubu bulunamadı ve boş rapor gönderimi kapalı. HAREKET raporu atlanıyor.');
    } else {
        $gruplarToProcess = !empty($aktifYetkiGruplari) ? $aktifYetkiGruplari : ['GENEL'];
        foreach ($gruplarToProcess as $grup) {
            BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "$grup grubu için HAREKET raporu oluşturuluyor...");
            $hareketData = BtkHelper::getAboneHareketData($grup);
            
            if (!empty($hareketData) || $sendEmptyReports) {
                $gonderilecekHareketIdleri = array_column($hareketData, 'id'); // Eğer getAboneHareketData hareket ID'lerini de içeriyorsa

                $cntMain = BtkHelper::getNextCnt($operatorName, $operatorCode, $grup, 'ABONE_HAREKET', 'ANA');
                $filenameBase = BtkHelper::generateReportFilename($operatorName, $operatorCode, $grup, 'ABONE_HAREKET', $cntMain, $now->getTimestamp(), 'main', false);
                if (!$filenameBase) { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$grup grubu için dosya adı oluşturulamadı."); continue; }

                $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBase;
                $abnContent = ""; $btkAlanSiralamasi = BtkHelper::getBtkAlanSiralamasi('HAREKET', $grup);
                if (empty($btkAlanSiralamasi)) { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$grup grubu için BTK alan sıralaması alınamadı."); continue; }
                
                foreach ($hareketData as $row) { $abnContent .= BtkHelper::formatAbnRow((array)$row, $btkAlanSiralamasi, true) . "\n"; }
                if (file_put_contents($abnFilePath, trim($abnContent)) === false) { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$abnFilePath dosyasına yazılamadı."); continue; }

                $gzFilePath = BtkHelper::compressToGz($abnFilePath);
                if ($gzFilePath) {
                    $gzFileName = basename($gzFilePath);
                    $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main', 'HAREKET');
                    BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntMain, $uploadResultMain['message'], $grup);

                    if ($uploadResultMain['status'] === 'success' && !empty($gonderilecekHareketIdleri)) {
                        BtkHelper::markHareketAsGonderildi($gonderilecekHareketIdleri, $gzFileName, $cntMain);
                    }

                    if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                        $cntBackup = BtkHelper::getNextCnt($operatorName, $operatorCode, $grup, 'ABONE_HAREKET', 'YEDEK');
                        $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup', 'HAREKET');
                        BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntBackup, $uploadResultBackup['message'], $grup);
                    }
                    @unlink($abnFilePath); @unlink($gzFilePath);
                } else { BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$grup grubu için $abnFilePath dosyası sıkıştırılamadı.");}
            } else { BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "$grup grubu için HAREKET verisi bulunamadı ve boş rapor gönderimi kapalı.");}
        }
        BtkHelper::set_btk_setting('last_hareket_submission', gmdate('Y-m-d H:i:s'));
    }
} catch (Exception $e) { BtkHelper::logAction('ABONE HAREKET Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); }


// --- PERSONEL LİSTESİ Raporu ---
$isPersonelDue = false;
if ($composerLoaded) {
    try {
        $personelCronSchedule = BtkHelper::get_btk_setting('personel_cron_schedule', '0 16 L 6,12 *');
        if (!Cron\CronExpression::isValidExpression($personelCronSchedule)) { BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'HATA', "Geçersiz cron ifadesi: '$personelCronSchedule'."); $personelCronSchedule = '0 16 L 6,12 *';}
        $cronPersonel = Cron\CronExpression::factory($personelCronSchedule);
        if ($cronPersonel->isDue($now)) { $isPersonelDue = true; }
    } catch (Exception $e) { BtkHelper::logAction('PERSONEL LİSTESİ Cron Zamanlama Hatası', 'HATA', $e->getMessage()); }
} else { $isPersonelDue = true; }

if ($isPersonelDue) {
    if (!$excelLoaded) {
        BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'UYARI', 'ExcelExporter.php yüklenemediği için Personel Raporu oluşturulamıyor.');
    } else {
        BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'INFO', 'PERSONEL LİSTESİ raporu oluşturulma zamanı geldi.');
        $personelData = BtkHelper::getPersonelDataForReport();
        
        if (!empty($personelData) || $sendEmptyReports) {
            $cnt = '01'; // Personel için CNT her zaman 01
            
            // Ana FTP için dosya
            $filenameMain = BtkHelper::generateReportFilename($operatorName, $operatorCode, null, 'PERSONEL_LISTESI', $cnt, $now->getTimestamp(), 'main');
            if (!$filenameMain) { BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'HATA', "Ana FTP için personel dosya adı oluşturulamadı."); 
            } else {
                $excelFilePathMain = ExcelExporter::exportPersonelList($personelData, $filenameMain, false, $tempDir);
                if ($excelFilePathMain && file_exists($excelFilePathMain)) {
                    $uploadResultMain = BtkHelper::uploadFileToFtp($excelFilePathMain, $filenameMain, 'main', 'PERSONEL');
                    BtkHelper::logFtpSubmission($filenameMain, 'PERSONEL', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cnt, $uploadResultMain['message']);
                    @unlink($excelFilePathMain);
                } else { BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'HATA', "Ana FTP için Excel dosyası ($filenameMain) oluşturulamadı veya kaydedilemedi.");}
            }

            // Yedek FTP için dosya (etkinse)
            if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                $filenameBackup = BtkHelper::generateReportFilename($operatorName, $operatorCode, null, 'PERSONEL_LISTESI', $cnt, $now->getTimestamp(), 'backup');
                if (!$filenameBackup) { BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'HATA', "Yedek FTP için personel dosya adı oluşturulamadı.");
                } else {
                    // Aynı personel verisiyle farklı bir isimle dosya oluştur veya aynı dosyayı tekrar yükle
                    // Eğer dosya isimleri farklıysa, yeniden export etmek gerekir.
                    $excelFilePathBackup = ExcelExporter::exportPersonelList($personelData, $filenameBackup, false, $tempDir);
                    if ($excelFilePathBackup && file_exists($excelFilePathBackup)) {
                        $uploadResultBackup = BtkHelper::uploadFileToFtp($excelFilePathBackup, $filenameBackup, 'backup', 'PERSONEL');
                        BtkHelper::logFtpSubmission($filenameBackup, 'PERSONEL', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cnt, $uploadResultBackup['message']);
                        @unlink($excelFilePathBackup);
                    } else { BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'HATA', "Yedek FTP için Excel dosyası ($filenameBackup) oluşturulamadı veya kaydedilemedi.");}
                }
            }
        } else { BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'INFO', "Oluşturulacak personel verisi bulunamadı ve boş rapor gönderimi kapalı.");}
        BtkHelper::set_btk_setting('last_personel_submission', gmdate('Y-m-d H:i:s'));
    }
} catch (Exception $e) { BtkHelper::logAction('PERSONEL LİSTESİ Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); }


BtkHelper::logAction('BTK Cron Tamamlandı', 'INFO', 'BTK Raporlama Otomatik Cron Job tamamlandı.');
echo "BTK Raporlama Otomatik Cron Job tamamlandı.\n";

exit(0); // Başarılı çıkış
?>