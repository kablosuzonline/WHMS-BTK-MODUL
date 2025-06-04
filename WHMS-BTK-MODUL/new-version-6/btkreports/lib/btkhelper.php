<?php
/**
 * WHMCS BTK Raporlama Modülü - Yardımcı Fonksiyonlar Sınıfı/Dosyası
 * Dosya Adı: btkhelper.php
 * Version: 6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Log\Log;

class BtkHelper {

    private static function logBtkMessage($action, $request, $response, $level = 'info') {
        if (function_exists('logModuleCall')) {
            logModuleCall('btkreports', $action, $request, $response, $response, null);
        } else {
            logActivity("BTK Modül Log [{$level}]: Action: {$action} - Request: " . json_encode($request) . " - Response: " . json_encode($response));
        }
    }

    public static function testFtpConnection(array $params) {
        $actionName = 'FTPTest';
        self::logBtkMessage($actionName, $params, "FTP Test Başlatıldı");

        $host = isset($params['host']) ? trim($params['host']) : '';
        $port = isset($params['port']) ? (int)$params['port'] : 21;
        $username = isset($params['username']) ? trim($params['username']) : '';
        $password = isset($params['password']) ? $params['password'] : '';
        $use_ssl = isset($params['use_ssl']) ? (bool)$params['use_ssl'] : false;
        $passive_mode = isset($params['passive_mode']) ? (bool)$params['passive_mode'] : true;

        if (empty($host)) {
            self::logBtkMessage($actionName, $params, "Hata: FTP Host boş.", 'error');
            return ['status' => 'error', 'message' => 'FTP Host boş bırakılamaz.'];
        }
        if (empty($username)) {
            self::logBtkMessage($actionName, $params, "Hata: FTP Kullanıcı Adı boş.", 'error');
            return ['status' => 'error', 'message' => 'FTP Kullanıcı Adı boş bırakılamaz.'];
        }

        $conn_id = null;
        $errorMessages = [];
        $old_error_reporting = error_reporting(0);

        try {
            self::logBtkMessage($actionName, ['host' => $host, 'port' => $port, 'ssl' => $use_ssl], "Bağlantı deneniyor...");
            if ($use_ssl) {
                if (!function_exists('ftp_ssl_connect')) {
                    $errorMessages[] = 'PHP SSL FTP fonksiyonları (ftp_ssl_connect) sunucunuzda etkin değil. PHP OpenSSL eklentisini kontrol edin.';
                    self::logBtkMessage($actionName, $params, "Hata: ftp_ssl_connect fonksiyonu yok.", 'error');
                    error_reporting($old_error_reporting);
                    return ['status' => 'error', 'message' => implode('; ', $errorMessages)];
                }
                $conn_id = @ftp_ssl_connect($host, $port, 20);
            } else {
                if (!function_exists('ftp_connect')) {
                    $errorMessages[] = 'PHP FTP fonksiyonları (ftp_connect) sunucunuzda etkin değil.';
                    self::logBtkMessage($actionName, $params, "Hata: ftp_connect fonksiyonu yok.", 'error');
                    error_reporting($old_error_reporting);
                    return ['status' => 'error', 'message' => implode('; ', $errorMessages)];
                }
                $conn_id = @ftp_connect($host, $port, 20);
            }

            if (!$conn_id) {
                $php_errormsg = error_get_last()['message'] ?? 'Bilinmeyen bağlantı hatası';
                $errorMessages[] = "FTP sunucusuna bağlanılamadı ({$host}:{$port}). Host, port veya güvenlik duvarı ayarlarını kontrol edin. PHP Hatası: {$php_errormsg}";
                self::logBtkMessage($actionName, $params, "Hata: Bağlantı kurulamadı - {$php_errormsg}", 'error');
                error_reporting($old_error_reporting);
                return ['status' => 'error', 'message' => implode('; ', $errorMessages)];
            }
            self::logBtkMessage($actionName, ['host' => $host, 'port' => $port], "Bağlantı başarılı. conn_id: " . (is_resource($conn_id) || is_object($conn_id) ? 'OK' : 'FAILED'));

            self::logBtkMessage($actionName, ['username' => $username], "Giriş deneniyor...");
            if (!@ftp_login($conn_id, $username, $password)) {
                $php_errormsg = error_get_last()['message'] ?? 'Bilinmeyen giriş hatası';
                $errorMessages[] = "FTP sunucusuna giriş yapılamadı. Kullanıcı adı veya şifre hatalı olabilir. PHP Hatası: {$php_errormsg}";
                self::logBtkMessage($actionName, $params, "Hata: Giriş başarısız - {$php_errormsg}", 'error');
                @ftp_close($conn_id);
                error_reporting($old_error_reporting);
                return ['status' => 'error', 'message' => implode('; ', $errorMessages)];
            }
            self::logBtkMessage($actionName, ['username' => $username], "Giriş başarılı.");

            self::logBtkMessage($actionName, ['passive_mode' => $passive_mode], "Pasif mod ayarlanıyor...");
            if (!@ftp_pasv($conn_id, $passive_mode)) {
                $php_errormsg = error_get_last()['message'] ?? 'Pasif mod ayarlama hatası';
                $errorMessages[] = "Pasif mod ayarlanamadı. PHP Hatası: {$php_errormsg}";
                self::logBtkMessage($actionName, $params, "Uyarı: Pasif mod ayarlanamadı - {$php_errormsg}", 'warning');
            } else {
                 self::logBtkMessage($actionName, ['passive_mode' => $passive_mode], "Pasif mod başarıyla ayarlandı.");
            }

            self::logBtkMessage($actionName, [], "Mevcut dizin alınıyor (PWD)...");
            $pwd = @ftp_pwd($conn_id);
            if ($pwd === false) {
                $php_errormsg = error_get_last()['message'] ?? 'PWD komutu hatası';
                $errorMessages[] = "Giriş başarılı ancak mevcut dizin bilgisi alınamadı. PHP Hatası: {$php_errormsg}";
                self::logBtkMessage($actionName, $params, "Hata: PWD komutu başarısız - {$php_errormsg}", 'error');
                @ftp_close($conn_id);
                error_reporting($old_error_reporting);
                return ['status' => 'error', 'message' => implode('; ', $errorMessages)];
            }
            self::logBtkMessage($actionName, ['pwd' => $pwd], "PWD başarılı. Mevcut dizin: {$pwd}");

            @ftp_close($conn_id);
            error_reporting($old_error_reporting);
            self::logBtkMessage($actionName, $params, "FTP Testi Başarıyla Tamamlandı. Mevcut dizin: {$pwd}");
            return ['status' => 'success', 'message' => 'Bağlantı başarılı! Mevcut dizin: ' . $pwd];

        } catch (Exception $e) {
            if ($conn_id && (is_resource($conn_id) || is_object($conn_id))) @ftp_close($conn_id);
            error_reporting($old_error_reporting);
            $errorMessages[] = 'FTP işlemi sırasında bir PHP istisnası oluştu: ' . $e->getMessage();
            self::logBtkMessage($actionName, $params, "İstisna: " . $e->getMessage(), 'error');
            return ['status' => 'error', 'message' => implode('; ', $errorMessages)];
        }
    }
}
?>