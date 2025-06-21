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
$GLOBALS['btkHelperNviLoadedCheck'] = false;
if (class_exists('BtkHelper')) {
    $GLOBALS['btkHelperNviLoadedCheck'] = true;
}

class NviSoapClient {

    private $tcknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL";
    private $yknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL";
    
    private $lastRequestHeaders;
    private $lastRequest;
    private $lastResponseHeaders;
    private $lastResponse;
    private $lastError;
    private $lastErrorMessageForUser;
    
    private $timeoutSeconds = 20;
    private $debugMode = false;

    public function __construct() {
        if (!extension_loaded('soap')) {
            $this->lastError = "PHP SOAP eklentisi sunucunuzda yüklü veya etkin değil.";
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisi şu anda kullanılamıyor (Teknik Altyapı: SOAP).";
            if ($GLOBALS['btkHelperNviLoadedCheck']) {
                BtkHelper::logAction('NVI SOAP Başlatma Hatası', 'CRITICAL', $this->lastError);
            } else {
                error_log("BTK Reports Module - NVI SOAP Construct Error: " . $this->lastError);
            }
            return;
        }
        if ($GLOBALS['btkHelperNviLoadedCheck']) {
            $this->debugMode = (BtkHelper::get_btk_setting('debug_mode') === '1');
        }
    }

    public function getLastRequestHeaders() { return $this->lastRequestHeaders; }
    public function getLastRequest() { return $this->lastRequest; }
    public function getLastResponseHeaders() { return $this->lastResponseHeaders; }
    public function getLastResponse() { return $this->lastResponse; }
    public function getLastError() { return $this->lastError; }
    public function getLastErrorMessageForUser() { return $this->lastErrorMessageForUser; }

    private function _doRequest($client, $method, $params, $serviceType = 'TCKN') {
        $this->lastRequestHeaders = null; $this->lastRequest = null;
        $this->lastResponseHeaders = null; $this->lastResponse = null;
        $this->lastError = null; $this->lastErrorMessageForUser = "Bilinmeyen bir NVI hata oluştu.";

        try {
            $resultObject = $client->__soapCall($method, $params); // Parametreler doğrudan gönderilir

            if ($this->debugMode && $client) {
                $this->lastRequestHeaders = @$client->__getLastRequestHeaders();
                $this->lastRequest = @$client->__getLastRequest();
                $this->lastResponseHeaders = @$client->__getLastResponseHeaders();
                $this->lastResponse = @$client->__getLastResponse();

                if ($GLOBALS['btkHelperNviLoadedCheck']) {
                    BtkHelper::logAction("NVI SOAP ({$serviceType}) İstek-Yanıt", 'DEBUG', [
                        'url' => $client->location ?? ($serviceType === 'TCKN' ? $this->tcknSoapUrl : $this->yknSoapUrl),
                        'method' => $method, 'params' => $params,
                        'req_body_preview' => substr($this->lastRequest ?? '', 0, 500) . (strlen($this->lastRequest ?? '') > 500 ? '...' : ''),
                        'res_body_preview' => substr($this->lastResponse ?? '', 0, 500) . (strlen($this->lastResponse ?? '') > 500 ? '...' : ''),
                        'parsed_result_type' => gettype($resultObject)
                    ]);
                }
            }
            return $resultObject;

        } catch (SoapFault $sf) {
            $this->lastError = "SOAP Hatası (" . ($sf->faultcode ?? 'N/A') . "): " . $sf->getMessage();
            if (strpos(strtolower($sf->getMessage()), 'timeout') !== false || strpos(strtolower($sf->getMessage()), 'timed out') !== false) { $this->lastErrorMessageForUser = "Kimlik doğrulama servisine bağlanırken zaman aşımı oluştu.";}
            elseif (strpos(strtolower($sf->getMessage()), 'could not connect to host') !== false) { $this->lastErrorMessageForUser = "Kimlik doğrulama servisine ulaşılamıyor (bağlantı hatası).";}
            else { $this->lastErrorMessageForUser = "Kimlik doğrulama servisinde sorun oluştu (SOAP: {$sf->faultcode})."; }
            if ($client) { $this->lastRequest = @$client->__getLastRequest(); $this->lastResponse = @$client->__getLastResponse(); }
            if ($GLOBALS['btkHelperNviLoadedCheck']) { BtkHelper::logAction("NVI SOAP ({$serviceType}) SoapFault", 'HATA', ['params_keys' => array_keys($params['parameters'] ?? $params), 'error' => $this->lastError, 'req' => substr($this->lastRequest??'',0,200), 'res' => substr($this->lastResponse??'',0,200) ]); }
            else { error_log("NVI SOAP ({$serviceType}) SoapFault: " . $this->lastError); }
            return false;
        } catch (Exception $e) {
            $this->lastError = "Genel Hata ({$serviceType}): " . $e->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama sırasında beklenmedik bir hata oluştu.";
            if ($GLOBALS['btkHelperNviLoadedCheck']) { BtkHelper::logAction("NVI SOAP ({$serviceType}) Exception", 'HATA', ['params_keys' => array_keys($params['parameters'] ?? $params), 'error' => $this->lastError, 'trace' => substr($e->getTraceAsString(),0, 500)]);}
            else { error_log("NVI SOAP ({$serviceType}) Exception: " . $this->lastError); }
            return false;
        }
    }

    public function TCKimlikNoDogrula($tcKimlikNo, $ad, $soyad, $dogumYili) {
        if (!extension_loaded('soap')) { $this->lastError = "SOAP eklentisi etkin değil."; $this->lastErrorMessageForUser = "Teknik altyapı sorunu (SOAP)."; return false; }
        $tcKimlikNoClean = preg_replace('/[^0-9]/', '', (string)$tcKimlikNo);
        if (empty($tcKimlikNoClean) || strlen($tcKimlikNoClean) !== 11) { $this->lastError = "Geçersiz TCKN formatı: '$tcKimlikNo'."; $this->lastErrorMessageForUser = "Geçerli bir TCKN girin (11 Hane)."; return false; }
        $adClean = trim((string)$ad); $soyadClean = trim((string)$soyad); $dogumYiliClean = (int)trim((string)$dogumYili);
        if (empty($adClean) || empty($soyadClean) || empty($dogumYiliClean) || strlen((string)$dogumYiliClean) !== 4) { $this->lastError = "Ad/Soyad/Doğum Yılı eksik/geçersiz (Yıl: {$dogumYili})."; $this->lastErrorMessageForUser = "Ad, Soyad ve Doğum Yılını (4 Hane) doğru girin."; return false; }

        try {
            $client = @new SoapClient($this->tcknSoapUrl, [
                'trace' => $this->debugMode ? 1 : 0, 'exceptions' => true, 'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, 'keep_alive' => false,
                'stream_context' => stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true, 'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_0_CLIENT]])
            ]);
        } catch (Exception $e) { $this->lastError = "TCKN SOAP İstemci Oluşturma Hatası: " . $e->getMessage(); $this->lastErrorMessageForUser = "Kimlik servisine ulaşılamıyor (istemci)."; if ($GLOBALS['btkHelperNviLoadedCheck']) { BtkHelper::logAction('TCKN Doğrulama', 'CRITICAL', $this->lastError); } return false; }

        $paramsRequest = [
            'TCKimlikNo' => (int)$tcKimlikNoClean,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $adClean), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $soyadClean), 'UTF-8'),
            'DogumYili' => $dogumYiliClean
        ];
        
        $resultObject = $this->_doRequest($client, 'TCKimlikNoDogrula', ['parameters' => $paramsRequest], 'TCKN');

        if ($resultObject && isset($resultObject->TCKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->TCKimlikNoDogrulaResult;
            if (!$isSuccess) { $this->lastErrorMessageForUser = "Girilen T.C. Kimlik No bilgileri NVI tarafından doğrulanamadı."; }
            else { $this->lastErrorMessageForUser = "T.C. Kimlik No başarıyla doğrulandı.";}
            return $isSuccess;
        }
        if (!$this->lastError) { $this->lastError = "NVI TCKN servisinden beklenmedik yanıt formatı."; $this->lastErrorMessageForUser = "Kimlik servisinden geçersiz yanıt (format)."; if ($GLOBALS['btkHelperNviLoadedCheck']) { BtkHelper::logAction('TCKN Doğrulama Yanıt Formatı Hatası', 'HATA', $this->lastError, null, ['res_prev' => substr($this->lastResponse ?? '',0,200)]); }}
        return false;
    }

    /**
     * Yabancı Kimlik Numarası Doğrulama
     * @param string $kimlikNo 99 ile başlayan 11 haneli numara
     * @param string $ad
     * @param string $soyad
     * @param int $dogumGun
     * @param int $dogumAy
     * @param int $dogumYil 4 haneli yıl
     * @return bool Doğrulama sonucu
     */
    public function YabanciKimlikNoDogrula($kimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil) {
        if (!extension_loaded('soap')) { $this->lastError = "SOAP eklentisi etkin değil."; $this->lastErrorMessageForUser = "Teknik altyapı sorunu (SOAP)."; return false; }

        $kimlikNoClean = preg_replace('/[^0-9]/', '', (string)$kimlikNo);
        if (empty($kimlikNoClean) || strlen($kimlikNoClean) !== 11 || substr($kimlikNoClean, 0, 2) !== '99') {
            $this->lastError = "Geçersiz Yabancı Kimlik Numarası formatı ($kimlikNo). 99 ile başlamalı ve 11 haneli olmalıdır.";
            $this->lastErrorMessageForUser = "Lütfen geçerli bir Yabancı Kimlik Numarası girin (99 ile başlayan 11 Hane).";
            return false;
        }
        $adClean = trim((string)$ad); $soyadClean = trim((string)$soyad);
        $dogumGunClean = (int)trim((string)$dogumGun); $dogumAyClean = (int)trim((string)$dogumAy); $dogumYilClean = (int)trim((string)$dogumYil);
        if (empty($adClean) || empty($soyadClean) || $dogumGunClean < 1 || $dogumGunClean > 31 || $dogumAyClean < 1 || $dogumAyClean > 12 || strlen((string)$dogumYilClean) !== 4 ) {
            $this->lastError = "Ad, Soyad veya Doğum Tarihi (Gün:$dogumGun, Ay:$dogumAy, Yıl:$dogumYil) bilgileri eksik veya geçersiz formatta.";
            $this->lastErrorMessageForUser = "Lütfen Ad, Soyad ve Doğum Tarihi (GG/AA/YYYY) alanlarını doğru şekilde doldurun.";
            return false;
        }

        try {
            $client = @new SoapClient($this->yknSoapUrl, [
                'trace' => $this->debugMode ? 1 : 0, 'exceptions' => true, 'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, 'keep_alive' => false,
                'stream_context' => stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true, 'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_0_CLIENT]])
            ]);
        } catch (Exception $e) {
            $this->lastError = "YKN SOAP İstemci Oluşturma Hatası: " . $e->getMessage();
            $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisine şu anda ulaşılamıyor (istemci).";
            if ($GLOBALS['btkHelperNviLoadedCheck']) { BtkHelper::logAction('YKN Doğrulama', 'CRITICAL', $this->lastError); }
            return false;
        }

        $paramsRequest = [
            'KimlikNo' => (int)$kimlikNoClean,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $adClean), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $soyadClean), 'UTF-8'),
            'DogumGun' => $dogumGunClean,
            'DogumAy' => $dogumAyClean,
            'DogumYil' => $dogumYilClean
        ];
        
        $resultObject = $this->_doRequest($client, 'YabanciKimlikNoDogrula', ['parameters' => $paramsRequest], 'YKN');

        if ($resultObject && isset($resultObject->YabanciKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->YabanciKimlikNoDogrulaResult;
            if (!$isSuccess) { $this->lastErrorMessageForUser = "Girilen Yabancı Kimlik No bilgileri NVI tarafından doğrulanamadı."; }
            else { $this->lastErrorMessageForUser = "Yabancı Kimlik No başarıyla doğrulandı."; }
            return $isSuccess;
        }
        if (!$this->lastError) {
            $this->lastError = "NVI Yabancı Kimlik servisinden beklenmedik yanıt formatı.";
            $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisinden geçersiz bir yanıt alındı (format).";
             if ($GLOBALS['btkHelperNviLoadedCheck']) { BtkHelper::logAction('YKN Doğrulama Yanıt Formatı Hatası', 'HATA', $this->lastError, null, ['res_prev' => substr($this->lastResponse ?? '',0,200)]); }
        }
        return false;
    }

} // Sınıfın Kapanışı
?>