<?php
/**
 * Personel Raporu Sınıfı
 *
 * BTK'nın talep ettiği formatta Personel Listesi Excel (.xlsx) dosyasını oluşturur.
 * Diğer raporlardan farklı olarak .abn yerine Excel formatı kullanır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.0.3
 */

namespace BtkReports\Rapor;

use BtkReports\Helper\BtkHelper;
use BtkReports\Exporter\ExcelExporter;
use WHMCS\Database\Capsule;

class PersonelRapor extends AbstractBtkRapor
{
    /**
     * Rapor türünü tanımlar.
     * @var string
     */
    protected const RAPOR_TURU = 'PERSONEL';

    /**
     * Rapor dosyasının uzantısını belirtir.
     * @var string
     */
    protected const RAPOR_DOSYA_UZANTISI = '.xlsx';

    /**
     * Personel raporu için yetki grubu gerekmez, bu yüzden null olarak ayarlanır.
     */
    public function __construct(array $settings, \BtkReports\Manager\FtpManager $ftpManager, ?string $yetkiGrup = null)
    {
        parent::__construct($settings, $ftpManager, null);
    }
    
    /**
     * Personel Raporunu oluşturur ve ExcelExporter kullanarak indirilebilir hale getirir.
     * Bu rapor sıkıştırılmaz (.gz).
     *
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

            // Personel raporu için CNT her zaman '01'dir.
            $cnt = '01';
            $filename = $this->generateFilename($cnt);

            $filePathOrSuccess = ExcelExporter::exportPersonelList(
                $data,
                $filename,
                $outputToBrowser, // Tarayıcıya mı yoksa dosyaya mı?
                $this->tempDir    // Kaydedilecekse kullanılacak yol
            );

            if (!$filePathOrSuccess) {
                throw new \Exception("ExcelExporter personel listesini oluşturamadı.");
            }
            
            // Tarayıcıya çıktı verildiyse script zaten sonlanır.
            // Dosyaya kaydedildiyse, bilgileri döndür.
            if ($outputToBrowser === false) {
                return [
                    'status' => true,
                    'message' => 'Personel raporu başarıyla oluşturuldu.',
                    'file' => basename($filePathOrSuccess),
                    'file_path' => $filePathOrSuccess,
                    'file_name' => basename($filePathOrSuccess),
                    'cnt' => $cnt
                ];
            }
            
            return ['status' => true, 'message' => 'Rapor başarıyla tarayıcıya gönderildi.'];

        } catch (\Exception $e) {
            BtkHelper::logAction("PERSONEL Rapor Oluşturma/İndirme Hatası", 'HATA', $e->getMessage());
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Raporlanacak personel verilerini veritabanından çeker.
     *
     * @return array
     */
    protected function getReportData(): array
    {
        $personeller = Capsule::table('mod_btk_personel as p')
            ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
            ->where('p.btk_listesine_eklensin', 1)
            ->whereNull('p.isten_ayrilma_tarihi')
            ->select('p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn', 'p.unvan', 'd.departman_adi', 'p.mobil_tel', 'p.sabit_tel', 'p.email')
            ->orderBy('p.soyad')->orderBy('p.ad')
            ->get()
            ->map(fn($item) => (array)$item)
            ->all();
            
        $operatorTitle = $this->settings['operator_title'] ?: $this->settings['operator_name'];
        $reportData = [];

        foreach ($personeller as $personel) {
            $reportData[] = [
                'Firma Adı' => $operatorTitle, 
                'Adı' => $personel['ad'], 
                'Soyadı' => $personel['soyad'], 
                'TC Kimlik No' => $personel['tckn'], 
                'Ünvan' => $personel['unvan'], 
                'Çalıştığı birim' => $personel['departman_adi'], 
                'Mobil telefonu' => $personel['mobil_tel'], 
                'Sabit telefonu' => $personel['sabit_tel'], 
                'E-posta adresi' => $personel['email']
            ];
        }
        
        return $reportData;
    }

    /**
     * Personel raporu için içerik formatlama ExcelExporter tarafından yapıldığından bu metot boştur.
     *
     * @param array $data
     * @return string
     */
    protected function formatReportContent(array $data): string
    {
        return ''; // ExcelExporter bu işi hallediyor.
    }
    
    /**
     * Personel raporu için özel dosya adı oluşturma mantığı.
     * Ayarlara göre dosya adına yıl ve ay ekleyebilir.
     *
     * @param string $cnt
     * @param string $forFtpType
     * @return string
     */
    protected function generateFilename(string $cnt, string $forFtpType = 'main'): string
    {
        $cleanOperatorName = strtoupper(preg_replace('/[^A-Z0-9_]/i', '', trim($this->settings['operator_name'])));
        
        $addYearMonthSettingKey = "personel_filename_add_year_month_{$forFtpType}";
        $addYearMonth = ($this->settings[$addYearMonthSettingKey] ?? '0') === '1';
        $yearMonthPart = $addYearMonth ? "_" . gmdate('Y_m') : '';
        
        // Personel raporu için BTK genellikle sabit bir isim bekler. Yıl/Ay eklemek opsiyoneldir.
        return $cleanOperatorName . "_Personel_Listesi{$yearMonthPart}" . static::RAPOR_DOSYA_UZANTISI;
    }

    /**
     * Personel raporu için CNT her zaman '01'dir.
     *
     * @param string $ftpSunucuTipi 'ANA' veya 'YEDEK'
     * @return string
     */
    protected function getNextCnt(string $ftpSunucuTipi = 'ANA'): string
    {
        return '01';
    }
}
?>