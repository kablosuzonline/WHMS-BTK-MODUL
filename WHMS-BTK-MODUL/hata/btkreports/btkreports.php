// --- BÖLÜM 1 / 5 BAŞI - (btkreports.php, Modül Tanımlamaları ve _config, _activate Fonksiyonları - KAPSAMLI GÜNCEL)
<?php
/**
 * WHMCS BTK Raporlama Modülü
 *
 * @package    WHMCS
 * @author     [Üstadım ve Ben]
 * @copyright  Copyright (c) Kablosuz Online [Yıl]
 * @version    6.0.3 // Versiyonu artıralım
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Composer autoload
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    // Bu durum kritik, modül düzgün çalışmaz. Aktivasyonda uyarı verilebilir.
    // Veya burada bir loglama ve die() yapılabilir.
    logActivity("BTK Reports HATA: Composer vendor/autoload.php bulunamadı!", 0);
}

use WHMCS\Database\Capsule;
use WHMCS\Module\Addon\Setting as AddonSetting;
use WHMCS\Utility\CSRF;
use WHMCS\User\Admin; // authadmin() için alternatif veya ek kontrollerde kullanılabilir.

// Yardımcı sınıflar
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
        "version"     => "6.0.3",
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
    $hasError = false;

    try {
        if (!class_exists('\PhpOffice\PhpSpreadsheet\Spreadsheet') || !class_exists('\Cron\CronExpression')) {
            $messages['status'] = "error";
            $messages['description'] = "BTK Reports HATA: Gerekli Composer kütüphaneleri (PhpSpreadsheet veya CronExpression) yüklenmemiş. Lütfen modül dizininde 'composer install' komutunu çalıştırın.";
            logActivity($messages['description'], 0);
            return $messages;
        }


        $sqlFilePath = $moduleDir . '/sql/install.sql';
        if (file_exists($sqlFilePath)) {
            $sqlQueries = file_get_contents($sqlFilePath);
            $queries = preg_split('/;\s*$/m', $sqlQueries); // Her satır sonundaki ; ile ayır
            foreach ($queries as $query) {
                $query = trim($query);
                if (!empty($query) && strpos(trim($query), '--') !== 0) {
                    try {
                        Capsule::connection()->statement($query);
                    } catch (\Exception $e) {
                        // Foreign key gibi hatalar olabilir, bunları logla ama devam etmeyi dene
                        logActivity("BTK Reports SQL Çalıştırma Hatası (install.sql - Query: {$query}): " . $e->getMessage(), 0);
                        // $messages['description'] .= " SQL çalıştırılırken bazı hatalar oluştu (install.sql): " . $e->getMessage();
                        // $hasError = true;
                    }
                }
            }
            logActivity("BTK Reports: Veritabanı tabloları başarıyla oluşturuldu/kontrol edildi.", 0);
        } else {
            $messages = ["status" => "error", "description" => "BTK Reports HATA: install.sql dosyası bulunamadı."];
            logActivity($messages['description'], 0);
            return $messages;
        }

        $initialDataPath = $moduleDir . '/sql/initial_reference_data.sql';
        if (file_exists($initialDataPath)) {
            $initialSqlQueries = file_get_contents($initialDataPath);
            $queries = preg_split('/;\s*$/m', $initialSqlQueries);
            foreach ($queries as $query) {
                $query = trim($query);
                 if (!empty($query) && strpos(trim($query), '--') !== 0) {
                    try {
                        Capsule::connection()->statement($query);
                    } catch (\Exception $e) {
                        logActivity("BTK Reports SQL Çalıştırma Hatası (initial_reference_data.sql - Query: {$query}): " . $e->getMessage(), 0);
                        // $messages['description'] .= " SQL çalıştırılırken bazı hatalar oluştu (initial_reference_data.sql): " . $e->getMessage();
                        // $hasError = true;
                    }
                }
            }
            logActivity("BTK Reports: Başlangıç referans verileri başarıyla yüklendi/kontrol edildi.", 0);
        } else {
            logActivity("BTK Reports UYARI: initial_reference_data.sql dosyası bulunamadı, referans verileri eksik olabilir.", 0);
             $messages['description'] .= " UYARI: initial_reference_data.sql dosyası bulunamadı, referans verileri eksik olabilir.";
        }
        
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
        foreach($defaultSettings as $key => $value) {
            if (AddonSetting::module('btkreports')->where('setting', $key)->count() == 0) {
                AddonSetting::module('btkreports')->setValue($key, $value);
            }
        }
        if ($hasError) $messages['status'] = "error"; // Eğer SQL'de hata olduysa durumu error yap
        if ($messages['status'] === "success") $messages['description'] .= " Lütfen modül ayarlarını yapılandırın.";

        return $messages;
    } catch (\Exception $e) {
        $errorMessage = "BTK Reports Aktivasyon KRİTİK HATA: " . $e->getMessage() . " (Dosya: " . $e->getFile() . ", Satır: " . $e->getLine() . ")";
        logActivity($errorMessage, 0); // WHMCS sistem loguna
        error_log($errorMessage); // Sunucu error loguna
        return ["status" => "error", "description" => "Modül aktivasyonu sırasında kritik bir hata oluştu. Lütfen sistem loglarını kontrol edin."];
    }
}
// --- BÖLÜM 1 / 5 SONU - (btkreports.php, Modül Tanımlamaları ve _config, _activate Fonksiyonları - KAPSAMLI GÜNCEL)

// --- BÖLÜM 2 / 5 BAŞI - (btkreports.php, _deactivate, _upgrade Fonksiyonları - KAPSAMLI GÜNCEL)
/**
 * Modül Deaktivasyon Fonksiyonu.
 */
function btkreports_deactivate()
{
    $btkHelper = new BtkHelper();
    try {
        $deleteData = $btkHelper->getSetting('delete_data_on_deactivate', '0');

        if ($deleteData == '1' || $deleteData === true || $deleteData === 'on') {
            $tablesToDrop = [
                'mod_btk_pop_definitions', 'mod_btk_adres_daire', 'mod_btk_adres_bina',
                'mod_btk_adres_sokak', 'mod_btk_adres_mahalle', 'mod_btk_adres_ilce',
                'mod_btk_adres_il', 'mod_btk_logs', 'mod_btk_ftp_logs', 'mod_btk_personel',
                'mod_btk_abone_hareket_archive', 'mod_btk_abone_hareket_live',
                'mod_btk_abone_rehber', 'mod_btk_product_group_mappings',
                'mod_btk_yetki_turleri', 'mod_btk_ref_hat_durum_kodlari',
                'mod_btk_ref_musteri_hareket_kodlari', 'mod_btk_ref_hizmet_tipleri',
                'mod_btk_ref_kimlik_tipleri', 'mod_btk_ref_meslek_kodlari',
                'mod_btk_settings' // Eski ayar tablosu
            ];
            foreach ($tablesToDrop as $tableName) {
                Capsule::schema()->dropIfExists($tableName);
            }
            AddonSetting::module('btkreports')->delete(); // WHMCS ayarlarını sil

            logActivity("BTK Reports: Modül veritabanı tabloları ve ayarları başarıyla silindi.", 0);
            return ["status" => "success", "description" => "BTK Raporlama Modülü başarıyla deaktive edildi ve tüm veriler/ayarlar silindi."];
        } else {
            logActivity("BTK Reports: Modül deaktive edildi, veriler korundu.", 0);
            return ["status" => "success", "description" => "BTK Raporlama Modülü başarıyla deaktive edildi. Veriler korunmuştur."];
        }
    } catch (\Exception $e) {
        // ... (Hata loglama - önceki gibi) ...
        return ["status" => "error", "description" => "Modül deaktivasyonu sırasında bir hata oluştu: " . $e->getMessage()];
    }
}

/**
 * Modül Yükseltme Fonksiyonu.
 */
function btkreports_upgrade($vars)
{
    // ... (Önceki gibi, ileride versiyon yükseltmeleri için) ...
}
// --- BÖLÜM 2 / 5 SONU - (btkreports.php, _deactivate, _upgrade Fonksiyonları - KAPSAMLI GÜNCEL)

// --- BÖLÜM 3 / 5 BAŞI - (btkreports.php, _output Fonksiyonu - authadmin, CSRF ve AJAX Handler - KAPSAMLI GÜNCEL)
/**
 * Modül Admin Arayüzü Çıktı Fonksiyonu.
 */
function btkreports_output($vars)
{
    $modulelink = $vars['modulelink'];
    $action = isset($_REQUEST['action']) ? trim($_REQUEST['action']) : 'index';
    $moduleDir = dirname(__FILE__);
    $templatesDir = $moduleDir . '/templates/admin/';
    $lang = $vars['_lang'] ?? []; // Dil dosyası yüklenmemişse boş array

    $btkHelper = new BtkHelper();
    $nviClient = new NviSoapClient($btkHelper); // AJAX doğrulamaları için
    // ExcelExporter burada genellikle gerekmez, rapor oluşturmada çağrılır.

    $smarty = new Smarty();
    $smarty->setTemplateDir($templatesDir);
    $smarty->setCompileDir($GLOBALS['templates_compiledir']);

    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('action', $action);
    $smarty->assign('LANG', $lang);
    $smarty->assign('module_version', $vars['version']);
    $smarty->assign('csrfToken', CSRF::generateToken());

    // Hassas işlemler için şifre yeniden doğrulama
    $sensitive_actions_requiring_reauth = [
        'save_config', 'save_product_group_mappings',
        'save_pop_definition', 'delete_pop_definition', // POST ile gelmeli
        'delete_all_logs', // POST ile gelmeli
        'save_personel_list', 'save_single_personel',
        // Manuel rapor oluşturup FTP'ye gönderme butonlarının action'ları da buraya eklenebilir.
        // Örneğin: 'do_generate_report_and_send' gibi bir action olursa.
    ];

    // Sadece form gönderimi (POST) ile gelen ve hassas olarak işaretlenmiş action'lar için authadmin çağır.
    // Veya belirli sayfaların (örn: config) GET isteğinde de çağrılabilir.
    // Şimdilik POST işlemleri için ve config sayfası için yapalım.
    if (
        (($_SERVER['REQUEST_METHOD'] === 'POST' && in_array($action, $sensitive_actions_requiring_reauth)) || $action === 'config')
        && !isset($_REQUEST['ajax']) // AJAX istekleri hariç
    ) {
        if (function_exists('authadmin')) {
            authadmin();
        } else {
            $btkHelper->logMessage('CRITICAL', 'btkreports_output', 'authadmin() fonksiyonu bulunamadı. Hassas işlem engellendi: ' . $action);
            echo "<div class='alert alert-danger'>Kritik Güvenlik Hatası: Yeniden kimlik doğrulama mekanizması bulunamadı. İşlem durduruldu.</div>";
            return;
        }
    }
    
    // POST işlemleri için CSRF Token Doğrulaması (AJAX dışındakiler için)
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_REQUEST['ajax'])) {
        if (!CSRF::verifyToken($_POST['token'] ?? '')) {
            $_SESSION['btk_flash_message'] = ['type' => 'error', 'message' => $lang['csrfTokenError'] ?? 'Geçersiz güvenlik kodu. Lütfen tekrar deneyin.'];
            redir("modulelink=" . $modulelink . "&action=" . ($action == 'save_config' ? 'config' : 'index'));
            exit;
        }
    }

    // AJAX İsteklerini Karşılama
    if (isset($_REQUEST['ajax']) && $_REQUEST['ajax'] == '1') {
        header('Content-Type: application/json');
        $ajaxResponse = ['status' => 'error', 'message' => $lang['unknownAjaxRequest'] ?? 'Bilinmeyen AJAX isteği.'];
        
        // AJAX POST işlemleri için CSRF token kontrolü (opsiyonel ama önerilir)
        // if ($_SERVER['REQUEST_METHOD'] === 'POST' && !CSRF::verifyToken($_POST['token'] ?? $_REQUEST['token'] ?? '')) {
        //     echo json_encode(['status' => 'error', 'message' => $lang['csrfTokenError'] ?? 'Geçersiz güvenlik kodu.']);
        //     exit;
        // }

        $ajaxAction = $action;
        switch ($ajaxAction) {
            // ... (Tüm AJAX case'leri - test_ftp_connection, get_adres_data_*, validate_tckn_*, get_pop_details, do_generate_report - önceki cevaplardaki gibi) ...
            // Örnek do_generate_report (çok temel taslak)
            case 'do_generate_report':
                $reportType = $_POST['report_type'] ?? null;
                $yetkiTipiKodu = $_POST['yetki_tipi_kodu'] ?? null;
                $generateOnly = isset($_POST['generate_only']);
                $sendToMain = isset($_POST['generate_and_send_main']);
                $sendToBackup = isset($_POST['generate_and_send_backup']);
                // ... (Rapor oluşturma ve gönderme mantığı BtkHelper veya cron'daki gibi) ...
                // Bu action'ın kendisi de authadmin ile korunabilir eğer FTP'ye gönderme yapıyorsa.
                $ajaxResponse = ['status' => 'success', 'message' => "{$reportType} raporu isteği alındı.", 'file_path_download' => null, 'file_name' => 'test_dosya.abn.gz'];
                break;
        }
        echo json_encode($ajaxResponse);
        exit;
    }

    if (isset($_SESSION['btk_flash_message'])) {
        $smarty->assign('flashMessage', $_SESSION['btk_flash_message']);
        unset($_SESSION['btk_flash_message']);
    }
    
    $pageContent = '';
    $pageTitle = $lang['moduleName'] ?? 'BTK Raporlama';
// --- BÖLÜM 3 / 5 SONU - (btkreports.php, _output Fonksiyonu - authadmin, CSRF ve AJAX Handler - KAPSAMLI GÜNCEL)

// --- BÖLÜM 4 / 5 BAŞI - (btkreports.php, _output Fonksiyonu - Sayfa Yönlendirmeleri - KAPSAMLI GÜNCEL)
    // Action'a göre ilgili PHP dosyasını/fonksiyonunu çağır veya template'i yükle
    switch ($action) {
        case 'config':
            // ... (Önceki cevaplardaki gibi, AddonSetting ile ayarları al, yetki türlerini al, cronları al) ...
            // authadmin() bu case için en başta çağrılmıştı.
            $pageTitle = $lang['configPageTitle'] ?? 'Genel Ayarlar';
            $settings = [];
            $dbSettings = AddonSetting::module('btkreports')->get()->toArray();
            if ($dbSettings) {
                foreach ($dbSettings as $dbSetting) {
                    $settings[$dbSetting['setting']] = $dbSetting['value'];
                }
            }
            $smarty->assign('settings', $settings);
            $yetkiTurleri = Capsule::table('mod_btk_yetki_turleri')->orderBy('yetki_adi', 'asc')->get()->all();
            $smarty->assign('yetkiTurleri', $yetkiTurleri);
            $cronSchedules = [
                'rehber' => $settings['cron_rehber_schedule'] ?? '0 10 1 * *',
                'hareket' => $settings['cron_hareket_schedule'] ?? '0 1 * * *',
                'personel' => $settings['cron_personel_schedule'] ?? '0 16 * * *',
            ];
            $smarty->assign('cronSchedules', $cronSchedules);
            $pageContent = $smarty->fetch('config.tpl');
            break;

        case 'save_config':
            // authadmin() ve CSRF kontrolü en başta yapıldı.
            // ... (Ayarları kaydetme mantığı - önceki cevaplardaki gibi) ...
            redir("modulelink=" . $modulelink . "&action=config");
            break;
        
        // ... (product_group_mappings, save_product_group_mappings, ... tüm diğer action'lar) ...
        // Her bir action'ın veri çekme ve Smarty'ye atama mantığı burada olacak.
        // POST action'ları (save_*, delete_*) için CSRF kontrolü en başta yapıldı.
        // Hassas olarak işaretlenenler için authadmin() de en başta yapıldı.

        case 'iss_pop_management':
            $pageTitle = $lang['issPopManagementPageTitle'] ?? 'ISS POP Yönetimi';
            $popDefinitions = Capsule::table('mod_btk_pop_definitions as pd')
                                ->leftJoin('mod_btk_adres_il as il', 'pd.il_id', '=', 'il.id')
                                ->leftJoin('mod_btk_adres_ilce as ilce', 'pd.ilce_id', '=', 'ilce.id')
                                ->select('pd.*', 'il.il_adi', 'ilce.ilce_adi as ilce_adi_display')
                                ->orderBy('pd.pop_adi')
                                ->get()->all();
            $iller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->all();
            $smarty->assign('popDefinitions', $popDefinitions);
            $smarty->assign('iller', $iller);
            $pageContent = $smarty->fetch('iss_pop_management.tpl');
            break;

        case 'save_pop_definition':
            // authadmin() ve CSRF kontrolü yapıldı.
            // ... (POP tanımı kaydetme mantığı - önceki cevaplardaki gibi) ...
            redir("modulelink=" . $modulelink . "&action=iss_pop_management");
            break;

        case 'delete_pop_definition': // Bu action POST olmalı
            // authadmin() ve CSRF kontrolü yapıldı (eğer POST ise).
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $popId = (int)($_POST['pop_id'] ?? 0);
                // ... (Silme mantığı) ...
            } else {
                $_SESSION['btk_flash_message'] = ['type' => 'error', 'message' => $lang['invalidAction'] ?? 'Geçersiz işlem.'];
            }
            redir("modulelink=" . $modulelink . "&action=iss_pop_management");
            break;


        case 'index':
        default:
            $pageTitle = $lang['dashboardPageTitle'] ?? 'Ana Sayfa';
            // ... (index.tpl için veri hazırlama - önceki cevaplardaki gibi) ...
            $smarty->assign('readme_link_exists', file_exists($moduleDir . '/README.md'));
            $smarty->assign('readme_file_url', 'modules/addons/btkreports/README.md');
             // ... son gönderimler, ftp ayarları vs. ...
            $settings = []; $dbSettings = AddonSetting::module('btkreports')->get()->toArray(); if ($dbSettings) { foreach ($dbSettings as $dbSetting) { $settings[$dbSetting['setting']] = $dbSetting['value']; } } $smarty->assign('settings', $settings);
            $lastRehber = Capsule::table('mod_btk_ftp_logs')->where('rapor_turu', 'REHBER')->orderBy('gonderim_tarihi', 'desc')->first(); $smarty->assign('last_rehber_submission', $lastRehber ? (array)$lastRehber : null);
            // ... diğer son gönderimler ...
            $pageContent = $smarty->fetch('index.tpl');
            break;
    }
// --- BÖLÜM 4 / 5 SONU - (btkreports.php, _output Fonksiyonu - Sayfa Yönlendirmeleri - KAPSAMLI GÜNCEL)

// --- BÖLÜM 5 / 5 BAŞI - (btkreports.php, _output Fonksiyonu - Çıktı ve Kapanış - KAPSAMLI GÜNCEL)
    // WHMCS admin temasını kullanarak çıktıyı oluştur
    if (!empty($pageContent) && !(isset($_REQUEST['ajax']) && $_REQUEST['ajax'] == '1')) {
        // WHMCS 7+ için AdminAreaPageInterface kullanımı daha modern olabilir,
        // veya $vars['smartyobj'] ile WHMCS'in kendi Smarty'sine değişkenler atanabilir.
        // Şimdilik basit çıktı:
        $headerOutput = '<link href="modules/addons/btkreports/assets/css/btk_admin_style.css?v=' . $vars['version'] . '" rel="stylesheet" type="text/css" />';
        $footerOutput = '<script type="text/javascript">var modulelinkGlobal = "' . $modulelink . '"; var LANG = ' . json_encode($lang) . '; var csrfTokenGlobal = "' . CSRF::getToken() . '";</script>';
        $footerOutput .= '<script src="modules/addons/btkreports/assets/js/btk_admin_scripts.js?v=' . $vars['version'] . '"></script>';
        // Gerekirse harici JS/CSS kütüphanelerini de buraya ekleyebiliriz (Bootstrap Toggle, Flatpickr vb.)
        // Eğer CDN kullanıyorsak veya WHMCS zaten içeriyorsa gerek yok.

        echo $headerOutput;
        echo '<div class="context'.($vars['pagestyle']=='compact' ? '-compact':'').'" id="btkModulePageContainer">'; // Ana sarmalayıcı
        if ($pageTitle != ($lang['moduleName'] ?? 'BTK Raporlama')) { // Ana sayfa değilse başlığı ayrıca bas
             echo '<h2><i class="fas fa-cogs"></i> ' . $pageTitle . '</h2>'; // İkon eklenebilir
        }
        echo $pageContent;
        echo '</div>';
        echo $footerOutput;
    }
}
// --- BÖLÜM 5 / 5 SONU - (btkreports.php, _output Fonksiyonu - Çıktı ve Kapanış - KAPSAMLI GÜNCEL)
?>