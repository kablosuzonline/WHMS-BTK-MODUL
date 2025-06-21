<?php
/**
 * WHMCS BTK Raporlama Modülü - NVİ KPS SOAP Servis İstemcisi
 *
 * T.C. Kimlik Numarası ve Yabancı Kimlik Numarası doğrulamaları için
 * NVİ Kimlik Paylaşım Sistemi SOAP servisleriyle iletişim kurar.
 */

// use SoapClient; // PHP'de SoapClient eklentisinin aktif olması gerekir.

class NviSoapClient
{
    private $tcknDogrulaWsdl = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
    private $yabanciKimlikDogrulaWsdl = 'https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL';
    private $soapOptions;
    private $helper; // BtkHelper loglama için

    public function __construct(BtkHelper $helperInstance = null)
    {
        if (!extension_loaded('soap')) {
            if ($helperInstance) {
                $helperInstance->logMessage('ERROR', __CLASS__, 'SOAP eklentisi PHP\'de aktif değil. NVİ doğrulama servisleri çalışmayacak.');
            }
            // throw new \Exception("PHP SOAP eklentisi aktif değil."); // Veya sadece loglayıp devam et
        }
        
        $this->helper = $helperInstance;

        $this->soapOptions = [
            'trace' => 1, // Hata ayıklama için trace'i açar
            'exceptions' => true, // SOAP hatalarını exception olarak fırlatır
            'connection_timeout' => 10, // Bağlantı zaman aşımı (saniye)
            'cache_wsdl' => WSDL_CACHE_BOTH, // WSDL'i hem diskte hem bellekte cache'le
            // Gerekirse SSL/TLS ayarları eklenebilir:
            // 'stream_context' => stream_context_create([
            //     'ssl' => [
            //         'verify_peer' => false, // Önerilmez, sadece test için
            //         'verify_peer_name' => false,
            //         'allow_self_signed' => true // Önerilmez
            //     ]
            // ])
        ];
    }

    /**
     * T.C. Kimlik Numarası Doğrulama
     *
     * @param int|string $tcKimlikNo Doğrulanacak T.C. Kimlik Numarası (11 hane)
     * @param string $ad Kişinin adı (Büyük harflerle)
     * @param string $soyad Kişinin soyadı (Büyük harflerle)
     * @param int $dogumYili Kişinin doğum yılı (4 hane)
     * @return array ['isValid' => bool, 'message' => string, 'nvi_response' => mixed (debug için)]
     */
    public function validateTCKimlikNo($tcKimlikNo, $ad, $soyad, $dogumYili)
    {
        if (!extension_loaded('soap')) {
            return ['isValid' => false, 'message' => 'SOAP eklentisi aktif değil.', 'nvi_response' => null];
        }

        $tcKimlikNo = (int)$tcKimlikNo; // NVİ int bekliyor
        $dogumYili = (int)$dogumYili;   // NVİ int bekliyor

        // NVİ büyük harf ve Türkçe karakterlere duyarlı olabilir.
        // BtkHelper içindeki btkCleanString benzeri bir fonksiyonla veya doğrudan mb_strtoupper ile
        $ad = $this->convertToNviFormat($ad);
        $soyad = $this->convertToNviFormat($soyad);

        $params = [
            'TCKimlikNo' => $tcKimlikNo,
            'Ad'         => $ad,
            'Soyad'      => $soyad,
            'DogumYili'  => $dogumYili,
        ];

        try {
            $client = new \SoapClient($this->tcknDogrulaWsdl, $this->soapOptions);
            $response = $client->TCKimlikNoDogrula($params);

            if (isset($response->TCKimlikNoDogrulaResult)) {
                $isValid = (bool)$response->TCKimlikNoDogrulaResult;
                $message = $isValid ? 'TCKN Doğrulandı.' : 'TCKN Doğrulanamadı. Bilgileri kontrol edin.';
                if ($this->helper) $this->helper->logMessage('DEBUG', __METHOD__, "TCKN: {$tcKimlikNo}, Sonuç: " . ($isValid ? 'Doğru' : 'Yanlış') . ", NVİ Yanıtı: " . print_r($response, true));
                return ['isValid' => $isValid, 'message' => $message, 'nvi_response' => $response];
            } else {
                if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, "TCKN: {$tcKimlikNo}, Hatalı NVİ yanıt formatı: " . print_r($response, true));
                return ['isValid' => false, 'message' => 'NVİ yanıt formatı hatalı.', 'nvi_response' => $response];
            }
        } catch (\SoapFault $e) {
            $errorMessage = "NVİ TCKN Doğrulama Servis Hatası: " . $e->getMessage();
            if ($this->helper) {
                $this->helper->logMessage('ERROR', __METHOD__, "TCKN: {$tcKimlikNo}, " . $errorMessage . (isset($client) ? " | İstek: " . $client->__getLastRequest() . " | Yanıt: " . $client->__getLastResponse() : ""));
            }
            return ['isValid' => false, 'message' => 'TCKN doğrulama servisine ulaşılamadı veya bir hata oluştu.', 'nvi_response' => $e->getMessage()];
        } catch (\Exception $e) {
            $errorMessage = "Genel Hata (TCKN Doğrulama): " . $e->getMessage();
             if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, "TCKN: {$tcKimlikNo}, " . $errorMessage);
            return ['isValid' => false, 'message' => 'TCKN doğrulaması sırasında genel bir hata oluştu.', 'nvi_response' => $e->getMessage()];
        }
    }

    /**
     * Yabancı Kimlik Numarası Doğrulama (NVİ servisi varsa)
     * NVİ'nin Yabancı Kimlik No doğrulama servisi public olmayabilir veya farklı parametreler gerektirebilir.
     * Bu fonksiyon, https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?op=YabanciKimlikNoDogrula
     * adresindeki operasyona göre yazılmıştır. Parametreler farklılık gösterebilir.
     *
     * @param int|string $kimlikNo Doğrulanacak Yabancı Kimlik Numarası
     * @param string $ad Kişinin adı
     * @param string $soyad Kişinin soyadı
     * @param int $dogumGun Gün (GG)
     * @param int $dogumAy Ay (AA)
     * @param int $dogumYil Yıl (YYYY)
     * @return array ['isValid' => bool, 'message' => string, 'nvi_response' => mixed]
     */
    public function validateYabanciKimlikNo($kimlikNo, $ad, $soyad, $dogumGun, $dogumAy, $dogumYil)
    {
        if (!extension_loaded('soap')) {
            return ['isValid' => false, 'message' => 'SOAP eklentisi aktif değil.', 'nvi_response' => null];
        }

        $kimlikNo = (int)$kimlikNo;
        $dogumGun = (int)$dogumGun;
        $dogumAy = (int)$dogumAy;
        $dogumYil = (int)$dogumYil;

        $ad = $this->convertToNviFormat($ad);
        $soyad = $this->convertToNviFormat($soyad);

        $params = [
            'KimlikNo' => $kimlikNo,
            'Ad'       => $ad,
            'Soyad'    => $soyad,
            'DogumGun' => $dogumGun,
            'DogumAy'  => $dogumAy,
            'DogumYil' => $dogumYil,
        ];

        try {
            $client = new \SoapClient($this->yabanciKimlikDogrulaWsdl, $this->soapOptions);
            $response = $client->YabanciKimlikNoDogrula($params);

            if (isset($response->YabanciKimlikNoDogrulaResult)) {
                $isValid = (bool)$response->YabanciKimlikNoDogrulaResult;
                $message = $isValid ? 'Yabancı Kimlik No Doğrulandı.' : 'Yabancı Kimlik No Doğrulanamadı. Bilgileri kontrol edin.';
                if ($this->helper) $this->helper->logMessage('DEBUG', __METHOD__, "YKN: {$kimlikNo}, Sonuç: " . ($isValid ? 'Doğru' : 'Yanlış') . ", NVİ Yanıtı: " . print_r($response, true));
                return ['isValid' => $isValid, 'message' => $message, 'nvi_response' => $response];
            } else {
                if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, "YKN: {$kimlikNo}, Hatalı NVİ yanıt formatı: " . print_r($response, true));
                return ['isValid' => false, 'message' => 'NVİ yanıt formatı hatalı.', 'nvi_response' => $response];
            }
        } catch (\SoapFault $e) {
            $errorMessage = "NVİ Yabancı Kimlik No Doğrulama Servis Hatası: " . $e->getMessage();
            if ($this->helper) {
                 $this->helper->logMessage('ERROR', __METHOD__, "YKN: {$kimlikNo}, " . $errorMessage . (isset($client) ? " | İstek: " . $client->__getLastRequest() . " | Yanıt: " . $client->__getLastResponse() : ""));
            }
            return ['isValid' => false, 'message' => 'Yabancı Kimlik No doğrulama servisine ulaşılamadı veya bir hata oluştu.', 'nvi_response' => $e->getMessage()];
        } catch (\Exception $e) {
             $errorMessage = "Genel Hata (Yabancı Kimlik Doğrulama): " . $e->getMessage();
             if ($this->helper) $this->helper->logMessage('ERROR', __METHOD__, "YKN: {$kimlikNo}, " . $errorMessage);
            return ['isValid' => false, 'message' => 'Yabancı Kimlik No doğrulaması sırasında genel bir hata oluştu.', 'nvi_response' => $e->getMessage()];
        }
    }

    /**
     * NVİ'nin beklediği büyük harf ve Türkçe karakter dönüşümlerini yapar.
     * (I -> I, i -> İ, ç -> Ç, ş -> Ş, ğ -> Ğ, ü -> Ü, ö -> Ö)
     *
     * @param string $string
     * @return string
     */
    private function convertToNviFormat($string)
    {
        if (is_null($string)) return '';
        $string = trim((string)$string);
        
        // Küçük harfleri NVİ'nin beklediği büyük harflere çevir
        $search  = array('ı', 'i', 'ğ', 'ü', 'ş', 'ö', 'ç');
        $replace = array('I', 'İ', 'Ğ', 'Ü', 'Ş', 'Ö', 'Ç'); // i -> İ, ı -> I
        $string  = str_replace($search, $replace, $string);
        
        return mb_strtoupper($string, 'UTF-8'); // Genel olarak büyük harfe çevir (UTF-8 güvenli)
    }

} // End of NviSoapClient class

// --- BÖLÜM 1 / 1 SONU - (NviSoapClient.php, NVİ KPS SOAP Servis İstemcisi)
?>