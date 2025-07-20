<?php
/**
 * Soyut BTK Rapor Sınıfı (Abstract Base Class)
 *
 * Tüm somut rapor sınıfları (Rehber, Hareket, Personel) için ortak
 * özellikleri ve metotları tanımlar. Bu, kod tekrarını önler ve
 * rapor oluşturma sürecini standartlaştırır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Rapor;

use BtkReports\Manager\FtpManager;
use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;

abstract class AbstractBtkRapor implements BtkRaporInterface
{
    /**
     * Modül ayarlarını tutar.
     * @var array
     */
    protected array $settings;

    /**
     * FTP işlemlerini yöneten nesne.
     * @var FtpManager
     */
    protected FtpManager $ftpManager;

    /**
     * Raporun ait olduğu yetki grubu (örn: 'ISS', 'STH').
     * @var string|null
     */
    protected ?string $yetkiGrup;

    /**
     * Geçici dosyaların oluşturulacağı dizin.
     * @var string
     */
    protected string $tempDir;

    /**
     * Rapor türü sabiti. Her alt sınıf bunu kendi türüyle tanımlamalıdır.
     */
    protected const RAPOR_TURU = 'GENEL';

    /**
     * Rapor dosya uzantısı. Her alt sınıf bunu kendi türüyle tanımlamalıdır.
     */
    protected const RAPOR_DOSYA_UZANTISI = '.tmp';
    
    /**
     * AbstractBtkRapor constructor.
     *
     * @param array $settings Modülün genel ayarları.
     * @param FtpManager $ftpManager FTP işlemlerini yöneten nesne.
     * @param string|null $yetkiGrup Raporun ait olduğu yetki grubu.
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
     *
     * @param string $ftpType 'main' veya 'backup'.
     * @return array
     */
    public function olusturVeGonder(string $ftpType = 'main'): array
    {
        try {
            $data = $this->getReportData();

            if (empty($data) && ($this->settings['send_empty_reports'] ?? '0') !== '1') {
                $message = static::RAPOR_TURU . " raporu için veri bulunamadı. Boş rapor gönderimi kapalı olduğu için işlem atlandı.";
                BtkHelper::logAction(static::RAPOR_TURU . " Rapor Gönderimi Atlandı", 'INFO', $message, null, ['yetki_grup' => $this->yetkiGrup]);
                return ['status' => true, 'message' => $message, 'skipped' => true];
            }
            
            $cnt = $this->getNextCnt($ftpType === 'main' ? 'ANA' : 'YEDEK');
            $filename = $this->generateFilename($cnt, $ftpType);
            
            $tempFilePath = $this->createTempFile($filename, $this->formatReportContent($data));
            
            $compressedFilePath = $this->compressFile($tempFilePath, $filename);

            $uploadResult = $this->ftpManager->uploadFile(
                $compressedFilePath,
                basename($compressedFilePath),
                static::RAPOR_TURU,
                $this->yetkiGrup,
                $ftpType,
                $cnt
            );

            // Geçici dosyaları temizle
            @unlink($tempFilePath);
            @unlink($compressedFilePath);

            if ($uploadResult['status']) {
                $this->updateLastCnt($cnt, $ftpType === 'main' ? 'ANA' : 'YEDEK');
            }

            return $uploadResult;

        } catch (\Exception $e) {
            $errorMessage = static::RAPOR_TURU . " raporu oluşturulurken/gönderilirken hata: " . $e->getMessage();
            BtkHelper::logAction(static::RAPOR_TURU . " Rapor Hatası", 'KRITIK', $errorMessage, null, ['yetki_grup' => $this->yetkiGrup]);
            return ['status' => false, 'message' => $errorMessage];
        }
    }

    /**
     * Raporu oluşturur ve yerel olarak indirilebilir bir dosyaya kaydeder.
     *
     * @param bool $outputToBrowser
     * @return array
     */
    public function olusturVeIndir(bool $outputToBrowser = true): array
    {
        try {
            $data = $this->getReportData();

            if (empty($data) && ($this->settings['send_empty_reports'] ?? '0') !== '1') {
                return ['status' => false, 'message' => BtkHelper::getLang('noDataToExport')];
            }
            
            $cnt = $this->getNextCnt('ANA');
            $filename = $this->generateFilename($cnt, 'main');
            $content = $this->formatReportContent($data);

            if ($outputToBrowser) {
                // Tarayıcıya doğrudan gönder
                if (ob_get_level()) ob_end_clean();
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . $filename . '"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                echo $content;
                exit;
            } else {
                // Güvenli temp klasörüne kaydet
                $filePath = $this->createTempFile($filename, $content);
                return [
                    'status' => true,
                    'message' => 'Rapor başarıyla oluşturuldu.',
                    'file' => basename($filePath),
                    'file_path' => $filePath,
                    'file_name' => basename($filePath),
                    'cnt' => $cnt
                ];
            }

        } catch (\Exception $e) {
            BtkHelper::logAction(static::RAPOR_TURU . " Rapor İndirme Hatası", 'HATA', $e->getMessage());
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
    
    /**
     * Rapor için veriyi çeker. Her alt sınıf bu metodu kendi mantığına göre doldurmalıdır.
     * @return array
     */
    abstract protected function getReportData(): array;

    /**
     * Rapor verisini istenen formata dönüştürür. Her alt sınıf bunu kendi mantığına göre doldurmalıdır.
     * @param array $data
     * @return string
     */
    abstract protected function formatReportContent(array $data): string;

    /**
     * Rapor için bir sonraki CNT (sayaç) numarasını hesaplar.
     * @param string $ftpSunucuTipi 'ANA' veya 'YEDEK'
     * @return string
     */
    protected function getNextCnt(string $ftpSunucuTipi = 'ANA'): string
    {
        $settingKey = "last_cnt_{$ftpSunucuTipi}_" . static::RAPOR_TURU;
        if ($this->yetkiGrup) {
            $settingKey .= "_{$this->yetkiGrup}";
        }
        
        $lastCnt = (int)BtkHelper::get_btk_setting($settingKey, 0);
        $nextCnt = $lastCnt >= 99 ? 1 : $lastCnt + 1;
        
        return str_pad($nextCnt, 2, '0', STR_PAD_LEFT);
    }
    
    /**
     * Başarılı gönderim sonrası kullanılan CNT numarasını veritabanına kaydeder.
     * @param string $cnt
     * @param string $ftpSunucuTipi 'ANA' veya 'YEDEK'
     */
    protected function updateLastCnt(string $cnt, string $ftpSunucuTipi = 'ANA'): void
    {
        $settingKey = "last_cnt_{$ftpSunucuTipi}_" . static::RAPOR_TURU;
        if ($this->yetkiGrup) {
            $settingKey .= "_{$this->yetkiGrup}";
        }
        BtkHelper::set_btk_setting($settingKey, $cnt);
    }

    /**
     * Rapor için BTK formatına uygun dosya adını oluşturur.
     * @param string $cnt
     * @param string $forFtpType
     * @return string
     */
    protected function generateFilename(string $cnt, string $forFtpType = 'main'): string
    {
        $operatorName = strtoupper(preg_replace('/[^A-Z0-9_]/i', '', trim($this->settings['operator_name'])));
        $tip = $this->yetkiGrup ?: 'Genel';
        $tarih = gmdate('Ymd');
        $raporAdi = static::RAPOR_TURU;

        return "{$operatorName}_{$tip}_{$raporAdi}_{$tarih}_{$cnt}" . static::RAPOR_DOSYA_UZANTISI;
    }

    /**
     * Verilen içerikle geçici bir dosya oluşturur.
     * @param string $filename
     * @param string $content
     * @return string Oluşturulan dosyanın tam yolu.
     * @throws \Exception Dosya yazılamazsa.
     */
    protected function createTempFile(string $filename, string $content): string
    {
        $filePath = rtrim($this->tempDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
        if (file_put_contents($filePath, $content) === false) {
            throw new \Exception("Geçici dosya oluşturulamadı veya yazılamadı: {$filePath}");
        }
        return $filePath;
    }

    /**
     * Verilen dosyayı GZIP formatında sıkıştırır.
     * @param string $sourcePath
     * @param string $originalFilename
     * @return string Sıkıştırılmış dosyanın tam yolu.
     * @throws \Exception Sıkıştırma başarısız olursa.
     */
    protected function compressFile(string $sourcePath, string $originalFilename): string
    {
        $destPath = rtrim($this->tempDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . pathinfo($originalFilename, PATHINFO_FILENAME) . '.gz';
        $gz = gzopen($destPath, 'w9'); // 'w9' en yüksek sıkıştırma seviyesi
        if (!$gz) {
            throw new \Exception("GZIP dosyası açılamadı: {$destPath}");
        }
        gzwrite($gz, file_get_contents($sourcePath));
        gzclose($gz);
        
        return $destPath;
    }
}
?>