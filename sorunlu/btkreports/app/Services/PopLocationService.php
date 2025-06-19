<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\LogService;
use WHMCS\Database\Capsule;
use WHMCS\Carbon;

/**
 * Class PopLocationService
 *
 * mod_btk_iss_pop_noktalari tablosu ile ilgili işlemleri yönetir.
 */
class PopLocationService
{
    /**
     * Tüm ISS POP noktalarını, il ve ilçe adlarıyla birlikte listeler.
     *
     * @param array $filters Filtreleme seçenekleri
     * @return \Illuminate\Support\Collection
     */
    public static function getAllPopLocations(array $filters = [])
    {
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari as mpn')
                ->leftJoin('mod_btk_adres_il as mai', 'mpn.il_id', '=', 'mai.id')
                ->leftJoin('mod_btk_adres_ilce as mailce', 'mpn.ilce_id', '=', 'mailce.id')
                ->leftJoin('mod_btk_adres_mahalle as mam', 'mpn.mahalle_id', '=', 'mam.id')
                ->select(
                    'mpn.*',
                    'mai.il_adi',
                    'mailce.ilce_adi',
                    'mam.mahalle_adi'
                );

            if (isset($filters['aktif_mi'])) {
                $query->where('mpn.aktif_mi', (int)$filters['aktif_mi']);
            }
            if (!empty($filters['search_pop_adi'])) {
                $query->where('mpn.pop_adi', 'LIKE', '%' . $filters['search_pop_adi'] . '%');
            }
            if (!empty($filters['search_ssid'])) {
                $query->where('mpn.yayin_yapilan_ssid', 'LIKE', '%' . $filters['search_ssid'] . '%');
            }


            $pops = $query->orderBy('mpn.pop_adi', 'asc')->get();
            LogService::add($pops->count() . ' adet ISS POP noktası listelendi.', 'DEBUG', 'POP_GET_ALL', $filters);
            return $pops;

        } catch (\Exception $e) {
            LogService::add("PopLocationService::getAllPopLocations Hata: " . $e->getMessage(), 'ERROR', 'POP_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

    /**
     * Belirli bir ID'ye sahip POP noktasını getirir.
     *
     * @param int $popId
     * @return object|null
     */
    public static function getPopLocationById($popId)
    {
        if (empty($popId)) return null;
        try {
            $pop = Capsule::table('mod_btk_iss_pop_noktalari')->find($popId);
            if ($pop) {
                LogService::add("POP noktası detayı getirildi. ID: {$popId}", 'DEBUG', 'POP_GET_BY_ID', ['id' => $popId]);
            }
            return $pop;
        } catch (\Exception $e) {
            LogService::add("PopLocationService::getPopLocationById Hata: " . $e->getMessage(), 'ERROR', 'POP_ERROR', ['exception' => (string)$e, 'id' => $popId]);
            return null;
        }
    }

    /**
     * Yeni bir POP noktası ekler veya mevcut birini günceller.
     *
     * @param array $data Formdan gelen veri dizisi
     * @return array ['success' => bool, 'message' => string, 'id' => int|null]
     */
    public static function savePopLocation(array $data)
    {
        $popId = isset($data['pop_id']) ? (int)$data['pop_id'] : 0;
        $adminId = $_SESSION['adminid'] ?? 0;
        $logAction = ($popId > 0) ? "güncelleniyor" : "ekleniyor";
        LogService::add("POP Noktası kaydı {$logAction}. POP ID: {$popId}", 'INFO', 'POP_SAVE_START', ['id' => $popId, 'data_count' => count($data)], $adminId);

        try {
            $popAdi = trim($data['pop_adi'] ?? '');
            if (empty($popAdi)) {
                return ['success' => false, 'message' => 'POP Adı boş bırakılamaz.', 'id' => $popId];
            }

            $yayinYapilanSsid = !empty($data['yayin_yapilan_ssid']) ? trim($data['yayin_yapilan_ssid']) : null;
            if ($yayinYapilanSsid) {
                $existingSsidQuery = Capsule::table('mod_btk_iss_pop_noktalari')
                                        ->where('yayin_yapilan_ssid', $yayinYapilanSsid);
                if ($popId > 0) {
                    $existingSsidQuery->where('id', '<>', $popId);
                }
                if ($existingSsidQuery->exists()) {
                    return ['success' => false, 'message' => 'Bu Yayın Yapılan SSID zaten başka bir POP noktasında kullanılıyor.', 'id' => $popId];
                }
            }

            $saveData = [
                'pop_adi' => $popAdi,
                'il_id' => !empty($data['il_id']) ? (int)$data['il_id'] : null,
                'ilce_id' => !empty($data['ilce_id']) ? (int)$data['ilce_id'] : null,
                'mahalle_id' => !empty($data['mahalle_id']) ? (int)$data['mahalle_id'] : null,
                'adres_detay' => $data['adres_detay'] ?? null,
                'koordinatlar' => $data['koordinatlar'] ?? null,
                'yayin_yapilan_ssid' => $yayinYapilanSsid,
                'sunucu_bilgisi' => $data['sunucu_bilgisi'] ?? null,
                'aktif_mi' => isset($data['aktif_mi']) ? 1 : 0,
                'updated_at' => Carbon::now()
            ];

            if ($popId > 0) { // Güncelleme
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update($saveData);
                $savedId = $popId;
                $message = 'POP Noktası bilgileri başarıyla güncellendi.';
            } else { // Yeni ekleme
                $saveData['created_at'] = Carbon::now();
                $savedId = Capsule::table('mod_btk_iss_pop_noktalari')->insertGetId($saveData);
                $message = 'Yeni POP Noktası başarıyla eklendi.';
            }

            LogService::add($message . " ID: {$savedId}", 'SUCCESS', 'POP_SAVE_SUCCESS', ['id' => $savedId], $adminId);
            return ['success' => true, 'message' => $message, 'id' => $savedId];

        } catch (\Exception $e) {
            $errMsg = "POP Noktası kaydedilirken bir hata oluştu: " . $e->getMessage();
            LogService::add("PopLocationService::savePopLocation Hata: " . $errMsg, 'ERROR', 'POP_SAVE_ERROR', ['exception' => (string)$e, 'data' => $data], $adminId);
            return ['success' => false, 'message' => $errMsg, 'id' => null];
        }
    }

    /**
     * Belirli bir POP noktasını siler.
     *
     * @param int $popId Silinecek POP noktasının ID'si
     * @return array ['success' => bool, 'message' => string]
     */
    public static function deletePopLocation($popId)
    {
        $adminId = $_SESSION['adminid'] ?? 0;
        if (empty($popId)) {
            return ['success' => false, 'message' => 'Silinecek POP Noktası ID\'si belirtilmedi.'];
        }
        LogService::add("POP Noktası silme isteği. POP ID: {$popId}", 'INFO', 'POP_DELETE_START', ['id' => $popId], $adminId);

        try {
            // İleride bu POP noktasına bağlı hizmet olup olmadığı kontrol edilebilir.
            // Eğer bağlı hizmet varsa silme işlemi engellenebilir veya uyarı verilebilir.
            $deleted = Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->delete();

            if ($deleted) {
                $message = "POP Noktası (ID: {$popId}) başarıyla silindi.";
                LogService::add($message, 'SUCCESS', 'POP_DELETE_SUCCESS', ['id' => $popId], $adminId);
                return ['success' => true, 'message' => $message];
            } else {
                $message = "POP Noktası (ID: {$popId}) silinemedi veya bulunamadı.";
                LogService::add($message, 'WARNING', 'POP_DELETE_NOT_FOUND', ['id' => $popId], $adminId);
                return ['success' => false, 'message' => $message];
            }
        } catch (\Exception $e) {
            $errMsg = "POP Noktası (ID: {$popId}) silinirken bir hata oluştu: " . $e->getMessage();
            LogService::add("PopLocationService::deletePopLocation Hata: " . $errMsg, 'ERROR', 'POP_DELETE_ERROR', ['exception' => (string)$e, 'id' => $popId], $adminId);
            return ['success' => false, 'message' => $errMsg];
        }
    }

    /**
     * Hizmet detayları sayfasında POP noktası seçimi için aktif POP'ları listeler.
     * Opsiyonel olarak ilçe bazında ve/veya arama terimine göre (SSID veya POP Adı) filtreleyebilir.
     *
     * @param int|null $filterIlceId Filtrelenecek ilçe ID'si
     * @param string|null $searchTerm Arama terimi
     * @return \Illuminate\Support\Collection
     */
    public static function getActivePopLocationsForSelect($filterIlceId = null, $searchTerm = null)
    {
        try {
            $query = Capsule::table('mod_btk_iss_pop_noktalari as mpn')
                ->leftJoin('mod_btk_adres_ilce as mailce', 'mpn.ilce_id', '=', 'mailce.id')
                ->where('mpn.aktif_mi', 1)
                ->select('mpn.id', 'mpn.pop_adi', 'mpn.yayin_yapilan_ssid', 'mpn.sunucu_bilgisi', 'mailce.ilce_adi')
                ->orderBy('mpn.pop_adi', 'asc');

            if ($filterIlceId) {
                $query->where('mpn.ilce_id', (int)$filterIlceId);
            }
            if (!empty($searchTerm)) {
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('mpn.pop_adi', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('mpn.yayin_yapilan_ssid', 'LIKE', '%' . $searchTerm . '%');
                });
            }

            return $query->get();
        } catch (\Exception $e) {
            LogService::add("PopLocationService::getActivePopLocationsForSelect Hata: " . $e->getMessage(), 'ERROR', 'POP_SELECT_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

} // Sınıf sonu
?>