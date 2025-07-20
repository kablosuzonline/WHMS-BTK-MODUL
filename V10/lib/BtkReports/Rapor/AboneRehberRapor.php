<?php
/**
 * Abone Rehber Raporu Sınıfı
 *
 * BTK şartnamesine uygun olarak, belirtilen yetki grubuna ait TÜM abonelerin
 * (aktif, pasif, iptal) kümülatif ve tam bir dökümünü içeren REHBER raporunu oluşturur.
 * Bu rapor, her ayın belirli bir gününde sistemin tam bir fotoğrafını çeker.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Rapor;

use BtkReports\Helper\BtkHelper;
use WHMCS\Database\Capsule;

class AboneRehberRapor extends AbstractBtkRapor
{
    /**
     * Rapor türünü tanımlar.
     * @var string
     */
    protected const RAPOR_TURU = 'REHBER';

    /**
     * Rapor dosyasının uzantısını belirtir.
     * @var string
     */
    protected const RAPOR_DOSYA_UZANTISI = '.abn';

    /**
     * REHBER raporu için ilgili yetki grubuna ait TÜM abonelerin verilerini
     * veritabanından, durumlarına bakılmaksızın çeker.
     *
     * @return array
     * @throws \Exception Yetki grubu belirtilmemişse fırlatılır.
     */
    protected function getReportData(): array
    {
        if (empty($this->yetkiGrup)) {
            throw new \Exception("REHBER raporu oluşturulabilmesi için Yetki Grubu belirtilmelidir.");
        }

        BtkHelper::logAction(
            "Rehber Veri Çekme Başladı",
            "DEBUG",
            "Yetki Grubu: {$this->yetkiGrup}"
        );

        // DOĞRU SORGULAMA:
        // Sorgu, bir hizmetin (tblhosting) ürün grubu (tblproducts.gid) üzerinden
        // yetki eşleştirme tablosuna (mod_btk_product_group_mappings) bağlanır.
        // Oradan da yetki referans tablosuna (mod_btk_yetki_turleri_referans)
        // bağlanarak doğru yetki grubuna ait hizmetleri bulur.
        // Bu sorguda hizmetin durumuna göre (domainstatus) filtreleme yapılmaz.
        $rehberKayitlari = Capsule::table('mod_btk_abone_rehber as abr')
            ->join('tblhosting as h', 'abr.whmcs_service_id', '=', 'h.id')
            ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
            ->join('mod_btk_product_group_mappings as pgm', 'p.gid', '=', 'pgm.gid')
            ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('ytr.grup', $this->yetkiGrup)
            ->select('abr.*') // mod_btk_abone_rehber tablosundaki tüm sütunları seç
            ->orderBy('abr.id', 'asc')
            ->get()
            ->map(fn($item) => (array) $item)
            ->all();

        BtkHelper::logAction(
            "Rehber Veri Çekme Tamamlandı",
            "INFO",
            "Yetki Grubu '{$this->yetkiGrup}' için " . count($rehberKayitlari) . " adet kayıt bulundu ve rapora dahil edilecek."
        );

        return $rehberKayitlari;
    }

    /**
     * Çekilen REHBER verilerini BTK'nın istediği .abn satır formatına dönüştürür.
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
            throw new \Exception("REHBER raporu için BTK alan sıralaması alınamadı. Yetki Grubu: " . $this->yetkiGrup);
        }

        foreach ($data as $row) {
            // Her satırı formatlayıp sonuna yeni satır karakteri ekle
            $content .= BtkHelper::formatAbnRow($row, $alanSiralamasi) . "\n";
        }

        return $content;
    }
}
?>