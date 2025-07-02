<?php
/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    6.5
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli yardımcı dosyaları dahil et
$baseLibPath = __DIR__ . '/lib/';
$GLOBALS['helperLoadedBtk'] = false; 
if (file_exists($baseLibPath . 'BtkHelper.php')) { 
    require_once $baseLibPath . 'BtkHelper.php'; 
    if (class_exists('BtkHelper')) $GLOBALS['helperLoadedBtk'] = true;
} 

if (!$GLOBALS['helperLoadedBtk']) {
    if(function_exists('logActivity')) logActivity("BTK Reports Critical Error: BtkHelper.php not found or class 'BtkHelper' not declared in btkreports.php!", 0);
    else error_log("BTK Reports Critical Error: BtkHelper.php not found or class 'BtkHelper' not declared in btkreports.php!");
}

if (file_exists($baseLibPath . 'NviSoapClient.php')) { require_once $baseLibPath . 'NviSoapClient.php'; }
else { if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Başlatma Hatası', 'CRITICAL', 'NviSoapClient.php bulunamadı.'); }

if (file_exists($baseLibPath . 'ExcelExporter.php')) { require_once $baseLibPath . 'ExcelExporter.php'; }
else { if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Başlatma Hatası', 'CRITICAL', 'ExcelExporter.php bulunamadı.'); }

$composerAutoloadPath = __DIR__ . '/vendor/autoload.php';
if (file_exists($composerAutoloadPath)) { require_once $composerAutoloadPath; }
else { if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Başlatma Hatası', 'UYARI', 'Composer autoload.php bulunamadı! Cron zamanlaması ve Excel işlemleri çalışmayabilir.'); }


use WHMCS\Database\Capsule;
use WHMCS\Utility\CSRF;
use WHMCS\User\Client;
use WHMCS\Service\Service;
use WHMCS\Product\Product;

/**
 * Modül yapılandırma fonksiyonu.
 */
function btkreports_config() {
    return [
        'name' => 'BTK Raporlama Modülü',
        'description' => 'BTK yasal raporlama yükümlülükleri için WHMCS eklenti modülü.',
        'version' => '6.5',
        'author' => 'KablosuzOnline & Gemini AI',
        'fields' => []
    ];
}

/**
 * Modül etkinleştirme fonksiyonu.
 */
function btkreports_activate() {
    try {
        $sqlInstallFile = __DIR__ . '/sql/install.sql';
        if (file_exists($sqlInstallFile)) {
            $sqlQueries = explode(';', file_get_contents($sqlInstallFile));
            foreach ($sqlQueries as $query) { $query = trim($query); if (!empty($query)) { Capsule::connection()->statement($query); }}
        } else { return ['status' => 'error', 'description' => 'Kurulum SQL dosyası (install.sql) bulunamadı.']; }

        $sqlInitialDataFile = __DIR__ . '/sql/initial_reference_data.sql';
        if (file_exists($sqlInitialDataFile)) {
            $sqlQueries = explode(';', file_get_contents($sqlInitialDataFile));
            foreach ($sqlQueries as $query) { $query = trim($query); if (!empty($query)) { Capsule::connection()->statement($query); }}
            if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'Başlangıç verileri SQL dosyası (initial_reference_data.sql) başarıyla işlendi.');
        } else { if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Aktivasyonu', 'Uyarı', 'Başlangıç verileri SQL dosyası (initial_reference_data.sql) bulunamadı.'); }
        
        if ($GLOBALS['helperLoadedBtk']) {
            BtkHelper::set_btk_setting('module_db_version', btkreports_config()['version']);
            // Mevcut WHMCS adminlerini mod_btk_personel tablosuna senkronize et
            $admins = Capsule::table('tbladmins')->get(['id', 'username', 'firstname', 'lastname', 'email'])->all();
            foreach ($admins as $admin) {
                BtkHelper::syncAdminToPersonel($admin->id, (array)$admin);
            }
            BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'BTK Raporlama Modülü başarıyla etkinleştirildi. WHMCS Adminleri senkronize edildi.');
        } else {
            error_log("BTK Reports Activation Warning: BtkHelper class not loaded. Some activation steps might have been skipped.");
        }
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi. Lütfen modül ayarlarını yapılandırın.'];
    } catch (Exception $e) {
        $errorMessage = 'Modül etkinleştirilirken hata oluştu: ' . $e->getMessage();
        if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Aktivasyonu', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        else error_log("BTK Reports Activation Error: " . $errorMessage . " Trace: " . $e->getTraceAsString());
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül devre dışı bırakma fonksiyonu.
 */
function btkreports_deactivate() {
    global $helperLoadedBtk;
    try {
        $deleteData = '0';
        if ($helperLoadedBtk) {
            $deleteDataSetting = BtkHelper::get_btk_setting('delete_data_on_deactivate');
            if ($deleteDataSetting !== null) { $deleteData = $deleteDataSetting; }
        }

        if ($deleteData === '1') {
            $tablesToDelete = [
                'mod_btk_service_pop_mapping', 'mod_btk_abone_hareket_archive', 'mod_btk_abone_hareket_live',
                'mod_btk_abone_rehber', 'mod_btk_ftp_logs', 'mod_btk_logs', 'mod_btk_personel',
                'mod_btk_personel_departmanlari', 'mod_btk_iss_pop_noktalari',
                'mod_btk_adres_mahalle', 'mod_btk_adres_ilce', 'mod_btk_adres_il',
                'mod_btk_product_group_mappings', 'mod_btk_secili_yetki_turleri',
                'mod_btk_yetki_turleri_referans', 'mod_btk_hat_durum_kodlari_referans',
                'mod_btk_musteri_hareket_kodlari_referans', 'mod_btk_kimlik_tipleri_referans',
                'mod_btk_meslek_kodlari_referans', 'mod_btk_settings', 'mod_btk_ek3_hizmet_tipleri'
            ];
            foreach ($tablesToDelete as $table) {
                if (Capsule::schema()->hasTable($table)) { Capsule::schema()->drop($table); }
            }
            if ($helperLoadedBtk) BtkHelper::logAction('Modül Deaktivasyonu', 'Başarılı', 'Tüm veriler silindi.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve tüm verileri silindi.'];
        } else {
            if ($helperLoadedBtk) BtkHelper::logAction('Modül Deaktivasyonu', 'Başarılı', 'Veriler korundu.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veriler korundu.'];
        }
    } catch (Exception $e) {
        $errorMessage = 'Modül devre dışı bırakılırken hata oluştu: ' . $e->getMessage();
         if ($helperLoadedBtk) BtkHelper::logAction('Modül Deaktivasyonu', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        else error_log("BTK Reports Deactivation Error: " . $errorMessage);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül admin arayüzü çıktı fonksiyonu.
 */
function btkreports_output($vars) {
    global $helperLoadedBtk;
    $modulelink = $vars['modulelink'];
    $action = isset($_REQUEST['action']) ? preg_replace("/[^a-zA-Z0-9_]/", "", trim($_REQUEST['action'])) : 'index';
    $LANG = $vars['_lang'] ?? [];
    $adminId = $helperLoadedBtk ? BtkHelper::getCurrentAdminId() : null;

    if (!$helperLoadedBtk) { 
        echo '<div class="alert alert-danger"><strong>Kritik Hata:</strong> BTK Raporlama Modülü temel yardımcı kütüphanesi (BtkHelper.php) yüklenemedi veya BtkHelper sınıfı tanımlanmamış. Lütfen modül dosyalarını ve PHP hata loglarını kontrol edin. Modül işlevsiz.</div>'; 
        return; 
    }

    $smarty = new Smarty();
    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('LANG', $LANG);
    $smarty->assign('assets_url', '../modules/addons/btkreports/assets');
    $smarty->assign('module_version_placeholder', btkreports_config()['version']);
    $smarty->assign('setting_version_placeholder', BtkHelper::get_btk_setting('module_db_version', btkreports_config()['version']));
    $smarty->assign('setting_surum_notlari_link_placeholder', BtkHelper::get_btk_setting('surum_notlari_link', '../modules/addons/btkreports/README.md'));
    
    if (class_exists('\WHMCS\App')) {
        $systemUrl = \WHMCS\App::get_system_url();
    } else {
        $systemUrl = rtrim($vars['systemurl'], '/');
    }
    
    $smarty->assign('logo_url', $systemUrl . '/modules/addons/btkreports/assets/img/logo.png'); 
    
    if (class_exists('WHMCS\Utility\CSRF')) { $smarty->assign('csrfToken', CSRF::generateToken()); }
    else { $smarty->assign('csrfToken', ''); }

    $menuItems = [
        'index' => ['label' => $LANG['dashboardPageTitle'] ?? 'Ana Sayfa', 'icon' => 'fas fa-tachometer-alt'],
        'config' => ['label' => $LANG['configPageTitle'] ?? 'Genel Ayarlar', 'icon' => 'fas fa-cogs'],
        'personel' => ['label' => $LANG['personelPageTitle'] ?? 'Personel Yönetimi', 'icon' => 'fas fa-users'],
        'isspop' => ['label' => $LANG['issPopManagementPageTitle'] ?? 'ISS POP Yönetimi', 'icon' => 'fas fa-broadcast-tower'],
        'product_group_mappings' => ['label' => $LANG['productGroupMappingsPageTitle'] ?? 'Ürün Grubu Eşleştirme', 'icon' => 'fas fa-link'],
        'generatereports' => ['label' => $LANG['generateReportsPageTitle'] ?? 'Manuel Raporlar', 'icon' => 'fas fa-rocket'],
        'viewlogs' => ['label' => $LANG['viewLogsPageTitle'] ?? 'Günlük Kayıtları', 'icon' => 'fas fa-history'],
    ];
    $smarty->assign('btkModuleMenuItems', $menuItems);
    $smarty->assign('currentModulePageAction', $action);

    echo '<div id="btkReportsModuleContainer" class="btk-module-container">';
    try {
        echo $smarty->fetch(__DIR__ . '/templates/admin/shared/admin_header_menu.tpl');
    } catch (SmartyException $e) { 
        BtkHelper::logAction('Smarty Hatası (Menu)', 'HATA', $e->getMessage() . ' Şablon: admin_header_menu.tpl', $adminId); 
        echo '<div class="alert alert-danger">Modül menüsü yüklenirken hata.</div>';
    }

    if (isset($_SESSION['BtkReportsFlashMessage'])) { 
        $smarty->assign('flashMessage', $_SESSION['BtkReportsFlashMessage']);
        unset($_SESSION['BtkReportsFlashMessage']); 
    }
    if (isset($_SESSION['BtkReportsFormErrorData'])) { 
        $smarty->assign('form_data', $_SESSION['BtkReportsFormErrorData']); 
        unset($_SESSION['BtkReportsFormErrorData']); 
    }

    BtkHelper::logAction('Modül Sayfa İsteği', 'DEBUG', "İstenen action: '$action'", $adminId, ['REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'N/A', 'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'] ?? 'N/A', 'GET_KEYS' => array_keys($_GET), 'POST_KEYS' => array_keys($_POST)]);

    $templateFile = 'index.tpl'; 
    switch ($action) {
        case 'config':
            btk_page_config($smarty, $modulelink, $LANG);
            $templateFile = 'config.tpl';
            break;
        case 'save_config':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $result = btk_action_save_config($_POST, $LANG); 
                $_SESSION['BtkReportsFlashMessage'] = $result; 
                if (isset($result['status']) && $result['status'] === 'error') { 
                    $_SESSION['BtkReportsFormErrorData'] = $_POST; 
                }
            }
            header("Location: " . $modulelink . "&action=config"); 
            exit;

        case 'personel':
            btk_page_personel($smarty, $modulelink, $LANG, $_GET);
            $templateFile = 'personel.tpl';
            break;
        case 'save_single_personel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_single_personel($_POST['modal_personel_data'], $LANG, $_POST['personel_id_modal']); 
            }
            header("Location: " . $modulelink . "&action=personel"); 
            exit;

        case 'delete_personel':
            if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify();
            $personel_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_personel($personel_id_to_delete, $LANG); 
            header("Location: " . $modulelink . "&action=personel"); 
            exit;
            
        case 'export_personel_excel': 
            if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify();
            btk_action_export_excel('PERSONEL', $LANG, $modulelink); 
            exit; 

        case 'isspop':
            btk_page_isspop($smarty, $modulelink, $LANG, $_GET);
            $templateFile = 'iss_pop_management.tpl';
            break;
        case 'save_pop_definition':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_isspop($_POST['popdata'], $LANG, $_POST['pop_id_modal']); 
            }
            header("Location: " . $modulelink . "&action=isspop"); 
            exit;
        case 'delete_pop_definition':
            if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify();
            $pop_id_to_delete = isset($_REQUEST['pop_id']) ? (int)$_REQUEST['pop_id'] : 0;
            $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_isspop($pop_id_to_delete, $LANG); 
            header("Location: " . $modulelink . "&action=isspop"); 
            exit;

        case 'product_group_mappings': 
            btk_page_product_group_mappings($smarty, $modulelink, $LANG); 
            $templateFile = 'product_group_mappings.tpl'; 
            break;
        case 'save_product_group_mappings': 
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_product_group_mappings($_POST['mappings'], $LANG); 
            } 
            header("Location: " . $modulelink . "&action=product_group_mappings"); 
            exit; 

        case 'generatereports': 
            btk_page_generate_reports($smarty, $modulelink, $LANG); 
            $templateFile = 'generate_reports.tpl'; 
            break;
        case 'do_generate_report': 
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['report_type'])) { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_do_generate_report($_POST, $LANG); 
            } 
            header("Location: " . $modulelink . "&action=generatereports"); 
            exit; 

        case 'viewlogs': 
            btk_page_view_logs($smarty, $modulelink, $LANG, $_GET); 
            $templateFile = 'view_logs.tpl'; 
            break;
        case 'delete_all_logs':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify();
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_all_logs($LANG);
            }
            header("Location: " . $modulelink . "&action=viewlogs");
            exit;
        
        // AJAX Actions
        case 'get_ilceler': 
        case 'get_mahalleler': 
        case 'search_pop_ssids': 
        case 'get_pop_details':
        case 'get_personel_details':
        case 'validate_tckn_personel':
        case 'validate_ykn_personel': 
        case 'test_ftp_connection': 
        case 'download_file':
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG), JSON_UNESCAPED_UNICODE);
            exit;

        case 'index': 
        default:
            btk_page_index($smarty, $modulelink, $LANG);
            $templateFile = 'index.tpl';
            break;
    }

    if (isset($templateFile) && file_exists(__DIR__ . '/templates/admin/' . $templateFile)) {
        try { 
            $output = $smarty->fetch(__DIR__ . '/templates/admin/' . $templateFile); 
            echo $output; 
        }
        catch (SmartyException $e) { 
            if (class_exists('BtkHelper')) BtkHelper::logAction('Smarty Hatası', 'HATA', $e->getMessage() . ' Şablon: ' . $templateFile, BtkHelper::getCurrentAdminId()); 
            echo '<div class="alert alert-danger">Şablon yükleme hatası: ' . htmlspecialchars($e->getMessage()) . ' (Lütfen sistem loglarını kontrol edin)</div>'; 
        }
    } elseif (isset($templateFile)) { 
        if (class_exists('BtkHelper')) BtkHelper::logAction('Şablon Hatası', 'HATA', 'Şablon dosyası bulunamadı: ' . $templateFile, BtkHelper::getCurrentAdminId()); 
        echo '<div class="alert alert-danger">İstenen şablon dosyası (' . htmlspecialchars($templateFile) . ') bulunamadı.</div>';
    }
    echo '</div>';
}

// -------- SAYFA İÇERİĞİ HAZIRLAMA VE ACTION FONKSİYONLARI --------

function btk_page_index(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['dashboardPageTitle'] ?? 'BTK Raporlama Ana Sayfa');
    $ftpMainStatus = BtkHelper::checkFtpConnection('main');
    $ftpBackupStatus = ['status' => 'info', 'message' => $LANG['backupFtpDisabled'] ?? 'Yedek FTP etkin değil.'];
    $settings = BtkHelper::getAllBtkSettings();
    if (isset($settings['backup_ftp_enabled']) && $settings['backup_ftp_enabled'] === '1') {
        $ftpBackupStatus = BtkHelper::checkFtpConnection('backup');
    }
    $smarty->assign('ftp_main_status', $ftpMainStatus);
    $smarty->assign('ftp_backup_status', $ftpBackupStatus);
    $smarty->assign('settings', $settings);
    
    $aktifGruplar = BtkHelper::getAktifYetkiTurleri('array_grup_names_only');
    $lastSubmissions = [];
    if (!empty($aktifGruplar)) {
        foreach($aktifGruplar as $grup) {
            $lastRehber = BtkHelper::getLastSuccessfulReportInfo('REHBER', 'ANA', $grup);
            $lastHareket = BtkHelper::getLastSuccessfulReportInfo('HAREKET', 'ANA', $grup);
            $lastSubmissions[$grup]['REHBER'] = ['tarih_saat' => $lastRehber ? date("d.m.Y H:i:s", strtotime($lastRehber['gonderim_zamani'] . ' UTC')) : ($LANG['noSubmissionYet'] ?? '-'), 'dosya_adi' => $lastRehber['dosya_adi'] ?? '-', 'cnt' => $lastRehber['cnt_numarasi'] ?? '-'];
            $lastSubmissions[$grup]['HAREKET'] = ['tarih_saat' => $lastHareket ? date("d.m.Y H:i:s", strtotime($lastHareket['gonderim_zamani'] . ' UTC')) : ($LANG['noSubmissionYet'] ?? '-'), 'dosya_adi' => $lastHareket['dosya_adi'] ?? '-', 'cnt' => $lastHareket['cnt_numarasi'] ?? '-'];
        }
    }
    $lastPersonel = BtkHelper::getLastSuccessfulReportInfo('PERSONEL', 'ANA');
    $lastSubmissions['PERSONEL'] = ['tarih_saat' => $lastPersonel ? date("d.m.Y H:i:s", strtotime($lastPersonel['gonderim_zamani'] . ' UTC')) : ($LANG['noSubmissionYet'] ?? '-'), 'dosya_adi' => $lastPersonel['dosya_adi'] ?? '-', 'cnt' => $lastPersonel['cnt_numarasi'] ?? '-'];
    $smarty->assign('last_submissions', $lastSubmissions);
    $smarty->assign('aktif_yetki_gruplari_for_index', $aktifGruplar);

    $smarty->assign('next_rehber_cron_run', BtkHelper::getNextCronRunTime('rehber_cron_schedule'));
    $smarty->assign('next_hareket_cron_run', BtkHelper::getNextCronRunTime('hareket_cron_schedule'));
    $smarty->assign('next_personel_cron_run', BtkHelper::getNextCronRunTime('personel_cron_schedule'));
    BtkHelper::logAction('Ana Sayfa Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}

function btk_page_config(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['configPageTitle'] ?? 'BTK Modül Ayarları');
    
    $settings_from_db = BtkHelper::getAllBtkSettings();
    $settings_for_template = $settings_from_db; 

    $form_data_session = $_SESSION['BtkReportsFormErrorData'] ?? null; 
    if ($form_data_session) {
        $settings_for_template = array_merge($settings_from_db, $form_data_session);
    }

    if (!empty($settings_from_db['main_ftp_pass'])) {
        $settings_for_template['main_ftp_pass'] = '********';
    }
    if (!empty($settings_from_db['backup_ftp_pass'])) {
        $settings_for_template['backup_ftp_pass'] = '********';
    }
    
    $yetkiTurleriReferans = BtkHelper::getAllYetkiTurleriReferans();
    $seciliYetkiTurleriDb = BtkHelper::getSeciliYetkiTurleri();
    $displayYetkiTurleri = [];
    if (is_array($yetkiTurleriReferans)) {
        foreach ($yetkiTurleriReferans as $yt_array) {
            $yt = (object)$yt_array;
            $is_aktif = 0;
            if ($form_data_session && isset($form_data_session['yetkiler']) && is_array($form_data_session['yetkiler'])) {
                $is_aktif = array_key_exists($yt->yetki_kodu, $form_data_session['yetkiler']) ? 1 : 0;
            } else {
                $is_aktif = isset($seciliYetkiTurleriDb[$yt->yetki_kodu]) ? 1 : 0;
            }
            $displayYetkiTurleri[] = ['kod' => $yt->yetki_kodu, 'ad' => $yt->yetki_adi, 'grup' => $yt->grup, 'aktif' => $is_aktif];
        }
    }

    $smarty->assign('settings', $settings_for_template);
    $smarty->assign('yetki_turleri', $displayYetkiTurleri);
    
    BtkHelper::logAction('Genel Ayarlar Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}

function btk_action_save_config($postData, $LANG) {
    $logKullaniciId = BtkHelper::getCurrentAdminId();
    if (empty(trim($postData['operator_code']))) { BtkHelper::logAction('Ayar Kaydetme Hatası', 'UYARI', 'Operatör Kodu boş.', $logKullaniciId); return ['status' => 'error', 'message' => $LANG['operatorCodeRequired'] ?? 'Operatör Kodu zorunludur.']; }
    if (empty(trim($postData['operator_name']))) { BtkHelper::logAction('Ayar Kaydetme Hatası', 'UYARI', 'Operatör Adı boş.', $logKullaniciId); return ['status' => 'error', 'message' => $LANG['operatorNameRequired'] ?? 'Operatör Adı zorunludur.']; }
    $textSettings = ['operator_code', 'operator_name', 'operator_title', 'main_ftp_host', 'main_ftp_user', 'main_ftp_port', 'main_ftp_rehber_path', 'main_ftp_hareket_path', 'main_ftp_personel_path', 'backup_ftp_host', 'backup_ftp_user', 'backup_ftp_port', 'backup_ftp_rehber_path', 'backup_ftp_hareket_path', 'backup_ftp_personel_path', 'rehber_cron_schedule', 'hareket_cron_schedule', 'personel_cron_schedule', 'hareket_live_table_days', 'hareket_archive_table_days', 'surum_notlari_link', 'admin_records_per_page', 'log_records_per_page'];
    foreach ($textSettings as $key) { if (isset($postData[$key])) BtkHelper::set_btk_setting($key, trim($postData[$key])); }
    $checkboxSettings = ['main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 'personel_filename_add_year_month_main', 'personel_filename_add_year_month_backup', 'show_btk_info_if_empty_clientarea'];
    foreach ($checkboxSettings as $key) { BtkHelper::set_btk_setting($key, isset($postData[$key]) && ($postData[$key] === 'on' || $postData[$key] === '1') ? '1' : '0'); }
    if (isset($postData['main_ftp_pass'])) { BtkHelper::set_btk_setting('main_ftp_pass', trim($postData['main_ftp_pass'])); }
    if (isset($postData['backup_ftp_pass'])) { BtkHelper::set_btk_setting('backup_ftp_pass', trim($postData['backup_ftp_pass'])); }
    BtkHelper::saveSeciliYetkiTurleri(isset($postData['yetkiler']) && is_array($postData['yetkiler']) ? $postData['yetkiler'] : []);
    BtkHelper::logAction('Ayarlar Kaydedildi', 'BAŞARILI', 'Modül ayarları güncellendi.', $logKullaniciId);
    return ['status' => 'success', 'message' => $LANG['configSaveSuccess'] ?? 'Ayarlar başarıyla kaydedildi.'];
}

function btk_page_personel(&$smarty, $modulelink, $LANG, $filters = []) {
    $smarty->assign('page_title', $LANG['personelPageTitle'] ?? 'Personel Yönetimi');
    $adminId = BtkHelper::getCurrentAdminId();
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int)$filters['page'] : 1; if ($page < 1) $page = 1;
    $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20); $offset = ($page - 1) * $limit;
    $personelResult = BtkHelper::getPersonelList($filters, 'p.soyad', 'ASC', $limit, $offset);
    $smarty->assign('personelListesi', $personelResult['data']);
    $smarty->assign('departmanlar', BtkHelper::getDepartmanList());
    $smarty->assign('tum_ilceler_listesi', BtkHelper::getTumIlcelerWithIlAdi());
    try { $smarty->assign('whmcs_admin_users', Capsule::table('tbladmins')->where('disabled', 0)->orderBy('firstname')->get(['id', 'username', 'firstname', 'lastname'])->all()); }
    catch (Exception $e) { BtkHelper::logAction('WHMCS Admin Listesi Çekme Hatası', 'HATA', $e->getMessage()); $smarty->assign('whmcs_admin_users', []);}
    $totalPages = ($limit > 0 && $personelResult['total_count'] > 0) ? ceil($personelResult['total_count'] / $limit) : 1;
    $smarty->assign('current_page', $page); $smarty->assign('total_pages', $totalPages); $smarty->assign('total_items', $personelResult['total_count']);
    $preservedFilters = $filters; if(isset($preservedFilters['filter'])) unset($preservedFilters['filter']);
    $smarty->assign('pagination_params', !empty($preservedFilters) ? '&filter=1&' . http_build_query($preservedFilters) : '');
    BtkHelper::logAction('Personel Sayfası Görüntülendi', 'INFO', "Sayfa: $page, Filtreler: " . json_encode($filters), $adminId);
}

function btk_action_save_single_personel($postData, $LANG, $personelId = 0) {
    $adminId = BtkHelper::getCurrentAdminId();
    $postData['personel_id'] = $personelId;
    $result = BtkHelper::savePersonel($postData, $adminId);
    $messageKey = ($result['status'] && (int)$personelId > 0) ? 'personelDetailSaveSuccess' : ($result['status'] ? 'personelAddSuccess' : 'personelDetailSaveError');
    $finalMessage = ($LANG[$messageKey] ?? $result['message']);
    if (isset($result['nvi_status']) && $result['nvi_status'] !== 'Dogrulandi' && !empty($result['nvi_message'])) { 
        $finalMessage .= '<br><b>NVI Doğrulama:</b> ' . htmlspecialchars($result['nvi_message']); 
    }
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => $finalMessage];
}

function btk_action_delete_personel($personelId, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('Personel Silme İsteği', 'UYARI', "Silinecek Personel ID: $personelId", $adminId);
    if (empty($personelId) || !is_numeric($personelId) || $personelId <= 0) { BtkHelper::logAction('Personel Silme Hatası', 'HATA', 'Geçersiz Personel ID.', $adminId); return ['type' => 'error', 'message' => $LANG['invalidPersonelId'] ?? 'Geçersiz Personel ID.'];}
    $result = BtkHelper::deletePersonel((int)$personelId, $adminId);
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => $result['message']];
}

function btk_page_isspop(&$smarty, $modulelink, $LANG, $filters = []) {
    $smarty->assign('page_title', $LANG['issPopManagementPageTitle'] ?? 'ISS POP Noktası Yönetimi');
    $adminId = BtkHelper::getCurrentAdminId();
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int)$filters['page'] : 1; if ($page < 1) $page = 1;
    $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20); $offset = ($page - 1) * $limit;
    $popResult = BtkHelper::getIssPopNoktalariList($filters, 'pop.pop_adi', 'ASC', $limit, $offset);
    $smarty->assign('popDefinitions', $popResult['data']);
    $smarty->assign('iller', BtkHelper::getIller());
    $totalPages = ($limit > 0 && $popResult['total_count'] > 0) ? ceil($popResult['total_count'] / $limit) : 1;
    $smarty->assign('current_page_isspop', $page); $smarty->assign('total_pages_isspop', $totalPages); $smarty->assign('total_items_isspop', $popResult['total_count']);
    $preservedFilters = $filters; if(isset($preservedFilters['filter_isspop'])) unset($preservedFilters['filter_isspop']);
    $smarty->assign('pagination_params_isspop', !empty($preservedFilters) ? '&filter_isspop=1&' . http_build_query($preservedFilters) : '');
    BtkHelper::logAction('ISS POP Sayfası Görüntülendi', 'INFO', "Sayfa: $page, Filtreler: " . json_encode($filters), $adminId);
}
function btk_action_save_isspop($postData, $LANG, $popId = 0) { 
    $adminId = BtkHelper::getCurrentAdminId();
    $postData['pop_id_modal'] = $popId;
    BtkHelper::logAction('ISS POP Kaydetme İsteği', 'DEBUG', 'Veri alındı.', $adminId, ['keys_in_post_count' => count($postData)]);
    $result = BtkHelper::saveIssPopNoktasi($postData); 
    $messageKey = ($result['status'] && (int)$popId > 0) ? 'popDefinitionUpdateSuccess' : ($result['status'] ? 'popDefinitionAddSuccess' : 'popDefinitionSaveError'); 
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => ($LANG[$messageKey] ?? $result['message'])]; 
}
function btk_action_delete_isspop($popId, $LANG) { 
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('ISS POP Silme İsteği', 'UYARI', "Silinecek POP ID: $popId", $adminId);
    if (empty($popId) || !is_numeric($popId) || (int)$popId <= 0) { BtkHelper::logAction('ISS POP Silme Hatası', 'HATA', 'Geçersiz POP ID.', $adminId); return ['type' => 'error', 'message' => $LANG['invalidPopId'] ?? 'Geçersiz POP ID.']; } 
    $result = BtkHelper::deleteIssPopNoktasi((int)$popId, $adminId); 
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => $result['message']]; 
}
function btk_action_import_isspop_excel($fileData, $LANG) { 
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('ISS POP Excel Import İsteği', 'INFO', 'Dosya adı: ' . ($fileData['name'] ?? 'Bilinmiyor'), $adminId);
    if (!class_exists('ExcelExporter')) { $errorMsg = $LANG['excelLibNotLoaded'] ?? 'Excel kütüphanesi (ExcelExporter.php) yüklenemedi.'; BtkHelper::logAction('ISS POP Excel Import Hatası', 'CRITICAL', $errorMsg, $adminId); return ['type' => 'error', 'message' => $errorMsg]; } 
    if (!isset($fileData['tmp_name']) || $fileData['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($fileData['tmp_name'])) { $errorMsg = ($LANG['fileUploadError'] ?? 'Dosya yüklenirken hata oluştu veya dosya geçerli değil. Hata Kodu: ') . ($fileData['error'] ?? 'Bilinmiyor'); BtkHelper::logAction('ISS POP Excel Import Hatası', 'HATA', $errorMsg, $adminId); return ['type' => 'error', 'message' => $errorMsg]; } 
    $excelData = ExcelExporter::importIssPopFromExcel($fileData['tmp_name']); @unlink($fileData['tmp_name']); 
    if ($excelData === false) { return ['type' => 'error', 'message' => $LANG['excelReadError'] ?? 'Excel dosyası okunamadı veya formatı geçersiz. Lütfen örnek şablonu kontrol edin ve dosyanın .xlsx formatında olduğundan emin olun.']; } 
    if (empty($excelData)) { return ['type' => 'info', 'message' => $LANG['excelEmptyData'] ?? 'Excel dosyasında işlenecek veri bulunamadı.']; } 
    $importedCount = 0; $errorCount = 0; $skippedCount = 0; $errors = []; 
    foreach ($excelData as $rowIndex => $popRow) { 
        if(!empty($popRow['il_adi_excel'])) $popRow['il_id'] = BtkHelper::getIlIdByAdi($popRow['il_adi_excel']); 
        if(!empty($popRow['ilce_adi_excel']) && !empty($popRow['il_id'])) $popRow['ilce_id'] = BtkHelper::getIlceIdByAdi($popRow['ilce_adi_excel'], $popRow['il_id']); 
        if (empty($popRow['pop_adi']) || empty($popRow['yayin_yapilan_ssid'])) { $errors[] = ($rowIndex+2) . ". satır: POP Adı/SSID boş, atlandı."; $skippedCount++; continue; } 
        $saveResult = BtkHelper::saveIssPopNoktasi($popRow); 
        if(isset($saveResult['status']) && $saveResult['status']) $importedCount++; else { $errorCount++; $errors[] = ($rowIndex+2) . ". satır: " . ($saveResult['message'] ?? 'Bilinmeyen kaydetme hatası'); }
    } 
    $message = sprintf(($LANG['excelImportSummary'] ?? "Excel içe aktarma: %s işlendi, %s hata, %s atlandı."), $importedCount, $errorCount, $skippedCount); 
    if(!empty($errors)) { $message .= "<br><br><b>Hata Detayları (ilk 10):</b><br>" . implode("<br>", array_slice($errors,0,10)); if(count($errors) > 10) $message .= "<br>...ve daha fazla hata (lütfen logları kontrol edin).";} 
    BtkHelper::logAction('ISS POP Excel Import Sonucu', $errorCount > 0 || $skippedCount > 0 ? 'UYARI' : 'BAŞARILI', $message, $adminId); 
    return ['type' => $errorCount > 0 || $skippedCount > 0 ? 'warning' : 'success', 'message' => $message];
}
function btk_action_export_excel($reportType, $LANG, $modulelink) { 
    if (!class_exists('ExcelExporter')) { $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['excelLibNotLoaded'] ?? 'Excel kütüphanesi yüklenemedi.']; header("Location: " . $modulelink . ($reportType === 'PERSONEL' ? '&action=personel' : '&action=isspop')); exit; } 
    $adminId = BtkHelper::getCurrentAdminId(); $filename = ''; $data = []; 
    if ($reportType === 'PERSONEL') { 
        $data = BtkHelper::getPersonelDataForReport(); 
        $filename = BtkHelper::generateReportFilename(BtkHelper::get_btk_setting('operator_name'), null, null, 'PERSONEL_LISTESI', '01', time(), 'main'); 
        if (empty($data) && BtkHelper::get_btk_setting('send_empty_reports') !== '1') { BtkHelper::logAction('Personel Excel Export Atlandı', 'BİLGİ', 'Veri yok.', $adminId); $_SESSION['BtkReportsFlashMessage'] = ['type' => 'info', 'message' => $LANG['noDataToExportPersonel'] ?? 'Dışa aktarılacak personel verisi bulunamadı.']; header("Location: " . $modulelink . "&action=personel"); exit; } 
        ExcelExporter::exportPersonelList($data, $filename, true); exit; 
    } elseif ($reportType === 'ISSPOP') { 
        $popResult = BtkHelper::getIssPopNoktalariList([], 'pop.pop_adi', 'ASC', 10000, 0); 
        $dataToExport = []; 
        if (is_array($popResult['data'])) { 
            foreach($popResult['data'] as $pop) { 
                $dataToExport[] = [ 
                    'POP Adı / Lokasyon Adı' => $pop['pop_adi'], 
                    'YAYIN YAPILAN SSID' => $pop['yayin_yapilan_ssid'], 
                    'IP ADRESİ' => $pop['ip_adresi'], 
                    'TÜRÜ' => $pop['pop_tipi'], 
                    'MARKASI' => $pop['cihaz_markasi'], 
                    'MODELİ' => $pop['cihaz_modeli'], 
                    'İL' => $pop['il_adi'], 
                    'İLÇE' => $pop['ilce_adi'], 
                    'MAHALLE' => $pop['mahalle_adi'] ?? '', 
                    'TAM ADRES' => $pop['tam_adres'], 
                    'KOORDİNATLAR' => $pop['koordinatlar'], 
                    'AKTİF/PASİF' => ($pop['aktif_pasif_durum'] ? 'Aktif' : 'Pasif') 
                ];
            }
        } 
        $filename = BtkHelper::generateReportFilename(BtkHelper::get_btk_setting('operator_name'), null, null, 'ISS_POP_LISTESI', '01', time(), 'main'); 
        if (empty($dataToExport) && BtkHelper::get_btk_setting('send_empty_reports') !== '1') { $_SESSION['BtkReportsFlashMessage'] = ['type' => 'info', 'message' => $LANG['noDataToExportIssPop'] ?? 'Dışa aktarılacak ISS POP verisi bulunamadı.']; header("Location: " . $modulelink . "&action=isspop"); exit;} 
        ExcelExporter::exportGenericList($dataToExport, $filename, 'ISS POP Listesi', true); 
        BtkHelper::logAction('ISS POP Excel Export', 'BİLGİ', 'ISS POP listesi dışa aktarıldı.', $adminId);
        exit; 
    } 
    $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['unknownExportType'] ?? 'Bilinmeyen Excel dışa aktarma türü.']; 
    header("Location: " . $modulelink); exit;
}

function btk_page_product_group_mappings(&$smarty, $modulelink, $LANG) { 
    $smarty->assign('page_title', $LANG['productGroupMappingsPageTitle'] ?? 'Ürün Grubu - BTK Yetki Eşleştirme'); 
    try {
        $productGroups = Capsule::table('tblproductgroups')->where('hidden',0)->orderBy('order')->orderBy('name')->get(['id', 'name', 'headline'])->all();
        $smarty->assign('productGroups', array_map(function($item){ return (array)$item; }, $productGroups));
    } catch (Exception $e) { BtkHelper::logAction('Ürün Grupları Okuma Hatası', 'HATA', $e->getMessage()); $smarty->assign('productGroups', []); $smarty->assign('errorMessage', ($LANG['dbReadError'] ?? 'Veritabanı okuma hatası: ') . $e->getMessage()); }
    $smarty->assign('activeBtkAuthTypes', BtkHelper::getAktifYetkiTurleri('object_list')); 
    $smarty->assign('allEk3HizmetTipleri', BtkHelper::getAllEk3HizmetTipleri()); 
    $smarty->assign('allEk3HizmetTipleriJson', json_encode(BtkHelper::getAllEk3HizmetTipleri(), JSON_UNESCAPED_UNICODE)); 
    $smarty->assign('currentMappings', BtkHelper::getProductGroupMappingsArray());
    BtkHelper::logAction('Ürün Grubu Eşleştirme Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_save_product_group_mappings($mappingsData, $LANG) { 
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('Ürün Grubu Eşleştirme Kaydetme İsteği', 'DEBUG', null, $adminId, ['keys_in_post' => array_keys($mappingsData)]);
    $result = BtkHelper::saveProductGroupMappings($mappingsData); 
    if($result) { return ['type' => 'success', 'message' => $LANG['mappingsSaveSuccess'] ?? 'Eşleştirmeler başarıyla kaydedildi.']; } 
    return ['type' => 'error', 'message' => $LANG['mappingsSaveError'] ?? 'Eşleştirmeler kaydedilirken bir hata oluştu.'];
}

function btk_page_generate_reports(&$smarty, $modulelink, $LANG) { 
    $smarty->assign('page_title', $LANG['generateReportsPageTitle'] ?? 'Manuel Rapor Oluşturma ve Gönderme'); 
    $smarty->assign('activeBtkAuthTypesForReports', BtkHelper::getAktifYetkiTurleri('object_list')); 
    $smarty->assign('settings', BtkHelper::getAllBtkSettings()); 
    BtkHelper::logAction('Manuel Rapor Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_do_generate_report($postData, $LANG) { 
    $adminId = BtkHelper::getCurrentAdminId();
    $reportType = $postData['report_type'] ?? null;
    $yetkiKoduInput = $postData['yetki_tipi_kodu'] ?? null; 
    $generateOnly = isset($postData['generate_only']);
    $sendMainFtp = isset($postData['generate_and_send_main']);
    $sendBackupFtp = isset($postData['generate_and_send_backup']);

    if (empty($reportType)) return ['type' => 'error', 'message' => $LANG['reportTypeRequired'] ?? 'Rapor türü seçilmelidir.'];
    if (strtoupper($reportType) !== 'PERSONEL' && empty($yetkiKoduInput)) { 
        return ['type' => 'error', 'message' => ($LANG['yetkiKoduRequiredForReport'] ?? 'REHBER veya HAREKET için Yetki Türü seçilmelidir.')];
    }

    $yetkiGrup = null;
    if ($yetkiKoduInput && strtoupper($reportType) !== 'PERSONEL') {
        $yetkiRef = Capsule::table('mod_btk_yetki_turleri_referans')->where('yetki_kodu', $yetkiKoduInput)->first();
        if ($yetkiRef) {
            $yetkiGrup = $yetkiRef->grup;
        }
    }
    
    BtkHelper::logAction('Manuel Rapor Oluşturma Başladı', 'INFO', "Rapor: $reportType, Yetki Kodu: $yetkiKoduInput, Yetki Grup: $yetkiGrup", $adminId);
    $reportResult = BtkHelper::triggerReportGeneration($reportType, $yetkiGrup, $generateOnly, $sendMainFtp, $sendBackupFtp, $adminId);
    return ['type' => $reportResult['status'], 'message' => $reportResult['message'], 'file_path_download' => $reportResult['file_path_download'] ?? null, 'file_name' => $reportResult['file_name'] ?? null]; 
}

function btk_page_view_logs(&$smarty, $modulelink, $LANG, $filters = []) { 
    $smarty->assign('page_title', $LANG['viewLogsPageTitle'] ?? 'Modül Günlük Kayıtları');
    $adminId = BtkHelper::getCurrentAdminId();
    $log_limit = (int)BtkHelper::get_btk_setting('log_records_per_page', 50);
    $page = isset($filters['page']) && is_numeric($filters['page']) ? (int)$filters['page'] : 1;
    $offset = ($page - 1) * $log_limit;

    $selectedLogType = $filters['s_log_type'] ?? '';
    $smarty->assign('log_type_to_display', $selectedLogType);

    $moduleLogsResult = ['data' => [], 'total_count' => 0];
    $ftpLogsResult = ['data' => [], 'total_count' => 0];
    
    if (empty($selectedLogType) || $selectedLogType !== 'FTP') {
        $moduleLogsResult = BtkHelper::getModuleLogs($filters, 'id', 'DESC', $log_limit, $offset);
    }
    if (empty($selectedLogType) || $selectedLogType === 'FTP') {
        $ftpLogsResult = BtkHelper::getFtpLog($filters, 'id', 'DESC', $log_limit, $offset);
    }
    
    $smarty->assign('generalLogs', $moduleLogsResult['data']);
    $smarty->assign('pagination_output_general', buildPagination($modulelink . "&action=viewlogs&filter_log=1&" . http_build_query(array_filter($filters)), $page, ceil($moduleLogsResult['total_count'] / $log_limit), $LANG));
    
    $smarty->assign('ftpLogs', $ftpLogsResult['data']);
    $smarty->assign('pagination_output_ftp', buildPagination($modulelink . "&action=viewlogs&filter_log=1&" . http_build_query(array_filter($filters)), $page, ceil($ftpLogsResult['total_count'] / $log_limit), $LANG));

    if ($moduleLogsResult['total_count'] === 0 && $ftpLogsResult['total_count'] === 0) {
        $smarty->assign('noLogsFoundForFilter', true);
    } else {
        $smarty->assign('noLogsFoundForFilter', false);
    }

    BtkHelper::logAction('Log Sayfası Görüntülendi', 'INFO', "Filtreler: " . json_encode($filters), $adminId);
}

function btk_action_delete_all_logs($LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    try {
        Capsule::table('mod_btk_logs')->truncate();
        Capsule::table('mod_btk_ftp_logs')->truncate();
        BtkHelper::logAction('Tüm Loglar Silindi', 'UYARI', 'Tüm modül ve FTP günlük kayıtları silindi.', $adminId);
        return ['type' => 'success', 'message' => $LANG['logsDeletedSuccess'] ?? 'Tüm günlük kayıtları başarıyla silindi.'];
    } catch (Exception $e) {
        BtkHelper::logAction('Tüm Logları Silme Hatası', 'HATA', $e->getMessage(), $adminId);
        return ['type' => 'error', 'message' => $LANG['logsDeletedError'] ?? 'Günlük kayıtları silinirken bir hata oluştu.'];
    }
}


function btk_handle_ajax_requests($ajax_action, $request_data, $LANG) {
    $response = ['status' => 'error', 'message' => ($LANG['unknownAjaxRequest'] ?? 'Bilinmeyen AJAX isteği.'), 'data' => null];
    $adminId = BtkHelper::getCurrentAdminId();
    try {
        $csrfTokenName = class_exists('WHMCS\Utility\CSRF') ? CSRF::getTokenName() : 'token';
        $submittedToken = $request_data[$csrfTokenName] ?? ($request_data['token'] ?? '');
        
        $isPostRequest = $_SERVER['REQUEST_METHOD'] === 'POST';
        $tokenRequiredActions = ['get_pop_details', 'get_personel_details', 'validate_tckn_personel', 'validate_ykn_personel', 'test_ftp_connection', 'download_file']; 

        if ($isPostRequest || in_array($ajax_action, $tokenRequiredActions)) {
            if (!class_exists('WHMCS\Utility\CSRF') || !CSRF::verifyToken($csrfTokenName, $submittedToken)) {
                 if(!in_array($ajax_action, ['get_ilceler', 'get_mahalleler', 'search_pop_ssids'])){
                    BtkHelper::logAction("AJAX CSRF Hatası ($ajax_action)", 'UYARI', 'Geçersiz/Eksik CSRF token.', $adminId);
                    return ['status' => 'error', 'message' => $LANG['csrfTokenError'] ?? 'Güvenlik hatası. Lütfen sayfayı yenileyip tekrar deneyin.'];
                 }
            }
        }
        
        switch ($ajax_action) {
            case 'get_ilceler': 
                $items = BtkHelper::getIlcelerByIlId($request_data['parent_id']);
                $response = ['status' => 'success', 'items' => array_map(function($item){ return ['id' => $item['id'], 'name' => $item['ilce_adi']];}, $items)];
                break;
            case 'get_mahalleler':
                $items = BtkHelper::getMahallelerByIlceId($request_data['parent_id']);
                $response = ['status' => 'success', 'items' => array_map(function($item){ return ['id' => $item['id'], 'name' => $item['mahalle_adi']];}, $items)];
                break;
            case 'get_pop_details':
                $pop = BtkHelper::getIssPopNoktasiById($request_data['pop_id']);
                $response = ['status' => $pop ? 'success' : 'error', 'pop' => $pop];
                break;
            case 'get_personel_details':
                $personel = BtkHelper::getPersonelById($request_data['personel_id']);
                if ($personel) {
                    $personel['ise_baslama_tarihi_formatted'] = $personel['ise_baslama_tarihi'] ? date('Y-m-d', strtotime($personel['ise_baslama_tarihi'])) : '';
                    $personel['isten_ayrilma_tarihi_formatted'] = $personel['isten_ayrilma_tarihi'] ? date('Y-m-d', strtotime($personel['isten_ayrilma_tarihi'])) : '';
                }
                $response = ['status' => $personel ? 'success' : 'error', 'personel' => $personel];
                break;
            case 'test_ftp_connection':
                $response = BtkHelper::testFtpConnectionWithDetails(
                    $request_data['host'] ?? '',
                    $request_data['user'] ?? '',
                    $request_data['pass'] ?? '',
                    $request_data['port'] ?? 21,
                    ($request_data['ssl'] ?? '0') === '1',
                    ucfirst($request_data['ftp_type'] ?? 'FTP')
                );
                break;
            case 'download_file':
                $filePath = $request_data['file_path'] ?? null;
                $tempDir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
                if ($filePath && strpos(realpath($filePath), realpath($tempDir)) === 0 && file_exists($filePath)) {
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($filePath));
                    readfile($filePath);
                    @unlink($filePath);
                    exit;
                } else {
                    $response = ['status' => 'error', 'message' => $LANG['fileNotFound'] ?? 'Dosya bulunamadı.'];
                    BtkHelper::logAction('Dosya İndirme Hatası', 'HATA', 'Dosya bulunamadı veya güvenlik ihlali.', $adminId, ['path' => $filePath, 'temp_dir' => $tempDir]);
                }
                break;
        }

    } catch (Exception $e) { 
        BtkHelper::logAction("AJAX Genel Hata ($ajax_action)", 'HATA', $e->getMessage(), $adminId, ['request_data_keys' => array_keys($request_data), 'trace' => $e->getTraceAsString()]);
        $response = ['status' => 'error', 'message' => ($LANG['ajaxRequestFailed'] ?? 'Sunucu tarafında bir hata oluştu. Lütfen logları kontrol edin.')]; 
    }
    return $response;
}

function buildPagination($baseUrl, $currentPage, $totalPages, $LANG) {
    if ($totalPages <= 1) return '';
    $html = '<div class="dataTables_paginate paging_bootstrap pagination"><ul>';
    $html .= ($currentPage > 1) ? '<li class="prev"><a href="' . $baseUrl . '&page=' . ($currentPage - 1) . '">« ' . ($LANG['previous'] ?? 'Önceki') . '</a></li>' : '<li class="prev disabled"><a href="#">« ' . ($LANG['previous'] ?? 'Önceki') . '</a></li>';
    $startPage = max(1, $currentPage - 2);
    $endPage = min($totalPages, $currentPage + 2);
    if ($startPage > 1) { $html .= '<li><a href="' . $baseUrl . '&page=1">1</a></li>'; if ($startPage > 2) $html .= '<li class="disabled"><a href="#">...</a></li>'; }
    for ($i = $startPage; $i <= $endPage; $i++) { $html .= ($i == $currentPage) ? '<li class="active"><a href="#">' . $i . '</a></li>' : '<li><a href="' . $baseUrl . '&page=' . $i . '">' . $i . '</a></li>'; }
    if ($endPage < $totalPages) { if ($endPage < $totalPages - 1) $html .= '<li class="disabled"><a href="#">...</a></li>'; $html .= '<li><a href="' . $baseUrl . '&page=' . $totalPages . '">' . $totalPages . '</a></li>'; }
    $html .= ($currentPage < $totalPages) ? '<li class="next"><a href="' . $baseUrl . '&page=' . ($currentPage + 1) . '">' . ($LANG['next'] ?? 'Sonraki') . ' »</a></li>' : '<li class="next disabled"><a href="#">' . ($LANG['next'] ?? 'Sonraki') . ' »</a></li>';
    $html .= '</ul></div>';
    return $html;
}

?>