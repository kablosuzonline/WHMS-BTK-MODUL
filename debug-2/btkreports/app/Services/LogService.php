<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use WHMCS\Utility\Pagination; // WHMCS Pagination sınıfı (BU SEFER DOĞRU OLMALI!)

/**
 * Class LogService
 * mod_btk_logs tablosu ile ilgili işlemleri ve log yönetimini sağlar.
 */
class LogService
{
    /**
     * Yeni bir log kaydı ekler.
     */
    public static function add($message, $level = 'INFO', $islem = null, array $details = [], $adminId = null)
    {
        if (is_null($adminId) && isset($_SESSION['adminid'])) {
            $adminId = (int)$_SESSION['adminid'];
        } elseif(is_null($adminId)) {
            $adminId = 0;
        }

        try {
            if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) {
                if (BtkHelper::getSetting('debug_mode', '0') == '0' && strtoupper($level) == 'DEBUG') {
                    return true;
                }
            } elseif (strtoupper($level) == 'DEBUG') { // Helper yoksa debug logları atma
                return true;
            }


            Capsule::table('mod_btk_logs')->insert([
                'log_tarihi' => Carbon::now(),
                'log_seviyesi' => strtoupper($level),
                'islem' => $islem,
                'mesaj' => mb_substr($message, 0, 65535),
                'detay' => !empty($details) ? mb_substr(json_encode($details, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), 0, 65535) : null,
                'whmcs_admin_id' => $adminId,
                'ip_adresi' => $_SERVER['REMOTE_ADDR'] ?? (php_sapi_name() === 'cli' ? 'CLI' : 'SYSTEM')
            ]);
            return true;
        } catch (\Exception $e) {
            if (function_exists('logActivity')) {
                 logActivity('BTK Modülü LogService::add HATA: ' . $e->getMessage(), 0);
            }
            error_log('BTK Modülü LogService::add HATA: ' . $e->getMessage() . " Detay: " . (string)$e);
            return false;
        }
    }

    /**
     * Log kayıtlarını filtreleyerek ve sayfalayarak getirir.
     */
    public static function getPaginatedLogs(array $filters = [], $page = 1, $limit = 25)
    {
        try {
            $query = Capsule::table('mod_btk_logs as mbl')
                ->leftJoin('tbladmins as ta', 'mbl.whmcs_admin_id', '=', 'ta.id')
                ->select('mbl.*', Capsule::raw("CONCAT(ta.firstname, ' ', ta.lastname) as admin_fullname"));

            if (!empty($filters['filter_level'])) { $query->where('mbl.log_seviyesi', strtoupper($filters['filter_level'])); }
            if (!empty($filters['filter_message'])) { $query->where('mbl.mesaj', 'LIKE', '%' . $filters['filter_message'] . '%'); }
            if (!empty($filters['filter_admin_id'])) {
                if (strtolower(trim($filters['filter_admin_id'])) === 'system' || $filters['filter_admin_id'] === '0') {
                    $query->where(function ($q) { $q->where('mbl.whmcs_admin_id', 0)->orWhereNull('mbl.whmcs_admin_id'); });
                } else { $query->where('mbl.whmcs_admin_id', (int)$filters['filter_admin_id']); }
            }
            if (!empty($filters['filter_date'])) {
                try { $date = Carbon::parse($filters['filter_date'])->toDateString(); $query->whereDate('mbl.log_tarihi', $date); }
                catch (\Exception $e) {
                    if(class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) BtkHelper::logActivity("LogService: Geçersiz tarih formatı ('{$filters['filter_date']}') filtrelenemedi.", 0, 'WARNING', [], 'LOG_DATE_FILTER_INVALID');
                }
            }

            $totalResults = $query->count();

            $pagination = new Pagination($page, $limit, $totalResults); // Doğru sınıf adını kullan
            $paginationOutput = $pagination->output();

            $logs = $query->orderBy('mbl.log_tarihi', 'desc')
                           ->skip($pagination->getSkipCount())
                           ->take($pagination->getLimit())
                           ->get();

            return ['logs' => $logs, 'pagination_output' => $paginationOutput, 'total_results' => $totalResults];

        } catch (\Exception $e) {
            $logErrorMessage = "LogService::getPaginatedLogs Hata: " . $e->getMessage();
            if(class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) BtkHelper::logActivity($logErrorMessage,0,'ERROR', ['exception' => (string)$e], 'LOG_SERVICE_PAGINATE_ERROR');
            else if(function_exists('logActivity')) logActivity("BTK LogService::getPaginatedLogs Hata: " . $logErrorMessage,0);
            return ['logs' => collect(), 'pagination_output' => '', 'total_results' => 0];
        }
    }

    /**
     * Tüm log kayıtlarını siler.
     */
    public static function clearAllLogs()
    {
        $adminId = $_SESSION['adminid'] ?? 0;
        self::add("Tüm log kayıtlarını silme isteği alındı.", 'WARNING', 'LOG_CLEAR_ALL_REQUEST', [], $adminId);
        try {
            $deletedCount = Capsule::table('mod_btk_logs')->delete();
            $message = "Tüm log kayıtları ({$deletedCount} adet) başarıyla silindi.";
            self::add($message, 'SUCCESS', 'LOG_CLEAR_ALL_SUCCESS', ['deleted_count' => $deletedCount], $adminId);
            return ['success' => true, 'message' => $message];
        } catch (\Exception $e) {
            $errMsg = "Log kayıtları silinirken bir hata oluştu: " . $e->getMessage();
            if(class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) BtkHelper::logActivity("clearAllLogs Hata: " . $errMsg, $adminId, 'ERROR', ['exception' => (string)$e], 'LOG_CLEAR_ALL_ERROR');
            else if(function_exists('logActivity')) logActivity("BTK clearAllLogs Hata: " . $errMsg, $adminId);
            return ['success' => false, 'message' => $errMsg];
        }
    }

    /**
     * Belirli bir süreden eski olan INFO ve DEBUG seviyesindeki logları siler.
     */
    public static function purgeOldInfoDebugLogs($daysOld = 90)
    {
        if ($daysOld <= 0) return 0;
        self::add("{$daysOld} günden eski INFO/DEBUG logları siliniyor.", 'INFO', 'LOG_PURGE_OLD');
        try {
            $thresholdDate = Carbon::now()->subDays($daysOld)->toDateTimeString();
            $deletedCount = Capsule::table('mod_btk_logs')
                ->where('log_tarihi', '<', $thresholdDate)
                ->whereIn('log_seviyesi', ['INFO', 'DEBUG'])
                ->delete();

            if ($deletedCount > 0) {
                self::add("{$deletedCount} adet eski INFO/DEBUG log kaydı başarıyla silindi.", 'INFO', 'LOG_PURGE_OLD_SUCCESS', ['deleted_count' => $deletedCount]);
            }
            return $deletedCount;
        } catch (\Exception $e) {
            if(class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) BtkHelper::logActivity("purgeOldInfoDebugLogs Hata: " . $e->getMessage(), 0, 'ERROR', ['exception' => (string)$e], 'LOG_PURGE_OLD_ERROR');
            else if(function_exists('logActivity')) logActivity("BTK purgeOldInfoDebugLogs Hata: " . $e->getMessage(),0);
            return 0;
        }
    }

} // Sınıf sonu
?>