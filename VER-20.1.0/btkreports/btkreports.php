<?php
/**
 * WHMCS BTK Raporlama Modülü - Ana Modül Dosyası
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
 *
 * ANKA-PHOENIX Sürüm Notları (Anayasal Uyum):
 * - `btkreports_handle_ajax_request` fonksiyonu, onarılan ve yeni eklenen
 *   tüm AJAX eylemlerini (`generate_cevher_report`, `generate_muhasebe_report`,
 *   'test_ftp_connection' anlık veri ile) yönetecek şekilde güncellendi.
 * - Hata veren `PageManager` çağrıları, ilgili Manager sınıflarındaki
 *   doğru fonksiyonlara yönlendirildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

date_default_timezone_set('Europe/Istanbul');

require_once __DIR__ . '/vendor/autoload.php';

use BtkReports\Helper\BtkHelper;
use BtkReports\Manager\ConfigManager;
use BtkReports\Manager\DataManager;
use BtkReports\Manager\FtpManager;
use BtkReports\Manager\PageManager;
use BtkReports\Manager\PersonelManager;
use BtkReports\Manager\PopManager;
use BtkReports\Manager\RaporManager;
use BtkReports\Manager\ESozlesmeManager;
use BtkReports\Manager\EFaturaManager;
use BtkReports\Manager\CevherManager;
use BtkReports\Manager\LogManager;
use BtkReports\Verifier\IdentityVerificationManager;
use BtkReports\Rapor\CevherRaporlari;
use BtkReports\Rapor\MaliRapor;

class BtkreportsCsrfHelper
{
    public static function getTokenName(): string { return class_exists('\WHMCS\Utility\CSRF') ? \WHMCS\Utility\CSRF::getTokenName() : 'token'; }
    public static function generateToken(): string { if (class_exists('\WHMCS\Utility\CSRF')) { return \WHMCS\Utility\CSRF::generateToken(); } if (!isset($_SESSION['btk_legacy_token'])) { $_SESSION['btk_legacy_token'] = sha1(uniqid(mt_rand(), true)); } return $_SESSION['btk_legacy_token']; }
    public static function verify(): void { if (class_exists('\WHMCS\Utility\CSRF')) { try { \WHMCS\Utility\CSRF::verify(); } catch (\Exception $e) { die('Invalid Token'); } } else { $tokenName = self::getTokenName(); $submittedToken = $_REQUEST[$tokenName] ?? ''; if (empty($submittedToken) || !isset($_SESSION['btk_legacy_token']) || !hash_equals($_SESSION['btk_legacy_token'], $submittedToken)) { die('Invalid Token'); } } }
}

function btkreports_config()
{
    return [
        'name' => 'BTK Raporlama Modülü',
        'description' => 'BTK, CEVHER, E-Fatura ve NVI KPS entegrasyonlarını barındıran tam kapsamlı bir platform.',
        'version' => '20.1.0',
        'author' => 'KablosuzOnline & Gemini AI',
        'fields' => []
    ];
}

function btkreports_activate()
{
    try {
        BtkHelper::executeSqlFile(__DIR__ . '/sql/install.sql');
        BtkHelper::executeSqlFile(__DIR__ . '/sql/initial_reference_data.sql');
        BtkHelper::ensureTempDirectoryExists();
        PersonelManager::syncAllAdminsToPersonel();
        LogManager::logAction('Modül Aktivasyonu', 'INFO', 'BTK Raporlama Modülü v20.1.0 başarıyla etkinleştirildi.');
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü başarıyla etkinleştirildi. Lütfen modül ayarlarını yapılandırın.'];
    } catch (Exception $e) {
        return ['status' => 'error', 'description' => 'Modül etkinleştirilirken kritik bir hata oluştu: ' . $e->getMessage()];
    }
}

function btkreports_deactivate()
{
    try {
        if (BtkHelper::get_btk_setting('delete_data_on_deactivate', '0') === '1') {
            BtkHelper::dropAllTables();
            BtkHelper::deleteDirectory(BtkHelper::getModuleTempPath());
            LogManager::logAction('Modül Deaktivasyonu', 'INFO', 'Tüm veriler ve temp klasörü silindi.');
            return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı ve tüm verileri silindi.'];
        }
        LogManager::logAction('Modül Deaktivasyonu', 'INFO', 'Veriler korundu.');
        return ['status' => 'success', 'description' => 'BTK Raporlama Modülü devre dışı bırakıldı. Veriler korundu.'];
    } catch (Exception $e) {
        return ['status' => 'error', 'description' => 'Modül devre dışı bırakılırken hata oluştu: ' . $e->getMessage()];
    }
}

function btkreports_output($vars)
{
    $modulelink = $vars['modulelink'];
    $LANG = BtkHelper::loadLang();
    $action = $_REQUEST['action'] ?? 'index';

    if (isset($_REQUEST['btk_ajax_action'])) {
        BtkreportsCsrfHelper::verify();
        header('Content-Type: application/json; charset=utf-8');
        $response = btkreports_handle_ajax_request($_REQUEST, $LANG);
        $response['new_token'] = BtkreportsCsrfHelper::generateToken();
        echo json_encode($response);
        exit;
    }

    if (isset($_REQUEST['direct_action'])) {
        BtkreportsCsrfHelper::verify();
        btkreports_handle_direct_action($_REQUEST, $LANG);
        exit;
    }
    
    $smarty = new Smarty();
    $smarty->assign('modulelink', $modulelink);
    $smarty->assign('LANG', $LANG);
    $smarty->assign('assets_url', '../modules/addons/btkreports/assets');
    $smarty->assign('module_version', btkreports_config()['version']);
    $smarty->assign('csrfToken', BtkreportsCsrfHelper::generateToken());
    $smarty->assign('csrfTokenName', BtkreportsCsrfHelper::getTokenName());

    $menuItems = [
        'index' => ['label' => $LANG['dashboardPageTitle'], 'icon' => 'fas fa-tachometer-alt'],
        'config' => ['label' => $LANG['configPageTitle'], 'icon' => 'fas fa-cogs'],
        'efatura_config' => ['label' => $LANG['efaturaConfigPageTitle'], 'icon' => 'fas fa-file-invoice-dollar'],
        'efatura_invoices' => ['label' => $LANG['efaturaInvoicesPageTitle'], 'icon' => 'fas fa-file-invoice'],
        'product_group_mappings' => ['label' => $LANG['productGroupMappingsPageTitle'], 'icon' => 'fas fa-link'],
        'personel' => ['label' => $LANG['personelPageTitle'], 'icon' => 'fas fa-users'],
        'isspop' => ['label' => $LANG['issPopManagementPageTitle'], 'icon' => 'fas fa-broadcast-tower'],
        'data_management' => ['label' => $LANG['dataManagementPageTitle'], 'icon' => 'fas fa-database'],
        'generatereports' => ['label' => $LANG['generateReportsPageTitle'], 'icon' => 'fas fa-rocket'],
        'cevher_reports' => ['label' => $LANG['cevherReportsTitle'], 'icon' => 'fas fa-gem'],
    ];
    if (BtkHelper::isBtkEkayitTestMode()) {
        $menuItems['esozlesme_test_scenarios'] = ['label' => $LANG['eSozlesmeTestSenaryoTitle'], 'icon' => 'fas fa-vial'];
    }
    $menuItems['esozlesme_basvurular'] = ['label' => $LANG['eSozlesmeBasvurularTitle'], 'icon' => 'fas fa-file-signature'];
    $menuItems['viewlogs'] = ['label' => $LANG['viewLogsPageTitle'], 'icon' => 'fas fa-history'];
    $smarty->assign('btkModuleMenuItems', $menuItems);
    
    $smarty->assign('currentModulePageAction', $action);
    echo '<div id="btkReportsModuleContainer" class="btk-module-container">';
    echo $smarty->fetch(__DIR__ . '/templates/admin/shared/admin_header_menu.tpl');

    if (isset($_SESSION['BtkReportsFlashMessage'])) {
        $smarty->assign('flashMessage', $_SESSION['BtkReportsFlashMessage']);
        unset($_SESSION['BtkReportsFlashMessage']);
    }

    $templateFile = 'index.tpl';
    
    switch ($action) {
        case 'index': PageManager::prepareIndexPage($smarty, $LANG); $templateFile = 'index.tpl'; break;
        case 'config': PageManager::prepareConfigPage($smarty, $LANG); $templateFile = 'config.tpl'; break;
        case 'efatura_config': PageManager::prepareEFaturaConfigPage($smarty, $LANG); $templateFile = 'efatura_config.tpl'; break;
        case 'efatura_invoices': PageManager::prepareEFaturaInvoicesPage($smarty, $_GET, $LANG); $templateFile = 'efatura_invoices.tpl'; break;
        case 'product_group_mappings': PageManager::prepareProductGroupMappingsPage($smarty, $LANG); $templateFile = 'product_group_mappings.tpl'; break;
        case 'personel': PageManager::preparePersonelPage($smarty, $_GET, $LANG); $templateFile = 'personel.tpl'; break;
        case 'isspop': PageManager::prepareIssPopPage($smarty, $_GET, $LANG); $templateFile = 'iss_pop_management.tpl'; break;
        case 'data_management': PageManager::prepareDataManagementPage($smarty, $LANG); $templateFile = 'data_management.tpl'; break;
        case 'generatereports': PageManager::prepareGenerateReportsPage($smarty, $LANG); $templateFile = 'generate_reports.tpl'; break;
        case 'cevher_reports': PageManager::prepareCevherReportsPage($smarty, $LANG); $templateFile = 'cevher_reports.tpl'; break;
        case 'esozlesme_test_scenarios': PageManager::prepareESozlesmeTestScenariosPage($smarty, $LANG); $templateFile = 'esozlesme_test_scenarios.tpl'; break;
        case 'esozlesme_basvurular': PageManager::prepareESozlesmeBasvurularPage($smarty, $_GET, $LANG); $templateFile = 'esozlesme_basvurular.tpl'; break;
        case 'viewlogs': PageManager::prepareViewLogsPage($smarty, $_GET, $LANG); $templateFile = 'view_logs.tpl'; break;
        
        case 'save_config': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); ConfigManager::saveAllSettings($_POST); ConfigManager::saveSeciliYetkiTurleri($_POST); $_SESSION['BtkReportsFlashMessage'] = ['type' => 'success', 'message' => $LANG['configSaveSuccess']]; } header("Location: {$modulelink}&action=config"); exit;
        case 'save_efatura_config': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); EFaturaManager::saveEFaturaSettings($_POST); $_SESSION['BtkReportsFlashMessage'] = ['type' => 'success', 'message' => $LANG['configSaveSuccess']]; } header("Location: {$modulelink}&action=efatura_config"); exit;
        case 'save_product_group_mappings': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $result = ConfigManager::saveProductGroupMappings($_POST['mappings'] ?? []); $yeniKayitSayisi = ConfigManager::bootstrapInitialRecords(); $_SESSION['BtkReportsFlashMessage'] = $result ? ['type' => 'success', 'message' => $LANG['mappingsSaveSuccess'] . " {$yeniKayitSayisi} yeni abone kaydı oluşturuldu."] : ['type' => 'error', 'message' => $LANG['mappingsSaveError']]; } header("Location: {$modulelink}&action=product_group_mappings"); exit;
        
        case 'rebuild_history_confirmed': BtkreportsCsrfHelper::verify(); set_time_limit(0); ignore_user_abort(true); $_SESSION['BtkReportsFlashMessage'] = RaporManager::rebuildHistoricalData($_REQUEST['milat_tarihi'] ?? '', $LANG); header("Location: {$modulelink}&action=data_management"); exit;
        case 'rebuild_history': if ($_SERVER['REQUEST_METHOD'] === 'POST') { BtkreportsCsrfHelper::verify(); $redirectUrl = 'dialog.php?action=confirmpw&goto=' . urlencode('addonmodules.php?module=btkreports&action=rebuild_history_confirmed&milat_tarihi=' . urlencode($_POST['milat_tarihi'] ?? '')); header("Location: ../" . $redirectUrl); exit; } break;

        default:
            $redirectAction = 'index';
            if (str_contains($action, 'personel')) $redirectAction = 'personel';
            if (str_contains($action, 'pop')) $redirectAction = 'isspop';
            if (str_contains($action, 'logs')) $redirectAction = 'viewlogs';
            if (str_contains($action, 'esozlesme')) $redirectAction = 'esozlesme_test_scenarios';
            if (str_contains($action, 'efatura')) $redirectAction = 'efatura_invoices';
            if (str_contains($action, 'cevher')) $redirectAction = 'cevher_reports';

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                BtkreportsCsrfHelper::verify();
                $message = [];
                switch ($action) {
                    case 'save_single_personel': $message = PersonelManager::savePersonel($_POST['modal_personel_data'] ?? [], $LANG); break;
                    case 'save_pop_definition': $message = PopManager::saveIssPopNoktasi($_POST['popdata'] ?? [], $LANG); break;
                    case 'save_esozlesme_test_scenario': $message = ESozlesmeManager::createTestBasvuru($_POST, $LANG); break;
                    case 'delete_all_logs': $message = LogManager::deleteAllLogs($LANG); break;
                }
                $_SESSION['BtkReportsFlashMessage'] = $message;
            } else { // GET request
                BtkreportsCsrfHelper::verify();
                $message = [];
                 switch ($action) {
                    case 'delete_personel': $message = PersonelManager::deletePersonel((int)($_REQUEST['id'] ?? 0), $LANG); break;
                    case 'delete_pop_definition': $message = PopManager::deleteIssPopNoktasi((int)($_REQUEST['pop_id'] ?? 0), $LANG); break;
                    case 'delete_esozlesme_test_scenario': $message = ESozlesmeManager::deleteTestBasvuru((int)($_REQUEST['id'] ?? 0), $LANG); break;
                    case 'delete_all_esozlesme_test_scenarios': $message = ESozlesmeManager::deleteAllTestBasvurulari($LANG); break;
                }
                $_SESSION['BtkReportsFlashMessage'] = $message;
            }
            header("Location: {$modulelink}&action={$redirectAction}");
            exit;
    }

    echo $smarty->fetch(__DIR__ . '/templates/admin/' . $templateFile);
    echo '</div>';
}

function btkreports_handle_ajax_request($request, $LANG)
{
    $ajaxAction = $request['btk_ajax_action'] ?? '';
    try {
        switch ($ajaxAction) {
            case 'get_ilceler': return ['status' => 'success', 'items' => RaporManager::getIlcelerByIlId((int)($request['parent_id'] ?? 0))];
            case 'get_mahalleler': return ['status' => 'success', 'items' => RaporManager::getMahallelerByIlceId((int)($request['parent_id'] ?? 0))];
            case 'get_pop_details': return ['status' => 'success', 'data' => PopManager::getIssPopNoktasiById((int)($request['id'] ?? 0))];
            case 'get_personel_details': return ['status' => 'success', 'data' => PersonelManager::getPersonelByIdForModal((int)($request['id'] ?? 0))];
            case 'toggle_pop_monitoring': return PopManager::togglePopMonitoringStatus((int)($request['id'] ?? 0), $request['status'] === 'true');
            case 'test_ftp_connection':
                $savedSettings = BtkHelper::getAllBtkSettings();
                $testSettingsFromRequest = $request;
                if (isset($testSettingsFromRequest['pass']) && $testSettingsFromRequest['pass'] === '********') { unset($testSettingsFromRequest['pass']); }
                $finalTestSettings = array_merge($savedSettings, $testSettingsFromRequest);
                $ftpManager = new FtpManager($finalTestSettings);
                return $ftpManager->testConnection($request['ftp_type'] ?? 'main');

            case 'generate_report': return RaporManager::handleGenerateReportAjax($request, $LANG);
            case 'generate_cevher_report': $settings = BtkHelper::getAllBtkSettings(); $rapor = new CevherRaporlari($settings, (int)$request['year'], (int)$request['ceyrek']); return $rapor->olusturVeIndir($request['yetki_grup']);
            case 'generate_muhasebe_report': $dateRange = explode(' to ', $request['date_range']); $settings = BtkHelper::getAllBtkSettings(); $rapor = new MaliRapor($settings, trim($dateRange[0]), trim($dateRange[1])); return $rapor->olusturVeIndir();
            
            case 'load_data_set': return DataManager::loadDataSet($request['set_name'] ?? '', $request);
            case 'verify_nvi_kps': $settings = BtkHelper::getAllBtkSettings(); $verifier = new IdentityVerificationManager($settings); $result = $verifier->execute($request); return ['status' => $result->status, 'message' => $result->message];
            default: return ['status' => 'error', 'message' => 'Bilinmeyen AJAX isteği.'];
        }
    } catch (\Exception $e) {
        LogManager::logAction("AJAX Hatası ({$ajaxAction})", 'HATA', $e->getMessage(), null, ['request' => $request]);
        return ['status' => 'error', 'message' => 'Sunucu hatası: ' . $e->getMessage()];
    }
}

function btkreports_handle_direct_action($request, $LANG)
{
    $directAction = $request['direct_action'] ?? '';
    switch ($directAction) {
        case 'download_file':
            RaporManager::downloadTempFile($request['file'] ?? null);
            break;
    }
}