<?php
/**
 * Kimlik Doğrulayıcı Arayüzü (Identity Verifier Interface)
 *
 * Bu arayüz, modül içindeki tüm kimlik doğrulama stratejilerinin (NVI SOAP,
 * NVI REST, Pasif/Boş Doğrulayıcı vb.) uyması gereken ortak metotları
 * ve "sözleşmeyi" tanımlar.
 *
 * Bir sınıf bu arayüzü "implements" ettiğinde, verify() metodunu
 * mutlaka kendi içinde tanımlamak zorundadır. Bu, kod tutarlılığını
 * ve polimorfizmi sağlar.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.0.3
 */

namespace BtkReports\Verifier;

interface IdentityVerifierInterface
{
    /**
     * Verilen kişisel bilgileri kullanarak kimlik doğrulama işlemini gerçekleştirir.
     *
     * @param array $data Doğrulanacak verileri içeren bir dizi.
     *                    Zorunlu anahtarlar duruma göre değişebilir, ancak genellikle şunları içerir:
     *                    ['tckn', 'ad', 'soyad', 'dogum_yili'] veya
     *                    ['tckn', 'ad', 'soyad', 'dogum_gun', 'dogum_ay', 'dogum_yil']
     *
     * @return VerificationResult Doğrulama işleminin sonucunu, durumunu ve mesajını
     *                            içeren bir VerificationResult nesnesi döndürmelidir.
     */
    public function verify(array $data): VerificationResult;
}
?>