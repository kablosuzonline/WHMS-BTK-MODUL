<?php
/**
 * NVI (MERNIS) T.C. Kimlik No ve Yabancı Kimlik No Doğrulama SOAP İstemcisi
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

class NviSoapClient {

    private $tcknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL";
    private $yknSoapUrl = "https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL";
    
    private $lastError;
    private $lastErrorMessageForUser;
    private $timeoutSeconds = 20;

    public function __construct() {
        if (!extension_loaded('soap')) {
            $this->lastError = "PHP SOAP eklentisi sunucunuzda yüklü veya etkin değil.";
            $this->lastErrorMessageForUser = "Kimlik doğrulama servisi şu anda kullanılamıyor (Teknik Altyapı: SOAP).";
            if (class_exists('BtkHelper')) {
                BtkHelper::logAction('NVI SOAP Başlatma Hatası', 'CRITICAL', $this->lastError);
            }
        }
    }

    public function getLastError() { return $this->lastError; }
    public function getLastErrorMessageForUser() { return $this->lastErrorMessageForUser; }

    private function _doRequest($url, $method, $params, $serviceType = 'TCKN') {
        $this->lastError = null;
        $this->lastErrorMessageForUser = "Bilinmeyen bir NVI hatası oluştu.";

        try {
            $client = @new SoapClient($url, [
                'trace' => class_exists('BtkHelper') && (BtkHelper::get_btk_setting('debug_mode') === '1'),
                'exceptions' => true,
                'connection_timeout' => $this->timeoutSeconds,
                'cache_wsdl' => WSDL_CACHE_MEMORY,
                'keep_alive' => false,
                'stream_context' => stream_context_create([
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    ]
                ])
            ]);
            
            $resultObject = $client->__soapCall($method, ['parameters' => $params]);
            return $resultObject;

        } catch (SoapFault $sf) {
            $this->lastError = "SOAP Hatası (" . ($sf->faultcode ?? 'N/A') . "): " . $sf->getMessage();
            if (stripos($sf->getMessage(), 'timeout') !== false) {
                $this->lastErrorMessageForUser = "Kimlik doğrulama servisine bağlanırken zaman aşımı oluştu.";
            } elseif (stripos($sf->getMessage(), 'could not connect to host') !== false) {
                $this->lastErrorMessageForUser = "Kimlik doğrulama servisine ulaşılamıyor (bağlantı hatası).";
            } else {
                $this->lastErrorMessageForUser = "Kimlik doğrulama servisinde sorun oluştu (SOAP: {$sf->faultcode}).";
            }
            if (class_exists('BtkHelper')) {
                BtkHelper::logAction("NVI SOAP ({$serviceType}) SoapFault", 'HATA', ['error' => $this->lastError]);
            }
            return false;
        } catch (Exception $e) {
            $this->lastError = "Genel Hata ({$serviceType}): " . $e->getMessage();
            $this->lastErrorMessageForUser = "Kimlik doğrulama sırasında beklenmedik bir hata oluştu.";
            if (class_exists('BtkHelper')) {
                BtkHelper::logAction("NVI SOAP ({$serviceType}) Exception", 'HATA', ['error' => $this->lastError]);
            }
            return false;
        }
    }

    public function TCKimlikNoDogrula($tcKimlikNo, $ad, $soyad, $dogumYili) {
        if (!extension_loaded('soap')) return false;
        
        $tcKimlikNoClean = preg_replace('/[^0-9]/', '', (string)$tcKimlikNo);
        if (strlen($tcKimlikNoClean) !== 11) {
            $this->lastErrorMessageForUser = "Geçerli bir TCKN girin (11 Hane).";
            return false;
        }

        $paramsRequest = [
            'TCKimlikNo' => (int)$tcKimlikNoClean,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $ad), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $soyad), 'UTF-8'),
            'DogumYili' => (int)$dogumYili
        ];
        
        $resultObject = $this->_doRequest($this->tcknSoapUrl, 'TCKimlikNoDogrula', $paramsRequest, 'TCKN');

        if ($resultObject && isset($resultObject->TCKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->TCKimlikNoDogrulaResult;
            $this->lastErrorMessageForUser = $isSuccess ? "T.C. Kimlik No başarıyla doğrulandı." : "Girilen T.C. Kimlik No bilgileri NVI tarafından doğrulanamadı.";
            return $isSuccess;
        }

        if (!$this->lastError) {
             $this->lastErrorMessageForUser = "Kimlik servisinden geçersiz yanıt alındı.";
        }
        return false;
    }

    public function YabanciKimlikNoDogrula($kimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil) {
        if (!extension_loaded('soap')) return false;

        $kimlikNoClean = preg_replace('/[^0-9]/', '', (string)$kimlikNo);
        if (strlen($kimlikNoClean) !== 11 || substr($kimlikNoClean, 0, 2) !== '99') {
            $this->lastErrorMessageForUser = "Lütfen geçerli bir Yabancı Kimlik Numarası girin (99 ile başlayan 11 Hane).";
            return false;
        }
        
        $paramsRequest = [
            'KimlikNo' => (int)$kimlikNoClean,
            'Ad' => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $ad), 'UTF-8'),
            'Soyad' => mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $soyad), 'UTF-8'),
            'DogumGun' => (int)$dogumGun,
            'DogumAy' => (int)$dogumAy,
            'DogumYil' => (int)$dogumYil
        ];
        
        $resultObject = $this->_doRequest($this->yknSoapUrl, 'YabanciKimlikNoDogrula', $paramsRequest, 'YKN');

        if ($resultObject && isset($resultObject->YabanciKimlikNoDogrulaResult)) {
            $isSuccess = (bool)$resultObject->YabanciKimlikNoDogrulaResult;
            $this->lastErrorMessageForUser = $isSuccess ? "Yabancı Kimlik No başarıyla doğrulandı." : "Girilen Yabancı Kimlik No bilgileri NVI tarafından doğrulanamadı.";
            return $isSuccess;
        }

        if (!$this->lastError) {
            $this->lastErrorMessageForUser = "Yabancı kimlik doğrulama servisinden geçersiz bir yanıt alındı.";
        }
        return false;
    }
}
?>