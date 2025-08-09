<?php
/**
 * BTK Raporlama Modülü - Abone HAREKET Rapor Sınıfı
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, AbstractBtkRapor'dan türer ve Abone Hareket raporlarının
 * oluşturulması için gerekli olan spesifik veri çekme ve işleme
 * mantığını içerir. Rapor, `mod_btk_abone_hareket_live` tablosundaki
 * henüz FTP'ye gönderilmemiş tüm olay kayıtlarını içerir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Rapor;

use WHMCS\Database\Capsule;
use BtkReports\Manager\LogManager;

class AboneHareketRapor extends AbstractBtkRapor
{
    private array $islenmisHareketIdleri = [];

    /**
     * Abone Hareket raporu için gereken veriyi veritabanından çeker.
     */
    protected function getRaporVerisi(): array
    {
        $this->islenmisHareketIdleri = [];

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
        
        $hareketler = Capsule::table('mod_btk_abone_hareket_live as h')
            ->join('mod_btk_abone_rehber as r', 'h.rehber_id', '=', 'r.id')
            ->leftJoin('mod_btk_adres_il as yerlesim_il', 'r.yerlesim_il_id', '=', 'yerlesim_il.id')
            ->leftJoin('mod_btk_adres_ilce as yerlesim_ilce', 'r.yerlesim_ilce_id', '=', 'yerlesim_ilce.id')
            ->leftJoin('mod_btk_adres_mahalle as yerlesim_mahalle', 'r.yerlesim_mahalle_id', '=', 'yerlesim_mahalle.id')
            ->leftJoin('mod_btk_adres_il as tesis_il', 'r.tesis_il_id', '=', 'tesis_il.id')
            ->leftJoin('mod_btk_adres_ilce as tesis_ilce', 'r.tesis_ilce_id', '=', 'tesis_ilce.id')
            ->leftJoin('mod_btk_adres_mahalle as tesis_mahalle', 'r.tesis_mahalle_id', '=', 'tesis_mahalle.id')
            ->leftJoin('mod_btk_iss_pop_noktalari as pop', 'r.iss_pop_noktasi_id', '=', 'pop.id')
            ->whereIn('r.whmcs_service_id', $serviceIds)
            ->where('h.gonderildi_flag', 0)
            ->select(
                'r.*',
                'h.id as hareket_id',
                'h.musteri_hareket_kodu',
                'h.musteri_hareket_aciklama',
                'h.musteri_hareket_zamani',
                Capsule::raw("IFNULL(yerlesim_il.il_adi, '') as abone_adres_yerlesim_il"),
                Capsule::raw("IFNULL(yerlesim_ilce.ilce_adi, '') as abone_adres_yerlesim_ilce"),
                Capsule::raw("IFNULL(yerlesim_mahalle.mahalle_adi, '') as abone_adres_yerlesim_mahalle"),
                Capsule::raw("IFNULL(tesis_il.il_adi, '') as abone_adres_tesis_il"),
                Capsule::raw("IFNULL(tesis_ilce.ilce_adi, '') as abone_adres_tesis_ilce"),
                Capsule::raw("IFNULL(tesis_mahalle.mahalle_adi, '') as abone_adres_tesis_mahalle"),
                Capsule::raw("IFNULL(pop.pop_adi, '') as iss_pop_bilgisi")
            )
            ->get()->map(function ($item) {
                $this->islenmisHareketIdleri[] = $item->hareket_id;
                return (array)$item;
            })->all();

        return $hareketler;
    }

    /**
     * Rapor FTP'ye başarıyla gönderildikten sonra, ilgili hareket kayıtlarını "gönderildi" olarak işaretler.
     */
    public function olusturVeGonder(string $ftpType): array
    {
        $result = parent::olusturVeGonder($ftpType);

        if ($ftpType === 'main' && $result['status'] && !($result['skipped'] ?? false)) {
            $this->islenenleriIsaretle();
        }

        return $result;
    }

    /**
     * Rapora dahil edilen hareket kayıtlarını veritabanında "gönderildi" olarak günceller.
     */
    private function islenenleriIsaretle(): void
    {
        if (empty($this->islenmisHareketIdleri)) {
            return;
        }

        try {
            LogManager::logAction('Hareket Kayıtlarını İşaretleme Denemesi', 'UYARI', count($this->islenmisHareketIdleri) . ' adet hareket kaydı gönderildi olarak işaretlenecek.');
            Capsule::table('mod_btk_abone_hareket_live')
                ->whereIn('id', $this->islenmisHareketIdleri)
                ->update([
                    'gonderildi_flag' => 1,
                    'gonderim_zamani' => date('Y-m-d H:i:s')
                ]);
            LogManager::logAction('Hareket Kayıtları İşaretlendi', 'INFO', count($this->islenmisHareketIdleri) . ' adet hareket kaydı başarıyla işaretlendi.');
        } catch (\Exception $e) {
            LogManager::logAction('Hareket Kayıtlarını İşaretleme BAŞARISIZ', 'HATA', $e->getMessage());
        }
    }
}