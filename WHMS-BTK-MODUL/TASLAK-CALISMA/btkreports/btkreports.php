<?php
/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 * (TÜM FONKSİYONLARIN İÇLERİ DOLDURULMUŞ - ALTIN KURAL UYGULANDI)
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
                'mod_btk_yetki_turleri_referans', 'mod_btk_hat_durum_kodlari_referans',
                'mod_btk_musteri_hareket_kodlari_referans', 'mod_btk_kimlik_tipleri_referans',
                'mod_btk_meslek_kodlari_referans', 'mod_btk_settings'
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

    $templateFile = 'index.tpl'; // Varsayılan
    
    BtkHelper::logAction('Modül Sayfa İsteği', 'DEBUG', "İstenen action: '$action'", $adminId, $_REQUEST);

// --- BÖLÜM 1/3 Sonu ---
// ... btkreports.php Bölüm 1/3 içeriğinin sonu (Smarty atamaları ve menü sonrası) ...

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
                header("Location: " . $modulelink . "&action=personel"); exit; // Filtre temizlendikten sonra yönlendir
            } elseif (isset($_SESSION['BtkReportsPersonelFilters'])) { 
                $currentFilters = $_SESSION['BtkReportsPersonelFilters']; 
            }
            $smarty->assign('filters', $currentFilters); // Şablona filtreleri gönder
            btk_page_personel($smarty, $modulelink, $LANG, $currentFilters);
            $templateFile = 'personel.tpl';
            break;
        case 'save_personel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_personel($_POST, $LANG); 
            }
            $redirectPage = isset($_POST['page']) && is_numeric($_POST['page']) ? '&page='.(int)$_POST['page'] : '';
            if(isset($_SESSION['BtkReportsPersonelFilters']) && !empty($_SESSION['BtkReportsPersonelFilters'])) {
                // Session'dan alınan filtreleri URL'e ekle
                $redirectPage .= '&filter=1&' . http_build_query($_SESSION['BtkReportsPersonelFilters']);
            }
            header("Location: " . $modulelink . "&action=personel" . $redirectPage); 
            exit;
            // break;

        case 'delete_personel':
            $personel_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $pageToReturn = isset($_REQUEST['page']) && is_numeric($_REQUEST['page']) ? '&page='.(int)$_REQUEST['page'] : '';
            if(isset($_SESSION['BtkReportsPersonelFilters']) && !empty($_SESSION['BtkReportsPersonelFilters'])) {
                $pageToReturn .= '&filter=1&' . http_build_query($_SESSION['BtkReportsPersonelFilters']);
            }
            // GET istekleri için CSRF token'ı URL'den alıp doğrula
            $token = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';
            if ($personel_id_to_delete > 0 && CSRF::verifyToken('btk_delete_personel', $token)) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_personel($personel_id_to_delete, $LANG); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidPersonelId'] ?? 'Geçersiz Personel ID.') . (!CSRF::verifyToken('btk_delete_personel', $token) ? ($LANG['csrfTokenError'] ?? ' Güvenlik tokeni eksik veya geçersiz.') : '')]; 
            }
            header("Location: " . $modulelink . "&action=personel" . $pageToReturn); 
            exit;
            // break;

        case 'isspop':
            $currentIssPopFilters = [];
            $filterIssPopParams = ['s_pop_adi', 's_yayin_yapilan_ssid', 's_il_id', 's_ilce_id', 's_aktif_pasif_durum'];
             if (isset($_REQUEST['filter_isspop']) && $_REQUEST['filter_isspop'] == '1') { 
                 foreach ($filterIssPopParams as $param) { 
                     if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { 
                         $currentIssPopFilters[$param] = trim($_REQUEST[$param]); 
                     }
                 } 
                 $_SESSION['BtkReportsIssPopFilters'] = $currentIssPopFilters; 
             } elseif (isset($_REQUEST['clearfilter_isspop']) && $_REQUEST['clearfilter_isspop'] == '1') { 
                 unset($_SESSION['BtkReportsIssPopFilters']); 
                 header("Location: " . $modulelink . "&action=isspop"); exit; // Filtre temizlendikten sonra yönlendir
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
            $token = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';
            if ($pop_id_to_delete > 0 && CSRF::verifyToken('btk_delete_isspop', $token)) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_isspop($pop_id_to_delete, $LANG); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidPopId'] ?? 'Geçersiz POP ID.') . (!CSRF::verifyToken('btk_delete_isspop', $token) ? ($LANG['csrfTokenError'] ?? ' Güvenlik tokeni eksik veya geçersiz.') : '')]; 
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
            $token = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';
            if (CSRF::verifyToken('btk_export_personel', $token)) { 
                btk_action_export_excel('PERSONEL', $LANG, $modulelink); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['csrfTokenErrorExport'] ?? 'Geçersiz dışa aktarma güvenlik tokeni.']; 
                header("Location: " . $modulelink . "&action=personel");
            } 
            exit; 
            // break;
        case 'export_isspop_excel': 
            $token = isset($_REQUEST['token']) ? $_REQUEST['token'] : '';
            if (CSRF::verifyToken('btk_export_isspop', $token)) { 
                btk_action_export_excel('ISSPOP', $LANG, $modulelink); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['csrfTokenErrorExport'] ?? 'Geçersiz dışa aktarma güvenlik tokeni.']; 
                header("Location: " . $modulelink . "&action=isspop");
            } 
            exit; 
            // break;
// --- BÖLÜM 2/3 Sonu ---

// ... btkreports.php Bölüm 2/3 içeriğinin sonu (case 'export_isspop_excel' sonrası) ...

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
            $filterLogParams = ['s_log_level', 's_log_islem', 's_log_mesaj', 's_log_date_from', 's_log_date_to'];
             if (isset($_REQUEST['filter_log']) && $_REQUEST['filter_log'] == '1') { 
                 foreach ($filterLogParams as $param) { 
                     if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== '') { 
                         $currentLogFilters[$param] = trim($_REQUEST[$param]); 
                     }
                 } 
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
            // AJAX POST istekleri için CSRF doğrulaması btk_handle_ajax_requests içinde yapılabilir.
            // if ($_SERVER['REQUEST_METHOD'] === 'POST' && class_exists('WHMCS\Utility\CSRF')) {
            //     if (!isset($_REQUEST['token']) || !CSRF::verifyToken('ajax_btk_token_name', $_REQUEST['token'])) { // Token adı belirlenmeli
            //         echo json_encode(['status' => 'error', 'message' => 'CSRF token hatası.']);
            //         exit;
            //     }
            // }
            echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG), JSON_UNESCAPED_UNICODE);
            exit;
            // break; // exit sonrası break gereksiz

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
        $settings = array_merge($current_settings, $form_data);
        // Şifreler placeholder olarak .tpl içinde ayarlandığı için burada özel bir şey yapmaya gerek yok,
        // BtkHelper::getAllBtkSettings zaten deşifre edilmiş (veya boş) döner.
        // Sadece POST'tan gelen '********' ise BtkHelper::set_btk_setting onu atlar.
        $settings['main_ftp_pass_is_set'] = !empty($current_settings['main_ftp_pass']) ? '1' : '0';
        $settings['backup_ftp_pass_is_set'] = !empty($current_settings['backup_ftp_pass']) ? '1' : '0';
        // Formdan gelen checkbox değerlerini işle
        $checkboxKeys = ['main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 'personel_filename_add_year_month_main', 'personel_filename_add_year_month_backup', 'show_btk_info_if_empty_clientarea'];
        foreach($checkboxKeys as $cbKey) { 
            $settings[$cbKey] = (isset($form_data[$cbKey]) && ($form_data[$cbKey] === 'on' || $form_data[$cbKey] === '1')) ? '1' : '0';
        }
    } else { // Normal sayfa yüklemesi veya başarılı kaydetme sonrası
        $settings['main_ftp_pass_is_set'] = !empty($settings['main_ftp_pass']) ? '1' : '0';
        $settings['main_ftp_pass'] = !empty($settings['main_ftp_pass']) ? '********' : '';
        $settings['backup_ftp_pass_is_set'] = !empty($settings['backup_ftp_pass']) ? '1' : '0';
        $settings['backup_ftp_pass'] = !empty($settings['backup_ftp_pass']) ? '********' : '';
    }
    $smarty->assign('settings', $settings);

    $yetkiTurleriReferans = BtkHelper::getAllYetkiTurleriReferans();
    $seciliYetkiTurleriDb = BtkHelper::getSeciliYetkiTurleri(); // Sadece aktif olanları (value=1) döner
    $displayYetkiTurleri = [];
    if (is_array($yetkiTurleriReferans)) {
        foreach ($yetkiTurleriReferans as $yt) {
            $is_aktif = 0;
            // Hata sonrası form verilerinde (session'dan gelen $form_data) yetki varsa onu kullan
            if (isset($form_data['yetkiler']) && is_array($form_data['yetkiler']) && array_key_exists($yt->yetki_kodu, $form_data['yetkiler'])) { 
                $is_aktif = 1; // 'on' veya '1' olarak gelir
            } elseif (!isset($form_data) && isset($seciliYetkiTurleriDb[$yt->yetki_kodu])) { // Normal durumda DB'den al
                $is_aktif = $seciliYetkiTurleriDb[$yt->yetki_kodu]; 
            }
            $displayYetkiTurleri[] = ['kod' => $yt->yetki_kodu, 'ad' => $yt->yetki_adi, 'grup' => $yt->grup, 'aktif' => $is_aktif];
        }
    }
    $smarty->assign('yetki_turleri', $displayYetkiTurleri);
    BtkHelper::logAction('Genel Ayarlar Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}

function btk_action_save_config($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_page_personel(&$smarty, $modulelink, $LANG, $filters = []) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_save_personel($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_delete_personel($personelId, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_page_isspop(&$smarty, $modulelink, $LANG, $filters = []) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_save_isspop($postData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_delete_isspop($popId, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_import_isspop_excel($fileData, $LANG) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }
function btk_action_export_excel($reportType, $LANG, $modulelink) { /* ... (Bir önceki tam btkreports.php gönderimindeki gibi) ... */ }

function btk_page_product_group_mappings(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['productgroupmappingstitle'] ?? 'Ürün Grubu - BTK Yetki Eşleştirme');
    try {
        $productGroups = Capsule::table('tblproductgroups')->where('hidden',0)->orderBy('order')->orderBy('name')->get(['id', 'name'])->all();
        $smarty->assign('product_groups', array_map(function($item){ return (array)$item; }, $productGroups));
    } catch (Exception $e) { BtkHelper::logAction('Ürün Grupları Okuma Hatası', 'HATA', $e->getMessage()); $smarty->assign('product_groups', []); $smarty->assign('errorMessage', ($LANG['dbReadError'] ?? 'Veritabanı okuma hatası: ') . $e->getMessage()); }
    
    $smarty->assign('aktif_yetki_turleri_referans', BtkHelper::getAktifYetkiTurleri('array_of_arrays')); // .tpl'de $yt.kod kullanmak için
    $smarty->assign('current_mappings', BtkHelper::getProductGroupMappingsArray());
    BtkHelper::logAction('Ürün Grubu Eşleştirme Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_save_product_group_mappings($postData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('Ürün Grubu Eşleştirme Kaydetme İsteği', 'DEBUG', null, $adminId, ['keys_in_post' => array_keys($postData)]);
    $mappings = $postData['mappings'] ?? [];
    $result = BtkHelper::saveProductGroupMappings($mappings);
    if($result) { return ['type' => 'success', 'message' => $LANG['mappingssavedsucceed'] ?? 'Eşleştirmeler başarıyla kaydedildi.']; }
    return ['type' => 'error', 'message' => $LANG['mappingssavefailed'] ?? 'Eşleştirmeler kaydedilirken bir hata oluştu.'];
}

function btk_page_generate_reports(&$smarty, $modulelink, $LANG) {
    $smarty->assign('page_title', $LANG['generatereportstitle'] ?? 'Manuel Rapor Oluşturma ve Gönderme');
    $smarty->assign('aktif_yetki_gruplari', BtkHelper::getAktifYetkiTurleri('array_grup')); // .tpl'de döngü için [['grup'=>'ISS', 'kod'=>'ISS_B', 'ad'=>'...'],...]
    $smarty->assign('settings', BtkHelper::getAllBtkSettings());
    BtkHelper::logAction('Manuel Rapor Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_do_generate_report($postData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    $reportType = $postData['report_type'] ?? null;
    $yetkiGrupInput = $postData['yetki_grup'] ?? null; 
    $ftpTarget = $postData['ftp_target'] ?? 'main';
    $cntOverride = !empty(trim($postData['cnt_override'])) && preg_match('/^\d{2}$/', trim($postData['cnt_override'])) ? trim($postData['cnt_override']) : null;

    if (empty($reportType)) { return ['type' => 'error', 'message' => $LANG['reportTypeRequired'] ?? 'Rapor türü seçilmelidir.']; }
    if (strtoupper($reportType) !== 'PERSONEL' && empty($yetkiGrupInput)) { return ['type' => 'error', 'message' => $LANG['yetkiGrupRequiredForReport'] ?? 'REHBER veya HAREKET raporu için Yetki Türü Grubu seçilmelidir.']; }

    BtkHelper::logAction('Manuel Rapor Oluşturma İsteği', 'BİLGİ', "Rapor: $reportType, Grup: $yetkiGrupInput, Hedef: $ftpTarget, CNT: $cntOverride", $adminId, $postData);
    
    // TODO: BtkHelper içinde bu raporu oluşturup gönderecek ana bir fonksiyon yazılmalı:
    // $generationResult = BtkHelper::triggerManualReportGeneration($reportType, $yetkiGrupInput, $ftpTarget, $cntOverride);
    // if ($generationResult['status'] === 'success') {
    //    return ['type' => 'success', 'message' => ($LANG['manualReportGeneratedSuccess'] ?? "Rapor(lar) başarıyla oluşturuldu ve gönderildi: ") . implode(', ', $generationResult['files_generated'] ?? [])];
    // } else {
    //    return ['type' => 'error', 'message' => ($LANG['manualReportGeneratedError'] ?? "Rapor oluşturulurken hata: ") . ($generationResult['message'] ?? 'Bilinmeyen hata')];
    // }
    return ['type' => 'info', 'message' => 'Manuel rapor oluşturma (' . htmlspecialchars($reportType) . ') tetiklendi. Bu özellik geliştirme aşamasındadır. Sonuçlar için Modül Günlük Kayıtlarını kontrol edin.'];
}

function btk_page_view_logs(&$smarty, $modulelink, $LANG, $filters = []) {
    $smarty->assign('page_title', $LANG['viewlogstitle'] ?? 'Modül Günlük Kayıtları');
    $adminId = BtkHelper::getCurrentAdminId();
    $log_limit = (int)BtkHelper::get_btk_setting('log_records_per_page', 50);
    
    $page_module = isset($_REQUEST['pagem']) && is_numeric($_REQUEST['pagem']) ? (int)$_REQUEST['pagem'] : 1; if ($page_module < 1) $page_module = 1;
    $page_ftp = isset($_REQUEST['pagef']) && is_numeric($_REQUEST['pagef']) ? (int)$_REQUEST['pagef'] : 1; if ($page_ftp < 1) $page_ftp = 1;

    $moduleLogsResult = BtkHelper::getModuleLogs($filters, 'id', 'DESC', $log_limit, ($page_module - 1) * $log_limit);
    // FTP logları için de aynı filtreleri kullanabiliriz veya ayrı filtreler tanımlayabiliriz.
    $ftpLogsResult = BtkHelper::getFtpLog($filters, 'id', 'DESC', $log_limit, ($page_ftp - 1) * $log_limit); 

    $smarty->assign('module_logs', $moduleLogsResult['data']);
    $smarty->assign('total_module_logs', $moduleLogsResult['total_count']);
    $smarty->assign('current_page_module', $page_module);
    $smarty->assign('total_pages_module', ($log_limit > 0 && $moduleLogsResult['total_count'] > 0) ? ceil($moduleLogsResult['total_count'] / $log_limit) : 1);
    $preservedFiltersModule = $filters; if(isset($preservedFiltersModule['filter_log'])) unset($preservedFiltersModule['filter_log']);
    $smarty->assign('pagination_params_module', http_build_query(array_merge(['action' => 'viewlogs', 'tab' => 'module'], $preservedFiltersModule)));

    $smarty->assign('ftp_logs', $ftpLogsResult['data']);
    $smarty->assign('total_ftp_logs', $ftpLogsResult['total_count']);
    $smarty->assign('current_page_ftp', $page_ftp);
    $smarty->assign('total_pages_ftp', ($log_limit > 0 && $ftpLogsResult['total_count'] > 0) ? ceil($ftpLogsResult['total_count'] / $log_limit) : 1);
    $preservedFiltersFtp = $filters; if(isset($preservedFiltersFtp['filter_log'])) unset($preservedFiltersFtp['filter_log']);
    $smarty->assign('pagination_params_ftp', http_build_query(array_merge(['action' => 'viewlogs', 'tab' => 'ftp'], $preservedFiltersFtp)));

    BtkHelper::logAction('Log Sayfası Görüntülendi', 'INFO', "Filtreler: " . json_encode($filters), $adminId);
}

function btk_handle_ajax_requests($ajax_action, $request_data, $LANG) {
    $response = ['status' => 'error', 'message' => ($LANG['unknownAjaxRequest'] ?? 'Bilinmeyen AJAX isteği.'), 'data' => null];
    $adminId = BtkHelper::getCurrentAdminId();
    try {
        // AJAX POST istekleri için CSRF token doğrulaması
        // if ($_SERVER['REQUEST_METHOD'] === 'POST' && class_exists('WHMCS\Utility\CSRF')) {
        //     $token = $request_data['token'] ?? '';
        //     // Her AJAX action'ı için ayrı bir token adı kullanmak daha güvenli olabilir,
        //     // veya genel bir modül AJAX token'ı. Şimdilik genel bir kontrol.
        //     if (!CSRF::verifyToken('btk_ajax_action', $token)) { // Token adını belirle
        //         BtkHelper::logAction("AJAX CSRF Hatası ($ajax_action)", 'UYARI', 'Geçersiz/Eksik CSRF token.', $adminId);
        //         return ['status' => 'error', 'message' => $LANG['csrfTokenErrorAjax'] ?? 'Güvenlik hatası. Lütfen sayfayı yenileyip tekrar deneyin.'];
        //     }
        // }

        switch ($ajax_action) {
            case 'get_ilceler': $il_id = isset($request_data['il_id']) && is_numeric($request_data['il_id']) ? (int)$request_data['il_id'] : 0; $response = ['status' => 'success', 'data' => BtkHelper::getIlcelerByIlId($il_id)]; break;
            case 'get_mahalleler': $ilce_id = isset($request_data['ilce_id']) && is_numeric($request_data['ilce_id']) ? (int)$request_data['ilce_id'] : 0; $response = ['status' => 'success', 'data' => BtkHelper::getMahallelerByIlceId($ilce_id)]; break;
            case 'search_pop_ssids': $term = isset($request_data['term']) ? trim($request_data['term']) : ''; $filter_by = isset($request_data['filter_by']) ? trim($request_data['filter_by']) : null; $filter_value = isset($request_data['filter_value']) ? trim($request_data['filter_value']) : null; $data = BtkHelper::searchPopSSIDs($term, $filter_by, $filter_value); $select2Data = []; if(is_array($data)){ foreach($data as $item){ $id_key = isset($item['id']) ? 'id' : (isset($item->id) ? 'id' : null); $ssid_key = isset($item['yayin_yapilan_ssid']) ? 'yayin_yapilan_ssid' : (isset($item->yayin_yapilan_ssid) ? 'yayin_yapilan_ssid' : null); $pop_adi_key = isset($item['pop_adi']) ? 'pop_adi' : (isset($item->pop_adi) ? 'pop_adi' : null); if ($id_key && $ssid_key) { $select2Data[] = ['id' => is_object($item) ? $item->$id_key : $item[$id_key], 'text' => (is_object($item) ? $item->$ssid_key : $item[$ssid_key]) . ($pop_adi_key && !empty(is_object($item) ? $item->$pop_adi_key : $item[$pop_adi_key]) ? ' (' . (is_object($item) ? $item->$pop_adi_key : $item[$pop_adi_key]) . ')' : '')]; }}} $response = ['status' => 'success', 'results' => $select2Data]; break;
            case 'nvi_tckn_dogrula': if (!class_exists('NviSoapClient')) { $response = ['success' => false, 'message' => 'NVI Servis istemcisi yüklenemedi.']; break; } $nviClient = new NviSoapClient(); $result = $nviClient->TCKimlikNoDogrula($request_data['tckn'] ?? '', $request_data['ad'] ?? '', $request_data['soyad'] ?? '', (int)($request_data['dogum_yili_nvi'] ?? 0)); $response = ['success' => $result, 'message' => $nviClient->getLastErrorMessageForUser(), 'nvi_status' => $result ? 'Dogrulandi' : ($nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi')]; BtkHelper::logAction('AJAX: NVI TCKN Doğrulama', $result ? 'BİLGİ' : 'UYARI', ($response['message'] ?? '') . ($nviClient->getLastError() ? ' Detay: '.$nviClient->getLastError() : ''), $adminId, ['tckn_prefix' => substr($request_data['tckn'] ?? '', 0, 5)]); break;
            case 'nvi_ykn_dogrula':  if (!class_exists('NviSoapClient')) { $response = ['success' => false, 'message' => 'NVI Servis istemcisi yüklenemedi.']; break; } $nviClient = new NviSoapClient(); $result = $nviClient->YabanciKimlikNoDogrula($request_data['ykn'] ?? '', $request_data['ad'] ?? '', $request_data['soyad'] ?? '', (int)($request_data['dogum_gun'] ?? 0), (int)($request_data['dogum_ay'] ?? 0), (int)($request_data['dogum_yil'] ?? 0)); $response = ['success' => $result, 'message' => $nviClient->getLastErrorMessageForUser(), 'nvi_status' => $result ? 'Dogrulandi' : ($nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi')]; BtkHelper::logAction('AJAX: NVI YKN Doğrulama', $result ? 'BİLGİ' : 'UYARI', ($response['message'] ?? '') . ($nviClient->getLastError() ? ' Detay: '.$nviClient->getLastError() : ''), $adminId, ['ykn_prefix' => substr($request_data['ykn'] ?? '', 0, 5)]); break;
            case 'test_ftp_connection': if ($_SERVER['REQUEST_METHOD'] === 'POST') { /* CSRF doğrulaması burada da eklenebilir */ $ftpType = $request_data['ftp_type'] ?? 'main'; $host = trim($request_data['host'] ?? ''); $user = trim($request_data['user'] ?? ''); $passInput = trim($request_data['pass'] ?? ''); $port = isset($request_data['port']) && is_numeric($request_data['port']) ? (int)$request_data['port'] : 21; $ssl = isset($request_data['ssl']) && $request_data['ssl'] === '1'; if (empty($host) || empty($user)) { $response = ['status' => 'error', 'message' => ($LANG['ftpHostUserRequiredForTest'] ?? 'Test için Host ve Kullanıcı Adı gereklidir.')]; break; } $result = BtkHelper::testFtpConnectionWithDetails($host, $user, $passInput, $port, $ssl, ucfirst($ftpType)); BtkHelper::logAction(ucfirst($ftpType) . ' FTP Bağlantı Test Sonucu (AJAX)', $result['status'] === 'success' ? 'BİLGİ' : 'UYARI', $result['message'], $adminId, ['host' => $host]); $response = $result; } else { $response = ['status' => 'error', 'message' => 'Geçersiz istek yöntemi.']; } break;
        }
    } catch (Exception $e) { BtkHelper::logAction("AJAX Genel Hata ($ajax_action)", 'HATA', $e->getMessage(), $adminId, ['request_data_keys' => array_keys($request_data), 'trace' => $e->getTraceAsString()]); $response = ['status' => 'error', 'message' => 'Sunucu tarafında bir hata oluştu. Lütfen logları kontrol edin.']; }
    return $response;
}

?>