<?php
/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli yardımcı dosyaları dahil et
$baseLibPath = __DIR__ . '/lib/';
$helperLoaded = false;
if (file_exists($baseLibPath . 'BtkHelper.php')) { 
    require_once $baseLibPath . 'BtkHelper.php';
    if (class_exists('BtkHelper')) $helperLoaded = true;
} else { 
    if(function_exists('logActivity')) logActivity("BTK Reports Critical Error: BtkHelper.php not found in btkreports.php!", 0);
    else error_log("BTK Reports Critical Error: BtkHelper.php not found in btkreports.php!");
}

if ($helperLoaded) {
    if (file_exists($baseLibPath . 'NviSoapClient.php')) { require_once $baseLibPath . 'NviSoapClient.php'; }
    else { BtkHelper::logAction('Modül Başlatma Hatası', 'CRITICAL', 'NviSoapClient.php bulunamadı.'); }

    if (file_exists($baseLibPath . 'ExcelExporter.php')) { require_once $baseLibPath . 'ExcelExporter.php'; }
    else { BtkHelper::logAction('Modül Başlatma Hatası', 'CRITICAL', 'ExcelExporter.php bulunamadı.'); }

    $composerAutoloadPath = __DIR__ . '/vendor/autoload.php';
    if (file_exists($composerAutoloadPath)) { require_once $composerAutoloadPath; }
    else { BtkHelper::logAction('Modül Başlatma Hatası', 'UYARI', 'Composer autoload.php bulunamadı! Cron zamanlaması ve bazı Excel işlemleri çalışmayabilir.'); }
}


use WHMCS\Database\Capsule;
use WHMCS\Utility\CSRF;

/**
 * Modül yapılandırma fonksiyonu.
 */
function btkreports_config() {
    return [
        'name' => 'BTK Raporlama Modülü',
        'description' => 'BTK yasal raporlama yükümlülükleri için WHMCS eklenti modülü.',
        'version' => '6.0.0',
        'author' => '[Üstadım & Sizin Adınız/Şirketiniz Gelecek]',
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
            $sqlContent = file_get_contents($sqlInstallFile);
            $sqlQueries = explode(';', $sqlContent);
            foreach ($sqlQueries as $query) { 
                $query = trim($query); 
                if (!empty($query)) { 
                    try { Capsule::connection()->statement($query); }
                    catch (Exception $e) { 
                        // SQL hatalarını logla ama devam etmeyi dene (bazı tablolar zaten var olabilir)
                        if(class_exists('BtkHelper')) BtkHelper::logAction('SQL Kurulum Hatası (install.sql)', 'HATA', "Sorgu: $query - Hata: ".$e->getMessage());
                        else error_log("BTK Reports SQL Install Error: Query: $query - Error: ".$e->getMessage());
                    }
                }
            }
        } else { return ['status' => 'error', 'description' => 'Kurulum SQL dosyası (install.sql) bulunamadı.']; }

        $sqlInitialDataFile = __DIR__ . '/sql/initial_reference_data.sql';
        if (file_exists($sqlInitialDataFile)) {
            $sqlContentInitial = file_get_contents($sqlInitialDataFile);
            $sqlQueriesInitial = explode(';', $sqlContentInitial);
            foreach ($sqlQueriesInitial as $query) { 
                $query = trim($query); 
                if (!empty($query)) { 
                     try { Capsule::connection()->statement($query); }
                     catch (Exception $e) {
                        if(class_exists('BtkHelper')) BtkHelper::logAction('SQL Başlangıç Veri Hatası', 'HATA', "Sorgu: $query - Hata: ".$e->getMessage());
                        else error_log("BTK Reports SQL Initial Data Error: Query: $query - Error: ".$e->getMessage());
                     }
                }
            }
            if (class_exists('BtkHelper')) BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'Başlangıç verileri SQL dosyası (initial_reference_data.sql) başarıyla işlendi.');
        } else { if (class_exists('BtkHelper')) BtkHelper::logAction('Modül Aktivasyonu', 'Uyarı', 'Başlangıç verileri SQL dosyası (initial_reference_data.sql) bulunamadı.'); }
        
        if (class_exists('BtkHelper')) {
            BtkHelper::set_btk_setting('module_db_version', btkreports_config()['version']);
            BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'BTK Raporlama Modülü başarıyla etkinleştirildi.');
        }
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi. Lütfen modül ayarlarını yapılandırın.'];
    } catch (Exception $e) {
        $errorMessage = 'Modül etkinleştirilirken genel bir hata oluştu: ' . $e->getMessage();
        if (class_exists('BtkHelper')) BtkHelper::logAction('Modül Aktivasyonu Genel Hata', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        else error_log("BTK Reports Activation General Error: " . $errorMessage);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül devre dışı bırakma fonksiyonu.
 */
function btkreports_deactivate() {
    try {
        $deleteData = '0';
        if (class_exists('BtkHelper')) {
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
                'mod_btk_meslek_kodlari_referans', 'mod_btk_settings'
            ];
            foreach ($tablesToDelete as $table) {
                if (Capsule::schema()->hasTable($table)) { Capsule::schema()->dropIfExists($table); } // dropIfExists kullanıldı
            }
            if (class_exists('BtkHelper')) BtkHelper::logAction('Modül Deaktivasyonu', 'Başarılı', 'Tüm veriler silindi.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve tüm verileri silindi.'];
        } else {
            if (class_exists('BtkHelper')) BtkHelper::logAction('Modül Deaktivasyonu', 'Başarılı', 'Veriler korundu.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veriler korundu.'];
        }
    } catch (Exception $e) {
        $errorMessage = 'Modül devre dışı bırakılırken hata oluştu: ' . $e->getMessage();
         if (class_exists('BtkHelper')) BtkHelper::logAction('Modül Deaktivasyonu', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        else error_log("BTK Reports Deactivation Error: " . $errorMessage);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}
// Devamı bir sonraki bölümde...
// ... btkreports.php Bölüm 1/X içeriği ...

/**
 * Modül admin arayüzü çıktı fonksiyonu.
 */
function btkreports_output($vars) {
    $modulelink = $vars['modulelink'];
    $action = isset($_REQUEST['action']) ? trim($_REQUEST['action']) : 'index';
    $LANG = $vars['_lang'] ?? [];
    
    if (!class_exists('BtkHelper')) { 
        echo '<div class="alert alert-danger"><strong>Kritik Hata:</strong> BTK Raporlama Modülü temel yardımcı kütüphanesi (BtkHelper.php) yüklenemedi veya bulunamadı. Lütfen modül dosyalarını kontrol edin. Modül işlevsiz.</div>'; 
        return; 
    }
    $adminId = BtkHelper::getCurrentAdminId();

    $smarty = new Smarty();
    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('LANG', $LANG);
    $smarty->assign('assets_url', 'modules/addons/btkreports/assets');
    $smarty->assign('module_version_placeholder', btkreports_config()['version']);
    $smarty->assign('setting_version_placeholder', BtkHelper::get_btk_setting('module_db_version', btkreports_config()['version']));
    $smarty->assign('setting_surum_notlari_link_placeholder', BtkHelper::get_btk_setting('surum_notlari_link', 'README.md'));
    if (class_exists('WHMCS\Utility\CSRF')) { $smarty->assign('csrfToken', CSRF::generateToken()); }
    else { $smarty->assign('csrfToken', ''); } // Eski WHMCS versiyonları için veya CSRF sınıfı yüklenememişse

    echo '<div id="btkReportsModuleContainer" class="btk-module-container">';

    // Flash Mesaj Yönetimi
    if (isset($_SESSION['BtkReportsFlashMessage'])) {
        $flash = $_SESSION['BtkReportsFlashMessage'];
        if (isset($flash['type']) && isset($flash['message'])) {
            $messageTypeKey = $flash['type'] === 'success' ? 'successMessage' : ($flash['type'] === 'error' ? 'errorMessage' : 'infoMessage');
            $smarty->assign($messageTypeKey, $flash['message']);
        }
        unset($_SESSION['BtkReportsFlashMessage']);
    }
    // Hata durumunda form verilerini session'dan alıp Smarty'ye ata
    // Sadece belirli action'lar için form verilerini koru
    if (isset($_SESSION['BtkReportsFormErrorData']) && in_array($action, ['config', 'save_personel', 'save_isspop'])) { 
        $smarty->assign('form_data', $_SESSION['BtkReportsFormErrorData']);
        unset($_SESSION['BtkReportsFormErrorData']);
    }
    // Config sayfası için özel başarı mesajı (GET parametresi ile)
    if (isset($_GET['success']) && $_GET['success'] == 1 && $action === 'config' && isset($LANG['settingssavedsucceed'])) {
        $smarty->assign('successMessage', $LANG['settingssavedsucceed']);
    }

    $templateFile = 'index.tpl'; // Varsayılan şablon

    // Ana Action Yönlendirme Bloğu
    switch ($action) {
        case 'config':
            btk_page_config($smarty, $modulelink, $LANG, $action); // $action parametresi eklendi
            $templateFile = 'config.tpl';
            break;
        case 'save_config':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $result = btk_action_save_config($_POST, $LANG); 
                $_SESSION['BtkReportsFlashMessage'] = $result; 
                if ($result['status'] === 'error') { $_SESSION['BtkReportsFormErrorData'] = $_POST; }
            }
            header("Location: " . $modulelink . "&action=config"); exit;
            break;

        case 'personel':
            $currentFilters = [];
            $filterParams = ['s_ad', 's_soyad', 's_tckn', 's_email', 's_departman_id', 's_btk_listesine_eklensin', 's_aktif_calisan'];
            if (isset($_REQUEST['filter']) && $_REQUEST['filter'] == '1') { 
                foreach ($filterParams as $param) { if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { $currentFilters[$param] = trim($_REQUEST[$param]); }} 
                $_SESSION['BtkReportsPersonelFilters'] = $currentFilters; 
            } elseif (isset($_REQUEST['clearfilter']) && $_REQUEST['clearfilter'] == '1') { 
                unset($_SESSION['BtkReportsPersonelFilters']); $currentFilters = []; 
            } elseif (isset($_SESSION['BtkReportsPersonelFilters'])) { 
                $currentFilters = $_SESSION['BtkReportsPersonelFilters']; 
            }
            $smarty->assign('filters', $currentFilters);
            btk_page_personel($smarty, $modulelink, $LANG, $currentFilters);
            $templateFile = 'personel.tpl';
            break;
        case 'save_personel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $result = btk_action_save_personel($_POST, $LANG);
                $_SESSION['BtkReportsFlashMessage'] = $result;
                if ($result['type'] === 'error') { // 'type' olarak düzeltildi
                     $_SESSION['BtkReportsFormErrorData'] = $_POST;
                }
            }
            header("Location: " . $modulelink . "&action=personel"); exit;
            break;
        case 'delete_personel':
            $personel_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $token_from_url = isset($_REQUEST['token']) ? $_REQUEST['token'] : ''; // GET için token
            // GET ile gelen silme isteklerinde CSRF token doğrulaması yapılmalı.
            // Basit bir yöntem: $modulelink . "&action=delete_personel&id=X&token=" . CSRF::generateToken('delete_personel_'.X)
            // Burada doğrulaması: CSRF::verifyToken('delete_personel_'.X, $token_from_url)
            if ($personel_id_to_delete > 0 /* && CSRF_TOKEN_VERIFIED_FOR_GET */ ) { 
                 $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_personel($personel_id_to_delete, $LANG);
            } else { $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidDataOrToken'] ?? 'Geçersiz veri veya güvenlik tokenı.')]; }
            header("Location: " . $modulelink . "&action=personel"); exit;
            break;

        case 'isspop':
            $currentIssPopFilters = []; 
            $filterIssPopParams = ['s_pop_adi', 's_yayin_yapilan_ssid', 's_il_id', 's_ilce_id', 's_aktif_pasif_durum'];
             if (isset($_REQUEST['filter_isspop']) && $_REQUEST['filter_isspop'] == '1') { foreach ($filterIssPopParams as $param) { if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { $currentIssPopFilters[$param] = trim($_REQUEST[$param]); }} $_SESSION['BtkReportsIssPopFilters'] = $currentIssPopFilters; }
            elseif (isset($_REQUEST['clearfilter_isspop']) && $_REQUEST['clearfilter_isspop'] == '1') { unset($_SESSION['BtkReportsIssPopFilters']); $currentIssPopFilters = [];}
            elseif (isset($_SESSION['BtkReportsIssPopFilters'])) { $currentIssPopFilters = $_SESSION['BtkReportsIssPopFilters']; }
            $smarty->assign('filters_isspop', $currentIssPopFilters);
            btk_page_isspop($smarty, $modulelink, $LANG, $currentIssPopFilters);
            $templateFile = 'iss_pop_management.tpl';
            break;
        case 'save_isspop':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $result = btk_action_save_isspop($_POST, $LANG);
                $_SESSION['BtkReportsFlashMessage'] = $result;
                 if ($result['type'] === 'error') { $_SESSION['BtkReportsFormErrorData'] = $_POST; }
            }
            header("Location: " . $modulelink . "&action=isspop"); exit;
            break;
        case 'delete_isspop':
            $pop_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $token_from_url = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';
            if ($pop_id_to_delete > 0 /* && CSRF_TOKEN_VERIFIED_FOR_GET */ ) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_isspop($pop_id_to_delete, $LANG);
            } else { $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidDataOrToken'] ?? 'Geçersiz veri veya güvenlik tokenı.')]; }
            header("Location: " . $modulelink . "&action=isspop"); exit;
            break;
        case 'import_isspop_excel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['excel_file'])) { if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_import_isspop_excel($_FILES['excel_file'], $LANG); }
            header("Location: " . $modulelink . "&action=isspop"); exit;
            break;
        case 'export_personel_excel': 
            // GET isteği için token kontrolü düşünülmeli
            btk_action_export_excel('PERSONEL', $LANG, $modulelink); 
            exit; // btk_action_export_excel zaten exit yapacak
            break;
        case 'export_isspop_excel': 
            btk_action_export_excel('ISSPOP', $LANG, $modulelink); 
            exit; 
            break;

        case 'product_group_mappings':
            btk_page_product_group_mappings($smarty, $modulelink, $LANG);
            $templateFile = 'product_group_mappings.tpl';
            break;
        case 'save_product_group_mappings':
             if ($_SERVER['REQUEST_METHOD'] === 'POST') { if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_save_product_group_mappings($_POST, $LANG); }
            header("Location: " . $modulelink . "&action=product_group_mappings"); exit;
            break;

        case 'generatereports':
            btk_page_generate_reports($smarty, $modulelink, $LANG);
            $templateFile = 'generate_reports.tpl';
            break;
        case 'do_generate_report':
             if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['report_type'])) { if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_do_generate_report($_POST, $LANG); }
            header("Location: " . $modulelink . "&action=generatereports"); exit;
            break;

        case 'viewlogs':
            btk_page_view_logs($smarty, $modulelink, $LANG);
            $templateFile = 'view_logs.tpl';
            break;
        
        // AJAX Actions
        case 'get_ilceler': 
        case 'get_mahalleler': 
        case 'search_pop_ssids': 
            header('Content-Type: application/json; charset=utf-8');
            // GET AJAX istekleri için CSRF genellikle Session ID veya Referer ile dolaylı yapılır.
            // Güvenlik kritik değilse, token zorunlu olmayabilir.
            echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG), JSON_UNESCAPED_UNICODE);
            exit;
            break;
        case 'nvi_tckn_dogrula': 
        case 'nvi_ykn_dogrula':
            header('Content-Type: application/json; charset=utf-8');
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && class_exists('WHMCS\Utility\CSRF')) { CSRF::verify(); }
            echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG), JSON_UNESCAPED_UNICODE);
            exit;
            break;

        case 'index': 
        default:
            btk_page_index($smarty, $modulelink, $LANG);
            $templateFile = 'index.tpl';
            break;
    }

    if (isset($templateFile) && file_exists(__DIR__ . '/templates/admin/' . $templateFile)) {
        try { $output = $smarty->fetch(__DIR__ . '/templates/admin/' . $templateFile); echo $output; }
        catch (SmartyException $e) { BtkHelper::logAction('Smarty Hatası', 'Hata', $e->getMessage() . ' Şablon: ' . $templateFile, $adminId); echo '<div class="alert alert-danger">Şablon yükleme hatası. Lütfen sistem loglarını kontrol edin.</div>'; }
    } elseif (isset($templateFile)) { BtkHelper::logAction('Şablon Hatası', 'HATA', 'Şablon dosyası bulunamadı: ' . $templateFile, $adminId); echo '<div class="alert alert-danger">İstenen şablon dosyası (' . htmlspecialchars($templateFile) . ') bulunamadı.</div>';}
    echo '</div>'; // btkReportsModuleContainer div kapanışı
}

// -------- SAYFA İÇERİĞİ HAZIRLAMA VE ACTION FONKSİYONLARI --------

/**
 * Ana Sayfa (Dashboard) için veri hazırlar.
 */
function btk_page_index(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['dashboardtitle'] ?? 'BTK Raporlama Ana Sayfa');
    $ftpMainStatus = BtkHelper::checkFtpConnection('main');
    $ftpBackupStatus = ['status' => 'info', 'message' => $LANG['backupFtpDisabled'] ?? 'Yedek FTP etkin değil.'];
    $settings = BtkHelper::getAllBtkSettings();
    if (isset($settings['backup_ftp_enabled']) && $settings['backup_ftp_enabled'] === '1') {
        $ftpBackupStatus = BtkHelper::checkFtpConnection('backup');
    }
    $smarty->assign('ftp_main_status', $ftpMainStatus);
    $smarty->assign('ftp_backup_status', $ftpBackupStatus);
    $smarty->assign('settings', $settings);

    $lastRehber = BtkHelper::getLastSuccessfulReportInfo('REHBER', 'ANA');
    $lastHareket = BtkHelper::getLastSuccessfulReportInfo('HAREKET', 'ANA');
    $lastPersonel = BtkHelper::getLastSuccessfulReportInfo('PERSONEL', 'ANA');

    $smarty->assign('last_rehber_info', [
        'tarih_saat' => $lastRehber ? date("d.m.Y H:i:s", strtotime($lastRehber['gonderim_zamani'] . ' UTC')) : ($LANG['notSubmittedYet'] ?? '-'),
        'dosya_adi' => $lastRehber['dosya_adi'] ?? '-', 'cnt' => $lastRehber['cnt_numarasi'] ?? '-'
    ]);
    $smarty->assign('last_hareket_info', [
        'tarih_saat' => $lastHareket ? date("d.m.Y H:i:s", strtotime($lastHareket['gonderim_zamani'] . ' UTC')) : ($LANG['notSubmittedYet'] ?? '-'),
        'dosya_adi' => $lastHareket['dosya_adi'] ?? '-', 'cnt' => $lastHareket['cnt_numarasi'] ?? '-'
    ]);
    $smarty->assign('last_personel_info', [
        'tarih_saat' => $lastPersonel ? date("d.m.Y H:i:s", strtotime($lastPersonel['gonderim_zamani'] . ' UTC')) : ($LANG['notSubmittedYet'] ?? '-'),
        'dosya_adi' => $lastPersonel['dosya_adi'] ?? '-', 'cnt' => $lastPersonel['cnt_numarasi'] ?? '-'
    ]);

    $smarty->assign('next_rehber_cron_run', BtkHelper::getNextCronRunTime('rehber_cron_schedule'));
    $smarty->assign('next_hareket_cron_run', BtkHelper::getNextCronRunTime('hareket_cron_schedule'));
    $smarty->assign('next_personel_cron_run', BtkHelper::getNextCronRunTime('personel_cron_schedule'));
    BtkHelper::logAction('Ana Sayfa Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
// Devamı bir sonraki bölümde...
// ... btkreports.php Bölüm 1/X ve 2/X içeriği ...

// -------- SAYFA İÇERİĞİ HAZIRLAMA VE ACTION FONKSİYONLARI (Devamı) --------

/**
 * Genel Ayarlar sayfası için veri hazırlar.
 */
function btk_page_config(&$smarty, $modulelink, $LANG, $currentAction) { // $currentAction eklendi
    $smarty->assign('page_title', $LANG['configtitle'] ?? 'BTK Modül Ayarları');
    $current_settings = BtkHelper::getAllBtkSettings();
    $settings = $current_settings; 

    // Hata durumunda session'dan gelen form verilerini kullan (sadece config action'ı için)
    if (isset($_SESSION['BtkReportsFormErrorData']) && $currentAction === 'config') { 
        $form_data = $_SESSION['BtkReportsFormErrorData'];
        $settings = array_merge($current_settings, $form_data); // Formdaki veriler DB'dekileri ezer
        // Şifreleri formda tekrar gösterme
        $settings['main_ftp_pass'] = ''; 
        $settings['backup_ftp_pass'] = '';
        // Checkbox'ların doğru değerlerini session'dan (veya POST'tan) al
        $checkboxKeys = [
            'main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 
            'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 
            'personel_filename_add_year_month_main', 'personel_filename_add_year_month_backup',
            'show_btk_info_if_empty_clientarea' // Yeni eklenen ayar
        ];
        foreach($checkboxKeys as $cbKey) { 
            // Form gönderiminde checkbox işaretli değilse POST'ta gelmez, bu yüzden DB'deki değeri koru
            // Eğer form_data'da varsa (yani bir önceki POST'ta işaretliydiyse) onu kullan
            $settings[$cbKey] = isset($form_data[$cbKey]) ? '1' : ($current_settings[$cbKey] ?? '0');
        }
    }
    $smarty->assign('settings', $settings);

    $yetkiTurleriReferans = BtkHelper::getAllYetkiTurleriReferans();
    $seciliYetkiTurleriDb = BtkHelper::getSeciliYetkiTurleri(); // Sadece aktif olanları değil, kayıtlı olanları getirir
    $displayYetkiTurleri = [];
    if (is_array($yetkiTurleriReferans)) {
        foreach ($yetkiTurleriReferans as $yt) {
            $is_aktif = 0;
            // Hata sonrası form verilerinde yetki varsa onu kullan
            if (isset($form_data['yetkiler']) && is_array($form_data['yetkiler']) && array_key_exists($yt->yetki_kodu, $form_data['yetkiler'])) { 
                 $is_aktif = 1; 
            } elseif (!isset($form_data) && isset($seciliYetkiTurleriDb[$yt->yetki_kodu]) && $seciliYetkiTurleriDb[$yt->yetki_kodu] == 1) { // Veritabanından gelen aktiflik durumu
                $is_aktif = 1;
            }
            $displayYetkiTurleri[] = [
                'kod' => $yt->yetki_kodu,
                'ad' => $yt->yetki_adi,
                'aktif' => $is_aktif
            ];
        }
    }
    $smarty->assign('yetki_turleri', $displayYetkiTurleri);
    BtkHelper::logAction('Genel Ayarlar Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}

/**
 * Genel Ayarları kaydeder.
 */
function btk_action_save_config($postData, $LANG) {
    $logKullaniciId = BtkHelper::getCurrentAdminId();
    // Zorunlu alan kontrolleri
    if (empty(trim($postData['operator_code']))) { BtkHelper::logAction('Ayar Kaydetme Hatası', 'UYARI', 'Operatör Kodu boş.', $logKullaniciId); return ['status' => 'error', 'message' => $LANG['operatorCodeRequired'] ?? 'Operatör Kodu zorunludur.']; }
    if (empty(trim($postData['operator_name']))) { BtkHelper::logAction('Ayar Kaydetme Hatası', 'UYARI', 'Operatör Adı boş.', $logKullaniciId); return ['status' => 'error', 'message' => $LANG['operatorNameRequired'] ?? 'Operatör Adı zorunludur.']; }
    // FTP Host kontrolleri
    if (!empty($postData['main_ftp_host']) && empty($postData['main_ftp_user'])) { BtkHelper::logAction('Ayarlar Kaydedilemedi', 'UYARI', 'Ana FTP Host girilmiş ancak Kullanıcı Adı boş.', $logKullaniciId); return ['status' => 'error', 'message' => $LANG['mainFtpUserRequiredWithHost'] ?? 'Ana FTP Host girilmişse, Kullanıcı Adı da girilmelidir.']; }
    if (isset($postData['backup_ftp_enabled']) && ($postData['backup_ftp_enabled'] === 'on' || $postData['backup_ftp_enabled'] === '1')) { 
        if (!empty($postData['backup_ftp_host']) && empty($postData['backup_ftp_user'])) { 
            BtkHelper::logAction('Ayarlar Kaydedilemedi', 'UYARI', 'Yedek FTP Host girilmiş ancak Kullanıcı Adı boş.', $logKullaniciId); 
            return ['status' => 'error', 'message' => $LANG['backupFtpUserRequiredWithHost'] ?? 'Yedek FTP Host girilmişse, Kullanıcı Adı da girilmelidir.']; 
        } 
    }

    // Metin tabanlı ayarlar
    $textSettings = [
        'operator_code', 'operator_name', 'operator_title', 
        'main_ftp_host', 'main_ftp_user', 'main_ftp_port', 
        'main_ftp_rehber_path', 'main_ftp_hareket_path', 'main_ftp_personel_path',
        'backup_ftp_host', 'backup_ftp_user', 'backup_ftp_port', 
        'backup_ftp_rehber_path', 'backup_ftp_hareket_path', 'backup_ftp_personel_path', 
        'rehber_cron_schedule', 'hareket_cron_schedule', 'personel_cron_schedule', 
        'hareket_live_table_days', 'hareket_archive_table_days', 'surum_notlari_link',
        'admin_records_per_page', 'log_records_per_page' // Yeni ayarlar
    ];
    foreach ($textSettings as $key) { 
        if (isset($postData[$key])) { // Sadece POST'ta varsa güncelle
            BtkHelper::set_btk_setting($key, trim($postData[$key])); 
        }
    }
    
    // Checkbox (boolean) ayarları
    $checkboxSettings = [
        'main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 
        'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 
        'personel_filename_add_year_month_main', 'personel_filename_add_year_month_backup',
        'show_btk_info_if_empty_clientarea' // Yeni ayar
    ];
    foreach ($checkboxSettings as $key) { 
        BtkHelper::set_btk_setting($key, isset($postData[$key]) && ($postData[$key] === 'on' || $postData[$key] === '1') ? '1' : '0'); 
    }

    // FTP Şifreleri (sadece girilmişse ve placeholder değilse güncellenir)
    if (isset($postData['main_ftp_pass']) && trim($postData['main_ftp_pass']) !== '' && trim($postData['main_ftp_pass']) !== '********') { 
        BtkHelper::set_btk_setting('main_ftp_pass', trim($postData['main_ftp_pass'])); 
    }
    if (isset($postData['backup_ftp_pass']) && trim($postData['backup_ftp_pass']) !== '' && trim($postData['backup_ftp_pass']) !== '********') { 
        BtkHelper::set_btk_setting('backup_ftp_pass', trim($postData['backup_ftp_pass'])); 
    }
    
    // Seçili Yetki Türlerini Kaydet
    BtkHelper::saveSeciliYetkiTurleri(isset($postData['yetkiler']) && is_array($postData['yetkiler']) ? $postData['yetkiler'] : []);

    BtkHelper::logAction('Ayarlar Kaydedildi', 'BAŞARILI', 'Modül ayarları güncellendi.', $logKullaniciId);
    return ['status' => 'success', 'message' => $LANG['settingssavedsucceed'] ?? 'Ayarlar başarıyla kaydedildi.'];
}

// --- Personel Yönetimi ---
function btk_page_personel(&$smarty, $modulelink, $LANG, $filters = []) {
    $smarty->assign('page_title', $LANG['personeltitle'] ?? 'Personel Yönetimi');
    $adminId = BtkHelper::getCurrentAdminId();

    $page = isset($_REQUEST['page']) && is_numeric($_REQUEST['page']) ? (int)$_REQUEST['page'] : 1;
    if ($page < 1) $page = 1;
    $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20);
    $offset = ($page - 1) * $limit;

    $personelResult = BtkHelper::getPersonelList($filters, 'p.soyad', 'ASC', $limit, $offset);
    
    $smarty->assign('personel_listesi', $personelResult['data']);
    $smarty->assign('departmanlar', BtkHelper::getDepartmanList());
    $smarty->assign('tum_ilceler_listesi', BtkHelper::getTumIlcelerWithIlAdi());
    $smarty->assign('settings', BtkHelper::getAllBtkSettings()); // Firma ünvanını modalda göstermek için
    $smarty->assign('whmcs_admin_users_placeholder', Capsule::table('tbladmins')->where('disabled', 0)->orderBy('firstname')->get(['id', 'username', 'firstname', 'lastname'])->all()); // WHMCS adminlerini çek


    $totalPages = ($limit > 0 && $personelResult['total_count'] > 0) ? ceil($personelResult['total_count'] / $limit) : 1;
    $smarty->assign('current_page', $page);
    $smarty->assign('total_pages', $totalPages);
    $smarty->assign('total_items', $personelResult['total_count']);
    $smarty->assign('pagination_params', http_build_query(array_merge(['action' => 'personel'], $filters)));

    BtkHelper::logAction('Personel Sayfası Görüntülendi', 'INFO', "Sayfa: $page, Filtreler: " . json_encode($filters), $adminId);
}

function btk_action_save_personel($postData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('Personel Kaydetme İsteği', 'DEBUG', 'POST Verisi Alındı.', $adminId, ['keys_count' => count($postData)]);
    $result = BtkHelper::savePersonel($postData, $adminId);
    $logSeviyesi = $result['status'] ? 'BAŞARILI' : 'HATA';
    $logMesaj = $result['message'] . (isset($result['nvi_message']) && !empty($result['nvi_message']) ? ' (NVI: '.$result['nvi_message'].')' : '');
    BtkHelper::logAction('Personel Kaydetme Sonucu', $logSeviyesi, $logMesaj, $adminId);
    // Flash mesaj için 'type' anahtarını kullanalım
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => $result['message'] . (isset($result['nvi_status']) && $result['nvi_status'] !== 'Dogrulandi' && !empty($result['nvi_message']) ? '<br><b>NVI Doğrulama:</b> ' . htmlspecialchars($result['nvi_message']) : '')];
}

function btk_action_delete_personel($personelId, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('Personel Silme İsteği', 'UYARI', "Silinecek Personel ID: $personelId", $adminId);
    if (empty($personelId) || !is_numeric($personelId) || $personelId <= 0) {
        BtkHelper::logAction('Personel Silme Hatası', 'HATA', 'Geçersiz Personel ID.', $adminId);
        return ['type' => 'error', 'message' => $LANG['invalidPersonelId'] ?? 'Geçersiz Personel ID.'];
    }
    $result = BtkHelper::deletePersonel((int)$personelId, $adminId);
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => $result['message']];
}

// --- ISS POP Noktası Yönetimi ---
function btk_page_isspop(&$smarty, $modulelink, $LANG, $filters = []) {
    $smarty->assign('page_title', $LANG['isspoptitle'] ?? 'ISS POP Noktası Yönetimi');
    $adminId = BtkHelper::getCurrentAdminId();
    $page = isset($_REQUEST['page_isspop']) && is_numeric($_REQUEST['page_isspop']) ? (int)$_REQUEST['page_isspop'] : 1;
    if ($page < 1) $page = 1;
    $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20);
    $offset = ($page - 1) * $limit;

    $popResult = BtkHelper::getIssPopNoktalariList($filters, 'pop.pop_adi', 'ASC', $limit, $offset);
    $smarty->assign('pop_noktalari_listesi', $popResult['data']);
    $smarty->assign('adres_iller', BtkHelper::getIller()); // Modal ve filtre için İl dropdown'ı
    
    // Filtre için il seçilmişse, o ile ait ilçeleri de yükle
    if (!empty($filters['s_il_id'])) {
        $smarty->assign('filter_ilceler_list_placeholder', BtkHelper::getIlcelerByIlId((int)$filters['s_il_id']));
    }


    $totalPages = ($limit > 0 && $popResult['total_count'] > 0) ? ceil($popResult['total_count'] / $limit) : 1;
    $smarty->assign('current_page_isspop', $page);
    $smarty->assign('total_pages_isspop', $totalPages);
    $smarty->assign('total_items_isspop', $popResult['total_count']);
    $smarty->assign('pagination_params_isspop', http_build_query(array_merge(['action' => 'isspop'], $filters)));

    BtkHelper::logAction('ISS POP Sayfası Görüntülendi', 'INFO', "Sayfa: $page, Filtreler: " . json_encode($filters), $adminId);
}

function btk_action_save_isspop($postData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('ISS POP Kaydetme İsteği', 'DEBUG', 'POST Verisi Alındı.', $adminId, ['keys_count' => count($postData)]);
    $result = BtkHelper::saveIssPopNoktasi($postData);
    $logSeviyesi = $result['status'] ? 'BAŞARILI' : 'HATA';
    BtkHelper::logAction('ISS POP Kaydetme Sonucu', $logSeviyesi, $result['message'], $adminId);
    $messageKey = ($result['status'] && isset($postData['pop_id']) && $postData['pop_id'] > 0) ? 'isspopupdatesucceed' : ($result['status'] ? 'isspopsavedsucceed' : 'isspopsavefailed');
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => ($LANG[$messageKey] ?? $result['message'])];
}

function btk_action_delete_isspop($popId, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('ISS POP Silme İsteği', 'UYARI', "Silinecek POP ID: $popId", $adminId);
     if (empty($popId) || !is_numeric($popId) || $popId <= 0) {
        BtkHelper::logAction('ISS POP Silme Hatası', 'HATA', 'Geçersiz POP ID.', $adminId);
        return ['type' => 'error', 'message' => $LANG['invalidPopId'] ?? 'Geçersiz POP ID.'];
    }
    $result = BtkHelper::deleteIssPopNoktasi((int)$popId);
    return ['type' => $result['status'] ? 'success' : 'error', 'message' => $result['message']];
}

function btk_action_import_isspop_excel($fileData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    if (!class_exists('ExcelExporter')) { BtkHelper::logAction('Excel Import Hatası', 'CRITICAL', 'ExcelExporter.php yüklenemedi.', $adminId); return ['type' => 'error', 'message' => 'Excel kütüphanesi yüklenemedi.']; }
    if (!isset($fileData['tmp_name']) || $fileData['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($fileData['tmp_name'])) { 
        BtkHelper::logAction('Excel Import Dosya Yükleme Hatası', 'HATA', 'Dosya yüklenirken hata oluştu veya dosya geçerli değil. Hata Kodu: ' . ($fileData['error'] ?? 'Bilinmiyor'), $adminId);
        return ['type' => 'error', 'message' => 'Dosya yüklenirken hata oluştu veya dosya geçerli değil. Hata Kodu: ' . ($fileData['error'] ?? 'Bilinmiyor')]; 
    }
    
    $excelData = ExcelExporter::importIssPopFromExcel($fileData['tmp_name']);
    @unlink($fileData['tmp_name']); // Geçici dosyayı hemen sil

    if ($excelData === false) { return ['type' => 'error', 'message' => $LANG['excelReadError'] ?? 'Excel dosyası okunamadı veya formatı geçersiz. Lütfen örnek şablonu kontrol edin.']; }
    if (empty($excelData)) { return ['type' => 'info', 'message' => $LANG['excelEmptyData'] ?? 'Excel dosyasında işlenecek veri bulunamadı.']; }

    $importedCount = 0; $errorCount = 0; $skippedCount = 0; $errors = [];
    foreach ($excelData as $rowIndex => $popRow) {
        $popRowForSave = $popRow; // Orijinal satırı koru (loglama için)
        if(!empty($popRow['il_adi_excel'])) $popRowForSave['il_id'] = BtkHelper::getIlIdByAdi($popRow['il_adi_excel']);
        if(!empty($popRow['ilce_adi_excel']) && !empty($popRowForSave['il_id'])) $popRowForSave['ilce_id'] = BtkHelper::getIlceIdByAdi($popRow['ilce_adi_excel'], $popRowForSave['il_id']);
        // Mahalle ID'si de benzer şekilde eklenebilir.
        
        if (empty($popRowForSave['pop_adi']) || empty($popRowForSave['yayin_yapilan_ssid'])) {
            $errors[] = ($rowIndex+2) . ". satır: POP Adı veya Yayın SSID boş olamaz, atlandı."; $skippedCount++; continue;
        }
        $saveResult = BtkHelper::saveIssPopNoktasi($popRowForSave); // saveIssPopNoktasi, mevcutsa SSID, ilçe ve pop_adi ile günceller veya yenisini ekler
        if($saveResult['status']) $importedCount++;
        else { $errorCount++; $errors[] = ($rowIndex+2) . ". satır: " . $saveResult['message']; }
    }
    $message = "Excel içe aktarma tamamlandı. {$importedCount} kayıt işlendi. {$errorCount} kayıtta hata oluştu. {$skippedCount} kayıt atlandı.";
    if(!empty($errors)) $message .= "<br><b>Hata Detayları (İlk 10):</b><br>" . implode("<br>", array_slice($errors,0,10));
    
    BtkHelper::logAction('ISS POP Excel Import Sonucu', $errorCount > 0 ? 'UYARI' : 'BAŞARILI', $message, $adminId);
    return ['type' => $errorCount > 0 ? 'warning' : 'success', 'message' => $message];
}

function btk_action_export_excel($reportType, $LANG, $modulelink) {
    $adminId = BtkHelper::getCurrentAdminId();
    if (!class_exists('ExcelExporter')) { 
        BtkHelper::logAction(strtoupper($reportType) . ' Excel Export Hatası', 'CRITICAL', 'ExcelExporter.php yüklenemedi.', $adminId);
        $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => 'Excel kütüphanesi yüklenemedi.']; 
        header("Location: " . $modulelink . ($reportType === 'PERSONEL' ? '&action=personel' : '&action=isspop')); exit; 
    }
    $filename = ''; $data = [];

    if ($reportType === 'PERSONEL') {
        $data = BtkHelper::getPersonelDataForReport(); // Tüm aktif personeli alır
        $filenameBase = BtkHelper::generateReportFilename(
            BtkHelper::get_btk_setting('operator_name'), null, null, 
            'PERSONEL_LISTESI', '01', time(), 'main', false // isExcel=false ExcelExporter kendi ekler
        );
        $filename = $filenameBase . '.xlsx';

        if (empty($data) && BtkHelper::get_btk_setting('send_empty_reports') !== '1' && BtkHelper::get_btk_setting('export_empty_excel', '0') !== '1') { // Yeni ayar
            BtkHelper::logAction('Personel Excel Export Atlandı', 'BİLGİ', 'Veri yok ve boş excel dışa aktarımı kapalı.', $adminId);
            $_SESSION['BtkReportsFlashMessage'] = ['type' => 'info', 'message' => $LANG['personelExportNoData'] ?? 'Dışa aktarılacak personel verisi bulunamadı.'];
            header("Location: " . $modulelink . "&action=personel"); exit;
        }
        ExcelExporter::exportPersonelList($data, $filename, true); // Tarayıcıya gönder ve çık
        exit; 
    } elseif ($reportType === 'ISSPOP') {
        $popResult = BtkHelper::getIssPopNoktalariList([], 'pop.pop_adi', 'ASC', 10000, 0); // Tümünü export et (limit artırıldı)
        $data = $popResult['data']; // Bu veri formatı ExcelExporter::exportIssPopList'e uygun olmalı
         $filenameBase = BtkHelper::generateReportFilename(
            BtkHelper::get_btk_setting('operator_name'), null, null, 
            'ISS_POP_LISTESI', '01', time(), 'main', false
        );
        $filename = $filenameBase . '.xlsx';
        // TODO: ExcelExporter::exportIssPopList($data, $filename, true); gibi özel bir fonksiyon yazılmalı
        // veya exportPersonelList genel bir exportGenericList'e dönüştürülmeli.
        // Şimdilik exportPersonelList'i örnek olarak kullanalım, başlıklar ve veri eşleşmeyebilir.
        ExcelExporter::exportPersonelList($data, $filename, true); // DİKKAT: Başlıklar ve veri ISS POP için uygun olmayacak!
        BtkHelper::logAction('ISS POP Excel Export', 'UYARI', 'ISS POP Excel export fonksiyonu henüz tam implemente edilmedi (Personel formatı kullanılıyor).', $adminId);
        exit;
    }
    $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['unknownExcelExportType'] ?? 'Bilinmeyen Excel dışa aktarma türü.'];
    header("Location: " . $modulelink); exit;
}

// --- Ürün Grubu Eşleştirme ---
function btk_page_product_group_mappings(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['productgroupmappingstitle'] ?? 'Ürün Grubu - BTK Yetki Eşleştirme');
    try {
        $productGroups = Capsule::table('tblproductgroups')->where('hidden',0)->orderBy('order')->get(['id', 'name'])->all();
        $smarty->assign('product_groups', array_map(function($g){ return (array)$g; }, $productGroups));
    } catch (Exception $e) { BtkHelper::logAction('Ürün Grupları Okuma Hatası', 'HATA', $e->getMessage()); $smarty->assign('product_groups', []); }
    
    $smarty->assign('aktif_yetki_turleri_referans', BtkHelper::getAktifYetkiTurleri('object_list'));
    $smarty->assign('current_mappings', BtkHelper::getProductGroupMappingsArray());
    BtkHelper::logAction('Ürün Grubu Eşleştirme Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_save_product_group_mappings($postData, $LANG) {
    $mappings = $postData['mappings'] ?? [];
    $result = BtkHelper::saveProductGroupMappings($mappings);
    $logKullaniciId = BtkHelper::getCurrentAdminId();
    if($result) { 
        BtkHelper::logAction('Ürün Grubu Eşleştirme Kaydedildi', 'BAŞARILI', null, $logKullaniciId);
        return ['status' => 'success', 'message' => $LANG['mappingssavedsucceed'] ?? 'Eşleştirmeler başarıyla kaydedildi.']; 
    }
    BtkHelper::logAction('Ürün Grubu Eşleştirme Kaydetme Hatası', 'HATA', null, $logKullaniciId);
    return ['status' => 'error', 'message' => $LANG['mappingssavefailed'] ?? 'Eşleştirmeler kaydedilirken bir hata oluştu.'];
}

// --- Manuel Rapor Oluşturma ---
function btk_page_generate_reports(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['generatereportstitle'] ?? 'Manuel Rapor Oluştur');
    $smarty->assign('aktif_yetki_gruplari', BtkHelper::getAktifYetkiTurleri('array_grup')); // 'grup_kodu' => [['kod'=>..., 'ad'=>...],...]
    $smarty->assign('settings', BtkHelper::getAllBtkSettings());
    BtkHelper::logAction('Manuel Rapor Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_do_generate_report($postData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    $reportType = $postData['report_type'] ?? null;
    $yetkiGrupSecilen = $postData['yetki_grup'] ?? null; // Kullanıcı "Tümü" seçmiş olabilir veya belirli bir grup
    $ftpTarget = $postData['ftp_target'] ?? 'main';
    $cntOverride = !empty(trim($postData['cnt_override'])) && strlen(trim($postData['cnt_override'])) == 2 && is_numeric(trim($postData['cnt_override'])) 
                   ? trim($postData['cnt_override']) 
                   : null;
    
    if (empty($reportType)) {
        return ['type' => 'error', 'message' => $LANG['reportTypeRequired'] ?? 'Rapor türü seçilmelidir.'];
    }
    if (($reportType === 'rehber' || $reportType === 'hareket') && empty($yetkiGrupSecilen)) {
        // Eğer "Tümü" seçilmişse, tüm aktif gruplar için tek tek rapor oluşturulacak
        $gruplarToProcess = BtkHelper::getAktifYetkiTurleri('array_grup_names_only');
        if (empty($gruplarToProcess) && BtkHelper::get_btk_setting('send_empty_reports') !== '1') {
             return ['type' => 'info', 'message' => $LANG['noActiveAuthGroupForReport'] ?? 'Rapor üretilecek aktif yetki grubu bulunamadı ve boş rapor gönderimi kapalı.'];
        } elseif (empty($gruplarToProcess)) {
            $gruplarToProcess = ['GENEL']; // Boş rapor için "GENEL" gibi bir grup adı kullanılabilir
        }
    } else {
        $gruplarToProcess = [$yetkiGrupSecilen]; // Tek bir grup veya personel için null
    }

    $results = [];
    foreach($gruplarToProcess as $grup) {
        if ($reportType === 'personel' && $grup !== $gruplarToProcess[0]) continue; // Personel için sadece bir kez çalışır

        $currentYetkiGrup = ($reportType === 'personel') ? null : $grup;
        BtkHelper::logAction('Manuel Rapor Oluşturma Başlatıldı', 'BİLGİ', "Tip: $reportType, Grup: $currentYetkiGrup, Hedef: $ftpTarget, CNT: $cntOverride", $adminId);
        // $result = BtkHelper::triggerManualReportGeneration($reportType, $currentYetkiGrup, $ftpTarget, $cntOverride);
        // $results[] = $result['message'];
        $results[] = "Rapor ($reportType - $currentYetkiGrup) için işlem başlatıldı (Bu özellik yapım aşamasındadır)."; // Placeholder
    }

    return ['type' => 'info', 'message' => implode("<br>", $results)];
}

// --- Log Görüntüleme ---
function btk_page_view_logs(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['viewlogstitle'] ?? 'Modül Günlük Kayıtları');
    $log_limit = (int)BtkHelper::get_btk_setting('log_records_per_page', 50);
    
    $filters_module = [];
    if (!empty($_REQUEST['s_log_level_module'])) $filters_module['log_level'] = $_REQUEST['s_log_level_module'];
    if (!empty($_REQUEST['s_log_islem_module'])) $filters_module['log_islem'] = $_REQUEST['s_log_islem_module'];
    $smarty->assign('filters_module', $filters_module);
    
    $filters_ftp = [];
    if (!empty($_REQUEST['s_rapor_turu_ftp'])) $filters_ftp['rapor_turu'] = $_REQUEST['s_rapor_turu_ftp'];
    if (!empty($_REQUEST['s_durum_ftp'])) $filters_ftp['durum'] = $_REQUEST['s_durum_ftp'];
    $smarty->assign('filters_ftp', $filters_ftp);

    $moduleLogsResult = BtkHelper::getModuleLogs($filters_module, 'id', 'DESC', $log_limit, 0); // Sayfalama eklenecek
    $ftpLogsResult = BtkHelper::getFtpLog($filters_ftp, 'id', 'DESC', $log_limit, 0); // Sayfalama eklenecek

    $smarty->assign('module_logs', $moduleLogsResult['data']);
    $smarty->assign('ftp_logs', $ftpLogsResult['data']);
    $smarty->assign('log_limit_placeholder', $log_limit);
    $smarty->assign('ftp_log_limit_placeholder', $log_limit);
    BtkHelper::logAction('Log Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}

// --- AJAX İsteklerini Yönetme ---
function btk_handle_ajax_requests($ajax_action, $request_data, $LANG) {
    $response = ['status' => 'error', 'message' => ($LANG['unknownAjaxRequest'] ?? 'Bilinmeyen AJAX isteği'), 'data' => null];
    $nviClient = null; // Gerektiğinde oluşturulacak
    try {
        switch ($ajax_action) {
            case 'get_ilceler':
                $il_id = isset($request_data['il_id']) ? (int)$request_data['il_id'] : 0;
                $data = ($il_id > 0) ? BtkHelper::getIlcelerByIlId($il_id) : [];
                $response = ['status' => 'success', 'data' => $data];
                break;
            case 'get_mahalleler':
                $ilce_id = isset($request_data['ilce_id']) ? (int)$request_data['ilce_id'] : 0;
                $data = ($ilce_id > 0) ? BtkHelper::getMahallelerByIlceId($ilce_id) : [];
                $response = ['status' => 'success', 'data' => $data];
                break;
            case 'search_pop_ssids':
                $term = isset($request_data['term']) ? trim($request_data['term']) : '';
                $filter_by = isset($request_data['filter_by']) ? trim($request_data['filter_by']) : null;
                $filter_value = isset($request_data['filter_value']) && $request_data['filter_value'] !== '' ? trim($request_data['filter_value']) : null;
                $data = BtkHelper::searchPopSSIDs($term, $filter_by, $filter_value);
                $select2Data = array_map(function($item){ return ['id' => $item->id, 'text' => $item->yayin_yapilan_ssid . ($item->pop_adi ? ' (' . $item->pop_adi . ')' : '')]; }, (array)$data);
                $response = ['status' => 'success', 'results' => $select2Data];
                break;
            case 'nvi_tckn_dogrula':
                if (!class_exists('NviSoapClient')) { $response['message'] = 'NVI Servis istemcisi yüklenemedi.'; break; }
                $nviClient = new NviSoapClient();
                $result = $nviClient->TCKimlikNoDogrula(
                    $request_data['tckn'] ?? '', $request_data['ad'] ?? '',
                    $request_data['soyad'] ?? '', (int)($request_data['dogum_yili_nvi'] ?? 0)
                );
                $response = ['success' => $result, 'message' => $nviClient->getLastErrorMessageForUser(), 'error_detail' => $nviClient->getLastError(), 'nvi_status' => $result ? 'Dogrulandi' : ($nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi')];
                break;
            case 'nvi_ykn_dogrula':
                if (!class_exists('NviSoapClient')) { $response['message'] = 'NVI Servis istemcisi yüklenemedi.'; break; }
                $nviClient = new NviSoapClient();
                $result = $nviClient->YabanciKimlikNoDogrula(
                    $request_data['ykn'] ?? '', $request_data['ad'] ?? '', $request_data['soyad'] ?? '',
                    (int)($request_data['dogum_gun'] ?? 0), (int)($request_data['dogum_ay'] ?? 0), (int)($request_data['dogum_yil'] ?? 0)
                );
                $response = ['success' => $result, 'message' => $nviClient->getLastErrorMessageForUser(), 'error_detail' => $nviClient->getLastError(), 'nvi_status' => $result ? 'Dogrulandi' : ($nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi')];
                break;
        }
    } catch (Exception $e) { 
        if(class_exists('BtkHelper')) BtkHelper::logAction("AJAX Hatası ($ajax_action)", 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), $request_data); 
        $response = ['status' => 'error', 'message' => 'İşlem sırasında bir sunucu hatası oluştu. Lütfen logları kontrol edin.']; 
    }
    return $response;
}
?>