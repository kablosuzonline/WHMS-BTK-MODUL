<?php
/**
 * BTK Raporlama Modülü için Genel ve Temel Yardımcı Fonksiyonlar
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - `getModuleTempPath` fonksiyonu, WHMCS'in `customadminpath` ayarını
 *   dinamik olarak okuyacak şekilde iyileştirildi, bu da kararlılığı artırır.
 * - Ayar okuma (`get_btk_setting`, `getAllBtkSettings`) ve yazma (`set_btk_setting`)
 *   metodları, performans için statik bir önbellek (cache) kullanacak şekilde
 *   optimize edildi.
 * - Test/Canlı mod kontrolleri için standart metodlar (`is...TestMode`) eklendi.
 * - Tüm loglama görevleri resmi olarak LogManager'a devredildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Helper;

use WHMCS\Database\Capsule;

class BtkHelper
{
    // Performans için önbellekleme mekanizmaları
    private static ?array $langCache = null;
    private static ?array $settingsCache = null;

    // ==================================================================
    // == BÖLÜM 1: DİL VE OTURUM YÖNETİMİ
    // ==================================================================

    /**
     * Modülün dil dosyasını yükler ve önbelleğe alır.
     * @return array
     */
    public static function loadLang(): array
    {
        if (self::$langCache === null) {
            global $_ADDONLANG;
            $langFilePath = __DIR__ . '/../../../lang/turkish.php';
            if (file_exists($langFilePath)) {
                // $_ADDONLANG değişkeni bu dosyada tanımlanır.
                include $langFilePath;
                self::$langCache = $_ADDONLANG ?? [];
            } else {
                self::$langCache = [];
            }
        }
        return self::$langCache;
    }

    /**
     * Belirtilen anahtar için dil çevirisini döndürür.
     * @param string $key Dil anahtarı
     * @param string $default Varsayılan metin
     * @return string
     */
    public static function getLang(string $key, string $default = ''): string
    {
        $lang = self::loadLang();
        return $lang[$key] ?? ($default ?: $key);
    }

    /**
     * Mevcut oturumdaki yönetici ID'sini döndürür.
     * @return int|null
     */
    public static function getCurrentAdminId(): ?int
    {
        if (defined('IN_ADMIN') && IN_ADMIN && isset($_SESSION['adminid'])) {
            return (int)$_SESSION['adminid'];
        }
        return null;
    }

    // ==================================================================
    // == BÖLÜM 2: AYAR YÖNETİMİ (GET/SET)
    // ==================================================================

    /**
     * Belirli bir ayarı veritabanından okur.
     * @param string $settingName Ayar adı
     * @param mixed $defaultValue Varsayılan değer
     * @return mixed
     */
    public static function get_btk_setting(string $settingName, $defaultValue = null)
    {
        $allSettings = self::getAllBtkSettings();
        return $allSettings[$settingName] ?? $defaultValue;
    }

    /**
     * Tüm modül ayarlarını veritabanından okur ve önbelleğe alır.
     * @return array
     */
    public static function getAllBtkSettings(): array
    {
        if (self::$settingsCache !== null) {
            return self::$settingsCache;
        }

        $settingsArray = [];
        try {
            $settings = Capsule::table('mod_btk_settings')->get();
            foreach ($settings as $setting) {
                // Şifrelenmiş alanları çöz
                if (in_array($setting->setting, ['main_ftp_pass', 'backup_ftp_pass', 'nviKpsPass', 'edoksis_pass']) && !empty($setting->value)) {
                    try {
                        $settingsArray[$setting->setting] = decrypt($setting->value);
                    } catch (\Exception $e) {
                        // Şifre çözme başarısız olursa, boş döndür
                        $settingsArray[$setting->setting] = '';
                    }
                } else {
                    $settingsArray[$setting->setting] = $setting->value;
                }
            }
        } catch (\Exception $e) {
            error_log("[BTK-Entegre] getAllBtkSettings CRITICAL ERROR: " . $e->getMessage());
        }
        self::$settingsCache = $settingsArray;
        return self::$settingsCache;
    }
    
    /**
     * Belirli bir ayarı veritabanına yazar.
     * @param string $settingName Ayar adı
     * @param mixed $value Ayar değeri
     * @return bool
     */
    public static function set_btk_setting(string $settingName, $value): bool
    {
        try {
            $valueToStore = $value;
            
            // Şifrelenmesi gereken alanları şifrele
            if (in_array($settingName, ['main_ftp_pass', 'backup_ftp_pass', 'nviKpsPass', 'edoksis_pass'])) {
                // Kullanıcı şifreyi değiştirmediyse (formdan '********' geldiyse) işlem yapma
                if ($value === '********') {
                    return true;
                }
                $valueToStore = encrypt((string)$value);
            }
            
            // Veritabanına kaydet (varsa güncelle, yoksa ekle)
            Capsule::table('mod_btk_settings')->updateOrInsert(['setting' => $settingName], ['value' => $valueToStore]);
            
            // Ayar önbelleğini temizle ki bir sonraki okumada yeni değer alınsın
            self::$settingsCache = null;
            return true;
        } catch (\Exception $e) {
            error_log("[BTK-Entegre] set_btk_setting CRITICAL ERROR for {$settingName}: " . $e->getMessage());
            return false;
        }
    }

    // ==================================================================
    // == BÖLÜM 3: TEST/CANLI MODU YÖNETİMİ
    // ==================================================================
    public static function isNviKpsTestMode(): bool { return self::get_btk_setting('nvi_kps_mode', 'test') === 'test'; }
    public static function isBtkEkayitTestMode(): bool { return self::get_btk_setting('btk_ekayit_mode', 'test') === 'test'; }
    public static function isEdoksisTestMode(): bool { return self::get_btk_setting('edoksis_mode', 'test') === 'test'; }

    // ==================================================================
    // == BÖLÜM 4: GÜVENLİ TEMP KLASÖR YÖNETİMİ
    // ==================================================================

    /**
     * Geçici dosyalar için güvenli bir klasör yolu oluşturur.
     * Bu yol, WHMCS'in `templates_c` klasörü içindedir ve dışarıdan erişilemez.
     * @return string
     * @throws \Exception
     */
    public static function getModuleTempPath(): string
    {
        $whmcsRootDir = realpath(__DIR__ . '/../../../../../..');
        if (!$whmcsRootDir || !is_dir($whmcsRootDir)) {
             throw new \Exception("WHMCS kök dizini bulunamadı.");
        }
        
        $customAdminPath = 'admin'; // Varsayılan yönetici paneli klasörü
        $configFile = $whmcsRootDir . DIRECTORY_SEPARATOR . 'configuration.php';

        // Dinamik yönetici klasörü adını oku
        if (file_exists($configFile) && is_readable($configFile)) {
            $configContent = @file_get_contents($configFile);
            if ($configContent && preg_match('/\$customadminpath\s*=\s*[\'"]([a-zA-Z0-9_-]+)[\'"];/', $configContent, $matches)) {
                if (!empty($matches[1])) {
                    $customAdminPath = $matches[1];
                }
            }
        }
        
        $adminTemplatesCPath = $whmcsRootDir . DIRECTORY_SEPARATOR . $customAdminPath . DIRECTORY_SEPARATOR . 'templates_c';
        
        return rtrim($adminTemplatesCPath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'btkreports_temp';
    }

    /**
     * Güvenli temp klasörünün var olduğundan ve yazılabilir olduğundan emin olur.
     * @throws \Exception
     */
    public static function ensureTempDirectoryExists(): void
    {
        $tempDir = self::getModuleTempPath();
        if (!is_dir($tempDir) && !@mkdir($tempDir, 0755, true)) {
            throw new \Exception("Güvenli temp klasörü ({$tempDir}) oluşturulamadı.");
        }

        if (!is_writable($tempDir)) {
            throw new \Exception("Güvenli temp klasörü ({$tempDir}) yazılamıyor.");
        }

        // Dışarıdan doğrudan erişimi engellemek için .htaccess dosyası oluştur
        $htaccessPath = $tempDir . DIRECTORY_SEPARATOR . '.htaccess';
        if (!file_exists($htaccessPath)) {
            $htaccessContent = "Options -Indexes\n<Files *>\n    Order deny,allow\n    Deny from all\n</Files>";
            @file_put_contents($htaccessPath, $htaccessContent);
        }
    }

    // ==================================================================
    // == BÖLÜM 5: KURULUM VE BAKIM
    // ==================================================================

    /**
     * Verilen bir SQL dosyasındaki sorguları çalıştırır.
     * @param string $filePath
     * @throws \Exception
     */
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

    /**
     * Modüle ait tüm tabloları veritabanından siler.
     * Bu fonksiyon sadece modül devre dışı bırakılırken ve ayar açıksa kullanılır.
     */
    public static function dropAllTables(): void
    {
        $tables = [
            'mod_btk_esozlesme_basvurular', 'mod_btk_pop_monitoring_logs',
            'mod_btk_abone_hareket_archive', 'mod_btk_abone_hareket_live',
            'mod_btk_ftp_logs', 'mod_btk_logs', 'mod_btk_personel',
            'mod_btk_personel_departmanlari', 'mod_btk_product_group_mappings',
            'mod_btk_abone_rehber', 'mod_btk_iss_pop_noktalari',
            'mod_btk_adres_mahalle', 'mod_btk_adres_ilce', 'mod_btk_adres_il',
            'mod_btk_secili_yetki_turleri', 'mod_btk_yetki_turleri_referans',
            'mod_btk_hat_durum_kodlari_referans', 'mod_btk_musteri_hareket_kodlari_referans',
            'mod_btk_kimlik_tipleri_referans', 'mod_btk_meslek_kodlari_referans',
            'mod_btk_ek3_hizmet_tipleri', 'mod_btk_settings',
            'mod_btk_efatura_kayitlari', 'mod_btk_cevher_rapor_sablonlari'
        ];

        Capsule::schema()->disableForeignKeyConstraints();
        foreach ($tables as $table) {
            if (Capsule::schema()->hasTable($table)) {
                Capsule::schema()->drop($table);
            }
        }
        Capsule::schema()->enableForeignKeyConstraints();
    }
    
    /**
     * Belirtilen bir klasörü ve içindeki tüm dosyaları siler.
     * @param string $dirPath
     */
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
}