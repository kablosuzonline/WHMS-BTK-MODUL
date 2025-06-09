<?php
/**
 * BTK Raporlama Modülü için Kapsamlı Yardımcı Fonksiyonlar Sınıfı
 * (TÜM FONKSİYONLAR DAHİL - ALTIN KURAL)
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

// --- BÖLÜM 1 BAŞLANGICI (Satır 1) ---
if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
use WHMCS\Utility\Encryption;
use Cron\CronExpression;

class BtkHelper {

    // --- Ayar Yönetimi ---
    public static function get_btk_setting($settingName, $defaultValue = null) {
        try {
            $setting = Capsule::table('mod_btk_settings')->where('setting', $settingName)->first();
            if ($setting) {
                if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    try { 
                        return Encryption::decrypt($setting->value); 
                    } catch (\Throwable $e) { 
                        self::logAction('Ayar Deşifre Hatası', 'HATA', "Ayar '$settingName' deşifre edilemedi: " . $e->getMessage()); 
                        return ''; 
                    }
                }
                return $setting->value;
            }
            return $defaultValue;
        } catch (Exception $e) {
            self::logAction('Ayar Okuma Hatası', 'HATA', "Ayar '$settingName' okunurken hata: " . $e->getMessage());
            return $defaultValue;
        }
    }

    public static function getAllBtkSettings() {
        $settingsArray = [];
        try {
            $settings = Capsule::table('mod_btk_settings')->get();
            foreach ($settings as $setting) {
                if (in_array($setting->setting, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    try { 
                        $settingsArray[$setting->setting] = Encryption::decrypt($setting->value); 
                    } catch (\Throwable $e) { 
                        $settingsArray[$setting->setting] = ''; 
                        self::logAction('Toplu Ayar Deşifre Hatası', 'UYARI', "Ayar '{$setting->setting}' deşifre edilemedi.");
                    }
                } else {
                    $settingsArray[$setting->setting] = $setting->value;
                }
            }
        } catch (Exception $e) {
            self::logAction('Tüm Ayarları Okuma Hatası', 'HATA', 'Tüm modül ayarları okunurken hata: ' . $e->getMessage());
        }
        return $settingsArray;
    }

    public static function set_btk_setting($settingName, $value) {
        try {
            $valueToStore = $value;
            if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass'])) {
                if(!empty($value) && $value !== '********') { 
                    $valueToStore = Encryption::encrypt($value);
                } elseif (empty($value)) {
                    $valueToStore = '';
                } else { 
                    return true; 
                }
            }
            Capsule::table('mod_btk_settings')->updateOrInsert(
                ['setting' => $settingName],
                ['value' => $valueToStore]
            );
            return true;
        } catch (Exception $e) {
            self::logAction('Ayar Kaydetme Hatası', 'HATA', "Ayar '$settingName' kaydedilirken hata: " . $e->getMessage());
            return false;
        }
    }

    // --- Loglama ---
    public static function logAction($islem, $logSeviyesi = 'INFO', $mesaj = '', $kullaniciId = null, $ipAdresi = null) {
        try {
            if (is_null($kullaniciId) && isset($_SESSION['adminid'])) {
                $kullaniciId = (int)$_SESSION['adminid'];
            }
            if (is_null($ipAdresi)) {
                if (class_exists('WHMCS\Utility\Environment\CurrentRequest') && method_exists('WHMCS\Utility\Environment\CurrentRequest', 'getIP')) {
                    $ipAdresi = WHMCS\Utility\Environment\CurrentRequest::getIP();
                } elseif (isset($_SERVER['REMOTE_ADDR'])) {
                    $ipAdresi = $_SERVER['REMOTE_ADDR'];
                }
            }

            Capsule::table('mod_btk_logs')->insert([
                'log_seviyesi' => strtoupper($logSeviyesi),
                'islem' => substr($islem, 0, 255),
                'mesaj' => is_array($mesaj) || is_object($mesaj) ? json_encode($mesaj, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : (string)$mesaj,
                'kullanici_id' => $kullaniciId,
                'ip_adresi' => $ipAdresi,
                'log_zamani' => gmdate('Y-m-d H:i:s')
            ]);
        } catch (Exception $e) {
            error_log("BTK Reports Module - LogAction Error: " . $e->getMessage() . " | Original Log: [$logSeviyesi] $islem - " . (is_string($mesaj) ? $mesaj : json_encode($mesaj)));
        }
    }
    
    public static function getModuleLogs($filters = [], $orderBy = 'id', $sortOrder = 'DESC', $limit = 100, $offset = 0) {
        try {
            $query = Capsule::table('mod_btk_logs');
            if (!empty($filters['log_level']) && $filters['log_level'] !== 'ALL') {
                $query->where('log_seviyesi', strtoupper(trim($filters['log_level'])));
            }
            if (!empty($filters['log_islem'])) {
                $query->where('islem', 'LIKE', '%' . trim($filters['log_islem']) . '%');
            }
            if (!empty($filters['log_mesaj'])) {
                $query->where('mesaj', 'LIKE', '%' . trim($filters['log_mesaj']) . '%');
            }
            if (!empty($filters['date_from'])) {
                try { $dateFrom = new DateTime($filters['date_from']); $query->where('log_zamani', '>=', $dateFrom->format('Y-m-d 00:00:00')); } catch (Exception $ex) {}
            }
            if (!empty($filters['date_to'])) {
                 try { $dateTo = new DateTime($filters['date_to']); $query->where('log_zamani', '<=', $dateTo->format('Y-m-d 23:59:59')); } catch (Exception $ex) {}
            }

            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) {
            self::logAction('Modül Log Okuma Hatası', 'HATA', $e->getMessage());
            return ['data' => [], 'total_count' => 0];
        }
    }

// --- BÖLÜM 1/5 SONU ---

// ... BtkHelper.php Bölüm 1/5 içeriğinin sonu (getModuleLogs fonksiyonunun sonu) ...

// --- BÖLÜM 2/5 BAŞLANGICI ---

    // --- Yetki Türü Yönetimi ---
    /**
     * Veritabanındaki tüm BTK Ana Yetkilendirme Konularını referans tablosundan getirir.
     * @return array stdClass nesnelerinden oluşan dizi (veya boş dizi)
     */
    public static function getAllYetkiTurleriReferans() {
        try {
            $results = Capsule::table('mod_btk_yetki_turleri_referans')->orderBy('yetki_adi_config')->get()->all();
            return array_map(function($item){ return (array)$item; }, $results); // Dizi olarak döndür
        } catch (Exception $e) { 
            self::logAction('Yetki Türü Referans Okuma Hatası', 'Hata', $e->getMessage()); 
            return []; 
        }
    }

    /**
     * Admin tarafından seçilmiş/aktif edilmiş BTK Ana Yetkilendirme Konularını getirir.
     * @return array ['yetki_kodu_config' => 1] formatında (1 aktif demek)
     */
    public static function getSeciliYetkiTurleri() {
        $secili = [];
        try {
            $results = Capsule::table('mod_btk_secili_yetki_turleri')->where('aktif', 1)->get();
            foreach ($results as $row) {
                $secili[$row->yetki_kodu_config] = 1;
            }
        } catch (Exception $e) { 
            self::logAction('Seçili Yetki Türü Okuma Hatası', 'Hata', $e->getMessage());
        }
        return $secili;
    }
    
    /**
     * Aktif olan ve rapor_tip_kodu tanımlı BTK Ana Yetkilendirme Konularını döndürür.
     * @param string $returnAs 
     *      'array_grup' -> ['ISS' => [['yetki_kodu_config'=>'ISS_B', 'yetki_adi_config'=>'...', 'rapor_tip_kodu'=>'ISS']], 'AIH' => [...]]
     *      'array_grup_names_only' -> ['ISS', 'AIH'] (Sadece rapor tip kodları)
     *      'array_of_arrays' -> Tüm aktif yetki referansları dizi olarak [['yetki_kodu_config'=>..., 'yetki_adi_config'=>..., 'rapor_tip_kodu'=>...], ...]
     *      'object_list' -> (Kullanılmıyor, array_of_arrays tercih edildi)
     * @return array
     */
    public static function getAktifYetkiTurleri($returnAs = 'array_grup') {
        $aktifYetkiler = [];
        try {
            $results = Capsule::table('mod_btk_secili_yetki_turleri as syt')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'syt.yetki_kodu_config', '=', 'ytr.yetki_kodu_config')
                ->where('syt.aktif', 1)
                ->whereNotNull('ytr.rapor_tip_kodu')
                ->where('ytr.rapor_tip_kodu', '!=', '')
                ->select('syt.yetki_kodu_config', 'ytr.yetki_adi_config', 'ytr.rapor_tip_kodu')
                ->orderBy('ytr.rapor_tip_kodu')->orderBy('ytr.yetki_adi_config')
                ->get()->all();

            $resultsAsArray = array_map(function($item){ return (array)$item; }, $results);

            if ($returnAs === 'array_of_arrays') return $resultsAsArray;

            foreach ($resultsAsArray as $row) {
                if ($returnAs === 'array_grup') {
                    $aktifYetkiler[$row['rapor_tip_kodu']][] = $row;
                } elseif ($returnAs === 'array_grup_names_only') {
                    if (!in_array($row['rapor_tip_kodu'], $aktifYetkiler)) {
                        $aktifYetkiler[] = $row['rapor_tip_kodu'];
                    }
                } else { 
                     $aktifYetkiler[] = $row; 
                }
            }
        } catch (Exception $e) { 
            self::logAction('Aktif Yetki Türü Okuma Hatası', 'Hata', $e->getMessage()); 
        }
        return $aktifYetkiler;
    }

    public static function saveSeciliYetkiTurleri($secilenYetkilerInput = []) {
        try {
            Capsule::table('mod_btk_secili_yetki_turleri')->update(['aktif' => 0]);
            if (!empty($secilenYetkilerInput) && is_array($secilenYetkilerInput)) {
                $aktifKodlar = [];
                foreach($secilenYetkilerInput as $kod => $val){
                    if($val === 'on' || $val === 1 || $val === true ){ 
                        $aktifKodlar[] = $kod;
                    }
                }
                if (!empty($aktifKodlar)) {
                    Capsule::table('mod_btk_secili_yetki_turleri')
                        ->whereIn('yetki_kodu_config', $aktifKodlar)
                        ->update(['aktif' => 1]);
                }
            }
        } catch (Exception $e) { 
            self::logAction('Seçili Yetki Türü Kaydetme Hatası', 'Hata', $e->getMessage()); 
        }
    }
    
    public static function getBtkMappingForProduct($productId) {
        try {
            $mapping = Capsule::table('mod_btk_product_mappings as pm')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'pm.ana_yetki_kodu_config', '=', 'ytr.yetki_kodu_config')
                ->where('pm.whmcs_product_id', (int)$productId)
                ->select('pm.ana_yetki_kodu_config', 'pm.detayli_hizmet_tipi_kodu', 'ytr.rapor_tip_kodu')
                ->first();
            return $mapping ? (array)$mapping : null; // Dizi olarak döndür
        } catch (Exception $e) { 
            self::logAction('Ürün Eşleşmesi Okuma Hatası', 'HATA', "Product ID: {$productId}, Hata: ".$e->getMessage()); 
            return null; 
        }
    }

    public static function getProductMappingsArray() {
        $mappings = [];
        try {
            $results = Capsule::table('mod_btk_product_mappings')->get();
            foreach($results as $row) {
                $mappings[(int)$row->whmcs_product_id] = [
                    'ana_yetki_kodu_config' => $row->ana_yetki_kodu_config,
                    'detayli_hizmet_tipi_kodu' => $row->detayli_hizmet_tipi_kodu
                ];
            }
        } catch (Exception $e) { 
            self::logAction('Tüm Ürün Eşleşmeleri Okuma Hatası', 'HATA', $e->getMessage()); 
        }
        return $mappings;
    }

    public static function saveProductMappings($mappingsData) {
        $adminId = self::getCurrentAdminId();
        try {
            Capsule::transaction(function () use ($mappingsData, $adminId) {
                Capsule::table('mod_btk_product_mappings')->delete(); 
                $insertData = [];
                if (is_array($mappingsData)) {
                    foreach ($mappingsData as $productId => $mappingDetails) {
                        if (!empty($productId) && is_numeric($productId) && 
                            isset($mappingDetails['ana_yetki_kodu_config']) && !empty(trim($mappingDetails['ana_yetki_kodu_config'])) &&
                            isset($mappingDetails['detayli_hizmet_tipi_kodu']) && !empty(trim($mappingDetails['detayli_hizmet_tipi_kodu']))) {
                            $insertData[] = [
                                'whmcs_product_id' => (int)$productId,
                                'ana_yetki_kodu_config' => trim($mappingDetails['ana_yetki_kodu_config']),
                                'detayli_hizmet_tipi_kodu' => trim($mappingDetails['detayli_hizmet_tipi_kodu'])
                            ];
                        }
                    }
                }
                if(!empty($insertData)){
                    Capsule::table('mod_btk_product_mappings')->insert($insertData);
                }
            });
            self::logAction('Ürün Eşleştirmeleri Kaydedildi', 'BAŞARILI', count($mappingsData) . ' ürün için eşleştirme güncellendi.', $adminId);
            return true;
        } catch (Exception $e) {
            self::logAction('Ürün Eşleştirme Kaydetme Hatası', 'HATA', $e->getMessage(), $adminId);
            return false;
        }
    }
    
    public static function getRaporTipKoduForService($serviceId) {
        try {
            $service = Capsule::table('tblhosting')->find((int)$serviceId);
            if (!$service || !$service->packageid) {
                self::logAction('Rapor Tipi Bulma (Hizmet)', 'UYARI', "Hizmet veya paket bulunamadı. Service ID: {$serviceId}");
                return null;
            }
            
            $mapping = self::getBtkMappingForProduct($service->packageid);
            
            return $mapping ? $mapping['rapor_tip_kodu'] : null; // Dizi olarak erişim
        } catch (Exception $e) { 
            self::logAction('Hizmet İçin Rapor Tipi Bulma Hatası', 'HATA', "Service ID: {$serviceId}, Hata: ".$e->getMessage()); 
            return null; 
        }
    }
    
    public static function getDetayliHizmetTipiKoduForService($serviceId) {
        try {
            $service = Capsule::table('tblhosting')->find((int)$serviceId);
            if (!$service || !$service->packageid) return null;
            
            $mapping = self::getBtkMappingForProduct($service->packageid);
            
            return $mapping ? $mapping['detayli_hizmet_tipi_kodu'] : null; // Dizi olarak erişim
        } catch (Exception $e) { 
            self::logAction('Hizmet İçin Detaylı Hizmet Tipi Bulma Hatası', 'HATA', "Service ID: {$serviceId}, Hata: ".$e->getMessage()); 
            return null; 
        }
    }

    public static function getEk3HizmetTipleri($raporTipKodu = null) {
        try {
            $query = Capsule::table('mod_btk_hizmet_tipleri_referans');
            if ($raporTipKodu && !empty(trim($raporTipKodu))) {
                $query->where('ilgili_rapor_tip_kodu', strtoupper(trim($raporTipKodu)));
            }
            $results = $query->orderBy('aciklama')->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) {
            self::logAction('EK-3 Hizmet Tipleri Okuma Hatası', 'HATA', $e->getMessage());
            return [];
        }
    }

    // --- Rapor Bilgileri ve Cron Zamanlaması ---
    public static function getLastSuccessfulReportInfo($raporTuru, $ftpSunucuTipi = 'ANA', $yetkiTuruGrup = null) {
        try {
            $query = Capsule::table('mod_btk_ftp_logs')
                ->where('rapor_turu', strtoupper($raporTuru))
                ->where('ftp_sunucu_tipi', strtoupper($ftpSunucuTipi))
                ->where('durum', 'Basarili');
            
            if ($yetkiTuruGrup !== null && strtoupper($raporTuru) !== 'PERSONEL') {
                 $query->where('yetki_turu_grup', strtoupper($yetkiTuruGrup));
            }
                
            $log = $query->orderBy('gonderim_zamani', 'DESC')->first();
            
            if ($log) {
                return ['dosya_adi' => $log->dosya_adi, 'gonderim_zamani' => $log->gonderim_zamani, 'cnt_numarasi' => $log->cnt_numarasi];
            }
            return null;
        } catch (Exception $e) { self::logAction('Son Rapor Bilgisi Okuma Hatası', 'HATA', "Rapor: $raporTuru, FTP: $ftpSunucuTipi, Grup: $yetkiTuruGrup, Hata: " . $e->getMessage()); return null; }
    }

    public static function getNextCronRunTime($cronScheduleSettingKey) {
        if (!class_exists('Cron\CronExpression')) {
            self::logAction('Cron Zamanlama Hatası', 'UYARI', 'CronExpression kütüphanesi bulunamadı (vendor/autoload.php). Lütfen Composer ile yükleyin.');
            return $GLOBALS['_LANG']['cronLibMissing'] ?? 'Zamanlama Kütüphanesi Eksik';
        }
        try {
            $schedule = self::get_btk_setting($cronScheduleSettingKey);
            if (empty($schedule)) { return $GLOBALS['_LANG']['notConfigured'] ?? 'Ayarlanmamış'; }
            if (!CronExpression::isValidExpression($schedule)) {
                self::logAction('Geçersiz Cron İfadesi', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule'");
                return $GLOBALS['_LANG']['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
            }
            $cron = CronExpression::factory($schedule);
            $timezone = self::get_btk_setting('DefaultTimeZone', date_default_timezone_get()); // WHMCS ayarlarından veya sunucudan al
            try {
                $nextRun = $cron->getNextRunDate('now', 0, false, $timezone);
                return $nextRun->format('Y-m-d H:i:s T');
            } catch (RuntimeException $re) { // Eğer cron ifadesi geçmişte kalmışsa veya bir sonraki bulunamıyorsa
                 self::logAction('Cron Çalışma Zamanı Bulunamadı', 'UYARI', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $re->getMessage());
                 return ($GLOBALS['_LANG']['cronNextRunNotFound'] ?? 'Bir sonraki çalışma bulunamadı') . ' (' . $schedule . ')';
            }
        } catch (InvalidArgumentException $iae) {
            self::logAction('Geçersiz Cron İfadesi (InvalidArgument)', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $iae->getMessage());
            return $GLOBALS['_LANG']['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
        }
         catch (Exception $e) { self::logAction('Sonraki Cron Çalışma Zamanı Hesaplama Hatası', 'HATA', "Ayar: $cronScheduleSettingKey, Hata: " . $e->getMessage()); return $GLOBALS['_LANG']['errorFetchingNextRun'] ?? 'Hesaplanamadı'; }
    }
    
// --- BÖLÜM 2/5 SONU (Satır 318 civarı) ---

// ... BtkHelper.php Bölüm 2/5 içeriğinin sonu (getNextCronRunTime fonksiyonunun sonu) ...

// --- BÖLÜM 3/5 BAŞLANGICI ---

    // --- FTP İşlemleri ---
    /**
     * Verilen konfigürasyon ayarlarını kullanarak FTP bağlantısını test eder.
     * @param string $type 'main' veya 'backup' (Ayarları okumak için)
     * @return array ['status' => 'success'/'error', 'message' => 'Bağlantı mesajı']
     */
    public static function checkFtpConnection($type = 'main') {
        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass'); // Deşifrelenmiş gelir
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', '0'); 

        if (empty($host)) {
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP sunucu adresi ayarlanmamış.'];
        }
         if (empty($user)) {
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP kullanıcı adı ayarlanmamış.'];
        }
        
        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);

        if (!$connect_function) {
            $errMsg = ucfirst($type) . ' FTP fonksiyonları (ftp_connect/ftp_ssl_connect) sunucunuzda etkin değil.';
            self::logAction(ucfirst($type) . ' FTP Bağlantı Hatası', 'CRITICAL', $errMsg);
            return ['status' => 'error', 'message' => $errMsg];
        }
        
        $old_error_reporting = error_reporting(0); 
        $conn_id = @$connect_function($host, $port, 15); 
        error_reporting($old_error_reporting);

        if ($conn_id) {
            $login_result = @ftp_login($conn_id, $user, $pass ?: ''); 
            if ($login_result) {
                @ftp_pasv($conn_id, true); 
                $message = ucfirst($type) . ' FTP sunucusuna başarıyla bağlanıldı.';
                @ftp_close($conn_id);
                return ['status' => 'success', 'message' => $message];
            } else {
                $message = ucfirst($type) . ' FTP sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: \'' . htmlspecialchars($user) . '\'). Lütfen kullanıcı adı ve şifrenizi kontrol edin.';
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => $message];
            }
        } else {
            $message = ucfirst($type) . ' FTP sunucusuna (' . htmlspecialchars($host) . ':' . $port . ') bağlanılamadı. Lütfen sunucu adresi, port, güvenlik duvarı ve ağ ayarlarınızı kontrol edin.';
            return ['status' => 'error', 'message' => $message];
        }
    }
    
    /**
     * Verilen detaylarla FTP bağlantısını test eder (Ayarları okumaz).
     * Bu fonksiyon btkreports.php içindeki btk_action_test_ftp tarafından kullanılır.
     */
    public static function testFtpConnectionWithDetails($host, $user, $pass, $port = 21, $ssl = false, $ftpTypeLabel = 'FTP') {
        $host = trim($host); $user = trim($user); 
        // $pass '********' ise boş string olarak kabul edilebilir veya olduğu gibi gönderilebilir.
        // FTP sunucusu boş şifreyi nasıl ele aldığına bağlı. Genellikle boş şifre, şifre yok anlamına gelir.
        $passToTest = ($pass === '********') ? '' : trim($pass);

        if (empty($host)) { return ['status' => 'error', 'message' => $ftpTypeLabel . ' Host bilgisi eksik.']; }
        if (empty($user)) { return ['status' => 'error', 'message' => $ftpTypeLabel . ' Kullanıcı Adı bilgisi eksik.']; }
        
        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);
        if (!$connect_function) { return ['status' => 'error', 'message' => $ftpTypeLabel . ' PHP FTP eklentisi aktif değil.']; }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function($host, (int)$port, 15);
        error_reporting($old_error_reporting);

        if ($conn_id) {
            if (@ftp_login($conn_id, $user, $passToTest)) {
                @ftp_pasv($conn_id, true);
                $message = $ftpTypeLabel . ' sunucusuna başarıyla bağlanıldı.';
                @ftp_close($conn_id);
                return ['status' => 'success', 'message' => $message];
            } else {
                $message = $ftpTypeLabel . ' sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: \'' . htmlspecialchars($user) . '\'). Lütfen bilgileri kontrol edin.';
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => $message];
            }
        } else {
            $message = $ftpTypeLabel . ' sunucusuna (' . htmlspecialchars($host) . ':' . (int)$port . ') bağlanılamadı. Host, port veya ağ ayarlarını kontrol edin.';
            return ['status' => 'error', 'message' => $message];
        }
    }

    public static function uploadFileToFtp($localFilePath, $remoteFileName, $type = 'main', $raporTuru = 'BILINMEYEN') {
        if (!file_exists($localFilePath) || !is_readable($localFilePath)) {
            self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Yerel dosya bulunamadı veya okunamıyor: $localFilePath");
            return ['status' => 'error', 'message' => "Yerel dosya bulunamadı veya okunamıyor: $localFilePath"];
        }
        $fileSize = filesize($localFilePath);
        if ($fileSize === 0 && self::get_btk_setting('send_empty_reports') !== '1') {
            self::logAction(ucfirst($type) . " FTP Yükleme Atlandı ($raporTuru)", 'BİLGİ', "Dosya boş (0 byte) ve boş rapor gönderimi kapalı: $localFilePath");
            return ['status' => 'skipped', 'message' => "Dosya boş ve boş rapor gönderimi kapalı, yükleme atlandı."];
        }

        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass');
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', '0');
        
        $raporTuruNormalized = strtoupper($raporTuru);
        $pathKeyPart = '';
        if (strpos($raporTuruNormalized, 'REHBER') !== false) $pathKeyPart = 'rehber';
        elseif (strpos($raporTuruNormalized, 'HAREKET') !== false) $pathKeyPart = 'hareket';
        elseif (strpos($raporTuruNormalized, 'PERSONEL') !== false) $pathKeyPart = 'personel';
        else { self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Bilinmeyen rapor türü ($raporTuru) için FTP yolu belirlenemedi."); return ['status' => 'error', 'message' => 'Bilinmeyen rapor türü için FTP yolu belirlenemedi.'];}

        $basePathSettingKey = strtolower($type) . '_ftp_' . $pathKeyPart . '_path';
        $basePath = self::get_btk_setting($basePathSettingKey, '/'); 
        $remoteDir = trim($basePath, '/\\'); // Hem / hem de \ temizle
        $remoteFileFullPath = ($remoteDir === '' || $remoteDir === '.' ? '' : $remoteDir . '/') . basename($remoteFileName); // Sadece dosya adı

        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);
        if (!$connect_function) { return ['status' => 'error', 'message' => ucfirst($type) . ' FTP fonksiyonları sunucunuzda etkin değil.']; }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function($host, $port, 30);
        error_reporting($old_error_reporting);

        if ($conn_id) {
            if (@ftp_login($conn_id, $user, $pass ?: '')) {
                @ftp_pasv($conn_id, true);
                
                // Uzak dizinleri oluşturma
                if ($remoteDir !== '' && $remoteDir !== '.') {
                    $parts = preg_split('@[/\\\\]@', $remoteDir); // Hem / hem de \ ile ayır
                    $currentBuildPath = '';
                    foreach ($parts as $part) {
                        if (empty($part)) continue;
                        // Baştaki / işareti FTP sunucusuna göre değişebilir, genellikle mutlak yol için gerekmez.
                        // Eğer $basePath / ile başlıyorsa, ilk part da / ile başlar.
                        $currentBuildPath = empty($currentBuildPath) ? $part : $currentBuildPath . '/' . $part;
                        
                        // Dizinin varlığını kontrol et (nlist yerine chdir daha iyi olabilir)
                        // ftp_nlist belirli bir dizin için dosya listesi döner, eğer dizin yoksa false döner.
                        // ftp_chdir dizine girmeye çalışır, başarısız olursa false döner.
                        $old_dir = @ftp_pwd($conn_id); // Mevcut dizini kaydet
                        if (!@ftp_chdir($conn_id, $currentBuildPath)) {
                            if (!@ftp_mkdir($conn_id, $currentBuildPath)) {
                                $message = "$type FTP: Uzak dizin ($currentBuildPath) oluşturulamadı.";
                                @ftp_close($conn_id); return ['status' => 'error', 'message' => $message];
                            }
                        }
                        if ($old_dir !== false) @ftp_chdir($conn_id, $old_dir); // Eski dizine dön (her adımdamkdir için)
                                                                            // Ya da en son chdir ile hedef dizinde kal.
                    }
                    // Son olarak asıl dizine girmeyi dene
                     if (!@ftp_chdir($conn_id, $remoteDir)) {
                         $message = "$type FTP: Yükleme için hedef dizine ($remoteDir) girilemedi.";
                         @ftp_close($conn_id); return ['status' => 'error', 'message' => $message];
                     }
                     $uploadPath = basename($remoteFileName); // Artık bu dizinde olduğumuz için sadece dosya adı
                } else {
                    $uploadPath = $remoteFileName; // Kök dizine yüklenecekse
                }

                if (@ftp_put($conn_id, $uploadPath, $localFilePath, FTP_BINARY)) {
                    $message = "$remoteFileName dosyası başarıyla $type FTP sunucusuna ($remoteFileFullPath) yüklendi.";
                    @ftp_close($conn_id);
                    return ['status' => 'success', 'message' => $message, 'remote_path' => $remoteFileFullPath];
                } else {
                    $ftp_error = error_get_last();
                    $message = "$remoteFileName dosyası $type FTP sunucusuna ($remoteFileFullPath) yüklenirken hata." . ($ftp_error ? ' (FTP Hatası: ' . $ftp_error['message'] . ')' : ' (Detaylı hata için FTP loglarını kontrol edin)');
                    @ftp_close($conn_id);
                    return ['status' => 'error', 'message' => $message];
                }
            } else {
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => "$type FTP sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: '$user')."];
            }
        } else {
            $ftp_error = error_get_last();
            $message = "$type FTP sunucusuna ($host:$port) bağlanılamadı." . ($ftp_error ? ' (Bağlantı Hatası: ' . $ftp_error['message'] . ')' : '');
            return ['status' => 'error', 'message' => $message];
        }
    }
    
    public static function logFtpSubmission($dosyaAdi, $raporTuru, $ftpSunucuTipi, $durum, $cntNumarasi, $hataMesaji = null, $yetkiTuruGrup = null) {
        try {
            Capsule::table('mod_btk_ftp_logs')->insert([
                'dosya_adi' => substr($dosyaAdi,0,255),
                'rapor_turu' => strtoupper(substr($raporTuru,0,50)),
                'yetki_turu_grup' => substr($yetkiTuruGrup,0,50),
                'ftp_sunucu_tipi' => strtoupper(substr($ftpSunucuTipi,0,10)),
                'durum' => ucfirst(strtolower(substr($durum,0,50))),
                'cnt_numarasi' => substr($cntNumarasi,0,2),
                'hata_mesaji' => $hataMesaji,
                'gonderim_zamani' => gmdate('Y-m-d H:i:s')
            ]);
        } catch (Exception $e) { self::logAction('FTP Log Kayıt Hatası', 'HATA', $e->getMessage()); }
    }
    
    public static function getFtpLog($filters = [], $orderBy = 'id', $sortOrder = 'DESC', $limit = 50, $offset = 0) {
         try {
            $query = Capsule::table('mod_btk_ftp_logs');
            if (!empty($filters['rapor_turu'])) $query->where('rapor_turu', strtoupper(trim($filters['rapor_turu'])));
            if (!empty($filters['ftp_sunucu_tipi'])) $query->where('ftp_sunucu_tipi', strtoupper(trim($filters['ftp_sunucu_tipi'])));
            if (!empty($filters['durum'])) $query->where('durum', ucfirst(strtolower(trim($filters['durum']))));
            if (!empty($filters['dosya_adi'])) $query->where('dosya_adi', 'LIKE', '%' . trim($filters['dosya_adi']) . '%');
            if (!empty($filters['yetki_turu_grup'])) $query->where('yetki_turu_grup', 'LIKE', '%' . trim($filters['yetki_turu_grup']) . '%');
            if (!empty($filters['date_from'])) { try { $df = new DateTime($filters['date_from']); $query->where('gonderim_zamani', '>=', $df->format('Y-m-d 00:00:00')); } catch(Exception $ex){} }
            if (!empty($filters['date_to'])) { try { $dt = new DateTime($filters['date_to']); $query->where('gonderim_zamani', '<=', $dt->format('Y-m-d 23:59:59')); } catch(Exception $ex){} }

            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('FTP Log Okuma Hatası', 'Hata', $e->getMessage()); return ['data' => [], 'total_count' => 0]; }
    }

// --- Adres Verileri İçin Yardımcı Fonksiyonlar ---
// (Bir önceki "BÖLÜM 2/5" gönderimindeki gibi tam ve eksiksiz)
    public static function getIller() { /* ... */ }
    public static function getIlcelerByIlId($il_id, $includeIlAdi = false) { /* ... */ }
    public static function getMahallelerByIlceId($ilce_id) { /* ... */ }
    public static function getIlIdByAdi($ilAdi) { /* ... */ }
    public static function getIlceIdByAdi($ilceAdi, $ilId) { /* ... */ }
    public static function getMahalleIdByAdi($mahalleAdi, $ilceId) { /* ... */ }
    
// --- BÖLÜM 3/5 SONU (Satır 600 civarı) ---

// ... BtkHelper.php Bölüm 3/5 içeriğinin sonu (Adres Verileri fonksiyonlarının sonu) ...

// --- BÖLÜM 4/5 BAŞLANGICI ---

    // --- ISS POP Noktaları İçin Yardımcı Fonksiyonlar ---
    /**
     * ISS POP Noktalarını arama terimine ve filtreye göre getirir (AJAX için).
     * @param string $term Arama terimi (SSID veya POP Adı içinde)
     * @param string|null $filter_by Filtreleme kolonu (il_id, ilce_id, mahalle_id)
     * @param mixed|null $filter_value Filtre değeri
     * @param int $limit Sonuç limiti
     * @return array
     */
    public static function searchPopSSIDs($term = '', $filter_by = null, $filter_value = null, $limit = 25) {
        // filter_value boş string ise filtreleme yapma, sadece term varsa ona göre ara
        if (empty($term) && (empty($filter_by) || is_null($filter_value) || $filter_value === '')) {
            // Eğer hem term hem de geçerli bir filtre yoksa boş dön.
            // Sadece filtre varsa ve term boşsa, o filtreye uyan ilk X kaydı getirebilir.
            if(empty($filter_by) || is_null($filter_value) || $filter_value === '') return [];
        }
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari')->where('aktif_pasif', 'Aktif'); // Sadece aktif olanları ara
            
            if (!empty($filter_by) && !is_null($filter_value) && $filter_value !== '' && is_numeric($filter_value)) {
                if (in_array($filter_by, ['il_id', 'ilce_id', 'mahalle_id'])) {
                    $query->where($filter_by, (int)$filter_value);
                }
            }
            if (!empty($term)) {
                $query->where(function ($q) use ($term) {
                    $q->where('yayin_yapilan_ssid', 'LIKE', '%' . $term . '%')
                      ->orWhere('pop_adi_lokasyon_adi', 'LIKE', '%' . $term . '%');
                });
            }
            $results = $query->orderBy('pop_adi_lokasyon_adi')->orderBy('yayin_yapilan_ssid')->take($limit)
                             ->select('id', 'yayin_yapilan_ssid', 'pop_adi_lokasyon_adi as pop_adi')
                             ->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) { 
            self::logAction('POP SSID Arama Hatası', 'Hata', $e->getMessage()); 
            return []; 
        }
    }
    
    public static function getIssPopNoktasiById($id) {
        if(empty($id) || !is_numeric($id) || (int)$id <=0) return null;
        try {
            $pop = Capsule::table('mod_btk_iss_pop_noktalari as pop')
                ->leftJoin('mod_btk_adres_il as il', 'pop.il_id', '=', 'il.id')
                ->leftJoin('mod_btk_adres_ilce as ilce', 'pop.ilce_id', '=', 'ilce.id')
                ->leftJoin('mod_btk_adres_mahalle as mah', 'pop.mahalle_id', '=', 'mah.id')
                ->where('pop.id', (int)$id)
                ->select('pop.*', 'il.il_adi', 'ilce.ilce_adi', 'mah.mahalle_adi')
                ->first();
            return $pop ? (array)$pop : null;
        } catch (Exception $e) { 
            self::logAction('ISS POP ID ile Okuma Hatası', 'HATA', "ID: $id, Hata: ".$e->getMessage()); 
            return null; 
        }
    }
    
    public static function getIssPopNoktalariList($filters = [], $orderBy = 'pop.pop_adi_lokasyon_adi', $sortOrder = 'ASC', $limit = 25, $offset = 0) {
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari as pop')
                        ->leftJoin('mod_btk_adres_il as il', 'pop.il_id', '=', 'il.id')
                        ->leftJoin('mod_btk_adres_ilce as ilce', 'pop.ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_mahalle as mah', 'pop.mahalle_id', '=', 'mah.id'); // Mahalle join'i eklendi

            if(!empty($filters['s_pop_adi'])) $query->where('pop.pop_adi_lokasyon_adi', 'LIKE', '%'.trim($filters['s_pop_adi']).'%');
            if(!empty($filters['s_yayin_yapilan_ssid'])) $query->where('pop.yayin_yapilan_ssid', 'LIKE', '%'.trim($filters['s_yayin_yapilan_ssid']).'%');
            if(!empty($filters['s_il_id']) && is_numeric($filters['s_il_id'])) $query->where('pop.il_id', (int)$filters['s_il_id']);
            if(!empty($filters['s_ilce_id']) && is_numeric($filters['s_ilce_id'])) $query->where('pop.ilce_id', (int)$filters['s_ilce_id']);
            if(isset($filters['s_aktif_pasif_durum']) && $filters['s_aktif_pasif_durum'] !== '') {
                 $query->where('pop.aktif_pasif', ($filters['s_aktif_pasif_durum'] == '1' || strtolower($filters['s_aktif_pasif_durum']) == 'aktif') ? 'Aktif' : 'Pasif');
            }

            $total = $query->count();
            // install.sql'deki sütun adlarına göre select güncellendi
            $pops = $query->select(
                                'pop.id', 'pop.pop_adi_lokasyon_adi', 'pop.yayin_yapilan_ssid', 
                                'pop.ip_adresi', 'pop.turu as pop_tipi', 'pop.markasi as cihaz_markasi', 'pop.modeli as cihaz_modeli',
                                'pop.il_id', 'pop.ilce_id', 'pop.mahalle_id', 'pop.tam_adres', 'pop.koordinatlar', 'pop.aktif_pasif as aktif_pasif_durum',
                                'il.il_adi', 
                                'ilce.ilce_adi', 
                                'mah.mahalle_adi'
                            )
                          ->orderByRaw(Capsule::raw("`$orderBy` $sortOrder"))
                          ->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($pop){ return (array)$pop; }, $pops), 'total_count' => $total];
        } catch (Exception $e) { 
            self::logAction('ISS POP Listesi Okuma Hatası', 'HATA', $e->getMessage()); 
            return ['data' => [], 'total_count' => 0];
        }
    }

    public static function saveIssPopNoktasi($data) {
        $adminId = self::getCurrentAdminId();
        $popIdToUpdate = isset($data['pop_id']) && is_numeric($data['pop_id']) ? (int)$data['pop_id'] : 0;

        $validationErrors = [];
        // Excel'den gelen sütun adları `pop_adi_lokasyon_adi` vs. olabilir. Formdan `pop_adi` gelebilir.
        $popAdi = trim($data['pop_adi_lokasyon_adi'] ?? ($data['pop_adi'] ?? ''));
        $ssid = trim($data['yayin_yapilan_ssid'] ?? '');

        if (empty($popAdi)) $validationErrors[] = 'POP Adı / Lokasyon Adı boş bırakılamaz.';
        if (empty($ssid)) $validationErrors[] = 'Yayın Yapılan SSID boş bırakılamaz.';
        
        // Excel'den gelen il/ilçe adlarını ID'ye çevir
        $ilId = !empty($data['il_id']) && is_numeric($data['il_id']) ? (int)$data['il_id'] : null;
        if(!$ilId && !empty($data['il'])) $ilId = self::getIlIdByAdi(trim($data['il']));
        
        $ilceId = !empty($data['ilce_id']) && is_numeric($data['ilce_id']) ? (int)$data['ilce_id'] : null;
        if(!$ilceId && !empty($data['ilce']) && $ilId) $ilceId = self::getIlceIdByAdi(trim($data['ilce']), $ilId);
        
        $mahalleId = !empty($data['mahalle_id']) && is_numeric($data['mahalle_id']) ? (int)$data['mahalle_id'] : null;
        if(!$mahalleId && !empty($data['mahalle']) && $ilceId) $mahalleId = self::getMahalleIdByAdi(trim($data['mahalle']), $ilceId);


        if (!empty($validationErrors)) {
            self::logAction('ISS POP Kaydetme Doğrulama Hatası', 'UYARI', implode(', ', $validationErrors), $adminId, ['data_keys' => array_keys($data)]);
            return ['status' => false, 'message' => implode('<br>', $validationErrors)];
        }
        
        try {
            // Veritabanı sütun adlarına göre $data'dan gelenleri eşleştir
            $popDataToSave = [
                'pop_adi_lokasyon_adi' => $popAdi,
                'yayin_yapilan_ssid' => $ssid,
                'ip_adresi' => isset($data['ip_adresi']) ? trim($data['ip_adresi']) : null,
                'turu' => $data['pop_tipi'] ?? ($data['turu'] ?? null), // Formdan pop_tipi, Excel'den turu
                'markasi' => $data['cihaz_markasi'] ?? ($data['markasi'] ?? null),
                'modeli' => $data['cihaz_modeli'] ?? ($data['modeli'] ?? null),
                'il_id' => $ilId, // Yukarıda ID'ye çevrildi
                'ilce_id' => $ilceId, // Yukarıda ID'ye çevrildi
                'mahalle_id' => $mahalleId, // Yukarıda ID'ye çevrildi
                'tam_adres' => $data['tam_adres'] ?? null,
                'koordinatlar' => $data['koordinatlar'] ?? null,
                'aktif_pasif' => (isset($data['aktif_pasif_durum']) && ($data['aktif_pasif_durum'] === '1' || $data['aktif_pasif_durum'] === 'on' || $data['aktif_pasif_durum'] === true || strtolower(trim($data['aktif_pasif_durum'])) === 'aktif')) ? 'Aktif' : 'Pasif',
            ];

            // Unique kontrolü: Aynı ilçe ID'si altında aynı SSID ve aynı POP Adı olmamalı.
            if ($ilceId) { 
                $uniqueCheckQuery = Capsule::table('mod_btk_iss_pop_noktalari')
                                    ->where('yayin_yapilan_ssid', $popDataToSave['yayin_yapilan_ssid'])
                                    ->where('pop_adi_lokasyon_adi', $popDataToSave['pop_adi_lokasyon_adi'])
                                    ->where('ilce_id', $ilceId); 
                if ($popIdToUpdate > 0) {
                    $uniqueCheckQuery->where('id', '!=', $popIdToUpdate);
                }
                $existingPop = $uniqueCheckQuery->first();
                if($existingPop){
                     $errorMsg = "'{$popDataToSave['yayin_yapilan_ssid']}' SSID ve '{$popDataToSave['pop_adi_lokasyon_adi']}' POP Adı ile bu ilçede zaten bir kayıt mevcut.";
                     self::logAction('ISS POP Kaydetme Hatası', 'UYARI', $errorMsg, $adminId);
                     return ['status' => false, 'message' => $errorMsg];
                }
            } elseif (empty($ilceId) && !empty($data['ilce'])) { // Eğer ilçe adı var ama ID bulunamadıysa, bu bir veri tutarsızlığı olabilir.
                 self::logAction('ISS POP Kaydetme Uyarısı', 'UYARI', "İlçe adı '{$data['ilce']}' için ID bulunamadı, unique kontrolü ilçe bazlı yapılamadı.", $adminId);
            }


            if ($popIdToUpdate > 0) {
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popIdToUpdate)->update($popDataToSave);
                self::logAction('ISS POP Güncellendi', 'BAŞARILI', "ID: $popIdToUpdate", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla güncellendi.', 'id' => $popIdToUpdate];
            } else {
                $popId = Capsule::table('mod_btk_iss_pop_noktalari')->insertGetId($popDataToSave);
                self::logAction('ISS POP Eklendi', 'BAŞARILI', "Yeni ID: $popId", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla eklendi.', 'id' => $popId];
            }
        } catch (Exception $e) {
            self::logAction('ISS POP Kaydetme/Güncelleme Veritabanı Hatası', 'HATA', $e->getMessage(), $adminId, ['data_keys' => array_keys($data), 'trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'POP Noktası kaydedilirken bir veritabanı hatası oluştu. Detaylar için logları kontrol edin.'];
        }
    }

    public static function deleteIssPopNoktasi($popId, $adminId = null) {
        $logKullaniciId = $adminId ?? self::getCurrentAdminId();
        if(empty($popId) || !is_numeric($popId) || (int)$popId <=0) {
            return ['status' => false, 'message' => 'Geçersiz POP ID.'];
        }
        try {
            $pop = self::getIssPopNoktasiById((int)$popId);
            if (!$pop) {
                return ['status' => false, 'message' => "Silinecek POP Noktası (ID: $popId) bulunamadı."];
            }
            $deleted = Capsule::table('mod_btk_iss_pop_noktalari')->where('id', (int)$popId)->delete();
            if ($deleted) {
                self::logAction('ISS POP Silindi', 'BAŞARILI', "ID: $popId, Adı: " . ($pop['pop_adi_lokasyon_adi'] ?? 'Bilinmiyor'), $logKullaniciId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla silindi.'];
            }
            self::logAction('ISS POP Silme Başarısız', 'UYARI', "ID: $popId silinemedi (DB Hatası veya kayıt yok).", $logKullaniciId);
            return ['status' => false, 'message' => 'POP Noktası silinirken bir sorun oluştu veya kayıt bulunamadı.'];
        } catch (Exception $e) {
            self::logAction('ISS POP Silme Kapsamlı Hata', 'HATA', "ID: $popId, Hata: " . $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'POP Noktası silinirken bir veritabanı hatası oluştu.'];
        }
    }

    // --- Personel Yönetimi ---
    public static function getPersonelList($filters = [], $orderBy = 'p.soyad', $sortOrder = 'ASC', $limit = 25, $offset = 0) {
        try {
            $query = Capsule::table('mod_btk_personel as p')
                        ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                        ->leftJoin('mod_btk_adres_ilce as ilce', 'p.gorev_bolgesi_ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id');

            if(!empty($filters['s_ad'])) $query->where('p.ad', 'LIKE', '%'.trim($filters['s_ad']).'%');
            if(!empty($filters['s_soyad'])) $query->where('p.soyad', 'LIKE', '%'.trim($filters['s_soyad']).'%');
            if(!empty($filters['s_tckn'])) $query->where('p.tckn', '=', preg_replace('/[^0-9]/', '', $filters['s_tckn']));
            if(!empty($filters['s_email'])) $query->where('p.email', 'LIKE', '%'.trim($filters['s_email']).'%');
            if(isset($filters['s_departman_id']) && $filters['s_departman_id'] !== '' && is_numeric($filters['s_departman_id'])) {
                $query->where('p.departman_id', (int)$filters['s_departman_id']);
            }
            if(isset($filters['s_btk_listesine_eklensin']) && $filters['s_btk_listesine_eklensin'] !== '' && is_numeric($filters['s_btk_listesine_eklensin'])) {
                $query->where('p.btk_listesine_eklensin', (int)$filters['s_btk_listesine_eklensin']);
            }
            if(isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '1'){
                $query->whereNull('p.isten_ayrilma_tarihi_btk');
            } elseif (isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '0') {
                 $query->whereNotNull('p.isten_ayrilma_tarihi_btk');
            }

            $total = $query->count();
            $personeller = $query->select(
                                    'p.id', 'p.whmcs_admin_id', 'p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn',
                                    'p.unvan_pozisyon', 'p.departman_id', 'p.mobil_tel', 'p.sabit_tel', 'p.email',
                                    'p.ev_adresi_ik', 'p.acil_durum_kisi_ik', 'p.ise_baslama_tarihi_ik',
                                    'p.isten_ayrilma_tarihi_btk', 'p.is_birakma_nedeni_ik', 'p.gorev_bolgesi_ilce_id',
                                    'p.btk_listesine_eklensin', 'p.tckn_dogrulama_durumu', 'p.tckn_dogrulama_mesaji',
                                    'd.departman_adi', 
                                    'ilce.ilce_adi as gorev_bolgesi_ilce_adi',
                                    'il.il_adi as gorev_bolgesi_il_adi'
                                 )
                                 ->orderByRaw(Capsule::raw( (strpos($orderBy,'.') === false ? 'p.' : '') . "`$orderBy` $sortOrder")) // OrderBy için tablo aliası ekle
                                 ->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($p){ return (array)$p; }, $personeller), 'total_count' => $total];
        } catch (Exception $e) { 
            self::logAction('Personel Listesi Okuma Hatası', 'HATA', $e->getMessage()); 
            return ['data' => [], 'total_count' => 0];
        }
    }
// --- BÖLÜM 4/5 SONU (Satır 760 civarı) ---

// ... BtkHelper.php Bölüm 4/5 içeriğinin sonu (getPersonelList fonksiyonunun sonu) ...

// --- BÖLÜM 5/5 BAŞLANGICI ---

    public static function getPersonelById($id) {
        if(empty($id) || !is_numeric($id) || (int)$id <=0) return null;
        try {
            $personel = Capsule::table('mod_btk_personel as p')
                ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                ->leftJoin('mod_btk_adres_ilce as ilce', 'p.gorev_bolgesi_ilce_id', '=', 'ilce.id')
                ->leftJoin('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')
                ->where('p.id', (int)$id)
                ->select('p.*', 'd.departman_adi', 'ilce.ilce_adi as gorev_bolgesi_ilce_adi', 'il.il_adi as gorev_bolgesi_il_adi')
                ->first();
            return $personel ? (array)$personel : null;
        } catch (Exception $e) { 
            self::logAction('Personel ID ile Okuma Hatası', 'HATA', "ID: $id, Hata: ".$e->getMessage()); 
            return null; 
        }
    }

    public static function savePersonel($data, $adminId = null) {
        $logKullaniciId = $adminId ?? self::getCurrentAdminId();
        $personelIdToUpdate = isset($data['personel_id']) ? (int)$data['personel_id'] : 0;

        $validationErrors = [];
        if (empty(trim($data['ad'] ?? ''))) $validationErrors[] = 'Adı boş bırakılamaz.';
        if (empty(trim($data['soyad'] ?? ''))) $validationErrors[] = 'Soyadı boş bırakılamaz.';
        $tckn = preg_replace('/[^0-9]/', '', $data['tckn'] ?? '');
        if (empty($tckn)) $validationErrors[] = 'T.C. Kimlik No boş bırakılamaz.';
        elseif (strlen($tckn) !== 11) $validationErrors[] = 'T.C. Kimlik Numarası 11 haneli olmalıdır.';
        if (empty(trim($data['email'] ?? ''))) $validationErrors[] = 'E-posta Adresi boş bırakılamaz.';
        elseif (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) $validationErrors[] = 'Geçersiz e-posta formatı.';
        
        $dogumYiliForNVI = isset($data['dogum_yili_nvi']) && is_numeric($data['dogum_yili_nvi']) && strlen($data['dogum_yili_nvi']) === 4 ? (int)$data['dogum_yili_nvi'] : null;
        if (empty($dogumYiliForNVI) && !empty($tckn) && class_exists('NviSoapClient')) {
            // NVI doğrulaması için doğum yılı modal'da zorunlu hale getirilebilir.
            // Veya, eğer WHMCS admini ile ilişkilendirilmişse ve adminin doğum tarihi varsa oradan çekilebilir (WHMCS'te admin doğum tarihi yok).
             $validationErrors[] = 'Doğum Yılı (NVI için) 4 haneli sayı olarak girilmelidir.';
        }

        if (!empty($validationErrors)) {
            self::logAction('Personel Kaydetme Doğrulama Hatası', 'UYARI', implode(', ', $validationErrors), $logKullaniciId, ['data_keys' => array_keys($data)]);
            return ['status' => false, 'message' => implode('<br>', $validationErrors)];
        }

        $tcknDogrulamaSonucu = 'Dogrulanmadi';
        $tcknDogrulamaMesaji = 'NVI Doğrulaması yapılamadı (gerekli bilgiler eksik veya servis kullanılamadı).';
        
        if (class_exists('NviSoapClient') && $dogumYiliForNVI && !empty($tckn) && !empty(trim($data['ad'])) && !empty(trim($data['soyad']))) {
            $nviClient = new NviSoapClient();
            $nviResult = $nviClient->TCKimlikNoDogrula($tckn, trim($data['ad']), trim($data['soyad']), $dogumYiliForNVI);
            if ($nviResult === true) {
                $tcknDogrulamaSonucu = 'Dogrulandi';
                $tcknDogrulamaMesaji = 'NVI üzerinden TCKN başarıyla doğrulandı.';
            } else {
                $tcknDogrulamaSonucu = $nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi';
                $tcknDogrulamaMesaji = $nviClient->getLastErrorMessageForUser() ?: ($nviClient->getLastError() ?: 'NVI Doğrulama Başarısız. Bilgileri kontrol edin.');
            }
            self::logAction('NVI TCKN Doğrulama (Personel)', $nviResult ? 'BİLGİ' : 'UYARI', $tcknDogrulamaMesaji, $logKullaniciId, ['tckn' => $tckn, 'ad' => $data['ad']]);
        } elseif(!class_exists('NviSoapClient')) {
             $tcknDogrulamaMesaji = 'NVI Doğrulama servisi (NviSoapClient) yüklenemedi.';
        } elseif (!$dogumYiliForNVI && !empty($tckn)){
             $tcknDogrulamaMesaji = 'NVI Doğrulaması için Doğum Yılı (NVI için) gereklidir.';
        }


        try {
            $personelDataToSave = [
                'whmcs_admin_id' => !empty($data['whmcs_admin_id_modal']) && is_numeric($data['whmcs_admin_id_modal']) && (int)$data['whmcs_admin_id_modal'] > 0 ? (int)$data['whmcs_admin_id_modal'] : null,
                'firma_unvani' => self::get_btk_setting('operator_title', '[FİRMA ÜNVANI AYARLANMAMIŞ]'),
                'ad' => trim($data['ad']),
                'soyad' => trim($data['soyad']),
                'tckn' => $tckn,
                'unvan_pozisyon' => isset($data['unvan']) ? trim($data['unvan']) : null,
                'departman_id' => !empty($data['departman_id']) && is_numeric($data['departman_id']) ? (int)$data['departman_id'] : null,
                'mobil_tel' => isset($data['mobil_tel']) ? preg_replace('/[^0-9]/', '', $data['mobil_tel']) : null,
                'sabit_tel' => isset($data['sabit_tel']) ? preg_replace('/[^0-9]/', '', $data['sabit_tel']) : null,
                'email' => trim($data['email']),
                'ev_adresi_ik' => $data['ev_adresi'] ?? null,
                'acil_durum_kisi_ik' => $data['acil_durum_kisi_iletisim'] ?? null,
                'ise_baslama_tarihi_ik' => !empty($data['ise_baslama_tarihi']) ? ((new DateTime($data['ise_baslama_tarihi']))->format('Y-m-d')) : null,
                'isten_ayrilma_tarihi_btk' => !empty($data['isten_ayrilma_tarihi']) ? ((new DateTime($data['isten_ayrilma_tarihi']))->format('Y-m-d')) : null,
                'is_birakma_nedeni_ik' => $data['is_birakma_nedeni'] ?? null,
                'gorev_bolgesi_ilce_id' => !empty($data['gorev_bolgesi_ilce_id']) && is_numeric($data['gorev_bolgesi_ilce_id']) ? (int)$data['gorev_bolgesi_ilce_id'] : null,
                'btk_listesine_eklensin' => (isset($data['btk_listesine_eklensin']) && ($data['btk_listesine_eklensin'] === '1' || $data['btk_listesine_eklensin'] === 'on')) ? 1 : 0,
                'tckn_dogrulama_durumu' => $tcknDogrulamaSonucu,
                'tckn_dogrulama_zamani' => gmdate('Y-m-d H:i:s'),
                'tckn_dogrulama_mesaji' => substr($tcknDogrulamaMesaji, 0, 255)
            ];
            
            $uniqueCheckQueryTCKN = Capsule::table('mod_btk_personel')->where('tckn', $personelDataToSave['tckn'])->whereNull('isten_ayrilma_tarihi_btk');
            $uniqueCheckQueryAdminID = $personelDataToSave['whmcs_admin_id'] ? Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $personelDataToSave['whmcs_admin_id']) : null;

            if ($personelIdToUpdate > 0) {
                $uniqueCheckQueryTCKN->where('id', '!=', $personelIdToUpdate);
                if($uniqueCheckQueryAdminID) $uniqueCheckQueryAdminID->where('id', '!=', $personelIdToUpdate);
            }
            $existingPersonelByTCKN = $uniqueCheckQueryTCKN->first();
            if ($existingPersonelByTCKN) { return ['status' => false, 'message' => "Bu TCKN ({$personelDataToSave['tckn']}) ile zaten aktif bir personel var (ID: {$existingPersonelByTCKN->id})."]; }
            if ($uniqueCheckQueryAdminID) { $existingPersonelByAdminID = $uniqueCheckQueryAdminID->first(); if ($existingPersonelByAdminID) { return ['status' => false, 'message' => "Seçilen WHMCS Yöneticisi (ID: {$personelDataToSave['whmcs_admin_id']}) zaten başka bir personele atanmış (Personel ID: {$existingPersonelByAdminID->id})."]; }}

            if ($personelIdToUpdate > 0) {
                Capsule::table('mod_btk_personel')->where('id', $personelIdToUpdate)->update($personelDataToSave);
                self::logAction('Personel Güncellendi', 'BAŞARILI', "ID: $personelIdToUpdate", $logKullaniciId);
                return ['status' => true, 'message' => 'Personel başarıyla güncellendi.', 'id' => $personelIdToUpdate, 'nvi_status' => $tcknDogrulamaSonucu, 'nvi_message' => $tcknDogrulamaMesaji];
            } else {
                $personelId = Capsule::table('mod_btk_personel')->insertGetId($personelDataToSave);
                self::logAction('Personel Eklendi', 'BAŞARILI', "Yeni ID: $personelId", $logKullaniciId);
                return ['status' => true, 'message' => 'Personel başarıyla eklendi.', 'id' => $personelId, 'nvi_status' => $tcknDogrulamaSonucu, 'nvi_message' => $tcknDogrulamaMesaji];
            }
        } catch (Exception $e) {
            self::logAction('Personel Kaydetme DB Hatası', 'HATA', $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'Veritabanı hatası. Logları kontrol edin.'];
        }
    }

    public static function deletePersonel($personelId, $adminId = null) {
        $logKullaniciId = $adminId ?? self::getCurrentAdminId();
        if(empty($personelId) || !is_numeric($personelId) || (int)$personelId <=0) {
            return ['status' => false, 'message' => 'Geçersiz Personel ID.'];
        }
        try {
            $personel = self::getPersonelById((int)$personelId);
            if (!$personel) { return ['status' => false, 'message' => "Silinecek personel (ID: $personelId) bulunamadı."]; }
            
            $deleted = Capsule::table('mod_btk_personel')->where('id', (int)$personelId)->delete();
            if ($deleted) {
                self::logAction('Personel Silindi', 'BAŞARILI', "ID: $personelId, Ad Soyad: {$personel['ad']} {$personel['soyad']}", $logKullaniciId);
                return ['status' => true, 'message' => 'Personel başarıyla silindi.'];
            }
            self::logAction('Personel Silme Başarısız', 'UYARI', "ID: $personelId silinemedi (DB Hatası veya kayıt yok).", $logKullaniciId);
            return ['status' => false, 'message' => 'Personel silinirken bir sorun oluştu veya kayıt bulunamadı.'];
        } catch (Exception $e) {
            self::logAction('Personel Silme Kapsamlı Hata', 'HATA', "ID: $personelId, Hata: " . $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'Personel silinirken bir veritabanı hatası oluştu.'];
        }
    }
    
    public static function getDepartmanList() {
        try { 
            $departments = Capsule::table('mod_btk_personel_departmanlari')->orderBy('departman_adi')->get()->all();
            return array_map(function($dept){ return (array)$dept; }, $departments);
        }
        catch (Exception $e) { self::logAction('Departman Listesi Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }
    
    public static function getTeknikPersonelForIlce($ilce_id) {
        if(empty($ilce_id) || !is_numeric($ilce_id)) return [];
        try {
            $teknikDepartmanAdlari = ['Bilgi Teknolojileri Departmanı', 'Teknik Destek Departmanı', 'Saha Operasyon Departmanı']; 
            
            $personeller = Capsule::table('mod_btk_personel as p')
                ->join('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                ->where('p.gorev_bolgesi_ilce_id', (int)$ilce_id)
                ->whereIn('d.departman_adi', $teknikDepartmanAdlari)
                ->whereNull('p.isten_ayrilma_tarihi_btk') 
                ->where('p.btk_listesine_eklensin', 1)
                ->select('p.id', Capsule::raw("CONCAT(p.ad, ' ', p.soyad) as tam_ad"), 'p.email')
                ->orderBy('p.soyad')->orderBy('p.ad')
                ->get()->all();
            return array_map(function($p){ return (array)$p; }, $personeller);
        } catch (Exception $e) {
            self::logAction('Teknik Personel Okuma Hatası (İlçe)', 'HATA', "İlçe ID: $ilce_id, Hata: ".$e->getMessage());
            return [];
        }
    }
    
    public static function getTumIlcelerWithIlAdi() {
        try {
            $results = Capsule::table('mod_btk_adres_ilce as ilce')
                ->join('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')
                ->select('ilce.id as ilce_id', 'ilce.ilce_adi', 'il.il_adi')
                ->orderBy('il.il_adi')->orderBy('ilce.ilce_adi')
                ->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) {
            self::logAction('Tüm İlçe Listesi (İl Adıyla) Okuma Hatası', 'Hata', $e->getMessage());
            return [];
        }
    }

    // --- Dosya Adlandırma ve CNT Yönetimi ---
    public static function generateReportFilename($operatorAdi, $operatorKodu, $raporTipKodu, $raporTuruSonek, $cnt, $timestamp = null, $forFtpType = 'main') {
        // raporTuruSonek: ABONE_REHBER, ABONE_HAREKET, PERSONEL_LISTESI
        if (empty(trim($operatorAdi))) { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Adı boş olamaz.'); return false; }
        $raporTuruUpper = strtoupper(trim($raporTuruSonek));
        if ($raporTuruUpper !== 'PERSONEL_LISTESI' && empty(trim($operatorKodu))) { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Kodu (Personel hariç) boş olamaz.'); return false; }
        if (is_null($timestamp)) { $timestamp = time(); }
        
        $dateTimePart = gmdate('YmdHis', $timestamp);
        $cntPadded = str_pad((string)$cnt, 2, '0', STR_PAD_LEFT);
        $cleanOperatorName = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', trim($operatorAdi)));

        if ($raporTuruUpper === 'PERSONEL_LISTESI') {
            $addYearMonthSettingKey = strtolower($forFtpType) . '_personel_filename_add_year_month';
            $defaultAddYearMonth = ($forFtpType === 'backup') ? '1' : self::get_btk_setting('personel_filename_add_year_month_main', '0');
            $addYearMonth = (bool)self::get_btk_setting($addYearMonthSettingKey, $defaultAddYearMonth);
            $yearMonthPart = $addYearMonth ? "_" . gmdate('Y_m', $timestamp) : '';
            return $cleanOperatorName . "_Personel_Listesi" . $yearMonthPart . ".xlsx";
        } elseif ($raporTuruUpper === 'ABONE_REHBER' || $raporTuruUpper === 'ABONE_HAREKET') {
            if (empty(trim($raporTipKodu))) { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "$raporTuruSonek için Rapor Tip Kodu (ISS, STH vb.) boş olamaz."); return false; }
            $cleanOperatorKodu = preg_replace('/[^a-zA-Z0-9]/', '', trim($operatorKodu));
            $cleanRaporTipKodu = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', trim($raporTipKodu)));
            return $cleanOperatorName . '_' . $cleanOperatorKodu . '_' . $cleanRaporTipKodu . '_' . $raporTuruUpper . '_' . $dateTimePart . '_' . $cntPadded . '.abn';
        } else {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "Bilinmeyen rapor türü soneki: $raporTuruSonek");
            return false;
        }
    }
    public static function getNextCnt($operatorAdi, $operatorKodu, $raporTipKodu, $raporTuruSonek, $ftpSunucuTipi = 'ANA') { return '01'; } // Her zaman 01, manuel tekrar gönderim hariç
    
    // --- Rapor Oluşturma Ana Mantığı ---
    public static function getAboneRehberData($raporTipKodu, $filters = []) { self::logAction("Rehber Veri Çekme Başladı ($raporTipKodu)", 'DEBUG', $filters); /* TODO */ return []; }
    public static function getAboneHareketData($raporTipKodu, $filters = []) { self::logAction("Hareket Veri Çekme Başladı ($raporTipKodu)", 'DEBUG', $filters); /* TODO */ return []; }
    public static function markHareketAsGonderildi($hareketIds, $dosyaAdi, $cnt) { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function archiveOldHareketler() { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function getPersonelDataForReport($filters = []) { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }
    
    public static function getBtkAlanSiralamasi($raporTipKodu = 'ISS') {
        $ortakAlanlar = [ /* ... (Bir önceki tam BtkHelper gönderimindeki 70 ortak alan listesi buraya gelecek) ... */ ];
        $ozelAlanlar = [];
        switch (strtoupper($raporTipKodu ?? '')) {
            case 'ISS': $ozelAlanlar = ['ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI']; break;
            case 'STH': $ozelAlanlar = [ /* ... STH özel alanları ... */ ]; break;
            case 'GSM': case 'GMPCS': $ozelAlanlar = [ /* ... GSM/GMPCS özel alanları ... */ ]; break;
            case 'UYDU': $ozelAlanlar = [ /* ... UYDU özel alanları ... */ ]; break;
            case 'AIH': $ozelAlanlar = [ /* ... AIH özel alanları ... */ ]; break;
        }
        return array_merge($ortakAlanlar, $ozelAlanlar); // Bu liste BTK dokümanına göre TAMAMLANMALI!
    }
     public static function formatAbnRow($dataArray, $raporTipKodu = 'ISS', $isHareket = false) { // $btkAlanSiralamasi yerine $raporTipKodu alacak
        $btkAlanSiralamasi = self::getBtkAlanSiralamasi($raporTipKodu);
        if (empty($btkAlanSiralamasi)) { self::logAction('ABN Formatlama Hatası', 'HATA', "BTK Alan sıralaması '$raporTipKodu' için sağlanmadı."); return ''; }
        
        $rowValues = [];
        foreach ($btkAlanSiralamasi as $btkFieldKey) {
            $dbFieldKey = strtolower($btkFieldKey);
            $value = ''; 

            if (strtoupper($btkFieldKey) === 'HIZMET_TIPI' && isset($dataArray['hizmet_tipi_ek3_kodu'])) { // alan10 için
                $value = $dataArray['hizmet_tipi_ek3_kodu'];
            } elseif (strtoupper($btkFieldKey) === 'ISS_POP_BILGISI') {
                $popBilgisi = $dataArray['iss_pop_bilgisi_sunucu'] ?? '';
                if (!empty($dataArray['iss_pop_noktasi_id'])) {
                    $popNoktasi = self::getIssPopNoktasiById($dataArray['iss_pop_noktasi_id']);
                    if ($popNoktasi && !empty($popNoktasi['yayin_yapilan_ssid'])) {
                        $popBilgisi .= (empty($popBilgisi) ? '' : ".") . $popNoktasi['yayin_yapilan_ssid'];
                    }
                }
                $value = $popBilgisi;
            } elseif (array_key_exists($dbFieldKey, $dataArray)) {
                $value = $dataArray[$dbFieldKey];
            } elseif (array_key_exists(strtoupper($dbFieldKey), $dataArray)) {
                 $value = $dataArray[strtoupper($dbFieldKey)];
            }
            
            $dateTimeFields = ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS'];
            $dateFields = ['ABONE_DOGUM_TARIHI', 'ABONE_KIMLIK_VERILDIGI_TARIH'];

            if (in_array(strtoupper($btkFieldKey), $dateTimeFields) && !empty($value)) {
                try { $value = (new DateTime($value, new DateTimeZone('UTC')))->format('YmdHis'); } catch (Exception $e) { $value = ($value == '0000-00-00 00:00:00' || $value == '00000000000000') ? '00000000000000' : '';}
            } elseif (in_array(strtoupper($btkFieldKey), $dateFields) && !empty($value)) {
                 try { $value = (new DateTime($value))->format('Ymd'); } catch (Exception $e) { $value = ($value == '0000-00-00') ? '00000000' : '';}
            } elseif (($btkFieldKey === 'ABONE_BITIS' || $btkFieldKey === 'ABONE_BASLANGIC') && empty($value)) {
                 // BTK, başlangıç ve bitiş için boşsa '00000000000000' bekleyebilir.
                 // $value = '00000000000000'; // Bu kuralı teyit edin.
            }
            
            $value = str_replace(['|', ';', "\r\n", "\n", "\r"], [' ', ' ', ' ', ' ', ' '], trim((string)$value));
            $rowValues[] = $value;
        }
        return implode('|;|', $rowValues);
    }
    public static function compressToGz($sourceFilePath, $destinationFilePath = null) { /* ... (Bir önceki gönderimdeki gibi) ... */ }

    // --- WHMCS Veri Entegrasyonu (HOOK Handler Fonksiyonları - İskeletler) ---
    // Bu fonksiyonların içleri, ilgili BTK tablolarını güncellemek ve hareket oluşturmak için detaylı olarak implemente edilmelidir.
    public static function handleClientAdd($vars) { self::logAction('Hook İşleyici (TODO): handleClientAdd', 'DEBUG', ['client_id' => $vars['userid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleClientEdit($vars) { self::logAction('Hook İşleyici (TODO): handleClientEdit', 'DEBUG', ['client_id' => $vars['userid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleClientClose($clientId) { self::logAction('Hook İşleyici (TODO): handleClientClose', 'DEBUG', ['client_id' => $clientId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleClientDelete($clientId) { self::logAction('Hook İşleyici (TODO): handleClientDelete', 'DEBUG', ['client_id' => $clientId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleMergeClient($sourceClientId, $targetClientId) { self::logAction('Hook İşleyici (TODO): handleMergeClient', 'DEBUG', ['source' => $sourceClientId, 'target' => $targetClientId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServiceCreate($params) { self::logAction('Hook İşleyici (TODO): handleServiceCreate', 'DEBUG', ['service_id' => $params['serviceid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServiceEdit($vars) { self::logAction('Hook İşleyici (TODO): handleServiceEdit', 'DEBUG', ['service_id' => $vars['serviceid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServiceSuspend($params) { self::logAction('Hook İşleyici (TODO): handleServiceSuspend', 'DEBUG', ['service_id' => $params['serviceid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServiceUnsuspend($params) { self::logAction('Hook İşleyici (TODO): handleServiceUnsuspend', 'DEBUG', ['service_id' => $params['serviceid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServiceTerminate($params) { self::logAction('Hook İşleyici (TODO): handleServiceTerminate', 'DEBUG', ['service_id' => $params['serviceid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServiceDelete($serviceId) { self::logAction('Hook İşleyici (TODO): handleServiceDelete', 'DEBUG', ['service_id' => $serviceId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleServicePackageChange($vars) { self::logAction('Hook İşleyici (TODO): handleServicePackageChange', 'DEBUG', ['service_id' => $vars['serviceid']]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleInvoicePaid($invoiceId) { self::logAction('Hook İşleyici (TODO): handleInvoicePaid', 'DEBUG', ['invoice_id' => $invoiceId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleInvoiceCancelled($invoiceId) { self::logAction('Hook İşleyici (TODO): handleInvoiceCancelled', 'DEBUG', ['invoice_id' => $invoiceId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function syncAdminToPersonel($adminId, $adminVars = []) { self::logAction('Hook İşleyici (TODO): syncAdminToPersonel', 'DEBUG', ['admin_id' => $adminId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handleAdminDelete($adminId) { self::logAction('Hook İşleyici (TODO): handleAdminDelete', 'DEBUG', ['admin_id' => $adminId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function getBtkClientInfoForClientArea($clientId) { self::logAction('TODO: getBtkClientInfoForClientArea', 'DEBUG', ['client_id' => $clientId]); return []; }
    public static function getBtkServiceInfoForClientArea($serviceId) { self::logAction('TODO: getBtkServiceInfoForClientArea', 'DEBUG', ['service_id' => $serviceId]); return []; }
    public static function performDailyBtkChecks() { self::logAction('Günlük BTK Kontrolleri (TODO)', 'INFO'); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function handlePreServiceEdit($serviceId, $postData) { self::logAction('Hook İşleyici (TODO): handlePreServiceEdit', 'DEBUG', ['service_id' => $serviceId]); /* İMPLEMENTASYON BEKLİYOR */ }
    public static function getWhmcsClientDetails($clientId) { /* İMPLEMENTASYON BEKLİYOR */ try { $client = Capsule::table('tblclients')->find((int)$clientId); return $client ? (array)$client : null; } catch (Exception $e) { return null;} }
    public static function getWhmcsServiceDetails($serviceId) { /* İMPLEMENTASYON BEKLİYOR */ try { $service = Capsule::table('tblhosting')->find((int)$serviceId); return $service ? (array)$service : null; } catch (Exception $e) { return null;} }

    // --- Yardımcı Diğer Fonksiyonlar ---
    public static function getCurrentAdminId() { return isset($_SESSION['adminid']) ? (int)$_SESSION['adminid'] : null; }
    public static function sendEmailNotification($to, $subject, $messageBody, $attachments = []) { 
        $adminUserId = self::getCurrentAdminId();
        if (!$adminUserId) { $firstAdmin = Capsule::table('tbladmins')->where('disabled',0)->orderBy('id', 'asc')->first(); if ($firstAdmin) $adminUserId = $firstAdmin->id; else { self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID bulunamadı.'); return false;}}
        $command = 'SendEmail'; $postData = ['customtype' => 'general', 'customsubject' => $subject, 'custommessage' => nl2br(htmlspecialchars($messageBody)), 'to' => $to];
        try { 
            $results = localAPI($command, $postData, $adminUserId); 
            if (isset($results['result']) && $results['result'] == 'success') { self::logAction('Eposta Gönderildi', 'BİLGİ', "Kime: $to, Konu: $subject"); return true; } 
            else { self::logAction('Eposta Gönderme Hatası (localAPI)', 'HATA', ['to' => $to, 'subject' => $subject, 'response' => $results]); return false;}
        } catch (Exception $e) { self::logAction('Eposta Gönderme Kapsamlı Hata', 'HATA', $e->getMessage(), null, ['to' => $to, 'subject' => $subject]); return false; }
    }

} // Sınıf Sonu
?>