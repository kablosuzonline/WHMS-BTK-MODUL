<?php
/**
 * BTK CEVHER Rapor Veri Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX - Anayasal Uyum)
 *
 * ANKA-PHOENIX Sürüm Notları (Anayasal Uyum):
 * - Raporlama mantığı, BTK'nın "Bütünsel Form" mimarisine uygun olarak
 *   yeniden düzenlendi. Artık parça parça değil, yetki grubuna göre
 *   filtrelenmiş tam veri setleri döndürür.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;

class CevherManager
{
    // ==================================================================
    // == RAPOR VERİ TOPLAMA FONKSİYONLARI
    // ==================================================================

    /**
     * Belirtilen çeyrek için Abone Sayıları raporu verisini, istenen yetki grubuna göre filtrelenmiş olarak hazırlar.
     *
     * @param int $yil Raporun yılı.
     * @param int $ceyrek Raporun çeyreği.
     * @param string|null $yetkiGrup 'ISS', 'STH' gibi bir grup veya null (tümü için).
     * @return array Başlıkları ve veri satırlarını içeren bir dizi.
     */
    public static function getAboneSayilariVerisi(int $yil, int $ceyrek, ?string $yetkiGrup = null): array
    {
        list($startDate, $endDate) = self::getDateRangeForCeyrek($yil, $ceyrek);

        $query = Capsule::table('mod_btk_abone_rehber as r')
            ->join('tblclients as c', 'r.whmcs_client_id', '=', 'c.id')
            ->leftJoin('mod_btk_adres_il as il', 'r.tesis_il_id', '=', 'il.id')
            ->leftJoin('tblhosting as h', 'r.whmcs_service_id', '=', 'h.id')
            ->leftJoin('tblproducts as p', 'h.packageid', '=', 'p.id')
            ->leftJoin('mod_btk_product_group_mappings as pgm', 'p.gid', '=', 'pgm.gid')
            ->leftJoin('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('r.abone_baslangic', '<=', $endDate->format('YmdHis'))
            ->where(function ($q) use ($endDate) {
                $q->whereNull('r.abone_bitis')
                  ->orWhere('r.abone_bitis', '>', $endDate->format('YmdHis'));
            });

        if ($yetkiGrup) {
            $query->where('ytr.grup', $yetkiGrup);
        }

        $aboneVerisi = $query->select(
                Capsule::raw("IFNULL(il.il_adi, 'Bilinmiyor') as il_adi"),
                'r.hizmet_tipi',
                Capsule::raw("CASE WHEN c.companyname != '' THEN 'Kurumsal' ELSE 'Bireysel' END as abone_tipi"),
                Capsule::raw("COUNT(DISTINCT r.id) as toplam_abone")
            )
            ->groupBy('il_adi', 'r.hizmet_tipi', 'abone_tipi')
            ->get()->map(fn($item) => (array)$item)->all();

        $headers = ['İl', 'Hizmet Türü', 'Abone Tipi', 'Abone Sayısı'];
        $data = [];
        foreach ($aboneVerisi as $row) {
            $data[] = [
                $row['il_adi'],
                $row['hizmet_tipi'] ?? 'Diğer',
                $row['abone_tipi'],
                $row['toplam_abone']
            ];
        }

        return ['headers' => $headers, 'data' => $data];
    }

    /**
     * Belirtilen çeyrek için Gelirler raporu verisini, istenen yetki grubuna göre filtrelenmiş olarak hazırlar.
     */
    public static function getGelirVerisi(int $yil, int $ceyrek, ?string $yetkiGrup = null): array
    {
        list($startDate, $endDate) = self::getDateRangeForCeyrek($yil, $ceyrek);

        $query = Capsule::table('mod_btk_efatura_kayitlari as ef');

        // Gelirleri yetki grubuna göre filtrele
        if ($yetkiGrup) {
            $query->join('tblinvoiceitems as ii', 'ef.whmcs_invoice_id', '=', 'ii.invoiceid')
                  ->join('tblhosting as h', 'ii.relid', '=', 'h.id')
                  ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
                  ->join('mod_btk_product_group_mappings as pgm', 'p.gid', '=', 'pgm.gid')
                  ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
                  ->where('ytr.grup', $yetkiGrup);
        }

        $gelirVerisi = $query
            ->whereBetween('ef.olusturma_tarihi', [$startDate->format('Y-m-d H:i:s'), $endDate->format('Y-m-d H:i:s')])
            ->selectRaw('SUM(ef.tutar) as net_gelir, SUM(ef.kdv) as toplam_kdv, SUM(ef.oiv_tutar) as toplam_oiv')
            ->first();

        // Hizmet türüne göre gelir dökümü
        $gelirlerByHizmetTuru = Capsule::table('mod_btk_efatura_kayitlari as ef')
            ->join('tblinvoiceitems as ii', 'ef.whmcs_invoice_id', '=', 'ii.invoiceid')
            ->join('tblhosting as h', 'ii.relid', '=', 'h.id')
            ->join('mod_btk_abone_rehber as r', 'h.id', '=', 'r.whmcs_service_id')
            ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
            ->join('mod_btk_product_group_mappings as pgm', 'p.gid', '=', 'pgm.gid')
            ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('ytr.grup', $yetkiGrup)
            ->whereBetween('ef.olusturma_tarihi', [$startDate->format('Y-m-d H:i:s'), $endDate->format('Y-m-d H:i:s')])
            ->groupBy('r.hizmet_tipi')
            ->select('r.hizmet_tipi', Capsule::raw('SUM(ef.tutar) as toplam_gelir'))
            ->get()->map(fn($item) => (array)$item)->all();
            
        return [
            'toplam_gelirler' => [
                ['Net Gelir (Vergiler Hariç)', number_format($gelirVerisi->net_gelir ?? 0.0, 2, ',', '.')],
                ['Toplam KDV', number_format($gelirVerisi->toplam_kdv ?? 0.0, 2, ',', '.')],
                ['Toplam ÖİV', number_format($gelirVerisi->toplam_oiv ?? 0.0, 2, ',', '.')],
                ['Vergiler Dahil Toplam Hasılat', number_format(($gelirVerisi->net_gelir ?? 0.0) + ($gelirVerisi->toplam_kdv ?? 0.0) + ($gelirVerisi->toplam_oiv ?? 0.0), 2, ',', '.')]
            ],
            'hizmet_tipi_gelirleri' => $gelirlerByHizmetTuru
        ];
    }

    /**
     * Altyapı raporu verisini hazırlar.
     */
    public static function getAltyapiVerisi(int $yil, int $ceyrek, ?string $yetkiGrup = null): array
    {
        $popSayisi = Capsule::table('mod_btk_iss_pop_noktalari')->where('aktif_pasif_durum', 1)->count();
        $headers = ['Altyapı Kalemi', 'Değer'];
        $data = [['Aktif POP Noktası Sayısı', $popSayisi]];
        return ['headers' => $headers, 'data' => $data];
    }

     /**
     * İnsan Kaynakları raporu verisini hazırlar.
     */
    public static function getInsanKaynaklariVerisi(int $yil, int $ceyrek, ?string $yetkiGrup = null): array
    {
        list($startDate, $endDate) = self::getDateRangeForCeyrek($yil, $ceyrek);

        $personelVerisi = Capsule::table('mod_btk_personel')
            ->where('ise_baslama_tarihi', '<=', $endDate->format('Y-m-d'))
            ->where(function ($query) use ($endDate) {
                $query->whereNull('isten_ayrilma_tarihi')
                      ->orWhere('isten_ayrilma_tarihi', '>', $endDate->format('Y-m-d'));
            })
            ->select('cinsiyet', 'ogrenim_durumu', 'personel_statusu', 'engelli_mi', 'yabanci_uyruklu_mu')
            ->get()->map(fn($item) => (array)$item)->all();
            
        $headers = ['Personel Statüsü', 'Öğrenim Durumu', 'Cinsiyet', 'Toplam Sayı'];
        $data = [];
        $summary = ['Toplam' => 0, 'Engelli' => 0, 'Yabancı' => 0, 'Erkek' => 0, 'Kadın' => 0];
        
        $groupedData = [];
        foreach ($personelVerisi as $personel) {
            $status = $personel['personel_statusu'] ?: 'Belirtilmemiş';
            $ogrenim = $personel['ogrenim_durumu'] ?: 'Belirtilmemiş';
            $cinsiyet = $personel['cinsiyet'] ?: 'Belirtilmemiş';
            $key = "{$status}|{$ogrenim}|{$cinsiyet}";
            $groupedData[$key] = ($groupedData[$key] ?? 0) + 1;
            
            $summary['Toplam']++;
            if ($personel['engelli_mi']) $summary['Engelli']++;
            if ($personel['yabanci_uyruklu_mu']) $summary['Yabancı']++;
            if ($cinsiyet === 'E') $summary['Erkek']++;
            if ($cinsiyet === 'K') $summary['Kadın']++;
        }
        
        foreach ($groupedData as $key => $count) {
            list($status, $ogrenim, $cinsiyet) = explode('|', $key);
            $data[] = [$status, $ogrenim, $cinsiyet, $count];
        }
        
        $data[] = [];
        $data[] = ['ÖZET', 'Değer', '', ''];
        $data[] = ['Toplam Personel', $summary['Toplam'], '', ''];
        $data[] = ['Toplam Erkek', $summary['Erkek'], '', ''];
        $data[] = ['Toplam Kadın', $summary['Kadın'], '', ''];
        $data[] = ['Engelli Personel Sayısı', $summary['Engelli'], '', ''];
        $data[] = ['Yabancı Uyruklu Personel Sayısı', $summary['Yabancı'], '', ''];
        
        return ['headers' => $headers, 'data' => $data];
    }
    
    private static function getDateRangeForCeyrek(int $yil, int $ceyrek): array
    {
        switch ($ceyrek) {
            case 1: return [new \DateTime("{$yil}-01-01 00:00:00"), new \DateTime("{$yil}-03-31 23:59:59")];
            case 2: return [new \DateTime("{$yil}-04-01 00:00:00"), new \DateTime("{$yil}-06-30 23:59:59")];
            case 3: return [new \DateTime("{$yil}-07-01 00:00:00"), new \DateTime("{$yil}-09-30 23:59:59")];
            case 4: return [new \DateTime("{$yil}-10-01 00:00:00"), new \DateTime("{$yil}-12-31 23:59:59")];
            default: throw new \InvalidArgumentException("Geçersiz çeyrek değeri: {$ceyrek}");
        }
    }
}