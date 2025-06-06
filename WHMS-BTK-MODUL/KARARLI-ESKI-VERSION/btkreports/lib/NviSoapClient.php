<?php
// modules/addons/btkreports/lib/NviSoapClient.php

if (!defined("WHMCS")) {
    // Bu dosya doğrudan çağrılmamalı, ancak WHMCS ortamı dışında test edilebilir.
    // WHMCS ortamında ise define kontrolü yapılabilir.
    // die("This file cannot be accessed directly");
}

/**
 * NVI (Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü) KPS (Kimlik Paylaşım Sistemi)
 * SOAP Servisleri için İstemci Sınıfı.
 *
 * TCKimlikNoDogrula ve YabanciKimlikNoDogrula metotlarını içerir.
 *
 * @version 1.0.0
 */
class NviSoapClient
{
    private $tcknSoapClient;
    const TCKN_WSDL_URL = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
    // Yabancı Kimlik No Doğrulama için de aynı WSDL ve client kullanılabilir, farklı bir operasyonla.
    // Eğer WSDL farklı olsaydı, ayrı bir client tanımlanabilirdi.

    private $lastError = null;
    private $lastRequestHeaders = null;
    private $lastRequest = null;
    private $lastResponseHeaders = null;
    private $lastResponse = null;

    public function __construct($options = [])
    {
        $defaultOptions = [
            'soap_version' => SOAP_1_2,
            'exceptions'   => true, // SoapFault fırlatır
            'trace'        => 1,    // getLastRequest vb. için
            'cache_wsdl'   => WSDL_CACHE_BOTH,
            'connection_timeout' => 15, // Bağlantı zaman aşımı (saniye)
             // SSL sertifika sorunlarını (özellikle yerel test ortamlarında) atlamak için:
            /*
            'stream_context' => stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ])
            */
        ];
        $finalOptions = array_merge($defaultOptions, $options);

        try {
            $this->tcknSoapClient = new \SoapClient(self::TCKN_WSDL_URL, $finalOptions);
        } catch (\SoapFault $sf) {
            $this->lastError = "SOAP Client Başlatma Hatası (SoapFault): " . $sf->getMessage();
            $this->logNviError($this->lastError);
            // throw $sf; // Hook veya action içinde yakalanabilir
        } catch (\Exception $e) {
            $this->lastError = "Genel Client Başlatma Hatası (Exception): " . $e->getMessage();
            $this->logNviError($this->lastError);
        }
    }

    private function logNviError($message, $params = [], $isSoapFault = false)
    {
        $logMessage = "NviSoapClient Hata: " . $message;
        if (!empty($params)) {
            $logMessage .= " | Parametreler: " . json_encode($params, JSON_UNESCAPED_UNICODE);
        }
        if ($isSoapFault && $this->tcknSoapClient) {
            $logMessage .= " | İstek Başlıkları: " . $this->tcknSoapClient->__getLastRequestHeaders();
            $logMessage .= " | İstek Gövdesi: " . $this->tcknSoapClient->__getLastRequest();
            $logMessage .= " | Yanıt Başlıkları: " . $this->tcknSoapClient->__getLastResponseHeaders();
            $logMessage .= " | Yanıt Gövdesi: " . $this->tcknSoapClient->__getLastResponse();
        }

        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity($logMessage, null, null, 'NVI_ERROR');
        } elseif (function_exists('logActivity')) {
            logActivity("BTK Modülü - " . $logMessage, 0);
        } else {
            error_log("BTK Modülü - " . $logMessage);
        }
    }

    public function getLastError()
    {
        return $this->lastError;
    }
    
    public function getLastRequestInfo() {
        if ($this->tcknSoapClient && $this->lastError) { // Sadece hata durumunda loglanmışsa
            return [
                'request_headers' => $this->lastRequestHeaders ?: $this->tcknSoapClient->__getLastRequestHeaders(),
                'request_body' => $this->lastRequest ?: $this->tcknSoapClient->__getLastRequest(),
                'response_headers' => $this->lastResponseHeaders ?: $this->tcknSoapClient->__getLastResponseHeaders(),
                'response_body' => $this->lastResponse ?: $this->tcknSoapClient->__getLastResponse(),
            ];
        }
        return null;
    }


    public function TCKimlikNoDogrula($TCKimlikNo, $Ad, $Soyad, $DogumYili)
    {
        $this->lastError = null;
        if (!$this->tcknSoapClient) {
            $this->lastError = "SOAP istemcisi başlatılamadı.";
            return false;
        }

        try {
            $params = new \stdClass();
            $params->TCKimlikNo = (string)$TCKimlikNo; // NVI long bekliyor ama string daha güvenli
            $params->Ad         = mb_strtoupper($Ad, 'UTF-8');
            $params->Soyad      = mb_strtoupper($Soyad, 'UTF-8');
            $params->DogumYili  = (int)$DogumYili;

            $response = $this->tcknSoapClient->TCKimlikNoDogrula($params);
            
            $this->lastRequestHeaders = $this->tcknSoapClient->__getLastRequestHeaders();
            $this->lastRequest = $this->tcknSoapClient->__getLastRequest();
            $this->lastResponseHeaders = $this->tcknSoapClient->__getLastResponseHeaders();
            $this->lastResponse = $this->tcknSoapClient->__getLastResponse();

            if (isset($response->TCKimlikNoDogrulaResult)) {
                return (bool)$response->TCKimlikNoDogrulaResult;
            }
            $this->lastError = "TCKN Doğrulama - Beklenmedik Yanıt Formatı: " . print_r($response, true);
            $this->logNviError($this->lastError, (array)$params);
            return false;

        } catch (\SoapFault $sf) {
            $this->lastError = "TCKN Doğrulama SOAP Hatası: " . $sf->getMessage();
            $this->logNviError($this->lastError, (array)($params ?? []), true);
            return false;
        } catch (\Exception $e) {
            $this->lastError = "TCKN Doğrulama Genel Hata: " . $e->getMessage();
            $this->logNviError($this->lastError, (array)($params ?? []));
            return false;
        }
    }

    public function YabanciKimlikNoDogrula($KimlikNo, $Ad, $Soyad, $DogumGun, $DogumAy, $DogumYil)
    {
        $this->lastError = null;
        if (!$this->tcknSoapClient) {
            $this->lastError = "SOAP istemcisi başlatılamadı.";
            return false;
        }
        try {
            $params = new \stdClass();
            $params->KimlikNo = (string)$KimlikNo;
            $params->Ad       = mb_strtoupper($Ad, 'UTF-8');
            $params->Soyad    = mb_strtoupper($Soyad, 'UTF-8');
            $params->DogumGun = (int)$DogumGun;
            $params->DogumAy  = (int)$DogumAy;
            $params->DogumYil = (int)$DogumYil;
            
            $response = $this->tcknSoapClient->YabanciKimlikNoDogrula($params);

            $this->lastRequestHeaders = $this->tcknSoapClient->__getLastRequestHeaders();
            $this->lastRequest = $this->tcknSoapClient->__getLastRequest();
            $this->lastResponseHeaders = $this->tcknSoapClient->__getLastResponseHeaders();
            $this->lastResponse = $this->tcknSoapClient->__getLastResponse();

            if (isset($response->YabanciKimlikNoDogrulaResult)) {
                return (bool)$response->YabanciKimlikNoDogrulaResult;
            }
            $this->lastError = "YKN Doğrulama - Beklenmedik Yanıt Formatı: " . print_r($response, true);
            $this->logNviError($this->lastError, (array)$params);
            return false;

        } catch (\SoapFault $sf) {
            $this->lastError = "YKN Doğrulama SOAP Hatası: " . $sf->getMessage();
            $this->logNviError($this->lastError, (array)($params ?? []), true);
            return false;
        } catch (\Exception $e) {
            $this->lastError = "YKN Doğrulama Genel Hata: " . $e->getMessage();
            $this->logNviError($this->lastError, (array)($params ?? []));
            return false;
        }
    }
}
?>