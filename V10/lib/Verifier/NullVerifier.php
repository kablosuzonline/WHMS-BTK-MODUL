<?php
/**
 * Boş/Pasif Kimlik Doğrulayıcı Stratejisi (Null Object Pattern)
 *
 * Bu sınıf, kimlik doğrulama özelliği ayarlardan kapatıldığında veya
 * bir hata durumunda güvenli mod olarak kullanılır.
 *
 * Herhangi bir dış servise bağlanmaz, her zaman işlemin "atlandığını"
 * belirten başarılı bir sonuç döndürür. Bu, kodun diğer kısımlarında
 * sürekli olarak "doğrulama aktif mi?" kontrolü yapılmasını önler.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.2.0
 */

namespace BtkReports\Verifier;

class NullVerifier implements IdentityVerifierInterface
{
    /**
     * Doğrulama işlemini "atlayarak" gerçekleştirir.
     *
     * @param array $data Doğrulama verileri (bu sınıfta kullanılmaz).
     * @return VerificationResult Her zaman doğrulamanın kapalı olduğunu belirten bir sonuç nesnesi.
     */
    public function verify(array $data): VerificationResult
    {
        // Herhangi bir işlem yapma, sadece işlemin başarıyla atlandığını bildir.
        // 'isSuccess' true'dur çünkü doğrulama süreci bir hatayla kesilmemiştir,
        // bilinçli olarak pas geçilmiştir.
        return new VerificationResult(
            'Kapali', 
            true, 
            'Kimlik doğrulama ayarı kapalı olduğu için bu adım atlandı.'
        );
    }
}
?>