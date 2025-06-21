<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\LogService;
use WHMCS\Module\Addon\BtkRaporlari\Services\NviVerificationService; // TCKN Doğrulaması için
use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use WHMCS\User\Admin;

/**
 * Class PersonnelService
 *
 * mod_btk_personel tablosu ile ilgili işlemleri ve personel verisi yönetimini sağlar.
 */
class PersonnelService
{
    /**
     * Tüm BTK personel listesini, WHMCS admin detayları ve departman adıyla birlikte getirir.
     *
     * @param array $filters Filtreleme seçenekleri
     * @return \Illuminate\Support\Collection
     */
    public static function getAllBtkPersonnel(array $filters = [])
    {
        try {
            $query = Capsule::table('mod_btk_personel as mbp')
                ->leftJoin('tbladmins as ta', 'mbp.admin_id', '=', 'ta.id')
                ->leftJoin('mod_btk_personel_departmanlari as mbpd', 'mbp.departman_id', '=', 'mbpd.id')
                ->leftJoin('mod_btk_adres_il as mail', 'mbp.gorev_bolgesi_il_id', '=', 'mail.id')
                ->leftJoin('mod_btk_adres_ilce as mailce', 'mbp.gorev_bolgesi_ilce_id', '=', 'mailce.id')
                ->select(
                    'mbp.*',
                    'ta.firstname as whmcs_firstname',
                    'ta.lastname as whmcs_lastname',
                    'ta.email as whmcs_email',
                    'ta.disabled as whmcs_disabled',
                    'mbpd.departman_adi',
                    'mail.il_adi as gorev_bolgesi_il_adi',
                    'mailce.ilce_adi as gorev_bolgesi_ilce_adi'
                );

            // Örnek filtreleme (ileride eklenebilir)
            // if (!empty($filters['search_term'])) { ... }

            $personnel = $query->orderBy('ta.lastname', 'asc')->orderBy('ta.firstname', 'asc')->get();
            LogService::add($personnel->count() . ' adet BTK personeli listelendi.', 'DEBUG', 'PERSONNEL_GET_ALL');
            return $personnel;

        } catch (\Exception $e) {
            LogService::add("PersonnelService::getAllBtkPersonnel Hata: " . $e->getMessage(), 'ERROR', 'PERSONNEL_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

    /**
     * Belirli bir ID'ye sahip BTK personel kaydını detaylarıyla getirir.
     *
     * @param int $personnelId mod_btk_personel.id
     * @return object|null
     */
    public static function getBtkPersonnelById($personnelId)
    {
        if (empty($personnelId)) return null;
        try {
            $personel = Capsule::table('mod_btk_personel as mbp')
                ->leftJoin('tbladmins as ta', 'mbp.admin_id', '=', 'ta.id')
                ->leftJoin('mod_btk_personel_departmanlari as mbpd', 'mbp.departman_id', '=', 'mbpd.id')
                ->where('mbp.id', $personnelId)
                ->select(
                    'mbp.*',
                    'ta.firstname as whmcs_firstname',
                    'ta.lastname as whmcs_lastname',
                    'ta.email as whmcs_email',
                    'mbpd.departman_adi'
                )
                ->first();
            if ($personel) {
                LogService::add("Personel detayı getirildi. ID: {$personnelId}", 'DEBUG', 'PERSONNEL_GET_BY_ID', ['id' => $personnelId]);
            }
            return $personel;
        } catch (\Exception $e) {
            LogService::add("PersonnelService::getBtkPersonnelById Hata: " . $e->getMessage(), 'ERROR', 'PERSONNEL_ERROR', ['exception' => (string)$e, 'id' => $personnelId]);
            return null;
        }
    }

    /**
     * Henüz mod_btk_personel tablosuna eklenmemiş aktif WHMCS adminlerini listeler.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getWhmcsAdminsNotInBtkList()
    {
        try {
            $existingAdminIdsInBtk = Capsule::table('mod_btk_personel')->pluck('admin_id')->all();

            $admins = Capsule::table('tbladmins')
                ->where('disabled', 0)
                ->whereNotIn('id', $existingAdminIdsInBtk)
                ->select('id', 'firstname', 'lastname', 'email')
                ->orderBy('firstname', 'asc')
                ->orderBy('lastname', 'asc')
                ->get();
            LogService::add($admins->count() . ' adet BTK listesine eklenebilecek WHMCS admini bulundu.', 'DEBUG', 'PERSONNEL_GET_NEW_ADMINS');
            return $admins;
        } catch (\Exception $e) {
            LogService::add("PersonnelService::getWhmcsAdminsNotInBtkList Hata: " . $e->getMessage(), 'ERROR', 'PERSONNEL_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

    /**
     * Seçilen WHMCS adminlerini mod_btk_personel tablosuna ekler.
     *
     * @param array $adminIds Eklenecek WHMCS admin ID'lerinin dizisi.
     * @return array ['success' => bool, 'message' => string, 'added_count' => int]
     */
    public static function addWhmcsAdminsToBtkList(array $adminIds)
    {
        $currentAdminId = $_SESSION['adminid'] ?? 0;
        if (empty($adminIds)) {
            return ['success' => true, 'message' => 'Eklenecek personel seçilmedi.', 'added_count' => 0];
        }
        LogService::add(count($adminIds) . " WHMCS admini BTK listesine eklenmek üzere seçildi.", 'INFO', 'PERSONNEL_FETCH_ADMINS_START', ['admin_ids_count' => count($adminIds)], $currentAdminId);

        $addedCount = 0;
        $operatorUnvani = BtkHelper::getSetting('operator_unvani', \WHMCS\Config\Setting::getValue('CompanyName') ?: 'Bilinmeyen Firma');

        foreach ($adminIds as $adminId) {
            try {
                $admin = Admin::find((int)$adminId);
                if (!$admin || $admin->isDisabled()) {
                    LogService::add("AdminID {$adminId} bulunamadı veya pasif, BTK listesine eklenemedi.", 'WARNING', 'PERSONNEL_FETCH_ADMINS_SKIP', ['admin_id' => $adminId], $currentAdminId);
                    continue;
                }

                $adminRoleName = 'Yönetici';
                if ($admin->roleId) { // WHMCS 8.x roleId
                    $role = Capsule::table('tbladminroles')->find($admin->roleId);
                    if ($role) $adminRoleName = $role->name;
                }


                $existing = Capsule::table('mod_btk_personel')->where('admin_id', $admin->id)->first();
                if (!$existing) {
                    Capsule::table('mod_btk_personel')->insert([
                        'admin_id' => $admin->id,
                        'firma_unvani' => $operatorUnvani,
                        'uyruk_iso_kodu' => 'TUR',
                        'unvan_gorev' => $adminRoleName,
                        'btk_listesine_eklensin' => 1,
                        'ise_baslama_tarihi' => Carbon::parse($admin->created_at ?: 'now')->toDateString(),
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now()
                    ]);
                    $addedCount++;
                    LogService::add("AdminID {$admin->id} ({$admin->firstname} {$admin->lastname}) BTK personel listesine eklendi.", 'SUCCESS', 'PERSONNEL_FETCH_ADMINS_ADD', ['admin_id' => $admin->id], $currentAdminId);
                }
            } catch (\Exception $e) {
                LogService::add("AdminID {$adminId} BTK listesine eklenirken hata: " . $e->getMessage(), 'ERROR', 'PERSONNEL_FETCH_ADMINS_ERROR', ['exception' => (string)$e, 'admin_id' => $adminId], $currentAdminId);
            }
        }

        if ($addedCount > 0) {
            return ['success' => true, 'message' => "{$addedCount} personel başarıyla BTK listesine eklendi.", 'added_count' => $addedCount];
        } else {
            return ['success' => true, 'message' => 'Seçilen personeller zaten listede olabilir veya eklenecek aktif personel bulunamadı.', 'added_count' => 0];
        }
    }


// namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

// class PersonnelService
// {
    // ... (getAllBtkPersonnel, getBtkPersonnelById, getWhmcsAdminsNotInBtkList, addWhmcsAdminsToBtkList fonksiyonları burada) ...

    /**
     * BTK personel kaydını günceller.
     * WHMCS adminine bağlı bir personel kaydının BTK ve İK detaylarını günceller.
     *
     * @param int $personnelId mod_btk_personel.id
     * @param array $data Formdan gelen veri dizisi
     * @return array ['success' => bool, 'message' => string]
     */
    public static function updateBtkPersonnel($personnelId, array $data)
    {
        $currentAdminId = $_SESSION['adminid'] ?? 0;
        if (empty($personnelId)) {
            return ['success' => false, 'message' => 'Güncellenecek personel ID belirtilmedi.'];
        }
        LogService::add("Personel kaydı güncelleniyor. PersonelID: {$personnelId}", 'INFO', 'PERSONNEL_UPDATE_START', ['personnel_id' => $personnelId, 'data_count' => count($data)], $currentAdminId);

        try {
            $personel = Capsule::table('mod_btk_personel')->find($personnelId);
            if (!$personel) {
                return ['success' => false, 'message' => 'Güncellenecek personel kaydı bulunamadı.'];
            }

            $adminDetails = Capsule::table('tbladmins')->find($personel->admin_id);
            if (!$adminDetails) {
                 return ['success' => false, 'message' => 'İlişkili WHMCS admin kaydı bulunamadı.'];
            }


            // Veri hazırlama ve doğrulama
            $saveData = [
                'firma_unvani' => $data['firma_unvani'] ?? $personel->firma_unvani,
                'tc_kimlik_no' => !empty($data['tc_kimlik_no']) ? preg_replace('/\D/', '', $data['tc_kimlik_no']) : null,
                'uyruk_iso_kodu' => $data['uyruk_iso_kodu'] ?? $personel->uyruk_iso_kodu ?? 'TUR',
                'unvan_gorev' => $data['unvan_gorev'] ?? $personel->unvan_gorev,
                'departman_id' => !empty($data['departman_id']) ? (int)$data['departman_id'] : $personel->departman_id,
                'mobil_telefonu' => !empty($data['mobil_telefonu']) ? preg_replace('/\D/', '', $data['mobil_telefonu']) : null,
                'sabit_telefonu' => !empty($data['sabit_telefonu']) ? preg_replace('/\D/', '', $data['sabit_telefonu']) : null,
                'ev_adresi' => $data['ev_adresi'] ?? $personel->ev_adresi,
                'acil_durum_kisi_adi' => $data['acil_durum_kisi_adi'] ?? $personel->acil_durum_kisi_adi,
                'acil_durum_kisi_telefonu' => !empty($data['acil_durum_kisi_telefonu']) ? preg_replace('/\D/', '', $data['acil_durum_kisi_telefonu']) : null,
                'ise_baslama_tarihi' => !empty($data['ise_baslama_tarihi']) ? Carbon::parse($data['ise_baslama_tarihi'])->toDateString() : $personel->ise_baslama_tarihi,
                'isten_ayrilma_tarihi' => !empty($data['isten_ayrilma_tarihi']) ? Carbon::parse($data['isten_ayrilma_tarihi'])->toDateString() : null,
                'is_birakma_nedeni' => $data['is_birakma_nedeni'] ?? $personel->is_birakma_nedeni,
                'btk_listesine_eklensin' => isset($data['btk_listesine_eklensin']) ? 1 : 0,
                'gorev_bolgesi_il_id' => !empty($data['gorev_bolgesi_il_id']) ? (int)$data['gorev_bolgesi_il_id'] : null,
                'gorev_bolgesi_ilce_id' => !empty($data['gorev_bolgesi_ilce_id']) ? (int)$data['gorev_bolgesi_ilce_id'] : null,
                'updated_at' => Carbon::now()
            ];

            // TCKN Doğrulaması (Ayarlarda aktifse ve TCKN girilmişse/değişmişse)
            if (BtkHelper::getSetting('nvi_tckn_dogrulama_aktif', '0') == '1' &&
                !empty($saveData['tc_kimlik_no']) &&
                ($saveData['tc_kimlik_no'] != $personel->tc_kimlik_no || empty($personel->tc_kimlik_no)) // Sadece değiştiyse veya ilk kez giriliyorsa
            ) {
                // NVI TCKN doğrulaması için Ad, Soyad ve Doğum Yılı gerekir.
                // Personel için doğum yılı bilgisi `mod_btk_personel` tablosunda yok.
                // Bu alan eklenebilir veya doğrulama sadece format kontrolüyle sınırlı kalabilir
                // ya da NVI'nin farklı bir servisi (eğer varsa) kullanılabilir.
                // Şimdilik, sadece NVI servisine gönderilecek parametreleri hazırlayalım.
                // Doğum yılı olmadığı için bu doğrulama şu an için tam çalışmaz.
                // $nviResult = NviVerificationService::verifyTCKN(
                //     $saveData['tc_kimlik_no'],
                //     $adminDetails->firstname,
                //     $adminDetails->lastname,
                //     null // Doğum Yılı eksik!
                // );
                // if (!$nviResult['is_valid'] && !is_null($nviResult['is_valid'])) { // is_valid null değilse ve false ise
                //     return ['success' => false, 'message' => 'Girilen T.C. Kimlik Numarası doğrulanamadı: ' . ($nviResult['message'] ?? 'NVI yanıtı olumsuz.')];
                // }
                LogService::add("TCKN ({$saveData['tc_kimlik_no']}) için NVI doğrulaması yapılacak (Doğum Yılı eksik).", 'DEBUG', 'PERSONNEL_TCKN_VALIDATE', ['personnel_id' => $personnelId], $currentAdminId);
            }


            Capsule::table('mod_btk_personel')->where('id', $personnelId)->update($saveData);
            $message = 'Personel bilgileri başarıyla güncellendi.';
            LogService::add($message . " PersonelID: {$personnelId}", 'SUCCESS', 'PERSONNEL_UPDATE_SUCCESS', ['personnel_id' => $personnelId], $currentAdminId);
            return ['success' => true, 'message' => $message];

        } catch (\Exception $e) {
            $errMsg = "Personel güncellenirken bir hata oluştu: " . $e->getMessage();
            LogService::add("PersonnelService::updateBtkPersonnel Hata: " . $errMsg, 'ERROR', 'PERSONNEL_UPDATE_ERROR', ['exception' => (string)$e, 'personnel_id' => $personnelId, 'data' => $data], $currentAdminId);
            return ['success' => false, 'message' => $errMsg];
        }
    }

    /**
     * BTK Personel Excel Raporu için aktif ve BTK listesine dahil personelleri çeker.
     *
     * @param int $year Rapor yılı
     * @param int $period Rapor dönemi (1: Haziran, 2: Aralık)
     * @return \Illuminate\Support\Collection
     */
    public static function getActiveBtkPersonnelForReport($year, $period)
    {
        LogService::add("BTK Excel Raporu için personel verisi çekiliyor. Yıl: {$year}, Dönem: {$period}", 'DEBUG', 'PERSONNEL_GET_FOR_REPORT');
        try {
            $reportDate = ($period == 1) ? Carbon::create($year, 6, 30) : Carbon::create($year, 12, 31);

            return Capsule::table('mod_btk_personel as mbp')
                ->join('tbladmins as ta', 'mbp.admin_id', '=', 'ta.id')
                ->leftJoin('mod_btk_personel_departmanlari as mbpd', 'mbp.departman_id', '=', 'mbpd.id')
                ->where('mbp.btk_listesine_eklensin', 1)
                ->where(function ($query) use ($reportDate) { // İşe başlama tarihi rapor tarihinden önce veya eşit
                    $query->whereNull('mbp.ise_baslama_tarihi')
                          ->orWhere('mbp.ise_baslama_tarihi', '<=', $reportDate->toDateString());
                })
                ->where(function ($query) use ($reportDate) { // İşten ayrılma tarihi null veya rapor tarihinden sonra
                    $query->whereNull('mbp.isten_ayrilma_tarihi')
                          ->orWhere('mbp.isten_ayrilma_tarihi', '>', $reportDate->toDateString());
                })
                ->where('ta.disabled', 0) // WHMCS admin hesabı da aktif olmalı
                ->select(
                    'ta.firstname as whmcs_firstname', // Excel için ADI
                    'ta.lastname as whmcs_lastname',   // Excel için SOYADI
                    'ta.email as whmcs_email',         // Excel için E-POSTA ADRESİ
                    'mbp.tc_kimlik_no',                // Excel için T.C. KİMLİK NO
                    'mbp.unvan_gorev',                 // Excel için ÜNVANI
                    'mbpd.departman_adi',              // Excel için ÇALIŞTIĞI BİRİM
                    'mbp.mobil_telefonu',              // Excel için MOBİL TELEFONU
                    'mbp.sabit_telefonu'               // Excel için SABİT TELEFONU
                )
                ->orderBy('ta.lastname', 'asc')
                ->orderBy('ta.firstname', 'asc')
                ->get();

        } catch (\Exception $e) {
            LogService::add("PersonnelService::getActiveBtkPersonnelForReport Hata: " . $e->getMessage(), 'ERROR', 'PERSONNEL_REPORT_ERROR', ['exception' => (string)$e]);
            return collect();
        }
    }

} // Sınıf sonu
?>