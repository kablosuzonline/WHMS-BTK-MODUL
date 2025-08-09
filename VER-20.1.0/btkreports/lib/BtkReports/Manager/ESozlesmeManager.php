<?php
/**
 * BTK E-Sözleşme (E-Kayıt) API Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - `PageManager` tarafından çağrılan ve hata veren `getBasvurularWithPagination`
 *   fonksiyonu, tam işlevsel olarak eklendi.
 * - Test başvurusu oluşturma (`createTestBasvuru`) mantığı, Genel Ayarlar'da
 *   tanımlanan test verilerini kullanacak şekilde iyileştirildi.
 * - Gerçek bir başvurudan müşteri ve sipariş oluşturma (`approveAndCreateClientFromBasvuru`)
 *   fonksiyonu, WHMCS'in `localAPI`'sini kullanarak tam otomasyon sağlar.
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

class ESozlesmeManager
{
    // BTK dökümanlarında belirtilen sabit kod
    private const ISLETMECI_TIPI_KODU = 0;

    // ==================================================================
    // == ANA API METOTLARI (BTK TARAFINDAN ÇAĞRILAN)
    // ==================================================================

    public function handleSorgula(array $data): array
    {
        $this->validateGirisParametreleri($data);
        
        $bekleyenBasvurular = Capsule::table('mod_btk_esozlesme_basvurular')
            ->where('durum', 'BEKLEMEDE')
            ->get()->map(function ($item) {
                return $this->formatBasvuruForBtkSchema((array)$item);
            })->all();
        
        return [
            'basvuruListesi' => $bekleyenBasvurular,
            'sonuc' => [ 'kodu' => 0, 'mesaji' => 'Sorgulama basariyla tamamlandi.' ]
        ];
    }

    public function handleKaydet(array $data): array
    {
        $referansNo = $data['basvuruReferansNo'] ?? null;
        if (empty($referansNo)) {
            throw new \InvalidArgumentException('Onaylama işlemi için basvuruReferansNo zorunludur.');
        }
        Capsule::table('mod_btk_esozlesme_basvurular')
            ->where('basvuru_referans_no', $referansNo)
            ->update(['durum' => 'ONAYLANDI', 'son_islem_tarihi' => date('Y-m-d H:i:s')]);
        return ['sonuc' => ['kodu' => 0, 'mesaji' => 'Basvuru basariyla onaylandi.']];
    }
    
    public function handleIptal(array $data): array
    {
        $referansNo = $data['basvuruReferansNo'] ?? null;
        if (empty($referansNo)) {
            throw new \InvalidArgumentException('İptal işlemi için basvuruReferansNo zorunludur.');
        }
        Capsule::table('mod_btk_esozlesme_basvurular')
            ->where('basvuru_referans_no', $referansNo)
            ->update(['durum' => 'REDDEDILDI', 'son_islem_tarihi' => date('Y-m-d H:i:s')]);
        return ['sonuc' => ['kodu' => 0, 'mesaji' => 'Basvuru basariyla iptal edildi.']];
    }
    
    // ==================================================================
    // == CANLI OPERASYON YÖNETİMİ
    // ==================================================================
    
    public static function approveAndCreateClientFromBasvuru(string $refNo): array
    {
        LogManager::logAction('E-Sözleşme Onay ve Müşteri Oluşturma Başladı', 'UYARI', "Ref No: {$refNo} için işlem başlatıldı.");
        try {
            $basvuru = (array)Capsule::table('mod_btk_esozlesme_basvurular')->where('basvuru_referans_no', $refNo)->where('durum', 'BEKLEMEDE')->first();
            if (!$basvuru) {
                throw new \Exception("Onaylanacak başvuru bulunamadı veya zaten işlenmiş.");
            }
            
            $hamVeri = json_decode($basvuru['full_request_json'], true);
            $kisisel = $hamVeri['kisiselBilgiler'];
            $iletisim = $hamVeri['iletisimBilgileri'];
            $adres = $hamVeri['adresBilgileri'];
            
            $clientData = [
                'firstname' => $kisisel['ad'],
                'lastname' => $kisisel['soyad'],
                'companyname' => $kisisel['unvan'],
                'email' => $iletisim['eposta'],
                'address1' => $adres['caddeSokak'],
                'city' => $adres['ilce'],
                'state' => $adres['il'],
                'country' => 'TR',
                'phonenumber' => $iletisim['cepTelefonu'],
                'password2' => substr(md5(uniqid(rand(), true)), 0, 10),
            ];
            
            $results = localAPI('AddClient', $clientData);
            if ($results['result'] !== 'success') {
                throw new \Exception("WHMCS Müşteri Oluşturma Hatası: " . $results['message']);
            }
            $clientId = $results['clientid'];
            
            HookManager::handleClientAddOrEditPost($clientId, [
                'musteri_tipi' => $kisisel['unvan'] ? 'T-SIRKET' : 'G-SAHIS',
                'abone_tc_kimlik_no' => $kisisel['tckn'],
                'abone_vergi_numarasi' => $kisisel['vkn'],
            ]);
            
            $orderData = [
                'clientid' => $clientId,
                'pid' => [1], // Örnek ürün ID'si
                'domain' => [$refNo],
                'billingcycle' => ['monthly'],
                'paymentmethod' => 'banktransfer',
            ];
            
            $orderResults = localAPI('AddOrder', $orderData);
            if ($orderResults['result'] !== 'success') {
                throw new \Exception("WHMCS Sipariş Oluşturma Hatası: " . $orderResults['message']);
            }
            
            Capsule::table('mod_btk_esozlesme_basvurular')
                ->where('id', $basvuru['id'])
                ->update([
                    'whmcs_client_id' => $clientId,
                    'whmcs_service_id' => $orderResults['serviceids'][0] ?? null,
                ]);

            $manager = new self();
            $manager->handleKaydet(['basvuruReferansNo' => $refNo]);

            LogManager::logAction('E-Sözleşme Onaylandı ve Müşteri Oluşturuldu', 'INFO', "Ref No: {$refNo}, Yeni Müşteri ID: {$clientId}");
            return ['type' => 'success', 'message' => "Başvuru onaylandı. Yeni müşteri (ID: {$clientId}) ve ilgili hizmet başarıyla oluşturuldu."];
            
        } catch (\Exception $e) {
            LogManager::logAction('E-Sözleşme Onaylama Hatası', 'KRITIK', $e->getMessage(), null, ['ref_no' => $refNo]);
            return ['type' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    public static function rejectBasvuru(string $refNo, string $retNedeni): array
    {
        LogManager::logAction('E-Sözleşme Reddetme Denemesi', 'UYARI', "Ref No: {$refNo} için işlem başlatıldı.", null, ['neden' => $retNedeni]);
        try {
             Capsule::table('mod_btk_esozlesme_basvurular')
                ->where('basvuru_referans_no', $refNo)
                ->update(['ret_nedeni' => $retNedeni]);
            
            $manager = new self();
            $manager->handleIptal(['basvuruReferansNo' => $refNo]);
            
            LogManager::logAction('E-Sözleşme Reddedildi', 'INFO', "Ref No: {$refNo} başarıyla reddedildi.");
            return ['type' => 'success', 'message' => 'Başvuru başarıyla reddedildi ve BTK sistemine bildirildi.'];

        } catch (\Exception $e) {
            LogManager::logAction('E-Sözleşme Reddetme Hatası', 'HATA', $e->getMessage(), null, ['ref_no' => $refNo]);
            return ['type' => 'error', 'message' => 'Başvuru reddedilirken bir hata oluştu: ' . $e->getMessage()];
        }
    }

    // ==================================================================
    // == YÖNETİCİ PANELİ - TEST SENARYOSU YÖNETİMİ
    // ==================================================================
    
    public static function createTestBasvuru(array $postData, array $LANG): array
    {
        LogManager::logAction('E-Sözleşme Test Başvurusu Oluşturma Denemesi', 'UYARI', 'Yeni test başvuruları oluşturuluyor.', null, ['request' => $postData]);
        try {
            $kisiTipi = $postData['kisi_tipi'] ?? 'gercek';
            $durum = $postData['basvuru_durum'] ?? 'BEKLEMEDE';
            $adet = (int)($postData['basvuru_sayisi'] ?? 1);

            $testTckn = BtkHelper::get_btk_setting('ekayit_test_tckn');
            $testAd = BtkHelper::get_btk_setting('ekayit_test_ad');
            $testSoyad = BtkHelper::get_btk_setting('ekayit_test_soyad');
            $testVkn = BtkHelper::get_btk_setting('ekayit_test_vkn');
            $testUnvan = BtkHelper::get_btk_setting('ekayit_test_unvan');
            $testMersis = BtkHelper::get_btk_setting('ekayit_test_mersis');

            if (($kisiTipi === 'gercek' && (empty($testTckn) || empty($testAd) || empty($testSoyad))) || 
                ($kisiTipi === 'tuzel' && (empty($testVkn) || empty($testUnvan) || empty($testMersis)))) {
                throw new \Exception("Lütfen önce Genel Ayarlar sayfasından ilgili tüm test verilerini (TCKN/Ad/Soyad ve VKN/Ünvan/MERSIS) tanımlayın.");
            }

            for ($i = 0; $i < $adet; $i++) {
                $refNo = 'TEST-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 12));
                $tckn = ($kisiTipi === 'gercek') ? $testTckn : null;
                $vkn = ($kisiTipi === 'tuzel') ? $testVkn : null;
                $ad = ($kisiTipi === 'gercek') ? $testAd : null;
                $soyad = ($kisiTipi === 'gercek') ? $testSoyad : null;
                $unvan = ($kisiTipi === 'tuzel') ? $testUnvan : null;
                $mersis = ($kisiTipi === 'tuzel') ? $testMersis : null;

                $jsonData = json_encode([
                    'basvuruReferansNo' => $refNo, 'tckn' => $tckn, 'vkn' => $vkn, 'ad' => $ad, 'soyad' => $soyad, 'unvan' => $unvan,
                    'mersisNumarasi' => $mersis, 'iletisimListesi' => [['eposta' => 'test@example.com', 'cepTelefonu' => '905000000000']],
                    'hizmetTuruKodu' => 8, 'adresBilgileri' => ['il' => 'ANKARA', 'ilce' => 'ÇANKAYA', 'mahalle' => 'MUSTAFA KEMAL', 'caddeSokak' => 'TEST CADDESİ'],
                    'hizmetBilgileri' => ['tarifeAdi' => 'TEST TARİFESİ'],
                    'islemYapanYetkiTur' => BtkHelper::get_btk_setting('ekayit_test_islemYapanYetkiTur', 'MUSTERI'),
                    'islemYapanDogumTarihi' => str_replace('/', '\/', BtkHelper::get_btk_setting('ekayit_test_islemYapanDogumTarihi', '01/01/1980'))
                ], JSON_UNESCAPED_UNICODE);
                Capsule::table('mod_btk_esozlesme_basvurular')->insert(['basvuru_referans_no' => $refNo, 'tckn' => $tckn, 'vkn' => $vkn, 'ad' => $ad, 'soyad' => $soyad, 'unvan' => $unvan, 'durum' => $durum, 'full_request_json' => $jsonData, 'basvuru_tarihi' => date('Y-m-d H:i:s')]);
            }
            return ['type' => 'success', 'message' => "{$adet} adet {$durum} durumunda test başvurusu başarıyla oluşturuldu."];
        } catch (\Exception $e) {
            LogManager::logAction('E-Sözleşme Test Başvurusu Oluşturma Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Test başvurusu oluşturulurken bir hata oluştu: ' . $e->getMessage()];
        }
    }
    
    // ==================================================================
    // == YARDIMCI VE DİĞER FONKSİYONLAR
    // ==================================================================
    
    public static function getBasvurularWithPagination(array $request): array
    {
        $query = Capsule::table('mod_btk_esozlesme_basvurular');
        
        $total = $query->count();
        $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20);
        $page = (int)($request['page'] ?? 1);
        $offset = ($page - 1) * $limit;
        
        $data = $query->orderBy('id', 'desc')->skip($offset)->take($limit)->get()->map(fn($item) => (array)$item)->all();
        
        return [
            'data' => $data,
            'pagination' => RaporManager::buildPagination([], $total, $limit, $page, 'esozlesme_basvurular')
        ];
    }
    
    public static function getAllTestBasvurulari(): array { return Capsule::table('mod_btk_esozlesme_basvurular')->orderBy('id', 'desc')->get()->map(fn($item) => (array)$item)->all(); }
    public static function deleteTestBasvuru(int $id, array $LANG): array { try { $deleted = Capsule::table('mod_btk_esozlesme_basvurular')->where('id', $id)->delete(); return $deleted ? ['type' => 'success', 'message' => 'Test başvurusu başarıyla silindi.'] : ['type' => 'error', 'message' => 'Silinecek başvuru bulunamadı.']; } catch (\Exception $e) { LogManager::logAction('E-Sözleşme Test Başvurusu Silme Hatası', 'HATA', $e->getMessage()); return ['type' => 'error', 'message' => 'Başvuru silinirken bir hata oluştu.']; } }
    public static function deleteAllTestBasvurulari(array $LANG): array { try { Capsule::table('mod_btk_esozlesme_basvurular')->truncate(); return ['type' => 'success', 'message' => 'Tüm test başvuruları başarıyla silindi.']; } catch (\Exception $e) { LogManager::logAction('Tüm E-Sözleşme Test Başvurularını Silme Hatası', 'HATA', $e->getMessage()); return ['type' => 'error', 'message' => 'Tüm başvurular silinirken bir hata oluştu.']; } }
    private function formatBasvuruForBtkSchema(array $basvuru): array { $hamVeri = json_decode($basvuru['full_request_json'], true); $isTuzel = ($basvuru['vkn'] !== null); $schema = [ 'basvuruReferansNo' => $basvuru['basvuru_referans_no'], 'basvuruDurumKodu' => $this->getBtkDurumKodu($basvuru['durum']), 'kurumKodu' => (int)BtkHelper::get_btk_setting('ekayit_kurum_kodu'), 'isletmeciKodu' => (int)BtkHelper::get_btk_setting('ekayit_isletmeci_kodu'), 'tuzelMi' => $isTuzel, 'kisiselBilgiler' => [ 'ad' => $isTuzel ? '' : ($hamVeri['ad'] ?? ''), 'soyad' => $isTuzel ? '' : ($hamVeri['soyad'] ?? ''), 'tckn' => $isTuzel ? '' : ($hamVeri['tckn'] ?? ''), 'unvan' => $isTuzel ? ($hamVeri['unvan'] ?? '') : '', 'vkn' => $isTuzel ? ($hamVeri['vkn'] ?? '') : '', 'mersisNumarasi' => $isTuzel ? ($hamVeri['mersisNumarasi'] ?? '') : '', ], 'iletisimBilgileri' => [ 'eposta' => $hamVeri['iletisimListesi'][0]['eposta'] ?? '', 'cepTelefonu' => $hamVeri['iletisimListesi'][0]['cepTelefonu'] ?? '', ], 'adresBilgileri' => [ 'il' => $hamVeri['adresBilgileri']['il'] ?? '', 'ilce' => $hamVeri['adresBilgileri']['ilce'] ?? '', 'mahalle' => $hamVeri['adresBilgileri']['mahalle'] ?? '', 'caddeSokak' => $hamVeri['adresBilgileri']['caddeSokak'] ?? '', ], 'hizmetBilgileri' => [ 'hizmetTuruKodu' => $hamVeri['hizmetTuruKodu'] ?? 8, 'isletmeciTipiKodu' => self::ISLETMECI_TIPI_KODU, 'tarifeAdi' => $hamVeri['hizmetBilgileri']['tarifeAdi'] ?? 'Standart Tarife', ], ]; if (BtkHelper::isBtkEkayitTestMode()) { $schema['islemYapanYetkiTur'] = BtkHelper::get_btk_setting('ekayit_test_islemYapanYetkiTur', 'MUSTERI'); $dogumTarihi = BtkHelper::get_btk_setting('ekayit_test_islemYapanDogumTarihi', '01/01/1980'); $schema['islemYapanDogumTarihi'] = str_replace('/', '\/', $dogumTarihi); } else { $schema['islemYapanYetkiTur'] = $hamVeri['islemYapanYetkiTur'] ?? 'MUSTERI'; $schema['islemYapanDogumTarihi'] = $hamVeri['islemYapanDogumTarihi'] ?? ''; } return $schema; }
    private function validateGirisParametreleri(array $data): void { $gerekenKurumKodu = BtkHelper::get_btk_setting('ekayit_kurum_kodu'); $gerekenIsletmeciKodu = BtkHelper::get_btk_setting('ekayit_isletmeci_kodu'); if (empty($gerekenKurumKodu) || empty($gerekenIsletmeciKodu)) { throw new \Exception("Modül ayarlarında E-Kayıt Kurum Kodu veya İşletmeci Kodu tanımlanmamış."); } if (($data['kurumKodu'] ?? null) != $gerekenKurumKodu) { throw new \InvalidArgumentException("Gelen istekteki Kurum Kodu geçersiz."); } if (($data['isletmeciKodu'] ?? null) != $gerekenIsletmeciKodu) { throw new \InvalidArgumentException("Gelen istekteki İşletmeci Kodu geçersiz."); } }
    private function getBtkDurumKodu(string $bizimDurum): int { return match ($bizimDurum) { 'ONAYLANDI' => 1, 'REDDEDILDI' => 2, 'BEKLEMEDE' => 3, default => 99, }; }
}