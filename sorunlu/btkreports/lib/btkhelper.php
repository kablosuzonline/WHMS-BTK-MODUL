<?php
// --- BÖLÜM 1 / 2 BAŞI - (lib/btkhelper.php, v2.0.3 - mod_btk_config uyumlu ayar metodları)

if (!defined("WHMCS")) {
    die("Bu dosyaya doğrudan erişilemez.");
}

use WHMCS\Database\Capsule;
use WHMCS\Config\Setting as WhmcsSystemSetting;

class BtkHelper
{
    private static $configRowId = 1; // mod_btk_config tablosunda tek bir satır olduğunu varsayıyoruz (ID=1)

    /**
     * Belirtilen ayarın (sütunun) değerini mod_btk_config tablosundan alır.
     */
    public static function getSetting(string $columnName, $defaultValue = null)
    {
        try {
            $config = Capsule::table('mod_btk_config')->find(self::$configRowId);
            if ($config && property_exists($config, $columnName)) {
                return $config->$columnName;
            }
            // Ayar bulunamazsa veya sütun yoksa, initial_reference_data.sql'deki
            // varsayılanları (eğer config tablosu boşsa) kontrol etmeliyiz veya defaultValue dönmeliyiz.
            // Şimdilik, eğer sütun yoksa defaultValue dönüyoruz.
            // self::moduleLog('BtkHelper::getSetting Warning', ['column' => $columnName], 'Sütun bulunamadı veya ayar yok, varsayılan dönülüyor.', ['warning']);
            return $defaultValue;
        } catch (\Exception $e) {
            self::moduleLog('BtkHelper::getSetting Error', ['column' => $columnName], $e->getMessage(). ' - Trace: ' . $e->getTraceAsString(), ['error']);
            return $defaultValue;
        }
    }

    /**
     * Belirtilen tek bir ayarı (sütunu) mod_btk_config tablosuna kaydeder/günceller.
     * ÖNEMLİ: Şifre gibi hassas veriler bu fonksiyona gönderilmeden ÖNCE şifrelenmelidir.
     */
    public static function saveSetting(string $columnName, $value): bool
    {
        try {
            // Önce satır var mı diye kontrol et, yoksa oluştur (ID=1 ile)
            if (!Capsule::table('mod_btk_config')->where('id', self::$configRowId)->exists()) {
                Capsule::table('mod_btk_config')->insert(['id' => self::$configRowId, $columnName => $value, 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
            } else {
                Capsule::table('mod_btk_config')
                    ->where('id', self::$configRowId)
                    ->update([$columnName => $value, 'updated_at' => date('Y-m-d H:i:s')]);
            }
            return true;
        } catch (\Exception $e) {
            self::moduleLog('BtkHelper::saveSetting Error', ['column' => $columnName, 'value_type' => gettype($value)], $e->getMessage(). ' - Trace: ' . $e->getTraceAsString(), ['error']);
            return false;
        }
    }
    
    /**
     * Bir dizi ayarı (sütun => değer) mod_btk_config tablosuna kaydeder/günceller.
     */
    public static function saveSettingsArray(array $settingsToSave): bool
    {
        if (empty($settingsToSave)) {
            return true;
        }
        try {
            $settingsToSave['updated_at'] = date('Y-m-d H:i:s');
            if (!Capsule::table('mod_btk_config')->where('id', self::$configRowId)->exists()) {
                $settingsToSave['id'] = self::$configRowId;
                $settingsToSave['created_at'] = date('Y-m-d H:i:s');
                Capsule::table('mod_btk_config')->insert($settingsToSave);
            } else {
                Capsule::table('mod_btk_config')->where('id', self::$configRowId)->update($settingsToSave);
            }
            return true;
        } catch (\Exception $e) {
            self::moduleLog('BtkHelper::saveSettingsArray Error', ['keys_to_save' => array_keys($settingsToSave)], $e->getMessage(). ' - Trace: ' . $e->getTraceAsString(), ['error']);
            return false;
        }
    }


    /**
     * Tüm modül ayarlarını (mod_btk_config tablosundaki tüm sütunları) bir nesne veya dizi olarak alır.
     */
    public static function getAllSettings($returnAsObject = false)
    {
        try {
            $config = Capsule::table('mod_btk_config')->find(self::$configRowId);
            if (!$config) { // Eğer satır yoksa, initial_reference_data'dan okumayı dene veya boş döndür
                // Bu durumda initial_reference_data.sql çalıştırılmalı veya manuel eklenmeli
                // Şimdilik boş döndürelim ki config sayfası hata vermesin
                self::moduleLog('BtkHelper::getAllSettings Warning', [], 'mod_btk_config tablosunda ID=1 olan kayıt bulunamadı.', ['warning']);
                 return $returnAsObject ? (object)[] : [];
            }
            return $returnAsObject ? $config : (array)$config;
        } catch (\Exception $e) {
            self::moduleLog('BtkHelper::getAllSettings Error', [], $e->getMessage(). ' - Trace: ' . $e->getTraceAsString(), ['error']);
            return $returnAsObject ? null : [];
        }
    }
    
    // === ŞİFRELEME ===
    // Bu fonksiyonlar aynı kalabilir.
    public static function encryptPassword(string $password): ?string { if(function_exists('encrypt')){return encrypt($password);} self::moduleLog('BtkHelper::encryptPassword Error', 'encrypt() bulunamadı'); return null;}
    public static function decryptPassword(string $encryptedPassword): ?string { if(empty($encryptedPassword)) return null; if(function_exists('decrypt')){try{return decrypt($encryptedPassword);}catch(\Exception $e){/*log*/return null;}}  self::moduleLog('BtkHelper::decryptPassword Error', 'decrypt() bulunamadı'); return null;}

    // === FTP AYARLARI ===
    // Bu metod, getAllSettings() ile tüm config'i alıp ilgili sütunları döndürecek şekilde güncellendi.
    public static function getFtpSettings(string $type = 'ana'): array
    {
        $config = self::getAllSettings(true); // Ayarları nesne olarak al
        if (empty($config) || !is_object($config)) return [/* varsayılan boş değerler */];

        $hostCol = 'ftp_host' . ($type === 'yedek' ? '_yedek' : '');
        $portCol = 'ftp_port' . ($type === 'yedek' ? '_yedek' : '');
        $userCol = 'ftp_username' . ($type === 'yedek' ? '_yedek' : '');
        $passCol = 'ftp_password' . ($type === 'yedek' ? '_yedek' : '');
        $rehberCol = 'ftp_path_rehber' . ($type === 'yedek' ? '_yedek' : '');
        $hareketCol = 'ftp_path_hareket' . ($type === 'yedek' ? '_yedek' : '');
        $personelCol = 'ftp_path_personel' . ($type === 'yedek' ? '_yedek' : '');
        $passiveCol = 'ftp_passive_mode' . ($type === 'yedek' ? '_yedek' : '');
        // $sslCol = 'ftp_use_ssl' . ($type === 'yedek' ? '_yedek' : '');

        $rawPassword = property_exists($config, $passCol) ? $config->$passCol : null;

        return [
            'host'             => property_exists($config, $hostCol) ? $config->$hostCol : null,
            'port'             => (int)(property_exists($config, $portCol) ? $config->$portCol : 21),
            'kullanici'        => property_exists($config, $userCol) ? $config->$userCol : null,
            'sifre_ham'        => $rawPassword,
            'sifre_cozulmus'   => $rawPassword ? self::decryptPassword($rawPassword) : null,
            'rehber_klasor'    => rtrim(property_exists($config, $rehberCol) ? $config->$rehberCol : '/', '/') . '/',
            'hareket_klasor'   => rtrim(property_exists($config, $hareketCol) ? $config->$hareketCol : '/', '/') . '/',
            'personel_klasor'  => rtrim(property_exists($config, $personelCol) ? $config->$personelCol : '/', '/') . '/',
            'pasif_mod'        => (bool)(property_exists($config, $passiveCol) ? $config->$passiveCol : true),
            // 'use_ssl'       => (bool)(property_exists($config, $sslCol) ? $config->$sslCol : false),
        ];
    }

    // === MODÜL YOL VE LİNKLERİ === (Aynı kalabilir)
    public static function getModulePath(): string { return dirname(__DIR__); }
    public static function getAdminFolderName(): string { if (class_exists('\WHMCS\Config\Setting')) { return \WHMCS\Config\Setting::getValue('AdminFolder') ?: 'admin'; } return 'admin'; }
    
    // === TARİH VE SAAT İŞLEMLERİ === (Aynı kalabilir)
    public static function formatBtkDateTime($dateTimeInput = null): string { /* ... v2.0.1'deki gibi ... */ if (class_exists('\WHMCS\Carbon')) { try { $c = ($dateTimeInput instanceof \WHMCS\Carbon) ? $dateTimeInput : new \WHMCS\Carbon($dateTimeInput); return $c->format('YmdHis'); } catch (\Exception $e) { return \WHMCS\Carbon::now()->format('YmdHis'); } } try { $dt = new \DateTime($dateTimeInput ?? 'now'); return $dt->format('YmdHis'); } catch (\Exception $e) { return date('YmdHis'); } }
    public static function formatBtkDate($dateInput = null): string { /* ... v2.0.1'deki gibi ... */ if (empty(trim((string)$dateInput)) || $dateInput === '0000-00-00' || $dateInput === '00000000') { return ""; } if (class_exists('\WHMCS\Carbon')) { try { $c = ($dateInput instanceof \WHMCS\Carbon) ? $dateInput : new \WHMCS\Carbon($dateInput); return $c->format('Ymd'); } catch (\Exception $e) {} } try { $dt = new \DateTime($dateInput); return $dt->format('Ymd'); } catch (\Exception $e) { return ""; } }

// --- BÖLÜM 1 / 2 SONU - (lib/btkhelper.php, v2.0.3 - mod_btk_config uyumlu ayar metodları)
// --- BÖLÜM 2 / 2 BAŞI - (lib/btkhelper.php, v2.0.3 - Kapsamlı Fonksiyonlar Devamı)

    // === DOSYA İŞLEMLERİ === (getSetting çağrıları güncellenmeli)
    public static function generateReportFileName(string $operatorName, string $operatorCode, string $authTypeShortCode, string $reportType, string $cnt = '01', $timestamp = null): string
    {
        // operatorName ve operatorCode config'den okunmalı
        $opNameFromSetting = self::getSetting('operator_adi', $operatorName); // mod_btk_config'deki sütun adı
        $opCodeFromSetting = self::getSetting('operator_kodu', $operatorCode); // mod_btk_config'deki sütun adı

        $ts = self::formatBtkDateTime($timestamp);
        $safeOperatorName = strtoupper(self::turkishtoEnglish(str_replace(' ', '', trim($opNameFromSetting))));
        $safeAuthType = strtoupper(trim($authTypeShortCode));
        $safeReportType = strtoupper(trim($reportType));
        $safeCnt = str_pad(trim($cnt), 2, '0', STR_PAD_LEFT);
        return "{$safeOperatorName}_{$opCodeFromSetting}_{$safeAuthType}_ABONE_{$safeReportType}_{$ts}_{$safeCnt}.abn";
    }
    
    public static function generatePersonnelReportFileName(string $operatorName, string $year, string $periodSuffix, string $ftpType = 'ana'): string
    {
        $safeOperatorName = strtoupper(self::turkishtoEnglish(str_replace(' ', '', trim($operatorName))));
        // mod_btk_config'deki sütun adları kullanılmalı
        $configKey = ($ftpType === 'yedek') ? 'personel_dosya_adi_yedek_ftp_tarih_ekle' : 'personel_dosya_adi_ana_ftp_tarih_ekle';
        $addDateToFileName = (bool)self::getSetting($configKey, ($ftpType === 'yedek')); 
        
        if ($addDateToFileName) {
             return "{$safeOperatorName}_Personel_Listesi_{$year}_{$periodSuffix}.xlsx";
        }
        return "Personel_Listesi.xlsx";
    }

    public static function compressToGz(string $sourceFilePath, string $destinationFilePath): bool
    {
        // ... (İçerik aynı, v2.0.1'deki gibi) ...
        if (!extension_loaded('zlib')) { self::moduleLog('BtkHelper::compressToGz Error', ['source' => $sourceFilePath], 'Zlib eklentisi yüklü değil.'); return false; }
        if (!file_exists($sourceFilePath) || !is_readable($sourceFilePath)) { self::moduleLog('BtkHelper::compressToGz Error', ['source' => $sourceFilePath], 'Kaynak dosya bulunamadı/okunamıyor.'); return false; }
        $gz = @gzopen($destinationFilePath, 'wb9');
        if ($gz === false) { self::moduleLog('BtkHelper::compressToGz Error', ['dest' => $destinationFilePath], 'GZIP dosyası açılamadı.'); return false; }
        $fp = @fopen($sourceFilePath, 'rb');
        if ($fp === false) { gzclose($gz); self::moduleLog('BtkHelper::compressToGz Error', ['source' => $sourceFilePath], 'Kaynak dosya okunamadı.'); return false; }
        while (!feof($fp)) { if (gzwrite($gz, fread($fp, 8192 * 2)) === false) { fclose($fp); gzclose($gz); self::moduleLog('BtkHelper::compressToGz Error', ['dest' => $destinationFilePath], 'GZIP yazma hatası.'); return false;}}
        fclose($fp); $closed = gzclose($gz);
        if (!$closed || !file_exists($destinationFilePath)) { self::moduleLog('BtkHelper::compressToGz Error', ['dest' => $destinationFilePath], 'GZIP kapatılamadı/bulunamadı.'); return false; }
        return true;
    }
    
    public static function getTempReportPath(): string|false
    {
        // ... (İçerik aynı, v2.0.1'deki gibi) ...
        $tempDir = self::getModulePath() . '/temp_reports';
        if (!is_dir($tempDir)) { if (!@mkdir($tempDir, 0775, true) && !is_dir($tempDir)) { self::moduleLog('BtkHelper::getTempReportPath Error', $tempDir, 'Geçici klasör oluşturulamadı.'); return false;}}
        if (!is_writable($tempDir)) { self::moduleLog('BtkHelper::getTempReportPath Error', $tempDir, 'Geçici klasör yazılabilir değil.'); return false;}
        return rtrim($tempDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    }

    // === STRING İŞLEMLERİ === (Aynı kalabilir)
    public static function turkishtoEnglish(string $text): string { /* ... */ $s = ['ç','Ç','ğ','Ğ','ı','İ','ö','Ö','ş','Ş','ü','Ü']; $r = ['c','C','g','G','i','I','o','O','s','S','u','U']; return str_replace($s, $r, $text); }
    public static function toUpperTr(?string $text): ?string { if ($text === null) return null; return mb_strtoupper(trim($text), 'UTF-8'); }
    public static function sanitizeForBtkReportField(?string $value, ?int $maxLength = null, bool $toUpperCaseTr = true): string { /* ... v2.0.1'deki gibi ... */  if ($value === null || trim($value) === '') { return "";} $value = trim($value); $value = str_replace(['|', ';', "\r\n", "\n", "\r"], [' ', ' ', ' ', ' ', ' '], $value); $value = preg_replace('/\s+/', ' ', $value); if ($toUpperCaseTr) { $value = self::toUpperTr($value); } if ($maxLength !== null && mb_strlen($value, 'UTF-8') > $maxLength) { $value = mb_substr($value, 0, $maxLength, 'UTF-8');} return $value; }

    // === LOGLAMA === (Aynı kalabilir)
    public static function moduleLog(string $action, $request, $response = '', $processedDataOrTrace = '', array $type = ['info']): void { /* ... v2.0.1'deki gibi ... */ }
}

// --- BÖLÜM 2 / 2 SONU - (lib/btkhelper.php, v2.0.3 - Kapsamlı Fonksiyonlar Devamı)