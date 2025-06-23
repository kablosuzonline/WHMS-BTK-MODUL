<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

// Gerekli sınıflar
use WHMCS\Module\Addon\BtkRaporlari\Services\LogService; // Kendi Log Servisimiz
use WHMCS\Database\Capsule;
use WHMCS\Carbon;

/**
 * Class ProductMappingService
 *
 * mod_btk_product_group_mappings tablosu ile ilgili işlemleri yönetir.
 * WHMCS ürün gruplarını BTK Yetki Türleri ile eşleştirir.
 */
class ProductMappingService
{
    /**
     * Tüm WHMCS ürün gruplarını ve mevcut BTK yetki türü eşleştirmelerini getirir.
     * Admin panelindeki ürün grubu eşleştirme sayfası için kullanılır.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getProductGroupsWithMappings()
    {
        try {
            $whmcsProductGroups = Capsule::table('tblproductgroups')
                                    ->where('hidden', 0)
                                    ->orderBy('order', 'asc')
                                    ->orderBy('name', 'asc')
                                    ->get(['id as gid', 'name as group_name']);

            if ($whmcsProductGroups->isEmpty()) {
                LogService::add('Hiç WHMCS ürün grubu bulunamadı.', 'DEBUG', 'PRODUCT_MAPPING_GET');
                return collect();
            }

            $mappings = Capsule::table('mod_btk_product_group_mappings')
                            ->pluck('btk_yetki_turu_id', 'whmcs_product_group_id')
                            ->all();

            $result = $whmcsProductGroups->map(function ($group) use ($mappings) {
                $group->btk_yetki_turu_id = $mappings[$group->gid] ?? 0;
                return $group;
            });

            LogService::add($result->count() . ' adet ürün grubu eşleştirme bilgisiyle birlikte listelendi.', 'DEBUG', 'PRODUCT_MAPPING_GET');
            return $result;

        } catch (\Exception $e) {
            LogService::add("ProductMappingService::getProductGroupsWithMappings Hata: " . $e->getMessage(), 'ERROR', 'PRODUCT_MAPPING_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

    /**
     * Aktif (modül ayarlarında seçili) olan BTK Yetki Türlerini listeler.
     * Eşleştirme sayfasındaki dropdown için kullanılır.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getActiveBtkAuthorizationTypes()
    {
        try {
            $types = Capsule::table('mod_btk_yetki_turleri')
                        ->where('secili_mi', 1)
                        ->orderBy('yetki_aciklama', 'asc')
                        ->get(['id', 'yetki_kodu', 'yetki_aciklama']);
            LogService::add($types->count() . ' adet aktif BTK yetki türü listelendi.', 'DEBUG', 'AUTH_TYPE_GET_ACTIVE');
            return $types;
        } catch (\Exception $e) {
            LogService::add("ProductMappingService::getActiveBtkAuthorizationTypes Hata: " . $e->getMessage(), 'ERROR', 'AUTH_TYPE_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

    /**
     * Ürün grubu - BTK yetki türü eşleştirmelerini kaydeder.
     *
     * @param array $mappings Formdan gelen eşleştirme verileri [whmcs_gid => btk_yetki_id] formatında.
     * @return array ['success' => bool, 'message' => string]
     */
    public static function saveProductGroupMappings(array $mappings)
    {
        $adminId = $_SESSION['adminid'] ?? 0;
        LogService::add("Ürün grubu eşleştirmeleri kaydediliyor. Gelen eşleştirme sayısı: " . count($mappings), 'INFO', 'PRODUCT_MAPPING_SAVE_START', ['mapping_count' => count($mappings)], $adminId);

        $updatedOrInsertedCount = 0;
        $deletedCount = 0;

        Capsule::beginTransaction();
        try {
            // Tüm WHMCS ürün gruplarını al (eşleştirme olmayanlar için de işlem yapabilmek adına)
            $allWhmcsProductGroups = Capsule::table('tblproductgroups')->pluck('id')->all();

            foreach ($allWhmcsProductGroups as $whmcsGroupId) {
                $btkYetkiTuruId = isset($mappings[$whmcsGroupId]) ? (int)$mappings[$whmcsGroupId] : 0;

                if ($btkYetkiTuruId > 0) { // Geçerli bir yetki türü seçilmişse
                    $result = Capsule::table('mod_btk_product_group_mappings')->updateOrInsert(
                        ['whmcs_product_group_id' => $whmcsGroupId],
                        [
                            'btk_yetki_turu_id' => $btkYetkiTuruId,
                            'updated_at' => Carbon::now(),
                            // created_at'i sadece insert durumunda set etmek için:
                            // 'created_at' => Capsule::raw('IF(id IS NULL, NOW(), created_at)') // Bu MySQL'e özgü olabilir
                        ]
                    );
                    // updateOrInsert direkt etkilenen satır sayısını vermez, insertId de yok.
                    // Basitçe işlem yapıldı kabul edelim. Daha iyi bir kontrol için ayrı select+insert/update gerekebilir.
                    $updatedOrInsertedCount++; // Bu tam doğru sayıyı vermeyebilir ama bir gösterge.
                } else { // Yetki türü "atanmamış" (0) olarak seçilmişse veya formda gelmemişse, mevcut eşleştirmeyi sil
                    $deleted = Capsule::table('mod_btk_product_group_mappings')
                        ->where('whmcs_product_group_id', $whmcsGroupId)
                        ->delete();
                    if ($deleted) {
                        $deletedCount++;
                    }
                }
            }

            Capsule::commit();
            $message = "Ürün grubu eşleştirmeleri başarıyla kaydedildi. ({$updatedOrInsertedCount} eşleştirme yapıldı/güncellendi, {$deletedCount} eşleştirme kaldırıldı).";
            LogService::add($message, 'SUCCESS', 'PRODUCT_MAPPING_SAVE_SUCCESS', ['updated_inserted' => $updatedOrInsertedCount, 'deleted' => $deletedCount], $adminId);
            return ['success' => true, 'message' => $message];

        } catch (\Exception $e) {
            Capsule::rollBack();
            $errMsg = "Ürün grubu eşleştirmeleri kaydedilirken bir veritabanı hatası oluştu: " . $e->getMessage();
            LogService::add($errMsg, 'ERROR', 'PRODUCT_MAPPING_SAVE_ERROR', ['exception' => (string)$e], $adminId);
            return ['success' => false, 'message' => $errMsg];
        }
    }

} // Sınıf sonu
?>