<?php
/**
 * BTK Raporlama Modülü için Kapsamlı Yardımcı Fonksiyonlar Sınıfı
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    6.5
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
use Cron\CronExpression; 
use WHMCS\User\Client;
use WHMCS\Service\Service;
use WHMCS\Product\Product;
use WHMCS\CustomField; 

if (!function_exists('encrypt')) { error_log("BTK Reports Critical Error: WHMCS global 'encrypt' function not found!"); }
if (!function_exists('decrypt')) { error_log("BTK Reports Critical Error: WHMCS global 'decrypt' function not found!"); }

class BtkHelper {

    private static $langCache = [];

    // WHMCS dil dosyasından metin çekmek için
    public static function getLang($key) {
        global $_ADDONLANG;
        if (empty(self::$langCache)) {
            if(empty($_ADDONLANG) && file_exists(__DIR__ . '/../lang/turkish.php')) {
                require __DIR__ . '/../lang/turkish.php';
            }
            self::$langCache = $_ADDONLANG ?? [];
        }
        return self::$langCache[$key] ?? $key;
    }

    // --- Ayar Yönetimi ---
    public static function get_btk_setting($settingName, $defaultValue = null) {
        try {
            $setting = Capsule::table('mod_btk_settings')->where('setting', $settingName)->first();
            if ($setting) {
                if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    try { 
                        if (function_exists('decrypt')) { return decrypt($setting->value); }
                        self::logAction('Ayar Deşifre Hatası', 'HATA', "WHMCS decrypt fonksiyonu bulunamadı, ayar '$settingName' deşifre edilemedi.");
                        return '';
                    } catch (\Throwable $e) { self::logAction('Ayar Deşifre Hatası', 'HATA', "Ayar '$settingName' deşifre edilemedi: " . $e->getMessage()); return ''; }
                }
                return $setting->value;
            }
            return $defaultValue;
        } catch (Exception $e) { self::logAction('Ayar Okuma Hatası', 'HATA', "Ayar '$settingName' okunurken hata: " . $e->getMessage()); return $defaultValue; }
    }

    public static function getAllBtkSettings() {
        $settingsArray = [];
        try {
            $settings = Capsule::table('mod_btk_settings')->get();
            foreach ($settings as $setting) {
                if (in_array($setting->setting, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    try { 
                        if (function_exists('decrypt')) { $settingsArray[$setting->setting] = decrypt($setting->value); } 
                        else { $settingsArray[$setting->setting] = ''; self::logAction('Toplu Ayar Deşifre Hatası', 'UYARI', "WHMCS decrypt fonksiyonu bulunamadı, ayar '{$setting->setting}' deşifre edilemedi.");}
                    } catch (\Throwable $e) { $settingsArray[$setting->setting] = ''; self::logAction('Toplu Ayar Deşifre Hatası', 'UYARI', "Ayar '{$setting->setting}' deşifre edilemedi: " . $e->getMessage()); }
                } else {
                    $settingsArray[$setting->setting] = $setting->value;
                }
            }
        } catch (Exception $e) { self::logAction('Tüm Ayarları Okuma Hatası', 'HATA', 'Tüm modül ayarları okunurken hata: ' . $e->getMessage()); }
        return $settingsArray;
    }

    public static function set_btk_setting($settingName, $value) {
        try {
            $valueToStore = $value;
            if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass'])) {
                if ($value === '********') { return true; } 
                elseif (!empty($value)) {
                    if (function_exists('encrypt')) { $valueToStore = encrypt($value); } 
                    else { self::logAction('Ayar Şifreleme Hatası', 'HATA', "WHMCS encrypt fonksiyonu bulunamadı! '$settingName' şifrelenemedi."); return false; }
                } else { $valueToStore = ''; }
            }
            Capsule::table('mod_btk_settings')->updateOrInsert(['setting' => $settingName], ['value' => $valueToStore]);
            return true;
        } catch (Exception $e) { self::logAction('Ayar Kaydetme Hatası', 'HATA', "Ayar '$settingName' kaydedilirken hata: " . $e->getMessage()); return false; }
    }

    // --- Loglama ---
    public static function logAction($islem, $logSeviyesi = 'INFO', $mesaj = '', $kullaniciId = null, $ekVeri = null) {
        try {
            if (is_null($kullaniciId)) {
                if (defined('IN_ADMIN') && IN_ADMIN && isset($_SESSION['adminid'])) $kullaniciId = (int)$_SESSION['adminid'];
                elseif (isset($_SESSION['uid'])) $kullaniciId = (int)$_SESSION['uid']; 
            }
            $ipAdresi = '';
            if (class_exists('WHMCS\Utility\Environment\CurrentRequest') && method_exists('WHMCS\Utility\Environment\CurrentRequest', 'getIP')) { $ipAdresi = WHMCS\Utility\Environment\CurrentRequest::getIP(); } 
            elseif (isset($_SERVER['REMOTE_ADDR'])) { $ipAdresi = $_SERVER['REMOTE_ADDR']; }
            $logMesaj = is_array($mesaj) || is_object($mesaj) ? json_encode($mesaj, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : (string)$mesaj;
            if ($ekVeri !== null) { $logMesaj .= "\nEk Veri: " . (is_array($ekVeri) || is_object($ekVeri) ? json_encode($ekVeri, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : (string)$ekVeri); }
            Capsule::table('mod_btk_logs')->insert(['log_seviyesi' => strtoupper($logSeviyesi), 'islem' => substr($islem, 0, 255), 'mesaj' => $logMesaj, 'kullanici_id' => $kullaniciId, 'ip_adresi' => $ipAdresi, 'log_zamani' => gmdate('Y-m-d H:i:s')]);
        } catch (Exception $e) { error_log("BTK Reports Module - LogAction Error: " . $e->getMessage() . " | Original Log: [$logSeviyesi] $islem - " . $logMesaj); }
    }
    
    public static function getModuleLogs($filters = [], $orderBy = 'id', $sortOrder = 'DESC', $limit = 100, $offset = 0) {
        try {
            $query = Capsule::table('mod_btk_logs');
            if (!empty($filters['s_log_level']) && $filters['s_log_level'] !== 'ALL') { $query->where('log_seviyesi', strtoupper(trim($filters['s_log_level']))); }
            if (!empty($filters['s_log_search_term'])) { 
                $searchTerm = trim($filters['s_log_search_term']);
                $query->where(function($q) use ($searchTerm) {
                    $q->where('islem', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('mesaj', 'LIKE', '%' . $searchTerm . '%');
                });
            }
            if (!empty($filters['s_log_date_range'])) {
                $dateRange = explode(' to ', $filters['s_log_date_range']);
                if (count($dateRange) === 2) {
                    try {
                        $dateFrom = new DateTime($dateRange[0]);
                        $dateTo = new DateTime($dateRange[1]);
                        $query->whereBetween('log_zamani', [$dateFrom->format('Y-m-d 00:00:00'), $dateTo->format('Y-m-d 23:59:59')]);
                    } catch (Exception $ex) { /* Tarih formatı hatası, loglanabilir */ }
                }
            }

            if (!empty($filters['s_log_type'])) {
                $logType = strtoupper(trim($filters['s_log_type']));
                switch ($logType) {
                    case 'FTP': 
                        return ['data' => [], 'total_count' => 0];
                    case 'NVI':
                        $query->where('islem', 'LIKE', '%NVI%');
                        break;
                    case 'CRON':
                        $query->where('islem', 'LIKE', '%Cron%');
                        break;
                    case 'REPORTING':
                        $query->where(function($q){
                            $q->where('islem', 'LIKE', '%Rapor%')->orWhere('islem', 'LIKE', '%Generate%');
                        });
                        break;
                    case 'AUTH':
                        $query->where(function($q){
                            $q->where('islem', 'LIKE', '%Yetki%')->orWhere('islem', 'LIKE', '%Auth%');
                        });
                        break;
                    case 'GENERAL':
                    default: 
                        $specialTypes = ['%NVI%', '%Cron%', '%Rapor%', '%Generate%', '%Yetki%', '%Auth%', '%FTP%'];
                        foreach ($specialTypes as $type) {
                            $query->where('islem', 'NOT LIKE', $type);
                        }
                        break;
                }
            }
            
            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('Modül Log Okuma Hatası', 'HATA', $e->getMessage()); return ['data' => [], 'total_count' => 0]; }
    }
    
    public static function getFtpLog($filters = [], $orderBy = 'id', $sortOrder = 'DESC', $limit = 50, $offset = 0) {
         try {
            $query = Capsule::table('mod_btk_ftp_logs');
            if (!empty($filters['s_rapor_turu_ftp'])) $query->where('rapor_turu', strtoupper(trim($filters['s_rapor_turu_ftp'])));
            if (!empty($filters['s_ftp_sunucu_tipi_ftp'])) $query->where('ftp_sunucu_tipi', strtoupper(trim($filters['s_ftp_sunucu_tipi_ftp'])));
            if (!empty($filters['s_durum_ftp'])) $query->where('durum', ucfirst(strtolower(trim($filters['s_durum_ftp']))));
            if (!empty($filters['s_dosya_adi_ftp'])) $query->where('dosya_adi', 'LIKE', '%' . trim($filters['s_dosya_adi_ftp']) . '%');
            if (!empty($filters['s_yetki_grup_ftp'])) $query->where('yetki_turu_grup', 'LIKE', '%' . trim($filters['s_yetki_grup_ftp']) . '%');
            
            if (!empty($filters['s_log_date_range'])) { 
                $dateRange = explode(' to ', $filters['s_log_date_range']);
                if (count($dateRange) === 2) {
                    try {
                        $dateFrom = new DateTime($dateRange[0]);
                        $dateTo = new DateTime($dateRange[1]);
                        $query->whereBetween('gonderim_zamani', [$dateFrom->format('Y-m-d 00:00:00'), $dateTo->format('Y-m-d 23:59:59')]);
                    } catch (Exception $ex) { }
                }
            }
            if (!empty($filters['s_log_search_term'])) { 
                $searchTerm = trim($filters['s_log_search_term']);
                $query->where(function($q) use ($searchTerm) {
                    $q->where('dosya_adi', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('hata_mesaji', 'LIKE', '%' . $searchTerm . '%');
                });
            }

            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('FTP Log Okuma Hatası', 'Hata', $e->getMessage()); return ['data' => [], 'total_count' => 0]; }
    }

    // --- Yetki Türü Yönetimi ---
    public static function getAllYetkiTurleriReferans() {
        try { $results = Capsule::table('mod_btk_yetki_turleri_referans')->orderBy('yetki_adi')->get()->all(); return array_map(function($item){ return (array)$item; }, $results); } 
        catch (Exception $e) { self::logAction('Yetki Türü Referans Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }

    public static function getSeciliYetkiTurleri() {
        $secili = [];
        try { $results = Capsule::table('mod_btk_secili_yetki_turleri')->where('aktif', 1)->get(); foreach ($results as $row) { $secili[$row->yetki_kodu] = 1; }} 
        catch (Exception $e) { self::logAction('Seçili Yetki Türü Okuma Hatası', 'Hata', $e->getMessage());}
        return $secili;
    }
    
    public static function getAktifYetkiTurleri($returnAs = 'array_grup') {
        $aktifYetkiler = [];
        try {
            $results = Capsule::table('mod_btk_secili_yetki_turleri as syt')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'syt.yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('syt.aktif', 1)->whereNotNull('ytr.grup')->where('ytr.grup', '!=', '')
                ->select('syt.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup', Capsule::raw('ytr.grup as rapor_tipi_eki'))->orderBy('ytr.grup')->orderBy('ytr.yetki_adi')->get()->all();
            if ($returnAs === 'object_list') return $results; 
            if ($returnAs === 'array_of_arrays') return array_map(function($item){ return (array)$item; }, $results);
            foreach ($results as $row_obj) {
                $row = (array)$row_obj;
                if ($returnAs === 'array_grup') { $aktifYetkiler[$row['grup']][] = $row; } 
                elseif ($returnAs === 'array_grup_names_only') { if (!in_array($row['grup'], $aktifYetkiler)) { $aktifYetkiler[] = $row['grup']; } } 
                else { $aktifYetkiler[] = $row; }
            }
        } catch (Exception $e) { self::logAction('Aktif Yetki Türü Okuma Hatası', 'Hata', $e->getMessage()); }
        return $aktifYetkiler;
    }

    public static function saveSeciliYetkiTurleri($secilenYetkilerInput = []) {
        try {
            Capsule::table('mod_btk_secili_yetki_turleri')->update(['aktif' => 0]);
            if (!empty($secilenYetkilerInput) && is_array($secilenYetkilerInput)) {
                $aktifKodlar = [];
                foreach($secilenYetkilerInput as $kod => $val){
                    if($val === 'on' || $val === '1' || $val === true || (is_string($val) && !empty($val)) ){ 
                        $aktifKodlar[] = $kod;
                    }
                }
                if (!empty($aktifKodlar)) {
                    Capsule::table('mod_btk_secili_yetki_turleri')
                        ->whereIn('yetki_kodu', $aktifKodlar)
                        ->update(['aktif' => 1]);
                }
            }
        } catch (Exception $e) { self::logAction('Seçili Yetki Türü Kaydetme Hatası', 'Hata', $e->getMessage()); }
    }
    
    public static function getBtkYetkiForProductGroup($gid) {
        try {
            $mapping = Capsule::table('mod_btk_product_group_mappings')
                ->where('gid', (int)$gid)
                ->first();
            return $mapping ? ['ana_btk_yetki_kodu' => $mapping->ana_btk_yetki_kodu, 'ek3_hizmet_tipi_kodu' => $mapping->ek3_hizmet_tipi_kodu] : null;
        } catch (Exception $e) { self::logAction('Ürün Grubu Yetki Eşleşmesi Okuma Hatası', 'HATA', "GID: {$gid}, Hata: ".$e->getMessage()); return null; }
    }

    public static function getProductGroupMappingsArray() {
        $mappings = [];
        try {
            $results = Capsule::table('mod_btk_product_group_mappings')->get();
            foreach($results as $row) {
                $mappings[(int)$row->gid] = [
                    'ana_btk_yetki_kodu' => $row->ana_btk_yetki_kodu,
                    'ek3_hizmet_tipi_kodu' => $row->ek3_hizmet_tipi_kodu
                ];
            }
        } catch (Exception $e) { self::logAction('Ürün Grubu Eşleşmeleri Okuma Hatası', 'HATA', $e->getMessage()); }
        return $mappings;
    }

    public static function saveProductGroupMappings($mappingsData) {
        $adminId = self::getCurrentAdminId();
        try {
            Capsule::transaction(function () use ($mappingsData, $adminId) {
                Capsule::table('mod_btk_product_group_mappings')->delete(); 
                $insertData = [];
                if (is_array($mappingsData)) {
                    foreach ($mappingsData as $gid => $data) { 
                        if (!empty($gid) && is_numeric($gid) && 
                            isset($data['ana_btk_yetki_kodu']) && !empty(trim($data['ana_btk_yetki_kodu'])) && 
                            isset($data['ek3_hizmet_tipi_kodu']) && !empty(trim($data['ek3_hizmet_tipi_kodu']))) {
                            $insertData[] = [
                                'gid' => (int)$gid,
                                'ana_btk_yetki_kodu' => trim($data['ana_btk_yetki_kodu']),
                                'ek3_hizmet_tipi_kodu' => trim($data['ek3_hizmet_tipi_kodu'])
                            ];
                        }
                    }
                }
                if(!empty($insertData)){
                    Capsule::table('mod_btk_product_group_mappings')->insert($insertData);
                }
            });
            self::logAction('Ürün Grubu Eşleştirmeleri Kaydedildi', 'BAŞARILI', (is_array($mappingsData) ? count($mappingsData) : 0) . ' ürün grubu için eşleştirme güncellendi.', $adminId);
            return true;
        } catch (Exception $e) {
            self::logAction('Ürün Grubu Eşleştirme Kaydetme Hatası', 'HATA', $e->getMessage(), $adminId);
            return false;
        }
    }
    
    public static function getYetkiGrupForService($serviceId) {
        try {
            $service = Capsule::table('tblhosting')->find((int)$serviceId);
            if (!$service || !$service->packageid) { self::logAction('Yetki Grubu Bulma (Hizmet)', 'UYARI', "Hizmet veya paket bulunamadı. Service ID: {$serviceId}"); return null; }
            $product = Capsule::table('tblproducts')->find($service->packageid);
            if (!$product || !$product->gid) { self::logAction('Yetki Grubu Bulma (Ürün)', 'UYARI', "Ürün veya grup ID bulunamadı. Package ID: {$service->packageid}"); return null; }

            $mapping = Capsule::table('mod_btk_product_group_mappings as pgmap')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'pgmap.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('pgmap.gid', $product->gid)
                ->select('ytr.grup')
                ->first();
            
            if ($mapping && !empty($mapping->grup)) { return $mapping->grup; }
            self::logAction('Yetki Grubu Bulma (Eşleşme)', 'UYARI', "Hizmet (ID:{$serviceId}, GID:{$product->gid}) için BTK Yetki Grubu eşleşmesi bulunamadı.");
            return null;
        } catch (Exception $e) { self::logAction('Hizmet İçin Yetki Grubu Bulma Hatası', 'HATA', "Service ID: {$serviceId}, Hata: ".$e->getMessage()); return null; }
    }
    
    public static function getEk3HizmetTipiForService($serviceId) {
        try {
            $service = Capsule::table('tblhosting')->find((int)$serviceId);
            if (!$service || !$service->packageid) return null;
            $product = Capsule::table('tblproducts')->find($service->packageid);
            if (!$product || !$product->gid) return null;

            $mapping = Capsule::table('mod_btk_product_group_mappings')
                ->where('gid', $product->gid)
                ->select('ek3_hizmet_tipi_kodu')
                ->first();
            
            return $mapping ? $mapping->ek3_hizmet_tipi_kodu : null;
        } catch (Exception $e) { self::logAction('Hizmet İçin EK-3 Hizmet Tipi Bulma Hatası', 'HATA', "Service ID: {$serviceId}, Hata: ".$e->getMessage()); return null; }
    }

    public static function getAllEk3HizmetTipleri($anaYetkiGrup = null) {
        try {
            $query = Capsule::table('mod_btk_ek3_hizmet_tipleri');
            if ($anaYetkiGrup && $anaYetkiGrup !== '') {
                $query->where('ana_yetki_grup', $anaYetkiGrup);
            }
            $results = $query->orderBy('hizmet_tipi_aciklamasi')->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) {
            self::logAction('EK-3 Hizmet Tipleri Okuma Hatası', 'HATA', $e->getMessage());
            return [];
        }
    }
    public static function getEk3HizmetTipiByCode($code) {
        try {
            return Capsule::table('mod_btk_ek3_hizmet_tipleri')->where('hizmet_tipi_kodu', $code)->first();
        } catch (Exception $e) {
            self::logAction('EK-3 Hizmet Tipi Kod ile Okuma Hatası', 'HATA', $e->getMessage());
            return null;
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
        global $LANG; 
        if (!class_exists('Cron\CronExpression')) {
            self::logAction('Cron Zamanlama Hatası', 'UYARI', 'CronExpression kütüphanesi bulunamadı (vendor/autoload.php).');
            return (self::getLang('cronLibMissing') ?? 'Zamanlama Kütüphanesi Eksik');
        }
        try {
            $schedule = self::get_btk_setting($cronScheduleSettingKey);
            if (empty($schedule)) { return (self::getLang('notConfigured') ?? 'Ayarlanmamış'); }
            if (!CronExpression::isValidExpression($schedule)) {
                self::logAction('Geçersiz Cron İfadesi', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule'");
                return (self::getLang('invalidCronExpression') ?? 'Geçersiz Cron İfadesi');
            }
            $cron = CronExpression::factory($schedule);
            $nextRunLocalDate = $cron->getNextRunDate('now', 0, false, date_default_timezone_get()); 
            $nextRunUtcDate = (clone $nextRunLocalDate)->setTimezone(new DateTimeZone('UTC'));
            return $nextRunLocalDate->format('Y-m-d H:i:s') . ' (' . date_default_timezone_get() . ') / ' . $nextRunUtcDate->format('Y-m-d H:i:s') . ' (UTC)';
        } catch (InvalidArgumentException $iae) {
            self::logAction('Geçersiz Cron İfadesi (InvalidArgument)', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $iae->getMessage());
            return (self::getLang('invalidCronExpression') ?? 'Geçersiz Cron İfadesi');
        }
         catch (Exception $e) { self::logAction('Sonraki Cron Çalışma Zamanı Hesaplama Hatası', 'HATA', "Ayar: $cronScheduleSettingKey, Hata: " . $e->getMessage()); return (self::getLang('errorFetchingNextRun') ?? 'Hesaplanamadı'); }
    }
    
    // --- FTP İşlemleri ---
    public static function checkFtpConnection($type = 'main') {
        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass'); 
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (self::get_btk_setting($type . '_ftp_ssl', '0') === '1');

        if (empty($host)) {
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP sunucu adresi ayarlanmamış.'];
        }
        
        return self::testFtpConnectionWithDetails($host, $user, $pass, $port, $ssl, ucfirst($type));
    }
    
    public static function testFtpConnectionWithDetails($host, $user, $pass, $port = 21, $ssl = false, $ftpTypeLabel = 'FTP') {
        if (empty($host)) { return ['status' => 'error', 'message' => $ftpTypeLabel . ' Host bilgisi eksik.']; }
        
        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);
        if (!$connect_function) { return ['status' => 'error', 'message' => $ftpTypeLabel . ' PHP FTP eklentisi aktif değil.']; }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function(trim($host), (int)$port, 15);
        error_reporting($old_error_reporting);

        if ($conn_id) {
            $login_user_to_test = !empty(trim($user)) ? trim($user) : 'anonymous';
            
            $login_pass_to_test = trim($pass);
            if ($login_pass_to_test === '********') {
                 $ftp_type_key_part = (strtolower($ftpTypeLabel) === 'yedek') ? 'backup' : 'main';
                 $db_pass = self::get_btk_setting($ftp_type_key_part . '_ftp_pass');
                 $login_pass_to_test = $db_pass ?: '';
            }
            
            if (@ftp_login($conn_id, $login_user_to_test, $login_pass_to_test)) {
                @ftp_pasv($conn_id, true);
                $message = $ftpTypeLabel . ' sunucusuna başarıyla bağlanıldı.';
                @ftp_close($conn_id);
                return ['status' => 'success', 'message' => $message];
            } else {
                $message = $ftpTypeLabel . ' sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: \'' . htmlspecialchars($login_user_to_test) . '\'). Lütfen bilgileri kontrol edin.';
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => $message];
            }
        } else {
            $message = $ftpTypeLabel . ' sunucusuna (' . htmlspecialchars($host) . ':' . (int)$port . ') bağlanılamadı. Host, port veya ağ ayarlarını kontrol edin.';
            return ['status' => 'error', 'message' => $message];
        }
    }

    public static function uploadFileToFtp($localFilePath, $remoteFileName, $type = 'main', $raporTuru = 'BILINMEYEN', $yetkiTuruGrup = null) {
        if (!file_exists($localFilePath) || !is_readable($localFilePath)) {
            self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Yerel dosya bulunamadı veya okunamıyor: $localFilePath");
            return ['status' => 'error', 'message' => "Yerel dosya bulunamadı veya okunamıyor: $localFilePath"];
        }
        $fileSize = filesize($localFilePath);
        if ($fileSize === 0 && self::get_btk_setting('send_empty_reports') !== '1') {
            self::logAction(ucfirst($type) . " FTP Yükleme Atlandı ($raporTuru)", 'INFO', "Dosya boş (0 byte) ve boş rapor gönderimi kapalı: $localFilePath");
            return ['status' => 'skipped', 'message' => "Dosya boş ve boş rapor gönderimi kapalı, yükleme atlandı."];
        }

        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass');
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (self::get_btk_setting($type . '_ftp_ssl', '0') === '1');
        
        $raporTuruNormalized = strtoupper($raporTuru);
        $pathKeyPart = '';
        if (strpos($raporTuruNormalized, 'REHBER') !== false) $pathKeyPart = 'rehber';
        elseif (strpos($raporTuruNormalized, 'HAREKET') !== false) $pathKeyPart = 'hareket';
        elseif (strpos($raporTuruNormalized, 'PERSONEL') !== false) $pathKeyPart = 'personel';
        else { self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Bilinmeyen rapor türü ($raporTuru) için FTP yolu belirlenemedi."); return ['status' => 'error', 'message' => 'Bilinmeyen rapor türü için FTP yolu belirlenemedi.'];}

        $basePathSettingKey = strtolower($type) . '_ftp_' . $pathKeyPart . '_path';
        $basePath = self::get_btk_setting($basePathSettingKey, '/');
        $remoteDir = trim($basePath, '/');
        $remoteFileFullPath = ($remoteDir === '' || $remoteDir === '.') ? $remoteFileName : rtrim($remoteDir, '/') . '/' . $remoteFileName;

        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);
        if (!$connect_function) { self::logAction(ucfirst($type) . ' FTP Yükleme Hatası', 'CRITICAL', 'PHP FTP eklentisi aktif değil.'); return ['status' => 'error', 'message' => ucfirst($type) . ' FTP fonksiyonları sunucunuzda etkin değil.']; }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function($host, $port, 30);
        error_reporting($old_error_reporting);

        if ($conn_id) {
            $login_user_ftp = !empty($user) ? $user : 'anonymous';
            $login_pass_ftp = $pass ?? '';

            if (@ftp_login($conn_id, $login_user_ftp, $login_pass_ftp)) {
                @ftp_pasv($conn_id, true);
                if ($remoteDir !== '' && $remoteDir !== '.') {
                    $parts = explode('/', $remoteDir);
                    $currentBuildPath = (substr($basePath, 0, 1) === '/') ? '/' : '';
                    foreach ($parts as $part) {
                        if (empty($part)) continue;
                        $currentBuildPath = rtrim($currentBuildPath, '/') . '/' . $part;
                        $currentBuildPath = preg_replace('#/+#','/',$currentBuildPath);
                        if (!@ftp_chdir($conn_id, $currentBuildPath)) {
                            if (!@ftp_mkdir($conn_id, $currentBuildPath)) {
                                $message = "$type FTP: Uzak dizin ($currentBuildPath) oluşturulamadı veya erişilemedi.";
                                @ftp_close($conn_id);
                                self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', $message);
                                return ['status' => 'error', 'message' => $message];
                            }
                        }
                    }
                     if (!@ftp_chdir($conn_id, $remoteDir) && strpos($remoteDir, '/') !== false) {
                         $message = "$type FTP: Hedef dizine ($remoteDir) girilemedi (chdir sonrası).";
                         @ftp_close($conn_id);
                         self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', $message);
                         return ['status' => 'error', 'message' => $message];
                     }
                }
                
                if (@ftp_put($conn_id, $remoteFileName, $localFilePath, FTP_BINARY)) {
                    $message = "$remoteFileName dosyası başarıyla $type FTP sunucusuna ($remoteFileFullPath) yüklendi.";
                    @ftp_close($conn_id);
                    return ['status' => 'success', 'message' => $message, 'remote_path' => $remoteFileFullPath];
                } else {
                    $ftp_error = error_get_last();
                    $currentRemoteDirPwd = @ftp_pwd($conn_id);
                    $message = "$remoteFileName dosyası $type FTP sunucusuna ($remoteFileFullPath) yüklenirken hata (Mevcut Uzak Dizin: $currentRemoteDirPwd)." . ($ftp_error ? ' (FTP Hatası: ' . $ftp_error['message'] . ')' : ' (ftp_put başarısız)');
                    @ftp_close($conn_id);
                    return ['status' => 'error', 'message' => $message];
                }
            } else { @ftp_close($conn_id); return ['status' => 'error', 'message' => "$type FTP sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: '$login_user_ftp')."]; }
        } else { $ftp_error = error_get_last(); $message = "$type FTP sunucusuna ($host:$port) bağlanılamadı." . ($ftp_error ? ' (Bağlantı Hatası: ' . $ftp_error['message'] . ')' : ''); return ['status' => 'error', 'message' => $message]; }
    }
    
    public static function logFtpSubmission($dosyaAdi, $raporTuru, $ftpSunucuTipi, $durum, $cntNumarasi, $hataMesaji = null, $yetkiTuruGrup = null) {
        try { Capsule::table('mod_btk_ftp_logs')->insert(['dosya_adi' => substr($dosyaAdi,0,255), 'rapor_turu' => strtoupper(substr($raporTuru,0,50)), 'yetki_turu_grup' => substr($yetkiTuruGrup,0,50), 'ftp_sunucu_tipi' => strtoupper(substr($ftpSunucuTipi,0,10)), 'durum' => ucfirst(strtolower(substr($durum,0,50))), 'cnt_numarasi' => substr($cntNumarasi,0,2), 'hata_mesaji' => $hataMesaji, 'gonderim_zamani' => gmdate('Y-m-d H:i:s')]); } 
        catch (Exception $e) { self::logAction('FTP Log Kayıt Hatası', 'HATA', $e->getMessage()); }
    }
    
    // --- Adres Verileri İçin Yardımcı Fonksiyonlar ---
    public static function getIller() {
        try { $iller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get(['id', 'il_adi', 'plaka_kodu'])->all(); return array_map(function($il){ return (array)$il; }, $iller); } 
        catch (Exception $e) { self::logAction('İl Listesi Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }
    public static function getIlcelerByIlId($il_id, $includeIlAdi = false) {
        if ($il_id === null && $includeIlAdi) {
             try { $results = Capsule::table('mod_btk_adres_ilce as ilce')->join('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')->select('ilce.id', 'ilce.ilce_adi', 'il.il_adi as il_adi_prefix')->orderBy('il.il_adi')->orderBy('ilce.ilce_adi')->get()->all(); return array_map(function($item){ return (array)$item; }, $results);} 
             catch (Exception $e) { self::logAction('Tüm İlçe Listesi (İl Adıyla) Okuma Hatası', 'Hata', $e->getMessage()); return []; }
        }
        if (empty($il_id) || !is_numeric($il_id)) return [];
        try {
            $query = Capsule::table('mod_btk_adres_ilce')->where('il_id', (int)$il_id)->orderBy('ilce_adi');
            if ($includeIlAdi) { $query->join('mod_btk_adres_il as il', 'mod_btk_adres_ilce.il_id', '=', 'il.id')->select('mod_btk_adres_ilce.id as ilce_id', 'mod_btk_adres_ilce.ilce_adi', 'il.il_adi'); } 
            else { $query->select('id', 'ilce_adi'); }
            $results = $query->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) { self::logAction('İlçe Listesi Okuma Hatası', 'HATA', "İl ID: $il_id, " . $e->getMessage()); return []; }
    }
    public static function getMahallelerByIlceId($ilce_id) {
        if (empty($ilce_id) || !is_numeric($ilce_id)) return [];
        try { $results = Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', (int)$ilce_id)->orderBy('mahalle_adi')->get(['id', 'mahalle_adi', 'posta_kodu'])->all(); return array_map(function($item){ return (array)$item; }, $results); } 
        catch (Exception $e) { self::logAction('Mahalle Listesi Okuma Hatası', 'HATA', "İlçe ID: $ilce_id, " . $e->getMessage()); return []; }
    }
    public static function getIlIdByAdi($ilAdi) {
        if(empty(trim($ilAdi))) return null;
        try { $il = Capsule::table('mod_btk_adres_il')->where('il_adi', trim(mb_strtoupper($ilAdi, 'UTF-8')))->first(); return $il ? $il->id : null; } 
        catch (Exception $e) { self::logAction('İl ID Bulma Hatası (Ad ile)', 'UYARI', "İl Adı: $ilAdi, Hata: " . $e->getMessage()); return null; }
    }
     public static function getIlceIdByAdi($ilceAdi, $ilId) {
        if(empty(trim($ilceAdi)) || empty($ilId) || !is_numeric($ilId)) return null;
        try { $ilce = Capsule::table('mod_btk_adres_ilce')->where('il_id', (int)$ilId)->where('ilce_adi', trim(mb_strtoupper($ilceAdi, 'UTF-8')))->first(); return $ilce ? $ilce->id : null; } 
        catch (Exception $e) { self::logAction('İlçe ID Bulma Hatası (Ad ile)', 'UYARI', "İlçe Adı: $ilceAdi, İl ID: $ilId, Hata: " . $e->getMessage()); return null; }
    }
     public static function getMahalleIdByAdi($mahalleAdi, $ilceId) {
        if(empty(trim($mahalleAdi)) || empty($ilceId) || !is_numeric($ilceId)) return null;
        try { $mahalle = Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', (int)$ilceId)->where('mahalle_adi', trim(mb_strtoupper($mahalleAdi, 'UTF-8')))->first(); return $mahalle ? $mahalle->id : null; } 
        catch (Exception $e) { self::logAction('Mahalle ID Bulma Hatası (Ad ile)', 'UYARI', "Mahalle Adı: $mahalleAdi, İlçe ID: $ilceId, Hata: " . $e->getMessage()); return null; }
    }
    
    // --- ISS POP Noktaları İçin Yardımcı Fonksiyonlar ---
    public static function searchPopSSIDs($term = '', $filter_by = null, $filter_value = null, $limit = 25) {
        if (empty($term) && (empty($filter_by) || $filter_value === '' || is_null($filter_value) )) return [];
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari as pop')->where('pop.aktif_pasif_durum', 1);
            
            if (!empty($filter_by) && $filter_value !== '' && !is_null($filter_value) && is_numeric($filter_value)) {
                $valid_filters = ['il_id', 'ilce_id', 'mahalle_id'];
                if (in_array($filter_by, $valid_filters)) {
                    $query->where("pop.".$filter_by, (int)$filter_value);
                }
            }
            if (!empty($term)) {
                $query->where(function ($q) use ($term) {
                    $q->where('pop.yayin_yapilan_ssid', 'LIKE', '%' . $term . '%')
                      ->orWhere('pop.pop_adi', 'LIKE', '%' . $term . '%');
                });
            }
            
            $results = $query->orderBy('pop.pop_adi')->orderBy('pop.yayin_yapilan_ssid')->take($limit)
                             ->select('pop.id', 'pop.yayin_yapilan_ssid', 'pop.pop_adi')->distinct()->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) { self::logAction('POP SSID Arama Hatası', 'Hata', $e->getMessage()); return []; }
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
        } catch (Exception $e) { self::logAction('ISS POP ID ile Okuma Hatası', 'HATA', "ID: $id, Hata: ".$e->getMessage()); return null; }
    }
    
    public static function getIssPopNoktalariList($filters = [], $orderBy = 'pop.pop_adi', $sortOrder = 'ASC', $limit = 25, $offset = 0) {
        try {
            $countQuery = Capsule::table('mod_btk_iss_pop_noktalari as pop');
            if(!empty($filters['s_pop_adi'])) $countQuery->where('pop.pop_adi', 'LIKE', '%'.trim($filters['s_pop_adi']).'%');
            if(!empty($filters['s_yayin_yapilan_ssid'])) $countQuery->where('pop.yayin_yapilan_ssid', 'LIKE', '%'.trim($filters['s_yayin_yapilan_ssid']).'%');
            if(!empty($filters['s_il_id']) && is_numeric($filters['s_il_id'])) $countQuery->where('pop.il_id', (int)$filters['s_il_id']);
            if(!empty($filters['s_ilce_id']) && is_numeric($filters['s_ilce_id'])) $countQuery->where('pop.ilce_id', (int)$filters['s_ilce_id']);
            if(isset($filters['s_aktif_pasif_durum']) && $filters['s_aktif_pasif_durum'] !== '' && is_numeric($filters['s_aktif_pasif_durum'])) {
                $countQuery->where('pop.aktif_pasif_durum', (int)$filters['s_aktif_pasif_durum']);
            }
            $total = $countQuery->count();

            $dataQuery = Capsule::table('mod_btk_iss_pop_noktalari as pop')
                        ->leftJoin('mod_btk_adres_il as il', 'pop.il_id', '=', 'il.id')
                        ->leftJoin('mod_btk_adres_ilce as ilce', 'pop.ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_mahalle as mah', 'pop.mahalle_id', '=', 'mah.id');
            if(!empty($filters['s_pop_adi'])) $dataQuery->where('pop.pop_adi', 'LIKE', '%'.trim($filters['s_pop_adi']).'%');
            if(!empty($filters['s_yayin_yapilan_ssid'])) $dataQuery->where('pop.yayin_yapilan_ssid', 'LIKE', '%'.trim($filters['s_yayin_yapilan_ssid']).'%');
            if(!empty($filters['s_il_id']) && is_numeric($filters['s_il_id'])) $dataQuery->where('pop.il_id', (int)$filters['s_il_id']);
            if(!empty($filters['s_ilce_id']) && is_numeric($filters['s_ilce_id'])) $dataQuery->where('pop.ilce_id', (int)$filters['s_ilce_id']);
            if(isset($filters['s_aktif_pasif_durum']) && $filters['s_aktif_pasif_durum'] !== '' && is_numeric($filters['s_aktif_pasif_durum'])) {
                $dataQuery->where('pop.aktif_pasif_durum', (int)$filters['s_aktif_pasif_durum']);
            }
            
            $allowedOrderColumns = ['pop.pop_adi', 'pop.yayin_yapilan_ssid', 'il.il_adi', 'ilce.ilce_adi', 'pop.pop_tipi', 'pop.aktif_pasif_durum'];
            $safeOrderBy = in_array($orderBy, $allowedOrderColumns) ? $orderBy : 'pop.pop_adi';
            $safeSortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

            $pops = $dataQuery->select('pop.*', 'il.il_adi', 'ilce.ilce_adi', 'mah.mahalle_adi')
                              ->orderByRaw(Capsule::connection()->getQueryGrammar()->wrap($safeOrderBy) . " $safeSortOrder") 
                              ->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($pop){ return (array)$pop; }, $pops), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('ISS POP Listesi Okuma Hatası', 'HATA', $e->getMessage()); return ['data' => [], 'total_count' => 0];}
    }

    public static function saveIssPopNoktasi($data) {
        $adminId = self::getCurrentAdminId();
        if (empty(trim($data['pop_adi'] ?? '')) || empty(trim($data['yayin_yapilan_ssid'] ?? ''))) {
            self::logAction('ISS POP Kaydetme Hatası', 'UYARI', 'POP Adı veya Yayın SSID boş olamaz.', $adminId, ['data_keys' => array_keys($data)]);
            return ['status' => false, 'message' => 'POP Adı ve Yayın Yapılan SSID alanları zorunludur.'];
        }
        try {
            $popData = [
                'pop_adi' => trim($data['pop_adi']),
                'yayin_yapilan_ssid' => trim($data['yayin_yapilan_ssid']),
                'ip_adresi' => isset($data['ip_adresi']) ? trim($data['ip_adresi']) : null,
                'cihaz_turu' => $data['cihaz_turu'] ?? null,
                'cihaz_markasi' => $data['cihaz_markasi'] ?? null,
                'cihaz_modeli' => $data['cihaz_modeli'] ?? null,
                'pop_tipi' => $data['pop_tipi'] ?? null,
                'il_id' => !empty($data['il_id']) && is_numeric($data['il_id']) ? (int)$data['il_id'] : null,
                'ilce_id' => !empty($data['ilce_id']) && is_numeric($data['ilce_id']) ? (int)$data['ilce_id'] : null,
                'mahalle_id' => !empty($data['mahalle_id']) && is_numeric($data['mahalle_id']) ? (int)$data['mahalle_id'] : null,
                'tam_adres' => $data['tam_adres_detay'] ?? null, // Modal'dan gelen isim
                'koordinatlar' => (!empty($data['enlem']) && !empty($data['boylam'])) ? $data['enlem'] . ',' . $data['boylam'] : null,
                'aktif_pasif_durum' => (isset($data['aktif_pasif_durum']) && ($data['aktif_pasif_durum'] === '1' || $data['aktif_pasif_durum'] === 'on' || $data['aktif_pasif_durum'] === true)) ? 1 : 0,
            ];
            
            $popIdToUpdate = isset($data['pop_id_modal']) ? (int)$data['pop_id_modal'] : (isset($data['pop_id']) ? (int)$data['pop_id'] : 0);

            $uniqueCheckQuery = Capsule::table('mod_btk_iss_pop_noktalari')
                                ->where('yayin_yapilan_ssid', $popData['yayin_yapilan_ssid'])
                                ->where('pop_adi', $popData['pop_adi']);
            if($popData['ilce_id']) $uniqueCheckQuery->where('ilce_id', $popData['ilce_id']); 
            else $uniqueCheckQuery->whereNull('ilce_id');

            if ($popIdToUpdate > 0) {
                $uniqueCheckQuery->where('id', '!=', $popIdToUpdate);
            }
            $existingPop = $uniqueCheckQuery->first();
            if($existingPop){
                 $errorMsg = "Aynı ilçe, POP Adı ve Yayın SSID kombinasyonu zaten mevcut (ID: {$existingPop->id}).";
                 self::logAction('ISS POP Kaydetme Hatası', 'UYARI', $errorMsg, $adminId);
                 return ['status' => false, 'message' => $errorMsg];
            }

            if ($popIdToUpdate > 0) {
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popIdToUpdate)->update($popData);
                self::logAction('ISS POP Güncellendi', 'BAŞARILI', "ID: $popIdToUpdate", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla güncellendi.', 'id' => $popIdToUpdate];
            } else {
                $popId = Capsule::table('mod_btk_iss_pop_noktalari')->insertGetId($popData);
                self::logAction('ISS POP Eklendi', 'BAŞARILI', "Yeni ID: $popId", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla eklendi.', 'id' => $popId];
            }
        } catch (Exception $e) {
            self::logAction('ISS POP Kaydetme/Güncelleme Veritabanı Hatası', 'HATA', $e->getMessage(), $adminId, ['data_keys' => array_keys($data), 'trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'POP Noktası kaydedilirken bir veritabanı hatası oluştu.'];
        }
    }

    public static function deleteIssPopNoktasi($popId, $adminId = null) {
        $logKullaniciId = $adminId ?? self::getCurrentAdminId();
        if(empty($popId) || !is_numeric($popId) || (int)$popId <=0) {
            return ['status' => false, 'message' => 'Geçersiz POP ID.'];
        }
        try {
            $pop = self::getIssPopNoktasiById((int)$popId);
            if (!$pop) { return ['status' => false, 'message' => "Silinecek POP Noktası (ID: $popId) bulunamadı."]; }
            
            $usageCountRehber = Capsule::table('mod_btk_abone_rehber')->where('iss_pop_noktasi_id', (int)$popId)->count();
            $usageCountMapping = Capsule::table('mod_btk_service_pop_mapping')->where('iss_pop_noktasi_id', (int)$popId)->count();
            
            if ($usageCountRehber > 0 || $usageCountMapping > 0) {
                $totalUsage = $usageCountRehber + $usageCountMapping;
                $errorMsg = "Bu POP noktası ({$pop['pop_adi']} - {$pop['yayin_yapilan_ssid']}) $totalUsage adet hizmetle ilişkilidir ve silinemez. Önce hizmetlerden bu POP noktası seçimini kaldırın.";
                self::logAction('ISS POP Silme Engellendi', 'UYARI', $errorMsg, $logKullaniciId);
                return ['status' => false, 'message' => $errorMsg];
            }

            $deleted = Capsule::table('mod_btk_iss_pop_noktalari')->where('id', (int)$popId)->delete();
            if ($deleted) {
                self::logAction('ISS POP Silindi', 'BAŞARILI', "ID: $popId, Adı: {$pop['pop_adi']}", $logKullaniciId);
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
            $queryCount = Capsule::table('mod_btk_personel as p');
            $queryData = Capsule::table('mod_btk_personel as p')
                        ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                        ->leftJoin('mod_btk_adres_ilce as ilce', 'p.gorev_bolgesi_ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')
                        ->leftJoin('tbladmins as a', 'p.whmcs_admin_id', '=', 'a.id');

            $applyFilters = function ($q) use ($filters) {
                if(!empty($filters['s_ad'])) $q->where('p.ad', 'LIKE', '%'.trim($filters['s_ad']).'%');
                if(!empty($filters['s_soyad'])) $q->where('p.soyad', 'LIKE', '%'.trim($filters['s_soyad']).'%');
                if(!empty($filters['s_tckn'])) $q->where('p.tckn', '=', preg_replace('/[^0-9]/', '', $filters['s_tckn']));
                if(!empty($filters['s_email'])) $q->where('p.email', 'LIKE', '%'.trim($filters['s_email']).'%');
                if(isset($filters['s_departman_id']) && $filters['s_departman_id'] !== '' && is_numeric($filters['s_departman_id'])) {
                    $q->where('p.departman_id', (int)$filters['s_departman_id']);
                }
                if(isset($filters['s_btk_listesine_eklensin']) && $filters['s_btk_listesine_eklensin'] !== '' && is_numeric($filters['s_btk_listesine_eklensin'])) {
                    $q->where('p.btk_listesine_eklensin', (int)$filters['s_btk_listesine_eklensin']);
                }
                if(isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '1'){
                    $q->whereNull('p.isten_ayrilma_tarihi');
                } elseif (isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '0') {
                     $q->whereNotNull('p.isten_ayrilma_tarihi');
                }
            };
            
            $applyFilters($queryCount);
            $applyFilters($queryData);

            $total = $queryCount->count();
            
            $allowedOrderColumnsPersonel = ['p.ad', 'p.soyad', 'p.tckn', 'p.unvan', 'd.departman_adi', 'p.email', 'p.btk_listesine_eklensin'];
            $safeOrderBy = in_array($orderBy, $allowedOrderColumnsPersonel) ? $orderBy : 'p.soyad';
            $safeSortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

            $personeller = $queryData->select(
                                    'p.id', 'p.whmcs_admin_id', 'p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn',
                                    'p.unvan', 'p.departman_id', 'p.mobil_tel', 'p.sabit_tel', 'p.email',
                                    'p.ev_adresi', 'p.acil_durum_kisi_iletisim', 'p.ise_baslama_tarihi',
                                    'p.isten_ayrilma_tarihi', 'p.is_birakma_nedeni', 'p.gorev_bolgesi_ilce_id',
                                    'p.btk_listesine_eklensin', 'p.tckn_dogrulama_durumu', 'p.tckn_dogrulama_mesaji',
                                    'd.departman_adi', 
                                    'ilce.ilce_adi as gorev_bolgesi_ilce_adi',
                                    'il.il_adi as gorev_bolgesi_il_adi',
                                    Capsule::raw("CONCAT(a.firstname, ' ', a.lastname) as whmcs_admin_name")
                                 )
                                 ->orderByRaw(Capsule::connection()->getQueryGrammar()->wrap($safeOrderBy) . " $safeSortOrder") 
                                 ->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($p){ return (array)$p; }, $personeller), 'total_count' => $total];
        } catch (Exception $e) { 
            self::logAction('Personel Listesi Okuma Hatası', 'HATA', $e->getMessage()); 
            return ['data' => [], 'total_count' => 0];
        }
    }
    public static function getPersonelById($id) {
        if(empty($id) || !is_numeric($id) || (int)$id <= 0) return null;
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

        // Zorunlu Alan Kontrolleri
        if (empty(trim($data['ad'] ?? ''))) $validationErrors[] = 'Ad alanı boş bırakılamaz.';
        if (empty(trim($data['soyad'] ?? ''))) $validationErrors[] = 'Soyad alanı boş bırakılamaz.';
        $tckn = preg_replace('/[^0-9]/', '', $data['tckn'] ?? '');
        $isYkn = substr($tckn, 0, 2) === '99';

        if (empty($tckn)) $validationErrors[] = 'Kimlik Numarası alanı boş bırakılamaz.';
        elseif ($isYkn && strlen($tckn) !== 11) $validationErrors[] = 'Yabancı Kimlik Numarası 11 haneli olmalıdır.';
        elseif (!$isYkn && strlen($tckn) !== 11) $validationErrors[] = 'T.C. Kimlik Numarası 11 haneli olmalıdır.';

        if (empty(trim($data['unvan'] ?? ''))) $validationErrors[] = 'Ünvan alanı boş bırakılamaz.';
        if (empty(trim($data['departman_id'] ?? ''))) $validationErrors[] = 'Çalıştığı Birim alanı boş bırakılamaz.';
        
        if (!empty(trim($data['mobil_tel'] ?? '')) && !preg_match('/^[0-9]{10,15}$/', preg_replace('/[^0-9]/', '', $data['mobil_tel']))) {
            $validationErrors[] = 'Mobil telefon numarası sadece rakamlardan oluşmalı ve 10-15 hane uzunluğunda olmalıdır.';
        }
        if (!empty(trim($data['sabit_tel'] ?? '')) && !preg_match('/^[0-9]{10,15}$/', preg_replace('/[^0-9]/', '', $data['sabit_tel']))) {
            $validationErrors[] = 'Sabit telefon numarası sadece rakamlardan oluşmalı ve 10-15 hane uzunluğunda olmalıdır.';
        }
        if (empty(trim($data['email'] ?? ''))) $validationErrors[] = 'E-posta Adresi boş bırakılamaz.';
        elseif (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) $validationErrors[] = 'Geçersiz e-posta adresi formatı.';
        
        if (!empty($data['ise_baslama_tarihi']) && !self::isValidDate($data['ise_baslama_tarihi'])) $validationErrors[] = 'Geçersiz işe başlama tarihi formatı (YYYY-AA-GG bekleniyor).';
        if (!empty($data['isten_ayrilma_tarihi']) && !self::isValidDate($data['isten_ayrilma_tarihi'])) $validationErrors[] = 'Geçersiz işten ayrılma tarihi formatı (YYYY-AA-GG bekleniyor).';

        if (!empty($validationErrors)) { 
            self::logAction('Personel Kaydetme Doğrulama Hatası', 'UYARI', implode(', ', $validationErrors), $logKullaniciId, ['data_keys' => array_keys($data)]); 
            return ['status' => false, 'message' => implode('<br>', $validationErrors)];
        }
        
        // NVI Doğrulama Mantığı
        // AJAX tarafında yapılıyor, ancak zorunlu kayıt için burada da kontrol edilebilir.
        $existingPersonel = $personelIdToUpdate > 0 ? self::getPersonelById($personelIdToUpdate) : null;
        if ($existingPersonel && $existingPersonel['tckn_dogrulama_durumu'] !== 'Dogrulandi') {
             // Opsiyonel olarak, NVI doğrulaması olmadan kaydı engellemek için burada bir kontrol daha yapılabilir.
        }

        try {
            $personelDataToSave = [
                'whmcs_admin_id' => !empty($data['whmcs_admin_id_modal']) && is_numeric($data['whmcs_admin_id_modal']) && (int)$data['whmcs_admin_id_modal'] > 0 ? (int)$data['whmcs_admin_id_modal'] : null,
                'firma_unvani' => self::get_btk_setting('operator_title', self::get_btk_setting('operator_name','[FİRMA AYARLANMAMIŞ]')),
                'ad' => trim($data['ad']), 'soyad' => trim($data['soyad']), 'tckn' => $tckn,
                'unvan' => isset($data['unvan']) ? trim($data['unvan']) : null,
                'departman_id' => !empty($data['departman_id']) && is_numeric($data['departman_id']) ? (int)$data['departman_id'] : null,
                'mobil_tel' => isset($data['mobil_tel']) ? preg_replace('/[^0-9]/', '', $data['mobil_tel']) : null,
                'sabit_tel' => isset($data['sabit_tel']) ? preg_replace('/[^0-9]/', '', $data['sabit_tel']) : null,
                'email' => trim($data['email']),
                'ev_adresi' => $data['ev_adresi'] ?? null,
                'acil_durum_kisi_iletisim' => $data['acil_durum_kisi_iletisim'] ?? null,
                'ise_baslama_tarihi' => null, 'isten_ayrilma_tarihi' => null,
                'is_birakma_nedeni' => $data['is_birakma_nedeni'] ?? null,
                'gorev_bolgesi_ilce_id' => !empty($data['gorev_bolgesi_ilce_id']) && is_numeric($data['gorev_bolgesi_ilce_id']) ? (int)$data['gorev_bolgesi_ilce_id'] : null,
                'btk_listesine_eklensin' => (isset($data['btk_listesine_eklensin']) && ($data['btk_listesine_eklensin'] === '1' || $data['btk_listesine_eklensin'] === 'on')) ? 1 : 0,
            ];

            try { if(!empty($data['ise_baslama_tarihi']) && self::isValidDate($data['ise_baslama_tarihi'])) $personelDataToSave['ise_baslama_tarihi'] = (new DateTime($data['ise_baslama_tarihi']))->format('Y-m-d'); } catch (Exception $e) {}
            try { if(!empty($data['isten_ayrilma_tarihi']) && self::isValidDate($data['isten_ayrilma_tarihi'])) $personelDataToSave['isten_ayrilma_tarihi'] = (new DateTime($data['isten_ayrilma_tarihi']))->format('Y-m-d'); } catch (Exception $e) {}
            
            $uniqueCheckQueryTCKN = Capsule::table('mod_btk_personel')->where('tckn', $personelDataToSave['tckn'])->whereNull('isten_ayrilma_tarihi');
            $uniqueCheckQueryAdminID = $personelDataToSave['whmcs_admin_id'] ? Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $personelDataToSave['whmcs_admin_id']) : null;
            if ($personelIdToUpdate > 0) { $uniqueCheckQueryTCKN->where('id', '!=', $personelIdToUpdate); if($uniqueCheckQueryAdminID) $uniqueCheckQueryAdminID->where('id', '!=', $personelIdToUpdate); }
            $existingPersonelByTCKN = $uniqueCheckQueryTCKN->first(); if ($existingPersonelByTCKN) { 
                $errorMsg = "Bu Kimlik Numarası ({$personelDataToSave['tckn']}) zaten aktif bir personele (ID: {$existingPersonelByTCKN->id} - {$existingPersonelByTCKN->ad} {$existingPersonelByTCKN->soyad}) ait.";
                self::logAction('Personel Kaydetme Hatası', 'UYARI', $errorMsg, $logKullaniciId);
                return ['status' => false, 'message' => $errorMsg]; 
            }
            if ($uniqueCheckQueryAdminID) { $existingPersonelByAdminID = $uniqueCheckQueryAdminID->first(); if ($existingPersonelByAdminID) { 
                $errorMsg = "Seçilen WHMCS Yöneticisi (ID: {$personelDataToSave['whmcs_admin_id']}) zaten başka bir personele (ID: {$existingPersonelByAdminID->id} - {$existingPersonelByAdminID->ad} {$existingPersonelByAdminID->soyad}) atanmış.";
                self::logAction('Personel Kaydetme Hatası', 'UYARI', $errorMsg, $logKullaniciId);
                return ['status' => false, 'message' => $errorMsg]; 
            }}

            if ($personelIdToUpdate > 0) { Capsule::table('mod_btk_personel')->where('id', $personelIdToUpdate)->update($personelDataToSave); self::logAction('Personel Güncellendi', 'BAŞARILI', "ID: $personelIdToUpdate", $logKullaniciId); return ['status' => true, 'message' => 'Personel başarıyla güncellendi.']; }
            else { $personelId = Capsule::table('mod_btk_personel')->insertGetId($personelDataToSave); self::logAction('Personel Eklendi', 'BAŞARILI', "Yeni ID: $personelId", $logKullaniciId); return ['status' => true, 'message' => 'Personel başarıyla eklendi.']; }
        } catch (Exception $e) { self::logAction('Personel Kaydetme DB Hatası', 'HATA', $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]); return ['status' => false, 'message' => 'Veritabanı hatası. Lütfen logları kontrol edin. Hata: '. substr($e->getMessage(),0,100)]; }
    }
    public static function deletePersonel($personelId, $adminId = null) {
        $logKullaniciId = $adminId ?? self::getCurrentAdminId();
        if(empty($personelId) || !is_numeric($personelId) || (int)$personelId <=0) { return ['status' => false, 'message' => 'Geçersiz Personel ID.'];}
        try {
            $personel = self::getPersonelById((int)$personelId);
            if (!$personel) { return ['status' => false, 'message' => "Silinecek personel (ID: $personelId) bulunamadı."]; }
            $deleted = Capsule::table('mod_btk_personel')->where('id', (int)$personelId)->delete();
            if ($deleted) { self::logAction('Personel Silindi', 'BAŞARILI', "ID: $personelId, Ad Soyad: {$personel['ad']} {$personel['soyad']}", $logKullaniciId); return ['status' => true, 'message' => 'Personel başarıyla silindi.'];}
            self::logAction('Personel Silme Başarısız', 'UYARI', "ID: $personelId silinemedi (DB Hatası veya kayıt yok).", $logKullaniciId);
            return ['status' => false, 'message' => 'Personel silinirken bir sorun oluştu veya kayıt bulunamadı.'];
        } catch (Exception $e) { self::logAction('Personel Silme Kapsamlı Hata', 'HATA', "ID: $personelId, Hata: " . $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]); return ['status' => false, 'message' => 'Personel silinirken bir veritabanı hatası oluştu.'];}
    }
    public static function getDepartmanList() {
        try { $departments = Capsule::table('mod_btk_personel_departmanlari')->orderBy('departman_adi')->get()->all(); return array_map(function($dept){ return (array)$dept; }, $departments); }
        catch (Exception $e) { self::logAction('Departman Listesi Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }
    public static function getTeknikPersonelForIlce($ilce_id) {
        if(empty($ilce_id) || !is_numeric($ilce_id)) return [];
        try {
            $teknikDepartmanAdlariSetting = self::get_btk_setting('teknik_departman_adlari', 'Teknik Destek Departmanı,Saha Operasyon Departmanı');
            $teknikDepartmanAdlari = array_filter(array_map('trim', explode(',', $teknikDepartmanAdlariSetting))); 
            if(empty($teknikDepartmanAdlari)) { self::logAction('Teknik Personel Arama Uyarısı', 'UYARI', 'Teknik departman adları ayarlanmamış veya boş.', null, ['ilce_id' => $ilce_id]); return []; }
            $personeller = Capsule::table('mod_btk_personel as p')->join('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')->where('p.gorev_bolgesi_ilce_id', (int)$ilce_id)->whereIn('d.departman_adi', $teknikDepartmanAdlari)->whereNull('p.isten_ayrilma_tarihi')->where('p.btk_listesine_eklensin', 1)->select('p.id', Capsule::raw("CONCAT(p.ad, ' ', p.soyad) as tam_ad"), 'p.email')->orderBy('p.soyad')->orderBy('p.ad')->get()->all();
            return array_map(function($p){ return (array)$p; }, $personeller);
        } catch (Exception $e) { self::logAction('Teknik Personel Okuma Hatası (İlçe)', 'HATA', "İlçe ID: $ilce_id, Hata: ".$e->getMessage()); return []; }
    }
    public static function getTumIlcelerWithIlAdi() {
        try { $results = Capsule::table('mod_btk_adres_ilce as ilce')->join('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')->select('ilce.id as ilce_id', 'ilce.ilce_adi', 'il.il_adi')->orderBy('il.il_adi')->orderBy('ilce.ilce_adi')->get()->all(); return array_map(function($item){ return (array)$item; }, $results); } 
        catch (Exception $e) { self::logAction('Tüm İlçe Listesi (İl Adıyla) Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }
    private static function isValidDate($dateString, $format = 'Y-m-d') { 
        if (empty($dateString)) return false; 
        try { 
            $d = DateTime::createFromFormat($format, $dateString); 
            return $d && $d->format($format) === $dateString; 
        } catch (Exception $e) { 
            return false; 
        } 
    }

    // --- Dosya Adlandırma ve CNT Yönetimi ---
    public static function generateReportFilename($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $cnt, $timestamp = null, $forFtpType = 'main') {
        if (empty(trim($operatorAdi))) { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Adı boş olamaz.'); return false; }
        $raporTuruUpper = strtoupper(trim($raporTuru));
        if ($raporTuruUpper !== 'PERSONEL_LISTESI' && empty(trim($operatorKodu))) { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Kodu (Personel hariç) boş olamaz.'); return false; }
        if (is_null($timestamp)) { $timestamp = time(); } $dateTimePart = gmdate('YmdHis', $timestamp);
        $cntPadded = str_pad((string)$cnt, 2, '0', STR_PAD_LEFT);
        $cleanOperatorName = strtoupper(preg_replace('/[^A-Z0-9_]/i', '', str_replace(' ', '_', trim($operatorAdi))));

        if ($raporTuruUpper === 'PERSONEL_LISTESI') {
            $addYearMonthSettingKey = strtolower($forFtpType) . '_personel_filename_add_year_month';
            $defaultAddYearMonth = ($forFtpType === 'backup' && self::get_btk_setting('backup_ftp_enabled', '0') === '1') ? '1' : self::get_btk_setting('personel_filename_add_year_month_main', '0');
            $addYearMonth = (bool)self::get_btk_setting($addYearMonthSettingKey, $defaultAddYearMonth);
            $yearMonthPart = $addYearMonth ? "_" . gmdate('Y_m', $timestamp) : '';
            $filename = $cleanOperatorName . "_Personel_Listesi" . $yearMonthPart; return $filename . '.xlsx';
        } elseif ($raporTuruUpper === 'ABONE_REHBER' || $raporTuruUpper === 'ABONE_HAREKET') {
            if (empty(trim($yetkiTuruGrup))) { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "$raporTuru için Yetki Türü Grubu (Tip) boş olamaz."); return false; }
            $cleanOperatorKodu = preg_replace('/[^A-Z0-9]/i', '', trim($operatorKodu));
            $cleanYetkiGrup = strtoupper(preg_replace('/[^A-Z0-9_]/i', '', trim($yetkiTuruGrup)));
            $filename = $cleanOperatorName . '_' . $cleanOperatorKodu . '_' . $cleanYetkiGrup . '_' . $raporTuruUpper . '_' . $dateTimePart . '_' . $cntPadded; return $filename . '.abn';
        } else { self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "Bilinmeyen rapor türü: $raporTuru"); return false; }
    }
    public static function getNextCnt($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $ftpSunucuTipi = 'ANA', $timestampForFile = null) {
        if (strtoupper($raporTuru) === 'PERSONEL_LISTESI' || strtoupper($raporTuru) === 'PERSONEL') {
            return '01';
        }

        $lastLog = Capsule::table('mod_btk_ftp_logs')
                        ->where('rapor_turu', strtoupper($raporTuru))
                        ->where('yetki_turu_grup', $yetkiTuruGrup) 
                        ->where('ftp_sunucu_tipi', strtoupper($ftpSunucuTipi))
                        ->where('durum', 'Basarili')
                        ->orderBy('gonderim_zamani', 'DESC')
                        ->first();
        
        $currentCnt = 0;
        if ($lastLog && !empty($lastLog->cnt_numarasi) && is_numeric($lastLog->cnt_numarasi)) {
            $currentCnt = (int)$lastLog->cnt_numarasi;
            
            preg_match('/_(\d{14})_\d{2}\.abn/', $lastLog->dosya_adi, $matches);
            $lastFileTimestampPart = $matches[1] ?? '';

            $currentFileTimestampPart = gmdate('YmdHis', $timestampForFile);

            if ($lastFileTimestampPart === $currentFileTimestampPart) {
                $nextCnt = ($currentCnt >= 99) ? 1 : $currentCnt + 1; // 99'u aşarsa 01'e döner
            } else {
                $nextCnt = 1; // Zaman damgası farklıysa yeni bir rapor serisi olarak kabul et
            }

        } else {
            $nextCnt = 1; // Hiç log yoksa 01'den başla
        }
        return str_pad((string)$nextCnt, 2, '0', STR_PAD_LEFT);
    }

    // --- Rapor Oluşturma Ana Mantığı ---
    public static function getAboneRehberData($yetkiTuruGrup, $filters = []) { 
        self::logAction("Rehber Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters); 
        $data = []; 
        try {
            $services = Capsule::table('mod_btk_abone_rehber')->get(); // Bu tüm rehber kayıtlarını çeker
            // Filtreleme daha detaylı olmalı
            $data = json_decode(json_encode($services), true);
            self::logAction("Rehber Veri Çekme Tamamlandı ($yetkiTuruGrup)", 'INFO', count($data) . " kayıt bulundu (İyileştirme Gerekli)."); 
        } catch (Exception $e) { 
            self::logAction("Rehber Veri Çekme Hatası ($yetkiTuruGrup)", 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); 
            return []; 
        }
        return $data; 
    }
    public static function getAboneHareketData($yetkiTuruGrup, $filters = []) { 
        self::logAction("Hareket Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters); 
        $data = []; 
        try {
            $hareketler = Capsule::table('mod_btk_abone_hareket_live AS ahl')
                                ->join('mod_btk_abone_rehber AS abr', 'ahl.rehber_kayit_id', '=', 'abr.id')
                                ->join('tblhosting AS h', 'abr.whmcs_service_id', '=', 'h.id')
                                ->join('tblproducts AS p', 'h.packageid', '=', 'p.id')
                                ->join('mod_btk_product_group_mappings AS pgm', 'p.gid', '=', 'pgm.gid')
                                ->join('mod_btk_yetki_turleri_referans AS ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
                                ->where('ahl.gonderildi_flag', 0)
                                ->where('ytr.grup', $yetkiTuruGrup)
                                ->orderBy('ahl.kayit_zamani', 'ASC')
                                ->select('ahl.*', 'abr.whmcs_client_id', 'abr.whmcs_service_id', 'abr.operator_kod', 'abr.musteri_id', 'abr.hat_no', 'abr.hizmet_tipi', 'abr.abone_baslangic', 'abr.statik_ip', 'abr.iss_kullanici_adi', 'abr.iss_pop_bilgisi_sunucu', 'abr.iss_pop_noktasi_id')
                                ->get();
            
            foreach ($hareketler as $hareket) {
                $hareketData = (array)$hareket;
                if (!empty($hareketData['islem_detayi_json'])) {
                    $snapshot = json_decode($hareketData['islem_detayi_json'], true);
                    if ($snapshot) {
                        $mergedData = array_merge($hareketData, $snapshot); 
                        $mergedData['id'] = $hareketData['id'];
                        $mergedData['musteri_hareket_kodu'] = $hareketData['musteri_hareket_kodu'];
                        $mergedData['musteri_hareket_aciklama'] = $hareketData['musteri_hareket_aciklama'];
                        $mergedData['musteri_hareket_zamani'] = $hareketData['musteri_hareket_zamani'];
                        $data[] = $mergedData;
                    }
                } else {
                    $data[] = $hareketData;
                }
            }
            self::logAction("Hareket Veri Çekme Tamamlandı ($yetkiTuruGrup)", 'INFO', count($data) . " kayıt bulundu."); 
        } catch (Exception $e) { 
            self::logAction("Hareket Veri Çekme Hatası ($yetkiTuruGrup)", 'CRITICAL', $e->getMessage() . ' - Trace: ' . $e->getTraceAsString()); 
            return []; 
        }
        return $data; 
    }
    public static function markHareketAsGonderildi($hareketIds, $dosyaAdi, $cnt) { if (empty($hareketIds) || !is_array($hareketIds)) return false; try { $updated = Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $hareketIds)->update(['gonderildi_flag' => 1, 'gonderilen_dosya_adi' => substr($dosyaAdi,0,255), 'cnt_numarasi' => substr($cnt,0,2), 'gonderim_zamani' => gmdate('Y-m-d H:i:s')]); if ($updated > 0) { self::logAction('Hareketler Gönderildi İşaretlendi', 'INFO', $updated . " adet hareket $dosyaAdi (CNT:$cnt) ile gönderildi olarak işaretlendi."); } else { self::logAction('Hareketler Gönderildi İşaretlendi (Etkilenen Yok)', 'UYARI', "ID'leri verilen hareketler bulunamadı veya zaten işaretliydi: " . implode(',', $hareketIds)); } return true; } catch (Exception $e) { self::logAction('Hareket Gönderildi İşaretleme Hatası', 'HATA', $e->getMessage()); return false; }}
    public static function archiveOldHareketler() { $liveDays = (int)self::get_btk_setting('hareket_live_table_days', 7); $archiveDays = (int)self::get_btk_setting('hareket_archive_table_days', 180); if ($liveDays <=0 || $archiveDays <=0) { self::logAction('Hareket Arşivleme Atlandı', 'UYARI', 'Canlı veya arşiv saklama günleri geçerli değil.'); return; } $dateLimitLiveToArchive = gmdate('Y-m-d H:i:s', strtotime("-$liveDays days")); $dateLimitArchiveToDelete = gmdate('Y-m-d H:i:s', strtotime("-$archiveDays days")); try { $toArchive = Capsule::table('mod_btk_abone_hareket_live')->where('gonderildi_flag', 1)->where('gonderim_zamani', '<', $dateLimitLiveToArchive)->get()->all(); $archivedCount = 0; if (!empty($toArchive)) { $liveIdsToDelete = []; foreach ($toArchive as $log) { $logArray = (array)$log; unset($logArray['id']); $logArray['arsivlenme_zamani'] = gmdate('Y-m-d H:i:s'); try { Capsule::table('mod_btk_abone_hareket_archive')->insert($logArray); $liveIdsToDelete[] = $log->id; $archivedCount++; } catch (Exception $insertEx) { self::logAction('Hareket Arşivleme Tekil Hata', 'HATA', "Hareket ID {$log->id} arşivlenemedi: " . $insertEx->getMessage()); }} if (!empty($liveIdsToDelete)) { Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $liveIdsToDelete)->delete(); } if ($archivedCount > 0) self::logAction('Hareket Arşivleme', 'INFO', $archivedCount . ' adet hareket canlı tablodan arşive taşındı.');} $deletedFromArchive = Capsule::table('mod_btk_abone_hareket_archive')->where('arsivlenme_zamani', '<', $dateLimitArchiveToDelete)->delete(); if ($deletedFromArchive > 0) { self::logAction('Eski Hareket Arşivi Silme', 'INFO', $deletedFromArchive . ' adet eski arşivlenmiş hareket kalıcı olarak silindi.');}} catch (Exception $e) { self::logAction('Hareket Arşivleme/Silme Genel Hata', 'HATA', $e->getMessage()); }}
    public static function getPersonelDataForReport($filters = []) { 
        try { 
            $personeller = Capsule::table('mod_btk_personel as p')
                                ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                                ->where('p.btk_listesine_eklensin', 1)
                                ->whereNull('p.isten_ayrilma_tarihi')
                                ->select(
                                    'p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn', 'p.unvan', 
                                    'd.departman_adi',
                                    'p.mobil_tel', 'p.sabit_tel', 'p.email'
                                )
                                ->orderBy('p.soyad')->orderBy('p.ad')->get()->all(); 
            $operatorTitle = self::get_btk_setting('operator_title', self::get_btk_setting('operator_name','[FİRMA AYARLANMAMIŞ]')); 
            $reportData = []; 
            foreach($personeller as $personel_obj){ 
                $personel = (array)$personel_obj; 
                $reportData[] = [
                    'Firma Adı' => $operatorTitle, 
                    'Adı' => $personel['ad'], 
                    'Soyadı' => $personel['soyad'], 
                    'TC Kimlik No' => $personel['tckn'], 
                    'Ünvan' => $personel['unvan'], 
                    'Çalıştığı birim' => $personel['departman_adi'], 
                    'Mobil telefonu' => $personel['mobil_tel'], 
                    'Sabit telefonu' => $personel['sabit_tel'], 
                    'E-posta adresi' => $personel['email']
                ]; 
            } 
            return $reportData; 
        } catch (Exception $e) { self::logAction('Personel Rapor Verisi Çekme Hatası', 'HATA', $e->getMessage()); return []; }
    }
    public static function formatAbnRow($dataArray, $btkAlanSiralamasi, $isHareket = false) { 
        if (empty($btkAlanSiralamasi)) { self::logAction('ABN Formatlama Hatası', 'HATA', 'BTK Alan sıralaması sağlanmadı.'); return ''; } 
        $rowValues = []; 
        foreach ($btkAlanSiralamasi as $btkFieldKey) { 
            $value = ''; 
            $dbFieldKey = strtolower($btkFieldKey);
            
            if (strtoupper($btkFieldKey) === 'ISS_POP_BILGISI') {
                $sunucuAdi = $dataArray['iss_pop_bilgisi_sunucu'] ?? '';
                $ssid = $dataArray['yayin_yapilan_ssid'] ?? '';
                $popNoktasiId = $dataArray['iss_pop_noktasi_id'] ?? null;
                
                if (empty($ssid) && $popNoktasiId) {
                    $popNoktasi = self::getIssPopNoktasiById($popNoktasiId);
                    if ($popNoktasi && !empty($popNoktasi['yayin_yapilan_ssid'])) {
                        $ssid = $popNoktasi['yayin_yapilan_ssid'];
                    }
                }
                
                $value = $sunucuAdi . (empty($sunucuAdi) || empty($ssid) || substr($sunucuAdi, -1) === '.' ? '' : ".") . $ssid;
            } 
            elseif (array_key_exists($dbFieldKey, $dataArray)) { 
                $value = $dataArray[$dbFieldKey]; 
            } elseif (array_key_exists(strtoupper($btkFieldKey), $dataArray)) { 
                $value = $dataArray[strtoupper($btkFieldKey)];
            }
            
            $dateTimeFields = ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'GSM_DONDURULMA_TARIHI', 'GSM_KISITLAMA_TARIHI', 'SABIT_DONDURULMA_TARIHI', 'SABIT_KISITLAMA_TARIHI', 'UYDU_DONDURULMA_TARIHI', 'UYDU_KISITLAMA_TARIHI']; 
            $dateFields = ['ABONE_DOGUM_TARIHI', 'ABONE_KIMLIK_VERILDIGI_TARIH']; 
            $valueToFormat = trim((string)$value); 
            if (in_array(strtoupper($btkFieldKey), $dateTimeFields)) { 
                try {
                    $value = !empty($valueToFormat) && $valueToFormat !== '0000-00-00 00:00:00' && $valueToFormat !== '00000000000000' ? ((new DateTime($valueToFormat, new DateTimeZone('UTC')))->format('YmdHis')) : '00000000000000'; 
                } catch(Exception $e) { $value = '00000000000000'; }
            } elseif (in_array(strtoupper($btkFieldKey), $dateFields)) { 
                try {
                    $value = !empty($valueToFormat) && $valueToFormat !== '0000-00-00' && $valueToFormat !== '00000000' ? ((new DateTime($valueToFormat))->format('Ymd')) : '00000000'; 
                } catch(Exception $e) { $value = '00000000'; }
            } else { 
                $value = $valueToFormat; 
            } 
            $value = str_replace(['|', ';', "\r\n", "\n", "\r"], [' ', ' ', ' ', ' ', ' '], $value); 
            $rowValues[] = $value; 
        } 
        return implode('|;|', $rowValues); 
    }
    public static function getBtkAlanSiralamasi($raporTuru = 'REHBER', $yetkiTuruGrup = null) { 
        $ortakAlanlar = ['OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU', 'HAT_DURUM_KODU_ACIKLAMA', 'MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA', 'MUSTERI_HAREKET_ZAMANI', 'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO', 'ABONE_PASAPORT_NO', 'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI', 'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET', 'ABONE_UYRUK', 'ABONE_BABA_ADI', 'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI', 'ABONE_DOGUM_YERI', 'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE', 'ABONE_KIMLIK_CILT_NO', 'ABONE_KIMLIK_KUTUK_NO', 'ABONE_KIMLIK_SAYFA_NO', 'ABONE_KIMLIK_IL', 'ABONE_KIMLIK_ILCE', 'ABONE_KIMLIK_MAHALLE_KOY', 'ABONE_KIMLIK_TIPI', 'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER', 'ABONE_KIMLIK_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI', 'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE', 'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO', 'ABONE_ADRES_TESIS_IC_KAPI_NO', 'ABONE_ADRES_TESIS_POSTA_KODU', 'ABONE_ADRES_TESIS_ADRES_KODU', 'ABONE_ADRES_IRTIBAT_TEL_NO_1', 'ABONE_ADRES_IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL', 'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE', 'ABONE_ADRES_YERLESIM_MAHALLE', 'ABONE_ADRES_YERLESIM_CADDE', 'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO', 'ABONE_ADRES_YERLESİM_NO', 'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO', 'KURUM_YETKILI_TELEFON', 'KURUM_ADRES', 'AKTIVASYON_BAYI_ADI', 'AKTIVASYON_BAYI_ADRESI', 'AKTIVASYON_KULLANICI', 'GUNCELLEYEN_BAYI_ADI', 'GUNCELLEYEN_BAYI_ADRESI', 'GUNCELLEYEN_KULLANICI', 'STATIK_IP']; 
        $ozelAlanlar = []; 
        $grup = strtoupper($yetkiTuruGrup ?? ''); 
        if ($grup === 'ISS') { $ozelAlanlar = ['ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI']; } 
        elseif ($grup === 'STH') { $ozelAlanlar = ['SABIT_ONCEKI_HAT_NUMARASI', 'SABIT_DONDURULMA_TARIHI', 'SABIT_KISITLAMA_TARIHI', 'SABIT_YURTDISI_CAGRI_AKTIF', 'SABIT_SESLI_ARAMA_AKTIF', 'SABIT_REHBER_AKTIF', 'SABIT_CLIR_OZELLIGI_AKTIF', 'SABIT_DATA_AKTIF', 'SABIT_BILGI_1', 'SABIT_BILGI_2', 'SABIT_BILGI_3', 'SABIT_ALFANUMERIK_BASLIK']; } 
        elseif (in_array($grup, ['GSM', 'GMPCS', 'IMT'])) { $ozelAlanlar = ['GSM_ONCEKI_HAT_NUMARASI', 'GSM_DONDURULMA_TARIHI', 'GSM_KISITLAMA_TARIHI', 'GSM_YURTDISI_CAGRI_AKTIF', 'GSM_SESLI_ARAMA_AKTIF', 'GSM_REHBER_AKTIF', 'GSM_CLIR_OZELLIGI_AKTIF', 'GSM_DATA_AKTIF', 'GSM_ESKART_BILGISI', 'GSM_ICCI', 'GSM_IMSI', 'GSM_DUAL_GSM_NO', 'GSM_FAX_NO', 'GSM_VPN_KISAKOD_ARAMA_AKTIF', 'GSM_SERVIS_NUMARASI', 'GSM_BILGI_1', 'GSM_BILGI_2', 'GSM_BILGI_3', 'GSM_ALFANUMERIK_BASLIK']; } 
        elseif ($grup === 'UYDU') { $ozelAlanlar = ['UYDU_ONCEKI_HAT_NUMARASI', 'UYDU_DONDURULMA_TARIHI', 'UYDU_KISITLAMA_TARIHI', 'UYDU_YURTDISI_CAGRI_AKTIF', 'UYDU_SESLI_ARAMA_AKTIF', 'UYDU_REHBER_AKTIF', 'UYDU_CLIR_OZELLIGI_AKTIF', 'UYDU_DATA_AKTIF', 'UYDU_BILGI_1', 'UYDU_BILGI_2', 'UYDU_BILGI_3', 'UYDU_ALFANUMERIK_BASLIK']; } 
        elseif ($grup === 'AIH') { $ozelAlanlar = ['AIH_HIZ_PROFIL', 'AIH_DEVRE_NO', 'AIH_DEVRE_GUZERGAH']; } 
        return array_merge($ortakAlanlar, $ozelAlanlar); 
    }
    public static function compressToGz($sourceFilePath, $destinationFilePath = null) { 
        if (!file_exists($sourceFilePath)) { self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Kaynak dosya bulunamadı: $sourceFilePath"); return false; } 
        if (is_null($destinationFilePath)) { $destinationFilePath = $sourceFilePath . '.gz';} 
        try { 
            $gzFile = gzopen($destinationFilePath, 'wb9'); 
            if (!$gzFile) { self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Hedef GZ dosyası açılamadı/oluşturulamadı: $destinationFilePath"); return false; } 
            $fileHandle = fopen($sourceFilePath, 'rb'); 
            if (!$fileHandle) { gzclose($gzFile); self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Kaynak dosya okunamadı: $sourceFilePath"); return false; } 
            while (!feof($fileHandle)) { gzwrite($gzFile, fread($fileHandle, 1024 * 512)); } 
            fclose($fileHandle); gzclose($gzFile); 
            if(file_exists($destinationFilePath) && filesize($destinationFilePath) > 0) { return $destinationFilePath; } 
            self::logAction('GZ Sıkıştırma Hatası', 'HATA', "GZ dosyası oluşturuldu ancak boş veya hatalı: $destinationFilePath"); return false; 
        } catch (Exception $e) { self::logAction('GZ Sıkıştırma Genel Hata', 'HATA', $e->getMessage()); return false; }
    }
    public static function getBtkClientCustomField($clientId, $fieldName) { 
        try {
            $field = CustomField::where('type', 'client')->where('fieldname', 'LIKE', '%'.$fieldName.'%')->first(); 
            if ($field) {
                $value = Capsule::table('tblcustomfieldsvalues')
                                ->where('fieldid', $field->id)
                                ->where('relid', $clientId)
                                ->value('value');
                return $value;
            }
        } catch (Exception $e) {
            self::logAction('BTK Custom Field Okuma Hatası (Client)', 'HATA', "Alan: $fieldName, Client ID: $clientId, Hata: ".$e->getMessage());
        }
        return null;
    }
    public static function getBtkServiceCustomField($serviceId, $fieldName) {
        return null;
    }

    // --- HOOK HANDLER FONKSİYONLARI ---
    public static function handleClientAdd($vars) {
        self::logAction('Hook Handler: handleClientAdd', 'DEBUG', "Yeni müşteri ID: {$vars['userid']}", null, $vars);
    }
    public static function handleClientEdit($vars) {
        $clientId = $vars['userid'];
        $services = Service::where('userid', $clientId)->get();
        foreach ($services as $service) {
            self::createOrUpdateRehberKayit($service->id, ['musteri_hareket_kodu' => '11', 'musteri_hareket_aciklama' => 'MUSTERI BILGI DEGISIKLIGI']);
        }
    }
    public static function handleClientStatusChange($clientId, $newStatus) {
        $services = Service::where('userid', $clientId)->where('status', 'Active')->get();
        foreach ($services as $service) {
            if ($newStatus === 'Closed') {
                self::createOrUpdateRehberKayit($service->id, [
                    'hat_durum' => 'I',
                    'hat_durum_kodu' => '7',
                    'hat_durum_kodu_aciklama' => 'IPTAL MUSTERI TALEBI (HESAP KAPATMA)',
                    'musteri_hareket_kodu' => '10', 
                    'musteri_hareket_aciklama' => 'HAT IPTAL'
                ]);
            }
        }
    }
    public static function handleClientDelete($clientId) { 
        self::handleClientStatusChange($clientId, 'Closed');
    }
    public static function handleMergeClient($sourceClientId, $targetClientId) {
        try {
            Capsule::table('mod_btk_abone_rehber')
                ->where('whmcs_client_id', $sourceClientId)
                ->update(['whmcs_client_id' => $targetClientId]);
            self::logAction('Müşteri Birleştirme Başarılı', 'BAŞARILI', "$sourceClientId ID'li müşterinin BTK kayıtları $targetClientId ID'sine taşındı.");
        } catch (Exception $e) {
            self::logAction('Müşteri Birleştirme Hatası', 'HATA', $e->getMessage());
        }
    }
    
    public static function handleOrderAccepted($orderId) {
        try {
            $services = Service::where('orderid', $orderId)->get();
            foreach ($services as $service) {
                self::createOrUpdateRehberKayit($service->id, [
                    'hat_durum' => 'A',
                    'hat_durum_kodu' => '1',
                    'hat_durum_kodu_aciklama' => 'AKTIF',
                    'musteri_hareket_kodu' => '1', 
                    'musteri_hareket_aciklama' => 'YENI ABONELIK KAYDI'
                ]);
            }
        } catch (Exception $e) {
            self::logAction('Sipariş Onay Hook Hatası', 'HATA', "Order ID: $orderId, Hata: " . $e->getMessage());
        }
    }
    public static function handleServiceStatusChange($serviceId, $newStatus) {
        $statusMap = [
            'Active' => ['hat_durum' => 'A', 'kod' => '1', 'aciklama' => 'AKTIF', 'hareket_kodu' => '2', 'hareket_aciklama' => 'HAT DURUM DEGISIKLIGI'],
            'Suspended' => ['hat_durum' => 'K', 'kod' => '13', 'aciklama' => 'KISITLI KONTUR BITTI', 'hareket_kodu' => '2', 'hareket_aciklama' => 'HAT DURUM DEGISIKLIGI'],
            'Terminated' => ['hat_durum' => 'I', 'kod' => '3', 'aciklama' => 'IPTAL', 'hareket_kodu' => '10', 'hareket_aciklama' => 'HAT IPTAL'],
        ];
        if (array_key_exists($newStatus, $statusMap)) {
            $statusInfo = $statusMap[$newStatus];
            self::createOrUpdateRehberKayit($serviceId, [
                'hat_durum' => $statusInfo['hat_durum'],
                'hat_durum_kodu' => $statusInfo['kod'],
                'hat_durum_kodu_aciklama' => $statusInfo['aciklama'],
                'musteri_hareket_kodu' => $statusInfo['hareket_kodu'],
                'musteri_hareket_aciklama' => $statusInfo['hareket_aciklama']
            ]);
        }
    }
    public static function handleServiceEdit($vars) {
        $serviceId = $vars['serviceid'];
        $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
        if (!$rehberKayit) return;

        $updates = [];
        $changed = false;
        if (isset($vars['dedicatedip']) && $vars['dedicatedip'] != $rehberKayit->statik_ip) {
            $updates['statik_ip'] = $vars['dedicatedip'];
            $changed = true;
        }
        if (isset($vars['domain']) && $vars['domain'] != $rehberKayit->hat_no) {
            $updates['hat_no'] = $vars['domain'];
            $changed = true;
        }
        
        if ($changed) {
            $updates['musteri_hareket_kodu'] = '15'; 
            $updates['musteri_hareket_aciklama'] = 'IP VEYA DOMAIN DEGISIKLIGI';
            self::createOrUpdateRehberKayit($serviceId, $updates);
        }
    }
    public static function handleServiceDelete($serviceId) {
        self::handleServiceStatusChange($serviceId, 'Terminated');
    }
    public static function handleServicePackageChange($vars) {
        self::createOrUpdateRehberKayit($vars['serviceid'], [
            'musteri_hareket_kodu' => '7',
            'musteri_hareket_aciklama' => 'TARIFE DEGISIKLIGI'
        ]);
    }
    
    public static function createOrUpdateRehberKayit($serviceId, $updateData = []) {
        try {
            $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
            $mergedData = $updateData;

            if (!$rehberKayit) {
                // Yeni kayıt, WHMCS'den temel bilgileri al
                $service = Service::find($serviceId);
                if (!$service) throw new Exception("Hizmet bulunamadı: ID $serviceId");
                $client = $service->client;
                
                $mergedData['whmcs_service_id'] = $serviceId;
                $mergedData['whmcs_client_id'] = $client->id;
                $mergedData['operator_kod'] = self::get_btk_setting('operator_code');
                $mergedData['musteri_id'] = $client->id;
                $mergedData['hat_no'] = $service->domain ?: $service->dedicatedip ?: $service->id;
                $mergedData['abone_baslangic'] = (new DateTime($service->regdate, new DateTimeZone('UTC')))->format('YmdHis');
                $mergedData['abone_adi'] = $client->firstname;
                $mergedData['abone_soyadi'] = $client->lastname;
                $mergedData['abone_unvan'] = $client->companyname;
                $mergedData['abone_email'] = $client->email;
                $mergedData['irtibat_tel_no_1'] = $client->phonenumber;
            } else {
                $mergedData = array_merge((array)$rehberKayit, $updateData);
            }

            $sanitizedData = [];
            $rehberColumns = Capsule::schema()->getColumnListing('mod_btk_abone_rehber');
            foreach ($rehberColumns as $col) {
                if (array_key_exists($col, $mergedData)) {
                    $sanitizedData[$col] = $mergedData[$col];
                }
            }
            unset($sanitizedData['id']);

            $rehberId = Capsule::table('mod_btk_abone_rehber')->updateOrInsert(
                ['whmcs_service_id' => $serviceId],
                $sanitizedData
            );
            if (!$rehberKayit) { 
                $newRehber = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
                $rehberId = $newRehber->id;
            } else {
                $rehberId = $rehberKayit->id;
            }
            
            if (isset($updateData['musteri_hareket_kodu'])) {
                $hareketData = self::prepareHareketDataForInsert($mergedData, $rehberId);
                Capsule::table('mod_btk_abone_hareket_live')->insert($hareketData);
                self::logAction('BTK Hareket Kaydı Oluşturuldu', 'INFO', "Hizmet ID: $serviceId, Hareket Kodu: " . $updateData['musteri_hareket_kodu']);
            }
        } catch (Exception $e) {
             self::logAction('Rehber/Hareket Kayıt Hatası', 'HATA', "Hizmet ID: $serviceId, Hata: " . $e->getMessage());
        }
    }

    public static function handlePreServiceEdit($serviceId, $postData) {
        self::logAction('BTK Hizmet Veri Kaydı Başladı', 'INFO', "Hizmet ID: $serviceId", null, ['post_keys' => array_keys($postData)]);
        try {
            $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
            if (!$rehberKayit) {
                self::handleOrderAccepted(Service::find($serviceId)->orderid); 
                $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
            }
            if (!$rehberKayit) throw new Exception("Hizmet için rehber kaydı oluşturulamadı.");
            
            if (isset($postData['tesis_adresi_yerlesimle_ayni']) && ($postData['tesis_adresi_yerlesimle_ayni'] == 'on' || $postData['tesis_adresi_yerlesimle_ayni'] == '1')) {
                $yerlesim = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->select('yerlesim_il_id', 'yerlesim_ilce_id', 'yerlesim_mahalle_id', 'yerlesim_cadde', 'yerlesim_dis_kapi_no', 'yerlesim_ic_kapi_no', 'yerlesim_posta_kodu', 'yerlesim_adres_kodu_uavt')->first();
                if ($yerlesim) {
                    $postData['tesis_il_id'] = $yerlesim->yerlesim_il_id;
                    $postData['tesis_ilce_id'] = $yerlesim->yerlesim_ilce_id;
                    $postData['tesis_mahalle_id'] = $yerlesim->yerlesim_mahalle_id;
                    $postData['tesis_cadde'] = $yerlesim->yerlesim_cadde;
                    $postData['tesis_dis_kapi_no'] = $yerlesim->yerlesim_dis_kapi_no;
                    $postData['tesis_ic_kapi_no'] = $yerlesim->yerlesim_ic_kapi_no;
                    $postData['tesis_posta_kodu'] = $yerlesim->yerlesim_posta_kodu;
                    $postData['tesis_adres_kodu_uavt'] = $yerlesim->yerlesim_adres_kodu_uavt;
                }
            }
            self::createOrUpdateRehberKayit($serviceId, $postData);
            self::logAction('BTK Hizmet Veri Kaydı Tamamlandı', 'SUCCESS', "Hizmet ID: $serviceId güncellendi.");
        } catch(Exception $e) {
            self::logAction('BTK Hizmet Veri Kaydetme Hatası', 'HATA', $e->getMessage(), null, ['service_id' => $serviceId]);
        }
    }

    public static function handleInvoicePaid($invoiceId) { /* ... */ }
    public static function handleInvoiceCancelled($invoiceId) { /* ... */ }
    public static function syncAdminToPersonel($adminId, $adminVars = []) {
        try {
            $data = [
                'whmcs_admin_id' => $adminId,
                'ad' => $adminVars['firstname'] ?? '',
                'soyad' => $adminVars['lastname'] ?? '',
                'email' => $adminVars['email'] ?? '',
            ];
            Capsule::table('mod_btk_personel')->updateOrInsert(['whmcs_admin_id' => $adminId], $data);
            self::logAction('Personel Senkronizasyonu Başarılı', 'INFO', "Admin ID: $adminId güncellendi/eklendi.");
        } catch (Exception $e) {
            self::logAction('Personel Senkronizasyon Hatası', 'HATA', $e->getMessage(), null, ['admin_id' => $adminId]);
        }
    }
    public static function handleAdminDelete($adminId) {
        try {
            Capsule::table('mod_btk_personel')
                ->where('whmcs_admin_id', $adminId)
                ->update([
                    'isten_ayrilma_tarihi' => gmdate('Y-m-d'),
                    'is_birakma_nedeni' => 'WHMCS Admin hesabı silindi.',
                    'btk_listesine_eklensin' => 0
                ]);
             self::logAction('Personel İşten Ayrıldı (Oto)', 'UYARI', "Admin ID: $adminId silindi, personel kaydı pasife çekildi.");
        } catch (Exception $e) {
            self::logAction('Admin Silme Hook Hatası', 'HATA', $e->getMessage(), null, ['admin_id' => $adminId]);
        }
    }
    public static function getBtkClientInfoForClientArea($clientId) {
        try {
            $data = Capsule::table('mod_btk_abone_rehber AS abr')
                        ->leftJoin('mod_btk_adres_il AS il', 'abr.yerlesim_il_id', '=', 'il.id')
                        ->leftJoin('mod_btk_adres_ilce AS ilce', 'abr.yerlesim_ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_mahalle AS mah', 'abr.yerlesim_mahalle_id', '=', 'mah.id')
                        ->where('abr.whmcs_client_id', $clientId)
                        ->select('abr.*', 'il.il_adi as yerlesim_il_adi', 'ilce.ilce_adi as yerlesim_ilce_adi', 'mah.mahalle_adi as yerlesim_mahalle_adi')
                        ->first();
            if ($data) {
                $dataArray = (array)$data;
                if (!empty($dataArray['abone_dogum_tarihi'])) $dataArray['abone_dogum_tarihi_display'] = date('d.m.Y', strtotime($dataArray['abone_dogum_tarihi']));
                if (!empty($dataArray['abone_cinsiyet'])) $dataArray['abone_cinsiyet_display'] = ($dataArray['abone_cinsiyet'] == 'E' ? self::getLang('genderMale') : self::getLang('genderFemale'));
                if (!empty($dataArray['musteri_tipi'])) $dataArray['musteri_tipi_display'] = self::getLang('musteriTipi' . str_replace('-', '', $dataArray['musteri_tipi'])) ?? $dataArray['musteri_tipi'];
                return $dataArray;
            }
        } catch (Exception $e) {
            self::logAction('Müşteri Paneli Veri Çekme Hatası (Client)', 'HATA', $e->getMessage(), $clientId);
        }
        return [];
    }
    public static function getBtkServiceInfoForClientArea($serviceId) {
        try {
            $data = Capsule::table('mod_btk_abone_rehber AS abr')
                        ->leftJoin('mod_btk_adres_il AS il', 'abr.tesis_il_id', '=', 'il.id')
                        ->leftJoin('mod_btk_adres_ilce AS ilce', 'abr.tesis_ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_mahalle AS mah', 'abr.tesis_mahalle_id', '=', 'mah.id')
                        ->where('abr.whmcs_service_id', $serviceId)
                        ->select('abr.*', 'il.il_adi as tesis_il_adi', 'ilce.ilce_adi as tesis_ilce_adi', 'mah.mahalle_adi as tesis_mahalle_adi')
                        ->first();
             if ($data) {
                $dataArray = (array)$data;
                if (!empty($dataArray['abone_baslangic'])) $dataArray['abone_baslangic_display'] = date('d.m.Y H:i', strtotime($dataArray['abone_baslangic']));
                if (!empty($dataArray['hizmet_tipi'])) {
                    $ek3 = self::getEk3HizmetTipiByCode($dataArray['hizmet_tipi']);
                    $dataArray['hizmet_tipi_display'] = $ek3 ? $ek3->hizmet_tipi_aciklamasi : $dataArray['hizmet_tipi'];
                    $dataArray['hizmet_tipi_kategori'] = $ek3 ? $ek3->ana_yetki_grup : '';
                }
                return $dataArray;
            }
        } catch (Exception $e) {
            self::logAction('Müşteri Paneli Veri Çekme Hatası (Service)', 'HATA', $e->getMessage(), null, ['service_id' => $serviceId]);
        }
        return [];
    }
    public static function performDailyBtkChecks() { 
        self::logAction('Günlük BTK Periyodik Kontrolleri (TODO)', 'INFO', 'Vefat sorgusu ve veri tutarlılığı kontrolü gibi özellikler ileride eklenecektir.'); 
    }
    public static function getCurrentAdminId() { 
        if (defined('IN_ADMIN') && IN_ADMIN && isset($_SESSION['adminid'])) return (int)$_SESSION['adminid']; 
        return null;
    }
    public static function sendEmailNotification($to, $subject, $messageBody, $attachments = []) { 
        $adminUserId = self::getCurrentAdminId(); 
        if (!$adminUserId) { 
            $firstAdmin = Capsule::table('tbladmins')->where('disabled',0)->orderBy('id', 'asc')->first(); 
            if ($firstAdmin) $adminUserId = $firstAdmin->id; 
            else { self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID bulunamadı.'); return false;}
        } 
        $command = 'SendEmail'; 
        $postData = ['customtype' => 'general', 'customsubject' => $subject, 'custommessage' => nl2br(htmlspecialchars($messageBody)), 'to' => $to]; 
        try { 
            if (function_exists('localAPI')) { 
                $results = localAPI($command, $postData, $adminUserId); 
                if (isset($results['result']) && $results['result'] == 'success') { 
                    self::logAction('Eposta Gönderildi', 'BİLGİ', "Kime: $to, Konu: $subject"); return true; 
                } else { 
                    self::logAction('Eposta Gönderme Hatası (localAPI)', 'HATA', ['to' => $to, 'subject' => $subject, 'response' => $results]); return false;
                }
            } else { self::logAction('Eposta Gönderilemedi', 'HATA', 'localAPI fonksiyonu bulunamadı.'); return false; }
        } catch (Exception $e) { self::logAction('Eposta Gönderme Kapsamlı Hata', 'HATA', $e->getMessage(), null, ['to' => $to, 'subject' => $subject]); return false; }
    }
    private static function prepareHareketDataForInsert($fullRehberDataOrijinal, $rehberKayitId) {
        $fullRehberData = (array)$fullRehberDataOrijinal;
        $hareketData = [];
        $hareketAlanlari = [];
        try {
            $hareketAlanlari = Capsule::schema()->getColumnListing('mod_btk_abone_hareket_live');
        } catch (Exception $e) {
            self::logAction('Hareket Alanları Okuma Hatası', 'HATA', $e->getMessage());
            return [];
        }
        foreach ($hareketAlanlari as $alan) {
            if ($alan === 'id' || $alan === 'arsivlenme_zamani') continue;
            if ($alan === 'rehber_kayit_id') { $hareketData[$alan] = $rehberKayitId; continue; }
            if ($alan === 'islem_detayi_json') { $hareketData[$alan] = json_encode($fullRehberDataOrijinal, JSON_UNESCAPED_UNICODE); continue; }
            if ($alan === 'gonderildi_flag') { $hareketData[$alan] = 0; continue; }
            if ($alan === 'kayit_zamani') { $hareketData[$alan] = gmdate('Y-m-d H:i:s'); continue; }
            
            $dbFieldKey = strtolower($alan);
            $btkFieldKeyUpper = strtoupper($alan);
            
            if (array_key_exists($dbFieldKey, $fullRehberData)) {
                $hareketData[$alan] = $fullRehberData[$dbFieldKey];
            } elseif (array_key_exists($btkFieldKeyUpper, $fullRehberData)) {
                $hareketData[$alan] = $fullRehberData[strtoupper($btkFieldKeyUpper)];
            }
        }
        return $hareketData;
    }
    
    public static function getHatDurumKodlari() {
        return Capsule::table('mod_btk_hat_durum_kodlari_referans')->get()->all();
    }
}
?>