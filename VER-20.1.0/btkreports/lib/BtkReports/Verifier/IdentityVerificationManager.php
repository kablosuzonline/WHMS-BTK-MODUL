<?php
/**
 * Kimlik Doğrulama Yöneticisi (Strateji Yöneticisi)
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Ayarlara veya talebe göre hangi kimlik doğrulama stratejisinin (SOAP, REST, vb.)
 * kullanılacağını belirler ve işlemi o strateji üzerinden yürütür.
 * "Strategy" tasarım desenini uygular. Test/Canlı modunu destekler.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Verifier;

use BtkReports\Helper\BtkHelper;

class IdentityVerificationManager
{
    /**
     * Kullanılacak olan somut doğrulama stratejisi nesnesini tutar.
     * @var IdentityVerifierInterface
     */
    private IdentityVerifierInterface $verifier;

    /**
     * IdentityVerificationManager constructor.
     *
     * @param array $settings Modül ayarları.
     */
    public function __construct(array $settings)
    {
        // Gerekli KPS ayarlarının olup olmadığını kontrol et.
        $kpsUser = $settings['nviKpsUser'] ?? '';
        $kpsPass = $settings['nviKpsPass'] ?? null;
        $isEnabled = !empty($kpsUser) && !empty($kpsPass);

        if (!$isEnabled) {
            // Ayarlar boş ise, hiçbir şey yapmayan NullVerifier'ı kullan.
            // Bu, özelliğin tamamen kapalı olduğu anlamına gelir.
            $this->verifier = new NullVerifier();
            return;
        }

        // Ayarlar doluysa, Test/Canlı moduna göre doğru doğrulayıcıyı oluştur.
        $isTestMode = BtkHelper::isNviKpsTestMode();
        
        $this->verifier = new NviSoapVerifier($kpsUser, $kpsPass, $isTestMode);
    }

    /**
     * Seçilen strateji üzerinden kimlik doğrulama işlemini yürütür.
     *
     * @param array $data Doğrulanacak verileri içeren dizi. 
     *                    Örn: ['tckn' => ..., 'ad' => ..., 'soyad' => ..., 'dogum_tarihi' => 'YYYYAAGG']
     * @return VerificationResult Doğrulama sonucunu içeren bir nesne.
     */
    public function execute(array $data): VerificationResult
    {
        return $this->verifier->verify($data);
    }
}