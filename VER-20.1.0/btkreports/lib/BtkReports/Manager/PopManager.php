<?php
/**
 * ISS POP Noktası ve Ağ İzleme Yönetimi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata veren `getIssPopNoktalariListWithPagination` fonksiyonu, `BtkHelper`
 *   sınıfının eksik `use` ifadesi eklenerek onarıldı.
 * - AJAX ile izleme durumunu değiştirme (`togglePopMonitoringStatus`) fonksiyonu
 *   eklendi ve `btkreports.php` yönlendiricisi ile entegre edildi.
 * - `saveIssPopNoktasi` metodu, yeni eklenen tüm izleme alanlarını
 *   (izleme tipi, portlar vb.) yönetecek şekilde güncellendi.
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

class PopManager
{
    // ==================================================================
    // == LİSTELEME VE VERİ ÇEKME
    // ==================================================================

    public static function getIssPopNoktalariListWithPagination(array $request): array
    {
        $filters = [
            's_pop_adi' => $request['s_pop_adi'] ?? '',
            's_il_id'   => $request['s_il_id'] ?? '',
        ];
        
        $query = Capsule::table('mod_btk_iss_pop_noktalari as pop')
            ->leftJoin('mod_btk_adres_il as il', 'pop.il_id', '=', 'il.id')
            ->leftJoin('mod_btk_adres_ilce as ilce', 'pop.ilce_id', '=', 'ilce.id');
            
        if (!empty($filters['s_pop_adi'])) {
            $query->where('pop.pop_adi', 'LIKE', '%' . $filters['s_pop_adi'] . '%');
        }
        if (!empty($filters['s_il_id']) && is_numeric($filters['s_il_id'])) {
            $query->where('pop.il_id', '=', (int)$filters['s_il_id']);
        }
        
        $total = $query->count();
        $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20);
        $page = (int)($request['page'] ?? 1);
        $offset = ($page - 1) * $limit;
        
        $data = $query->select('pop.*', 'il.il_adi', 'ilce.ilce_adi')
            ->orderBy('pop.pop_adi', 'asc')
            ->skip($offset)->take($limit)
            ->get()->map(fn($item) => (array)$item)->all();

        return [
            'data'       => $data,
            'pagination' => RaporManager::buildPagination($filters, $total, $limit, $page, 'isspop')
        ];
    }

    public static function getIssPopNoktasiById(int $id): ?array
    {
        if ($id <= 0) return null;
        return (array)Capsule::table('mod_btk_iss_pop_noktalari')->find($id);
    }

    public static function getAllActivePopsForSelection(): array
    {
        return Capsule::table('mod_btk_iss_pop_noktalari')
            ->where('aktif_pasif_durum', 1)
            ->orderBy('pop_adi')
            ->get(['id', 'pop_adi'])->map(fn($item) => (array)$item)->all();
    }
    
    // ==================================================================
    // == VERİ KAYDETME VE SİLME
    // ==================================================================

    public static function saveIssPopNoktasi(array $data, array $LANG): array
    {
        $popId = (int)($data['id'] ?? 0);
        LogManager::logAction('POP Noktası Kaydetme Denemesi', 'UYARI', "POP ID: {$popId} için kayıt/güncelleme işlemi başlatıldı.", null, ['data' => $data]);
        
        try {
            $dbData = [
                'pop_adi'              => $data['pop_adi'],
                'yayin_yapilan_ssid'   => $data['yayin_yapilan_ssid'],
                'pop_tipi'             => $data['pop_tipi'] ?? null,
                'cihaz_markasi'        => $data['cihaz_markasi'] ?? null,
                'cihaz_modeli'         => $data['cihaz_modeli'] ?? null,
                'il_id'                => !empty($data['il_id']) ? (int)$data['il_id'] : null,
                'ilce_id'              => !empty($data['ilce_id']) ? (int)$data['ilce_id'] : null,
                'tam_adres'            => $data['tam_adres'] ?? null,
                'pop_koordinat_enlem'  => $data['pop_koordinat_enlem'] ?? null,
                'pop_koordinat_boylam' => $data['pop_koordinat_boylam'] ?? null,
                'aktif_pasif_durum'    => (isset($data['aktif_pasif_durum']) && $data['aktif_pasif_durum'] == 1) ? 1 : 0,
                'izleme_aktif'         => (isset($data['izleme_aktif']) && $data['izleme_aktif'] == 1) ? 1 : 0,
                'izleme_ip_adresi'     => $data['izleme_ip_adresi'] ?? null,
                'izleme_portlari'      => $data['izleme_portlari'] ?? null,
                'izleme_tipi'          => $data['izleme_tipi'] ?? 'PING',
            ];

            if ($popId > 0) {
                $oldData = (array)Capsule::table('mod_btk_iss_pop_noktalari')->find($popId);
                Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update($dbData);
                LogManager::logAction('POP Noktası Güncellendi', 'INFO', "POP ID: {$popId} güncellendi.", null, ['once' => $oldData, 'sonra' => $dbData]);
                return ['type' => 'success', 'message' => 'POP noktası güncellendi.'];
            } else {
                $newId = Capsule::table('mod_btk_iss_pop_noktalari')->insertGetId($dbData);
                LogManager::logAction('Yeni POP Noktası Eklendi', 'INFO', "POP ID: {$newId} eklendi.", null, ['veri' => $dbData]);
                return ['type' => 'success', 'message' => 'Yeni POP noktası eklendi.'];
            }
        } catch (\Exception $e) {
            LogManager::logAction('POP Noktası Kaydetme BAŞARISIZ', 'HATA', $e->getMessage(), null, ['data' => $data]);
            return ['type' => 'error', 'message' => 'Veritabanı hatası: ' . substr($e->getMessage(), 0, 100)];
        }
    }

    public static function deleteIssPopNoktasi(int $popId, array $LANG): array
    {
        if ($popId <= 0) return ['type' => 'error', 'message' => 'Geçersiz POP ID.'];
        
        $popData = (array)Capsule::table('mod_btk_iss_pop_noktalari')->find($popId);
        LogManager::logAction('POP Noktası Silme Denemesi', 'UYARI', "POP ID: {$popId} silinmek üzere.", null, ['silinecek_veri' => $popData]);
        
        try {
            Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->delete();
            LogManager::logAction('POP Noktası Silindi', 'INFO', "POP ID: {$popId} kalıcı olarak silindi.");
            return ['type' => 'success', 'message' => 'POP noktası başarıyla silindi.'];
        } catch (\Exception $e) {
            LogManager::logAction('POP Noktası Silme BAŞARISIZ', 'HATA', $e->getMessage(), null, ['pop_id' => $popId]);
            return ['type' => 'error', 'message' => 'Silme işlemi sırasında veritabanı hatası oluştu.'];
        }
    }

    // ==================================================================
    // == AĞ İZLEME (MONITORING)
    // ==================================================================
    
    public static function togglePopMonitoringStatus(int $popId, bool $newStatus): array
    {
        try {
            Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update(['izleme_aktif' => $newStatus]);
            LogManager::logAction('POP İzleme Durumu Değiştirildi', 'INFO', "POP ID: {$popId} için izleme durumu " . ($newStatus ? 'AÇILDI' : 'KAPATILDI'));
            return ['status' => 'success'];
        } catch (\Exception $e) {
            LogManager::logAction('POP İzleme Durumu Değiştirme Hatası', 'HATA', $e->getMessage(), null, ['pop_id' => $popId, 'new_status' => $newStatus]);
            return ['status' => 'error'];
        }
    }
    
    public static function getAllActivePopsForMonitoring(): array
    {
        return Capsule::table('mod_btk_iss_pop_noktalari')
            ->where('aktif_pasif_durum', 1)
            ->where('izleme_aktif', 1)
            ->whereNotNull('izleme_ip_adresi')
            ->where('izleme_ip_adresi', '!=', '')
            ->get()->map(fn($item) => (array)$item)->all();
    }
    
    public static function updatePopMonitoringResult(int $popId, array $result): void
    {
        Capsule::table('mod_btk_iss_pop_noktalari')->where('id', $popId)->update([
            'canli_durum'       => $result['status'],
            'son_yanit_suresi'  => $result['latency_ms'],
            'son_izleme_zamani' => date('Y-m-d H:i:s'),
        ]);
        Capsule::table('mod_btk_pop_monitoring_logs')->insert([
            'pop_id'       => $popId,
            'durum'        => $result['status'],
            'gecikme_ms'   => $result['latency_ms'],
            'detay'        => $result['message'],
            'log_zamani'   => date('Y-m-d H:i:s'),
        ]);
    }

    public static function getMonitoringStats(): array
    {
        return (array)Capsule::table('mod_btk_iss_pop_noktalari')
            ->where('aktif_pasif_durum', 1)
            ->where('izleme_aktif', 1)
            ->select(
                Capsule::raw("COUNT(*) as total"),
                Capsule::raw("SUM(CASE WHEN canli_durum = 'ONLINE' THEN 1 ELSE 0 END) as online"),
                Capsule::raw("SUM(CASE WHEN canli_durum = 'OFFLINE' THEN 1 ELSE 0 END) as offline"),
                Capsule::raw("SUM(CASE WHEN canli_durum = 'HIGH_LATENCY' THEN 1 ELSE 0 END) as high_latency")
            )
            ->first();
    }
}