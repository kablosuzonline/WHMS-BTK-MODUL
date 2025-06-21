<?php

/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 * (Tüm fonksiyonların içleri doldurulmuş, hata ayıklamaları yapılmış, tam ve eksiksiz sürüm)
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli yardımcı dosyaları dahil et
$baseLibPath = __DIR__ . '/lib/';
$GLOBALS['helperLoadedBtk'] = false; // Global scope'ta tanımla, BtkHelper'ın yüklenip yüklenmediğini kontrol etmek için
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
else { if ($GLOBALS['helperLoadedBtk']) BtkHelper::logAction('Modül Başlatma Hatası', 'UYARI', 'Composer autoload.php bulunamadı! Cron zamanlaması ve bazı Excel işlemleri çalışmayabilir.'); }


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
            BtkHelper::logAction('Modül Aktivasyonu', 'Başarılı', 'BTK Raporlama Modülü başarıyla etkinleştirildi.');
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
        // module_version_placeholder ve setting_surum_notlari_link_placeholder menüde de kullanılacaksa buraya da atanmalı.
        $smartyMenu->assign('module_version_placeholder', btkreports_config()['version']);
        $smartyMenu->assign('setting_surum_notlari_link_placeholder', BtkHelper::get_btk_setting('surum_notlari_link', '../modules/addons/btkreports/README.md'));
        echo $smartyMenu->fetch(__DIR__ . '/templates/admin/shared/admin_header_menu.tpl');
    } catch (SmartyException $e) { BtkHelper::logAction('Smarty Hatası (Menu)', 'Hata', $e->getMessage() . ' Şablon: admin_header_menu.tpl', $adminId); echo '<div class="alert alert-danger">Modül menüsü yüklenirken hata.</div>';}

    // Flash mesajlar admin_header_menu.tpl içinde global olarak gösteriliyor,
    // bu yüzden buradaki bireysel atamalar artık gerekli değil, sadece session'a set etmek yeterli.
    // Ancak, .tpl dosyalarında hala bu değişkenler kullanılıyorsa (global mesaj alanı olmadan),
    // bu atamalar kalabilir veya .tpl'ler güncellenebilir. Şimdilik kalsın.
    if (isset($_SESSION['BtkReportsFlashMessage'])) { 
        $flash = $_SESSION['BtkReportsFlashMessage']; 
        if (isset($flash['type']) && isset($flash['message'])) { 
            $smarty->assign($flash['type'] === 'success' ? 'successMessage' : ($flash['type'] === 'error' ? 'errorMessage' : 'infoMessage'), $flash['message']); 
        } 
        unset($_SESSION['BtkReportsFlashMessage']); 
    }
    if (isset($_SESSION['BtkReportsFormErrorData'])) { 
        $smarty->assign('form_data', $_SESSION['BtkReportsFormErrorData']); 
        unset($_SESSION['BtkReportsFormErrorData']); 
    }
    // config sayfası için özel GET ile gelen başarı mesajı
    if (isset($_GET['success']) && $_GET['success'] == 1 && $action === 'config' && isset($LANG['settingssavedsucceed'])) { 
        $smarty->assign('successMessage', $LANG['settingssavedsucceed']);
    }

    $templateFile = 'index.tpl'; // Varsayılan
    
    BtkHelper::logAction('Modül Sayfa İsteği', 'DEBUG', "İstenen action: '$action'", $adminId, ['REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'N/A', 'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'] ?? 'N/A', 'GET_KEYS' => array_keys($_GET), 'POST_KEYS' => array_keys($_POST)]);

// --- BÖLÜM 1/3 Sonu ---
// ... btkreports.php Bölüm 1/3 içeriğinin sonu (switch ($action) öncesi) ...

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
            header("Location: " . $modulelink . "&action=config" . (isset($result['status']) && $result['status'] === 'success' ? '&success=1' : '')); 
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
                 header("Location: " . $modulelink . "&action=personel"); exit; 
            } elseif (isset($_SESSION['BtkReportsPersonelFilters'])) { 
                $currentFilters = $_SESSION['BtkReportsPersonelFilters']; 
            }
            $smarty->assign('filters', $currentFilters); // Şablonda filtrelerin gösterilmesi için
            btk_page_personel($smarty, $modulelink, $LANG, $currentFilters);
            $templateFile = 'personel.tpl';
            break;
        case 'save_personel':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
                if (class_exists('WHMCS\Utility\CSRF')) CSRF::verify(); 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_save_personel($_POST, $LANG); 
            }
            // Kaydetme sonrası aynı filtreli ve sayfalama durumuna dönmek için
            $redirectParams = [];
            if (isset($_POST['page']) && is_numeric($_POST['page'])) $redirectParams['page'] = (int)$_POST['page'];
            if(isset($_SESSION['BtkReportsPersonelFilters']) && !empty($_SESSION['BtkReportsPersonelFilters'])) {
                $redirectParams['filter'] = '1'; // Filtre aktif olduğunu belirt
                $redirectParams = array_merge($redirectParams, $_SESSION['BtkReportsPersonelFilters']);
            }
            header("Location: " . $modulelink . "&action=personel" . (!empty($redirectParams) ? '&' . http_build_query($redirectParams) : '') ); 
            exit;
            // break;

        case 'delete_personel':
            $personel_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $pageToReturnParams = [];
            if (isset($_REQUEST['page']) && is_numeric($_REQUEST['page'])) $pageToReturnParams['page'] = (int)$_REQUEST['page'];
            if(isset($_SESSION['BtkReportsPersonelFilters']) && !empty($_SESSION['BtkReportsPersonelFilters'])) {
                $pageToReturnParams['filter'] = '1';
                $pageToReturnParams = array_merge($pageToReturnParams, $_SESSION['BtkReportsPersonelFilters']);
            }
            
            $csrfTokenName = class_exists('WHMCS\Utility\CSRF') ? CSRF::getTokenName() : 'token';
            $csrfTokenValue = $_REQUEST[$csrfTokenName] ?? ($_REQUEST['token'] ?? '');

            if ($personel_id_to_delete > 0 && class_exists('WHMCS\Utility\CSRF') && CSRF::verifyToken('btk_delete_personel', $csrfTokenValue)) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_personel($personel_id_to_delete, $LANG); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidPersonelId'] ?? 'Geçersiz Personel ID.') . ((!class_exists('WHMCS\Utility\CSRF') || !CSRF::verifyToken('btk_delete_personel', $csrfTokenValue)) ? ($LANG['csrfTokenError'] ?? ' Güvenlik tokeni eksik veya geçersiz.') : '')]; 
            } 
            header("Location: " . $modulelink . "&action=personel" . (!empty($pageToReturnParams) ? '&' . http_build_query($pageToReturnParams) : '') ); 
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
            $redirectPageParams = [];
            if (isset($_POST['page_isspop']) && is_numeric($_POST['page_isspop'])) $redirectPageParams['page_isspop'] = (int)$_POST['page_isspop'];
            if(isset($_SESSION['BtkReportsIssPopFilters']) && !empty($_SESSION['BtkReportsIssPopFilters'])) {
                $redirectPageParams['filter_isspop'] = '1';
                $redirectPageParams = array_merge($redirectPageParams, $_SESSION['BtkReportsIssPopFilters']);
            }
            header("Location: " . $modulelink . "&action=isspop" . (!empty($redirectPageParams) ? '&' . http_build_query($redirectPageParams) : '') ); 
            exit;
            // break;
        case 'delete_isspop':
            $pop_id_to_delete = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;
            $pageToReturnParams = [];
            if (isset($_REQUEST['page_isspop']) && is_numeric($_REQUEST['page_isspop'])) $pageToReturnParams['page_isspop'] = (int)$_REQUEST['page_isspop'];
             if(isset($_SESSION['BtkReportsIssPopFilters']) && !empty($_SESSION['BtkReportsIssPopFilters'])) {
                $pageToReturnParams['filter_isspop'] = '1';
                $pageToReturnParams = array_merge($pageToReturnParams, $_SESSION['BtkReportsIssPopFilters']);
            }
            $csrfTokenName = class_exists('WHMCS\Utility\CSRF') ? CSRF::getTokenName() : 'token';
            $csrfTokenValue = $_REQUEST[$csrfTokenName] ?? ($_REQUEST['token'] ?? '');
            if ($pop_id_to_delete > 0 && class_exists('WHMCS\Utility\CSRF') && CSRF::verifyToken('btk_delete_isspop', $csrfTokenValue)) { 
                $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_isspop($pop_id_to_delete, $LANG); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => ($LANG['invalidPopId'] ?? 'Geçersiz POP ID.') . ((!class_exists('WHMCS\Utility\CSRF') || !CSRF::verifyToken('btk_delete_isspop', $csrfTokenValue)) ? ($LANG['csrfTokenError'] ?? ' Güvenlik tokeni eksik veya geçersiz.') : '')]; 
            }
            header("Location: " . $modulelink . "&action=isspop" . (!empty($pageToReturnParams) ? '&' . http_build_query($pageToReturnParams) : '') ); 
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
            $csrfTokenName = class_exists('WHMCS\Utility\CSRF') ? CSRF::getTokenName() : 'token';
            $csrfTokenValue = $_REQUEST[$csrfTokenName] ?? ($_REQUEST['token'] ?? '');
            if (class_exists('WHMCS\Utility\CSRF') && CSRF::verifyToken('btk_export_personel', $csrfTokenValue)) { 
                btk_action_export_excel('PERSONEL', $LANG, $modulelink); 
            } else { 
                $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => $LANG['csrfTokenErrorExport'] ?? 'Geçersiz dışa aktarma güvenlik tokeni.']; 
                header("Location: " . $modulelink . "&action=personel");
            } 
            exit; 
            // break;
        case 'export_isspop_excel': 
            $csrfTokenName = class_exists('WHMCS\Utility\CSRF') ? CSRF::getTokenName() : 'token';
            $csrfTokenValue = $_REQUEST[$csrfTokenName] ?? ($_REQUEST['token'] ?? '');
            if (class_exists('WHMCS\Utility\CSRF') && CSRF::verifyToken('btk_export_isspop', $csrfTokenValue)) { 
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
            $filterLogParams = ['s_log_level', 's_log_islem', 's_log_mesaj', 's_log_date_from', 's_log_date_to']; 
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
            // AJAX POST istekleri için CSRF doğrulaması btk_handle_ajax_requests içinde yapılabilir.
            // Ancak, bazı GET istekleri (get_ilceler gibi) token gerektirmeyebilir.
            // Güvenlik için, tüm POST AJAX action'larında token kontrolü önerilir.
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && class_exists('WHMCS\Utility\CSRF')) {
                // CSRF::verify(); // Bu, tüm AJAX POST'ları için genel bir doğrulama olur.
                // Ya da her action kendi içinde token'ı kontrol edebilir.
                // Şimdilik btk_handle_ajax_requests içinde bu kontrolü yapmıyoruz.
            }
            echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG), JSON_UNESCAPED_UNICODE);
            exit;
            // break;

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
            if (class_exists('BtkHelper')) BtkHelper::logAction('Smarty Hatası', 'HATA', $e->getMessage() . ' Şablon: ' . $templateFile, BtkHelper::getCurrentAdminId()); 
            echo '<div class="alert alert-danger">Şablon yükleme hatası: ' . htmlspecialchars($e->getMessage()) . ' (Lütfen sistem loglarını kontrol edin)</div>'; 
        }
    } elseif (isset($templateFile)) { 
        if (class_exists('BtkHelper')) BtkHelper::logAction('Şablon Hatası', 'HATA', 'Şablon dosyası bulunamadı: ' . $templateFile, BtkHelper::getCurrentAdminId()); 
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
    $form_data_session = $_SESSION['BtkReportsFormErrorData'] ?? null; 

    if ($form_data_session && $currentActionFromSmarty === 'config') {
        $settings = array_merge($current_settings, $form_data_session);
        $settings['main_ftp_pass_is_set'] = !empty($current_settings['main_ftp_pass']) ? '1' : '0';
        $settings['main_ftp_pass'] = !empty($current_settings['main_ftp_pass']) ? '********' : ''; 
        $settings['backup_ftp_pass_is_set'] = !empty($current_settings['backup_ftp_pass']) ? '1' : '0';
        $settings['backup_ftp_pass'] = !empty($current_settings['backup_ftp_pass']) ? '********' : '';
        $checkboxKeys = ['main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 'personel_filename_add_year_month_main', 'personel_filename_add_year_month_backup', 'show_btk_info_if_empty_clientarea'];
        foreach($checkboxKeys as $cbKey) { 
            if (isset($form_data_session[$cbKey])) { $settings[$cbKey] = ($form_data_session[$cbKey] === 'on' || $form_data_session[$cbKey] === '1') ? '1' : '0'; } 
            elseif (isset($current_settings[$cbKey])) { $settings[$cbKey] = $current_settings[$cbKey]; } 
            else { $settings[$cbKey] = '0';}
        }
    } else {
        $settings['main_ftp_pass_is_set'] = !empty($settings['main_ftp_pass']) ? '1' : '0';
        $settings['main_ftp_pass'] = !empty($settings['main_ftp_pass']) ? '********' : '';
        $settings['backup_ftp_pass_is_set'] = !empty($settings['backup_ftp_pass']) ? '1' : '0';
        $settings['backup_ftp_pass'] = !empty($settings['backup_ftp_pass']) ? '********' : '';
    }
    $smarty->assign('settings', $settings);

    $yetkiTurleriReferans = BtkHelper::getAllYetkiTurleriReferans();
    $seciliYetkiTurleriDb = BtkHelper::getSeciliYetkiTurleri();
    $displayYetkiTurleri = [];
    if (is_array($yetkiTurleriReferans)) {
        foreach ($yetkiTurleriReferans as $yt_array) {
            $yt = (object)$yt_array;
            $is_aktif = 0;
            if (isset($form_data_session['yetkiler']) && is_array($form_data_session['yetkiler']) && array_key_exists($yt->yetki_kodu, $form_data_session['yetkiler'])) { $is_aktif = 1; }
            elseif (!isset($form_data_session) && isset($seciliYetkiTurleriDb[$yt->yetki_kodu])) { $is_aktif = $seciliYetkiTurleriDb[$yt->yetki_kodu]; }
            $displayYetkiTurleri[] = ['kod' => $yt->yetki_kodu, 'ad' => $yt->yetki_adi, 'grup' => $yt->grup, 'aktif' => $is_aktif];
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
    if (isset($postData['main_ftp_pass'])) { BtkHelper::set_btk_setting('main_ftp_pass', trim($postData['main_ftp_pass'])); }
    if (isset($postData['backup_ftp_pass'])) { BtkHelper::set_btk_setting('backup_ftp_pass', trim($postData['backup_ftp_pass'])); }
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

function btk_action_save_personel($postData, $LANG) {
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('Personel Kaydetme İsteği', 'DEBUG', 'Veri alındı.', $adminId, ['keys_in_post_count' => count($postData)]);
    $result = BtkHelper::savePersonel($postData, $adminId);
    $messageKey = ($result['status'] && isset($postData['personel_id']) && (int)$postData['personel_id'] > 0) ? 'personelupdatesucceed' : ($result['status'] ? 'personelsavedsucceed' : 'personelsavefailed');
    $finalMessage = ($LANG[$messageKey] ?? $result['message']);
    if (isset($result['nvi_status']) && $result['nvi_status'] !== 'Dogrulandi' && !empty($result['nvi_message'])) { $finalMessage .= '<br><b>NVI Doğrulama:</b> ' . htmlspecialchars($result['nvi_message']); }
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
    $smarty->assign('page_title', $LANG['isspoptitle'] ?? 'ISS POP Noktası Yönetimi');
    $adminId = BtkHelper::getCurrentAdminId();
    $page = isset($_REQUEST['page_isspop']) && is_numeric($_REQUEST['page_isspop']) ? (int)$_REQUEST['page_isspop'] : 1; if ($page < 1) $page = 1;
    $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20); $offset = ($page - 1) * $limit;
    $popResult = BtkHelper::getIssPopNoktalariList($filters, 'pop.pop_adi', 'ASC', $limit, $offset);
    $smarty->assign('pop_noktalari_listesi', $popResult['data']);
    $smarty->assign('adres_iller', BtkHelper::getIller());
    $totalPages = ($limit > 0 && $popResult['total_count'] > 0) ? ceil($popResult['total_count'] / $limit) : 1;
    $smarty->assign('current_page_isspop', $page); $smarty->assign('total_pages_isspop', $totalPages); $smarty->assign('total_items_isspop', $popResult['total_count']);
    $preservedFilters = $filters; if(isset($preservedFilters['filter_isspop'])) unset($preservedFilters['filter_isspop']);
    $smarty->assign('pagination_params_isspop', !empty($preservedFilters) ? '&filter_isspop=1&' . http_build_query($preservedFilters) : '');
    BtkHelper::logAction('ISS POP Sayfası Görüntülendi', 'INFO', "Sayfa: $page, Filtreler: " . json_encode($filters), $adminId);
}
function btk_action_save_isspop($postData, $LANG) { 
    $adminId = BtkHelper::getCurrentAdminId();
    BtkHelper::logAction('ISS POP Kaydetme İsteği', 'DEBUG', 'Veri alındı.', $adminId, ['keys_in_post_count' => count($postData)]);
    $result = BtkHelper::saveIssPopNoktasi($postData); 
    $messageKey = ($result['status'] && isset($postData['pop_id']) && (int)$postData['pop_id'] > 0) ? 'isspopupdatesucceed' : ($result['status'] ? 'isspopsavedsucceed' : 'isspopsavefailed'); 
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
        $filename = BtkHelper::generateReportFilename(BtkHelper::get_btk_setting('operator_name'), null, null, 'PERSONEL_LISTESI', '01', time(), 'main'); // isExcel true değil, generateReportFilename halleder
        if (empty($data) && BtkHelper::get_btk_setting('send_empty_reports') !== '1') { BtkHelper::logAction('Personel Excel Export Atlandı', 'BİLGİ', 'Veri yok.', $adminId); $_SESSION['BtkReportsFlashMessage'] = ['type' => 'info', 'message' => $LANG['noDataToExportPersonel'] ?? 'Dışa aktarılacak personel verisi bulunamadı.']; header("Location: " . $modulelink . "&action=personel"); exit; } 
        ExcelExporter::exportPersonelList($data, $filename, true); exit; 
    } elseif ($reportType === 'ISSPOP') { 
        $popResult = BtkHelper::getIssPopNoktalariList([], 'pop.pop_adi', 'ASC', 10000, 0); 
        $dataToExport = []; 
        if (is_array($popResult['data'])) { foreach($popResult['data'] as $pop) { $dataToExport[] = [ 'POP Adı / Lokasyon Adı' => $pop['pop_adi'], 'YAYIN YAPILAN SSID' => $pop['yayin_yapilan_ssid'], 'IP ADRESİ' => $pop['ip_adresi'], 'TÜRÜ' => $pop['pop_tipi'], 'MARKASI' => $pop['cihaz_markasi'], 'MODELİ' => $pop['cihaz_modeli'], 'İL' => $pop['il_adi'], 'İLÇE' => $pop['ilce_adi'], 'MAHALLE' => $pop['mahalle_adi'] ?? '', 'TAM ADRES' => $pop['tam_adres'], 'KOORDİNATLAR' => $pop['koordinatlar'], 'AKTİF/PASİF' => ($pop['aktif_pasif_durum'] ? 'Aktif' : 'Pasif') ];}} 
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
    $smarty->assign('page_title', $LANG['productgroupmappingstitle'] ?? 'Ürün Grubu - BTK Yetki Eşleştirme'); 
    try {
        $productGroups = Capsule::table('tblproductgroups')->where('hidden',0)->orderBy('order')->orderBy('name')->get(['id', 'name'])->all();
        $smarty->assign('product_groups', array_map(function($item){ return (array)$item; }, $productGroups));
    } catch (Exception $e) { BtkHelper::logAction('Ürün Grupları Okuma Hatası', 'HATA', $e->getMessage()); $smarty->assign('product_groups', []); $smarty->assign('errorMessage', ($LANG['dbReadError'] ?? 'Veritabanı okuma hatası: ') . $e->getMessage()); }
    $smarty->assign('aktif_yetki_turleri_referans', BtkHelper::getAktifYetkiTurleri('array_of_arrays')); // .tpl'de $yt.kod kullanılır
    $smarty->assign('all_ek3_hizmet_tipleri_for_tpl', BtkHelper::getAllEk3HizmetTipleri()); // TPL için tüm EK-3'ler
    $smarty->assign('all_ek3_hizmet_tipleri_json', json_encode(BtkHelper::getAllEk3HizmetTipleri(), JSON_UNESCAPED_UNICODE)); // JS için
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
    $smarty->assign('aktif_yetki_gruplari', BtkHelper::getAktifYetkiTurleri('array_grup')); 
    $smarty->assign('settings', BtkHelper::getAllBtkSettings()); 
    BtkHelper::logAction('Manuel Rapor Sayfası Görüntülendi', 'INFO', null, BtkHelper::getCurrentAdminId());
}
function btk_action_do_generate_report($postData, $LANG) { 
    $adminId = BtkHelper::getCurrentAdminId();
    $reportType = $postData['report_type'] ?? null;
    $yetkiGrupInput = $postData['yetki_grup'] ?? null; 
    $ftpTarget = $postData['ftp_target'] ?? 'main'; 
    $cntOverride = !empty(trim($postData['cnt_override'])) && preg_match('/^\d{2}$/', trim($postData['cnt_override'])) ? trim($postData['cnt_override']) : null;
    if (empty($reportType)) return ['type' => 'error', 'message' => $LANG['reportTypeRequired'] ?? 'Rapor türü seçilmelidir.'];
    if (strtoupper($reportType) !== 'PERSONEL_LISTESI' && empty($yetkiGrupInput) && $yetkiGrupInput !== 'ALL_ACTIVE_GROUPS') { return ['type' => 'error', 'message' => $LANG['yetkiGrupRequiredForReport'] ?? 'REHBER veya HAREKET için Yetki Türü Grubu seçilmelidir.'];}
    BtkHelper::logAction('Manuel Rapor Oluşturma İsteği', 'BİLGİ', "Rapor: $reportType, Grup: $yetkiGrupInput, Hedef: $ftpTarget, CNT: $cntOverride", $adminId);
    // TODO: BtkHelper::triggerManualReportGeneration($reportType, $yetkiGrupInput, $ftpTarget, $cntOverride);
    return ['type' => 'info', 'message' => 'Manuel rapor oluşturma (' . htmlspecialchars($reportType) . ') tetiklendi. Bu özellik geliştirme aşamasındadır.']; 
}

function btk_page_view_logs(&$smarty, $modulelink, $LANG, $filters = []) { 
    $smarty->assign('page_title', $LANG['viewlogstitle'] ?? 'Modül Günlük Kayıtları');
    $adminId = BtkHelper::getCurrentAdminId();
    $log_limit = (int)BtkHelper::get_btk_setting('log_records_per_page', 50);
    $page_module = isset($_REQUEST['pagem']) && is_numeric($_REQUEST['pagem']) ? (int)$_REQUEST['pagem'] : 1; if ($page_module < 1) $page_module = 1;
    $page_ftp = isset($_REQUEST['pagef']) && is_numeric($_REQUEST['pagef']) ? (int)$_REQUEST['pagef'] : 1; if ($page_ftp < 1) $page_ftp = 1;

    $filters_ftp = []; // FTP logları için ayrı filtreler (örneğin, s_ftp_rapor_turu, s_ftp_durum vb.)
    // if (isset($_REQUEST['filter_ftp_log']) && $_REQUEST['filter_ftp_log'] == '1') { /* ... */ $_SESSION['BtkReportsFtpLogFilters'] = $filters_ftp;} 
    // elseif (isset($_REQUEST['clearfilter_ftp_log'])) { unset($_SESSION['BtkReportsFtpLogFilters']); }
    // elseif (isset($_SESSION['BtkReportsFtpLogFilters'])) { $filters_ftp = $_SESSION['BtkReportsFtpLogFilters']; }
    // $smarty->assign('filters_ftp', $filters_ftp);


    $moduleLogsResult = BtkHelper::getModuleLogs($filters, 'id', 'DESC', $log_limit, ($page_module - 1) * $log_limit);
    $ftpLogsResult = BtkHelper::getFtpLog($filters, 'id', 'DESC', $log_limit, ($page_ftp - 1) * $log_limit); // Şimdilik aynı filtreleri kullanıyor

    $smarty->assign('module_logs', $moduleLogsResult['data']);
    $smarty->assign('total_module_logs', $moduleLogsResult['total_count']);
    $smarty->assign('current_page_module', $page_module);
    $smarty->assign('total_pages_module', ($log_limit > 0 && $moduleLogsResult['total_count'] > 0) ? ceil($moduleLogsResult['total_count'] / $log_limit) : 1);
    $smarty->assign('pagination_params_module', http_build_query(array_merge(['action' => 'viewlogs', 'tab' => 'module'], $filters)));

    $smarty->assign('ftp_logs', $ftpLogsResult['data']);
    $smarty->assign('total_ftp_logs', $ftpLogsResult['total_count']);
    $smarty->assign('current_page_ftp', $page_ftp);
    $smarty->assign('total_pages_ftp', ($log_limit > 0 && $ftpLogsResult['total_count'] > 0) ? ceil($ftpLogsResult['total_count'] / $log_limit) : 1);
    $smarty->assign('pagination_params_ftp', http_build_query(array_merge(['action' => 'viewlogs', 'tab' => 'ftp'], $filters))); // FTP için de aynı filtreleri kullanıyor

    BtkHelper::logAction('Log Sayfası Görüntülendi', 'INFO', "Filtreler: " . json_encode($filters), $adminId);
}

function btk_handle_ajax_requests($ajax_action, $request_data, $LANG) {
    $response = ['status' => 'error', 'message' => ($LANG['unknownAjaxRequest'] ?? 'Bilinmeyen AJAX isteği.'), 'data' => null];
    $adminId = BtkHelper::getCurrentAdminId();
    try {
        $csrfTokenName = class_exists('WHMCS\Utility\CSRF') ? CSRF::getTokenName() : 'token';
        $submittedToken = $request_data[$csrfTokenName] ?? ($request_data['token'] ?? '');
        
        // Sadece POST isteklerinde veya token gerektiren belirli GET isteklerinde token kontrolü yap
        $isPostRequest = $_SERVER['REQUEST_METHOD'] === 'POST';
        $tokenRequiredActions = ['nvi_tckn_dogrula', 'nvi_ykn_dogrula', 'test_ftp_connection']; // Token gerektiren AJAX actionları

        if ($isPostRequest || in_array($ajax_action, $tokenRequiredActions)) {
            if (!class_exists('WHMCS\Utility\CSRF') || !CSRF::verifyToken($csrfTokenName, $submittedToken)) {
                 if($ajax_action !== 'get_ilceler' && $ajax_action !== 'get_mahalleler' && $ajax_action !== 'search_pop_ssids'){ // Bu GET'ler için token opsiyonel
                    BtkHelper::logAction("AJAX CSRF Hatası ($ajax_action)", 'UYARI', 'Geçersiz/Eksik CSRF token.', $adminId);
                    return ['status' => 'error', 'message' => 'Güvenlik hatası. Lütfen sayfayı yenileyip tekrar deneyin.'];
                 }
            }
        }

        switch ($ajax_action) {
            case 'get_ilceler': $il_id = isset($request_data['il_id']) && is_numeric($request_data['il_id']) ? (int)$request_data['il_id'] : 0; $response = ['status' => 'success', 'data' => BtkHelper::getIlcelerByIlId($il_id)]; break;
            case 'get_mahalleler': $ilce_id = isset($request_data['ilce_id']) && is_numeric($request_data['ilce_id']) ? (int)$request_data['ilce_id'] : 0; $response = ['status' => 'success', 'data' => BtkHelper::getMahallelerByIlceId($ilce_id)]; break;
            case 'search_pop_ssids': $term = isset($request_data['term']) ? trim($request_data['term']) : ''; $filter_by = isset($request_data['filter_by']) ? trim($request_data['filter_by']) : null; $filter_value = isset($request_data['filter_value']) ? trim($request_data['filter_value']) : null; $data = BtkHelper::searchPopSSIDs($term, $filter_by, $filter_value); $select2Data = []; if(is_array($data)){ foreach($data as $item){ $id_key = isset($item['id']) ? 'id' : (isset($item->id) ? 'id' : null); $ssid_key = isset($item['yayin_yapilan_ssid']) ? 'yayin_yapilan_ssid' : (isset($item->yayin_yapilan_ssid) ? 'yayin_yapilan_ssid' : null); $pop_adi_key = isset($item['pop_adi']) ? 'pop_adi' : (isset($item->pop_adi) ? 'pop_adi' : null); if ($id_key && $ssid_key) { $select2Data[] = ['id' => is_object($item) ? $item->$id_key : $item[$id_key], 'text' => (is_object($item) ? $item->$ssid_key : $item[$ssid_key]) . ($pop_adi_key && !empty(is_object($item) ? $item->$pop_adi_key : $item[$pop_adi_key]) ? ' (' . (is_object($item) ? $item->$pop_adi_key : $item[$pop_adi_key]) . ')' : '')]; }}} $response = ['status' => 'success', 'results' => $select2Data]; break;
            case 'nvi_tckn_dogrula': if (!class_exists('NviSoapClient')) { $response = ['success' => false, 'message' => 'NVI Servis istemcisi yüklenemedi.']; break; } $nviClient = new NviSoapClient(); $result = $nviClient->TCKimlikNoDogrula($request_data['tckn'] ?? '', $request_data['ad'] ?? '', $request_data['soyad'] ?? '', (int)($request_data['dogum_yili_nvi'] ?? 0)); $response = ['success' => $result, 'message' => $nviClient->getLastErrorMessageForUser(), 'nvi_status' => $result ? 'Dogrulandi' : ($nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi')]; BtkHelper::logAction('AJAX: NVI TCKN Doğrulama', $result ? 'BİLGİ' : 'UYARI', ($response['message'] ?? '') . ($nviClient->getLastError() ? ' Detay: '.$nviClient->getLastError() : ''), $adminId, ['tckn_prefix' => substr($request_data['tckn'] ?? '', 0, 5)]); break;
            case 'nvi_ykn_dogrula':  if (!class_exists('NviSoapClient')) { $response = ['success' => false, 'message' => 'NVI Servis istemcisi yüklenemedi.']; break; } $nviClient = new NviSoapClient(); $result = $nviClient->YabanciKimlikNoDogrula($request_data['ykn'] ?? '', $request_data['ad'] ?? '', $request_data['soyad'] ?? '', (int)($request_data['dogum_gun'] ?? 0), (int)($request_data['dogum_ay'] ?? 0), (int)($request_data['dogum_yil'] ?? 0)); $response = ['success' => $result, 'message' => $nviClient->getLastErrorMessageForUser(), 'nvi_status' => $result ? 'Dogrulandi' : ($nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi')]; BtkHelper::logAction('AJAX: NVI YKN Doğrulama', $result ? 'BİLGİ' : 'UYARI', ($response['message'] ?? '') . ($nviClient->getLastError() ? ' Detay: '.$nviClient->getLastError() : ''), $adminId, ['ykn_prefix' => substr($request_data['ykn'] ?? '', 0, 5)]); break;
            case 'test_ftp_connection': if ($_SERVER['REQUEST_METHOD'] === 'POST') { $ftpType = $request_data['ftp_type'] ?? 'main'; $host = trim($request_data['host'] ?? ''); $user = trim($request_data['user'] ?? ''); $passInput = trim($request_data['pass'] ?? ''); $port = isset($request_data['port']) && is_numeric($request_data['port']) ? (int)$request_data['port'] : 21; $ssl = isset($request_data['ssl']) && $request_data['ssl'] === '1'; if (empty($host) || empty($user)) { $response = ['status' => 'error', 'message' => ($LANG['ftpHostUserRequiredForTest'] ?? 'Test için Host ve Kullanıcı Adı gereklidir.')]; break; } $result = BtkHelper::testFtpConnectionWithDetails($host, $user, $passInput, $port, $ssl, ucfirst($ftpType)); BtkHelper::logAction(ucfirst($ftpType) . ' FTP Bağlantı Test Sonucu (AJAX)', $result['status'] === 'success' ? 'BİLGİ' : 'UYARI', $result['message'], $adminId, ['host' => $host]); $response = $result; } else { $response = ['status' => 'error', 'message' => 'Geçersiz istek yöntemi.']; } break;
        }
    } catch (Exception $e) { 
        BtkHelper::logAction("AJAX Genel Hata ($ajax_action)", 'HATA', $e->getMessage(), $adminId, ['request_data_keys' => array_keys($request_data), 'trace' => $e->getTraceAsString()]);
        $response = ['status' => 'error', 'message' => 'Sunucu tarafında bir hata oluştu. Lütfen logları kontrol edin.']; 
    }
    return $response;
}

?>