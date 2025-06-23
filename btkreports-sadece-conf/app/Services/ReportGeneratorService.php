<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService;
use WHMCS\Database\Capsule;
use WHMCS\Carbon;

/**
 * Class ReportGeneratorService
 *
 * ABONE REHBER ve ABONE HAREKET raporlarını oluşturur.
 */
class ReportGeneratorService
{
    // BTK Rapor dosyasındaki alanların sıralı listesi (abonedesen.xlsx'ye göre)
    // Bu liste, rapor oluşturulurken doğru sütun sırasını garantilemek için kullanılır.
    protected static $btkReportFieldsOrder = [
        'OPERATOR_KOD', 'MUSTERI_ID', 'HAT_NO', 'HAT_DURUM', 'HAT_DURUM_KODU',
        'HAT_DURUM_KODU_ACIKLAMA', 'MUSTERI_HAREKET_KODU', 'MUSTERI_HAREKET_ACIKLAMA',
        'MUSTERI_HAREKET_ZAMANI', 'HIZMET_TIPI', 'MUSTERI_TIPI', 'ABONE_BASLANGIC',
        'ABONE_BITIS', 'ABONE_ADI', 'ABONE_SOYADI', 'ABONE_TC_KIMLIK_NO',
        'ABONE_PASAPORT_NO', 'ABONE_UNVAN', 'ABONE_VERGI_NUMARASI',
        'ABONE_MERSIS_NUMARASI', 'ABONE_CINSIYET', 'ABONE_UYRUK', 'ABONE_BABA_ADI',
        'ABONE_ANA_ADI', 'ABONE_ANNE_KIZLIK_SOYADI', 'ABONE_DOGUM_YERI',
        'ABONE_DOGUM_TARIHI', 'ABONE_MESLEK', 'ABONE_TARIFE', 'ABONE_KIMLIK_CILT_NO',
        'ABONE_KIMLIK_KUTUK_NO', 'ABONE_KIMLIK_SAYFA_NO', 'ABONE_KIMLIK_IL',
        'ABONE_KIMLIK_ILCE', 'ABONE_KIMLIK_MAHALLE_KOY', 'ABONE_KIMLIK_TIPI',
        'ABONE_KIMLIK_SERI_NO', 'ABONE_KIMLIK_VERILDIGI_YER',
        'ABONE_KIMLIK_VERILDIGI_TARIH', 'ABONE_KIMLIK_AIDIYETI',
        'ABONE_ADRES_TESIS_IL', 'ABONE_ADRES_TESIS_ILCE', 'ABONE_ADRES_TESIS_MAHALLE',
        'ABONE_ADRES_TESIS_CADDE', 'ABONE_ADRES_TESIS_DIS_KAPI_NO',
        'ABONE_ADRES_TESIS_IC_KAPI_NO', 'ABONE_ADRES_TESIS_POSTA_KODU',
        'ABONE_ADRES_TESIS_ADRES_KODU', 'ABONE_ADRES_IRTIBAT_TEL_NO_1',
        'ABONE_ADRES_IRTIBAT_TEL_NO_2', 'ABONE_ADRES_E_MAIL',
        'ABONE_ADRES_YERLESIM_IL', 'ABONE_ADRES_YERLESIM_ILCE',
        'ABONE_ADRES_YERLESIM_MAHALLE', 'ABONE_ADRES_YERLESIM_CADDE',
        'ABONE_ADRES_YERLESIM_DIS_KAPI_NO', 'ABONE_ADRES_YERLESIM_IC_KAPI_NO',
        'ABONE_ADRES_YERLESIM_POSTA_KODU', 'ABONE_ADRES_YERLESIM_ADRES_KODU',
        'KURUM_YETKILI_ADI', 'KURUM_YETKILI_SOYADI', 'KURUM_YETKILI_TCKIMLIK_NO',
        'KURUM_YETKILI_TELEFON', 'KURUM_ADRES', 'AKTIVASYON_BAYI_ADI',
        'AKTIVASYON_BAYI_ADRESI', 'AKTIVASYON_KULLANICI', 'GUNCELLEYEN_BAYI_ADI',
        'GUNCELLEYEN_BAYI_ADRESI', 'GUNCELLEYEN_KULLANICI', 'STATIK_IP',
        'ISS_HIZ_PROFILI', 'ISS_KULLANICI_ADI', 'ISS_POP_BILGISI'
    ];


    /**
     * ABONE REHBER rapor dosyasını oluşturur.
     *
     * @param array $settings Modül ayarları
     * @param string $yetkiTuruKodu Raporlanacak yetki türü kodu (örn: 'ISS_B')
     * @return array ['success' => bool, 'message' => string, 'file_path' => string|null, 'gz_file_path' => string|null, 'record_count' => int, 'file_name_final' => string|null]
     */
    public static function generateAboneRehberReport(array $settings, $yetkiTuruKodu)
    {
        BtkHelper::logActivity("ReportGeneratorService: ABONE REHBER raporu oluşturma başlatıldı. Yetki: {$yetkiTuruKodu}", 0, 'INFO');
        $tempDir = BtkHelper::getTempReportsDir();
        if (!$tempDir) {
            return ['success' => false, 'message' => 'Geçici rapor klasörü oluşturulamadı/erişilemedi.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'file_name_final' => null];
        }

        try {
            // 1. Verileri Çek
            // Bu yetki türüne eşlenmiş ürün gruplarındaki hizmetlere ait rehber kayıtlarını çek.
            // Bu mantık, SubscriberGuideService içine taşınabilir: getSubscribersForGuideReport($yetkiTuruId)
            $yetkiTuruDetay = Capsule::table('mod_btk_yetki_turleri')->where('yetki_kodu', $yetkiTuruKodu)->where('secili_mi', 1)->first();
            if (!$yetkiTuruDetay) {
                $msg = "ABONE REHBER: Yetki türü '{$yetkiTuruKodu}' aktif değil veya bulunamadı.";
                BtkHelper::logActivity($msg, 0, 'WARNING');
                return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'file_name_final' => null]; // Başarılı ama boş
            }

            $mappedProductGroupIds = Capsule::table('mod_btk_product_group_mappings')
                                        ->where('btk_yetki_turu_id', $yetkiTuruDetay->id)
                                        ->pluck('whmcs_product_group_id')
                                        ->all();
            
            if (empty($mappedProductGroupIds) && BtkHelper::getSetting('report_all_if_no_mapping', '0') !== '1') {
                 $msg = "ABONE REHBER: Yetki türü '{$yetkiTuruKodu}' için eşleştirilmiş ürün grubu bulunamadı ve 'Eşleşmeyenleri Raporla' ayarı kapalı.";
                 BtkHelper::logActivity($msg, 0, 'INFO');
                 return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'file_name_final' => null];
            }

            $query = Capsule::table('mod_btk_abone_rehber as mar')
                        ->join('tblhosting as th', 'mar.whmcs_service_id', '=', 'th.id');

            if (!empty($mappedProductGroupIds)) {
                 $query->whereIn('th.groupid', $mappedProductGroupIds);
            }
            // Eğer eşleşme yoksa ve tümünü raporla ayarı açıksa, groupid filtresi uygulanmaz.

            $subscribers = $query->select('mar.*')->orderBy('mar.whmcs_service_id')->get();

            if ($subscribers->isEmpty() && BtkHelper::getSetting('send_empty_report_if_no_data', '0') !== '1') {
                $msg = "ABONE REHBER: Yetki türü '{$yetkiTuruKodu}' için raporlanacak abone bulunamadı ve 'Boş Rapor Gönder' ayarı kapalı.";
                BtkHelper::logActivity($msg, 0, 'INFO');
                return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'file_name_final' => null];
            }

            // 2. Dosya Adını Oluştur
            $operatorName = $settings['operator_adi'] ?? 'FIRMAADI';
            $operatorCode = $settings['operator_kodu'] ?? '000';
            $dateTimeString = BtkHelper::getBtkDateTimeFormat();
            // Bu yetki türü için dosya adında kullanılacak anahtar (örn: ISS, AIH)
            // yetki_kodu'ndan (örn: ISS_B) sadece ana kısmı (ISS) almamız gerekebilir.
            // BTK genellikle yetki türünün tam kodunu değil, anahtarını ister. Şimdilik tam kodu kullanalım.
            $reportYetkiKey = strtoupper(str_replace(['_B', '_K'], '', $yetkiTuruKodu));


            // CNT yönetimi: Yeni bir rehber raporu her zaman '01' ile başlar.
            // Sadece BTK tarafından aynı tarihli raporun tekrarı istenirse manuel olarak CNT artırılır.
            // Bu otomatik cron işlemi için her zaman '01' olacaktır.
            $cnt = '01';
            // TODO: Eğer bu rapor daha önce aynı $dateTimeString ile oluşturulup gönderilmişse ve BTK tekrar istemişse
            // CNT artırılmalı. Bu, manuel gönderim veya "yeniden gönder" özelliği ile yönetilebilir.
            // Otomatik gönderimler için $dateTimeString her zaman yeni olacağından CNT '01' kalır.

            $fileNameBase = strtoupper($operatorName) . '_' . $operatorCode . '_' . $reportYetkiKey . '_ABONE_REHBER_' . $dateTimeString;
            $finalFileName = $fileNameBase . '_' . $cnt . '.abn';
            $localFilePath = $tempDir . $finalFileName;

            // 3. Dosyayı Oluştur ve Yaz
            $fileContent = "";
            $recordCount = 0;
            foreach ($subscribers as $subscriber) {
                $line = [];
                foreach (self::$btkReportFieldsOrder as $field) {
                    $value = $subscriber->$field ?? ($subscriber[strtolower($field)] ?? null);
                    // Tarih formatlarını BTK'nın istediği gibi (YYYYAAGGSSDDSS veya YYYYAAGG) kontrol et
                    if (in_array($field, ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS'])) {
                        if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', (string)$value)) { // WHMCS datetime
                            $value = Carbon::parse($value)->format('YmdHis');
                        } elseif (preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$value)) { // WHMCS date
                            $value = Carbon::parse($value)->format('Ymd') . '000000';
                        }
                        // Eğer zaten YYYYAAGGSSDDSS formatındaysa dokunma
                    } elseif ($field === 'ABONE_DOGUM_TARIHI' || $field === 'ABONE_KIMLIK_VERILDIGI_TARIH') {
                         if (preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$value)) { // WHMCS date
                            $value = str_replace('-', '', $value); // YYYYAAGG
                        }
                        // Eğer zaten YYYYAAGG formatındaysa dokunma
                    }

                    // BTK boş alanları |;| arasında boşluk olmadan ister. Null ise boş string yap.
                    $line[] = ($value === null || $value === '') ? '' : (string)$value;
                }
                $fileContent .= implode('|;|', $line) . "\n";
                $recordCount++;
            }
            
            // Eğer hiç kayıt yoksa ve boş rapor gönderilecekse, sadece başlık satırı (veya tamamen boş dosya)
            // BTK genellikle boş dosya yerine hiç dosya göndermemeyi tercih eder, ama bu ayara bağlı.
            if ($recordCount === 0 && BtkHelper::getSetting('send_empty_report_if_no_data', '0') === '1') {
                // Boş dosya içeriği (BTK'nın beklentisine göre ayarlanmalı, bazen sadece dosya adı yeterli olur)
                // file_put_contents($localFilePath, ""); // Tamamen boş dosya
                // Veya sadece tek bir \n karakteri
                $fileContent = "\n"; // Ya da tamamen boş bırakılabilir. BTK ile teyitleşilmeli.
                BtkHelper::logActivity("ABONE REHBER: Raporlanacak veri yok, 'Boş Rapor Gönder' ayarı aktif. Boş içerikli dosya oluşturuldu: {$finalFileName}", 0, 'INFO');
            } elseif ($recordCount > 0) {
                 // Dosyayı UTF-8 BOM olmadan kaydet
                if (file_put_contents($localFilePath, $fileContent) === false) {
                    throw new \Exception("ABONE REHBER dosyası yazılamadı: {$localFilePath}");
                }
            } else { // Kayıt yok ve boş rapor gönderilmeyecekse
                 return ['success' => true, 'message' => "ABONE REHBER: Raporlanacak veri yok. Dosya oluşturulmadı.", 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'file_name_final' => null];
            }


            // 4. Sıkıştır
            $gzFilePath = BtkHelper::compressToGz($localFilePath);
            if (!$gzFilePath) {
                throw new \Exception("ABONE REHBER dosyası sıkıştırılamadı: {$localFilePath}");
            }

            BtkHelper::logActivity("ABONE REHBER raporu başarıyla oluşturuldu ve sıkıştırıldı: {$gzFilePath} ({$recordCount} kayıt)", 0, 'INFO');
            return [
                'success' => true,
                'message' => "ABONE REHBER raporu başarıyla oluşturuldu: {$finalFileName}",
                'file_path' => $localFilePath,
                'gz_file_path' => $gzFilePath,
                'record_count' => $recordCount,
                'file_name_final' => $finalFileName // .abn uzantılı
            ];

        } catch (\Exception $e) {
            $errMsg = "ABONE REHBER raporu oluşturulurken hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, 0, 'ERROR', ['exception' => (string)$e]);
            return ['success' => false, 'message' => $errMsg, 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'file_name_final' => null];
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class ReportGeneratorService
{
    // ... (btkReportFieldsOrder ve generateAboneRehberReport fonksiyonu burada) ...

    /**
     * ABONE HAREKET rapor dosyasını oluşturur.
     *
     * @param array $settings Modül ayarları
     * @param string $yetkiTuruKodu Raporlanacak yetki türü kodu (örn: 'ISS_B')
     * @param string|null $startDate YYYY-AA-GG formatında başlangıç tarihi (opsiyonel)
     * @param string|null $endDate YYYY-AA-GG formatında bitiş tarihi (opsiyonel)
     * @param int $limit Çekilecek maksimum hareket sayısı
     * @return array ['success' => bool, 'message' => string, 'file_path' => string|null, 'gz_file_path' => string|null, 'record_count' => int, 'activity_ids' => array, 'file_name_final' => string|null]
     */
    public static function generateAboneHareketReport(array $settings, $yetkiTuruKodu, $startDate = null, $endDate = null, $limit = 5000)
    {
        BtkHelper::logActivity("ReportGeneratorService: ABONE HAREKET raporu oluşturma başlatıldı. Yetki: {$yetkiTuruKodu}", 0, 'INFO');
        $tempDir = BtkHelper::getTempReportsDir();
        if (!$tempDir) {
            return ['success' => false, 'message' => 'Geçici rapor klasörü oluşturulamadı/erişilemedi.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'activity_ids' => [], 'file_name_final' => null];
        }

        try {
            // Yetki türü kontrolü
            $yetkiTuruDetay = Capsule::table('mod_btk_yetki_turleri')->where('yetki_kodu', $yetkiTuruKodu)->where('secili_mi', 1)->first();
            if (!$yetkiTuruDetay) {
                $msg = "ABONE HAREKET: Yetki türü '{$yetkiTuruKodu}' aktif değil veya bulunamadı.";
                BtkHelper::logActivity($msg, 0, 'WARNING');
                return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'activity_ids' => [], 'file_name_final' => null];
            }

            // 1. Gönderilmemiş Hareketleri Çek
            // Bu yetki türüne eşlenmiş ürün gruplarındaki hizmetlere ait hareketleri çek.
            // Bu mantık, SubscriberActivityService içine taşınabilir: getUnsentActivitiesByYetki($yetkiTuruId, $startDate, $endDate, $limit)
            $mappedProductGroupIds = Capsule::table('mod_btk_product_group_mappings')
                                        ->where('btk_yetki_turu_id', $yetkiTuruDetay->id)
                                        ->pluck('whmcs_product_group_id')
                                        ->all();

            if (empty($mappedProductGroupIds) && BtkHelper::getSetting('report_all_if_no_mapping', '0') !== '1') {
                 $msg = "ABONE HAREKET: Yetki türü '{$yetkiTuruKodu}' için eşleştirilmiş ürün grubu bulunamadı ve 'Eşleşmeyenleri Raporla' ayarı kapalı.";
                 BtkHelper::logActivity($msg, 0, 'INFO');
                 return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'activity_ids' => [], 'file_name_final' => null];
            }

            $query = Capsule::table('mod_btk_abone_hareket_canli as mahc')
                        ->join('tblhosting as th', 'mahc.whmcs_service_id', '=', 'th.id')
                        ->where('mahc.gonderildi', 0); // Sadece gönderilmemiş olanlar

            if (!empty($mappedProductGroupIds)) {
                 $query->whereIn('th.groupid', $mappedProductGroupIds);
            }

            if ($startDate) {
                try {
                    $query->where('mahc.MUSTERI_HAREKET_ZAMANI', '>=', Carbon::parse($startDate)->format('YmdHis'));
                } catch (\Exception $e) { /* Geçersiz tarih formatı, filtreyi uygulama */ }
            }
            if ($endDate) {
                 try {
                    $query->where('mahc.MUSTERI_HAREKET_ZAMANI', '<=', Carbon::parse($endDate)->endOfDay()->format('YmdHis'));
                } catch (\Exception $e) { /* Geçersiz tarih formatı, filtreyi uygulama */ }
            }

            $activities = $query->select('mahc.*')
                                ->orderBy('mahc.MUSTERI_HAREKET_ZAMANI', 'asc')
                                ->orderBy('mahc.id', 'asc')
                                ->take($limit)
                                ->get();

            if ($activities->isEmpty() && BtkHelper::getSetting('send_empty_report_if_no_data', '0') !== '1') {
                $msg = "ABONE HAREKET: Yetki türü '{$yetkiTuruKodu}' için raporlanacak yeni hareket bulunamadı ve 'Boş Rapor Gönder' ayarı kapalı.";
                BtkHelper::logActivity($msg, 0, 'INFO');
                 return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'activity_ids' => [], 'file_name_final' => null];
            }

            // 2. Dosya Adını Oluştur
            $operatorName = $settings['operator_adi'] ?? 'FIRMAADI';
            $operatorCode = $settings['operator_kodu'] ?? '000';
            $dateTimeString = BtkHelper::getBtkDateTimeFormat();
            $reportYetkiKey = strtoupper(str_replace(['_B', '_K'], '', $yetkiTuruKodu));
            $cnt = '01'; // Hareket raporları için de yeni dosya her zaman 01 ile başlar.
                         // Tekrar gönderim mantığı ayrı yönetilmeli.

            $fileNameBase = strtoupper($operatorName) . '_' . $operatorCode . '_' . $reportYetkiKey . '_ABONE_HAREKET_' . $dateTimeString;
            $finalFileName = $fileNameBase . '_' . $cnt . '.abn';
            $localFilePath = $tempDir . $finalFileName;

            // 3. Dosyayı Oluştur ve Yaz
            $fileContent = "";
            $recordCount = 0;
            $activityIds = [];

            foreach ($activities as $activity) {
                $line = [];
                foreach (self::$btkReportFieldsOrder as $field) {
                    $value = $activity->$field ?? ($activity[strtolower($field)] ?? null);
                     // Tarih formatlarını BTK'nın istediği gibi (YYYYAAGGSSDDSS veya YYYYAAGG) kontrol et
                    if (in_array($field, ['MUSTERI_HAREKET_ZAMANI', 'ABONE_BASLANGIC', 'ABONE_BITIS'])) {
                        if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', (string)$value)) {
                            $value = Carbon::parse($value)->format('YmdHis');
                        } elseif (preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$value)) {
                            $value = Carbon::parse($value)->format('Ymd') . '000000';
                        }
                    } elseif ($field === 'ABONE_DOGUM_TARIHI' || $field === 'ABONE_KIMLIK_VERILDIGI_TARIH') {
                         if (preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$value)) {
                            $value = str_replace('-', '', $value);
                        }
                    }
                    $line[] = ($value === null || $value === '') ? '' : (string)$value;
                }
                $fileContent .= implode('|;|', $line) . "\n";
                $activityIds[] = $activity->id;
                $recordCount++;
            }

            if ($recordCount === 0 && BtkHelper::getSetting('send_empty_report_if_no_data', '0') === '1') {
                $fileContent = "\n"; // Boş dosya içeriği
                BtkHelper::logActivity("ABONE HAREKET: Raporlanacak veri yok, 'Boş Rapor Gönder' ayarı aktif. Boş içerikli dosya oluşturuldu: {$finalFileName}", 0, 'INFO');
            } elseif ($recordCount > 0) {
                 if (file_put_contents($localFilePath, $fileContent) === false) {
                    throw new \Exception("ABONE HAREKET dosyası yazılamadı: {$localFilePath}");
                }
            } else { // Kayıt yok ve boş rapor gönderilmeyecekse
                return ['success' => true, 'message' => "ABONE HAREKET: Raporlanacak yeni hareket yok. Dosya oluşturulmadı.", 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'activity_ids' => [], 'file_name_final' => null];
            }


            // 4. Sıkıştır
            $gzFilePath = BtkHelper::compressToGz($localFilePath);
            if (!$gzFilePath) {
                throw new \Exception("ABONE HAREKET dosyası sıkıştırılamadı: {$localFilePath}");
            }

            BtkHelper::logActivity("ABONE HAREKET raporu başarıyla oluşturuldu ve sıkıştırıldı: {$gzFilePath} ({$recordCount} hareket)", 0, 'INFO');
            return [
                'success' => true,
                'message' => "ABONE HAREKET raporu başarıyla oluşturuldu: {$finalFileName}",
                'file_path' => $localFilePath,
                'gz_file_path' => $gzFilePath,
                'record_count' => $recordCount,
                'activity_ids' => $activityIds, // Gönderildi olarak işaretlenecek ID'ler
                'file_name_final' => $finalFileName
            ];

        } catch (\Exception $e) {
            $errMsg = "ABONE HAREKET raporu oluşturulurken hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, 0, 'ERROR', ['exception' => (string)$e]);
            return ['success' => false, 'message' => $errMsg, 'file_path' => null, 'gz_file_path' => null, 'record_count' => 0, 'activity_ids' => [], 'file_name_final' => null];
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class ReportGeneratorService
{
    // ... (btkReportFieldsOrder, generateAboneRehberReport ve generateAboneHareketReport fonksiyonları burada) ...

    /**
     * Genel rapor oluşturma ve gönderme iş akışını yönetir.
     * Bu fonksiyon, manuel gönderim veya cron tarafından çağrılabilir.
     *
     * @param string $reportType 'REHBER', 'HAREKET', 'PERSONEL'
     * @param array $options Ek seçenekler (örn: tarih aralığı, personel için yıl/dönem)
     * @return array ['success' => bool, 'message' => string, 'files_sent' => array]
     */
    public static function generateAndSendReport($reportType, array $options = [])
    {
        BtkHelper::logActivity("ReportGeneratorService: {$reportType} raporu için genel gönderim süreci başlatıldı.", 0, 'INFO', ['options' => $options]);
        $settings = BtkHelper::getSettings([ // Gerekli tüm ayarları çek
            'operator_kodu', 'operator_adi', 'operator_unvani',
            'ftp_ana_host', 'ftp_ana_port', 'ftp_ana_kullanici', 'ftp_ana_sifre', 'ftp_ana_pasif_mod',
            'ftp_ana_rehber_klasor', 'ftp_ana_hareket_klasor', 'ftp_ana_personel_klasor',
            'yedek_ftp_kullan',
            'ftp_yedek_host', 'ftp_yedek_port', 'ftp_yedek_kullanici', 'ftp_yedek_sifre', 'ftp_yedek_pasif_mod',
            'ftp_yedek_rehber_klasor', 'ftp_yedek_hareket_klasor', 'ftp_yedek_personel_klasor',
            'personel_excel_ad_format_ana', 'personel_excel_ad_format_yedek',
            'send_empty_report_if_no_data', 'report_all_if_no_mapping'
        ]);

        $filesSent = [];
        $overallSuccess = true;
        $finalMessage = "";

        // Aktif yetki türlerini al
        $aktifYetkiTurleri = Capsule::table('mod_btk_yetki_turleri')->where('secili_mi', 1)->get();

        if ($aktifYetkiTurleri->isEmpty() && ($reportType === 'REHBER' || $reportType === 'HAREKET')) {
            $msg = "{$reportType} raporu oluşturulamadı: Modül ayarlarında seçili/aktif bir BTK Yetki Türü bulunmuyor.";
            BtkHelper::logActivity($msg, 0, 'WARNING');
            return ['success' => false, 'message' => $msg, 'files_sent' => []];
        }

        $generatedFiles = []; // [ ['type' => 'ana', 'path' => '...'], ['type' => 'yedek', 'path' => '...'] ]

        if ($reportType === 'REHBER' || $reportType === 'HAREKET') {
            foreach ($aktifYetkiTurleri as $yetki) {
                $reportResult = null;
                if ($reportType === 'REHBER') {
                    $reportResult = self::generateAboneRehberReport($settings, $yetki->yetki_kodu);
                } elseif ($reportType === 'HAREKET') {
                    $startDate = $options['start_date'] ?? null;
                    $endDate = $options['end_date'] ?? null;
                    $reportResult = self::generateAboneHareketReport($settings, $yetki->yetki_kodu, $startDate, $endDate);
                }

                if ($reportResult && $reportResult['success'] && $reportResult['gz_file_path']) {
                    $generatedFiles[] = $reportResult; // Her yetki türü için oluşturulan dosyayı sakla
                } elseif ($reportResult && !$reportResult['success']) {
                    $overallSuccess = false;
                    $finalMessage .= "{$yetki->yetki_kodu} için {$reportType} raporu oluşturma hatası: " . $reportResult['message'] . "\n";
                } elseif ($reportResult && $reportResult['success'] && !$reportResult['gz_file_path']) {
                    // Veri yok ama boş rapor gönder ayarı kapalı, dosya oluşmadı.
                    $finalMessage .= "{$yetki->yetki_kodu} için {$reportType}: " . $reportResult['message'] . "\n";
                }
            }
        } elseif ($reportType === 'PERSONEL') {
            // PersonelService veya ExcelExportService çağrılacak
            $year = $options['year'] ?? Carbon::now()->year;
            $period = $options['period'] ?? ((Carbon::now()->month <= 6) ? 1 : 2); // 1: Haziran, 2: Aralık

            // TODO: Personel verilerini PersonnelService'ten çek
            // $personnelData = PersonnelService::getActiveBtkPersonnelForReport();
            $personnelData = []; // Örnek, gerçek veri çekilmeli
             if (empty($personnelData) && BtkHelper::getSetting('send_empty_report_if_no_data', '0') !== '1') {
                 $msg = "PERSONEL LİSTESİ: Raporlanacak personel bulunamadı ve 'Boş Rapor Gönder' ayarı kapalı.";
                 BtkHelper::logActivity($msg, 0, 'INFO');
                 return ['success' => true, 'message' => $msg . ' Rapor oluşturulmadı.', 'files_sent' => []];
             }


            $operatorUnvani = $settings['operator_unvani'] ?? 'FIRMA_UNVANI';
            $tempDir = BtkHelper::getTempReportsDir();
            $fileNameBase = strtoupper($settings['operator_adi']) . '_Personel_Listesi';
            if ($settings['personel_excel_ad_format_ana'] == '1') { // Ana FTP için format
                $fileNameBase .= '_' . $year . '_' . $period;
            }
            $localExcelPathBase = $tempDir . $fileNameBase;

            // $excelPath = ExcelExportService::generatePersonnelExcel($personnelData, $operatorUnvani, $localExcelPathBase);
            $excelPath = null; // TODO: ExcelExportService entegrasyonu

            if ($excelPath) {
                $generatedFiles[] = [
                    'file_path' => $excelPath, // .xlsx uzantılı tam yol
                    'gz_file_path' => $excelPath, // Sıkıştırma yok
                    'file_name_final' => basename($excelPath),
                    'report_type_internal' => 'PERSONEL', // FTP klasörünü belirlemek için
                    'record_count' => count($personnelData),
                    'activity_ids' => [] // Personel için geçerli değil
                ];
            } else {
                $overallSuccess = false;
                $finalMessage .= "PERSONEL LİSTESİ oluşturma hatası.\n";
            }
        } else {
            return ['success' => false, 'message' => 'Geçersiz rapor tipi.', 'files_sent' => []];
        }

        if (empty($generatedFiles) && $overallSuccess) { // Hiç dosya oluşmadıysa (veri yok, boş rapor ayarı kapalı)
             return ['success' => true, 'message' => $finalMessage ?: "Raporlanacak veri bulunamadı, dosya oluşturulmadı.", 'files_sent' => []];
        } elseif(empty($generatedFiles) && !$overallSuccess) {
             return ['success' => false, 'message' => $finalMessage ?: "Rapor oluşturma sırasında bilinmeyen bir hata oluştu.", 'files_sent' => []];
        }


        // Oluşturulan dosyaları FTP'ye gönder
        foreach ($generatedFiles as $fileInfo) {
            $fileToSend = $fileInfo['gz_file_path']; // .abn.gz veya .xlsx
            $remoteFileName = $fileInfo['file_name_final'];
            $reportTypeInternal = $fileInfo['report_type_internal'] ?? $reportType; // Hangi klasöre gideceğini belirle

            // Ana FTP'ye Gönderim
            $targetFolderAna = ($reportTypeInternal === 'REHBER') ? $settings['ftp_ana_rehber_klasor'] :
                               (($reportTypeInternal === 'HAREKET') ? $settings['ftp_ana_hareket_klasor'] : $settings['ftp_ana_personel_klasor']);

            // $ftpResultAna = FtpService::upload(
            //     $fileToSend, $targetFolderAna, $remoteFileName,
            //     $settings['ftp_ana_host'], $settings['ftp_ana_port'], $settings['ftp_ana_kullanici'], $settings['ftp_ana_sifre'],
            //     $settings['ftp_ana_pasif_mod'] == '1'
            // );
            $ftpResultAna = ['success' => false, 'message' => 'FTP Servisi henüz entegre edilmedi.']; // Placeholder

            if ($ftpResultAna['success']) {
                BtkHelper::logActivity("{$remoteFileName} Ana FTP'ye başarıyla gönderildi.", 0, 'SUCCESS');
                $filesSent[] = $remoteFileName . ' (Ana FTP)';
                // Gönderilen dosyalar tablosuna kayıt
                Capsule::table('mod_btk_gonderilen_dosyalar')->insert([
                    'dosya_adi' => $remoteFileName,
                    'dosya_tipi' => $reportType,
                    'ftp_sunucu_tipi' => 'ANA',
                    'gonderme_zamani' => Carbon::now(),
                    'cnt_numarasi' => substr($remoteFileName, -6, 2), // Dosya adından CNT'yi al
                    'kayit_sayisi' => $fileInfo['record_count']
                ]);
                if ($reportType === 'HAREKET' && !empty($fileInfo['activity_ids'])) {
                    SubscriberActivityService::markActivitiesAsSent($fileInfo['activity_ids'], $remoteFileName, substr($remoteFileName, -6, 2));
                }
            } else {
                $overallSuccess = false;
                $finalMessage .= "{$remoteFileName} Ana FTP'ye gönderilemedi: " . $ftpResultAna['message'] . "\n";
                BtkHelper::logActivity("{$remoteFileName} Ana FTP'ye gönderilemedi: " . $ftpResultAna['message'], 0, 'ERROR');
            }

            // Yedek FTP'ye Gönderim (eğer aktifse)
            if ($settings['yedek_ftp_kullan'] == '1') {
                $targetFolderYedek = ($reportTypeInternal === 'REHBER') ? $settings['ftp_yedek_rehber_klasor'] :
                                   (($reportTypeInternal === 'HAREKET') ? $settings['ftp_yedek_hareket_klasor'] : $settings['ftp_yedek_personel_klasor']);
                $fileNameYedek = $remoteFileName;
                // Yedek FTP için dosya adı formatı farklıysa burada ayarla
                if ($reportTypeInternal === 'PERSONEL' && $settings['personel_excel_ad_format_yedek'] == '1' && $settings['personel_excel_ad_format_ana'] == '0') {
                    // Eğer ana formatta yıl-dönem yoksa ama yedekte varsa, dosya adını yeniden oluştur.
                    $year = $options['year'] ?? Carbon::now()->year;
                    $period = $options['period'] ?? ((Carbon::now()->month <= 6) ? 1 : 2);
                    $fileNameYedek = strtoupper($settings['operator_adi']) . '_Personel_Listesi_' . $year . '_' . $period . '.xlsx';
                }


                // $ftpResultYedek = FtpService::upload(...); // Benzer şekilde FtpService çağrısı
                $ftpResultYedek = ['success' => false, 'message' => 'Yedek FTP Servisi henüz entegre edilmedi.']; // Placeholder

                if ($ftpResultYedek['success']) {
                    BtkHelper::logActivity("{$fileNameYedek} Yedek FTP'ye başarıyla gönderildi.", 0, 'SUCCESS');
                    $filesSent[] = $fileNameYedek . ' (Yedek FTP)';
                     Capsule::table('mod_btk_gonderilen_dosyalar')->insert([ /* Benzer kayıt */ ]);
                } else {
                    // $overallSuccess = false; // Yedek FTP hatası genel başarıyı etkilemeyebilir, loglamak yeterli.
                    $finalMessage .= "{$fileNameYedek} Yedek FTP'ye gönderilemedi: " . $ftpResultYedek['message'] . "\n";
                    BtkHelper::logActivity("{$fileNameYedek} Yedek FTP'ye gönderilemedi: " . $ftpResultYedek['message'], 0, 'WARNING');
                }
            }

            // Geçici dosyaları temizle
            if (isset($fileInfo['file_path'])) @unlink($fileInfo['file_path']);
            if (isset($fileInfo['gz_file_path']) && $fileInfo['gz_file_path'] !== $fileInfo['file_path']) @unlink($fileInfo['gz_file_path']);

        } // foreach ($generatedFiles)

        if ($overallSuccess && !empty($filesSent)) {
            $finalMessage = ($finalMessage ? trim($finalMessage) . "\n" : "") . "Şu dosyalar başarıyla oluşturuldu ve gönderildi: " . implode(', ', $filesSent);
        } elseif (empty($filesSent) && $overallSuccess) {
             $finalMessage = $finalMessage ?: "Raporlanacak veri bulunamadığından veya ayarlar nedeniyle dosya oluşturulmadı/gönderilmedi.";
        }


        return ['success' => $overallSuccess, 'message' => trim($finalMessage), 'files_sent' => $filesSent];
    }

} // Sınıf sonu
?>