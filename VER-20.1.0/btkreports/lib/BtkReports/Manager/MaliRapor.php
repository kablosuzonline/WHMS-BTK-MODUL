<?php
/**
 * BTK Raporlama Modülü - Muhasebe İçin Mali Rapor Sınıfı
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
 *
 * ANKA-PHOENIX Sürüm Notları (Anayasal Uyum):
 * - Bu sınıfın temel fonksiyonları, projenin yeni anayasasına (dosya formatı,
 *   adlandırma kuralları vb.) uyum sağlayan ve bu değişikliklerden etkilenen
 *   `ExcelExporter` ve `EFaturaManager` sınıflarıyla tam entegre çalışır.
 * - Hata yönetimi ve loglama, merkezi LogManager ile tam entegre hale getirildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Rapor;

use BtkReports\Exporter\ExcelExporter;
use BtkReports\Manager\EFaturaManager;
use BtkReports\Manager\LogManager;
use BtkReports\Helper\BtkHelper;
use BtkreportsCsrfHelper;

class MaliRapor
{
    private array $settings;
    private string $startDate;
    private string $endDate;

    /**
     * MaliRapor constructor.
     */
    public function __construct(array $settings, string $startDate, string $endDate)
    {
        $this->settings = $settings;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
     * "Giden Faturalar" Excel raporunu oluşturur ve indirme linkini döndürür.
     * @return array
     */
    public function olusturVeIndir(): array
    {
        LogManager::logAction("Muhasebe Raporu Oluşturma Denemesi", 'UYARI', "Tarih Aralığı: {$this->startDate} - {$this->endDate}");
        try {
            $faturaVerisi = EFaturaManager::getFaturalarByDateRange($this->startDate, $this->endDate);

            if (empty($faturaVerisi)) {
                return ['status' => true, 'message' => BtkHelper::getLang('noDataToExport')];
            }

            $exporter = new ExcelExporter();
            $dosyaYolu = $exporter->createGidenFaturalarExcel($this->startDate, $this->endDate, $faturaVerisi);
            $dosyaAdi = basename($dosyaYolu);

            LogManager::logAction("Muhasebe Raporu Oluşturuldu", 'INFO', "Giden Faturalar raporu ({$this->startDate} - {$this->endDate}) başarıyla oluşturuldu.", null, ['dosya_adi' => $dosyaAdi]);
            
            $downloadLink = '../modules/addons/btkreports/download.php?file=' . urlencode($dosyaAdi) . '&' . BtkreportsCsrfHelper::getTokenName() . '=' . BtkreportsCsrfHelper::generateToken();
            
            return ['status' => true, 'message' => "Rapor başarıyla oluşturuldu.", 'download_link' => $downloadLink];

        } catch (\Exception $e) {
            LogManager::logAction("Muhasebe Raporu Oluşturma BAŞARISIZ", 'HATA', $e->getMessage());
            return ['status' => false, 'message' => 'Hata: ' . $e->getMessage()];
        }
    }
}