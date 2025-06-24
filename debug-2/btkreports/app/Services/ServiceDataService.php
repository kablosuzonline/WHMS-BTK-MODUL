<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService;
use WHMCS\Module\Addon\BtkRaporlari\Services\PopLocationService;
use WHMCS\Module\Addon\BtkRaporlari\Services\PersonnelService; // Teknik personel için
use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use WHMCS\Service\Service; // WHMCS Hizmet objesi için
use WHMCS\User\Client;   // WHMCS Müşteri objesi için

/**
 * Class ServiceDataService
 *
 * Hizmet detaylarına enjekte edilen BTK ve operasyonel form verilerini yönetir.
 */
class ServiceDataService
{
    /**
     * Admin panelindeki Hizmet Detayları BTK formu için gerekli tüm verileri toplar.
     *
     * @param int $serviceId WHMCS Hizmet ID'si
     * @param int $userId WHMCS Müşteri ID'si
     * @return array Şablona gönderilecek veri dizisi ['success' => bool, 'data' => array, 'message' => string|null]
     */
    public static function getServiceFormData($serviceId, $userId)
    {
        BtkHelper::logActivity("ServiceDataService: Hizmet BTK formu için veri hazırlanıyor. ServiceID: {$serviceId}", 0, 'DEBUG');
        try {
            $service = Service::find($serviceId);
            $client = Client::find($userId);

            if (!$service || !$client) {
                $msg = !$service ? "Hizmet bulunamadı (ID: {$serviceId})." : "Müşteri bulunamadı (ID: {$userId}).";
                return ['success' => false, 'data' => [], 'message' => $msg];
            }

            $btkRehberData = SubscriberGuideService::getServiceBtkData($serviceId);
            $btkEkDetayData = Capsule::table('mod_btk_hizmet_detaylari')->where('hizmet_id', $serviceId)->first();

            // Eğer rehber kaydı yoksa ve hizmet aktifse, temel bir taslak oluştur
            if (!$btkRehberData && $service->domainstatus === 'Active') {
                $btkRehberData = SubscriberGuideService::createOrUpdateForNewService($serviceId, $userId);
                // Bu durumda $btkRehberData SubscriberGuideService'ten dönen obje/array olmalı.
            }
            // Eğer hala rehber data yoksa, boş bir stdClass objesi oluşturabiliriz ki Smarty'de hatalar olmasın.
            if (!$btkRehberData) $btkRehberData = new \stdClass();
            if (!$btkEkDetayData) $btkEkDetayData = new \stdClass();


            // Müşterinin yerleşim adresi bilgilerini al (tesis adresi için kopyalama)
            $clientBtkData = SubscriberGuideService::getClientBtkData($userId);
            $btkClientResidentialAddress = [];
            if ($clientBtkData) {
                $btkClientResidentialAddress = [
                    'ABONE_ADRES_YERLESIM_IL' => $clientBtkData->ABONE_ADRES_YERLESIM_IL,
                    'ABONE_ADRES_YERLESIM_ILCE' => $clientBtkData->ABONE_ADRES_YERLESIM_ILCE,
                    'ABONE_ADRES_YERLESIM_MAHALLE' => $clientBtkData->ABONE_ADRES_YERLESIM_MAHALLE,
                    'ABONE_ADRES_YERLESIM_CADDE' => $clientBtkData->ABONE_ADRES_YERLESIM_CADDE,
                    'ABONE_ADRES_YERLESIM_DIS_KAPI_NO' => $clientBtkData->ABONE_ADRES_YERLESIM_DIS_KAPI_NO,
                    'ABONE_ADRES_YERLESIM_IC_KAPI_NO' => $clientBtkData->ABONE_ADRES_YERLESIM_IC_KAPI_NO,
                    'ABONE_ADRES_YERLESIM_POSTA_KODU' => $clientBtkData->ABONE_ADRES_YERLESIM_POSTA_KODU,
                    'ABONE_ADRES_YERLESIM_ADRES_KODU' => $clientBtkData->ABONE_ADRES_YERLESIM_ADRES_KODU,
                ];
            }

            // "Tesis adresi yerleşimle aynı mı?" checkbox'ının başlangıç durumunu belirle
            // Örneğin, eğer tesis adresi alanları boşsa ve yerleşim adresi doluysa işaretli gelebilir.
            // Ya da daha önce kaydedilmiş bir tercih varsa o kullanılır. Şimdilik varsayılan false.
            $tesisAdresiAyniChecked = false; // Bu mantık daha sonra geliştirilebilir.
            if ($btkRehberData && isset($btkRehberData->ABONE_ADRES_TESIS_IL) && $btkRehberData->ABONE_ADRES_TESIS_IL == ($clientBtkData->ABONE_ADRES_YERLESIM_IL ?? null) &&
                isset($btkRehberData->ABONE_ADRES_TESIS_ILCE) && $btkRehberData->ABONE_ADRES_TESIS_ILCE == ($clientBtkData->ABONE_ADRES_YERLESIM_ILCE ?? null) &&
                isset($btkRehberData->ABONE_ADRES_TESIS_MAHALLE) && $btkRehberData->ABONE_ADRES_TESIS_MAHALLE == ($clientBtkData->ABONE_ADRES_YERLESIM_MAHALLE ?? null) &&
                !empty($btkRehberData->ABONE_ADRES_TESIS_IL) ) // En azından il doluysa ve eşleşiyorsa
            {
                // Daha detaylı bir kontrol yapılabilir tüm adres alanları için
                // Şimdilik basit bir kontrol
                // $tesisAdresiAyniChecked = true;
            }


            // WHMCS hizmetinden temel bilgileri al
            $serviceProductName = '';
            if ($service->product) { // WHMCS 8+
                $serviceProductName = $service->product->name;
            } else { // Eski versiyonlar için veya ürün silinmişse
                $prodInfo = Capsule::table('tblproducts')->find($service->packageid);
                if ($prodInfo) $serviceProductName = $prodInfo->name;
            }

            $serverName = '';
            if ($service->server) { // WHMCS 8+ server ilişkisi
                $serverInfo = Capsule::table('tblservers')->find($service->server);
                if ($serverInfo) $serverName = $serverInfo->name;
            } elseif(!empty($service->server)) { // Eski versiyonlarda server ID'si direkt olabilir
                 $serverInfo = Capsule::table('tblservers')->find($service->server);
                 if ($serverInfo) $serverName = $serverInfo->name;
            }
             if (empty($serverName) && !empty($service->server)) { // Eğer server ID var ama isim alınamadıysa ID'yi kullan
                $serverData = Capsule::table('tblhosting')->join('tblservers', 'tblhosting.server', '=', 'tblservers.id')
                                ->where('tblhosting.id', $serviceId)->select('tblservers.name')->first();
                if($serverData) $serverName = $serverData->name;
            }
            if (empty($serverName) && !empty($service->dedicatedip) && filter_var($service->dedicatedip, FILTER_VALIDATE_IP)) {
                 // Eğer sunucu adı yoksa ama atanmış IP varsa, POP için bunu kullanabiliriz
                 $serverName = $service->dedicatedip;
            }


            $selectedPopSsid = null;
            if (isset($btkRehberData->ISS_POP_BILGISI) && strpos($btkRehberData->ISS_POP_BILGISI, '.') !== false) {
                $parts = explode('.', $btkRehberData->ISS_POP_BILGISI, 2);
                $selectedPopSsid = $parts[1] ?? null;
            }

            $formData = [
                'success' => true,
                'userid' => $userId,
                'serviceid' => $serviceId,
                'btk_rehber_data' => $btkRehberData ? (array)$btkRehberData : [],
                'btk_ek_detay_data' => $btkEkDetayData ? (array)$btkEkDetayData : [],
                'service_product_name' => $serviceProductName,
                'service_reg_date_btk_format' => Carbon::parse($service->regdate)->format('YmdHis'),
                'service_reg_date_human_format' => Carbon::parse($service->regdate)->format('d.m.Y H:i:s'),
                'service_dedicated_ip' => $service->dedicatedip,
                'service_username' => $service->username,
                'service_server_name' => $serverName ?: BtkHelper::getSetting('default_pop_server_name', 'TANIMSIZ_SUNUCU'),
                'ref_hizmet_tipleri' => Capsule::table('mod_btk_ref_hizmet_tipleri')->orderBy('aciklama')->get()->all(),
                'ref_hat_durum' => Capsule::table('mod_btk_ref_hat_durum')->get()->all(),
                'ref_hat_durum_kodlari' => Capsule::table('mod_btk_ref_hat_durum_kodlari')->orderBy('aciklama')->get()->all(),
                'pop_noktalari' => PopLocationService::getActivePopLocationsForSelect($btkRehberData->ABONE_ADRES_TESIS_ILCE_ID ?? null), // İlçe ID'si rehberde saklanmalı
                'selected_pop_ssid' => $selectedPopSsid,
                'iller' => Capsule::table('mod_btk_adres_il')->orderBy('il_adi')->get()->all(),
                'tesis_ilceleri' => [], // Düzenleme için, seçili ile ait ilçeler
                'btk_client_residential_address' => $btkClientResidentialAddress, // JSON olarak da gönderilebilir JS için
                'btk_client_residential_address_json' => json_encode($btkClientResidentialAddress),
                'tesis_adresi_yerlesimle_ayni_checked' => $tesisAdresiAyniChecked,
                'teknik_personeller' => [], // PersonnelService'ten çekilecek (görev bölgesi ve departmana göre)
                'settings' => [ // Bazı ayarlar şablonda gerekebilir
                    'btk_teknik_ekip_konum_gonderme_aktif' => BtkHelper::getSetting('btk_teknik_ekip_konum_gonderme_aktif', '0')
                ]
            ];

            // Tesis adresi için ilçe listesini yükle (eğer il seçiliyse)
            if ($btkRehberData && !empty($btkRehberData->ABONE_ADRES_TESIS_IL)) {
                $ilKaydi = Capsule::table('mod_btk_adres_il')->where('il_adi', $btkRehberData->ABONE_ADRES_TESIS_IL)->first();
                if ($ilKaydi) {
                    $formData['tesis_ilceleri'] = Capsule::table('mod_btk_adres_ilce')->where('il_id', $ilKaydi->id)->orderBy('ilce_adi')->get()->all();
                }
            }
            
            // Teknik Personelleri Yükle (Konum gönderme için)
            // if ($formData['settings']['btk_teknik_ekip_konum_gonderme_aktif'] == '1') {
            //    $tesisIlceAdi = $btkRehberData->ABONE_ADRES_TESIS_ILCE ?? null;
            //    $formData['teknik_personeller'] = PersonnelService::getTechnicalPersonnelByRegionAndDepartment($tesisIlceAdi, 'Bilgi Teknolojileri Departmanı');
            // }


            return $formData;

        } catch (\Exception $e) {
            BtkHelper::logActivity("ServiceDataService::getServiceFormData Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return ['success' => false, 'data' => [], 'message' => 'Hizmet BTK formu için veri hazırlanırken bir hata oluştu.'];
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class ServiceDataService
{
    // ... (getServiceFormData fonksiyonu burada) ...

    /**
     * Hizmet Detayları BTK ve Operasyonel formundan gelen verileri kaydeder/günceller.
     *
     * @param int $serviceId WHMCS Hizmet ID'si
     * @param int $userId WHMCS Müşteri ID'si
     * @param array $postData Formdan gelen $_POST verileri
     * @return array ['success' => bool, 'message' => string]
     */
    public static function saveServiceBtkAndOperationalData($serviceId, $userId, array $postData)
    {
        $adminId = $_SESSION['adminid'] ?? 0;
        BtkHelper::logActivity("ServiceDataService: Hizmet BTK ve Operasyonel verileri kaydediliyor. ServiceID: {$serviceId}", $adminId, 'INFO');

        try {
            // 1. BTK Rehber Verilerini Güncelle (SubscriberGuideService üzerinden)
            // Bu metod, kendi içinde hareket kaydını da tetiklemelidir.
            $rehberUpdateSuccess = SubscriberGuideService::updateServiceDetailsFromAdminForm($serviceId, $userId, $postData);

            if (!$rehberUpdateSuccess) {
                // SubscriberGuideService zaten detaylı log atmış olmalı.
                return ['success' => false, 'message' => 'Hizmetin BTK rehber bilgileri güncellenirken bir sorun oluştu. Lütfen logları kontrol edin.'];
            }

            // 2. Operasyonel Ek Bilgileri (mod_btk_hizmet_detaylari) Güncelle/Ekle
            $ekDetayData = [];
            $btkEkDetayFields = [
                'aile_filtresi_aktif', 'mac_adresleri', 'cihaz_seri_no', 'wifi_sifresi',
                'kurulum_notlari', 'cihaz_turu', 'cihaz_modeli', 'kurulum_sinyal_kalitesi',
                'tesis_koordinatlari'
            ];

            foreach ($btkEkDetayFields as $field) {
                if (isset($postData[$field])) {
                    if($field === 'aile_filtresi_aktif'){
                        $ekDetayData[$field] = ($postData[$field] == '1' || $postData[$field] === true) ? 1 : 0;
                    } else {
                        $ekDetayData[$field] = ($postData[$field] === '') ? null : trim($postData[$field]);
                    }
                }
            }

            if (!empty($ekDetayData)) {
                $ekDetayData['updated_at'] = Carbon::now();
                Capsule::table('mod_btk_hizmet_detaylari')->updateOrInsert(
                    ['hizmet_id' => $serviceId],
                    array_merge($ekDetayData, ['created_at' => Carbon::now()]) // Insert durumunda created_at
                );
                BtkHelper::logActivity("ServiceDataService: ServiceID {$serviceId} için operasyonel ek hizmet detayları güncellendi/eklendi.", $adminId, 'INFO');
            }

            $message = 'Hizmet BTK ve operasyonel bilgileri başarıyla güncellendi.';
            BtkHelper::logActivity($message . " ServiceID: {$serviceId}", $adminId, 'SUCCESS');
            return ['success' => true, 'message' => $message];

        } catch (\Exception $e) {
            $errMsg = "ServiceDataService::saveServiceBtkAndOperationalData Hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, $adminId, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return ['success' => false, 'message' => 'Hizmet bilgileri kaydedilirken kritik bir hata oluştu.'];
        }
    }

    /**
     * Teknik personele konum e-postası gönderir.
     *
     * @param int $serviceId
     * @param int $personnelBtkId mod_btk_personel.id (WHMCS Admin ID değil)
     * @param string $coordinates "Enlem,Boylam" formatında
     * @return array ['success' => bool, 'message' => string]
     */
    public static function sendLocationEmailToPersonnel($serviceId, $personnelBtkId, $coordinates)
    {
        $adminId = $_SESSION['adminid'] ?? 0;
        BtkHelper::logActivity("ServiceDataService: Konum e-postası gönderiliyor. ServiceID: {$serviceId}, PersonelBTKID: {$personnelBtkId}", $adminId, 'INFO');

        try {
            $service = Service::find($serviceId);
            $client = $service ? Client::find($service->userid) : null;
            if (!$service || !$client) {
                return ['success' => false, 'message' => 'Hizmet veya müşteri bilgileri bulunamadı.'];
            }

            $personel = PersonnelService::getBtkPersonnelById($personnelBtkId); // Bu metod admin_id değil, mod_btk_personel.id alır.
            if (!$personel || empty($personel->whmcs_email)) {
                return ['success' => false, 'message' => 'Personel bulunamadı veya personelin e-posta adresi kayıtlı değil.'];
            }

            $tesisAdresi = ($service->domain ? "Hizmet: {$service->domain}\n" : "Hizmet ID: {$serviceId}\n");
            $rehberData = SubscriberGuideService::getServiceBtkData($serviceId);
            if ($rehberData) {
                $adresParcalari = array_filter([
                    $rehberData->ABONE_ADRES_TESIS_MAHALLE,
                    $rehberData->ABONE_ADRES_TESIS_CADDE,
                    $rehberData->ABONE_ADRES_TESIS_DIS_KAPI_NO,
                    $rehberData->ABONE_ADRES_TESIS_IC_KAPI_NO,
                    $rehberData->ABONE_ADRES_TESIS_ILCE,
                    $rehberData->ABONE_ADRES_TESIS_IL
                ]);
                $tesisAdresi .= "Tesis Adresi: " . implode(', ', $adresParcalari) . "\n";
            }
            $tesisAdresi .= "Müşteri: {$client->firstname} {$client->lastname}\n";
            $tesisAdresi .= "Müşteri Telefon: {$client->phonenumber}\n";

            $googleMapsLink = "https://www.google.com/maps?q={$coordinates}&z=17&t=k"; // Uydu görünümü ve yakın zoom

            $emailSubject = "Yeni Görev Ataması: {$client->firstname} {$client->lastname} - Hizmet Konumu";
            $emailBody = "<p>Merhaba {$personel->whmcs_firstname},</p>";
            $emailBody .= "<p>Aşağıdaki hizmet için bir görev atanmıştır. Lütfen tesis konumunu kontrol ediniz:</p>";
            $emailBody .= "<p><strong>Müşteri Adı:</strong> {$client->firstname} {$client->lastname}<br>";
            $emailBody .= "<strong>İletişim Telefonu:</strong> {$client->phonenumber}</p>";
            $emailBody .= "<p><strong>Tesis Adresi:</strong><br>" . nl2br(trim($tesisAdresi)) . "</p>";
            $emailBody .= "<p><strong>Google Maps Konumu:</strong> <a href='{$googleMapsLink}' target='_blank'>{$googleMapsLink}</a></p>";
            $emailBody .= "<p>(Koordinatlar: {$coordinates})</p>";
            $emailBody .= "<p>İyi çalışmalar.</p>";

            // WHMCS localAPI ile e-posta gönderme
            $postData = [
                'messagename' => 'BTK Modülü Konum Bildirimi', // Genel bir e-posta şablonu adı (oluşturulması gerekebilir)
                                                          // Ya da custom olarak gönder
                'id' => $personel->admin_id, // tbladmins.id'ye göre gönderir
                'customtype' => 'general',
                'customsubject' => $emailSubject,
                'custommessage' => $emailBody,
                // merge fields (eğer e-posta şablonu kullanılırsa)
                // 'mergefields' => [
                //     'personnel_name' => $personel->whmcs_firstname,
                //     'client_name' => "{$client->firstname} {$client->lastname}",
                //     'client_phone' => $client->phonenumber,
                //     'tesis_adresi_plain' => trim($tesisAdresi),
                //     'google_maps_link' => $googleMapsLink,
                //     'coordinates' => $coordinates,
                // ],
            ];

            $results = localAPI('SendAdminEmail', $postData);

            if ($results['result'] == 'success') {
                BtkHelper::logActivity("Konum e-postası başarıyla gönderildi: Personel ID {$personel->admin_id} ({$personel->whmcs_email}), ServiceID {$serviceId}", $adminId, 'SUCCESS');
                return ['success' => true, 'message' => 'Konum bilgisi personele başarıyla e-posta ile gönderildi.'];
            } else {
                BtkHelper::logActivity("Konum e-postası gönderilemedi: " . ($results['message'] ?? 'Bilinmeyen localAPI hatası'), $adminId, 'ERROR', ['api_results' => $results]);
                return ['success' => false, 'message' => 'E-posta gönderilirken bir hata oluştu: ' . ($results['message'] ?? 'localAPI hatası')];
            }

        } catch (\Exception $e) {
            $errMsg = "ServiceDataService::sendLocationEmailToPersonnel Hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, $adminId, 'ERROR', ['exception' => (string)$e, 'service_id' => $serviceId]);
            return ['success' => false, 'message' => 'Konum e-postası gönderilirken kritik bir hata oluştu.'];
        }
    }

} // Sınıf sonu
?>