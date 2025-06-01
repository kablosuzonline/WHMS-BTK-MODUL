<?php
/**
 * WHMCS BTK Raporlama Modülü - Yardımcı Fonksiyonlar - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
 *
 * Bu dosya, modülün çeşitli yerlerinde kullanılacak merkezi fonksiyonları içerir.
 * Veritabanı işlemleri, veri doğrulama, BTK formatına uygun veri hazırlama,
 * NVI doğrulama, rapor oluşturma, FTP işlemleri vb.
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

use WHMCS\Database\Capsule;
use WHMCS\User\Admin;
use WHMCS\User\Client;
use WHMCS\Order\Order;
use WHMCS\Service\Service;
use WHMCS\Product\Product;
use WHMCS\Module\Addon\BtKReports\Lib\NviSoapClient;

// NviSoapClient sınıfını dahil et
if (file_exists(__DIR__ . '/NviSoapClient.php')) {
    require_once __DIR__ . '/NviSoapClient.php';
} else {
    // Bu durum kritik, NVI doğrulama çalışmaz.
    if (function_exists('logActivity')) {
        logActivity("BTK Raporlama Modülü Kritik Hata: NviSoapClient.php dosyası lib klasöründe bulunamadı!", 0);
    }
     // Admin arayüzünde isek bir hata mesajı göstermeye çalışalım.
    if (defined('ADMINAREA') && !isset($_SESSION['btk_helper_error_shown'])) {
        $_SESSION['btk_helper_error_shown'] = true; // Mesajı tekrar tekrar göstermemek için
        // Bu mesaj WHMCS'in admin arayüzünde bir sonraki sayfa yüklemesinde görünecektir.
        // Direkt echo yerine session mesajı daha uygun olabilir veya modülün kendi hata gösterme mekanizması.
        // Şimdilik loglama ile yetiniyoruz, ana modül dosyasında (btkreports.php) bu durum daha iyi ele alınabilir.
    }
}

// Vendor autoload (Composer kütüphaneleri için - CronExpression, PhpSpreadsheet vb.)
$vendorAutoload = dirname(dirname(__FILE__)) . '/vendor/autoload.php'; // modules/addons/btkreports/vendor/autoload.php
if (file_exists($vendorAutoload)) {
    require_once $vendorAutoload;
}


// --- TEMEL AYAR VE LOGLAMA FONKSİYONLARI ---
if (!function_exists('btk_get_module_setting')) {
    /**
     * Modül ayarlarından bir değeri çeker.
     * @param string $settingKey Ayar anahtarı.
     * @param mixed $defaultValue Ayar bulunamazsa dönecek varsayılan değer.
     * @return mixed Ayar değeri veya varsayılan değer.
     */
    function btk_get_module_setting($settingKey, $defaultValue = null) {
        try {
            $result = Capsule::table('mod_btk_config')->where('setting', $settingKey)->first();
            if ($result) {
                // Şifrelenmiş alanları çöz
                if (($settingKey == 'ftp_password' || $settingKey == 'yedek_ftp_password') && !empty($result->value)) {
                    if (function_exists('decrypt')) { // WHMCS decrypt fonksiyonu
                        return decrypt($result->value);
                    }
                    btk_log_module_action('BTK Ayar Getirme: decrypt() fonksiyonu bulunamadı.', 'ERROR', ['setting' => $settingKey]);
                    return $defaultValue; 
                }
                return $result->value;
            }
        } catch (\Exception $e) { 
            btk_log_module_action('BTK Ayar Getirme Hatası', 'ERROR', ['setting' => $settingKey, 'error' => $e->getMessage()]);
        }
        return $defaultValue;
    }
}

if (!function_exists('btk_save_module_setting')) {
    /**
     * Modül ayarlarına bir değer kaydeder.
     * FTP şifreleri btkreports.php içinde encrypt edilerek bu fonksiyona gönderilir.
     */
    function btk_save_module_setting($settingKey, $settingValue) {
        try {
            Capsule::table('mod_btk_config')->updateOrInsert(
               ['setting' => $settingKey],
               ['value' => $settingValue, 'last_updated' => Capsule::raw('NOW()')]
           );
           return true;
        } catch (\Exception $e) { 
            btk_log_module_action('BTK Ayar Kaydetme Hatası', 'ERROR', ['setting' => $settingKey, 'error' => $e->getMessage()]);
            return false; 
        }
    }
}

if (!function_exists('btk_log_module_action')) {
    /**
     * Modül aktivitelerini loglar.
     */
    function btk_log_module_action($actionDescription, $logType = 'INFO', $details = [], $userId = null, $clientId = null, $serviceId = null) {
        try {
            if (is_null($userId) && isset($_SESSION['adminid'])) {
                $userId = (int)$_SESSION['adminid'];
            }
            $logData = [
                'log_time' => date('Y-m-d H:i:s'),
                'description' => mb_substr($actionDescription, 0, 1000, 'UTF-8'),
                'user_id' => $userId,
                'client_id' => $clientId,
                'service_id' => $serviceId,
                'ip_address' => WHMCS\Utility\Environment\CurrentRequest::getIP(),
                'log_type' => strtoupper(mb_substr($logType, 0, 50, 'UTF-8'))
            ];

            if (!empty($details)) {
                $detailString = ' - Detaylar: ' . json_encode($details, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PARTIAL_OUTPUT_ON_ERROR);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $detailString = ' - Detaylar: (JSON kodlama hatası: ' . json_last_error_msg() . ') ' . print_r($details, true);
                }
                $logData['description'] = mb_substr($actionDescription . $detailString, 0, 65535, 'UTF-8'); // TEXT alanı için
            }

            Capsule::table('mod_btk_logs')->insert($logData);
        } catch (\Exception $e) {
            if (function_exists('logActivity')) { // WHMCS'in kendi loguna yaz
                logActivity("BTK Modülü Loglama Fonksiyonu Hatası ({$logType} - {$actionDescription}): " . $e->getMessage());
            }
        }
    }
}

// --- REFERANS VERİ ÇEKME FONKSİYONLARI ---
if (!function_exists('btk_get_hat_durum_aciklama')) {
    function btk_get_hat_durum_aciklama($kod) {
        try {
            $result = Capsule::table('mod_btk_referans_hat_durum_kodlari')->where('kod', $kod)->first();
            return $result ? $result->hat_durum_aciklama : 'BİLİNMEYEN (' . $kod . ')';
        } catch (\Exception $e) { 
            btk_log_module_action('Hat Durum Açıklaması Getirme Hatası', 'ERROR', ['kod' => $kod, 'error' => $e->getMessage()]);
            return 'HATA (' . $kod . ')'; 
        }
    }
}

if (!function_exists('btk_get_musteri_hareket_aciklama')) {
     function btk_get_musteri_hareket_aciklama($kod) {
        try {
            $result = Capsule::table('mod_btk_referans_musteri_hareket_kodlari')->where('kod', $kod)->first();
            return $result ? $result->aciklama : 'BİLİNMEYEN (' . $kod . ')';
        } catch (\Exception $e) { 
            btk_log_module_action('Müşteri Hareket Açıklaması Getirme Hatası', 'ERROR', ['kod' => $kod, 'error' => $e->getMessage()]);
            return 'HATA (' . $kod . ')'; 
        }
    }
}

if (!function_exists('btk_get_musteri_tipi_aciklama')) { 
    function btk_get_musteri_tipi_aciklama($kod){
        try {
            $result = Capsule::table('mod_btk_referans_musteri_tipleri')->where('musteri_tipi_kodu', $kod)->first();
            return $result ? $result->aciklama : $kod;
        } catch (\Exception $e) { 
            btk_log_module_action('Müşteri Tipi Açıklaması Getirme Hatası', 'ERROR', ['kod' => $kod, 'error' => $e->getMessage()]);
            return $kod; 
        }
    }
}

// lib/btkhelper.php - 2. PARÇA - V2.0.1 - Kararlı Sürüm Adayı

if (!function_exists('btk_get_kimlik_tipi_aciklama')) {
    function btk_get_kimlik_tipi_aciklama($kod){
        try {
            $result = Capsule::table('mod_btk_referans_kimlik_tipleri')->where('belge_tip_kodu', $kod)->first();
            return $result ? $result->belge_adi : $kod;
        } catch (\Exception $e) {
            btk_log_module_action('Kimlik Tipi Açıklaması Getirme Hatası', 'ERROR', ['kod' => $kod, 'error' => $e->getMessage()]);
            return $kod;
        }
    }
}

if (!function_exists('btk_get_hizmet_tipi_aciklama')) {
    function btk_get_hizmet_tipi_aciklama($kod){
        try {
            $result = Capsule::table('mod_btk_referans_hizmet_tipleri')->where('hizmet_turu_kodu', $kod)->first();
            return $result ? $result->deger_aciklama : $kod;
        } catch (\Exception $e) {
            btk_log_module_action('Hizmet Tipi Açıklaması Getirme Hatası', 'ERROR', ['kod' => $kod, 'error' => $e->getMessage()]);
            return $kod;
        }
    }
}


// --- HAREKET LOGLAMA VE SNAPSHOT FORMATLAMA ---
if (!function_exists('btk_log_abone_hareketi')) {
    /**
     * Abone hareketlerini `mod_btk_abone_hareketler` tablosuna loglar.
     * @param int $btkAboneDataId `mod_btk_abone_data` tablosundaki kaydın ID'si.
     * @param string $musteriHareketKodu EK-2'deki hareket kodu.
     * @param string $hareketZamani Hareketin gerçekleştiği zaman (YYYYMMDDHHMMSS).
     * @param array $snapshotData Hareket anındaki `mod_btk_abone_data` kaydının tamamı (dizi olarak).
     * @param string|null $hareketAciklama Opsiyonel, hareket için özel açıklama. Yoksa EK-2'den alınır.
     * @return bool Başarı durumu.
     */
    function btk_log_abone_hareketi($btkAboneDataId, $musteriHareketKodu, $hareketZamani, $snapshotData, $hareketAciklama = null) {
        try {
            if (empty($btkAboneDataId) || empty($musteriHareketKodu) || empty($hareketZamani) || empty($snapshotData)) {
                btk_log_module_action("Abone hareketi loglama için eksik parametre.", "ERROR", ['btk_abone_data_id' => $btkAboneDataId, 'kod' => $musteriHareketKodu]);
                return false;
            }

            if (is_null($hareketAciklama)) {
                $hareketAciklama = btk_get_musteri_hareket_aciklama($musteriHareketKodu);
            }

            // Snapshot verisinin sadece mod_btk_abone_data sütunlarını içerdiğinden emin olalım
            // ve NVI durum alanlarını da ekleyelim (eğer snapshotData'da yoksa bile).
            $btkAboneDataSchema = Capsule::schema()->getColumnListing('mod_btk_abone_data');
            $filteredSnapshot = [];
            foreach($btkAboneDataSchema as $field){
                if(isset($snapshotData[$field])){
                    $filteredSnapshot[$field] = $snapshotData[$field];
                } else {
                    // Eğer snapshot'ta alan yoksa, null olarak ekleyebiliriz veya boş bırakabiliriz.
                    // BTK formatı genellikle boş alan bekler.
                    // NVI alanları snapshot'ta olmayabilir, onları varsayılan olarak ekleyelim.
                    if(in_array($field, ['nvi_tckn_dogrulandi', 'nvi_ykn_dogrulandi'])){
                        $filteredSnapshot[$field] = $snapshotData[$field] ?? 0;
                    } elseif(in_array($field, ['nvi_tckn_son_dogrulama', 'nvi_ykn_son_dogrulama'])){
                         $filteredSnapshot[$field] = $snapshotData[$field] ?? null;
                    }
                }
            }
            
            Capsule::table('mod_btk_abone_hareketler')->insert([
                'btk_abone_data_id' => $btkAboneDataId,
                'musteri_hareket_kodu' => $musteriHareketKodu,
                'musteri_hareket_aciklama' => $hareketAciklama,
                'musteri_hareket_zamani' => $hareketZamani, // YYYYMMDDHHMMSS formatında gelmeli
                'hareket_anindaki_data_snapshot' => json_encode($filteredSnapshot, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE),
                'islem_kayit_zamani' => date('Y-m-d H:i:s'),
                'raporlandi_mi' => 0
            ]);
            btk_log_module_action("Abone hareketi loglandı: ID {$btkAboneDataId}, Kod: {$musteriHareketKodu}", "INFO", ['btk_abone_data_id' => $btkAboneDataId]);
            return true;
        } catch (\Exception $e) {
            btk_log_module_action("Abone hareketi loglanırken hata: Kod {$musteriHareketKodu}", "ERROR", ['btk_abone_data_id' => $btkAboneDataId, 'error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)]);
            return false;
        }
    }
}

if (!function_exists('btk_get_btk_report_field_order_map')) {
    /**
     * Belirli bir BTK rapor yetki tipi için raporda yer alması gereken alanların
     * doğru sıralamasını içeren bir dizi döndürür.
     */
    function btk_get_btk_report_field_order_map($raporYetkiTipi) {
        $baseOrder = [
            'operator_kod', 'musteri_id', 'hat_no', 'hat_durum', 'hat_durum_kodu',
            'musteri_hareket_kodu', 'musteri_hareket_aciklama', 'musteri_hareket_zamani',
            'hizmet_tipi', 'musteri_tipi', 'abone_baslangic', 'abone_bitis',
            'abone_adi', 'abone_soyadi', 'abone_tc_kimlik_no', 'abone_pasaport_no', 'abone_unvan',
            'abone_vergi_numarasi', 'abone_mersis_numarasi', 'abone_cinsiyet', 'abone_uyruk',
            'abone_baba_adi', 'abone_ana_adi', 'abone_anne_kizlik_soyadi', 'abone_dogum_yeri',
            'abone_dogum_tarihi', 'abone_meslek', 'abone_tarife', 'abone_kimlik_cilt_no',
            'abone_kimlik_kutuk_no', 'abone_kimlik_sayfa_no', 'abone_kimlik_il', 'abone_kimlik_ilce',
            'abone_kimlik_mahalle_koy', 'abone_kimlik_tipi', 'abone_kimlik_seri_no',
            'abone_kimlik_verildigi_yer', 'abone_kimlik_verildigi_tarih', 'abone_kimlik_aidiyeti',
            'abone_adres_tesis_il', 'abone_adres_tesis_ilce', 'abone_adres_tesis_mahalle',
            'abone_adres_tesis_cadde', 'abone_adres_tesis_dis_kapi_no', 'abone_adres_tesis_ic_kapi_no',
            'abone_adres_tesis_posta_kodu', 'abone_adres_tesis_adres_kodu',
            'abone_adres_irtibat_tel_no_1', 'abone_adres_irtibat_tel_no_2', 'abone_adres_e_mail',
            'abone_adres_yerlesim_il', 'abone_adres_yerlesim_ilce', 'abone_adres_yerlesim_mahalle',
            'abone_adres_yerlesim_cadde', 'abone_adres_yerlesim_dis_kapi_no', 'abone_adres_yerlesim_ic_kapi_no',
            'abone_adres_yerlesim_no',
            'kurum_yetkili_adi', 'kurum_yetkili_soyadi', 'kurum_yetkili_tckimlik_no', 'kurum_yetkili_telefon', 'kurum_adres',
            'aktivasyon_bayi_adi', 'aktivasyon_bayi_adresi', 'aktivasyon_kullanici',
            'guncelleyen_bayi_adi', 'guncelleyen_bayi_adresi', 'guncelleyen_kullanici',
            'statik_ip'
        ];
        
        $specificFields = [];
        switch (strtoupper($raporYetkiTipi)) {
            case 'ISS':
                $specificFields = ['iss_hiz_profili', 'iss_kullanici_adi', 'iss_pop_bilgisi'];
                break;
            case 'AIH':
                $specificFields = [
                    'aih_hiz_profil', 'aih_hizmet_saglayici', 'aih_pop_bilgi', 'aih_ulke_a',
                    'aih_sinir_gecis_noktasi_a', 'aih_abone_adres_tesis_ulke_b', 'aih_abone_adres_tesis_il_b',
                    'aih_abone_adres_tesis_ilce_b', 'aih_abone_adres_tesis_mahalle_b', 'aih_abone_adres_tesis_cadde_b',
                    'aih_abone_adres_tesis_dis_kapi_no_b', 'aih_abone_adres_tesis_ic_kapi_no_b',
                    'aih_sinir_gecis_noktasi_b', 'aih_devre_adlandirmasi', 'aih_devre_guzergah'
                ];
                break;
            case 'GSM': case 'MOBIL':
                $specificFields = [
                    'gsm_onceki_hat_numarasi', 'gsm_dondurulma_tarihi', 'gsm_kisitlama_tarihi',
                    'gsm_yurtdisi_aktif', 'gsm_sesli_arama_aktif', 'gsm_rehber_aktif',
                    'gsm_clir_ozelligi_aktif', 'gsm_data_aktif', 'gsm_eskart_bilgisi',
                    'gsm_icci', 'gsm_imsi', 'gsm_dual_gsm_no', 'gsm_fax_no',
                    'gsm_vpn_kisakod_arama_aktif', 'gsm_servis_numarasi', 'gsm_bilgi_1',
                    'gsm_bilgi_2', 'gsm_bilgi_3', 'gsm_alfanumerik_baslik'
                ];
                break;
            case 'STH': case 'TT': 
                $specificFields = [
                    'sabit_onceki_hat_numarasi', 'sabit_dondurulma_tarihi', 'sabit_kisitlama_tarihi',
                    'sabit_yurtdisi_aktif', 'sabit_sesli_arama_aktif', 'sabit_rehber_aktif',
                    'sabit_clir_ozelligi_aktif', 'sabit_data_aktif', 'sabit_sehirlerarasi_aktif',
                    'sabit_santral_binasi', 'sabit_santral_tipi', 'sabit_sebeke_hizmet_numarasi',
                    'sabit_pilot_numara', 'sabit_ddi_hizmet_numarasi', 'sabit_gorunen_numara',
                    'sabit_referans_no', 'sabit_ev_isyeri', 'sabit_abone_id',
                    'sabit_servis_numarasi', 'sabit_dahili_no', 'sabit_alfanumerik_baslik'
                ];
                break;
            case 'UYDU': case 'UHH': case 'GMPCS':
                $specificFields = [
                    'uydu_onceki_hat_numarasi', 'uydu_dondurulma_tarihi', 'uydu_kisitlama_tarihi',
                    'uydu_yurtdisi_aktif', 'uydu_sesli_arama_aktif', 'uydu_rehber_aktif',
                    'uydu_clir_ozelligi_aktif', 'uydu_data_aktif', 'uydu_uydu_adi',
                    'uydu_terminal_id', 'uydu_enlem_bilgisi', 'uydu_boylam_bilgisi',
                    'uydu_hiz_profili', 'uydu_pop_bilgisi', 'uydu_remote_bilgisi',
                    'uydu_anauydu_firma', 'uydu_uydu_telefon_no', 'uydu_telefon_serino',
                    'uydu_telefon_imeino', 'uydu_telefon_marka', 'uydu_telefon_model',
                    'uydu_telefon_simkartno', 'uydu_telefonu_internet_kullanimi', 'uydu_alfanumerik_baslik'
                ];
                break;
        }
        return array_merge($baseOrder, $specificFields);
    }
}

if (!function_exists('btk_format_data_for_report_line')) {
    /**
     * Veritabanından alınan bir kayıt dizisini BTK rapor satırı formatına çevirir.
     */
    function btk_format_data_for_report_line($dataArray, $yetkiTipiKodu, $hareketBilgileri = []) {
        $orderedFieldKeys = btk_get_btk_report_field_order_map($yetkiTipiKodu);
        $reportLineValues = [];
        $defaultValues = array_fill_keys($orderedFieldKeys, '');
        $mergedData = array_merge($defaultValues, (array)$dataArray, (array)$hareketBilgileri);
        
        foreach ($orderedFieldKeys as $fieldKey) {
            $value = $mergedData[$fieldKey] ?? ''; 

            if (is_string($value)) {
                 $value = trim((string)$value);
                 $value = str_replace(["\r\n", "\r", "\n", "|", ";"], ' ', $value);
                 if($fieldKey !== 'abone_adres_e_mail'){
                    $value = mb_strtoupper($value, 'UTF-8');
                 }
            } elseif (is_null($value)) {
                $value = ''; 
            } else {
                $value = (string)$value; 
            }
            $reportLineValues[] = $value;
        }
        return $reportLineValues;
    }
}

// --- TARİH FORMATLAMA ---
if (!function_exists('btk_datetime_format_for_display')) {
    function btk_datetime_format_for_display($datetimeStr, $format = 'd.m.Y H:i') {
        if (empty($datetimeStr) || $datetimeStr == '0000-00-00 00:00:00' || $datetimeStr == '0000-00-00') {
            return '';
        }
        try {
            $date = new DateTime($datetimeStr);
            // Eğer sadece tarih (YYYYMMDD) ise, saat eklemeden formatla
            if (preg_match('/^\d{8}$/', str_replace('-', '', $datetimeStr))) {
                 if ($format === 'd.m.Y H:i' || $format === 'd.m.Y H:i:s') { // Sadece tarih varsa, saat kısmını gösterme
                    return $date->format('d.m.Y');
                 }
            }
            return $date->format($format);
        } catch (\Exception $e) {
            return $datetimeStr; // Hata durumunda orijinali döndür
        }
    }
}

if (!function_exists('btk_format_date_for_db')) {
    // GG.AA.YYYY -> YYYYMMDD veya YYYY-MM-DD -> YYYYMMDD
    function btk_format_date_for_db($displayDate) {
        if (empty(trim($displayDate))) return null;
        try {
            if (strpos($displayDate, '.') !== false) { // GG.AA.YYYY formatı
                $date = DateTime::createFromFormat('d.m.Y', $displayDate);
                 if ($date) return $date->format('Ymd');
            } elseif (strpos($displayDate, '-') !== false) { // YYYY-MM-DD formatı
                 $date = new DateTime($displayDate);
                 if ($date) return $date->format('Ymd');
            } elseif (preg_match('/^\d{8}$/', $displayDate)) { // Zaten YYYYMMDD ise
                return $displayDate;
            }
        } catch (\Exception $e) {
            btk_log_module_action("Tarih formatlama hatası (DB için)", "WARNING", ['date' => $displayDate, 'error' => $e->getMessage()]);
        }
        return null; // Geçersiz format veya hata
    }
}

// --- TOOLTIP HTML ---
if (!function_exists('btk_get_tooltip_html')) {
    function btk_get_tooltip_html($text, $placement = 'top') {
        if (empty($text)) return '';
        return ' <i class="fas fa-question-circle text-info" data-toggle="tooltip" data-placement="' . htmlspecialchars($placement) . '" title="' . htmlspecialchars($text) . '"></i>';
    }
}

// --- İLÇE AJAX ---
if (!function_exists('btk_get_ilceler_for_ajax')) {
    function btk_get_ilceler_for_ajax($ilAdi) {
        header('Content-Type: application/json; charset=utf-8');
        $response = ['status' => 'error', 'message' => 'İl adı belirtilmedi.', 'ilceler' => []];
        if (empty($ilAdi)) { echo json_encode($response, JSON_UNESCAPED_UNICODE); exit; }

        try {
            $il = Capsule::table('mod_btk_adres_iller')->where('il_adi', $ilAdi)->first();
            if ($il) {
                $ilceler = Capsule::table('mod_btk_adres_ilceler')->where('il_id', $il->id)->orderBy('ilce_adi')->get()->all();
                $response = ['status' => 'success', 'ilceler' => $ilceler];
            } else {
                $response['message'] = 'Belirtilen il bulunamadı.';
            }
        } catch (\Exception $e) {
            $response['message'] = 'İlçeler getirilirken veritabanı hatası: ' . $e->getMessage();
            btk_log_module_action("İlçe AJAX hatası", "ERROR", ['il_adi' => $ilAdi, 'error' => $e->getMessage()]);
        }
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
}


// lib/btkhelper.php - 3. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

// --- MÜŞTERİ YERLEŞİM ADRESİ ---
if (!function_exists('btk_get_client_yerlesim_adresi_fields')) {
    /**
     * Müşterinin yerleşim adresi alanlarını bir dizi olarak döndürür.
     * Önce mod_btk_abone_data'dan (en son güncellenen hizmetten veya müşteri profilinden),
     * sonra tblclients'tan bakar.
     */
    function btk_get_client_yerlesim_adresi_fields($clientId) {
        $adresFields = null;
        try {
            // Müşteri profilinden (client_details_btk_form) kaydedilmiş genel BTK bilgilerini çekmeyi dene.
            // Bu bilgiler, müşterinin tüm hizmetleri için varsayılan yerleşim adresi olabilir.
            // Veya en son güncellenen HİZMET kaydındaki yerleşim adresini al.
            // Strateji: Müşteriye ait, yerleşim adresi dolu olan en son güncellenmiş btk_abone_data kaydını bul.
            $btkClientYerlesimData = Capsule::table('mod_btk_abone_data')
                                    ->where('whmcs_client_id', $clientId)
                                    ->whereNotNull('abone_adres_yerlesim_il') 
                                    ->orderBy('updated_at', 'desc') 
                                    ->select(
                                        'abone_adres_yerlesim_il', 
                                        'abone_adres_yerlesim_ilce', 
                                        'abone_adres_yerlesim_mahalle', 
                                        'abone_adres_yerlesim_cadde', 
                                        'abone_adres_yerlesim_dis_kapi_no', 
                                        'abone_adres_yerlesim_ic_kapi_no', 
                                        'abone_adres_yerlesim_posta_kodu', 
                                        'abone_adres_yerlesim_no' // UAVT
                                    )
                                    ->first();
            
            if ($btkClientYerlesimData) {
                $adresFields = (array)$btkClientYerlesimData;
            } else {
                // WHMCS tblclients tablosundan temel adres bilgilerini çekmeyi dene
                $client = Client::find($clientId);
                if ($client) {
                    $adresFields = [
                        'abone_adres_yerlesim_il' => $client->city,
                        'abone_adres_yerlesim_ilce' => $client->state,
                        'abone_adres_yerlesim_mahalle' => '', 
                        'abone_adres_yerlesim_cadde' => $client->address1, 
                        'abone_adres_yerlesim_dis_kapi_no' => '', 
                        'abone_adres_yerlesim_ic_kapi_no' => '',
                        'abone_adres_yerlesim_posta_kodu' => $client->postcode,
                        'abone_adres_yerlesim_no' => '', 
                    ];
                }
            }
        } catch (\Exception $e) {
            btk_log_module_action("Müşteri yerleşim adresi alanları çekilirken hata", "ERROR", ['client_id' => $clientId, 'error' => $e->getMessage()]);
        }
        return $adresFields;
    }
}

if (!function_exists('btk_get_client_yerlesim_adresi_for_ajax')) {
    /**
     * AJAX isteği ile gelen client ID'ye göre müşterinin yerleşim adresini JSON olarak döndürür.
     */
    function btk_get_client_yerlesim_adresi_for_ajax($clientId) {
        header('Content-Type: application/json; charset=utf-8');
        $response = ['status' => 'error', 'message' => 'Müşteri yerleşim adresi bulunamadı.', 'adres' => null];
        try {
            if (empty($clientId) || !is_numeric($clientId)) {
                $response['message'] = 'Geçersiz müşteri ID.';
                echo json_encode($response, JSON_UNESCAPED_UNICODE);
                exit;
            }
            $adresFields = btk_get_client_yerlesim_adresi_fields($clientId); 
            if ($adresFields) {
                $response = ['status' => 'success', 'adres' => $adresFields];
            } else {
                $response['message'] = 'Müşteri için kayıtlı yerleşim adresi bulunamadı.';
            }
        } catch (\Exception $e) {
            btk_log_module_action("Müşteri yerleşim adresi AJAX hatası", "ERROR", ['client_id' => $clientId, 'error' => $e->getMessage()]);
            $response['message'] = 'Sunucu hatası oluştu.';
        }
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit; 
    }
}

// --- ARAYÜZ RENDER FONKSİYONLARI ---
if (!function_exists('btk_render_client_details_form_hook')) {
    function btk_render_client_details_form_hook($clientId, $moduleLink, $lang = []) {
        btk_log_module_action("Müşteri #{$clientId} detayları için BTK formu render ediliyor (hook).", "HOOK_DEBUG");
        try {
            $smarty = new \WHMCS\Smarty();
            $smarty->assign('modulelink', $moduleLink);
            $smarty->assign('clientId', $clientId);
            $smarty->assign('_lang', $lang); // WHMCS dil değişkenlerini TPL'e aktar
            $smarty->assign('csrfToken', generate_token('plain'));

            // Müşterinin mevcut BTK verilerini çek (en son güncellenen hizmetten veya müşteri profilinden)
            $btkClientData = [];
            $clientRecord = Client::find($clientId); 
            // Müşterinin en son güncellenmiş BTK verisini bulmaya çalış (herhangi bir hizmetinden)
            $latestBtkRecordForClient = Capsule::table('mod_btk_abone_data')
                                        ->where('whmcs_client_id', $clientId)
                                        ->orderBy('updated_at', 'desc')
                                        ->first();
            if ($latestBtkRecordForClient) {
                $btkClientData = (array)$latestBtkRecordForClient;
            }

            // WHMCS müşteri verilerinden varsayılanları al (eğer BTK'da yoksa)
            if ($clientRecord) {
                $btkClientData['abone_adi'] = $btkClientData['abone_adi'] ?? $clientRecord->firstname;
                $btkClientData['abone_soyadi'] = $btkClientData['abone_soyadi'] ?? $clientRecord->lastname;
                $btkClientData['abone_unvan'] = $btkClientData['abone_unvan'] ?? $clientRecord->companyname;
                $btkClientData['abone_adres_e_mail'] = $btkClientData['abone_adres_e_mail'] ?? $clientRecord->email;
                $btkClientData['abone_adres_yerlesim_il'] = $btkClientData['abone_adres_yerlesim_il'] ?? $clientRecord->city;
                $btkClientData['abone_adres_yerlesim_ilce'] = $btkClientData['abone_adres_yerlesim_ilce'] ?? $clientRecord->state;
                $btkClientData['abone_adres_yerlesim_cadde'] = $btkClientData['abone_adres_yerlesim_cadde'] ?? $clientRecord->address1;
                $btkClientData['abone_adres_yerlesim_posta_kodu'] = $btkClientData['abone_adres_yerlesim_posta_kodu'] ?? $clientRecord->postcode;
                
                $smarty->assign('clientFirstNameForNvi', $clientRecord->firstname);
                $smarty->assign('clientLastNameForNvi', $clientRecord->lastname);
            }
            
            $smarty->assign('formatted_dogum_tarihi', btk_datetime_format_for_display($btkClientData['abone_dogum_tarihi'] ?? ''));
            $smarty->assign('btkClientData', $btkClientData);
            
            $smarty->assign('iller', Capsule::table('mod_btk_adres_iller')->orderBy('il_adi')->get()->all());
            $smarty->assign('kimlikTipleri', Capsule::table('mod_btk_referans_kimlik_tipleri')->orderBy('belge_adi')->get()->all());
            $smarty->assign('musteriTipleri', Capsule::table('mod_btk_referans_musteri_tipleri')->orderBy('aciklama')->get()->all());
            $smarty->assign('kimlikAidiyetleri', Capsule::table('mod_btk_referans_kimlik_aidiyeti')->orderBy('aciklama')->get()->all());
            
            $smarty->assign('info_icon_musteri_tipi', btk_get_tooltip_html($lang['btk_tooltip_musteri_tipi'] ?? 'Müşterinin BTK sistemindeki tipini seçiniz.'));
            $smarty->assign('info_icon_tckn', btk_get_tooltip_html($lang['btk_tooltip_tckn'] ?? 'Bireysel abone ise T.C. Kimlik Numarası. NVI ile doğrulanacaktır.'));
            $smarty->assign('info_icon_pasaport', btk_get_tooltip_html($lang['btk_tooltip_pasaport'] ?? 'Yabancı uyruklu ise Pasaport No veya Yabancı Kimlik No.'));
            $smarty->assign('info_icon_uyruk', btk_get_tooltip_html($lang['btk_tooltip_uyruk'] ?? 'Abone uyruğu (ISO 3166-1 alpha-3 kodu, örn: TUR).'));

            $templatePath = dirname(dirname(__FILE__)) . '/templates/admin/client_details_btk_form.tpl';
            if (file_exists($templatePath)) {
                return [$smarty->fetch($templatePath)];
            } else {
                btk_log_module_action("Client Details BTK Form TPL bulunamadı: {$templatePath}", "ERROR");
            }
        } catch (\Exception $e) {
            btk_log_module_action("Client Details BTK Form Hook hatası", "ERROR", ['clientId' => $clientId, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        }
        return [];
    }
}

if (!function_exists('btk_render_service_details_form_hook')) {
    function btk_render_service_details_form_hook($serviceId, $clientId, $moduleLink, $lang = []) {
        btk_log_module_action("Hizmet #{$serviceId} detayları için BTK formu render ediliyor (hook).", "HOOK_DEBUG");
        try {
            $smarty = new \WHMCS\Smarty();
            $smarty->assign('modulelink', $moduleLink);
            $smarty->assign('serviceId', $serviceId);
            $smarty->assign('clientId', $clientId);
            $smarty->assign('_lang', $lang);
            $smarty->assign('csrfToken', generate_token('plain'));

            $btkAboneData = Capsule::table('mod_btk_abone_data')->where('whmcs_service_id', $serviceId)->first();
            $btkOperasyonelData = Capsule::table('mod_btk_hizmet_operasyonel_data')->where('whmcs_service_id', $serviceId)->first();
            $hosting = Service::find($serviceId); 
            
            $btkAboneDataArray = (array)$btkAboneData;

            if ($hosting) {
                $client = $hosting->client;
                $product = $hosting->product;

                $smarty->assign('defaultHatNo', $btkAboneDataArray['hat_no'] ?? ($hosting->domain ?: ('SRV' . $serviceId)));
                $smarty->assign('defaultTarife', $btkAboneDataArray['abone_tarife'] ?? ($product ? $product->name : ''));
                $smarty->assign('defaultStatikIp', $btkAboneDataArray['statik_ip'] ?? $hosting->dedicatedip);

                if ($client) {
                    $clientBtkProfileData = Capsule::table('mod_btk_abone_data')
                                            ->where('whmcs_client_id', $clientId)
                                            ->orderBy('updated_at', 'desc')
                                            ->first();
                    
                    $btkAboneDataArray['musteri_tipi'] = $btkAboneDataArray['musteri_tipi'] ?? ($clientBtkProfileData->musteri_tipi ?? '');
                    $btkAboneDataArray['abone_adi'] = $btkAboneDataArray['abone_adi'] ?? ($clientBtkProfileData->abone_adi ?? $client->firstname);
                    $btkAboneDataArray['abone_soyadi'] = $btkAboneDataArray['abone_soyadi'] ?? ($clientBtkProfileData->abone_soyadi ?? $client->lastname);
                    // ... (diğer varsayılanlar önceki gibi) ...
                    $smarty->assign('clientFirstNameForNviService', $btkAboneDataArray['abone_adi']);
                    $smarty->assign('clientLastNameForNviService', $btkAboneDataArray['abone_soyadi']);
                }
            }
            
            $smarty->assign('btkAboneData', $btkAboneDataArray);
            $smarty->assign('btkOperasyonelData', (array)$btkOperasyonelData);

            $smarty->assign('formatted_abone_dogum_tarihi', btk_datetime_format_for_display($btkAboneDataArray['abone_dogum_tarihi'] ?? ''));
            $smarty->assign('formatted_abone_kimlik_verildigi_tarih', btk_datetime_format_for_display($btkAboneDataArray['abone_kimlik_verildigi_tarih'] ?? ''));
            
            $serviceBirthYearForNvi = ''; 
            if (isset($btkAboneDataArray['abone_dogum_tarihi']) && preg_match('/^(\d{4})/', $btkAboneDataArray['abone_dogum_tarihi'], $matchesYear)) {
                $serviceBirthYearForNvi = $matchesYear[1];
            }
            $smarty->assign('clientBirthYearForNviService', $serviceBirthYearForNvi);


            // Referans verileri
            $smarty->assign('iller', Capsule::table('mod_btk_adres_iller')->orderBy('il_adi')->get()->all());
            $smarty->assign('hizmetTipleri', Capsule::table('mod_btk_referans_hizmet_tipleri')->orderBy('deger_aciklama')->get()->all());
            $smarty->assign('musteriTipleri', Capsule::table('mod_btk_referans_musteri_tipleri')->orderBy('aciklama')->get()->all());
            $smarty->assign('kimlikTipleri', Capsule::table('mod_btk_referans_kimlik_tipleri')->orderBy('belge_adi')->get()->all());
            $smarty->assign('kimlikAidiyetleri', Capsule::table('mod_btk_referans_kimlik_aidiyeti')->orderBy('aciklama')->get()->all());
            $smarty->assign('meslekKodlari', Capsule::table('mod_btk_referans_meslek_kodlari')->orderBy('meslek_adi')->get()->all());
            $smarty->assign('tanimliYetkiTurleri', Capsule::table('mod_btk_yetki_turleri_tanim')->where('aktif_mi', 1)->orderBy('yetki_kullanici_adi')->get()->all());
            
            $smarty->assign('formActionLink', $moduleLink . '&action=save_service_btk_data');
            
            $smarty->assign('info_icon_hat_no', btk_get_tooltip_html($lang['btk_tooltip_hat_no'] ?? 'Hizmete ait BTK tarafından istenen numara veya tanımlayıcı.'));
            $smarty->assign('info_icon_hizmet_tipi', btk_get_tooltip_html($lang['btk_tooltip_hizmet_tipi_ek3'] ?? 'BTK EK-3\'te tanımlanan hizmet türünü seçiniz.'));
            $smarty->assign('info_icon_rapor_yetki_tipi', btk_get_tooltip_html($lang['btk_tooltip_rapor_yetki_tipi'] ?? 'Bu hizmetin hangi BTK yetki tipi (ISS, AIH vb.) altında raporlanacağını seçiniz.'));
            $smarty->assign('info_icon_tarife', btk_get_tooltip_html($lang['btk_tooltip_tarife'] ?? 'Hizmetin tarife adını giriniz.'));

            $templatePath = dirname(dirname(__FILE__)) . '/templates/admin/service_details_btk_form.tpl';
            if (file_exists($templatePath)) {
                return ['<div id="btkmoduleoutput_service_' . $serviceId . '" class="btk-service-custom-fields">' . $smarty->fetch($templatePath) . '</div>'];
            } else {
                 btk_log_module_action("Service Details BTK Form TPL bulunamadı: {$templatePath}", "ERROR");
            }
        } catch (\Exception $e) {
            btk_log_module_action("Service Details BTK Form Hook hatası", "ERROR", ['serviceId' => $serviceId, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        }
        return [];
    }
}

// --- NVI DOĞRULAMA (AJAX ve Dahili Kullanım için) ---
if (!function_exists('btk_perform_nvi_verification')) {
    /**
     * NVI TCKN veya YKN doğrulamasını yapar ve sonucu JSON olarak döndürür (AJAX için).
     * Veritabanı güncellemesi yapmaz, sadece durumu ve mesajı döndürür, cache'e yazar.
     * isPersonelCheck parametresi, personel NVI sorgularında client/service ID olmadan çağrı yapıldığını belirtir.
     */
    function btk_perform_nvi_verification($type, $id_no, $ad, $soyad, $dogum_input, $clientId = null, $serviceId = null, $isPersonelCheck = false) {
        header('Content-Type: application/json; charset=utf-8');
        $response = ['status' => 'error', 'message' => 'Bilinmeyen bir NVI hatası oluştu.', 'isValid' => false, 'nvi_response_message' => ''];
        $adminId = $_SESSION['adminid'] ?? 0;
        $logDetails = ['type' => $type, 'id_no_masked' => substr($id_no, 0, 3) . str_repeat('*', max(0, strlen($id_no) - 6)) . substr($id_no, -3), 'ad' => $ad, 'soyad' => $soyad, 'dogum_input' => $dogum_input, 'clientId' => $clientId, 'serviceId' => $serviceId, 'isPersonel' => $isPersonelCheck];

        if (empty($id_no) || empty($ad) || empty($soyad) || ($type === 'tckn' && empty($dogum_input)) || ($type === 'ykn' && (empty($dogum_input) || strlen($dogum_input) !== 8 ))) {
            $response['message'] = 'Kimlik No, Ad, Soyad ve Doğum Bilgisi alanları (TCKN için Yıl, YKN için YYYYMMDD) boş olamaz.';
            btk_log_module_action("NVI Doğrulama: Eksik parametreler.", "NVI_VALIDATION_ERROR", $logDetails, $adminId, $clientId, $serviceId);
            echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
        }
            
        if (!class_exists('\WHMCS\Module\Addon\BtKReports\Lib\NviSoapClient')) {
             $response['message'] = 'NVI Doğrulama kütüphanesi (NviSoapClient) bulunamadı.';
             btk_log_module_action("NVI Doğrulama: NviSoapClient sınıfı yüklenemedi.", "CRITICAL_ERROR", $logDetails, $adminId, $clientId, $serviceId);
             echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
        }

        $nviClient = new NviSoapClient();
        $isValid = false;
        $nviResponseMessage = '';

        if ($type === 'tckn') {
            if (!is_numeric($dogum_input) || strlen((string)$dogum_input) !== 4) {
                $response['message'] = 'TCKN doğrulaması için geçerli bir Doğum Yılı (YYYY) gereklidir.';
                btk_log_module_action("NVI TCKN Doğrulama: Geçersiz doğum yılı.", "NVI_VALIDATION_ERROR", $logDetails, $adminId, $clientId, $serviceId);
                echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
            }
            $isValid = $nviClient->TCKimlikNoDogrula($id_no, $ad, $soyad, (int)$dogum_input);
            $nviResponseMessage = $isValid ? 'TCKN Başarıyla Doğrulandı.' : 'TCKN Doğrulanamadı. Bilgiler NVI kayıtlarıyla eşleşmiyor.';
        } elseif ($type === 'ykn') {
            if (!preg_match('/^\d{8}$/', $dogum_input)) { 
                $response['message'] = 'YKN doğrulaması için geçerli bir Doğum Tarihi (YYYYMMDD formatında) gereklidir.';
                btk_log_module_action("NVI YKN Doğrulama: Geçersiz doğum tarihi formatı.", "NVI_VALIDATION_ERROR", $logDetails, $adminId, $clientId, $serviceId);
                echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
            }
            $dogumGun = (int)substr($dogum_input,6,2);
            $dogumAy = (int)substr($dogum_input,4,2);
            $dogumYil = (int)substr($dogum_input,0,4);
            $isValid = $nviClient->YabanciKimlikNoDogrula($id_no, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil);
            $nviResponseMessage = $isValid ? 'YKN Başarıyla Doğrulandı.' : 'YKN Doğrulanamadı. Bilgiler NVI kayıtlarıyla eşleşmiyor.';
        } else {
            $response['message'] = 'Geçersiz doğrulama tipi.';
             btk_log_module_action("NVI Doğrulama: Geçersiz tip.", "NVI_ERROR", $logDetails, $adminId, $clientId, $serviceId);
            echo json_encode($response, JSON_UNESCAPED_UNICODE); exit;
        }

        $response['status'] = 'success';
        $response['isValid'] = (bool)$isValid;
        $response['message'] = $nviResponseMessage;
        $response['nvi_response_message'] = $nviResponseMessage; 
        
        Capsule::table('mod_btk_nvi_cache')->updateOrInsert(
            ['sorgu_tipi' => $type, 'sorgu_parametreleri' => json_encode(['id_no' => $id_no, 'ad' => $ad, 'soyad' => $soyad, 'dogum' => $dogum_input])],
            ['sonuc' => $isValid, 'yanit_detayi' => $response['message'], 'son_sorgu_zamani' => date('Y-m-d H:i:s')]
        );
        btk_log_module_action("NVI {$type} Doğrulama Sonucu (AJAX): " . ($isValid ? 'Başarılı' : 'Başarısız'), $isValid ? "NVI_SUCCESS" : "NVI_FAILURE", $logDetails + ['nvi_response' => $response['message']], $adminId, $clientId, $serviceId);
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// lib/btkhelper.php - 4. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

// --- NVI DOĞRULAMA (DAHİLİ KULLANIM İÇİN) ---
if (!function_exists('btk_internal_nvi_verify')) {
    /**
     * Verilen kimlik bilgilerini NVI üzerinden doğrular (AJAX dışı kullanım için).
     * Veritabanına direkt yazmaz, sadece doğrulama sonucunu döndürür.
     *
     * @param string $type 'tckn' veya 'ykn'
     * @param string $id_no Kimlik numarası
     * @param string $ad Kişinin adı
     * @param string $soyad Kişinin soyadı
     * @param string $dogum_input TCKN için yıl (YYYY), YKN için tam tarih (YYYYMMDD)
     * @param string $logPrefix Log mesajları için ön ek (örn: "Müşteri Kayıt", "Raporlama")
     * @return array ['isValid' => bool, 'message' => string, 'nvi_response_message' => string]
     */
    function btk_internal_nvi_verify($type, $id_no, $ad, $soyad, $dogum_input, $logPrefix = "Dahili NVI") {
        $logDetails = ['type' => $type, 'id_no_masked' => substr($id_no, 0, 3) . str_repeat('*', max(0, strlen($id_no) - 6)) . substr($id_no, -3), 'ad' => $ad, 'soyad' => $soyad, 'dogum_input' => $dogum_input];

        if (empty($id_no) || empty($ad) || empty($soyad) || empty($dogum_input)) {
            btk_log_module_action("{$logPrefix} ({$type}): Eksik parametreler.", "NVI_VALIDATION_ERROR", $logDetails);
            return ['isValid' => false, 'message' => 'Kimlik No, Ad, Soyad ve Doğum Bilgisi alanları boş olamaz.', 'nvi_response_message' => 'Eksik parametreler.'];
        }

        if (!class_exists('\WHMCS\Module\Addon\BtKReports\Lib\NviSoapClient')) {
            btk_log_module_action("{$logPrefix} ({$type}): NviSoapClient sınıfı yüklenemedi.", "CRITICAL_ERROR", $logDetails);
            return ['isValid' => false, 'message' => 'NVI Doğrulama kütüphanesi (NviSoapClient) bulunamadı.', 'nvi_response_message' => 'NVI Kütüphanesi Eksik.'];
        }

        $nviClient = new NviSoapClient();
        $isValid = false;
        $nviResponseMessage = 'Bilinmeyen NVI yanıtı.';

        if ($type === 'tckn') {
            if (!is_numeric($dogum_input) || strlen((string)$dogum_input) !== 4) {
                btk_log_module_action("{$logPrefix} TCKN: Geçersiz doğum yılı.", "NVI_VALIDATION_ERROR", $logDetails);
                return ['isValid' => false, 'message' => 'TCKN doğrulaması için geçerli bir Doğum Yılı (YYYY) gereklidir.', 'nvi_response_message' => 'Geçersiz doğum yılı.'];
            }
            $isValid = $nviClient->TCKimlikNoDogrula($id_no, $ad, $soyad, (int)$dogum_input);
            $nviResponseMessage = $isValid ? 'TCKN Başarıyla Doğrulandı.' : 'TCKN Doğrulanamadı. Bilgiler NVI kayıtlarıyla eşleşmiyor veya servis hatası.';
        } elseif ($type === 'ykn') {
            if (!preg_match('/^\d{8}$/', $dogum_input)) { // YYYYMMDD
                btk_log_module_action("{$logPrefix} YKN: Geçersiz doğum tarihi formatı.", "NVI_VALIDATION_ERROR", $logDetails);
                return ['isValid' => false, 'message' => 'YKN doğrulaması için geçerli bir Doğum Tarihi (YYYYMMDD formatında) gereklidir.', 'nvi_response_message' => 'Geçersiz doğum tarihi formatı.'];
            }
            $dogumGun = (int)substr($dogum_input,6,2);
            $dogumAy = (int)substr($dogum_input,4,2);
            $dogumYil = (int)substr($dogum_input,0,4);
            $isValid = $nviClient->YabanciKimlikNoDogrula($id_no, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil);
            $nviResponseMessage = $isValid ? 'YKN Başarıyla Doğrulandı.' : 'YKN Doğrulanamadı. Bilgiler NVI kayıtlarıyla eşleşmiyor veya servis hatası.';
        } else {
            btk_log_module_action("{$logPrefix}: Geçersiz doğrulama tipi.", "NVI_ERROR", $logDetails);
            return ['isValid' => false, 'message' => 'Geçersiz doğrulama tipi.', 'nvi_response_message' => 'Geçersiz NVI tipi.'];
        }
        
        // Cache'e yaz
        Capsule::table('mod_btk_nvi_cache')->updateOrInsert(
            ['sorgu_tipi' => $type, 'sorgu_parametreleri' => json_encode(['id_no' => $id_no, 'ad' => $ad, 'soyad' => $soyad, 'dogum' => $dogum_input])],
            ['sonuc' => $isValid, 'yanit_detayi' => $nviResponseMessage, 'son_sorgu_zamani' => date('Y-m-d H:i:s')]
        );
        btk_log_module_action("{$logPrefix} {$type} ({$id_no}) Sonucu: " . ($isValid ? 'Başarılı' : 'Başarısız'), $isValid ? "NVI_SUCCESS" : "NVI_FAILURE", ['response' => $nviResponseMessage] + $logDetails);
        
        return ['isValid' => (bool)$isValid, 'message' => $nviResponseMessage, 'nvi_response_message' => $nviResponseMessage];
    }
}

// --- MÜŞTERİ VERİ GÜNCELLEME (NVI Entegrasyonu ile) ---
if (!function_exists('btk_handle_client_data_update')) {
    /**
     * Müşteri profili sayfasındaki BTK özel alanlarından gelen verileri işler.
     * Bu fonksiyon, müşterinin tüm hizmetlerindeki mod_btk_abone_data kayıtlarını güncelleyebilir
     * veya sadece müşteri bazlı bir BTK kaydı tutuyorsa onu günceller.
     * Mevcut yapıda, her hizmetin kendi BTK kaydı olduğundan, bu fonksiyon
     * genellikle müşterinin "varsayılan" BTK bilgilerini güncellemek için kullanılabilir.
     * Ya da müşterinin tüm hizmetlerindeki ortak alanları güncelleyebilir.
     * Şimdilik, müşterinin tüm hizmetlerindeki BTK kayıtlarında ortak alanları güncelleyeceğiz.
     */
    function btk_handle_client_data_update($clientId, $postData) {
        $adminId = $_SESSION['adminid'] ?? 0;
        btk_log_module_action("Müşteri #{$clientId} BTK verileri güncelleniyor (AdminClientProfileTabFieldsSave hook).", "INFO", ['post_keys_count' => count($postData)], $adminId, $clientId);
        
        $btkClientFormData = $postData['btk_client_data'] ?? [];
        if (empty($btkClientFormData)) {
            return ['status' => 'info', 'message' => 'Kaydedilecek BTK verisi bulunamadı.'];
        }

        $clientRecord = Client::find($clientId);
        if (!$clientRecord) {
            btk_log_module_action("Müşteri #{$clientId} BTK veri güncelleme: WHMCS müşteri kaydı bulunamadı.", "ERROR", [], $adminId, $clientId);
            return ['status' => 'error', 'message' => 'Müşteri kaydı bulunamadı.'];
        }
        
        $dataToApplyToServices = [];
        $nviHatasiVar = false;

        // Tarihleri formatla
        if (isset($btkClientFormData['abone_dogum_tarihi_display'])) {
            $btkClientFormData['abone_dogum_tarihi'] = btk_format_date_for_db($btkClientFormData['abone_dogum_tarihi_display']);
        }
        // Diğer tarihler (kimlik veriliş vb.) burada forma göre eklenebilir.

        // TCKN Doğrulaması ve Hazırlığı
        $tcknToSave = isset($btkClientFormData['abone_tc_kimlik_no']) ? trim($btkClientFormData['abone_tc_kimlik_no']) : null;
        $adForNvi = $btkClientFormData['abone_adi'] ?? $clientRecord->firstname; // Formdan gelmiyorsa WHMCS'ten al
        $soyadForNvi = $btkClientFormData['abone_soyadi'] ?? $clientRecord->lastname;
        $dogumYiliForNvi = null;
        if(!empty($btkClientFormData['abone_dogum_tarihi'])) { // YYYYMMDD formatında
            if(strlen($btkClientFormData['abone_dogum_tarihi']) === 8) $dogumYiliForNvi = substr($btkClientFormData['abone_dogum_tarihi'], 0, 4);
        }

        if (!empty($tcknToSave)) {
            if (empty($dogumYiliForNvi)) {
                btk_log_module_action("Müşteri #{$clientId} TCKN NVI doğrulaması için doğum yılı eksik (kayıt sırasında).", "NVI_WARNING", ['tckn' => $tcknToSave], $adminId, $clientId);
                $_SESSION['btk_errormessage_clientprofile'] = "TCKN ({$tcknToSave}) NVI doğrulaması için doğum yılı girilmelidir. TCKN kaydedilmedi/güncellenmedi.";
                $nviHatasiVar = true;
                $dataToApplyToServices['abone_tc_kimlik_no'] = null; // Hatalı TCKN'yi kaydetme/güncelleme
                $dataToApplyToServices['nvi_tckn_dogrulandi'] = 0;
                $dataToApplyToServices['nvi_tckn_son_dogrulama'] = date('Y-m-d H:i:s');
            } else {
                $nviResult = btk_internal_nvi_verify('tckn', $tcknToSave, $adForNvi, $soyadForNvi, $dogumYiliForNvi, "Müşteri #{$clientId} TCKN Kayıt");
                $dataToApplyToServices['nvi_tckn_dogrulandi'] = $nviResult['isValid'] ? 1 : 0;
                $dataToApplyToServices['nvi_tckn_son_dogrulama'] = date('Y-m-d H:i:s');
                if (!$nviResult['isValid']) {
                    $_SESSION['btk_errormessage_clientprofile'] = "Girilen T.C. Kimlik Numarası ({$tcknToSave}) doğrulanamadı. {$nviResult['message']} Lütfen bilgileri kontrol edin. TCKN kaydedilmedi/güncellenmedi.";
                    $nviHatasiVar = true;
                    $dataToApplyToServices['abone_tc_kimlik_no'] = null;
                } else {
                    $dataToApplyToServices['abone_tc_kimlik_no'] = $tcknToSave; // Doğruysa kaydet
                }
            }
        } else { // TCKN boşsa veya boşaltıldıysa
            $dataToApplyToServices['abone_tc_kimlik_no'] = null;
            $dataToApplyToServices['nvi_tckn_dogrulandi'] = 0;
            $dataToApplyToServices['nvi_tckn_son_dogrulama'] = null;
        }

        // TODO: Yabancı Kimlik No (abone_pasaport_no) için benzer NVI doğrulama mantığı
        // if (!empty($btkClientFormData['abone_pasaport_no']) && ($btkClientFormData['abone_uyruk'] ?? 'TUR') !== 'TUR') { ... }

        // Diğer alanları $dataToApplyToServices dizisine ekle
        $fieldsToUpdateFromClientProfile = [
            'musteri_tipi', 'abone_adi', 'abone_soyadi', 'abone_unvan', 
            'abone_vergi_numarasi', 'abone_mersis_numarasi', 
            'abone_uyruk', 'abone_dogum_tarihi',
            'abone_adres_yerlesim_il', 'abone_adres_yerlesim_ilce', 'abone_adres_yerlesim_mahalle',
            'abone_adres_yerlesim_cadde', 'abone_adres_yerlesim_dis_kapi_no', 
            'abone_adres_yerlesim_ic_kapi_no', 'abone_adres_yerlesim_posta_kodu', 
            'abone_adres_yerlesim_no'
            // Diğer kimlik ve adres alanları buraya eklenebilir
        ];

        foreach ($fieldsToUpdateFromClientProfile as $field) {
            if (array_key_exists($field, $btkClientFormData)) { 
                $newValue = trim($btkClientFormData[$field]);
                $dataToApplyToServices[$field] = ($newValue === '') ? null : $newValue;
            }
        }
        
        if (empty($dataToApplyToServices) && !$nviHatasiVar) { // NVI hatası yoksa ve güncellenecek veri de yoksa
            $_SESSION['btk_infomessage'] = "Müşteri BTK verilerinde kaydedilecek bir değişiklik bulunamadı.";
            return ['status' => 'info', 'message' => 'Değişiklik yok.'];
        }
        if ($nviHatasiVar && empty(array_diff_key($dataToApplyToServices, array_flip(['abone_tc_kimlik_no', 'nvi_tckn_dogrulandi', 'nvi_tckn_son_dogrulama'])))) {
            // Sadece TCKN hatası var ve başka güncellenecek alan yoksa, işlem yapma (hata mesajı zaten session'da)
            return ['status' => 'error', 'message' => $_SESSION['btk_errormessage_clientprofile']];
        }


        $dataToApplyToServices['updated_at'] = date('Y-m-d H:i:s');
        $anyRecordActuallyChanged = false;

        try {
            // Müşteriye ait tüm hizmetlerin BTK kayıtlarını bul ve ortak alanları güncelle
            // Bu strateji, müşteri profilindeki değişikliğin tüm hizmetlere yansımasını sağlar.
            // Alternatif olarak, sadece bir "ana" müşteri BTK kaydı tutulabilir.
            $clientBtkServiceRecords = Capsule::table('mod_btk_abone_data')->where('whmcs_client_id', $clientId)->get();

            if ($clientBtkServiceRecords->isEmpty() && !empty($dataToApplyToServices)) {
                // Müşterinin hiç hizmeti yoksa veya hizmetlerinin BTK kaydı yoksa ne yapılmalı?
                // Bu veriler, yeni bir hizmet eklendiğinde varsayılan olarak kullanılabilir.
                // Şimdilik sadece loglayıp bilgi verelim.
                btk_log_module_action("Müşteri #{$clientId} için BTK verisi güncellenmek istendi ancak ilişkili aktif BTK hizmet kaydı bulunamadı.", "WARNING", $dataToApplyToServices, $adminId, $clientId);
                $_SESSION['btk_infomessage'] = "Müşteri BTK bilgileri alındı. Eğer aktif hizmetleri varsa, bu bilgiler o hizmetlere yansıtılacaktır.";
                // Veya bir "müşteri profili BTK" tablosu oluşturup oraya yazılabilir.
                // Geçici çözüm: Müşteri için bir tane "şablon" kayıt oluşturulabilir (whmcs_service_id = 0 veya null)
                 Capsule::table('mod_btk_abone_data')->updateOrInsert(
                    ['whmcs_client_id' => $clientId, 'whmcs_service_id' => 0], // service_id=0 müşteri şablonu
                    $dataToApplyToServices
                );
                 return ['status' => 'success', 'message' => 'Müşteri BTK şablon bilgileri güncellendi.'];
            }
            
            $updatedServiceIds = [];
            foreach ($clientBtkServiceRecords as $btkAboneDataRecord) {
                $currentServiceData = (array)$btkAboneDataRecord;
                $dataForThisService = $dataToApplyToServices; // Her hizmet için güncellenecek verileri al

                // Hizmete özel bazı alanların (örn: hat_no, btk_rapor_yetki_tipi_kodu)
                // müşteri profilinden toplu güncellenmemesi gerekebilir.
                // Bu yüzden $dataToApplyToServices'i filtreleyebiliriz.
                // Şimdilik tüm ortak alanların güncellendiğini varsayıyoruz.

                $specificServiceChanges = array_diff_assoc($dataForThisService, $currentServiceData);
                if (!empty($specificServiceChanges)) {
                    Capsule::table('mod_btk_abone_data')->where('id', $btkAboneDataRecord->id)->update($dataForThisService);
                    $anyRecordActuallyChanged = true;
                    $updatedServiceIds[] = $btkAboneDataRecord->whmcs_service_id;

                    // Hareket logla (Müşteri Bilgi Güncelleme)
                    // Sadece onaylanmış ve gerçekten değişen kayıtlar için
                    if ($btkAboneDataRecord->btk_onay_durumu === 'Onaylandi') {
                         // Snapshot için güncellenmiş kaydı tekrar çek
                        $updatedSnapshot = Capsule::table('mod_btk_abone_data')->find($btkAboneDataRecord->id);
                        btk_log_abone_hareketi($btkAboneDataRecord->id, '11', date('YmdHis'), (array)$updatedSnapshot, 'MÜŞTERİ BİLGİ GÜNCELLEME (Profil)');
                    }
                }
            }
            
            if ($nviHatasiVar && !$anyRecordActuallyChanged){ // Sadece NVI hatası oldu, başka değişiklik yok
                return ['status' => 'error', 'message' => $_SESSION['btk_errormessage_clientprofile']];
            } elseif ($anyRecordActuallyChanged) {
                $_SESSION['btk_successmessage'] = "Müşteri BTK bilgileri ilişkili hizmetlere başarıyla yansıtıldı. ({$updatedServiceIds_count} hizmet etkilendi)";
                btk_log_module_action("Müşteri #{$clientId} BTK bilgileri güncellendi ve ".count($updatedServiceIds)." hizmete yansıtıldı.", "SUCCESS", ['updated_fields_count' => count($dataToApplyToServices)], $adminId, $clientId);
                return ['status' => 'success'];
            } else {
                 if(!isset($_SESSION['btk_errormessage_clientprofile'])) {
                     $_SESSION['btk_infomessage'] = "Müşteri BTK verilerinde kaydedilecek bir değişiklik bulunamadı.";
                 }
                return ['status' => 'info'];
            }

        } catch (\Exception $e) {
            btk_log_module_action("Müşteri #{$clientId} BTK verileri güncellenirken hata", "ERROR", ['error' => $e->getMessage()], $adminId, $clientId);
            $_SESSION['btk_errormessage'] = "Müşteri BTK bilgileri güncellenirken bir hata oluştu: " . $e->getMessage();
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}

// lib/btkhelper.php - 5. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

// --- SİPARİŞ VE HİZMET İŞLEME FONKSİYONLARI (Devamı - NVI Entegrasyonu ile) ---

if (!function_exists('btk_handle_service_data_update_from_form')) {
    /**
     * Hizmet detayları sayfasındaki BTK formundan gelen verileri işler.
     * Hem mod_btk_abone_data hem de mod_btk_hizmet_operasyonel_data tablolarını günceller.
     * NVI doğrulaması yapar, hatalıysa TCKN/YKN kaydetmez/güncellemez.
     * Gerekirse hareket loglar.
     * @param int $serviceId
     * @param int $clientId
     * @param array $postData Formdan gelen tüm POST verileri (btk_abone_data[] ve op_[] dizilerini içermeli)
     * @param int $adminId
     * @return array ['status' => 'success'/'error'/'info', 'message' => '...']
     */
    function btk_handle_service_data_update_from_form($serviceId, $clientId, $postData, $adminId) {
        btk_log_module_action("Hizmet #{$serviceId} BTK Form Verileri Kaydediliyor.", "INFO", ['post_keys_count' => count($postData)], $adminId, $clientId, $serviceId);
        
        $btkAboneFormData = $postData['btk_abone_data'] ?? [];
        $operasyonelFormData = []; 
        foreach($postData as $key => $value){
            if(strpos($key, 'op_') === 0){
                $operasyonelFormData[substr($key, 3)] = $value;
            }
        }

        $nviHatasiVar = false;
        $nviHataMesaji = '';

        try {
            $btkAboneData = Capsule::table('mod_btk_abone_data')
                            ->where('whmcs_service_id', $serviceId)
                            ->first();
            
            $hosting = Service::find($serviceId);
            $client = $hosting ? $hosting->client : null;
            $product = $hosting ? $hosting->product : null;

            if (!$hosting || !$client) {
                return ['status' => 'error', 'message' => 'WHMCS hizmet veya müşteri kaydı bulunamadı.'];
            }

            // Formdan gelen verilerle NVI doğrulaması ve veri hazırlığı
            $adForNvi = $btkAboneFormData['abone_adi'] ?? ($btkAboneData->abone_adi ?? $client->firstname);
            $soyadForNvi = $btkAboneFormData['abone_soyadi'] ?? ($btkAboneData->abone_soyadi ?? $client->lastname);
            $dogumTarihiDisplay = $btkAboneFormData['abone_dogum_tarihi_display'] ?? null; // GG.AA.YYYY
            $dogumTarihiDbFormat = $btkAboneFormData['abone_dogum_tarihi'] ?? null; // YYYYMMDD (hidden input'tan)

            $dogumYiliForNvi = null;
            $dogumTarihiForYkn = null;

            if (!empty($dogumTarihiDisplay)) { // Önce display'e bak
                $parsedDbDate = btk_format_date_for_db($dogumTarihiDisplay);
                if ($parsedDbDate && strlen($parsedDbDate) === 8) {
                    $dogumYiliForNvi = substr($parsedDbDate, 0, 4);
                    $dogumTarihiForYkn = $parsedDbDate;
                    $btkAboneFormData['abone_dogum_tarihi'] = $parsedDbDate; // Form verisini güncelle
                }
            } elseif (!empty($dogumTarihiDbFormat) && strlen($dogumTarihiDbFormat) === 8) { // Sonra hidden input'a bak
                $dogumYiliForNvi = substr($dogumTarihiDbFormat, 0, 4);
                $dogumTarihiForYkn = $dogumTarihiDbFormat;
                 // $btkAboneFormData['abone_dogum_tarihi'] zaten bu değerde
            }

            // TCKN İşlemleri
            $tcknToSave = isset($btkAboneFormData['abone_tc_kimlik_no']) ? trim($btkAboneFormData['abone_tc_kimlik_no']) : null;
            if (!empty($tcknToSave)) {
                if (empty($dogumYiliForNvi)) {
                    $nviHataMesaji = "TCKN ({$tcknToSave}) NVI doğrulaması için doğum yılı girilmelidir. TCKN kaydedilmedi/güncellenmedi.";
                    $nviHatasiVar = true;
                    $btkAboneFormData['abone_tc_kimlik_no'] = $btkAboneData->abone_tc_kimlik_no ?? null; // Eski değeri koru veya boşalt
                    $btkAboneFormData['nvi_tckn_dogrulandi'] = 0;
                    $btkAboneFormData['nvi_tckn_son_dogrulama'] = date('Y-m-d H:i:s');
                } else {
                    $nviResult = btk_internal_nvi_verify('tckn', $tcknToSave, $adForNvi, $soyadForNvi, $dogumYiliForNvi, "Hizmet #{$serviceId} TCKN Kayıt");
                    $btkAboneFormData['nvi_tckn_dogrulandi'] = $nviResult['isValid'] ? 1 : 0;
                    $btkAboneFormData['nvi_tckn_son_dogrulama'] = date('Y-m-d H:i:s');
                    if (!$nviResult['isValid']) {
                        $nviHataMesaji = "Girilen T.C. Kimlik Numarası ({$tcknToSave}) doğrulanamadı. {$nviResult['message']} TCKN kaydedilmedi/güncellenmedi.";
                        $nviHatasiVar = true;
                        $btkAboneFormData['abone_tc_kimlik_no'] = $btkAboneData->abone_tc_kimlik_no ?? null;
                    }
                }
            } else {
                 $btkAboneFormData['nvi_tckn_dogrulandi'] = 0;
                 $btkAboneFormData['nvi_tckn_son_dogrulama'] = null;
            }

            // YKN İşlemleri
            $yknToSave = isset($btkAboneFormData['abone_pasaport_no']) ? trim($btkAboneFormData['abone_pasaport_no']) : null;
            $uyrukForYkn = $btkAboneFormData['abone_uyruk'] ?? ($btkAboneData->abone_uyruk ?? 'TUR');
            if (!empty($yknToSave) && strtoupper($uyrukForYkn) !== 'TUR') {
                if (empty($dogumTarihiForYkn)) {
                     if(empty($nviHataMesaji)) $nviHataMesaji = "YKN ({$yknToSave}) NVI doğrulaması için doğum tarihi (GG.AA.YYYY formatında) girilmelidir. YKN kaydedilmedi/güncellenmedi.";
                     else $nviHataMesaji .= " Ayrıca YKN ({$yknToSave}) NVI doğrulaması için doğum tarihi (GG.AA.YYYY formatında) girilmelidir. YKN kaydedilmedi/güncellenmedi.";
                     $nviHatasiVar = true;
                     $btkAboneFormData['abone_pasaport_no'] = $btkAboneData->abone_pasaport_no ?? null;
                     $btkAboneFormData['nvi_ykn_dogrulandi'] = 0;
                     $btkAboneFormData['nvi_ykn_son_dogrulama'] = date('Y-m-d H:i:s');
                } else {
                    $nviResultYkn = btk_internal_nvi_verify('ykn', $yknToSave, $adForNvi, $soyadForNvi, $dogumTarihiForYkn, "Hizmet #{$serviceId} YKN Kayıt");
                    $btkAboneFormData['nvi_ykn_dogrulandi'] = $nviResultYkn['isValid'] ? 1 : 0;
                    $btkAboneFormData['nvi_ykn_son_dogrulama'] = date('Y-m-d H:i:s');
                    if (!$nviResultYkn['isValid']) {
                        if(empty($nviHataMesaji)) $nviHataMesaji = "Girilen Yabancı Kimlik No ({$yknToSave}) doğrulanamadı. {$nviResultYkn['message']} YKN kaydedilmedi/güncellenmedi.";
                        else $nviHataMesaji .= " Ayrıca Yabancı Kimlik No ({$yknToSave}) doğrulanamadı. {$nviResultYkn['message']} YKN kaydedilmedi/güncellenmedi.";
                        $nviHatasiVar = true;
                        $btkAboneFormData['abone_pasaport_no'] = $btkAboneData->abone_pasaport_no ?? null;
                    }
                }
            } elseif (strtoupper($uyrukForYkn) === 'TUR' && !empty($yknToSave)) {
                $btkAboneFormData['abone_pasaport_no'] = null;
                $btkAboneFormData['nvi_ykn_dogrulandi'] = 0;
                $btkAboneFormData['nvi_ykn_son_dogrulama'] = null;
            } else {
                 $btkAboneFormData['nvi_ykn_dogrulandi'] = 0;
                 $btkAboneFormData['nvi_ykn_son_dogrulama'] = null;
            }

            if ($nviHatasiVar) {
                $_SESSION['btk_errormessage_service'] = $nviHataMesaji;
                $_SESSION['btk_errormessage_service_id'] = $serviceId;
                // Hata durumunda sadece NVI alanlarını güncelle, TCKN/YKN'yi eski halinde bırak veya null yap (yukarıda yapıldı)
                // ve diğer alanların güncellenmesine izin verilebilir ya da işlem tamamen durdurulabilir.
                // Şimdilik diğer alanlar güncellenecek.
            }
            
            // Tarih formatlamaları (display'den gelenler için)
            if (isset($btkAboneFormData['abone_kimlik_verildigi_tarih_display'])) {
                $btkAboneFormData['abone_kimlik_verildigi_tarih'] = btk_format_date_for_db($btkAboneFormData['abone_kimlik_verildigi_tarih_display']);
            }
            $char14Fields = ['gsm_dondurulma_tarihi', 'gsm_kisitlama_tarihi', 'sabit_dondurulma_tarihi', 'sabit_kisitlama_tarihi', 'uydu_dondurulma_tarihi', 'uydu_kisitlama_tarihi'];
            foreach($char14Fields as $field){ /* ... önceki gibi ... */ }


            $aboneDataToUpdateOrInsert = [];
            $btkAboneDataSchema = Capsule::schema()->getColumnListing('mod_btk_abone_data');
            $fieldsToExcludeFromAboneData = ['id', 'whmcs_service_id', 'whmcs_client_id', 'created_at', 'updated_at', 'btk_onay_durumu', 
                                             'operator_kod', 'musteri_id', 'abone_baslangic', 'abone_bitis', 
                                             'hat_durum', 'hat_durum_kodu', 'hat_durum_kodu_aciklama'];
            
            foreach ($btkAboneDataSchema as $dbField) {
                if (in_array($dbField, $fieldsToExcludeFromAboneData)) continue;
                if (array_key_exists($dbField, $btkAboneFormData)) { 
                    $aboneDataToUpdateOrInsert[$dbField] = $btkAboneFormData[$dbField] === '' ? null : trim($btkAboneFormData[$dbField]);
                }
            }
            // NVI durumları zaten $btkAboneFormData içinde güncellendi veya ayarlandı.
            
            $aboneDataToUpdateOrInsert['yerlesim_adresi_ayni'] = (isset($btkAboneFormData['yerlesim_adresi_ayni']) && ($btkAboneFormData['yerlesim_adresi_ayni'] == '1' || $btkAboneFormData['yerlesim_adresi_ayni'] == 'on')) ? 1 : 0;
            if ($aboneDataToUpdateOrInsert['yerlesim_adresi_ayni'] == 1 && function_exists('btk_get_client_yerlesim_adresi_fields')) { /* ... önceki gibi ... */ }


            $operasyonelDataToUpdateOrInsert = [];
            /* ... operasyonel veri hazırlama önceki gibi ... */

            $movementLogged = false;
            $aboneDataActuallyChanged = false;
            $operasyonelDataActuallyChanged = false;

            Capsule::connection()->beginTransaction();
            try {
                $currentBtkAboneDataId = null;
                if ($btkAboneData) { 
                    $currentBtkAboneDataId = $btkAboneData->id;
                    if (!empty($aboneDataToUpdateOrInsert)) {
                        // ... (değişiklik kontrolü ve update) ...
                    }
                } else { 
                    // ... (yeni kayıt oluşturma, NVI alanları dahil) ...
                }

                if (!empty($operasyonelDataToUpdateOrInsert)) {
                    // ... (operasyonel veri kaydetme) ...
                }
                
                $finalBtkAboneDataForLog = Capsule::table('mod_btk_abone_data')->find($currentBtkAboneDataId);
                if ($aboneDataActuallyChanged && $finalBtkAboneDataForLog && $finalBtkAboneDataForLog->btk_onay_durumu === 'Onaylandi') {
                    // ... (hareket loglama) ...
                }
                Capsule::connection()->commit();
                
                $message = '';
                if ($nviHatasiVar) $message .= $nviHataMesaji . ' ';
                if ($aboneDataActuallyChanged) $message .= 'BTK abone verileri başarıyla kaydedildi. ';
                // ... (diğer mesajlar) ...
                
                return ['status' => ($nviHatasiVar ? 'error' : ($aboneDataActuallyChanged || $operasyonelDataActuallyChanged ? 'success' : 'info')), 
                        'message' => trim($message)];

            } catch (\Exception $e) {
                Capsule::connection()->rollBack();
                // ... (hata loglama ve dönüş) ...
            }

        } catch (\Exception $e) {
            // ... (hata loglama ve dönüş) ...
        }
    }
}

// lib/btkhelper.php - 6. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

// --- PERSONEL YÖNETİMİ FONKSİYONLARI (NVI Entegrasyonu ile) ---

if (!function_exists('btk_get_personel_listesi')) {
    /**
     * Modülün personel listesini veritabanından çeker.
     * WHMCS admin bilgileriyle birleştirir.
     */
    function btk_get_personel_listesi() {
        try {
            return Capsule::table('mod_btk_personel')
                        ->leftJoin('tbladmins', 'mod_btk_personel.whmcs_admin_id', '=', 'tbladmins.id')
                        ->select(
                            'mod_btk_personel.*', 
                            'tbladmins.username as whmcs_username', 
                            Capsule::raw('COALESCE(mod_btk_personel.adi, tbladmins.firstname) as adi'), 
                            Capsule::raw('COALESCE(mod_btk_personel.soyadi, tbladmins.lastname) as soyadi'),
                            Capsule::raw('COALESCE(mod_btk_personel.e_posta_adresi, tbladmins.email) as e_posta_adresi')
                        )
                        ->orderBy('mod_btk_personel.soyadi', 'asc')
                        ->orderBy('mod_btk_personel.adi', 'asc')
                        ->get();
        } catch (\Exception $e) {
            btk_log_module_action("Personel listesi çekilirken hata", "ERROR", ['error' => $e->getMessage()]);
            return collect(); // Boş koleksiyon döndür
        }
    }
}

if (!function_exists('btk_save_personel_details')) {
    /**
     * Personel detaylarını kaydeder veya günceller.
     * NVI doğrulaması yapar, hatalıysa TCKN kaydetmez.
     */
    function btk_save_personel_details($personelId, $postData, $adminId) {
        btk_log_module_action("Personel #{$personelId} detayları kaydediliyor.", "INFO", ['post_data_keys' => array_keys($postData)], $adminId, null, $personelId);

        if (!$personelId || !is_numeric($personelId) || $personelId <= 0) {
             return ['status' => 'error', 'message' => 'Geçersiz personel IDsi.'];
        }

        $personel = Capsule::table('mod_btk_personel')->find($personelId);
        if (!$personel) {
            return ['status' => 'error', 'message' => 'Personel kaydı bulunamadı.'];
        }

        $dataToSave = [
            'gorev_unvani' => isset($postData['gorev_unvani']) ? trim($postData['gorev_unvani']) : null,
            'calistigi_birim' => isset($postData['calistigi_birim']) ? trim($postData['calistigi_birim']) : null,
            'mobil_telefonu' => isset($postData['mobil_telefonu']) ? preg_replace('/[^0-9]/', '', $postData['mobil_telefonu']) : null,
            'sabit_telefonu' => isset($postData['sabit_telefonu']) ? preg_replace('/[^0-9]/', '', $postData['sabit_telefonu']) : null,
            'ev_adresi_detay' => isset($postData['ev_adresi_detay']) ? trim($postData['ev_adresi_detay']) : null,
            'acil_durum_kisi_iletisim' => isset($postData['acil_durum_kisi_iletisim']) ? trim($postData['acil_durum_kisi_iletisim']) : null,
            'ise_baslama_tarihi' => !empty(trim($postData['ise_baslama_tarihi'] ?? '')) ? date('Y-m-d', strtotime(str_replace('.', '-', trim($postData['ise_baslama_tarihi'])))) : null,
            'isten_ayrilma_tarihi' => !empty(trim($postData['isten_ayrilma_tarihi'] ?? '')) ? date('Y-m-d', strtotime(str_replace('.', '-', trim($postData['isten_ayrilma_tarihi'])))) : null,
            'is_birakma_nedeni' => isset($postData['is_birakma_nedeni']) ? trim($postData['is_birakma_nedeni']) : null,
            'btk_listesine_eklensin' => (isset($postData['btk_listesine_eklensin']) && ($postData['btk_listesine_eklensin'] == '1' || $postData['btk_listesine_eklensin'] == 'on')) ? 1 : 0,
            'updated_at' => date('Y-m-d H:i:s')
            // Adi, Soyadi, Eposta WHMCS'ten senkronize edilir, buradan güncellenmez.
        ];

        // TCKN ve NVI durumunu işle
        $tcknToSave = isset($postData['tc_kimlik_no']) ? trim($postData['tc_kimlik_no']) : null;
        $dogumYiliForNvi = isset($postData['dogum_yili_personel_nvi']) ? trim($postData['dogum_yili_personel_nvi']) : null;
        
        // Formdan gelen NVI durumunu al (AJAX sonrası set edilmiş olabilir)
        $dataToSave['nvi_tckn_dogrulandi'] = (isset($postData['nvi_tckn_dogrulandi']) && $postData['nvi_tckn_dogrulandi'] == '1') ? 1 : 0;
        $dataToSave['nvi_tckn_son_dogrulama'] = null;
        if (!empty(trim($postData['nvi_tckn_son_dogrulama'] ?? ''))) {
            try { 
                $dt = new DateTime(trim($postData['nvi_tckn_son_dogrulama']));
                $dataToSave['nvi_tckn_son_dogrulama'] = $dt->format('Y-m-d H:i:s');
            } catch (\Exception $ex) { /* Hatalı format, null kalır */ }
        }


        if (!empty($tcknToSave)) {
            // Eğer TCKN değişmişse veya daha önce doğrulanmamışsa veya formdan gelen NVI durumu '0' ise yeniden doğrula
            $dbTckn = $personel->tc_kimlik_no;
            $dbNviStatus = $personel->nvi_tckn_dogrulandi;

            if (($dbTckn !== $tcknToSave) || $dbNviStatus != 1 || $dataToSave['nvi_tckn_dogrulandi'] != 1) {
                if (empty($dogumYiliForNvi) || !is_numeric($dogumYiliForNvi) || strlen($dogumYiliForNvi) !== 4) {
                    btk_log_module_action("Personel #{$personelId} TCKN NVI doğrulaması için doğum yılı eksik/hatalı (kayıt sırasında).", "NVI_VALIDATION_ERROR", ['tckn' => $tcknToSave], $adminId);
                    return ['status' => 'error', 'message' => "TCKN ({$tcknToSave}) NVI doğrulaması için geçerli bir Doğum Yılı (YYYY) girilmelidir."];
                }
                // Ad ve Soyad, WHMCS admininden senkronize edilen veya personel kaydındaki değerler olmalı
                $adForNvi = $personel->adi;
                $soyadForNvi = $personel->soyadi;

                $nviResult = btk_internal_nvi_verify('tckn', $tcknToSave, $adForNvi, $soyadForNvi, $dogumYiliForNvi, "Personel #{$personelId} TCKN Kayıt");
                $dataToSave['nvi_tckn_dogrulandi'] = $nviResult['isValid'] ? 1 : 0;
                $dataToSave['nvi_tckn_son_dogrulama'] = date('Y-m-d H:i:s');

                if (!$nviResult['isValid']) {
                    // Hatalı TCKN'yi kaydetme, eski değeri koru (veya null yap) ve hata mesajı döndür
                    // $dataToSave['tc_kimlik_no'] = $personel->tc_kimlik_no; // Eski TCKN'yi koru
                    $dataToSave['tc_kimlik_no'] = null; // VEYA TCKN'yi tamamen boşalt
                    return ['status' => 'error', 'message' => "Girilen T.C. Kimlik Numarası ({$tcknToSave}) doğrulanamadı. {$nviResult['message']} Lütfen bilgileri kontrol edin. TCKN güncellenmedi."];
                } else {
                    $dataToSave['tc_kimlik_no'] = $tcknToSave; // Doğruysa yeni TCKN'yi kaydet
                }
            } else {
                 $dataToSave['tc_kimlik_no'] = $tcknToSave; // TCKN değişmemiş ve zaten doğrulanmışsa olduğu gibi kalsın
            }
        } else { // TCKN boş bırakılmışsa NVI bilgilerini sıfırla
            $dataToSave['tc_kimlik_no'] = null;
            $dataToSave['nvi_tckn_dogrulandi'] = 0;
            $dataToSave['nvi_tckn_son_dogrulama'] = null;
        }
        
        if (!empty($dataToSave['isten_ayrilma_tarihi']) && $dataToSave['isten_ayrilma_tarihi'] <= date('Y-m-d')) {
            $dataToSave['btk_listesine_eklensin'] = 0;
        }

        // Zorunlu alan kontrolü (BTK Excel için)
        if ($dataToSave['btk_listesine_eklensin'] == 1) { 
            if (empty($dataToSave['tc_kimlik_no'])) return ['status' => 'error', 'message' => 'BTK listesine eklenecek personel için T.C. Kimlik No zorunludur ve NVI ile doğrulanmış olmalıdır.'];
            if ($dataToSave['nvi_tckn_dogrulandi'] != 1) return ['status' => 'error', 'message' => 'BTK listesine eklenecek personel için T.C. Kimlik No NVI ile doğrulanmış olmalıdır.'];
            if (empty($dataToSave['gorev_unvani'])) return ['status' => 'error', 'message' => 'BTK listesine eklenecek personel için Görevi / Ünvanı alanı boş bırakılamaz.'];
            if (empty($dataToSave['calistigi_birim'])) return ['status' => 'error', 'message' => 'BTK listesine eklenecek personel için Çalıştığı Birim alanı boş bırakılamaz.'];
            if (empty($dataToSave['mobil_telefonu']) || strlen($dataToSave['mobil_telefonu']) !== 10) return ['status' => 'error', 'message' => 'BTK listesine eklenecek personel için Mobil Telefonu 10 hane olarak girilmelidir (Örn: 5xxxxxxxxx).'];
        }

        try {
            // TCKN benzersizliğini kontrol et (mevcut personel ID hariç)
            if (!empty($dataToSave['tc_kimlik_no'])) {
                $existingTckn = Capsule::table('mod_btk_personel')
                                    ->where('tc_kimlik_no', $dataToSave['tc_kimlik_no'])
                                    ->where('id', '!=', $personelId)
                                    ->first();
                if ($existingTckn) {
                    return ['status' => 'error', 'message' => 'Bu T.C. Kimlik Numarası zaten başka bir personele kayıtlı.'];
                }
            }
            Capsule::table('mod_btk_personel')->where('id', $personelId)->update($dataToSave);
            btk_log_module_action("Personel #{$personelId} detayları güncellendi.", "SUCCESS", [], $adminId);
            return ['status' => 'success', 'message' => 'Personel bilgileri başarıyla güncellendi.'];
            
        } catch (\Exception $e) {
            btk_log_module_action("Personel detayları kaydedilirken hata", "ERROR", ['personel_id' => $personelId, 'error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $adminId);
            return ['status' => 'error', 'message' => 'Personel bilgileri kaydedilirken bir veritabanı hatası oluştu: ' . $e->getMessage()];
        }
    }
}

if (!function_exists('btk_save_personel_bulk_status_update')) {
    /**
     * Personel listesindeki "BTK Listesine Eklensin" durumlarını toplu olarak günceller.
     */
    function btk_save_personel_bulk_status_update($personelIds, $btkStatusData, $adminId) {
        if (empty($personelIds) || !is_array($personelIds)) {
            return ['status' => 'error', 'message' => 'Güncellenecek personel seçilmedi.'];
        }
        $updatedCount = 0;
        $skippedCount = 0;
        $today = date('Y-m-d');
        try {
            foreach ($personelIds as $personelId) {
                $personelId = (int)$personelId;
                $newStatus = (isset($btkStatusData[$personelId]) && ($btkStatusData[$personelId] == '1' || $btkStatusData[$personelId] == 'on')) ? 1 : 0;
                
                $personel = Capsule::table('mod_btk_personel')->find($personelId);
                if (!$personel) continue;

                if ($newStatus == 1 && !empty($personel->isten_ayrilma_tarihi) && $personel->isten_ayrilma_tarihi <= $today) {
                    btk_log_module_action("İşten ayrılmış personel #{$personelId} BTK listesine eklenemedi (toplu güncelleme).", "WARNING", [], $adminId);
                    $skippedCount++;
                    continue; 
                }

                $affected = Capsule::table('mod_btk_personel')
                                ->where('id', $personelId)
                                ->update(['btk_listesine_eklensin' => $newStatus, 'updated_at' => date('Y-m-d H:i:s')]);
                if ($affected > 0) {
                    $updatedCount++;
                }
            }
            $message = "{$updatedCount} personelin BTK raporuna dahil edilme durumu güncellendi.";
            if($skippedCount > 0) $message .= " {$skippedCount} personel işten ayrıldığı için durumu değiştirilemedi.";
            btk_log_module_action($message, "SUCCESS", [], $adminId);
            return ['status' => 'success', 'message' => $message];
        } catch (\Exception $e) {
            btk_log_module_action("Personel BTK listesi durumları güncellenirken hata", "ERROR", ['error' => $e->getMessage()], $adminId);
            return ['status' => 'error', 'message' => 'Durumlar güncellenirken bir hata oluştu: ' . $e->getMessage()];
        }
    }
}

// lib/btkhelper.php - 7. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

// --- PERSONEL YÖNETİMİ FONKSİYONLARI (Senkronizasyon ve Hooklar) ---

if (!function_exists('btk_sync_admins_to_personel_list')) {
    /**
     * WHMCS adminlerini mod_btk_personel tablosuyla senkronize eder.
     * Sadece mod_btk_personel'de olmayan aktif adminleri ekler veya mevcutların temel bilgilerini günceller.
     * @param int $currentAdminId İşlemi yapan admin ID'si (loglama için)
     * @return array ['status' => 'success'/'error', 'message' => '...']
     */
    function btk_sync_admins_to_personel_list($currentAdminId) {
        btk_log_module_action("WHMCS Adminleri Personel Listesiyle Manuel Senkronize Ediliyor.", "INFO", [], $currentAdminId);
        $addedCount = 0;
        $updatedCount = 0;
        $skippedDisabledCount = 0;
        $today = date('Y-m-d');

        try {
            $whmcsAdmins = Capsule::table('tbladmins')->get(); // Tüm adminleri al (aktif/pasif)
            $operatorUnvani = btk_get_module_setting('operator_unvani');
            if (empty($operatorUnvani)) {
                // Firma unvanı ayarlanmamışsa, senkronizasyon yapılamaz (veya varsayılan bir değer atanabilir)
                btk_log_module_action("Personel senkronizasyonu için Operatör Unvanı ayarlanmamış.", "WARNING", [], $currentAdminId);
            }


            foreach ($whmcsAdmins as $whmcsAdmin) {
                $existingPersonel = Capsule::table('mod_btk_personel')
                                        ->where('whmcs_admin_id', $whmcsAdmin->id)
                                        ->first();
                
                $personelDataToSync = [
                    'adi' => $whmcsAdmin->firstname,
                    'soyadi' => $whmcsAdmin->lastname,
                    'e_posta_adresi' => $whmcsAdmin->email,
                    'firma_unvani' => $operatorUnvani, // Her senkronizasyonda güncellensin
                    'updated_at' => date('Y-m-d H:i:s')
                ];

                if ($whmcsAdmin->disabled == 1) { // Eğer WHMCS admini pasif ise
                    if ($existingPersonel) { // Ve BTK personel listesinde varsa
                        // İşten ayrılma tarihini bugüne set et (eğer daha önce set edilmemişse veya farklıysa)
                        // ve BTK listesinden çıkar
                        if (empty($existingPersonel->isten_ayrilma_tarihi) || $existingPersonel->isten_ayrilma_tarihi > $today) {
                            Capsule::table('mod_btk_personel')
                                ->where('id', $existingPersonel->id)
                                ->update([
                                    'isten_ayrilma_tarihi' => $today,
                                    'btk_listesine_eklensin' => 0,
                                    'updated_at' => date('Y-m-d H:i:s')
                                ]);
                            $updatedCount++;
                            btk_log_module_action("Pasif WHMCS Admin #{$whmcsAdmin->id} ({$whmcsAdmin->username}) personel listesinde pasife alındı.", "INFO", [], $currentAdminId);
                        } else {
                            // Zaten işten ayrılmış ve doğru işaretlenmiş, sadece temel bilgileri güncelle
                            Capsule::table('mod_btk_personel')
                                ->where('id', $existingPersonel->id)
                                ->update($personelDataToSync); // Ad, soyad, email güncellenebilir
                            $updatedCount++;
                        }
                    } else {
                        // Pasif admin ve BTK listesinde yoksa bir şey yapma
                        $skippedDisabledCount++;
                    }
                    continue; // Bir sonraki admine geç
                }

                // WHMCS Admini aktif ise:
                if (!$existingPersonel) { // BTK personel listesinde yoksa ekle
                    $personelDataToSync['whmcs_admin_id'] = $whmcsAdmin->id;
                    $personelDataToSync['created_at'] = date('Y-m-d H:i:s');
                    $personelDataToSync['btk_listesine_eklensin'] = 1; // Varsayılan olarak eklensin.
                    // İşe başlama tarihi için WHMCS admin oluşturma tarihi kullanılabilir mi?
                    // $personelDataToSync['ise_baslama_tarihi'] = date('Y-m-d', strtotime($whmcsAdmin->created_at ?? 'now')); // WHMCS'te admin created_at yok gibi
                    Capsule::table('mod_btk_personel')->insert($personelDataToSync);
                    $addedCount++;
                } else { // BTK personel listesinde varsa, temel bilgileri güncelle
                    $updateDataForExisting = $personelDataToSync;
                    // Eğer manuel olarak işten ayrılma tarihi girilmiş ve geçmişteyse, BTK listesinden çıkar
                    if (!empty($existingPersonel->isten_ayrilma_tarihi) && $existingPersonel->isten_ayrilma_tarihi <= $today) {
                        $updateDataForExisting['btk_listesine_eklensin'] = 0; 
                    } else {
                        // İşten ayrılmamışsa, BTK listesine eklenme durumunu koru veya senkronizasyon ayarına göre belirle
                        // Şimdilik, eğer aktifse ve işten ayrılmamışsa, BTK listesine eklensin durumunu elle değiştirilmediyse koru
                        // $updateDataForExisting['btk_listesine_eklensin'] = $existingPersonel->btk_listesine_eklensin;
                        // Ya da her senkronizasyonda aktif adminleri listeye dahil etmeyi zorla (isten_ayrilma_tarihi yoksa)
                         if(empty($existingPersonel->isten_ayrilma_tarihi)) $updateDataForExisting['btk_listesine_eklensin'] = 1;
                    }
                    Capsule::table('mod_btk_personel')
                        ->where('whmcs_admin_id', $whmcsAdmin->id)
                        ->update($updateDataForExisting);
                    $updatedCount++;
                }
            }
            $message = "{$addedCount} yeni personel eklendi, {$updatedCount} mevcut personel güncellendi/kontrol edildi.";
            if($skippedDisabledCount > 0) $message .= " {$skippedDisabledCount} pasif WHMCS admini atlandı.";
            btk_log_module_action($message, "SUCCESS", [], $currentAdminId);
            return ['status' => 'success', 'message' => $message];

        } catch (\Exception $e) {
            btk_log_module_action("WHMCS Admin senkronizasyonunda hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $currentAdminId);
            return ['status' => 'error', 'message' => 'Adminler senkronize edilirken bir hata oluştu: ' . $e->getMessage()];
        }
    }
}


// --- PERSONEL YÖNETİMİ FONKSİYONLARI (HOOKLAR İÇİN) ---
if (!function_exists('btk_sync_admin_to_personel')) {
    /**
     * AdminAdd veya AdminEdit hook'u tetiklendiğinde, ilgili admini mod_btk_personel tablosuyla senkronize eder.
     */
    function btk_sync_admin_to_personel($adminIdHook, $adminDataVars) {
        // $adminDataVars WHMCS hook'undan gelen değişkenleri içerir (adminid, firstname, lastname, email vb.)
        btk_log_module_action("Admin #{$adminIdHook} personel tablosuna senkronize ediliyor (hook).", "HOOK_INFO", ['admin_username' => $adminDataVars['username'] ?? 'N/A']);
        try {
            $whmcsAdmin = Capsule::table('tbladmins')->find($adminIdHook);
            if (!$whmcsAdmin) {
                btk_log_module_action("Senkronize edilecek WHMCS Admin #{$adminIdHook} bulunamadı (hook).", "WARNING");
                return;
            }

            // Eğer admin pasife alındıysa (disabled=1), işten ayrılma tarihini güncelle
            if ($whmcsAdmin->disabled == 1) {
                $existingPersonel = Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $adminIdHook)->first();
                if ($existingPersonel && (empty($existingPersonel->isten_ayrilma_tarihi) || $existingPersonel->isten_ayrilma_tarihi > date('Y-m-d'))) {
                     Capsule::table('mod_btk_personel')
                        ->where('whmcs_admin_id', $adminIdHook)
                        ->update([
                            'isten_ayrilma_tarihi' => date('Y-m-d'),
                            'btk_listesine_eklensin' => 0,
                            'updated_at' => date('Y-m-d H:i:s')
                        ]);
                    btk_log_module_action("Pasif WHMCS Admin #{$adminIdHook} personel listesinde pasife alındı (hook).", "INFO");
                }
                return; // Pasif admin için başka işlem yapma
            }

            // Admin aktifse veya aktife alınmışsa
            $operatorUnvani = btk_get_module_setting('operator_unvani');
            $personelData = [
                'adi' => $whmcsAdmin->firstname,
                'soyadi' => $whmcsAdmin->lastname,
                'e_posta_adresi' => $whmcsAdmin->email,
                'firma_unvani' => $operatorUnvani, // Her zaman güncel tut
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $existingPersonel = Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $adminIdHook)->first();
            if ($existingPersonel) {
                // Eğer daha önce işten ayrılmış olarak işaretlenmişse ve şimdi admin aktifse, işten ayrılma tarihini temizle
                if ($whmcsAdmin->disabled == 0 && !empty($existingPersonel->isten_ayrilma_tarihi)) {
                    $personelData['isten_ayrilma_tarihi'] = null;
                    $personelData['is_birakma_nedeni'] = null; 
                    // BTK listesine eklenme durumunu kontrol et, eğer zorunlu alanları tamsa eklenebilir.
                    // Bu, personel sayfasından manuel olarak yönetilmeli veya varsayılan olarak eklensin.
                    // Şimdilik, eğer işten ayrılma tarihi temizleniyorsa, BTK listesine ekle.
                    $personelData['btk_listesine_eklensin'] = 1; 
                }
                Capsule::table('mod_btk_personel')->where('whmcs_admin_id', $adminIdHook)->update($personelData);
                btk_log_module_action("Personel kaydı güncellendi (hook): Admin ID #{$adminIdHook}", "INFO");
            } else {
                // AdminAdd hook'u için yeni kayıt veya daha önce silinmiş ama WHMCS'te tekrar aktif edilmiş admin
                $personelData['whmcs_admin_id'] = $adminIdHook;
                $personelData['created_at'] = date('Y-m-d H:i:s');
                $personelData['btk_listesine_eklensin'] = 1; // Varsayılan olarak BTK listesine eklensin.
                Capsule::table('mod_btk_personel')->insert($personelData);
                btk_log_module_action("Yeni personel kaydı eklendi (hook): Admin ID #{$adminIdHook}", "INFO");
            }
        } catch (\Exception $e) {
            btk_log_module_action("Admin #{$adminIdHook} personel senkronizasyonunda hata (hook)", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)]);
        }
    }
}

if (!function_exists('btk_deactivate_or_delete_personel')) {
    /**
     * AdminDelete hook'u tetiklendiğinde, ilgili admini mod_btk_personel tablosunda pasife alır.
     */
    function btk_deactivate_or_delete_personel($adminIdHook) {
        btk_log_module_action("Admin #{$adminIdHook} personel tablosundan siliniyor/pasife alınıyor (hook).", "HOOK_INFO");
        try {
            $affected = Capsule::table('mod_btk_personel')
                ->where('whmcs_admin_id', $adminIdHook)
                ->update([
                    'isten_ayrilma_tarihi' => date('Y-m-d'), // Bugün itibariyle işten ayrıldı say
                    'btk_listesine_eklensin' => 0, // BTK listesinden çıkar
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            if ($affected > 0) {
                btk_log_module_action("Personel kaydı pasife alındı (işten ayrılma tarihi güncellendi - hook): Admin ID #{$adminIdHook}", "INFO");
            } else {
                // Eğer mod_btk_personel'de kaydı yoksa (örn. hiç senkronize edilmemişse) bir şey yapma
                btk_log_module_action("Pasife alınacak personel kaydı bulunamadı (hook): Admin ID #{$adminIdHook}", "WARNING");
            }
        } catch (\Exception $e) {
            btk_log_module_action("Admin #{$adminIdHook} personel pasife alma/silme hatası (hook)", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)]);
        }
    }
}

// --- ADMİN ARAYÜZÜ YARDIMCI FONKSİYONLARI ---
if (!function_exists('btk_check_ftp_connection')) {
    /**
     * Ana ve (eğer aktifse) yedek FTP sunucularına bağlantıyı test eder.
     * @return array Bağlantı durumlarını içeren bir dizi.
     */
    function btk_check_ftp_connection() {
        $results = [
            'btk_ftp' => ['status' => 'error', 'message' => 'Ayarlar eksik veya test edilemedi.'],
            'yedek_ftp' => ['status' => 'not_used', 'message' => 'Kullanılmıyor.']
        ];
        $adminId = $_SESSION['adminid'] ?? 0;

        // Ana BTK FTP Testi
        $ftpHost = btk_get_module_setting('ftp_host');
        $ftpUser = btk_get_module_setting('ftp_username');
        $ftpPass = btk_get_module_setting('ftp_password'); 
        $ftpPort = (int)btk_get_module_setting('ftp_port', 21);
        
        if ($ftpHost && $ftpUser && $ftpPass) {
            $conn_id = @ftp_connect($ftpHost, $ftpPort, 10); 
            if ($conn_id) {
                if (@ftp_login($conn_id, $ftpUser, $ftpPass)) {
                    $results['btk_ftp'] = ['status' => 'success', 'message' => 'Bağlantı başarılı.'];
                    @ftp_close($conn_id);
                } else {
                    $results['btk_ftp']['message'] = 'FTP login başarısız.';
                    @ftp_close($conn_id);
                }
            } else {
                $results['btk_ftp']['message'] = "FTP bağlantısı kurulamadı: {$ftpHost}";
            }
        } else {
             $results['btk_ftp']['message'] = "Ana BTK FTP ayarları eksik.";
        }

        // Yedek FTP Testi
        if (btk_get_module_setting('use_yedek_ftp') == '1') {
            $yedekFtpHost = btk_get_module_setting('yedek_ftp_host');
            $yedekFtpUser = btk_get_module_setting('yedek_ftp_username');
            $yedekFtpPass = btk_get_module_setting('yedek_ftp_password');
            $yedekFtpPort = (int)btk_get_module_setting('yedek_ftp_port', 21);

            if ($yedekFtpHost && $yedekFtpUser && $yedekFtpPass) {
                $conn_id_yedek = @ftp_connect($yedekFtpHost, $yedekFtpPort, 10);
                if ($conn_id_yedek) {
                    if (@ftp_login($conn_id_yedek, $yedekFtpUser, $yedekFtpPass)) {
                        $results['yedek_ftp'] = ['status' => 'success', 'message' => 'Bağlantı başarılı.'];
                        @ftp_close($conn_id_yedek);
                    } else {
                        $results['yedek_ftp'] = ['status' => 'error', 'message' => 'Yedek FTP login başarısız.'];
                        @ftp_close($conn_id_yedek);
                    }
                } else {
                    $results['yedek_ftp'] = ['status' => 'error', 'message' => "Yedek FTP bağlantısı kurulamadı: {$yedekFtpHost}"];
                }
            } else {
                $results['yedek_ftp'] = ['status' => 'error', 'message' => "Yedek FTP ayarları eksik."];
            }
        }
        return $results;
    }
}

// lib/btkhelper.php - 8. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

// --- RAPOR OLUŞTURMA FONKSİYONLARI (Devamı) ---

if (!function_exists('btk_generate_abone_rehber_report')) {
    /**
     * ABONE REHBER dosyasını oluşturur, sıkıştırır ve FTP'ye yükler.
     * NVI doğrulaması yapılmamış veya başarısız olmuş kayıtları rapora dahil etmez.
     */
    function btk_generate_abone_rehber_report($operatorCode, $operatorName, $yetkiTipiKodu, $fileTimestamp, $isBosDosyaGonderAyar) {
        btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}) raporu oluşturuluyor...", "REPORT_GEN");
        $reportDataLines = [];
        $isEmptyReport = true;
        $excludedRecordCount = 0;
        $adminId = $_SESSION['adminid'] ?? 0;

        try {
            $aboneKayitlari = Capsule::table('mod_btk_abone_data')
                ->where('btk_rapor_yetki_tipi_kodu', $yetkiTipiKodu)
                ->get();

            if (!$aboneKayitlari->isEmpty()) {
                foreach ($aboneKayitlari as $kayit) {
                    $kayitArray = (array)$kayit;
                    $isValidForReport = true; // Varsayılan olarak geçerli say

                    // Gerçek kişi aboneler için NVI kontrolü
                    if (($kayitArray['musteri_tipi'] === 'G-SAHIS' || $kayitArray['musteri_tipi'] === 'G-SIRKET')) {
                        if (!empty($kayitArray['abone_tc_kimlik_no'])) {
                            $dogumYili = null;
                            if(!empty($kayitArray['abone_dogum_tarihi']) && strlen($kayitArray['abone_dogum_tarihi']) === 8) {
                                $dogumYili = substr($kayitArray['abone_dogum_tarihi'], 0, 4);
                            }
                            if (empty($dogumYili)){ // Doğum yılı yoksa direkt geçersiz
                                $isValidForReport = false;
                                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id}, TCKN {$kayitArray['abone_tc_kimlik_no']} için doğum yılı eksik, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $kayit->whmcs_client_id, $kayit->whmcs_service_id);
                            } else {
                                $isValidForReport = btk_is_record_nvi_valid_for_report($kayitArray, 'tckn', 'abone_tc_kimlik_no', 'abone_adi', 'abone_soyadi', $dogumYili, null, "Abone Rehber #{$kayit->id}");
                            }
                        } elseif (!empty($kayitArray['abone_pasaport_no']) && ($kayitArray['abone_uyruk'] ?? 'TUR') !== 'TUR') {
                            $dogumTarihiYkn = $kayitArray['abone_dogum_tarihi'] ?? null; // YYYYMMDD formatında
                            if (empty($dogumTarihiYkn) || strlen($dogumTarihiYkn) !== 8){
                                $isValidForReport = false;
                                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id}, YKN {$kayitArray['abone_pasaport_no']} için doğum tarihi (YYYYMMDD) eksik/hatalı, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $kayit->whmcs_client_id, $kayit->whmcs_service_id);
                            } else {
                                // $isValidForReport = btk_is_record_nvi_valid_for_report($kayitArray, 'ykn', 'abone_pasaport_no', 'abone_adi', 'abone_soyadi', null, $dogumTarihiYkn, "Abone Rehber #{$kayit->id}");
                                // YKN doğrulaması için NVI servisi farklı parametreler isteyebilir ve halka açık olmayabilir.
                                // Şimdilik YKN için NVI kontrolünü atlıyoruz, sadece TCKN'ye odaklanıyoruz.
                                // İleride gerekirse bu kısım NVI'nın YKN public servisine göre güncellenir.
                                // $isValidForReport = true; // YKN varsa ve TUR değilse şimdilik geçerli say
                            }
                        }
                        // Eğer gerçek kişi ve TCKN/YKN yoksa bu da bir sorun olabilir, BTK'ya danışılmalı.
                        // Şimdilik NVI kontrolü yapılan ve başarısız olanlar ayıklanıyor.
                    }
                    // Kurumsal aboneler için kurum yetkilisi TCKN doğrulaması (bu alan mod_btk_abone_data'da yoksa implemente edilmeli)
                    // if (($kayitArray['musteri_tipi'] === 'T-SIRKET' || $kayitArray['musteri_tipi'] === 'T-KAMU' /* vb. */) && !empty($kayitArray['kurum_yetkili_tckimlik_no'])) {
                    //    // ... benzer NVI kontrolü ...
                    // }


                    if (!$isValidForReport) {
                        btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id} (WHMCS Client: {$kayit->whmcs_client_id}, Service: {$kayit->whmcs_service_id}) NVI doğrulaması başarısız olduğu veya eksik bilgi nedeniyle rapora eklenmedi.", "REPORT_SKIP");
                        $excludedRecordCount++;
                        continue; // Bu kaydı atla
                    }
                    
                    $isEmptyReport = false; // En az bir geçerli kayıt varsa rapor boş değil
                    $hareketBilgileri = ['musteri_hareket_kodu' => '', 'musteri_hareket_aciklama' => '', 'musteri_hareket_zamani' => ''];
                    $reportLineValues = btk_format_data_for_report_line($kayitArray, $yetkiTipiKodu, $hareketBilgileri);
                    $reportDataLines[] = $reportLineValues;
                }
            }

            if ($isEmptyReport && !$isBosDosyaGonderAyar) {
                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Raporlanacak geçerli veri yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO");
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli veri yok ve boş dosya gönderimi kapalı.'];
            }
            if($excludedRecordCount > 0){
                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): {$excludedRecordCount} kayıt NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING");
            }
            
            return btk_create_and_upload_report_file(
                $operatorName, $operatorCode, $yetkiTipiKodu, 
                'ABONE_REHBER', $fileTimestamp, $reportDataLines, $isEmptyReport
            );

        } catch (\Exception $e) {
            btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}) raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)]);
            return ['status' => 'error', 'message' => 'ABONE REHBER raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
}

if (!function_exists('btk_generate_abone_hareket_report')) {
    /**
     * ABONE HAREKET dosyasını oluşturur.
     * NVI doğrulaması yapılmamış veya başarısız olmuş kayıtlara ait hareketleri rapora dahil etmez.
     */
    function btk_generate_abone_hareket_report($operatorCode, $operatorName, $yetkiTipiKodu, $fileTimestamp, $isBosDosyaGonderAyar) {
        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}) raporu oluşturuluyor...", "REPORT_GEN");
        $reportDataLines = [];
        $hareketIdsToMark = [];
        $isEmptyReport = true;
        $excludedRecordCount = 0;
        $adminId = $_SESSION['adminid'] ?? 0;

        try {
            $hareketler = Capsule::table('mod_btk_abone_hareketler as h')
                ->join('mod_btk_abone_data as d', 'h.btk_abone_data_id', '=', 'd.id')
                ->where('d.btk_rapor_yetki_tipi_kodu', $yetkiTipiKodu)
                ->where('h.raporlandi_mi', 0)
                ->select('h.*', 'd.whmcs_client_id as client_id_for_log', 'd.whmcs_service_id as service_id_for_log') // Loglama için
                ->orderBy('h.musteri_hareket_zamani', 'asc')
                ->orderBy('h.id', 'asc')
                ->get();

            if (!$hareketler->isEmpty()) {
                foreach ($hareketler as $hareket) {
                    $snapshotArray = json_decode($hareket->hareket_anindaki_data_snapshot, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id} için snapshot JSON parse hatası.", "ERROR", ['snapshot_error' => json_last_error_msg()]);
                        continue;
                    }
                    
                    $isValidForReport = true;
                    if (($snapshotArray['musteri_tipi'] === 'G-SAHIS' || $snapshotArray['musteri_tipi'] === 'G-SIRKET')) {
                        if (!empty($snapshotArray['abone_tc_kimlik_no'])) {
                            $dogumYili = null;
                             if(!empty($snapshotArray['abone_dogum_tarihi']) && strlen($snapshotArray['abone_dogum_tarihi']) === 8) {
                                $dogumYili = substr($snapshotArray['abone_dogum_tarihi'], 0, 4);
                            }
                            if(empty($dogumYili)){
                                $isValidForReport = false;
                                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id}, Snapshot TCKN {$snapshotArray['abone_tc_kimlik_no']} için doğum yılı eksik, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $hareket->client_id_for_log, $hareket->service_id_for_log);
                            } else {
                                $isValidForReport = btk_is_record_nvi_valid_for_report($snapshotArray, 'tckn', 'abone_tc_kimlik_no', 'abone_adi', 'abone_soyadi', $dogumYili, null, "Abone Hareket (Snapshot) #{$hareket->id}");
                            }
                        } elseif (!empty($snapshotArray['abone_pasaport_no']) && ($snapshotArray['abone_uyruk'] ?? 'TUR') !== 'TUR') {
                            // YKN kontrolü (şimdilik atlandı, yukarıdaki rehberdeki gibi)
                        }
                    }

                    if (!$isValidForReport) {
                        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id} (WHMCS Client: {$hareket->client_id_for_log}, Service: {$hareket->service_id_for_log}) NVI doğrulaması başarısız olduğu için rapora eklenmedi.", "REPORT_SKIP");
                        $excludedRecordCount++;
                        continue; 
                    }

                    $isEmptyReport = false;
                    $hareketBilgileri = [
                        'musteri_hareket_kodu' => $hareket->musteri_hareket_kodu,
                        'musteri_hareket_aciklama' => $hareket->musteri_hareket_aciklama,
                        'musteri_hareket_zamani' => $hareket->musteri_hareket_zamani
                    ];
                    $reportLineValues = btk_format_data_for_report_line($snapshotArray, $yetkiTipiKodu, $hareketBilgileri);
                    $reportDataLines[] = $reportLineValues;
                    $hareketIdsToMark[] = $hareket->id;
                }
            }

            if ($isEmptyReport && !$isBosDosyaGonderAyar) {
                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Raporlanacak geçerli hareket yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO");
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli hareket yok ve boş dosya gönderimi kapalı.'];
            }
            if($excludedRecordCount > 0){
                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): {$excludedRecordCount} hareket NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING");
            }

            $result = btk_create_and_upload_report_file(
                $operatorName, $operatorCode, $yetkiTipiKodu, 
                'ABONE_HAREKET', $fileTimestamp, $reportDataLines, $isEmptyReport
            );

            if (($result['status'] === 'success' || $result['status'] === 'partial_error') && !empty($hareketIdsToMark)) {
                if ($result['btk_ftp_status']['status'] === 'success') { 
                    Capsule::table('mod_btk_abone_hareketler')
                        ->whereIn('id', $hareketIdsToMark)
                        ->update([
                            'raporlandi_mi' => 1,
                            'dosya_adi' => $result['filename'] ?? null,
                            'raporlanma_zamani' => date('Y-m-d H:i:s')
                        ]);
                    btk_log_module_action(count($hareketIdsToMark) . " adet hareket 'raporlandı' olarak işaretlendi.", "INFO", ['filename' => $result['filename'] ?? '']);
                } else {
                    btk_log_module_action("Ana BTK FTP'ye yükleme başarısız olduğu için hareketler işaretlenmedi.", "FTP_WARNING", ['filename' => $result['filename'] ?? '']);
                }
            }
            return $result;

        } catch (\Exception $e) {
            btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}) raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)]);
            return ['status' => 'error', 'message' => 'ABONE HAREKET raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
}

// lib/btkhelper.php - 8. PARÇA - 2. KISIM - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır. (btk_create_and_upload_report_file fonksiyonunun devamı)

            // $finalReportFilenameForFtp ve $reportFilePathLocal yukarıdaki bloklarda set edilmiş olmalı.
            // $contentHash ve $fileInfo da.

        } // if ($isPersonelRaporu) ... else ... bloğunun sonu

        // FTP Yükleme İşlemleri
        $ftpResults = ['btk_ftp' => ['status' => 'pending', 'message' => ''], 'yedek_ftp' => ['status' => 'not_used', 'message' => '']];
        $overallSuccess = false; // En az bir FTP başarılı olursa true olacak
        $adminId = $_SESSION['adminid'] ?? 0; // Loglama için

        // Ana BTK FTP
        $ftpConfigPrimary = [
            'host' => btk_get_module_setting('ftp_host'), 
            'user' => btk_get_module_setting('ftp_username'),
            'pass' => btk_get_module_setting('ftp_password'), // Bu zaten çözülmüş gelmeli
            'port' => (int)btk_get_module_setting('ftp_port', 21),
            'passive' => (bool)(btk_get_module_setting('use_passive_ftp', '1') == '1'),
            'timeout' => 30, // Bağlantı zaman aşımı
            'remote_dir' => ($isPersonelRaporu ? btk_get_module_setting('personel_ftp_path', '/PERSONEL/') : ($dosyaTuru === 'ABONE_REHBER' ? btk_get_module_setting('ftp_rehber_path', '/REHBER/') : btk_get_module_setting('ftp_hareket_path', '/HAREKET/')))
        ];
        // ABONE dosyaları için /abone/ ön eki BTK tarafından istenebilir, kontrol edin.
        if(!$isPersonelRaporu && strpos(ltrim($ftpConfigPrimary['remote_dir'], '/'), 'abone') !== 0) {
             $ftpConfigPrimary['remote_dir'] = '/abone' . rtrim($ftpConfigPrimary['remote_dir'], '/') . '/';
        } else {
            $ftpConfigPrimary['remote_dir'] = rtrim($ftpConfigPrimary['remote_dir'], '/') . '/';
        }
        
        if (!empty($ftpConfigPrimary['host'])) {
            $ftpResults['btk_ftp'] = btk_ftp_upload_file($reportFilePathLocal, basename($finalReportFilenameForFtp), $ftpConfigPrimary);
            if($ftpResults['btk_ftp']['status'] === 'success') {
                $overallSuccess = true;
                btk_log_module_action("Dosya BTK FTP'ye yüklendi: {$finalReportFilenameForFtp}", "FTP_SUCCESS", ['remote_dir' => $ftpConfigPrimary['remote_dir']], $adminId);
            } else {
                 btk_log_module_action("Dosya BTK FTP'ye yüklenirken HATA: {$finalReportFilenameForFtp}", "FTP_ERROR", ['remote_dir' => $ftpConfigPrimary['remote_dir'], 'error' => $ftpResults['btk_ftp']['message']], $adminId);
            }
        } else {
            $ftpResults['btk_ftp']['message'] = "Ana BTK FTP ayarları eksik, yükleme yapılamadı.";
            btk_log_module_action($ftpResults['btk_ftp']['message'], "FTP_WARNING", ['filename' => $finalReportFilenameForFtp], $adminId);
        }

        // Yedek FTP
        if (btk_get_module_setting('use_yedek_ftp') == '1') {
            $ftpConfigYedek = [
                'host' => btk_get_module_setting('yedek_ftp_host'), 
                'user' => btk_get_module_setting('yedek_ftp_username'),
                'pass' => btk_get_module_setting('yedek_ftp_password'), 
                'port' => (int)btk_get_module_setting('yedek_ftp_port', 21),
                'passive' => (bool)(btk_get_module_setting('use_passive_yedek_ftp', '1') == '1'),
                'timeout' => 30,
                'remote_dir' => ($isPersonelRaporu ? btk_get_module_setting('yedek_personel_ftp_path', '/PERSONEL/') : ($dosyaTuru === 'ABONE_REHBER' ? btk_get_module_setting('yedek_ftp_rehber_path', '/REHBER/') : btk_get_module_setting('yedek_ftp_hareket_path', '/HAREKET/')))
            ];
            if(!$isPersonelRaporu && strpos(ltrim($ftpConfigYedek['remote_dir'], '/'), 'abone') !== 0) {
                 $ftpConfigYedek['remote_dir'] = '/abone' . rtrim($ftpConfigYedek['remote_dir'], '/') . '/';
            } else {
                $ftpConfigYedek['remote_dir'] = rtrim($ftpConfigYedek['remote_dir'], '/') . '/';
            }

            if (!empty($ftpConfigYedek['host'])) {
                $ftpResults['yedek_ftp'] = btk_ftp_upload_file($reportFilePathLocal, basename($finalReportFilenameForFtp), $ftpConfigYedek);
                if($ftpResults['yedek_ftp']['status'] === 'success') {
                    $overallSuccess = true; // En az bir başarılı yükleme yeterli olabilir genel başarı için.
                    btk_log_module_action("Dosya Yedek FTP'ye yüklendi: {$finalReportFilenameForFtp}", "FTP_SUCCESS", ['remote_dir' => $ftpConfigYedek['remote_dir']], $adminId);
                } else {
                     btk_log_module_action("Dosya Yedek FTP'ye yüklenirken HATA: {$finalReportFilenameForFtp}", "FTP_ERROR", ['remote_dir' => $ftpConfigYedek['remote_dir'], 'error' => $ftpResults['yedek_ftp']['message']], $adminId);
                }
            } else {
                $ftpResults['yedek_ftp']['status'] = 'error'; // Ayar açık ama bilgi eksikse hata sayılır.
                $ftpResults['yedek_ftp']['message'] = "Yedek FTP ayarları 'Kullanımda' olarak işaretli ancak bağlantı bilgileri eksik.";
                btk_log_module_action($ftpResults['yedek_ftp']['message'], "FTP_WARNING", ['filename' => $finalReportFilenameForFtp], $adminId);
            }
        }

        // Dosya bilgilerini veritabanına kaydet
        try {
            Capsule::table('mod_btk_generated_files')->insert([
                'dosya_tam_adi' => basename($finalReportFilenameForFtp), 
                'dosya_tipi' => $dosyaTuru,
                'yetki_tipi_kodu' => $isPersonelRaporu ? 'PERSONEL' : $yetkiTipiKodu,
                'dosya_zamandamgasi' => $isPersonelRaporu ? str_replace('_', '', $fileTimestamp) . '01000000' : $fileTimestamp, // Personel için YYYYMM01000000
                'sayac_cnt' => $fileInfo['counter'] ?? 1,
                'icerik_ozeti' => $contentHash,
                'olusturulma_zamani' => date('Y-m-d H:i:s'),
                'btk_ftp_yukleme_durumu' => ucfirst($ftpResults['btk_ftp']['status']),
                'btk_ftp_yukleme_zamani' => ($ftpResults['btk_ftp']['status'] === 'success' ? date('Y-m-d H:i:s') : null),
                'btk_ftp_hata_mesaji' => ($ftpResults['btk_ftp']['status'] === 'error' ? mb_substr($ftpResults['btk_ftp']['message'],0,250) : null),
                'yedek_ftp_yukleme_durumu' => ucfirst($ftpResults['yedek_ftp']['status']),
                'yedek_ftp_yukleme_zamani' => ($ftpResults['yedek_ftp']['status'] === 'success' ? date('Y-m-d H:i:s') : null),
                'yedek_ftp_hata_mesaji' => ($ftpResults['yedek_ftp']['status'] === 'error' ? mb_substr($ftpResults['yedek_ftp']['message'],0,250) : null),
            ]);
        } catch (\Exception $e) {
             btk_log_module_action("Oluşturulan dosya bilgisi DB'ye kaydedilirken hata: " . basename($finalReportFilenameForFtp), "DB_ERROR", ['error' => $e->getMessage()], $adminId);
        }

        // Geçici dosyayı sil
        if (file_exists($reportFilePathLocal)) {
            unlink($reportFilePathLocal);
        }
        // Geçici klasörü sil (içi boşsa)
        if (is_dir($tempDir)) {
            // Klasörün gerçekten boş olup olmadığını kontrol et
            $filesInDir = array_diff(scandir($tempDir), array('.', '..'));
            if (empty($filesInDir)) {
                @rmdir($tempDir); 
            } else {
                btk_log_module_action("Geçici klasör {$tempDir} silinemedi, içinde hala dosyalar olabilir.", "WARNING");
            }
        }

        $finalStatus = 'error'; // Varsayılan
        if ($overallSuccess) {
            $finalStatus = 'success';
        } elseif ($ftpResults['btk_ftp']['status'] === 'error' || ($ftpResults['yedek_ftp']['status'] !== 'not_used' && $ftpResults['yedek_ftp']['status'] === 'error')) {
            $finalStatus = 'error'; // En az birinde kritik hata varsa genel hata
        } elseif ($ftpResults['btk_ftp']['status'] === 'pending' && ($ftpResults['yedek_ftp']['status'] === 'not_used' || $ftpResults['yedek_ftp']['status'] === 'pending')) {
            $finalStatus = 'partial_error'; // Hiçbir FTP'ye yüklenememiş ama dosya oluşmuşsa
        }


        return [
            'status' => $finalStatus, 
            'message' => "BTK FTP: {$ftpResults['btk_ftp']['message']}" . ($ftpResults['yedek_ftp']['status'] !== 'not_used' ? " | Yedek FTP: {$ftpResults['yedek_ftp']['message']}" : ""),
            'filename' => basename($finalReportFilenameForFtp),
            'btk_ftp_status' => $ftpResults['btk_ftp'] // Hareket işaretleme için bu detaya ihtiyaç var
        ];
    }
} // btk_create_and_upload_report_file fonksiyonunun sonu


if (!function_exists('btk_generate_abone_rehber_report')) {
    /**
     * ABONE REHBER dosyasını oluşturur, sıkıştırır ve FTP'ye yükler.
     * NVI doğrulaması yapılmamış veya başarısız olmuş kayıtları rapora dahil etmez.
     */
    function btk_generate_abone_rehber_report($operatorCode, $operatorName, $yetkiTipiKodu, $fileTimestamp, $isBosDosyaGonderAyar) {
        $adminId = $_SESSION['adminid'] ?? 0; // Cron'dan çalışıyorsa null olabilir, loglama için
        btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}) raporu oluşturuluyor...", "REPORT_GEN", [], $adminId);
        $reportDataLines = [];
        $isEmptyReport = true;
        $excludedRecordCount = 0;

        try {
            $aboneKayitlari = Capsule::table('mod_btk_abone_data')
                ->where('btk_rapor_yetki_tipi_kodu', $yetkiTipiKodu)
                ->get();

            if (!$aboneKayitlari->isEmpty()) {
                foreach ($aboneKayitlari as $kayit) {
                    $kayitArray = (array)$kayit;
                    $isValidForReport = true; 

                    if (($kayitArray['musteri_tipi'] === 'G-SAHIS' || $kayitArray['musteri_tipi'] === 'G-SIRKET')) {
                        if (!empty($kayitArray['abone_tc_kimlik_no'])) {
                            $dogumYili = null;
                            if(!empty($kayitArray['abone_dogum_tarihi']) && strlen($kayitArray['abone_dogum_tarihi']) === 8) {
                                $dogumYili = substr($kayitArray['abone_dogum_tarihi'], 0, 4);
                            }
                            if (empty($dogumYili) && !empty($kayitArray['nvi_tckn_dogrulandi']) && $kayitArray['nvi_tckn_dogrulandi'] == 0){ // Doğum yılı yok ve daha önce denenmiş başarısızsa direkt atla
                                $isValidForReport = false;
                            } elseif (empty($dogumYili)){
                                $isValidForReport = false;
                                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id}, TCKN {$kayitArray['abone_tc_kimlik_no']} için doğum yılı eksik, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $kayit->whmcs_client_id, $kayit->whmcs_service_id);
                            } else {
                                $isValidForReport = btk_is_record_nvi_valid_for_report($kayitArray, 'tckn', 'abone_tc_kimlik_no', 'abone_adi', 'abone_soyadi', $dogumYili, null, "Abone Rehber #{$kayit->id} (Rapor Anı)");
                            }
                        } elseif (!empty($kayitArray['abone_pasaport_no']) && ($kayitArray['abone_uyruk'] ?? 'TUR') !== 'TUR') {
                            $dogumTarihiYkn = $kayitArray['abone_dogum_tarihi'] ?? null; 
                            if (empty($dogumTarihiYkn) || strlen($dogumTarihiYkn) !== 8){
                                $isValidForReport = false;
                                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id}, YKN {$kayitArray['abone_pasaport_no']} için doğum tarihi (YYYYMMDD) eksik/hatalı, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $kayit->whmcs_client_id, $kayit->whmcs_service_id);
                            } else {
                                // $isValidForReport = btk_is_record_nvi_valid_for_report($kayitArray, 'ykn', ...);
                                // Şimdilik YKN için NVI kontrolünü atlıyoruz.
                            }
                        }
                    }
                    
                    if (!$isValidForReport) {
                        btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id} (Müşteri: {$kayit->whmcs_client_id}, Hizmet: {$kayit->whmcs_service_id}) NVI doğrulaması başarısız/eksik olduğu için rapora eklenmedi.", "REPORT_SKIP", ['tckn_masked' => substr($kayitArray['abone_tc_kimlik_no'] ?? '', 0,3).'***'], $adminId, $kayit->whmcs_client_id, $kayit->whmcs_service_id);
                        $excludedRecordCount++;
                        continue; 
                    }
                    
                    $isEmptyReport = false; 
                    $hareketBilgileri = ['musteri_hareket_kodu' => '', 'musteri_hareket_aciklama' => '', 'musteri_hareket_zamani' => ''];
                    $reportLineValues = btk_format_data_for_report_line($kayitArray, $yetkiTipiKodu, $hareketBilgileri);
                    $reportDataLines[] = $reportLineValues;
                }
            }

            if ($isEmptyReport && !$isBosDosyaGonderAyar) {
                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Raporlanacak geçerli veri yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO");
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli veri yok ve boş dosya gönderimi kapalı.'];
            }
            if($excludedRecordCount > 0){
                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): {$excludedRecordCount} kayıt NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING");
            }
            
            return btk_create_and_upload_report_file(
                $operatorName, $operatorCode, $yetkiTipiKodu, 
                'ABONE_REHBER', $fileTimestamp, $reportDataLines, $isEmptyReport
            );

        } catch (\Exception $e) {
            btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}) raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)]);
            return ['status' => 'error', 'message' => 'ABONE REHBER raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
}

// lib/btkhelper.php - 9. PARÇA - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın (btk_generate_abone_rehber_report fonksiyonunun sonu) devamıdır.

                            // YKN Doğrulama Kısmı (btk_generate_abone_rehber_report içindeki döngüde)
                            // $isValidForReport = btk_is_record_nvi_valid_for_report($kayitArray, 'ykn', 'abone_pasaport_no', 'abone_adi', 'abone_soyadi', null, $dogumTarihiYkn, "Abone Rehber #{$kayit->id} (Rapor Anı)");
                            // Şimdilik YKN için NVI kontrolünü atlıyoruz, sadece TCKN'ye odaklanıyoruz.
                            // Gerçek implementasyonda yukarıdaki satır veya benzeri bir kontrol aktif edilmelidir.
                        }
                    }
                    // Kurumsal aboneler için kurum yetkilisi TCKN doğrulaması (bu alan mod_btk_abone_data'da yoksa implemente edilmeli)
                    // if (($kayitArray['musteri_tipi'] === 'T-SIRKET' || $kayitArray['musteri_tipi'] === 'T-KAMU' /* vb. */) && !empty($kayitArray['kurum_yetkili_tckimlik_no'])) {
                    //    $kurumYetkiliDogumYili = ... ; // Kurum yetkilisi doğum yılı alınmalı
                    //    $isValidForReport = btk_is_record_nvi_valid_for_report($kayitArray, 'tckn', 'kurum_yetkili_tckimlik_no', 'kurum_yetkili_adi', 'kurum_yetkili_soyadi', $kurumYetkiliDogumYili, null, "Abone Rehber Kurum Yetkilisi #{$kayit->id} (Rapor Anı)");
                    // }


                    if (!$isValidForReport) {
                        btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Abone ID {$kayit->id} (Müşteri: {$kayit->whmcs_client_id}, Hizmet: {$kayit->whmcs_service_id}) NVI doğrulaması başarısız/eksik olduğu için rapora eklenmedi.", "REPORT_SKIP", ['tckn_masked' => substr($kayitArray['abone_tc_kimlik_no'] ?? '', 0,3).'***'], $adminId, $kayit->whmcs_client_id, $kayit->whmcs_service_id);
                        $excludedRecordCount++;
                        continue; 
                    }
                    
                    $isEmptyReport = false; 
                    $hareketBilgileri = ['musteri_hareket_kodu' => '', 'musteri_hareket_aciklama' => '', 'musteri_hareket_zamani' => ''];
                    $reportLineValues = btk_format_data_for_report_line($kayitArray, $yetkiTipiKodu, $hareketBilgileri);
                    $reportDataLines[] = $reportLineValues;
                }
            }

            if ($isEmptyReport && !$isBosDosyaGonderAyar) {
                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): Raporlanacak geçerli veri yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO", [], $adminId);
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli veri yok ve boş dosya gönderimi kapalı.'];
            }
            if($excludedRecordCount > 0){
                btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}): {$excludedRecordCount} kayıt NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING", [], $adminId);
            }
            
            return btk_create_and_upload_report_file(
                $operatorName, $operatorCode, $yetkiTipiKodu, 
                'ABONE_REHBER', $fileTimestamp, $reportDataLines, $isEmptyReport, false, ''
            );

        } catch (\Exception $e) {
            btk_log_module_action("ABONE REHBER ({$yetkiTipiKodu}) raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $adminId);
            return ['status' => 'error', 'message' => 'ABONE REHBER raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
} // btk_generate_abone_rehber_report sonu

if (!function_exists('btk_generate_abone_hareket_report')) {
    /**
     * ABONE HAREKET dosyasını oluşturur, sıkıştırır ve FTP'ye yükler.
     * NVI doğrulaması yapılmamış veya başarısız olmuş kayıtlara ait hareketleri rapora dahil etmez.
     */
    function btk_generate_abone_hareket_report($operatorCode, $operatorName, $yetkiTipiKodu, $fileTimestamp, $isBosDosyaGonderAyar) {
        $adminId = $_SESSION['adminid'] ?? ($GLOBALS['cron_admin_id'] ?? 0);
        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}) raporu oluşturuluyor...", "REPORT_GEN", [], $adminId);
        $reportDataLines = [];
        $hareketIdsToMark = [];
        $isEmptyReport = true;
        $excludedRecordCount = 0;

        try {
            $hareketler = Capsule::table('mod_btk_abone_hareketler as h')
                ->join('mod_btk_abone_data as d', 'h.btk_abone_data_id', '=', 'd.id')
                ->where('d.btk_rapor_yetki_tipi_kodu', $yetkiTipiKodu)
                ->where('h.raporlandi_mi', 0)
                ->select('h.*', 'd.whmcs_client_id as client_id_for_log', 'd.whmcs_service_id as service_id_for_log') 
                ->orderBy('h.musteri_hareket_zamani', 'asc')
                ->orderBy('h.id', 'asc')
                ->get();

            if (!$hareketler->isEmpty()) {
                foreach ($hareketler as $hareket) {
                    $snapshotArray = json_decode($hareket->hareket_anindaki_data_snapshot, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id} için snapshot JSON parse hatası.", "ERROR", ['snapshot_error' => json_last_error_msg()], $adminId, $hareket->client_id_for_log, $hareket->service_id_for_log);
                        continue;
                    }
                    
                    $isValidForReport = true;
                    if (($snapshotArray['musteri_tipi'] === 'G-SAHIS' || $snapshotArray['musteri_tipi'] === 'G-SIRKET')) {
                        if (!empty($snapshotArray['abone_tc_kimlik_no'])) {
                            $dogumYili = null;
                             if(!empty($snapshotArray['abone_dogum_tarihi']) && strlen($snapshotArray['abone_dogum_tarihi']) === 8) {
                                $dogumYili = substr($snapshotArray['abone_dogum_tarihi'], 0, 4);
                            }
                            if(empty($dogumYili) && ($snapshotArray['nvi_tckn_dogrulandi'] ?? 0) != 1 ){
                                $isValidForReport = false;
                                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id}, Snapshot TCKN {$snapshotArray['abone_tc_kimlik_no']} için doğum yılı eksik (raporlama anı), rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $hareket->client_id_for_log, $hareket->service_id_for_log);
                            } elseif(!empty($dogumYili)) { // Doğum yılı varsa ve NVI kontrolü gerekiyorsa yap
                                $isValidForReport = btk_is_record_nvi_valid_for_report($snapshotArray, 'tckn', 'abone_tc_kimlik_no', 'abone_adi', 'abone_soyadi', $dogumYili, null, "Abone Hareket (Snapshot) #{$hareket->id} (Rapor Anı)");
                            } else if (($snapshotArray['nvi_tckn_dogrulandi'] ?? 0) != 1) { // Doğum yılı yok ama DB'de zaten doğrulanmamışsa
                                $isValidForReport = false;
                            }
                        } elseif (!empty($snapshotArray['abone_pasaport_no']) && ($snapshotArray['abone_uyruk'] ?? 'TUR') !== 'TUR') {
                            // YKN kontrolü
                        }
                    }

                    if (!$isValidForReport) {
                        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id} (Müşteri: {$hareket->client_id_for_log}, Hizmet: {$hareket->service_id_for_log}) NVI doğrulaması başarısız/eksik olduğu için rapora eklenmedi.", "REPORT_SKIP", ['tckn_masked' => substr($snapshotArray['abone_tc_kimlik_no'] ?? '', 0,3).'***'], $adminId, $hareket->client_id_for_log, $hareket->service_id_for_log);
                        $excludedRecordCount++;
                        continue; 
                    }

                    $isEmptyReport = false;
                    $hareketBilgileri = [
                        'musteri_hareket_kodu' => $hareket->musteri_hareket_kodu,
                        'musteri_hareket_aciklama' => $hareket->musteri_hareket_aciklama,
                        'musteri_hareket_zamani' => $hareket->musteri_hareket_zamani
                    ];
                    $reportLineValues = btk_format_data_for_report_line($snapshotArray, $yetkiTipiKodu, $hareketBilgileri);
                    $reportDataLines[] = $reportLineValues;
                    $hareketIdsToMark[] = $hareket->id;
                }
            }

            if ($isEmptyReport && !$isBosDosyaGonderAyar) {
                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Raporlanacak geçerli hareket yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO", [], $adminId);
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli hareket yok ve boş dosya gönderimi kapalı.'];
            }
            if($excludedRecordCount > 0){
                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): {$excludedRecordCount} hareket NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING", [], $adminId);
            }

            $result = btk_create_and_upload_report_file(
                $operatorName, $operatorCode, $yetkiTipiKodu, 
                'ABONE_HAREKET', $fileTimestamp, $reportDataLines, $isEmptyReport
            );

            // Eğer dosya başarıyla ana FTP'ye yüklendiyse, hareketleri işaretle
            if (($result['status'] === 'success' || $result['status'] === 'partial_error') && !empty($hareketIdsToMark)) {
                if (isset($result['btk_ftp_status']['status']) && $result['btk_ftp_status']['status'] === 'success') { 
                    Capsule::table('mod_btk_abone_hareketler')
                        ->whereIn('id', $hareketIdsToMark)
                        ->update([
                            'raporlandi_mi' => 1,
                            'dosya_adi' => $result['filename'] ?? null,
                            'raporlanma_zamani' => date('Y-m-d H:i:s')
                        ]);
                    btk_log_module_action(count($hareketIdsToMark) . " adet hareket 'raporlandı' olarak işaretlendi.", "INFO", ['filename' => $result['filename'] ?? ''], $adminId);
                } else {
                    btk_log_module_action("Ana BTK FTP'ye yükleme başarısız olduğu için ABONE HAREKET raporundaki hareketler işaretlenmedi.", "FTP_WARNING", ['filename' => $result['filename'] ?? ''], $adminId);
                }
            }
            return $result;

        } catch (\Exception $e) {
            btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}) raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $adminId);
            return ['status' => 'error', 'message' => 'ABONE HAREKET raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
} // btk_generate_abone_hareket_report sonu

// lib/btkhelper.php - 10. PARÇA (SON PARÇA) - V2.0.1 - Kararlı Sürüm Adayı (Temizlenmiş ve NVI Entegreli)
// Bu parça, bir önceki parçanın devamıdır.

                    // Snapshot'taki YKN kontrolü (btk_generate_abone_hareket_report içindeki döngüde)
                    // } elseif (!empty($snapshotArray['abone_pasaport_no']) && ($snapshotArray['abone_uyruk'] ?? 'TUR') !== 'TUR') {
                    //     $dogumTarihiYkn = $snapshotArray['abone_dogum_tarihi'] ?? null; 
                    //     if (empty($dogumTarihiYkn) || strlen($dogumTarihiYkn) !== 8){
                    //         $isValidForReport = false;
                    //         btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id}, Snapshot YKN {$snapshotArray['abone_pasaport_no']} için doğum tarihi (YYYYMMDD) eksik/hatalı, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId, $hareket->client_id_for_log, $hareket->service_id_for_log);
                    //     } else {
                    //        // $isValidForReport = btk_is_record_nvi_valid_for_report($snapshotArray, 'ykn', 'abone_pasaport_no', 'abone_adi', 'abone_soyadi', null, $dogumTarihiYkn, "Abone Hareket (Snapshot) #{$hareket->id} (Rapor Anı)");
                    //     }
                    // }


                    if (!$isValidForReport) {
                        btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Hareket ID {$hareket->id} (Müşteri: {$hareket->client_id_for_log}, Hizmet: {$hareket->service_id_for_log}) NVI doğrulaması başarısız/eksik olduğu için rapora eklenmedi.", "REPORT_SKIP", ['tckn_masked' => substr($snapshotArray['abone_tc_kimlik_no'] ?? '', 0,3).'***'], $adminId, $hareket->client_id_for_log, $hareket->service_id_for_log);
                        $excludedRecordCount++;
                        continue; 
                    }

                    $isEmptyReport = false;
                    $hareketBilgileri = [
                        'musteri_hareket_kodu' => $hareket->musteri_hareket_kodu,
                        'musteri_hareket_aciklama' => $hareket->musteri_hareket_aciklama,
                        'musteri_hareket_zamani' => $hareket->musteri_hareket_zamani
                    ];
                    $reportLineValues = btk_format_data_for_report_line($snapshotArray, $yetkiTipiKodu, $hareketBilgileri);
                    $reportDataLines[] = $reportLineValues;
                    $hareketIdsToMark[] = $hareket->id;
                }
            }

            if ($isEmptyReport && !$isBosDosyaGonderAyar) {
                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): Raporlanacak geçerli hareket yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO", [], $adminId);
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli hareket yok ve boş dosya gönderimi kapalı.'];
            }
            if($excludedRecordCount > 0){
                btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}): {$excludedRecordCount} hareket NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING", [], $adminId);
            }

            $result = btk_create_and_upload_report_file(
                $operatorName, $operatorCode, $yetkiTipiKodu, 
                'ABONE_HAREKET', $fileTimestamp, $reportDataLines, $isEmptyReport, false, ''
            );

            // Eğer dosya başarıyla ana FTP'ye yüklendiyse, hareketleri işaretle
            if (($result['status'] === 'success' || $result['status'] === 'partial_error') && !empty($hareketIdsToMark)) {
                if (isset($result['btk_ftp_status']['status']) && $result['btk_ftp_status']['status'] === 'success') { 
                    Capsule::table('mod_btk_abone_hareketler')
                        ->whereIn('id', $hareketIdsToMark)
                        ->update([
                            'raporlandi_mi' => 1,
                            'dosya_adi' => $result['filename'] ?? null,
                            'raporlanma_zamani' => date('Y-m-d H:i:s')
                        ]);
                    btk_log_module_action(count($hareketIdsToMark) . " adet hareket 'raporlandı' olarak işaretlendi.", "INFO", ['filename' => $result['filename'] ?? ''], $adminId);
                } else {
                    btk_log_module_action("Ana BTK FTP'ye yükleme başarısız olduğu için ABONE HAREKET raporundaki hareketler işaretlenmedi.", "FTP_WARNING", ['filename' => $result['filename'] ?? ''], $adminId);
                }
            }
            return $result;

        } catch (\Exception $e) {
            btk_log_module_action("ABONE HAREKET ({$yetkiTipiKodu}) raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $adminId);
            return ['status' => 'error', 'message' => 'ABONE HAREKET raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
} // btk_generate_abone_hareket_report sonu


if (!function_exists('btk_generate_personel_report')) {
    /**
     * PERSONEL LİSTESİ Excel dosyasını oluşturur.
     * NVI doğrulaması yapılmamış veya başarısız olmuş personeli rapora dahil etmez.
     */
    function btk_generate_personel_report($operatorName, $operatorUnvani, $fileTimestampY_m) {
        $adminId = $_SESSION['adminid'] ?? ($GLOBALS['cron_admin_id'] ?? 0);
        btk_log_module_action("PERSONEL LİSTESİ raporu oluşturuluyor...", "REPORT_GEN", [], $adminId);
        $reportDataForExcel = [];
        $isEmptyReport = true;
        $excludedRecordCount = 0;
        
        try {
            $personelListesi = Capsule::table('mod_btk_personel')
                ->where('btk_listesine_eklensin', 1)
                ->where(function ($query) {
                    $query->whereNull('isten_ayrilma_tarihi')
                          ->orWhere('isten_ayrilma_tarihi', '>', date('Y-m-d'));
                })
                ->select('id','adi', 'soyadi', 'tc_kimlik_no', 'gorev_unvani', 'calistigi_birim', 'mobil_telefonu', 'sabit_telefonu', 'e_posta_adresi', 'nvi_tckn_dogrulandi', 'nvi_tckn_son_dogrulama')
                ->orderBy('soyadi', 'asc')->orderBy('adi', 'asc')
                ->get();

            if ($personelListesi->isEmpty() && !(bool)btk_get_module_setting('personel_bos_dosya_gonder', 0)) { // Personel için bos_dosya_gonder ayarı config'de olmalı
                btk_log_module_action("PERSONEL LİSTESİ: Raporlanacak personel yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO", [], $adminId);
                return ['status' => 'info', 'message' => 'Raporlanacak personel bulunamadı ve boş dosya gönderimi kapalı.'];
            }
            
            // Başlık Satırı
            $reportDataForExcel[] = [ 
                'Firma Adı', 'Adı', 'Soyadı', 'TC Kimlik No', 'Ünvan', 
                'Çalıştığı birim', 'Mobil telefonu', 'Sabit telefonu', 'E-posta adresi'
            ]; 

            if (!$personelListesi->isEmpty()){
                $isEmptyReport = false;
                foreach ($personelListesi as $personel) {
                    $personelArray = (array)$personel;
                    $isValidForReport = true;
                    
                    if (empty($personelArray['tc_kimlik_no'])) {
                         $isValidForReport = false;
                         btk_log_module_action("PERSONEL LİSTESİ: Personel ID {$personel->id} ({$personel->adi} {$personel->soyadi}) için TCKN boş, rapora eklenmedi.", "REPORT_NVI_SKIP", [], $adminId);
                    } else {
                        // Personel için doğum yılı NVI doğrulaması için gereklidir.
                        // Bu bilgi personel modalında girilmiş olmalı veya bir şekilde elde edilmeli.
                        // Şimdilik, eğer TCKN varsa ve doğrulanmamışsa veya eski ise, deneme yapılmaz, doğrudan atlanır.
                        // Daha gelişmiş bir sistemde, personel kaydında doğum yılı tutulup btk_is_record_nvi_valid_for_report çağrılabilir.
                        if (($personelArray['nvi_tckn_dogrulandi'] ?? 0) != 1) {
                             $isValidForReport = false;
                             // Burada NVI denemesi yapılabilir eğer doğum yılı bilgisi varsa.
                             // Şimdilik, sadece veritabanındaki duruma güveniyoruz.
                        }
                    }

                    if (!$isValidForReport) {
                        btk_log_module_action("PERSONEL LİSTESİ: Personel ID {$personel->id} ({$personel->adi} {$personel->soyadi}) NVI doğrulaması eksik/başarısız olduğu için rapora dahil edilmedi.", "REPORT_SKIP", [], $adminId);
                        $excludedRecordCount++;
                        continue; 
                    }

                    $reportDataForExcel[] = [
                        $operatorUnvani, 
                        $personel->adi,
                        $personel->soyadi,
                        $personel->tc_kimlik_no,
                        $personel->gorev_unvani,
                        $personel->calistigi_birim,
                        $personel->mobil_telefonu,
                        $personel->sabit_telefonu,
                        $personel->e_posta_adresi
                    ];
                }
                // Eğer tüm kayıtlar ayıklandıysa ve boş dosya gönderimi kapalıysa
                if(empty(array_slice($reportDataForExcel, 1)) && !(bool)btk_get_module_setting('personel_bos_dosya_gonder', 0) ){
                    $isEmptyReport = true; // Sadece başlık satırı kaldıysa boş sayılır
                }

            } // Personel listesi boş değilse bloğu sonu

            if ($isEmptyReport && !(bool)btk_get_module_setting('personel_bos_dosya_gonder', 0)) {
                 btk_log_module_action("PERSONEL LİSTESİ: Raporlanacak geçerli personel yok ve boş dosya gönderim ayarı kapalı.", "REPORT_INFO", [], $adminId);
                return ['status' => 'info', 'message' => 'Raporlanacak geçerli personel bulunamadı ve boş dosya gönderimi kapalı.'];
            }
             if($excludedRecordCount > 0){
                btk_log_module_action("PERSONEL LİSTESİ: {$excludedRecordCount} personel NVI doğrulaması nedeniyle rapora dahil edilmedi.", "REPORT_WARNING", [], $adminId);
            }
            
            // Personel raporu için $operatorCode boş gönderilebilir veya özel bir değer. YetkiTipiKodu da 'PERSONEL'
            return btk_create_and_upload_report_file(
                $operatorName, '', 'PERSONEL', 
                'PERSONEL_LISTESI', $fileTimestampY_m, 
                $reportDataForExcel, $isEmptyReport, true, $operatorUnvani
            );

        } catch (\Exception $e) {
            btk_log_module_action("PERSONEL LİSTESİ raporu oluşturulurken genel hata", "ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $adminId);
            return ['status' => 'error', 'message' => 'PERSONEL LİSTESİ raporu oluşturulurken genel hata: ' . $e->getMessage()];
        }
    }
} // btk_generate_personel_report sonu

if (!function_exists('btk_archive_old_movements')) {
    /**
     * Belirli bir süreden eski, raporlanmış hareketleri arşiv tablosuna taşır.
     */
    function btk_archive_old_movements($monthsOld) {
        $adminId = $_SESSION['adminid'] ?? ($GLOBALS['cron_admin_id'] ?? 0);
        if (!is_numeric($monthsOld) || $monthsOld <= 0) {
            btk_log_module_action("Hareket arşivleme periyodu geçersiz: {$monthsOld}", "CRON_WARNING", [], $adminId);
            return false;
        }
        btk_log_module_action("{$monthsOld} aydan eski hareketler arşivleniyor...", "CRON_PROCESS", [], $adminId);
        $archiveDate = date('Y-m-d H:i:s', strtotime("-{$monthsOld} months"));
        $movedCount = 0;

        Capsule::connection()->beginTransaction();
        try {
            $hareketlerToArchive = Capsule::table('mod_btk_abone_hareketler')
                ->where('raporlandi_mi', 1)
                ->where('islem_kayit_zamani', '<', $archiveDate) 
                ->limit(500) // Performans için toplu işlem, gerekirse döngüye alınır
                ->get();

            if ($hareketlerToArchive->isEmpty()) {
                btk_log_module_action("Arşivlenecek eski hareket bulunamadı.", "CRON_INFO", [], $adminId);
                Capsule::connection()->commit();
                return true;
            }

            foreach ($hareketlerToArchive as $hareket) {
                Capsule::table('mod_btk_abone_hareketler_arsiv')->insert((array)$hareket);
                Capsule::table('mod_btk_abone_hareketler')->where('id', $hareket->id)->delete();
                $movedCount++;
            }
            Capsule::connection()->commit();
            btk_log_module_action("{$movedCount} adet eski hareket başarıyla arşivlendi.", "CRON_SUCCESS", [], $adminId);
            return true;
        } catch (\Exception $e) {
            Capsule::connection()->rollBack();
            btk_log_module_action("Hareketler arşivlenirken hata", "CRON_ERROR", ['error' => $e->getMessage(), 'trace' => substr($e->getTraceAsString(),0,500)], $adminId);
            return false;
        }
    }
} // btk_archive_old_movements sonu

?>