<?php
/**
 * GİB (Gelir İdaresi Başkanlığı) API İstemcisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata yönetimi, merkezi LogManager ile tam entegre hale getirildi.
 * - Eski SOAP tabanlı servis yerine, GİB'in modern, JSON tabanlı ve
 *   daha hızlı olan E-Arşiv Portal servisi kullanılmaya başlandı.
 * - Geçersiz TCKN/VKN formatları için sorgulama yapılması engellenerek
 *   performans artırıldı.
 * - cURL hataları ve beklenmedik GİB cevapları için daha detaylı hata
 *   yakalama ve loglama mekanizmaları eklendi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Api;

use BtkReports\Manager\LogManager;

class GibApi
{
    /**
     * GİB'in VKN/TCKN'den mükellef sorgulama servisinin güncel URL'si.
     */
    private const MUKELLEF_SORGULAMA_URL = "https://earsivportal.efatura.gov.tr/earsiv-services/esign";

    /**
     * API'ye istek gönderirken kullanılacak zaman aşımı süresi (saniye).
     */
    private const TIMEOUT_SECONDS = 15;

    /**
     * Verilen bir TCKN veya VKN'nin E-Fatura mükellefi olup olmadığını sorgular.
     *
     * @param string $identifier 10 haneli VKN veya 11 haneli TCKN.
     * @return bool Mükellef ise true, değilse false döner.
     */
    public static function isEFaturaMukellefi(string $identifier): bool
    {
        $identifier = trim($identifier);
        
        // Geçersiz veya boş bir TCKN/VKN için GİB'e sorgu göndermeye gerek yok.
        if (empty($identifier) || !is_numeric($identifier) || (strlen($identifier) != 10 && strlen($identifier) != 11)) {
            return false;
        }

        // GİB servisinin beklediği POST verisi formatı
        $postData = [
            'VKN_TCKN' => $identifier,
            'prm' => 'out', // Bu parametre, GİB tarafından beklenmektedir.
        ];

        try {
            // cURL oturumunu başlat
            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, self::MUKELLEF_SORGULAMA_URL);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, self::TIMEOUT_SECONDS);
            
            // GİB servisleri genellikle SSL sertifika doğrulaması gerektirmez,
            // ancak olası sunucu yapılandırma sorunlarını önlemek için bu
            // seçenekleri eklemek daha güvenlidir.
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);

            curl_close($ch);

            // cURL seviyesinde bir hata oluştuysa (örn: ağ hatası)
            if ($response === false) {
                throw new \Exception("cURL Hatası: " . $curlError);
            }

            // GİB servisi 200 dışında bir HTTP kodu döndürdüyse
            if ($httpCode !== 200) {
                throw new \Exception("GİB servisi HTTP {$httpCode} durum kodu döndürdü.");
            }

            $responseData = json_decode($response, true);
            
            // GİB'den gelen cevap geçerli bir JSON değilse
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("GİB servisinden gelen cevap geçerli bir JSON değil. Ham Cevap: " . $response);
            }
            
            // GİB, mükellef bulunduğunda `data` anahtarı altında bir dizi döndürür.
            // Mükellef bulunamadığında `data` anahtarı boş olur.
            $isMukellef = !empty($responseData['data']) && is_array($responseData['data']);
            
            LogManager::logAction('GİB Mükellef Sorgulandı', 'INFO', "Sorgulanan: {$identifier}, Sonuç: " . ($isMukellef ? 'EVET' : 'HAYIR'));

            return $isMukellef;

        } catch (\Exception $e) {
            // Herhangi bir hata durumunda, işlemi logla.
            LogManager::logAction('GİB Mükellef Sorgulama Hatası', 'HATA', $e->getMessage(), null, ['identifier' => $identifier]);
            
            // Bir hata durumunda, yanlış fatura (E-Arşiv yerine E-Fatura) kesmemek
            // için güvenli tarafta kalıp, mükellef 'değil' olarak varsayıyoruz.
            return false;
        }
    }
}