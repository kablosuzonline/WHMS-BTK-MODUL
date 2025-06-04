<?php
/**
 * WHMCS BTK Raporlama Modülü - NVI SOAP İstemcisi - V5.0.0 - Yeni Nesil
 *
 * T.C. Kimlik Numarası ve Yabancı Kimlik Numarası doğrulaması için
 * NVI (Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü) halka açık
 * SOAP servisleriyle iletişim kurar.
 *
 * TCKimlikNoDogrula Servisi WSDL: https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL
 * YabanciKimlikNoDogrula Servisi WSDL: https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL
 */

namespace WHMCS\Module\Addon\BtKReports\Lib;

// SoapClient sınıfının varlığını kontrol et (PHP eklentisi olarak sunucuda kurulu olmalı)
if (!class_exists('\SoapClient')) {
    // Bu durum genellikle sunucuda php-soap eklentisinin kurulu olmamasından kaynaklanır.
    // Helper fonksiyonu aracılığıyla loglama yapılabilir, ancak bu sınıfın dışında olduğu için
    // doğrudan logActivity veya error_log kullanılabilir.
    $errorMessage = "BTK Raporlama Modülü Kritik Hata: SoapClient sınıfı bulunamadı. Lütfen sunucunuzda php-soap eklentisinin kurulu olduğundan emin olun.";
    if (function_exists('logActivity')) {
        logActivity($errorMessage, 0);
    } else {
        error_log($errorMessage); // Fallback to PHP error log
    }
    // Bu sınıfın yüklenememesi durumunda, onu çağıran kodlar zaten hata verecektir.
    // Burada bir Exception fırlatmak veya die() ile çıkmak da bir seçenek olabilir.
    // Ancak, sınıfın sadece var olmaması, onu kullanan kodun try-catch ile bunu yakalamasına izin verebilir.
}

class NviSoapClient {

    /**
     * T.C. Kimlik Numarası doğrulama servisi için WSDL adresi.
     * @var string
     */
    private $tcKimlikNoServisWsdlUrl = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';

    /**
     * Yabancı Kimlik Numarası doğrulama servisi için WSDL adresi.
     * @var string
     */
    private $yabanciKimlikNoServisWsdlUrl = 'https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL';


    /**
     * SOAP istemcisi için genel ayarlar.
     * @var array
     */
    private $soapClientOptions = [
        'trace' => 1, // Hata ayıklama için SOAP request/response'larını yakalamayı etkinleştirir
        'exceptions' => true, // SOAP hatalarını PHP exception'ları olarak yakala
        'connection_timeout' => 20, // Bağlantı zaman aşımı (saniye) - NVI servisleri bazen yavaş olabilir.
        'cache_wsdl' => WSDL_CACHE_NONE, // WSDL cache'lemeyi geliştirme sırasında devre dışı bırak.
                                         // Canlı ortamda performans için WSDL_CACHE_DISK veya WSDL_CACHE_BOTH kullanılabilir.
        'stream_context' => null // SSL/TLS ayarları için (aşağıda ayarlanabilir)
    ];

    public function __construct() {
        // Bazı sunucularda SSL/TLS sertifika doğrulama sorunlarını aşmak için stream_context ayarları.
        // İdeal olan, sunucunuzda güncel CA (Certificate Authority) sertifikalarının bulunmasıdır.
        // Eğer NVI servislerine bağlanırken SSL/TLS ile ilgili hatalar alırsanız bu ayarları kullanabilirsiniz.
        // DİKKAT: 'verify_peer' => false ayarı güvenlik riski oluşturabilir. Sadece kesinlikle gerekliyse
        // ve sunucu yapılandırmanızdan eminseniz kullanın. Daha güvenli bir yöntem,
        // NVI'nın kullandığı CA sertifikasını sunucunuza ekleyip 'capath' veya 'cafile' ile belirtmektir.
        /*
        $this->soapClientOptions['stream_context'] = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true // Sadece yerel testler veya özel durumlar için
            ]
        ]);
        */
    }

    /**
     * T.C. Kimlik Numarası doğrulaması yapar (KPSPublic servisi).
     *
     * @param int|string $TCKimlikNo Doğrulanacak T.C. Kimlik Numarası (11 hane, sayısal).
     * @param string $Ad Kişinin adı (Büyük harflerle, Türkçe karakterlere duyarlı).
     * @param string $Soyad Kişinin soyadı (Büyük harflerle, Türkçe karakterlere duyarlı).
     * @param int $DogumYili Kişinin doğum yılı (YYYY formatında, 4 hane, sayısal).
     * @return bool Doğrulama sonucu (true: geçerli, false: geçersiz veya hata).
     */
    public function TCKimlikNoDogrula($TCKimlikNo, $Ad, $Soyad, $DogumYili) {
        // Parametre kontrolleri
        if (empty($TCKimlikNo) || !is_numeric($TCKimlikNo) || strlen((string)$TCKimlikNo) !== 11 ||
            empty($Ad) || empty($Soyad) ||
            empty($DogumYili) || !is_numeric($DogumYili) || strlen((string)$DogumYili) !== 4) {
            
            if(function_exists('btk_log_module_action')) {
                 btk_log_module_action('NVI TCKN Doğrulama: Geçersiz veya eksik parametreler.', 'NVI_VALIDATION_ERROR', [
                    'tc_kimlik_no_length' => strlen((string)$TCKimlikNo), 
                    'ad_empty' => empty($Ad), 
                    'soyad_empty' => empty($Soyad), 
                    'dogum_yili_format' => strlen((string)$DogumYili)
                ]);
            }
            return false;
        }
        
        // NVI servisi parametreleri stdClass olarak bekleyebilir veya dizi de kabul edebilir.
        // WHMCS SoapClient genellikle stdClass tercih eder.
        $params = new \stdClass();
        $params->TCKimlikNo = (int)$TCKimlikNo; // NVI servisi 'long' bekliyor.
        $params->Ad         = mb_strtoupper(trim((string)$Ad), 'UTF-8');
        $params->Soyad      = mb_strtoupper(trim((string)$Soyad), 'UTF-8');
        $params->DogumYili  = (int)$DogumYili;

        try {
            if (!class_exists('\SoapClient')) {
                 if(function_exists('btk_log_module_action')) btk_log_module_action('NVI TCKN Doğrulama: SoapClient sınıfı bulunamadı. Sunucuda php-soap eklentisi kurulu mu?', 'CRITICAL_ERROR');
                 return false;
            }
            $client = new \SoapClient($this->tcKimlikNoServisWsdlUrl, $this->soapClientOptions);
            $result = $client->TCKimlikNoDogrula($params); // Metod adı WSDL'den teyit edilmeli.

            // Dönen sonucun yapısını kontrol et (genellikle $result->TCKimlikNoDogrulaResult şeklinde boolean döner)
            if (isset($result->TCKimlikNoDogrulaResult)) {
                return (bool)$result->TCKimlikNoDogrulaResult;
            }
            // Beklenmedik bir yanıt formatı gelirse logla
            if(function_exists('btk_log_module_action')) btk_log_module_action('NVI TCKN Doğrulama: Beklenmedik yanıt formatı.', 'NVI_WARNING', ['params' => (array)$params, 'response' => json_encode($result)]);
            return false;
        } catch (\SoapFault $sf) {
            // SOAP hatasını detaylı logla
            if(function_exists('btk_log_module_action')) {
                 btk_log_module_action('NVI TCKN Doğrulama SOAP Hatası', 'NVI_ERROR', [
                    'tc_kimlik_no' => $TCKimlikNo, 
                    'fault_code' => $sf->faultcode ?? 'N/A',
                    'fault_string' => $sf->faultstring ?? 'N/A',
                    'detail' => isset($sf->detail) ? (is_string($sf->detail) ? $sf->detail : json_encode($sf->detail)) : 'N/A',
                    'request_headers' => $client->__getLastRequestHeaders() ?? '',
                    'request_body' => $client->__getLastRequest() ?? '',
                    'response_headers' => $client->__getLastResponseHeaders() ?? '',
                    'response_body' => $client->__getLastResponse() ?? ''
                ]);
            }
            return false;
        } catch (\Exception $e) {
            // Diğer genel hataları (örn: bağlantı hatası) logla
             if(function_exists('btk_log_module_action')) {
                btk_log_module_action('NVI TCKN Doğrulama Genel Hata', 'NVI_ERROR', [
                    'tc_kimlik_no' => $TCKimlikNo, 
                    'error_message' => $e->getMessage(),
                    'trace' => substr($e->getTraceAsString(), 0, 1000) // Trace'in bir kısmını logla
                ]);
            }
            return false;
        }
    }

    /**
     * Yabancı Kimlik Numarası doğrulaması yapar (KPSPublicYabanciDogrula servisi).
     *
     * @param int|string $KimlikNo Doğrulanacak Yabancı Kimlik Numarası (Genellikle 11 hane, 99 ile başlar).
     * @param string $Ad Kişinin adı (Büyük harflerle, Türkçe karakterlere duyarlı).
     * @param string $Soyad Kişinin soyadı (Büyük harflerle, Türkçe karakterlere duyarlı).
     * @param int $DogumGun Kişinin doğum günü (1-31).
     * @param int $DogumAy Kişinin doğum ayı (1-12).
     * @param int $DogumYil Kişinin doğum yılı (YYYY formatında, 4 hane).
     * @return bool Doğrulama sonucu (true: geçerli, false: geçersiz veya hata).
     */
    public function YabanciKimlikNoDogrula($KimlikNo, $Ad, $Soyad, $DogumGun, $DogumAy, $DogumYil) {
         // Parametre kontrolleri
         if (empty($KimlikNo) || !is_numeric($KimlikNo) || strlen((string)$KimlikNo) !== 11 ||
             empty($Ad) || empty($Soyad) ||
             empty($DogumGun) || !is_numeric($DogumGun) || $DogumGun < 1 || $DogumGun > 31 ||
             empty($DogumAy) || !is_numeric($DogumAy) || $DogumAy < 1 || $DogumAy > 12 ||
             empty($DogumYil) || !is_numeric($DogumYil) || strlen((string)$DogumYil) !== 4) {
            
            if(function_exists('btk_log_module_action')) {
                btk_log_module_action('NVI YKN Doğrulama: Geçersiz veya eksik parametreler.', 'NVI_VALIDATION_ERROR', [
                    'ykn_length' => strlen((string)$KimlikNo), 
                    'ad_empty' => empty($Ad), 
                    'soyad_empty' => empty($Soyad), 
                    'gun' => $DogumGun, 'ay' => $DogumAy, 'yil' => $DogumYil
                ]);
            }
            return false;
        }

        $params = new \stdClass();
        $params->KimlikNo = (int)$KimlikNo; // NVI servisi 'long' bekliyor.
        $params->Ad       = mb_strtoupper(trim((string)$Ad), 'UTF-8');
        $params->Soyad    = mb_strtoupper(trim((string)$Soyad), 'UTF-8');
        $params->DogumGun = (int)$DogumGun;
        $params->DogumAy  = (int)$DogumAy;
        $params->DogumYil = (int)$DogumYil;

        try {
            if (!class_exists('\SoapClient')) {
                 if(function_exists('btk_log_module_action')) btk_log_module_action('NVI YKN Doğrulama: SoapClient sınıfı bulunamadı. Sunucuda php-soap eklentisi kurulu mu?', 'CRITICAL_ERROR');
                 return false;
            }
            $client = new \SoapClient($this->yabanciKimlikNoServisWsdlUrl, $this->soapClientOptions);
            $result = $client->YabanciKimlikNoDogrula($params); // Metod adı WSDL'den teyit edilmeli.

            // Dönen sonucun yapısını kontrol et
            if (isset($result->YabanciKimlikNoDogrulaResult)) {
                return (bool)$result->YabanciKimlikNoDogrulaResult;
            }
             if(function_exists('btk_log_module_action')) btk_log_module_action('NVI YKN Doğrulama: Beklenmedik yanıt formatı.', 'NVI_WARNING', ['params' => (array)$params, 'response' => json_encode($result)]);
            return false;

        } catch (\SoapFault $sf) {
             if(function_exists('btk_log_module_action')) {
                 btk_log_module_action('NVI YKN Doğrulama SOAP Hatası', 'NVI_ERROR', [
                    'ykn' => $KimlikNo, 'ad' => $Ad, 'soyad' => $Soyad,
                    'fault_code' => $sf->faultcode ?? 'N/A',
                    'fault_string' => $sf->faultstring ?? 'N/A',
                    'detail' => isset($sf->detail) ? (is_string($sf->detail) ? $sf->detail : json_encode($sf->detail)) : 'N/A',
                    'request_headers' => $client->__getLastRequestHeaders() ?? '',
                    'request_body' => $client->__getLastRequest() ?? '',
                    'response_headers' => $client->__getLastResponseHeaders() ?? '',
                    'response_body' => $client->__getLastResponse() ?? ''
                ]);
            }
            return false;
        } catch (\Exception $e) {
             if(function_exists('btk_log_module_action')) {
                btk_log_module_action('NVI YKN Doğrulama Genel Hata', 'NVI_ERROR', [
                    'ykn' => $KimlikNo, 'ad' => $Ad, 'soyad' => $Soyad,
                    'error_message' => $e->getMessage(),
                    'trace' => substr($e->getTraceAsString(), 0, 1000)
                ]);
            }
            return false;
        }
    }
}
?>