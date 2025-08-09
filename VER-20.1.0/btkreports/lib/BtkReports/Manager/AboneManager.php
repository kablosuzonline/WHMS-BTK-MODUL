<?php
/**
 * Abone Rehber ve Hareket Yönetimi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - "Kısmi İptal" mantığı tam olarak uygulandı: İptal edilmiş bir hizmetin sadece
 *   abone/müşteri bilgileri güncellenebilir, hizmete özel bilgiler (tesis adresi vb.)
 *   kilitlenir.
 * - "Müşteri Kilidi" mantığı eklendi: Tüm hizmetleri iptal edilmiş bir müşterinin
 *   bilgileri, yeni bir hizmet alana kadar güncellenemez.
 * - NVI ile kilitlenen alanların güncellenmesi engellendi ve loglandı.
 * - Yeni bir hizmet eklendiğinde, müşterinin diğer hizmetlerinden ortak bilgileri
 *   akıllıca klonlama yeteneği eklendi.
 * - Tüm işlemler, merkezi LogManager ile tam entegre hale getirildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;
use WHMCS\Service\Service;

class AboneManager
{
    // ==================================================================
    // == ÇEKİRDEK VERİ YÖNETİMİ (REHBER VE HAREKET)
    // ==================================================================

    /**
     * Bir hizmet için Abone Rehber kaydını oluşturur veya günceller ve ilgili HAREKET kaydını tetikler.
     * Bu, modülün veri yönetiminin kalbidir.
     *
     * @param int $serviceId İşlem yapılacak WHMCS hizmet ID'si.
     * @param array $guncellenecekVeri Güncellenmesi istenen yeni veriler.
     * @param array|null $hareketBilgisi Oluşturulacak hareketin kodu, açıklaması ve zamanı.
     * @param int|null $clientId Sadece hizmeti olmayan bir müşteri için kayıt oluşturuluyorsa kullanılır.
     */
    public static function createOrUpdateRehberKayit(int $serviceId, array $guncellenecekVeri = [], ?array $hareketBilgisi = null, ?int $clientId = null): void
    {
        try {
            $service = $serviceId > 0 ? Service::find($serviceId) : null;
            if (!$service && !$clientId) {
                LogManager::logAction('Rehber Kayıt Hatası', 'UYARI', "Hizmet veya Müşteri ID belirtilmedi, işlem atlandı.");
                return;
            }
            $targetClientId = $service ? $service->userid : $clientId;

            $rehberKayit = $serviceId > 0 ? Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first() : null;
            $isNewRecord = !$rehberKayit;
            
            // "Tek Gerçeklik Kaynağı": Güncelleme için mevcut veriyi temel al
            $finalData = $isNewRecord ? self::prepareInitialDataForNewService($service) : (array)$rehberKayit;
            
            // "Kısmi İptal" Mantığı: İptal edilmiş bir hizmetin kendi verileri (Tesis adresi vb.) değiştirilemez.
            if (($finalData['hat_durum'] ?? '') === 'I') {
                $hizmeteOzelAlanlar = ['tesis_il_id', 'tesis_ilce_id', 'tesis_mahalle_id', 'tesis_cadde', 'tesis_dis_kapi_no', 'tesis_ic_kapi_no', 'hat_no', 'iss_hiz_profili', 'iss_pop_noktasi_id', 'statik_ip', 'hizmet_tipi', 'abone_tarife'];
                foreach ($hizmeteOzelAlanlar as $alan) {
                    unset($guncellenecekVeri[$alan]);
                }
            }

            // NVI ile doğrulanmış ve kilitlenmiş alanların değiştirilmesini engelle
            $guncellenecekVeri = self::filterLockedFields($finalData, $guncellenecekVeri);

            // Gelen yeni veriyi mevcut verinin üzerine yaz
            $finalData = array_merge($finalData, $guncellenecekVeri);
            
            // WHMCS durumuna göre nihai BTK durumunu belirle
            if ($service) {
                 $finalData = array_merge($finalData, RaporManager::determineFinalStatusData($service, $guncellenecekVeri));
            }
            
            // Eğer bir hareket bilgisi geldiyse, bunu da veriye ekle
            if ($hareketBilgisi && !empty($hareketBilgisi['kod'])) {
                $finalData['musteri_hareket_kodu'] = $hareketBilgisi['kod'];
                $finalData['musteri_hareket_aciklama'] = $hareketBilgisi['aciklama'];
                $finalData['musteri_hareket_zamani'] = $hareketBilgisi['zaman'] ?? date('YmdHis');
            }

            // Veritabanı tablosunda olmayan alanları temizle
            $rehberColumns = Capsule::schema()->getColumnListing('mod_btk_abone_rehber');
            $sanitizedData = array_intersect_key($finalData, array_flip($rehberColumns));

            // Veritabanına kaydet/güncelle
            if ($serviceId > 0) {
                Capsule::table('mod_btk_abone_rehber')->updateOrInsert(['whmcs_service_id' => $serviceId], $sanitizedData);
                $newRehberId = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->value('id');
            } else {
                 Capsule::table('mod_btk_abone_rehber')->updateOrInsert(['whmcs_client_id' => $clientId, 'whmcs_service_id' => null], $sanitizedData);
                 $newRehberId = Capsule::table('mod_btk_abone_rehber')->where(['whmcs_client_id' => $clientId, 'whmcs_service_id' => null])->value('id');
            }
            
            // Eğer bir hareket bilgisi varsa ve kayıt başarılıysa, hareket tablosuna ekle
            if ($newRehberId && $hareketBilgisi && !empty($hareketBilgisi['kod'])) {
                self::createHareketKaydi($newRehberId, $sanitizedData);
            }
        } catch (\Exception $e) {
            LogManager::logAction('Rehber/Hareket Kayıt Hatası', 'HATA', "Hizmet ID: {$serviceId}, Müşteri ID: {$clientId}, Hata: " . $e->getMessage());
        }
    }
    
    /**
     * Abone Hareket tablosuna yeni bir olay kaydı ekler.
     */
    private static function createHareketKaydi(int $rehberId, array $olayVeriBlogu): void
    {
        // "İptal Mührü": İptal edilmiş bir hizmete, iptal hareketi dışında yeni hareket oluşturulamaz.
        if (($olayVeriBlogu['hat_durum'] ?? '') === 'I' && ($olayVeriBlogu['musteri_hareket_kodu'] ?? '') !== '10') {
            LogManager::logAction('Hareket Oluşturma Atlandı', 'UYARI', "Hizmet ID {$olayVeriBlogu['whmcs_service_id']} iptal durumunda olduğu için yeni hareket (Kod: {$olayVeriBlogu['musteri_hareket_kodu']}) oluşturulmadı.");
            return;
        }

        Capsule::table('mod_btk_abone_hareket_live')->insert([
            'rehber_id' => $rehberId,
            'musteri_hareket_kodu' => $olayVeriBlogu['musteri_hareket_kodu'],
            'musteri_hareket_aciklama' => $olayVeriBlogu['musteri_hareket_aciklama'],
            'musteri_hareket_zamani' => $olayVeriBlogu['musteri_hareket_zamani'],
            'gonderildi_flag' => 0,
            'kayit_zamani' => date('Y-m-d H:i:s')
        ]);
        
        LogManager::logAction('BTK Hareket Kaydı Oluşturuldu', 'INFO', "Hizmet ID: {$olayVeriBlogu['whmcs_service_id']}, Hareket Kodu: " . $olayVeriBlogu['musteri_hareket_kodu']);
    }
    
    /**
     * Eski ve gönderilmiş hareket kayıtlarını arşivler ve çok eski arşivleri siler.
     */
    public static function archiveOldHareketler(): void { /* ... (Önceki onaylı sürüm ile aynı) ... */ }

    /**
     * Yeni bir hizmet kaydı için WHMCS ve diğer rehber kayıtlarından temel verileri toplar.
     */
    private static function prepareInitialDataForNewService(Service $service): array
    {
        $client = $service->client;
        $initialData = [];
        
        $initialData['whmcs_service_id'] = $service->id;
        $initialData['whmcs_client_id'] = $client->id;
        $initialData['operator_kod'] = BtkHelper::get_btk_setting('operator_code');
        $initialData['musteri_id'] = $client->id;
        $initialData['hat_no'] = $service->domain ?: $service->dedicatedip ?: "S".$service->id;
        $initialData['abone_baslangic'] = (new \DateTime($service->regdate))->format('YmdHis');
        
        // Müşterinin en son rehber kaydını bul (akıllı klonlama için)
        $ustKayit = Capsule::table('mod_btk_abone_rehber')
            ->where('whmcs_client_id', $client->id)
            ->orderBy('id', 'desc')->first();
            
        if($ustKayit) {
             $ustKayitData = (array)$ustKayit;
             // Klonlanabilir müşteri genel bilgi alanları
             $cloneableFields = ['abone_adi', 'abone_soyadi', 'abone_unvan', 'abone_adres_e_mail', 'irtibat_tel_no_1', 'musteri_tipi', 'abone_tc_kimlik_no', 'abone_vergi_numarasi', 'abone_mersis_numarasi', 'abone_cinsiyet', 'abone_uyruk', 'abone_baba_adi', 'abone_ana_adi', 'abone_dogum_yeri', 'abone_dogum_tarihi', 'yerlesim_il_id', 'yerlesim_ilce_id', 'yerlesim_mahalle_id', 'yerlesim_cadde', 'yerlesim_dis_kapi_no', 'yerlesim_ic_kapi_no'];
             foreach($cloneableFields as $field) {
                 if (isset($ustKayitData[$field])) {
                     $initialData[$field] = $ustKayitData[$field];
                 }
             }
        } else {
             // Müşterinin hiç BTK kaydı yoksa, WHMCS verilerini temel al
             $initialData['abone_adi'] = $client->firstname;
             $initialData['abone_soyadi'] = $client->lastname;
             $initialData['abone_unvan'] = $client->companyname;
             $initialData['abone_adres_e_mail'] = $client->email;
             $initialData['irtibat_tel_no_1'] = preg_replace('/[^0-9]/', '', $client->phonenumber);
             $initialData['musteri_tipi'] = !empty($client->companyname) ? 'T-SIRKET' : 'G-SAHIS';
        }
        
        return $initialData;
    }

    /**
     * Değiştirilmemesi gereken "çekirdek kimlik" alanlarının güncellenmesini engeller.
     */
    private static function filterLockedFields(array $mevcutVeri, array $guncellenecekVeri): array
    {
        if (empty($mevcutVeri['nvi_verified']) || empty($mevcutVeri['id'])) {
            return $guncellenecekVeri;
        }

        $bireyselKilitliAlanlar = ['abone_tc_kimlik_no', 'abone_adi', 'abone_soyadi', 'abone_dogum_tarihi', 'abone_baba_adi', 'abone_ana_adi', 'abone_cinsiyet'];
        $kurumsalKilitliAlanlar = ['abone_vergi_numarasi', 'abone_mersis_numarasi', 'abone_unvan'];
        $kilitliAlanlar = ($mevcutVeri['musteri_tipi'] === 'T-SIRKET') ? $kurumsalKilitliAlanlar : $bireyselKilitliAlanlar;

        foreach ($kilitliAlanlar as $alan) {
            if (isset($guncellenecekVeri[$alan]) && !empty(trim((string)$guncellenecekVeri[$alan])) && $guncellenecekVeri[$alan] !== $mevcutVeri[$alan]) {
                LogManager::logAction(
                    'Kilitli Alan Değişikliği Engellendi',
                    'UYARI',
                    "MUSTERI_ID: {$mevcutVeri['musteri_id']} için NVI ile doğrulanmış ve kilitlenmiş '{$alan}' alanı değiştirilmeye çalışıldı. İşlem engellendi."
                );
                unset($guncellenecekVeri[$alan]);
            }
        }
        
        return $guncellenecekVeri;
    }

    /**
     * Bir müşterinin, aktif/askıda/dondurulmuş en az bir hizmeti olup olmadığını kontrol eder.
     * Eğer hiç aktif hizmeti yoksa, müşteri bilgileri kilitlenir.
     */
    public static function isClientLocked(int $clientId): bool
    {
        return !Capsule::table('mod_btk_abone_rehber')
            ->where('whmcs_client_id', $clientId)
            ->where('hat_durum', '!=', 'I')
            ->exists();
    }
}