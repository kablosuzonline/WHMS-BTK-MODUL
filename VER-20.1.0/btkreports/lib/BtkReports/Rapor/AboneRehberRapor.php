<?php
/**
 * BTK Raporlama Modülü - Abone REHBER Rapor Sınıfı
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, AbstractBtkRapor'dan türer ve Abone Rehber raporlarının
 * oluşturulması için gerekli olan spesifik veri çekme mantığını içerir.
 * Rapor, modülün kendi `mod_btk_abone_rehber` tablosundaki tüm abonelerin
 * (iptal olanlar dahil) en güncel durumunu yansıtan tam bir dökümüdür.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Rapor;

use WHMCS\Database\Capsule;

class AboneRehberRapor extends AbstractBtkRapor
{
    /**
     * Abone Rehber raporu için gereken veriyi veritabanından çeker.
     *
     * Bu metod, `mod_btk_abone_rehber` tablosundaki, raporun ait olduğu
     * yetki grubuyla eşleşen TÜM kayıtları seçer. Adres bilgilerini
     * (il, ilçe, mahalle) ve POP noktası bilgilerini de bu sorguya dahil eder.
     *
     * @return array Rapor satırlarını içeren bir dizi.
     */
    protected function getRaporVerisi(): array
    {
        $yetkiKoduSubquery = Capsule::table('mod_btk_product_group_mappings as pgm')
            ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('ytr.grup', $this->yetkiTuruGrup)
            ->select('pgm.gid');

        $serviceIds = Capsule::table('tblhosting as h')
            ->join('tblproducts as p', 'h.packageid', '=', 'p.id')
            ->whereIn('p.gid', $yetkiKoduSubquery)
            ->pluck('h.id');

        if ($serviceIds->isEmpty()) {
            return [];
        }

        $data = Capsule::table('mod_btk_abone_rehber as r')
            ->leftJoin('mod_btk_adres_il as yerlesim_il', 'r.yerlesim_il_id', '=', 'yerlesim_il.id')
            ->leftJoin('mod_btk_adres_ilce as yerlesim_ilce', 'r.yerlesim_ilce_id', '=', 'yerlesim_ilce.id')
            ->leftJoin('mod_btk_adres_mahalle as yerlesim_mahalle', 'r.yerlesim_mahalle_id', '=', 'yerlesim_mahalle.id')
            ->leftJoin('mod_btk_adres_il as tesis_il', 'r.tesis_il_id', '=', 'tesis_il.id')
            ->leftJoin('mod_btk_adres_ilce as tesis_ilce', 'r.tesis_ilce_id', '=', 'tesis_ilce.id')
            ->leftJoin('mod_btk_adres_mahalle as tesis_mahalle', 'r.tesis_mahalle_id', '=', 'tesis_mahalle.id')
            ->leftJoin('mod_btk_iss_pop_noktalari as pop', 'r.iss_pop_noktasi_id', '=', 'pop.id')
            ->whereIn('r.whmcs_service_id', $serviceIds)
            // ANASAYAL UYUM: İptal edilmiş kayıtları da dahil et. Filtre kaldırıldı.
            ->select(
                'r.*',
                Capsule::raw("IFNULL(yerlesim_il.il_adi, '') as abone_adres_yerlesim_il"),
                Capsule::raw("IFNULL(yerlesim_ilce.ilce_adi, '') as abone_adres_yerlesim_ilce"),
                Capsule::raw("IFNULL(yerlesim_mahalle.mahalle_adi, '') as abone_adres_yerlesim_mahalle"),
                Capsule::raw("IFNULL(tesis_il.il_adi, '') as abone_adres_tesis_il"),
                Capsule::raw("IFNULL(tesis_ilce.ilce_adi, '') as abone_adres_tesis_ilce"),
                Capsule::raw("IFNULL(tesis_mahalle.mahalle_adi, '') as abone_adres_tesis_mahalle"),
                Capsule::raw("IFNULL(pop.pop_adi, '') as iss_pop_bilgisi")
            )
            ->get()->map(function ($item) {
                return (array)$item;
            })->all();
        
        return $data;
    }
}