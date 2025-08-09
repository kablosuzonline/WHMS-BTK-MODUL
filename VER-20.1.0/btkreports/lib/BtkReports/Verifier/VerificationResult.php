<?php
/**
 * Kimlik Doğrulama Sonuç Nesnesi (Value Object)
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, bir kimlik doğrulama işleminin sonucunu taşımak için kullanılır.
 * Durum, başarı bilgisi ve kullanıcıya gösterilecek mesaj gibi verileri
 * bir arada tutarak, doğrulama stratejilerinden (NviSoapVerifier, NullVerifier vb.)
 * dönen cevabı standartlaştırır. "Value Object" tasarım deseninin bir
 * uygulamasıdır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Verifier;

class VerificationResult
{
    /**
     * İşlemin durumu (Örn: 'Dogrulandi', 'Dogrulanamadi', 'Hata', 'Atlandi').
     * @var string
     */
    public string $status;

    /**
     * İşlemin başarılı olup olmadığını belirten boolean değer.
     * @var bool
     */
    public bool $isSuccess;

    /**
     * Kullanıcı arayüzünde gösterilecek olan bilgilendirme mesajı.
     * @var string
     */
    public string $message;

    /**
     * VerificationResult constructor.
     *
     * @param string $status İşlemin durumu.
     * @param bool $isSuccess İşlemin başarılı olup olmadığı.
     * @param string $message Kullanıcıya gösterilecek mesaj.
     */
    public function __construct(string $status, bool $isSuccess, string $message)
    {
        $this->status = $status;
        $this->isSuccess = $isSuccess;
        $this->message = $message;
    }
}