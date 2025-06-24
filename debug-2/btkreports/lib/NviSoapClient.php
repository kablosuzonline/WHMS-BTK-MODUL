<?php
/**
 * NVI (MERNIS) T.C. Kimlik No ve Yabancı Kimlik No Doğrulama SOAP İstemcisi
 * (En kapsamlı ve eksiksiz sürüm)
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// BtkHelper sınıfının varlığını global bir değişkenle kontrol edelim.
// Bu dosya, BtkHelper'a doğrudan bağımlı olmamalı, ancak varsa loglama için kullanabilir.
if (!isset($GLOBALS['btkHelperNviLoaded'])) { // Sadece bir kez tanımla
    $GLOBALS['btkHelperNviLoaded'] = false;
    if (file_exists(__DIR__ . '/BtkHelper.php')) {
        // require_once __DIR__ . '/BtkHelper.php'; // Direkt require etmek yerine, globalde yüklü olduğunu varsayalım.
                                                // Eğer değilse, BtkHelper çağıran yerlerde sorun olur zaten.
        if (class_exists('BtkHelper')) {
            $GLOBALS['btkHelperNviLoaded'] = true;
        }
    }
}


class NviSoapClient {

    private $tcknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL";
    private $yknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL";
    
    private $lastRequestHeaders;
    private $lastRequest;
    private $lastResponseHeaders;
    private $lastResponse;
    private $lastError; // Teknik hata detayı (İngilizce veya sistem mesajı)
    private $lastErrorMessageForUser; // Kullanıcıya gösterilebilecek daha sade Türkçe hata mesajı
    
    private $timeoutSeconds = 20; // NVI servisleri için zaman aşımı (biraz daha artırıldı)
    private $debugMode = false;   // Detaylı loglama için (BtkHelper üzerinden set edilecek)

    public function __construct() {
        if (!extension_loaded('soap')) {
            $this->lastError = "PHP SOAP eklentisi sunucunuzda yüklü veya etkin değil.";
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisi şu anda kullanılamıyor (Sistem Hatası: SOAP). Lütfen daha sonra tekrar deneyin veya sistem yöneticinize başvurun.";
            if ($GLOBALS['btkHelperNviLoaded']) {
                BtkHelper::logAction('NVI SOAP Başlatma Hatası', 'CRITICAL', $this->lastError);
            } else {
                error_log("BTK Reports Module - NVI SOAP Error (Constructor): " . $this->lastError);
            }
            return; // Constructor'dan çık, fonksiyonlar false dönecek
        }
        // debug_mode ayarını BtkHelper üzerinden al (eğer BtkHelper yüklüyse)
        if ($GLOBALS['btkHelperNviLoaded'] && class_exists('BtkHelper')) {
            $this->debugMode = (BtkHelper::get_btk_setting('debug_mode') === '1');
        }
    }

    public function getLastRequestHeaders() { return $this->lastRequestHeaders; }
    public function getLastRequest() { return $this->lastRequest; }
    public function getLastResponseHeaders() { return $this->lastResponseHeaders; }
    public function getLastResponse() { return $this->lastResponse; }
    public function getLastError() { return $this->lastError; } 
    public function getLastErrorMessageForUser() { return $this->lastErrorMessageForUser ?: ($this->lastError ?: 'Bilinmeyen bir doğrulama hatası oluştu.'); }

    /**
     * Özel SOAP isteği yapar, loglar ve sonucu döner.
     * @param SoapClient $client
     * @param string $method
     * @param array $params
     * @param string $serviceType 'TCKN' veya 'YKN' (loglama için)
     * @return object|false SOAP yanıt nesnesi veya hata durumunda false
     */
    private function _doRequest($client, $method, $params, $serviceType = 'TCKN') {
        $this->lastRequestHeaders = null; $this->lastRequest = null;
        $this->lastResponseHeaders = null; $this->lastResponse = null;
        $this->lastError = null; $this->lastErrorMessageForUser = null;

        if (!$client) { // SoapClient oluşturulamamışsa
            $this->lastError = "SOAP istemcisi oluşturulamadı ({$serviceType}).";
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisine bağlantı kurulamadı ({$serviceType}).";
            if ($GLOBALS['btkHelperNviLoaded']) BtkHelper::logAction("NVI SOAP ({$serviceType}) Hata", 'CRITICAL', $this->lastError);
            return false;
        }

        try {
            // SOAP çağrısını yap
            $resultObject = $client->__soapCall($method, [$params]); // Parametreleri dizi içinde dizi olarak gönder
            
            // İstek ve yanıtları yakala (sadece debug modda ve client varsa)
            if ($this->debugMode) {
                $this->lastRequestHeaders = $client->__getLastRequestHeaders();
                $this->lastRequest = $client->__getLastRequest();
                $this->lastResponseHeaders = $client->__getLastResponseHeaders();
                $this->lastResponse = $client->__getLastResponse();

                if ($GLOBALS['btkHelperNviLoaded']) {
                    BtkHelper::logAction("NVI SOAP ({$serviceType}) İstek-Yanıt Detayları", 'DEBUG', [
                        'url' => $client->location ?? ($serviceType === 'TCKN' ? $this->tcknSoapUrl : $this->yknSoapUrl),
                        'method' => $method, 'params' => $params,
                        'request_body_length' => strlen($this->lastRequest ?? ''),
                        'response_body_length' => strlen($this->lastResponse ?? ''),
                        'parsed_result' => $resultObject
                        // Header'ları loglamak çok yer kaplayabilir, gerekirse eklenebilir.
                    ]);
                }
            }
            return $resultObject;

        } catch (SoapFault $sf) {
            $this->lastError = "SOAP Hatası (" . ($sf->faultcode ?? 'Bilinmiyor') . "): " . $sf->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisine erişirken bir sorun oluştu (SOAP Fault). Lütfen bilgilerinizi kontrol edin veya daha sonra tekrar deneyin.";
            if ($this->debugMode && isset($client)) {
                $this->lastRequest = $client->__getLastRequest();
                $this->lastResponse = $client->__getLastResponse();
            }
            if ($GLOBALS['btkHelperNviLoaded']) {
                BtkHelper::logAction("NVI SOAP ({$serviceType}) SoapFault", 'HATA', ['params' => $params, 'error' => $this->lastError, 'request_preview' => substr($this->lastRequest ?? '', 0, 200), 'response_preview' => substr($this->lastResponse ?? '', 0, 200) ]);
            }
            return false;
        } catch (Exception $e) {
            $this->lastError = "Genel Hata ({$serviceType}): " . $e->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama sırasında beklenmedik bir teknik hata oluştu. Lütfen sistem yöneticinizle iletişime geçin.";
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
        if (!extension_loaded('soap')) { $this->lastError = "PHP SOAP eklentisi etkin değil."; $this->lastErrorMessageForUser = "Sistem hatası: SOAP_EXT_MISSING"; return false; }

        $tcKimlikNoClean = preg_replace('/[^0-9]/', '', (string)$tcKimlikNo);
        if (empty($tcKimlikNoClean) || strlen($tcKimlikNoClean) !== 11) { $this->lastError = "Geçersiz TCKN formatı: '$tcKimlikNo'."; $this->lastErrorMessageForUser = "Lütfen geçerli bir T.C. Kimlik Numarası girin (11 rakam)."; return false; }
        $adClean = trim((string)$ad); $soyadClean = trim((string)$soyad); $dogumYiliClean = trim((string)$dogumYili);
        if (empty($adClean) || empty($soyadClean) || empty($dogumYiliClean) || !is_numeric($dogumYiliClean) || strlen($dogumYiliClean) !== 4) { $this->lastError = "Ad, Soyad veya Doğum Yılı eksik/geçersiz (Yıl: $dogumYili)."; $this->lastErrorMessageForUser = "Lütfen Ad, Soyad ve Doğum Yılı (4 rakam) alanlarını doldurun."; return false; }

        $client = null;
        try {
            $client = @new SoapClient($this->tcknSoapUrl, [
                'trace' => $this->debugMode ? 1 : 0, 'exceptions' => true, 'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, 'keep_alive' => false,
                'stream_context' => stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true, 'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT]])
            ]);
        } catch (Exception $e) { $this->lastError = "TCKN SOAP İstemci Oluşturma Hatası: " . $e->getMessage(); $this->lastErrorMessageForUser = "Kimlik doğrulama servisine şu anda ulaşılamıyor (INIT_FAIL)."; if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('NVI TCKN Doğrulama', 'CRITICAL', $this->lastError); } return false; }

        $params = [
            'TCKimlikNo' => (int)$tcKimlikNoClean,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $adClean), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $soyadClean), 'UTF-8'),
            'DogumYili' => (int)$dogumYiliClean
        ];
        
        $resultObject = $this->_doRequest($client, 'TCKimlikNoDogrula', $params, 'TCKN');

        if ($resultObject && isset($resultObject->TCKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->TCKimlikNoDogrulaResult;
            if (!$isSuccess) { $this->lastErrorMessageForUser = "Girilen T.C. Kimlik No, Ad, Soyad ve Doğum Yılı bilgileri NVI kayıtlarıyla eşleşmedi."; }
            else { $this->lastErrorMessageForUser = "TCKN bilgileri başarıyla doğrulandı.";}
            return $isSuccess;
        }
        if (!$this->lastError) { $this->lastError = "NVI TCKN servisinden beklenmedik yanıt formatı."; $this->lastErrorMessageForUser = "Kimlik doğrulama servisinden geçersiz bir yanıt alındı (INVALID_RESPONSE_TCKN)."; if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('TCKN Doğrulama', 'HATA', $this->lastError, null, ['response_body' => $this->lastResponse]); }}
        return false;
    }

    /**
     * Yabancı Kimlik Numarası Doğrulama
     */
    public function YabanciKimlikNoDogrula($kimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil) {
        if (!extension_loaded('soap')) { /* ... */ return false; }

        $kimlikNoClean = preg_replace('/[^0-9]/', '', (string)$kimlikNo);
        if (empty($kimlikNoClean) || strlen($kimlikNoClean) !== 11 || substr($kimlikNoClean, 0, 2) !== '99') { $this->lastError = "Geçersiz YKN formatı ($kimlikNo)."; $this->lastErrorMessageForUser = "Lütfen geçerli bir Yabancı Kimlik Numarası girin (99 ile başlayan 11 rakam)."; return false; }
        $adClean = trim((string)$ad); $soyadClean = trim((string)$soyad);
        $dogumGunClean = (int)trim((string)$dogumGun); $dogumAyClean = (int)trim((string)$dogumAy); $dogumYilClean = (int)trim((string)$dogumYil);
        if (empty($adClean) || empty($soyadClean) || $dogumGunClean < 1 || $dogumGunClean > 31 || $dogumAyClean < 1 || $dogumAyClean > 12 || strlen((string)$dogumYilClean) !== 4 ) { $this->lastError = "Ad, Soyad veya Doğum Tarihi eksik/geçersiz."; $this->lastErrorMessageForUser = "Lütfen Ad, Soyad ve Doğum Tarihi (GG/AA/YYYY) alanlarını doğru doldurun."; return false; }

        $client = null;
        try {
            $client = @new SoapClient($this->yknSoapUrl, [
                'trace' => $this->debugMode ? 1 : 0, 'exceptions' => true, 'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, 'keep_alive' => false,
                'stream_context' => stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true, 'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT]])
            ]);
        } catch (Exception $e) { $this->lastError = "YKN SOAP İstemci Oluşturma Hatası: " . $e->getMessage(); $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisine ulaşılamıyor (INIT_FAIL_YKN)."; if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('NVI YKN Doğrulama', 'CRITICAL', $this->lastError); } return false; }

        $params = [
            'KimlikNo' => (int)$kimlikNoClean,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $adClean), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı', 'İ', 'I'], ['İ', 'I', 'İ', 'I'], $soyadClean), 'UTF-8'),
            'DogumGun' => $dogumGunClean, 'DogumAy' => $dogumAyClean, 'DogumYil' => $dogumYilClean
        ];
        
        $resultObject = $this->_doRequest($client, 'YabanciKimlikNoDogrula', $params, 'YKN');

        if ($resultObject && isset($resultObject->YabanciKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->YabanciKimlikNoDogrulaResult;
            if (!$isSuccess) { $this->lastErrorMessageForUser = "Girilen Yabancı Kimlik No bilgileri NVI kayıtlarıyla eşleşmedi."; }
            else { $this->lastErrorMessageForUser = "YKN bilgileri başarıyla doğrulandı."; }
            return $isSuccess;
        }
        if (!$this->lastError) { $this->lastError = "NVI YKN servisinden beklenmedik yanıt formatı."; $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisinden geçersiz yanıt alındı (INVALID_RESPONSE_YKN)."; if ($GLOBALS['btkHelperNviLoaded']) { BtkHelper::logAction('YKN Doğrulama', 'HATA', $this->lastError, null, ['response_body' => $this->lastResponse]); }}
        return false;
    }
}
?>