<?php
/**
 * Soyut BTK Rapor Sınıfı
 *
 * Tüm rapor sınıfları için ortak özellikleri ve metotları barındırır.
 * Rapor oluşturma, gönderme ve dosya yönetimi gibi temel işlevleri içerir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2
 */

namespace BtkReports\Rapor;

use BtkReports\Manager\FtpManager;
use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;

abstract class AbstractBtkRapor implements BtkRaporInterface
{
    protected array $settings;
    protected FtpManager $ftpManager;
    protected string $tempDir;
    
    // Her alt sınıf bu sabitleri kendi raporuna göre DOLDURMAK ZORUNDADIR.
    protected const RAPOR_TURU = 'TANIMSIZ';
    protected const RAPOR_DOSYA_UZANTISI = '.tmp';

    protected ?string $yetkiGrup;

    /**
     * AbstractBtkRapor constructor.
     * @param array $settings
     * @param FtpManager $ftpManager
     * @param string|null $yetkiGrup
     */
    public function __construct(array $settings, FtpManager $ftpManager, ?string $yetkiGrup = null)
    {
        $this->settings = $settings;
        $this->ftpManager = $ftpManager;
        $this->yetkiGrup = $yetkiGrup;
        $this->tempDir = BtkHelper::getModuleTempPath();
    }

    /**
     * Raporu oluşturur, sıkıştırır ve belirtilen FTP sunucusuna gönderir.
     * @param string $ftpType 'main' veya 'backup'.
     * @return array
     */
    public function olusturVeGonder(string $ftpType = 'main'): array
    {
        // Yedek FTP kapalıysa ve yedek FTP'ye gönderme isteniyorsa işlemi atla.
        if ($ftpType === 'backup' && ($this->settings['backup_ftp_enabled'] ?? '0') !== '1') {
            return ['status' => true, 'message' => 'Yedek FTP ayarı kapalı, gönderme atlandı.', 'skipped' => true];
        }

        $result = $this->olusturVeIndir(false); // Dosyayı geçici klasöre oluştur
        if (!$result['status']) {
            return $result; // Oluşturma başarısızsa devam etme
        }

        $localFilePath = $result['file_path'];
        $remoteFileName = $result['file_name'];
        $cnt = $result['cnt'];

        $uploadResult = $this->ftpManager->uploadFile(
            $localFilePath,
            $remoteFileName,
            static::RAPOR_TURU,
            $this->yetkiGrup,
            $ftpType,
            $cnt
        );

        @unlink($localFilePath); // Geçici dosyayı her zaman sil

        return [
            'status' => $uploadResult['status'],
            'message' => $uploadResult['message']
        ];
    }

    /**
     * Raporu oluşturur ve yerel olarak indirilebilir bir yola kaydeder veya tarayıcıya sunar.
     * @param bool $outputToBrowser Tarayıcıya mı gönderilecek?
     * @return array
     */
    public function olusturVeIndir(bool $outputToBrowser = true): array
    {
        try {
            $data = $this->getReportData();

            if (empty($data) && ($this->settings['send_empty_reports'] ?? '0') !== '1') {
                return ['status' => false, 'message' => BtkHelper::getLang('noDataForReport')];
            }

            $cnt = $this->getNextCnt('main'); // CNT her zaman ana FTP'ye göre hesaplanır.
            $filename = $this->generateFilename($cnt);
            $filePath = $this->tempDir . DIRECTORY_SEPARATOR . $filename;
            
            $content = $this->formatReportContent($data);
            
            if (file_put_contents($filePath, $content) === false) {
                throw new \Exception("Geçici rapor dosyası ({$filePath}) yazılamadı.");
            }
            
            $gzFilePath = $this->compressToGz($filePath);
            if (!$gzFilePath) {
                @unlink($filePath);
                throw new \Exception("Rapor dosyası sıkıştırılamadı.");
            }

            @unlink($filePath); // Orijinal, sıkıştırılmamış dosyayı sil

            return [
                'status' => true,
                'message' => 'Rapor başarıyla oluşturuldu.',
                'file' => basename($gzFilePath), // Sadece dosya adını döndür
                'file_path' => $gzFilePath, // Tam yolu da döndür
                'file_name' => basename($gzFilePath),
                'cnt' => $cnt
            ];

        } catch (\Exception $e) {
            BtkHelper::logAction(static::RAPOR_TURU . " Rapor Oluşturma Hatası", 'HATA', $e->getMessage());
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Dosya adı oluşturma mantığını merkezileştirir.
     * @param string $cnt
     * @return string
     */
    protected function generateFilename(string $cnt): string
    {
        $cleanOperatorName = strtoupper(preg_replace('/[^A-Z0-9_]/i', '', trim($this->settings['operator_name'])));
        $cleanOperatorKodu = preg_replace('/[^A-Z0-9]/i', '', trim($this->settings['operator_code']));
        $dateTimePart = gmdate('YmdHis');
        $cleanYetkiGrup = strtoupper(preg_replace('/[^A-Z0-9_]/i', '', trim($this->yetkiGrup ?? '')));

        return "{$cleanOperatorName}_{$cleanOperatorKodu}_{$cleanYetkiGrup}_" . static::RAPOR_TURU . "_{$dateTimePart}_{$cnt}" . static::RAPOR_DOSYA_UZANTISI;
    }

    /**
     * Bir sonraki CNT (sayaç) numarasını veritabanından alır.
     * @param string $ftpSunucuTipi
     * @return string
     */
    protected function getNextCnt(string $ftpSunucuTipi = 'ANA'): string
    {
        $lastLog = Capsule::table('mod_btk_ftp_logs')
            ->where('rapor_turu', static::RAPOR_TURU)
            ->where('yetki_turu_grup', $this->yetkiGrup)
            ->where('ftp_sunucu_tipi', strtoupper($ftpSunucuTipi))
            ->where('durum', 'Basarili')
            ->orderBy('gonderim_zamani', 'DESC')
            ->first();
        
        $currentCnt = 0;
        if ($lastLog && !empty($lastLog->cnt_numarasi) && is_numeric($lastLog->cnt_numarasi)) {
            $currentCnt = (int)$lastLog->cnt_numarasi;
        }

        $nextCnt = ($currentCnt >= 99) ? 1 : $currentCnt + 1;
        return str_pad((string)$nextCnt, 2, '0', STR_PAD_LEFT);
    }
    
    /**
     * Verilen dosyayı GZIP formatında sıkıştırır.
     * @param string $sourceFilePath
     * @return string|false Sıkıştırılmış dosyanın yolu veya hata durumunda false.
     */
    protected function compressToGz(string $sourceFilePath): string|false
    {
        $destinationFilePath = $sourceFilePath . '.gz';
        $gzFile = gzopen($destinationFilePath, 'wb9');
        if (!$gzFile) return false;
        
        $fileHandle = fopen($sourceFilePath, 'rb');
        if (!$fileHandle) {
            gzclose($gzFile);
            return false;
        }

        while (!feof($fileHandle)) {
            gzwrite($gzFile, fread($fileHandle, 1024 * 512));
        }

        fclose($fileHandle);
        gzclose($gzFile);

        return file_exists($destinationFilePath) ? $destinationFilePath : false;
    }

    // Her alt sınıf bu metotları kendi ihtiyacına göre doldurmak zorundadır.
    abstract protected function getReportData(): array;
    abstract protected function formatReportContent(array $data): string;
}
?>