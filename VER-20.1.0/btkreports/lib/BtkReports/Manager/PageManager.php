<?php
/**
 * Yönetici Arayüzü Sayfa Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
 *
 * ANKA-PHOENIX Sürüm Notları (Anayasal Uyum):
 * - Hata veren `prepareEFaturaInvoicesPage` ve `prepareESozlesmeBasvurularPage`
 *   çağrıları, `EFaturaManager` ve `ESozlesmeManager` sınıflarındaki
 *   doğru fonksiyonlara yönlendirildi.
 * - Müşteri profili (`prepareDataForClientProfile`) ve hizmet detayları
 *   (`prepareDataForClientServices`) için veri hazırlama fonksiyonları,
 *   yeni eklenen tüm BTK alanlarını ve Fatura Adresi seçeneklerini
 *   içerecek şekilde güncellendi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;

class PageManager
{
    // ==================================================================
    // == PHOENIX: WHMCS ARAYÜZÜ İÇİN VERİ HAZIRLAMA
    // ==================================================================

    public static function prepareDataForClientProfile(int $clientId): array
    {
        $rehberKayit = (array)Capsule::table('mod_btk_abone_rehber')->where('whmcs_client_id', $clientId)->orderBy('id', 'desc')->first();
        return [
            'rehber' => $rehberKayit,
            'iller' => RaporManager::getIller(),
            'kimlikTipleri' => RaporManager::getAllKimlikTipleri(),
            'yerlesim_ilceler' => !empty($rehberKayit['yerlesim_il_id']) ? RaporManager::getIlcelerByIlId($rehberKayit['yerlesim_il_id']) : [],
            'yerlesim_mahalleler' => !empty($rehberKayit['yerlesim_ilce_id']) ? RaporManager::getMahallelerByIlceId($rehberKayit['yerlesim_ilce_id']) : [],
            'fatura_ilceler' => !empty($rehberKayit['fatura_il_id']) ? RaporManager::getIlcelerByIlId($rehberKayit['fatura_il_id']) : [],
            'fatura_mahalleler' => !empty($rehberKayit['fatura_ilce_id']) ? RaporManager::getMahallelerByIlceId($rehberKayit['fatura_ilce_id']) : [],
        ];
    }
    
    public static function prepareDataForClientServices(int $serviceId): array
    {
        $rehberKayit = (array)Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
        $service = \WHMCS\Service\Service::find($serviceId);
        $mapping = $service && $service->product ? ConfigManager::getBtkYetkiForProductGroup($service->product->gid) : null;
        
        return [
            'rehber' => $rehberKayit,
            'mapping' => $mapping,
            'uygunHizmetTipleri' => $mapping ? RaporManager::getAllEk3HizmetTipleri($mapping['grup']) : [],
            'uygunPopNoktalari' => PopManager::getAllActivePopsForSelection(),
            'iller' => RaporManager::getIller(),
            'tesis_ilceler' => !empty($rehberKayit['tesis_il_id']) ? RaporManager::getIlcelerByIlId($rehberKayit['tesis_il_id']) : [],
            'tesis_mahalleler' => !empty($rehberKayit['tesis_ilce_id']) ? RaporManager::getMahallelerByIlceId($rehberKayit['tesis_ilce_id']) : [],
        ];
    }

    public static function prepareDataForClientAdd(): array
    {
        return [
            'iller' => RaporManager::getIller(),
            'kimlikTipleri' => RaporManager::getAllKimlikTipleri(),
        ];
    }

    // ==================================================================
    // == MODÜL SAYFALARINI HAZIRLAMA
    // ==================================================================

    public static function prepareIndexPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['dashboardPageTitle']);
        $settings = BtkHelper::getAllBtkSettings();
        $smarty->assign('settings', $settings);
        $ftpManager = new FtpManager($settings);
        $smarty->assign('ftp_main_status', $ftpManager->testConnection('main'));
        $smarty->assign('ftp_backup_status', $ftpManager->testConnection('backup'));
        $smarty->assign('last_submissions', RaporManager::getLastSubmissions());
        $smarty->assign('aktif_yetki_gruplari_for_index', ConfigManager::getAktifYetkiTurleri('array_grup_names_only'));
        $smarty->assign('next_cron_runs', RaporManager::getNextCronRuns($settings));
        if (!empty($settings['pop_monitoring_enabled']) && $settings['pop_monitoring_enabled'] === '1') {
            $smarty->assign('monitoring_stats', PopManager::getMonitoringStats());
        }
    }

    public static function prepareConfigPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['configPageTitle']);
        $settings = BtkHelper::getAllBtkSettings();
        $smarty->assign('settings', $settings);
        $smarty->assign('yetki_turleri', ConfigManager::getAllYetkiTurleriWithStatus());
    }

    public static function prepareEFaturaConfigPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['efaturaConfigPageTitle']);
        $settings = BtkHelper::getAllBtkSettings();
        $smarty->assign('settings', $settings);
    }
    
    public static function prepareEFaturaInvoicesPage(\Smarty &$smarty, array $request, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['efaturaInvoicesPageTitle']);
        $result = EFaturaManager::getWhmcsInvoicesForListing($request);
        $smarty->assign('invoices', $result['data']);
        $smarty->assign('pagination_output', $result['pagination']);
        $smarty->assign('filter', $request);
    }

    public static function prepareProductGroupMappingsPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['productGroupMappingsPageTitle']);
        $smarty->assign('productGroups', ConfigManager::getWhmcsProductGroups());
        $smarty->assign('activeBtkAuthTypes', ConfigManager::getAktifYetkiTurleri());
        $smarty->assign('allEk3HizmetTipleri', RaporManager::getAllEk3HizmetTipleri());
        $smarty->assign('allEk3HizmetTipleriJson', json_encode(RaporManager::getAllEk3HizmetTipleri(), JSON_UNESCAPED_UNICODE));
        $smarty->assign('currentMappings', ConfigManager::getProductGroupMappingsArray());
    }

    public static function preparePersonelPage(\Smarty &$smarty, array $request, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['personelPageTitle']);
        $personelResult = PersonelManager::getPersonelListWithPagination($request);
        $smarty->assign('personelListesi', $personelResult['data']);
        $smarty->assign('pagination_output', $personelResult['pagination']);
        $smarty->assign('departmanlar', PersonelManager::getDepartmanList());
        $smarty->assign('filter', ['s_name' => $request['s_name'] ?? '', 's_email' => $request['s_email'] ?? '', 's_departman_id' => $request['s_departman_id'] ?? '']);
    }

    public static function prepareIssPopPage(\Smarty &$smarty, array $request, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['issPopManagementPageTitle']);
        $popResult = PopManager::getIssPopNoktalariListWithPagination($request);
        $smarty->assign('popDefinitions', $popResult['data']);
        $smarty->assign('pagination_output', $popResult['pagination']);
        $smarty->assign('iller', RaporManager::getIller());
        $smarty->assign('monitoring_enabled', BtkHelper::get_btk_setting('pop_monitoring_enabled', '0') === '1');
        $smarty->assign('filter', ['s_pop_adi' => $request['s_pop_adi'] ?? '', 's_il_id' => $request['s_il_id'] ?? '']);
    }

    public static function prepareGenerateReportsPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['generateReportsPageTitle']);
        $smarty->assign('activeBtkAuthTypesForReports', ConfigManager::getAktifYetkiTurleri());
        $smarty->assign('settings', BtkHelper::getAllBtkSettings());
    }

    public static function prepareCevherReportsPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['cevherReportsTitle']);
        $smarty->assign('start_year', date('Y'));
        $smarty->assign('end_year', date('Y') - 5);
        $smarty->assign('activeBtkAuthGroups', ConfigManager::getAktifYetkiTurleri('array_grup_names_only'));
    }

    public static function prepareViewLogsPage(\Smarty &$smarty, array $request, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['viewLogsPageTitle']);
        $logResult = LogManager::getLogsWithPagination($request);
        $smarty->assign('logs', $logResult);
        $smarty->assign('filter', $request);
    }

    public static function prepareDataManagementPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['dataManagementPageTitle']);
        $dataStatus = DataManager::checkDataSetsStatus();
        $smarty->assign('il_data_status', $dataStatus['iller']);
        $smarty->assign('ilce_data_status', $dataStatus['ilceler']);
        $smarty->assign('iller', RaporManager::getIller());
        $smarty->assign('ilceler_for_mahalle_upload', DataManager::getIlceListForMahalleUpload());
    }
    
    public static function prepareESozlesmeTestScenariosPage(\Smarty &$smarty, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['eSozlesmeTestSenaryoTitle']);
        $smarty->assign('test_basvurular', ESozlesmeManager::getAllTestBasvurulari());
    }

    public static function prepareESozlesmeBasvurularPage(\Smarty &$smarty, array $request, array $LANG): void
    {
        $smarty->assign('page_title', $LANG['eSozlesmeBasvurularTitle']);
        $basvuruResult = ESozlesmeManager::getBasvurularWithPagination($request);
        $smarty->assign('basvurular', $basvuruResult['data']);
        $smarty->assign('pagination_output', $basvuruResult['pagination']);
    }
}