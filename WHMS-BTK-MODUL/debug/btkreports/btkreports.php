// --- BÖLÜM 1 / 5 BAŞI - (btkreports.php, Modül Tanımlamaları ve _config, _activate Fonksiyonları - HATA AYIKLANMIŞ)
<?php
/**
 * WHMCS BTK Raporlama Modülü
 *
 * @package    WHMCS
 * @author     [Üstadım ve Ben]
 * @copyright  Copyright (c) Kablosuz Online [Yıl]
 * @version    6.0.10 // Versiyonu tekrar artıralım
 */

// WHMCS ve Diğer Gerekli Sınıflar için `use` bildirimleri
// PHP dosyasının en başında, diğer tüm kodlardan ve require_once'lardan önce olmalı.
use WHMCS\Database\Capsule;
use WHMCS\Module\Addon\Setting as AddonSetting;
use WHMCS\Utility\CSRF; // <<--- Bu sınıfın doğru şekilde tanınması için burada.
// use WHMCS\User\Admin; // authadmin() global fonksiyon olarak kullanılıyor, bu use'a gerek yok.

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Composer autoload - Modülün çalışması için kritik
// Bu, `use` bildirimlerinden SONRA gelmeli, çünkü WHMCS'in kendi sınıfları
// WHMCS'in kendi autoloader'ı tarafından yüklenir, Composer autoloader'ı ise vendor kütüphaneleri için.
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    // Bu durum, modülün düzgün çalışmayacağı anlamına gelir.
    // Aktivasyon sırasında bu kontrol tekrar edilecek ve kullanıcıya bilgi verilecek.
    if (function_exists('logActivity')) {
        logActivity("BTK Reports KRİTİK HATA: Composer vendor/autoload.php bulunamadı! Modül düzgün çalışmayabilir. Lütfen modül dizininde 'composer install' komutunu çalıştırın.", 0);
    }
}

// Yardımcı sınıflar (Bunların içinde namespace varsa, yukarıdaki use bildirimleri veya autoload ile çözülür)
require_once __DIR__ . '/lib/BtkHelper.php';
require_once __DIR__ . '/lib/NviSoapClient.php';
require_once __DIR__ . '/lib/ExcelExporter.php';

/**
 * Modül Meta Verileri ve Yapılandırma Seçenekleri.
 */
function btkreports_config()
{
    return [
        "name"        => "BTK Raporlama Modülü",
        "description" => "BTK için yasal raporlama (ABONE REHBER, ABONE HAREKET, PERSONEL, ISS POP) modülü.",
        "version"     => "6.0.10",
        "author"      => "Kablosuz Online & AI",
        "language"    => "turkish",
        "fields"      => [
            "info" => [
                "FriendlyName" => "Bilgilendirme",
                "Description"  => "Tüm modül ayarları modülün kendi yönetim panelindeki 'Genel Ayarlar' sekmesinden yapılmaktadır. Lütfen modülü aktive ettikten sonra ilk olarak Genel Ayarlar bölümünü yapılandırınız.",
                "Type"         => "info",
            ],
        ],
    ];
}

/**
 * Modül Aktivasyon Fonksiyonu.
 */
function btkreports_activate()
{
    $moduleDir = dirname(__FILE__);
    $messages = ["status" => "success", "description" => "BTK Raporlama Modülü başarıyla aktive edildi."];
    $errorDetails = [];
    $hasCriticalError = false;

    // 1. Composer Bağımlılık Kontrolü
    if (!class_exists('\PhpOffice\PhpSpreadsheet\Spreadsheet') || !class_exists('\Cron\CronExpression')) {
        $errMsg = "BTK Reports KRİTİK HATA: Gerekli Composer kütüphaneleri (PhpSpreadsheet ve/veya CronExpression) yüklenmemiş veya vendor/autoload.php dahil edilememiş. Lütfen modülün ana dizininde 'composer install' komutunu çalıştırdığınızdan ve dosya izinlerinin doğru olduğundan emin olun.";
        if (function_exists('logActivity')) logActivity($errMsg, 0);
        error_log($errMsg); // Sunucu loguna da yaz
        return ["status" => "error", "description" => $errMsg];
    }

    try {
        // 2. Veritabanı Tablolarını Oluştur/Kontrol Et (install.sql)
        $sqlFilePathInstall = $moduleDir . '/sql/install.sql';
        if (file_exists($sqlFilePathInstall)) {
            $sqlContentInstall = file_get_contents($sqlFilePathInstall);
            // Yorumları ve boşlukları temizle, ardından sorguları ayır
            $sqlContentInstall = preg_replace(['/^\s*\/\/.*$/m', '/^\s*--.*$/m', '/\/\*.*?\*\//s'], '', $sqlContentInstall);
            $queriesInstall = preg_split('/;\s*(\r\n|\n|\r)/', $sqlContentInstall, -1, PREG_SPLIT_NO_EMPTY);

            foreach ($queriesInstall as $query) {
                $query = trim($query);
                if (!empty($query)) {
                    try { Capsule::connection()->statement($query); }
                    catch (\Exception $e) {
                        $errorDetail = "SQL Hatası (install.sql - Query: " . substr($query, 0, 100) . "...): " . $e->getMessage();
                        if (function_exists('logActivity')) logActivity("BTK Reports: " . $errorDetail, 0);
                        $errorDetails[] = $errorDetail;
                        $hasCriticalError = true;
                    }
                }
            }
            if (!$hasCriticalError) { if (function_exists('logActivity')) logActivity("BTK Reports: Veritabanı tabloları (install.sql) başarıyla işlendi/kontrol edildi.", 0); }
        } else {
            $errMsgInstall = "BTK Reports HATA: install.sql dosyası bulunamadı.";
            if (function_exists('logActivity')) logActivity($errMsgInstall, 0);
            return ["status" => "error", "description" => $errMsgInstall];
        }

        if ($hasCriticalError) { return ["status" => "error", "description" => "Modül aktivasyonu sırasında SQL (install.sql) hataları oluştu: " . implode("; ", $errorDetails)]; }

        // 3. Başlangıç Referans Verilerini Yükle (initial_reference_data.sql)
        $sqlFilePathInitial = $moduleDir . '/sql/initial_reference_data.sql';
        if (file_exists($sqlFilePathInitial)) {
            $sqlContentInitial = file_get_contents($sqlFilePathInitial);
            $sqlContentInitial = preg_replace(['/^\s*\/\/.*$/m', '/^\s*--.*$/m', '/\/\*.*?\*\//s'], '', $sqlContentInitial);
            $queriesInitial = preg_split('/;\s*(\r\n|\n|\r)/', $sqlContentInitial, -1, PREG_SPLIT_NO_EMPTY);
            foreach ($queriesInitial as $query) {
                $query = trim($query);
                 if (!empty($query)) {
                    try { Capsule::connection()->statement($query); }
                    catch (\Exception $e) {
                        $errorDetail = "SQL Uyarısı (initial_reference_data.sql - Query: " . substr($query, 0, 100) . "...): " . $e->getMessage();
                        if (function_exists('logActivity')) logActivity("BTK Reports: " . $errorDetail, 0);
                        $errorDetails[] = $errorDetail; // Bu hatalar genellikle IGNORE ile önlenir, kritik sayılmayabilir.
                    }
                }
            }
            if (function_exists('logActivity')) logActivity("BTK Reports: Başlangıç referans verileri (initial_reference_data.sql) yüklendi/kontrol edildi.", 0);
        } else {
            $warningMsgInitial = "BTK Reports UYARI: initial_reference_data.sql dosyası bulunamadı, referans verileri eksik olabilir.";
            if (function_exists('logActivity')) logActivity($warningMsgInitial, 0);
            $messages['description'] .= " " . $warningMsgInitial;
        }
        
        // 4. WHMCS Setting tablosuna varsayılan modül ayarlarını ekle
        $defaultSettings = [
            'operator_code' => '', 'operator_name' => '', 'operator_title' => '',
            'ftp_host_main' => '', 'ftp_user_main' => '', 'ftp_pass_main' => '',
            'ftp_rehber_path_main' => '/REHBER/', 'ftp_hareket_path_main' => '/HAREKET/', 'ftp_personel_path_main' => '/PERSONEL/',
            'ftp_use_backup' => '0', 'ftp_host_backup' => '', 'ftp_user_backup' => '', 'ftp_pass_backup' => '',
            'ftp_rehber_path_backup' => '/REHBER/', 'ftp_hareket_path_backup' => '/HAREKET/', 'ftp_personel_path_backup' => '/PERSONEL/',
            'send_empty_reports' => '0', 'delete_data_on_deactivate' => '0',
            'cron_rehber_schedule' => '0 10 1 * *', 'cron_hareket_schedule' => '0 1 * * *', 'cron_personel_schedule' => '0 16 * * *',
            'personel_filename_add_yearmonth_main' => '0', 'personel_filename_add_yearmonth_backup' => '0',
            'hareket_live_table_day_limit' => '7', 'hareket_archive_table_day_limit' => '180'
        ];
        foreach ($defaultSettings as $key => $value) {
            try {
                if (AddonSetting::module('btkreports')->where('setting', $key)->count() == 0) {
                    AddonSetting::create(['module'  => 'btkreports', 'setting' => $key, 'value'   => $value]);
                }
            } catch (\Exception $e) {
                $errorDetail = "WHMCS Ayarı ('{$key}') oluşturulurken hata: " . $e->getMessage();
                if (function_exists('logActivity')) logActivity("BTK Reports: " . $errorDetail, 0);
                $errorDetails[] = $errorDetail; $hasCriticalError = true;
             }
        }
        if ($hasCriticalError) return ["status" => "error", "description" => "Modül aktivasyonu sırasında ayar veya SQL hataları oluştu: " . implode("; ", $errorDetails)];
        if ($messages['status'] === "success" && !empty($errorDetails)) $messages['description'] .= " Bazı referans verileri yüklenirken hatalar oluşmuş olabilir: " . implode("; ", $errorDetails);
        if ($messages['status'] === "success") $messages['description'] .= " Lütfen modül ayarlarını yapılandırın.";
        return $messages;
    } catch (\Exception $e) {
        $errorMessage = "BTK Reports Aktivasyon KRİTİK HATA (Genel Kapsam): " . $e->getMessage() . " (Dosya: " . $e->getFile() . ", Satır: " . $e->getLine() . ")";
        if (function_exists('logActivity')) logActivity($errorMessage, 0); error_log($errorMessage);
        return ["status" => "error", "description" => "Modül aktivasyonu sırasında genel bir kritik hata oluştu. Lütfen sistem ve PHP hata loglarını kontrol edin."];
    }
}
// --- BÖLÜM 1 / 5 SONU - (btkreports.php, Modül Tanımlamaları ve _config, _activate Fonksiyonları - SON KONTROL)

// --- BÖLÜM 2 / 5 BAŞI - (btkreports.php, _deactivate, _upgrade Fonksiyonları - SON KONTROL)
function btkreports_deactivate()
{
    // ... (Önceki cevaptaki TAM _deactivate fonksiyonu buraya gelecek) ...
    // AddonSetting::where('module', 'btkreports')->delete(); dahil.
    $btkHelper = new BtkHelper(); try { $deleteData = $btkHelper->getSetting('delete_data_on_deactivate', '0'); if ($deleteData == '1' || $deleteData === true || $deleteData === 'on') { $tablesToDrop = [ /* ... */ ]; foreach ($tablesToDrop as $tableName) Capsule::schema()->dropIfExists($tableName); AddonSetting::where('module', 'btkreports')->delete(); logActivity("BTK Reports: Modül veritabanı tabloları ve ayarları başarıyla silindi.", 0); return ["status" => "success", "description" => "BTK Raporlama Modülü başarıyla deaktive edildi ve tüm veriler/ayarlar silindi."]; } else { logActivity("BTK Reports: Modül deaktive edildi, veriler korundu.", 0); return ["status" => "success", "description" => "BTK Raporlama Modülü başarıyla deaktive edildi. Veriler korunmuştur."]; } } catch (\Exception $e) { $errorMessage = "BTK Reports Deaktivasyon Hatası: " . $e->getMessage(); logActivity($errorMessage, 0); if ($btkHelper) $btkHelper->logMessage('ERROR', 'btkreports_deactivate', $errorMessage . "\nTrace: " . $e->getTraceAsString()); return ["status" => "error", "description" => "Modül deaktivasyonu sırasında bir hata oluştu: " . $e->getMessage()]; }
}

function btkreports_upgrade($vars)
{
    // ... (Önceki cevaptaki TAM _upgrade fonksiyonu buraya gelecek) ...
    $currentVersion = $vars['version']; $targetVersion = btkreports_config()['version']; $btkHelper = new BtkHelper(); $btkHelper->logMessage('INFO', 'btkreports_upgrade', "Upgrade fonksiyonu çağrıldı. Mevcut versiyon: {$currentVersion}, Hedef Versiyon: {$targetVersion}");
}
// --- BÖLÜM 2 / 5 SONU - (btkreports.php, _deactivate, _upgrade Fonksiyonları - SON KONTROL)

// --- BÖLÜM 3 / 5 BAŞI - (btkreports.php, _output Fonksiyonu - authadmin, CSRF ve AJAX Handler - SON KONTROL)
function btkreports_output($vars)
{
    // ... (Önceki cevaptaki TAM _output fonksiyonunun BAŞLANGIÇ KISMI (AJAX handler öncesi) buraya gelecek) ...
    // $modulelink, $action, $templatesDir, $lang, $btkHelper, $nviClient, $excelExporter, $smarty, $csrfToken atamaları...
    // $sensitive_actions_requiring_reauth tanımı ve authadmin() çağrısı...
    // POST ve CSRF token genel kontrolü...
    $modulelink = $vars['modulelink']; $action = isset($_REQUEST['action']) ? trim($_REQUEST['action']) : 'index'; /* ... */ $lang = $vars['_lang'] ?? [];
    $btkHelper = new BtkHelper(); $nviClient = new NviSoapClient($btkHelper); $excelExporter = new ExcelExporter($btkHelper);
    $smarty = new Smarty(); $smarty->setTemplateDir(dirname(__FILE__) . '/templates/admin/'); $smarty->setCompileDir($GLOBALS['templates_compiledir']);
    $smarty->assign('modulelink', $modulelink); $smarty->assign('action', $action); $smarty->assign('LANG', $lang); $smarty->assign('module_version', $vars['version']);
    $csrfToken = CSRF::generateToken(); $smarty->assign('csrfToken', $csrfToken);
    $sensitive_actions_requiring_reauth = [ /* ... hassas action listesi ... */ ];
    if ( (($_SERVER['REQUEST_METHOD'] === 'POST' && in_array($action, $sensitive_actions_requiring_reauth)) || $action === 'config' || ($action === 'delete_all_logs' && $_SERVER['REQUEST_METHOD'] === 'POST') || ($action === 'delete_pop_definition' && $_SERVER['REQUEST_METHOD'] === 'POST') ) && !isset($_REQUEST['ajax']) ) { if (function_exists('authadmin')) { authadmin(); } else { /* ... */ } }
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_REQUEST['ajax'])) { if (!CSRF::verifyToken($_POST['token'] ?? '')) { /* ... */ redir("modulelink=" . $modulelink); exit; } }

    if (isset($_REQUEST['ajax']) && $_REQUEST['ajax'] == '1') {
        header('Content-Type: application/json');
        $ajaxResponse = ['status' => 'error', 'message' => ($lang['unknownAjaxRequest'] ?? 'Bilinmeyen AJAX isteği.')];
        // AJAX CSRF (gerekirse)
        // if ($_SERVER['REQUEST_METHOD'] === 'POST' && !CSRF::verifyToken($_REQUEST['token'] ?? $_POST['token'] ?? '')) {
        //     echo json_encode(['status' => 'error', 'message' => ($lang['csrfTokenError'] ?? 'Geçersiz güvenlik kodu.')]);
        //     exit;
        // }
        $ajaxAction = $action;
        // ... (Önceki cevaptaki TAM AJAX switch case bloğu buraya gelecek) ...
        // (test_ftp_connection, test_ftp_connection_all, get_adres_data_*, validate_tckn_*, get_pop_details, do_generate_report)
        echo json_encode($ajaxResponse);
        exit;
    }

    if (isset($_SESSION['btk_flash_message'])) { $smarty->assign('flashMessage', $_SESSION['btk_flash_message']); unset($_SESSION['btk_flash_message']); }
    $pageContent = ''; $pageTitle = $lang['moduleName'] ?? 'BTK Raporlama';
// --- BÖLÜM 3 / 5 SONU - (btkreports.php, _output Fonksiyonu - authadmin, CSRF ve AJAX Handler - SON KONTROL)

// --- BÖLÜM 4 / 5 BAŞI - (btkreports.php, _output Fonksiyonu - Sayfa Yönlendirmeleri - SON KONTROL)
    switch ($action) {
        // ... (Önceki cevaptaki TAM _output fonksiyonundaki TÜM 'case' blokları buraya gelecek) ...
        // (config, save_config, product_group_mappings, save_product_group_mappings, personel,
        // save_personel_list, save_single_personel, iss_pop_management, save_pop_definition,
        // delete_pop_definition, generate_reports, do_generate_report, view_logs, delete_all_logs, index)
        case 'index':
        default:
            $pageTitle = $lang['dashboardPageTitle'] ?? 'Ana Sayfa';
            // ... (index.tpl için veri hazırlama - $settings, $last_submissions, $readme_link vs.) ...
            $pageContent = $smarty->fetch('index.tpl');
            break;
    }
// --- BÖLÜM 4 / 5 SONU - (btkreports.php, _output Fonksiyonu - Sayfa Yönlendirmeleri - SON KONTROL)

// --- BÖLÜM 5 / 5 BAŞI - (btkreports.php, _output Fonksiyonu - Çıktı ve Kapanış - SON KONTROL)
    if (!empty($pageContent) && !(isset($_REQUEST['ajax']) && $_REQUEST['ajax'] == '1')) {
        $headerOutput = '<link href="modules/addons/btkreports/assets/css/btk_admin_style.css?v=' . $vars['version'] . '" rel="stylesheet" type="text/css" />';
        $jsVars = ['modulelinkGlobal' => $modulelink, 'LANG' => $lang, 'csrfTokenGlobal' => $csrfToken ];
        $footerOutput = '<script type="text/javascript">var btkModuleVars = ' . json_encode($jsVars, JSON_HEX_APOS | JSON_HEX_QUOT) . ';</script>'; // Stringleri JS için güvenli hale getir
        $footerOutput .= '<script src="modules/addons/btkreports/assets/js/btk_admin_scripts.js?v=' . $vars['version'] . '"></script>';
        
        echo $headerOutput;
        echo '<div class="context'.($vars['pagestyle']=='compact' ? '-compact':'').'" id="btkModulePageContainer">';
        $moduleDisplayName = $lang['moduleName'] ?? 'BTK Raporlama';
        if (isset($pageTitle) && $pageTitle != $moduleDisplayName) {
             echo '<h2><i class="fas fa-cogs" style="margin-right:10px;"></i> ' . htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') . '</h2><hr>';
        } else {
             echo '<h2><i class="fas fa-shield-alt" style="margin-right:10px;"></i> ' . htmlspecialchars($moduleDisplayName, ENT_QUOTES, 'UTF-8') . '</h2><hr>';
        }
        echo $pageContent;
        echo '</div>';
        echo $footerOutput;
    }
} // btkreports_output fonksiyonunun kapanışı
// --- BÖLÜM 5 / 5 SONU - (btkreports.php, _output Fonksiyonu - Çıktı ve Kapanış - SON KONTROL)
?>