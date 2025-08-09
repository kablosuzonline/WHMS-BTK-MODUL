<?php
/**
 * BTK Personel Yönetimi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - CEVHER raporlaması için gerekli olan tüm yeni personel bilgi alanları
 *   (cinsiyet, öğrenim durumu, statü, engelli/yabancı durumu) hem veri
 *   modeline hem de kaydetme/listeleme fonksiyonlarına eklendi.
 * - Tarih formatlama (`d/m/Y` <-> `Y-m-d`) işlemleri, kullanıcı dostu
 *   bir arayüz sağlamak için standardize edildi.
 * - `syncAllAdminsToPersonel` fonksiyonu, artık WHMCS'den silinmiş veya
 *   pasif edilmiş yöneticileri de tespit edip BTK personel tablosunda
 *   "işten ayrıldı" olarak işaretliyor.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;

class PersonelManager
{
    // ==================================================================
    // == LİSTELEME VE VERİ ÇEKME
    // ==================================================================

    /**
     * Personel listesini filtrelenmiş ve sayfalanmış olarak döndürür.
     * @param array $request
     * @return array
     */
    public static function getPersonelListWithPagination(array $request): array
    {
        $filters = [
            's_name'         => $request['s_name'] ?? '',
            's_email'        => $request['s_email'] ?? '',
        ];
        
        $query = Capsule::table('mod_btk_personel as p')
            ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id');
        
        if (!empty($filters['s_name'])) {
            $term = '%' . $filters['s_name'] . '%';
            $query->where(function($q) use ($term) {
                $q->where('p.ad', 'LIKE', $term)->orWhere('p.soyad', 'LIKE', $term);
            });
        }
        if (!empty($filters['s_email'])) {
            $query->where('p.eposta', 'LIKE', '%' . $filters['s_email'] . '%');
        }
        
        $total = $query->count();
        $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20);
        $page = (int)($request['page'] ?? 1);
        $offset = ($page - 1) * $limit;
        
        $data = $query->select('p.*', 'd.departman_adi')
            ->orderBy('p.soyad', 'asc')
            ->orderBy('p.ad', 'asc')
            ->skip($offset)->take($limit)
            ->get()->map(fn($item) => (array)$item)->all();

        return [
            'data'       => $data,
            'pagination' => RaporManager::buildPagination($filters, $total, $limit, $page, 'personel')
        ];
    }

    /**
     * Personel raporu için gönderilecek veriyi çeker.
     * @return array
     */
    public static function getReportablePersonel(): array
    {
        return Capsule::table('mod_btk_personel as p')
            ->leftJoin('mod_btk_personel_departmanlari as d', 'p.departman_id', '=', 'd.id')
            ->where('p.btk_listesinde_goster', 1)
            ->whereNull('p.isten_ayrilma_tarihi')
            ->select(
                'p.firma_unvani', 'p.ad', 'p.soyad', 'p.tckn', 'p.dogum_tarihi', 'p.unvan',
                'd.departman_adi', 'p.mobil_tel', 'p.sabit_tel', 'p.eposta', 'p.acik_adres',
                'p.acil_durum_kisi_adi', 'p.acil_durum_kisi_gsm', 'p.ise_baslama_tarihi',
                'p.isten_ayrilma_tarihi', 'p.is_birakma_nedeni'
            )
            ->orderBy('p.soyad')->orderBy('p.ad')
            ->get()->map(fn($item) => (array)$item)->all();
    }
    
    /**
     * Belirtilen ID'ye sahip personelin tüm bilgilerini, tarihleri formatlayarak döndürür.
     * @param int $id
     * @return array|null
     */
    public static function getPersonelByIdForModal(int $id): ?array
    {
        if ($id <= 0) return null;
        $personel = (array)Capsule::table('mod_btk_personel')->find($id);
        if ($personel) {
            $formatDateForPicker = function($dateString) { if (empty($dateString) || $dateString === '0000-00-00') return ''; try { return (new \DateTime($dateString))->format('d/m/Y'); } catch (\Exception $e) { return ''; } };
            $personel['dogum_tarihi'] = $formatDateForPicker($personel['dogum_tarihi']);
            $personel['ise_baslama_tarihi'] = $formatDateForPicker($personel['ise_baslama_tarihi']);
            $personel['isten_ayrilma_tarihi'] = $formatDateForPicker($personel['isten_ayrilma_tarihi']);
        }
        return $personel;
    }
    
    /**
     * Tüm departmanları listeler.
     * @return array
     */
    public static function getDepartmanList(): array
    {
        return Capsule::table('mod_btk_personel_departmanlari')
            ->orderBy('departman_adi')->get()->map(fn($item) => (array)$item)->all();
    }

    // ==================================================================
    // == VERİ KAYDETME VE SİLME (MERKEZİ LOGLAMA İLE)
    // ==================================================================
    
    /**
     * Yeni bir personel kaydı oluşturur veya mevcut birini günceller.
     * @param array $data
     * @param array $LANG
     * @return array
     */
    public static function savePersonel(array $data, array $LANG): array
    {
        $personelId = (int)($data['id'] ?? 0);
        
        if (empty($data['ad']) || empty($data['soyad']) || empty($data['tckn'])) {
            return ['type' => 'error', 'message' => 'Ad, Soyad ve TCKN alanları zorunludur.'];
        }

        $formatDateForSql = function($dateString) { if (empty(trim($dateString))) { return null; } try { $dateObj = \DateTime::createFromFormat('d/m/Y', $dateString); return ($dateObj && $dateObj->format('d/m/Y') === $dateString) ? $dateObj->format('Y-m-d') : null; } catch (\Exception $e) { return null; } };

        $iseBaslama = $formatDateForSql($data['ise_baslama_tarihi'] ?? null);
        $istenAyrilma = $formatDateForSql($data['isten_ayrilma_tarihi'] ?? null);
        $dogumTarihi = $formatDateForSql($data['dogum_tarihi'] ?? null);

        if ($iseBaslama && $istenAyrilma && $istenAyrilma < $iseBaslama) {
            return ['type' => 'error', 'message' => $LANG['personelDateValidationError']];
        }
        
        LogManager::logAction('Personel Kaydetme Denemesi', 'UYARI', "Personel ID: {$personelId} için kayıt/güncelleme işlemi başlatıldı.", null, ['data' => $data]);

        try {
            $dbData = [
                'ad' => $data['ad'], 'soyad' => $data['soyad'], 'tckn' => $data['tckn'],
                'dogum_tarihi' => $dogumTarihi, 'unvan' => $data['unvan'] ?? null,
                'eposta' => $data['eposta'], 'mobil_tel' => $data['mobil_tel'] ?? null, 'sabit_tel' => $data['sabit_tel'] ?? null,
                'departman_id' => !empty($data['departman_id']) ? (int)$data['departman_id'] : null,
                'acik_adres' => $data['acik_adres'] ?? null, 'acil_durum_kisi_adi' => $data['acil_durum_kisi_adi'] ?? null,
                'acil_durum_kisi_gsm' => $data['acil_durum_kisi_gsm'] ?? null, 'ise_baslama_tarihi' => $iseBaslama,
                'isten_ayrilma_tarihi' => $istenAyrilma,
                'btk_listesinde_goster' => (isset($data['btk_listesinde_goster']) && $data['btk_listesinde_goster'] == 1) ? 1 : 0,
                'cinsiyet' => $data['cinsiyet'] ?? null, 'ogrenim_durumu' => $data['ogrenim_durumu'] ?? null,
                'personel_statusu' => $data['personel_statusu'] ?? null,
                'engelli_mi' => (isset($data['engelli_mi']) && $data['engelli_mi'] == 1) ? 1 : 0,
                'yabanci_uyruklu_mu' => (isset($data['yabanci_uyruklu_mu']) && $data['yabanci_uyruklu_mu'] == 1) ? 1 : 0
            ];

            if ($personelId > 0) {
                $oldData = (array)Capsule::table('mod_btk_personel')->find($personelId);
                Capsule::table('mod_btk_personel')->where('id', $personelId)->update($dbData);
                LogManager::logAction('Personel Güncellendi', 'INFO', "Personel ID: {$personelId} güncellendi.", null, ['once' => $oldData, 'sonra' => $dbData]);
                return ['type' => 'success', 'message' => 'Personel bilgileri güncellendi.'];
            } else {
                $newId = Capsule::table('mod_btk_personel')->insertGetId($dbData);
                LogManager::logAction('Yeni Personel Eklendi', 'INFO', "Personel ID: {$newId} eklendi.", null, ['veri' => $dbData]);
                return ['type' => 'success', 'message' => 'Yeni personel eklendi.'];
            }
        } catch (\Exception $e) {
            LogManager::logAction('Personel Kaydetme BAŞARISIZ', 'HATA', $e->getMessage(), null, ['data' => $data]);
            return ['type' => 'error', 'message' => 'Veritabanı hatası: ' . substr($e->getMessage(), 0, 100)];
        }
    }

    public static function deletePersonel(int $personelId, array $LANG): array
    {
        if ($personelId <= 0) {
            return ['type' => 'error', 'message' => 'Geçersiz Personel ID.'];
        }
        $personelData = (array)Capsule::table('mod_btk_personel')->find($personelId);
        LogManager::logAction('Personel Silme Denemesi', 'UYARI', "Personel ID: {$personelId} silinmek üzere.", null, ['silinecek_veri' => $personelData]);
        try {
            Capsule::table('mod_btk_personel')->where('id', $personelId)->delete();
            LogManager::logAction('Personel Silindi', 'INFO', "Personel ID: {$personelId} kalıcı olarak silindi.");
            return ['type' => 'success', 'message' => 'Personel başarıyla silindi.'];
        } catch (\Exception $e) {
            LogManager::logAction('Personel Silme BAŞARISIZ', 'HATA', $e->getMessage(), null, ['personel_id' => $personelId]);
            return ['type' => 'error', 'message' => 'Silme işlemi sırasında veritabanı hatası oluştu.'];
        }
    }

    // ==================================================================
    // == WHMCS SENKRONİZASYONU
    // ==================================================================
    
    public static function syncAllAdminsToPersonel(): void
    {
        try {
            $whmcsAdmins = Capsule::table('tbladmins')->where('disabled', 0)->get()->keyBy('id');
            $btkPersonelAdmins = Capsule::table('mod_btk_personel')->whereNotNull('whmcs_admin_id')->get()->keyBy('whmcs_admin_id');

            // WHMCS'te var olanları BTK'ya ekle/güncelle
            foreach ($whmcsAdmins as $adminId => $admin) {
                self::syncSingleAdminToPersonel($adminId, (array)$admin);
            }

            // BTK'da var olup WHMCS'te silinmiş/pasif edilmiş olanları "işten ayrıldı" olarak işaretle
            $deletedAdminIds = $btkPersonelAdmins->keys()->diff($whmcsAdmins->keys());
            if ($deletedAdminIds->isNotEmpty()) {
                foreach ($deletedAdminIds as $adminId) {
                    self::handleAdminDelete($adminId);
                }
            }
            LogManager::logAction('Tüm Yöneticiler Senkronize Edildi', 'INFO', 'WHMCS yöneticileri ile BTK personel tablosu senkronize edildi.');
        } catch (\Exception $e) {
            LogManager::logAction('Toplu Personel Senkronizasyon Hatası', 'HATA', $e->getMessage());
        }
    }

    public static function syncSingleAdminToPersonel(int $adminId, array $adminVars): void
    {
        try {
            $operatorTitle = BtkHelper::get_btk_setting('operator_title', BtkHelper::get_btk_setting('operator_name'));
            Capsule::table('mod_btk_personel')->updateOrInsert(
                ['whmcs_admin_id' => $adminId],
                ['ad' => $adminVars['firstname'] ?? '', 'soyad' => $adminVars['lastname'] ?? '', 'eposta' => $adminVars['email'] ?? '', 'firma_unvani' => $operatorTitle, 'isten_ayrilma_tarihi' => null, 'is_birakma_nedeni' => null, 'btk_listesinde_goster' => 1]
            );
        } catch (\Exception $e) {
            LogManager::logAction('Personel Senkronizasyon Hatası', 'HATA', "Admin ID: {$adminId} senkronize edilemedi: " . $e->getMessage());
        }
    }

    public static function handleAdminDelete(int $adminId): void
    {
        try {
            $affected = Capsule::table('mod_btk_personel')
                ->where('whmcs_admin_id', $adminId)
                ->whereNull('isten_ayrilma_tarihi')
                ->update(['isten_ayrilma_tarihi' => date('Y-m-d'), 'is_birakma_nedeni' => 'WHMCS Admin hesabı silindi veya pasif edildi.', 'btk_listesinde_goster' => 0]);
            
            if ($affected) {
                LogManager::logAction('Personel İşten Ayrıldı (Oto)', 'UYARI', "Admin ID: $adminId silindi, personel kaydı pasife çekildi.");
            }
        } catch (\Exception $e) {
            LogManager::logAction('Admin Silme Hook Hatası', 'HATA', $e->getMessage(), null, ['admin_id' => $adminId]);
        }
    }
}