<?php
/**
 * WHMCS BTK Raporlama Modülü - V5.0.0 - Yeni Nesil
 *
 * Bu dosya, WHMCS admin arayüzü için BTK Raporlama Modülü'nün ana kontrolcüsüdür.
 * Tüm sayfa yönlendirmelerini, form gönderimlerini ve AJAX isteklerini yönetir.
 *
 * @copyright Copyright (c) Kablosuz Online & Gemini AI
 * @license http://www.whmcs.com/license/ WHMCS Eula
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
use WHMCS\User\Admin;
use WHMCS\Order\Order;
use WHMCS\Service\Service;
use WHMCS\Product\Product;
use WHMCS\Product\Group as ProductGroup; // Ürün grupları için

// Helper dosyamızı dahil edelim (tüm iş mantığı burada)
if (file_exists(__DIR__ . '/lib/btkhelper.php')) {
    require_once __DIR__ . '/lib/btkhelper.php';
} else {
    // Kritik hata: Helper dosyası olmadan modül çalışamaz.
    if (function_exists('logActivity')) {
        logActivity("BTK Raporlama Modülü Kritik Hata: lib/btkhelper.php dosyası bulunamadı!", 0);
    }
    // Admin arayüzünde bir hata mesajı göstermek için.
    if (php_sapi_name() !== 'cli') {
        echo "<div class='alert alert-danger'>BTK Raporlama Modülü için gerekli btkhelper.php dosyası bulunamadı. Lütfen modül dosyalarını kontrol edin.</div>";
    }
    die("BTK Helper dosyası bulunamadı."); // İşlemi durdur
}

// Vendor autoload (Composer ile yüklenmiş harici kütüphaneler için)
$vendorAutoload = dirname(__FILE__) . '/vendor/autoload.php';
if (file_exists($vendorAutoload)) {
    require_once $vendorAutoload;
}


/**
 * Modül meta verilerini tanımlar.
 * Bu bilgiler WHMCS eklenti yönetim sayfasında gösterilir.
 */
function btkreports_config() {
    return [
        'name' => 'BTK Raporlama Modülü (V5)', // Modül adı
        'description' => 'BTK için Abone Rehber, Abone Hareket ve Personel Listesi raporlarını oluşturur, yönetir ve FTP ile iletir.', // Modül açıklaması
        'version' => '5.0.0', // Modül versiyonu
        'author' => 'Kablosuz Online & Gemini AI', // Geliştirici
        'language' => 'turkish', // Varsayılan dil dosyası
        'fields' => [ // Bu alanda modül config sayfasında gösterilecek ek ayarlar tanımlanabilir, ancak biz tüm ayarları kendi arayüzümüzde yöneteceğiz.
             'info' => [
                'FriendlyName' => 'Modül Bilgilendirme',
                'Type' => 'none', // 'none' tipi sadece açıklama gösterir.
                'Description' => 'Tüm ayarlar modülün kendi özel arayüzünden (Eklentiler > BTK Raporlama Modülü (V5)) yönetilmektedir.',
            ],
        ]
    ];
}

/**
 * Modül aktivasyon fonksiyonu.
 * Modül WHMCS'te aktive edildiğinde çalışır.
 * Gerekli veritabanı tablolarını oluşturur ve varsayılan ayarları yükler.
 */
function btkreports_activate() {
    try {
        $basePath = dirname(__FILE__);
        $installSqlFile = $basePath . DIRECTORY_SEPARATOR . 'sql' . DIRECTORY_SEPARATOR . 'install.sql';
        
        // install.sql dosyasının varlığını kontrol et
        if (!file_exists($installSqlFile)) {
            return ['status' => 'error', 'description' => 'Kurulum SQL dosyası (`sql/install.sql`) bulunamadı.'];
        }

        $sql_query_errors = [];
        $installSqlContent = file_get_contents($installSqlFile);
        
        // SQL dosyasını noktalı virgül ile ayırıp her bir ifadeyi çalıştır
        // Yorum satırlarını ve boş ifadeleri atla
        $sqlStatements = array_filter(array_map('trim', explode(';', $installSqlContent)), function($statement) {
            return !empty($statement) && strpos(trim($statement), '--') !== 0 && strpos(trim($statement), '/*') !== 0;
        });

        foreach ($sqlStatements as $statement) {
            try {
                Capsule::connection()->statement($statement);
            } catch (\Exception $e) {
                $sql_query_errors[] = "Hata (install.sql): \"" . substr($statement, 0, 100) . "...\" - " . $e->getMessage();
            }
        }
        // Hata varsa logla
        if (count($sql_query_errors) > 0 && function_exists('btk_log_module_action')) {
            btk_log_module_action('install.sql çalıştırılırken hatalar oluştu', 'CRITICAL_ERROR', ['errors' => $sql_query_errors]);
        }

        // Başlangıç referans verilerini yükle (initial_reference_data.sql)
        $initialDataSqlFile = $basePath . DIRECTORY_SEPARATOR . 'sql' . DIRECTORY_SEPARATOR . 'initial_reference_data.sql';
        if (file_exists($initialDataSqlFile) && filesize($initialDataSqlFile) > 0) {
            $initialDataSqlContent = file_get_contents($initialDataSqlFile);
            $sqlStatementsInitial = array_filter(array_map('trim', explode(';', $initialDataSqlContent)), function($statement) {
                return !empty($statement) && strpos(trim($statement), '--') !== 0 && strpos(trim($statement), '/*') !== 0;
            });
             foreach ($sqlStatementsInitial as $statement) {
                try {
                    Capsule::connection()->statement($statement); // INSERT IGNORE kullanılmalı
                } catch (\Exception $e) {
                    if(function_exists('btk_log_module_action')) btk_log_module_action('initial_reference_data.sql çalıştırılırken hata (göz ardı edilebilir)', 'WARNING', ['statement' => substr($statement,0,100), 'error' => $e->getMessage()]);
                }
            }
        } else {
             if(function_exists('btk_log_module_action')) btk_log_module_action('initial_reference_data.sql dosyası bulunamadı veya boş.', 'INFO');
        }
        
        // Varsayılan modül ayarlarını ekle (eğer config tablosunda yoksa)
        if(function_exists('btk_save_module_setting') && function_exists('btk_get_module_setting')){
            $defaultSettings = [
                'operator_code' => '', 'operator_name' => '', 'operator_unvani' => '',
                'ftp_host' => '', 'ftp_username' => '', 'ftp_port' => '21', 'use_passive_ftp' => '1',
                'ftp_rehber_path' => '/REHBER/', 'ftp_hareket_path' => '/HAREKET/', 'personel_ftp_path' => '/PERSONEL/',
                'use_yedek_ftp' => '0', 'yedek_ftp_host' => '', 'yedek_ftp_username' => '',
                'yedek_ftp_port' => '21', 'use_passive_yedek_ftp' => '1',
                'yedek_ftp_rehber_path' => '/REHBER/', 'yedek_ftp_hareket_path' => '/HAREKET/',
                'yedek_personel_ftp_path' => '/PERSONEL/',
                'rehber_cron_schedule' => '0 2 1 * *', // Her ayın 1'i gece 02:00
                'hareket_cron_schedule' => '0 1 * * *', // Her gün gece 01:00
                'personel_cron_schedule_haziran' => '0 3 L 6 *', // Haziran ayının son günü saat 03:00
                'personel_cron_schedule_aralik' => '0 3 L 12 *', // Aralık ayının son günü saat 03:00
                'hareket_arsivleme_periyodu_ay' => '6', // 6 ay
                'delete_tables_on_deactivate' => '0', // Varsayılan olarak tabloları silme
                'password_confirm_timeout' => '15', // Şifre onay zaman aşımı (dakika)
                'nvi_revalidate_days' => '30', // NVI yeniden doğrulama periyodu (gün), 0 ise her zaman yeniden doğrula
                'default_rapor_yetki_tipi' => 'ISS' // Varsayılan rapor yetki tipi
            ];
            foreach($defaultSettings as $key => $value){
                if(is_null(btk_get_module_setting($key))) { // Sadece ayar yoksa ekle
                    btk_save_module_setting($key, $value);
                }
            }
        }

        if (count($sql_query_errors) > 0) {
            return ['status' => 'error', 'description' => 'Veritabanı tabloları oluşturulurken/güncellenirken hatalar oluştu: ' . implode('; ', $sql_query_errors)];
        }
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla aktive edildi ve veritabanı tabloları oluşturuldu/güncellendi. Lütfen modül ayarlarını yapılandırın.'];
    } catch (\Exception $e) { 
        if(function_exists('btk_log_module_action')) btk_log_module_action('Modül aktivasyonunda genel bir hata oluştu', 'CRITICAL_ERROR', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return ['status' => 'error', 'description' => 'Modül aktivasyonu sırasında beklenmedik bir hata oluştu: ' . $e->getMessage()];
    }
}

/**
 * Modül devre dışı bırakma fonksiyonu.
 * Ayara bağlı olarak modül tablolarını silebilir.
 */
function btkreports_deactivate() {
    try {
        $deleteTables = false;
        // Helper fonksiyonları bu aşamada hala erişilebilir olmalı (eğer hook.php yüklenmişse)
        if (Capsule::schema()->hasTable('mod_btk_config') && function_exists('btk_get_module_setting')) {
            $deleteTablesSetting = btk_get_module_setting('delete_tables_on_deactivate', '0');
            $deleteTables = ($deleteTablesSetting == '1' || $deleteTablesSetting === true || $deleteTablesSetting == 'on');
        }
        
        if ($deleteTables) { 
            Capsule::statement('SET FOREIGN_KEY_CHECKS=0;'); // İlişkisel kısıtlamaları geçici olarak kaldır
            $tablesToDelete = [
                'mod_btk_product_group_map',
                'mod_btk_abone_hareketler_arsiv',
                'mod_btk_abone_hareketler', 
                'mod_btk_hizmet_operasyonel_data',
                'mod_btk_abone_data', 
                'mod_btk_personel', 
                'mod_btk_generated_files',
                'mod_btk_nvi_cache', 
                'mod_btk_logs', 
                'mod_btk_adres_mahalleler',
                'mod_btk_adres_ilceler', 
                'mod_btk_adres_iller', 
                'mod_btk_referans_meslek_kodlari',
                'mod_btk_referans_musteri_hareket_kodlari', 
                'mod_btk_referans_hat_durum_kodlari',
                'mod_btk_referans_kimlik_aidiyeti', 
                'mod_btk_referans_kimlik_tipleri',
                'mod_btk_referans_musteri_tipleri', 
                'mod_btk_referans_hizmet_tipleri',
                'mod_btk_yetki_turleri_tanim', 
                'mod_btk_config'
            ];
            foreach ($tablesToDelete as $tableName) {
                try { 
                    Capsule::schema()->dropIfExists($tableName); 
                } catch (\Exception $e) {
                    // Hata olsa bile diğerlerini silmeye devam et
                    if(function_exists('btk_log_module_action')) btk_log_module_action("Tablo silinirken hata (deaktivasyon): {$tableName}", 'ERROR', ['error' => $e->getMessage()]);
                }
            }
            Capsule::statement('SET FOREIGN_KEY_CHECKS=1;'); // İlişkisel kısıtlamaları geri yükle
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve ilgili veritabanı tabloları silindi.'];
        } else { 
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veritabanı tabloları korundu.']; 
        }
    } catch (\Exception $e) { 
        if(function_exists('btk_log_module_action')) btk_log_module_action('Modül devre dışı bırakılırken genel hata', 'ERROR', ['error' => $e->getMessage()]);
        return ['status' => 'error', 'description' => 'Modül devre dışı bırakılırken bir hata oluştu: ' . $e->getMessage()];
    }
}

/**
 * Modül yükseltme fonksiyonu.
 * Eski versiyonlardan yeni versiyonlara geçişte gerekli veritabanı veya ayar güncellemelerini yapar.
 */
function btkreports_upgrade($vars) {
    $currentVersionInstalled = $vars['version']; // WHMCS'in addon_modules tablosundan okuduğu mevcut sürüm
    $newModuleVersion = btkreports_config()['version']; // Bu dosyadaki tanımlı yeni sürüm

    btk_log_module_action("BTK Modülü yükseltme işlemi başlatıldı. Mevcut Sürüm: {$currentVersionInstalled}, Yeni Sürüm: {$newModuleVersion}", "UPGRADE_INFO");

    // V3.0.0'a özel yükseltme adımları
    if (version_compare($currentVersionInstalled, '3.0.0', '<')) {
        btk_log_module_action("V3.0.0'a yükseltiliyor...", "UPGRADE_PROCESS");
        try {
            // mod_btk_product_group_map tablosunun varlığını kontrol et, yoksa install.sql'den oluştur.
            // Bu, activate fonksiyonunda da olduğu için tekrar çalıştırılabilir veya sadece eksikse eklenebilir.
            if (!Capsule::schema()->hasTable('mod_btk_product_group_map')) {
                 $sql = "CREATE TABLE IF NOT EXISTS `mod_btk_product_group_map` (
                            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            `whmcs_group_id` INT UNSIGNED NOT NULL COMMENT 'tblproductgroups.id ile eşleşir',
                            `btk_yetki_kullanici_kodu` VARCHAR(10) DEFAULT NULL COMMENT 'mod_btk_yetki_turleri_tanim.btk_dosya_tip_kodu',
                            `btk_hizmet_turu_kodu` VARCHAR(10) DEFAULT NULL COMMENT 'mod_btk_referans_hizmet_tipleri.hizmet_turu_kodu (EK-3)',
                            `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            UNIQUE KEY `unique_group_map` (`whmcs_group_id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='WHMCS ürün gruplarını BTK Yetki ve Hizmet Tipleriyle eşler.';";
                Capsule::connection()->statement($sql);
                btk_log_module_action("Modül V3.0.0'a yükseltildi: mod_btk_product_group_map tablosu oluşturuldu.", "UPGRADE_SUCCESS");
            }

            // Eski `mod_btk_product_service_map` tablosunu sil (artık kullanılmıyor)
            if (Capsule::schema()->hasTable('mod_btk_product_service_map')) {
                Capsule::schema()->dropIfExists('mod_btk_product_service_map');
                btk_log_module_action("Eski 'mod_btk_product_service_map' tablosu V3.0.0 yükseltmesinde silindi.", "UPGRADE_INFO");
            }

            // Yeni eklenen config ayarları için varsayılan değerleri ekle
            if(function_exists('btk_save_module_setting') && function_exists('btk_get_module_setting')){
                 if(is_null(btk_get_module_setting('nvi_revalidate_days'))) {
                     btk_save_module_setting('nvi_revalidate_days', '30');
                 }
                 if(is_null(btk_get_module_setting('default_rapor_yetki_tipi'))) {
                     btk_save_module_setting('default_rapor_yetki_tipi', 'ISS');
                 }
            }
            btk_log_module_action("Modül V3.0.0 yükseltme adımları tamamlandı.", "UPGRADE_SUCCESS");

        } catch (\Exception $e) {
            btk_log_module_action("Modül V3.0.0 yükseltme sırasında hata oluştu", "ERROR", ['error' => $e->getMessage()]);
        }
    }
    // Gelecekteki versiyonlar için benzer `if (version_compare(...))` blokları eklenebilir.
}

/**
 * Admin arayüzü çıktı fonksiyonu.
 * Modülün tüm admin sayfalarını yönetir.
 */
function btkreports_output($vars) {
    $action = isset($_REQUEST['action']) ? trim($_REQUEST['action']) : 'index';
    $moduleLink = $vars['modulelink']; // WHMCS tarafından sağlanan modül linki
    $adminId = $_SESSION['adminid'] ?? 0; // Aktif admin ID'si
    
    // Smarty nesnesini başlat ve temel değişkenleri ata
    $smarty = new \WHMCS\Smarty();
    $smarty->assign('modulelink', $moduleLink);
    $smarty->assign('_LANG', $vars['_lang']); // Dil değişkenlerini TPL'e aktar
    $smarty->assign('btkModuleVersion', $vars['version']); // Modül versiyonunu TPL'e aktar
    $smarty->assign('csrfToken', generate_token('plain')); // WHMCS CSRF token


    // Session'dan gelen başarı, hata ve bilgi mesajlarını Smarty'e ata ve temizle
    if (isset($_SESSION['btk_successmessage'])) { $smarty->assign('successmessage', $_SESSION['btk_successmessage']); unset($_SESSION['btk_successmessage']); }
    if (isset($_SESSION['btk_errormessage'])) { $smarty->assign('errormessage', $_SESSION['btk_errormessage']); unset($_SESSION['btk_errormessage']); }
    if (isset($_SESSION['btk_infomessage'])) { $smarty->assign('infomessage', $_SESSION['btk_infomessage']); unset($_SESSION['btk_infomessage']); }

    // Hizmet detayları veya müşteri profili sayfalarından gelen özel session mesajları
    $serviceIdForMessage = isset($_GET['id']) && is_numeric($_GET['id']) && ($vars['filename'] == 'clientsservices' || strpos($_SERVER['REQUEST_URI'], 'clientsservices.php') !== false) ? (int)$_GET['id'] : (isset($_POST['serviceid']) && is_numeric($_POST['serviceid']) ? (int)$_POST['serviceid'] : 0);
    $clientIdForMessage = isset($_GET['userid']) && is_numeric($_GET['userid']) && ($vars['filename'] == 'clientssummary' || strpos($_SERVER['REQUEST_URI'], 'clientssummary.php') !== false) ? (int)$_GET['userid'] : (isset($_POST['userid']) && is_numeric($_POST['userid']) ? (int)$_POST['userid'] : 0);

    if ($serviceIdForMessage > 0) {
        if (isset($_SESSION['btk_successmessage_service']) && ($_SESSION['btk_successmessage_service_id'] ?? 0) == $serviceIdForMessage ) {
            $smarty->assign('successmessage', $_SESSION['btk_successmessage_service']);
            unset($_SESSION['btk_successmessage_service'], $_SESSION['btk_successmessage_service_id']);
        }
        if (isset($_SESSION['btk_errormessage_service']) && ($_SESSION['btk_errormessage_service_id'] ?? 0) == $serviceIdForMessage ) {
            $smarty->assign('errormessage', $_SESSION['btk_errormessage_service']);
            unset($_SESSION['btk_errormessage_service'], $_SESSION['btk_errormessage_service_id']);
        }
        if (isset($_SESSION['btk_infomessage_service']) && ($_SESSION['btk_infomessage_service_id'] ?? 0) == $serviceIdForMessage ) {
            $smarty->assign('infomessage', $_SESSION['btk_infomessage_service']);
            unset($_SESSION['btk_infomessage_service'], $_SESSION['btk_infomessage_service_id']);
        }
    }
    if ($clientIdForMessage > 0) {
        if (isset($_SESSION['btk_successmessage_clientprofile']) && ($_SESSION['btk_successmessage_clientprofile_id'] ?? 0) == $clientIdForMessage ) {
            $smarty->assign('successmessage', $_SESSION['btk_successmessage_clientprofile']);
            unset($_SESSION['btk_successmessage_clientprofile'], $_SESSION['btk_successmessage_clientprofile_id']);
        }
        if (isset($_SESSION['btk_errormessage_clientprofile']) && ($_SESSION['btk_errormessage_clientprofile_id'] ?? 0) == $clientIdForMessage ) {
            $smarty->assign('errormessage', $_SESSION['btk_errormessage_clientprofile']);
            unset($_SESSION['btk_errormessage_clientprofile'], $_SESSION['btk_errormessage_clientprofile_id']);
        }
    }
    // Yönlendirme sonrası ?yukonay=1 parametresiyle gelen genel başarı mesajı
    if (isset($_GET['yukonay']) && $_GET['yukonay'] == 1 && !isset($smarty->getTemplateVars('successmessage'))) { 
        $smarty->assign('successmessage', $vars['_lang']['changessavedsuccessfully'] ?? 'Değişiklikler başarıyla kaydedildi.');
    }
    
    // Şifre Onay Mekanizması
    $requiredPasswordConfirmationActions = [
        'index', 'config', 'personel', 'save_personel', 'save_personel_bulk_status', 'sync_admins_to_personel',
        'generate_reports', 'do_manual_report_generation', 'view_logs', 
        'save_yetki_turu', 'delete_yetki_turu', 'productgroupmap',
        'complete_btk_and_accept_order', 'save_service_btk_data', 
    ];
    $ajaxActions = ['get_ilceler', 'nvi_dogrula', 'get_client_yerlesim_adresi']; // Şifre onayı gerektirmeyen AJAX action'ları
    $passwordConfirmationNeeded = false;

    if (in_array($action, $requiredPasswordConfirmationActions) && !in_array($action, $ajaxActions)) {
        $passwordConfirmTimeout = (int)btk_get_module_setting('password_confirm_timeout', 15); // Ayarlardan al, varsayılan 15 dk
        if (!isset($_SESSION['btk_admin_password_confirmed']) || (time() - $_SESSION['btk_admin_password_confirmed'] > ($passwordConfirmTimeout * 60) )) { 
            $passwordConfirmationNeeded = true;
            if (isset($_SESSION['btk_admin_password_confirmed'])) {
                 $_SESSION['btk_errormessage'] = $vars['_lang']['password_confirmation_timed_out'] ?? "Güvenlik nedeniyle şifre onayınız zaman aşımına uğradı. Lütfen tekrar onaylayın.";
                 unset($_SESSION['btk_admin_password_confirmed']);
            }
        }
        // Şifre onay formu gönderilmişse
        if (isset($_POST['confirmadminpassword_btk'])) { 
            check_token("WHMCS.admin.default"); // CSRF kontrolü
            $adminUsername = '';
            if(isset($_SESSION['adminid'])) { 
                $adminUser = Admin::find((int)$_SESSION['adminid']); 
                if ($adminUser) $adminUsername = $adminUser->username; 
            }
            $passwordToConfirm = $_POST['adminpassword_btk'];
            $adminAuth = new \WHMCS\Authentication\Admin();
            if ($adminUsername && $adminAuth->verifyPassword($adminUsername, $passwordToConfirm)) {
                $_SESSION['btk_admin_password_confirmed'] = time(); // Onay zamanını kaydet
                $passwordConfirmationNeeded = false; 
                // Başarılı onay sonrası orijinal action'a yönlendir
                $redirectLink = $moduleLink . (isset($_POST['original_action_btk']) && !empty($_POST['original_action_btk']) ? '&action=' . $_POST['original_action_btk'] : '&action=index');
                
                $originalGetParamsDecoded = [];
                if (isset($_POST['original_params_btk']) && !empty($_POST['original_params_btk'])) {
                    $originalGetParamsDecoded = json_decode(urldecode($_POST['original_params_btk']), true);
                    if (is_array($originalGetParamsDecoded)) {
                        $redirectLink .= '&' . http_build_query($originalGetParamsDecoded);
                    }
                }
                header("Location: " . $redirectLink); exit;
            } else { 
                $_SESSION['btk_errormessage'] = $vars['_lang']['incorrect_password'] ?? "Girilen şifre yanlış. Lütfen tekrar deneyin."; 
            }
        }
    }

    // Şifre onayı gerekiyorsa, onay formunu göster
    if ($passwordConfirmationNeeded) { 
        $smarty->assign('request_password_confirmation', true);
        $smarty->assign('original_action_btk', $action); 
        $originalGetParams = $_GET; 
        unset($originalGetParams['module'], $originalGetParams['action'], $originalGetParams['token']); // CSRF token'ını tekrar gönderme
        $smarty->assign('original_params_btk', urlencode(json_encode($originalGetParams))); // TPL'e göndermek için
        $smarty->assign('original_params_btk_query_string', http_build_query($originalGetParams)); // Yönlendirme URL'i için
        $templateFile = dirname(__FILE__) . '/templates/admin/confirm_password.tpl';
        if (file_exists($templateFile)) { $smarty->display($templateFile); } 
        else { echo "Şifre onay şablonu bulunamadı: " . htmlspecialchars($templateFile); }
        return; // Fonksiyondan çık
    }

    // Ana Action Yönlendirmesi
    $templateFile = null; 
    switch ($action) {
        case 'config':
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['saveconfig'])) {
                check_token("WHMCS.admin.default");
                $settingsToSave = [
                    'operator_code', 'operator_name', 'operator_unvani',
                    'ftp_host', 'ftp_username', 'ftp_port', 'use_passive_ftp',
                    'ftp_rehber_path', 'ftp_hareket_path', 'personel_ftp_path',
                    'use_yedek_ftp', 'yedek_ftp_host', 'yedek_ftp_username',
                    'yedek_ftp_port', 'use_passive_yedek_ftp', 'yedek_ftp_rehber_path',
                    'yedek_ftp_hareket_path', 'yedek_personel_ftp_path',
                    'rehber_cron_schedule', 'hareket_cron_schedule',
                    'personel_cron_schedule_haziran', 'personel_cron_schedule_aralik',
                    'hareket_arsivleme_periyodu_ay', 'delete_tables_on_deactivate',
                    'password_confirm_timeout', 'nvi_revalidate_days', 'default_rapor_yetki_tipi'
                ];
                foreach ($settingsToSave as $key) {
                    $valueToSave = isset($_POST[$key]) ? trim($_POST[$key]) : '';
                    if (in_array($key, ['use_passive_ftp', 'use_yedek_ftp', 'use_passive_yedek_ftp', 'delete_tables_on_deactivate'])) {
                        $valueToSave = (isset($_POST[$key]) && ($_POST[$key] == '1' || $_POST[$key] == 'on')) ? '1' : '0';
                    }
                    if (($key === 'password_confirm_timeout' || $key === 'nvi_revalidate_days' || $key === 'hareket_arsivleme_periyodu_ay') && (!is_numeric($valueToSave) || $valueToSave < 0)) {
                        $valueToSave = ($key === 'password_confirm_timeout') ? 15 : (($key === 'nvi_revalidate_days') ? 30 : 6); // Varsayılanlar
                    }
                    if (function_exists('btk_save_module_setting')) btk_save_module_setting($key, $valueToSave);
                }
                // Şifre alanlarını ayrı işle (sadece doluysa güncelle)
                if (isset($_POST['ftp_password']) && !empty(trim($_POST['ftp_password']))) { 
                    if (function_exists('btk_save_module_setting') && function_exists('encrypt')) {
                        btk_save_module_setting('ftp_password', encrypt(trim($_POST['ftp_password'])));
                    }
                }
                if (isset($_POST['yedek_ftp_password']) && !empty(trim($_POST['yedek_ftp_password']))) { 
                    if (function_exists('btk_save_module_setting') && function_exists('encrypt')) {
                        btk_save_module_setting('yedek_ftp_password', encrypt(trim($_POST['yedek_ftp_password'])));
                    }
                }
                $_SESSION['btk_successmessage'] = $vars['_lang']['changessavedsuccessfully'] ?? 'Ayarlar başarıyla kaydedildi.';
                $tab = isset($_POST['current_tab']) ? trim($_POST['current_tab']) : 'genelAyarlar';
                header("Location: " . $moduleLink . "&action=config&yukonay=1&tab=" . $tab); // Sekmeyi de gönder
                exit;
            }
            // Ayarları TPL için çek
            $settings = [];
            if (function_exists('btk_get_module_setting')) {
                 $allConfigKeysFromDb = Capsule::table('mod_btk_config')->pluck('setting')->all();
                 if(!is_array($allConfigKeysFromDb)) $allConfigKeysFromDb = []; // Emin olmak için
                 foreach ($allConfigKeysFromDb as $key) {
                    $settings[$key] = btk_get_module_setting($key);
                    // Şifre alanlarını TPL'e boş gönder, sadece var olup olmadığını belirt
                    if ($key == 'ftp_password' || $key == 'yedek_ftp_password') {
                        $settings[$key . '_exists'] = !empty(Capsule::table('mod_btk_config')->where('setting', $key)->value('value'));
                        $settings[$key] = ''; // Şifreyi TPL'e gönderme
                    }
                }
            }
            $smarty->assign('settings', $settings);
            $smarty->assign('yetki_turleri_listesi', Capsule::table('mod_btk_yetki_turleri_tanim')->orderBy('yetki_kullanici_adi', 'asc')->get());
            $smarty->assign('btk_dosya_tip_kodlari', ['ISS', 'AIH', 'GSM', 'STH', 'UYDU', 'MOBIL', 'TT']); // BTK tarafından belirlenen kodlar
            // Tooltip metinlerini dil dosyasından al
            $smarty->assign('tooltip_operator_code', $vars['_lang']['btk_tooltip_operator_code'] ?? 'BTK tarafından verilen 3 haneli operatör kodu.');
            $smarty->assign('tooltip_operator_name', $vars['_lang']['btk_tooltip_operator_name'] ?? 'Dosya adlarında kullanılacak, boşluksuz, büyük harf, Türkçe karakter içermeyen operatör adı (örn: XYZTELEKOM).');
            $smarty->assign('tooltip_operator_unvani', $vars['_lang']['btk_tooltip_operator_unvani'] ?? 'Personel raporu gibi resmi belgelerde kullanılacak tam ticari unvan.');
            $smarty->assign('tooltip_cron', $vars['_lang']['btk_tooltip_cron'] ?? 'Standart cron formatı kullanın: "dakika saat gün ay günadı". Örnekler için arayüze bakınız.');
            $smarty->assign('info_icon_yetki_dosya_tipi', btk_get_tooltip_html($vars['_lang']['btk_yetki_kodu_dosya_tipi_aciklama'] ?? 'BTK\'nın belirlediği dosya tipi kodları (ISS, AIH, STH, GSM, UYDU, MOBIL, TT). Bu kod, ürün grubu eşleştirmelerinde ve raporlamada kullanılır.'));

            $templateFile = dirname(__FILE__) . '/templates/admin/config.tpl';
            break;
        
        case 'save_yetki_turu':
            check_token("WHMCS.admin.default");
            $yetkiId = isset($_POST['yetki_id']) ? (int)$_POST['yetki_id'] : 0;
            // yetki_kullanici_kodu artık btk_dosya_tip_kodu ile aynı olacak şekilde ayarlanıyor.
            // Bu nedenle formdan sadece yetki_kullanici_adi ve btk_dosya_tip_kodu alınacak.
            $data = [
                'yetki_kullanici_adi' => trim($_POST['yetki_kullanici_adi']),
                'btk_dosya_tip_kodu' => trim($_POST['btk_dosya_tip_kodu']),
                'yetki_kullanici_kodu' => trim($_POST['btk_dosya_tip_kodu']), // Eşsizlik için bunu da aynı yapalım
                'aktif_mi' => (isset($_POST['aktif_mi']) && $_POST['aktif_mi'] == '1') ? 1 : 0,
                'bos_dosya_gonder' => (isset($_POST['bos_dosya_gonder']) && $_POST['bos_dosya_gonder'] == '1') ? 1 : 0,
            ];
            if (empty($data['yetki_kullanici_adi']) || empty($data['btk_dosya_tip_kodu'])) {
                $_SESSION['btk_errormessage'] = "Yetki Adı ve BTK Dosya Tipi Kodu alanları zorunludur.";
            } else {
                try {
                    if ($yetkiId > 0) { // Güncelleme
                        // Güncelleme sırasında btk_dosya_tip_kodu'nun başkası tarafından kullanılmadığını kontrol et
                        $existingYetkiCheck = Capsule::table('mod_btk_yetki_turleri_tanim')
                            ->where('btk_dosya_tip_kodu', $data['btk_dosya_tip_kodu'])
                            ->where('id', '!=', $yetkiId)
                            ->first();
                        if($existingYetkiCheck){
                             $_SESSION['btk_errormessage'] = "Bu BTK Dosya Tipi Kodu ({$data['btk_dosya_tip_kodu']}) zaten başka bir yetki türü tarafından kullanılıyor.";
                        } else {
                            Capsule::table('mod_btk_yetki_turleri_tanim')->where('id', $yetkiId)->update($data);
                            $_SESSION['btk_successmessage'] = "Yetki türü başarıyla güncellendi.";
                        }
                    } else { // Yeni Ekleme
                        $existingYetki = Capsule::table('mod_btk_yetki_turleri_tanim')->where('btk_dosya_tip_kodu', $data['btk_dosya_tip_kodu'])->first();
                        if($existingYetki){
                             $_SESSION['btk_errormessage'] = "Bu BTK Dosya Tipi Kodu ({$data['btk_dosya_tip_kodu']}) zaten tanımlı.";
                        } else {
                            Capsule::table('mod_btk_yetki_turleri_tanim')->insert($data);
                            $_SESSION['btk_successmessage'] = "Yeni yetki türü başarıyla eklendi.";
                        }
                    }
                } catch (\Exception $e) {
                    $_SESSION['btk_errormessage'] = "Yetki türü kaydedilirken hata: " . $e->getMessage();
                    btk_log_module_action("Yetki türü kaydetme hatası", "ERROR", ['error' => $e->getMessage(), 'data' => $data]);
                }
            }
            header("Location: " . $moduleLink . "&action=config#yetkiTanimlari");
            exit;

        case 'delete_yetki_turu':
            check_token("WHMCS.admin.default");
            $yetkiId = isset($_GET['delete_id']) ? (int)$_GET['delete_id'] : 0;
            if ($yetkiId > 0) {
                try {
                    $yetkiTuru = Capsule::table('mod_btk_yetki_turleri_tanim')->find($yetkiId);
                    if($yetkiTuru){
                        // İlgili product group map kayıtlarını sil (btk_dosya_tip_kodu'na göre)
                        Capsule::table('mod_btk_product_group_map')->where('btk_yetki_kullanici_kodu', $yetkiTuru->btk_dosya_tip_kodu)->delete();
                        Capsule::table('mod_btk_yetki_turleri_tanim')->where('id', $yetkiId)->delete();
                        $_SESSION['btk_successmessage'] = "Yetki türü '{$yetkiTuru->yetki_kullanici_adi}' başarıyla silindi.";
                        btk_log_module_action("Yetki türü silindi: {$yetkiTuru->yetki_kullanici_adi}", "SUCCESS", ['yetki_id' => $yetkiId], $adminId);
                    } else {
                        $_SESSION['btk_errormessage'] = "Silinecek yetki türü bulunamadı.";
                    }
                } catch (\Exception $e) {
                     $_SESSION['btk_errormessage'] = "Yetki türü silinirken hata: " . $e->getMessage();
                    btk_log_module_action("Yetki türü silme hatası", "ERROR", ['error' => $e->getMessage(), 'yetki_id' => $yetkiId]);
                }
            } else {
                $_SESSION['btk_errormessage'] = "Geçersiz yetki ID'si.";
            }
            header("Location: " . $moduleLink . "&action=config#yetkiTanimlari");
            exit;
        
        case 'productgroupmap': 
            check_token("WHMCS.admin.default", false); // Sadece POST için token kontrolü, GET için değil
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['savegroupmappings'])) {
                check_token("WHMCS.admin.default"); 
                $mappings = $_POST['group_map'] ?? [];
                $processedCount = 0;
                try {
                    foreach ($mappings as $groupId => $mapData) {
                        $yetkiKodu = !empty($mapData['btk_yetki_kullanici_kodu']) ? trim($mapData['btk_yetki_kullanici_kodu']) : null;
                        $hizmetKodu = !empty($mapData['btk_hizmet_turu_kodu']) ? trim($mapData['btk_hizmet_turu_kodu']) : null;
                        $groupId = (int)$groupId;

                        if ($groupId > 0) {
                            if ($yetkiKodu !== null || $hizmetKodu !== null) { // En az biri doluysa kaydet/güncelle
                                Capsule::table('mod_btk_product_group_map')->updateOrInsert(
                                    ['whmcs_group_id' => $groupId],
                                    [
                                        'btk_yetki_kullanici_kodu' => $yetkiKodu, // Bu, btk_dosya_tip_kodu olmalı
                                        'btk_hizmet_turu_kodu' => $hizmetKodu,
                                        'last_updated' => Capsule::raw('NOW()')
                                    ]
                                );
                            } else { // İkisi de boşsa (varsayılan seçilmişse) kaydı sil
                                Capsule::table('mod_btk_product_group_map')->where('whmcs_group_id', $groupId)->delete();
                            }
                            $processedCount++;
                        }
                    }
                    // $saveCount her zaman işlenen grup sayısı olacak, bir değişiklik olmasa bile.
                    // Gerçekten bir değişiklik olup olmadığını kontrol etmek daha karmaşık olurdu.
                    $_SESSION['btk_successmessage'] = 'Ürün grubu eşleştirmeleri başarıyla kaydedildi.';
                    btk_log_module_action('Ürün grubu eşleştirmeleri güncellendi', 'SUCCESS', ['processed_groups' => $processedCount], $adminId);
                } catch (\Exception $e) {
                    $_SESSION['btk_errormessage'] = 'Eşleştirmeler kaydedilirken hata oluştu: ' . $e->getMessage();
                    btk_log_module_action('Ürün grubu eşleştirme kaydetme hatası', 'ERROR', ['error' => $e->getMessage()]);
                }
                header("Location: " . $moduleLink . "&action=productgroupmap"); 
                exit;
            }
            
            // TPL için verileri hazırla
            $smarty->assign('defined_yetki_turleri', Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->orderBy('yetki_kullanici_adi')->get());
            $smarty->assign('defined_hizmet_tipleri', Capsule::table('mod_btk_referans_hizmet_tipleri')->orderBy('deger_aciklama')->get());
            $smarty->assign('product_groups', ProductGroup::where('hidden', 0)->orderBy('order')->get(['id', 'name'])); // WHMCS ProductGroup modelini kullan
            $mappingsData = Capsule::table('mod_btk_product_group_map')->get();
            $groupMappings = [];
            foreach($mappingsData as $map){ $groupMappings[$map->whmcs_group_id] = $map; }
            $smarty->assign('group_mappings', $groupMappings);

            // Tooltip'ler için dil değişkenleri
            $smarty->assign('info_icon_product_map_yetki', btk_get_tooltip_html($vars['_lang']['btk_tooltip_product_map_yetki'] ?? 'Bu ürün grubundaki hizmetlerin varsayılan olarak hangi BTK Yetki Türü (Dosya Kodu) altında raporlanacağını seçin.'));
            $smarty->assign('info_icon_product_map_hizmet', btk_get_tooltip_html($vars['_lang']['btk_tooltip_product_map_hizmet'] ?? 'Bu ürün grubundaki hizmetler için varsayılan BTK Hizmet Tipi (EK-3 Kodu) seçin.'));

            $templateFile = dirname(__FILE__) . '/templates/admin/product_group_mappings.tpl';
            break;

        case 'complete_btk_and_accept_order':
            check_token("WHMCS.admin.default");
            $serviceId = isset($_GET['serviceid']) ? (int)$_GET['serviceid'] : 0;
            if ($serviceId > 0 && function_exists('btk_process_complete_and_accept_order')) {
                $result = btk_process_complete_and_accept_order($serviceId, $adminId);
                if ($result['status'] === 'success') { $_SESSION['btk_successmessage_service'] = $result['message']; }
                else { $_SESSION['btk_errormessage_service'] = $result['message']; }
                $_SESSION['btk_successmessage_service_id'] = $serviceId; $_SESSION['btk_errormessage_service_id'] = $serviceId;
            } else {
                 $_SESSION['btk_errormessage_service'] = "Geçersiz hizmet ID'si veya işlem fonksiyonu bulunamadı.";
                 $_SESSION['btk_errormessage_service_id'] = $serviceId;
            }
            header("Location: clientsservices.php?id=" . $serviceId); // Hizmet detay sayfasına geri dön
            exit;
        
        case 'save_service_btk_data': 
            check_token("WHMCS.admin.default");
            $serviceId = isset($_POST['serviceid']) ? (int)$_POST['serviceid'] : 0;
            $clientId = isset($_POST['userid']) ? (int)$_POST['userid'] : 0;
            
            if ($serviceId > 0 && function_exists('btk_handle_service_data_update_from_form')) {
                $result = btk_handle_service_data_update_from_form($serviceId, $clientId, $_POST, $adminId);
                if ($result['status'] === 'success') { $_SESSION['btk_successmessage_service'] = $result['message']; }
                elseif($result['status'] === 'info') { $_SESSION['btk_infomessage_service'] = $result['message']; $_SESSION['btk_infomessage_service_id'] = $serviceId;}
                else { $_SESSION['btk_errormessage_service'] = $result['message']; }
                 $_SESSION['btk_successmessage_service_id'] = $serviceId; 
                 $_SESSION['btk_errormessage_service_id'] = $serviceId;
            } else {
                 $_SESSION['btk_errormessage_service'] = $vars['_lang']['invalid_service_id_or_action_func_missing'] ?? "Geçersiz hizmet ID'si veya işlem fonksiyonu bulunamadı.";
                 $_SESSION['btk_errormessage_service_id'] = $serviceId;
            }
            $currentTab = isset($_POST['current_service_tab']) ? trim($_POST['current_service_tab']) : "hizmetGenel_{$serviceId}";
            header("Location: clientsservices.php?id=" . $serviceId . "&btkservicesave=1#" . $currentTab); // Hizmet detay sayfasına geri dön
            exit;

        // --- AJAX ACTIONS ---
        case 'get_ilceler': 
            $ilAdi = $_POST['il_adi'] ?? null;
            if (function_exists('btk_get_ilceler_for_ajax')) {
                btk_get_ilceler_for_ajax($ilAdi); 
            } else { 
                header('Content-Type: application/json; charset=utf-8'); 
                echo json_encode(['status' => 'error', 'message' => 'İlçe getirme işlem fonksiyonu bulunamadı.']); 
            }
            exit; // AJAX action'ları burada sonlanmalı
        
        case 'nvi_dogrula': 
            $type = $_POST['type'] ?? null; 
            $id_no = $_POST['id_no'] ?? null;
            $ad = $_POST['ad'] ?? null;
            $soyad = $_POST['soyad'] ?? null;
            $dogum_input = $_POST['dogum_input'] ?? null; 
            $clientIdForNvi = isset($_POST['client_id']) ? (int)$_POST['client_id'] : null;
            $serviceIdForNvi = isset($_POST['service_id']) ? (int)$_POST['service_id'] : null;
            $isPersonelCheck = isset($_POST['is_personel_check']) && $_POST['is_personel_check'] == 'true';

            if (function_exists('btk_perform_nvi_verification')) {
                btk_perform_nvi_verification($type, $id_no, $ad, $soyad, $dogum_input, $clientIdForNvi, $serviceIdForNvi, $isPersonelCheck);
            } else { 
                header('Content-Type: application/json; charset=utf-8'); 
                echo json_encode(['status' => 'error', 'message' => 'NVI Doğrulama işlem fonksiyonu bulunamadı.']); 
            }
            exit; 
        
        case 'get_client_yerlesim_adresi': 
            $clientId = isset($_POST['client_id']) ? (int)$_POST['client_id'] : null;
            if (function_exists('btk_get_client_yerlesim_adresi_for_ajax')) {
                btk_get_client_yerlesim_adresi_for_ajax($clientId); 
            } else { 
                header('Content-Type: application/json; charset=utf-8'); 
                echo json_encode(['status' => 'error', 'message' => 'Müşteri yerleşim adresi getirme fonksiyonu bulunamadı.']); 
            }
            exit; 
        
        // --- PERSONNEL ACTIONS ---
        case 'personel':
            if (function_exists('btk_get_personel_listesi')) { 
                $smarty->assign('personelListesi', btk_get_personel_listesi()); 
            }  else { 
                $smarty->assign('personelListesi', []); 
                $_SESSION['btk_errormessage'] = "Personel listesi alınamadı (helper fonksiyon eksik)."; 
            }
            $smarty->assign('info_icon_tckn', btk_get_tooltip_html($vars['_lang']['btk_tooltip_tckn_personel'] ?? 'Personelin T.C. Kimlik Numarası.'));
            $templateFile = dirname(__FILE__) . '/templates/admin/personel.tpl';
            break;

        case 'save_personel':
            check_token("WHMCS.admin.default");
            $personelId = isset($_POST['personel_id']) ? (int)$_POST['personel_id'] : 0;
            if ($personelId > 0 && function_exists('btk_save_personel_details')) {
                $result = btk_save_personel_details($personelId, $_POST, $adminId);
                if ($result['status'] === 'success') { $_SESSION['btk_successmessage'] = $result['message']; } 
                else { $_SESSION['btk_errormessage'] = $result['message']; }
            } else { $_SESSION['btk_errormessage'] = "Geçersiz personel ID'si veya personel kaydetme fonksiyonu bulunamadı."; }
            header("Location: " . $moduleLink . "&action=personel"); exit;

        case 'save_personel_bulk_status':
            check_token("WHMCS.admin.default");
            $personelIds = $_POST['personel_ids'] ?? [];
            $btkStatusData = $_POST['btk_listesine_eklensin'] ?? [];
            if (function_exists('btk_save_personel_bulk_status_update')) {
                 $result = btk_save_personel_bulk_status_update($personelIds, $btkStatusData, $adminId);
                if ($result['status'] === 'success') { $_SESSION['btk_successmessage'] = $result['message']; } 
                else { $_SESSION['btk_errormessage'] = $result['message']; }
            } else { $_SESSION['btk_errormessage'] = "Personel toplu durum güncelleme fonksiyonu bulunamadı."; }
            header("Location: " . $moduleLink . "&action=personel"); exit;
        
        case 'sync_admins_to_personel': 
            check_token("WHMCS.admin.default");
            if (function_exists('btk_sync_admins_to_personel_list')) {
                $result = btk_sync_admins_to_personel_list($adminId);
                 if ($result['status'] === 'success') { $_SESSION['btk_successmessage'] = $result['message']; } 
                 else { $_SESSION['btk_errormessage'] = $result['message']; }
            } else { $_SESSION['btk_errormessage'] = "Admin senkronizasyon fonksiyonu bulunamadı."; }
            header("Location: " . $moduleLink . "&action=personel"); exit;
        
        // --- REPORTING ACTIONS ---
        case 'generate_reports': 
            $smarty->assign('yetki_turleri_listesi', Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->orderBy('yetki_kullanici_adi')->get());
            $templateFile = dirname(__FILE__) . '/templates/admin/generate_reports.tpl'; 
            break;
        
        case 'do_manual_report_generation': 
            check_token("WHMCS.admin.default");
            $reportType = $_POST['report_type'] ?? null; 
            $yetkiKodu = $_POST['yetki_kodu_report'] ?? null; 
            $currentTimestamp = date('YmdHis');
            $currentYearMonth = date('Y_m');
            $operatorCode = btk_get_module_setting('operator_code');
            $operatorName = btk_get_module_setting('operator_name');
            $operatorUnvani = btk_get_module_setting('operator_unvani');
            $result = ['status' => 'error', 'message' => 'Geçersiz rapor tipi veya rapor oluşturma fonksiyonu bulunamadı.'];

            if ($reportType === 'ABONE_REHBER' && function_exists('btk_generate_abone_rehber_report')) {
                if(empty($yetkiKodu)){ 
                    $activeYetkiTurleri = Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->get();
                    $allSuccess = true; $messages = [];
                    foreach($activeYetkiTurleri as $yetki){
                        $singleResult = btk_generate_abone_rehber_report($operatorCode, $operatorName, $yetki->btk_dosya_tip_kodu, $currentTimestamp, (bool)$yetki->bos_dosya_gonder);
                        $messages[] = "{$yetki->btk_dosya_tip_kodu}: {$singleResult['message']}";
                        if($singleResult['status'] !== 'success' && $singleResult['status'] !== 'info') $allSuccess = false;
                    }
                    $result = ['status' => $allSuccess ? 'success' : 'partial_error', 'message' => implode(' | ', $messages), 'filename' => 'Çoklu Dosya'];
                } else {
                    $yetki = Capsule::table('mod_btk_yetki_turleri_tanim')->where('btk_dosya_tip_kodu', $yetkiKodu)->where('aktif_mi', 1)->first();
                    if($yetki){ $result = btk_generate_abone_rehber_report($operatorCode, $operatorName, $yetki->btk_dosya_tip_kodu, $currentTimestamp, (bool)$yetki->bos_dosya_gonder); } 
                    else { $result['message'] = "Seçilen yetki tipi ({$yetkiKodu}) bulunamadı veya aktif değil."; }
                }
            } elseif ($reportType === 'ABONE_HAREKET' && function_exists('btk_generate_abone_hareket_report')) {
                 if(empty($yetkiKodu)){ 
                    $activeYetkiTurleri = Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->get();
                    $allSuccess = true; $messages = [];
                    foreach($activeYetkiTurleri as $yetki){
                        $singleResult = btk_generate_abone_hareket_report($operatorCode, $operatorName, $yetki->btk_dosya_tip_kodu, $currentTimestamp, (bool)$yetki->bos_dosya_gonder);
                        $messages[] = "{$yetki->btk_dosya_tip_kodu}: {$singleResult['message']}";
                        if($singleResult['status'] !== 'success' && $singleResult['status'] !== 'info') $allSuccess = false;
                    }
                    $result = ['status' => $allSuccess ? 'success' : 'partial_error', 'message' => implode(' | ', $messages), 'filename' => 'Çoklu Dosya'];
                } else {
                    $yetki = Capsule::table('mod_btk_yetki_turleri_tanim')->where('btk_dosya_tip_kodu', $yetkiKodu)->where('aktif_mi', 1)->first();
                    if($yetki){ $result = btk_generate_abone_hareket_report($operatorCode, $operatorName, $yetki->btk_dosya_tip_kodu, $currentTimestamp, (bool)$yetki->bos_dosya_gonder); } 
                    else { $result['message'] = "Seçilen yetki tipi ({$yetkiKodu}) bulunamadı veya aktif değil."; }
                }
            } elseif ($reportType === 'PERSONEL_LISTESI' && function_exists('btk_generate_personel_report')) {
                $result = btk_generate_personel_report($operatorName, $operatorUnvani, $currentYearMonth);
            }

            if ($result['status'] === 'success') { $_SESSION['btk_successmessage'] = "{$reportType} raporu başarıyla oluşturuldu ve gönderildi: {$result['filename']}. FTP Mesajı: {$result['message']}"; }
            elseif ($result['status'] === 'info') { $_SESSION['btk_infomessage'] = $result['message']; }
            else { $_SESSION['btk_errormessage'] = "{$reportType} raporu oluşturulurken/gönderilirken hata: {$result['message']}"; }
            
            header("Location: " . $moduleLink . "&action=generate_reports");
            exit;

        case 'view_logs':
            if(Capsule::schema()->hasTable('mod_btk_logs') && function_exists('btk_get_module_logs')){
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = (int)btk_get_module_setting('logs_per_page', 50); // Ayarlardan log/sayfa sayısı
                $logData = btk_get_module_logs($page, $limit);
                $smarty->assign('btklogs', $logData['logs']);
                $smarty->assign('totalpages', $logData['totalPages']);
                $smarty->assign('currentpage', $logData['currentPage']);
                $smarty->assign('logs_per_page', $limit);
            } else {
                 $_SESSION['btk_errormessage'] = "Log tablosu bulunamadı veya log çekme fonksiyonu eksik.";
                 $smarty->assign('btklogs', []); $smarty->assign('totalpages', 0); $smarty->assign('currentpage', 1);
            }
            $templateFile = dirname(__FILE__) . '/templates/admin/view_logs.tpl'; 
            break;
            
        case 'index':
        default:
            if(Capsule::schema()->hasTable('mod_btk_generated_files')){
                $smarty->assign('lastGeneratedFiles', Capsule::table('mod_btk_generated_files')->orderBy('id','desc')->take(10)->get());
            } else {
                 $smarty->assign('lastGeneratedFiles', []);
            }
            if (function_exists('btk_check_ftp_connection')) {
                $smarty->assign('ftpCheckResult', btk_check_ftp_connection());
                $smarty->assign('use_yedek_ftp', btk_get_module_setting('use_yedek_ftp'));
            }
            if(Capsule::schema()->hasTable('mod_btk_logs')){
                $lastCronLog = Capsule::table('mod_btk_logs')
                                ->where('description', 'BTK Cron Tamamlandı.')
                                ->orderBy('id', 'desc')
                                ->first();
                if($lastCronLog){
                    $smarty->assign('lastCronRunTime', $lastCronLog->log_time);
                    try {
                        $lastRun = new DateTime($lastCronLog->log_time);
                        $now = new DateTime();
                        $interval = $now->diff($lastRun);
                        $timeAgo = '';
                        if ($interval->y > 0) $timeAgo .= $interval->y . ' yıl ';
                        if ($interval->m > 0) $timeAgo .= $interval->m . ' ay ';
                        if ($interval->d > 0) $timeAgo .= $interval->d . ' gün ';
                        if ($interval->h > 0) $timeAgo .= $interval->h . ' sa ';
                        if ($interval->i > 0) $timeAgo .= $interval->i . ' dk ';
                        $timeAgo = trim($timeAgo);
                        if(!empty($timeAgo)) $timeAgo .= ' önce'; else $timeAgo = 'az önce';
                        $smarty->assign('lastCronRunTimeFromNow', $timeAgo);
                    } catch (Exception $e){ /* Tarih parse hatası */ }
                }
            }
            $templateFile = dirname(__FILE__) . '/templates/admin/index.tpl'; 
            break;
    }

    // TPL dosyasını render et
    if (isset($templateFile) && file_exists($templateFile)) {
        try {
            $smarty->display($templateFile);
        } catch (\Exception $e) {
            if(function_exists('btk_log_module_action')) btk_log_module_action("Smarty şablon yükleme hatası", "CRITICAL_ERROR", ['action' => $action, 'template' => $templateFile, 'error' => $e->getMessage()], $adminId);
            echo "<div class='alert alert-danger'>Şablon yüklenirken bir hata oluştu: " . htmlspecialchars($e->getMessage()) . "</div>";
        }
    } else {
        // Eğer AJAX action değilse ve TPL dosyası bulunamazsa hata göster
        if (!in_array($action, $ajaxActions)) { 
             echo "<div class='alert alert-danger'>İstenen şablon dosyası bulunamadı: " . htmlspecialchars($templateFile ?? $action . ".tpl") . "</div>";
             btk_log_module_action("Şablon dosyası bulunamadı", "CRITICAL_ERROR", ['action' => $action, 'template' => $templateFile ?? $action . ".tpl"], $adminId);
        }
    }
}
?>