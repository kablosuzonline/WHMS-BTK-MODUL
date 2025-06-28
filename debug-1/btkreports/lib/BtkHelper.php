<?php
/**
 * BTK Raporlama Modülü için Kapsamlı Yardımcı Fonksiyonlar Sınıfı
 * (Class "DB" hatası düzeltilmiş, global encrypt/decrypt kullanılarak güncellenmiş)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
use Cron\CronExpression; 

if (!function_exists('encrypt')) { error_log("BTK Reports Critical Error: WHMCS global 'encrypt' function not found!"); }
if (!function_exists('decrypt')) { error_log("BTK Reports Critical Error: WHMCS global 'decrypt' function not found!"); }

class BtkHelper {

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
            if (is_null($kullaniciId) && isset($_SESSION['adminid'])) { $kullaniciId = (int)$_SESSION['adminid']; }
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
            if (!empty($filters['s_log_islem'])) { $query->where('islem', 'LIKE', '%' . trim($filters['s_log_islem']) . '%'); }
            if (!empty($filters['s_log_mesaj'])) { $query->where('mesaj', 'LIKE', '%' . trim($filters['s_log_mesaj']) . '%'); }
            if (!empty($filters['s_log_date_from'])) { try { $dateFrom = new DateTime($filters['s_log_date_from']); $query->where('log_zamani', '>=', $dateFrom->format('Y-m-d 00:00:00')); } catch (Exception $ex) {} }
            if (!empty($filters['s_log_date_to'])) { try { $dateTo = new DateTime($filters['s_log_date_to']); $query->where('log_zamani', '<=', $dateTo->format('Y-m-d 23:59:59')); } catch (Exception $ex) {} }
            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('Modül Log Okuma Hatası', 'HATA', $e->getMessage()); return ['data' => [], 'total_count' => 0]; }
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
                ->select('syt.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup')->orderBy('ytr.grup')->orderBy('ytr.yetki_adi')->get()->all();
            if ($returnAs === 'object_list') return $results; if ($returnAs === 'array_of_arrays') return array_map(function($item){ return (array)$item; }, $results);
            foreach ($results as $row_obj) {
                $row = (array)$row_obj;
                if ($returnAs === 'array_grup') { $aktifYetkiler[$row['grup']][] = $row; } 
                elseif ($returnAs === 'array_grup_names_only') { if (!in_array($row['grup'], $aktifYetkiler)) { $aktifYetkiler[] = $row['grup']; } } 
                else { $aktifYetkiler[] = $row; }
            }
        } catch (Exception $e) { self::logAction('Aktif Yetki Türü Okuma Hatası', 'Hata', $e->getMessage()); }
        return $aktifYetkiler;
    }

// --- BÖLÜM 1/5 Sonu ---
// --- BÖLÜM 2/5 BAŞI - BtkHelper.php - (Yetki Türü Yönetimi Devamı, Rapor Bilgileri/Cron)

    // --- Yetki Türü Yönetimi (Devam) ---
    public static function saveSeciliYetkiTurleri($secilenYetkilerInput = []) {
        try {
            Capsule::table('mod_btk_secili_yetki_turleri')->update(['aktif' => 0]);
            if (!empty($secilenYetkilerInput) && is_array($secilenYetkilerInput)) {
                $aktifKodlar = [];
                foreach($secilenYetkilerInput as $kod => $val){
                    if($val === 'on' || $val === 1 || $val === true || (is_string($val) && !empty($val)) ){ 
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
            return ($LANG['cronLibMissing'] ?? 'Zamanlama Kütüphanesi Eksik');
        }
        try {
            $schedule = self::get_btk_setting($cronScheduleSettingKey);
            if (empty($schedule)) { return $LANG['notConfigured'] ?? 'Ayarlanmamış'; }
            if (!CronExpression::isValidExpression($schedule)) {
                self::logAction('Geçersiz Cron İfadesi', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule'");
                return $LANG['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
            }
            $cron = CronExpression::factory($schedule);
            $nextRunLocalDate = $cron->getNextRunDate('now', 0, false, date_default_timezone_get()); 
            $nextRunUtcDate = (clone $nextRunLocalDate)->setTimezone(new DateTimeZone('UTC'));
            return $nextRunLocalDate->format('Y-m-d H:i:s') . ' (' . date_default_timezone_get() . ') / ' . $nextRunUtcDate->format('Y-m-d H:i:s') . ' (UTC)';
        } catch (InvalidArgumentException $iae) {
            self::logAction('Geçersiz Cron İfadesi (InvalidArgument)', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $iae->getMessage());
            return $LANG['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
        }
         catch (Exception $e) { self::logAction('Sonraki Cron Çalışma Zamanı Hesaplama Hatası', 'HATA', "Ayar: $cronScheduleSettingKey, Hata: " . $e->getMessage()); return $LANG['errorFetchingNextRun'] ?? 'Hesaplanamadı'; }
    }
    
// --- BÖLÜM 2/5 Sonu ---
// --- BÖLÜM 3/5 BAŞI - BtkHelper.php - (FTP İşlemleri, Adres Verileri)

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
    
    public static function getFtpLog($filters = [], $orderBy = 'id', $sortOrder = 'DESC', $limit = 50, $offset = 0) {
         try {
            $query = Capsule::table('mod_btk_ftp_logs');
            if (!empty($filters['s_rapor_turu_ftp'])) $query->where('rapor_turu', strtoupper(trim($filters['s_rapor_turu_ftp'])));
            if (!empty($filters['s_ftp_sunucu_tipi_ftp'])) $query->where('ftp_sunucu_tipi', strtoupper(trim($filters['s_ftp_sunucu_tipi_ftp'])));
            if (!empty($filters['s_durum_ftp'])) $query->where('durum', ucfirst(strtolower(trim($filters['s_durum_ftp']))));
            if (!empty($filters['s_dosya_adi_ftp'])) $query->where('dosya_adi', 'LIKE', '%' . trim($filters['s_dosya_adi_ftp']) . '%');
            if (!empty($filters['s_yetki_grup_ftp'])) $query->where('yetki_turu_grup', 'LIKE', '%' . trim($filters['s_yetki_grup_ftp']) . '%');
            if (!empty($filters['s_ftp_date_from'])) { try { $df = new DateTime($filters['s_ftp_date_from']); $query->where('gonderim_zamani', '>=', $df->format('Y-m-d 00:00:00')); } catch(Exception $ex){} }
            if (!empty($filters['s_ftp_date_to'])) { try { $dt = new DateTime($filters['s_ftp_date_to']); $query->where('gonderim_zamani', '<=', $dt->format('Y-m-d 23:59:59')); } catch(Exception $ex){} }
            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('FTP Log Okuma Hatası', 'Hata', $e->getMessage()); return ['data' => [], 'total_count' => 0]; }
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
        } catch (Exception $e) { self::logAction('İlçe Listesi Okuma Hatası', 'Hata', "İl ID: $il_id, " . $e->getMessage()); return []; }
    }
    public static function getMahallelerByIlceId($ilce_id) {
        if (empty($ilce_id) || !is_numeric($ilce_id)) return [];
        try { $results = Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', (int)$ilce_id)->orderBy('mahalle_adi')->get(['id', 'mahalle_adi', 'posta_kodu'])->all(); return array_map(function($item){ return (array)$item; }, $results); } 
        catch (Exception $e) { self::logAction('Mahalle Listesi Okuma Hatası', 'Hata', "İlçe ID: $ilce_id, " . $e->getMessage()); return []; }
    }
    public static function getIlIdByAdi($ilAdi) {
        if(empty(trim($ilAdi))) return null;
        try { $il = Capsule::table('mod_btk_adres_il')->where('il_adi', trim($ilAdi))->first(); return $il ? $il->id : null; } 
        catch (Exception $e) { self::logAction('İl ID Bulma Hatası (Ad ile)', 'UYARI', "İl Adı: $ilAdi, Hata: " . $e->getMessage()); return null; }
    }
     public static function getIlceIdByAdi($ilceAdi, $ilId) {
        if(empty(trim($ilceAdi)) || empty($ilId) || !is_numeric($ilId)) return null;
        try { $ilce = Capsule::table('mod_btk_adres_ilce')->where('il_id', (int)$ilId)->where('ilce_adi', trim($ilceAdi))->first(); return $ilce ? $ilce->id : null; } 
        catch (Exception $e) { self::logAction('İlçe ID Bulma Hatası (Ad ile)', 'UYARI', "İlçe Adı: $ilceAdi, İl ID: $ilId, Hata: " . $e->getMessage()); return null; }
    }
     public static function getMahalleIdByAdi($mahalleAdi, $ilceId) {
        if(empty(trim($mahalleAdi)) || empty($ilceId) || !is_numeric($ilceId)) return null;
        try { $mahalle = Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', (int)$ilceId)->where('mahalle_adi', trim($mahalleAdi))->first(); return $mahalle ? $mahalle->id : null; } 
        catch (Exception $e) { self::logAction('Mahalle ID Bulma Hatası (Ad ile)', 'UYARI', "Mahalle Adı: $mahalleAdi, İlçe ID: $ilceId, Hata: " . $e->getMessage()); return null; }
    }
    
// --- BÖLÜM 3/5 Sonu ---
// --- BÖLÜM 4/5 BAŞI - BtkHelper.php - (ISS POP Noktaları Yönetimi, Personel Yönetimi - 'DB' Hatası Düzeltilmiş)

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
                              ->orderByRaw(Capsule::connection()->getQueryGrammar()->wrap($safeOrderBy) . " $safeSortOrder") // DÜZELTİLDİ: DB:: yerine Capsule::
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
                'tam_adres' => $data['tam_adres'] ?? null,
                'koordinatlar' => $data['koordinatlar'] ?? null,
                'aktif_pasif_durum' => (isset($data['aktif_pasif_durum']) && ($data['aktif_pasif_durum'] === '1' || $data['aktif_pasif_durum'] === 'on' || $data['aktif_pasif_durum'] === true)) ? 1 : 0,
            ];
            
            $popIdToUpdate = isset($data['pop_id']) ? (int)$data['pop_id'] : 0;

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
                        ->leftJoin('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id');

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
                                    'il.il_adi as gorev_bolgesi_il_adi'
                                 )
                                 ->orderByRaw(Capsule::connection()->getQueryGrammar()->wrap($safeOrderBy) . " $safeSortOrder") // DÜZELTİLDİ: DB:: yerine Capsule::
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
    
// --- BÖLÜM 4/5 Sonu ---
// --- BÖLÜM 5/5 BAŞI - BtkHelper.php - (Personel Yön. Devamı, Dosya/CNT, Rapor Oluşturma, Hook Handler'lar, Diğer Yardımcılar)

    // --- Personel Yönetimi (Devam) ---
    public static function savePersonel($data, $adminId = null) {
        $logKullaniciId = $adminId ?? self::getCurrentAdminId();
        $personelIdToUpdate = isset($data['personel_id']) ? (int)$data['personel_id'] : 0;
        $validationErrors = [];

        // Zorunlu Alan Kontrolleri
        if (empty(trim($data['ad'] ?? ''))) $validationErrors[] = 'Ad alanı boş bırakılamaz.';
        if (empty(trim($data['soyad'] ?? ''))) $validationErrors[] = 'Soyad alanı boş bırakılamaz.';
        $tckn = preg_replace('/[^0-9]/', '', $data['tckn'] ?? '');
        if (empty($tckn)) $validationErrors[] = 'T.C. Kimlik No alanı boş bırakılamaz.';
        elseif (strlen($tckn) !== 11) $validationErrors[] = 'T.C. Kimlik Numarası 11 haneli olmalıdır.';
        if (empty(trim($data['email'] ?? ''))) $validationErrors[] = 'E-posta Adresi boş bırakılamaz.';
        elseif (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) $validationErrors[] = 'Geçersiz e-posta adresi formatı.';
        
        $dogumYiliForNVI = isset($data['dogum_yili_nvi']) && is_numeric($data['dogum_yili_nvi']) && strlen((string)$data['dogum_yili_nvi']) === 4 ? (int)$data['dogum_yili_nvi'] : null;
        if (empty($dogumYiliForNVI) && !empty($tckn)) {
            $validationErrors[] = 'T.C. Kimlik No doğrulaması için Doğum Yılı (NVI için, 4 hane) gereklidir.';
        }
        if (!empty(trim($data['mobil_tel'] ?? '')) && !preg_match('/^[0-9]{10,15}$/', preg_replace('/[^0-9]/', '', $data['mobil_tel']))) {
            $validationErrors[] = 'Mobil telefon numarası sadece rakamlardan oluşmalı ve 10-15 hane uzunluğunda olmalıdır.';
        }
        if (!empty(trim($data['sabit_tel'] ?? '')) && !preg_match('/^[0-9]{10,15}$/', preg_replace('/[^0-9]/', '', $data['sabit_tel']))) {
            $validationErrors[] = 'Sabit telefon numarası sadece rakamlardan oluşmalı ve 10-15 hane uzunluğunda olmalıdır.';
        }
        if (!empty($data['ise_baslama_tarihi']) && !self::isValidDate($data['ise_baslama_tarihi'])) $validationErrors[] = 'Geçersiz işe başlama tarihi formatı (YYYY-AA-GG bekleniyor).';
        if (!empty($data['isten_ayrilma_tarihi']) && !self::isValidDate($data['isten_ayrilma_tarihi'])) $validationErrors[] = 'Geçersiz işten ayrılma tarihi formatı (YYYY-AA-GG bekleniyor).';


        if (!empty($validationErrors)) { 
            self::logAction('Personel Kaydetme Doğrulama Hatası', 'UYARI', implode(', ', $validationErrors), $logKullaniciId, ['data_keys' => array_keys($data)]); 
            return ['status' => false, 'message' => implode('<br>', $validationErrors)];
        }
        
        // NVI Doğrulama
        $tcknDogrulamaSonucu = 'Dogrulanmadi'; 
        $tcknDogrulamaMesaji = 'NVI Doğrulaması yapılamadı (gerekli bilgiler eksik veya servis hatası).';
        if (class_exists('NviSoapClient') && $dogumYiliForNVI && !empty(trim($data['ad'])) && !empty(trim($data['soyad'])) && !empty($tckn) ) { 
            $nviClient = new NviSoapClient(); 
            $nviResult = $nviClient->TCKimlikNoDogrula($tckn, trim($data['ad']), trim($data['soyad']), $dogumYiliForNVI); 
            if ($nviResult === true) { 
                $tcknDogrulamaSonucu = 'Dogrulandi'; $tcknDogrulamaMesaji = 'NVI üzerinden TCKN başarıyla doğrulandı.'; 
            } else { 
                $tcknDogrulamaSonucu = $nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi'; 
                $tcknDogrulamaMesaji = $nviClient->getLastErrorMessageForUser() ?: ($nviClient->getLastError() ?: 'NVI Doğrulama Başarısız oldu. Lütfen bilgileri kontrol edin.');
            } 
            self::logAction('NVI TCKN Doğrulama (Personel)', $nviResult ? 'BİLGİ' : 'UYARI', $tcknDogrulamaMesaji, $logKullaniciId, ['tckn_prefix' => substr($tckn,0,5), 'ad_soyad' => trim($data['ad'] . ' ' . $data['soyad'])]);
        } elseif(!class_exists('NviSoapClient')) { 
            $tcknDogrulamaMesaji = 'NVI Doğrulama servisi (NviSoapClient sınıfı) yüklenemedi.'; 
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
                'tckn_dogrulama_durumu' => $tcknDogrulamaSonucu, 'tckn_dogrulama_zamani' => gmdate('Y-m-d H:i:s'), 'tckn_dogrulama_mesaji' => substr($tcknDogrulamaMesaji, 0, 255)
            ];
            try { if(!empty($data['ise_baslama_tarihi']) && self::isValidDate($data['ise_baslama_tarihi'])) $personelDataToSave['ise_baslama_tarihi'] = (new DateTime($data['ise_baslama_tarihi']))->format('Y-m-d'); } catch (Exception $e) {}
            try { if(!empty($data['isten_ayrilma_tarihi']) && self::isValidDate($data['isten_ayrilma_tarihi'])) $personelDataToSave['isten_ayrilma_tarihi'] = (new DateTime($data['isten_ayrilma_tarihi']))->format('Y-m-d'); } catch (Exception $e) {}
            
            $uniqueCheckQueryTCKN = Capsule::table('mod_btk_personel')->where('tckn', $personelDataToSave['tckn'])->whereNull('isten_ayrilma_tarihi');
            $uniqueCheckQueryAdminID = $personelDataToSave['whmcs_admin_id'] ? Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $personelDataToSave['whmcs_admin_id']) : null;
            if ($personelIdToUpdate > 0) { $uniqueCheckQueryTCKN->where('id', '!=', $personelIdToUpdate); if($uniqueCheckQueryAdminID) $uniqueCheckQueryAdminID->where('id', '!=', $personelIdToUpdate); }
            $existingPersonelByTCKN = $uniqueCheckQueryTCKN->first(); if ($existingPersonelByTCKN) { return ['status' => false, 'message' => "Bu TCKN ({$personelDataToSave['tckn']}) zaten aktif bir personele (ID: {$existingPersonelByTCKN->id} - {$existingPersonelByTCKN->ad} {$existingPersonelByTCKN->soyad}) ait."]; }
            if ($uniqueCheckQueryAdminID) { $existingPersonelByAdminID = $uniqueCheckQueryAdminID->first(); if ($existingPersonelByAdminID) { return ['status' => false, 'message' => "Seçilen WHMCS Yöneticisi (ID: {$personelDataToSave['whmcs_admin_id']}) zaten başka bir personele (ID: {$existingPersonelByAdminID->id} - {$existingPersonelByAdminID->ad} {$existingPersonelByAdminID->soyad}) atanmış."]; }}

            if ($personelIdToUpdate > 0) { Capsule::table('mod_btk_personel')->where('id', $personelIdToUpdate)->update($personelDataToSave); self::logAction('Personel Güncellendi', 'BAŞARILI', "ID: $personelIdToUpdate", $logKullaniciId); return ['status' => true, 'message' => 'Personel başarıyla güncellendi.', 'id' => $personelIdToUpdate, 'nvi_status' => $tcknDogrulamaSonucu, 'nvi_message' => $tcknDogrulamaMesaji]; }
            else { $personelId = Capsule::table('mod_btk_personel')->insertGetId($personelDataToSave); self::logAction('Personel Eklendi', 'BAŞARILI', "Yeni ID: $personelId", $logKullaniciId); return ['status' => true, 'message' => 'Personel başarıyla eklendi.', 'id' => $personelId, 'nvi_status' => $tcknDogrulamaSonucu, 'nvi_message' => $tcknDogrulamaMesaji]; }
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
    private static function isValidDate($dateString, $format = 'Y-m-d') { if (empty($dateString)) return false; try { $d = DateTime::createFromFormat($format, $dateString); return $d && $d->format($format) === $dateString; } catch (Exception $e) { return false; } }

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
    public static function getNextCnt($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $ftpSunucuTipi = 'ANA', $timestampForFile = null) { return '01'; }

    // --- Rapor Oluşturma Ana Mantığı ---
    public static function getAboneRehberData($yetkiTuruGrup, $filters = []) { self::logAction("Rehber Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters); $data = []; self::logAction("Rehber Veri Çekme Tamamlandı ($yetkiTuruGrup)", 'DEBUG', count($data) . " kayıt bulundu (IMPLEMENTASYON BEKLENİYOR)."); return $data; }
    public static function getAboneHareketData($yetkiTuruGrup, $filters = []) { self::logAction("Hareket Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters); $data = []; self::logAction("Hareket Veri Çekme Tamamlandı ($yetkiTuruGrup)", 'DEBUG', count($data) . " kayıt bulundu (IMPLEMENTASYON BEKLENİYOR)."); return $data; }
    public static function markHareketAsGonderildi($hareketIds, $dosyaAdi, $cnt) { if (empty($hareketIds) || !is_array($hareketIds)) return false; try { $updated = Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $hareketIds)->update(['gonderildi_flag' => 1, 'gonderilen_dosya_adi' => substr($dosyaAdi,0,255), 'cnt_numarasi' => substr($cnt,0,2), 'gonderim_zamani' => gmdate('Y-m-d H:i:s')]); if ($updated > 0) { self::logAction('Hareketler Gönderildi İşaretlendi', 'INFO', $updated . " adet hareket $dosyaAdi (CNT:$cnt) ile gönderildi olarak işaretlendi."); } else { self::logAction('Hareketler Gönderildi İşaretlendi (Etkilenen Yok)', 'UYARI', "ID'leri verilen hareketler bulunamadı veya zaten işaretliydi: " . implode(',', $hareketIds)); } return true; } catch (Exception $e) { self::logAction('Hareket Gönderildi İşaretleme Hatası', 'HATA', $e->getMessage()); return false; }}
    public static function archiveOldHareketler() { $liveDays = (int)self::get_btk_setting('hareket_live_table_days', 7); $archiveDays = (int)self::get_btk_setting('hareket_archive_table_days', 180); if ($liveDays <=0 || $archiveDays <=0) { self::logAction('Hareket Arşivleme Atlandı', 'UYARI', 'Canlı veya arşiv saklama günleri geçerli değil.'); return; } $dateLimitLiveToArchive = gmdate('Y-m-d H:i:s', strtotime("-$liveDays days")); $dateLimitArchiveToDelete = gmdate('Y-m-d H:i:s', strtotime("-$archiveDays days")); try { $toArchive = Capsule::table('mod_btk_abone_hareket_live')->where('gonderildi_flag', 1)->where('gonderim_zamani', '<', $dateLimitLiveToArchive)->get()->all(); $archivedCount = 0; if (!empty($toArchive)) { $liveIdsToDelete = []; foreach ($toArchive as $log) { $logArray = (array)$log; unset($logArray['id']); $logArray['arsivlenme_zamani'] = gmdate('Y-m-d H:i:s'); try { Capsule::table('mod_btk_abone_hareket_archive')->insert($logArray); $liveIdsToDelete[] = $log->id; $archivedCount++; } catch (Exception $insertEx) { self::logAction('Hareket Arşivleme Tekil Hata', 'HATA', "Hareket ID {$log->id} arşivlenemedi: " . $insertEx->getMessage()); }} if (!empty($liveIdsToDelete)) { Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $liveIdsToDelete)->delete(); } if ($archivedCount > 0) self::logAction('Hareket Arşivleme', 'INFO', $archivedCount . ' adet hareket canlı tablodan arşive taşındı.');} $deletedFromArchive = Capsule::table('mod_btk_abone_hareket_archive')->where('arsivlenme_zamani', '<', $dateLimitArchiveToDelete)->delete(); if ($deletedFromArchive > 0) { self::logAction('Eski Hareket Arşivi Silme', 'INFO', $deletedFromArchive . ' adet eski arşivlenmiş hareket kalıcı olarak silindi.');}} catch (Exception $e) { self::logAction('Hareket Arşivleme/Silme Genel Hata', 'HATA', $e->getMessage()); }}
    public static function getPersonelDataForReport($filters = []) { try { $personeller = Capsule::table('mod_btk_personel as p')->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')->where('p.btk_listesine_eklensin', 1)->whereNull('p.isten_ayrilma_tarihi')->select('p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn', 'p.unvan', 'd.departman_adi', 'p.mobil_tel', 'p.sabit_tel', 'p.email')->orderBy('p.soyad')->orderBy('p.ad')->get()->all(); $operatorTitle = self::get_btk_setting('operator_title', self::get_btk_setting('operator_name','[FİRMA AYARLANMAMIŞ]')); $reportData = []; foreach($personeller as $personel_obj){ $personel = (array)$personel_obj; $reportData[] = ['Firma Adı' => $operatorTitle, 'Adı' => $personel['ad'], 'Soyadı' => $personel['soyad'], 'TC Kimlik No' => $personel['tckn'], 'Ünvan' => $personel['unvan'], 'Çalıştığı birim' => $personel['departman_adi'], 'Mobil telefonu' => $personel['mobil_tel'], 'Sabit telefonu' => $personel['sabit_tel'], 'E-posta adresi' => $personel['email']]; } return $reportData; } catch (Exception $e) { self::logAction('Personel Rapor Verisi Çekme Hatası', 'HATA', $e->getMessage()); return []; }}
    public static function formatAbnRow($dataArray, $btkAlanSiralamasi, $isHareket = false) { if (empty($btkAlanSiralamasi)) { self::logAction('ABN Formatlama Hatası', 'HATA', 'BTK Alan sıralaması sağlanmadı.'); return ''; } $rowValues = []; foreach ($btkAlanSiralamasi as $btkFieldKey) { $dbFieldKey = strtolower($btkFieldKey); $value = ''; if (strtoupper($btkFieldKey) === 'ISS_POP_BILGISI') { $sunucuAdi = $dataArray['iss_pop_bilgisi_sunucu'] ?? ($dataArray['server_hostname'] ?? ($dataArray['sunucu_adi'] ?? '')); $ssid = $dataArray['yayin_yapilan_ssid'] ?? ''; if (empty($ssid) && !empty($dataArray['iss_pop_noktasi_id'])) { $popNoktasi = self::getIssPopNoktasiById($dataArray['iss_pop_noktasi_id']); if ($popNoktasi && !empty($popNoktasi['yayin_yapilan_ssid'])) { $ssid = $popNoktasi['yayin_yapilan_ssid']; } } $value = $sunucuAdi . (empty($sunucuAdi) || empty($ssid) || substr($sunucuAdi, -1) === '.' ? '' : ".") . $ssid; } elseif (array_key_exists($dbFieldKey, $dataArray)) { $value = $dataArray[$dbFieldKey]; } elseif (array_key_exists(strtoupper($btkFieldKey), $dataArray)) { $value = $dataArray[strtoupper($btkFieldKey)];} $dateTimeFields = ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'GSM_DONDURULMA_TARIHI', 'GSM_KISITLAMA_TARIHI', 'SABIT_DONDURULMA_TARIHI', 'SABIT_KISITLAMA_TARIHI', 'UYDU_DONDURULMA_TARIHI', 'UYDU_KISITLAMA_TARIHI']; $dateFields = ['ABONE_DOGUM_TARIHI', 'ABONE_KIMLIK_VERILDIGI_TARIH']; $valueToFormat = trim((string)$value); if (in_array(strtoupper($btkFieldKey), $dateTimeFields)) { $value = !empty($valueToFormat) && $valueToFormat !== '0000-00-00 00:00:00' && $valueToFormat !== '00000000000000' ? ((new DateTime($valueToFormat, new DateTimeZone('UTC')))->format('YmdHis')) : '00000000000000'; } elseif (in_array(strtoupper($btkFieldKey), $dateFields)) { $value = !empty($valueToFormat) && $valueToFormat !== '0000-00-00' && $valueToFormat !== '00000000' ? ((new DateTime($valueToFormat))->format('Ymd')) : '00000000'; } else { $value = $valueToFormat; } $value = str_replace(['|', ';', "\r\n", "\n", "\r"], [' ', ' ', ' ', ' ', ' '], $value); $rowValues[] = $value; } return implode('|;|', $rowValues); }
    public static function getBtkAlanSiralamasi($raporTuru = 'REHBER', $yetkiTuruGrup = null) { $ortakAlanlar = ['OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU', 'HAT_DURUM_KODU_ACIKLAMA', 'MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA', 'MUSTERI_HAREKET_ZAMANI', 'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO', 'ABONE_PASAPORT_NO', 'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI', 'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET', 'ABONE_UYRUK', 'ABONE_BABA_ADI', 'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI', 'ABONE_DOGUM_YERI', 'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE', 'ABONE_KIMLIK_CILT_NO', 'ABONE_KIMLIK_KUTUK_NO', 'ABONE_KIMLIK_SAYFA_NO', 'ABONE_KIMLIK_IL', 'ABONE_KIMLIK_ILCE', 'ABONE_KIMLIK_MAHALLE_KOY', 'ABONE_KIMLIK_TIPI', 'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER', 'ABONE_KIMLIK_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI', 'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE', 'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO', 'ABONE_ADRES_TESIS_IC_KAPI_NO', 'ABONE_ADRES_TESIS_POSTA_KODU', 'ABONE_ADRES_TESIS_ADRES_KODU', 'ABONE_ADRES_IRTIBAT_TEL_NO_1', 'ABONE_ADRES_IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL', 'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE', 'ABONE_ADRES_YERLESIM_MAHALLE', 'ABONE_ADRES_YERLESIM_CADDE', 'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO', 'ABONE_ADRES_YERLESIM_NO', 'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO', 'KURUM_YETKILI_TELEFON', 'KURUM_ADRES', 'AKTIVASYON_BAYI_ADI', 'AKTIVASYON_BAYI_ADRESI', 'AKTIVASYON_KULLANICI', 'GUNCELLEYEN_BAYI_ADI', 'GUNCELLEYEN_BAYI_ADRESI', 'GUNCELLEYEN_KULLANICI', 'STATIK_IP']; $ozelAlanlar = []; $grup = strtoupper($yetkiTuruGrup ?? ''); if ($grup === 'ISS') { $ozelAlanlar = ['ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI']; } elseif ($grup === 'STH') { $ozelAlanlar = ['SABIT_ONCEKI_HAT_NUMARASI', 'SABIT_DONDURULMA_TARIHI', 'SABIT_KISITLAMA_TARIHI', 'SABIT_YURTDISI_CAGRI_AKTIF', 'SABIT_SESLI_ARAMA_AKTIF', 'SABIT_REHBER_AKTIF', 'SABIT_CLIR_OZELLIGI_AKTIF', 'SABIT_DATA_AKTIF', 'SABIT_BILGI_1', 'SABIT_BILGI_2', 'SABIT_BILGI_3', 'SABIT_ALFANUMERIK_BASLIK']; } elseif (in_array($grup, ['GSM', 'GMPCS', 'IMT'])) { $ozelAlanlar = ['GSM_ONCEKI_HAT_NUMARASI', 'GSM_DONDURULMA_TARIHI', 'GSM_KISITLAMA_TARIHI', 'GSM_YURTDISI_CAGRI_AKTIF', 'GSM_SESLI_ARAMA_AKTIF', 'GSM_REHBER_AKTIF', 'GSM_CLIR_OZELLIGI_AKTIF', 'GSM_DATA_AKTIF', 'GSM_ESKART_BILGISI', 'GSM_ICCI', 'GSM_IMSI', 'GSM_DUAL_GSM_NO', 'GSM_FAX_NO', 'GSM_VPN_KISAKOD_ARAMA_AKTIF', 'GSM_SERVIS_NUMARASI', 'GSM_BILGI_1', 'GSM_BILGI_2', 'GSM_BILGI_3', 'GSM_ALFANUMERIK_BASLIK']; } elseif ($grup === 'UYDU') { $ozelAlanlar = ['UYDU_ONCEKI_HAT_NUMARASI', 'UYDU_DONDURULMA_TARIHI', 'UYDU_KISITLAMA_TARIHI', 'UYDU_YURTDISI_CAGRI_AKTIF', 'UYDU_SESLI_ARAMA_AKTIF', 'UYDU_REHBER_AKTIF', 'UYDU_CLIR_OZELLIGI_AKTIF', 'UYDU_DATA_AKTIF', 'UYDU_BILGI_1', 'UYDU_BILGI_2', 'UYDU_BILGI_3', 'UYDU_ALFANUMERIK_BASLIK']; } elseif ($grup === 'AIH') { $ozelAlanlar = ['AIH_HIZ_PROFIL', 'AIH_DEVRE_NO', 'AIH_DEVRE_GUZERGAH']; } return array_merge($ortakAlanlar, $ozelAlanlar); }
    public static function compressToGz($sourceFilePath, $destinationFilePath = null) { if (!file_exists($sourceFilePath)) { self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Kaynak dosya bulunamadı: $sourceFilePath"); return false; } if (is_null($destinationFilePath)) { $destinationFilePath = $sourceFilePath . '.gz';} try { $gzFile = gzopen($destinationFilePath, 'wb9'); if (!$gzFile) { self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Hedef GZ dosyası açılamadı/oluşturulamadı: $destinationFilePath"); return false; } $fileHandle = fopen($sourceFilePath, 'rb'); if (!$fileHandle) { gzclose($gzFile); self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Kaynak dosya okunamadı: $sourceFilePath"); return false; } while (!feof($fileHandle)) { gzwrite($gzFile, fread($fileHandle, 1024 * 512)); } fclose($fileHandle); gzclose($gzFile); if(file_exists($destinationFilePath) && filesize($destinationFilePath) > 0) { return $destinationFilePath; } self::logAction('GZ Sıkıştırma Hatası', 'HATA', "GZ dosyası oluşturuldu ancak boş veya hatalı: $destinationFilePath"); return false; } catch (Exception $e) { self::logAction('GZ Sıkıştırma Genel Hata', 'HATA', $e->getMessage()); return false; }}
    public static function handleClientAdd($vars) { self::logAction('Hook: ClientAdd', 'DEBUG', ['client_id' => $vars['userid']]); }
    public static function handleClientEdit($vars) { self::logAction('Hook: ClientEdit', 'DEBUG', ['client_id' => $vars['userid']]); }
    public static function handleClientClose($clientId) { self::logAction('Hook: ClientClose', 'UYARI', ['client_id' => $clientId]); }
    public static function handleClientDelete($clientId) { self::logAction('Hook: ClientDelete', 'KRİTİK UYARI', ['client_id' => $clientId]); }
    public static function handleMergeClient($sourceClientId, $targetClientId) { self::logAction('Hook: MergeClient', 'UYARI', ['source' => $sourceClientId, 'target' => $targetClientId]); }
    public static function handleServiceCreate($params) { self::logAction('Hook: ServiceCreate', 'INFO', ['service_id' => $params['serviceid']]); }
    public static function handleServiceEdit($vars) { self::logAction('Hook: ServiceEdit', 'DEBUG', ['service_id' => $vars['serviceid']]); }
    public static function handleServiceSuspend($params) { self::logAction('Hook: ServiceSuspend', 'UYARI', ['service_id' => $params['serviceid']]); }
    public static function handleServiceUnsuspend($params) { self::logAction('Hook: ServiceUnsuspend', 'INFO', ['service_id' => $params['serviceid']]); }
    public static function handleServiceTerminate($params) { self::logAction('Hook: ServiceTerminate', 'UYARI', ['service_id' => $params['serviceid']]); }
    public static function handleServiceDelete($serviceId) { self::logAction('Hook: ServiceDelete', 'KRİTİK UYARI', ['service_id' => $serviceId]); }
    public static function handleServicePackageChange($vars) { self::logAction('Hook: ServicePackageChange', 'INFO', ['service_id' => $vars['serviceid']]); }
    public static function handleInvoicePaid($invoiceId) { self::logAction('Hook: InvoicePaid', 'DEBUG', ['invoice_id' => $invoiceId]); }
    public static function handleInvoiceCancelled($invoiceId) { self::logAction('Hook: InvoiceCancelled', 'DEBUG', ['invoice_id' => $invoiceId]); }
    public static function syncAdminToPersonel($adminId, $adminVars = []) { self::logAction('Hook: syncAdminToPersonel', 'DEBUG', ['admin_id' => $adminId]); }
    public static function handleAdminDelete($adminId) { self::logAction('Hook: handleAdminDelete', 'UYARI', ['admin_id' => $adminId]); }
    public static function getBtkClientInfoForClientArea($clientId) { self::logAction('TODO: getBtkClientInfoForClientArea', 'DEBUG', ['client_id' => $clientId]); return []; }
    public static function getBtkServiceInfoForClientArea($serviceId) { self::logAction('TODO: getBtkServiceInfoForClientArea', 'DEBUG', ['service_id' => $serviceId]); return []; }
    public static function performDailyBtkChecks() { self::logAction('Günlük BTK Periyodik Kontrolleri (TODO)', 'INFO'); }
    public static function handlePreServiceEdit($serviceId, $postData) { self::logAction('Hook: PreServiceEdit', 'DEBUG', ['service_id' => $serviceId]); }
    public static function getWhmcsClientDetails($clientId) { try { $client = Capsule::table('tblclients')->find((int)$clientId); return $client ? (array)$client : null; } catch (Exception $e) { return null; } }
    public static function getWhmcsServiceDetails($serviceId) { try { $service = Capsule::table('tblhosting as h')->leftJoin('tblproducts as p', 'h.packageid', '=', 'p.id')->leftJoin('tblservers as s', 'h.server', '=', 's.id')->leftJoin('tblproductgroups as pg', 'p.gid', '=', 'pg.id')->where('h.id', (int)$serviceId)->select('h.*', 'p.name as product_name', 'p.gid as product_group_id', 'pg.name as product_group_name', Capsule::raw("IFNULL(s.hostname, IFNULL(s.name, '')) as server_hostname"), Capsule::raw("IFNULL(s.ipaddress, '') as server_ipaddress"))->first(); return $service ? (array)$service : null; } catch (Exception $e) { return null; } }
    private static function prepareHareketDataForInsert($fullRehberDataOrijinal, $rehberKayitId) { $fullRehberData = (array)$fullRehberDataOrijinal; $hareketData = []; $hareketAlanlari = []; try { $hareketAlanlari = Capsule::schema()->getColumnListing('mod_btk_abone_hareket_live'); } catch (Exception $e) { self::logAction('Hareket Alanları Okuma Hatası', 'HATA', $e->getMessage()); return []; } foreach($hareketAlanlari as $alan) { if ($alan === 'id') continue; if ($alan === 'rehber_kayit_id') { $hareketData[$alan] = $rehberKayitId; continue; } if ($alan === 'islem_detayi_json') { $hareketData[$alan] = json_encode($fullRehberDataOrijinal, JSON_UNESCAPED_UNICODE); continue; } if ($alan === 'gonderildi_flag') { $hareketData[$alan] = 0; continue; } if ($alan === 'kayit_zamani') { $hareketData[$alan] = gmdate('Y-m-d H:i:s'); continue; } if ($alan === 'arsivlenme_zamani') continue; $dbFieldKey = strtolower($alan); $btkFieldKeyUpper = strtoupper($alan); if (array_key_exists($dbFieldKey, $fullRehberData)) { $hareketData[$alan] = $fullRehberData[$dbFieldKey]; } elseif (array_key_exists($btkFieldKeyUpper, $fullRehberData)) { $hareketData[$alan] = $fullRehberData[strtoupper($btkFieldKeyUpper)];} } return $hareketData; }
    public static function getCurrentAdminId() { return isset($_SESSION['adminid']) ? (int)$_SESSION['adminid'] : null; }
    public static function sendEmailNotification($to, $subject, $messageBody, $attachments = []) { $adminUserId = self::getCurrentAdminId(); if (!$adminUserId) { $firstAdmin = Capsule::table('tbladmins')->where('disabled',0)->orderBy('id', 'asc')->first(); if ($firstAdmin) $adminUserId = $firstAdmin->id; else { self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID bulunamadı.'); return false;}} $command = 'SendEmail'; $postData = ['customtype' => 'general', 'customsubject' => $subject, 'custommessage' => nl2br(htmlspecialchars($messageBody)), 'to' => $to]; try { if (function_exists('localAPI')) { $results = localAPI($command, $postData, $adminUserId); if (isset($results['result']) && $results['result'] == 'success') { self::logAction('Eposta Gönderildi', 'BİLGİ', "Kime: $to, Konu: $subject"); return true; } else { self::logAction('Eposta Gönderme Hatası (localAPI)', 'HATA', ['to' => $to, 'subject' => $subject, 'response' => $results]); return false;}} else { self::logAction('Eposta Gönderilemedi', 'HATA', 'localAPI fonksiyonu bulunamadı.'); return false; }} catch (Exception $e) { self::logAction('Eposta Gönderme Kapsamlı Hata', 'HATA', $e->getMessage(), null, ['to' => $to, 'subject' => $subject]); return false; }}

} // Sınıf Sonu
?>