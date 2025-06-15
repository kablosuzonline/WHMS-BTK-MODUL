<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\LogService; // Loglama için

/**
 * Class FtpService
 *
 * FTP sunucularına bağlanma, dosya yükleme ve diğer FTP işlemlerini yönetir.
 */
class FtpService
{
    private $conn_id = null;
    private $login_result = null;
    private $error_message = '';
    private $host;
    private $port;
    private $timeout = 15; // saniye

    /**
     * FtpService constructor.
     *
     * @param string $host
     * @param int|string $port
     * @param string $username
     * @param string $password
     * @param bool $passiveMode
     * @param int $timeout
     */
    public function __construct($host, $port, $username, $password, $passiveMode = true, $timeout = 15)
    {
        $this->host = $host;
        $this->port = (int)$port;
        $this->timeout = (int)$timeout;

        if (empty($host) || empty($username)) {
            $this->error_message = 'FTP sunucu adresi veya kullanıcı adı boş olamaz.';
            LogService::add("FtpService Constructor: {$this->error_message}", 'ERROR', 'FTP_CONSTRUCT_FAIL', ['host' => $host]);
            // Constructor'dan false döndürmek yerine, isConnected() ile kontrol edilecek.
            return;
        }

        $this->conn_id = @ftp_connect($host, $this->port, $this->timeout);

        if (!$this->conn_id) {
            $this->error_message = "FTP sunucusuna bağlanılamadı: {$host}:{$port}";
            LogService::add("FtpService Constructor: {$this->error_message}", 'ERROR', 'FTP_CONNECT_FAIL', ['host' => $host, 'port' => $port]);
            return;
        }

        // Şifre boş olsa bile login denemesi (anonim FTP için pek olası değil ama)
        $this->login_result = @ftp_login($this->conn_id, $username, $password);

        if (!$this->login_result) {
            $this->error_message = "FTP login başarısız: Kullanıcı adı veya şifre hatalı.";
            LogService::add("FtpService Constructor: {$this->error_message}", 'ERROR', 'FTP_LOGIN_FAIL', ['host' => $host, 'user' => $username]);
            @ftp_close($this->conn_id);
            $this->conn_id = null;
            return;
        }

        LogService::add("FtpService: Başarıyla bağlanıldı: {$host}:{$port}", 'DEBUG', 'FTP_CONNECT_SUCCESS', ['host' => $host, 'user' => $username]);

        if ($passiveMode) {
            if (!@ftp_pasv($this->conn_id, true)) {
                $passiveError = "Pasif moda geçilemedi.";
                LogService::add("FtpService: FTP Pasif Mod Uyarısı ({$host}): {$passiveError}", 'WARNING', 'FTP_PASSIVE_MODE_FAIL');
                // Bu kritik bir hata olmayabilir, error_message'a eklemeyelim, sadece loglayalım.
            } else {
                LogService::add("FtpService: Pasif moda başarıyla geçildi ({$host}).", 'DEBUG', 'FTP_PASSIVE_MODE_SUCCESS');
            }
        }
    }

    /**
     * Bağlantının başarılı olup olmadığını kontrol eder.
     * @return bool
     */
    public function isConnected()
    {
        return ($this->conn_id && $this->login_result);
    }

    /**
     * Son hata mesajını döndürür.
     * @return string
     */
    public function getErrorMessage()
    {
        return $this->error_message;
    }

    /**
     * Lokal bir dosyayı FTP sunucusundaki belirtilen klasöre ve adla yükler.
     *
     * @param string $localFilePath Yüklenecek lokal dosyanın tam yolu.
     * @param string $remoteFolderPath FTP'de dosyanın yükleneceği klasör yolu (örn: /ABONE_REHBER/).
     * @param string $remoteFileName FTP'de dosyaya verilecek ad.
     * @return array ['success' => bool, 'message' => string, 'remote_file_path' => string|null]
     */
    public function uploadFile($localFilePath, $remoteFolderPath, $remoteFileName)
    {
        if (!$this->isConnected()) {
            return ['success' => false, 'message' => $this->getErrorMessage() ?: 'FTP bağlantısı aktif değil.', 'remote_file_path' => null];
        }

        if (!file_exists($localFilePath) || !is_readable($localFilePath)) {
            $msg = "Lokal dosya bulunamadı veya okunamıyor: {$localFilePath}";
            LogService::add("FtpService::uploadFile: {$msg}", 'ERROR', 'FTP_UPLOAD_LOCAL_FILE_ERROR', ['local_path' => $localFilePath]);
            return ['success' => false, 'message' => $msg, 'remote_file_path' => null];
        }

        $remoteFolderPath = rtrim($remoteFolderPath, '/') . '/';
        $fullRemotePath = $remoteFolderPath . $remoteFileName;

        $extension = strtolower(pathinfo($localFilePath, PATHINFO_EXTENSION));
        $transferMode = FTP_BINARY;
        if (in_array($extension, ['txt', 'abn', 'csv', 'html', 'php', 'css', 'js'])) {
            $transferMode = FTP_ASCII;
        }

        LogService::add("FtpService: Dosya yükleniyor: {$localFilePath} -> {$fullRemotePath} (Mod: " . ($transferMode == FTP_BINARY ? "BINARY" : "ASCII") . ")", 'INFO', 'FTP_UPLOAD_START');

        if (@ftp_put($this->conn_id, $fullRemotePath, $localFilePath, $transferMode)) {
            LogService::add("FtpService: Dosya başarıyla yüklendi: {$fullRemotePath}", 'SUCCESS', 'FTP_UPLOAD_SUCCESS');
            return [
                'success' => true,
                'message' => "Dosya başarıyla FTP'ye yüklendi: {$fullRemotePath}",
                'remote_file_path' => $fullRemotePath
            ];
        } else {
            $ftpError = error_get_last(); // Bu her zaman doğru FTP hatasını vermeyebilir.
            // @ftp_rawlist($this->conn_id, $remoteFolderPath) ile klasör var mı kontrol edilebilir.
            // @ftp_size($this->conn_id, $fullRemotePath) ile dosya var mı/boyutu ne kontrol edilebilir.
            $this->error_message = "Dosya FTP'ye yüklenemedi: {$fullRemotePath}." . ($ftpError ? " (PHP Hatası: " . $ftpError['message'] . ")" : " (Belirsiz FTP hatası. İzinleri veya yolu kontrol edin.)");
            LogService::add("FtpService::uploadFile HATA: {$this->error_message}", 'ERROR', 'FTP_UPLOAD_FAIL', ['remote_path' => $fullRemotePath, 'php_error' => $ftpError]);
            return [
                'success' => false,
                'message' => $this->error_message,
                'remote_file_path' => $fullRemotePath
            ];
        }
    }

    /**
     * Belirtilen bir FTP klasörünün var olup olmadığını ve yazılabilir olup olmadığını kontrol eder.
     * @param string $folderPath
     * @return array ['exists' => bool, 'writable' => bool, 'error' => string|null]
     */
    public function checkFolderPermissions($folderPath)
    {
        if (!$this->isConnected()) {
            return ['exists' => false, 'writable' => false, 'error' => $this->getErrorMessage() ?: 'FTP bağlantısı aktif değil.'];
        }

        $result = ['exists' => false, 'writable' => false, 'error' => null];
        $originalDir = @ftp_pwd($this->conn_id);

        if (empty($folderPath)) { // Kök dizine veya boş yola test amaçlı dosya atmayalım
            $result['error'] = "Hedef klasör yolu belirtilmemiş.";
            LogService::add("FtpService::checkFolderPermissions: {$result['error']}", 'WARNING', 'FTP_CHECKPERM_EMPTYPATH');
            return $result;
        }
        $folderPathChecked = rtrim($folderPath, '/') . '/';

        if (@ftp_chdir($this->conn_id, $folderPathChecked)) {
            $result['exists'] = true;
            LogService::add("FtpService: Klasör bulundu: {$folderPathChecked}", 'DEBUG', 'FTP_CHECKPERM_DIR_EXISTS');
            $tempFileName = 'btk_perm_test_' . time() . '.txt';
            $remoteFile = $folderPathChecked . $tempFileName;
            $localTempFileDir = BtkHelper::getTempReportsDir();
            if ($localTempFileDir === false) {
                $result['writable'] = false; $result['error'] = "Lokal geçici klasör erişilemiyor.";
                LogService::add("FtpService::checkFolderPermissions: {$result['error']}", 'ERROR', 'FTP_CHECKPERM_LOCAL_TEMP_FAIL');
                if ($originalDir !== false) @ftp_chdir($this->conn_id, $originalDir);
                return $result;
            }
            $localTempFile = $localTempFileDir . $tempFileName;
            if (@file_put_contents($localTempFile, "BTK Modul Yazma Testi " . date('Y-m-d H:i:s')) === false) {
                $result['writable'] = false; $result['error'] = "Lokal test dosyası ({$localTempFile}) oluşturulamadı.";
                LogService::add("FtpService::checkFolderPermissions: {$result['error']}", 'ERROR', 'FTP_CHECKPERM_LOCAL_WRITE_FAIL');
                if ($originalDir !== false) @ftp_chdir($this->conn_id, $originalDir);
                return $result;
            }
            if (@ftp_put($this->conn_id, $remoteFile, $localTempFile, FTP_ASCII)) {
                $result['writable'] = true;
                @ftp_delete($this->conn_id, $remoteFile);
                LogService::add("FtpService: Klasör yazılabilir: {$folderPathChecked}", 'DEBUG', 'FTP_CHECKPERM_WRITABLE');
            } else {
                $result['writable'] = false; $result['error'] = "{$folderPathChecked} klasörüne yazma izni yok veya yazma sırasında hata.";
                LogService::add("FtpService::checkFolderPermissions: {$result['error']}", 'WARNING', 'FTP_CHECKPERM_NOT_WRITABLE');
            }
            @unlink($localTempFile);
            if ($originalDir !== false && $originalDir !== ftp_pwd($this->conn_id)) @ftp_chdir($this->conn_id, $originalDir);
        } else {
            $result['exists'] = false; $result['writable'] = false; $result['error'] = "Klasör bulunamadı veya erişilemedi: {$folderPathChecked}";
            LogService::add("FtpService::checkFolderPermissions: {$result['error']}", 'WARNING', 'FTP_CHECKPERM_DIR_NOT_EXISTS');
        }
        return $result;
    }
    
    /**
     * FTP bağlantısını kapatır.
     */
    public function closeConnection()
    {
        if ($this->conn_id) {
            @ftp_close($this->conn_id);
            $this->conn_id = null;
            $this->login_result = null;
            LogService::add("FtpService: FTP bağlantısı kapatıldı ({$this->host}).", 'DEBUG', 'FTP_CONNECTION_CLOSED');
        }
    }

    /**
     * Destructor: Nesne yok edildiğinde FTP bağlantısının kapatıldığından emin olur.
     */
    public function __destruct()
    {
        $this->closeConnection();
    }

    /**
     * Statik metod ile bağlantı ve klasör izinlerini test eder.
     * @param string $host
     * @param int|string $port
     * @param string $username
     * @param string $password
     * @param bool $passiveMode
     * @param array $targetFolders ['rehber' => '/path1/', 'hareket' => '/path2/', 'personel' => '/path3/']
     * @return array ['connected' => bool, 'error' => string|null, 'writable_rehber' => bool|null, ...]
     */
    public static function testConnectionAndPermissions($host, $port, $username, $password, $passiveMode = true, $targetFolders = [])
    {
        // LogService'in varlığını kontrol et, yoksa basit loglama yap
        $logServiceAvailable = class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService');
        
        $ftp = new self($host, $port, $username, $password, $passiveMode);
        $result = ['connected' => false, 'error' => $ftp->getErrorMessage()]; // Başlangıçta hata mesajını al

        if (!$ftp->isConnected()) {
            foreach (array_keys($targetFolders) as $key) {
                $result['writable_' . $key] = false;
                $result['error_' . $key] = $ftp->getErrorMessage(); // Bağlantı hatasını her klasör için de belirt
            }
            return $result;
        }

        $result['connected'] = true;
        $result['error'] = null; // Bağlantı başarılıysa genel hatayı temizle

        foreach ($targetFolders as $key => $folderPath) {
            if (!empty(trim((string)$folderPath))) {
                $permCheck = $ftp->checkFolderPermissions(trim($folderPath));
                $result['writable_' . $key] = $permCheck['writable'];
                $result['error_' . $key] = $permCheck['error']; // Her klasör için ayrı hata mesajı
            } else {
                $result['writable_' . $key] = null;
                $result['error_' . $key] = ucfirst($key) . " için hedef klasör yolu belirtilmemiş.";
            }
        }

        $ftp->closeConnection();
        return $result;
    }

} // Sınıf sonu
?>