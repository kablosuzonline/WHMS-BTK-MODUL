<?php
/**
 * BTK Raporlama Modülü - FTP Yönetimi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - `testConnection` metodu, artık sadece veritabanında kayıtlı ayarları değil,
 *   AJAX üzerinden gönderilen anlık form verilerini de test edebilecek şekilde
 *   iyileştirildi. Bu, "kaydetmeden test etme" özelliğini sağlar.
 * - Rapor dosyası yükleme (`uploadFile`) metodu, Genel Ayarlar'da tanımlanan
 *   dinamik klasör yollarını kullanacak şekilde güncellendi.
 * - Hata yönetimi ve loglama, merkezi LogManager ile tam entegre hale getirildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;

class FtpManager
{
    private array $settings;

    /**
     * FtpManager constructor.
     * @param array $settings Modülün genel ayarları.
     */
    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Verilen FTP ayarlarıyla bağlantıyı test eder.
     *
     * @param string $ftpType Test edilecek sunucu tipi ('main' veya 'backup').
     * @return array Sonuç durumu ve mesajı içeren bir dizi.
     */
    public function testConnection(string $ftpType): array
    {
        $prefix = $ftpType . '_ftp_';
        if ($ftpType === 'backup' && ($this->settings['backup_ftp_enabled'] ?? '0') !== '1') {
            return ['status' => 'info', 'message' => 'Yedek FTP sunucusu ayarlarda etkin değil.'];
        }

        $host = $this->settings[$prefix . 'host'] ?? '';
        $user = $this->settings[$prefix . 'user'] ?? '';
        $pass = $this->settings[$prefix . 'pass'] ?? '';

        if (empty($host) || empty($user) || empty($pass)) {
            return ['status' => 'error', 'message' => 'Lütfen sunucu adresi, kullanıcı adı ve şifre alanlarını doldurun.'];
        }

        try {
            $connection = $this->connect($ftpType);
            @ftp_close($connection);
            return ['status' => 'success', 'message' => 'Bağlantı başarılı.'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Bağlantı başarısız: ' . $e->getMessage()];
        }
    }
    
    /**
     * Belirtilen yerel dosyayı, ilgili FTP sunucusuna yükler.
     *
     * @param string $localFilePath Yüklenecek dosyanın sunucudaki tam yolu.
     * @param string $ftpType Gönderim yapılacak sunucu tipi ('main' veya 'backup').
     * @param string $raporTuru Raporun türü (REHBER, HAREKET, PERSONEL).
     * @param string|null $yetkiGrup Raporun ait olduğu yetki grubu.
     * @param string $cnt Günlük sayaç numarası.
     * @return array Sonuç durumu ve mesajı içeren bir dizi.
     */
    public function uploadFile(string $localFilePath, string $ftpType, string $raporTuru, ?string $yetkiGrup, string $cnt): array
    {
        $fileName = basename($localFilePath);
        LogManager::logAction("FTP Gönderim Denemesi ({$ftpType})", 'UYARI', "Dosya: {$fileName}", null, ['rapor_turu' => $raporTuru, 'grup' => $yetkiGrup]);

        try {
            $connection = $this->connect($ftpType);
            
            // Ayarlardan dinamik klasör yolunu al
            $remotePathKey = strtolower("{$ftpType}_ftp_{$raporTuru}_path");
            $remotePath = $this->settings[$remotePathKey] ?? '/';
            $remoteFilePath = rtrim($remotePath, '/') . '/' . $fileName;

            // Dosyayı yükle
            if (!@ftp_put($connection, $remoteFilePath, $localFilePath, FTP_BINARY)) {
                throw new \Exception("ftp_put() komutu başarısız oldu. İzinleri veya dosya yolunu kontrol edin: {$remoteFilePath}");
            }
            
            // Bağlantıyı kapat
            @ftp_close($connection);

            // Başarıyı logla
            $this->logSuccess($fileName, $raporTuru, $yetkiGrup, $ftpType, $cnt);
            return ['status' => true, 'message' => "Dosya başarıyla yüklendi: {$fileName}"];

        } catch (\Exception $e) {
            // Hatayı logla
            $this->logFailure($fileName, $raporTuru, $yetkiGrup, $ftpType, $cnt, $e->getMessage());
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Belirtilen FTP sunucusuna bağlantı kurar ve bağlantı kaynağını döndürür.
     * @param string $ftpType
     * @return resource
     * @throws \Exception
     */
    private function connect(string $ftpType)
    {
        $prefix = $ftpType . '_ftp_';
        $host = $this->settings[$prefix . 'host'];
        $port = (int)($this->settings[$prefix . 'port'] ?? 21);
        $user = $this->settings[$prefix . 'user'];
        $pass = $this->settings[$prefix . 'pass'];
        $useSsl = ($this->settings[$prefix . 'ssl'] ?? '0') === '1';

        $connection = $useSsl ? @ftp_ssl_connect($host, $port) : @ftp_connect($host, $port);
        if ($connection === false) {
            throw new \Exception("Sunucuya bağlanılamadı: {$host}:{$port}");
        }

        if (!@ftp_login($connection, $user, $pass)) {
            @ftp_close($connection);
            throw new \Exception("FTP girişi başarısız. Kullanıcı adı veya şifre hatalı olabilir.");
        }
        
        if (($this->settings[$prefix . 'pasv'] ?? '1') === '1') {
            @ftp_pasv($connection, true);
        }

        return $connection;
    }

    /**
     * Başarılı bir FTP gönderimini veritabanına loglar.
     */
    private function logSuccess(string $fileName, string $raporTuru, ?string $yetkiGrup, string $ftpType, string $cnt): void
    {
        Capsule::table('mod_btk_ftp_logs')->insert([
            'dosya_adi' => $fileName,
            'rapor_turu' => $raporTuru,
            'yetki_turu_grup' => $yetkiGrup,
            'ftp_sunucu_tipi' => strtoupper($ftpType),
            'gonderim_zamani' => date('Y-m-d H:i:s'),
            'durum' => 'Basarili',
            'cnt_numarasi' => $cnt,
        ]);
    }

    /**
     * Başarısız bir FTP gönderimini veritabanına loglar.
     */
    private function logFailure(string $fileName, string $raporTuru, ?string $yetkiGrup, string $ftpType, string $cnt, string $errorMessage): void
    {
        Capsule::table('mod_btk_ftp_logs')->insert([
            'dosya_adi' => $fileName,
            'rapor_turu' => $raporTuru,
            'yetki_turu_grup' => $yetkiGrup,
            'ftp_sunucu_tipi' => strtoupper($ftpType),
            'gonderim_zamani' => date('Y-m-d H:i:s'),
            'durum' => 'Basarisiz',
            'hata_mesaji' => $errorMessage,
            'cnt_numarasi' => $cnt,
        ]);
    }
}