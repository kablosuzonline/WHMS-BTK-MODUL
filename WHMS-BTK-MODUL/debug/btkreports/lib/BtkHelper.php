<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Yardımcı Sınıf
 */

if (!defined('WHMCS') && file_exists(dirname(dirname(dirname(dirname(__FILE__)))) . '/init.php')) {
    require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/init.php';
}

use WHMCS\Database\Capsule;
use WHMCS\Module\Addon\Setting as AddonSetting;
use WHMCS\Utility\Paginator;

class BtkHelper
{
    private $logPrefix = "BTK Reports Helper: ";
    public $operatorCode;
    public $operatorName;
    private $moduleSettings;
    const MAX_RECORDS_PER_ABN_FILE = 100000;

    private $btkFieldOrder = [
        'operator_kod', 'musteri_id', 'hat_no', 'hat_durum', 'hat_durum_kodu', 'hat_aciklama',
        'musteri_hareket_kodu', 'musteri_hareket_aciklama', 'musteri_hareket_zamani',
        'hizmet_tipi', 'musteri_tipi', 'abone_baslangic', 'abone_bitis',
        'abone_adi', 'abone_soyadi', 'abone_tc_kimlik_no', 'abone_pasaport_no', 'abone_unvan',
        'abone_vergi_numarasi', 'abone_mersis_numarasi', 'abone_cinsiyet', 'abone_uyruk',
        'abone_baba_adi', 'abone_ana_adi', 'abone_anne_kizlik_soyadi', 'abone_dogum_yeri',
        'abone_dogum_tarihi', 'abone_meslek', 'abone_tarife',
        'abone_kimlik_cilt_no', 'abone_kimlik_kutuk_no', 'abone_kimlik_sayfa_no',
        'abone_kimlik_il', 'abone_kimlik_ilce', 'abone_kimlik_mahalle_koy',
        'abone_kimlik_tipi', 'abone_kimlik_seri_no', 'abone_kimlik_verildigi_yer',
        'abone_kimlik_verildigi_tarih', 'abone_kimlik_aidiyeti',
        'abone_adres_tesis_il', 'abone_adres_tesis_ilce', 'abone_adres_tesis_mahalle',
        'abone_adres_tesis_cadde', 'abone_adres_tesis_dis_kapi_no', 'abone_adres_tesis_ic_kapi_no',
        'abone_adres_tesis_posta_kodu', 'abone_adres_tesis_adres_kodu',
        'abone_adres_irtibat_tel_no_1', 'abone_adres_irtibat_tel_no_2', 'abone_adres_e_mail',
        'abone_adres_yerlesim_il', 'abone_adres_yerlesim_ilce', 'abone_adres_yerlesim_mahalle',
        'abone_adres_yerlesim_cadde', 'abone_adres_yerlesim_dis_kapi_no',
        'abone_adres_yerlesim_ic_kapi_no', 'abone_adres_yerlesim_no',
        'kurum_yetkili_adi', 'kurum_yetkili_soyadi', 'kurum_yetkili_tckimlik_no',
        'kurum_yetkili_telefon', 'kurum_adres',
        'aktivasyon_bayi_adi', 'aktivasyon_bayi_adresi', 'aktivasyon_kullanici',
        'guncelleyen_bayi_adi', 'guncelleyen_bayi_adresi', 'guncelleyen_kullanici',
        'statik_ip',
        'iss_hiz_profili', 'iss_kullanici_adi', 'iss_pop_bilgisi',
        'sth_onceki_hat_numarasi', 'sth_dondurulma_tarihi', 'sth_kisitlama_tarihi', 'sth_yurtdisi_aktif',
        'sth_sesli_arama_aktif', 'sth_rehber_aktif', 'sth_clir_ozelligi_aktif', 'sth_data_aktif',
        'sth_sehirlerarasi_aktif', 'sth_santral_binasi', 'sth_santral_tipi', 'sth_sebeke_hizmet_numarasi',
        'sth_pilot_numara', 'sth_ddi_hizmet_numarasi', 'sth_gorunen_numara', 'sth_referans_no',
        'sth_ev_isyeri', 'sth_abone_id', 'sth_servis_numarasi', 'sth_dahili_no', 'sth_alfanumerik_baslik',
        'gsm_onceki_hat_numarasi', 'gsm_dondurulma_tarihi','gsm_kisitlama_tarihi','gsm_yurtdisi_aktif',
        'gsm_sesli_arama_aktif','gsm_rehber_aktif','gsm_clir_ozelligi_aktif','gsm_data_aktif',
        'gsm_eskart_bilgisi','gsm_icci','gsm_imsi','gsm_dual_gsm_no','gsm_fax_no',
        'gsm_vpn_kisakod_arama_aktif','gsm_servis_numarasi','gsm_bilgi_1','gsm_bilgi_2',
        'gsm_bilgi_3','gsm_alfanumerik_baslik',
        'uydu_onceki_hat_numarasi', 'uydu_dondurulma_tarihi', 'uydu_kisitlama_tarihi', 'uydu_yurtdisi_aktif',
        'uydu_sesli_arama_aktif', 'uydu_rehber_aktif', 'uydu_clir_ozelligi_aktif', 'uydu_data_aktif',
        'uydu_uydu_adi', 'uydu_terminal_id', 'uydu_enlem_bilgisi', 'uydu_boylam_bilgisi',
        'uydu_hiz_profili', 'uydu_pop_bilgisi', 'uydu_remote_bilgisi', 'uydu_anauydu_firma',
        'uydu_uydu_telefon_no', 'uydu_telefon_serino', 'uydu_telefon_imeino',
        'uydu_telefon_marka', 'uydu_telefon_model', 'uydu_telefon_simkartno',
        'uydu_telefonu_internet_kullanimi', 'uydu_alfanumerik_baslik',
        'aih_hiz_profil_a', 'aih_hizmet_saglayici_a', 'aih_pop_bilgi_a', 'aih_ulke_a',
        'aih_sinir_gecis_noktasi_a', 'aih_adres_tesis_ulke_b', 'aih_adres_tesis_il_b',
        'aih_adres_tesis_ilce_b', 'aih_adres_tesis_mahalle_b', 'aih_adres_tesis_cadde_b',
        'aih_adres_tesis_dis_kapi_no_b', 'aih_adres_tesis_ic_kapi_no_b',
        'aih_sinir_gecis_noktasi_b', 'aih_devre_adlandirmasi', 'aih_devre_guzergah'
    ];

    public function __construct()
    {
        $this->loadModuleSettings();
        $this->operatorCode = $this->getSetting('operator_code', '');
        $this->operatorName = $this->getSetting('operator_name', '');
    }

    private function loadModuleSettings()
    {
        $this->moduleSettings = [];
        try {
            $settings = AddonSetting::module('btkreports')->get()->toArray();
            if ($settings) {
                foreach ($settings as $setting) {
                    $this->moduleSettings[$setting['setting']] = $setting['value'];
                }
            }
        } catch (\Exception $e) {
            $this->logMessage('ERROR', __CLASS__ . '::' . __FUNCTION__, "Modül ayarları yüklenirken hata: " . $e->getMessage(), true);
        }
    }

    public function getSetting($key, $default = null)
    {
        return $this->moduleSettings[$key] ?? $default;
    }

    public function logMessage($level = 'INFO', $islem = '', $mesaj = '', $bypassHelperReadyCheck = false)
    {
        if (!$bypassHelperReadyCheck && empty($this->moduleSettings) && $islem !== __CLASS__ . '::loadModuleSettings' && $islem !== __CLASS__ . ' Constructor') {
             error_log("BtkHelper loglama hatası (Ayarlar Yüklenemedi): {$islem} - {$mesaj}");
             return;
        }
        try {
            Capsule::table('mod_btk_logs')->insert([
                'tarih'   => gmdate('Y-m-d H:i:s'),
                'islem'   => mb_substr((string)$islem, 0, 255),
                'mesaj'   => mb_substr((string)$mesaj, 0, 65535),
                'seviye'  => strtoupper($level),
            ]);
        } catch (\Exception $e) {
            if (function_exists('logActivity')) {
                logActivity("BTK Reports - Log Yazma DB Hatası: " . $e->getMessage() . " | Orijinal Log: {$islem} - {$mesaj}", 0);
            } else {
                error_log("BTK Reports - Log Yazma DB Hatası: " . $e->getMessage() . " | Orijinal Log: {$islem} - {$mesaj}");
            }
        }
    }

    public function formatBtkDateTime($timestamp = null)
    {
        try {
            $dt = new \DateTime($timestamp ?? 'now', new \DateTimeZone('Europe/Istanbul'));
            return $dt->format('YmdHis');
        } catch (\Exception $e) {
            $this->logMessage('WARNING', __METHOD__, "TarihSaat formatlama hatası: " . $e->getMessage() . " | Girdi: " . print_r($timestamp, true));
            return date('YmdHis'); // Fallback to current server time in desired format
        }
    }

    public function formatBtkDate($timestamp = null)
    {
         try {
            $dt = new \DateTime($timestamp ?? 'now', new \DateTimeZone('Europe/Istanbul'));
            return $dt->format('Ymd');
        } catch (\Exception $e) {
            $this->logMessage('WARNING', __METHOD__, "Tarih formatlama hatası (Ymd): " . $e->getMessage() . " | Girdi: " . print_r($timestamp, true));
            return date('Ymd'); // Fallback
        }
    }

    public function btkCleanString($text, $maxLength = null)
    {
        if ($text === null || $text === '') return '';
        $text = trim((string)$text);
        $search  = array('ı', 'i', 'İ', 'ğ', 'Ğ', 'ü', 'Ü', 'ş', 'Ş', 'ö', 'Ö', 'ç', 'Ç');
        $replace = array('I', 'I', 'I', 'G', 'G', 'U', 'U', 'S', 'S', 'O', 'O', 'C', 'C');
        $text = str_replace($search, $replace, $text);
        $text = mb_strtoupper($text, 'UTF-8');
        $forbiddenChars = ['|', ';', "\n", "\r", "\t", "'", '"'];
        $text = str_replace($forbiddenChars, ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);
        if ($maxLength !== null && mb_strlen($text, 'UTF-8') > $maxLength) {
            $text = mb_substr($text, 0, $maxLength, 'UTF-8');
        }
        return $text;
    }
// --- BÖLÜM 1 / 4 SONU - (BtkHelper.php, Sınıf Tanımı, Ayarlar, Loglama ve Temel Yardımcılar - TASTAMAM SÜRÜM)

// --- BÖLÜM 2 / 4 BAŞI - (BtkHelper.php, Rapor Satırı ve İçeriği Oluşturma Fonksiyonları - TASTAMAM SÜRÜM)
    private function buildBtkReportLine(array $data, $raporYetkiTipiEki = '')
    {
        $lineParts = [];
        $hizmetTipiKategori = '';
        $normalizedRaporTipiEki = strtoupper(trim($raporYetkiTipiEki ?? ''));

        if (str_contains($normalizedRaporTipiEki, 'ISS')) $hizmetTipiKategori = 'ISS';
        elseif (str_contains($normalizedRaporTipiEki, 'AIH')) $hizmetTipiKategori = 'AIH';
        elseif (str_contains($normalizedRaporTipiEki, 'STH')) $hizmetTipiKategori = 'STH';
        elseif (str_contains($normalizedRaporTipiEki, 'GSM') || str_contains($normalizedRaporTipiEki, 'GMPCS') || str_contains($normalizedRaporTipiEki, 'IMT')) $hizmetTipiKategori = 'GSM';
        elseif (str_contains($normalizedRaporTipiEki, 'UYDU')) $hizmetTipiKategori = 'UYDU';
        // Diğerleri (KABLONET, OKTH, CTH vb.) için rapor_tipi_eki'ne göre kategori belirlenebilir.

        foreach ($this->btkFieldOrder as $index => $fieldName) {
            $value = $this->btkCleanString($data[$fieldName] ?? null);
            $isCommonField = $index < 70;

            if (!$isCommonField) {
                $fieldPrefix = substr($fieldName, 0, strpos($fieldName, '_')); // örn: iss, aih, gsm
                if (strtoupper($fieldPrefix) !== $hizmetTipiKategori) {
                    $value = '';
                }
            }
            $lineParts[] = $value;
        }
        return implode('|;|', $lineParts);
    }

    public function generateRehberReportContent($yetkiTipiKodu)
    {
        $contentLines = []; $recordsProcessed = 0;
        try {
            $yetkiDetay = Capsule::table('mod_btk_yetki_turleri')->where('yetki_kodu', $yetkiTipiKodu)->first();
            if (!$yetkiDetay || empty($yetkiDetay->rapor_tipi_eki)) { $this->logMessage('ERROR', __METHOD__, "{$yetkiTipiKodu} için rapor tipi eki (rapor_tipi_eki) bulunamadı."); return ""; }
            $raporTipiEki = $yetkiDetay->rapor_tipi_eki;
            $mappedGroupIds = Capsule::table('mod_btk_product_group_mappings')->where('yetki_kodu', $yetkiTipiKodu)->pluck('group_id')->all();
            if (empty($mappedGroupIds)) { $this->logMessage('INFO', __METHOD__, "{$yetkiTipiKodu} için eşleşen ürün grubu bulunamadı (Rehber)."); return ""; }

            Capsule::table('mod_btk_abone_rehber as r')
                ->join('tblhosting as h', 'r.service_id', '=', 'h.id')
                ->whereIn('h.gid', $mappedGroupIds)
                ->select('r.*')->orderBy('r.id')
                ->chunk(200, function ($rehberKayitlari) use (&$contentLines, &$recordsProcessed, $raporTipiEki) {
                    foreach ($rehberKayitlari as $kayit) {
                        $kayitArray = (array)$kayit;
                        $contentLines[] = $this->buildBtkReportLine($kayitArray, $kayitArray['hizmet_tipi'] ?? $raporTipiEki);
                        $recordsProcessed++;
                        if ($recordsProcessed % 5000 == 0) $this->logMessage('DEBUG', __METHOD__, "REHBER ({$raporTipiEki}): {$recordsProcessed} kayıt işlendi.");
                        if ($recordsProcessed >= self::MAX_RECORDS_PER_ABN_FILE) return false;
                    }
                });
            if ($recordsProcessed > 0) $this->logMessage('INFO', __METHOD__, "{$raporTipiEki} için REHBER raporu oluşturuldu. Kayıt Sayısı: {$recordsProcessed}");
            else $this->logMessage('INFO', __METHOD__, "{$raporTipiEki} için REHBER raporuna eklenecek kayıt bulunamadı.");
        } catch (\Exception $e) { $this->logMessage('ERROR', __METHOD__, "REHBER ({$yetkiTipiKodu}) içeriği oluşturulurken hata: " . $e->getMessage() . "\n" . $e->getTraceAsString()); return ""; }
        return implode("\n", $contentLines);
    }

    public function generateHareketReportContent($yetkiTipiKodu)
    {
        $contentLines = []; $hareketIds = []; $recordsProcessed = 0;
        $yetkiDetay = Capsule::table('mod_btk_yetki_turleri')->where('yetki_kodu', $yetkiTipiKodu)->first();
        if (!$yetkiDetay || empty($yetkiDetay->rapor_tipi_eki)) { $this->logMessage('ERROR', __METHOD__, "{$yetkiTipiKodu} için rapor tipi eki bulunamadı (Hareket)."); return ['content' => "", 'hareket_ids' => []];}
        $raporTipiEki = $yetkiDetay->rapor_tipi_eki;
        try {
            $mappedGroupIds = Capsule::table('mod_btk_product_group_mappings')->where('yetki_kodu', $yetkiTipiKodu)->pluck('group_id')->all();
            if (empty($mappedGroupIds)) { $this->logMessage('INFO', __METHOD__, "{$yetkiTipiKodu} için eşleşen ürün grubu bulunamadı (Hareket)."); return ['content' => "", 'hareket_ids' => []]; }

            Capsule::table('mod_btk_abone_hareket_live as hl')
                ->join('mod_btk_abone_rehber as r', 'hl.rehber_id', '=', 'r.id')
                ->join('tblhosting as h', 'r.service_id', '=', 'h.id')
                ->where('hl.gonderildi', 0)->whereIn('h.gid', $mappedGroupIds)
                ->select('hl.id as hareket_id_live', 'hl.musteri_hareket_kodu', 'hl.musteri_hareket_aciklama', 'hl.musteri_hareket_zamani', 'r.*')
                ->orderBy('hl.musteri_hareket_zamani', 'asc')
                ->chunk(200, function ($hareketKayitlari) use (&$contentLines, &$hareketIds, &$recordsProcessed, $raporTipiEki) {
                    foreach ($hareketKayitlari as $kayit) {
                        $kayitArray = (array)$kayit;
                        $contentLines[] = $this->buildBtkReportLine($kayitArray, $kayitArray['hizmet_tipi'] ?? $raporTipiEki);
                        $hareketIds[] = $kayit->hareket_id_live;
                        $recordsProcessed++;
                        if ($recordsProcessed % 5000 == 0) $this->logMessage('DEBUG', __METHOD__, "HAREKET ({$raporTipiEki}): {$recordsProcessed} kayıt işlendi.");
                        if ($recordsProcessed >= self::MAX_RECORDS_PER_ABN_FILE) return false;
                    }
                });
             if ($recordsProcessed > 0) $this->logMessage('INFO', __METHOD__, "{$raporTipiEki} için HAREKET raporu oluşturuldu. Kayıt Sayısı: {$recordsProcessed}");
            else $this->logMessage('INFO', __METHOD__, "{$raporTipiEki} için HAREKET raporuna eklenecek yeni kayıt bulunamadı.");
        } catch (\Exception $e) { $this->logMessage('ERROR', __METHOD__, "HAREKET ({$yetkiTipiKodu}) içeriği oluşturulurken hata: " . $e->getMessage() . "\n" . $e->getTraceAsString()); return ['content' => "", 'hareket_ids' => []]; }
        return ['content' => implode("\n", $contentLines), 'hareket_ids' => $hareketIds];
    }
// --- BÖLÜM 2 / 4 SONU - (BtkHelper.php, Rapor Satırı ve İçeriği Oluşturma Fonksiyonları - TASTAMAM SÜRÜM)

// --- BÖLÜM 3 / 4 BAŞI - (BtkHelper.php, Hareket İşaretleme ve Kapsamlı CNT Yönetimi - TASTAMAM SÜRÜM)
    public function markHareketAsSentAndArchive(array $hareketIds, $gonderimDosyaAdi, $gonderimCnt)
    {
        if (empty($hareketIds)) return true;
        $liveTableDayLimit = (int)$this->getSetting('hareket_live_table_day_limit', 7);
        if ($liveTableDayLimit <= 0) $liveTableDayLimit = 7;
        try {
            Capsule::beginTransaction();
            Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $hareketIds)
                ->update(['gonderildi' => 1, 'gonderim_dosya_adi' => $gonderimDosyaAdi, 'gonderim_cnt' => $gonderimCnt]);
            $archiveDateThreshold = date('Y-m-d H:i:s', strtotime("-{$liveTableDayLimit} days"));
            $arsivlenecekHareketler = Capsule::table('mod_btk_abone_hareket_live')
                ->where('gonderildi', 1)->where('created_at', '<', $archiveDateThreshold)->get()->all();
            if (count($arsivlenecekHareketler) > 0) {
                $arsivlenecekData = []; $arsivlenenCanliIds = [];
                foreach ($arsivlenecekHareketler as $hareket) {
                    $hareketArray = (array)$hareket; unset($hareketArray['id']);
                    $hareketArray['archived_at'] = gmdate('Y-m-d H:i:s');
                    $arsivlenecekData[] = $hareketArray; $arsivlenenCanliIds[] = $hareket->id;
                }
                Capsule::table('mod_btk_abone_hareket_archive')->insert($arsivlenecekData);
                Capsule::table('mod_btk_abone_hareket_live')->whereIn('id', $arsivlenenCanliIds)->delete();
                $this->logMessage('INFO', __METHOD__, count($arsivlenenCanliIds) . " hareket arşivlendi ve canlı tablodan silindi.");
            }
            Capsule::commit(); return true;
        } catch (\Exception $e) { Capsule::rollBack(); $this->logMessage('ERROR', __METHOD__, "Hareket işaretleme/arşivleme hatası: " . $e->getMessage() . "\n" . $e->getTraceAsString()); return false; }
    }

    public function getNextCnt($raporTuru, $operatorName, $operatorCode, $raporTipiEki, $timestampPrefix, $dosyaIcerikHash, $isManualRetry = false, $previousFileNameForRetry = null)
    {
        $logSuffix = $isManualRetry ? " (Manuel Tekrar)" : " (Otomatik/İlk)";
        $this->logMessage('DEBUG', __METHOD__ . $logSuffix, "CNT hesaplama: {$raporTuru}, OpName:{$operatorName}, OpCode:{$operatorCode}, TipEk:{$raporTipiEki}, Zaman:{$timestampPrefix}, Hash:{$dosyaIcerikHash}, ÖncekiDosya:{$previousFileNameForRetry}");

        $dosyaAdiPatternBase = $operatorName . '_' . $operatorCode . '_' .
                               ($raporTuru === 'PERSONEL' ? '' : ($raporTipiEki ?? 'ERR') . '_') . // Personel için _TIP_ eki yok
                               $raporTuru . '_' . $timestampPrefix;
        try {
            $query = Capsule::table('mod_btk_ftp_logs')->where('rapor_turu', $raporTuru);

            if ($isManualRetry && $previousFileNameForRetry) {
                $baseNameForRetry = substr($previousFileNameForRetry, 0, strrpos($previousFileNameForRetry, '_'));
                 $query->where('dosya_adi', 'LIKE', $baseNameForRetry . '_%')->where('durum', 'BASARILI');
            } else {
                $query->where('dosya_adi', 'LIKE', $dosyaAdiPatternBase . '_%');
            }
            $lastEntry = $query->orderBy('gonderim_tarihi', 'desc')->orderBy('cnt', 'desc')->first();

            if ($lastEntry) {
                if ($isManualRetry) {
                    $newCnt = intval($lastEntry->cnt) + 1;
                    $this->logMessage('INFO', __METHOD__ . $logSuffix, "Manuel tekrar için CNT artırıldı. Önceki: {$lastEntry->cnt}, Yeni: {$newCnt} (Dosya: {$previousFileNameForRetry})");
                    return str_pad($newCnt, 2, '0', STR_PAD_LEFT);
                } else {
                    // Otomatik (cron) gönderimde, aynı timestampPrefix ile zaten başarılı bir kayıt varsa,
                    // bu BTK'nın beklentisine göre ya aynı CNT ile üzerine yazmak (riskli) ya da
                    // yeni bir timestamp ile '01' almak anlamına gelir.
                    // Bizim cron her çalıştığında YENİ bir timestampPrefix ürettiği için,
                    // bu $lastEntry normalde null olmalı. Eğer değilse, bu çok nadir bir durumdur
                    // (örn: cron aynı saniyede iki kez çalıştı veya timestamp üretimi hatalı).
                    // Bu durumda yeni bir CNT ile devam etmek yerine, sorunu loglayıp '01' ile
                    // devam etmek (yeni bir dosya gibi) daha güvenli olabilir veya işlemi durdurmak.
                    // Şimdilik, eğer bir şekilde aynı timestamp ile karşılaşılırsa, CNT'yi artırıyoruz,
                    // ancak bu durumun detaylı incelenmesi gerekir.
                    $this->logMessage('WARNING', __METHOD__ . $logSuffix, "Otomatik gönderimde aynı zaman damgası ({$timestampPrefix}) ile önceki kayıt bulundu. CNT artırılıyor. Önceki CNT: {$lastEntry->cnt}. Bu durum incelenmeli.");
                    $newCnt = intval($lastEntry->cnt) + 1;
                    return str_pad($newCnt, 2, '0', STR_PAD_LEFT);
                }
            }
        } catch (\Exception $e) { $this->logMessage('ERROR', __METHOD__, "CNT alınırken veritabanı hatası: " . $e->getMessage()); }
        $this->logMessage('INFO', __METHOD__ . $logSuffix, "Yeni gönderim/zaman damgası için CNT '01' olarak ayarlandı.");
        return '01';
    }
// --- BÖLÜM 3 / 4 SONU - (BtkHelper.php, Hareket İşaretleme ve Kapsamlı CNT Yönetimi - TASTAMAM SÜRÜM)

// --- BÖLÜM 4 / 4 BAŞI - (BtkHelper.php, FTP, Sıkıştırma, Pagination ve Adres Yardımcıları - TASTAMAM SÜRÜM)
    public function logFtpTransaction($raporTuru, $dosyaAdi, $ftpSunucuTuru, $cnt, $durum, $hataMesaji = null)
    {
        try {
            Capsule::table('mod_btk_ftp_logs')->insert([
                'rapor_turu' => strtoupper($raporTuru),
                'dosya_adi' => mb_substr($dosyaAdi, 0, 255),
                'ftp_sunucu_turu' => strtoupper($ftpSunucuTuru),
                'gonderim_tarihi' => gmdate('Y-m-d H:i:s'),
                'cnt' => str_pad((int)$cnt, 2, '0', STR_PAD_LEFT),
                'durum' => strtoupper($durum),
                'hata_mesaji' => $hataMesaji ? mb_substr($hataMesaji, 0, 65535) : null
            ]);
        } catch (\Exception $e) {
            $this->logMessage('ERROR', __METHOD__, "FTP log kaydı ({$dosyaAdi}) oluşturulurken hata: " . $e->getMessage());
        }
    }

    public function compressFileGzip($sourceFilePath, $destinationFilePath)
    {
        if (!file_exists($sourceFilePath)) {
            $this->logMessage('ERROR', __METHOD__, "Sıkıştırılacak kaynak dosya bulunamadı: {$sourceFilePath}");
            return false;
        }
        if (!extension_loaded('zlib')) {
            $this->logMessage('ERROR', __METHOD__, "Zlib eklentisi PHP'de aktif değil. Gzip sıkıştırması yapılamıyor.");
            return false;
        }
        $gzFile = @gzopen($destinationFilePath, 'wb9'); // En yüksek sıkıştırma
        if (!$gzFile) {
            $this->logMessage('ERROR', __METHOD__, "Gzip dosyası ({$destinationFilePath}) açılamadı/oluşturulamadı. İzinleri kontrol edin.");
            return false;
        }
        $fp = @fopen($sourceFilePath, 'rb');
        if (!$fp) {
            $this->logMessage('ERROR', __METHOD__, "Kaynak dosya ({$sourceFilePath}) okunamadı.");
            @gzclose($gzFile);
            return false;
        }
        $bytesWrittenTotal = 0;
        while (!feof($fp)) {
            $buffer = fread($fp, 8192); // 8KB'lık parçalar halinde oku
            $bytesWritten = @gzwrite($gzFile, $buffer);
            if ($bytesWritten === false) { // Yazma hatası
                $this->logMessage('ERROR', __METHOD__, "Gzip dosyasına yazma hatası: {$destinationFilePath}");
                @fclose($fp);
                @gzclose($gzFile);
                if (file_exists($destinationFilePath)) @unlink($destinationFilePath);
                return false;
            }
            $bytesWrittenTotal += $bytesWritten;
        }
        @fclose($fp);
        @gzclose($gzFile);

        if (file_exists($destinationFilePath) && filesize($destinationFilePath) > 0 && $bytesWrittenTotal > 0) {
            $this->logMessage('INFO', __METHOD__, "{$sourceFilePath} -> {$destinationFilePath} olarak sıkıştırıldı ({$bytesWrittenTotal} byte).");
            return true;
        } else {
            $this->logMessage('ERROR', __METHOD__, "{$destinationFilePath} sıkıştırma sonrası oluşturulamadı, boş veya yazma hatası (yazılan byte: {$bytesWrittenTotal}).");
            if (file_exists($destinationFilePath)) @unlink($destinationFilePath);
            return false;
        }
    }

    public function uploadFileFtp($ftpHost, $ftpUser, $ftpPass, $localFilePath, $remoteFilePath, $passiveMode = true)
    {
        if (!file_exists($localFilePath)) { $this->logMessage('ERROR', __METHOD__, "FTP'ye yüklenecek lokal dosya bulunamadı: {$localFilePath}"); return false; }
        if (empty($ftpHost) || empty($ftpUser)) { $this->logMessage('ERROR', __METHOD__, "FTP Host veya Kullanıcı Adı boş. Yükleme yapılamıyor: {$ftpHost}"); return false; }

        $conn_id = @ftp_connect($ftpHost, 21, 15); // 15 saniye timeout
        if (!$conn_id) { $this->logMessage('ERROR', __METHOD__, "FTP bağlantısı kurulamadı: {$ftpHost}"); return false; }

        if (!@ftp_login($conn_id, $ftpUser, $ftpPass)) {
            $this->logMessage('ERROR', __METHOD__, "FTP girişi başarısız: {$ftpUser}@{$ftpHost}");
            @ftp_close($conn_id); return false;
        }
        if ($passiveMode) {
            if(!@ftp_pasv($conn_id, true)) {
                 $this->logMessage('WARNING', __METHOD__, "FTP Pasif mod etkinleştirilemedi: {$ftpHost}. Aktif mod denenecek.");
                 // Aktif modu denemeye gerek yok, genellikle pasif mod çalışır. Sorun varsa logda belirtilir.
            }
        }

        $remoteDir = dirname($remoteFilePath);
        if ($remoteDir !== '.' && $remoteDir !== '/' && !empty($remoteDir)) {
            $parts = explode('/', trim($remoteDir, '/'));
            $currentFtpPath = ''; // Her zaman kökten başla eğer yol / ile başlıyorsa
            if (substr($remoteDir, 0, 1) !== '/') { // Göreceli yolsa (pek olası değil)
                 $currentFtpPath = @ftp_pwd($conn_id) ?: '';
                 if ($currentFtpPath && substr($currentFtpPath, -1) !== '/') $currentFtpPath .= '/';
            }
            foreach ($parts as $part) {
                if (empty($part)) continue; // // gibi durumları atla
                $pathToCheck = ($currentFtpPath === '' || substr($currentFtpPath, -1) === '/' ? $currentFtpPath : $currentFtpPath . '/') . $part;
                if (substr($pathToCheck, 0, 1) !== '/' && $currentFtpPath === '') $pathToCheck = '/' . $pathToCheck; // Kök için ekle

                 if (!@ftp_chdir($conn_id, $pathToCheck)) {
                    if (!@ftp_mkdir($conn_id, $pathToCheck)) {
                        $this->logMessage('WARNING', __METHOD__, "Uzak FTP dizini oluşturulamadı: {$pathToCheck} on {$ftpHost}");
                    } else {
                        $this->logMessage('INFO', __METHOD__, "Uzak FTP dizini oluşturuldu: {$pathToCheck} on {$ftpHost}");
                        // Oluşturduktan sonra chmod denemesi (opsiyonel)
                        // @ftp_chmod($conn_id, 0755, $pathToCheck);
                    }
                }
                $currentFtpPath = $pathToCheck;
            }
            if(!@ftp_chdir($conn_id, $remoteDir)){ // Son dizine gitmeyi tekrar dene
                 $this->logMessage('WARNING', __METHOD__, "FTP'de son hedef dizine ({$remoteDir}) geçilemedi on {$ftpHost}.");
            }
        }

        $upload = @ftp_put($conn_id, basename($remoteFilePath), $localFilePath, FTP_BINARY);
        $ftpErrorCode = function_exists('ftp_errno') ? ftp_errno($conn_id) : 'N/A'; // PHP 8'de ftp_errno yok.
        // PHP 8 ve sonrası için: $error = error_get_last(); if($error && strpos($error['message'], 'ftp_') !== false) ...
        @ftp_close($conn_id);

        if ($upload) {
            $this->logMessage('INFO', __METHOD__, "{$localFilePath} -> {$ftpHost}:{$remoteFilePath} yüklendi.");
            return true;
        } else {
            $this->logMessage('ERROR', __METHOD__, "{$localFilePath} FTP'ye yüklenemedi: {$ftpHost}:{$remoteFilePath}. FTP Hata Kodu/Mesajı: {$ftpErrorCode}");
            return false;
        }
    }

    public function testFtpConnection($ftpHost, $ftpUser, $ftpPass, $passiveMode = true)
    {
        if (empty($ftpHost) || empty($ftpUser)) { return ['status' => 'error', 'message' => 'FTP Host ve Kullanıcı Adı boş olamaz.']; }
        $conn_id = @ftp_connect($ftpHost, 21, 10);
        if (!$conn_id) { return ['status' => 'error', 'message' => 'FTP sunucusuna bağlanılamadı: ' . $ftpHost]; }
        $login_result = @ftp_login($conn_id, $ftpUser, $ftpPass);
        if (!$login_result) { @ftp_close($conn_id); return ['status' => 'error', 'message' => 'FTP girişi başarısız. Kullanıcı adı veya şifre hatalı olabilir.']; }
        if ($passiveMode) { if(!@ftp_pasv($conn_id, true)){ @ftp_close($conn_id); return ['status' => 'warning', 'message' => 'Bağlantı başarılı ancak Pasif mod etkinleştirilemedi.'];} }
        @ftp_close($conn_id);
        return ['status' => 'success', 'message' => 'FTP bağlantısı başarıyla kuruldu.'];
    }

    public function getAdresReferans($type, $parentId = null)
    {
        $results = [];
        try {
            $tableName = 'mod_btk_adres_' . $type;
            $nameFieldName = $type . '_adi';
            $idFieldName = 'id'; // Adres tablolarımızda ID'ler auto_increment int
            $query = Capsule::table($tableName);
            if ($parentId !== null && $type !== 'il') {
                $parentKey = ($type === 'ilce' ? 'il_id' : ($type === 'mahalle' ? 'ilce_id' : null));
                if ($parentKey) $query->where($parentKey, (int)$parentId);
            }
            // Adres tablolarından ID ve Adı çekiyoruz, JS tarafı da buna göre ayarlanmalı
            $results = $query->orderBy($nameFieldName)->select($idFieldName . ' as id', $nameFieldName . ' as name')->get()->all();
        } catch (\Exception $e) { $this->logMessage('ERROR', __METHOD__, "Adres referans ({$type}) çekilirken hata: " . $e->getMessage()); }
        return $results;
    }

    public function renderPagination($paginator, $appends = [])
    {
        if (!$paginator || !method_exists($paginator, 'lastPage') || $paginator->lastPage() <= 1) {
            return '';
        }
        // Paginator'a ek parametreleri ekle
        if (!empty($appends)) {
            $paginator->appends($appends);
        }
        // WHMCS Paginator'ın kendi HTML render metodunu kullan
        return $paginator->links()->toHtml();
    }

} // End of BtkHelper class
// --- BÖLÜM 4 / 4 SONU - (BtkHelper.php, FTP, Sıkıştırma, Pagination ve Adres Yardımcıları - TASTAMAM SÜRÜM)
?>