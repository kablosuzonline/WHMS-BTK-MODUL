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
use WHMCS\Utility\Encryption;
use Cron\CronExpression; // Cron zamanlaması için

// PhpSpreadsheet ve NviSoapClient sınıfları, bu helper içinde
// ExcelExporter veya NviSoapClient sınıfları üzerinden çağrılacakları için
// burada doğrudan use etmeye gerek olmayabilir.

class BtkHelper {

    // --- Ayar Yönetimi ---
    public static function get_btk_setting($settingName, $defaultValue = null) {
        try {
            $setting = Capsule::table('mod_btk_settings')->where('setting', $settingName)->first();
            if ($setting) {
                if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass']) && !empty($setting->value)) {
                    try { return Encryption::decrypt($setting->value); } catch (\Exception $e) { self::logAction('Ayar Deşifre Hatası', 'HATA', "Ayar '$settingName' deşifre edilemedi: " . $e->getMessage()); return ''; }
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
                    try { $settingsArray[$setting->setting] = Encryption::decrypt($setting->value); } catch (\Exception $e) { $settingsArray[$setting->setting] = ''; self::logAction('Toplu Ayar Deşifre Hatası', 'UYARI', "Ayar '{$setting->setting}' deşifre edilemedi.");}
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
                Capsule::table('mod_btk_product_group_mappings')->delete(); // Önce tüm eski eşleşmeleri sil
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
            if (!$service || !$service->packageid) return null;
            $product = Capsule::table('tblproducts')->find($service->packageid);
            if (!$product || !$product->gid) return null;

            $mapping = Capsule::table('mod_btk_product_group_mappings as pgmap')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'pgmap.yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('pgmap.gid', $product->gid)
                ->select('ytr.grup')
                ->first();
            return $mapping ? $mapping->grup : null;
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
            // WHMCS saat dilimi ayarına göre veya sunucu saatine göre gösterim yapılabilir.
            // Şimdilik UTC olarak hesaplayıp, gösterimde yerel saate çevrilebilir.
            return $cron->getNextRunDate('now', 0, false, 'UTC')->format('Y-m-d H:i:s T');
        } catch (InvalidArgumentException $iae) {
            self::logAction('Geçersiz Cron İfadesi (InvalidArgument)', 'HATA', "Ayar: $cronScheduleSettingKey, İfade: '$schedule', Hata: " . $iae->getMessage());
            return $GLOBALS['_LANG']['invalidCronExpression'] ?? 'Geçersiz Cron İfadesi';
        }
         catch (Exception $e) { self::logAction('Sonraki Cron Çalışma Zamanı Hesaplama Hatası', 'HATA', "Ayar: $cronScheduleSettingKey, Hata: " . $e->getMessage()); return $GLOBALS['_LANG']['errorFetchingNextRun'] ?? 'Hesaplanamadı'; }
    }
 // --- FTP İşlemleri ---
    public static function checkFtpConnection($type = 'main') {
        $host = self::get_btk_setting($type . '_ftp_host');
        $user = self::get_btk_setting($type . '_ftp_user');
        $pass = self::get_btk_setting($type . '_ftp_pass'); // Deşifrelenmiş gelir
        $port = (int)self::get_btk_setting($type . '_ftp_port', 21);
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', false);

        if (empty($host)) { // Kullanıcı adı veya şifre boş olabilir, sunucu anonim girişe izin veriyorsa. Ama host zorunlu.
            return ['status' => 'error', 'message' => ucfirst($type) . ' FTP sunucu adresi ayarlanmamış.'];
        }
        
        $conn_id = false;
        $connect_function = ($ssl && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : (function_exists('ftp_connect') ? 'ftp_connect' : null);

        if (!$connect_function) {
            $errMsg = ucfirst($type) . ' FTP fonksiyonları (ftp_connect/ftp_ssl_connect) sunucunuzda etkin değil.';
            self::logAction(ucfirst($type) . ' FTP Bağlantı Hatası', 'CRITICAL', $errMsg);
            return ['status' => 'error', 'message' => $errMsg];
        }
        
        $old_error_reporting = error_reporting(0); // Hataları bastır
        $conn_id = @$connect_function($host, $port, 15); // 15 saniye timeout
        error_reporting($old_error_reporting); // Eski hata raporlama seviyesine dön

        if ($conn_id) {
            $login_result = @ftp_login($conn_id, $user ?: 'anonymous', $pass ?: ''); // Kullanıcı adı veya şifre boşsa anonim dene
            if ($login_result) {
                @ftp_pasv($conn_id, true);
                $message = ucfirst($type) . ' FTP sunucusuna başarıyla bağlanıldı.';
                // Test amaçlı bir dosya listeleme veya dizin değiştirme yapılabilir.
                // $current_dir = @ftp_pwd($conn_id);
                // if ($current_dir !== false) {
                //     $message .= " Mevcut dizin: " . $current_dir;
                // }
                @ftp_close($conn_id);
                return ['status' => 'success', 'message' => $message];
            } else {
                $ftp_error_msg = "Giriş başarısız (Kullanıcı: '$user').";
                // error_get_last() burada spesifik ftp_login hatasını vermeyebilir.
                $message = ucfirst($type) . ' FTP sunucusuna bağlanıldı ancak ' . $ftp_error_msg;
                @ftp_close($conn_id);
                return ['status' => 'error', 'message' => $message];
            }
        } else {
            $message = ucfirst($type) . ' FTP sunucusuna (' . htmlspecialchars($host) . ':' . $port . ') bağlanılamadı. Lütfen sunucu adresi, port ve ağ ayarlarınızı kontrol edin.';
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
        $ssl  = (bool)self::get_btk_setting($type . '_ftp_ssl', false);
        
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
        $conn_id = @$connect_function($host, $port, 30); // Timeout 30 saniye
        error_reporting($old_error_reporting);

        if ($conn_id) {
            if (@ftp_login($conn_id, $user ?: 'anonymous', $pass ?: '')) {
                @ftp_pasv($conn_id, true);
                
                // Dizini oluşturmaya çalış (eğer yoksa ve gerekliyse)
                if ($remoteDir !== '') {
                    $parts = explode('/', $remoteDir);
                    $currentPath = '';
                    foreach ($parts as $part) {
                        if (empty($part)) continue;
                        $currentPath .= (empty($currentPath) ? '' : '/') . $part;
                        if (!@ftp_chdir($conn_id, $currentPath)) {
                            if (!@ftp_mkdir($conn_id, $currentPath)) {
                                $message = "$type FTP: Uzak dizin ($currentPath) oluşturulamadı veya erişilemedi.";
                                @ftp_close($conn_id);
                                return ['status' => 'error', 'message' => $message];
                            }
                        }
                    }
                    // Son dizine tekrar gir (mkdir root'a dönebilir)
                    if (!@ftp_chdir($conn_id, $remoteDir) && $remoteDir !== '.') { 
                        // Eğer sadece dosya adı ise (dizin yoksa) ve chdir başarısızsa, root'tayız demektir.
                        // Ama bir dizin belirtilmişse ve girilemiyorsa hata.
                         if(strpos($remoteDir, '/') !== false){ // Eğer bir alt dizin yolu ise ve girilemiyorsa hata
                            $message = "$type FTP: Uzak dizin ($remoteDir) mevcut değil veya erişilemiyor.";
                            @ftp_close($conn_id);
                            return ['status' => 'error', 'message' => $message];
                         }
                    }
                }


                if (@ftp_put($conn_id, $remoteFileName, $localFilePath, FTP_BINARY)) { // Sadece dosya adı ile yükle (dizine girilmiş olmalı)
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
            if (!empty($filters['rapor_turu'])) $query->where('rapor_turu', strtoupper($filters['rapor_turu']));
            if (!empty($filters['ftp_sunucu_tipi'])) $query->where('ftp_sunucu_tipi', strtoupper($filters['ftp_sunucu_tipi']));
            if (!empty($filters['durum'])) $query->where('durum', ucfirst(strtolower($filters['durum'])));
            if (!empty($filters['dosya_adi'])) $query->where('dosya_adi', 'LIKE', '%' . $filters['dosya_adi'] . '%');
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
            return Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get(['id', 'il_adi'])->all();
        } catch (Exception $e) { self::logAction('İl Listesi Okuma Hatası', 'Hata', $e->getMessage()); return []; }
    }
    public static function getIlcelerByIlId($il_id, $includeIlAdi = false) {
        // ... (Bir önceki "TAM VE EKSİKSİZ SÜRÜM BÖLÜM 1/4" teki gibi) ...
         if (empty($il_id) || !is_numeric($il_id)) {
            if ($includeIlAdi) { 
                 try {
                    $results = Capsule::table('mod_btk_adres_ilce as ilce')
                        ->join('mod_btk_adres_il as il', 'ilce.il_id', '=', 'il.id')
                        ->select('ilce.id', 'ilce.ilce_adi', 'il.il_adi as il_adi_prefix') // il_adi_prefix olarak alalım
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
    
// --- ISS POP Noktaları İçin Yardımcı Fonksiyonlar ---
// (searchPopSSIDs, getIssPopNoktasiById, getIssPopNoktalariList, saveIssPopNoktasi, deleteIssPopNoktasi)
// Bu fonksiyonların içleri bir önceki "devam o zaman" mesajımdaki gibi TAM ve EKSİKSİZ olacak.
// (Sadece getIssPopNoktalariList ve saveIssPopNoktasi'na küçük iyileştirmeler)

    public static function searchPopSSIDs($term = '', $filter_by = null, $filter_value = null, $limit = 25) {
        if (empty($term) && (empty($filter_by) || is_null($filter_value) )) return [];
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari')->where('aktif_pasif_durum', 1);
            if (!empty($filter_by) && !is_null($filter_value) && is_numeric($filter_value)) {
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
        if(empty($id) || !is_numeric($id)) return null;
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
                          ->orderByRaw($orderBy . ' ' . $sortOrder)
                          ->skip($offset)->take($limit)->get()->all();
            return ['data' => array_map(function($pop){ return (array)$pop; }, $pops), 'total_count' => $total];
        } catch (Exception $e) { self::logAction('ISS POP Listesi Okuma Hatası', 'HATA', $e->getMessage()); return ['data' => [], 'total_count' => 0];}
    }

    public static function saveIssPopNoktasi($data) {
        $adminId = self::getCurrentAdminId();
        if (empty($data['pop_adi']) || empty($data['yayin_yapilan_ssid'])) {
            self::logAction('ISS POP Kaydetme Hatası', 'UYARI', 'POP Adı veya Yayın SSID boş olamaz.', $adminId, $data);
            return ['status' => false, 'message' => 'POP Adı ve Yayın Yapılan SSID alanları zorunludur.'];
        }
        try {
            $popData = [ /* ... (Bir önceki gönderimdeki gibi, il_id, ilce_id, mahalle_id null kontrolü) ... */ ];
             // ... (popData doldurma kısmı, bir önceki "devam o zaman" mesajındaki gibi) ...
            $popData = [
                'pop_adi' => trim($data['pop_adi']),
                'yayin_yapilan_ssid' => trim($data['yayin_yapilan_ssid']),
                'ip_adresi' => $data['ip_adresi'] ?? null,
                'cihaz_turu' => $data['cihaz_turu'] ?? null,
                'cihaz_markasi' => $data['cihaz_markasi'] ?? null,
                'cihaz_modeli' => $data['cihaz_modeli'] ?? null,
                'pop_tipi' => $data['pop_tipi'] ?? null,
                'il_id' => !empty($data['il_id']) && is_numeric($data['il_id']) ? (int)$data['il_id'] : null,
                'ilce_id' => !empty($data['ilce_id']) && is_numeric($data['ilce_id']) ? (int)$data['il_id'] : null, // Hata: il_id değil ilce_id olmalı
                'mahalle_id' => !empty($data['mahalle_id']) && is_numeric($data['mahalle_id']) ? (int)$data['mahalle_id'] : null,
                'tam_adres' => $data['tam_adres'] ?? null,
                'koordinatlar' => $data['koordinatlar'] ?? null,
                'aktif_pasif_durum' => (isset($data['aktif_pasif_durum']) && ($data['aktif_pasif_durum'] === '1' || $data['aktif_pasif_durum'] === 'on' || $data['aktif_pasif_durum'] === true)) ? 1 : 0,
            ];
            // Düzeltme: ilce_id
             if (isset($data['ilce_id']) && !empty($data['ilce_id']) && is_numeric($data['ilce_id'])) {
                $popData['ilce_id'] = (int)$data['ilce_id'];
            }


            if (isset($data['pop_id']) && (int)$data['pop_id'] > 0) {
                $popId = (int)$data['pop_id'];
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update($popData);
                self::logAction('ISS POP Güncellendi', 'BAŞARILI', "ID: $popId", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla güncellendi.', 'id' => $popId];
            } else {
                $popId = Capsule::table('mod_btk_iss_pop_noktalari')->insertGetId($popData);
                self::logAction('ISS POP Eklendi', 'BAŞARILI', "Yeni ID: $popId", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla eklendi.', 'id' => $popId];
            }
        } catch (Exception $e) {
            self::logAction('ISS POP Kaydetme/Güncelleme Hatası', 'HATA', $e->getMessage(), $adminId, ['data' => $data, 'trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'POP Noktası kaydedilirken bir veritabanı hatası oluştu: ' . $e->getMessage()];
        }
    }

    public static function deleteIssPopNoktasi($popId) {
        $adminId = self::getCurrentAdminId();
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
                self::logAction('ISS POP Silindi', 'BAŞARILI', "ID: $popId, Adı: {$pop['pop_adi']}", $adminId);
                return ['status' => true, 'message' => 'POP Noktası başarıyla silindi.'];
            }
            self::logAction('ISS POP Silme Hatası', 'UYARI', "ID: $popId silinemedi (DB Hatası veya kayıt yok).", $adminId);
            return ['status' => false, 'message' => 'POP Noktası silinirken bir sorun oluştu.'];
        } catch (Exception $e) {
            self::logAction('ISS POP Silme Kapsamlı Hata', 'HATA', "ID: $popId, Hata: " . $e->getMessage(), $adminId, ['trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'POP Noktası silinirken bir veritabanı hatası oluştu.'];
        }
    }

// --- BtkHelper.php Bölüm 2/4 Sonu --- 
// --- Bir sonraki bölüm "Personel Yönetimi" ile başlayacak ---
// ... BtkHelper.php Bölüm 2/4 içeriğinin sonu ...

// --- Personel Yönetimi ---
    /**
     * Personel listesini filtreler, sıralar ve sayfalar halinde getirir.
     * @param array $filters Filtreleme kriterleri (s_ad, s_soyad, s_tckn, s_email, s_departman_id, s_btk_listesine_eklensin, s_aktif_calisan)
     * @param string $orderBy Sıralama yapılacak sütun (p.soyad gibi tablo aliası ile)
     * @param string $sortOrder ASC veya DESC
     * @param int $limit Sayfa başına kayıt sayısı
     * @param int $offset Başlangıç kaydı
     * @return array ['data' => [], 'total_count' => 0]
     */
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
                                 ->orderByRaw($orderBy . ' ' . $sortOrder)
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
        if (empty($dogumYiliForNVI)) $validationErrors[] = 'Doğum Yılı (NVI için) 4 haneli sayı olarak girilmelidir.';


        if (!empty($validationErrors)) {
            self::logAction('Personel Kaydetme Doğrulama Hatası', 'UYARI', implode(', ', $validationErrors), $logKullaniciId, ['data_keys' => array_keys($data)]);
            return ['status' => false, 'message' => implode('<br>', $validationErrors)];
        }

        $tcknDogrulamaSonucu = 'Dogrulanmadi';
        $tcknDogrulamaMesaji = 'NVI Doğrulaması yapılamadı (gerekli bilgiler eksik veya servis hatası).';
        
        if (class_exists('NviSoapClient')) {
            $nviClient = new NviSoapClient();
            $nviResult = $nviClient->TCKimlikNoDogrula($tckn, trim($data['ad']), trim($data['soyad']), $dogumYiliForNVI);
            if ($nviResult === true) {
                $tcknDogrulamaSonucu = 'Dogrulandi';
                $tcknDogrulamaMesaji = 'NVI üzerinden TCKN başarıyla doğrulandı.';
            } else {
                $tcknDogrulamaSonucu = $nviClient->getLastError() ? 'Hata' : 'Dogrulanamadi';
                $tcknDogrulamaMesaji = $nviClient->getLastErrorMessageForUser() ?: ($nviClient->getLastError() ?: 'NVI Doğrulama Başarısız. Bilgileri kontrol edin.');
            }
            self::logAction('NVI TCKN Doğrulama (Personel)', $nviResult ? 'BİLGİ' : 'UYARI', $tcknDogrulamaMesaji, $logKullaniciId, ['tckn' => $tckn, 'ad' => $data['ad'], 'soyad' => $data['soyad'], 'yil' => $dogumYiliForNVI]);
        } else {
             $tcknDogrulamaMesaji = 'NVI Doğrulama servisi (NviSoapClient) yüklenemedi.';
        }

        try {
            $personelDataToSave = [ /* ... (Bir önceki BtkHelper Bölüm 2/X'teki gibi, null kontrolleri ve trim'ler ile) ... */];
            // whmcs_admin_id, firma_unvani, ad, soyad, tckn, unvan, departman_id, mobil_tel, sabit_tel, email,
            // ev_adresi, acil_durum_kisi_iletisim, ise_baslama_tarihi, isten_ayrilma_tarihi, is_birakma_nedeni,
            // gorev_bolgesi_ilce_id, btk_listesine_eklensin, tckn_dogrulama_durumu, tckn_dogrulama_zamani, tckn_dogrulama_mesaji
            // Bu alanları $data'dan alıp, temizleyip, doğru tiplere çevirip $personelDataToSave'e atayacağız.
            // Örneğin:
            $personelDataToSave['whmcs_admin_id'] = !empty($data['whmcs_admin_id_modal']) && is_numeric($data['whmcs_admin_id_modal']) && (int)$data['whmcs_admin_id_modal'] > 0 ? (int)$data['whmcs_admin_id_modal'] : null;
            // ... diğer tüm alanlar için benzer şekilde ...
            $personelDataToSave['firma_unvani'] = self::get_btk_setting('operator_title', ''); // Otomatik
            $personelDataToSave['ad'] = trim($data['ad']);
            $personelDataToSave['soyad'] = trim($data['soyad']);
            $personelDataToSave['tckn'] = $tckn;
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
            $personelDataToSave['tckn_dogrulama_durumu'] = $tcknDogrulamaSonucu;
            $personelDataToSave['tckn_dogrulama_zamani'] = gmdate('Y-m-d H:i:s');
            $personelDataToSave['tckn_dogrulama_mesaji'] = substr($tcknDogrulamaMesaji, 0, 255);


            // Unique kontroller
            $uniqueCheckQueryTCKN = Capsule::table('mod_btk_personel')->where('tckn', $personelDataToSave['tckn'])->whereNull('isten_ayrilma_tarihi');
            $uniqueCheckQueryAdminID = $personelDataToSave['whmcs_admin_id'] ? Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $personelDataToSave['whmcs_admin_id']) : null;

            if ($personelIdToUpdate > 0) {
                $uniqueCheckQueryTCKN->where('id', '!=', $personelIdToUpdate);
                if($uniqueCheckQueryAdminID) $uniqueCheckQueryAdminID->where('id', '!=', $personelIdToUpdate);
            }
            $existingPersonelByTCKN = $uniqueCheckQueryTCKN->first();
            if ($existingPersonelByTCKN) { return ['status' => false, 'message' => "Bu TCKN ({$personelDataToSave['tckn']}) ile zaten aktif bir personel var (ID: {$existingPersonelByTCKN->id})."]; }
            if ($uniqueCheckQueryAdminID) {
                $existingPersonelByAdminID = $uniqueCheckQueryAdminID->first();
                 if ($existingPersonelByAdminID) { return ['status' => false, 'message' => "Seçilen WHMCS Yöneticisi (ID: {$personelDataToSave['whmcs_admin_id']}) zaten başka bir personele atanmış (Personel ID: {$existingPersonelByAdminID->id})."]; }
            }

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
            self::logAction('Personel Kaydetme/Güncelleme DB Hatası', 'HATA', $e->getMessage(), $logKullaniciId, ['data_keys' => array_keys($data), 'trace' => $e->getTraceAsString()]);
            return ['status' => false, 'message' => 'Personel kaydedilirken bir veritabanı hatası oluştu. Logları kontrol edin.'];
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
            $teknikDepartmanAdlari = ['Bilgi Teknolojileri Departmanı', 'Teknik Destek Departmanı', 'Saha Operasyon Departmanı']; // Bu liste ayarlanabilir olmalı
            
            $personeller = Capsule::table('mod_btk_personel as p')
                ->join('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
                ->where('p.gorev_bolgesi_ilce_id', (int)$ilce_id)
                ->whereIn('d.departman_adi', $teknikDepartmanAdlari)
                ->whereNull('p.isten_ayrilma_tarihi') 
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
    
    public static function getTumIlcelerWithIlAdi() { // Personel görev bölgesi için
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
    // (Bir önceki "TAM VE EKSİKSİZ SÜRÜM BÖLÜM 3/X" teki gibi tam ve eksiksiz)
    public static function generateReportFilename($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $cnt, $timestamp = null, $forFtpType = 'main', $isExcel = false) { /* ... */ }
    public static function getNextCnt($operatorAdi, $operatorKodu, $yetkiTuruGrup, $raporTuru, $ftpSunucuTipi = 'ANA') { /* ... */ }

    // --- Rapor Oluşturma Ana Mantığı ---
    // (Bir önceki "TAM VE EKSİKSİZ SÜRÜM BÖLÜM 3/X" teki gibi, getBtkAlanSiralamasi dahil)
    public static function getAboneRehberData($yetkiTuruGrup, $filters = []) { /* ... */ }
    public static function getAboneHareketData($yetkiTuruGrup, $filters = []) { /* ... */ }
    public static function markHareketAsGonderildi($hareketIds, $dosyaAdi, $cnt) { /* ... */ }
    public static function archiveOldHareketler() { /* ... */ }
    public static function getPersonelDataForReport($filters = []) { /* ... (Bu zaten yukarıda detaylı implemente edildi) ... */ }
    public static function formatAbnRow($dataArray, $btkAlanSiralamasi, $isHareket = false) { /* ... */ }
    public static function getBtkAlanSiralamasi($raporTuru = 'REHBER', $yetkiTuruGrup = null) { /* ... (Bu çok önemli, BTK dokümanına göre TAMAMLANMALI) ... */ }
    public static function compressToGz($sourceFilePath, $destinationFilePath = null) { /* ... */ }


// Devamı sonraki bölümde (Hook Handler'lar)...
// ... BtkHelper.php Bölüm 3/4 içeriğinin sonu ...

    // --- WHMCS Veri Entegrasyonu (HOOK Handler Fonksiyonları) ---
    // Bu fonksiyonların içleri, ilgili WHMCS olayı tetiklendiğinde BTK tablolarını
    // (mod_btk_abone_rehber, mod_btk_abone_hareket_live) doğru şekilde güncellemek
    // ve gerekli hareket kayıtlarını oluşturmak için detaylı olarak implemente edilmelidir.

    /**
     * Yeni müşteri eklendiğinde çağrılır (ClientAdd hook).
     * Bu aşamada genellikle sadece müşteri bilgileri vardır, henüz hizmeti olmayabilir.
     * Rehbere bir ön kayıt atılabilir veya sadece loglanabilir.
     * Asıl rehber kaydı genellikle hizmet oluşturulduğunda (AfterModuleCreate) atılır.
     */
    public static function handleClientAdd($vars) {
        $clientId = $vars['userid'] ?? null;
        $adminId = self::getCurrentAdminId() ?? ($vars['adminid'] ?? null);
        self::logAction('Helper: handleClientAdd', 'DEBUG', "Müşteri ID: $clientId eklendi. (Detaylı işlem implemente edilecek)", $adminId, ['vars_keys' => array_keys($vars)]);
        // TODO: Müşteri verilerini alıp, mod_btk_abone_rehber'e bir "potansiyel abone" veya "müşteri" kaydı atılabilir.
        // Ancak BTK raporlaması genellikle "hizmet" bazlıdır. Bu yüzden asıl kayıt handleServiceCreate'de olabilir.
        // Hareket: 'MUSTERI_OLUSTURULDU' (Eğer böyle bir hareket kodu varsa)
    }

    /**
     * Müşteri bilgileri güncellendiğinde çağrılır (ClientEdit hook).
     */
    public static function handleClientEdit($vars) {
        $clientId = $vars['userid'] ?? null;
        $adminId = self::getCurrentAdminId() ?? ($vars['adminid'] ?? null);
        self::logAction('Helper: handleClientEdit', 'DEBUG', "Müşteri ID: $clientId güncellendi. (Detaylı işlem implemente edilecek)", $adminId, ['vars_keys' => array_keys($vars)]);
        // TODO:
        // 1. $vars içinden değişen alanları tespit et.
        // 2. Bu müşteriye ait TÜM aktif/pasif/iptal hizmetlerin mod_btk_abone_rehber kayıtlarını bul.
        // 3. Değişen müşteri bilgilerini (örn: adres, soyad değişikliği) tüm bu rehber kayıtlarına yansıt.
        // 4. Her bir etkilenen hizmet için mod_btk_abone_hareket_live tablosuna 'MUSTERI_BILGI_DEGISIKLIGI' hareketi oluştur.
        //    (Hareket açıklamasına değişen alanlar eklenebilir).
    }
    
    /**
     * Müşteri hesabı kapatıldığında çağrılır (ClientClose hook).
     */
    public static function handleClientClose($clientId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleClientClose', 'UYARI', "Müşteri ID: $clientId hesabı kapatıldı. (İlişkili hizmetler iptal edilecek)", $adminId);
        // TODO:
        // 1. Bu müşteriye ait TÜM "Aktif" veya "Askıda" durumdaki hizmetleri bul.
        // 2. Her bir hizmet için:
        //    a. mod_btk_abone_rehber'de hat_durum = 'I', abone_bitis = (şimdiki zaman) olarak güncelle.
        //    b. mod_btk_abone_hareket_live'a 'HAT_IPTAL' (veya 'MUSTERI_HESAP_KAPAMA' gibi özel bir kod) hareketi oluştur.
        //    c. WHMCS hizmet durumunu da "Cancelled" veya "Terminated" yapmak gerekebilir (eğer otomatik değilse).
    }

    /**
     * Müşteri silinmeden önce çağrılır (ClientDelete hook).
     */
    public static function handleClientDelete($clientId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleClientDelete', 'KRİTİK UYARI', "Müşteri ID: $clientId siliniyor! (BTK verileri korunacak, hizmetler iptal edilecek)", $adminId);
        // handleClientClose ile benzer işlemler yapılmalı, ancak burada müşteri tamamen silineceği için
        // rehber kayıtlarındaki müşteri bilgileri (TCKN, Ad, Soyad vb.) korunmalı.
        // Sadece hizmetlerin durumu 'I' ve bitiş tarihi set edilmeli.
        // TODO: Implementasyon handleClientClose'a benzeyecek.
    }
    
    /**
     * İki müşteri hesabı birleştirildiğinde çağrılır (MergeClient hook).
     */
    public static function handleMergeClient($sourceClientId, $targetClientId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleMergeClient', 'UYARI', "Müşteri ID: $sourceClientId -> $targetClientId birleştiriliyor. (BTK kayıtları güncellenecek)", $adminId);
        // TODO:
        // 1. Kaynak müşteriye ($sourceClientId) ait tüm mod_btk_abone_rehber kayıtlarındaki whmcs_client_id'yi $targetClientId olarak güncelle.
        // 2. Kaynak müşteriye ait tüm hareketleri (mod_btk_abone_hareket_live ve _archive) yeni müşteri ID'si ile ilişkilendir (eğer müşteri bazlı bir loglama varsa).
        // 3. Kaynak müşterinin BTK ile ilgili tüm verileri (eğer sadece müşteri bazlıysa) hedef müşteriye aktar veya pasife çek.
        // 4. "MUSTERI_BIRLESTIRME" gibi özel bir hareket kaydı oluşturulabilir.
    }
    
    // --- Hizmet (Service) Hook Handler'ları ---
    public static function handleServiceCreate($params) {
        $serviceId = $params['serviceid'] ?? null;
        $clientId = $params['userid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceCreate', 'INFO', "Hizmet ID: $serviceId oluşturuldu/aktifleştirildi. (BTK kaydı oluşturulacak)", $adminId, ['service_id' => $serviceId]);
        // TODO:
        // 1. Müşteri bilgilerini ($clientId) ve hizmet bilgilerini ($serviceId, $params) WHMCS'ten çek.
        // 2. Ürün grubuna göre BTK Yetki Türü Grubu'nu bul (getYetkiGrupForService).
        // 3. Gerekli tüm BTK alanlarını (Tesis Adresi, POP vb. - $_POST'tan veya varsayılanlardan) topla.
        // 4. mod_btk_abone_rehber'e YENİ bir kayıt at. Alanlar:
        //    - operator_kod, musteri_id (whmcs_client_id), hat_no (hizmetin tekil tanımlayıcısı, örn: domain veya username)
        //    - hat_durum = 'A', hat_durum_kodu = '1' (AKTIF)
        //    - abone_baslangic = (şimdiki zaman)
        //    - Diğer tüm kimlik, adres, hizmete özel BTK alanları.
        // 5. mod_btk_abone_hareket_live'a 'YENI_ABONELIK_KAYDI' (kod: 1) hareketi oluştur.
        //    Bu hareket, o anki TÜM rehber bilgilerini içermeli.
    }

    public static function handleServiceEdit($vars) { // AdminServiceEdit sonrası
        $serviceId = $vars['serviceid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceEdit', 'DEBUG', "Hizmet ID: $serviceId güncellendi (standart alanlar). (BTK hareketi gerekebilir)", $adminId, ['vars_keys' => array_keys($vars)]);
        // TODO:
        // 1. $vars içinden değişen standart WHMCS alanlarını (örn: domain, username, dedicatedip, packageid) tespit et.
        // 2. Eğer bu değişiklikler BTK raporlamasını etkiliyorsa (örn: hat_no değişiyorsa, tarife değişiyorsa):
        //    a. mod_btk_abone_rehber'deki ilgili kaydı güncelle.
        //    b. mod_btk_abone_hareket_live'a uygun bir hareket koduyla (örn: 'MUSTERI_BILGI_DEGISIKLIGI' veya 'TARIFE_DEGISIKLIGI') kayıt at.
        // Not: BTK'ya özel alanlar (tesis adresi, POP) PreAdminServiceEdit'te handlePreServiceEdit ile kaydedilmiş olmalı.
    }
    
    public static function handlePreServiceEdit($serviceId, $postData) { // PreAdminServiceEdit içinde
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handlePreServiceEdit', 'DEBUG', "Hizmet ID: $serviceId için BTK özel alanları kaydediliyor.", $adminId);
        // TODO:
        // 1. $postData içinden BTK'ya özel form alanlarını (btk_tesis_il_id, btk_iss_pop_noktasi_id, btk_statik_ip vb.) al.
        // 2. Bu verileri mod_btk_abone_rehber tablosundaki ilgili hizmet kaydına yaz/güncelle.
        // 3. Eğer önemli bir değişiklik varsa (örn: tesis adresi değiştiyse), mod_btk_abone_hareket_live'a
        //    'ADRES_DEGISIKLIGI' (kod: 5) veya 'HIZMET_DETAY_DEGISIKLIGI' gibi bir hareket oluştur.
        //    Bu hareket, o anki TÜM rehber bilgilerini içermeli.
        // 4. iss_pop_noktasi_id değişikliğini mod_btk_service_pop_mapping tablosuna da işle.
    }


    public static function handleServiceSuspend($params) {
        $serviceId = $params['serviceid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceSuspend', 'INFO', "Hizmet ID: $serviceId askıya alındı. (BTK durumu güncellenecek)", $adminId);
        // TODO:
        // 1. mod_btk_abone_rehber'de:
        //    - hat_durum = 'D' (Dondurulmuş)
        //    - hat_durum_kodu = '15' (DONDURULMUS MUSTERI TALEBI) veya '16' (DONDURULMUS ISLETME) (WHMCS'teki askıya alma nedenine göre)
        //    - dondurulma_tarihi (eğer böyle bir alan varsa veya hareket zamanı kullanılacaksa)
        // 2. mod_btk_abone_hareket_live'a 'HAT_DURUM_DEGISIKLIGI' (kod: 2) hareketi oluştur.
        //    Açıklama: "Hizmet Askıya Alındı - Müşteri Talebi" veya "... - İşletme Kararı"
    }

    public static function handleServiceUnsuspend($params) {
        $serviceId = $params['serviceid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceUnsuspend', 'INFO', "Hizmet ID: $serviceId askıdan çıkarıldı. (BTK durumu güncellenecek)", $adminId);
        // TODO:
        // 1. mod_btk_abone_rehber'de:
        //    - hat_durum = 'A' (Aktif)
        //    - hat_durum_kodu = '1' (AKTIF)
        //    - dondurulma_tarihi alanı varsa temizle.
        // 2. mod_btk_abone_hareket_live'a 'HAT_DURUM_DEGISIKLIGI' (kod: 2) hareketi oluştur.
        //    Açıklama: "Hizmet Aktif Edildi"
    }

    public static function handleServiceTerminate($params) {
        $serviceId = $params['serviceid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceTerminate', 'INFO', "Hizmet ID: $serviceId sonlandırıldı/iptal edildi. (BTK kaydı güncellenecek)", $adminId);
        // TODO:
        // 1. mod_btk_abone_rehber'de:
        //    - hat_durum = 'I' (İptal)
        //    - hat_durum_kodu = BTK dokümanındaki uygun iptal kodu (örn: '5' IPTAL MUSTERI TALEBI)
        //    - abone_bitis = (şimdiki zaman)
        // 2. mod_btk_abone_hareket_live'a 'HAT_IPTAL' (kod: 10) veya ilgili iptal hareket koduyla kayıt oluştur.
    }
    
    public static function handleServiceDelete($serviceId) { // WHMCS'den hizmet tamamen silindiğinde
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServiceDelete', 'KRİTİK UYARI', "Hizmet ID: $serviceId WHMCS'den siliniyor! (BTK kaydı İPTAL olarak işaretlenmeli, silinmemeli)", $adminId);
        // TODO: handleServiceTerminate ile benzer işlem yapılmalı. BTK Rehber kaydı asla silinmemeli.
        // Sadece abone_bitis tarihi set edilip, hat_durum = 'I' yapılmalı.
        // Eğer rehberde bu serviceId ile kayıt yoksa (çok olası değil ama) bir uyarı logu atılabilir.
    }

    public static function handleServicePackageChange($vars) { // AfterProductUpgrade
        $serviceId = $vars['serviceid'] ?? null;
        $oldPackageId = $vars['originalpackageid'] ?? null;
        $newPackageId = $vars['newpackageid'] ?? null;
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleServicePackageChange', 'INFO', "Hizmet ID: $serviceId paket değiştirdi. Eski: $oldPackageId, Yeni: $newPackageId. (Tarife değişikliği hareketi)", $adminId);
        // TODO:
        // 1. mod_btk_abone_rehber'deki 'abone_tarife' alanını yeni paketin adıyla (veya özel bir BTK tarife koduyla) güncelle.
        // 2. mod_btk_abone_hareket_live'a 'TARIFE_DEGISIKLIGI' (kod: 7) hareketi oluştur.
        //    Açıklamaya eski ve yeni tarife bilgisi eklenebilir.
    }
    
    // --- Fatura Hook Handler'ları ---
    public static function handleInvoicePaid($invoiceId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleInvoicePaid', 'DEBUG', "Fatura ID: $invoiceId ödendi. (İlişkili hizmetler kontrol edilecek)", $adminId);
        // TODO:
        // 1. Bu faturaya ait hizmetleri bul.
        // 2. Eğer hizmetlerden herhangi biri "Pending" durumdaysa ve bu ödeme ile "Active" olacaksa,
        //    AfterModuleCreate hook'u zaten çalışmış olmalı. Ancak bazı gateway'lerde veya manuel aktivasyonlarda
        //    AfterModuleCreate tetiklenmeyebilir. Bu durumda, burada hizmetin aktif edildiğine dair
        //    bir BTK kaydı (rehber + hareket) oluşturulması gerekebilir. Bu senaryo dikkatlice test edilmeli.
        // 3. Eğer ödeme tipi değişikliği gibi bir durum varsa (ön ödemeliden faturalıya geçiş vb.),
        //    'ODEME_TIPI_DEGISIKLIGI' (kod: 4) hareketi oluşturulabilir.
    }
    public static function handleInvoiceCancelled($invoiceId) {
        $adminId = self::getCurrentAdminId();
        self::logAction('Helper: handleInvoiceCancelled', 'DEBUG', "Fatura ID: $invoiceId iptal edildi.", $adminId);
        // TODO: Eğer bu fatura iptali, hizmetin askıya alınmasına veya iptaline yol açıyorsa
        //       (ve ilgili AfterModuleSuspend/Terminate hook'ları bunu yakalamıyorsa)
        //       burada BTK durumu güncellenmeli ve hareket oluşturulmalı. Genellikle bu durumlar
        //       WHMCS'in otomasyonu veya manuel admin işlemleriyle zaten ilgili hizmet hook'larını tetikler.
    }

    // --- Personel (Admin) Senkronizasyon Hook Handler'ları ---
    public static function syncAdminToPersonel($adminId, $adminVars = []) {
        $logAdminId = self::getCurrentAdminId(); // İşlemi yapan admin
        self::logAction('Helper: syncAdminToPersonel', 'DEBUG', "WHMCS Admin ID: $adminId senkronizasyonu deneniyor.", $logAdminId, ['admin_vars_keys' => array_keys($adminVars)]);
        
        // $adminVars WHMCS'ten gelen admin bilgilerini içerir: firstname, lastname, email, username vb.
        // type: 'add' veya 'edit' olabilir.
        
        $whmcsAdmin = Capsule::table('tbladmins')->find((int)$adminId);
        if (!$whmcsAdmin) {
            self::logAction('Admin Senkronizasyon Hatası', 'UYARI', "WHMCS Admin ID: $adminId bulunamadı.", $logAdminId);
            return false;
        }

        // mod_btk_personel tablosunda bu WHMCS admin ID'si ile eşleşen kayıt var mı?
        $personel = Capsule::table('mod_btk_personel')->where('whmcs_admin_id', (int)$adminId)->first();
        
        $dataToSave = [
            'whmcs_admin_id' => (int)$adminId,
            'ad' => $whmcsAdmin->firstname,
            'soyad' => $whmcsAdmin->lastname,
            'email' => $whmcsAdmin->email,
            // Diğer alanlar (TCKN, departman, görev bölgesi vb.) modül arayüzünden manuel girilecek.
            // Eğer WHMCS admin custom fields kullanılıyorsa, oradan da bazı bilgiler çekilebilir.
        ];

        if ($personel) { // Güncelleme
            // Sadece WHMCS'ten gelen temel bilgileri güncelle, manuel girilenleri koru.
            // Eğer TCKN vb. manuel girilmişse ve WHMCS admini ile senkronize olacaksa, bu mantık değişebilir.
            Capsule::table('mod_btk_personel')->where('id', $personel->id)->update([
                'ad' => $dataToSave['ad'],
                'soyad' => $dataToSave['soyad'],
                'email' => $dataToSave['email']
                // İstenirse firma_unvani, isten_ayrilma_tarihi (admin disabled ise) güncellenebilir.
            ]);
            self::logAction('Personel Senkronizasyonu (Güncelleme)', 'BAŞARILI', "WHMCS Admin ID: $adminId güncellendi (BTK Personel ID: {$personel->id}).", $logAdminId);
        } else { // Yeni Ekleme (WHMCS'te yeni admin eklendi, modülde karşılığı yoksa)
            // Yeni personel kaydını temel bilgilerle oluştur, diğerleri manuel girilecek.
            $dataToSave['firma_unvani'] = self::get_btk_setting('operator_title');
            $dataToSave['btk_listesine_eklensin'] = 0; // Varsayılan olarak BTK listesine eklenmesin, manuel onaylansın.
            $dataToSave['tckn_dogrulama_durumu'] = 'Dogrulanmadi';
            
            $newPersonelId = Capsule::table('mod_btk_personel')->insertGetId($dataToSave);
            self::logAction('Personel Senkronizasyonu (Ekleme)', 'BAŞARILI', "WHMCS Admin ID: $adminId için yeni BTK Personel kaydı oluşturuldu (ID: $newPersonelId).", $logAdminId);
        }
        return true;
    }

    public static function handleAdminDelete($deletedAdminId) {
        $logAdminId = self::getCurrentAdminId();
        self::logAction('Helper: handleAdminDelete', 'UYARI', "WHMCS Admin ID: $deletedAdminId silindi. (BTK Personel kaydı güncellenecek)", $logAdminId);
        // TODO:
        // 1. mod_btk_personel tablosunda whmcs_admin_id = $deletedAdminId olan kaydı bul.
        // 2. Eğer varsa:
        //    a. whmcs_admin_id alanını NULL yap (bağlantıyı kopar).
        //    b. İstenirse isten_ayrilma_tarihi'ni set et veya btk_listesine_eklensin'i 0 yap.
        //    c. Logla.
        try {
            Capsule::table('mod_btk_personel')
                ->where('whmcs_admin_id', (int)$deletedAdminId)
                ->update([
                    'whmcs_admin_id' => null, // Bağlantıyı kopar
                    'isten_ayrilma_tarihi' => gmdate('Y-m-d'), // Opsiyonel: İşten ayrıldı say
                    'btk_listesine_eklensin' => 0 // Opsiyonel: BTK listesinden çıkar
                ]);
             self::logAction('Personel Senkronizasyonu (Admin Silme)', 'BAŞARILI', "WHMCS Admin ID: $deletedAdminId ile ilişkili BTK Personel kaydı güncellendi.", $logAdminId);
        } catch (Exception $e) {
            self::logAction('Personel Senkronizasyonu (Admin Silme) Hatası', 'HATA', $e->getMessage(), $logAdminId);
        }
    }
    
    // --- Müşteri Paneli Veri Çekme ---
    public static function getBtkClientInfoForClientArea($clientId) {
        // TODO: mod_btk_abone_rehber'den veya ilgili tablolardan müşteri için gösterilecek BTK verilerini çek.
        // Sadece "güvenli" ve "gösterilebilir" alanlar olmalı. TCKN maskelenmeli.
        // Yerleşim adresi için il/ilçe/mahalle ID'lerinden isimleri de çek.
        self::logAction('getBtkClientInfoForClientArea çağrıldı (TODO)', 'DEBUG', ['client_id' => $clientId]);
        return [
            // 'abone_tc_kimlik_no_masked' => '12*******89',
            // 'abone_adi' => 'Ahmet', 'abone_soyadi' => 'Yılmaz',
            // 'yerlesim_cadde' => 'Atatürk Cad. No:10',
            // 'yerlesim_mahalle_adi_placeholder' => 'Merkez Mah.',
            // 'yerlesim_ilce_adi_placeholder' => 'Merkez İlçe',
            // 'yerlesim_il_adi_placeholder' => 'Merkez İl'
        ];
    }
    public static function getBtkServiceInfoForClientArea($serviceId) {
        // TODO: mod_btk_abone_rehber'den veya ilgili tablolardan hizmet için gösterilecek BTK verilerini çek.
        // Tesis adresi, statik IP, ISS POP bilgisi (sunucu.SSID formatında) vb.
        self::logAction('getBtkServiceInfoForClientArea çağrıldı (TODO)', 'DEBUG', ['service_id' => $serviceId]);
        return [
            // 'tesis_adresi_yerlesim_ile_ayni' => true,
            // 'statik_ip' => '1.2.3.4',
            // 'iss_pop_bilgisi' => 'SUNUCUM.SSID_XYZ'
        ];
    }

    // --- Periyodik Kontroller (DailyCronJob için) ---
    public static function performDailyBtkChecks() {
        self::logAction('Günlük BTK Kontrolleri Başladı', 'INFO');
        // TODO:
        // 1. Vefat Durumu Sorgulama:
        //    - mod_btk_abone_rehber'deki aktif TCKN'leri NVI ile periyodik sorgula.
        //    - Vefat eden varsa, ilgili hizmetleri handleClientClose/Terminate benzeri bir mantıkla iptal et.
        // 2. Veri Tutarlılığı Kontrolleri:
        //    - WHMCS ile modül tabloları arasında (özellikle aktif/pasif hizmetler) tutarlılık kontrolü.
        //    - Eksik veya hatalı BTK verisi olan aboneler/hizmetler için log/uyarı oluşturma.
        self::logAction('Günlük BTK Kontrolleri Tamamlandı (TODO)', 'INFO');
    }
    
    // --- Yardımcı Diğer Fonksiyonlar ---
    public static function getCurrentAdminId() { return isset($_SESSION['adminid']) ? (int)$_SESSION['adminid'] : null; }
    
    public static function sendEmailNotification($to, $subject, $messageBody, $attachments = []) {
        $adminUserId = self::getCurrentAdminId();
        if (!$adminUserId) { // Cron gibi bir yerden çağrılıyorsa, ilk admini bul
             $firstAdmin = Capsule::table('tbladmins')->where('disabled',0)->orderBy('id', 'asc')->first();
             if ($firstAdmin) $adminUserId = $firstAdmin->id;
             else { self::logAction('Eposta Gönderilemedi', 'HATA', 'Gönderici admin ID bulunamadı.'); return false;}
        }

        $command = 'SendEmail';
        $postData = [
            'customtype' => 'general',
            'customsubject' => $subject,
            'custommessage' => nl2br(htmlspecialchars($messageBody)), // HTML için nl2br ve güvenlik
            'to' => $to,
            // 'deptid' => BtkHelper::get_btk_setting('email_notification_deptid'), // Ayarlardan departman ID
        ];
        
        // Ekler için WHMCS'in mail fonksiyonunu direkt kullanmak gerekebilir, localAPI attachment'ları basitçe desteklemez.
        // Şimdilik ekleri göz ardı edelim.

        try {
            $results = localAPI($command, $postData, $adminUserId);
            if ($results['result'] == 'success') {
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