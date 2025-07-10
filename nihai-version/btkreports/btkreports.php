<?php
/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 * Sürüm: 7.2.5 (Operatör - Kritik Hata Düzeltmeleri)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2.5
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

require_once __DIR__ . '/vendor/autoload.php';

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;
use BtkReports\Factory\BtkRaporFactory;
use BtkReports\Manager\FtpManager;
use BtkReports\Verifier\IdentityVerificationManager;

/**
 * CSRF token'ı oluşturur ve doğrular, eski/yeni WHMCS sürümleriyle uyumlu çalışır.
 * Session sorunlarını ele almak için iyileştirildi.
 */
class BtkreportsCsrfHelper
{
    public static function getTokenName() {
        return class_exists('\WHMCS\Utility\CSRF') ? \WHMCS\Utility\CSRF::getTokenName() : 'token';
    }

    public static function generateToken() {
        // Oturumun başlamadığından emin olun (WHMCS genellikle kendisi halleder ama garanti için)
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (class_exists('\WHMCS\Utility\CSRF')) {
            return \WHMCS\Utility\CSRF::generateToken();
        }
        if (!isset($_SESSION['btk_legacy_token'])) {
            $_SESSION['btk_legacy_token'] = sha1(uniqid(mt_rand(), true));
        }
        return $_SESSION['btk_legacy_token'];
    }

    public static function verify() {
        // Oturumun başladığından emin olun
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (class_exists('\WHMCS\Utility\CSRF')) {
            try {
                \WHMCS\Utility\CSRF::verify();
            } catch (\Exception $e) {
                // CSRF doğrulaması başarısız olursa, özel bir hata mesajı göster
                BtkHelper::logAction('CSRF Doğrulama Hatası', 'UYARI', 'WHMCS CSRF doğrulama başarısız oldu.', BtkHelper::getCurrentAdminId(), ['Exception' => $e->getMessage()]);
                die('Invalid Token');
            }
        } else {
            $tokenName = self::getTokenName();
            $submittedToken = $_REQUEST[$tokenName] ?? '';
            $expectedToken = $_SESSION['btk_legacy_token'] ?? '';

            // Token karşılaştırması ve doğrulama
            if (empty($submittedToken) || empty($expectedToken) || !hash_equals($expectedToken, $submittedToken)) {
                BtkHelper::logAction('CSRF Doğrulama Hatası', 'UYARI', 'Eski CSRF doğrulama başarısız oldu.', BtkHelper::getCurrentAdminId(), ['Submitted' => $submittedToken, 'Expected' => $expectedToken]);
                die('Invalid Token');
            }
            // Başarılı doğrulama sonrası legacy token'ı temizle
            unset($_SESSION['btk_legacy_token']);
        }
    }
}

/**
 * Modül yapılandırma fonksiyonu.
 */
function btkreports_config() {
    return [
        'name' => 'BTK Raporlama Modülü',
        'description' => 'BTK yasal raporlama yükümlülükleri ve operasyonel izleme için gelişmiş WHMCS eklentisi.',
        'version' => '7.2.5', // Sürüm güncellendi
        'author' => 'KablosuzOnline & Gemini AI',
        'fields' => []
    ];
}

function btkreports_activate() {
    try {
        $sqlInstallFile = __DIR__ . '/sql/install.sql';
        if (file_exists($sqlInstallFile)) {
            BtkHelper::executeSqlFile($sqlInstallFile);
        } else {
            return ['status' => 'error', 'description' => 'Kurulum SQL dosyası (install.sql) bulunamadı.'];
        }

        $sqlInitialDataFile = __DIR__ . '/sql/initial_reference_data.sql';
        if (file_exists($sqlInitialDataFile)) {
            BtkHelper::executeSqlFile($sqlInitialDataFile);
        }

        $tempDir = BtkHelper::getModuleTempPath();
        if (!is_dir($tempDir)) {
            if (!@mkdir($tempDir, 0755, true)) {
                BtkHelper::logAction('Modül Aktivasyonu', 'HATA', "Güvenli temp klasörü ({$tempDir}) oluşturulamadı. Lütfen manuel oluşturup yazma izni verin.");
                return ['status' => 'error', 'description' => "Modülün temp klasörü ({$tempDir}) oluşturulamadı. Lütfen manuel oluşturup 0755 izni verin."];
            }
        }

        $htaccessPath = $tempDir . DIRECTORY_SEPARATOR . '.htaccess';
        if (!file_exists($htaccessPath)) {
            $htaccessContent = "Options -Indexes\n<Files *>\n    Order deny,allow\n    Deny from all\n</Files>";
            if (@file_put_contents($htaccessPath, $htaccessContent) === false) {
                BtkHelper::logAction('Modül Aktivasyonu', 'UYARI', ".htaccess dosyası ({$htaccessPath}) oluşturulamadı. Güvenlik riski olabilir.");
            }
        }

        if (!is_writable($tempDir)) {
             BtkHelper::logAction('Modül Aktivasyonu', 'HATA', "Güvenli temp klasörü ({$tempDir}) yazılabilir değil! Rapor oluşturma işlemleri başarısız olabilir.");
             return ['status' => 'error', 'description' => "Modülün temp klasörü ({$tempDir}) yazılabilir değil. Lütfen izinleri kontrol edin."];
        }
        
        BtkHelper::syncAllAdminsToPersonel();
        BtkHelper::logAction('Modül Aktivasyonu', 'BAŞARILI', 'BTK Raporlama Modülü başarıyla etkinleştirildi.');

        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi. Lütfen modül ayarlarını yapılandırın.'];
    } catch (Exception $e) {
        $errorMessage = 'Modül etkinleştirilirken hata oluştu: ' . $e->getMessage();
        BtkHelper::logAction('Modül Aktivasyonu', 'KRITIK', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

function btkreports_deactivate() {
    try {
        if (BtkHelper::get_btk_setting('delete_data_on_deactivate', '0') === '1') {
            BtkHelper::dropAllTables();
            BtkHelper::deleteDirectory(BtkHelper::getModuleTempPath());
            
            BtkHelper::logAction('Modül Deaktivasyonu', 'BAŞARILI', 'Tüm veriler ve temp klasörü silindi.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve tüm verileri/klasörleri silindi.'];
        }
        BtkHelper::logAction('Modül Deaktivasyonu', 'BAŞARILI', 'Veriler korundu.');
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veriler korundu.'];
    } catch (Exception $e) {
        $errorMessage = 'Modül devre dışı bırakılırken hata oluştu: ' . $e->getMessage();
        BtkHelper::logAction('Modül Deaktivasyonu', 'HATA', $errorMessage, null, ['trace' => $e->getTraceAsString()]);
        return ['status' => 'error', 'description' => $errorMessage];
    }
}

function btkreports_output($vars) {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    $modulelink = $vars['modulelink'];
    $action = isset($_REQUEST['action']) ? preg_replace("/[^a-zA-Z0-9_]/", "", trim($_REQUEST['action'])) : 'index';
    $LANG = BtkHelper::loadLang();
    $adminId = BtkHelper::getCurrentAdminId();

    $smarty = new Smarty();
    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('LANG', $LANG);
    $smarty->assign('assets_url', '../modules/addons/btkreports/assets');
    $smarty->assign('module_version', btkreports_config()['version']);
    
    $smarty->assign('csrfToken', BtkreportsCsrfHelper::generateToken());
    $smarty->assign('csrfTokenName', BtkreportsCsrfHelper::getTokenName());

    $menuItems = [
        'index' => ['label' => $LANG['dashboardPageTitle'] ?? 'Ana Sayfa', 'icon' => 'fas fa-tachometer-alt'],
        'config' => ['label' => $LANG['configPageTitle'] ?? 'Genel Ayarlar', 'icon' => 'fas fa-cogs'],
        'product_group_mappings' => ['label' => $LANG['productGroupMappingsPageTitle'] ?? 'Ürün Grubu Eşleştirme', 'icon' => 'fas fa-link'],
        'personel' => ['label' => $LANG['personelPageTitle'] ?? 'Personel Yönetimi', 'icon' => 'fas fa-users'],
        'isspop' => ['label' => $LANG['issPopManagementPageTitle'] ?? 'ISS POP Yönetimi', 'icon' => 'fas fa-broadcast-tower'],
        'generatereports' => ['label' => $LANG['generateReportsPageTitle'] ?? 'Manuel Raporlar', 'icon' => 'fas fa-rocket'],
        'viewlogs' => ['label' => $LANG['viewLogsPageTitle'] ?? 'Günlük Kayıtları', 'icon' => 'fas fa-history'],
    ];
    $smarty->assign('btkModuleMenuItems', $menuItems);
    $smarty->assign('currentModulePageAction', $action);

    echo '<div id="btkReportsModuleContainer" class="btk-module-container">';
    try {
        echo $smarty->fetch(__DIR__ . '/templates/admin/shared/admin_header_menu.tpl');
    } catch (\SmartyException $e) { BtkHelper::logAction('Smarty Hatası (Menu)', 'HATA', $e->getMessage(), $adminId); echo '<div class="alert alert-danger">Modül menüsü yüklenirken hata.</div>'; }

    if (isset($_SESSION['BtkReportsFlashMessage'])) {
        $smarty->assign('flashMessage', $_SESSION['BtkReportsFlashMessage']);
        unset($_SESSION['BtkReportsFlashMessage']);
    }

    $templateFile = 'index.tpl';
    
    switch ($action) {
        case 'config': btk_page_config($smarty, $LANG); $templateFile = 'config.tpl'; break;
        case 'save_config': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_save_config($_POST, $LANG); } header("Location: " . $modulelink . "&action=config"); exit;
        
        case 'product_group_mappings': btk_page_product_group_mappings($smarty, $LANG); $templateFile = 'product_group_mappings.tpl'; break;
        case 'save_product_group_mappings': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_save_product_group_mappings($_POST, $LANG); } header("Location: " . $modulelink . "&action=product_group_mappings"); exit;
        
        case 'personel': btk_page_personel($smarty, $_GET, $LANG); $templateFile = 'personel.tpl'; break;
        case 'save_single_personel': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_save_single_personel($_POST, $LANG); } header("Location: " . $modulelink . "&action=personel"); exit;
        case 'delete_personel': BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_personel((int)($_REQUEST['id'] ?? 0), $LANG); header("Location: " . $modulelink . "&action=personel"); exit;
        case 'export_personel_excel': BtkreportsCsrfHelper::verify(); btk_action_export_excel('PERSONEL', $LANG, $modulelink); exit;
        
        case 'isspop': btk_page_isspop($smarty, $_GET, $LANG); $templateFile = 'iss_pop_management.tpl'; break;
        case 'save_pop_definition': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_save_pop_definition($_POST, $LANG); } header("Location: " . $modulelink . "&action=isspop"); exit;
        case 'delete_pop_definition': BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_pop_definition((int)($_REQUEST['pop_id'] ?? 0), $LANG); header("Location: " . $modulelink . "&action=isspop"); exit;
        
        case 'generatereports': btk_page_generate_reports($smarty, $LANG); $templateFile = 'generate_reports.tpl'; break;
        case 'do_generate_report': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); header('Content-Type: application/json; charset=utf-8'); echo json_encode(btk_action_do_generate_report($_POST, $LANG)); exit; } header("Location: " . $modulelink . "&action=generatereports"); exit;
        
        case 'viewlogs': btk_page_view_logs($smarty, $_GET, $LANG); $templateFile = 'view_logs.tpl'; break;
        case 'delete_all_logs': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $_SESSION['BtkReportsFlashMessage'] = btk_action_delete_all_logs($LANG); } header("Location: " . $modulelink . "&action=viewlogs"); exit;
        
        case 'get_ilceler': case 'get_mahalleler': case 'get_pop_details': case 'get_personel_details': case 'toggle_pop_monitoring': case 'test_ftp_connection': case 'validate_tckn_personel':
            BtkreportsCsrfHelper::verify(); header('Content-Type: application/json; charset=utf-8'); echo json_encode(btk_handle_ajax_requests($action, $_REQUEST, $LANG)); exit;
        case 'download_file': BtkreportsCsrfHelper::verify(); btk_handle_ajax_requests($action, $_REQUEST, $LANG); exit;
        
        case 'index': default: btk_page_index($smarty, $LANG); $templateFile = 'index.tpl'; break;
    }

    if (isset($templateFile) && file_exists(__DIR__ . '/templates/admin/' . $templateFile)) {
        try { echo $smarty->fetch(__DIR__ . '/templates/admin/' . $templateFile); } 
        catch (\SmartyException $e) { BtkHelper::logAction('Smarty Hatası', 'HATA', $e->getMessage() . ' Şablon: ' . $templateFile, $adminId); echo '<div class="alert alert-danger">Şablon yükleme hatası oluştu.</div>'; }
    }
    echo '</div>';
}

// =================================================================================
// == SAYFA İÇERİĞİ HAZIRLAMA FONKSİYONLARI (PAGE HANDLERS) - stdClass HATALARI GİDERİLDİ
// =================================================================================

function btk_page_index(&$smarty, $LANG) {
    $smarty->assign('page_title', $LANG['dashboardPageTitle'] ?? 'Ana Sayfa');
    $settings = BtkHelper::getAllBtkSettings();
    $smarty->assign('settings', $settings);
    
    $ftpManager = new FtpManager($settings);
    $smarty->assign('ftp_main_status', $ftpManager->testConnection('main'));
    $smarty->assign('ftp_backup_status', $ftpManager->testConnection('backup'));

    $smarty->assign('last_submissions', BtkHelper::getLastSubmissions());
    $smarty->assign('aktif_yetki_gruplari_for_index', BtkHelper::getAktifYetkiTurleri('array_grup_names_only'));

    $smarty->assign('next_cron_runs', BtkHelper::getNextCronRuns($settings));

    if (!empty($settings['pop_monitoring_enabled']) && $settings['pop_monitoring_enabled'] === '1') {
        $smarty->assign('monitoring_stats', BtkHelper::getMonitoringStats());
    }
}

function btk_page_config(&$smarty, $LANG) {
    $smarty->assign('page_title', $LANG['configPageTitle'] ?? 'Genel Ayarlar');
    $settings = BtkHelper::getAllBtkSettings();
    if (!empty($settings['main_ftp_pass'])) $settings['main_ftp_pass'] = '********';
    if (!empty($settings['backup_ftp_pass'])) $settings['backup_ftp_pass'] = '********';
    $smarty->assign('settings', $settings);
    $smarty->assign('yetki_turleri', BtkHelper::getAllYetkiTurleriWithStatus());
}

function btk_page_product_group_mappings(&$smarty, $LANG) {
    $smarty->assign('page_title', $LANG['productGroupMappingsPageTitle'] ?? 'Ürün Grubu Eşleştirme');
    $smarty->assign('productGroups', BtkHelper::getWhmcsProductGroups()); // Artık gizliler de dahil ve array
    $smarty->assign('activeBtkAuthTypes', BtkHelper::getAktifYetkiTurleri('object_list')); // Hala object, Smarty'de problem yok
    $smarty->assign('allEk3HizmetTipleri', BtkHelper::getAllEk3HizmetTipleri());
    $smarty->assign('allEk3HizmetTipleriJson', json_encode(BtkHelper::getAllEk3HizmetTipleri(), JSON_UNESCAPED_UNICODE));
    $smarty->assign('currentMappings', BtkHelper::getProductGroupMappingsArray());
}

function btk_page_personel(&$smarty, $request, $LANG) {
    $smarty->assign('page_title', $LANG['personelPageTitle'] ?? 'Personel Yönetimi');
    $personelResult = BtkHelper::getPersonelListWithPagination($request);
    $smarty->assign('personelListesi', $personelResult['data']);
    $smarty->assign('pagination_output', $personelResult['pagination']);
    $smarty->assign('departmanlar', BtkHelper::getDepartmanList());
}

function btk_page_isspop(&$smarty, $request, $LANG) {
    $smarty->assign('page_title', $LANG['issPopManagementPageTitle'] ?? 'ISS POP Yönetimi');
    $popResult = BtkHelper::getIssPopNoktalariListWithPagination($request);
    $smarty->assign('popDefinitions', $popResult['data']);
    $smarty->assign('pagination_output', $popResult['pagination']);
    $smarty->assign('iller', BtkHelper::getIller());
    $smarty->assign('monitoring_enabled', BtkHelper::get_btk_setting('pop_monitoring_enabled', '0') === '1');
}

function btk_page_generate_reports(&$smarty, $LANG) {
    $smarty->assign('page_title', $LANG['generateReportsPageTitle'] ?? 'Manuel Rapor Oluşturma');
    $smarty->assign('activeBtkAuthTypesForReports', BtkHelper::getAktifYetkiTurleri('object_list'));
    $smarty->assign('settings', BtkHelper::getAllBtkSettings());
}

function btk_page_view_logs(&$smarty, $request, $LANG) {
    $smarty->assign('page_title', $LANG['viewLogsPageTitle'] ?? 'Günlük Kayıtları');
    $logResult = BtkHelper::getLogsWithPagination($request);
    $smarty->assign('logs', $logResult); // Data ve pagination bu array içinde gelecek
    $smarty->assign('filter', $request);
}

// =================================================================================
// == ACTION FONKSİYONLARI (ACTION HANDLERS) - stdClass HATALARI GİDERİLDİ
// =================================================================================

function btk_action_save_config($postData, $LANG) {
    try {
        BtkHelper::saveAllSettings($postData);
        BtkHelper::saveSeciliYetkiTurleri($postData['yetkiler'] ?? []);
        BtkHelper::logAction('Ayarlar Kaydedildi', 'BAŞARILI', 'Modül ayarları güncellendi.', BtkHelper::getCurrentAdminId());
        return ['type' => 'success', 'message' => $LANG['configSaveSuccess'] ?? 'Ayarlar başarıyla kaydedildi.'];
    } catch (Exception $e) {
        BtkHelper::logAction('Ayar Kaydetme Hatası', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId());
        return ['type' => 'error', 'message' => 'Hata: ' . $e->getMessage()];
    }
}

function btk_action_save_product_group_mappings($postData, $LANG) {
    $result = BtkHelper::saveProductGroupMappings($postData['mappings'] ?? []);
    if ($result) {
        return ['type' => 'success', 'message' => $LANG['mappingsSaveSuccess'] ?? 'Eşleştirmeler başarıyla kaydedildi.'];
    }
    return ['type' => 'error', 'message' => $LANG['mappingsSaveError'] ?? 'Eşleştirmeler kaydedilirken bir hata oluştu.'];
}

function btk_action_save_single_personel($postData, $LANG) {
    return BtkHelper::savePersonel($postData['modal_personel_data'] ?? [], $LANG);
}

function btk_action_delete_personel($personelId, $LANG) {
    return BtkHelper::deletePersonel($personelId, $LANG);
}

function btk_action_export_excel($reportType, $LANG, $modulelink) {
    try {
        $settings = BtkHelper::getAllBtkSettings();
        $ftpManager = new FtpManager($settings);
        $rapor = BtkRaporFactory::create(strtoupper($reportType), $settings, $ftpManager);
        $rapor->olusturVeIndir(true);
    } catch (Exception $e) {
        $_SESSION['BtkReportsFlashMessage'] = ['type' => 'error', 'message' => 'Excel Dışa Aktarma Hatası: ' . $e->getMessage()];
        header("Location: " . $modulelink . '&action=personel');
        exit;
    }
}

function btk_action_save_pop_definition($postData, $LANG) {
    return BtkHelper::saveIssPopNoktasi($postData['popdata'] ?? [], $LANG);
}

function btk_action_delete_pop_definition($popId, $LANG) {
    return BtkHelper::deleteIssPopNoktasi($popId, $LANG);
}

function btk_action_do_generate_report($postData, $LANG) {
    $reportType = $postData['report_type'] ?? null;
    $yetkiKodu = $postData['yetki_tipi_kodu'] ?? null;
    $action = $postData['generation_action'] ?? 'generate_only';
    
    try {
        if (empty($reportType)) {
            throw new Exception($LANG['reportTypeRequired'] ?? 'Rapor türü seçilmelidir.');
        }
        $settings = BtkHelper::getAllBtkSettings();
        $ftpManager = new FtpManager($settings);
        $yetkiGrup = !empty($yetkiKodu) ? BtkHelper::getGrupByYetkiKodu($yetkiKodu) : null;
        if (strtoupper($reportType) !== 'PERSONEL' && !$yetkiGrup) {
            throw new Exception($LANG['yetkiKoduRequiredForReport'] ?? 'Rapor için Yetki Grubu bulunamadı.');
        }
        
        $rapor = BtkRaporFactory::create($reportType, $settings, $ftpManager, $yetkiGrup);
        
        if ($action === 'generate_only') {
            return $rapor->olusturVeIndir(false);
        } else {
            $ftpType = ($action === 'send_main') ? 'main' : 'backup';
            return $rapor->olusturVeGonder($ftpType);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Manuel Rapor Oluşturma Hatası', 'HATA', $e->getMessage());
        return ['status' => 'error', 'message' => 'Hata: ' . $e->getMessage()];
    }
}

function btk_action_delete_all_logs($LANG) {
    return BtkHelper::deleteAllLogs($LANG);
}

function btk_handle_ajax_requests($ajax_action, $request_data, $LANG) {
    try {
        BtkreportsCsrfHelper::verify();

        switch ($ajax_action) {
            case 'get_ilceler':
                return ['status' => 'success', 'items' => BtkHelper::getIlcelerByIlId((int)($request_data['parent_id'] ?? 0))];
            case 'get_mahalleler':
                return ['status' => 'success', 'items' => BtkHelper::getMahallelerByIlceId((int)($request_data['parent_id'] ?? 0))];
            case 'get_pop_details':
                return ['status' => 'success', 'data' => BtkHelper::getIssPopNoktasiById((int)($request_data['id'] ?? 0))];
            case 'get_personel_details':
                return ['status' => 'success', 'data' => BtkHelper::getPersonelById((int)($request_data['id'] ?? 0))];
            case 'toggle_pop_monitoring':
                return BtkHelper::togglePopMonitoringStatus((int)($request_data['id'] ?? 0), $request_data['status'] === 'true');
            case 'test_ftp_connection':
                $ftpSettings = [
                    'main_ftp_host' => $request_data['host'] ?? '',
                    'main_ftp_user' => $request_data['user'] ?? '',
                    'main_ftp_pass' => $request_data['pass'] ?? '',
                    'main_ftp_port' => $request_data['port'] ?? 21,
                    'main_ftp_ssl' => ($request_data['ssl'] ?? '0') === '1' ? '1' : '0',
                    'backup_ftp_host' => $request_data['host'] ?? '',
                    'backup_ftp_user' => $request_data['user'] ?? '',
                    'backup_ftp_pass' => $request_data['pass'] ?? '',
                    'backup_ftp_port' => $request_data['port'] ?? 21,
                    'backup_ftp_ssl' => ($request_data['ssl'] ?? '0') === '1' ? '1' : '0',
                    'backup_ftp_enabled' => '1' // Test sırasında yedek FTP'yi etkin say
                ];
                $ftpManager = new FtpManager($ftpSettings);
                return $ftpManager->testConnection($request_data['ftp_type'] ?? 'main');
            case 'validate_tckn_personel':
                $isEnabled = BtkHelper::get_btk_setting('personel_nvi_verification_enabled', '0') === '1';
                $manager = new IdentityVerificationManager('nvi_soap', $isEnabled);
                $dataToVerify = [
                    'tckn' => $request_data['tckn'] ?? '',
                    'ad' => $request_data['ad'] ?? '',
                    'soyad' => $request_data['soyad'] ?? '',
                    'dogum_yili' => $request_data['dogum_yili'] ?? ''
                ];
                $result = $manager->execute($dataToVerify);
                return ['status' => $result->isSuccess ? 'success' : 'error', 'message' => $result->message];
            case 'download_file':
                BtkHelper::downloadTempFile($request_data['file'] ?? null);
                exit;
            default:
                return ['status' => 'error', 'message' => 'Bilinmeyen AJAX isteği.'];
        }
    } catch (Exception $e) {
        BtkHelper::logAction("AJAX Hatası ($ajax_action)", 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId());
        return ['status' => 'error', 'message' => 'Sunucu tarafında bir hata oluştu: ' . $e->getMessage()];
    }
}