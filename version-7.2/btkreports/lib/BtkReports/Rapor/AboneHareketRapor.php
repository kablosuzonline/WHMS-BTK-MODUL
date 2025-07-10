<?php
/**
 * Abone Hareket Raporu Sınıfı
 *
 * Abone yaşam döngüsündeki değişiklikleri (yeni abonelik, durum değişikliği, iptal vb.)
 * içeren HAREKET raporunu oluşturur ve yönetir. Sadece gönderilmemiş hareketleri işler.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2
 */

namespace BtkReports\Rapor;

use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;

class AboneHareketRapor extends AbstractBtkRapor
{
    /**
     * Rapor türünü tanımlar. Bu, dosya adlandırma ve loglama için kullanılır.
     * @var string
     */
    protected const RAPOR_TURU = 'HAREKET';

    /**
     * Rapor dosyasının uzantısını belirtir.
     * @var string
     */
    protected const RAPOR_DOSYA_UZANTISI = '.abn';

    /**
     * Raporla gönderilecek hareketlerin veritabanı ID'lerini tutar.
     * @var array
     */
    private array $gonderilecekHareketIdleri = [];

    /**
     * Raporu oluşturur, sıkıştırır ve belirtilen FTP sunucusuna gönderir.
     * Başarılı gönderim sonrası hareketleri "gönderildi" olarak işaretler.
     *
     * @param string $ftpType 'main' veya 'backup'.
     * @return array
     */
    public function olusturVeGonder(string $ftpType = 'main'): array
    {
        $result = parent::olusturVeGonder($ftpType);

        // Sadece ana FTP'ye başarılı gönderim yapıldığında ve rapor atlanmadıysa hareketleri işaretle.
        if ($ftpType === 'main' && $result['status'] && !($result['skipped'] ?? false)) {
            $this->markAsSent();
        }
        
        return $result;
    }

    /**
     * HAREKET raporu için sadece gönderilmemiş ve ilgili yetki grubuna ait verileri çeker.
     *
     * @return array Raporlanacak veriyi içeren dizi.
     * @throws \Exception Yetki grubu belirtilmemişse fırlatılır.
     */
    protected function getReportData(): array
    {
        if (empty($this->yetkiGrup)) {
            throw new \Exception("HAREKET raporu için Yetki Grubu belirtilmelidir.");
        }

        // Gönderilmemiş hareketleri, ilişkili oldukları hizmetin ürün grubu üzerinden filtrele
        $hareketler = Capsule::table('mod_btk_abone_hareket_live as ahl')
            ->join('mod_btk_abone_rehber as abr', 'ahl.rehber_kayit_id', '=', 'abr.id')
            ->join('tblhosting as h', 'abr.whmcs_service_id', '=', 'h.id')
            ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
            ->join('mod_btk_product_group_mappings as pgm', 'p.gid', '=', 'pgm.gid')
            ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('ahl.gonderildi_flag', 0)
            ->where('ytr.grup', $this->yetkiGrup)
            ->orderBy('ahl.kayit_zamani', 'ASC')
            ->select('ahl.*') // Sadece hareket tablosundaki verileri alıyoruz, snapshot JSON'da zaten var.
            ->get();

        $reportData = [];
        $this->gonderilecekHareketIdleri = [];

        foreach ($hareketler as $hareket) {
            $hareketData = (array)$hareket;
            $snapshotData = json_decode($hareketData['islem_detayi_json'], true);

            if (is_array($snapshotData)) {
                // JSON snapshot'ındaki verileri, hareket anındaki ana verilerle birleştir.
                // Hareket tablosundaki anlık veriler (hareket kodu, zamanı vb.) önceliklidir.
                $finalRow = array_merge($snapshotData, [
                    'musteri_hareket_kodu' => $hareketData['musteri_hareket_kodu'],
                    'musteri_hareket_aciklama' => $hareketData['musteri_hareket_aciklama'],
                    'musteri_hareket_zamani' => $hareketData['musteri_hareket_zamani'],
                ]);
                $reportData[] = $finalRow;
                $this->gonderilecekHareketIdleri[] = $hareketData['id'];
            }
        }
        
        return $reportData;
    }

    /**
     * Çekilen HAREKET verilerini BTK'nın istediği .abn satır formatına dönüştürür.
     *
     * @param array $data Raporlanacak veri satırları.
     * @return string Formatlanmış tam dosya içeriği.
     * @throws \Exception Alan sıralaması bulunamazsa fırlatılır.
     */
    protected function formatReportContent(array $data): string
    {
        $content = "";
        $alanSiralamasi = BtkHelper::getBtkAlanSiralamasi(static::RAPOR_TURU, $this->yetkiGrup);

        if (empty($alanSiralamasi)) {
            throw new \Exception("HAREKET raporu için BTK alan sıralaması alınamadı. Yetki Grubu: " . $this->yetkiGrup);
        }

        foreach ($data as $row) {
            $content .= BtkHelper::formatAbnRow($row, $alanSiralamasi) . "\n";
        }

        return $content;
    }

    /**
     * Rapor başarıyla gönderildikten sonra, ilgili hareket kayıtlarını
     * veritabanında "gönderildi" olarak işaretler.
     *
     * @return bool
     */
    private function markAsSent(): bool
    {
        if (empty($this->gonderilecekHareketIdleri)) {
            return true; // İşaretlenecek hareket yoksa, başarılı say.
        }

        try {
            $updated = Capsule::table('mod_btk_abone_hareket_live')
                ->whereIn('id', $this->gonderilecekHareketIdleri)
                ->update(['gonderildi_flag' => 1]);
            
            if ($updated > 0) {
                BtkHelper::logAction(
                    'Hareketler Gönderildi İşaretlendi',
                    'INFO',
                    "{$updated} adet HAREKET kaydı ({$this->yetkiGrup}) gönderildi olarak işaretlendi."
                );
            }
            return true;
        } catch (\Exception $e) {
            BtkHelper::logAction(
                'Hareket İşaretleme Hatası',
                'HATA',
                "Hareketler gönderildi olarak işaretlenirken hata: " . $e->getMessage()
            );
            return false;
        }
    }
}
?>