<?php
/**
 * NVI (MERNIS) T.C. Kimlik No ve Yabancı Kimlik No Doğrulama SOAP İstemcisi
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// BtkHelper sınıfının varlığını kontrol et ve loglama için kullan
// Bu dosya BtkHelper'a bağımlı olmamalı, ancak varsa loglama için kullanabilir.
$btkHelperNviLoaded = false;
if (file_exists(__DIR__ . '/BtkHelper.php')) {
    if (!class_exists('BtkHelper')) { // Eğer BtkHelper henüz yüklenmemişse (örn: direkt NVI testi)
        // require_once __DIR__ . '/BtkHelper.php'; // Bu döngüsel bağımlılığa neden olabilir.
                                                // En iyisi BtkHelper'ın global olarak yüklendiğini varsaymak.
    }
    if (class_exists('BtkHelper')) {
        $btkHelperNviLoaded = true;
    }
}

class NviSoapClient {

    private $tcknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL";
    private $yknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL";
    
    private $lastRequestHeaders;
    private $lastRequest;
    private $lastResponseHeaders;
    private $lastResponse;
    private $lastError;
    private $lastErrorMessageForUser; // Kullanıcıya gösterilebilecek daha sade hata mesajı
    
    private $timeoutSeconds = 15; // NVI servisleri için zaman aşımı
    private $debugMode = false;   // Detaylı loglama için

    public function __construct() {
        if (!extension_loaded('soap')) {
            $this->lastError = "PHP SOAP eklentisi sunucunuzda yüklü veya etkin değil.";
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisi şu anda kullanılamıyor (SOAP eksik).";
            if ($GLOBALS['btkHelperNviLoaded']) {
                BtkHelper::logAction('NVI SOAP Başlatma Hatası', 'CRITICAL', $this->lastError);
            } else {
                error_log("BTK Reports Module - NVI SOAP Error: " . $this->lastError);
            }
            return;
        }
        if ($GLOBALS['btkHelperNviLoaded']) {
            $this->debugMode = (BtkHelper::get_btk_setting('debug_mode') === '1');
        }
    }

    public function getLastRequestHeaders() { return $this->lastRequestHeaders; }
    public function getLastRequest() { return $this->lastRequest; }
    public function getLastResponseHeaders() { return $this->lastResponseHeaders; }
    public function getLastResponse() { return $this->lastResponse; }
    public function getLastError() { return $this->lastError; } // Teknik hata detayı
    public function getLastErrorMessageForUser() { return $this->lastErrorMessageForUser; } // Kullanıcıya gösterilecek mesaj

    /**
     * Özel SOAP isteği yapar, loglar ve sonucu döner.
     */
    private function _doRequest($client, $method, $params, $serviceType = 'TCKN') {
        $this->lastRequestHeaders = null; $this->lastRequest = null;
        $this->lastResponseHeaders = null; $this->lastResponse = null;
        $this->lastError = null; $this->lastErrorMessageForUser = null;

        try {
            $resultObject = $client->__soapCall($method, [$params]); // Parametreleri dizi içinde dizi olarak gönder
            
            if ($this->debugMode && isset($client)) { // client null değilse
                $this->lastRequestHeaders = $client->__getLastRequestHeaders();
                $this->lastRequest = $client->__getLastRequest();
                $this->lastResponseHeaders = $client->__getLastResponseHeaders();
                $this->lastResponse = $client->__getLastResponse();

                if ($GLOBALS['btkHelperNviLoaded']) {
                    BtkHelper::logAction("NVI SOAP ({$serviceType}) İstek-Yanıt", 'DEBUG', [
                        'url' => $client->location ?? $this->tcknSoapUrl, // client null kontrolü
                        'method' => $method, 'params' => $params,
                        // 'req_headers' => $this->lastRequestHeaders, // Çok uzun olabilir
                        'req_body' => $this->lastRequest,
                        // 'res_headers' => $this->lastResponseHeaders, // Çok uzun olabilir
                        'res_body' => $this->lastResponse,
                        'parsed_result' => $resultObject
                    ]);
                }
            }
            return $resultObject;

        } catch (SoapFault $sf) {
            $this->lastError = "SOAP Hatası (" . ($sf->faultcode ?? 'N/A') . "): " . $sf->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisine bağlanırken bir sorun oluştu (SOAP). Lütfen daha sonra tekrar deneyin.";
            if (isset($client)) { // client null değilse
                $this->lastRequest = $client->__getLastRequest();
                $this->lastResponse = $client->__getLastResponse();
            }
            if ($GLOBALS['btkHelperNviLoaded']) {
                BtkHelper::logAction("NVI SOAP ({$serviceType}) SoapFault", 'HATA', ['params' => $params, 'error' => $this->lastError, 'request' => $this->lastRequest, 'response' => $this->lastResponse ]);
            }
            return false;
        } catch (Exception $e) {
            $this->lastError = "Genel Hata: " . $e->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama sırasında beklenmedik bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçin.";
            if ($GLOBALS['btkHelperNviLoaded']) {
                BtkHelper::logAction("NVI SOAP ({$serviceType}) Exception", 'HATA', ['params' => $params, 'error' => $this->lastError]);
            }
            return false;
        }
    }

    /**
     * T.C. Kimlik Numarası Doğrulama
     */
    public function TCKimlikNoDogrula($tcKimlikNo, $ad, $soyad, $dogumYili) {
        if (!extension_loaded('soap')) { /* constructor'da kontrol edildi */ return false; }

        $tcKimlikNo = preg_replace('/[^0-9]/', '', (string)$tcKimlikNo); // Sadece rakamları al
        if (empty($tcKimlikNo) || strlen($tcKimlikNo) !== 11) {
            $this->lastError = "Geçersiz T.C. Kimlik Numarası formatı: '$tcKimlikNo'. 11 haneli bir sayı olmalıdır.";
            $this->lastErrorMessageForUser = "Lütfen geçerli bir T.C. Kimlik Numarası girin (11 Hane).";
            return false;
        }
        $ad = trim((string)$ad); $soyad = trim((string)$soyad); $dogumYili = trim((string)$dogumYili);
        if (empty($ad) || empty($soyad) || empty($dogumYili) || !is_numeric($dogumYili) || strlen($dogumYili) !== 4) {
            $this->lastError = "Ad, Soyad veya Doğum Yılı bilgileri eksik veya geçersiz formatta (Yıl: $dogumYili).";
            $this->lastErrorMessageForUser = "Lütfen Ad, Soyad ve Doğum Yılı (4 Hane) alanlarını doğru şekilde doldurun.";
            return false;
        }

        try {
            $client = @new SoapClient($this->tcknSoapUrl, [
                'trace' => $this->debugMode ? 1 : 0, 'exceptions' => true, 'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, 'keep_alive' => false, // WSDL_CACHE_BOTH yerine MEMORY veya NONE
                'stream_context' => stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true, 'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT]]) // TLS 1.2 zorunluluğu olabilir
            ]);
        } catch (Exception $e) {
            $this->lastError = "TCKN SOAP İstemci Oluşturma Hatası: " . $e->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
            if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('TCKN Doğrulama', 'CRITICAL', $this->lastError); }
            return false;
        }

        $params = [
            'TCKimlikNo' => (int)$tcKimlikNo,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $ad), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $soyad), 'UTF-8'),
            'DogumYili' => (int)$dogumYili
        ];
        
        $resultObject = $this->_doRequest($client, 'TCKimlikNoDogrula', $params, 'TCKN');

        if ($resultObject && isset($resultObject->TCKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->TCKimlikNoDogrulaResult;
            if (!$isSuccess) { $this->lastErrorMessageForUser = "Girilen T.C. Kimlik No bilgileri doğrulanamadı."; }
            return $isSuccess;
        }
        if (!$this->lastError) { // _doRequest içinde hata set edilmemişse, beklenmedik yanıt
            $this->lastError = "NVI TCKN servisinden beklenmedik yanıt formatı.";
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisinden geçersiz bir yanıt alındı.";
             if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('TCKN Doğrulama', 'HATA', $this->lastError, null, ['response_body' => $this->lastResponse]); }
        }
        return false;
    }

    /**
     * Yabancı Kimlik Numarası Doğrulama
     */
    public function YabanciKimlikNoDogrula($kimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil) {
        if (!extension_loaded('soap')) { /* constructor'da kontrol edildi */ return false; }

        $kimlikNo = preg_replace('/[^0-9]/', '', (string)$kimlikNo);
        if (empty($kimlikNo) || strlen($kimlikNo) !== 11 || substr($kimlikNo, 0, 2) !== '99') {
            $this->lastError = "Geçersiz Yabancı Kimlik Numarası formatı ($kimlikNo). 99 ile başlamalı ve 11 haneli olmalıdır.";
            $this->lastErrorMessageForUser = "Lütfen geçerli bir Yabancı Kimlik Numarası girin (99 ile başlayan 11 Hane).";
            return false;
        }
        $ad = trim((string)$ad); $soyad = trim((string)$soyad);
        $dogumGun = (int)trim((string)$dogumGun); $dogumAy = (int)trim((string)$dogumAy); $dogumYil = (int)trim((string)$dogumYil);
        if (empty($ad) || empty($soyad) || $dogumGun < 1 || $dogumGun > 31 || $dogumAy < 1 || $dogumAy > 12 || strlen((string)$dogumYil) !== 4 ) {
            $this->lastError = "Ad, Soyad veya Doğum Tarihi (Gün:$dogumGun, Ay:$dogumAy, Yıl:$dogumYil) bilgileri eksik veya geçersiz formatta.";
            $this->lastErrorMessageForUser = "Lütfen Ad, Soyad ve Doğum Tarihi (GG/AA/YYYY) alanlarını doğru şekilde doldurun.";
            return false;
        }

        try {
            $client = @new SoapClient($this->yknSoapUrl, [
                'trace' => $this->debugMode ? 1 : 0, 'exceptions' => true, 'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, 'keep_alive' => false,
                'stream_context' => stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true, 'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT]])
            ]);
        } catch (Exception $e) {
            $this->lastError = "YKN SOAP İstemci Oluşturma Hatası: " . $e->getMessage();
            $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisine şu anda ulaşılamıyor.";
            if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('YKN Doğrulama', 'CRITICAL', $this->lastError); }
            return false;
        }

        $params = [
            'KimlikNo' => (int)$kimlikNo, // NVI int bekliyor
            'Ad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $ad), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $soyad), 'UTF-8'),
            'DogumGun' => $dogumGun,
            'DogumAy' => $dogumAy,
            'DogumYil' => $dogumYil
        ];
        
        $resultObject = $this->_doRequest($client, 'YabanciKimlikNoDogrula', $params, 'YKN');

        if ($resultObject && isset($resultObject->YabanciKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->YabanciKimlikNoDogrulaResult;
            if (!$isSuccess) { $this->lastErrorMessageForUser = "Girilen Yabancı Kimlik No bilgileri doğrulanamadı."; }
            return $isSuccess;
        }
        if (!$this->lastError) {
            $this->lastError = "NVI Yabancı Kimlik servisinden beklenmedik yanıt formatı.";
            $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisinden geçersiz bir yanıt alındı.";
             if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('YKN Doğrulama', 'HATA', $this->lastError, null, ['response_body' => $this->lastResponse]); }
        }
        return false;
    }
}
?>