<?php
/**
 * Kimlik Doğrulama Arayüzü (Interface)
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu arayüz, modül içinde kullanılacak olan tüm kimlik doğrulama
 * stratejilerinin (NVI SOAP, KPS v3 REST, Null Verifier vb.) uyması gereken
 * zorunlu metodları tanımlar. Bu sayede, IdentityVerificationManager, hangi
 * stratejiyi kullanırsa kullansın, `verify` metodunu çağırabileceğinden
 * emin olur.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Verifier;

interface IdentityVerifierInterface
{
    /**
     * Verilen kimlik bilgilerini kullanarak doğrulama işlemini gerçekleştirir.
     *
     * Bu metod, somut sınıflar (örn: NviSoapVerifier) tarafından, kendi
     * spesifik teknolojilerine (SOAP, REST vb.) göre uygulanmalıdır.
     * Her durumda, bir VerificationResult nesnesi döndürmelidir.
     *
     * @param array $data Doğrulanacak verileri içeren bir dizi.
     *                    Örn: ['tckn' => ..., 'ad' => ..., 'soyad' => ..., 'dogum_tarihi' => 'YYYYAAGG']
     *
     * @return VerificationResult Doğrulama işleminin sonucunu, durumunu ve
     *                            kullanıcıya gösterilecek mesajı içeren bir nesne.
     */
    public function verify(array $data): VerificationResult;
}