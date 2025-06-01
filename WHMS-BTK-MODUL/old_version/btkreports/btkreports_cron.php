#!/usr/local/bin/php
<?php
// modules/addons/btkreports/btkreports_cron.php (v1.0.22)

// WHMCS Kurulum Kök Dizinini Belirle
// Bu yol, cron'un çalıştığı ortama ve WHMCS kurulumunuza göre ayarlanmalıdır.
// Genellikle WHMCS kök dizininin bir üst seviyesinde olabilir.
// Örnek yollar:
// $whmcsRootDir = dirname(dirname(dirname(dirname(__FILE__)))); // Eğer /modules/addons/btkreports/btkreports_cron.php ise
// $whmcsRootDir = dirname(__FILE__) . '/../../../..'; // Eğer /crons/btkreports_cron.php ise (WHMCS cron klasöründe)
// Lütfen bu yolu kendi sunucu yapınıza göre güncelleyin.
// En güvenli yol, WHMCS'in init.php dosyasının yolunu tam olarak bilmektir.
$possiblePaths = [
    dirname(dirname(dirname(dirname(__FILE__)))), // /modules/addons/btkreports/ -> ../../../../
    dirname(__FILE__) . '/../../..',           // /crons/ -> ../../..
    '/home/user/public_html/whmcs',           // Örnek mutlak yol
    '/var/www/html/whmcs',                    // Başka bir örnek mutlak yol
    '/var/www/vhosts/siteniz.com/httpdocs/whmcs', // Hosting paneli örneği
];

$whmcsInitPath = '';
foreach ($possiblePaths as $path) {
    if (file_exists($path . '/init.php')) {
        $whmcsInitPath = $path . '/init.php';
        break;
    }
}

if (empty($whmcsInitPath)) {
    $cronErrorMsg = "FATAL ERROR: WHMCS init.php could not be found in any of the predefined paths. Please check the path in btkreports_cron.php.\n";
    echo $cronErrorMsg;
    error_log("BTK Reports CRON: " . $cronErrorMsg);
    exit(1);
}

require_once $whmcsInitPath;

// Modülün ana PHP dosyasını dahil et (fonksiyonları kullanmak için)
if (file_exists(__DIR__ . '/btkreports.php')) {
    require_once __DIR__ . '/btkreports.php';
} else {
    $cronErrorMsg = "BTK Reports CRON Error: btkreports.php not found in " . __DIR__ . ". Cron cannot run.\n";
    echo $cronErrorMsg;
    if (function_exists('logActivity')) {
        logActivity($cronErrorMsg, 0);
    } else {
        error_log("BTK Reports CRON: " . $cronErrorMsg);
    }
    exit(1);
}

// Global dil değişkenini cron için de yükleyelim (log mesajları için)
global $_ADDONLANG;
if (empty($_ADDONLANG) && file_exists(__DIR__ . '/lang/turkish.php')) {
    require_once __DIR__ . '/lang/turkish.php';
}
// Dil fallback'leri
if (empty($_ADDONLANG) || !is_array($_ADDONLANG)) {
    $_ADDONLANG = [];
    // Temel cron mesajları için fallback'ler
    $_ADDONLANG['btkreports_cron_job_starting'] = 'BTK Raporlama Cron İşlemi Başlatılıyor...';
    $_ADDONLANG['btkreports_cron_rehber_generating'] = 'REHBER raporu oluşturuluyor...';
    $_ADDONLANG['btkreports_cron_rehber_success'] = 'REHBER raporu (%s) başarıyla oluşturuldu ve FTP\'ye yüklendi.';
    $_ADDONLANG['btkreports_cron_rehber_ftp_fail'] = 'REHBER raporu (%s) oluşturuldu ancak FTP\'ye yüklenemedi: %s';
    $_ADDONLANG['btkreports_cron_rehber_gen_fail'] = 'REHBER raporu oluşturulamadı veya raporlanacak abone yok.';
    $_ADDONLANG['btkreports_cron_hareket_generating'] = 'HAREKET raporu oluşturuluyor...';
    $_ADDONLANG['btkreports_cron_hareket_success'] = 'HAREKET raporu (%s) başarıyla oluşturuldu ve FTP\'ye yüklendi.';
    $_ADDONLANG['btkreports_cron_hareket_ftp_fail'] = 'HAREKET raporu (%s) oluşturuldu ancak FTP\'ye yüklenemedi: %s';
    $_ADDONLANG['btkreports_cron_hareket_gen_fail'] = 'HAREKET raporu oluşturulamadı veya raporlanacak hareket yok.';
    $_ADDONLANG['btkreports_cron_personel_generating'] = 'PERSONEL raporu oluşturuluyor (%s dönemi)...';
    $_ADDONLANG['btkreports_cron_personel_success'] = 'PERSONEL raporu (%s) başarıyla oluşturuldu ve FTP\'ye yüklendi.';
    $_ADDONLANG['btkreports_cron_personel_ftp_fail'] = 'PERSONEL raporu (%s) oluşturuldu ancak FTP\'ye yüklenemedi: %s';
    $_ADDONLANG['btkreports_cron_personel_gen_fail'] = 'PERSONEL raporu oluşturulamadı veya personel verisi yok.';
    $_ADDONLANG['btkreports_cron_personel_not_due'] = 'PERSONEL raporu için henüz zamanı değil.';
    $_ADDONLANG['btkreports_cron_job_completed'] = 'BTK Raporlama Cron İşlemi Tamamlandı.';
    $_ADDONLANG['btkreports_cron_config_missing'] = 'BTK Raporlama modül ayarları eksik, cron çalıştırılamadı.';
    $_ADDONLANG['btkreports_cron_already_running'] = 'BTK Raporlama Cron işlemi zaten çalışıyor. Çakışmayı önlemek için çıkılıyor.';
    $_ADDONLANG['btkreports_error_phpspreadsheet_not_loaded'] = 'PhpSpreadsheet kütüphanesi yüklenemedi. Personel raporu oluşturulamıyor.';
    $_ADDONLANG['btkreports_cron_personel_not_due_yet'] = 'PERSONEL raporu için doğru ay, ancak henüz ayın son günü değil.';
    $_ADDONLANG['btkreports_cron_rehber_not_due_yet'] = 'REHBER raporu için henüz doğru zaman değil.';
    $_ADDONLANG['btkreports_cron_hareket_not_due_yet'] = 'HAREKET raporu için henüz doğru zaman değil.';

}

if (function_exists('btkreports_log_activity')) {
    btkreports_log_activity(($_ADDONLANG['btkreports_cron_job_starting'] ?? 'BTK Raporlama Cron İşlemi Başlatılıyor...'), 0, null, 'CRON');
} else {
    echo "btkreports_log_activity fonksiyonu bulunamadı.\n";
}

// Kilit mekanizması
$lockFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'btk_reports_cron.lock'; // WHMCS temp dizini yerine sistem temp dizini
if (file_exists($lockFile)) {
    if (time() - filemtime($lockFile) > 3600) { // 1 saatten eskiyse sil
        unlink($lockFile);
        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity("Eski kilit dosyası silindi: " . $lockFile, 0, null, 'CRON_WARNING');
        }
    } else {
        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity(($_ADDONLANG['btkreports_cron_already_running'] ?? 'BTK Raporlama Cron işlemi zaten çalışıyor. Çakışmayı önlemek için çıkılıyor.'), 0, null, 'CRON_WARNING');
        }
        echo "Cron zaten çalışıyor.\n";
        exit;
    }
}
file_put_contents($lockFile, date('Y-m-d H:i:s'));


// Modül ayarlarını al
$config = btkreports_get_all_config();

if (empty($config['operator_code']) || empty($config['ftp_host']) || empty($config['ftp_username'])) {
    if (function_exists('btkreports_log_activity')) {
        btkreports_log_activity(($_ADDONLANG['btkreports_cron_config_missing'] ?? 'BTK Raporlama modül ayarları eksik, cron çalıştırılamadı.'), 0, null, 'CRON_ERROR');
    }
    if (file_exists($lockFile)) unlink($lockFile);
    die("Modül ayarları eksik.\n");
}

$currentMonth = (int)date('m');
$currentDay = (int)date('d');
$isLastDayOfMonth = ($currentDay == date('t')); // Ayın son günü mü?
$isFirstDayOfMonth = ($currentDay == 1); // Ayın ilk günü mü?

// --- REHBER RAPORU ---
// BTK genellikle aylık veya 3 aylık periyotlarla isteyebilir. Varsayılan olarak her ayın 1'inde oluşturalım.
if ($isFirstDayOfMonth && function_exists('btkreports_generate_rehber_file') && function_exists('btkreports_upload_to_ftp')) {
    if (function_exists('btkreports_log_activity')) btkreports_log_activity(($_ADDONLANG['btkreports_cron_rehber_generating'] ?? 'REHBER raporu oluşturuluyor...'), 0, null, 'CRON');
    list($fileName, $fileContent) = btkreports_generate_rehber_file($config);
    if ($fileName && $fileContent !== null) {
        $ftpResult = btkreports_upload_to_ftp($fileName, $fileContent, $config, 'rehber');
        if ($ftpResult['success']) {
            if (function_exists('btkreports_log_activity')) btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_rehber_success'] ?? 'REHBER raporu (%s) başarıyla oluşturuldu ve FTP\'ye yüklendi.'), $fileName), 0, null, 'CRON_SUCCESS');
        } else {
            if (function_exists('btkreports_log_activity')) btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_rehber_ftp_fail'] ?? 'REHBER raporu (%s) oluşturuldu ancak FTP\'ye yüklenemedi: %s'), $fileName, $ftpResult['message']), 0, null, 'CRON_ERROR');
        }
    } else {
        // Eğer $fileContent null ise (veri yok ve boş dosya gönderilmeyecekse) log at.
        if (function_exists('btkreports_log_activity')) btkreports_log_activity(($_ADDONLANG['btkreports_cron_rehber_gen_fail'] ?? 'REHBER raporu oluşturulamadı veya raporlanacak abone yok.'), 0, null, 'CRON_INFO');
    }
} elseif ($isFirstDayOfMonth) {
     if (function_exists('btkreports_log_activity')) btkreports_log_activity("REHBER raporu için zamanlama geldi ancak gerekli fonksiyonlar eksik.", 0, null, 'CRON_ERROR');
}

// --- HAREKET RAPORU ---
// BTK genellikle aylık veya 3 aylık periyotlarla isteyebilir. Varsayılan olarak her ayın 1'inde bir önceki ayın hareketlerini alalım.
if ($isFirstDayOfMonth && function_exists('btkreports_generate_hareket_file') && function_exists('btkreports_upload_to_ftp')) {
    if (function_exists('btkreports_log_activity')) btkreports_log_activity(($_ADDONLANG['btkreports_cron_hareket_generating'] ?? 'HAREKET raporu oluşturuluyor...'), 0, null, 'CRON');
    
    $gecenAyinIlkGunu = date('Y-m-01 00:00:00', strtotime('first day of last month'));
    $gecenAyinSonGunu = date('Y-m-t 23:59:59', strtotime('last day of last month'));

    list($fileName, $fileContent) = btkreports_generate_hareket_file($config, $gecenAyinIlkGunu, $gecenAyinSonGunu, false);
    if ($fileName && $fileContent !== null) {
        $ftpResult = btkreports_upload_to_ftp($fileName, $fileContent, $config, 'hareket');
        if ($ftpResult['success']) {
            if (function_exists('btkreports_log_activity')) btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_hareket_success'] ?? 'HAREKET raporu (%s) başarıyla oluşturuldu ve FTP\'ye yüklendi.'), $fileName), 0, null, 'CRON_SUCCESS');
        } else {
            if (function_exists('btkreports_log_activity')) btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_hareket_ftp_fail'] ?? 'HAREKET raporu (%s) oluşturuldu ancak FTP\'ye yüklenemedi: %s'), $fileName, $ftpResult['message']), 0, null, 'CRON_ERROR');
        }
    } else {
        if (function_exists('btkreports_log_activity')) btkreports_log_activity(($_ADDONLANG['btkreports_cron_hareket_gen_fail'] ?? 'HAREKET raporu oluşturulamadı veya raporlanacak hareket yok.'), 0, null, 'CRON_INFO');
    }
} elseif ($isFirstDayOfMonth) {
    if (function_exists('btkreports_log_activity')) btkreports_log_activity("HAREKET raporu için zamanlama geldi ancak gerekli fonksiyonlar eksik.", 0, null, 'CRON_ERROR');
}


// --- PERSONEL RAPORU ---
// Haziran ve Aralık aylarının son günü
$generatePersonelReport = false;
$reportPeriod = '';

if (($currentMonth == 6 || $currentMonth == 12) && $isLastDayOfMonth) {
    $generatePersonelReport = true;
    $reportPeriod = date('Y') . ($currentMonth == 6 ? 'H1' : 'H2'); // Örn: 2025H1 veya 2025H2
}

if ($generatePersonelReport) {
    if (!class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity(($_ADDONLANG['btkreports_error_phpspreadsheet_not_loaded'] ?? 'PhpSpreadsheet kütüphanesi yüklenemedi. Personel raporu oluşturulamıyor.'), 0, null, 'CRON_ERROR');
        }
    } elseif (function_exists('btk_generate_personel_excel_content') && function_exists('btkreports_upload_to_ftp')) {
        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_personel_generating'] ?? 'PERSONEL raporu oluşturuluyor (%s dönemi)...'), $reportPeriod), 0, null, 'CRON');
        }

        list($personelFileName, $excelFileContentString) = btk_generate_personel_excel_content($config);

        if ($personelFileName && $excelFileContentString !== null) {
            $ftpResult = btkreports_upload_to_ftp($personelFileName, $excelFileContentString, $config, 'personel');
            if ($ftpResult['success']) {
                if (function_exists('btkreports_log_activity')) {
                    btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_personel_success'] ?? 'PERSONEL raporu (%s) başarıyla oluşturuldu ve FTP\'ye yüklendi.'), $personelFileName), 0, null, 'CRON_SUCCESS');
                }
            } else {
                if (function_exists('btkreports_log_activity')) {
                    btkreports_log_activity(sprintf(($_ADDONLANG['btkreports_cron_personel_ftp_fail'] ?? 'PERSONEL raporu (%s) oluşturuldu ancak FTP\'ye yüklenemedi: %s'), $personelFileName, $ftpResult['message']), 0, null, 'CRON_ERROR');
                }
            }
        } else {
            if (function_exists('btkreports_log_activity')) {
                btkreports_log_activity(($_ADDONLANG['btkreports_cron_personel_gen_fail'] ?? 'PERSONEL raporu oluşturulamadı veya personel verisi yok.'), 0, null, 'CRON_WARNING');
            }
        }
    } else { // Fonksiyonlar eksikse
         if (function_exists('btkreports_log_activity')) {
            $missingFuncError = ($_ADDONLANG['btkreports_cron_personel_gen_fail'] ?? 'PERSONEL raporu oluşturulamadı') . ' (gerekli fonksiyonlar eksik).';
            btkreports_log_activity($missingFuncError, 0, null, 'CRON_ERROR');
        }
    }
} elseif (($currentMonth == 6 || $currentMonth == 12) && !$isLastDayOfMonth) {
    // Bilgilendirme logu (isteğe bağlı)
    // if (function_exists('btkreports_log_activity')) {
    //    btkreports_log_activity(($_ADDONLANG['btkreports_cron_personel_not_due_yet'] ?? 'PERSONEL raporu için doğru ay, ancak henüz ayın son günü değil.'), 0, null, 'CRON_INFO');
    // }
}


// Kilit dosyasını kaldır
if (file_exists($lockFile)) {
    unlink($lockFile);
}

if (function_exists('btkreports_log_activity')) {
    btkreports_log_activity(($_ADDONLANG['btkreports_cron_job_completed'] ?? 'BTK Raporlama Cron İşlemi Tamamlandı.'), 0, null, 'CRON_SUCCESS');
}

echo "BTK Raporlama Cron işlemi tamamlandı.\n";

?>