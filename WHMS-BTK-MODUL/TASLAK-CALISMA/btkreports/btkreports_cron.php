<?php
/**
 * WHMCS BTK Raporlama Modülü - Cron Job Dosyası
 *
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 * ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını oluşturur ve FTP'ye yükler.
 *
 * Önerilen Çalıştırma Yöntemi:
 * WHMCS Admin Paneli -> Kurulum -> Otomasyon Ayarları -> Özel Cron Tanımları (Custom Crons)
 * veya WHMCS 8+ için modülün kendi cron hook'u (_cron) kullanılabilir.
 *
 * Bağımsız çalıştırma için (test amaçlı):
 * /usr/bin/php -q /path/to/whmcs_root/modules/addons/btkreports/btkreports_cron.php
 * (Bu durumda WHMCS init.php dosyasının doğru şekilde dahil edilmesi önemlidir.)
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

// WHMCS kök dizinini bul ve WHMCS'i başlat
if (php_sapi_name() != 'cli') {
    die("This script can only be run via the command line.");
}

// WHMCS Kök dizinini bulmaya çalış
// Bu yol, cron dosyasının modules/addons/btkreports/ altında olduğunu varsayar.
$whmcsRootDir = realpath(dirname(__FILE__) . '/../../../..'); 

if (file_exists($whmcsRootDir . '/init.php')) {
    require_once $whmcsRootDir . '/init.php';
} else {
    // Alternatif init.php arama yolları denenebilir veya hata verilir.
    $alternativePath1 = realpath(dirname(__FILE__) . '/../../../../init.php'); // Bir üst dizin için
     if (file_exists($alternativePath1)) {
        require_once $alternativePath1;
    } else {
        echo "WHMCS init.php dosyası bulunamadı. Cron çalıştırılamıyor.\n";
        error_log("BTK Reports Cron Error: WHMCS init.php not found.");
        exit(1); // Hata koduyla çık
    }
}

// Gerekli yardımcı dosyaları ve sınıfları dahil et
$basePath = __DIR__ . '/lib/';
$helperLoaded = false; $excelLoaded = false; $composerLoaded = false;

if (file_exists($basePath . 'BtkHelper.php')) {
    require_once $basePath . 'BtkHelper.php';
    if (class_exists('BtkHelper')) $helperLoaded = true;
}
if (file_exists($basePath . 'ExcelExporter.php')) {
    require_once $basePath . 'ExcelExporter.php';
    if (class_exists('ExcelExporter')) $excelLoaded = true;
}
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
    if (class_exists('Cron\CronExpression')) $composerLoaded = true;
}

if (!$helperLoaded) {
    echo "BtkHelper.php bulunamadı veya yüklenemedi. Cron çalıştırılamıyor.\n";
    error_log("BTK Reports Cron Critical Error: BtkHelper.php not found or failed to load.");
    exit(1);
}
if (!$composerLoaded) {
    BtkHelper::logAction('BTK Cron Hatası', 'CRITICAL', 'Composer autoload.php veya CronExpression kütüphanesi bulunamadı!');
    echo "Composer autoload.php veya CronExpression kütüphanesi bulunamadı. Cron çalıştırılamıyor.\n";
    exit(1);
}
// ExcelExporter sadece personel raporu için gerekli, o kısımda kontrol edilecek.


BtkHelper::logAction('BTK Cron Başladı', 'INFO', 'BTK Raporlama Otomatik Cron Job başlatıldı.');
echo "BTK Raporlama Otomatik Cron Job başlatıldı...\n";

// ------------------- CRON İŞLEMLERİ -------------------
$operatorCode = BtkHelper::get_btk_setting('operator_code');
$operatorName = BtkHelper::get_btk_setting('operator_name');
$sendEmptyReports = (BtkHelper::get_btk_setting('send_empty_reports') === '1');
$tempDir = sys_get_temp_dir();

if (empty($operatorCode) || empty($operatorName)) {
    $errorMsg = 'Operatör Kodu veya Operatör Adı ayarlanmamış. Raporlar oluşturulamıyor.';
    BtkHelper::logAction('BTK Cron Hatası', 'CRITICAL', $errorMsg);
    echo $errorMsg . "\n";
    exit(1);
}

$now = new DateTime('now', new DateTimeZone('UTC')); // Tüm zamanlamaları UTC'ye göre yapalım
$aktifYetkiGruplari = BtkHelper::getAktifYetkiTurleri('array_grup_names_only'); // ['ISS', 'AIH', ...]

// --- ABONE REHBER Raporu ---
try {
    $rehberCronSchedule = BtkHelper::get_btk_setting('rehber_cron_schedule', '0 10 1 * *');
    $cronRehber = Cron\CronExpression::factory($rehberCronSchedule);
    if ($cronRehber->isDue($now)) {
        BtkHelper::logAction('ABONE REHBER Cron', 'INFO', 'ABONE REHBER raporu oluşturulma zamanı geldi.');
        
        if (empty($aktifYetkiGruplari) && !$sendEmptyReports) {
             BtkHelper::logAction('ABONE REHBER Cron', 'INFO', 'Aktif yetki türü grubu bulunamadı ve boş rapor gönderimi kapalı. REHBER raporu atlanıyor.');
        } else {
            $gruplarToProcess = !empty($aktifYetkiGruplari) ? $aktifYetkiGruplari : ['DEFAULT']; // Aktif grup yoksa ve boş rapor gönderilecekse, "DEFAULT" gibi bir grup adı kullanılabilir.

            foreach ($gruplarToProcess as $grup) {
                $yetkiGrupForFilename = ($grup === 'DEFAULT' && empty($aktifYetkiGruplari)) ? 'GENEL' : $grup; // Boşsa GENEL gibi bir ifade
                BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "$yetkiGrupForFilename grubu için REHBER raporu oluşturuluyor...");
                
                $rehberData = BtkHelper::getAboneRehberData($grup); // Bu fonksiyon yetki grubuna göre filtrelemeli
                
                if (!empty($rehberData) || $sendEmptyReports) {
                    $cntMain = BtkHelper::getNextCnt($operatorName . '_' . $operatorCode . '_' . $yetkiGrupForFilename . '_ABONE_REHBER_', 'REHBER', 'ANA');
                    $filenameBase = BtkHelper::generateReportFilename($operatorName, $operatorCode, $yetkiGrupForFilename, 'ABONE_REHBER', $cntMain, $now->getTimestamp());
                    $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBase . '.abn';
                    
                    $abnContent = "";
                    $btkAlanSiralamasi = BtkHelper::getBtkAlanSiralamasi('REHBER'); // Alan sıralamasını al
                    if (empty($btkAlanSiralamasi)) {
                         BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$yetkiGrupForFilename grubu için BTK alan sıralaması alınamadı.");
                         continue; // Bu grup için sonraki adıma geç
                    }
                    foreach ($rehberData as $row) {
                        $abnContent .= BtkHelper::formatAbnRow((array)$row, $btkAlanSiralamasi) . "\n";
                    }
                    file_put_contents($abnFilePath, $abnContent);
                    
                    $gzFilePath = BtkHelper::compressToGz($abnFilePath);
                    if ($gzFilePath) {
                        $gzFileName = basename($gzFilePath);
                        // Ana FTP'ye Yükle
                        $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main');
                        BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntMain, $uploadResultMain['message'], $yetkiGrupForFilename);

                        // Yedek FTP'ye Yükle (etkinse)
                        if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                            $cntBackup = BtkHelper::getNextCnt($operatorName . '_' . $operatorCode . '_' . $yetkiGrupForFilename . '_ABONE_REHBER_', 'REHBER', 'YEDEK'); // Yedek için ayrı CNT takibi
                            // Dosya adı yedek için farklıysa generateReportFilename güncellenmeli veya burada yeniden oluşturulmalı.
                            // Şimdilik aynı dosya adını kullandığımızı varsayalım, sadece CNT farklı olabilir.
                            $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup'); // Aynı dosya, farklı hedef
                            BtkHelper::logFtpSubmission($gzFileName, 'REHBER', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntBackup, $uploadResultBackup['message'], $yetkiGrupForFilename);
                        }
                        @unlink($abnFilePath);
                        @unlink($gzFilePath);
                    } else {
                        BtkHelper::logAction('ABONE REHBER Cron', 'HATA', "$yetkiGrupForFilename grubu için $abnFilePath dosyası sıkıştırılamadı.");
                    }
                } else {
                   BtkHelper::logAction('ABONE REHBER Cron', 'INFO', "$yetkiGrupForFilename grubu için oluşturulacak REHBER verisi bulunamadı ve boş rapor gönderimi kapalı.");
                }
            }
            BtkHelper::set_btk_setting('last_rehber_submission', gmdate('Y-m-d H:i:s'));
        }
    }
} catch (Exception $e) {
    BtkHelper::logAction('ABONE REHBER Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString());
}

// --- ABONE HAREKET Raporu ---
try {
    $hareketCronSchedule = BtkHelper::get_btk_setting('hareket_cron_schedule', '0 1 * * *');
    $cronHareket = Cron\CronExpression::factory($hareketCronSchedule);
    if ($cronHareket->isDue($now)) {
        BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', 'ABONE HAREKET raporu oluşturulma zamanı geldi.');
        BtkHelper::archiveOldHareketler(); // Önce eski gönderilmiş hareketleri arşivle

        if (empty($aktifYetkiGruplari) && !$sendEmptyReports) {
             BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', 'Aktif yetki türü grubu bulunamadı ve boş rapor gönderimi kapalı. HAREKET raporu atlanıyor.');
        } else {
            $gruplarToProcess = !empty($aktifYetkiGruplari) ? $aktifYetkiGruplari : ['DEFAULT'];

            foreach ($gruplarToProcess as $grup) {
                $yetkiGrupForFilename = ($grup === 'DEFAULT' && empty($aktifYetkiGruplari)) ? 'GENEL' : $grup;
                BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "$yetkiGrupForFilename grubu için HAREKET raporu oluşturuluyor...");
                
                $hareketData = BtkHelper::getAboneHareketData($grup); // Sadece gönderilmemiş olanları ve ilgili grubu çeker
                
                if (!empty($hareketData) || $sendEmptyReports) {
                    $gonderilecekHareketIdleri = array_map(function($h){ return $h->id; }, $hareketData); // BtkHelper::getAboneHareketData objelerden oluşan bir array dönmeli

                    $cntMain = BtkHelper::getNextCnt($operatorName . '_' . $operatorCode . '_' . $yetkiGrupForFilename . '_ABONE_HAREKET_', 'HAREKET', 'ANA');
                    $filenameBase = BtkHelper::generateReportFilename($operatorName, $operatorCode, $yetkiGrupForFilename, 'ABONE_HAREKET', $cntMain, $now->getTimestamp());
                    $abnFilePath = $tempDir . DIRECTORY_SEPARATOR . $filenameBase . '.abn';
                    
                    $abnContent = "";
                    $btkAlanSiralamasi = BtkHelper::getBtkAlanSiralamasi('HAREKET'); // Hareket için de aynı sıralama varsayılıyor
                    if (empty($btkAlanSiralamasi)) {
                         BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$yetkiGrupForFilename grubu için BTK alan sıralaması alınamadı.");
                         continue;
                    }
                    foreach ($hareketData as $row) {
                        $abnContent .= BtkHelper::formatAbnRow((array)$row, $btkAlanSiralamasi, true) . "\n"; // true: isHareket
                    }
                    file_put_contents($abnFilePath, $abnContent);
                    
                    $gzFilePath = BtkHelper::compressToGz($abnFilePath);
                    if ($gzFilePath) {
                        $gzFileName = basename($gzFilePath);
                        $uploadResultMain = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'main');
                        BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntMain, $uploadResultMain['message'], $yetkiGrupForFilename);

                        if ($uploadResultMain['status'] === 'success') {
                            BtkHelper::markHareketAsGonderildi($gonderilecekHareketIdleri, $gzFileName, $cntMain);
                        }

                        if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                            $cntBackup = BtkHelper::getNextCnt($operatorName . '_' . $operatorCode . '_' . $yetkiGrupForFilename . '_ABONE_HAREKET_', 'HAREKET', 'YEDEK');
                            $uploadResultBackup = BtkHelper::uploadFileToFtp($gzFilePath, $gzFileName, 'backup');
                            BtkHelper::logFtpSubmission($gzFileName, 'HAREKET', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cntBackup, $uploadResultBackup['message'], $yetkiGrupForFilename);
                        }
                        @unlink($abnFilePath);
                        @unlink($gzFilePath);
                    } else {
                         BtkHelper::logAction('ABONE HAREKET Cron', 'HATA', "$yetkiGrupForFilename grubu için $abnFilePath dosyası sıkıştırılamadı.");
                    }
                } else {
                   BtkHelper::logAction('ABONE HAREKET Cron', 'INFO', "$yetkiGrupForFilename grubu için oluşturulacak HAREKET verisi bulunamadı ve boş rapor gönderimi kapalı.");
                }
            }
            BtkHelper::set_btk_setting('last_hareket_submission', gmdate('Y-m-d H:i:s'));
        }
    }
} catch (Exception $e) {
    BtkHelper::logAction('ABONE HAREKET Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString());
}

// --- PERSONEL LİSTESİ Raporu ---
try {
    if (!$excelLoaded) {
        BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'UYARI', 'ExcelExporter.php yüklenemediği için Personel Raporu oluşturulamıyor.');
    } else {
        $personelCronSchedule = BtkHelper::get_btk_setting('personel_cron_schedule', '0 16 L 6,12 *');
        $cronPersonel = Cron\CronExpression::factory($personelCronSchedule);
        if ($cronPersonel->isDue($now)) {
            BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'INFO', 'PERSONEL LİSTESİ raporu oluşturulma zamanı geldi.');
            $personelData = BtkHelper::getPersonelDataForReport();
            
            if (!empty($personelData) || $sendEmptyReports) {
                $cnt = '01'; // Personel için CNT her zaman 01
                // Ana FTP için dosya adı
                $filenameMain = BtkHelper::generateReportFilename($operatorName, $operatorCode, null, 'PERSONEL_LISTESI', $cnt, $now->getTimestamp(), 'main') . '.xlsx';
                $excelFilePathMain = $tempDir . DIRECTORY_SEPARATOR . uniqid('btk_personel_main_') . '.xlsx'; // Geçici dosya
                
                $exportResultMain = ExcelExporter::exportPersonelList($personelData, $filenameMain, false, $tempDir);
                if ($exportResultMain && file_exists($exportResultMain)) { // $exportResultMain dosya yolunu döndürür
                    $uploadResultMain = BtkHelper::uploadFileToFtp($exportResultMain, $filenameMain, 'main');
                    BtkHelper::logFtpSubmission($filenameMain, 'PERSONEL', 'ANA', $uploadResultMain['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cnt, $uploadResultMain['message']);
                    @unlink($exportResultMain);

                    if (BtkHelper::get_btk_setting('backup_ftp_enabled') === '1') {
                        $filenameBackup = BtkHelper::generateReportFilename($operatorName, $operatorCode, null, 'PERSONEL_LISTESI', $cnt, $now->getTimestamp(), 'backup') . '.xlsx';
                        $excelFilePathBackup = $tempDir . DIRECTORY_SEPARATOR . uniqid('btk_personel_backup_') . '.xlsx';
                        
                        // Dosyayı yeniden oluşturmak yerine kopyalayabiliriz eğer isimler aynı olacaksa
                        // Veya exportPersonelList'i farklı isimle tekrar çağırabiliriz
                        $exportResultBackup = ExcelExporter::exportPersonelList($personelData, $filenameBackup, false, $tempDir);
                         if ($exportResultBackup && file_exists($exportResultBackup)) {
                            $uploadResultBackup = BtkHelper::uploadFileToFtp($exportResultBackup, $filenameBackup, 'backup');
                            BtkHelper::logFtpSubmission($filenameBackup, 'PERSONEL', 'YEDEK', $uploadResultBackup['status'] === 'success' ? 'Basarili' : 'Basarisiz', $cnt, $uploadResultBackup['message']);
                            @unlink($exportResultBackup);
                         }
                    }
                } else {
                    BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'HATA', "Excel dosyası oluşturulamadı veya kaydedilemedi.");
                }
            } else {
                BtkHelper::logAction('PERSONEL LİSTESİ Cron', 'INFO', "Oluşturulacak personel verisi bulunamadı ve boş rapor gönderimi kapalı.");
            }
            BtkHelper::set_btk_setting('last_personel_submission', gmdate('Y-m-d H:i:s'));
        }
    }
} catch (Exception $e) {
    BtkHelper::logAction('PERSONEL LİSTESİ Cron Genel Hata', 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString());
}

BtkHelper::logAction('BTK Cron Tamamlandı', 'INFO', 'BTK Raporlama Otomatik Cron Job tamamlandı.');
echo "BTK Raporlama Otomatik Cron Job tamamlandı.\n";

exit(0); // Başarılı çıkış
?>