<?php
/**
 * BTK Raporlama Modülü için Kapsamlı Yardımcı Fonksiyonlar Sınıfı
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
use WHMCS\Utility\Encryption; // Encryption sınıfı için
use Cron\CronExpression;     // Cron zamanlaması için

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
                } elseif (empty($value)) { // Eğer gelen değer boşsa, ayarı boş olarak kaydet
                    $valueToStore = '';
                } else { // Gelen değer '********' ise, mevcut değeri değiştirme (placeholder)
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
                try { $dateFrom = new DateTime($filters['date_from']); $query->where('log_zamani', '>=', $dateFrom->format('Y-m-d H:i:s')); } catch (Exception $ex) {}
            }
            if (!empty($filters['date_to'])) {
                 try { $dateTo = new DateTime($filters['date_to']); $query->where('log_zamani', '<=', $dateTo->format('Y-m-d H:i:s')); } catch (Exception $ex) {}
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
            return Capsule::table('mod_btk_yetki_turleri_referans')->orderBy('yetki_adi')->get()->all();
        } catch (Exception $e) { self::logAction('Yetki Türü Referans Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }

    public static function getSeciliYetkiTurleri() {
        $secili = [];
        try {
            $results = Capsule::table('mod_btk_secili_yetki_turleri')->where('aktif', 1)->get();
            foreach ($results as $row) {
                $secili[$row->yetki_kodu] = 1;
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

            if ($returnAs === 'object_list') return $results;
            if ($returnAs === 'array_of_arrays') return array_map(function($item){ return (array)$item; }, $results);

            foreach ($results as $row) {
                if ($returnAs === 'array_grup') {
                    $aktifYetkiler[$row->grup][] = (array)$row;
                } elseif ($returnAs === 'array_grup_names_only') {
                    if (!in_array($row->grup, $aktifYetkiler)) {
                        $aktifYetkiler[] = $row->grup;
                    }
                } else { 
                     $aktifYetkiler[] = (array)$row;
                }
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
                    // Checkbox'lar 'on' olarak gelir veya sadece anahtarın varlığı yeterlidir
                    // name="yetkiler[KOD]" value="on" şeklinde .tpl'de ayarlandıysa $val == 'on' kontrolü yapılır.
                    // Eğer sadece name="yetkiler[KOD]" ise ve işaretliyse, $kod $secilenYetkilerInput içinde olur.
                    // Bizim .tpl yapımız name="yetkiler[{$yt.kod|escape:'html'}]" value="on" şeklinde.
                    if($val === 'on' || $val === 1 || $val === true ){ 
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
            return $mapping ? $mapping->yetki_kodu : null;
        } catch (Exception $e) { self::logAction('Ürün Grubu Yetki Eşleşmesi Okuma Hatası', 'HATA', "GID: {$gid}, Hata: ".$e->getMessage()); return null; }
    }

    public static function getProductGroupMappingsArray() {
        $mappings = [];
        try {
            $results = Capsule::table('mod_btk_product_group_mappings')->get();
            foreach($results as $row) {
                $mappings[(int)$row->gid] = $row->yetki_kodu;
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
                    foreach ($mappingsData as $gid => $yetkiKodu) {
                        if (!empty($gid) && is_numeric($gid) && !empty(trim($yetkiKodu))) {
                            $insertData[] = [
                                'gid' => (int)$gid,
                                'yetki_kodu' => trim($yetkiKodu)
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
            if (!$service || !$service->packageid) {
                self::logAction('Yetki Grubu Bulma (Hizmet)', 'UYARI', "Hizmet veya paket bulunamadı. Service ID: {$serviceId}");
                return null;
            }
            $product = Capsule::table('tblproducts')->find($service->packageid);
            if (!$product || !$product->gid) {
                self::logAction('Yetki Grubu Bulma (Ürün)', 'UYARI', "Ürün veya grup ID bulunamadı. Package ID: {$service->packageid}");
                return null;
            }

            $mapping = Capsule::table('mod_btk_product_group_mappings as pgmap')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'pgmap.yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('pgmap.gid', $product->gid)
                ->select('ytr.grup')
                ->first();
            
            if ($mapping && !empty($mapping->grup)) {
                return $mapping->grup;
            }
            self::logAction('Yetki Grubu Bulma (Eşleşme)', 'UYARI', "Hizmet (ID:{$serviceId}, GID:{$product->gid}) için BTK Yetki Grubu eşleşmesi bulunamadı.");
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
        if (!class_exists('Cron\CronExpression')) {
            self::logAction('Cron Zamanlama Hatası', 'UYARI', 'CronExpression kütüphanesi bulunamadı (vendor/autoload.php).');
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
            // Cron ifadesi UTC'ye göre mi yorumlanmalı, yoksa sunucu saatine göre mi?
            // Genellikle cron ifadeleri sunucu saatine göre yorumlanır.
            // getNextRunDate varsayılan olarak 'now' ve sunucu saat dilimini kullanır.
            return $cron->getNextRunDate()->format('Y-m-d H:i:s'); // Sunucu lokal zamanına göre
        } catch (InvalidArgumentException $iae) {
            self::logAction('Geçersiz Cron İfadesi (InvalidArgument)', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $iae->getMessage());
            return $GLOBALS['_LANG']['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
        }
         catch (Exception $e) { self::logAction('Sonraki Cron Çalışma Zamanı Hesaplama Hatası', 'HATA', "Ayar: $cronScheduleSettingKey, Hata: " . $e->getMessage()); return $GLOBALS['_LANG']['errorFetchingNextRun'] ?? 'Hesaplanamadı'; }
    }
// ... BtkHelper.php Bölüm 1/4 içeriğinin sonu ...

    // --- FTP İşlemleri ---
    /**
     * Verilen detaylarla FTP bağlantısını test eder.
     * @param string $type 'main' veya 'backup' (Ayarları okumak için)
     * @return array ['status' => 'success'/'error', 'message' => 'Bağlantı mesajı']
     */
    public static function checkFtpConnection($type = 'main') {
        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass'); // Deşifrelenmiş gelir
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', '0'); // Ayardan string '0'/'1' gelebilir

        if (empty($host)) {
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP sunucu adresi ayarlanmamış.'];
        }
        // Kullanıcı adı veya şifre boş olabilir, bazı sunucular anonim girişe izin verebilir.
        // Ancak BTK için bu geçerli olmayacaktır, bu yüzden boşsa bile deneyecek.
        
        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);

        if (!$connect_function) {
            $errMsg = ucfirst($type) . ' FTP fonksiyonları (ftp_connect/ftp_ssl_connect) sunucunuzda etkin değil.';
            self::logAction(ucfirst($type) . ' FTP Bağlantı Hatası', 'CRITICAL', $errMsg);
            return ['status' => 'error', 'message' => $errMsg];
        }
        
        $old_error_reporting = error_reporting(0); // PHP FTP fonksiyonları warning verebilir, bastır.
        $conn_id = @$connect_function($host, $port, 15); // 15 saniye timeout
        error_reporting($old_error_reporting);

        if ($conn_id) {
            $login_user = !empty($user) ? $user : 'anonymous';
            $login_pass = !empty($pass) ? $pass : ''; // Boş şifre denemesi için

            $login_result = @ftp_login($conn_id, $login_user, $login_pass);
            if ($login_result) {
                @ftp_pasv($conn_id, true); // Pasif modu etkinleştir (genellikle gereklidir)
                $message = ucfirst($type) . ' FTP sunucusuna başarıyla bağlanıldı.';
                // İsteğe bağlı: Test amaçlı bir dosya listeleme veya dizin değiştirme
                // $current_dir = @ftp_pwd($conn_id);
                // if ($current_dir !== false) $message .= " Mevcut dizin: " . $current_dir;
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
     * Ayarlardan OKUNMAYAN, doğrudan verilen detaylarla FTP bağlantısını test eder.
     * bt_action_test_ftp tarafından kullanılır.
     */
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
            $login_pass_to_test = trim($pass); // Şifre boş olabilir
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
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', '0');
        
        $raporTuruNormalized = strtoupper($raporTuru);
        $pathKeyPart = '';
        if (strpos($raporTuruNormalized, 'REHBER') !== false) $pathKeyPart = 'rehber';
        elseif (strpos($raporTuruNormalized, 'HAREKET') !== false) $pathKeyPart = 'hareket';
        elseif (strpos($raporTuruNormalized, 'PERSONEL') !== false) $pathKeyPart = 'personel';
        else { self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', "Bilinmeyen rapor türü ($raporTuru) için FTP yolu belirlenemedi."); return ['status' => 'error', 'message' => 'Bilinmeyen rapor türü için FTP yolu belirlenemedi.'];}

        $basePathSettingKey = strtolower($type) . '_ftp_' . $pathKeyPart . '_path';
        $basePath = self::get_btk_setting($basePathSettingKey, '/');
        $remoteDir = trim($basePath, '/');
        $remoteFileFullPath = ($remoteDir === '' ? '' : $remoteDir . '/') . $remoteFileName;

        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);
        if (!$connect_function) { /* loglama checkFtpConnection'da yapıldı */ return ['status' => 'error', 'message' => ucfirst($type) . ' FTP fonksiyonları sunucunuzda etkin değil.']; }
        
        $old_error_reporting = error_reporting(0);
        $conn_id = @$connect_function($host, $port, 30);
        error_reporting($old_error_reporting);

        if ($conn_id) {
            $login_user_ftp = !empty($user) ? $user : 'anonymous';
            $login_pass_ftp = $pass; // Şifre boş olabilir

            if (@ftp_login($conn_id, $login_user_ftp, $login_pass_ftp)) {
                @ftp_pasv($conn_id, true);
                
                // Uzak dizinleri oluşturma (ftp_mkdir -R gibi çalışmaz, tek tek oluşturulmalı)
                if ($remoteDir !== '' && $remoteDir !== '.') {
                    $parts = explode('/', $remoteDir);
                    $currentBuildPath = '';
                    foreach ($parts as $part) {
                        if (empty($part)) continue;
                        $currentBuildPath .= (empty($currentBuildPath) ? '' : '/') . $part;
                        // Dizinin varlığını kontrol et, yoksa oluştur
                        if (!@ftp_chdir($conn_id, $currentBuildPath)) { // Dizine girilemiyorsa
                            if (!@ftp_mkdir($conn_id, $currentBuildPath)) { // Oluşturmayı dene
                                $message = "$type FTP: Uzak dizin ($currentBuildPath) oluşturulamadı veya erişilemedi.";
                                @ftp_close($conn_id);
                                self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', $message);
                                return ['status' => 'error', 'message' => $message];
                            }
                            // Oluşturduktan sonra izinleri ayarlamak gerekebilir (BTK için genellikle gerekmez)
                            // @ftp_chmod($conn_id, 0755, $currentBuildPath); 
                        }
                         // Her adımdan sonra ana dizine dönmek yerine, ftp_chdir ile kalmak daha iyi olabilir,
                         // ancak sunucu davranışları farklılık gösterebilir. En güvenlisi her seferinde tam yola gitmek.
                         // Bu yüzden ftp_put'a tam yol veriyoruz.
                    }
                    // Son olarak asıl dizine girmeyi dene (ftp_put bazen göreli yola ihtiyaç duyar)
                     if (!@ftp_chdir($conn_id, $remoteDir) && strpos($remoteDir, '/') !== false) {
                         $message = "$type FTP: Hedef dizine ($remoteDir) girilemedi.";
                         @ftp_close($conn_id);
                         self::logAction(ucfirst($type) . " FTP Yükleme ($raporTuru)", 'HATA', $message);
                         return ['status' => 'error', 'message' => $message];
                     }
                }
                // Dizine girildiyse artık sadece dosya adıyla yükleme yapılabilir.
                // Ya da her zaman tam yolu kullanmak daha güvenlidir.
                // $uploadPath = ($remoteDir !== '' && $remoteDir !== '.') ? $remoteFileName : $remoteFileFullPath;

                if (@ftp_put($conn_id, $remoteFileFullPath, $localFilePath, FTP_BINARY)) {
                    $message = "$remoteFileName dosyası başarıyla $type FTP sunucusuna ($remoteFileFullPath) yüklendi.";
                    @ftp_close($conn_id);
                    return ['status' => 'success', 'message' => $message, 'remote_path' => $remoteFileFullPath];
                } else {
                    $ftp_error = error_get_last();
                    $message = "$remoteFileName dosyası $type FTP sunucusuna ($remoteFileFullPath) yüklenirken hata." . ($ftp_error ? ' (FTP Hatası: ' . $ftp_error['message'] . ')' : '');
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
            if (!empty($filters['date_from'])) { try { $df = new DateTime($filters['date_from']); $query->where('gonderim_zamani', '>=', $df->format('Y-m-d H:i:s')); } catch(Exception $ex){} }
            if (!empty($filters['date_to'])) { try { $dt = new DateTime($filters['date_to']); $query->where('gonderim_zamani', '<=', $dt->format('Y-m-d H:i:s')); } catch(Exception $ex){} }

            $total = $query->count();
            $logs = $query->orderBy($orderBy, $sortOrder)->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($log){ return (array)$log; }, $logs), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('FTP Log Okuma Hatası', 'Hata', $e->getMessage()); return ['data' => [], 'total_count' => 0]; }
    }

    // --- Adres Verileri İçin Yardımcı Fonksiyonlar ---
    public static function getIller() {
        try {
            $iller = Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get(['id', 'il_adi'])->all();
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
// ... BtkHelper.php Bölüm 2/4 içeriğinin sonu ...

    // --- ISS POP Noktaları İçin Yardımcı Fonksiyonlar ---
    public static function searchPopSSIDs($term = '', $filter_by = null, $filter_value = null, $limit = 25) {
        if (empty($term) && (empty($filter_by) || is_null($filter_value) || $filter_value === '')) return []; // Filtre değeri de olmalı
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari')->where('aktif_pasif_durum', 1);
            if (!empty($filter_by) && !is_null($filter_value) && $filter_value !== '' && is_numeric($filter_value)) {
                if (in_array($filter_by, ['il_id', 'ilce_id', 'mahalle_id'])) {
                    $query->where($filter_by, (int)$filter_value);
                }
            }
            if (!empty($term)) {
                $query->where(function ($q) use ($term) {
                    $q->where('yayin_yapilan_ssid', 'LIKE', '%' . $term . '%')
                      ->orWhere('pop_adi', 'LIKE', '%' . $term . '%');
                });
            }
            $results = $query->orderBy('pop_adi')->orderBy('yayin_yapilan_ssid')->take($limit)->select('id', 'yayin_yapilan_ssid', 'pop_adi')->get()->all();
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
            $pops = $query->select('pop.*', 'il.il_adi', 'ilce.ilce_adi', 'mah.mahalle_adi')
                          ->orderByRaw(Capsule::raw("`$orderBy` $sortOrder")) // Güvenlik için orderByRaw'da değişkenleri doğrudan kullanmaktan kaçının veya whitelist yapın.
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

            // Unique kontrolü: Aynı ilçe ve pop_adı altında aynı SSID olmamalı
            $uniqueCheckQuery = Capsule::table('mod_btk_iss_pop_noktalari')
                                ->where('yayin_yapilan_ssid', $popData['yayin_yapilan_ssid'])
                                ->where('pop_adi', $popData['pop_adi'])
                                ->where('ilce_id', $popData['ilce_id']);
            if ($popIdToUpdate > 0) {
                $uniqueCheckQuery->where('id', '!=', $popIdToUpdate);
            }
            $existingPop = $uniqueCheckQuery->first();
            if($existingPop){
                 $errorMsg = "Aynı ilçe ({$popData['ilce_id']}) ve POP Adı ({$popData['pop_adi']}) altında '{$popData['yayin_yapilan_ssid']}' SSID'si zaten kayıtlı.";
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
            return ['status' => false, 'message' => 'POP Noktası kaydedilirken bir veritabanı hatası oluştu: ' . $e->getMessage()];
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
    // (getPersonelList, getPersonelById, savePersonel, deletePersonel, getDepartmanList, getTeknikPersonelForIlce, getTumIlcelerWithIlAdi)
    // Bu fonksiyonların TAM ve EKSİKSİZ halleri bir önceki "Personel Yönetimi" odaklı gönderimimde mevcuttu.
    // O gönderimdeki implementasyonlar buraya dahil edilecektir.
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
                $query->whereNull('p.isten_ayrilma_tarihi');
            } elseif (isset($filters['s_aktif_calisan']) && $filters['s_aktif_calisan'] === '0') {
                 $query->whereNotNull('p.isten_ayrilma_tarihi');
            }

            $total = $query->count();
            $personeller = $query->select(
                                    'p.id', 'p.whmcs_admin_id', 'p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn',
                                    'p.unvan', 'p.departman_id', 'p.mobil_tel', 'p.sabit_tel', 'p.email',
                                    'p.ev_adresi', 'p.acil_durum_kisi_iletisim', 'p.ise_baslama_tarihi',
                                    'p.isten_ayrilma_tarihi', 'p.is_birakma_nedeni', 'p.gorev_bolgesi_ilce_id',
                                    'p.btk_listesine_eklensin', 'p.tckn_dogrulama_durumu', 'p.tckn_dogrulama_mesaji',
                                    'd.departman_adi', 
                                    'ilce.ilce_adi as gorev_bolgesi_ilce_adi',
                                    'il.il_adi as gorev_bolgesi_il_adi'
                                 )
                                 ->orderByRaw(Capsule::raw("`$orderBy` $sortOrder"))
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
        if (empty(trim($data['ad'] ?? ''))) $validationErrors[] = 'Adı boş bırakılamaz.';
        if (empty(trim($data['soyad'] ?? ''))) $validationErrors[] = 'Soyadı boş bırakılamaz.';
        $tckn = preg_replace('/[^0-9]/', '', $data['tckn'] ?? '');
        if (empty($tckn)) $validationErrors[] = 'T.C. Kimlik No boş bırakılamaz.';
        elseif (strlen($tckn) !== 11) $validationErrors[] = 'T.C. Kimlik Numarası 11 haneli olmalıdır.';
        if (empty(trim($data['email'] ?? ''))) $validationErrors[] = 'E-posta Adresi boş bırakılamaz.';
        elseif (!filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL)) $validationErrors[] = 'Geçersiz e-posta formatı.';
        $dogumYiliForNVI = isset($data['dogum_yili_nvi']) && is_numeric($data['dogum_yili_nvi']) && strlen($data['dogum_yili_nvi']) === 4 ? (int)$data['dogum_yili_nvi'] : null;
        if (empty($dogumYiliForNVI) && !empty($tckn)) $validationErrors[] = 'Doğum Yılı (NVI için) 4 haneli sayı olarak girilmelidir.';
        if (!empty($validationErrors)) { self::logAction('Personel Kaydetme Doğrulama Hatası', 'UYARI', implode(', ', $validationErrors), $logKullaniciId, ['data_keys' => array_keys($data)]); return ['status' => false, 'message' => implode('<br>', $validationErrors)];}
        $tcknDogrulamaSonucu = 'Dogrulanmadi'; $tcknDogrulamaMesaji = 'NVI Doğrulaması yapılamadı.';
        if (class_exists('NviSoapClient') && $dogumYiliForNVI) { $nviClient = new NviSoapClient(); $nviResult = $nviClient->TCKimlikNoDogrula($tckn, trim($data['ad']), trim($data['soyad']), $dogumYiliForNVI); if ($nviResult === true) { $tcknDogrulamaSonucu = 'Dogrulandi'; $tcknDogrulamaMesaji = 'NVI TCKN başarıyla doğrulandı.'; } else { $tcknDogrulamaSonucu = $nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi'; $tcknDogrulamaMesaji = $nviClient->getLastErrorMessageForUser() ?: ($nviClient->getLastError() ?: 'NVI Doğrulama Başarısız.');} self::logAction('NVI TCKN Doğrulama (Personel)', $nviResult ? 'BİLGİ' : 'UYARI', $tcknDogrulamaMesaji, $logKullaniciId, ['tckn' => $tckn, 'ad' => $data['ad']]);}
        elseif(!class_exists('NviSoapClient')) { $tcknDogrulamaMesaji = 'NVI Doğrulama servisi (NviSoapClient) yüklenemedi.'; }
        elseif(!$dogumYiliForNVI && !empty($tckn)) { $tcknDogrulamaMesaji = 'NVI Doğrulaması için Doğum Yılı (NVI için) gereklidir.'; }

        try {
            $personelDataToSave = [ /* ... (Bir önceki tam BtkHelper gönderimimdeki gibi) ... */];
            $personelDataToSave['whmcs_admin_id'] = !empty($data['whmcs_admin_id_modal']) && is_numeric($data['whmcs_admin_id_modal']) && (int)$data['whmcs_admin_id_modal'] > 0 ? (int)$data['whmcs_admin_id_modal'] : null;
            $personelDataToSave['firma_unvani'] = self::get_btk_setting('operator_title', '');
            $personelDataToSave['ad'] = trim($data['ad']); $personelDataToSave['soyad'] = trim($data['soyad']); $personelDataToSave['tckn'] = $tckn;
            $personelDataToSave['unvan'] = isset($data['unvan']) ? trim($data['unvan']) : null;
            $personelDataToSave['departman_id'] = !empty($data['departman_id']) && is_numeric($data['departman_id']) ? (int)$data['departman_id'] : null;
            $personelDataToSave['mobil_tel'] = isset($data['mobil_tel']) ? preg_replace('/[^0-9]/', '', $data['mobil_tel']) : null;
            $personelDataToSave['sabit_tel'] = isset($data['sabit_tel']) ? preg_replace('/[^0-9]/', '', $data['sabit_tel']) : null;
            $personelDataToSave['email'] = trim($data['email']);
            $personelDataToSave['ev_adresi'] = $data['ev_adresi'] ?? null;
            $personelDataToSave['acil_durum_kisi_iletisim'] = $data['acil_durum_kisi_iletisim'] ?? null;
            try { $personelDataToSave['ise_baslama_tarihi'] = !empty($data['ise_baslama_tarihi']) ? (new DateTime($data['ise_baslama_tarihi']))->format('Y-m-d') : null; } catch (Exception $e) { $personelDataToSave['ise_baslama_tarihi'] = null; }
            try { $personelDataToSave['isten_ayrilma_tarihi'] = !empty($data['isten_ayrilma_tarihi']) ? (new DateTime($data['isten_ayrilma_tarihi']))->format('Y-m-d') : null; } catch (Exception $e) { $personelDataToSave['isten_ayrilma_tarihi'] = null; }
            $personelDataToSave['is_birakma_nedeni'] = $data['is_birakma_nedeni'] ?? null;
            $personelDataToSave['gorev_bolgesi_ilce_id'] = !empty($data['gorev_bolgesi_ilce_id']) && is_numeric($data['gorev_bolgesi_ilce_id']) ? (int)$data['gorev_bolgesi_ilce_id'] : null;
            $personelDataToSave['btk_listesine_eklensin'] = (isset($data['btk_listesine_eklensin']) && ($data['btk_listesine_eklensin'] === '1' || $data['btk_listesine_eklensin'] === 'on')) ? 1 : 0;
            $personelDataToSave['tckn_dogrulama_durumu'] = $tcknDogrulamaSonucu; $personelDataToSave['tckn_dogrulama_zamani'] = gmdate('Y-m-d H:i:s'); $personelDataToSave['tckn_dogrulama_mesaji'] = substr($tcknDogrulamaMesaji, 0, 255);
            
            $uniqueCheckQueryTCKN = Capsule::table('mod_btk_personel')->where('tckn', $personelDataToSave['tckn'])->whereNull('isten_ayrilma_tarihi');
            $uniqueCheckQueryAdminID = $personelDataToSave['whmcs_admin_id'] ? Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $personelDataToSave['whmcs_admin_id']) : null;
            if ($personelIdToUpdate > 0) { $uniqueCheckQueryTCKN->where('id', '!=', $personelIdToUpdate); if($uniqueCheckQueryAdminID) $uniqueCheckQueryAdminID->where('id', '!=', $personelIdToUpdate); }
            $existingPersonelByTCKN = $uniqueCheckQueryTCKN->first(); if ($existingPersonelByTCKN) { return ['status' => false, 'message' => "Bu TCKN ({$personelDataToSave['tckn']}) zaten aktif bir personele ait (ID: {$existingPersonelByTCKN->id})."]; }
            if ($uniqueCheckQueryAdminID) { $existingPersonelByAdminID = $uniqueCheckQueryAdminID->first(); if ($existingPersonelByAdminID) { return ['status' => false, 'message' => "Seçilen WHMCS Yöneticisi (ID: {$personelDataToSave['whmcs_admin_id']}) zaten başka bir personele atanmış (Personel ID: {$existingPersonelByAdminID->id})."]; }}

            if ($personelIdToUpdate > 0) { Capsule::table('mod_btk_personel')->where('id', $personelIdToUpdate)->update($personelDataToSave); self::logAction('Personel Güncellendi', 'BAŞARILI', "ID: $personelIdToUpdate", $logKullaniciId); return ['status' => true, 'message' => 'Personel güncellendi.', 'id' => $personelIdToUpdate, 'nvi_status' => $tcknDogrulamaSonucu, 'nvi_message' => $tcknDogrulamaMesaji]; }
            else { $personelId = Capsule::table('mod_btk_personel')->insertGetId($personelDataToSave); self::logAction('Personel Eklendi', 'BAŞARILI', "Yeni ID: $personelId", $logKullaniciId); return ['status' => true, 'message' => 'Personel eklendi.', 'id' => $personelId, 'nvi_status' => $tcknDogrulamaSonucu, 'nvi_message' => $tcknDogrulamaMesaji]; }
        } catch (Exception $e) { self::logAction('Personel Kaydetme DB Hatası', 'HATA', $e->getMessage(), $logKullaniciId, ['trace' => $e->getTraceAsString()]); return ['status' => false, 'message' => 'Veritabanı hatası. Logları kontrol edin.']; }
    }
    public static function deletePersonel($personelId, $adminId = null) { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function getDepartmanList() { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function getTeknikPersonelForIlce($ilce_id) { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }
    public static function getTumIlcelerWithIlAdi() { /* ... (Bir önceki tam BtkHelper gönderimindeki gibi) ... */ }


// --- BtkHelper.php Bölüm 3/4 Sonu --- 
// --- Bir sonraki bölüm "Dosya Adlandırma ve CNT Yönetimi" ile başlayacak ---
// ... BtkHelper.php Bölüm 3/4 içeriğinin sonu ...

    // --- Dosya Adlandırma ve CNT Yönetimi ---
    /**
     * BTK formatına uygun rapor dosya adı oluşturur.
     * @param string $operatorAdi
     * @param string $operatorKodu
     * @param string|null $yetkiTuruGrup Raporun ait olduğu yetki türü grubu (örn: ISS, AIH). Personel için null.
     * @param string $raporTuru ABONE_REHBER, ABONE_HAREKET, PERSONEL_LISTESI
     * @param string $cnt İki haneli CNT numarası (örn: '01')
     * @param int|null $timestamp Dosya adı için kullanılacak zaman damgası (Unix timestamp). Null ise şu anki zaman (UTC).
     * @param string $forFtpType 'main' veya 'backup' (Personel dosyası adı için Yıl-Ay ekleme ayarını etkiler)
     * @return string|false Oluşturulan dosya adı (uzantılı .abn veya .xlsx) veya hata durumunda false.
     */
    public static function generateReportFilename($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $cnt, $timestamp = null, $forFtpType = 'main') {
        if (empty(trim($operatorAdi))) {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Adı boş olamaz.');
            return false;
        }
        if (strtoupper($raporTuru) !== 'PERSONEL_LISTESI' && empty(trim($operatorKodu))) {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', 'Operatör Kodu (Personel hariç) boş olamaz.');
            return false;
        }

        if (is_null($timestamp)) { $timestamp = time(); }
        
        $dateTimePart = gmdate('YmdHis', $timestamp); // BTK genellikle UTC bekler
        $cntPadded = str_pad((string)$cnt, 2, '0', STR_PAD_LEFT);

        $raporTuruUpper = strtoupper(trim($raporTuru));
        $cleanOperatorName = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', trim($operatorAdi)));

        if ($raporTuruUpper === 'PERSONEL_LISTESI') {
            $addYearMonthSettingKey = strtolower($forFtpType) . '_personel_filename_add_year_month';
            $defaultAddYearMonth = ($forFtpType === 'backup') ? '1' : self::get_btk_setting('personel_filename_add_year_month_main', '0');
            $addYearMonth = (bool)self::get_btk_setting($addYearMonthSettingKey, $defaultAddYearMonth);
            
            $yearMonthPart = $addYearMonth ? "_" . gmdate('Y_m', $timestamp) : '';
            $filename = $cleanOperatorName . "_Personel_Listesi" . $yearMonthPart . ".xlsx"; // Uzantıyı burada ekleyelim
            return $filename;
        } elseif ($raporTuruUpper === 'ABONE_REHBER' || $raporTuruUpper === 'ABONE_HAREKET') {
            if (empty(trim($yetkiTuruGrup))) {
                self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "$raporTuru için Yetki Türü Grubu (Tip) boş olamaz.");
                return false;
            }
            $cleanOperatorKodu = preg_replace('/[^a-zA-Z0-9]/', '', trim($operatorKodu));
            $cleanYetkiGrup = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', trim($yetkiTuruGrup)));

            $filename = $cleanOperatorName . '_' . $cleanOperatorKodu . '_' . $cleanYetkiGrup . '_' . $raporTuruUpper . '_' . $dateTimePart . '_' . $cntPadded;
            return $filename . '.abn'; // .gz sıkıştırması sonra yapılacak, dosya adı .abn ile biter
        } else {
            self::logAction('Dosya Adı Oluşturma Hatası', 'HATA', "Bilinmeyen rapor türü: $raporTuru");
            return false;
        }
    }

    /**
     * Bir sonraki kullanılabilir CNT numarasını DÖNDÜRÜR.
     * BTK Kuralı: Yeni içerikli bir rapor her zaman '01' ile başlar.
     * Eğer aynı gün, aynı tip, aynı grup için DAHA ÖNCE BAŞARILI bir gönderim varsa
     * ve BTK mükerrer gönderim talep ederse, o zaman manuel olarak CNT artırılır.
     * Bu fonksiyon otomatik cron için her zaman '01' döndürmelidir.
     * Manuel gönderim arayüzü, bu fonksiyonu kullanabilir veya kullanıcıya CNT girme opsiyonu sunabilir.
     */
    public static function getNextCnt($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $ftpSunucuTipi = 'ANA', $forceIncrementForSameDay = false) {
        // Yeni bir rapor için (farklı zaman damgası ile) her zaman '01' kullanılır.
        // Bu fonksiyonun amacı, eğer BTK aynı gün içinde AYNI RAPORUN tekrarını (belki farklı CNT ile) isterse
        // bir sonraki CNT'yi bulmak olmalıydı. Ancak BTK dökümanı "Dosyanın tekrar gönderilmesi talep
        // edildiğinde iki haneli kod birer arttırılarak iletilir" der. Bu, aynı içeriğin tekrarı anlamına gelir.
        // Cron'da her çalışmada yeni içerik (veya aynı içerik ama yeni zaman damgası) üretilir, bu yüzden '01' olmalı.
        // Manuel tekrar gönderim senaryosu için bu fonksiyon farklı çalışabilir.
        
        // Şimdilik, her yeni dosya adı oluşturma çağrısı için (farklı timestamp ile) '01' döndür.
        // Manuel "tekrar gönder" özelliği yapılırsa bu fonksiyonun mantığı daha karmaşık hale gelebilir
        // ve belirli bir dosya adı için bir sonraki CNT'yi bulması gerekebilir.
        return '01';
    }
    
    // --- Rapor Oluşturma Ana Mantığı ---
    public static function getAboneRehberData($yetkiTuruGrup, $filters = []) {
        self::logAction("Rehber Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters);
        // TODO: İMPLEMENTASYON GEREKLİ
        // 1. $yetkiTuruGrup'a göre hangi ürün gruplarının (gid) dahil olacağını bul.
        // 2. Bu ürün gruplarındaki tüm hizmetleri (tblhosting) al.
        // 3. Bu hizmetlere bağlı mod_btk_abone_rehber kayıtlarını çek.
        // 4. Adres ID'lerini isimlere, POP ID'sini SSID'ye çevir.
        // 5. BTK'nın istediği tüm alanları (getBtkAlanSiralamasi ile alınan sıraya göre) içeren bir dizi döndür.
        // 6. Müşteri tipi, hizmet tipi gibi alanları doğru set et.
        return []; // Örnek boş dizi
    }

    public static function getAboneHareketData($yetkiTuruGrup, $filters = []) {
        self::logAction("Hareket Veri Çekme Başladı ($yetkiTuruGrup)", 'DEBUG', $filters);
        // TODO: İMPLEMENTASYON GEREKLİ
        // 1. mod_btk_abone_hareket_live'dan gonderildi_flag = 0 olanları al.
        // 2. Hareketin ait olduğu rehber_kayit_id üzerinden hizmetin yetki grubunu bularak filtrele.
        // 3. Hareket dosyası için, hareketin oluştuğu andaki TÜM rehber bilgilerini (veya değişenleri + anahtarları) çek.
        //    Eğer hareket tablosu tüm rehber alanlarını içermiyorsa, rehberden join ile alınmalı.
        //    getBtkAlanSiralamasi ile alınan sıraya göre bir dizi döndür.
        return []; // Örnek boş dizi
    }
        
    public static function getPersonelDataForReport($filters = []) {
        try {
            $personeller = Capsule::table('mod_btk_personel as p')
                ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                ->where('p.btk_listesine_eklensin', 1)
                ->whereNull('p.isten_ayrilma_tarihi') // Sadece aktif çalışanlar
                ->select(
                    'p.firma_unvani', // Genel Ayarlar'dan alınacak, buradaki sadece bir placeholder olabilir
                    'p.ad', 
                    'p.soyad', 
                    'p.tckn', 
                    'p.unvan', 
                    'd.departman_adi', 
                    'p.mobil_tel', 
                    'p.sabit_tel', 
                    'p.email'
                )
                ->orderBy('p.soyad')->orderBy('p.ad')
                ->get()->all();
            
            // Firma ünvanını ayardan alıp her satıra ekle
            $operatorTitle = self::get_btk_setting('operator_title', '[FİRMA ÜNVANI AYARLANMAMIŞ]');
            $reportData = [];
            foreach($personeller as $personel){
                $pArray = (array)$personel;
                $pArray['firma_unvani'] = $operatorTitle; // Excel başlığına göre anahtar "Firma Adı" olmalı.
                // ExcelExporter'a gönderilecek dizideki anahtarların Excel başlıklarıyla eşleşmesi lazım.
                $reportData[] = [
                    'Firma Adı' => $operatorTitle, // Excel başlığı
                    'Adı' => $pArray['ad'],
                    'Soyadı' => $pArray['soyad'],
                    'TC Kimlik No' => $pArray['tckn'],
                    'Ünvan' => $pArray['unvan'],
                    'Çalıştığı birim' => $pArray['departman_adi'],
                    'Mobil telefonu' => $pArray['mobil_tel'],
                    'Sabit telefonu' => $pArray['sabit_tel'],
                    'E-posta adresi' => $pArray['email']
                ];
            }
            return $reportData;
        } catch (Exception $e) {
            self::logAction('Personel Rapor Verisi Çekme Hatası', 'HATA', $e->getMessage());
            return [];
        }
    }

    public static function formatAbnRow($dataArray, $btkAlanSiralamasi, $isHareket = false) {
        if (empty($btkAlanSiralamasi)) { self::logAction('ABN Formatlama Hatası', 'HATA', 'BTK Alan sıralaması sağlanmadı.'); return ''; }
        
        $rowValues = [];
        foreach ($btkAlanSiralamasi as $btkFieldKey) {
            // Veri dizisindeki anahtarların BTK alan adlarıyla (veya eşleştirilmişleriyle) uyumlu olması beklenir.
            // Örneğin, $dataArray['OPERATOR_KOD'] veya $dataArray['operator_kod']
            $dbFieldKey = strtolower($btkFieldKey); 
            $value = ''; 

            if (strtoupper($btkFieldKey) === 'ISS_POP_BILGISI') {
                $popBilgisi = $dataArray['iss_pop_bilgisi_sunucu'] ?? ''; // WHMCS hizmet sunucusu
                if (!empty($dataArray['iss_pop_noktasi_id'])) {
                    $popNoktasi = self::getIssPopNoktasiById($dataArray['iss_pop_noktasi_id']);
                    if ($popNoktasi && !empty($popNoktasi['yayin_yapilan_ssid'])) { // Dizi olarak erişim
                        $popBilgisi .= (empty($popBilgisi) ? '' : ".") . $popNoktasi['yayin_yapilan_ssid'];
                    }
                }
                $value = $popBilgisi;
            } elseif (array_key_exists($dbFieldKey, $dataArray)) { // Küçük harfle ara
                $value = $dataArray[$dbFieldKey];
            } elseif (array_key_exists(strtoupper($dbFieldKey), $dataArray)) { // Büyük harfle ara
                 $value = $dataArray[strtoupper($dbFieldKey)];
            }
            
            $dateTimeFields = ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS'];
            $dateFields = ['ABONE_DOGUM_TARIHI', 'ABONE_KIMLIK_VERILDIGI_TARIH'];

            if (in_array(strtoupper($btkFieldKey), $dateTimeFields) && !empty($value)) {
                try { $value = (new DateTime($value))->format('YmdHis'); } catch (Exception $e) { $value = '';}
            } elseif (in_array(strtoupper($btkFieldKey), $dateFields) && !empty($value)) {
                 try { $value = (new DateTime($value))->format('Ymd'); } catch (Exception $e) { $value = '';}
            }
            
            $value = str_replace(['|', ';', "\r\n", "\n", "\r"], [' ', ' ', ' ', ' ', ' '], trim((string)$value));
            $rowValues[] = $value;
        }
        return implode('|;|', $rowValues);
    }

    public static function getBtkAlanSiralamasi($raporTuru = 'REHBER', $yetkiTuruGrup = null) {
        // Bu fonksiyon, 314_KK_Abone_Desen.pdf Bölüm 3.A'daki 85 alanı doğru sırada içermelidir.
        // Alan adları BTK dokümanındaki gibi BÜYÜK HARF olmalıdır.
        $ortakAlanlar = [ /* ... (Bir önceki gönderimdeki 70 ortak alan) ... */ ];
        $ozelAlanlar = [];
        switch (strtoupper($yetkiTuruGrup ?? '')) { /* ... (Bir önceki gönderimdeki switch case yapısı) ... */ }
        return array_merge($ortakAlanlar, $ozelAlanlar);
    }
    public static function compressToGz($sourceFilePath, $destinationFilePath = null) { /* ... (Bir önceki gönderimdeki gibi) ... */ return false; }

    // --- WHMCS Veri Entegrasyonu (HOOK Handler Fonksiyonları) ---
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
    public static function getWhmcsClientDetails($clientId) { /* İMPLEMENTASYON BEKLİYOR */ return null; }
    public static function getWhmcsServiceDetails($serviceId) { /* İMPLEMENTASYON BEKLİYOR */ return null; }

    // --- Yardımcı Diğer Fonksiyonlar ---
    public static function getCurrentAdminId() { return isset($_SESSION['adminid']) ? (int)$_SESSION['adminid'] : null; }
    public static function sendEmailNotification($to, $subject, $messageBody, $attachments = []) { 
        $adminUserId = self::getCurrentAdminId();
        if (!$adminUserId) { $firstAdmin = Capsule::table('tbladmins')->where('disabled',0)->orderBy('id', 'asc')->first(); if ($firstAdmin) $adminUserId = $firstAdmin->id; else { self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID bulunamadı.'); return false;}}
        $command = 'SendEmail'; $postData = ['customtype' => 'general', 'customsubject' => $subject, 'custommessage' => nl2br(htmlspecialchars($messageBody)), 'to' => $to];
        try { $results = localAPI($command, $postData, $adminUserId); if ($results['result'] == 'success') { self::logAction('Eposta Gönderildi', 'BİLGİ', "Kime: $to, Konu: $subject"); return true; } else { self::logAction('Eposta Gönderme Hatası (localAPI)', 'HATA', ['to' => $to, 'subject' => $subject, 'response' => $results]); return false;}
        } catch (Exception $e) { self::logAction('Eposta Gönderme Kapsamlı Hata', 'HATA', $e->getMessage(), null, ['to' => $to, 'subject' => $subject]); return false; }
    }

} // Sınıf Sonu
?>