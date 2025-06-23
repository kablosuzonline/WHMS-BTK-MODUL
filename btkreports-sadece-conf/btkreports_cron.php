<?php
/**
 * WHMCS BTK Raporlama Modülü - Cron İşlemleri - V5.0.0 - Yeni Nesil
 *
 * Bu dosya, WHMCS cron sistemi tarafından periyodik olarak çalıştırılır.
 * ABONE REHBER, ABONE HAREKET ve PERSONEL LİSTESİ raporlarını oluşturur,
 * sıkıştırır ve FTP sunucularına yükler.
 */

// WHMCS ortamını yükle
if (php_sapi_name() === 'cli') {
    // WHMCS kök dizinini doğru şekilde belirleyin. Genellikle 3 seviye yukarıdır.
    // Örnek: /var/www/html/whmcs/modules/addons/btkreports/btkreports_cron.php -> /var/www/html/whmcs/
    $whmcsBasePath = realpath(dirname(__FILE__) . '/../../../');
    if (file_exists($whmcsBasePath . '/init.php')) {
        require_once $whmcsBasePath . '/init.php';
    } else {
        // init.php bulunamazsa, bir üst dizinde olabilir (modülün WHMCS kök dizininde olduğu durumlar için)
        $whmcsBasePath = realpath(dirname(__FILE__) . '/../../');
        if (file_exists($whmcsBasePath . '/init.php')) {
            require_once $whmcsBasePath . '/init.php';
        } else {
            // Cron CLI'dan çalıştırılıyorsa ve init.php bulunamıyorsa, manuel loglama yap ve çık.
            $logMessage = date('[Y-m-d H:i:s]') . " [BTK CRON FATAL] WHMCS init.php dosyası bulunamadı. WHMCS_BASE_PATH: " . ($whmcsBasePath ?: 'Belirlenemedi') . "\n";
            $logFilePath = dirname(__FILE__) . '/btk_cron_error.log'; // Modül klasörüne logla
            file_put_contents($logFilePath, $logMessage, FILE_APPEND);
            die("WHMCS init.php dosyası bulunamadı. Lütfen yolu kontrol edin.\n");
        }
    }
} elseif (!defined("WHMCS")) {
    // Tarayıcıdan veya bilinmeyen bir yerden doğrudan erişimi engelle
    die("This file cannot be accessed directly outside of WHMCS environment.");
}

use WHMCS\Database\Capsule;
// Cron Expression Parser kütüphanesini dahil et (Composer ile yüklenmiş olmalı)
// WHMCS içinde veya modülün vendor klasöründe olabilir.
// use Cron\CronExpression; // Bu satır, eğer autoload ile yüklenmiyorsa ve namespace'i elle belirtmek gerekirse.

// Helper dosyamızı dahil edelim (tüm iş mantığı burada)
if (file_exists(dirname(__FILE__) . '/lib/btkhelper.php')) {
    require_once dirname(__FILE__) . '/lib/btkhelper.php';
} else {
    $logMessageForHelper = date('[Y-m-d H:i:s]') . " [BTK CRON FATAL] lib/btkhelper.php dosyası bulunamadı.\n";
    if(function_exists('logActivity')) { // WHMCS context'indeyse logActivity kullan
        logActivity("BTK Cron: lib/btkhelper.php dosyası bulunamadı! Cron çalıştırılamıyor.");
    } else { // CLI'daysa ve logActivity yoksa, dosyaya yaz
        file_put_contents(dirname(__FILE__) . '/btk_cron_error.log', $logMessageForHelper, FILE_APPEND);
    }
    die("BTK Helper dosyası bulunamadı.\n");
}

// Vendor autoload (eğer composer kullanılıyorsa ve harici kütüphaneler oradan geliyorsa)
$vendorAutoload = dirname(__FILE__) . '/vendor/autoload.php';
if (file_exists($vendorAutoload)) {
    require_once $vendorAutoload;
}

// Loglama fonksiyonunun varlığını kontrol et
if (!function_exists('btk_log_module_action')) {
    $logMessageForLogFunc = date('[Y-m-d H:i:s]') . " [BTK CRON FATAL] btk_log_module_action fonksiyonu (btkhelper.php içinde) bulunamadı.\n";
    if(function_exists('logActivity')) logActivity("BTK Cron: btk_log_module_action fonksiyonu bulunamadı!");
    else file_put_contents(dirname(__FILE__) . '/btk_cron_error.log', $logMessageForLogFunc, FILE_APPEND);
    die("Gerekli loglama fonksiyonu eksik.\n");
}

// Cron çalıştırılırken kullanılacak admin ID (loglama için, 0 olabilir veya sistem admin ID'si)
$GLOBALS['cron_admin_id'] = 0; // Varsayılan olarak sistem işlemi (admin ID 0)

btk_log_module_action("BTK Cron Görevi Başlatıldı.", "CRON_INFO");

// --- TEMEL AYARLARI ÇEK ---
$operatorCode = btk_get_module_setting('operator_code');
$operatorName = btk_get_module_setting('operator_name');
$operatorUnvani = btk_get_module_setting('operator_unvani');

if (empty($operatorCode) || empty($operatorName) || empty($operatorUnvani)) {
    btk_log_module_action("CRON UYARI: Operatör Kodu, Operatör Adı veya Operatör Unvanı ayarlarından biri veya birkaçı eksik. Raporlama yapılamayabilir.", "CRITICAL_ERROR");
    // die("Operatör Kodu, Adı veya Unvanı ayarlanmamış.\n"); // Raporlamayı tamamen durdurmak yerine uyarı verip devam edebilir.
}

$now = new DateTime(); // Cron'un çalıştığı anki zaman

/**
 * Verilen cron ifadesinin şu anki zamana uyup uymadığını kontrol eder.
 * @param string $cronExpression Cron ifadesi (örn: "0 1 * * *")
 * @param DateTime $dateTime Kontrol edilecek zaman
 * @return bool Raporun zamanı gelmişse true, aksi halde false.
 */
function btk_is_cron_due_advanced($cronExpression, DateTime $dateTime) {
    if (!class_exists('Cron\CronExpression')) {
        btk_log_module_action("CRON KRİTİK UYARI: CronExpression kütüphanesi bulunamadı! Zamanlama kontrolü yapılamayacak. Lütfen 'composer require dragonmantank/cron-expression' komutu ile yükleyin veya modülün 'vendor' klasörünü kontrol edin. Bu rapor atlanacak.", "CRITICAL_ERROR");
        return false; // Kütüphane yoksa, bu raporu güvenli bir şekilde atla.
    }
    try {
        if (!Cron\CronExpression::isValidExpression($cronExpression)) {
            btk_log_module_action("Geçersiz Cron ifadesi: {$cronExpression}. Bu rapor atlanacak.", "CRON_ERROR");
            return false;
        }
        $cron = Cron\CronExpression::factory($cronExpression);
        return $cron->isDue($dateTime);
    } catch (\InvalidArgumentException $e) {
        btk_log_module_action("Cron ifadesi parse edilirken hata (InvalidArgumentException): {$cronExpression} - " . $e->getMessage() . ". Bu rapor atlanacak.", "CRON_ERROR");
        return false;
    } catch (\Exception $e) {
        btk_log_module_action("Cron ifadesi parse edilirken genel hata: {$cronExpression} - " . $e->getMessage() . ". Bu rapor atlanacak.", "CRON_ERROR");
        return false;
    }
}

// 1. ABONE REHBER RAPORU
$rehberCronSchedule = btk_get_module_setting('rehber_cron_schedule', '0 2 1 * *'); // Varsayılan: Her ayın 1'i 02:00
if (btk_is_cron_due_advanced($rehberCronSchedule, $now)) {
    btk_log_module_action("CRON: ABONE REHBER raporu oluşturma zamanı geldi.", "CRON_INFO");
    $activeYetkiTurleri = Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->get();
    if ($activeYetkiTurleri->isEmpty()){
        btk_log_module_action("CRON: ABONE REHBER için aktif yetki türü bulunamadı. Rapor üretilmeyecek.", "CRON_WARNING");
    } else {
        foreach ($activeYetkiTurleri as $yetki) {
            if (function_exists('btk_generate_abone_rehber_report')) {
                $reportTimestamp = date('YmdHis'); // Her rapor için ayrı timestamp
                btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} için ABONE REHBER raporu oluşturuluyor (Zaman Damgası: {$reportTimestamp}).", "CRON_PROCESS");
                $result = btk_generate_abone_rehber_report($operatorCode, $operatorName, $yetki->btk_dosya_tip_kodu, $reportTimestamp, (bool)$yetki->bos_dosya_gonder);
                if (isset($result['status']) && ($result['status'] === 'success' || $result['status'] === 'partial_error')) { // partial_error da loglanmalı
                    btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} ABONE REHBER rapor sonucu: {$result['status']}, Dosya: {$result['filename']}", ($result['status'] === 'success' ? "CRON_SUCCESS" : "CRON_WARNING"), ['ftp_message' => $result['message'] ?? '']);
                } elseif (isset($result['status']) && $result['status'] === 'info') {
                     btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} ABONE REHBER bilgi: " . ($result['message'] ?? 'Bilgi mesajı'), "CRON_INFO");
                } else {
                    btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} ABONE REHBER oluşturulurken/gönderilirken hata: " . ($result['message'] ?? 'Bilinmeyen hata'), "CRON_ERROR", ['ftp_message' => $result['message'] ?? '']);
                }
            } else {
                btk_log_module_action("CRON KRİTİK HATA: btk_generate_abone_rehber_report fonksiyonu bulunamadı.", "CRITICAL_ERROR");
            }
        }
    }
} else {
    btk_log_module_action("CRON DEBUG: ABONE REHBER raporu için zamanlama uygun değil. Mevcut: {$now->format('Y-m-d H:i:s')}, Beklenen: {$rehberCronSchedule}", "CRON_DEBUG");
}

// 2. ABONE HAREKET RAPORU
$hareketCronSchedule = btk_get_module_setting('hareket_cron_schedule', '0 1 * * *'); // Varsayılan: Her gün 01:00
if (btk_is_cron_due_advanced($hareketCronSchedule, $now)) {
    btk_log_module_action("CRON: ABONE HAREKET raporu oluşturma zamanı geldi.", "CRON_INFO");
    $activeYetkiTurleri = Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->get();
    if ($activeYetkiTurleri->isEmpty()){
        btk_log_module_action("CRON: ABONE HAREKET için aktif yetki türü bulunamadı. Rapor üretilmeyecek.", "CRON_WARNING");
    } else {
        foreach ($activeYetkiTurleri as $yetki) {
             if (function_exists('btk_generate_abone_hareket_report')) {
                $reportTimestamp = date('YmdHis');
                btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} için ABONE HAREKET raporu oluşturuluyor (Zaman Damgası: {$reportTimestamp}).", "CRON_PROCESS");
                $result = btk_generate_abone_hareket_report($operatorCode, $operatorName, $yetki->btk_dosya_tip_kodu, $reportTimestamp, (bool)$yetki->bos_dosya_gonder);
                 if (isset($result['status']) && ($result['status'] === 'success' || $result['status'] === 'partial_error')) {
                    btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} ABONE HAREKET rapor sonucu: {$result['status']}, Dosya: {$result['filename']}", ($result['status'] === 'success' ? "CRON_SUCCESS" : "CRON_WARNING"), ['ftp_message' => $result['message'] ?? '']);
                } elseif (isset($result['status']) && $result['status'] === 'info') {
                     btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} ABONE HAREKET bilgi: " . ($result['message'] ?? 'Bilgi mesajı'), "CRON_INFO");
                } else {
                    btk_log_module_action("CRON: {$yetki->btk_dosya_tip_kodu} ABONE HAREKET oluşturulurken/gönderilirken hata: " . ($result['message'] ?? 'Bilinmeyen hata'), "CRON_ERROR", ['ftp_message' => $result['message'] ?? '']);
                }
            } else {
                btk_log_module_action("CRON KRİTİK HATA: btk_generate_abone_hareket_report fonksiyonu bulunamadı.", "CRITICAL_ERROR");
            }
        }
    }
} else {
     btk_log_module_action("CRON DEBUG: ABONE HAREKET raporu için zamanlama uygun değil. Mevcut: {$now->format('Y-m-d H:i:s')}, Beklenen: {$hareketCronSchedule}", "CRON_DEBUG");
}

// 3. PERSONEL LİSTESİ RAPORU
$personelCronHaziran = btk_get_module_setting('personel_cron_schedule_haziran', '0 3 L 6 *'); // Varsayılan: Haziran son günü 03:00
$personelCronAralik = btk_get_module_setting('personel_cron_schedule_aralik', '0 3 L 12 *'); // Varsayılan: Aralık son günü 03:00

if (btk_is_cron_due_advanced($personelCronHaziran, $now) || btk_is_cron_due_advanced($personelCronAralik, $now)) {
    btk_log_module_action("CRON: PERSONEL LİSTESİ raporu oluşturma zamanı geldi.", "CRON_INFO");
    if (function_exists('btk_generate_personel_report')) {
        $personelReportTimeForFilename = $now->format('Y_m'); // Dosya adı için YYYY_MM formatı
        $result = btk_generate_personel_report($operatorName, $operatorUnvani, $personelReportTimeForFilename);
         if (isset($result['status']) && ($result['status'] === 'success' || $result['status'] === 'partial_error')) {
            btk_log_module_action("CRON: PERSONEL LİSTESİ rapor sonucu: {$result['status']}, Dosya: {$result['filename']}", ($result['status'] === 'success' ? "CRON_SUCCESS" : "CRON_WARNING"), ['ftp_message' => $result['message'] ?? '']);
        } elseif (isset($result['status']) && $result['status'] === 'info') {
             btk_log_module_action("CRON: PERSONEL LİSTESİ bilgi: " . ($result['message'] ?? 'Bilgi mesajı'), "CRON_INFO");
        } else {
            btk_log_module_action("CRON: PERSONEL LİSTESİ oluşturulurken/gönderilirken hata: " . ($result['message'] ?? 'Bilinmeyen hata'), "CRON_ERROR", ['ftp_message' => $result['message'] ?? '']);
        }
    } else {
        btk_log_module_action("CRON KRİTİK HATA: btk_generate_personel_report fonksiyonu bulunamadı.", "CRITICAL_ERROR");
    }
} else {
    btk_log_module_action("CRON DEBUG: PERSONEL LİSTESİ raporu için zamanlama uygun değil. Mevcut: {$now->format('Y-m-d H:i:s')}, Beklenen Haziran: {$personelCronHaziran}, Beklenen Aralık: {$personelCronAralik}", "CRON_DEBUG");
}

// 4. HAREKET ARŞİVLEME
if (function_exists('btk_archive_old_movements')) {
    $archivePeriodMonths = (int)btk_get_module_setting('hareket_arsivleme_periyodu_ay', 6);
    if ($archivePeriodMonths > 0) {
        // Örneğin her ayın ilk günü gece 04:00'te çalıştır
        if (btk_is_cron_due_advanced("0 4 1 * *", $now)) {
            btk_log_module_action("CRON: Eski abone hareketlerini arşivleme işlemi başlatılıyor (Periyot: {$archivePeriodMonths} ay).", "CRON_PROCESS");
            btk_archive_old_movements($archivePeriodMonths);
        }
    } else {
         btk_log_module_action("CRON DEBUG: Hareket arşivleme periyodu 0 veya ayarlanmamış, arşivleme yapılmayacak.", "CRON_DEBUG");
    }
} else {
    btk_log_module_action("CRON UYARI: btk_archive_old_movements fonksiyonu bulunamadı. Hareket arşivleme yapılamayacak.", "CRON_WARNING");
}

btk_log_module_action("BTK Cron Görevi Tamamlandı.", "CRON_INFO");
echo "BTK Cron işlemleri tamamlandı.\n"; // Cron çıktısı için

?>