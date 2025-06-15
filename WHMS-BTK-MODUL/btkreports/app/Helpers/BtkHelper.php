<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Helpers;

// WHMCS ve diğer gerekli sınıfları kullanmak için
use WHMCS\Database\Capsule;
use WHMCS\Config\Setting as WhmcsConfigSetting;
use WHMCS\Security\Encryption;
use WHMCS\Carbon;
use WHMCS\Module\Addon\BtkRaporlari\Services\LogService; // Loglama için

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

/**
 * Class BtkHelper
 *
 * BTK Raporları modülü için genel yardımcı fonksiyonları içerir.
 */
class BtkHelper
{
    /**
     * Modül ayarlarından bir değeri okur.
     *
     * @param string $settingName Ayar adı
     * @param mixed $defaultValue Ayar bulunamazsa dönecek varsayılan değer
     * @return mixed Ayarın değeri veya varsayılan değer
     */
    public static function getSetting($settingName, $defaultValue = null)
    {
        try {
            $setting = Capsule::table('mod_btk_ayarlar')
                ->where('ayar_adi', $settingName)
                ->first();

            if ($setting) {
                if (in_array($settingName, ['ftp_ana_sifre', 'ftp_yedek_sifre'])) {
                    return self::decryptData($setting->ayar_degeri);
                }
                return $setting->ayar_degeri;
            }
        } catch (\Exception $e) {
            if (function_exists('logActivity')) {
                logActivity("BTK Modülü - getSetting Hata ({$settingName}): " . $e->getMessage(), 0);
            }
            return $defaultValue;
        }
        return $defaultValue;
    }

    /**
     * Modül ayarlarından birden fazla değeri okur.
     * @param array $settingNames
     * @return array
     */
    public static function getSettings(array $settingNames)
    {
        $settings = [];
        foreach ($settingNames as $name) {
            $settings[$name] = self::getSetting($name);
        }
        return $settings;
    }

    /**
     * Bir modül ayarını kaydeder veya günceller.
     * @param string $settingName
     * @param mixed $settingValue
     * @return bool
     */
    public static function saveSetting($settingName, $settingValue)
    {
        try {
            $valueToSave = $settingValue;
            if (in_array($settingName, ['ftp_ana_sifre', 'ftp_yedek_sifre'])) {
                if (!empty($settingValue)) {
                     $valueToSave = self::encryptData((string)$settingValue);
                } else {
                    $currentEncrypted = Capsule::table('mod_btk_ayarlar')
                                        ->where('ayar_adi', $settingName)
                                        ->value('ayar_degeri');
                    if(!empty($currentEncrypted) && $settingValue === '') {
                        $valueToSave = '';
                    } else if (empty($currentEncrypted) && $settingValue === '') {
                         $valueToSave = '';
                    }
                }
            }

            Capsule::table('mod_btk_ayarlar')
                ->updateOrInsert(
                    ['ayar_adi' => $settingName],
                    ['ayar_degeri' => $valueToSave, 'updated_at' => Carbon::now()]
                );
            return true;
        } catch (\Exception $e) {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                 LogService::add("Modül ayarı kaydedilirken hata: {$settingName} - " . $e->getMessage(), 'ERROR', 'SETTING_SAVE_ERROR', ['exception' => (string)$e, 'setting' => $settingName]);
            }
            return false;
        }
    }

    /**
     * Veriyi WHMCS'in şifreleme metodunu kullanarak şifreler.
     * @param string $data
     * @return string
     */
    public static function encryptData($data)
    {
        if ($data === null || $data === '') return '';
        if (function_exists('localAPI')) {
            $result = localAPI('EncryptPassword', ['password2bencrypted' => $data]);
            return $result['password'] ?? '';
        } elseif (class_exists('WHMCS\Security\Encryption')) {
            return Encryption::encipher($data);
        }
        if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
            LogService::add("Veri şifrelenemedi: localAPI veya Encryption sınıfı bulunamadı.", "ERROR", "ENCRYPTION_ERROR");
        }
        return $data;
    }

    /**
     * Veriyi WHMCS'in şifreleme metodunu kullanarak çözer.
     * @param string $encryptedData
     * @return string
     */
    public static function decryptData($encryptedData)
    {
        if ($encryptedData === null || $encryptedData === '') return '';
        if (function_exists('localAPI')) {
            $result = localAPI('DecryptPassword', ['password2bdecrypted' => $encryptedData]);
            return $result['password'] ?? '';
        } elseif (class_exists('WHMCS\Security\Encryption')) {
            return Encryption::decipher($encryptedData);
        }
         if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
            LogService::add("Veri çözülemedi: localAPI veya Encryption sınıfı bulunamadı.", "ERROR", "DECRYPTION_ERROR");
        }
        return $encryptedData;
    }

    /**
     * BTK raporları için standart tarih-saat formatını (YYYYAAGGSSDDSS) oluşturur.
     * @param string|Carbon|null $timestamp
     * @return string
     */
    public static function getBtkDateTimeFormat($timestamp = null)
    {
        try {
            if ($timestamp instanceof Carbon) return $timestamp->format('YmdHis');
            if (is_string($timestamp) && !empty($timestamp)) return Carbon::parse($timestamp)->format('YmdHis');
            return Carbon::now()->format('YmdHis');
        } catch (\Exception $e) {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("getBtkDateTimeFormat Hata: " . $e->getMessage(), 'WARNING', 'DATE_FORMAT_ERROR', ['timestamp' => $timestamp]);
            }
            return Carbon::now()->format('YmdHis');
        }
    }

    /**
     * BTK raporları için standart tarih formatını (YYYYAAGG) oluşturur.
     * @param string|Carbon|null $timestamp
     * @return string
     */
    public static function getBtkDateFormat($timestamp = null)
    {
         try {
            if ($timestamp instanceof Carbon) return $timestamp->format('Ymd');
            if (is_string($timestamp) && !empty($timestamp)) return Carbon::parse($timestamp)->format('Ymd');
            return Carbon::now()->format('Ymd');
        } catch (\Exception $e) {
             if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("getBtkDateFormat Hata: " . $e->getMessage(), 'WARNING', 'DATE_FORMAT_ERROR', ['timestamp' => $timestamp]);
            }
            return Carbon::now()->format('Ymd');
        }
    }

    /**
     * YYYYAAGGSSDDSS veya YYYYAAGG formatındaki BTK tarihini insan tarafından okunabilir hale getirir.
     * @param string $btkDateString
     * @param string $outputFormat
     * @return string
     */
    public static function btkDateToHumanFormat($btkDateString, $outputFormat = 'd.m.Y H:i:s')
    {
        if (empty($btkDateString) || $btkDateString === '00000000000000' || $btkDateString === '00000000') return '';
        try {
            if (strlen($btkDateString) === 14) {
                return Carbon::createFromFormat('YmdHis', $btkDateString)->format($outputFormat);
            } elseif (strlen($btkDateString) === 8) {
                if ($outputFormat === 'd.m.Y H:i:s') $outputFormat = 'd.m.Y';
                return Carbon::createFromFormat('Ymd', $btkDateString)->format($outputFormat);
            }
        } catch (\Exception $e) {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("btkDateToHumanFormat Hata: {$btkDateString} - " . $e->getMessage(), 'DEBUG', 'DATE_PARSE_ERROR');
            }
        }
        return $btkDateString;
    }

    /**
     * BTK referans tablolarından bir kodun açıklamasını veya belirtilen bir alanı alır.
     * @param string $refTableKey
     * @param string $kod
     * @param string $defaultAciklama
     * @param string $kodSutunAdi
     * @param string $aciklamaSutunAdi
     * @return string
     */
    public static function getBtkReferenceValue($refTableKey, $kod, $defaultAciklama = '', $kodSutunAdi = 'kod', $aciklamaSutunAdi = 'aciklama')
    {
        if ($kod === null || $kod === '') return $defaultAciklama;
        $tableName = 'mod_btk_ref_' . strtolower($refTableKey);
        try {
            $refData = Capsule::table($tableName)->where($kodSutunAdi, $kod)->first([$aciklamaSutunAdi]);
            return $refData ? $refData->$aciklamaSutunAdi : $defaultAciklama;
        } catch (\Exception $e) {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("Referans veri alınırken hata: Tablo {$tableName}, Kod {$kod} - " . $e->getMessage(), 'WARNING', 'REF_DATA_ERROR', ['table' => $tableName, 'code' => $kod]);
            }
            return $defaultAciklama;
        }
    }

    /**
     * Verilen dosyayı GZIP formatında sıkıştırır.
     * @param string $sourceFilePath
     * @return string|false
     */
    public static function compressToGz($sourceFilePath)
    {
        if (!file_exists($sourceFilePath) || !is_readable($sourceFilePath)) {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("GZIP sıkıştırma hatası: Kaynak dosya bulunamadı veya okunamıyor: {$sourceFilePath}", 'ERROR', 'GZIP_ERROR_SOURCE_FILE');
            }
            return false;
        }
        $gzFilePath = $sourceFilePath . '.gz';
        $zp = @gzopen($gzFilePath, 'w9');
        if (!$zp) {
             if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("GZIP sıkıştırma hatası: GZ dosyası açılamadı/oluşturulamadı: {$gzFilePath}", 'ERROR', 'GZIP_ERROR_OPEN_GZ');
            }
            return false;
        }
        $fp = @fopen($sourceFilePath, 'rb');
        if (!$fp) {
            @gzclose($zp);
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("GZIP sıkıştırma hatası: Kaynak dosya okumak için açılamadı: {$sourceFilePath}", 'ERROR', 'GZIP_ERROR_OPEN_SOURCE');
            }
            return false;
        }
        while (!feof($fp)) {
            @gzwrite($zp, fread($fp, 4096));
        }
        @fclose($fp);
        @gzclose($zp);
        if (file_exists($gzFilePath) && filesize($gzFilePath) > 0) {
            return $gzFilePath;
        } else {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("GZIP sıkıştırma hatası: Sıkıştırılmış dosya oluşturulamadı veya boş: {$gzFilePath}", 'ERROR', 'GZIP_ERROR_CREATE_GZ');
            }
            if (file_exists($gzFilePath)) @unlink($gzFilePath);
            return false;
        }
    }

    /**
     * Geçici raporlar için klasör yolunu döndürür ve yoksa oluşturur.
     * @return string|false
     */
    public static function getTempReportsDir()
    {
        $ds = DIRECTORY_SEPARATOR;
        $tempDir = dirname(__DIR__, 3) . $ds . 'temp_reports' . $ds;
        if (!is_dir($tempDir)) {
            if (!@mkdir($tempDir, 0755, true)) {
                if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                    LogService::add("Geçici rapor klasörü oluşturulamadı: {$tempDir}. İzinleri kontrol edin.", 'CRITICAL', 'TEMP_DIR_CREATE_FAIL');
                }
                return false;
            }
            @file_put_contents($tempDir . '.htaccess', "Order allow,deny\nDeny from all");
        }
        if (!is_writable($tempDir)) {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
                LogService::add("Geçici rapor klasörüne yazma izni yok: {$tempDir}", 'CRITICAL', 'TEMP_DIR_NOT_WRITABLE');
            }
            return false;
        }
        return $tempDir;
    }

    /**
     * Belirtilen klasördeki belirli bir desene uyan dosyaları siler.
     * @param string $directory
     * @param string $pattern
     * @return void
     */
    public static function cleanupTempFiles($directory, $pattern = "*.*")
    {
        if (!is_dir($directory)) return;
        $files = glob($directory . $pattern);
        if ($files === false) return;
        $deletedCount = 0;
        foreach ($files as $file) {
            if (is_file($file)) {
                if (@unlink($file)) $deletedCount++;
            }
        }
        if ($deletedCount > 0 && class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
            LogService::add("{$deletedCount} adet geçici dosya ('{$pattern}') {$directory} klasöründen temizlendi.", 'DEBUG', 'TEMP_FILES_CLEANUP');
        }
    }

    /**
     * WHMCS'in sistem URL'sini alır.
     * @return string
     */
    public static function getSystemUrl()
    {
        return WhmcsConfigSetting::getValue('SystemURL');
    }

    /**
     * Modülün admin sayfasının URL'sini oluşturur.
     * @param array $params
     * @return string
     */
    public static function getModuleAdminUrl(array $params = [])
    {
        $systemUrl = rtrim(self::getSystemUrl(), '/');
        $adminFolderName = WhmcsConfigSetting::getValue('customadminpath');
        if (empty($adminFolderName) || !is_string($adminFolderName)) {
            try {
                if (class_exists('\DI') && \DI::has('config')) {
                    $adminPanelDirectory = \DI::get('config')->admin_protected_panel_directory_name;
                    if (!empty($adminPanelDirectory)) $adminFolderName = $adminPanelDirectory;
                }
            } catch (\Throwable $th) {}
            if (empty($adminFolderName)) $adminFolderName = 'admin';
        }
        $url = $systemUrl . '/' . $adminFolderName . '/addonmodules.php?module=btkreports';
        if (!empty($params)) $url .= '&' . http_build_query($params);
        return $url;
    }

    /**
     * Verilen bir dizideki değerin boş olup olmadığını kontrol eder.
     * @param array $array
     * @param string $key
     * @return bool
     */
    public static function isValueEmptyInArray(array $array, $key)
    {
        return !isset($array[$key]) || trim((string)$array[$key]) === '';
    }

    /**
     * Genel loglama fonksiyonu. LogService::add metodunu çağırır.
     * Bu metodun burada olması, diğer servislerin LogService'e direkt bağımlı olmadan
     * log atabilmesi için bir kolaylık sağlar, ancak LogService'in yüklenmiş olması gerekir.
     * @param string $message
     * @param int $adminId
     * @param string $level
     * @param array $details
     * @param string|null $islem
     */
    public static function logActivity($message, $adminId = 0, $level = 'INFO', $details = [], $islem = null)
    {
        if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
            LogService::add($message, $level, $islem, $details, $adminId);
        } elseif (function_exists('logActivity')) { // WHMCS global log (fallback)
            $logEntry = "BTK Modülü [{$level}]" . ($islem ? " ({$islem})" : "") . ": {$message}";
            if (!empty($details)) {
                if (isset($details['exception']) && is_object($details['exception']) && $details['exception'] instanceof \Exception) {
                    $logEntry .= " - Detay: " . get_class($details['exception']) . ": " . $details['exception']->getMessage();
                } elseif (isset($details['exception']) && is_string($details['exception'])) {
                     $logEntry .= " - Detay: " . $details['exception'];
                } else {
                     $logEntry .= " - Detay: " . json_encode($details);
                }
            }
            // WHMCS logActivity'nin 3. parametresi array $opts bekler.
            // Hata seviyesini bu opts içinde geçirebiliriz veya basitçe userId ile çağırabiliriz.
            // $opts = ['error_level' => (strtoupper($level) === 'ERROR' || strtoupper($level) === 'CRITICAL')];
            // logActivity($logEntry, $adminId, $opts);
            // Şimdilik sadece userId ile çağıralım, WHMCS bunu kendi log seviyesine göre işler.
            logActivity($logEntry, $adminId);
        }
    }

} // Sınıf sonu
?>