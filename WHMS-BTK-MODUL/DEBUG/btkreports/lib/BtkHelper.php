<?php
/**
 * BTK Raporlama Modülü için Kapsamlı Yardımcı Fonksiyonlar Sınıfı
 * Tüm TPL dosyalarının ve ana PHP dosyalarının ihtiyaçlarını karşılayacak şekilde güncellendi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

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
                    try { return Encryption::decrypt($setting->value); } catch (\Throwable $e) { self::logAction('Ayar Deşifre Hatası', 'HATA', "Ayar '$settingName' deşifre edilemedi: " . $e->getMessage()); return ''; }
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
                    try { $settingsArray[$setting->setting] = Encryption::decrypt($setting->value); } catch (\Throwable $e) { $settingsArray[$setting->setting] = ''; self::logAction('Toplu Ayar Deşifre Hatası', 'UYARI', "Ayar '{$setting->setting}' deşifre edilemedi.");}
                } else {
                    $settingsArray[$setting->setting] = $setting->value;
                }
            }
            // Şifrelerin dolu olup olmadığını belirtmek için ek anahtarlar (config.tpl JS için)
            $settingsArray['main_ftp_pass_is_set'] = !empty(Capsule::table('mod_btk_settings')->where('setting', 'main_ftp_pass')->value('value')) ? '1' : '0';
            $settingsArray['backup_ftp_pass_is_set'] = !empty(Capsule::table('mod_btk_settings')->where('setting', 'backup_ftp_pass')->value('value')) ? '1' : '0';

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
                    $valueToStore = ''; // Şifreyi silmek için boş kaydet
                } else { // Gelen değer '********' ise, mevcut değeri değiştirme
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
                } else {
                    $ipAdresi = 'CLI'; // Cron gibi durumlar için
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
            error_log("BTK Reports Module - LogAction Critical Error (DB Error?): " . $e->getMessage() . " | Original Log: [$logSeviyesi] $islem - " . (is_string($mesaj) ? $mesaj : json_encode($mesaj)));
        }
    }
    
    public static function getModuleLogs($filters = [], $orderBy = 'id', $sortOrder = 'DESC', $limit = 50, $offset = 0) {
        try {
            $query = Capsule::table('mod_btk_logs');
            if (!empty($filters['s_log_level']) && $filters['s_log_level'] !== 'ALL') {
                $query->where('log_seviyesi', strtoupper(trim($filters['s_log_level'])));
            }
            if (!empty($filters['s_log_islem'])) {
                $query->where('islem', 'LIKE', '%' . trim($filters['s_log_islem']) . '%');
            }
            if (!empty($filters['s_log_mesaj'])) {
                $query->where('mesaj', 'LIKE', '%' . trim($filters['s_log_mesaj']) . '%');
            }
            if (!empty($filters['s_log_date_from'])) {
                try { $dateFrom = new DateTime($filters['s_log_date_from']); $query->where('log_zamani', '>=', $dateFrom->format('Y-m-d 00:00:00')); } catch (Exception $ex) {}
            }
            if (!empty($filters['s_log_date_to'])) {
                 try { $dateTo = new DateTime($filters['s_log_date_to']); $query->where('log_zamani', '<=', $dateTo->format('Y-m-d 23:59:59')); } catch (Exception $ex) {}
            }

            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) {
            self::logAction('Modül Log Okuma Hatası', 'HATA', $e->getMessage());
            return ['data' => [], 'total_count' => 0];
        }
    }

    // --- Yetki Türü Yönetimi ---
    public static function getAllYetkiTurleriReferans() {
        try {
            // config.tpl'de grup bilgisi de gösteriliyor, o yüzden onu da çekelim.
            return Capsule::table('mod_btk_yetki_turleri_referans')->orderBy('yetki_adi')->select('yetki_kodu', 'yetki_adi', 'grup')->get()->all();
        } catch (Exception $e) { self::logAction('Yetki Türü Referans Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }

    public static function getSeciliYetkiTurleri() { // Sadece aktif olanların kodlarını array key olarak döner
        $secili = [];
        try {
            $results = Capsule::table('mod_btk_secili_yetki_turleri')->where('aktif', 1)->pluck('yetki_kodu')->all();
            if ($results) {
                foreach ($results as $kod) {
                    $secili[$kod] = 1;
                }
            }
        } catch (Exception $e) { self::logAction('Seçili Yetki Türü Okuma Hatası', 'Hata', $e->getMessage());}
        return $secili;
    }
    
    public static function getAktifYetkiTurleri($returnAs = 'array_grup') {
        $aktifYetkiler = [];
        try {
            $results = Capsule::table('mod_btk_secili_yetki_turleri as syt')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'syt.yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('syt.aktif', 1)
                ->whereNotNull('ytr.grup')
                ->where('ytr.grup', '!=', '')
                ->select('syt.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup')
                ->orderBy('ytr.grup')->orderBy('ytr.yetki_adi')
                ->get()->all();

            if ($returnAs === 'object_list') {
                 return array_map(function($item){ return (object)$item; }, $results); // TPL'de -> erişimi için
            }
            if ($returnAs === 'array_of_arrays') return array_map(function($item){ return (array)$item; }, $results);

            foreach ($results as $row_obj) {
                $row = (array)$row_obj;
                if ($returnAs === 'array_grup') {
                    $aktifYetkiler[$row['grup']][] = $row;
                } elseif ($returnAs === 'array_grup_names_only') {
                    if (!in_array($row['grup'], $aktifYetkiler)) {
                        $aktifYetkiler[] = $row['grup'];
                    }
                } else { 
                     $aktifYetkiler[] = $row;
                }
            }
        } catch (Exception $e) { self::logAction('Aktif Yetki Türü Okuma Hatası', 'Hata', $e->getMessage()); }
        return $aktifYetkiler;
    }

    public static function saveSeciliYetkiTurleri($secilenYetkilerInput = []) {
        try {
            // Önce tüm referans yetkilerinin aktifliğini 0 yap
            $allYetkiKodlari = Capsule::table('mod_btk_yetki_turleri_referans')->pluck('yetki_kodu')->all();
            if(!empty($allYetkiKodlari)){
                Capsule::table('mod_btk_secili_yetki_turleri')
                    ->whereIn('yetki_kodu', $allYetkiKodlari)
                    ->update(['aktif' => 0]);
            }
            
            if (!empty($secilenYetkilerInput) && is_array($secilenYetkilerInput)) {
                $aktifKodlar = [];
                foreach($secilenYetkilerInput as $kod => $val){
                    if($val === 'on' || $val === 1 || $val === true || (is_string($val) && !empty($val)) ){ 
                        $aktifKodlar[] = $kod;
                    }
                }
                if (!empty($aktifKodlar)) {
                    foreach($aktifKodlar as $kodToActivate){
                        Capsule::table('mod_btk_secili_yetki_turleri')
                            ->updateOrInsert(
                                ['yetki_kodu' => $kodToActivate],
                                ['aktif' => 1]
                            );
                    }
                }
            }
        } catch (Exception $e) { self::logAction('Seçili Yetki Türü Kaydetme Hatası', 'Hata', $e->getMessage()); }
    }
        
    public static function getAllEk3HizmetTipleriByGrup() {
        $grouped = [];
        try {
            $results = Capsule::table('mod_btk_ek3_hizmet_tipleri')
                        ->whereNotNull('ana_yetki_grup')
                        ->where('ana_yetki_grup', '!=', '')
                        ->orderBy('ana_yetki_grup')
                        ->orderBy('hizmet_tipi_aciklamasi')
                        ->get(['hizmet_tipi_kodu as kod', 'hizmet_tipi_aciklamasi as ad', 'ana_yetki_grup'])
                        ->all();
            foreach($results as $row){
                $grouped[$row->ana_yetki_grup][] = (array)$row;
            }
        } catch (Exception $e) {
            self::logAction('EK-3 Hizmet Tipleri (Gruplu) Okuma Hatası', 'HATA', $e->getMessage());
        }
        return $grouped;
    }

    public static function getProductGroupMappingsArray() {
        $mappings = [];
        try {
            $results = Capsule::table('mod_btk_product_group_mappings')->get();
            foreach($results as $row) {
                // $current_mappings[$group.id].ana_btk_yetki_kodu_grup için ana_btk_yetki_kodu'ndan grup bilgisini çekmeliyiz.
                $anaYetkiReferans = Capsule::table('mod_btk_yetki_turleri_referans')->where('yetki_kodu', $row->ana_btk_yetki_kodu)->first();
                $mappings[(int)$row->gid] = [
                    'ana_btk_yetki_kodu' => $row->ana_btk_yetki_kodu,
                    'ek3_hizmet_tipi_kodu' => $row->ek3_hizmet_tipi_kodu,
                    'ana_btk_yetki_kodu_grup' => $anaYetkiReferans ? $anaYetkiReferans->grup : null
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
                    foreach ($mappingsData as $gid => $mapping) {
                        if (!empty($gid) && is_numeric($gid) && 
                            isset($mapping['ana_btk_yetki_kodu']) && !empty(trim($mapping['ana_btk_yetki_kodu'])) &&
                            isset($mapping['ek3_hizmet_tipi_kodu']) && !empty(trim($mapping['ek3_hizmet_tipi_kodu']))) {
                            $insertData[] = [
                                'gid' => (int)$gid,
                                'ana_btk_yetki_kodu' => trim($mapping['ana_btk_yetki_kodu']),
                                'ek3_hizmet_tipi_kodu' => trim($mapping['ek3_hizmet_tipi_kodu'])
                            ];
                        }
                    }
                }
                if(!empty($insertData)){
                    Capsule::table('mod_btk_product_group_mappings')->insert($insertData);
                }
            });
            self::logAction('Ürün Grubu Eşleştirmeleri Kaydedildi', 'BAŞARILI', count($mappingsData) . ' ürün grubu için eşleştirme güncellendi.', $adminId);
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
                ->join('mod_btk_yetki_turleri_referans as ytr', 'pgmap.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu') // ana_btk_yetki_kodu ile join
                ->where('pgmap.gid', $product->gid)
                ->select('ytr.grup')
                ->first();
            
            if ($mapping && !empty($mapping->grup)) { return $mapping->grup; }
            self::logAction('Yetki Grubu Bulma (Eşleşme)', 'UYARI', "Hizmet (ID:{$serviceId}, GID:{$product->gid}) için BTK Yetki Grubu eşleşmesi bulunamadı veya eşleşen yetkinin grubu tanımsız.");
            return null;
        } catch (Exception $e) { self::logAction('Hizmet İçin Yetki Grubu Bulma Hatası', 'HATA', "Service ID: {$serviceId}, Hata: ".$e->getMessage()); return null; }
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
        global $LANG; // Dil dosyası için globalden al
        if (!class_exists('Cron\CronExpression')) {
            self::logAction('Cron Zamanlama Hatası', 'UYARI', 'CronExpression kütüphanesi bulunamadı (vendor/autoload.php).');
            return $LANG['cronLibMissing'] ?? 'Zamanlama Kütüphanesi Eksik';
        }
        try {
            $schedule = self::get_btk_setting($cronScheduleSettingKey);
            if (empty($schedule)) { return $LANG['notConfigured'] ?? 'Ayarlanmamış'; }
            if (!CronExpression::isValidExpression($schedule)) {
                self::logAction('Geçersiz Cron İfadesi', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule'");
                return $LANG['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
            }
            $cron = CronExpression::factory($schedule);
            return $cron->getNextRunDate('now', 0, false, date_default_timezone_get())->format('Y-m-d H:i:s T'); // Sunucunun yerel saat dilimine göre
        } catch (InvalidArgumentException $iae) {
            self::logAction('Geçersiz Cron İfadesi (InvalidArgument)', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $iae->getMessage());
            return $LANG['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
        }
         catch (Exception $e) { self::logAction('Sonraki Cron Çalışma Zamanı Hesaplama Hatası', 'HATA', "Ayar: $cronScheduleSettingKey, Hata: " . $e->getMessage()); return $LANG['errorFetchingNextRun'] ?? 'Hesaplanamadı'; }
    }
    
// --- BÖLÜM 1/5 Sonu ---
// ... BtkHelper.php Bölüm 1/5 içeriğinin sonu ...

    // --- FTP İşlemleri ---
    /**
     * Verilen tipteki (main/backup) FTP sunucusunun ayarlarını kullanarak bağlantıyı test eder.
     * @param string $type 'main' veya 'backup'
     * @return array ['status' => 'success'/'error', 'message' => 'Bağlantı mesajı']
     */
    public static function checkFtpConnection($type = 'main') {
        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass'); 
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', '0'); 

        if (empty($host)) {
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP sunucu adresi ayarlanmamış.'];
        }
        // Kullanıcı adı boş olabilir, anonim girişi desteklemez BTK.
        if (empty($user)) {
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP kullanıcı adı ayarlanmamış.'];
        }
        
        return self::testFtpConnectionWithDetails($host, $user, $pass, $port, $ssl, ucfirst($type));
    }
    
    /**
     * Doğrudan verilen detaylarla FTP bağlantısını test eder.
     * bt_action_test_ftp tarafından kullanılır.
     */
    public static function testFtpConnectionWithDetails($host, $user, $pass, $port = 21, $ssl = false, $ftpTypeLabel = 'FTP') {
        if (empty($host) || empty($user)) { 
            return ['status' => 'error', 'message' => $ftpTypeLabel . ' bağlantı testi için Host ve Kullanıcı Adı gereklidir.']; 
        }
        
        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);

        if (!$connect_function) {
            $errMsg = $ftpTypeLabel . ' FTP fonksiyonları (ftp_connect/ftp_ssl_connect) sunucunuzda etkin değil.';
            // Bu loglama btk_action_test_ftp içinde yapılabilir veya burada da kalabilir.
            // self::logAction($ftpTypeLabel . ' FTP Bağlantı Test Hatası', 'CRITICAL', $errMsg);
            return ['status' => 'error', 'message' => $errMsg];
        }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function(trim($host), (int)$port, 15); // 15 saniye timeout
        error_reporting($old_error_reporting);

        if ($conn_id) {
            // Şifre boşsa bile ftp_login'e boş string olarak gönderilir.
            $login_result = @ftp_login($conn_id, trim($user), (string)$pass); 
            if ($login_result) {
                @ftp_pasv($conn_id, true);
                $message = $ftpTypeLabel . ' sunucusuna başarıyla bağlanıldı.';
                @ftp_close($conn_id);
                return ['status' => 'success', 'message' => $message];
            } else {
                $message = $ftpTypeLabel . ' sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: \'' . htmlspecialchars(trim($user)) . '\'). Lütfen kullanıcı adı ve şifrenizi kontrol edin.';
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => $message];
            }
        } else {
            $message = $ftpTypeLabel . ' sunucusuna (' . htmlspecialchars(trim($host)) . ':' . (int)$port . ') bağlanılamadı. Host, port, güvenlik duvarı ve ağ ayarlarınızı kontrol edin.';
            return ['status' => 'error', 'message' => $message];
        }
    }

    public static function uploadFileToFtp($localFilePath, $remoteFileName, $type = 'main', $raporTuru = 'BILINMEYEN') {
        $logKullaniciId = self::getCurrentAdminId(); // Cron'dan çağrılırsa null olabilir
        if (!file_exists($localFilePath) || !is_readable($localFilePath)) {
            self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Yerel dosya bulunamadı veya okunamıyor: $localFilePath", $logKullaniciId);
            return ['status' => 'error', 'message' => "Yerel dosya bulunamadı veya okunamıyor: $localFilePath"];
        }
        $fileSize = filesize($localFilePath);
        if ($fileSize === 0 && self::get_btk_setting('send_empty_reports') !== '1') {
            self::logAction(ucfirst($type) . " FTP Yükleme Atlandı ($raporTuru)", 'BİLGİ', "Dosya boş (0 byte) ve boş rapor gönderimi kapalı: $localFilePath", $logKullaniciId);
            return ['status' => 'skipped', 'message' => "Dosya boş ve boş rapor gönderimi kapalı, yükleme atlandı."];
        }

        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass');
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', '0');
        
        if (empty($host) || empty($user)) {
             $errorMsg = ucfirst($type) . " FTP sunucu adresi veya kullanıcı adı ayarlanmamış. Yükleme yapılamıyor.";
             self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', $errorMsg, $logKullaniciId);
             return ['status' => 'error', 'message' => $errorMsg];
        }
        
        $raporTuruNormalized = strtoupper($raporTuru);
        $pathKeyPart = '';
        if (strpos($raporTuruNormalized, 'REHBER') !== false) $pathKeyPart = 'rehber';
        elseif (strpos($raporTuruNormalized, 'HAREKET') !== false) $pathKeyPart = 'hareket';
        elseif (strpos($raporTuruNormalized, 'PERSONEL') !== false) $pathKeyPart = 'personel';
        else { self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Bilinmeyen rapor türü ($raporTuru) için FTP yolu belirlenemedi.", $logKullaniciId); return ['status' => 'error', 'message' => 'Bilinmeyen rapor türü için FTP yolu belirlenemedi.'];}

        $basePathSettingKey = strtolower($type) . '_ftp_' . $pathKeyPart . '_path';
        $basePath = self::get_btk_setting($basePathSettingKey, '/');
        $remoteDir = trim($basePath, '/\\'); // Hem / hem \ temizle
        $remoteFileFullPath = ($remoteDir === '' ? '' : $remoteDir . '/') . $remoteFileName;

        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);
        if (!$connect_function) { $errMsg = ucfirst($type) . ' FTP fonksiyonları sunucunuzda etkin değil.'; self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'CRITICAL', $errMsg, $logKullaniciId); return ['status' => 'error', 'message' => $errMsg]; }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function(trim($host), $port, 30); // Timeout 30 saniye
        error_reporting($old_error_reporting);

        if ($conn_id) {
            $login_user_ftp = trim($user);
            $login_pass_ftp = (string)$pass;
            if (@ftp_login($conn_id, $login_user_ftp, $login_pass_ftp)) {
                @ftp_pasv($conn_id, true);
                
                // Uzak dizinleri oluşturma
                if ($remoteDir !== '' && $remoteDir !== '.') {
                    $parts = preg_split('/[\\\\\/]/', $remoteDir); // Hem / hem de \ ile ayır
                    $currentBuildPath = '';
                    foreach ($parts as $part) {
                        if (empty($part)) continue;
                        $currentBuildPath .= (empty($currentBuildPath) || substr($currentBuildPath, -1) === '/' ? '' : '/') . $part;
                        if (!@ftp_nlist($conn_id, $currentBuildPath)) { // Dizinin varlığını nlist ile kontrol et (chdir'den daha güvenilir olabilir)
                            if (!@ftp_mkdir($conn_id, $currentBuildPath)) {
                                $message = "$type FTP: Uzak dizin ($currentBuildPath) oluşturulamadı.";
                                @ftp_close($conn_id);
                                self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', $message, $logKullaniciId);
                                return ['status' => 'error', 'message' => $message];
                            }
                        }
                    }
                }

                if (@ftp_put($conn_id, $remoteFileFullPath, $localFilePath, FTP_BINARY)) {
                    $message = "$remoteFileName dosyası başarıyla $type FTP sunucusuna ($remoteFileFullPath) yüklendi ($fileSize byte).";
                    @ftp_close($conn_id);
                    return ['status' => 'success', 'message' => $message, 'remote_path' => $remoteFileFullPath];
                } else {
                    $ftp_error = error_get_last();
                    $message = "$remoteFileName dosyası $type FTP sunucusuna ($remoteFileFullPath) yüklenirken hata." . ($ftp_error ? ' (FTP Hatası: ' . $ftp_error['message'] . ')' : ' Bilinmeyen FTP hatası.');
                    @ftp_close($conn_id);
                    return ['status' => 'error', 'message' => $message];
                }
            } else {
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => "$type FTP sunucusuna bağlanıldı ancak giriş başarısız (Kullanıcı: '$login_user_ftp')."];
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
    public static function getIller() {
        try {
            $iller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get(['id', 'il_adi', 'plaka_kodu'])->all();
            return array_map(function($il){ return (array)$il; }, $iller);
        } catch (Exception $e) { self::logAction('İl Listesi Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }
    public static function getIlcelerByIlId($il_id, $includeIlAdi = false) {
        if (empty($il_id) || !is_numeric($il_id)) {
            if ($includeIlAdi) { 
                 try {
                    $results = Capsule::table('mod_btk_adres_ilce as ilce')
                        ->join('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')
                        ->select('ilce.id', 'ilce.ilce_adi', 'il.il_adi as il_adi_prefix')
                        ->orderBy('il.il_adi')->orderBy('ilce.ilce_adi')
                        ->get()->all();
                    return array_map(function($item){ return (array)$item; }, $results);
                } catch (Exception $e) { self::logAction('Tüm İlçe Listesi (İl Adıyla) Okuma Hatası', 'Hata', $e->getMessage()); return []; }
            }
            return [];
        }
        try {
            $query = Capsule::table('mod_btk_adres_ilce')->where('il_id', (int)$il_id)->orderBy('ilce_adi');
            if ($includeIlAdi) {
                $query->join('mod_btk_adres_il as il', 'mod_btk_adres_ilce.il_id', '=', 'il.id')
                      ->select('mod_btk_adres_ilce.id', 'mod_btk_adres_ilce.ilce_adi', 'il.il_adi as il_adi_prefix');
            } else {
                $query->select('id', 'ilce_adi');
            }
            $results = $query->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) { self::logAction('İlçe Listesi Okuma Hatası', 'Hata', "İl ID: $il_id, " . $e->getMessage()); return []; }
    }
    public static function getMahallelerByIlceId($ilce_id) {
        if (empty($ilce_id) || !is_numeric($ilce_id)) return [];
        try {
            $results = Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', (int)$ilce_id)->orderBy('mahalle_adi')->get(['id', 'mahalle_adi', 'posta_kodu'])->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) { self::logAction('Mahalle Listesi Okuma Hatası', 'Hata', "İlçe ID: $ilce_id, " . $e->getMessage()); return []; }
    }
    public static function getIlIdByAdi($ilAdi) {
        if(empty(trim($ilAdi))) return null;
        try {
            $il = Capsule::table('mod_btk_adres_il')->where('il_adi', trim($ilAdi))->first();
            return $il ? $il->id : null;
        } catch (Exception $e) { self::logAction('İl ID Bulma Hatası (Ad ile)', 'UYARI', "İl Adı: $ilAdi, Hata: " . $e->getMessage()); return null; }
    }
     public static function getIlceIdByAdi($ilceAdi, $ilId) {
        if(empty(trim($ilceAdi)) || empty($ilId) || !is_numeric($ilId)) return null;
        try {
            $ilce = Capsule::table('mod_btk_adres_ilce')->where('il_id', (int)$ilId)->where('ilce_adi', trim($ilceAdi))->first();
            return $ilce ? $ilce->id : null;
        } catch (Exception $e) { self::logAction('İlçe ID Bulma Hatası (Ad ile)', 'UYARI', "İlçe Adı: $ilceAdi, İl ID: $ilId, Hata: " . $e->getMessage()); return null; }
    }
     public static function getMahalleIdByAdi($mahalleAdi, $ilceId) {
        if(empty(trim($mahalleAdi)) || empty($ilceId) || !is_numeric($ilceId)) return null;
        try {
            $mahalle = Capsule::table('mod_btk_adres_mahalle')->where('ilce_id', (int)$ilceId)->where('mahalle_adi', trim($mahalleAdi))->first();
            return $mahalle ? $mahalle->id : null;
        } catch (Exception $e) { self::logAction('Mahalle ID Bulma Hatası (Ad ile)', 'UYARI', "Mahalle Adı: $mahalleAdi, İlçe ID: $ilceId, Hata: " . $e->getMessage()); return null; }
    }
    
// --- BtkHelper.php Bölüm 2/5 Sonu ---
// --- Bir sonraki bölüm "ISS POP Noktaları İçin Yardımcı Fonksiyonlar" ile devam edecek ---
// ... BtkHelper.php Bölüm 2/5 içeriğinin sonu ...

    // --- ISS POP Noktaları İçin Yardımcı Fonksiyonlar ---
    /**
     * ISS POP Noktalarını arama terimine ve filtreye göre getirir (AJAX için).
     * @param string $term Arama terimi (SSID veya POP Adı içinde)
     * @param string|null $filter_by Filtreleme kolonu (il_id, ilce_id, mahalle_id)
     * @param mixed|null $filter_value Filtre değeri
     * @param int $limit Sonuç limiti
     * @return array Eşleşen POP noktalarının dizisi (id, yayin_yapilan_ssid, pop_adi içerir)
     */
    public static function searchPopSSIDs($term = '', $filter_by = null, $filter_value = null, $limit = 25) {
        // Filtre değeri boş veya null ise ve arama terimi de boşsa, boş dizi dön.
        if (empty($term) && (empty($filter_by) || is_null($filter_value) || $filter_value === '')) {
            return [];
        }
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari')->where('aktif_pasif_durum', 1); // Sadece aktif olanları ara

            if (!empty($filter_by) && !is_null($filter_value) && $filter_value !== '' && is_numeric($filter_value)) {
                if (in_array($filter_by, ['il_id', 'ilce_id', 'mahalle_id'])) {
                    $query->where($filter_by, (int)$filter_value);
                }
            }
            if (!empty($term)) {
                $searchTerm = '%' . trim($term) . '%';
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('yayin_yapilan_ssid', 'LIKE', $searchTerm)
                      ->orWhere('pop_adi', 'LIKE', $searchTerm);
                });
            }
            // Sonuçları pop_adi ve sonra ssid'ye göre sırala, limit uygula ve sadece gerekli alanları seç.
            $results = $query->orderBy('pop_adi')->orderBy('yayin_yapilan_ssid')->take($limit)
                              ->select('id', 'yayin_yapilan_ssid', 'pop_adi')
                              ->get()->all();
            return array_map(function($item){ return (array)$item; }, $results);
        } catch (Exception $e) { 
            self::logAction('POP SSID Arama Hatası', 'HATA', $e->getMessage(), null, ['term' => $term, 'filter_by' => $filter_by, 'filter_value' => $filter_value]);
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
    
    public static function getIssPopNoktalariList($filters = [], $orderBy = 'pop.pop_adi', $sortOrder = 'ASC', $limit = 25, $offset = 0) {
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari as pop')
                        ->leftJoin('mod_btk_adres_il as il', 'pop.il_id', '=', 'il.id')
                        ->leftJoin('mod_btk_adres_ilce as ilce', 'pop.ilce_id', '=', 'ilce.id')
                        ->leftJoin('mod_btk_adres_mahalle as mah', 'pop.mahalle_id', '=', 'mah.id');

            if(!empty($filters['s_pop_adi'])) $query->where('pop.pop_adi', 'LIKE', '%'.trim($filters['s_pop_adi']).'%');
            if(!empty($filters['s_yayin_yapilan_ssid'])) $query->where('pop.yayin_yapilan_ssid', 'LIKE', '%'.trim($filters['s_yayin_yapilan_ssid']).'%');
            if(!empty($filters['s_il_id']) && is_numeric($filters['s_il_id'])) $query->where('pop.il_id', (int)$filters['s_il_id']);
            if(!empty($filters['s_ilce_id']) && is_numeric($filters['s_ilce_id'])) $query->where('pop.ilce_id', (int)$filters['s_ilce_id']);
            if(isset($filters['s_aktif_pasif_durum']) && $filters['s_aktif_pasif_durum'] !== '' && is_numeric($filters['s_aktif_pasif_durum'])) {
                $query->where('pop.aktif_pasif_durum', (int)$filters['s_aktif_pasif_durum']);
            }

            $total = $query->count();
            
            // Sıralama için güvenli yol: Whitelist veya sütun adını doğrula
            $allowedOrderByColumns = ['pop.pop_adi', 'pop.yayin_yapilan_ssid', 'il.il_adi', 'ilce.ilce_adi', 'pop.pop_tipi', 'pop.aktif_pasif_durum', 'pop.id'];
            $orderBySanitized = 'pop.pop_adi'; // Varsayılan
            if (in_array(strtolower($orderBy), $allowedOrderByColumns) || in_array($orderBy, $allowedOrderByColumns)) { // 'pop.pop_adi' veya 'pop_adi' gibi
                 $orderBySanitized = $orderBy;
            }
            $sortOrderSanitized = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

            $pops = $query->select('pop.*', 'il.il_adi', 'ilce.ilce_adi', 'mah.mahalle_adi')
                          ->orderByRaw(Capsule::raw("`{$orderBySanitized}` {$sortOrderSanitized}"))
                          ->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($pop){ return (array)$pop; }, $pops), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('ISS POP Listesi Okuma Hatası', 'HATA', $e->getMessage()); return ['data' => [], 'total_count' => 0];}
    }

    public static function saveIssPopNoktasi($data) {
        $adminId = self::getCurrentAdminId();
        if (empty(trim($data['pop_adi'] ?? '')) || empty(trim($data['yayin_yapilan_ssid'] ?? ''))) {
            self::logAction('ISS POP Kaydetme Hatası', 'UYARI', 'POP Adı veya Yayın SSID boş olamaz.', $adminId, $data);
            return ['status' => false, 'message' => 'POP Adı ve Yayın Yapılan SSID alanları zorunludur.'];
        }
        try {
            $popData = [
                'pop_adi' => trim($data['pop_adi']),
                'yayin_yapilan_ssid' => trim($data['yayin_yapilan_ssid']),
                'ip_adresi' => isset($data['ip_adresi']) ? trim($data['ip_adresi']) : null,
                'cihaz_turu' => isset($data['cihaz_turu']) ? trim($data['cihaz_turu']) : null,
                'cihaz_markasi' => isset($data['cihaz_markasi']) ? trim($data['cihaz_markasi']) : null,
                'cihaz_modeli' => isset($data['cihaz_modeli']) ? trim($data['cihaz_modeli']) : null,
                'pop_tipi' => isset($data['pop_tipi']) ? trim($data['pop_tipi']) : null,
                'il_id' => (isset($data['il_id']) && is_numeric($data['il_id']) && (int)$data['il_id'] > 0) ? (int)$data['il_id'] : null,
                'ilce_id' => (isset($data['ilce_id']) && is_numeric($data['ilce_id']) && (int)$data['ilce_id'] > 0) ? (int)$data['ilce_id'] : null,
                'mahalle_id' => (isset($data['mahalle_id']) && is_numeric($data['mahalle_id']) && (int)$data['mahalle_id'] > 0) ? (int)$data['mahalle_id'] : null,
                'tam_adres' => isset($data['tam_adres']) ? trim($data['tam_adres']) : null,
                'koordinatlar' => isset($data['koordinatlar']) ? trim($data['koordinatlar']) : null,
                'aktif_pasif_durum' => (isset($data['aktif_pasif_durum']) && ($data['aktif_pasif_durum'] === '1' || $data['aktif_pasif_durum'] === 'on' || $data['aktif_pasif_durum'] === true || $data['aktif_pasif_durum'] === 1)) ? 1 : 0,
            ];
            
            $popIdToUpdate = isset($data['pop_id']) ? (int)$data['pop_id'] : 0;

            // Unique kontrolü: Aynı ilçe, pop_adı ve SSID kombinasyonu olmamalı
            if($popData['ilce_id']){ // İlçe seçilmişse bu kontrolü yap
                $uniqueCheckQuery = Capsule::table('mod_btk_iss_pop_noktalari')
                                    ->where('yayin_yapilan_ssid', $popData['yayin_yapilan_ssid'])
                                    ->where('pop_adi', $popData['pop_adi'])
                                    ->where('ilce_id', $popData['ilce_id']);
                if ($popIdToUpdate > 0) {
                    $uniqueCheckQuery->where('id', '!=', $popIdToUpdate);
                }
                $existingPop = $uniqueCheckQuery->first();
                if($existingPop){
                     $errorMsg = "Aynı ilçe, POP Adı ve Yayın SSID kombinasyonu zaten mevcut (ID: {$existingPop->id}). Lütfen bilgileri kontrol edin.";
                     self::logAction('ISS POP Kaydetme Hatası', 'UYARI', $errorMsg, $adminId, $data);
                     return ['status' => false, 'message' => $errorMsg];
                }
            }


            if ($popIdToUpdate > 0) {
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popIdToUpdate)->update($popData);
                self::logAction('ISS POP Güncellendi', 'BAŞARILI', "ID: $popIdToUpdate - SSID: {$popData['yayin_yapilan_ssid']}", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla güncellendi.', 'id' => $popIdToUpdate];
            } else {
                $popId = Capsule::table('mod_btk_iss_pop_noktalari')->insertGetId($popData);
                self::logAction('ISS POP Eklendi', 'BAŞARILI', "Yeni ID: $popId - SSID: {$popData['yayin_yapilan_ssid']}", $adminId);
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
            // Bu POP noktası herhangi bir hizmetle ilişkili mi kontrol et (mod_btk_service_pop_mapping)
            $isUsed = Capsule::table('mod_btk_service_pop_mapping')->where('iss_pop_noktasi_id', (int)$popId)->exists();
            if ($isUsed) {
                self::logAction('ISS POP Silme Engellendi', 'UYARI', "ID: $popId, aktif hizmetlerle ilişkili olduğu için silinemedi.", $logKullaniciId);
                return ['status' => false, 'message' => 'Bu POP noktası aktif hizmetlerle ilişkili olduğu için silinemez. Önce ilgili hizmetlerden bu POP noktasını kaldırın.'];
            }

            $pop = self::getIssPopNoktasiById((int)$popId);
            if (!$pop) {
                return ['status' => false, 'message' => "Silinecek POP Noktası (ID: $popId) bulunamadı."];
            }
            $deleted = Capsule::table('mod_btk_iss_pop_noktalari')->where('id', (int)$popId)->delete();
            if ($deleted) {
                self::logAction('ISS POP Silindi', 'BAŞARILI', "ID: $popId, Adı: {$pop['pop_adi']}, SSID: {$pop['yayin_yapilan_ssid']}", $logKullaniciId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla silindi.'];
            }
            self::logAction('ISS POP Silme Başarısız', 'UYARI', "ID: $popId silinemedi (DB Hatası veya kayıt yok).", $logKullaniciId);
            return ['status' => false, 'message' => 'POP Noktası silinirken bir sorun oluştu veya kayıt bulunamadı.'];
        } catch (Exception $e) {
            self::logAction('ISS POP Silme Kapsamlı Hata', 'HATA', "ID: $popId, Hata: " . $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'POP Noktası silinirken bir veritabanı hatası oluştu.'];
        }
    }

// --- BtkHelper.php Bölüm 3/5 Sonu --- 
// --- Bir sonraki bölüm "Personel Yönetimi" ile devam edecek ---
// ... BtkHelper.php Bölüm 3/5 içeriğinin sonu ...

    // --- Dosya Adlandırma ve CNT Yönetimi ---
    /**
     * BTK formatına uygun rapor dosya adı oluşturur.
     * @param string $operatorAdi Operatörün raporlarda kullanılacak adı (Ayarlardan gelir).
     * @param string $operatorKodu Operatörün BTK kodu (Ayarlardan gelir).
     * @param string|null $yetkiTuruGrup Raporun ait olduğu yetki türü grubu (örn: ISS, AIH, STH). Personel için null.
     * @param string $raporTuru ABONE_REHBER, ABONE_HAREKET, PERSONEL_LISTESI.
     * @param string $cnt İki haneli CNT numarası (örn: '01').
     * @param int|null $timestamp Dosya adı için kullanılacak zaman damgası (Unix timestamp). Null ise şu anki zaman (UTC).
     * @param string $forFtpType 'main' veya 'backup' (Personel dosyası adı için Yıl-Ay ekleme ayarını etkiler).
     * @return string|false Oluşturulan dosya adı (uzantılı .abn veya .xlsx) veya hata durumunda false.
     */
    public static function generateReportFilename($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $cnt, $timestamp = null, $forFtpType = 'main') {
        if (empty(trim($operatorAdi))) {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Adı boş olamaz.');
            return false;
        }
        $raporTuruUpper = strtoupper(trim($raporTuru));
        if ($raporTuruUpper !== 'PERSONEL_LISTESI' && empty(trim($operatorKodu))) {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "Operatör Kodu ($raporTuru için) boş olamaz.");
            return false;
        }

        if (is_null($timestamp)) { $timestamp = time(); }
        
        // BTK genellikle lokal zamanı değil, UTC'yi baz alır.
        $dateTimePart = gmdate('YmdHis', $timestamp); 
        $cntPadded = str_pad((string)$cnt, 2, '0', STR_PAD_LEFT);

        $cleanOperatorName = strtoupper(preg_replace('/[^a-zA-Z0-9_]/', '', trim($operatorAdi)));
        $filename = '';
        $extension = '';

        if ($raporTuruUpper === 'PERSONEL_LISTESI') {
            $addYearMonthSettingKey = strtolower($forFtpType) . '_personel_filename_add_year_month';
            $defaultAddYearMonth = ($forFtpType === 'backup') ? '1' : self::get_btk_setting('personel_filename_add_year_month_main', '0');
            $addYearMonth = (bool)self::get_btk_setting($addYearMonthSettingKey, $defaultAddYearMonth);
            
            $yearMonthPart = $addYearMonth ? "_" . gmdate('Y_m', $timestamp) : '';
            $filename = $cleanOperatorName . "_Personel_Listesi" . $yearMonthPart;
            $extension = '.xlsx';
        } elseif ($raporTuruUpper === 'ABONE_REHBER' || $raporTuruUpper === 'ABONE_HAREKET') {
            if (empty(trim($yetkiTuruGrup))) {
                self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "$raporTuru için Yetki Türü Grubu (Tip) boş olamaz.");
                return false;
            }
            if (empty(trim($operatorKodu))) { // Bu kontrol yukarıda vardı ama burada da kalsın
                self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "$raporTuru için Operatör Kodu boş olamaz.");
                return false;
            }
            $cleanOperatorKodu = preg_replace('/[^a-zA-Z0-9]/', '', trim($operatorKodu));
            $cleanYetkiGrup = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', trim($yetkiTuruGrup)));

            $filename = $cleanOperatorName . '_' . $cleanOperatorKodu . '_' . $cleanYetkiGrup . '_' . $raporTuruUpper . '_' . $dateTimePart . '_' . $cntPadded;
            $extension = '.abn';
        } else {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "Bilinmeyen rapor türü: $raporTuru");
            return false;
        }
        return $filename . $extension;
    }

    /**
     * Yeni bir rapor için bir sonraki CNT numarasını döndürür. Her zaman '01' dir.
     * BTK'nın aynı içerikli dosyayı farklı CNT ile istemesi durumu manuel olarak yönetilmelidir.
     */
    public static function getNextCnt($operatorAdi = null, $operatorKodu = null, $yetkiTuruGrup = null, $raporTuru = null, $ftpSunucuTipi = 'ANA') {
        // Otomatik cron veya manuel "yeni rapor oluştur" işlemi her zaman yeni bir zaman damgası ve '01' CNT kullanır.
        // BTK'nın "Dosyanın tekrar gönderilmesi talep edildiğinde iki haneli kod birer arttırılarak iletilir."
        // ifadesi, AYNI ZAMAN DAMGALI ve AYNI İÇERİKLİ dosyanın BTK talebi üzerine tekrar gönderilmesi içindir.
        // Bu fonksiyon, yeni bir dosya adı oluşturulurken çağrıldığı için her zaman '01' döndürmelidir.
        return '01';
    }
    
    // --- Rapor Oluşturma Ana Mantığı ---
    /**
     * ABONE REHBER raporu için verileri çeker.
     * @param string $yetkiTuruGrup Raporlanacak yetki türü grubu (ISS, STH vb.)
     * @param array $filters Ek filtreler (opsiyonel)
     * @return array Raporlanacak abone verilerini içeren dizi. Her eleman bir aboneye/hizmete karşılık gelir.
     */
    public static function getAboneRehberData($yetkiTuruGrup, $filters = []) {
        self::logAction("Rehber Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters);
        $data = [];
        try {
            // 1. $yetkiTuruGrup'a göre hangi ana_btk_yetki_kodu'ların geçerli olduğunu bul.
            $anaYetkiKodlari = Capsule::table('mod_btk_yetki_turleri_referans')
                                ->where('grup', strtoupper($yetkiTuruGrup))
                                ->pluck('yetki_kodu')->all();

            if (empty($anaYetkiKodlari)) {
                self::logAction("Rehber Veri Çekme ($yetkiTuruGrup)", 'UYARI', "Bu grup için tanımlı ana yetki kodu bulunamadı.");
                return [];
            }
            
            // 2. Bu ana_btk_yetki_kodu'larına eşlenmiş ürün gruplarını (gid) bul.
            $productGroupIds = Capsule::table('mod_btk_product_group_mappings')
                                ->whereIn('ana_btk_yetki_kodu', $anaYetkiKodlari)
                                ->pluck('gid')->all();

            if (empty($productGroupIds)) {
                self::logAction("Rehber Veri Çekme ($yetkiTuruGrup)", 'UYARI', "Bu gruba eşlenmiş ürün grubu bulunamadı.");
                return [];
            }

            // 3. Bu ürün gruplarındaki tüm hizmetleri (tblhosting) al.
            // 4. Bu hizmetlere bağlı mod_btk_abone_rehber kayıtlarını çek ve diğer tablolarla join et.
            // BTK tüm aboneleri (aktif, pasif, iptal) istediği için hizmet durumu filtresi yok.
            $query = Capsule::table('mod_btk_abone_rehber as r')
                ->join('tblhosting as h', 'r.whmcs_service_id', '=', 'h.id')
                ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
                ->join('tblclients as c', 'r.whmcs_client_id', '=', 'c.id') // Müşteri bilgileri için
                ->leftJoin('mod_btk_iss_pop_noktalari as pop', 'r.iss_pop_noktasi_id', '=', 'pop.id')
                ->leftJoin('mod_btk_ek3_hizmet_tipleri as ek3', 'r.hizmet_tipi', '=', 'ek3.hizmet_tipi_kodu')
                // Diğer joinler (adres tabloları için il, ilçe, mahalle adları)
                ->leftJoin('mod_btk_adres_il as yil', 'r.yerlesim_il_id', '=', 'yil.id')
                ->leftJoin('mod_btk_adres_ilce as yilce', 'r.yerlesim_ilce_id', '=', 'yilce.id')
                ->leftJoin('mod_btk_adres_mahalle as ymah', 'r.yerlesim_mahalle_id', '=', 'ymah.id')
                ->leftJoin('mod_btk_adres_il as til', 'r.tesis_il_id', '=', 'til.id')
                ->leftJoin('mod_btk_adres_ilce as tilce', 'r.tesis_ilce_id', '=', 'tilce.id')
                ->leftJoin('mod_btk_adres_mahalle as tmah', 'r.tesis_mahalle_id', '=', 'tmah.id')
                ->whereIn('p.gid', $productGroupIds);

            // BTK dokümanındaki tüm alanları seçmeliyiz.
            // ÖNEMLİ: Buradaki select listesi, getBtkAlanSiralamasi() ile DÖNECEK alan adlarıyla
            // ve formatAbnRow() fonksiyonunun beklediği anahtarlarla UYUMLU OLMALIDIR.
            // Alan adları DB'de küçük harf, BTK'da büyük harf olabilir, bu eşleştirme formatAbnRow'da yapılır.
            $rehberKayitlari = $query->select(
                'r.*', // mod_btk_abone_rehber'deki tüm alanlar
                'pop.yayin_yapilan_ssid as iss_pop_noktasi_ssid', // iss_pop_bilgisi için
                'ek3.hizmet_tipi_aciklamasi as hizmet_tipi_adi_ref', // Kontrol için
                'yil.il_adi as yerlesim_il_adi_ref', 'yilce.ilce_adi as yerlesim_ilce_adi_ref', 'ymah.mahalle_adi as yerlesim_mahalle_adi_ref', 'ymah.posta_kodu as yerlesim_posta_kodu_ref',
                'til.il_adi as tesis_il_adi_ref', 'tilce.ilce_adi as tesis_ilce_adi_ref', 'tmah.mahalle_adi as tesis_mahalle_adi_ref', 'tmah.posta_kodu as tesis_posta_kodu_ref'
                // WHMCS tablolarından da bazı temel bilgiler (müşteri adı, soyadı vb.) çekilebilir ve rehberdekiyle karşılaştırılabilir.
            )->get()->all();
            
            $data = array_map(function($item){ return (array)$item; }, $rehberKayitlari);
            self::logAction("Rehber Veri Çekme Tamamlandı ($yetkiTuruGrup)", 'INFO', count($data) . " kayıt bulundu.");

        } catch (Exception $e) {
            self::logAction("Rehber Veri Çekme Hatası ($yetkiTuruGrup)", 'HATA', $e->getMessage());
        }
        return $data;
    }

    public static function getAboneHareketData($yetkiTuruGrup, $filters = []) {
        self::logAction("Hareket Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters);
        $data = [];
        try {
            // 1. gonderildi_flag = 0 olan hareketleri al.
            // 2. Hareketin ait olduğu rehber_kayit_id üzerinden hizmetin $yetkiTuruGrup'a ait olup olmadığını kontrol et.
            // 3. Hareket dosyası, hareket anındaki TÜM rehber bilgilerini içermelidir.
            //    Bu nedenle, mod_btk_abone_hareket_live.hareket_abone_verisi_json alanında
            //    o anki tüm rehber verisinin bir JSON snapshot'ını saklamak en iyi yöntemdir.
            //    Rapor oluşturulurken bu JSON çözülür ve ABN satırı oluşturulur.
            $query = Capsule::table('mod_btk_abone_hareket_live as hl')
                ->join('mod_btk_abone_rehber as r', 'hl.rehber_kayit_id', '=', 'r.id') // Yetki grubu için rehbere join
                ->join('tblhosting as h', 'r.whmcs_service_id', '=', 'h.id')
                ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
                ->join('mod_btk_product_group_mappings as pgm', 'p.gid', '=', 'pgm.gid')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('ytr.grup', strtoupper($yetkiTuruGrup))
                ->where('hl.gonderildi_flag', 0);
            
            // Hareket dosyası için tüm rehber alanları ve hareket özel alanları seçilmeli
            // Şimdilik hareket_abone_verisi_json'dan okunacağını varsayalım.
            $hareketler = $query->select('hl.hareket_abone_verisi_json') 
                                ->orderBy('hl.id', 'ASC') // Gönderim sırası için
                                ->get()->all();

            foreach($hareketler as $hareket){
                if(!empty($hareket->hareket_abone_verisi_json)){
                    $decodedData = json_decode($hareket->hareket_abone_verisi_json, true);
                    if(is_array($decodedData)){
                        $data[] = $decodedData; // Rapor için hazır veri
                    } else {
                        self::logAction("Hareket Veri Çözme Hatası ($yetkiTuruGrup)", 'UYARI', "Hareket ID {$hareket->id} için JSON çözülemedi.");
                    }
                } else {
                     self::logAction("Hareket Veri Eksik ($yetkiTuruGrup)", 'UYARI', "Hareket ID {$hareket->id} için hareket_abone_verisi_json boş.");
                }
            }
            self::logAction("Hareket Veri Çekme Tamamlandı ($yetkiTuruGrup)", 'INFO', count($data) . " hareket kaydı bulundu.");

        } catch (Exception $e) {
            self::logAction("Hareket Veri Çekme Hatası ($yetkiTuruGrup)", 'HATA', $e->getMessage());
        }
        return $data;
    }
    
    public static function markHareketAsGonderildi($hareketIds, $dosyaAdi, $cnt) { /* ... (Önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function archiveOldHareketler() { /* ... (Önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function getPersonelDataForReport($filters = []) { /* ... (Önceki tam BtkHelper gönderimindeki gibi) ... */ }

    public static function formatAbnRow($dataArray, $btkAlanSiralamasi, $isHareket = false) {
        if (empty($btkAlanSiralamasi)) { self::logAction('ABN Formatlama Hatası', 'HATA', 'BTK Alan sıralaması sağlanmadı.'); return ''; }
        
        $rowValues = [];
        foreach ($btkAlanSiralamasi as $btkFieldKey) {
            $btkFieldKeyUpper = strtoupper($btkFieldKey); // Anahtarın büyük harf olduğundan emin ol
            // Veri dizisindeki anahtarların da BTK alan adlarıyla (veya eşleştirilmişleriyle) uyumlu olması beklenir.
            // Genellikle DB'den gelen alan adları küçük harf_alt_tire şeklinde olur.
            // Bu yüzden $dataArray'in anahtarlarını da büyük harfe çevirip arama yapabiliriz.
            $dataArrayUpperKeys = array_change_key_case((array)$dataArray, CASE_UPPER);
            
            $value = ''; 
            if ($btkFieldKeyUpper === 'ISS_POP_BILGISI') {
                // getAboneRehberData veya getAboneHareketData içinde bu birleşik alan zaten hazırlanmış olmalı.
                // Veya $dataArray içinde 'iss_pop_bilgisi_sunucu' ve 'iss_pop_noktasi_ssid' olmalı.
                $popBilgisi = $dataArrayUpperKeys['ISS_POP_BILGISI_SUNUCU'] ?? ($dataArrayUpperKeys['SUNUCU'] ?? ''); // WHMCS sunucu adı
                $popSSID = $dataArrayUpperKeys['ISS_POP_NOKTASI_SSID'] ?? ''; // mod_btk_iss_pop_noktalari.yayin_yapilan_ssid
                if (!empty($popSSID)) {
                    $value = (empty($popBilgisi) ? $popSSID : $popBilgisi . "." . $popSSID);
                } else {
                    $value = $popBilgisi;
                }
            } elseif (array_key_exists($btkFieldKeyUpper, $dataArrayUpperKeys)) {
                $value = $dataArrayUpperKeys[$btkFieldKeyUpper];
            }
            
            $dateTimeFields = ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'GSM_DONDURULMA_TARIHI', 'GSM_KISITLAMA_TARIHI', 'SABIT_DONDURULMA_TARIHI', 'SABIT_KISITLAMA_TARIHI', 'UYDU_DONDURULMA_TARIHI', 'UYDU_KISITLAMA_TARIHI'];
            $dateFields = ['ABONE_DOGUM_TARIHI', 'ABONE_KIMLIK_VERILDIGI_TARIH'];

            if (in_array($btkFieldKeyUpper, $dateTimeFields) && !empty($value)) {
                try { $dt = new DateTime($value); $value = $dt->format('YmdHis'); } catch (Exception $e) { $value = '00000000000000';} // BTK genellikle boş yerine 0 bekler
            } elseif (in_array($btkFieldKeyUpper, $dateFields) && !empty($value)) {
                 try { $dt = new DateTime($value); $value = $dt->format('Ymd'); } catch (Exception $e) { $value = '00000000';}
            }
            // BTK genellikle boş alanları ||;|boş|;|... şeklinde değil, |;||;| şeklinde bekler.
            // Yani implode öncesi boş string olmalı.
            $value = str_replace(['|', ';', "\r\n", "\n", "\r"], [' ', ' ', ' ', ' ', ' '], trim((string)$value));
            $rowValues[] = $value;
        }
        return implode('|;|', $rowValues);
    }

    public static function getBtkAlanSiralamasi($raporTuru = 'REHBER', $yetkiTuruGrup = null) {
        // Bu fonksiyon, 314_KK_Abone_Desen.pdf Bölüm 3.A'daki 85 alanı doğru sırada içeren bir dizi döndürmelidir.
        // Alan adları BTK dokümanındaki gibi BÜYÜK HARF olmalıdır.
        $ortakAlanlar = [
            'OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU', 'HAT_DURUM_KODU_ACIKLAMA',
            'MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA', 'MUSTERI_HAREKET_ZAMANI',
            'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC', 'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI',
            'ABONE_TC_KIMLIK_NO', 'ABONE_PASAPORT_NO', 'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI', 'ABONE_MERSIS_NUMARASI',
            'ABONE_CINSIYET', 'ABONE_UYRUK', 'ABONE_BABA_ADI', 'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI',
            'ABONE_DOGUM_YERI', 'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE',
            'ABONE_KIMLIK_CILT_NO', 'ABONE_KIMLIK_KUTUK_NO', 'ABONE_KIMLIK_SAYFA_NO',
            'ABONE_KIMLIK_IL', 'ABONE_KIMLIK_ILCE', 'ABONE_KIMLIK_MAHALLE_KOY', 'ABONE_KIMLIK_TIPI',
            'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER', 'ABONE_KIMLIK_VERILDIGI_TARIH',
            'ABONE_KIMLIK_AIDIYETI',
            'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE',
            'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO', 'ABONE_ADRES_TESIS_IC_KAPI_NO',
            'ABONE_ADRES_TESIS_POSTA_KODU', 'ABONE_ADRES_TESIS_ADRES_KODU',
            'ABONE_ADRES_IRTIBAT_TEL_NO_1', 'ABONE_ADRES_IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL',
            'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE', 'ABONE_ADRES_YERLESIM_MAHALLE',
            'ABONE_ADRES_YERLESIM_CADDE', 'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO',
            'ABONE_ADRES_YERLESIM_NO',
            'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO',
            'KURUM_YETKILI_TELEFON', 'KURUM_ADRES',
            'AKTIVASYON_BAYI_ADI', 'AKTIVASYON_BAYI_ADRESI', 'AKTIVASYON_KULLANICI',
            'GUNCELLEYEN_BAYI_ADI', 'GUNCELLEYEN_BAYI_ADRESI', 'GUNCELLEYEN_KULLANICI',
            'STATIK_IP' // alan70
        ];
        $ozelAlanlar = [];
        switch (strtoupper($yetkiTuruGrup ?? '')) {
            case 'ISS': $ozelAlanlar = ['ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI']; break;
            case 'STH': $ozelAlanlar = ['SABIT_ONCEKI_HAT_NUMARASI', 'SABIT_DONDURULMA_TARIHI', 'SABIT_KISITLAMA_TARIHI', 'SABIT_YURTDISI_AKTIF', 'SABIT_SESLI_ARAMA_AKTIF', 'SABIT_REHBER_AKTIF', 'SABIT_CLIR_OZELLIGI_AKTIF', 'SABIT_DATA_AKTIF', 'SABIT_SEHIRLERARASI_AKTIF', 'SABIT_SANTRAL_BINASI', 'SABIT_SANTRAL_TIPI', 'SABIT_SEBEKE_HIZMET_NUMARASI', 'SABIT_PILOT_NUMARA', 'SABIT_DDI_HIZMET_NUMARASI', 'SABIT_GORUNEN_NUMARA', 'SABIT_REFERANS_NO', 'SABIT_EV_ISYERI', 'SABIT_ABONE_ID', 'SABIT_SERVIS_NUMARASI', 'SABIT_DAHILI_NO', 'SABIT_ALFANUMERIK_BASLIK']; break;
            case 'GSM': case 'GMPCS': $ozelAlanlar = ['GSM_ONCEKI_HAT_NUMARASI', 'GSM_DONDURULMA_TARIHI', 'GSM_KISITLAMA_TARIHI', 'GSM_YURTDISI_AKTIF', 'GSM_SESLI_ARAMA_AKTIF', 'GSM_REHBER_AKTIF', 'GSM_CLIR_OZELLIGI_AKTIF', 'GSM_DATA_AKTIF', 'GSM_ESKART_BILGISI', 'GSM_ICCI', 'GSM_IMSI', 'GSM_DUAL_GSM_NO', 'GSM_FAX_NO', 'GSM_VPN_KISAKOD_ARAMA_AKTIF', 'GSM_SERVIS_NUMARASI', 'GSM_BILGI_1', 'GSM_BILGI_2', 'GSM_BILGI_3', 'GSM_ALFANUMERIK_BASLIK']; break;
            case 'UYDU': $ozelAlanlar = ['UYDU_ONCEKI_HAT_NUMARASI', 'UYDU_DONDURULMA_TARIHI', 'UYDU_KISITLAMA_TARIHI', 'UYDU_YURTDISI_AKTIF', 'UYDU_SESLI_ARAMA_AKTIF', 'UYDU_REHBER_AKTIF', 'UYDU_CLIR_OZELLIGI_AKTIF', 'UYDU_DATA_AKTIF', 'UYDU_UYDU_ADI', 'UYDU_TERMINAL_ID', 'UYDU_ENLEM_BILGISI', 'UYDU_BOYLAM_BILGISI', 'UYDU_HIZ_PROFILI', 'UYDU_POP_BILGISI', 'UYDU_REMOTE_BILGISI', 'UYDU_ANAUYDU_FIRMA', 'UYDU_UYDUTELEFON_NO', 'UYDU_TELEFON_SERINO', 'UYDU_TELEFON_IMEINO', 'UYDU_TELEFON_MARKA', 'UYDU_TELEFON_MODEL', 'UYDU_TELEFON_SIMKARTNO', 'UYDU_TELEFONU_INTERNET_KULLANIMI', 'UYDU_ALFANUMERIK_BASLIK']; break;
            case 'AIH': $ozelAlanlar = ['AIH_HIZ_PROFIL', 'AIH_HIZMET_SAGLAYICI', 'AIH_POP_BILGI', 'AIH_ULKE_A', 'AIH_SINIR_GECIS_NOKTASI_A', 'AIH_ABONE_ADRES_TESIS_ULKE_B', 'AIH_ABONE_ADRES_TESIS_IL_B', 'AIH_ABONE_ADRES_TESIS_ILCE_B', 'AIH_ABONE_ADRES_TESIS_MAHALLE_B', 'AIH_ABONE_ADRES_TESIS_CADDE_B', 'AIH_ABONE_ADRES_TESIS_DIS_KAPI_NO_B', 'AIH_ABONE_ADRES_TESIS_IC_KAPI_NO_B', 'AIH_SINIR_GECIS_NOKTASI_B', 'AIH_DEVRE_ADLANDIRMASI', 'AIH_DEVRE_GUZERGAH']; break;
        }
        return array_merge($ortakAlanlar, $ozelAlanlar);
    }

    public static function compressToGz($sourceFilePath, $destinationFilePath = null) {
        if (!file_exists($sourceFilePath) || !is_readable($sourceFilePath)) { self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Kaynak dosya bulunamadı veya okunamıyor: $sourceFilePath"); return false; }
        if (is_null($destinationFilePath)) { $destinationFilePath = $sourceFilePath . '.gz';}
        try {
            $gzFile = gzopen($destinationFilePath, 'w9'); // 'w9' en yüksek sıkıştırma
            if ($gzFile === false) { self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Hedef GZ dosyası açılamadı/oluşturulamadı: $destinationFilePath"); return false; }
            
            $sourceHandle = fopen($sourceFilePath, 'rb');
            if ($sourceHandle === false) { gzclose($gzFile); self::logAction('GZ Sıkıştırma Hatası', 'HATA', "Kaynak dosya okumak için açılamadı: $sourceFilePath"); return false; }
            
            while (!feof($sourceHandle)) {
                gzwrite($gzFile, fread($sourceHandle, 16384)); // 16KB bloklar halinde oku/yaz
            }
            
            fclose($sourceHandle);
            gzclose($gzFile);
            
            if(file_exists($destinationFilePath) && filesize($destinationFilePath) > 0) { return $destinationFilePath; }
            self::logAction('GZ Sıkıştırma Hatası', 'HATA', "GZ dosyası oluşturuldu ancak boş veya hatalı: $destinationFilePath"); return false;
        } catch (Exception $e) {
            self::logAction('GZ Sıkıştırma Genel Hata', 'HATA', $e->getMessage()); return false;
        }
    }

// --- BtkHelper.php Bölüm 4/5 Sonu --- 
// --- Bir sonraki bölüm "WHMCS Veri Entegrasyonu (HOOK Handler Fonksiyonları)" ile devam edecek ---
// ... BtkHelper.php Bölüm 4/5 içeriğinin sonu ...

    // --- WHMCS Veri Entegrasyonu (HOOK Handler Fonksiyonları) ---
    // Bu fonksiyonların içleri, ilgili WHMCS olayı tetiklendiğinde BTK tablolarını
    // (mod_btk_abone_rehber, mod_btk_abone_hareket_live) doğru şekilde güncellemek
    // ve gerekli hareket kayıtlarını oluşturmak için detaylı olarak implemente edilmelidir.
    // Her handle fonksiyonu, ilgili verileri çekip, bir BTK veri dizisi oluşturup,
    // bunu ya yeni bir rehber kaydı olarak ya da mevcut bir rehber kaydını güncelleyerek işlemeli
    // ve ardından uygun bir hareket kaydı oluşturmalıdır.

    /**
     * Yeni müşteri eklendiğinde çağrılır (ClientAdd hook).
     * $vars: userid, firstname, lastname, companyname, email, adres bilgileri, vs.
     */
    public static function handleClientAdd($vars) {
        $clientId = $vars['userid'] ?? null;
        $adminId = self::getCurrentAdminId() ?? ($vars['adminid'] ?? null);
        self::logAction('Helper: handleClientAdd (İşleniyor)', 'DEBUG', "Müşteri ID: $clientId için BTK ön hazırlık.", $adminId);
        // Bu aşamada genellikle sadece müşteri bilgileri vardır.
        // BTK raporlaması hizmet bazlı olduğu için, bu hook'ta doğrudan bir rehber kaydı oluşturmak
        // yerine, müşterinin BTK için gerekli temel bilgilerinin (örn: TCKN, Adres)
        // WHMCS'teki client custom fields'a veya modülün ayrı bir müşteri eşleştirme tablosuna
        // kaydedilmesi düşünülebilir. Asıl rehber kaydı handleServiceCreate'de atılacaktır.
        // Şimdilik sadece loglayalım ve ileride detaylı implementasyon yapalım.
        // Örnek: Müşteri tipi (Bireysel/Kurumsal) burada belirlenebilir.
        // $musteriTipi = empty($vars['companyname']) ? 'G-SAHIS' : 'T-SIRKET'; // Basit bir varsayım
        // self::updateOrCreateClientBtkProfile($clientId, ['musteri_tipi_tahmini' => $musteriTipi]);
    }

    /**
     * Müşteri bilgileri güncellendiğinde çağrılır (ClientEdit hook).
     * $vars: userid, ve güncellenen tüm alanlar.
     */
    public static function handleClientEdit($vars) {
        $clientId = $vars['userid'] ?? null;
        $adminId = self::getCurrentAdminId() ?? ($vars['adminid'] ?? null);
        self::logAction('Helper: handleClientEdit (İşleniyor)', 'DEBUG', "Müşteri ID: $clientId güncellendi.", $adminId, ['değişen_alan_sayısı' => count($vars)-1]);
        // TODO:
        // 1. $vars içinden hangi alanların değiştiğini tespit et (eski ve yeni değerleri karşılaştırarak).
        // 2. Bu müşteriye ait TÜM aktif/pasif/iptal hizmetlerin mod_btk_abone_rehber kayıtlarını bul.
        // 3. Değişen müşteri bilgilerini (örn: adres, soyad, unvan, müşteri tipi) tüm bu rehber kayıtlarına yansıt.
        //    (Rehber tablosundaki ilgili alanları güncelle).
        // 4. Her bir etkilenen ve AKTİF/ASKIDA olan hizmet için mod_btk_abone_hareket_live tablosuna 
        //    'MUSTERI_BILGI_DEGISIKLIGI' (kod: 11) hareketi oluştur.
        //    - Hareketin `musteri_hareket_zamani` güncel zaman olmalı.
        //    - Hareketin `hareket_abone_verisi_json` alanı, güncellemeden SONRAKİ TÜM rehber verisini içermeli.
        // self::generateHareketForClientUpdate($clientId, $degisenAlanlarDetayi);
    }
    
    public static function handleClientClose($clientId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleClientClose (İşleniyor)', 'UYARI', "Müşteri ID: $clientId hesabı kapatıldı.", $adminId);
        // TODO: Müşteriye ait TÜM "Aktif" veya "Askıda" hizmetleri bul.
        // Her bir hizmet için handleServiceTerminate benzeri bir işlem yap (ABONE_BITIS set et, HAT_IPTAL hareketi oluştur).
        // Hareket açıklaması: "Müşteri Hesabı Kapatıldı" olabilir.
    }

    public static function handleClientDelete($clientId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleClientDelete (İşleniyor)', 'KRİTİK UYARI', "Müşteri ID: $clientId siliniyor!", $adminId);
        // TODO: handleClientClose ile aynı işlemler. BTK Rehber kayıtları SİLİNMEZ, sadece iptal edilir.
    }
    
    public static function handleMergeClient($sourceClientId, $targetClientId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleMergeClient (İşleniyor)', 'UYARI', "Müşteri $sourceClientId -> $targetClientId birleştiriliyor.", $adminId);
        // TODO:
        // 1. `mod_btk_abone_rehber` tablosunda `whmcs_client_id = $sourceClientId` olan tüm kayıtların `whmcs_client_id`'sini `$targetClientId` yap.
        // 2. `mod_btk_abone_hareket_live` ve `_archive` tablolarında, bu rehber kayıtlarıyla ilişkili hareketlerin
        //    (eğer müşteri ID'si ayrıca tutuluyorsa) güncellenmesi veya rehber_kayit_id üzerinden zaten doğru olması.
        // 3. Her bir etkilenen hizmet için "MUSTERI_BILGI_DEGISIKLIGI" (veya özel bir "MUSTERI_BIRLESTIRME") hareketi oluştur.
    }
    
    // --- Hizmet (Service) Hook Handler'ları ---
    public static function handleServiceCreate($params) {
        $serviceId = $params['serviceid'] ?? null;
        $clientId = $params['userid'] ?? null;
        $productId = $params['pid'] ?? ($params['productid'] ?? null); // productid WHMCS 7, pid WHMCS 8+
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceCreate (İşleniyor)', 'INFO', "Hizmet ID: $serviceId, Müşteri ID: $clientId, Ürün ID: $productId", $adminId);
        // TODO: DETAYLI İMPLEMENTASYON GEREKLİ
        // 1. WHMCS'ten müşteri ve hizmet detaylarını çek (getWhmcsClientDetails, getWhmcsServiceDetails).
        // 2. Ürün grubuna göre BTK Yetki Türü Grubu'nu (örn: ISS) ve EK-3 Hizmet Tipi'ni (örn: ADSL) bul (getProductGroupMappingsArray, getYetkiGrupForService).
        // 3. Eğer eşleştirme yoksa veya geçersizse logla ve çık.
        // 4. Formdan (PreAdminServiceEdit'ten gelmişse) veya varsayılanlardan BTK'ya özel hizmet bilgilerini (tesis adresi, POP vb.) al.
        // 5. mod_btk_abone_rehber tablosuna YENİ KAYIT AT:
        //    - Tüm ortak alanlar (OPERATOR_KOD, MUSTERI_ID, HAT_NO vb.)
        //    - HAT_DURUM = 'A', HAT_DURUM_KODU = '1' (AKTIF)
        //    - ABONE_BASLANGIC = gmdate('YmdHis')
        //    - HIZMET_TIPI = bulunan EK-3 Hizmet Tipi
        //    - MUSTERI_TIPI (müşterinin şirket olup olmamasına göre)
        //    - İlgili yetki türüne özel alanlar (ISS_*, STH_* vb.)
        // 6. mod_btk_abone_hareket_live tablosuna 'YENI_ABONELIK_KAYDI' (kod: 1) hareketi oluştur.
        //    Bu hareket, o anki TÜM rehber bilgilerini `hareket_abone_verisi_json` alanına kaydetmeli.
    }

    public static function handleServiceEdit($vars) {
        $serviceId = $vars['serviceid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceEdit (İşleniyor)', 'DEBUG', "Hizmet ID: $serviceId standart alanları güncellendi.", $adminId);
        // TODO:
        // 1. Değişen standart WHMCS alanlarını tespit et (örn: domain, username, dedicatedip, packageid).
        // 2. Eğer bu değişiklikler BTK raporlamasını etkiliyorsa:
        //    a. mod_btk_abone_rehber'deki ilgili kaydı güncelle.
        //    b. mod_btk_abone_hareket_live'a uygun bir hareket koduyla (örn: 'TARIFE_DEGISIKLIGI', 'IP_DEGISIKLIGI') kayıt at.
        //       `hareket_abone_verisi_json` güncel rehber verisini içermeli.
    }
    
    public static function handlePreServiceEdit($serviceId, $postData) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handlePreServiceEdit (İşleniyor)', 'DEBUG', "Hizmet ID: $serviceId için BTK özel alanları kaydediliyor.", $adminId);
        // TODO:
        // 1. $postData içinden 'btk_' prefix'li alanları al (tesis adresi, koordinatlar, iss_pop_noktasi_id, statik_ip, abone_tarife vb.).
        // 2. Bu verileri mod_btk_abone_rehber tablosundaki ilgili $serviceId'ye ait kayda yaz/güncelle.
        //    - iss_pop_noktasi_id değişikliğini mod_btk_service_pop_mapping tablosuna da işle.
        // 3. Eğer önemli bir BTK alanı değiştiyse (örn: tesis adresi, statik IP, POP),
        //    mod_btk_abone_hareket_live'a uygun bir hareket koduyla ('ADRES_DEGISIKLIGI', 'IP_DEGISIKLIGI' vb.) kayıt at.
        //    `hareket_abone_verisi_json` güncel rehber verisini içermeli.
    }

    public static function handleServiceSuspend($params) { /* ... (Rehberde Hat Durum 'D', Kod '15'/'16', Hareket 'HAT_DURUM_DEGISIKLIGI') ... */ }
    public static function handleServiceUnsuspend($params) { /* ... (Rehberde Hat Durum 'A', Kod '1', Hareket 'HAT_DURUM_DEGISIKLIGI') ... */ }
    public static function handleServiceTerminate($params) { /* ... (Rehberde Hat Durum 'I', Kod '5' vb., Bitiş Tarihi, Hareket 'HAT_IPTAL') ... */ }
    public static function handleServiceDelete($serviceId) { /* ... (handleServiceTerminate ile aynı, BTK kaydı SİLİNMEZ) ... */ }
    public static function handleServicePackageChange($vars) { /* ... (Rehberde Tarife güncelle, Hareket 'TARIFE_DEGISIKLIGI') ... */ }
    
    // --- Fatura Hook Handler'ları ---
    public static function handleInvoicePaid($invoiceId) { /* ... (Hizmet aktivasyonunu kontrol et, gerekirse hareket) ... */ }
    public static function handleInvoiceCancelled($invoiceId) { /* ... (Hizmet durumunu etkiliyorsa hareket) ... */ }
    
    // --- Personel (Admin) Senkronizasyon Hook Handler'ları ---
    public static function syncAdminToPersonel($adminId, $adminVars = []) {
        $logAdminId = self::getCurrentAdminId();
        self::logAction('Helper: syncAdminToPersonel (İşleniyor)', 'DEBUG', "WHMCS Admin ID: $adminId senkronizasyonu.", $logAdminId);
        // TODO:
        // 1. tbladmins'ten $adminId ile admin bilgilerini çek.
        // 2. mod_btk_personel'de whmcs_admin_id ile eşleşen kaydı bul.
        // 3. Varsa ad, soyad, email güncelle. Yoksa temel bilgilerle yeni personel kaydı oluştur (btk_listesine_eklensin=0).
        //    Bu fonksiyon BtkHelper::savePersonel'i çağırabilir.
    }
    public static function handleAdminDelete($deletedAdminId) {
        $logAdminId = self::getCurrentAdminId();
        self::logAction('Helper: handleAdminDelete (İşleniyor)', 'UYARI', "WHMCS Admin ID: $deletedAdminId silindi.", $logAdminId);
        // TODO: mod_btk_personel'de whmcs_admin_id = $deletedAdminId olan kaydın whmcs_admin_id'sini NULL yap.
    }
    
    // --- Müşteri Paneli Veri Çekme ---
    public static function getBtkClientInfoForClientArea($clientId) {
        self::logAction('TODO: getBtkClientInfoForClientArea', 'DEBUG', ['client_id' => $clientId]);
        // TODO: mod_btk_abone_rehber'den (veya ayrı bir müşteri BTK profil tablosundan)
        //       müşteri için gösterilecek (ve maskelenecek) verileri çek.
        //       İl/İlçe/Mahalle ID'lerini isme çevir. Müşteri Tipi açıklamasını ekle.
        return [ /* 'abone_tc_kimlik_no_masked' => ..., 'abone_adi' => ..., 'yerlesim_il_adi_placeholder' => ... */ ];
    }
    public static function getBtkServiceInfoForClientArea($serviceId) {
        self::logAction('TODO: getBtkServiceInfoForClientArea', 'DEBUG', ['service_id' => $serviceId]);
        // TODO: mod_btk_abone_rehber'den hizmete özel BTK verilerini çek.
        //       Tesis adresi, statik IP, ISS POP bilgisi (Sunucu.SSID formatında).
        //       Hizmetin EK-3 Hizmet Tipi açıklamasını çek.
        return [ /* 'tesis_adresi_yerlesim_ile_ayni' => ..., 'statik_ip' => ..., 'iss_pop_bilgisi_formatted' => ... */ ];
    }

    // --- Periyodik Kontroller (DailyCronJob için) ---
    public static function performDailyBtkChecks() {
        self::logAction('Günlük BTK Kontrolleri Başladı (TODO)', 'INFO');
        // 1. Vefat Durumu Sorgulama (NVI ile)
        // 2. Veri Tutarlılığı Kontrolleri
        // 3. Uzun süredir hareket görmeyen pasif hatların kontrolü vb.
        self::logAction('Günlük BTK Kontrolleri Tamamlandı (TODO)', 'INFO');
    }
    
    // --- WHMCS Veri Çekme Yardımcıları ---
    public static function getWhmcsClientDetails($clientId) {
        try {
            $client = Capsule::table('tblclients')->find((int)$clientId);
            return $client ? (array)$client : null;
        } catch (Exception $e) {
            self::logAction('WHMCS Müşteri Detayı Okuma Hatası', 'HATA', "Client ID: $clientId, Hata: " . $e->getMessage());
            return null;
        }
    }
    public static function getWhmcsServiceDetails($serviceId) {
        try {
            $service = Capsule::table('tblhosting as h')
                ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
                ->join('tblproductgroups as g', 'p.gid', '=', 'g.id')
                ->where('h.id', (int)$serviceId)
                ->select('h.*', 'p.name as product_name', 'p.gid as group_id', 'g.name as group_name')
                ->first();
            return $service ? (array)$service : null;
        } catch (Exception $e) {
            self::logAction('WHMCS Hizmet Detayı Okuma Hatası', 'HATA', "Service ID: $serviceId, Hata: " . $e->getMessage());
            return null;
        }
    }

    // --- Yardımcı Diğer Fonksiyonlar ---
    public static function getCurrentAdminId() { return isset($_SESSION['adminid']) ? (int)$_SESSION['adminid'] : null; }
    
    public static function sendEmailNotification($to, $subject, $messageBody, $attachments = []) {
        $adminUserId = self::getCurrentAdminId();
        if (!$adminUserId) { 
            $firstAdmin = Capsule::table('tbladmins')->where('disabled',0)->orderBy('id', 'asc')->select('id')->first();
            if ($firstAdmin) $adminUserId = $firstAdmin->id;
            else { self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID bulunamadı (aktif admin yok).'); return false;}
        }
        if (empty($adminUserId)) { // Hala boşsa (çok nadir bir durum)
             self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID hala bulunamadı.'); return false;
        }

        $command = 'SendEmail';
        $postData = [
            'customtype' => 'general',
            'customsubject' => $subject,
            'custommessage' => nl2br(htmlspecialchars($messageBody)),
            'to' => $to,
        ];
        
        try {
            $results = localAPI($command, $postData, $adminUserId); // localAPI çağrısı
            if (isset($results['result']) && $results['result'] == 'success') {
                self::logAction('Eposta Gönderildi', 'BİLGİ', "Kime: $to, Konu: $subject");
                return true;
            } else {
                self::logAction('Eposta Gönderme Hatası (localAPI)', 'HATA', ['to' => $to, 'subject' => $subject, 'response' => $results]);
                return false;
            }
        } catch (Exception $e) {
            self::logAction('Eposta Gönderme Kapsamlı Hata', 'HATA', $e->getMessage(), null, ['to' => $to, 'subject' => $subject]);
            return false;
        }
    }

} // Sınıf Sonu
?>