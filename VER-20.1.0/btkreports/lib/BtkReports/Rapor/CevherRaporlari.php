<?php
/**
 * BTK Raporlama Modülü - CEVHER Rapor Sınıfı
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, Excel (.xlsx) formatında raporlar üretir. BTK'nın CEVHER
 * platformu için talep ettiği 4 ana çeyrek raporunu (Abone Sayıları,
 * Gelirler, Altyapı, İnsan Kaynakları) oluşturmakla görevlidir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Rapor;

use BtkReports\Exporter\ExcelExporter;
use BtkReports\Manager\CevherManager;
use BtkReports\Manager\LogManager;
use BtkReports\Helper\BtkHelper;

class CevherRaporlari
{
    private array $settings;
    private int $yil;
    private int $ceyrek;

    /**
     * CevherRaporlari constructor.
     */
    public function __construct(array $settings, int $yil, int $ceyrek)
    {
        $this->settings = $settings;
        $this->yil = $yil;
        $this->ceyrek = $ceyrek;
    }

    /**
     * Belirtilen rapor türü için Excel dosyasını oluşturur ve indirme linkini döndürür.
     */
    public function olusturVeIndir(string $raporTuru): array
    {
        LogManager::logAction("CEVHER Raporu Oluşturma Denemesi", 'UYARI', "Rapor: {$raporTuru}, Yıl: {$this->yil}, Çeyrek: {$this->ceyrek}");
        try {
            $raporTuru = strtoupper($raporTuru);
            $veri = [];

            switch ($raporTuru) {
                case 'ABONE':
                    $veri = CevherManager::getAboneSayilariVerisi($this->yil, $this->ceyrek);
                    break;
                case 'GELIR':
                    $veri = CevherManager::getGelirVerisi($this->yil, $this->ceyrek);
                    break;
                case 'ALTYAPI':
                    $veri = CevherManager::getAltyapiVerisi($this->yil, $this->ceyrek);
                    break;
                case 'IK':
                    $veri = CevherManager::getInsanKaynaklariVerisi($this->yil, $this->ceyrek);
                    break;
                default:
                    throw new \Exception("Geçersiz CEVHER rapor türü: {$raporTuru}");
            }

            if (empty($veri['data'])) {
                return ['status' => true, 'message' => BtkHelper::getLang('noDataToExport')];
            }

            $exporter = new ExcelExporter();
            $dosyaYolu = $exporter->createCevherExcel($raporTuru, $this->yil, $this->ceyrek, $veri['headers'], $veri['data']);
            $dosyaAdi = basename($dosyaYolu);

            LogManager::logAction("CEVHER Raporu Oluşturuldu", 'INFO', "{$raporTuru} raporu (Yıl: {$this->yil}, Çeyrek: {$this->ceyrek}) başarıyla oluşturuldu.", null, ['dosya_adi' => $dosyaAdi]);
            
            $downloadLink = BtkHelper::get_btk_setting('SystemURL') . '/yonet/addonmodules.php?module=btkreports&direct_action=download_file&file=' . urlencode($dosyaAdi) . '&' . BtkreportsCsrfHelper::getTokenName() . '=' . BtkreportsCsrfHelper::generateToken();
            
            return ['status' => true, 'message' => "Rapor başarıyla oluşturuldu.", 'download_link' => $downloadLink];

        } catch (\Exception $e) {
            LogManager::logAction("CEVHER Raporu Oluşturma BAŞARISIZ ({$raporTuru})", 'HATA', $e->getMessage());
            return ['status' => false, 'message' => 'Hata: ' . $e->getMessage()];
        }
    }
}