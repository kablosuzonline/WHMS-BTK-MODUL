<?php
/**
 * BTK Raporlama Modülü - Soyut Rapor Sınıfı (Abstract)
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu soyut sınıf, BtkRaporInterface arayüzünü uygular ve tüm somut rapor
 * sınıfları (AboneRehberRapor, PersonelRapor vb.) tarafından paylaşılacak
 * olan ortak özellikleri ve metodları içerir. Kod tekrarını önler ve
 * rapor oluşturma sürecini standartlaştırır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Rapor;

use BtkReports\Helper\BtkHelper;
use BtkReports\Manager\FtpManager;
use BtkReports\Manager\RaporManager;
use BtkReports\Manager\LogManager;

abstract class AbstractBtkRapor implements BtkRaporInterface
{
    protected string $raporTuru;
    protected array $settings;
    protected FtpManager $ftpManager;
    protected ?string $yetkiTuruGrup;

    /**
     * AbstractBtkRapor constructor.
     */
    public function __construct(string $raporTuru, array $settings, FtpManager $ftpManager, ?string $yetkiTuruGrup = null)
    {
        $this->raporTuru = $raporTuru;
        $this->settings = $settings;
        $this->ftpManager = $ftpManager;
        $this->yetkiTuruGrup = $yetkiTuruGrup;
    }

    /**
     * Rapor için gereken veriyi veritabanından çeker.
     * Bu metod, her bir somut rapor sınıfı tarafından kendi mantığına göre
     * ezilerek (override edilerek) uygulanmalıdır.
     */
    abstract protected function getRaporVerisi(): array;

    /**
     * Raporu oluşturur, geçici bir dosyaya yazar ve indirme linkini döner.
     */
    public function olusturVeIndir(bool $isPersonelRaporu = false): array
    {
        LogManager::logAction("Rapor Oluşturma/İndirme Denemesi ({$this->raporTuru})", 'UYARI', "Grup: {$this->yetkiTuruGrup}");
        try {
            $dosyaAdi = $this->generateFileName($isPersonelRaporu);
            $dosyaYolu = BtkHelper::getModuleTempPath() . DIRECTORY_SEPARATOR . $dosyaAdi;

            $icerik = $this->generateFileContent();
            if (empty($icerik)) {
                return ['status' => true, 'message' => BtkHelper::getLang('noDataToExport')];
            }

            file_put_contents($dosyaYolu, $icerik);
            
            $downloadLink = BtkHelper::get_btk_setting('SystemURL') . '/yonet/addonmodules.php?module=btkreports&direct_action=download_file&file=' . urlencode($dosyaAdi) . '&' . BtkreportsCsrfHelper::getTokenName() . '=' . BtkreportsCsrfHelper::generateToken();
            
            LogManager::logAction("Rapor Başarıyla Oluşturuldu ({$this->raporTuru})", 'INFO', "Dosya adı: {$dosyaAdi}");
            return ['status' => true, 'message' => "Rapor başarıyla oluşturuldu.", 'download_link' => $downloadLink];

        } catch (\Exception $e) {
            LogManager::logAction("Rapor Oluşturma/İndirme BAŞARISIZ ({$this->raporTuru})", 'HATA', $e->getMessage());
            return ['status' => false, 'message' => 'Hata: ' . $e->getMessage()];
        }
    }

    /**
     * Raporu oluşturur ve belirtilen FTP sunucusuna gönderir.
     */
    public function olusturVeGonder(string $ftpType): array
    {
        LogManager::logAction("Rapor Gönderme Denemesi ({$this->raporTuru} -> {$ftpType})", 'UYARI', "Grup: {$this->yetkiTuruGrup}");
        try {
            $isPersonelRaporu = ($this->raporTuru === 'PERSONEL');
            $dosyaAdi = $this->generateFileName($isPersonelRaporu, $ftpType);
            $dosyaYolu = BtkHelper::getModuleTempPath() . DIRECTORY_SEPARATOR . $dosyaAdi;
            
            $icerik = $this->generateFileContent();

            if (empty($icerik) && BtkHelper::get_btk_setting('send_empty_reports', '1') !== '1') {
                return ['status' => true, 'skipped' => true, 'message' => 'Gönderilecek yeni veri bulunmadığı için rapor gönderimi atlandı.'];
            }
            
            file_put_contents($dosyaYolu, $icerik);
            
            $result = $this->ftpManager->uploadFile($dosyaYolu, $ftpType, $this->raporTuru, $this->yetkiTuruGrup, $this->getCntNumber());
            
            @unlink($dosyaYolu); // Gönderim sonrası geçici dosyayı sil
            
            return $result;

        } catch (\Exception $e) {
            LogManager::logAction("Rapor Gönderme BAŞARISIZ ({$this->raporTuru})", 'KRITIK', $e->getMessage());
            return ['status' => false, 'message' => 'Hata: ' . $e->getMessage()];
        }
    }

    /**
     * Raporun içeriğini (satırları) oluşturur.
     */
    protected function generateFileContent(): string
    {
        $raporVerisi = $this->getRaporVerisi();
        if (empty($raporVerisi)) {
            return '';
        }
        
        $alanSiralamasi = RaporManager::getBtkAlanSiralamasi($this->yetkiTuruGrup);
        $contentLines = [];

        foreach ($raporVerisi as $dataRow) {
            $contentLines[] = RaporManager::formatAbnRow($dataRow, $alanSiralamasi);
        }

        return implode("\n", $contentLines);
    }
    
    /**
     * BTK formatına uygun dosya adını oluşturur.
     */
    protected function generateFileName(bool $isPersonelRaporu = false, string $ftpType = 'main'): string
    {
        $operatorName = $this->settings['operator_name'] ?? 'OPERATOR';
        $reportType = $this->raporTuru;
        $yetkiGrup = $this->yetkiTuruGrup ?? '';
        $date = date('Ymd');
        $cnt = $this->getCntNumber();
        
        $addYearMonth = BtkHelper::get_btk_setting("personel_filename_add_year_month_{$ftpType}", '0') === '1';

        if ($isPersonelRaporu) {
             if ($addYearMonth) {
                return "{$operatorName}_{$reportType}_" . date('Ym') . ".{$cnt}";
             }
             return "{$operatorName}_{$reportType}.{$cnt}";
        }
        
        return "{$operatorName}_{$reportType}_{$yetkiGrup}_{$date}.{$cnt}";
    }
    
    /**
     * Günlük CNT numarasını alır.
     */
    protected function getCntNumber(): string
    {
        return RaporManager::getNextCntNumber($this->raporTuru, $this->yetkiTuruGrup);
    }
}