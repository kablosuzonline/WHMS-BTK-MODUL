<?php
/**
 * Modül Konfigürasyon Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Ayar kaydetme (`saveAllSettings`) metodu, artık BtkHelper yerine
 *   doğrudan LogManager'ı kullanarak tüm değişiklikleri akıllıca loglar.
 *   Bu, "Niyet ve Sonuç" loglama felsefesini tam olarak uygular.
 * - E-Fatura ve E-Sözleşme için eklenen tüm yeni ayar alanlarının
 *   yönetimi eklendi.
 * - `bootstrapInitialRecords` metodu, eşleştirme yapıldıktan sonra mevcut
 *   tüm WHMCS hizmetlerini BTK tablolarına ilk kez kaydetmek için
 *   optimize edildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;

class ConfigManager
{
    // ==================================================================
    // == AYAR KAYDETME (MERKEZİ LOGLAMA İLE)
    // ==================================================================

    /**
     * Yönetici panelindeki "Genel Ayarlar" formundan gelen tüm verileri işler ve kaydeder.
     * @param array $postData Formdan gelen POST verisi.
     */
    public static function saveAllSettings(array $postData): void
    {
        $currentSettings = BtkHelper::getAllBtkSettings();
        
        // Standart metin tabanlı ayarlar
        $settingsToSave = [
            'operator_code', 'operator_name', 'operator_title',
            'main_ftp_host', 'main_ftp_user', 'main_ftp_port', 'main_ftp_rehber_path', 'main_ftp_hareket_path', 'main_ftp_personel_path',
            'backup_ftp_host', 'backup_ftp_user', 'backup_ftp_port', 'backup_ftp_rehber_path', 'backup_ftp_hareket_path', 'backup_ftp_personel_path',
            'nviKpsUser', 'ekayit_kurum_kodu', 'ekayit_isletmeci_kodu',
            'ekayit_test_tckn', 'ekayit_test_ad', 'ekayit_test_soyad',
            'ekayit_test_vkn', 'ekayit_test_unvan', 'ekayit_test_mersis',
            'ekayit_test_islemYapanYetkiTur', 'ekayit_test_islemYapanDogumTarihi'
        ];

        foreach ($settingsToSave as $key) {
            if (isset($postData[$key])) {
                $oldValue = $currentSettings[$key] ?? '';
                $newValue = trim($postData[$key]);
                BtkHelper::set_btk_setting($key, $newValue);
                LogManager::logSettingChange($key, $oldValue, $newValue);
            }
        }

        // Checkbox (on/off) tabanlı ayarlar
        $checkboxSettings = [
            'main_ftp_ssl', 'main_ftp_pasv', 'backup_ftp_enabled', 'backup_ftp_ssl', 'backup_ftp_pasv',
            'send_empty_reports', 'delete_data_on_deactivate', 'debug_mode', 'pop_monitoring_enabled'
        ];

        foreach ($checkboxSettings as $key) {
            $oldValue = $currentSettings[$key] ?? '0';
            $newValue = isset($postData[$key]) && ($postData[$key] === '1' || $postData[$key] === 'on') ? '1' : '0';
            BtkHelper::set_btk_setting($key, $newValue);
            LogManager::logSettingChange($key, $oldValue, $newValue);
        }

        // Test/Canlı mod anahtarları
        $modeSettings = ['nvi_kps_mode', 'btk_ekayit_mode'];
        foreach ($modeSettings as $key) {
            $oldValue = $currentSettings[$key] ?? 'test';
            $newValue = isset($postData[$key]) && $postData[$key] === 'on' ? 'canli' : 'test';
            BtkHelper::set_btk_setting($key, $newValue);
            LogManager::logSettingChange($key, $oldValue, $newValue);
        }
        
        // Şifre alanları (loglaması özel yapılır)
        $passwordFields = ['main_ftp_pass', 'backup_ftp_pass', 'nviKpsPass'];
        foreach ($passwordFields as $key) {
            if (isset($postData[$key])) {
                BtkHelper::set_btk_setting($key, $postData[$key]);
                // Güvenlik için loglamada yeni şifreyi gösterme
                if ($postData[$key] !== '********') {
                    LogManager::logSettingChange($key, '********', '********');
                }
            }
        }
    }
    
    // ==================================================================
    // == YETKİ VE EŞLEŞTİRME YÖNETİMİ
    // ==================================================================

    public static function saveSeciliYetkiTurleri(array $postData = []): void
    {
        try {
            $secilenYetkiler = $postData['yetkiler'] ?? [];
            $tumYetkiKodlari = Capsule::table('mod_btk_yetki_turleri_referans')->pluck('yetki_kodu')->all();
            foreach ($tumYetkiKodlari as $kod) {
                $durum = (isset($secilenYetkiler[$kod]) && ($secilenYetkiler[$kod] === '1' || $secilenYetkiler[$kod] === 'on')) ? 1 : 0;
                Capsule::table('mod_btk_secili_yetki_turleri')->updateOrInsert(['yetki_kodu' => $kod], ['aktif' => $durum]);
            }
            LogManager::logAction('Yetki Türleri Güncellendi', 'INFO', 'Aktif BTK yetki türleri güncellendi.');
        } catch (\Exception $e) {
            LogManager::logAction('Seçili Yetki Türü Kaydetme Hatası', 'HATA', $e->getMessage());
        }
    }

    public static function getAllYetkiTurleriWithStatus(): array
    {
        return Capsule::table('mod_btk_yetki_turleri_referans as ytr')
            ->leftJoin('mod_btk_secili_yetki_turleri as syt', 'ytr.yetki_kodu', '=', 'syt.yetki_kodu')
            ->select('ytr.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup', Capsule::raw('IFNULL(syt.aktif, 0) as aktif'))
            ->orderBy('ytr.yetki_adi')->get()->map(fn($item) => (array)$item)->all();
    }

    public static function getAktifYetkiTurleri(string $returnAs = 'object_list'): array
    {
        $query = Capsule::table('mod_btk_secili_yetki_turleri as syt')
                ->join('mod_btk_yetki_turleri_referans as ytr', 'syt.yetki_kodu', '=', 'ytr.yetki_kodu')
                ->where('syt.aktif', 1)->orderBy('ytr.grup')->orderBy('ytr.yetki_adi');
        
        if ($returnAs === 'array_grup_names_only') {
            return $query->distinct()->pluck('ytr.grup')->all();
        }
        return $query->select('syt.yetki_kodu', 'ytr.yetki_adi', 'ytr.grup')->get()->map(fn($item) => (array)$item)->all();
    }
    
    public static function getWhmcsProductGroups(): array
    {
        return Capsule::table('tblproductgroups')->orderBy('order')->orderBy('name')->get(['id', 'name', 'headline'])->map(fn($item) => (array)$item)->all();
    }

    public static function getProductGroupMappingsArray(): array
    {
        return Capsule::table('mod_btk_product_group_mappings')->get()->keyBy('gid')->map(fn($item) => (array)$item)->all();
    }

    public static function getBtkYetkiForProductGroup(int $gid): ?array
    {
        $mapping = Capsule::table('mod_btk_product_group_mappings as pgm')
            ->join('mod_btk_yetki_turleri_referans as ytr', 'pgm.ana_btk_yetki_kodu', '=', 'ytr.yetki_kodu')
            ->where('pgm.gid', $gid)->select('pgm.*', 'ytr.grup')->first();
        return $mapping ? (array)$mapping : null;
    }

    public static function saveProductGroupMappings(array $mappingsData = []): bool
    {
        try {
            $currentMappings = self::getProductGroupMappingsArray();
            Capsule::transaction(function () use ($mappingsData) {
                Capsule::table('mod_btk_product_group_mappings')->truncate();
                $insertData = [];
                foreach ($mappingsData as $gid => $data) {
                    if (!empty($gid) && is_numeric($gid) && !empty(trim($data['ana_btk_yetki_kodu'])) && !empty(trim($data['ek3_hizmet_tipi_kodu']))) {
                        $insertData[] = ['gid' => (int)$gid, 'ana_btk_yetki_kodu' => trim($data['ana_btk_yetki_kodu']), 'ek3_hizmet_tipi_kodu' => trim($data['ek3_hizmet_tipi_kodu'])];
                    }
                }
                if (!empty($insertData)) {
                    Capsule::table('mod_btk_product_group_mappings')->insert($insertData);
                }
            });
            LogManager::logAction('Ürün Grubu Eşleştirmeleri Güncellendi', 'INFO', 'Eşleştirmeler başarıyla kaydedildi.', null, ['once' => $currentMappings, 'sonra' => $mappingsData]);
            return true;
        } catch (\Exception $e) {
            LogManager::logAction('Ürün Grubu Eşleştirme Hatası', 'HATA', $e->getMessage());
            return false;
        }
    }

    public static function bootstrapInitialRecords(): int
    {
        LogManager::logAction('İlk Kayıt Oluşturma Başlatıldı', 'UYARI', 'Mevcut WHMCS hizmetleri BTK tablolarına aktarılıyor.');
        try {
            $eşleştirilmişGidListesi = self::getProductGroupMappingsArray();
            if (empty($eşleştirilmişGidListesi)) {
                LogManager::logAction('İlk Kayıt Oluşturma Atlandı', 'UYARI', 'BTK ile eşleştirilmiş ürün grubu bulunamadı.');
                return 0;
            }
            $mevcutBtkHizmetIdleri = Capsule::table('mod_btk_abone_rehber')->pluck('whmcs_service_id')->all();
            $hizmetler = Capsule::table('tblhosting as h')->join('tblproducts as p', 'h.packageid', '=', 'p.id')->join('tblclients as c', 'h.userid', '=', 'c.id')->whereIn('p.gid', array_keys($eşleştirilmişGidListesi))->whereNotIn('h.id', $mevcutBtkHizmetIdleri)->select('h.id as service_id', 'h.regdate')->cursor();
            $yeniKayitSayisi = 0;
            foreach ($hizmetler as $hizmet) {
                $initialData = ['abone_baslangic' => (new \DateTime($hizmet->regdate))->format('YmdHis')];
                AboneManager::createOrUpdateRehberKayit($hizmet->service_id, $initialData, ['kod' => '2', 'aciklama' => 'YENI_ABONELIK_KAYDI', 'zaman' => (new \DateTime($hizmet->regdate))->format('YmdHis')]);
                $yeniKayitSayisi++;
            }
            LogManager::logAction('İlk Kayıt Oluşturma Tamamlandı', 'INFO', "{$yeniKayitSayisi} adet yeni hizmet BTK sistemine başarıyla kaydedildi.");
            return $yeniKayitSayisi;
        } catch (\Exception $e) {
            LogManager::logAction('İlk Kayıt Oluşturma Hatası', 'KRITIK', $e->getMessage());
            return -1;
        }
    }
}