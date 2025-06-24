<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Database\Capsule;
use WHMCS\Carbon;

/**
 * Class SubscriberActivityService
 *
 * mod_btk_abone_hareket_canli ve mod_btk_abone_hareket_arsiv tabloları ile ilgili işlemleri yönetir.
 * BTK Hareket kayıtlarını oluşturur.
 */
class SubscriberActivityService
{
    /**
     * Yeni bir BTK abone hareketi oluşturur ve mod_btk_abone_hareket_canli tablosuna ekler.
     *
     * @param int $serviceId İlgili WHMCS Hizmet ID'si
     * @param int $userId İlgili WHMCS Müşteri ID'si
     * @param string $musteriHareketKodu BTK MUSTERI_HAREKET_KODU (EK-2'den)
     * @param string|null $musteriHareketAciklama Hareketin açıklaması (Koddan çekilebilir veya özel olabilir)
     * @param array $additionalData Hareket kaydına eklenecek diğer BTK alanlarını içeren dizi.
     *                              Bu dizi, `mod_btk_abone_rehber`'den gelen güncel tüm alanları içermelidir.
     *                              Özellikle değişen alanlar (HAT_DURUM, ABONE_BITIS vb.) burada set edilmelidir.
     * @param string|null $hareketZamani Hareketin gerçekleştiği zaman (YYYYAAGGSSDDSS). Null ise mevcut zaman kullanılır.
     * @return object|null Oluşturulan hareket kaydı veya hata durumunda null
     */
    public static function createActivity(
        $serviceId,
        $userId,
        $musteriHareketKodu,
        $musteriHareketAciklama = null,
        array $additionalData = [],
        $hareketZamani = null
    ) {
        BtkHelper::logActivity("SubscriberActivityService: Yeni hareket oluşturuluyor. ServiceID: {$serviceId}, HareketKodu: {$musteriHareketKodu}", 0, 'DEBUG', ['service_id' => $serviceId, 'hareket_kodu' => $musteriHareketKodu]);

        try {
            if (empty($serviceId) || empty($userId) || empty($musteriHareketKodu)) {
                BtkHelper::logActivity("SubscriberActivityService: Hareket oluşturma için gerekli parametreler eksik (serviceId, userId, hareketKodu).", 0, 'ERROR');
                return null;
            }

            // Hareket zamanını belirle
            $finalHareketZamani = $hareketZamani ?: BtkHelper::getBtkDateTimeFormat();

            // Hareket açıklamasını koddan çek (eğer null gelmişse)
            if (is_null($musteriHareketAciklama)) {
                $musteriHareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', $musteriHareketKodu, 'Bilinmeyen Hareket');
            }

            // Temel hareket verilerini hazırla
            $activityData = [
                'whmcs_user_id' => $userId,
                'whmcs_service_id' => $serviceId,
                'MUSTERI_HAREKET_KODU' => $musteriHareketKodu,
                'MUSTERI_HAREKET_ACIKLAMA' => $musteriHareketAciklama,
                'MUSTERI_HAREKET_ZAMANI' => $finalHareketZamani,
                'OPERATOR_KOD' => BtkHelper::getSetting('operator_kodu', '000'),
                'gonderildi' => 0, // Yeni hareket gönderilmedi olarak işaretlenir
                'cnt_numarasi_hareket' => '01', // Varsayılan CNT
                'created_at' => Carbon::now()
                // Diğer tüm BTK alanları $additionalData'dan veya mod_btk_abone_rehber'den alınacak
            ];

            // `mod_btk_abone_rehber` tablosundan güncel abone/hizmet bilgilerini çek
            // Eğer $additionalData zaten bu bilgileri içeriyorsa, bu adıma gerek kalmayabilir.
            // Ancak, tutarlılık için rehberden çekmek daha güvenli olabilir.
            $rehberKaydi = null;
            if (empty($additionalData['ABONE_ADI'])) { // additionalData'da temel bir alan yoksa rehberden çek
                $rehberKaydi = Capsule::table('mod_btk_abone_rehber')
                                ->where('whmcs_service_id', $serviceId)
                                ->first();
            }


            if ($rehberKaydi) {
                $activityData['abone_rehber_id'] = $rehberKaydi->id;
                // Rehber tablosundaki tüm BTK alanlarını hareket verisine kopyala
                // Bu alanlar BTK raporundaki tüm sütunları kapsamalıdır.
                $btkFieldsFromRehber = self::getBtkFieldsFromObject($rehberKaydi);
                $activityData = array_merge($btkFieldsFromRehber, $activityData); // activityData öncelikli
            }

            // $additionalData'daki veriler, rehberden gelenleri veya activityData'dakileri ezer
            // Bu, özellikle değişen alanların (HAT_DURUM, ABONE_BITIS vb.) doğru set edilmesini sağlar.
            if (!empty($additionalData)) {
                $activityData = array_merge($activityData, $additionalData);
            }

            // Gerekli alanların varlığını son bir kez kontrol et (MUSTERI_ID, HAT_NO vb.)
            if (empty($activityData['MUSTERI_ID'])) $activityData['MUSTERI_ID'] = (string)$userId;
            if (empty($activityData['HAT_NO'])) $activityData['HAT_NO'] = (string)$serviceId;


            // Eksik olabilecek ama doldurulması gereken bazı anahtar alanlar için varsayılanlar
            $requiredFieldsDefaults = [
                'HIZMET_TIPI' => BtkHelper::getSetting('varsayilan_hizmet_tipi', 'DIGER'), // Config'den varsayılan
                'MUSTERI_TIPI' => $activityData['MUSTERI_TIPI'] ?? 'B', // Rehberden gelmeliydi
                'ABONE_ADI' => $activityData['ABONE_ADI'] ?? 'Bilinmiyor',
                'ABONE_SOYADI' => $activityData['ABONE_SOYADI'] ?? 'Bilinmiyor',
                // Diğer zorunlu alanlar için de benzer varsayılanlar eklenebilir veya hata üretilebilir.
            ];

            foreach($requiredFieldsDefaults as $key => $default) {
                if (!isset($activityData[$key]) || $activityData[$key] === null || $activityData[$key] === '') {
                    $activityData[$key] = $default;
                }
            }


            $hareketId = Capsule::table('mod_btk_abone_hareket_canli')->insertGetId($activityData);
            BtkHelper::logActivity("SubscriberActivityService: Yeni hareket kaydı eklendi. HareketID: {$hareketId}, ServiceID: {$serviceId}, HareketKodu: {$musteriHareketKodu}", 0, 'INFO');

            return Capsule::table('mod_btk_abone_hareket_canli')->find($hareketId);

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberActivityService::createActivity Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId, 'hareket_kodu' => $musteriHareketKodu]);
            return null;
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class SubscriberActivityService
{
    // ... (createActivity fonksiyonu burada) ...

    /**
     * Bir nesneden (genellikle veritabanı kaydı) sadece BTK raporunda yer alan
     * alanları ve değerlerini kopyalar.
     * Alan adları (sütun adları) BTK formatındaki gibi büyük harf olmalıdır.
     *
     * @param object|array $sourceObject Kaynak nesne veya dizi
     * @return array BTK alanlarını içeren dizi
     */
    private static function getBtkFieldsFromObject($sourceObject)
    {
        $btkFields = [];
        if (is_object($sourceObject)) {
            $sourceObject = (array)$sourceObject;
        }

        if (!is_array($sourceObject)) {
            return $btkFields;
        }

        // BTK Abone Rehber/Hareket dosyasındaki tüm potansiyel alanlar
        // Bu liste abonedesen.xlsx'den alınmalı ve güncel tutulmalıdır.
        $allBtkReportFields = [
            'OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU',
            'HAT_DURUM_KODU_ACIKLAMA', 'MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA',
            'MUSTERI_HAREKET_ZAMANI', 'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC',
            'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO',
            'ABONE_PASAPORT_NO', 'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI',
            'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET', 'ABONE_UYRUK', 'ABONE_BABA_ADI',
            'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI', 'ABONE_DOGUM_YERI',
            'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE', 'ABONE_KIMLIK_CILT_NO',
            'ABONE_KIMLIK_KUTUK_NO', 'ABONE_KIMLIK_SAYFA_NO', 'ABONE_KIMLIK_IL',
            'ABONE_KIMLIK_ILCE', 'ABONE_KIMLIK_MAHALLE_KOY', 'ABONE_KIMLIK_TIPI',
            'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER',
            'ABONE_KIMLIK_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI',
            'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE',
            'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO',
            'ABONE_ADRES_TESIS_IC_KAPI_NO', 'ABONE_ADRES_TESIS_POSTA_KODU',
            'ABONE_ADRES_TESIS_ADRES_KODU', 'ABONE_ADRES_IRTIBAT_TEL_NO_1',
            'ABONE_ADRES_IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL',
            'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE',
            'ABONE_ADRES_YERLESIM_MAHALLE', 'ABONE_ADRES_YERLESIM_CADDE',
            'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO',
            'ABONE_ADRES_YERLESIM_POSTA_KODU', 'ABONE_ADRES_YERLESIM_ADRES_KODU',
            'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO',
            'KURUM_YETKILI_TELEFON', 'KURUM_ADRES', 'AKTIVASYON_BAYI_ADI',
            'AKTIVASYON_BAYI_ADRESI', 'AKTIVASYON_KULLANICI', 'GUNCELLEYEN_BAYI_ADI',
            'GUNCELLEYEN_BAYI_ADRESI', 'GUNCELLEYEN_KULLANICI', 'STATIK_IP',
            'ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI'
        ];

        foreach ($allBtkReportFields as $fieldName) {
            if (array_key_exists($fieldName, $sourceObject)) {
                $btkFields[$fieldName] = $sourceObject[$fieldName];
            } elseif (array_key_exists(strtolower($fieldName), $sourceObject)) { // Küçük harf olarak da kontrol et
                $btkFields[$fieldName] = $sourceObject[strtolower($fieldName)];
            } else {
                // Alan kaynakta yoksa, BTK raporunda boş (|;|) olacağı için null olarak ekleyebiliriz.
                // Ya da hiç eklemeyebiliriz, insert sırasında null gider.
                // Şimdilik, BTK raporunda tüm sütunlar beklendiği için null atayalım.
                // $btkFields[$fieldName] = null;
            }
        }
        return $btkFields;
    }

    /**
     * Canlı hareket tablosundan gönderilmemiş hareketleri alır.
     * Rapor oluşturma servisi tarafından kullanılır.
     *
     * @param int $limit Limit sayısı
     * @return \Illuminate\Support\Collection
     */
    public static function getUnsentActivities($limit = 5000) // BTK genellikle dosya başına limit koyar
    {
        try {
            return Capsule::table('mod_btk_abone_hareket_canli')
                        ->where('gonderildi', 0)
                        ->orderBy('MUSTERI_HAREKET_ZAMANI', 'asc') // En eski hareket önce
                        ->orderBy('id', 'asc')
                        ->take($limit)
                        ->get();
        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberActivityService::getUnsentActivities Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e]);
            return collect(); // Boş koleksiyon döndür
        }
    }

    /**
     * Belirli hareket kayıtlarını "gönderildi" olarak işaretler.
     *
     * @param array $activityIds Gönderildi olarak işaretlenecek hareket ID'lerinin dizisi.
     * @param string $fileName Gönderildikleri dosyanın adı.
     * @param string $cntNumarasi Dosyanın CNT numarası.
     * @return bool Başarılı ise true
     */
    public static function markActivitiesAsSent(array $activityIds, $fileName, $cntNumarasi)
    {
        if (empty($activityIds)) {
            return true;
        }
        try {
            Capsule::table('mod_btk_abone_hareket_canli')
                ->whereIn('id', $activityIds)
                ->update([
                    'gonderildi' => 1,
                    'gonderildigi_dosya_adi' => $fileName,
                    'gonderme_zamani' => Carbon::now(),
                    'cnt_numarasi_hareket' => $cntNumarasi
                ]);
            BtkHelper::logActivity(count($activityIds) . " adet hareket 'gönderildi' olarak işaretlendi. Dosya: {$fileName}, CNT: {$cntNumarasi}", 0, 'INFO');
            return true;
        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberActivityService::markActivitiesAsSent Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'ids' => $activityIds]);
            return false;
        }
    }

    /**
     * Canlı hareket tablosundaki süresi dolmuş ve gönderilmiş hareketleri arşiv tablosuna taşır.
     * Cron job tarafından periyodik olarak çağrılır.
     *
     * @param int $retentionDays Canlı tabloda tutulacak gün sayısı
     * @return array ['moved' => int, 'deleted_from_live' => int]
     */
    public static function archiveOldActivities($retentionDays = 7)
    {
        $movedCount = 0;
        $deletedCount = 0;
        BtkHelper::logActivity("SubscriberActivityService: Eski hareketler arşivleniyor (>{$retentionDays} gün).", 0, 'INFO');

        try {
            $thresholdDate = Carbon::now()->subDays($retentionDays)->toDateTimeString();

            // Arşive taşınacak kayıtları seç
            $activitiesToArchive = Capsule::table('mod_btk_abone_hareket_canli')
                ->where('gonderildi', 1) // Sadece gönderilmiş olanlar
                ->where('created_at', '<', $thresholdDate) // Veya 'MUSTERI_HAREKET_ZAMANI' na göre? created_at daha mantıklı.
                ->orderBy('id') // İşlem sırası için
                ->get();

            if ($activitiesToArchive->isEmpty()) {
                BtkHelper::logActivity("SubscriberActivityService: Arşive taşınacak eski hareket bulunamadı.", 0, 'DEBUG');
                return ['moved' => 0, 'deleted_from_live' => 0];
            }

            foreach ($activitiesToArchive as $activity) {
                $archiveData = (array)$activity;
                $originalId = $archiveData['id'];
                unset($archiveData['id']); // Arşiv tablosunda yeni ID alacak
                $archiveData['arsivlenme_tarihi'] = Carbon::now();

                try {
                    Capsule::table('mod_btk_abone_hareket_arsiv')->insert($archiveData);
                    Capsule::table('mod_btk_abone_hareket_canli')->where('id', $originalId)->delete();
                    $movedCount++;
                    $deletedCount++;
                } catch (\Exception $ex) {
                    // Tek bir kayıtta hata olursa logla ve devam et
                    BtkHelper::logActivity("SubscriberActivityService: Hareket ID {$originalId} arşive taşınırken/silinirken hata: " . $ex->getMessage(), 0, 'ERROR', ['activity_id' => $originalId]);
                }
            }

            if ($movedCount > 0) {
                BtkHelper::logActivity("SubscriberActivityService: {$movedCount} adet eski hareket başarıyla arşive taşındı.", 0, 'INFO');
            }
             return ['moved' => $movedCount, 'deleted_from_live' => $deletedCount];

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberActivityService::archiveOldActivities Genel Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e]);
            return ['moved' => $movedCount, 'deleted_from_live' => $deletedCount];
        }
    }

    /**
     * Arşivlenmiş hareket tablosundan çok eski kayıtları siler.
     * Cron job tarafından periyodik olarak çağrılır.
     *
     * @param int $archiveRetentionDays Arşivde tutulacak gün sayısı (0 ise asla silme)
     * @return int Silinen kayıt sayısı
     */
    public static function purgeOldArchivedActivities($archiveRetentionDays = 180)
    {
        if ($archiveRetentionDays <= 0) { // 0 veya negatifse silme
            BtkHelper::logActivity("SubscriberActivityService: Arşivlenmiş hareket silme işlemi pasif (saklama süresi <= 0).", 0, 'DEBUG');
            return 0;
        }
        BtkHelper::logActivity("SubscriberActivityService: Çok eski arşivlenmiş hareketler siliniyor (>{$archiveRetentionDays} gün).", 0, 'INFO');

        try {
            $thresholdDate = Carbon::now()->subDays($archiveRetentionDays)->toDateTimeString();
            $deletedCount = Capsule::table('mod_btk_abone_hareket_arsiv')
                ->where('arsivlenme_tarihi', '<', $thresholdDate) // Veya hareketin kendi zamanına göre mi?
                ->delete();

            if ($deletedCount > 0) {
                BtkHelper::logActivity("SubscriberActivityService: {$deletedCount} adet çok eski arşivlenmiş hareket kaydı silindi.", 0, 'INFO');
            } else {
                BtkHelper::logActivity("SubscriberActivityService: Silinecek çok eski arşivlenmiş hareket kaydı bulunamadı.", 0, 'DEBUG');
            }
            return $deletedCount;

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberActivityService::purgeOldArchivedActivities Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e]);
            return 0;
        }
    }

} // Sınıf sonu
?>