<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

// Composer autoload'u dahil et (dosyanın bulunduğu yere göre yol ayarlanmalı)
// Bu dosya app/Services/ altında ise, 3 seviye yukarı çıkıp vendor'a ulaşırız.
if (file_exists(dirname(__DIR__, 3) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__, 3) . '/vendor/autoload.php';
} else {
    // Composer autoload bulunamazsa, kritik hata logla ve çık.
    // Bu durumda BtkHelper da yüklenememiş olabilir.
    if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) {
        BtkHelper::logActivity("CronJobService: Composer autoload.php bulunamadı! Cron görevleri çalıştırılamaz.", 0, 'CRITICAL');
    }
    // WHMCS loguna da yazılabilir: logActivity("BTK Modülü Kritik Hata: Composer autoload.php bulunamadı!", 0);
    die("KRİTİK HATA: Composer autoload.php bulunamadı. Modül düzgün çalışmaz.\n");
}


use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\ReportGeneratorService; // Rapor oluşturma ve gönderme
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService; // Arşivleme için
// use WHMCS\Module\Addon\BtkRaporlari\Services\PersonnelService; // PersonnelService henüz oluşturulmadı
// use WHMCS\Module\Addon\BtkRaporlari\Services\ExcelExportService; // ExcelExportService zaten ReportGeneratorService içinde kullanılabilir
use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use Cron\CronExpression; // Composer ile yüklenen sınıf

/**
 * Class CronJobService
 *
 * Modülün zamanlanmış görevlerini (cron job) yönetir.
 */
class CronJobService
{
    /**
     * Ana cron işlemini başlatır ve tüm görevleri sırayla çalıştırır.
     */
    public static function runAllTasks()
    {
        BtkHelper::logActivity("CronJobService: Tüm cron görevleri başlatılıyor.", 0, 'INFO', ['source' => 'CronJobService']);

        $settings = self::getCronSettings();
        if (empty($settings['operator_kodu']) || empty($settings['operator_adi'])) { // Temel ayarlar eksikse
            BtkHelper::logActivity("CronJobService: Operatör Kodu veya Operatör Adı ayarlanmamış. Cron görevleri çalıştırılamıyor.", 0, 'CRITICAL');
            echo "HATA: Operatör Kodu/Adı ayarları eksik.\n";
            return;
        }

        // 1. Zamanı gelen raporları oluştur ve gönder
        self::processScheduledReports($settings);

        // 2. Veri Arşivleme ve Temizleme İşlemleri
        self::performDataMaintenance($settings);

        // 3. Geçici Rapor Dosyalarını Temizleme
        self::cleanupTemporaryFiles();

        // 4. Periyodik NVI Doğrulaması (Opsiyonel - İleride eklenecek)
        // self::performPeriodicNviChecks($settings);

        BtkHelper::logActivity("CronJobService: Tüm cron görevleri tamamlandı.", 0, 'INFO', ['source' => 'CronJobService']);
        echo "BTK CronJobService tüm görevleri tamamladı.\n";
    }

    /**
     * Cron işlemleri için gerekli modül ayarlarını çeker.
     * @return array|null Ayarlar veya hata durumunda null
     */
    private static function getCronSettings()
    {
        $settingKeys = [
            'operator_kodu', 'operator_adi', 'operator_unvani',
            'ftp_ana_host', 'ftp_ana_port', 'ftp_ana_kullanici', 'ftp_ana_sifre', 'ftp_ana_pasif_mod',
            'ftp_ana_rehber_klasor', 'ftp_ana_hareket_klasor', 'ftp_ana_personel_klasor',
            'yedek_ftp_kullan',
            'ftp_yedek_host', 'ftp_yedek_port', 'ftp_yedek_kullanici', 'ftp_yedek_sifre', 'ftp_yedek_pasif_mod',
            'ftp_yedek_rehber_klasor', 'ftp_yedek_hareket_klasor', 'ftp_yedek_personel_klasor',
            'cron_rehber_zamanlama', 'cron_hareket_zamanlama',
            'cron_personel_zamanlama_haziran', 'cron_personel_zamanlama_aralik',
            'personel_excel_ad_format_ana', 'personel_excel_ad_format_yedek',
            'send_empty_report_if_no_data', 'report_all_if_no_mapping',
            'son_rehber_gonderim_tarihi', 'son_hareket_gonderim_tarihi', 'son_personel_gonderim_tarihi',
            'hareket_canli_saklama_suresi_gun', 'hareket_arsiv_saklama_suresi_gun',
            'cron_log_temizleme_suresi_gun',
            'cron_nvi_periyodik_kontrol_aktif', 'cron_nvi_kontrol_araligi_gun'
        ];
        return BtkHelper::getSettings($settingKeys);
    }

    /**
     * Zamanı gelen raporları tespit eder, oluşturur ve FTP'ye gönderir.
     * @param array $settings Modül ayarları
     */
    private static function processScheduledReports(array $settings)
    {
        if (!class_exists('Cron\CronExpression')) {
            $errorMessage = "CronJobService: 'mtdowling/cron-expression' kütüphanesi bulunamadı veya autoload ile yüklenemedi. Zamanlanmış rapor gönderimi yapılamıyor. Lütfen modül klasöründe 'composer install' komutunu çalıştırın.";
            BtkHelper::logActivity($errorMessage, 0, 'CRITICAL');
            echo "KRİTİK HATA: CronExpression kütüphanesi eksik.\n";
            return;
        }

        $now = Carbon::now(); // Şu anki zaman
        // $lang = self::loadCronLanguage(); // Hata mesajları vb. için $_LANG globaline yüklenir.
                                        // BtkHelper logları zaten Türkçe olduğundan şimdilik gerekmeyebilir.

        BtkHelper::logActivity("CronJobService: Zamanlanmış raporlar kontrol ediliyor. Mevcut zaman: " . $now->toDateTimeString(), 0, 'DEBUG');

        // ABONE REHBER Raporu
        if (!empty($settings['cron_rehber_zamanlama'])) {
            try {
                $cronRehber = CronExpression::factory($settings['cron_rehber_zamanlama']);
                if ($cronRehber->isDue($now)) {
                    $lastSent = $settings['son_rehber_gonderim_tarihi'] ?? null;
                    // Aynı dakika içinde tekrar göndermeyi engelle (cron çok sık çalışırsa diye)
                    if ($lastSent && Carbon::parse($lastSent)->diffInMinutes($now) < 55 && Carbon::parse($lastSent)->hour == $now->hour && Carbon::parse($lastSent)->day == $now->day ) {
                        BtkHelper::logActivity("CronJobService: ABONE REHBER raporu bu saat dilimi içinde zaten işlenmiş/işleniyor olabilir. Atlanıyor.", 0, 'DEBUG');
                    } else {
                        BtkHelper::logActivity("CronJobService: ABONE REHBER raporu zamanı geldi.", 0, 'INFO');
                        $result = ReportGeneratorService::generateAndSendReport('REHBER', $settings); // $settings ayarları da gönderilmeli
                        if ($result['success']) {
                             BtkHelper::saveSetting('son_rehber_gonderim_tarihi', $now->toDateTimeString());
                        } else {
                            BtkHelper::logActivity("CronJobService: ABONE REHBER raporu gönderiminde hata: " . ($result['message'] ?? 'Bilinmeyen hata'), 0, 'ERROR');
                        }
                    }
                }
            } catch (\InvalidArgumentException $e) {
                 BtkHelper::logActivity("CronJobService: ABONE REHBER cron ifadesi geçersiz: '{$settings['cron_rehber_zamanlama']}'. Hata: " . $e->getMessage(), 0, 'ERROR');
            } catch (\Exception $e) {
                BtkHelper::logActivity("CronJobService: ABONE REHBER gönderiminde genel hata: " . $e->getMessage(), 0, 'ERROR', ['cron_expr' => $settings['cron_rehber_zamanlama'] ?? null]);
            }
        }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class CronJobService
{
    // ... (runAllTasks, getCronSettings ve processScheduledReports'un ilk kısmı burada) ...

    private static function processScheduledReports(array $settings) // Fonksiyonun devamı
    {
        // ... (ABONE REHBER raporu için olan kısım yukarıda) ...
        $now = Carbon::now(); // $now değişkenini tekrar tanımlıyoruz (PHP scope)

        // ABONE HAREKET Raporu
        if (!empty($settings['cron_hareket_zamanlama'])) {
            try {
                $cronHareket = CronExpression::factory($settings['cron_hareket_zamanlama']);
                if ($cronHareket->isDue($now)) {
                    $lastSent = $settings['son_hareket_gonderim_tarihi'] ?? null;
                    if ($lastSent && Carbon::parse($lastSent)->diffInMinutes($now) < 55 && Carbon::parse($lastSent)->hour == $now->hour && Carbon::parse($lastSent)->day == $now->day) {
                        BtkHelper::logActivity("CronJobService: ABONE HAREKET raporu bu saat dilimi içinde zaten işlenmiş/işleniyor olabilir. Atlanıyor.", 0, 'DEBUG');
                    } else {
                        BtkHelper::logActivity("CronJobService: ABONE HAREKET raporu zamanı geldi.", 0, 'INFO');
                        $result = ReportGeneratorService::generateAndSendReport('HAREKET', $settings);
                        if ($result['success']) {
                            BtkHelper::saveSetting('son_hareket_gonderim_tarihi', $now->toDateTimeString());
                        } else {
                            BtkHelper::logActivity("CronJobService: ABONE HAREKET raporu gönderiminde hata: " . ($result['message'] ?? 'Bilinmeyen hata'), 0, 'ERROR');
                        }
                    }
                }
            } catch (\InvalidArgumentException $e) {
                 BtkHelper::logActivity("CronJobService: ABONE HAREKET cron ifadesi geçersiz: '{$settings['cron_hareket_zamanlama']}'. Hata: " . $e->getMessage(), 0, 'ERROR');
            } catch (\Exception $e) {
                BtkHelper::logActivity("CronJobService: ABONE HAREKET gönderiminde genel hata: " . $e->getMessage(), 0, 'ERROR', ['cron_expr' => $settings['cron_hareket_zamanlama'] ?? null]);
            }
        }

        // PERSONEL LİSTESİ Raporu (Haziran ve Aralık)
        $isJuneReportDue = false;
        if (!empty($settings['cron_personel_zamanlama_haziran'])) {
            try {
                $cronPersonelHaziran = CronExpression::factory($settings['cron_personel_zamanlama_haziran']);
                if ($cronPersonelHaziran->isDue($now) && (int)$now->format('n') === 6) {
                    $isJuneReportDue = true;
                }
            } catch (\InvalidArgumentException $e) {
                 BtkHelper::logActivity("CronJobService: PERSONEL (Haziran) cron ifadesi geçersiz: '{$settings['cron_personel_zamanlama_haziran']}'. Hata: " . $e->getMessage(), 0, 'ERROR');
            }
        }

        $isDecemberReportDue = false;
        if (!empty($settings['cron_personel_zamanlama_aralik'])) {
             try {
                $cronPersonelAralik = CronExpression::factory($settings['cron_personel_zamanlama_aralik']);
                if ($cronPersonelAralik->isDue($now) && (int)$now->format('n') === 12) {
                    $isDecemberReportDue = true;
                }
            } catch (\InvalidArgumentException $e) {
                 BtkHelper::logActivity("CronJobService: PERSONEL (Aralık) cron ifadesi geçersiz: '{$settings['cron_personel_zamanlama_aralik']}'. Hata: " . $e->getMessage(), 0, 'ERROR');
            }
        }

        if ($isJuneReportDue || $isDecemberReportDue) {
            $donem = $isJuneReportDue ? 1 : 2;
            $currentYear = $now->year;
            $logMsgBase = "CronJobService: PERSONEL LİSTESİ raporu zamanı geldi ({$currentYear} - {$donem}. Dönem).";

            $lastSentPersonel = $settings['son_personel_gonderim_tarihi'] ?? null;
            $shouldSendPersonel = true;
            if ($lastSentPersonel) {
                try {
                    $lastSentDate = Carbon::parse($lastSentPersonel);
                    // Aynı yıl ve aynı dönem için (Haziran için 6. ay, Aralık için 12. ay) zaten gönderilmişse atla
                    if ($lastSentDate->year == $currentYear &&
                        (($isJuneReportDue && $lastSentDate->month >= 6 && $lastSentDate->month < 12) || // Haziran dönemi için (6-11. aylar)
                         ($isDecemberReportDue && $lastSentDate->month == 12))) { // Aralık dönemi için
                        $shouldSendPersonel = false;
                        BtkHelper::logActivity("{$logMsgBase} Bu dönem için zaten gönderilmiş ({$lastSentDate->toFormattedDateString()}). Gönderim atlanıyor.", 0, 'INFO');
                    }
                } catch (\Exception $ex) { /* Tarih parse hatası, yine de gönder */ }
            }

            if ($shouldSendPersonel) {
                BtkHelper::logActivity($logMsgBase . " İşlem başlatılıyor...", 0, 'INFO');
                $options = ['year' => $currentYear, 'period' => $donem, 'settings' => $settings];
                $result = ReportGeneratorService::generateAndSendReport('PERSONEL', $options);
                if ($result['success']) {
                    BtkHelper::saveSetting('son_personel_gonderim_tarihi', $now->toDateTimeString());
                } else {
                    BtkHelper::logActivity("CronJobService: PERSONEL LİSTESİ gönderiminde hata: " . ($result['message'] ?? 'Bilinmeyen hata'), 0, 'ERROR');
                }
            }
        }
    } // processScheduledReports sonu

    /**
     * Veri arşivleme ve eski kayıtları temizleme işlemlerini gerçekleştirir.
     * @param array $settings Modül ayarları
     */
    private static function performDataMaintenance(array $settings)
    {
        BtkHelper::logActivity("CronJobService: Veri bakım işlemleri başlatılıyor.", 0, 'INFO');

        $canliSaklamaSuresiGun = (int)($settings['hareket_canli_saklama_suresi_gun'] ?? 7);
        if($canliSaklamaSuresiGun > 0) {
            SubscriberActivityService::archiveOldActivities($canliSaklamaSuresiGun);
        }

        $arsivSaklamaSuresiGun = (int)($settings['hareket_arsiv_saklama_suresi_gun'] ?? 180);
        if($arsivSaklamaSuresiGun > 0) { // 0 ise silme
            SubscriberActivityService::purgeOldArchivedActivities($arsivSaklamaSuresiGun);
        }

        $logTemizlemeSuresiGun = (int)($settings['cron_log_temizleme_suresi_gun'] ?? 90);
        if ($logTemizlemeSuresiGun > 0) {
            $thresholdDateLog = Carbon::now()->subDays($logTemizlemeSuresiGun)->toDateTimeString();
            try {
                $deletedLogCount = Capsule::table('mod_btk_logs')
                    ->where('log_tarihi', '<', $thresholdDateLog)
                    ->whereIn('log_seviyesi', ['INFO', 'DEBUG'])
                    ->delete();
                if ($deletedLogCount > 0) {
                    BtkHelper::logActivity("CronJobService: {$deletedLogCount} adet eski INFO/DEBUG log kaydı silindi (>{$logTemizlemeSuresiGun} gün).", 0, 'INFO');
                }
            } catch (\Exception $e) {
                 BtkHelper::logActivity("CronJobService: Eski logları silerken hata: " . $e->getMessage(), 0, 'ERROR');
            }
        }
        BtkHelper::logActivity("CronJobService: Veri bakım işlemleri tamamlandı.", 0, 'INFO');
    }

    /**
     * Geçici rapor dosyalarını temizler.
     */
    private static function cleanupTemporaryFiles()
    {
        BtkHelper::logActivity("CronJobService: Geçici rapor dosyaları temizleniyor...", 0, 'DEBUG');
        $tempDir = BtkHelper::getTempReportsDir();
        if ($tempDir) {
            BtkHelper::cleanupTempFiles($tempDir, "*.abn");
            BtkHelper::cleanupTempFiles($tempDir, "*.abn.gz");
            BtkHelper::cleanupTempFiles($tempDir, "*.csv");
            BtkHelper::cleanupTempFiles($tempDir, "*.xlsx");
            BtkHelper::cleanupTempFiles($tempDir, "btk_modul_test_*.txt");
            BtkHelper::logActivity("CronJobService: Geçici rapor dosyaları temizlendi.", 0, 'INFO');
        } else {
            BtkHelper::logActivity("CronJobService: Geçici rapor dosyaları klasörü bulunamadı/erişilemedi.", 0, 'WARNING');
        }
    }

    /**
     * Cron işlemleri için dil dosyasını yükler ve global $_LANG'a ekler.
     * Bu fonksiyonun çağrılması, BtkHelper içindeki loglama gibi yerlerde dil değişkenlerinin
     * kullanılabilmesi için önemlidir, ancak şu anki BtkHelper::logActivity direkt string kullanıyor.
     * Eğer servislerden dönen mesajlarda dil değişkeni kullanılacaksa bu gereklidir.
     */
    private static function loadCronLanguage()
    {
        global $_LANG;
        $language = strtolower(BtkHelper::getSetting('Language', 'turkish')); // WHMCS sistem dili veya modül ayarı
        if (empty($language)) $language = 'turkish';

        $moduleLangPath = dirname(__DIR__, 3) . '/lang/'; // app/Services -> btkreports/lang
        $loadedLang = [];

        if (file_exists($moduleLangPath . $language . '.php')) {
            include($moduleLangPath . $language . '.php'); // Bu $LANG'ı tanımlar
            $loadedLang = $LANG ?? [];
        } elseif (file_exists($moduleLangPath . 'turkish.php')) {
            include($moduleLangPath . 'turkish.php');
            $loadedLang = $LANG ?? [];
        }

        if (!empty($loadedLang)) {
            if (!is_array($_LANG)) { $_LANG = []; }
            $_LANG = array_merge($_LANG, $loadedLang); // WHMCS global _LANG'a ekle, modülünki öncelikli
        }
    }

    // Periyodik NVI Doğrulaması için fonksiyon buraya eklenebilir (self::performPeriodicNviChecks)
    // ...

} // Sınıf sonu
?>