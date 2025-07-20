<?php
/**
 * FTP İşlemleri Yönetici Sınıfı
 *
 * FTP bağlantısı, test, dosya yükleme ve loglama işlemlerini merkezi olarak yönetir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Manager;

use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;

class FtpManager
{
    private array $settings;
    private string $ftpType; // 'main' or 'backup'

    /**
     * FtpManager constructor.
     * @param array $settings Modülün tüm ayarlarını içeren dizi.
     */
    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Belirtilen FTP sunucusuna dosya yükler.
     *
     * @param string $localFilePath Yüklenecek dosyanın yerel yolu.
     * @param string $remoteFileName Sunucudaki dosya adı.
     * @param string $raporTuru Rapor türü (REHBER, HAREKET, PERSONEL).
     * @param string|null $yetkiGrup Raporun yetki grubu (ISS, STH vb.).
     * @param string $ftpType Hangi FTP sunucusuna yükleneceği ('main' veya 'backup').
     * @param string $cnt Raporun CNT numarası.
     * @return array Başarı/hata durumu ve mesajı içeren bir dizi.
     */
    public function uploadFile(string $localFilePath, string $remoteFileName, string $raporTuru, ?string $yetkiGrup, string $ftpType, string $cnt): array
    {
        $this->ftpType = $ftpType;

        if (!file_exists($localFilePath) || !is_readable($localFilePath)) {
            $message = "Yerel dosya bulunamadı veya okunamıyor: $localFilePath";
            $this->logSubmission($remoteFileName, $raporTuru, 'Basarisiz', $cnt, $message, $yetkiGrup);
            return ['status' => false, 'message' => $message];
        }

        if (filesize($localFilePath) === 0 && ($this->settings['send_empty_reports'] ?? '0') !== '1') {
            $message = "Dosya boş (0 byte) ve boş rapor gönderimi kapalı, yükleme atlandı.";
            $this->logSubmission($remoteFileName, $raporTuru, 'Atlandi', $cnt, $message, $yetkiGrup);
            return ['status' => true, 'message' => $message, 'skipped' => true];
        }

        $config = $this->getFtpConfig($ftpType, $raporTuru);
        if ($config['error']) {
            $this->logSubmission($remoteFileName, $raporTuru, 'Basarisiz', $cnt, $config['error'], $yetkiGrup);
            return ['status' => false, 'message' => $config['error']];
        }

        $conn_id = $this->connect($config);
        if (!$conn_id) {
            $message = "{$config['label']} sunucusuna ({$config['host']}:{$config['port']}) bağlanılamadı.";
            $this->logSubmission($remoteFileName, $raporTuru, 'Basarisiz', $cnt, $message, $yetkiGrup);
            return ['status' => false, 'message' => $message];
        }

        // Dizin değiştirme mantığı
        if ($config['path'] !== '' && $config['path'] !== '/') {
            if (!@ftp_chdir($conn_id, $config['path'])) {
                // Dizin yoksa oluşturmayı dene (reküristif)
                $this->createRecursiveDir($conn_id, $config['path']);
                // Tekrar dene
                if (!@ftp_chdir($conn_id, $config['path'])) {
                    $message = "{$config['label']}: Uzak dizin ({$config['path']}) oluşturulamadı veya erişilemedi.";
                    @ftp_close($conn_id);
                    $this->logSubmission($remoteFileName, $raporTuru, 'Basarisiz', $cnt, $message, $yetkiGrup);
                    return ['status' => false, 'message' => $message];
                }
            }
        }
        
        // Dosyayı yükle
        if (@ftp_put($conn_id, $remoteFileName, $localFilePath, FTP_BINARY)) {
            $message = "$remoteFileName dosyası başarıyla {$config['label']} sunucusuna ({$config['path']}/{$remoteFileName}) yüklendi.";
            @ftp_close($conn_id);
            $this->logSubmission($remoteFileName, $raporTuru, 'Basarili', $cnt, 'Yükleme başarılı.', $yetkiGrup);
            return ['status' => true, 'message' => $message];
        } else {
            $message = "$remoteFileName dosyası {$config['label']} sunucusuna yüklenirken hata oluştu.";
            @ftp_close($conn_id);
            $this->logSubmission($remoteFileName, $raporTuru, 'Basarisiz', $cnt, $message, $yetkiGrup);
            return ['status' => false, 'message' => $message];
        }
    }

    /**
     * Belirtilen FTP sunucusuna bağlantıyı test eder.
     * @param string $ftpType 'main' veya 'backup'.
     * @return array Test sonucunu içeren dizi.
     */
    public function testConnection(string $ftpType = 'main'): array
    {
        $this->ftpType = $ftpType;
        $config = $this->getFtpConfig($ftpType);

        if ($ftpType === 'backup' && ($this->settings['backup_ftp_enabled'] ?? '0') !== '1') {
             return ['status' => 'info', 'message' => 'Yedek FTP ayarı kapalı.'];
        }

        if ($config['error']) {
            return ['status' => 'error', 'message' => $config['error']];
        }
        
        $conn_id = $this->connect($config);

        if ($conn_id) {
            @ftp_close($conn_id);
            return ['status' => 'success', 'message' => "{$config['label']} sunucusuna başarıyla bağlanıldı."];
        }

        return ['status' => 'error', 'message' => "{$config['label']} sunucusuna ({$config['host']}:{$config['port']}) bağlanılamadı. Bilgileri veya ağ ayarlarını kontrol edin."];
    }
    
    /**
     * FTP bağlantısı kurar.
     * @param array $config
     * @return resource|false
     */
    private function connect(array $config)
    {
        $connect_function = ($config['ssl'] && function_exists('ftp_ssl_connect')) ? 'ftp_ssl_connect' : 'ftp_connect';
        if (!function_exists($connect_function)) {
            return false;
        }

        $conn_id = @$connect_function($config['host'], $config['port'], 20); // 20 saniye timeout
        if ($conn_id) {
            if (@ftp_login($conn_id, $config['user'], $config['pass'])) {
                @ftp_pasv($conn_id, true);
                return $conn_id;
            }
            @ftp_close($conn_id);
        }
        return false;
    }

    /**
     * FTP ayarlarını yapılandırır.
     * @param string $ftpType
     * @param string|null $raporTuru
     * @return array
     */
    private function getFtpConfig(string $ftpType, ?string $raporTuru = null): array
    {
        $config = ['error' => false];
        $config['host'] = $this->settings["{$ftpType}_ftp_host"] ?? '';
        if (empty($config['host'])) {
            $config['error'] = ucfirst($ftpType) . ' FTP sunucu adresi ayarlanmamış.';
            return $config;
        }
        
        $config['user'] = $this->settings["{$ftpType}_ftp_user"] ?? '';
        $config['pass'] = $this->settings["{$ftpType}_ftp_pass"] ?? '';
        $config['port'] = (int)($this->settings["{$ftpType}_ftp_port"] ?? 21);
        $config['ssl'] = ($this->settings["{$ftpType}_ftp_ssl"] ?? '0') === '1';
        $config['label'] = ($ftpType === 'main') ? 'Ana FTP' : 'Yedek FTP';

        if ($raporTuru) {
            $pathKeyPart = '';
            if (strpos($raporTuru, 'REHBER') !== false) $pathKeyPart = 'rehber';
            elseif (strpos($raporTuru, 'HAREKET') !== false) $pathKeyPart = 'hareket';
            elseif (strpos($raporTuru, 'PERSONEL') !== false) $pathKeyPart = 'personel';
            
            if ($pathKeyPart) {
                $config['path'] = rtrim($this->settings["{$ftpType}_ftp_{$pathKeyPart}_path"] ?? '/', '/');
            } else {
                 $config['path'] = '/';
            }
        } else {
            $config['path'] = '/';
        }
        
        return $config;
    }

    /**
     * Sunucuda reküristif olarak dizin oluşturur.
     * @param resource $conn_id
     * @param string $path
     */
    private function createRecursiveDir($conn_id, string $path): void
    {
        $parts = explode('/', trim($path, '/'));
        foreach ($parts as $part) {
            if (empty($part)) continue;
            if (!@ftp_chdir($conn_id, $part)) {
                @ftp_mkdir($conn_id, $part);
                if (!@ftp_chdir($conn_id, $part)) {
                    break;
                }
            }
        }
        @ftp_chdir($conn_id, '/');
    }
    
    /**
     * FTP gönderim sonucunu veritabanına loglar.
     * @param string $dosyaAdi
     * @param string $raporTuru
     * @param string $durum
     * @param string $cntNumarasi
     * @param string|null $hataMesaji
     * @param string|null $yetkiTuruGrup
     */
    public function logSubmission(string $dosyaAdi, string $raporTuru, string $durum, string $cntNumarasi, ?string $hataMesaji = null, ?string $yetkiTuruGrup = null): void
    {
        try {
            Capsule::table('mod_btk_ftp_logs')->insert([
                'dosya_adi' => substr($dosyaAdi, 0, 255),
                'rapor_turu' => strtoupper(substr($raporTuru, 0, 50)),
                'yetki_turu_grup' => substr($yetkiTuruGrup, 0, 50),
                'ftp_sunucu_tipi' => strtoupper(substr($this->ftpType, 0, 10)),
                'durum' => ucfirst(strtolower(substr($durum, 0, 50))),
                'cnt_numarasi' => substr($cntNumarasi, 0, 2),
                'hata_mesaji' => $hataMesaji,
                'gonderim_zamani' => gmdate('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            BtkHelper::logAction('FTP Log Kayıt Hatası', 'KRITIK', $e->getMessage());
        }
    }
}
?>