<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use WHMCS\User\Client; // Müşteri detaylarını almak için

/**
 * Class SubscriberGuideService
 *
 * mod_btk_abone_rehber tablosu ile ilgili işlemleri ve iş mantığını yönetir.
 */
class SubscriberGuideService
{
    /**
     * Yeni bir hizmet eklendiğinde (AfterModuleCreate hook'u için)
     * mod_btk_abone_rehber'e kayıt ekler veya mevcut bir kaydı (varsa) günceller.
     * Bu fonksiyon, hizmetin ilk aktivasyonunda temel BTK verilerini oluşturur.
     * Detaylı BTK bilgileri (TCKN, adresler vb.) admin formlarından ayrıca girilmelidir.
     *
     * @param int $serviceId WHMCS tblhosting.id
     * @param int $userId WHMCS tblclients.id
     * @param array $moduleCreateVars AfterModuleCreate hook'undan gelen $params dizisi
     * @return object|null Oluşturulan/güncellenen mod_btk_abone_rehber kaydı veya hata durumunda null
     */
    public static function createOrUpdateForNewService($serviceId, $userId, $moduleCreateVars = [])
    {
        BtkHelper::logActivity("SubscriberGuideService: Yeni hizmet için rehber kaydı oluşturma/güncelleme başlatıldı. ServiceID: {$serviceId}, UserID: {$userId}", 0, 'DEBUG', ['service_id' => $serviceId]);

        try {
            $client = Client::find($userId);
            if (!$client) {
                BtkHelper::logActivity("SubscriberGuideService: Müşteri bulunamadı. UserID: {$userId}", 0, 'ERROR', ['service_id' => $serviceId]);
                return null;
            }

            $service = Capsule::table('tblhosting')->find($serviceId);
            if (!$service) {
                BtkHelper::logActivity("SubscriberGuideService: Hizmet bulunamadı. ServiceID: {$serviceId}", 0, 'ERROR', ['service_id' => $serviceId]);
                return null;
            }
            
            $product = Capsule::table('tblproducts')->find($service->packageid);

            // Müşteri tipini belirle (Bireysel/Kurumsal)
            $musteriTipiKod = !empty($client->companyname) ? 'G' : 'B'; // G: Şirket, B: Bireysel
            // Müşteri tipi açıklamasını referans tablosundan al
            $musteriTipiAciklama = BtkHelper::getBtkReferenceValue('musteri_tipleri', $musteriTipiKod, ($musteriTipiKod == 'G' ? 'ŞİRKET' : 'BIREYSEL'));


            // Temel verileri hazırla
            $data = [
                'whmcs_user_id' => $userId,
                'whmcs_service_id' => $serviceId,
                'OPERATOR_KOD' => BtkHelper::getSetting('operator_kodu', '000'),
                'MUSTERI_ID' => (string)$userId, // Veya özel bir abone no üretilebilir
                'HAT_NO' => (string)$serviceId,  // Veya özel bir hat no üretilebilir
                'HAT_DURUM' => 'A', // Yeni hizmet aktif
                'HAT_DURUM_KODU' => '1', // AKTIF
                'HAT_DURUM_KODU_ACIKLAMA' => BtkHelper::getBtkReferenceValue('hat_durum_kodlari', '1', 'AKTIF'),
                'MUSTERI_HAREKET_KODU' => '1', // YENI ABONELIK KAYDI
                'MUSTERI_HAREKET_ACIKLAMA' => BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '1', 'YENI ABONELIK KAYDI'),
                'MUSTERI_HAREKET_ZAMANI' => BtkHelper::getBtkDateTimeFormat(), // Şu anki zaman
                'HIZMET_TIPI' => null, // Bu bilgi service_details_btk_form.tpl'den veya ürün ayarlarından gelmeli
                'MUSTERI_TIPI' => $musteriTipiKod,
                'ABONE_BASLANGIC' => BtkHelper::getBtkDateTimeFormat(Carbon::parse($service->regdate)->toDateTimeString()), // Hizmet kayıt tarihi
                'ABONE_BITIS' => '00000000000000',
                'ABONE_ADI' => $client->firstname,
                'ABONE_SOYADI' => $client->lastname,
                'ABONE_TC_KIMLIK_NO' => null, // Formdan girilecek
                'ABONE_PASAPORT_NO' => null, // Formdan girilecek
                'ABONE_UNVAN' => $client->companyname ?: null,
                'ABONE_VERGI_NUMARASI' => $client->tax_id ?: null, // WHMCS tax_id alanı varsa
                'ABONE_MERSIS_NUMARASI' => null, // Formdan girilecek
                'ABONE_CINSIYET' => null, // Formdan girilecek
                'ABONE_UYRUK' => 'TUR', // Varsayılan, formdan değiştirilebilir
                'ABONE_DOGUM_TARIHI' => null, // Formdan girilecek
                'ABONE_MESLEK' => null, // Formdan girilecek
                'ABONE_TARIFE' => $product ? $product->name : ($service->domain ?: 'Bilinmeyen Tarife'),
                'ABONE_ADRES_E_MAIL' => $client->email,
                'ABONE_ADRES_IRTIBAT_TEL_NO_1' => $client->phonenumber,
                // Diğer adres ve kimlik bilgileri formlardan girilecek
                'STATIK_IP' => $service->dedicatedip ?: null,
                'ISS_KULLANICI_ADI' => $service->username ?: null,
                'updated_at' => Carbon::now()
            ];

            // Hizmet tipi ürün ayarlarından veya ürün grubu eşleştirmesinden gelebilir
            $productGroupId = $service->groupid;
            if ($productGroupId) {
                $mapping = Capsule::table('mod_btk_product_group_mappings')
                                ->where('whmcs_product_group_id', $productGroupId)
                                ->first();
                if ($mapping && $mapping->btk_yetki_turu_id) {
                    $yetkiTuru = Capsule::table('mod_btk_yetki_turleri')
                                    ->where('id', $mapping->btk_yetki_turu_id)
                                    ->value('yetki_kodu'); // Örneğin 'ISS', 'AIH'
                    // Bu yetki türüne göre varsayılan bir HIZMET_TIPI atanabilir.
                    // Şimdilik bu mantık detaylandırılmadı.
                    // Örn: if ($yetkiTuru == 'ISS') $data['HIZMET_TIPI'] = 'XDSL';
                }
            }

            // Var olan kaydı bul veya yeni oluştur
            $rehberKaydi = Capsule::table('mod_btk_abone_rehber')
                            ->where('whmcs_service_id', $serviceId)
                            ->first();

            if ($rehberKaydi) {
                // Kayıt zaten var, sadece bazı temel alanları güncelle (özellikle durum ve hareket bilgisi)
                // Diğer detaylı alanlar admin formundan güncellenir.
                Capsule::table('mod_btk_abone_rehber')
                    ->where('id', $rehberKaydi->id)
                    ->update([
                        'HAT_DURUM' => 'A',
                        'HAT_DURUM_KODU' => '1',
                        'HAT_DURUM_KODU_ACIKLAMA' => BtkHelper::getBtkReferenceValue('hat_durum_kodlari', '1', 'AKTIF'),
                        'MUSTERI_HAREKET_KODU' => $data['MUSTERI_HAREKET_KODU'], // Yeni abonelik hareketi
                        'MUSTERI_HAREKET_ACIKLAMA' => $data['MUSTERI_HAREKET_ACIKLAMA'],
                        'MUSTERI_HAREKET_ZAMANI' => $data['MUSTERI_HAREKET_ZAMANI'],
                        'ABONE_BITIS' => '00000000000000', // Eğer daha önce iptalse, bitişi sıfırla
                        'updated_at' => Carbon::now()
                    ]);
                BtkHelper::logActivity("SubscriberGuideService: Mevcut rehber kaydı güncellendi (Yeni Aktivasyon). ServiceID: {$serviceId}", 0, 'INFO');
                return Capsule::table('mod_btk_abone_rehber')->find($rehberKaydi->id);
            } else {
                // Yeni kayıt oluştur
                $data['created_at'] = Carbon::now();
                $id = Capsule::table('mod_btk_abone_rehber')->insertGetId($data);
                BtkHelper::logActivity("SubscriberGuideService: Yeni rehber kaydı oluşturuldu. ServiceID: {$serviceId}, RehberID: {$id}", 0, 'INFO');
                return Capsule::table('mod_btk_abone_rehber')->find($id);
            }

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::createOrUpdateForNewService Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return null;
        }
    }

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class SubscriberGuideService
{
    // ... (createOrUpdateForNewService fonksiyonu burada) ...

    /**
     * Bir hizmetin BTK durumunu günceller.
     *
     * @param int $serviceId
     * @param string $hatDurum Yeni HAT_DURUM (A, I, D, K)
     * @param string $hatDurumKodu Yeni HAT_DURUM_KODU
     * @param string|null $hatDurumKoduAciklama (Opsiyonel, koddan da çekilebilir)
     * @param string|null $aboneBitis YYYYAAGGSSDDSS formatında (Eğer İptal ise)
     * @return object|null Güncellenmiş mod_btk_abone_rehber kaydı veya hata durumunda null
     */
    public static function updateStatus($serviceId, $hatDurum, $hatDurumKodu, $hatDurumKoduAciklama = null, $aboneBitis = null)
    {
        BtkHelper::logActivity("SubscriberGuideService: Hizmet durumu güncelleniyor. ServiceID: {$serviceId}, Yeni Durum: {$hatDurum}, Kod: {$hatDurumKodu}", 0, 'DEBUG');
        try {
            $rehberKaydi = Capsule::table('mod_btk_abone_rehber')
                            ->where('whmcs_service_id', $serviceId)
                            ->first();

            if (!$rehberKaydi) {
                BtkHelper::logActivity("SubscriberGuideService: updateStatus için rehber kaydı bulunamadı. ServiceID: {$serviceId}", 0, 'WARNING');
                // Belki bu durumda yeni bir kayıt oluşturulmalı veya hata döndürülmeli.
                // Şimdilik, eğer kayıt yoksa ve hizmet aktif ediliyorsa yeni kayıt oluşturmayı deneyebiliriz.
                if ($hatDurum === 'A' && $hatDurumKodu === '1') {
                    $service = Capsule::table('tblhosting')->find($serviceId);
                    if ($service) {
                        return self::createOrUpdateForNewService($serviceId, $service->userid);
                    }
                }
                return null;
            }

            if (is_null($hatDurumKoduAciklama)) {
                $hatDurumKoduAciklama = BtkHelper::getBtkReferenceValue('hat_durum_kodlari', $hatDurumKodu, '');
            }

            $updateData = [
                'HAT_DURUM' => strtoupper($hatDurum),
                'HAT_DURUM_KODU' => $hatDurumKodu,
                'HAT_DURUM_KODU_ACIKLAMA' => $hatDurumKoduAciklama,
                'MUSTERI_HAREKET_KODU' => '10', // HAT DURUM DEGISIKLIGI
                'MUSTERI_HAREKET_ACIKLAMA' => BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '10', 'HAT DURUM DEGISIKLIGI'),
                'MUSTERI_HAREKET_ZAMANI' => BtkHelper::getBtkDateTimeFormat(),
                'updated_at' => Carbon::now()
            ];

            if (strtoupper($hatDurum) === 'I' && $aboneBitis) { // İptal durumu
                $updateData['ABONE_BITIS'] = $aboneBitis;
            } elseif (strtoupper($hatDurum) === 'A') { // Aktif durumu
                $updateData['ABONE_BITIS'] = '00000000000000'; // Aktifse bitiş tarihi sıfırlanır
            }
            // Dondurulmuş (D) veya Kısıtlı (K) durumlarında ABONE_BITIS değişmez.

            Capsule::table('mod_btk_abone_rehber')
                ->where('id', $rehberKaydi->id)
                ->update($updateData);

            BtkHelper::logActivity("SubscriberGuideService: Rehber kaydı durumu güncellendi. ServiceID: {$serviceId}", 0, 'INFO');
            return Capsule::table('mod_btk_abone_rehber')->find($rehberKaydi->id);

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::updateStatus Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return null;
        }
    }

    /**
     * Bir hizmeti BTK'ya iptal olarak bildirir ve ABONE_BITIS tarihini set eder.
     *
     * @param int $serviceId
     * @param string $iptalTarihiBtkFormat YYYYAAGGSSDDSS
     * @param string $hatDurumKodu İptal için HAT_DURUM_KODU
     * @param string|null $hatDurumKoduAciklama
     * @return object|null Güncellenmiş mod_btk_abone_rehber kaydı veya hata durumunda null
     */
    public static function terminateService($serviceId, $iptalTarihiBtkFormat, $hatDurumKodu, $hatDurumKoduAciklama = null)
    {
        BtkHelper::logActivity("SubscriberGuideService: Hizmet sonlandırma işlemi. ServiceID: {$serviceId}, İptal Tarihi: {$iptalTarihiBtkFormat}, İptal Kodu: {$hatDurumKodu}", 0, 'DEBUG');
        return self::updateStatus($serviceId, 'I', $hatDurumKodu, $hatDurumKoduAciklama, $iptalTarihiBtkFormat);
    }


    /**
     * Admin panelindeki Müşteri Profili BTK formundan gelen verilerle,
     * bu müşteriye ait TÜM AKTİF HİZMETLERİN rehber kayıtlarındaki ortak alanları günceller.
     * (TCKN, Ad, Soyad, Yerleşim Adresi vb.)
     * Ayrıca, bu işlem için her bir aktif hizmet adına "ABONE BILGI GUNCELLEME" hareketi oluşturur.
     *
     * @param int $userId WHMCS Müşteri ID'si
     * @param array $postData Formdan gelen $_POST verileri
     * @return bool Başarılı ise true
     */
    public static function updateClientDetailsForAllServices($userId, array $postData)
    {
        BtkHelper::logActivity("SubscriberGuideService: Müşteri BTK detayları tüm hizmetler için güncelleniyor. UserID: {$userId}", $adminId ?? 0, 'INFO', ['user_id' => $userId]);
        try {
            $client = Client::find($userId);
            if (!$client) return false;

            // Formdan gelen ve rehber tablosundaki alanlarla eşleşen verileri al
            // Bu alanlar BTK desenindeki abone bazlı alanlar olmalı
            $updateData = [];
            $btkClientFields = [ // Güncellenecek abone bazlı alanlar
                'MUSTERI_TIPI', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO', 'ABONE_PASAPORT_NO',
                'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI', 'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET',
                'ABONE_UYRUK', 'ABONE_BABA_ADI', 'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI',
                'ABONE_DOGUM_YERI', 'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK',
                'ABONE_KIMLIK_TIPI', 'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_CILT_NO', 'ABONE_KIMLIK_KUTUK_NO',
                'ABONE_KIMLIK_SAYFA_NO', 'ABONE_KIMLIK_IL', 'ABONE_KIMLIK_ILCE', 'ABONE_KIMLIK_MAHALLE_KOY',
                'ABONE_KIMLIK_VERILDIGI_YER', 'ABONE_KIMLIK_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI',
                'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE', 'ABONE_ADRES_YERLESIM_MAHALLE',
                'ABONE_ADRES_YERLESIM_CADDE', 'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO',
                'ABONE_ADRES_YERLESIM_POSTA_KODU', 'ABONE_ADRES_YERLESIM_ADRES_KODU',
                'ABONE_ADRES_IRTIBAT_TEL_NO_1', 'ABONE_ADRES_IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL',
                'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO',
                'KURUM_YETKILI_TELEFON', 'KURUM_ADRES'
            ];

            foreach ($btkClientFields as $field) {
                if (isset($postData[$field])) {
                    // Tarih formatlarını kontrol et (YYYY-AA-GG ise YYYYAAGG veya BTK formatına çevir)
                    if (in_array($field, ['ABONE_DOGUM_TARIHI', 'ABONE_KIMLIK_VERILDIGI_TARIH']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $postData[$field])) {
                        $updateData[$field] = str_replace('-', '', $postData[$field]); // YYYYAAGG
                    } else {
                        $updateData[$field] = ($postData[$field] === '') ? null : $postData[$field]; // Boş stringleri NULL yap
                    }
                }
            }

            if (empty($updateData)) {
                BtkHelper::logActivity("SubscriberGuideService: Müşteri BTK güncellemesi için değiştirilecek veri bulunamadı. UserID: {$userId}", $adminId ?? 0, 'INFO');
                return true; // Değişiklik yoksa da başarılı sayalım
            }

            $updateData['updated_at'] = Carbon::now();
            // Bu müşteriye ait TÜM rehber kayıtlarını güncelle (sadece aktifleri değil, BTK tüm geçmişi ister)
            $affectedRows = Capsule::table('mod_btk_abone_rehber')
                ->where('whmcs_user_id', $userId)
                ->update($updateData);

            BtkHelper::logActivity("SubscriberGuideService: UserID {$userId} için {$affectedRows} adet rehber kaydı güncellendi (Müşteri Detayları).", $adminId ?? 0, 'INFO');

            // Şimdi her bir etkilenen (veya sadece aktif olan?) hizmet için "ABONE BILGI GUNCELLEME" hareketi oluştur
            // Bu hareket, güncellenmiş tüm rehber verilerini içermelidir.
            $servicesToCreateActivityFor = Capsule::table('mod_btk_abone_rehber')
                                            ->where('whmcs_user_id', $userId)
                                            // ->where('HAT_DURUM', 'A') // Sadece aktifler için mi hareket? BTK genellikle tüm değişiklikleri ister.
                                            ->get();

            foreach ($servicesToCreateActivityFor as $rehberKaydi) {
                // Örnek Servis Çağrısı (İleride eklenecek):
                // SubscriberActivityService::createActivity(
                //     $rehberKaydi->whmcs_service_id,
                //     $userId,
                //     '3', // MUSTERI_HAREKET_KODU
                //     BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '3', 'ABONE BILGI GUNCELLEME'),
                //     (array)$rehberKaydi // Güncellenmiş rehber kaydından tüm BTK alanları
                // );
            }
            return true;

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::updateClientDetailsForAllServices Hata: " . $e->getMessage(), $adminId ?? 0, 'ERROR', ['exception' => (string)$e, 'user_id' => $userId]);
            return false;
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class SubscriberGuideService
{
    // ... (Bir önceki bölümdeki fonksiyonlar burada) ...

    /**
     * Admin panelindeki Hizmet Detayları BTK formundan gelen verilerle
     * ilgili hizmetin mod_btk_abone_rehber kaydını günceller.
     * Ayrıca, bu işlem için "ABONE BILGI GUNCELLEME" hareketi oluşturur.
     *
     * @param int $serviceId WHMCS Hizmet ID'si
     * @param int $userId WHMCS Müşteri ID'si
     * @param array $postData Formdan gelen $_POST verileri
     * @return bool Başarılı ise true
     */
    public static function updateServiceDetailsFromAdminForm($serviceId, $userId, array $postData)
    {
        BtkHelper::logActivity("SubscriberGuideService: Hizmet BTK detayları güncelleniyor. ServiceID: {$serviceId}", $adminId ?? 0, 'INFO', ['service_id' => $serviceId]);
        try {
            $rehberKaydi = Capsule::table('mod_btk_abone_rehber')
                            ->where('whmcs_service_id', $serviceId)
                            ->first();

            if (!$rehberKaydi) {
                // Eğer kayıt yoksa, belki yeni hizmet aktivasyonu gibi bir durumdur,
                // o zaman createOrUpdateForNewService çağrılabilir.
                // Ancak bu form genellikle mevcut bir hizmet için güncellenir.
                BtkHelper::logActivity("SubscriberGuideService: Hizmet BTK güncellemesi için rehber kaydı bulunamadı. ServiceID: {$serviceId}. Yeni kayıt oluşturuluyor...", $adminId ?? 0, 'WARNING');
                $newRehberData = self::createOrUpdateForNewService($serviceId, $userId);
                if(!$newRehberData) return false; // Oluşturma başarısızsa çık
                $rehberKaydi = $newRehberData; // Yeni oluşturulan kaydı kullan
            }

            // Formdan gelen ve rehber tablosundaki alanlarla eşleşen verileri al
            $updateDataRehber = [];
            $btkServiceFields = [ // Güncellenecek hizmet bazlı rehber alanları
                'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU', 'HAT_DURUM_KODU_ACIKLAMA',
                'HIZMET_TIPI', 'ABONE_TARIFE',
                'ABONE_BASLANGIC', 'ABONE_BITIS', // ABONE_BITIS önemli, iptal durumunda set edilmeli
                'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE',
                'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO', 'ABONE_ADRES_TESIS_IC_KAPI_NO',
                'ABONE_ADRES_TESIS_POSTA_KODU', 'ABONE_ADRES_TESIS_ADRES_KODU',
                'STATIK_IP', 'ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI',
                'AKTIVASYON_BAYI_ADI', 'AKTIVASYON_BAYI_ADRESI', 'AKTIVASYON_KULLANICI',
                'GUNCELLEYEN_BAYI_ADI', 'GUNCELLEYEN_BAYI_ADRESI', 'GUNCELLEYEN_KULLANICI'
                // Müşteri bazlı alanlar (Ad, Soyad, TCKN vb.) client_details_btk_form'dan güncellenir.
            ];

            foreach ($btkServiceFields as $field) {
                if (isset($postData[$field])) {
                     // Tarih formatları YYYYAAGGSSDDSS olmalı
                    if (in_array($field, ['ABONE_BASLANGIC', 'ABONE_BITIS']) && preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $postData[$field])) { // YYYY-MM-DD HH:II:SS formatından
                        $updateDataRehber[$field] = Carbon::parse($postData[$field])->format('YmdHis');
                    } elseif (in_array($field, ['ABONE_BASLANGIC', 'ABONE_BITIS']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $postData[$field])) { // YYYY-MM-DD formatından (saat yoksa 000000)
                         $updateDataRehber[$field] = Carbon::parse($postData[$field])->format('Ymd') . '000000';
                    } elseif ($field === 'ISS_POP_BILGISI' && isset($postData['ISS_POP_BILGISI_SSID'])) {
                        // ISS_POP_BILGISI, sunucuadı.SSID şeklinde oluşacak
                        $service = Capsule::table('tblhosting')->find($serviceId);
                        $server = $service ? Capsule::table('tblservers')->find($service->server) : null;
                        $serverName = $server ? $server->name : ($service && !empty($service->server) ? $service->server : BtkHelper::getSetting('default_pop_server_name', 'TANıMSıZSUNUCU')); // Config'den varsayılan sunucu adı
                        $ssid = trim($postData['ISS_POP_BILGISI_SSID']);
                        $updateDataRehber['ISS_POP_BILGISI'] = !empty($ssid) ? strtoupper($serverName) . '.' . strtoupper($ssid) : strtoupper($serverName) . '.';
                    }
                    else {
                        $updateDataRehber[$field] = ($postData[$field] === '') ? null : $postData[$field];
                    }
                }
            }

            // HAT_DURUM_KODU_ACIKLAMA otomatik set edilsin
            if (isset($updateDataRehber['HAT_DURUM_KODU']) && (!isset($updateDataRehber['HAT_DURUM_KODU_ACIKLAMA']) || empty($updateDataRehber['HAT_DURUM_KODU_ACIKLAMA']))) {
                $updateDataRehber['HAT_DURUM_KODU_ACIKLAMA'] = BtkHelper::getBtkReferenceValue('hat_durum_kodlari', $updateDataRehber['HAT_DURUM_KODU'], '');
            }


            if (!empty($updateDataRehber)) {
                $updateDataRehber['MUSTERI_HAREKET_KODU'] = '3'; // ABONE BILGI GUNCELLEME
                $updateDataRehber['MUSTERI_HAREKET_ACIKLAMA'] = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '3', 'ABONE BILGI GUNCELLEME');
                $updateDataRehber['MUSTERI_HAREKET_ZAMANI'] = BtkHelper::getBtkDateTimeFormat();
                $updateDataRehber['updated_at'] = Carbon::now();

                Capsule::table('mod_btk_abone_rehber')
                    ->where('id', $rehberKaydi->id)
                    ->update($updateDataRehber);
                BtkHelper::logActivity("SubscriberGuideService: ServiceID {$serviceId} için rehber kaydı (BTK Hizmet Detayları) güncellendi.", $adminId ?? 0, 'INFO');

                // Güncellenmiş rehber kaydını al
                $guncellenmisRehberKaydi = Capsule::table('mod_btk_abone_rehber')->find($rehberKaydi->id);

                // "ABONE BILGI GUNCELLEME" (kod 3) hareketi oluştur
                // Örnek Servis Çağrısı (İleride eklenecek):
                // SubscriberActivityService::createActivity(
                //     $serviceId,
                //     $userId,
                //     '3',
                //     $updateDataRehber['MUSTERI_HAREKET_ACIKLAMA'],
                //     (array)$guncellenmisRehberKaydi
                // );
            }

            // Operasyonel ek bilgileri (mod_btk_hizmet_detaylari) güncelle/ekle
            $ekDetayData = [];
            $btkEkDetayFields = [
                'aile_filtresi_aktif', 'mac_adresleri', 'cihaz_seri_no', 'wifi_sifresi',
                'kurulum_notlari', 'cihaz_turu', 'cihaz_modeli', 'kurulum_sinyal_kalitesi',
                'tesis_koordinatlari'
            ];
            foreach ($btkEkDetayFields as $field) {
                if (isset($postData[$field])) {
                    if($field === 'aile_filtresi_aktif'){
                        $ekDetayData[$field] = ($postData[$field] == '1') ? 1 : 0;
                    } else {
                        $ekDetayData[$field] = ($postData[$field] === '') ? null : $postData[$field];
                    }
                }
            }

            if (!empty($ekDetayData)) {
                $ekDetayData['updated_at'] = Carbon::now();
                Capsule::table('mod_btk_hizmet_detaylari')->updateOrInsert(
                    ['hizmet_id' => $serviceId],
                    array_merge($ekDetayData, ['created_at' => Carbon::now()]) // Insert durumunda created_at
                );
                BtkHelper::logActivity("SubscriberGuideService: ServiceID {$serviceId} için operasyonel ek hizmet detayları güncellendi/eklendi.", $adminId ?? 0, 'INFO');
            }

            return true;

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::updateServiceDetailsFromAdminForm Hata: " . $e->getMessage(), $adminId ?? 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return false;
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class SubscriberGuideService
{
    // ... (Bir önceki bölümlerdeki fonksiyonlar burada) ...

    /**
     * Bir hizmetin `mod_btk_abone_rehber` tablosundaki BTK verilerini çeker.
     * Admin ve Client Area enjeksiyonları için kullanılır.
     *
     * @param int $serviceId WHMCS Hizmet ID'si
     * @return object|null Rehber kaydı veya bulunamazsa null
     */
    public static function getServiceBtkData($serviceId)
    {
        if (empty($serviceId)) return null;
        try {
            $data = Capsule::table('mod_btk_abone_rehber')
                        ->where('whmcs_service_id', $serviceId)
                        ->first();
            // İlgili kodların açıklamalarını da ekleyelim (dropdown'larda göstermek için)
            if ($data) {
                $data->MUSTERI_TIPI_ACIKLAMA = BtkHelper::getBtkReferenceValue('musteri_tipleri', $data->MUSTERI_TIPI);
                $data->ABONE_UYRUK_ACIKLAMA = BtkHelper::getBtkReferenceValue('ulkeler', $data->ABONE_UYRUK, $data->ABONE_UYRUK, 'iso_kodu', 'ulke_adi_tr');
                $data->ABONE_MESLEK_ACIKLAMA = BtkHelper::getBtkReferenceValue('meslek_kodlari', $data->ABONE_MESLEK);
                $data->ABONE_CINSIYET_ACIKLAMA = BtkHelper::getBtkReferenceValue('cinsiyet', $data->ABONE_CINSIYET);
                $data->ABONE_KIMLIK_TIPI_ACIKLAMA = BtkHelper::getBtkReferenceValue('kimlik_tipleri', $data->ABONE_KIMLIK_TIPI);
                $data->ABONE_KIMLIK_AIDIYETI_ACIKLAMA = BtkHelper::getBtkReferenceValue('kimlik_aidiyeti', $data->ABONE_KIMLIK_AIDIYETI);
                $data->HIZMET_TIPI_ACIKLAMA = BtkHelper::getBtkReferenceValue('hizmet_tipleri', $data->HIZMET_TIPI);
                $data->HAT_DURUM_ACIKLAMA = BtkHelper::getBtkReferenceValue('hat_durum', $data->HAT_DURUM);
                // HAT_DURUM_KODU_ACIKLAMA zaten tabloda var.
            }
            return $data;
        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::getServiceBtkData Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return null;
        }
    }

    /**
     * Bir müşterinin (genellikle ilk aktif hizmetinden alınan) `mod_btk_abone_rehber` tablosundaki
     * ortak (abone bazlı) BTK verilerini çeker.
     * Admin ve Client Area enjeksiyonları için kullanılır.
     *
     * @param int $userId WHMCS Müşteri ID'si
     * @return object|null Rehber kaydı (veya sadece ilgili alanlar) veya bulunamazsa null
     */
    public static function getClientBtkData($userId)
    {
        if (empty($userId)) return null;
        try {
            // Müşteriye ait herhangi bir rehber kaydını al (genellikle en sonuncusu veya ilki fark etmez, ortak alanlar aynı olmalı)
            $data = Capsule::table('mod_btk_abone_rehber')
                        ->where('whmcs_user_id', $userId)
                        ->orderBy('id', 'desc') // En son kayıt daha güncel olabilir
                        ->first();
            if ($data) {
                // İlgili kodların açıklamalarını ekle
                $data->MUSTERI_TIPI_ACIKLAMA = BtkHelper::getBtkReferenceValue('musteri_tipleri', $data->MUSTERI_TIPI);
                $data->ABONE_UYRUK_ACIKLAMA = BtkHelper::getBtkReferenceValue('ulkeler', $data->ABONE_UYRUK, $data->ABONE_UYRUK, 'iso_kodu', 'ulke_adi_tr');
                $data->ABONE_MESLEK_ACIKLAMA = BtkHelper::getBtkReferenceValue('meslek_kodlari', $data->ABONE_MESLEK);
                $data->ABONE_CINSIYET_ACIKLAMA = BtkHelper::getBtkReferenceValue('cinsiyet', $data->ABONE_CINSIYET);
                $data->ABONE_KIMLIK_TIPI_ACIKLAMA = BtkHelper::getBtkReferenceValue('kimlik_tipleri', $data->ABONE_KIMLIK_TIPI);
                $data->ABONE_KIMLIK_AIDIYETI_ACIKLAMA = BtkHelper::getBtkReferenceValue('kimlik_aidiyeti', $data->ABONE_KIMLIK_AIDIYETI);
            }
            return $data;
        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::getClientBtkData Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'user_id' => $userId]);
            return null;
        }
    }

    /**
     * Bir hizmetin daha önce BTK'ya "İptal" (HAT_DURUM = 'I') olarak bildirilip bildirilmediğini kontrol eder.
     *
     * @param int $serviceId
     * @return bool İptal edilmişse true, değilse false
     */
    public static function isBtkCancelled($serviceId)
    {
        if (empty($serviceId)) return false;
        try {
            $rehberKaydi = Capsule::table('mod_btk_abone_rehber')
                            ->where('whmcs_service_id', $serviceId)
                            ->where('HAT_DURUM', 'I')
                            ->first();
            return $rehberKaydi ? true : false;
        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::isBtkCancelled Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return false; // Hata durumunda varsayılan olarak iptal edilmemiş say
        }
    }

    /**
     * Bir müşteri WHMCS'ten silindiğinde, bu müşteriye ait TÜM hizmetlerin
     * BTK kayıtlarını 'I' (İptal) durumuna getirir ve ABONE_BITIS tarihlerini günceller.
     * Ayrıca her hizmet için son bir "ABONE IPTAL KAYDI" hareketi oluşturur.
     *
     * @param int $userId Silinen WHMCS Müşteri ID'si
     * @return bool İşlem başarılıysa true
     */
    public static function handleClientDeletionForAllServices($userId)
    {
        BtkHelper::logActivity("SubscriberGuideService: Müşteri silme işlemi için BTK kayıtları güncelleniyor. UserID: {$userId}", 0, 'INFO');
        try {
            $servicesToTerminate = Capsule::table('mod_btk_abone_rehber')
                                    ->where('whmcs_user_id', $userId)
                                    ->where('HAT_DURUM', '<>', 'I') // Zaten iptal değilse
                                    ->get();

            if ($servicesToTerminate->isEmpty()) {
                BtkHelper::logActivity("SubscriberGuideService: UserID {$userId} için güncellenecek aktif/dondurulmuş BTK hizmet kaydı bulunamadı (ClientDelete).", 0, 'INFO');
                return true;
            }

            $iptalTarihi = BtkHelper::getBtkDateTimeFormat();
            $hatDurumKodu = '11'; // IPTAL_DİĞER (veya özel bir "Müşteri Silindi" kodu eklenebilir)
            $hatDurumKoduAciklama = BtkHelper::getBtkReferenceValue('hat_durum_kodlari', $hatDurumKodu, 'IPTAL_DİĞER');
            $hareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '2', 'ABONE IPTAL KAYDI');


            foreach ($servicesToTerminate as $rehberKaydi) {
                $serviceId = $rehberKaydi->whmcs_service_id;

                $updatedRehber = self::terminateService($serviceId, $iptalTarihi, $hatDurumKodu, $hatDurumKoduAciklama);
                if ($updatedRehber) {
                    // Örnek Servis Çağrısı (İleride eklenecek):
                    // SubscriberActivityService::createActivity(
                    //     $serviceId,
                    //     $userId,
                    //     '2', // MUSTERI_HAREKET_KODU
                    //     $hareketAciklama,
                    //     (array)$updatedRehber // Güncellenmiş rehber kaydından tüm BTK alanları
                    // );
                    BtkHelper::logActivity("SubscriberGuideService: Müşteri silinmesi nedeniyle ServiceID {$serviceId} BTK kaydı iptal edildi.", 0, 'INFO');
                } else {
                    BtkHelper::logActivity("SubscriberGuideService: Müşteri silinmesi nedeniyle ServiceID {$serviceId} BTK kaydı iptal EDİLEMEDİ.", 0, 'ERROR');
                }
            }
            return true;

        } catch (\Exception $e) {
            BtkHelper::logActivity("SubscriberGuideService::handleClientDeletionForAllServices Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'user_id' => $userId]);
            return false;
        }
    }

} // Sınıf sonu
?>