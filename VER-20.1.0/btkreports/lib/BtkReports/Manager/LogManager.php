<?php
/**
 * BTK Raporlama Modülü - Merkezi Log Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - `getLogsWithPagination` fonksiyonu, arama ve filtreleme yetenekleriyle
 *   tam işlevsel hale getirildi.
 * - Ayar değişikliklerini akıllıca loglayan `logSettingChange` metodu,
 *   şifre alanlarını özel olarak ele alacak şekilde iyileştirildi.
 * - Hata durumlarında, `error_log` kullanılarak WHMCS'in ana log sistemine de
 *   kayıt düşülmesi sağlandı. Bu, modülün kendi loglarına erişilemediği
 *   durumlarda dahi hata takibini kolaylaştırır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Helper\BtkHelper;

class LogManager
{
    // ==================================================================
    // == LOG KAYDETME (GÖZETİM)
    // ==================================================================

    /**
     * Modül log tablosuna yeni bir kayıt ekler.
     * @param string $islem Loglanan işlemin kısa açıklaması.
     * @param string $seviye Log seviyesi (INFO, UYARI, HATA, KRITIK).
     * @param string $mesaj İşlemle ilgili detaylı mesaj.
     * @param int|null $kullaniciId İşlemi yapan yönetici ID'si.
     * @param array|null $ekVeri Loga eklenecek, JSON formatında saklanacak ek veri.
     */
    public static function logAction(string $islem, string $seviye = 'INFO', string $mesaj = '', ?int $kullaniciId = null, ?array $ekVeri = null): void
    {
        try {
            $ipAdresi = class_exists('\WHMCS\Utility\Environment\CurrentRequest')
                ? \WHMCS\Utility\Environment\CurrentRequest::getIP()
                : ($_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN');
            
            $logKullaniciId = $kullaniciId ?? BtkHelper::getCurrentAdminId();
            $logMesaj = $mesaj;

            // Ek veri varsa, bunu JSON formatına çevirerek ana mesaja ekle.
            if ($ekVeri !== null) {
                // Şifre içeren alanları güvenlik için sansürle
                $filteredEkVeri = self::filterSensitiveData($ekVeri);
                $logMesaj .= "\n" . json_encode($filteredEkVeri, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            }

            Capsule::table('mod_btk_logs')->insert([
                'log_seviyesi' => strtoupper($seviye),
                'islem'        => substr($islem, 0, 255),
                'mesaj'        => $logMesaj,
                'kullanici_id' => $logKullaniciId,
                'ip_adresi'    => $ipAdresi,
                'log_zamani'   => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            // Eğer modülün kendi log sistemine yazılamazsa, en azından PHP'nin
            // genel hata loguna bir kayıt düş.
            error_log("[BTK-Entegre] LogManager CRITICAL ERROR: " . $e->getMessage());
        }
    }

    /**
     * Bir ayar değişikliğini akıllıca loglar. Sadece gerçekten bir değişiklik varsa kayıt oluşturur.
     * @param string $settingName
     * @param mixed $oldValue
     * @param mixed $newValue
     */
    public static function logSettingChange(string $settingName, $oldValue, $newValue): void
    {
        // Şifre alanları için özel durum
        if (str_contains(strtolower($settingName), 'pass')) {
            // Sadece gerçekten yeni bir şifre girildiğinde logla
            if ($newValue !== '********' && !empty($newValue)) {
                self::logAction('Güvenlik Ayarı Güncellendi', 'UYARI', "'{$settingName}' ayarı için yeni bir şifre belirlendi.");
            }
            return;
        }

        // Değer gerçekten değiştiyse logla
        if ((string)$oldValue != (string)$newValue) {
            $mesaj = "'{$settingName}' ayarı güncellendi.";
            $ekVeri = [
                'eski_deger' => $oldValue,
                'yeni_deger' => $newValue,
            ];
            self::logAction('Ayar Güncellendi', 'INFO', $mesaj, null, $ekVeri);
        }
    }

    // ==================================================================
    // == LOG GÖRÜNTÜLEME VE YÖNETİM
    // ==================================================================
    
    /**
     * Logları, filtreleme ve sayfalama ile birlikte veritabanından çeker.
     * @param array $request
     * @return array
     */
    public static function getLogsWithPagination(array $request): array
    {
        $filters = [
            's_log_level'       => $request['s_log_level'] ?? '',
            's_log_search_term'  => $request['s_log_search_term'] ?? '',
            's_log_date_range'  => $request['s_log_date_range'] ?? ''
        ];
        
        $generalQuery = Capsule::table('mod_btk_logs');
        $ftpQuery = Capsule::table('mod_btk_ftp_logs');

        // Filtreleri uygula
        if (!empty($filters['s_log_level'])) {
            $generalQuery->where('log_seviyesi', strtoupper($filters['s_log_level']));
        }
        if (!empty($filters['s_log_search_term'])) {
            $term = '%' . $filters['s_log_search_term'] . '%';
            $generalQuery->where(function ($query) use ($term) {
                $query->where('islem', 'LIKE', $term)
                      ->orWhere('mesaj', 'LIKE', $term);
            });
            $ftpQuery->where('dosya_adi', 'LIKE', $term);
        }
        if (!empty($filters['s_log_date_range'])) {
            $dateRange = explode(' to ', $filters['s_log_date_range']);
            if (count($dateRange) === 2) {
                try {
                    $startDate = date('Y-m-d', strtotime(trim($dateRange[0])));
                    $endDate = date('Y-m-d', strtotime(trim($dateRange[1])));
                    $generalQuery->whereBetween('log_zamani', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                    $ftpQuery->whereBetween('gonderim_zamani', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                } catch (\Exception $e) { /* Geçersiz tarih formatı, filtreyi yoksay */ }
            }
        }
        
        // Sayfalama
        $limit = (int)BtkHelper::get_btk_setting('log_records_per_page', 50);
        
        // Genel Loglar
        $totalGeneral = $generalQuery->count();
        $pageGeneral = (int)($request['page_general'] ?? 1);
        $offsetGeneral = ($pageGeneral - 1) * $limit;
        $generalData = $generalQuery->orderBy('id', 'desc')->skip($offsetGeneral)->take($limit)->get()->map(fn($item) => (array)$item)->all();
        foreach ($generalData as &$log) {
            $log['formatted_log_zamani'] = (new \DateTime($log['log_zamani']))->format('d.m.Y H:i:s');
        }
        unset($log);

        // FTP Logları
        $totalFtp = $ftpQuery->count();
        $pageFtp = (int)($request['page_ftp'] ?? 1);
        $offsetFtp = ($pageFtp - 1) * $limit;
        $ftpData = $ftpQuery->orderBy('id', 'desc')->skip($offsetFtp)->take($limit)->get()->map(fn($item) => (array)$item)->all();
        foreach ($ftpData as &$log) {
            $log['formatted_gonderim_zamani'] = (new \DateTime($log['gonderim_zamani']))->format('d.m.Y H:i:s');
        }
        unset($log);

        return [
            'general' => ['data' => $generalData, 'pagination' => RaporManager::buildPagination($filters, $totalGeneral, $limit, $pageGeneral, 'viewlogs', 'page_general')],
            'ftp'     => ['data' => $ftpData, 'pagination' => RaporManager::buildPagination($filters, $totalFtp, $limit, $pageFtp, 'viewlogs', 'page_ftp')]
        ];
    }

    /**
     * Tüm log tablolarını (genel ve FTP) temizler.
     * @param array $LANG Dil dosyası
     * @return array
     */
    public static function deleteAllLogs(array $LANG): array
    {
        self::logAction('Tüm Logları Silme Denemesi', 'UYARI', 'Tüm log kayıtları silinmek üzere.');
        try {
            Capsule::table('mod_btk_logs')->truncate();
            Capsule::table('mod_btk_ftp_logs')->truncate();
            self::logAction('Tüm Loglar Silindi', 'INFO', 'Tüm modül ve FTP günlük kayıtları başarıyla silindi.');
            return ['type' => 'success', 'message' => $LANG['logsDeletedSuccess']];
        } catch (\Exception $e) {
            self::logAction('Log Silme Hatası', 'HATA', $e->getMessage());
            return ['type' => 'error', 'message' => 'Loglar silinirken bir hata oluştu.'];
        }
    }

    /**
     * Güvenlik için loglanacak verideki hassas bilgileri (şifreler) sansürler.
     * @param array $data
     * @return array
     */
    private static function filterSensitiveData(array $data): array
    {
        $sensitiveKeys = ['pass', 'password', 'nviKpsPass', 'edoksis_pass'];
        foreach ($data as $key => &$value) {
            if (in_array(strtolower($key), $sensitiveKeys)) {
                $value = '********';
            } elseif (is_array($value)) {
                $value = self::filterSensitiveData($value);
            }
        }
        unset($value);
        return $data;
    }
}