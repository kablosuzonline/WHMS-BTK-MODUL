<?php
/**
 * NVI (MERNIS) T.C. Kimlik No ve Yabancı Kimlik No Doğrulama SOAP İstemcisi
 * PhpSpreadsheet bağımlılığı yoktur, sadece SOAP eklentisi gerektirir.
 *
 * @package    WHMCS\Module\Addon\BtkReports\Lib
 * @author     Gemini Pro AI & Kablosuz Online WISP
 * @version    1.1.0
 */

namespace WHMCS\Module\Addon\BtkReports\Lib;

// WHMCS ortamında çalışıp çalışmadığını kontrol et
if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

class NviSoapClient {

    const TCKN_SOAP_URL = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL";
    const YKN_SOAP_URL = "https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL";
    
    private $lastRawRequest;
    private $lastRawResponse;
    
    private $timeoutSeconds = 20;
    private $debugMode = false; // Bu, btkreports.php'deki ayardan set edilebilir.
    private static $moduleName = 'btkreports'; // Loglama için

    /**
     * Constructor
     * @param bool $debug Debug modunu ayarlar.
     */
    public function __construct($debug = false) {
        $this->debugMode = (bool)$debug;
        if (!extension_loaded('soap')) {
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, 'SOAP Eklentisi Yüklü Değil', 'PHP SOAP eklentisi sunucuda yüklü veya etkin değil.', null, 'CRITICAL');
            // Bu durumda sınıfın metodları hata verecektir.
        }
    }

    public function getLastRawRequest() { return $this->lastRawRequest; }
    public function getLastRawResponse() { return $this->lastRawResponse; }

    /**
     * Özel SOAP isteği yapar, loglar ve sonucu döner.
     * @param string $wsdlUrl
     * @param string $method
     * @param array $params
     * @param string $serviceType 'TCKN' veya 'YKN' (loglama için)
     * @return array ['success' => bool, 'message' => string (teknik), 'user_message' => string (kullanıcıya), 'data' => mixed]
     */
    private function _doRequest($wsdlUrl, $method, $params, $serviceType = 'TCKN') {
        $this->lastRawRequest = null;
        $this->lastRawResponse = null;
        $logParamsForRequest = $params; // Loglama için orijinal parametreler

        if (!extension_loaded('soap')) {
            return [
                'success' => false, 
                'message' => 'PHP SOAP eklentisi etkin değil.',
                'user_message' => 'Kimlik doğrulama servisi şu anda kullanılamıyor (Sistem Hatası: SOAP_EXT_MISSING).',
                'data' => null
            ];
        }

        $client = null;
        try {
            // SSL Context ayarları (Gerekirse)
            $sslOptions = [
                'ssl' => [
                    'verify_peer' => false, // Üretimde true olmalı, NVI'nin sertifikası güvenilir. Sorun yaşanırsa false denenebilir.
                    'verify_peer_name' => false,
                    'allow_self_signed' => true, // Genellikle false olmalı
                    // TLS 1.2 zorlaması (NVI servisleri genellikle bunu destekler)
                    'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT,
                ]
            ];
            $context = stream_context_create($sslOptions);

            $client = @new \SoapClient($wsdlUrl, [
                'trace' => $this->debugMode ? 1 : 0, // trace 1 olmalı ki getLastRequest/Response çalışsın
                'exceptions' => true, // Hataları SoapFault olarak yakala
                'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY, // WSDL'i bellekte cache'le
                'keep_alive' => false, // Her istek için yeni bağlantı (NVI için daha stabil olabilir)
                'stream_context' => $context
            ]);
        } catch (\Exception $e) {
            $errorMsg = "SOAP İstemci Oluşturma Hatası ({$serviceType}): " . $e->getMessage();
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, "NVI SOAP ({$serviceType}) İstemci Hatası", ['params' => $logParamsForRequest, 'url' => $wsdlUrl], $errorMsg, 'CRITICAL');
            return [
                'success' => false,
                'message' => $errorMsg,
                'user_message' => "Kimlik doğrulama servisine bağlantı kurulamadı ({$serviceType}_INIT_FAIL).",
                'data' => null
            ];
        }

        try {
            $resultObject = $client->__soapCall($method, [$params]);
            
            if ($this->debugMode) {
                $this->lastRawRequest = $client->__getLastRequest();
                $this->lastRawResponse = $client->__getLastResponse();
                logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, "NVI SOAP ({$serviceType}) İstek/Yanıt",
                    ['url' => $wsdlUrl, 'method' => $method, 'params' => $logParamsForRequest, 'response_preview' => substr($this->lastRawResponse ?? '', 0, 500)],
                    $resultObject, 'DEBUG');
            }
            return [
                'success' => true, // SOAP çağrısı başarılı, sonucun kendisi sonra işlenecek
                'message' => "SOAP isteği başarıyla gönderildi ({$serviceType}).",
                'user_message' => '', // Bu, doğrulama sonucuna göre ayarlanacak
                'data' => $resultObject
            ];

        } catch (\SoapFault $sf) {
            $errorMsg = "SOAP Hatası ({$serviceType} - " . ($sf->faultcode ?? 'Bilinmiyor') . "): " . $sf->getMessage();
            if ($this->debugMode && isset($client)) {
                $this->lastRawRequest = $client->__getLastRequest(); // Hata durumunda da isteği al
                $this->lastRawResponse = $client->__getLastResponse(); // Yanıtı da (eğer varsa)
            }
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, "NVI SOAP ({$serviceType}) SoapFault",
                ['params' => $logParamsForRequest, 'request_preview' => substr($this->lastRawRequest ?? '', 0, 500)],
                $errorMsg, 'ERROR');
            return [
                'success' => false,
                'message' => $errorMsg,
                'user_message' => "Kimlik doğrulama servisine erişirken bir sorun oluştu ({$serviceType}_SOAP_FAULT). Lütfen bilgilerinizi kontrol edin veya daha sonra tekrar deneyin.",
                'data' => ['faultcode' => $sf->faultcode, 'faultstring' => $sf->faultstring, 'detail' => $sf->detail]
            ];
        } catch (\Exception $e) {
            $errorMsg = "Genel Hata ({$serviceType}): " . $e->getMessage();
            logModuleCall(self::$moduleName, __CLASS__ . '::' . __FUNCTION__, "NVI SOAP ({$serviceType}) Exception", ['params' => $logParamsForRequest], $errorMsg, 'ERROR');
            return [
                'success' => false,
                'message' => $errorMsg,
                'user_message' => "Kimlik doğrulama sırasında beklenmedik bir teknik hata oluştu ({$serviceType}_EXCEPTION).",
                'data' => null
            ];
        }
    }

    /**
     * T.C. Kimlik Numarası Doğrulama
     * @param int|string $tcKimlikNo
     * @param string $ad
     * @param string $soyad
     * @param int $dogumYili (YYYY formatında)
     * @return array ['success' => bool, 'message' => string (teknik), 'user_message' => string (kullanıcıya), 'is_valid' => bool|null]
     */
    public function TCKimlikNoDogrula($tcKimlikNo, $ad, $soyad, $dogumYili) {
        $tcKimlikNoClean = preg_replace('/[^0-9]/', '', (string)$tcKimlikNo);
        $adClean = trim((string)$ad);
        $soyadClean = trim((string)$soyad);
        $dogumYiliClean = (int)trim((string)$dogumYili);

        if (empty($tcKimlikNoClean) || strlen($tcKimlikNoClean) !== 11) {
            return ['success' => false, 'message' => "Geçersiz TCKN formatı: '$tcKimlikNo'.", 'user_message' => "Lütfen geçerli bir T.C. Kimlik Numarası girin (11 rakam).", 'is_valid' => false];
        }
        if (empty($adClean) || empty($soyadClean) || $dogumYiliClean < 1900 || $dogumYiliClean > date('Y')) {
            return ['success' => false, 'message' => "Ad, Soyad veya Doğum Yılı eksik/geçersiz.", 'user_message' => "Lütfen Ad, Soyad ve Doğum Yılı (YYYY formatında) alanlarını doğru doldurun.", 'is_valid' => false];
        }

        $params = [
            'TCKimlikNo' => (int)$tcKimlikNoClean, // Servis int bekliyor
            'Ad'         => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $adClean), 'UTF-8'),
            'Soyad'      => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $soyadClean), 'UTF-8'),
            'DogumYili'  => $dogumYiliClean
        ];
        
        $response = $this->_doRequest(self::TCKN_SOAP_URL, 'TCKimlikNoDogrula', $params, 'TCKN');

        if ($response['success'] && isset($response['data']->TCKimlikNoDogrulaResult)) {
            $isValid = (bool)$response['data']->TCKimlikNoDogrulaResult;
            return [
                'success' => true, // SOAP isteği başarılı
                'message' => $isValid ? 'TCKN Doğrulandı.' : 'TCKN Doğrulanamadı (NVI).',
                'user_message' => $isValid ? 'T.C. Kimlik bilgileri başarıyla doğrulandı.' : 'Girilen T.C. Kimlik No, Ad, Soyad ve Doğum Yılı bilgileri NVI kayıtlarıyla eşleşmedi.',
                'is_valid' => $isValid
            ];
        }
        // _doRequest zaten hata durumunda loglama yapar ve user_message set eder.
        return [
            'success' => false,
            'message' => $response['message'] ?? 'NVI TCKN servisinden beklenmedik yanıt formatı.',
            'user_message' => $response['user_message'] ?? 'Kimlik doğrulama servisinden geçersiz bir yanıt alındı (INVALID_RESPONSE_TCKN).',
            'is_valid' => false
        ];
    }

    /**
     * Yabancı Kimlik Numarası Doğrulama
     * @param int|string $kimlikNo (99 ile başlayan)
     * @param string $ad
     * @param string $soyad
     * @param int $dogumGun
     * @param int $dogumAy
     * @param int $dogumYil (YYYY formatında)
     * @return array ['success' => bool, 'message' => string (teknik), 'user_message' => string (kullanıcıya), 'is_valid' => bool|null]
     */
    public function YabanciKimlikNoDogrula($kimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil) {
        $kimlikNoClean = preg_replace('/[^0-9]/', '', (string)$kimlikNo);
        $adClean = trim((string)$ad);
        $soyadClean = trim((string)$soyad);
        $dogumGunClean = (int)trim((string)$dogumGun);
        $dogumAyClean = (int)trim((string)$dogumAy);
        $dogumYilClean = (int)trim((string)$dogumYil);

        if (empty($kimlikNoClean) || strlen($kimlikNoClean) !== 11 || substr($kimlikNoClean, 0, 2) !== '99') {
            return ['success' => false, 'message' => "Geçersiz YKN formatı: '$kimlikNo'.", 'user_message' => "Lütfen geçerli bir Yabancı Kimlik Numarası girin (99 ile başlayan 11 rakam).", 'is_valid' => false];
        }
        if (empty($adClean) || empty($soyadClean) || 
            !checkdate($dogumAyClean, $dogumGunClean, $dogumYilClean) || $dogumYilClean < 1900 || $dogumYilClean > date('Y')) {
            return ['success' => false, 'message' => "Ad, Soyad veya Doğum Tarihi eksik/geçersiz.", 'user_message' => "Lütfen Ad, Soyad ve geçerli bir Doğum Tarihi (GG.AA.YYYY formatında) girin.", 'is_valid' => false];
        }

        $params = [
            'KimlikNo' => (int)$kimlikNoClean, // Servis int bekliyor
            'Ad'       => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $adClean), 'UTF-8'),
            'Soyad'    => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $soyadClean), 'UTF-8'),
            'DogumGun' => $dogumGunClean,
            'DogumAy'  => $dogumAyClean,
            'DogumYil' => $dogumYilClean
        ];

        $response = $this->_doRequest(self::YKN_SOAP_URL, 'YabanciKimlikNoDogrula', $params, 'YKN');

        if ($response['success'] && isset($response['data']->YabanciKimlikNoDogrulaResult)) {
            $isValid = (bool)$response['data']->YabanciKimlikNoDogrulaResult;
            return [
                'success' => true, // SOAP isteği başarılı
                'message' => $isValid ? 'YKN Doğrulandı.' : 'YKN Doğrulanamadı (NVI).',
                'user_message' => $isValid ? 'Yabancı Kimlik bilgileri başarıyla doğrulandı.' : 'Girilen Yabancı Kimlik No ve diğer kişisel bilgiler NVI kayıtlarıyla eşleşmedi.',
                'is_valid' => $isValid
            ];
        }
        return [
            'success' => false,
            'message' => $response['message'] ?? 'NVI YKN servisinden beklenmedik yanıt formatı.',
            'user_message' => $response['user_message'] ?? 'Yabancı kimlik doğrulama servisinden geçersiz bir yanıt alındı (INVALID_RESPONSE_YKN).',
            'is_valid' => false
        ];
    }
}
?>