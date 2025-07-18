<?php
/**
 * Kimlik Doğrulama Sonucu Veri Nesnesi (DTO)
 *
 * Bu sınıf, kimlik doğrulama işlemlerinden dönen sonucu (başarı durumu,
 * NVI durumu ve mesaj) standart bir yapıda tutmak için kullanılır.
 * Bu, farklı doğrulama stratejilerinden gelen sonuçların tutarlı bir
 * şekilde işlenmesini sağlar.
 * PHP 8.0+ readonly özellikleri ile değiştirilemez (immutable) hale getirilmiştir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.0.3
 */

namespace BtkReports\Verifier;

class VerificationResult
{
    /**
     * Doğrulamanın detaylı durumu.
     * Örnekler: 'Dogrulandi', 'Dogrulanamadi', 'Hata', 'Kapali', 'GecersizTCKN'
     * @var string
     */
    public readonly string $status;

    /**
     * Doğrulama işleminin teknik olarak başarılı olup olmadığı.
     * (Örn: SOAP hatası alınırsa false, NVI "bilgiler yanlış" derse yine de true dönebilir)
     * @var bool
     */
    public readonly bool $isSuccess;

    /**
     * Kullanıcıya veya log'a gösterilecek olan açıklayıcı mesaj.
     * @var string
     */
    public readonly string $message;

    /**
     * VerificationResult constructor.
     *
     * @param string $status Doğrulamanın detaylı durumu.
     * @param bool $isSuccess İşlemin teknik başarı durumu.
     * @param string $message Sonuçla ilgili açıklayıcı mesaj.
     */
    public function __construct(string $status, bool $isSuccess, string $message)
    {
        $this->status = $status;
        $this->isSuccess = $isSuccess;
        $this->message = $message;
    }
}
?>