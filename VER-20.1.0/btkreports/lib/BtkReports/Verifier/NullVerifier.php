<?php
/**
 * Boş Kimlik Doğrulama Stratejisi (Null Object Pattern)
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, IdentityVerifierInterface'i uygular ancak hiçbir doğrulama
 * işlemi yapmaz. Amacı, NVI KPS ayarları yapılmadığında veya özellik
 * devre dışı bırakıldığında, sistemin çökmesini engellemek ve "doğrulama
 * atlandı" şeklinde güvenli bir cevap döndürmektir.
 * "Null Object" tasarım deseninin bir uygulamasıdır.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Verifier;

use BtkReports\Helper\BtkHelper;

class NullVerifier implements IdentityVerifierInterface
{
    /**
     * Herhangi bir doğrulama işlemi yapmaz ve her zaman "Atlandı"
     * durumunda bir sonuç döndürür.
     *
     * @param array $data Doğrulanacak verileri içeren dizi (bu sınıf tarafından kullanılmaz).
     * @return VerificationResult Doğrulama işleminin atlandığını belirten sonuç nesnesi.
     */
    public function verify(array $data): VerificationResult
    {
        return new VerificationResult(
            'Atlandi',
            false,
            BtkHelper::getLang('nviVerificationSkipped')
        );
    }
}