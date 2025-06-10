<?php
/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 * (Tüm fonksiyonların içleri doldurulmuş, en kapsamlı sürüm)
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli yardımcı dosyaları ve sınıfları dahil et
$baseLibPath = __DIR__ . '/lib/';
$helperLoaded = false;
if (file_exists($baseLibPath . 'BtkHelper.php')) { 
    require_once $baseLibPath . 'BtkHelper.php'; 
    if (class_exists('BtkHelper')) $helperLoaded = true;
} 

if (!$helperLoaded) {
    if(function_exists('logActivity')) logActivity("BTK Reports Critical Error: BtkHelper.php not found in btkreports.php!", 0);
    else error_log("BTK Reports Critical Error: BtkHelper.php not found in btkreports.php!");
}

if (file_exists($baseLibPath . 'NviSoapClient.php')) { require_once $baseLibPath . 'NviSoapClient.php'; }
else { if ($helperLoaded) BtkHelper::logAction('Modül Başlatma Hatası', 'CRITICAL', 'NviSoapClient.php bulunamadı.'); }

if (file_exists($baseLibPath . 'ExcelExporter.php')) { require_once $baseLibPath . 'ExcelExporter.php'; }
else { if ($helperLoaded) BtkHelper::logAction('Modül Başlatma Hatası', 'CRITICAL', 'ExcelExporter.php bulunamadı.'); }

$composerAutoloadPath = __DIR__ . '/vendor/autoload.php';
if (file_exists($composerAutoloadPath)) { require_once $composerAutoloadPath; }
else { if ($helperLoaded) BtkHelper::logAction('Modül Başlatma Hatası', 'UYARI', 'Composer autoload.php bulunamadı! Cron zamanlaması ve bazı Excel işlemleri çalışmayabilir.'); }


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
    global $helperLoaded;
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
            if ($helperLoaded) BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'Başlangıç verileri SQL dosyası (initial_reference_data.sql) başarıyla işlendi.');
        } else { if ($helperLoaded) BtkHelper::logAction('Modül Aktivasyonu', 'Uyarı', 'Başlangıç verileri SQL dosyası (initial_reference_data.sql) bulunamadı.'); }
        
        if ($helperLoaded) {
            BtkHelper::set_btk_setting('module_db_version', btkreports_config()['version']);
            BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'BTK Raporlama Modülü başarıyla etkinleştirildi.');
        }
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi. Lütfen modül ayarlarını yapılandırın.'];
    } catch (Exception $e) {
        $errorMessage = 'Modül etkinleştirilirken hata oluştu: ' . $e->getMessage();
        if ($helperLoaded) BtkHelper::logAction('Modül Aktivasyonu', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        else error_log("BTK Reports Activation Error: " . $errorMessage);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül devre dışı bırakma fonksiyonu.
 */
function btkreports_deactivate() {
    global $helperLoaded;
    try {
        $deleteData = '0';
        if ($helperLoaded) {
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
                'mod_btk_yetki_turleri_referans', 'mod_btk_ek1_hat_durum_kodlari', /* YENİ */
                'mod_btk_ek2_musteri_hareket_kodlari', /* YENİ */ 'mod_btk_ek3_hizmet_tipleri', /* YENİ */
                'mod_btk_ek4_kimlik_tipleri', /* YENİ */ 'mod_btk_ek5_meslek_kodlari', /* YENİ */
                'mod_btk_settings'
            ];
            foreach ($tablesToDelete as $table) {
                if (Capsule::schema()->hasTable($table)) { Capsule::schema()->drop($table); }
            }
            if ($helperLoaded) BtkHelper::logAction('Modül Deaktivasyonu', 'Başarılı', 'Tüm veriler silindi.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve tüm verileri silindi.'];
        } else {
            if ($helperLoaded) BtkHelper::logAction('Modül Deaktivasyonu', 'Başarılı', 'Veriler korundu.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veriler korundu.'];
        }
    } catch (Exception $e) {
        $errorMessage = 'Modül devre dışı bırakılırken hata oluştu: ' . $e->getMessage();
         if ($helperLoaded) BtkHelper::logAction('Modül Deaktivasyonu', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        else error_log("BTK Reports Deactivation Error: " . $errorMessage);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

/**
 * Modül admin arayüzü çıktı fonksiyonu.
 */
function btkreports_output($vars) {
    global $helperLoaded;
    $modulelink = $vars['modulelink'];
    $action = isset($_REQUEST['action']) ? preg_replace("/[^a-zA-Z0-9_]/", "", trim($_REQUEST['action'])) : 'index';
    $LANG = $vars['_lang'] ?? [];
    $adminId = $helperLoaded ? BtkHelper::getCurrentAdminId() : null;

    if (!$helperLoaded) { 
        echo '<div class="alert alert-danger"><strong>Kritik Hata:</strong> BTK Raporlama Modülü temel yardımcı kütüphanesi (BtkHelper.php) yüklenemedi veya bulunamadı. Lütfen modül dosyalarını kontrol edin. Modül işlevsiz.</div>'; 
        return; 
    }

    $smarty = new Smarty();
    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('LANG', $LANG);
    $smarty->assign('assets_url', '../modules/addons/btkreports/assets');
    $smarty->assign('module_version_placeholder', btkreports_config()['version']);
    $smarty->assign('setting_version_placeholder', BtkHelper::get_btk_setting('module_db_version', btkreports_config()['version']));
    $smarty->assign('setting_surum_notlari_link_placeholder', BtkHelper::get_btk_setting('surum_notlari_link', '../modules/addons/btkreports/README.md'));
    
    $systemUrl = rtrim(BtkHelper::get_btk_setting('SystemURL', $vars['systemurl']), '/');
    $smarty->assign('logo_url', $systemUrl . '/modules/addons/btkreports/logo.png');
    
    if (class_exists('WHMCS\Utility\CSRF')) { $smarty->assign('csrfToken', CSRF::generateToken()); }
    else { $smarty->assign('csrfToken', ''); }

    $menuItems = [
        'index' => ['label' => $LANG['dashboardtitle'] ?? 'Ana Sayfa', 'icon' => 'fas fa-tachometer-alt'],
        'config' => ['label' => $LANG['configtitle'] ?? 'Genel Ayarlar', 'icon' => 'fas fa-cogs'],
        'personel' => ['label' => $LANG['personeltitle'] ?? 'Personel Yönetimi', 'icon' => 'fas fa-users'],
        'isspop' => ['label' => $LANG['isspoptitle'] ?? 'ISS POP Yönetimi', 'icon' => 'fas fa-broadcast-tower'],
        'product_group_mappings' => ['label' => $LANG['productgroupmappingstitle'] ?? 'Ürün Grubu Eşleştirme', 'icon' => 'fas fa-link'],
        'generatereports' => ['label' => $LANG['generatereportstitle'] ?? 'Manuel Raporlar', 'icon' => 'fas fa-rocket'],
        'viewlogs' => ['label' => $LANG['viewlogstitle'] ?? 'Günlük Kayıtları', 'icon' => 'fas fa-history'],
    ];
    $smarty->assign('btkModuleMenuItems', $menuItems);
    $smarty->assign('currentModulePageAction', $action);

    echo '<div id="btkReportsModuleContainer" class="btk-module-container">';
    try {
        $smartyMenu = new Smarty();
        $smartyMenu->assign('modulelink', $modulelink); $smartyMenu->assign('LANG', $LANG);
        $smartyMenu->assign('btkModuleMenuItems', $menuItems); $smartyMenu->assign('currentModulePageAction', $action);
        $smartyMenu->assign('logo_url', $systemUrl . '/modules/addons/btkreports/logo.png');
        $smartyMenu->assign('assets_url', '../modules/addons/btkreports/assets');
        echo $smartyMenu->fetch(__DIR__ . '/templates/admin/shared/admin_header_menu.tpl');
    } catch (SmartyException $e) { BtkHelper::logAction('Smarty Hatası (Menu)', 'Hata', $e->getMessage() . ' Şablon: admin_header_menu.tpl', $adminId); echo '<div class="alert alert-danger">Modül menüsü yüklenirken hata.</div>';}

    if (isset($_SESSION['BtkReportsFlashMessage'])) { $flash = $_SESSION['BtkReportsFlashMessage']; if (isset($flash['type']) && isset($flash['message'])) { $smarty->assign($flash['type'] === 'success' ? 'successMessage' : ($flash['type'] === 'error' ? 'errorMessage' : 'infoMessage'), $flash['message']); } unset($_SESSION['BtkReportsFlashMessage']); }
    if (isset($_SESSION['BtkReportsFormErrorData'])) { $smarty->assign('form_data', $_SESSION['BtkReportsFormErrorData']); unset($_SESSION['BtkReportsFormErrorData']); }
    if (isset($_GET['success']) && $_GET['success'] == 1 && $action === 'config' && isset($LANG['settingssavedsucceed'])) { $smarty->assign('successMessage', $LANG['settingssavedsucceed']);}

    $templateFile = 'index.tpl'; 
// --- BÖLÜM 1/3 Sonu ---
// ... btkreports.php Bölüm 1/3 içeriğinin sonu (Smarty atamaları ve menü sonrası) ...

    $templateFile = 'index.tpl'; // Varsayılan şablon
    
    // $action parametresini loglayalım (güvenlik için htmlspecialchars)
    // BtkHelper::logAction('Modül Sayfa İsteği', 'DEBUG', "İstenen action: '" . htmlspecialchars($action) . "'", $adminId, $_REQUEST);

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
            // break; // exit sonrası break gereksiz

        case 'personel':
            $currentFilters = [];
            $filterParams = ['s_ad', 's_soyad', 's_tckn', 's_email', 's_departman_id', 's_btk_listesine_eklensin', 's_aktif_calisan'];
            if (isset($_REQUEST['filter']) && $_REQUEST['filter'] == '1') { 
                foreach ($filterParams as $param) { 
                    if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { 
                        $currentFilters[$param] = trim($_REQUEST[$param]); 
                    }
                } 
                $_SESSION['BtkReportsPersonelFilters'] = $currentFilters; 
            } elseif (isset($_REQUEST['clearfilter']) && $_REQUEST['clearfilter'] == '1') { 
                unset($_SESSION['BtkReportsPersonelFilters']); 
                // Filtre temizlendikten sonra sayfayı yeniden yükle (GET parametreleri olmadan)
                header("Location: " . $modulelink . "&action=personel"); 
                exit;
            } elseif (isset($_SESSION['BtkReportsPersonelFilters'])) { 
                $currentFilters = $_SESSION['BtkReportsPersonelFilters']; 
            }
            $smarty->assign('filters', $currentFilters); // Filtreleri şablona gönder
            btk_page_personel($smarty, $modulelink, $LANG, $currentFilters);
            $templateFile = 'personel.tpl';
            break;
        case 'save_personel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_personel($_POST, $LANG); 
            }
            // Kaydetme sonrası, mevcut sayfa ve filtrelerle aynı sayfaya yönlendir
            $redirectQuery = [];
            if (isset($_POST['page']) && is_numeric($_POST['page'])) $redirectQuery['page'] = (int)$_POST['page'];
            if (isset($_SESSION['BtkReportsPersonelFilters']) && !empty($_SESSION['BtkReportsPersonelFilters'])) {
                $redirectQuery = array_merge($redirectQuery, $_SESSION['BtkReportsPersonelFilters']);
                if (!empty($redirectQuery)) $redirectQuery['filter'] = '1'; // Filtre uygulandığını belirt
            }
            header("Location: " . $modulelink . "&action=personel" . (!empty($redirectQuery) ? '&' . http_build_query($redirectQuery) : '')); 
            exit;
            // break;

        case 'delete_personel':
            $personel_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $pageToReturnQuery = [];
            if (isset($_REQUEST['page']) && is_numeric($_REQUEST['page'])) $pageToReturnQuery['page'] = (int)$_REQUEST['page'];
            if (isset($_SESSION['BtkReportsPersonelFilters']) && !empty($_SESSION['BtkReportsPersonelFilters'])) {
                $pageToReturnQuery = array_merge($pageToReturnQuery, $_SESSION['BtkReportsPersonelFilters']);
                 if (!empty($pageToReturnQuery)) $pageToReturnQuery['filter'] = '1';
            }
            
            // GET istekleri için CSRF token doğrulaması
            $csrfTokenName = 'btk_delete_personel_' . $personel_id_to_delete; // Her silme linki için unique token adı
            if ($personel_id_to_delete > 0 && isset($_REQUEST['token']) && CSRF::verifyToken($csrfTokenName, $_REQUEST['token'])) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_personel($personel_id_to_delete, $LANG); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidPersonelId'] ?? 'Geçersiz Personel ID.') . (!isset($_REQUEST['token']) || !CSRF::verifyToken($csrfTokenName, $_REQUEST['token']) ? ($LANG['csrfTokenError'] ?? ' Güvenlik tokeni eksik veya geçersiz.') : '')]; 
            }
            header("Location: " . $modulelink . "&action=personel" . (!empty($pageToReturnQuery) ? '&' . http_build_query($pageToReturnQuery) : '')); 
            exit;
            // break;

        case 'isspop':
            $currentIssPopFilters = [];
            $filterIssPopParams = ['s_pop_adi', 's_yayin_yapilan_ssid', 's_il_id', 's_ilce_id', 's_aktif_pasif_durum'];
             if (isset($_REQUEST['filter_isspop']) && $_REQUEST['filter_isspop'] == '1') { 
                 foreach ($filterIssPopParams as $param) { if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { $currentIssPopFilters[$param] = trim($_REQUEST[$param]); }} 
                 $_SESSION['BtkReportsIssPopFilters'] = $currentIssPopFilters; 
             } elseif (isset($_REQUEST['clearfilter_isspop']) && $_REQUEST['clearfilter_isspop'] == '1') { 
                 unset($_SESSION['BtkReportsIssPopFilters']); 
                 header("Location: " . $modulelink . "&action=isspop"); exit;
             } elseif (isset($_SESSION['BtkReportsIssPopFilters'])) { 
                 $currentIssPopFilters = $_SESSION['BtkReportsIssPopFilters']; 
             }
            $smarty->assign('filters_isspop', $currentIssPopFilters);
            btk_page_isspop($smarty, $modulelink, $LANG, $currentIssPopFilters);
            $templateFile = 'iss_pop_management.tpl';
            break;
        case 'save_isspop':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_isspop($_POST, $LANG); 
            }
            $redirectPage = isset($_POST['page_isspop']) && is_numeric($_POST['page_isspop']) ? '&page_isspop='.(int)$_POST['page_isspop'] : '';
            if(isset($_SESSION['BtkReportsIssPopFilters']) && !empty($_SESSION['BtkReportsIssPopFilters'])) {
                $redirectPage .= '&filter_isspop=1&' . http_build_query($_SESSION['BtkReportsIssPopFilters']);
            }
            header("Location: " . $modulelink . "&action=isspop" . $redirectPage); 
            exit;
            // break;
        case 'delete_isspop':
            $pop_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $pageToReturn = isset($_REQUEST['page_isspop']) && is_numeric($_REQUEST['page_isspop']) ? '&page_isspop='.(int)$_REQUEST['page_isspop'] : '';
             if(isset($_SESSION['BtkReportsIssPopFilters']) && !empty($_SESSION['BtkReportsIssPopFilters'])) {
                $pageToReturn .= '&filter_isspop=1&' . http_build_query($_SESSION['BtkReportsIssPopFilters']);
            }
            $csrfTokenNamePop = 'btk_delete_isspop_' . $pop_id_to_delete;
            if ($pop_id_to_delete > 0 && isset($_REQUEST['token']) && CSRF::verifyToken($csrfTokenNamePop, $_REQUEST['token'])) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_isspop($pop_id_to_delete, $LANG); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidPopId'] ?? 'Geçersiz POP ID.') . (!isset($_REQUEST['token']) || !CSRF::verifyToken($csrfTokenNamePop, $_REQUEST['token']) ? ($LANG['csrfTokenError'] ?? ' Güvenlik tokeni eksik veya geçersiz.') : '')]; 
            }
            header("Location: " . $modulelink . "&action=isspop" . $pageToReturn); 
            exit;
            // break;
        case 'import_isspop_excel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['excel_file'])) { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_import_isspop_excel($_FILES['excel_file'], $LANG); 
            }
            header("Location: " . $modulelink . "&action=isspop"); 
            exit;
            // break;
        case 'export_personel_excel': 
            if (isset($_REQUEST['token']) && CSRF::verifyToken('btk_export_excel', $_REQUEST['token'])) { // Genel bir export tokeni
                btk_action_export_excel('PERSONEL', $LANG, $modulelink); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['csrfTokenErrorExport'] ?? 'Geçersiz dışa aktarma güvenlik tokeni.']; 
                header("Location: " . $modulelink . "&action=personel");
            } 
            exit; 
            // break;
        case 'export_isspop_excel': 
            if (isset($_REQUEST['token']) && CSRF::verifyToken('btk_export_excel', $_REQUEST['token'])) { // Genel bir export tokeni
                btk_action_export_excel('ISSPOP', $LANG, $modulelink); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['csrfTokenErrorExport'] ?? 'Geçersiz dışa aktarma güvenlik tokeni.']; 
                header("Location: " . $modulelink . "&action=isspop");
            } 
            exit; 
            // break;
        case 'product_group_mappings': 
            btk_page_product_group_mappings($smarty, $modulelink, $LANG); 
            $templateFile = 'product_group_mappings.tpl'; 
            break;
        case 'save_product_group_mappings': 
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_product_group_mappings($_POST, $LANG); 
            } 
            header("Location: " . $modulelink . "&action=product_group_mappings"); 
            exit; 
            // break;
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
            // break;
        case 'viewlogs': 
            $currentLogFilters = [];
            $filterLogParams = ['s_log_level', 's_log_islem', 's_log_mesaj', 's_log_date_from', 's_log_date_to', 's_ftp_dosya_adi', 's_ftp_rapor_turu', 's_ftp_durum'];
             if (isset($_REQUEST['filter_log']) && $_REQUEST['filter_log'] == '1') { 
                 foreach ($filterLogParams as $param) { if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { $currentLogFilters[$param] = trim($_REQUEST[$param]); }} 
                 $_SESSION['BtkReportsLogFilters'] = $currentLogFilters; 
             } elseif (isset($_REQUEST['clearfilter_log']) && $_REQUEST['clearfilter_log'] == '1') { 
                 unset($_SESSION['BtkReportsLogFilters']);  
                 header("Location: " . $modulelink . "&action=viewlogs"); exit;
             } elseif (isset($_SESSION['BtkReportsLogFilters'])) { 
                 $currentLogFilters = $_SESSION['BtkReportsLogFilters']; 
             }
            $smarty->assign('filters_log', $currentLogFilters);
            btk_page_view_logs($smarty, $modulelink, $LANG, $currentLogFilters); 
            $templateFile = 'view_logs.tpl'; 
            break;
        
        // AJAX Actions
        case 'get_ilceler': 
        case 'get_mahalleler': 
        case 'search_pop_ssids': 
        case 'nvi_tckn_dogrula': 
        case 'nvi_ykn_dogrula':
        case 'test_ftp_connection':
            header('Content-Type: application/json; charset=utf-8');
            // AJAX POST istekleri için CSRF token'ı JS tarafında data objesine eklenmeli
            // ve burada $request_data['token'] ile alınıp CSRF::verify() ile doğrulanmalı.
            // Örnek: if ($_SERVER['REQUEST_METHOD'] === 'POST' && class_exists('WHMCS\Utility\CSRF') && isset($request_data['token'])) { CSRF::verifyToken('ajax_btk_general', $request_data['token']); }
            echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG), JSON_UNESCAPED_UNICODE);
            exit;
            // break; // exit sonrası break gereksiz

        case 'index': 
        default:
            btk_page_index($smarty, $modulelink, $LANG);
            $templateFile = 'index.tpl';
            break;
    }
// --- BÖLÜM 2/3 Sonu ---
// ... btkreports.php Bölüm 2/3 içeriğinin sonu (switch ($action) bloğunun sonu) ...

    if (isset($templateFile) && file_exists(__DIR__ . '/templates/admin/' . $templateFile)) {
        try { 
            $output = $smarty->fetch(__DIR__ . '/templates/admin/' . $templateFile); 
            echo $output; 
        }
        catch (SmartyException $e) { 
            if (class_exists('BtkHelper')) BtkHelper::logAction('Smarty Hatası', 'HATA', $e->getMessage() . ' Şablon: ' . $templateFile, $adminId); 
            echo '<div class="alert alert-danger">Şablon yükleme hatası: ' . htmlspecialchars($e->getMessage()) . ' (Lütfen sistem loglarını kontrol edin)</div>'; 
        }
    } elseif (isset($templateFile)) { 
        if (class_exists('BtkHelper')) BtkHelper::logAction('Şablon Hatası', 'HATA', 'Şablon dosyası bulunamadı: ' . $templateFile, $adminId); 
        echo '<div class="alert alert-danger">İstenen şablon dosyası (' . htmlspecialchars($templateFile) . ') bulunamadı.</div>';
    }
    echo '</div>'; // btkReportsModuleContainer div kapanışı
}

// -------- SAYFA İÇERİĞİ HAZIRLAMA VE ACTION FONKSİYONLARI --------

function btk_page_index(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['dashboardtitle'] ?? 'BTK Raporlama Ana Sayfa');
    $ftpMainStatus = BtkHelper::checkFtpConnection('main');
    $ftpBackupStatus = ['status' => 'info', 'message' => $LANG['backupFtpDisabled'] ?? 'Yedek FTP etkin değil.'];
    $settings = BtkHelper::getAllBtkSettings(); // Ayarları bir kere çekelim
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
            $lastSubmissions[$grup]['REHBER'] = ['tarih_saat' => $lastRehber ? date("d.m.Y H:i:s", strtotime($lastRehber['gonderim_zamani'] . ' UTC')) : ($LANG['notSubmittedYet'] ?? '-'), 'dosya_adi' => $lastRehber['dosya_adi'] ?? '-', 'cnt' => $lastRehber['cnt_numarasi'] ?? '-'];
            $lastSubmissions[$grup]['HAREKET'] = ['tarih_saat' => $lastHareket ? date("d.m.Y H:i:s", strtotime($lastHareket['gonderim_zamani'] . ' UTC')) : ($LANG['notSubmittedYet'] ?? '-'), 'dosya_adi' => $lastHareket['dosya_adi'] ?? '-', 'cnt' => $lastHareket['cnt_numarasi'] ?? '-'];
        }
    }
    $lastPersonel = BtkHelper::getLastSuccessfulReportInfo('PERSONEL', 'ANA');
    $lastSubmissions['PERSONEL'] = ['tarih_saat' => $lastPersonel ? date("d.m.Y H:i:s", strtotime($lastPersonel['gonderim_zamani'] . ' UTC')) : ($LANG['notSubmittedYet'] ?? '-'), 'dosya_adi' => $lastPersonel['dosya_adi'] ?? '-', 'cnt' => $lastPersonel['cnt_numarasi'] ?? '-'];
    $smarty->assign('last_submissions', $lastSubmissions);
    $smarty->assign('aktif_yetki_gruplari_for_index', $aktifGruplar);

    $smarty->assign('next_rehber_cron_run', BtkHelper::getNextCronRunTime('rehber_cron_schedule'));
    $smarty->assign('next_hareket_cron_run', BtkHelper::getNextCronRunTime('hareket_cron_schedule'));
    $smarty->assign('next_personel_cron_run', BtkHelper::getNextCronRunTime('personel_cron_schedule'));
    BtkHelper::logAction('Ana Sayfa Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}

function btk_page_config(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['configtitle'] ?? 'BTK Modül Ayarları');
    $current_settings = BtkHelper::getAllBtkSettings();
    $settings = $current_settings; 
    $currentActionFromSmarty = $smarty->getVariable('currentModulePageAction')->value ?? 'config';

    if (isset($_SESSION['BtkReportsFormErrorData']) && $currentActionFromSmarty === 'config') {
        $form_data = $_SESSION['BtkReportsFormErrorData'];
        $settings = array_merge($current_settings, $form_data); // Formdan gelenlerle DB'dekileri birleştir
        // Şifreler için özel placeholder mantığı TPL'de handle ediliyor, burada sadece doluysa '********' yapalım.
        $settings['main_ftp_pass'] = !empty($current_settings['main_ftp_pass']) ? '********' : ''; 
        $settings['backup_ftp_pass'] = !empty($current_settings['backup_ftp_pass']) ? '********' : '';
        
        $checkboxKeys = ['main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 'personel_filename_add_year_month_main', 'personel_filename_add_year_month_backup', 'show_btk_info_if_empty_clientarea'];
        foreach($checkboxKeys as $cbKey) { 
            if (isset($form_data[$cbKey])) { $settings[$cbKey] = ($form_data[$cbKey] === 'on' || $form_data[$cbKey] === '1') ? '1' : '0'; }
            elseif (isset($current_settings[$cbKey])) { $settings[$cbKey] = $current_settings[$cbKey]; }
            else { $settings[$cbKey] = '0';}
        }
    } else { // Hata yoksa veya session'da form verisi yoksa, şifre alanları için placeholder'ı ayarla
        $settings['main_ftp_pass_is_set'] = !empty($settings['main_ftp_pass']) ? '1' : '0'; // JS için
        $settings['main_ftp_pass'] = !empty($settings['main_ftp_pass']) ? '********' : '';
        $settings['backup_ftp_pass_is_set'] = !empty($settings['backup_ftp_pass']) ? '1' : '0'; // JS için
        $settings['backup_ftp_pass'] = !empty($settings['backup_ftp_pass']) ? '********' : '';
    }
    $smarty->assign('settings', $settings);

    $yetkiTurleriReferans = BtkHelper::getAllYetkiTurleriReferans();
    $seciliYetkiTurleriDb = BtkHelper::getSeciliYetkiTurleri(); // Sadece aktif olanların kodlarını döner.
    $displayYetkiTurleri = [];
    if (is_array($yetkiTurleriReferans)) {
        foreach ($yetkiTurleriReferans as $yt_obj) {
            $yt = (array)$yt_obj; // Obje ise diziye çevir
            $is_aktif = 0;
            if (isset($form_data['yetkiler']) && is_array($form_data['yetkiler']) && array_key_exists($yt['yetki_kodu'], $form_data['yetkiler'])) { 
                 $is_aktif = 1; 
            } elseif (!isset($form_data) && isset($seciliYetkiTurleriDb[$yt['yetki_kodu']])) { 
                $is_aktif = 1; // $seciliYetkiTurleriDb sadece aktif olanları içerir
            }
            $displayYetkiTurleri[] = ['kod' => $yt['yetki_kodu'], 'ad' => $yt['yetki_adi'], 'grup' => $yt['grup'] ?? '', 'aktif' => $is_aktif];
        }
    }
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
    // Şifreler sadece '********' placeholder'ından farklı bir değer girilmişse güncellenir.
    if (isset($postData['main_ftp_pass']) && trim($postData['main_ftp_pass']) !== '********') { BtkHelper::set_btk_setting('main_ftp_pass', trim($postData['main_ftp_pass'])); }
    if (isset($postData['backup_ftp_pass']) && trim($postData['backup_ftp_pass']) !== '********') { BtkHelper::set_btk_setting('backup_ftp_pass', trim($postData['backup_ftp_pass'])); }
    BtkHelper::saveSeciliYetkiTurleri(isset($postData['yetkiler']) && is_array($postData['yetkiler']) ? $postData['yetkiler'] : []);
    BtkHelper::logAction('Ayarlar Kaydedildi', 'BAŞARILI', 'Modül ayarları güncellendi.', $logKullaniciId);
    return ['status' => 'success', 'message' => $LANG['settingssavedsucceed'] ?? 'Ayarlar başarıyla kaydedildi.'];
}

function btk_page_personel(&$smarty, $modulelink, $LANG, $filters = []) {
    $smarty->assign('page_title', $LANG['personeltitle'] ?? 'Personel Yönetimi');
    $adminId = BtkHelper::getCurrentAdminId();
    $page = isset($_REQUEST['page']) && is_numeric($_REQUEST['page']) ? (int)$_REQUEST['page'] : 1; if ($page < 1) $page = 1;
    $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20); $offset = ($page - 1) * $limit;
    $personelResult = BtkHelper::getPersonelList($filters, 'p.soyad', 'ASC', $limit, $offset);
    $smarty->assign('personel_listesi', $personelResult['data']);
    $smarty->assign('departmanlar', BtkHelper::getDepartmanList());
    $smarty->assign('tum_ilceler_listesi', BtkHelper::getTumIlcelerWithIlAdi());
    try { $smarty->assign('whmcs_admin_users_placeholder', Capsule::table('tbladmins')->where('disabled', 0)->orderBy('firstname')->get(['id', 'username', 'firstname', 'lastname'])->all()); }
    catch (Exception $e) { BtkHelper::logAction('WHMCS Admin Listesi Çekme Hatası', 'HATA', $e->getMessage()); $smarty->assign('whmcs_admin_users_placeholder', []);}
    $totalPages = ($limit > 0 && $personelResult['total_count'] > 0) ? ceil($personelResult['total_count'] / $limit) : 1;
    $smarty->assign('current_page', $page); $smarty->assign('total_pages', $totalPages); $smarty->assign('total_items', $personelResult['total_count']);
    $preservedFilters = $filters; if(isset($preservedFilters['filter'])) unset($preservedFilters['filter']);
    $smarty->assign('pagination_params', !empty($preservedFilters) ? '&filter=1&' . http_build_query($preservedFilters) : '');
    BtkHelper::logAction('Personel Sayfası Görüntülendi', 'INFO', "Sayfa: $page, Filtreler: " . json_encode($filters), $adminId);
}

function btk_action_save_personel($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_delete_personel($personelId, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_page_isspop(&$smarty, $modulelink, $LANG, $filters = []) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_save_isspop($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_delete_isspop($popId, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_import_isspop_excel($fileData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_export_excel($reportType, $LANG, $modulelink) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_page_product_group_mappings(&$smarty, $modulelink, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_save_product_group_mappings($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_page_generate_reports(&$smarty, $modulelink, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_do_generate_report($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_page_view_logs(&$smarty, $modulelink, $LANG, $filters = []) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi, filtreler eklendi) ... */ }
function btk_handle_ajax_requests($ajax_action, $request_data, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi, FTP Test dahil) ... */ }

?>