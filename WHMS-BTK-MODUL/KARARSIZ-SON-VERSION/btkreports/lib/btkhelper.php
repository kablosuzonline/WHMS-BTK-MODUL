<?php
/**
 * WHMCS BTK Raporlama Modülü - Yardımcı Fonksiyonlar Sınıfı/Dosyası
 * Dosya Adı: btkhelper.php
 * Version: 6.0.3 (FTP Testi, Initial Data Yükleme ve Kontrolü Fonksiyonları)
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;

class BtkHelper {

    /**
     * Modüle özel log mesajı oluşturur.
     * WHMCS Sistem Loglarına (Activity Log > Module Log) yazar.
     *
     * @param string $actionName İşlemin adı (örn: FTPTest, ConfigSave)
     * @param array|string $requestData İşlemle ilgili istek verisi
     * @param array|string $responseData İşlem sonucu veya mesajı
     * @param string $level Log seviyesi (info, error, warning, debug)
     */
    private static function logBtkMessage($actionName, $requestData, $responseData, $level = 'info') {
        $logRequest = is_array($requestData) ? json_encode($requestData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : (string) $requestData;
        $logResponse = is_array($responseData) ? json_encode($responseData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : (string) $responseData;

        if (function_exists('logModuleCall')) {
            logModuleCall('btkreports', $actionName . ' [' . strtoupper($level) . ']', $logRequest, $logResponse, $logResponse, null);
        } else {
            logActivity("BTK Raporlama Modülü [{$level}]: Action: {$actionName} - Request: {$logRequest} - Response: {$logResponse}");
        }
    }

    /**
     * Verilen parametrelerle FTP sunucusuna bağlantıyı test eder.
     *
     * @param array $params FTP bağlantı parametreleri
     * @return array ['status' => 'success'|'error', 'message' => string]
     */
    public static function testFtpConnection(array $params) {
        $actionName = 'FTPBaglantiTesti';
        self::logBtkMessage($actionName, $params, "FTP Testi başlatıldı.");

        $host = isset($params['host']) ? trim($params['host']) : '';
        $port = isset($params['port']) ? (int)$params['port'] : 21;
        $username = isset($params['username']) ? trim($params['username']) : '';
        $password = isset($params['password']) ? $params['password'] : '';
        $use_ssl = isset($params['use_ssl']) ? (bool)$params['use_ssl'] : false;
        $passive_mode = isset($params['passive_mode']) ? (bool)$params['passive_mode'] : true;
        $timeout = 20;

        if (empty($host)) {
            self::logBtkMessage($actionName, $params, "Hata: FTP Host boş.", 'error');
            return ['status' => 'error', 'message' => 'FTP Host Adresi boş bırakılamaz.'];
        }
        if (empty($username)) {
            self::logBtkMessage($actionName, $params, "Hata: FTP Kullanıcı Adı boş.", 'error');
            return ['status' => 'error', 'message' => 'FTP Kullanıcı Adı boş bırakılamaz.'];
        }

        $conn_id = null;
        $errorMessages = [];
        $original_error_handler = set_error_handler(function($errno, $errstr, $errfile, $errline) use (&$errorMessages) {
            if (strpos(strtolower($errstr), 'ftp_') !== false) {
                $errorMessages[] = "PHP FTP Fonksiyon Hatası: {$errstr} (Dosya: {$errfile}, Satır: {$errline})";
            }
            return true;
        });

        try {
            self::logBtkMessage($actionName, ['h' => $host, 'p' => $port, 'ssl' => $use_ssl], "Bağlantı deneniyor ({$timeout}sn)...");
            if ($use_ssl) {
                if (!function_exists('ftp_ssl_connect')) {
                    $msg = 'PHP SSL FTP (ftp_ssl_connect) sunucunuzda etkin değil. PHP OpenSSL eklentisini kontrol edin.';
                    $errorMessages[] = $msg; throw new Exception($msg);
                }
                $conn_id = @ftp_ssl_connect($host, $port, $timeout);
            } else {
                if (!function_exists('ftp_connect')) {
                    $msg = 'PHP FTP (ftp_connect) sunucunuzda etkin değil.';
                    $errorMessages[] = $msg; throw new Exception($msg);
                }
                $conn_id = @ftp_connect($host, $port, $timeout);
            }

            if (!$conn_id) {
                $errorMessages[] = "FTP sunucusuna bağlanılamadı ({$host}:{$port}). Ayarları veya güvenlik duvarını kontrol edin.";
                throw new Exception("FTP Bağlantı hatası.");
            }
            self::logBtkMessage($actionName, ['h' => $host, 'p' => $port], "Sunucuya bağlantı sağlandı.");

            self::logBtkMessage($actionName, ['u' => $username], "Giriş deneniyor...");
            if (!@ftp_login($conn_id, $username, $password)) {
                $errorMessages[] = "FTP sunucusuna giriş yapılamadı. Kullanıcı adı veya şifre hatalı olabilir.";
                throw new Exception("FTP Giriş hatası.");
            }
            self::logBtkMessage($actionName, ['u' => $username], "Giriş başarılı.");

            self::logBtkMessage($actionName, ['passive' => $passive_mode], "Pasif mod ayarlanıyor...");
            if (!@ftp_pasv($conn_id, $passive_mode)) {
                self::logBtkMessage($actionName, $params, "Uyarı: Pasif mod ayarlanamadı.", 'warning');
                $errorMessages[] = "Pasif mod ayarlanamadı (Bu bazı sunucularda sorun olmayabilir).";
            } else {
                 self::logBtkMessage($actionName, ['passive' => $passive_mode], "Pasif mod ayarlandı.");
            }

            self::logBtkMessage($actionName, [], "Mevcut dizin alınıyor (PWD)...");
            $pwd = @ftp_pwd($conn_id);
            if ($pwd === false) {
                self::logBtkMessage($actionName, $params, "Uyarı: PWD komutu başarısız.", 'warning');
                $errorMessages[] = "Giriş başarılı ancak mevcut dizin bilgisi alınamadı.";
            } else {
                 self::logBtkMessage($actionName, ['pwd' => $pwd], "Mevcut dizin: {$pwd}");
            }

            @ftp_close($conn_id);
            restore_error_handler();
            $successMsg = 'Bağlantı başarılı!' . ($pwd ? ' Mevcut dizin: ' . htmlspecialchars($pwd) : ' (Dizin bilgisi alınamadı)');
            self::logBtkMessage($actionName, $params, "FTP Testi Tamamlandı. Sonuç: BAŞARILI. {$successMsg}");
            return ['status' => 'success', 'message' => $successMsg];

        } catch (Exception $e) {
            if ($conn_id && (is_resource($conn_id) || (is_object($conn_id) && get_class($conn_id) === 'FTP\Connection'))) @ftp_close($conn_id);
            restore_error_handler();
            $finalErrorMessage = $e->getMessage();
            if (!empty($errorMessages)) {
                $finalErrorMessage = implode('; ', $errorMessages) . " (İstisna: " . $e->getMessage() .")";
            }
            self::logBtkMessage($actionName, $params, "HATA: " . $finalErrorMessage, 'error');
            return ['status' => 'error', 'message' => $finalErrorMessage];
        }
    }

    /**
     * Veritabanındaki şifrelenmiş bir şifreyi çözer.
     *
     * @param string|null $encryptedPassword
     * @return string Boş string veya çözülmüş şifre.
     */
    public static function decryptAdminPassword($encryptedPassword) {
        if (!empty($encryptedPassword) && function_exists('decrypt')) {
            try {
                $decrypted = decrypt($encryptedPassword);
                return $decrypted ?: '';
            } catch (Exception $e) {
                self::logBtkMessage('DecryptPassword', ['hata_mesaji' => $e->getMessage()], 'Şifre çözme sırasında bir istisna oluştu.', 'error');
                return '';
            }
        }
        return '';
    }

    /**
     * Başlangıç referans verilerinin yüklenip yüklenmediğini kontrol eder.
     * mod_btk_adres_il ve mod_btk_ref_hizmet_tipleri tablolarında kayıt olup olmadığına bakar.
     * @return array ['loaded' => bool, 'message' => string]
     */
    public static function checkInitialDataStatus() {
        $actionName = 'CheckInitialDataStatus';
        try {
            $configTableExists = Capsule::schema()->hasTable('mod_btk_config');
            $adresIlTableExists = Capsule::schema()->hasTable('mod_btk_adres_il');
            $hizmetTipiTableExists = Capsule::schema()->hasTable('mod_btk_ref_hizmet_tipleri');

            if (!$configTableExists) { // Ana config tablosu bile yoksa, modül düzgün aktive olmamıştır.
                 self::logBtkMessage($actionName, [], "Hata: mod_btk_config tablosu bulunamadı.", 'error');
                 return ['loaded' => false, 'message' => 'Modül tabloları henüz oluşturulmamış. Lütfen modülü yeniden etkinleştirin.'];
            }

            $adresIlKayitSayisi = 0;
            if ($adresIlTableExists) {
                $adresIlKayitSayisi = Capsule::table('mod_btk_adres_il')->count();
            }

            $hizmetTipiKayitSayisi = 0;
            if ($hizmetTipiTableExists) {
                $hizmetTipiKayitSayisi = Capsule::table('mod_btk_ref_hizmet_tipleri')->count();
            }
            
            if ($adresIlKayitSayisi > 0 && $hizmetTipiKayitSayisi > 0) {
                self::logBtkMessage($actionName, ['iller' => $adresIlKayitSayisi, 'hizmet_tipleri' => $hizmetTipiKayitSayisi], "Başlangıç verileri yüklenmiş.", 'info');
                return ['loaded' => true, 'message' => 'Başlangıç verileri yüklenmiş görünüyor.'];
            }

            $missingTables = [];
            if (!$adresIlTableExists) $missingTables[] = 'mod_btk_adres_il';
            if (!$hizmetTipiTableExists) $missingTables[] = 'mod_btk_ref_hizmet_tipleri';

            $message = 'Başlangıç verileri henüz yüklenmemiş.';
            if (!empty($missingTables)) {
                $message .= ' Eksik tablolar: ' . implode(', ', $missingTables) . '. Modülü yeniden etkinleştirmeyi deneyin.';
            }
            self::logBtkMessage($actionName, ['eksik_tablolar' => $missingTables], $message, 'warning');
            return ['loaded' => false, 'message' => $message . ' Lütfen Ayarlar sayfasından veya Ana Sayfadan "Başlangıç Verilerini Yükle" butonunu kullanın.'];

        } catch (Exception $e) {
            self::logBtkMessage($actionName, [], 'Referans veri kontrolü hatası: ' . $e->getMessage(), 'error');
            return ['loaded' => false, 'message' => 'Referans verileri kontrol edilirken bir veritabanı hatası oluştu. Sistem loglarını kontrol edin.'];
        }
    }

    /**
     * sql/initial_reference_data.sql dosyasındaki SQL komutlarını çalıştırır.
     * @return array ['status' => 'success'|'error', 'message' => string]
     */
    public static function setupInitialData() {
        $actionName = 'SetupInitialData';
        $sqlFilePath = __DIR__ . '/../sql/initial_reference_data.sql'; // Kök dizinden sql klasörüne
        self::logBtkMessage($actionName, ['file' => $sqlFilePath], "Başlangıç verilerini yükleme işlemi başlatıldı.");

        if (!file_exists($sqlFilePath)) {
            self::logBtkMessage($actionName, ['file' => $sqlFilePath], "Hata: SQL dosyası bulunamadı.", 'error');
            return ['status' => 'error', 'message' => 'Başlangıç verileri SQL dosyası bulunamadı: ' . $sqlFilePath];
        }

        try {
            $sqlContent = file_get_contents($sqlFilePath);
            if ($sqlContent === false) {
                self::logBtkMessage($actionName, ['file' => $sqlFilePath], "Hata: SQL dosyası okunamadı.", 'error');
                return ['status' => 'error', 'message' => 'Başlangıç verileri SQL dosyası okunamadı.'];
            }

            // SQL dosyasını noktalı virgül ile ayırarak komutlara böl
            // Yorumları ve boş satırları temizle
            $commands = [];
            $sqlLines = explode("\n", $sqlContent);
            $currentCommand = '';
            foreach ($sqlLines as $line) {
                $trimmedLine = trim($line);
                if ($trimmedLine === '' || strpos($trimmedLine, '--') === 0) { // Boş satır veya yorum satırı
                    continue;
                }
                $currentCommand .= $trimmedLine;
                if (substr($trimmedLine, -1) === ';') {
                    $commands[] = $currentCommand;
                    $currentCommand = '';
                } else {
                    $currentCommand .= ' '; // Satır sonu boşlukları için
                }
            }
            if (!empty(trim($currentCommand))) { // Son komutta ; yoksa bile al
                $commands[] = trim($currentCommand);
            }
            
            $errors = [];
            $successCount = 0;

            if (empty($commands)) {
                 self::logBtkMessage($actionName, ['file' => $sqlFilePath], "Uyarı: SQL dosyasında çalıştırılacak komut bulunamadı.", 'warning');
                 return ['status' => 'warning', 'message' => 'Başlangıç verileri SQL dosyasında çalıştırılacak komut bulunamadı.'];
            }

            self::logBtkMessage($actionName, ['command_count' => count($commands)], count($commands) . " adet SQL komutu çalıştırılacak.");

            foreach ($commands as $command) {
                if (empty(trim($command))) continue;
                try {
                    // SET @... gibi değişken atamaları için unprepared daha iyi olabilir
                    // veya PDO doğrudan kullanılabilir. Capsule statement ile bazıları çalışmayabilir.
                    // Basit INSERT'ler için Capsule::statement çalışır.
                    // MySQL değişken atamalarını handle etmek için bağlantıyı doğrudan alalım.
                    if (stripos(trim($command), 'SET @') === 0) {
                         Capsule::connection()->getPdo()->exec($command);
                    } else {
                         Capsule::statement($command);
                    }
                    $successCount++;
                    self::logBtkMessage($actionName, ['executed_command' => substr($command,0,150).'...'], "SQL komutu başarıyla çalıştırıldı.", 'debug');
                } catch (Exception $e) {
                    $errorMsg = "SQL Komutu Hatası: \"" . substr(htmlspecialchars($command), 0, 100) . "...\" - Hata: " . $e->getMessage();
                    $errors[] = $errorMsg;
                    self::logBtkMessage($actionName, ['failed_command' => $command], "Hata: " . $e->getMessage(), 'error');
                }
            }

            if (!empty($errors)) {
                $errorMessage = "Başlangıç verileri yüklenirken " . count($errors) . " adet hata oluştu ({$successCount} komut başarılı): <br>" . implode("<br>", $errors);
                self::logBtkMessage($actionName, ['total_commands' => count($commands), 'success_count' => $successCount, 'errors' => $errors], "Bazı SQL komutları çalıştırılamadı.", 'error');
                return ['status' => 'error', 'message' => $errorMessage];
            }

            self::logBtkMessage($actionName, ['commands_executed' => $successCount], "Başlangıç verileri başarıyla yüklendi.");
            return ['status' => 'success', 'message' => 'Başlangıç referans verileri başarıyla veritabanına yüklendi. (' . $successCount . ' SQL komutu çalıştırıldı)'];

        } catch (Exception $e) {
            self::logBtkMessage($actionName, ['file' => $sqlFilePath], "Genel Hata: " . $e->getMessage(), 'error');
            return ['status' => 'error', 'message' => 'Başlangıç verileri yüklenirken genel bir hata oluştu: ' . $e->getMessage()];
        }
    }


    // Örnek: Modül ayarlarından bir değeri çekmek için fonksiyon
    public static function getConfigValue($key, $default = null) {
        try {
            if (Capsule::schema()->hasTable('mod_btk_config')) {
                $config = Capsule::table('mod_btk_config')->where('id', 1)->first();
                if ($config && isset($config->$key)) {
                    return $config->$key;
                }
            }
        } catch (Exception $e) {
            self::logBtkMessage('GetConfigValue', ['key' => $key], 'Config değeri okunurken hata: ' . $e->getMessage(), 'error');
        }
        return $default;
    }

} // Sınıf sonu
?>