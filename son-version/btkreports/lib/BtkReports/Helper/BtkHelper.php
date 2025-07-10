<?php
/**
 * BTK Raporlama Modülü için Temel Yardımcı Fonksiyonlar Sınıfı
 * Sürüm: 7.2.5 (Operatör - Kritik Hata Düzeltmeleri ve İK Entegrasyonu)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2.5
 */

namespace BtkReports\Helper;

use WHMCS\Database\Capsule;
use Cron\CronExpression;
use WHMCS\Service\Service;
use WHMCS\User\Client;
use WHMCS\Product\Product;

class BtkHelper
{
    private static $langCache = [];

    // ==================================================================
    // == BÖLÜM 1: GENEL VE TEMEL YARDIMCILAR
    // ==================================================================

    public static function loadLang(): array
    {
        if (empty(self::$langCache)) {
            global $_ADDONLANG;
            $langFilePath = __DIR__ . '/../../../lang/turkish.php';
            if (file_exists($langFilePath)) {
                include $langFilePath;
                self::$langCache = $_ADDONLANG ?? [];
            }
        }
        return self::$langCache;
    }

    public static function getLang(string $key): string
    {
        $lang = self::loadLang();
        return $lang[$key] ?? $key;
    }

    public static function getCurrentAdminId(): ?int
    {
        if (defined('IN_ADMIN') && IN_ADMIN && isset($_SESSION['adminid'])) {
            return (int)$_SESSION['adminid'];
        }
        return null;
    }

    public static function logAction(string $islem, string $seviye = 'INFO', string $mesaj = '', ?int $kullaniciId = null, ?array $ekVeri = null): void
    {
        try {
            $logKullaniciId = $kullaniciId ?? self::getCurrentAdminId();
            $ipAdresi = \WHMCS\Utility\Environment\CurrentRequest::getIP();
            $logMesaj = $mesaj;

            if ($ekVeri !== null) {
                $logMesaj .= "\nEk Veri: " . json_encode($ekVeri, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            }

            // Log zamanını tam hassasiyetle kaydet (milisanat hassasiyeti için .u)
            $logTime = (new \DateTime('now', new \DateTimeZone('UTC')))->format('Y-m-d H:i:s.u');

            Capsule::table('mod_btk_logs')->insert([
                'log_seviyesi' => strtoupper($seviye),
                'islem' => substr($islem, 0, 255),
                'mesaj' => $logMesaj,
                'kullanici_id' => $logKullaniciId,
                'ip_adresi' => $ipAdresi,
                'log_zamani' => $logTime
            ]);
        } catch (\Exception $e) {
            error_log("BTK Reports Module - LogAction Error: " . $e->getMessage());
        }
    }

    public static function getModuleTempPath(): string
    {
        return __DIR__ . '/../../../temp';
    }

    public static function deleteDirectory(string $dirPath): void
    {
        if (!is_dir($dirPath)) {
            return;
        }
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dirPath, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $fileinfo) {
            $todo = ($fileinfo->isDir() ? 'rmdir' : 'unlink');
            @$todo($fileinfo->getRealPath());
        }
        @rmdir($dirPath);
    }

    public static function downloadTempFile(?string $fileName): void
    {
        if (empty($fileName)) {
            header("HTTP/1.0 404 Not Found");
            die("Dosya adı belirtilmedi.");
        }

        if (basename($fileName) !== $fileName) {
            self::logAction('Dosya İndirme Güvenlik Uyarısı', 'HATA', 'Geçersiz dosya adı formatı.', null, ['fileName' => $fileName]);
            header("HTTP/1.0 403 Forbidden");
            die("Geçersiz dosya adı.");
        }

        $fullPath = self::getModuleTempPath() . DIRECTORY_SEPARATOR . $fileName;

        if (file_exists($fullPath) && is_readable($fullPath)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($fullPath) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($fullPath));
            flush();
            readfile($fullPath);
            @unlink($fullPath);
            exit;
        }

        self::logAction('Dosya İndirme Hatası', 'HATA', 'Dosya bulunamadı veya okunamıyor.', null, ['path' => $fullPath]);
        header("HTTP/1.0 404 Not Found");
        die("Dosya bulunamadı veya süresi dolmuş.");
    }
    
    public static function executeSqlFile(string $filePath): void
    {
        $sqlQueries = explode(';', file_get_contents($filePath));
        foreach ($sqlQueries as $query) {
            $query = trim($query);
            if (!empty($query)) {
                Capsule::connection()->statement($query);
            }
        }
    }

    public static function dropAllTables(): void
    {
        $tables = [
            'mod_btk_pop_monitoring_logs', 'mod_btk_abone_hareket_archive', 
            'mod_btk_abone_hareket_live', 'mod_btk_ftp_logs', 'mod_btk_logs', 
            'mod_btk_personel', 'mod_btk_personel_departmanlari', 
            'mod_btk_product_group_mappings', 'mod_btk_abone_rehber', 'mod_btk_iss_pop_noktalari',
            'mod_btk_adres_mahalle', 'mod_btk_adres_ilce', 'mod_btk_adres_il',
            'mod_btk_secili_yetki_turleri', 'mod_btk_yetki_turleri_referans', 
            'mod_btk_hat_durum_kodlari_referans', 'mod_btk_musteri_hareket_kodlari_referans', 
            'mod_btk_kimlik_tipleri_referans', 'mod_btk_meslek_kodlari_referans', 
            'mod_btk_ek3_hizmet_tipleri', 'mod_btk_settings'
        ];
        Capsule::schema()->disableForeignKeyConstraints();
        foreach ($tables as $table) {
            if (Capsule::schema()->hasTable($table)) {
                Capsule::schema()->drop($table);
            }
        }
        Capsule::schema()->enableForeignKeyConstraints();
    }
    
    private static function buildPagination(array $filters, int $total, int $limit, int $page, string $action = ''): string
    {
        $totalPages = ($limit > 0 && $total > 0) ? ceil($total / $limit) : 1;
        if ($totalPages <= 1) return '';
        
        $queryParams = $_GET; // Mevcut URL parametrelerini al
        $queryParams = array_diff_key($queryParams, array_flip(['page', 'page_general', 'page_ftp', 'action'])); // Sayfalama parametrelerini kaldır
        
        // Mevcut action'ı koru veya yeni bir action ekle
        if (!empty($action)) {
            $queryParams['action'] = $action;
        } else if (isset($_GET['action'])) {
            $queryParams['action'] = $_GET['action'];
        }

        $queryString = http_build_query($queryParams);
        
        $html = '<div class="text-center"><ul class="pagination">';
        $html .= ($page > 1) ? '<li><a href="?'.$queryString.'&page='.($page - 1).'">«</a></li>' : '<li class="disabled"><span>«</span></li>';

        for ($i = 1; $i <= $totalPages; $i++) {
            if ($i == $page) {
                $html .= '<li class="active"><span>'.$i.'</span></li>';
            } else {
                $html .= '<li><a href="?'.$queryString.'&page='.$i.'">'.$i.'</a></li>';
            }
        }

        $html .= ($page < $totalPages) ? '<li><a href="?'.$queryString.'&page='.($page + 1).'">»</a></li>' : '<li class="disabled"><span>»</span></li>';
        $html .= '</ul></div>';
        return $html;
    }

    // ==================================================================
    // == BÖLÜM 2: AYAR YÖNETİMİ
    // ==================================================================

    public static function get_btk_setting(string $settingName, $defaultValue = null)
    {
        try {
            $setting = Capsule::table('mod_btk_settings')->where('setting', $settingName)->first();
            if ($setting) {
                if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    return decrypt($setting->value);
                }
                return $setting->value;
            }
            return $defaultValue;
        } catch (\Exception $e) {
            self::logAction('Ayar Okuma Hatası', 'HATA', "Ayar '$settingName' okunurken hata: " . $e->getMessage());
            return $defaultValue;
        }
    }

    public static function getAllBtkSettings(): array
    {
        $settingsArray = [];
        try {
            $settings = Capsule::table('mod_btk_settings')->get();
            foreach ($settings as $setting) {
                if (in_array($setting->setting, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    try {
                        $settingsArray[$setting->setting] = decrypt($setting->value);
                    } catch (\Exception $e) {
                        self::logAction('Ayar Şifre Çözme Hatası', 'HATA', "Ayar '{$setting->setting}' çözülemedi.");
                        $settingsArray[$setting->setting] = '';
                    }
                } else {
                    $settingsArray[$setting->setting] = $setting->value;
                }
            }
        } catch (\Exception $e) {
            self::logAction('Tüm Ayarları Okuma Hatası', 'HATA', 'Tüm modül ayarları okunurken hata: ' . $e->getMessage());
        }
        return $settingsArray;
    }
    
    public static function set_btk_setting(string $settingName, $value): bool
    {
        try {
            $valueToStore = $value;
            if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass'])) {
                if ($value === '********') {
                    return true;
                }
                $valueToStore = encrypt((string)$value);
            }
            Capsule::table('mod_btk_settings')->updateOrInsert(['setting' => $settingName], ['value' => $valueToStore]);
            return true;
        } catch (\Exception $e) {
            self::logAction('Ayar Kaydetme Hatası', 'HATA', "Ayar '$settingName' kaydedilirken hata: " . $e->getMessage());
            return false;
        }
    }

    public static function saveAllSettings(array $postData): void
    {
        $settingsToSave = [
            'operator_code', 'operator_name', 'operator_title', 'main_ftp_host', 'main_ftp_user', 'main_ftp_port',
            'main_ftp_rehber_path', 'main_ftp_hareket_path', 'main_ftp_personel_path', 'backup_ftp_host', 'backup_ftp_user',
            'backup_ftp_port', 'backup_ftp_rehber_path', 'backup_ftp_hareket_path', 'backup_ftp_personel_path',
            'rehber_cron_schedule', 'hareket_cron_schedule', 'personel_cron_schedule', 'hareket_live_table_days',
            'hareket_archive_table_days', 'admin_records_per_page', 'log_records_per_page', 'surum_notlari_link',
            'pop_monitoring_cron_schedule', 'pop_monitoring_timeout_sec', 'pop_monitoring_high_latency_threshold_ms',
            'pop_monitoring_port'
        ];
        
        foreach ($settingsToSave as $key) {
            if (isset($postData[$key])) {
                self::set_btk_setting($key, trim($postData[$key]));
            }
        }

        $checkboxSettings = [
            'main_ftp_ssl', 'backup_ftp_enabled', 'backup_ftp_ssl', 'send_empty_reports', 'delete_data_on_deactivate',
            'personel_nvi_verification_enabled', 'abone_nvi_verification_enabled', 'pop_monitoring_enabled', 'show_btk_info_if_empty_clientarea'
        ];
        
        foreach ($checkboxSettings as $key) {
            self::set_btk_setting($key, isset($postData[$key]) && ($postData[$key] === '1' || $postData[$key] === 'on') ? '1' : '0');
        }

        if (isset($postData['main_ftp_pass']) && $postData['main_ftp_pass'] !== '********') {
            self::set_btk_setting('main_ftp_pass', $postData['main_ftp_pass']);
        }
        if (isset($postData['backup_ftp_pass']) && $postData['backup_ftp_pass'] !== '********') {
            self::set_btk_setting('backup_ftp_pass', $postData['backup_ftp_pass']);
        }
    }

    // ==================================================================
    // == BÖLÜM 3: HOOK ENJEKSİYON VE KAYIT MANTIKLARI
    // ==================================================================
    
    public static function injectClientProfileForm(array $vars): string
    {
        $clientId = $vars['clientid'];
        $btkClientData = (array) (Capsule::table('mod_btk_abone_rehber')
            ->where('whmcs_client_id', $clientId)
            ->orderBy('id', 'desc')
            ->first() ?? []);

        $smarty = new \Smarty();
        $smarty->assign('LANG', self::loadLang());
        $smarty->assign('clientid', $clientId);
        $smarty->assign('btkClientData', $btkClientData);
        $smarty->assign('kimlikTipleri', Capsule::table('mod_btk_kimlik_tipleri_referans')->orderBy('aciklama')->get()->map(fn($item) => (array)$item)->all());
        $smarty->assign('meslekKodlari', Capsule::table('mod_btk_meslek_kodlari_referans')->orderBy('aciklama')->get()->map(fn($item) => (array)$item)->all());
        $smarty->assign('iller', self::getIller());

        if(!empty($btkClientData['yerlesim_il_id'])) {
            $smarty->assign('yerlesim_ilceler', self::getIlcelerByIlId((int)($btkClientData['yerlesim_il_id'])));
        }
        if(!empty($btkClientData['yerlesim_ilce_id'])) {
            $smarty->assign('yerlesim_mahalleler', self::getMahallelerByIlceId((int)($btkClientData['yerlesim_ilce_id'])));
        }
        
        return $smarty->fetch(__DIR__ . '/../../../templates/admin/inject/client_profile_section.tpl');
    }

    public static function injectServiceDetailsForm(array $vars): string
    {
        $serviceId = $vars['serviceid'];
        $btkServiceData = (array) (Capsule::table('mod_btk_abone_rehber')
            ->where('whmcs_service_id', $serviceId)
            ->first() ?? []);

        $service = Service::find($serviceId);
        // Eğer service veya product bulunamazsa boş array döndür veya hata logla
        $mapping = $service && $service->product ? self::getBtkYetkiForProductGroup($service->product->gid) : null;
        
        $uygunHizmetTipleri = [];
        if ($mapping && isset($mapping['grup'])) {
            $uygunHizmetTipleri = self::getAllEk3HizmetTipleri($mapping['grup']);
        }

        $smarty = new \Smarty();
        $smarty->assign('LANG', self::loadLang());
        $smarty->assign($vars); // WHMCS'ten gelen paket/domain gibi veriler
        $smarty->assign('btkServiceData', $btkServiceData);
        $smarty->assign('uygunHizmetTipleri', $uygunHizmetTipleri);
        $smarty->assign('uygunPopNoktalari', self::getIssPopNoktalariList([], 'pop.pop_adi', 'ASC', 10000, 0)['data']);
        $smarty->assign('tesisAdresiYerlesimleAyni', self::isTesisAdresiAyni($btkServiceData));
        $smarty->assign('iller', self::getIller());
        $smarty->assign('mapping', $mapping); // Smarty'de grup bilgisini kullanmak için

        if(!empty($btkServiceData['tesis_il_id'])) {
            $smarty->assign('tesis_ilceler', self::getIlcelerByIlId((int)($btkServiceData['tesis_il_id'])));
        }
        if(!empty($btkServiceData['tesis_ilce_id'])) {
            $smarty->assign('tesis_mahalleler', self::getMahallelerByIlceId((int)($btkServiceData['tesis_ilce_id'])));
        }

        return $smarty->fetch(__DIR__ . '/../../../templates/admin/inject/service_details_section.tpl');
    }

    public static function isTesisAdresiAyni(array $btkData): bool
    {
        if (empty($btkData) || !isset($btkData['tesis_il_id']) || empty($btkData['tesis_il_id'])) {
            return true; // Henüz hiç adres girilmemişse aynı varsayabiliriz
        }
        
        $keys = ['il_id', 'ilce_id', 'mahalle_id', 'cadde', 'dis_kapi_no', 'ic_kapi_no'];
        foreach($keys as $key) {
            if (($btkData['tesis_'.$key] ?? null) !== ($btkData['yerlesim_'.$key] ?? null)) {
                return false;
            }
        }
        return true;
    }

    // ==================================================================
    // == BÖLÜM 4: HOOK HANDLER'LAR (OLAY YÖNETİCİLERİ)
    // ==================================================================

    public static function handleClientProfileSave(int $clientId, array $btkData): void
    {
        $services = Service::where('userid', $clientId)->get();
        foreach ($services as $service) {
            self::createOrUpdateRehberKayit($service->id, $btkData, [
                'kod' => '11', 'aciklama' => 'MUSTERI_BILGI_DEGISIKLIGI'
            ]);
        }
        self::logAction('Müşteri Profili Kaydedildi (BTK)', 'INFO', "Müşteri ID: {$clientId} için BTK verileri güncellendi ve hareket oluşturuldu.");
    }

    public static function handleServiceDetailsSave(int $serviceId, array $btkData): void
    {
        if (isset($btkData['tesis_adresi_yerlesimle_ayni']) && ($btkData['tesis_adresi_yerlesimle_ayni'] == 'on' || $btkData['tesis_adresi_yerlesimle_ayni'] == '1')) {
            $currentRehber = (array) (Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first() ?? []);
            if ($currentRehber) {
                // Müşterinin yerleşim adresi (genellikle en güncel rehber kaydından alınır)
                $yerlesimData = (array) (Capsule::table('mod_btk_abone_rehber')->where('whmcs_client_id', $currentRehber['whmcs_client_id'])->orderBy('son_guncellenme_zamani','desc')->first() ?? []);
                $btkData['tesis_il_id'] = $yerlesimData['tesis_il_id'] ?? $yerlesimData['yerlesim_il_id'] ?? null;
                $btkData['tesis_ilce_id'] = $yerlesimData['tesis_ilce_id'] ?? $yerlesimData['yerlesim_ilce_id'] ?? null;
                $btkData['tesis_mahalle_id'] = $yerlesimData['tesis_mahalle_id'] ?? $yerlesimData['yerlesim_mahalle_id'] ?? null;
                $btkData['tesis_cadde'] = $yerlesimData['tesis_cadde'] ?? $yerlesimData['yerlesim_cadde'] ?? null;
                $btkData['tesis_dis_kapi_no'] = $yerlesimData['tesis_dis_kapi_no'] ?? $yerlesimData['yerlesim_dis_kapi_no'] ?? null;
                $btkData['tesis_ic_kapi_no'] = $yerlesimData['tesis_ic_kapi_no'] ?? $yerlesimData['yerlesim_ic_kapi_no'] ?? null;
            }
        }

        self::createOrUpdateRehberKayit($serviceId, $btkData, [
            'kod' => '5', 'aciklama' => 'ADRES_DEGISIKLIGI'
        ]);
        self::logAction('Hizmet Detayları Kaydedildi (BTK)', 'INFO', "Hizmet ID: {$serviceId} için BTK verileri güncellendi.");
    }

    public static function handleOrderAccepted(int $orderId): void
    {
        $services = Service::where('orderid', $orderId)->get();
        foreach ($services as $service) {
            self::createOrUpdateRehberKayit($service->id, [], [
                'kod' => '1', 'aciklama' => 'YENI_ABONELIK_KAYDI'
            ]);
        }
    }

    public static function handleServiceStatusChange(int $serviceId, string $newStatus): void
    {
        $statusMap = [
            'Active' => ['hat_durum' => 'A', 'kod' => '1', 'aciklama' => 'AKTIF', 'hareket_kodu' => '2', 'hareket_aciklama' => 'HAT_DURUM_DEGISIKLIGI'],
            'Suspended' => ['hat_durum' => 'K', 'kod' => '13', 'aciklama' => 'KISITLI', 'hareket_kodu' => '2', 'hareket_aciklama' => 'HAT_DURUM_DEGISIKLIGI'],
            'Terminated' => ['hat_durum' => 'I', 'kod' => '3', 'aciklama' => 'IPTAL', 'hareket_kodu' => '10', 'hareket_aciklama' => 'HAT_IPTAL'],
            'Cancelled' => ['hat_durum' => 'I', 'kod' => '5', 'aciklama' => 'IPTAL_MUSTERI_TALEBİ', 'hareket_kodu' => '10', 'hareket_aciklama' => 'HAT_IPTAL'],
            'Fraud' => ['hat_durum' => 'I', 'kod' => '4', 'aciklama' => 'IPTAL_SAHTE_EVRAK', 'hareket_kodu' => '10', 'hareket_aciklama' => 'HAT_IPTAL'],
        ];

        if (array_key_exists($newStatus, $statusMap)) {
            $statusInfo = $statusMap[$newStatus];
            $updateData = [
                'hat_durum' => $statusInfo['hat_durum'],
                'hat_durum_kodu' => $statusInfo['kod'],
                'hat_durum_kodu_aciklama' => $statusInfo['aciklama']
            ];
            
            if ($statusInfo['hat_durum'] === 'I') {
                $updateData['abone_bitis'] = gmdate('YmdHis');
            } else {
                $updateData['abone_bitis'] = null; // Aktif/Askıda ise bitiş tarihi boş olmalı
            }
            self::createOrUpdateRehberKayit($serviceId, $updateData, [
                'kod' => $statusInfo['hareket_kodu'], 'aciklama' => $statusInfo['hareket_aciklama']
            ]);
        }
    }

    public static function handleServiceEdit(array $vars): void
    {
        $serviceId = $vars['serviceid'];
        $rehberKayit = (array) (Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first() ?? []);
        if (empty($rehberKayit)) return;

        // Tarife değişikliği olduysa (paket ID değiştiyse veya ürün grubu değiştiyse)
        $currentServiceProduct = Product::find($vars['packageid'] ?? 0);
        $oldServiceProduct = Product::find(Capsule::table('tblhosting')->where('id', $serviceId)->value('packageid'));
        
        $currentGid = $currentServiceProduct ? $currentServiceProduct->gid : null;
        $oldGid = $oldServiceProduct ? $oldServiceProduct->gid : null;

        if ($currentGid && $currentGid !== $oldGid) {
            self::createOrUpdateRehberKayit($serviceId, ['hizmet_tipi' => self::getEk3HizmetTipiForService($serviceId)], [
                'kod' => '7', 'aciklama' => 'TARIFE_DEGISIKLIGI'
            ]);
        }
        
        // IP değişikliği olduysa
        if (isset($vars['dedicatedip']) && $vars['dedicatedip'] !== ($rehberKayit['statik_ip'] ?? null)) {
            self::createOrUpdateRehberKayit($serviceId, ['statik_ip' => $vars['dedicatedip']], [
                'kod' => '15', 'aciklama' => 'IP_DEGISIKLIGI'
            ]);
        }
        
        // Hat No (Domain/Username) değişikliği olduysa
        if (isset($vars['domain']) && $vars['domain'] !== ($rehberKayit['hat_no'] ?? null)) {
            self::createOrUpdateRehberKayit($serviceId, ['hat_no' => $vars['domain']], [
                'kod' => '9', 'aciklama' => 'NUMARA_DEGISIKLIGI' // Veya daha spesifik bir kod
            ]);
        }
    }

    // ==================================================================
    // == BÖLÜM 5: ÇEKİRDEK VERİ YÖNETİMİ (REHBER VE HAREKET OLUŞTURMA)
    // ==================================================================

    /**
     * Bir hizmet için abone rehber kaydını oluşturur veya günceller ve gerekirse hareket oluşturur.
     * @param int $serviceId
     * @param array $guncellenecekVeri
     * @param array|null $hareketBilgisi ['kod' => '1', 'aciklama' => '...']
     */
    public static function createOrUpdateRehberKayit(int $serviceId, array $guncellenecekVeri = [], ?array $hareketBilgisi = null): void
    {
        try {
            $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
            $mergedData = $guncellenecekVeri;

            if (!$rehberKayit) {
                // Yeni kayıt, WHMCS'den temel bilgileri çek
                $service = Service::find($serviceId);
                if (!$service) return;
                $client = Client::find($service->userid);

                $mergedData['whmcs_service_id'] = $serviceId;
                $mergedData['whmcs_client_id'] = $client->id;
                $mergedData['operator_kod'] = self::get_btk_setting('operator_code');
                $mergedData['musteri_id'] = $client->id;
                $mergedData['hat_no'] = $service->domain ?: $service->dedicatedip ?: $serviceId;
                $mergedData['abone_baslangic'] = (new \DateTime($service->regdate, new \DateTimeZone('UTC')))->format('YmdHis');
                $mergedData['abone_adi'] = $client->firstname;
                $mergedData['abone_soyadi'] = $client->lastname;
                $mergedData['abone_unvan'] = $client->companyname;
                $mergedData['abone_email'] = $client->email;
                $mergedData['irtibat_tel_no_1'] = preg_replace('/[^0-9]/', '', $client->phonenumber);
                $mergedData['musteri_tipi'] = !empty($client->companyname) ? 'T-SIRKET' : 'G-SAHIS';
            } else {
                $mergedData = array_merge((array)$rehberKayit, $guncellenecekVeri);
            }

            // Veritabanı sütunlarıyla eşleşen veriyi filtrele
            $rehberColumns = Capsule::schema()->getColumnListing('mod_btk_abone_rehber');
            $sanitizedData = array_intersect_key($mergedData, array_flip($rehberColumns));

            Capsule::table('mod_btk_abone_rehber')->updateOrInsert(
                ['whmcs_service_id' => $serviceId],
                $sanitizedData
            );
            
            // Eğer yeni bir rehber kaydı oluşturulduysa ID'sini al
            if (!$rehberKayit) {
                $newRehber = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
                $rehberId = $newRehber->id ?? null;
            } else {
                $rehberId = $rehberKayit->id;
            }
            
            if ($rehberId && $hareketBilgisi && !empty($hareketBilgisi['kod'])) {
                self::createHareketKaydi($serviceId, $rehberId, $hareketBilgisi['kod'], $hareketBilgisi['aciklama'], $mergedData);
            }
        } catch (\Exception $e) {
            self::logAction('Rehber/Hareket Kayıt Hatası', 'HATA', "Hizmet ID: {$serviceId}, Hata: " . $e->getMessage());
        }
    }

    /**
     * Abone hareket kaydı oluşturur.
     * @param int $serviceId
     * @param int $rehberId
     * @param string $hareketKodu
     * @param string $hareketAciklama
     * @param array $snapshotData
     */
    private static function createHareketKaydi(int $serviceId, int $rehberId, string $hareketKodu, string $hareketAciklama, array $snapshotData): void
    {
        $rehberKayit = Capsule::table('mod_btk_abone_rehber')->find($rehberId);
        // İPTAL OLMUŞ ABONELİK İÇİN GÜVENLİK KONTROLÜ:
        // Eğer hizmet zaten iptal durumundaysa (hat_durum 'I' ise)
        // ve gelen hareket kodu "HAT IPTAL" değilse, yeni hareket oluşturma.
        if ($rehberKayit && $rehberKayit->hat_durum === 'I' && $hareketKodu !== '10') {
            self::logAction('Hareket Oluşturma Atlandı', 'UYARI', "Hizmet ID {$serviceId} iptal durumunda olduğu için yeni hareket (Kod: {$hareketKodu}) oluşturulmadı.");
            return;
        }

        Capsule::table('mod_btk_abone_hareket_live')->insert([
            'rehber_kayit_id' => $rehberId,
            'musteri_hareket_kodu' => $hareketKodu,
            'musteri_hareket_aciklama' => $hareketAciklama,
            'musteri_hareket_zamani' => gmdate('YmdHis'),
            'islem_detayi_json' => json_encode($snapshotData, JSON_UNESCAPED_UNICODE),
            'gonderildi_flag' => 0,
            'kayit_zamani' => gmdate('Y-m-d H:i:s')
        ]);
        self::logAction('BTK Hareket Kaydı Oluşturuldu', 'INFO', "Hizmet ID: $serviceId, Hareket Kodu: " . $hareketKodu);
    }
    
    /**
     * Eski gönderilmiş hareketleri canlı tablodan arşiv tablosuna taşır.
     */
    public static function archiveOldHareketler(): void
    {
        $liveDays = (int)self::get_btk_setting('hareket_live_table_days', 7);
        $archiveDays = (int)self::get_btk_setting('hareket_archive_table_days', 180);
        
        $dateLimitLiveToArchive = gmdate('Y-m-d H:i:s', strtotime("-$liveDays days"));
        $dateLimitArchiveToDelete = gmdate('Y-m-d H:i:s', strtotime("-$archiveDays days"));

        try {
            $toArchive = Capsule::table('mod_btk_abone_hareket_live')->where('gonderildi_flag', 1)->where('kayit_zamani', '<', $dateLimitLiveToArchive)->get()->map(fn($item) => (array)$item)->all();
            if (!empty($toArchive)) {
                $archiveData = [];
                $liveIdsToDelete = [];
                foreach ($toArchive as $log) {
                    $logArray = (array)$log;
                    $logArray['arsivlenme_zamani'] = gmdate('Y-m-d H:i:s');
                    $archiveData[] = $logArray;
                    $liveIdsToDelete[] = $log['id'];
                }
                Capsule::table('mod_btk_abone_hareket_archive')->insert($archiveData);
                Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $liveIdsToDelete)->delete();
                self::logAction('Hareket Arşivleme', 'INFO', count($liveIdsToDelete) . ' adet hareket arşive taşındı.');
            }

            $deletedFromArchive = Capsule::table('mod_btk_abone_hareket_archive')->where('arsivlenme_zamani', '<', $dateLimitArchiveToDelete)->delete();
            if ($deletedFromArchive > 0) {
                self::logAction('Eski Hareket Arşivi Silme', 'INFO', $deletedFromArchive . ' adet eski arşivlenmiş hareket kalıcı olarak silindi.');
            }
        } catch (\Exception $e) {
            self::logAction('Hareket Arşivleme/Silme Hatası', 'HATA', $e->getMessage());
        }
    }

    // ==================================================================
    // == BÖLÜM 6: PERSONEL YÖNETİMİ
    // ==================================================================

    public static function syncAllAdminsToPersonel(): void
    {
        $admins = Capsule::table('tbladmins')->get(['id', 'username', 'firstname', 'lastname', 'email'])->map(fn($item) => (array)$item)->all();
        foreach ($admins as $admin) {
            self::syncAdminToPersonel($admin['id'], $admin);
        }
    }

    public static function syncAdminToPersonel(int $adminId, array $adminVars): void
    {
        try {
            $operatorTitle = self::get_btk_setting('operator_title', self::get_btk_setting('operator_name'));
            Capsule::table('mod_btk_personel')->updateOrInsert(
                ['whmcs_admin_id' => $adminId],
                [
                    'ad' => $adminVars['firstname'] ?? '',
                    'soyad' => $adminVars['lastname'] ?? '',
                    'email' => $adminVars['email'] ?? '',
                    'firma_unvani' => $operatorTitle,
                ]
            );
        } catch (\Exception $e) {
            self::logAction('Personel Senkronizasyon Hatası', 'HATA', "Admin ID: {$adminId} senkronize edilemedi: " . $e->getMessage());
        }
    }

    public static function handleAdminDelete(int $adminId): void
    {
        try {
            Capsule::table('mod_btk_personel')
                ->where('whmcs_admin_id', $adminId)
                ->whereNull('isten_ayrilma_tarihi')
                ->update([
                    'isten_ayrilma_tarihi' => gmdate('Y-m-d'),
                    'is_birakma_nedeni' => 'WHMCS Admin hesabı silindi.',
                    'btk_listesine_eklensin' => 0
                ]);
            self::logAction('Personel İşten Ayrıldı (Oto)', 'UYARI', "Admin ID: $adminId silindi, personel kaydı pasife çekildi.");
        } catch (\Exception $e) {
            self::logAction('Admin Silme Hook Hatası', 'HATA', $e->getMessage(), null, ['admin_id' => $adminId]);
        }
    }

    public static function getPersonelListWithPagination(array $filters = []): array
    {
        $query = Capsule::table('mod_btk_personel as p')
            ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id');

        // Filtreleme mantığı
        if (!empty($filters['s_ad'])) $query->where('p.ad', 'LIKE', '%' . trim($filters['s_ad']) . '%');
        if (!empty($filters['s_soyad'])) $query->where('p.soyad', 'LIKE', '%' . trim($filters['s_soyad']) . '%');
        if (!empty($filters['s_tckn'])) $query->where('p.tckn', '=', preg_replace('/[^0-9]/', '', $filters['s_tckn']));
        if (!empty($filters['s_email'])) $query->where('p.email', 'LIKE', '%' . trim($filters['s_email']) . '%');
        if (isset($filters['s_departman_id']) && $filters['s_departman_id'] !== '' && is_numeric($filters['s_departman_id'])) {
            $query->where('p.departman_id', (int)$filters['s_departman_id']);
        }
        if (isset($filters['s_btk_listesine_eklensin']) && $filters['s_btk_listesine_eklensin'] !== '' && is_numeric($filters['s_btk_listesine_eklensin'])) {
            $query->where('p.btk_listesine_eklensin', (int)$filters['s_btk_listesine_eklensin']);
        }
        if (isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '1'){
            $query->whereNull('p.isten_ayrilma_tarihi');
        } elseif (isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '0') {
             $query->whereNotNull('p.isten_ayrilma_tarihi');
        }

        $total = $query->count();
        $limit = (int)self::get_btk_setting('admin_records_per_page', 20);
        $page = (int)($filters['page'] ?? 1);
        $offset = ($page - 1) * $limit;
        
        $data = $query->select('p.*', 'd.departman_adi')
            ->orderBy('p.soyad', 'asc')
            ->orderBy('p.ad', 'asc')
            ->skip($offset)->take($limit)
            ->get()->map(fn($item) => (array)$item)->all();

        return [
            'data' => $data,
            'pagination' => self::buildPagination($filters, $total, $limit, $page, 'personel')
        ];
    }
    
    public static function savePersonel(array $data, array $LANG): array
    {
        $personelId = (int)($data['id'] ?? 0);
        unset($data['id']);
        
        if (empty($data['ad']) || empty($data['soyad']) || empty($data['tckn'])) {
            return ['type' => 'error', 'message' => 'Ad, Soyad ve TCKN alanları zorunludur.'];
        }

        // dogum_yili alanının varlığını ve geçerliliğini kontrol et
        if (isset($data['dogum_yili']) && !empty($data['dogum_yili'])) {
            $data['dogum_yili'] = (int)$data['dogum_yili'];
            if ($data['dogum_yili'] < 1900 || $data['dogum_yili'] > (date('Y'))) {
                return ['type' => 'error', 'message' => 'Doğum Yılı geçerli bir yıl olmalıdır.'];
            }
        } else {
            $data['dogum_yili'] = null; // Boş bırakılırsa null kaydet
        }
        
        // Doğum tarihi alanı varsa, YYYY-MM-DD formatında kaydet
        if (isset($data['dogum_tarihi']) && !empty($data['dogum_tarihi'])) {
            try {
                $dateObj = new \DateTime($data['dogum_tarihi']);
                $data['dogum_tarihi'] = $dateObj->format('Y-m-d');
            } catch (\Exception $e) {
                return ['type' => 'error', 'message' => 'Geçersiz doğum tarihi formatı. YYYY-MM-DD bekleniyor.'];
            }
        } else {
            $data['dogum_tarihi'] = null;
        }


        try {
            if ($personelId > 0) {
                Capsule::table('mod_btk_personel')->where('id', $personelId)->update($data);
                return ['type' => 'success', 'message' => 'Personel bilgileri güncellendi.'];
            } else {
                Capsule::table('mod_btk_personel')->insert($data);
                return ['type' => 'success', 'message' => 'Yeni personel eklendi.'];
            }
        } catch (\Exception $e) {
            self::logAction('Personel Kaydetme Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Veritabanı hatası: ' . substr($e->getMessage(), 0, 100)];
        }
    }

    public static function deletePersonel(int $personelId, array $LANG): array
    {
        if ($personelId <= 0) {
            return ['type' => 'error', 'message' => 'Geçersiz Personel ID.'];
        }
        try {
            $deleted = Capsule::table('mod_btk_personel')->where('id', $personelId)->delete();
            if ($deleted) {
                return ['type' => 'success', 'message' => 'Personel başarıyla silindi.'];
            }
            return ['type' => 'error', 'message' => 'Personel bulunamadı veya silinemedi.'];
        } catch (\Exception $e) {
            self::logAction('Personel Silme Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Silme işlemi sırasında veritabanı hatası oluştu.'];
        }
    }

    public static function getPersonelById(int $id)
    {
        if ($id <= 0) return null;
        return (array) (Capsule::table('mod_btk_personel')->find($id) ?? []);
    }

    // ==================================================================
    // == BÖLÜM 7: POP YÖNETİMİ
    // ==================================================================

    public static function getIssPopNoktalariListWithPagination(array $filters = []): array
    {
        $query = Capsule::table('mod_btk_iss_pop_noktalari as pop')
            ->leftJoin('mod_btk_adres_il as il', 'pop.il_id', '=', 'il.id')
            ->leftJoin('mod_btk_adres_ilce as ilce', 'pop.ilce_id', '=', 'ilce.id');
        
        // Filtreler
        if (!empty($filters['s_pop_adi'])) $query->where('pop.pop_adi', 'LIKE', '%' . trim($filters['s_pop_adi']) . '%');
        if (!empty($filters['s_yayin_yapilan_ssid'])) $query->where('pop.yayin_yapilan_ssid', 'LIKE', '%' . trim($filters['s_yayin_yapilan_ssid']) . '%');
        if (!empty($filters['s_il_id']) && is_numeric($filters['s_il_id'])) $query->where('pop.il_id', (int)$filters['s_il_id']);
        if (!empty($filters['s_ilce_id']) && is_numeric($filters['s_ilce_id'])) $query->where('pop.ilce_id', (int)$filters['s_ilce_id']);
        if (isset($filters['s_aktif_pasif_durum']) && $filters['s_aktif_pasif_durum'] !== '' && is_numeric($filters['s_aktif_pasif_durum'])) {
            $query->where('pop.aktif_pasif_durum', (int)$filters['s_aktif_pasif_durum']);
        }
        if (isset($filters['s_izleme_aktif']) && $filters['s_izleme_aktif'] !== '' && is_numeric($filters['s_izleme_aktif'])) {
            $query->where('pop.izleme_aktif', (int)$filters['s_izleme_aktif']);
        }


        $total = $query->count();
        $limit = (int)self::get_btk_setting('admin_records_per_page', 20);
        $page = (int)($filters['page'] ?? 1);
        $offset = ($page - 1) * $limit;

        $data = $query->select('pop.*', 'il.il_adi', 'ilce.ilce_adi')
            ->orderBy('pop.pop_adi', 'asc')
            ->skip($offset)->take($limit)
            ->get()->map(fn($item) => (array)$item)->all();
            
        return [
            'data' => $data,
            'pagination' => self::buildPagination($filters, $total, $limit, $page, 'isspop')
        ];
    }

    public static function saveIssPopNoktasi(array $data, array $LANG): array
    {
        $popId = (int)($data['id'] ?? 0);
        unset($data['id']);

        if (empty($data['pop_adi']) || empty($data['yayin_yapilan_ssid'])) {
            return ['type' => 'error', 'message' => 'POP Adı ve Yayın SSID alanları zorunludur.'];
        }
        // İzleme portu kontrolü
        if (isset($data['izleme_portu']) && !empty($data['izleme_portu'])) {
            $data['izleme_portu'] = (int)$data['izleme_portu'];
            if ($data['izleme_portu'] <= 0 || $data['izleme_portu'] > 65535) {
                return ['type' => 'error', 'message' => 'İzleme Portu 1-65535 arasında geçerli bir değer olmalıdır.'];
            }
        } else {
            $data['izleme_portu'] = null; // Boş bırakılırsa null kaydet
        }


        try {
            if ($popId > 0) {
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update($data);
                return ['type' => 'success', 'message' => 'POP Noktası güncellendi.'];
            } else {
                Capsule::table('mod_btk_iss_pop_noktalari')->insert($data);
                return ['type' => 'success', 'message' => 'Yeni POP Noktası eklendi.'];
            }
        } catch (\Exception $e) {
            self::logAction('POP Kaydetme Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Veritabanı hatası: ' . substr($e->getMessage(), 0, 100)];
        }
    }

    public static function deleteIssPopNoktasi(int $popId, array $LANG): array
    {
        if ($popId <= 0) {
            return ['type' => 'error', 'message' => 'Geçersiz POP ID.'];
        }
        try {
            $usageCount = Capsule::table('mod_btk_abone_rehber')->where('iss_pop_noktasi_id', $popId)->count();
            if ($usageCount > 0) {
                return ['type' => 'error', 'message' => "Bu POP noktası {$usageCount} hizmetle ilişkili ve silinemez."];
            }
            Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->delete();
            return ['type' => 'success', 'message' => 'POP Noktası başarıyla silindi.'];
        } catch (\Exception $e) {
            self::logAction('POP Silme Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Silme işlemi sırasında veritabanı hatası oluştu.'];
        }
    }

    public static function getIssPopNoktasiById(int $id)
    {
        if ($id <= 0) return null;
        return (array) (Capsule::table('mod_btk_iss_pop_noktalari')->find($id) ?? []);
    }
    
    public static function togglePopMonitoringStatus(int $popId, bool $newStatus): array
    {
        try {
            if ($popId > 0) {
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update(['izleme_aktif' => $newStatus]);
                return ['status' => 'success', 'message' => 'İzleme durumu güncellendi.'];
            }
            return ['status' => 'error', 'message' => 'Geçersiz POP ID.'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    // ==================================================================
    // == BÖLÜM 8: REFERANS VERİ VE YETKİ FONKSİYONLARI
    // ==================================================================

    public static function getIller(): array { return Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->map(fn($item) => (array)$item)->all(); }
    public static function getIlcelerByIlId(int $ilId): array { if ($ilId <= 0) return []; return Capsule::table('mod_btk_adres_ilce')->where('il_id', $ilId)->orderBy('ilce_adi')->get()->map(fn($item) => (array)$item)->all(); }
    public static function getMahallelerByIlceId(int $ilceId): array { if ($ilceId <= 0) return []; return Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', $ilceId)->orderBy('mahalle_adi')->get()->map(fn($item) => (array)$item)->all(); }
    public static function getDepartmanList(): array { return Capsule::table('mod_btk_personel_departmanlari')->orderBy('departman_adi')->get()->map(fn($item) => (array)$item)->all(); }
    
    public static function getAllEk3HizmetTipleri(?string $grup = null): array { 
        $query = Capsule::table('mod_btk_ek3_hizmet_tipleri');
        if($grup) $query->where('ana_yetki_grup', $grup);
        return $query->orderBy('hizmet_tipi_aciklamasi')->get()->map(fn($item) => (array)$item)->all();
    }
    
    public static function getBtkYetkiForProductGroup(int $gid): ?array {
        $mapping = Capsule::table('mod_btk_product_group_mappings as pgm')
            ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('pgm.gid', $gid)
            ->select('pgm.*', 'ytr.grup')
            ->first();
        return $mapping ? (array)$mapping : null;
    }
    
    public static function getGrupByYetkiKodu(string $yetkiKodu): ?string {
        return Capsule::table('mod_btk_yetki_turleri_referans')->where('yetki_kodu', $yetkiKodu)->value('grup');
    }
    
    public static function getAktifYetkiTurleri(string $returnAs = 'object_list'): array {
        $query = Capsule::table('mod_btk_secili_yetki_turleri as syt')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'syt.yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('syt.aktif', 1)->orderBy('ytr.grup')->orderBy('ytr.yetki_adi');
        
        if ($returnAs === 'array_grup_names_only') {
            return $query->distinct()->pluck('ytr.grup')->all();
        }
        return $query->select('syt.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup')->get()->map(fn($item) => (array)$item)->all();
    }

    public static function getAllYetkiTurleriWithStatus(): array {
        return Capsule::table('mod_btk_yetki_turleri_referans as ytr')
            ->leftJoin('mod_btk_secili_yetki_turleri as syt', 'ytr.yetki_kodu', '=', 'syt.yetki_kodu')
            ->select('ytr.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup', Capsule::raw('IFNULL(syt.aktif, 0) as aktif'))
            ->orderBy('ytr.yetki_adi')
            ->get()->map(fn($item) => (array)$item)->all();
    }

    public static function saveSeciliYetkiTurleri(array $secilenYetkiler = []): void {
        try {
            Capsule::table('mod_btk_secili_yetki_turleri')->update(['aktif' => 0]);
            
            if (!empty($secilenYetkiler)) {
                $aktifKodlar = array_keys($secilenYetkiler);
                if (!empty($aktifKodlar)) {
                    Capsule::table('mod_btk_secili_yetki_turleri')
                        ->whereIn('yetki_kodu', $aktifKodlar)
                        ->update(['aktif' => 1]);
                }
            }
        } catch (\Exception $e) {
            self::logAction('Seçili Yetki Türü Kaydetme Hatası', 'HATA', $e->getMessage());
        }
    }
    
    public static function getWhmcsProductGroups(): array {
        // Gizli ürün gruplarını da dahil etmek için where('hidden',0) kaldırıldı.
        return Capsule::table('tblproductgroups')->orderBy('order')->orderBy('name')->get(['id', 'name', 'headline'])->map(fn($item) => (array)$item)->all();
    }

    public static function getProductGroupMappingsArray(): array {
        // pluck() tek bir sütun döndürdüğünde object olarak dönebilir, map ile array olarak dönüştürüyoruz.
        $mappings = Capsule::table('mod_btk_product_group_mappings')->get()->map(fn($item) => (array)$item)->all();
        $result = [];
        foreach ($mappings as $mapping) {
            $result[$mapping['gid']] = [
                'ana_btk_yetki_kodu' => $mapping['ana_btk_yetki_kodu'],
                'ek3_hizmet_tipi_kodu' => $mapping['ek3_hizmet_tipi_kodu']
            ];
        }
        return $result;
    }

    public static function saveProductGroupMappings(array $mappingsData = []): bool {
        try {
            Capsule::transaction(function () use ($mappingsData) {
                Capsule::table('mod_btk_product_group_mappings')->delete();
                $insertData = [];
                foreach ($mappingsData as $gid => $data) {
                    if (!empty($gid) && is_numeric($gid) && !empty(trim($data['ana_btk_yetki_kodu'])) && !empty(trim($data['ek3_hizmet_tipi_kodu']))) {
                        $insertData[] = [
                            'gid' => (int)$gid,
                            'ana_btk_yetki_kodu' => trim($data['ana_btk_yetki_kodu']),
                            'ek3_hizmet_tipi_kodu' => trim($data['ek3_hizmet_tipi_kodu'])
                        ];
                    }
                }
                if (!empty($insertData)) {
                    Capsule::table('mod_btk_product_group_mappings')->insert($insertData);
                }
            });
            return true;
        } catch (\Exception $e) {
            self::logAction('Ürün Grubu Eşleştirme Hatası', 'HATA', $e->getMessage());
            return false;
        }
    }

    // ==================================================================
    // == BÖLÜM 9: LOG YÖNETİMİ
    // ==================================================================

    public static function getLogsWithPagination(array $filters = []): array
    {
        $generalQuery = Capsule::table('mod_btk_logs');
        $ftpQuery = Capsule::table('mod_btk_ftp_logs');

        // General Logs Filtreleri
        if (!empty($filters['s_log_level'])) {
            $generalQuery->where('log_seviyesi', strtoupper($filters['s_log_level']));
        }
        if (!empty($filters['s_log_search_term'])) {
            $term = '%' . $filters['s_log_search_term'] . '%';
            $generalQuery->where(function($q) use ($term) {
                $q->where('islem', 'LIKE', $term)->orWhere('mesaj', 'LIKE', $term);
            });
        }

        // FTP Logs Filtreleri (Ortak arama terimi FTP loglarında dosya adını arar)
        if (!empty($filters['s_log_search_term'])) {
            $term = '%' . $filters['s_log_search_term'] . '%';
            $ftpQuery->where('dosya_adi', 'LIKE', $term);
        }
        
        // Tarih aralığı her iki log türü için de geçerlidir
        if (!empty($filters['s_log_date_range'])) {
            $dateRange = explode(' to ', $filters['s_log_date_range']);
            if (count($dateRange) === 2) {
                $generalQuery->whereBetween('log_zamani', [$dateRange[0] . ' 00:00:00', $dateRange[1] . ' 23:59:59']);
                $ftpQuery->whereBetween('gonderim_zamani', [$dateRange[0] . ' 00:00:00', $dateRange[1] . ' 23:59:59']);
            }
        }
        
        $limit = (int)self::get_btk_setting('log_records_per_page', 50);
        
        // General Logs
        $totalGeneral = $generalQuery->count();
        $pageGeneral = (int)($filters['page_general'] ?? 1);
        $offsetGeneral = ($pageGeneral - 1) * $limit;
        $generalData = $generalQuery->orderBy('id', 'desc')->skip($offsetGeneral)->take($limit)->get()->map(fn($item) => (array)$item)->all();

        // FTP Logs
        $totalFtp = $ftpQuery->count();
        $pageFtp = (int)($filters['page_ftp'] ?? 1);
        $offsetFtp = ($pageFtp - 1) * $limit;
        $ftpData = $ftpQuery->orderBy('id', 'desc')->skip($offsetFtp)->take($limit)->get()->map(fn($item) => (array)$item)->all();
        
        return [
            'general' => ['data' => $generalData, 'pagination' => self::buildPagination(array_merge($filters, ['page_general' => $pageGeneral]), $totalGeneral, $limit, $pageGeneral, 'viewlogs')],
            'ftp' => ['data' => $ftpData, 'pagination' => self::buildPagination(array_merge($filters, ['page_ftp' => $pageFtp]), $totalFtp, $limit, $pageFtp, 'viewlogs')]
        ];
    }
    
    public static function deleteAllLogs(array $LANG): array
    {
        try {
            Capsule::table('mod_btk_logs')->truncate();
            Capsule::table('mod_btk_ftp_logs')->truncate();
            self::logAction('Tüm Loglar Silindi', 'UYARI', 'Tüm modül ve FTP günlük kayıtları silindi.');
            return ['type' => 'success', 'message' => $LANG['logsDeletedSuccess'] ?? 'Tüm günlük kayıtları başarıyla silindi.'];
        } catch (\Exception $e) {
            self::logAction('Log Silme Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Loglar silinirken bir hata oluştu.'];
        }
    }

    // ==================================================================
    // == BÖLÜM 10: RAPORLAMA YARDIMCILARI VE DASHBOARD
    // ==================================================================

    public static function formatAbnRow(array $dataArray, array $btkAlanSiralamasi): string
    {
        $rowValues = [];
        foreach ($btkAlanSiralamasi as $btkFieldKey) {
            $dbFieldKey = strtolower($btkFieldKey);
            $value = $dataArray[$dbFieldKey] ?? $dataArray[strtoupper($btkFieldKey)] ?? '';
            $rowValues[] = str_replace(['|', ';', "\r", "\n"], ' ', (string)$value);
        }
        return implode('|;|', $rowValues);
    }
    
    public static function getBtkAlanSiralamasi(string $raporTuru = 'REHBER', ?string $yetkiTuruGrup = null): array
    {
        $ortakAlanlar = [
            'OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU',
            'HAT_DURUM_KODU_ACIKLAMA', 'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC',
            'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO', 'ABONE_PASAPORT_NO',
            'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI', 'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET',
            'ABONE_UYRUK', 'ABONE_BABA_ADI', 'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI',
            'ABONE_DOGUM_YERI', 'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE',
            'ABONE_KIMLIK_TIPI', 'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER',
            'ABONE_KIMLIK_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI', 
            'YERLESIM_IL', 'YERLESIM_ILCE', 'YERLESIM_MAHALLE', 'YERLESIM_CADDE', 'YERLESIM_DIS_KAPI_NO', 'YERLESIM_IC_KAPI_NO',
            'IRTIBAT_TEL_NO_1', 'IRTIBAT_TEL_NO_2', 'ABONE_EMAIL',
            'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO', 'KURUM_YETKILI_TELEFON',
            'STATIK_IP'
        ];

        if(strtoupper($raporTuru) === 'HAREKET') {
            array_splice($ortakAlanlar, 6, 0, ['MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA', 'MUSTERI_HAREKET_ZAMANI']);
        }

        $ozelAlanlar = [];
        switch (strtoupper($yetkiTuruGrup ?? '')) {
            case 'ISS': $ozelAlanlar = ['ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI']; break;
            // Diğer yetki gruplarına özel alanlar buraya eklenebilir.
        }
        return array_merge($ortakAlanlar, $ozelAlanlar);
    }

    public static function getNextCronRuns(array $settings): array
    {
        $runs = [];
        $schedules = [
            'rehber' => $settings['rehber_cron_schedule'] ?? null,
            'hareket' => $settings['hareket_cron_schedule'] ?? null,
            'personel' => $settings['personel_cron_schedule'] ?? null,
            'monitor' => ($settings['pop_monitoring_enabled'] ?? '0') === '1' ? ($settings['pop_monitoring_cron_schedule'] ?? null) : null,
        ];

        foreach ($schedules as $key => $schedule) {
            if ($schedule && CronExpression::isValidExpression($schedule)) {
                try {
                    $cron = CronExpression::factory($schedule);
                    $nextRunDate = $cron->getNextRunDate('now', 0, false, date_default_timezone_get());
                    $runs[$key] = $nextRunDate->format('Y-m-d H:i:s T');
                } catch (\Exception $e) {
                     $runs[$key] = self::getLang('invalidCronExpression');
                }
            } else {
                $runs[$key] = self::getLang('notConfigured');
            }
        }
        return $runs;
    }

    public static function getMonitoringStats(): array
    {
        $stats = Capsule::table('mod_btk_iss_pop_noktalari')
            ->where('izleme_aktif', 1)
            ->selectRaw("COUNT(*) as total, 
                         SUM(CASE WHEN canli_durum = 'ONLINE' THEN 1 ELSE 0 END) as online,
                         SUM(CASE WHEN canli_durum = 'OFFLINE' THEN 1 ELSE 0 END) as offline,
                         SUM(CASE WHEN canli_durum = 'HIGH_LATENCY' THEN 1 ELSE 0 END) as high_latency")
            ->first();

        return [
            'is_enabled' => (self::get_btk_setting('pop_monitoring_enabled', '0') === '1'),
            'total' => (int)($stats->total ?? 0),
            'online' => (int)($stats->online ?? 0),
            'offline' => (int)($stats->offline ?? 0),
            'high_latency' => (int)($stats->high_latency ?? 0),
        ];
    }
    
    public static function getLastSubmissions(): array
    {
        $lastSubmissions = [];
        $aktifGruplar = self::getAktifYetkiTurleri('array_grup_names_only');

        if (!empty($aktifGruplar)) {
            foreach ($aktifGruplar as $grup) {
                $lastRehber = self::getLastSuccessfulReportInfo('REHBER', 'ANA', $grup);
                $lastHareket = self::getLastSuccessfulReportInfo('HAREKET', 'ANA', $grup);
                $lastSubmissions[$grup]['REHBER'] = [
                    'tarih_saat' => $lastRehber ? date("d.m.Y H:i:s", strtotime($lastRehber['gonderim_zamani'] . ' UTC')) : (self::getLang('noSubmissionYet')),
                    'dosya_adi' => $lastRehber['dosya_adi'] ?? '-',
                    'cnt' => $lastRehber['cnt_numarasi'] ?? '-'
                ];
                $lastSubmissions[$grup]['HAREKET'] = [
                    'tarih_saat' => $lastHareket ? date("d.m.Y H:i:s", strtotime($lastHareket['gonderim_zamani'] . ' UTC')) : (self::getLang('noSubmissionYet')),
                    'dosya_adi' => $lastHareket['dosya_adi'] ?? '-',
                    'cnt' => $lastHareket['cnt_numarasi'] ?? '-'
                ];
            }
        }
        
        $lastPersonel = self::getLastSuccessfulReportInfo('PERSONEL', 'ANA');
        $lastSubmissions['PERSONEL'] = [
            'tarih_saat' => $lastPersonel ? date("d.m.Y H:i:s", strtotime($lastPersonel['gonderim_zamani'] . ' UTC')) : (self::getLang('noSubmissionYet')),
            'dosya_adi' => $lastPersonel['dosya_adi'] ?? '-',
            'cnt' => $lastPersonel['cnt_numarasi'] ?? '-'
        ];

        return $lastSubmissions;
    }

    public static function getLastSuccessfulReportInfo(string $raporTuru, string $ftpSunucuTipi = 'ANA', ?string $yetkiTuruGrup = null): ?array
    {
        try {
            $query = Capsule::table('mod_btk_ftp_logs')
                ->where('rapor_turu', strtoupper($raporTuru))
                ->where('ftp_sunucu_tipi', strtoupper($ftpSunucuTipi))
                ->where('durum', 'Basarili');
            
            if ($yetkiTuruGrup !== null && strtoupper($raporTuru) !== 'PERSONEL') {
                 $query->where('yetki_turu_grup', strtoupper($yetkiTuruGrup));
            }
                
            $log = $query->orderBy('gonderim_zamani', 'DESC')->first();
            
            return $log ? (array)$log : null;

        } catch (\Exception $e) {
            self::logAction('Son Rapor Bilgisi Okuma Hatası', 'HATA', "Rapor: $raporTuru, Hata: " . $e->getMessage());
            return null;
        }
    }
}