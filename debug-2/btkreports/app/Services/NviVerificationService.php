<?php

namespace WHMCS\Module\Addon\BtkRaporlari\Services;

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
// use SoapClient; // PHP SoapClient eklentisi gereklidir.

/**
 * Class NviVerificationService
 *
 * TCKN ve YKN doğrulamalarını NVI SOAP servisleri üzerinden gerçekleştirir.
 * NVI Public Servis WSDL Adresleri:
 * TCKN: https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL
 * YKN: https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL
 */
class NviVerificationService
{
    private const TCKN_WSDL_URL = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
    private const YKN_WSDL_URL = 'https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL';

    private static $soapOptions = [
        'trace' => 1, // Hata ayıklama için (production'da kapatılabilir)
        'exceptions' => true, // SOAP hatalarını exception olarak fırlat
        'cache_wsdl' => WSDL_CACHE_BOTH, // WSDL cacheleme
        'connection_timeout' => 10, // Bağlantı zaman aşımı (saniye)
        // SSL doğrulaması için ek ayarlar gerekebilir (sunucu yapılandırmasına bağlı)
        // 'stream_context' => stream_context_create([
        //     'ssl' => [
        //         'verify_peer' => false,
        //         'verify_peer_name' => false,
        //         'allow_self_signed' => true
        //     ]
        // ])
    ];

    /**
     * T.C. Kimlik Numarası doğrulaması yapar.
     *
     * @param int|string $tcKimlikNo Doğrulanacak T.C. Kimlik Numarası (11 hane, sayısal)
     * @param string $ad Ad (Büyük harflerle, Türkçe karakterler NVI'nin beklediği gibi olmalı)
     * @param string $soyad Soyad (Büyük harflerle, Türkçe karakterler NVI'nin beklediği gibi olmalı)
     * @param int $dogumYili Doğum Yılı (4 hane, sayısal)
     * @return array ['success' => bool, 'message' => string, 'is_valid' => bool|null, 'nvi_response' => mixed]
     */
    public static function verifyTCKN($tcKimlikNo, $ad, $soyad, $dogumYili)
    {
        $logParams = ['tckn' => $tcKimlikNo, 'ad' => $ad, 'soyad' => $soyad, 'dogumYili' => $dogumYili];
        BtkHelper::logActivity("NVI TCKN Doğrulaması başlatıldı.", 0, 'DEBUG', $logParams);

        if (!class_exists('SoapClient')) {
            $msg = 'PHP SoapClient eklentisi sunucuda aktif değil. TCKN doğrulama yapılamıyor.';
            BtkHelper::logActivity($msg, 0, 'ERROR', $logParams);
            return ['success' => false, 'message' => $msg, 'is_valid' => null, 'nvi_response' => null];
        }

        if (BtkHelper::getSetting('nvi_tckn_dogrulama_aktif', '0') != '1') {
            $msg = 'TCKN doğrulaması modül ayarlarından pasif edilmiş.';
            // BtkHelper::logActivity($msg, 0, 'INFO', $logParams); // Her seferinde loglamaya gerek yok
            return ['success' => true, 'message' => $msg, 'is_valid' => null, 'nvi_response' => 'Pasif']; // Doğrulama yapılmadı ama işlem başarılı sayılabilir
        }

        // Basit format kontrolleri
        if (!preg_match('/^[1-9]{1}[0-9]{9}[0,2,4,6,8]{1}$/', (string)$tcKimlikNo)) {
            $msg = 'Geçersiz TCKN formatı.';
            BtkHelper::logActivity($msg, 0, 'WARNING', $logParams);
            return ['success' => false, 'message' => $msg, 'is_valid' => false, 'nvi_response' => 'Format Hatalı'];
        }
        if (empty(trim($ad)) || empty(trim($soyad)) || !preg_match('/^\d{4}$/', (string)$dogumYili)) {
            $msg = 'Ad, Soyad veya Doğum Yılı formatı geçersiz/eksik.';
            BtkHelper::logActivity($msg, 0, 'WARNING', $logParams);
            return ['success' => false, 'message' => $msg, 'is_valid' => false, 'nvi_response' => 'Parametre Hatalı'];
        }

        try {
            $client = new \SoapClient(self::TCKN_WSDL_URL, self::$soapOptions);
            $parameters = [
                'TCKimlikNo' => (int)$tcKimlikNo, // NVI int bekliyor
                'Ad'         => mb_strtoupper(str_replace(['i', 'İ'], ['İ', 'I'], $ad), 'UTF-8'), // Büyük harf ve Türkçe 'İ' dönüşümü
                'Soyad'      => mb_strtoupper(str_replace(['i', 'İ'], ['İ', 'I'], $soyad), 'UTF-8'),
                'DogumYili'  => (int)$dogumYili
            ];

            $result = $client->TCKimlikNoDogrula($parameters);
            $isValid = (isset($result->TCKimlikNoDogrulaResult) && $result->TCKimlikNoDogrulaResult === true);

            BtkHelper::logActivity("NVI TCKN Doğrulama sonucu: " . ($isValid ? 'Doğru' : 'Yanlış'), 0, $isValid ? 'INFO' : 'WARNING', ['params' => $parameters, 'response' => $result]);
            return [
                'success' => true, // SOAP isteği başarılı
                'message' => $isValid ? 'TCKN doğrulandı.' : 'TCKN doğrulanamadı.',
                'is_valid' => $isValid,
                'nvi_response' => $result
            ];

        } catch (\SoapFault $sf) {
            $errMsg = "NVI TCKN SOAP Hatası: " . $sf->getMessage();
            BtkHelper::logActivity($errMsg, 0, 'ERROR', ['exception' => (string)$sf, 'params' => $parameters ?? $logParams]);
            return ['success' => false, 'message' => $errMsg, 'is_valid' => null, 'nvi_response' => $sf->getMessage()];
        } catch (\Exception $e) {
            $errMsg = "NVI TCKN Doğrulama sırasında genel hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, 0, 'ERROR', ['exception' => (string)$e, 'params' => $parameters ?? $logParams]);
            return ['success' => false, 'message' => $errMsg, 'is_valid' => null, 'nvi_response' => $e->getMessage()];
        }
    }


namespace WHMCS\Module\Addon\BtkRaporlari\Services;

// ... (Bir önceki bölümdeki use ifadeleri ve sınıf tanımı burada devam ediyor) ...

class NviVerificationService
{
    // ... (verifyTCKN fonksiyonu burada) ...

    /**
     * Yabancı Kimlik Numarası doğrulaması yapar.
     * NVI servisi Ad, Soyad, DoğumGünü, DoğumAyı, DoğumYılı parametrelerini bekler.
     *
     * @param int|string $yabanciKimlikNo Doğrulanacak Yabancı Kimlik Numarası (Genellikle 99 ile başlar, 11 hane)
     * @param string $ad Ad (Büyük harflerle, Türkçe karakterler NVI'nin beklediği gibi olmalı)
     * @param string $soyad Soyad (Büyük harflerle, Türkçe karakterler NVI'nin beklediği gibi olmalı)
     * @param int $dogumGun Doğum Günü (1-31)
     * @param int $dogumAy Doğum Ayı (1-12)
     * @param int $dogumYil Doğum Yılı (4 hane)
     * @return array ['success' => bool, 'message' => string, 'is_valid' => bool|null, 'nvi_response' => mixed]
     */
    public static function verifyYKN($yabanciKimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil)
    {
        $logParams = ['ykn' => $yabanciKimlikNo, 'ad' => $ad, 'soyad' => $soyad, 'dg' => "$dogumGun.$dogumAy.$dogumYil"];
        BtkHelper::logActivity("NVI YKN Doğrulaması başlatıldı.", 0, 'DEBUG', $logParams);

        if (!class_exists('SoapClient')) {
            $msg = 'PHP SoapClient eklentisi sunucuda aktif değil. YKN doğrulama yapılamıyor.';
            BtkHelper::logActivity($msg, 0, 'ERROR', $logParams);
            return ['success' => false, 'message' => $msg, 'is_valid' => null, 'nvi_response' => null];
        }

        if (BtkHelper::getSetting('nvi_ykn_dogrulama_aktif', '0') != '1') {
            $msg = 'YKN doğrulaması modül ayarlarından pasif edilmiş.';
            // BtkHelper::logActivity($msg, 0, 'INFO', $logParams);
            return ['success' => true, 'message' => $msg, 'is_valid' => null, 'nvi_response' => 'Pasif'];
        }

        // Basit format kontrolleri
        if (!preg_match('/^[9]{1}[0-9]{10}$/', (string)$yabanciKimlikNo)) { // Genellikle 9 ile başlar, 11 hanedir. Tam kuralı NVI'den teyit edilmeli.
            $msg = 'Geçersiz YKN formatı.';
            BtkHelper::logActivity($msg, 0, 'WARNING', $logParams);
            return ['success' => false, 'message' => $msg, 'is_valid' => false, 'nvi_response' => 'Format Hatalı'];
        }
        if (empty(trim($ad)) || empty(trim($soyad)) ||
            !filter_var($dogumGun, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 31]]) ||
            !filter_var($dogumAy, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 12]]) ||
            !filter_var($dogumYil, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1900, 'max_range' => date('Y')]])) {
            $msg = 'Ad, Soyad veya Doğum Tarihi (Gün, Ay, Yıl) formatı geçersiz/eksik.';
            BtkHelper::logActivity($msg, 0, 'WARNING', $logParams);
            return ['success' => false, 'message' => $msg, 'is_valid' => false, 'nvi_response' => 'Parametre Hatalı'];
        }
        // Doğum tarihini (YYYY-AA-GG) ABONE_DOGUM_TARIHI formatına uygun hale getir
        $dogumTarihiFormatted = sprintf('%04d-%02d-%02d', $dogumYil, $dogumAy, $dogumGun);
        if (!Carbon::createFromFormat('Y-m-d', $dogumTarihiFormatted)->isValid()) {
             $msg = 'Geçersiz Doğum Tarihi.';
             BtkHelper::logActivity($msg, 0, 'WARNING', $logParams);
             return ['success' => false, 'message' => $msg, 'is_valid' => false, 'nvi_response' => 'Doğum Tarihi Hatalı'];
        }


        try {
            $client = new \SoapClient(self::YKN_WSDL_URL, self::$soapOptions);
            $parameters = [
                'KimlikNo'  => (int)$yabanciKimlikNo, // NVI int bekliyor olabilir, döküman teyit edilmeli. String de olabilir.
                'Ad'        => mb_strtoupper(str_replace(['i', 'İ'], ['İ', 'I'], $ad), 'UTF-8'),
                'Soyad'     => mb_strtoupper(str_replace(['i', 'İ'], ['İ', 'I'], $soyad), 'UTF-8'),
                'DogumGun'  => (int)$dogumGun,
                'DogumAy'   => (int)$dogumAy,
                'DogumYil'  => (int)$dogumYil
            ];

            $result = $client->YabanciKimlikNoDogrula($parameters);
            $isValid = (isset($result->YabanciKimlikNoDogrulaResult) && $result->YabanciKimlikNoDogrulaResult === true);

            BtkHelper::logActivity("NVI YKN Doğrulama sonucu: " . ($isValid ? 'Doğru' : 'Yanlış'), 0, $isValid ? 'INFO' : 'WARNING', ['params' => $parameters, 'response' => $result]);
            return [
                'success' => true, // SOAP isteği başarılı
                'message' => $isValid ? 'YKN doğrulandı.' : 'YKN doğrulanamadı.',
                'is_valid' => $isValid,
                'nvi_response' => $result
            ];

        } catch (\SoapFault $sf) {
            $errMsg = "NVI YKN SOAP Hatası: " . $sf->getMessage();
            BtkHelper::logActivity($errMsg, 0, 'ERROR', ['exception' => (string)$sf, 'params' => $parameters ?? $logParams]);
            return ['success' => false, 'message' => $errMsg, 'is_valid' => null, 'nvi_response' => $sf->getMessage()];
        } catch (\Exception $e) {
            $errMsg = "NVI YKN Doğrulama sırasında genel hata: " . $e->getMessage();
            BtkHelper::logActivity($errMsg, 0, 'ERROR', ['exception' => (string)$e, 'params' => $parameters ?? $logParams]);
            return ['success' => false, 'message' => $errMsg, 'is_valid' => null, 'nvi_response' => $e->getMessage()];
        }
    }

    /**
     * Adres Kodu (UAVT) doğrulaması için bir placeholder.
     * NVI'nin public bir UAVT doğrulama servisi olup olmadığı araştırılmalıdır.
     * https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu gibi arayüzler var ancak public API'si olmayabilir.
     *
     * @param string $adresKodu
     * @param string $ilAdi
     * @param string $ilceAdi
     * @param string $mahalleAdi
     * @// ... diğer adres bileşenleri
     * @return array ['success' => bool, 'message' => string, 'is_valid' => bool|null]
     */
    public static function verifyUAVT($adresKodu, $ilAdi = null, $ilceAdi = null, $mahalleAdi = null /*...*/)
    {
        $logParams = ['adresKodu' => $adresKodu, 'il' => $ilAdi, 'ilce' => $ilceAdi, 'mahalle' => $mahalleAdi];
        BtkHelper::logActivity("NVI Adres Kodu (UAVT) Doğrulaması başlatıldı (Placeholder).", 0, 'DEBUG', $logParams);

        if (BtkHelper::getSetting('adres_kodu_dogrulama_aktif', '0') != '1') {
            $msg = 'Adres Kodu doğrulaması modül ayarlarından pasif edilmiş.';
            return ['success' => true, 'message' => $msg, 'is_valid' => null];
        }

        // TODO: NVI'nin public bir UAVT doğrulama servisi varsa buraya entegre edilecek.
        // Şu an için böyle bir public servis bilinmiyor.
        // https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu sitesi web scraping ile kullanılabilir ama stabil olmaz.
        // Bu fonksiyon şimdilik her zaman null (doğrulama yapılamadı) dönebilir.
        $msg = 'UAVT Adres Kodu için public bir NVI doğrulama servisi şu an için mevcut değildir. Doğrulama yapılamadı.';
        BtkHelper::logActivity($msg, 0, 'WARNING', $logParams);
        return ['success' => true, 'message' => $msg, 'is_valid' => null]; // İşlem "başarılı" ama sonuç "bilinmiyor"
    }

} // Sınıf sonu
?>