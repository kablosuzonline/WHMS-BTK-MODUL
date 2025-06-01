<?php
/**
 * WHMCS BTK Raporlama Modülü - NVI SOAP İstemcisi - V2.0.1 - Beta
 *
 * T.C. Kimlik Numarası ve Yabancı Kimlik Numarası doğrulaması için
 * NVI (Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü) KPS (Kimlik Paylaşım Sistemi)
 * SOAP servisleriyle iletişim kurar.
 *
 * @see https://kpsv2.nvi.gov.tr/Services/Wsdl.aspx?Service=KisiSorgulaTCKimlikNoServis
 * @see https://kpsv2.nvi.gov.tr/Services/Wsdl.aspx?Service=YabanciKimlikNoDogrulaServis
 */

namespace WHMCS\Module\Addon\BtKReports\Lib;

class NviSoapClient {

    /**
     * T.C. Kimlik Numarası doğrulama servisi için WSDL adresi.
     * @var string
     */
    private $tcKimlikNoServisUrl = 'https://kpsv2.nvi.gov.tr/Services/Wsdl.aspx?Service=KisiSorgulaTCKimlikNoServis';
    // Eski servis adresi (bazen sorun çıkarabiliyor, yenisi tercih edilmeli):
    // private $tcKimlikNoServisUrl = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';


    /**
     * Yabancı Kimlik Numarası doğrulama servisi için WSDL adresi.
     * Not: Bu servis genellikle özel erişim veya farklı bir entegrasyon gerektirebilir.
     * Bu örnekte temel bir yapı sunulmuştur, gerçek kullanımı için NVI ile görüşülmelidir.
     * @var string
     */
    private $yabanciKimlikNoServisUrl = 'https://kpsv2.nvi.gov.tr/Services/Wsdl.aspx?Service=YabanciKimlikNoDogrulaServis';


    /**
     * SOAP istemcisi için genel ayarlar.
     * @var array
     */
    private $soapClientOptions = [
        'trace' => 1, // Hata ayıklama için trace'i etkinleştir
        'exceptions' => true, // SOAP hatalarını exception olarak yakala
        'connection_timeout' => 10, // Bağlantı zaman aşımı (saniye)
        'cache_wsdl' => WSDL_CACHE_NONE, // WSDL cache'lemeyi devre dışı bırak (geliştirme için)
                                         // Canlıda WSDL_CACHE_BOTH veya WSDL_CACHE_DISK kullanılabilir.
        'stream_context' => null // SSL/TLS ayarları için gerekirse
    ];

    public function __construct() {
        // SSL/TLS sertifika doğrulama sorunlarını aşmak için (güvenlik riski oluşturabilir, dikkatli kullanılmalı)
        // Genellikle sunucunuzda güncel CA sertifikaları varsa bu ayarlara gerek kalmaz.
        $this->soapClientOptions['stream_context'] = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true // Kendi kendine imzalı sertifikalara izin ver (yerel testler için)
            ]
        ]);
    }

    /**
     * T.C. Kimlik Numarası doğrulaması yapar.
     *
     * @param int|string $TCKimlikNo Doğrulanacak T.C. Kimlik Numarası.
     * @param string $Ad Kişinin adı (Büyük harflerle).
     * @param string $Soyad Kişinin soyadı (Büyük harflerle).
     * @param int $DogumYili Kişinin doğum yılı (YYYY formatında).
     * @return bool Doğrulama sonucu (true veya false).
     */
    public function TCKimlikNoDogrula($TCKimlikNo, $Ad, $Soyad, $DogumYili) {
        // Parametreleri NVI servisinin beklediği şekilde hazırla
        $params = [
            'TCKimlikNo' => (int)$TCKimlikNo, // NVI long bekliyor
            'Ad'         => mb_strtoupper($Ad, 'UTF-8'),
            'Soyad'      => mb_strtoupper($Soyad, 'UTF-8'),
            'DogumYili'  => (int)$DogumYili,
        ];

        try {
            $client = new \SoapClient($this->tcKimlikNoServisUrl, $this->soapClientOptions);
            $result = $client->TCKimlikNoDogrula($params);

            if (isset($result->TCKimlikNoDogrulaResult)) {
                return (bool)$result->TCKimlikNoDogrulaResult;
            }
            return false;
        } catch (\SoapFault $sf) {
            // SOAP hatasını logla veya yönet
            if(function_exists('btk_log_module_action')) {
                 btk_log_module_action('NVI TCKN Doğrulama SOAP Hatası', 'NVI_ERROR', [
                    'tc_kimlik_no' => $TCKimlikNo,
                    'fault_code' => $sf->faultcode,
                    'fault_string' => $sf->faultstring,
                    'detail' => isset($sf->detail) ? (is_string($sf->detail) ? $sf->detail : json_encode($sf->detail)) : ''
                ]);
            }
            return false;
        } catch (\Exception $e) {
            // Diğer genel hatalar
             if(function_exists('btk_log_module_action')) {
                btk_log_module_action('NVI TCKN Doğrulama Genel Hata', 'NVI_ERROR', [
                    'tc_kimlik_no' => $TCKimlikNo,
                    'error_message' => $e->getMessage()
                ]);
            }
            return false;
        }
    }

    /**
     * Yabancı Kimlik Numarası doğrulaması yapar.
     * DİKKAT: Bu fonksiyonun NVI tarafından sağlanan güncel Yabancı Kimlik No servisine
     * ve beklediği parametrelere göre güncellenmesi gerekebilir.
     *
     * @param int|string $YabanciKimlikNo Doğrulanacak Yabancı Kimlik Numarası.
     * @param string $Ad Kişinin adı (Büyük harflerle).
     * @param string $Soyad Kişinin soyadı (Büyük harflerle).
     * @param int $DogumGun Kişinin doğum günü (DD).
     * @param int $DogumAy Kişinin doğum ayı (MM).
     * @param int $DogumYil Kişinin doğum yılı (YYYY).
     * @return bool Doğrulama sonucu (true veya false).
     */
    public function YabanciKimlikNoDogrula($YabanciKimlikNo, $Ad, $Soyad, $DogumGun, $DogumAy, $DogumYil) {
         // NVI'nın Yabancı Kimlik servisi için beklediği parametreler değişebilir.
         // Bu örnek, genel bir yapı sunar.
        $params = [
            'KimlikNo' => (int)$YabanciKimlikNo, // Servis parametre adına göre güncellenmeli
            'Ad'       => mb_strtoupper($Ad, 'UTF-8'),
            'Soyad'    => mb_strtoupper($Soyad, 'UTF-8'),
            'DogumGun' => (int)$DogumGun,
            'DogumAy'  => (int)$DogumAy,
            'DogumYil' => (int)$DogumYil,
        ];

        try {
            // Bu servis adresi ve metod adı NVI tarafından sağlanan güncel bilgilere göre doğrulanmalıdır.
            // $client = new \SoapClient($this->yabanciKimlikNoServisUrl, $this->soapClientOptions);
            // $result = $client->YabanciKimlikNoDogrula($params); // Metod adı farklı olabilir

            // if (isset($result->YabanciKimlikNoDogrulaResult)) {
            //     return (bool)$result->YabanciKimlikNoDogrulaResult;
            // }
            
            // Şimdilik YKN doğrulama fonksiyonu aktif değil, her zaman false döndür.
            if(function_exists('btk_log_module_action')) {
                 btk_log_module_action('NVI YKN Doğrulama: Fonksiyon henüz aktif değil veya servis URL/metodu güncel değil.', 'NVI_INFO', ['ykn' => $YabanciKimlikNo]);
            }
            return false;

        } catch (\SoapFault $sf) {
             if(function_exists('btk_log_module_action')) {
                 btk_log_module_action('NVI YKN Doğrulama SOAP Hatası', 'NVI_ERROR', [
                    'ykn' => $YabanciKimlikNo,
                    'fault_code' => $sf->faultcode,
                    'fault_string' => $sf->faultstring
                ]);
            }
            return false;
        } catch (\Exception $e) {
             if(function_exists('btk_log_module_action')) {
                btk_log_module_action('NVI YKN Doğrulama Genel Hata', 'NVI_ERROR', [
                    'ykn' => $YabanciKimlikNo,
                    'error_message' => $e->getMessage()
                ]);
            }
            return false;
        }
    }
}

?>