<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService;
use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use WHMCS\User\Client;

/**
 * Class ClientDataService
 *
 * Müşteri profiline enjekte edilen BTK form verilerini yönetir.
 */
class ClientDataService
{
    /**
     * Admin panelindeki Müşteri Profili BTK formu için gerekli tüm verileri toplar.
     *
     * @param int $userId WHMCS Müşteri ID'si
     * @return array Şablona gönderilecek veri dizisi ['success' => bool, 'data' => array, 'message' => string|null]
     */
    public static function getClientFormData($userId)
    {
        BtkHelper::logActivity("ClientDataService: Müşteri BTK formu için veri hazırlanıyor. UserID: {$userId}", 0, 'DEBUG');
        try {
            $client = Client::find($userId);
            if (!$client) {
                return ['success' => false, 'data' => [], 'message' => 'Müşteri bulunamadı.'];
            }

            $btkData = SubscriberGuideService::getClientBtkData($userId); // Rehberden mevcut BTK verilerini al

            // Eğer hiç BTK verisi yoksa ve müşteri tipi belirlenebiliyorsa, temel bir yapı oluştur
            if (!$btkData && $client) {
                $musteriTipiKod = !empty($client->companyname) ? 'G' : 'B';
                $btkData = new \stdClass(); // Boş nesne
                $btkData->MUSTERI_TIPI = $musteriTipiKod;
                $btkData->ABONE_ADI = $client->firstname;
                $btkData->ABONE_SOYADI = $client->lastname;
                $btkData->ABONE_UNVAN = $client->companyname;
                $btkData->ABONE_VERGI_NUMARASI = $client->tax_id;
                $btkData->ABONE_ADRES_E_MAIL = $client->email;
                $btk_data->ABONE_ADRES_IRTIBAT_TEL_NO_1 = $client->phonenumber;
                $btkData->ABONE_UYRUK = 'TUR'; // Varsayılan
                // Diğer alanlar null veya boş olacak
            }

            // Açıklamaları ekle (SubscriberGuideService::getClientBtkData zaten yapıyor olabilir, teyit et)
            if ($btkData) {
                 if (!isset($btkData->MUSTERI_TIPI_ACIKLAMA)) $btkData->MUSTERI_TIPI_ACIKLAMA = BtkHelper::getBtkReferenceValue('musteri_tipleri', $btkData->MUSTERI_TIPI ?? '');
                 if (!isset($btkData->ABONE_UYRUK_ACIKLAMA)) $btkData->ABONE_UYRUK_ACIKLAMA = BtkHelper::getBtkReferenceValue('ulkeler', $btkData->ABONE_UYRUK ?? '', $btkData->ABONE_UYRUK ?? '', 'iso_kodu', 'ulke_adi_tr');
                 // Diğer açıklamalar da benzer şekilde eklenebilir.
            }


            $formData = [
                'success' => true,
                'userid' => $userId,
                'clientdetails' => (array)$client->getDetails(), // WHMCS standart müşteri detayları
                'btk_data' => $btkData ? (array)$btkData : [], // mod_btk_abone_rehber'den gelen veriler
                'ref_ulkeler' => Capsule::table('mod_btk_ref_ulkeler')->orderBy('ulke_adi_tr')->get()->all(),
                'ref_meslek_kodlari' => Capsule::table('mod_btk_ref_meslek_kodlari')->orderBy('aciklama')->get()->all(),
                'ref_kimlik_tipleri' => Capsule::table('mod_btk_ref_kimlik_tipleri')->get()->all(),
                'ref_kimlik_aidiyeti' => Capsule::table('mod_btk_ref_kimlik_aidiyeti')->get()->all(),
                'ref_cinsiyet' => Capsule::table('mod_btk_ref_cinsiyet')->get()->all(),
                'iller' => Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->all(),
                'yerlesim_ilceleri' => [], // Düzenleme için, seçili ile ait ilçeler
            ];

            // Eğer düzenleme modunda (btk_data varsa) ve yerleşim ili seçiliyse, ilçeleri yükle
            if ($btkData && !empty($btkData->ABONE_ADRES_YERLESIM_IL)) {
                $ilKaydi = Capsule::table('mod_btk_adres_il')->where('il_adi', $btkData->ABONE_ADRES_YERLESIM_IL)->first();
                if ($ilKaydi) {
                    $formData['yerlesim_ilceleri'] = Capsule::table('mod_btk_adres_ilce')->where('il_id', $ilKaydi->id)->orderBy('ilce_adi')->get()->all();
                }
            }
            return $formData;

        } catch (\Exception $e) {
            BtkHelper::logActivity("ClientDataService::getClientFormData Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'user_id' => $userId]);
            return ['success' => false, 'data' => [], 'message' => 'Müşteri BTK formu için veri hazırlanırken bir hata oluştu.'];
        }
    }

    /**
     * Müşteri Profili BTK formundan gelen verileri kaydeder/günceller.
     * Bu işlem, müşteriye ait TÜM AKTİF HİZMETLERİN rehber kayıtlarındaki ortak alanlarını günceller
     * ve her bir hizmet için "ABONE BILGI GUNCELLEME" hareketi oluşturur.
     * Bu fonksiyon, SubscriberGuideService::updateClientDetailsForAllServices'in yerini alabilir veya onu çağırabilir.
     *
     * @param int $userId WHMCS Müşteri ID'si
     * @param array $postData Formdan gelen $_POST verileri
     * @return array ['success' => bool, 'message' => string]
     */
    public static function saveClientBtkData($userId, array $postData)
    {
        $adminId = $_SESSION['adminid'] ?? 0;
        BtkHelper::logActivity("ClientDataService: Müşteri BTK verileri kaydediliyor. UserID: {$userId}", $adminId, 'INFO');

        try {
            // 1. Veri Doğrulama (NVI TCKN/YKN vb.) - Bu kısım NviVerificationService çağrıları ile yapılacak.
            // Örnek TCKN Doğrulama:
            if (BtkHelper::getSetting('nvi_tckn_dogrulama_aktif', '0') == '1' &&
                isset($postData['MUSTERI_TIPI']) && $postData['MUSTERI_TIPI'] === 'B' &&
                !empty($postData['ABONE_TC_KIMLIK_NO'])) {

                $dogumTarihiParts = [];
                if (!empty($postData['ABONE_DOGUM_TARIHI']) && preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $postData['ABONE_DOGUM_TARIHI'], $matches)) {
                    $dogumTarihiParts['year'] = (int)$matches[1];
                } else {
                    // Doğum tarihi formatı hatalı veya eksikse NVI doğrulanamaz.
                    return ['success' => false, 'message' => 'TCKN doğrulaması için geçerli bir doğum tarihi (YYYY-AA-GG) gereklidir.'];
                }

                // $nviResult = NviVerificationService::verifyTCKN(
                //     $postData['ABONE_TC_KIMLIK_NO'],
                //     $postData['ABONE_ADI'],
                //     $postData['ABONE_SOYADI'],
                //     $dogumTarihiParts['year']
                // );
                // if (!$nviResult['success'] || !$nviResult['is_valid']) {
                //     return ['success' => false, 'message' => 'TCKN doğrulanamadı: ' . ($nviResult['message'] ?: 'NVI servisi yanıtı olumsuz.')];
                // }
                BtkHelper::logActivity("ClientDataService: TCKN doğrulaması (varsayımsal olarak) başarılı. UserID: {$userId}", $adminId, 'DEBUG'); // NVI entegrasyonu sonrası güncellenecek
            }
            // Benzer şekilde YKN doğrulaması...

            // 2. SubscriberGuideService aracılığıyla müşteri bilgilerini tüm hizmetlere yansıt
            $updateResult = SubscriberGuideService::updateClientDetailsForAllServices($userId, $postData);

            if ($updateResult) {
                $message = 'Müşteri BTK bilgileri başarıyla güncellendi ve ilgili hizmetlere yansıtıldı.';
                BtkHelper::logActivity($message . " UserID: {$userId}", $adminId, 'SUCCESS');
                return ['success' => true, 'message' => $message];
            } else {
                $message = 'Müşteri BTK bilgileri güncellenirken bir sorun oluştu.';
                BtkHelper::logActivity($message . " UserID: {$userId}", $adminId, 'ERROR');
                return ['success' => false, 'message' => $message];
            }

        } catch (\Exception $e) {
            $errMsg = "ClientDataService::saveClientBtkData Hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, $adminId, 'ERROR', ['exception' => (string)$e, 'user_id' => $userId]);
            return ['success' => false, 'message' => 'Müşteri BTK bilgileri kaydedilirken kritik bir hata oluştu.'];
        }
    }

} // Sınıf sonu
?>