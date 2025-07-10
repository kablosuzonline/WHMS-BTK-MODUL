<?php
/**
 * Kimlik Doğrulama Yöneticisi (Strateji Yöneticisi)
 *
 * Ayarlara veya talebe göre hangi kimlik doğrulama stratejisinin (SOAP, REST, vb.)
 * kullanılacağını belirler ve işlemi o strateji üzerinden yürütür.
 * Bu yapı, gelecekte yeni doğrulama yöntemleri eklendiğinde modülün
 * çekirdek kodunu değiştirmeden genişletilebilmesini sağlar.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2
 */

namespace BtkReports\Verifier;

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
     * @param string $verifierType Kullanılacak doğrulayıcının türü (örn: 'nvi_soap', 'nvi_rest').
     * @param bool $isEnabled Doğrulama özelliğinin genel olarak açık olup olmadığını belirtir.
     */
    public function __construct(string $verifierType, bool $isEnabled)
    {
        // Eğer özellik ayarlardan tamamen kapatılmışsa, hiçbir kontrol yapmadan
        // her zaman "atlandı/başarılı" sonucu dönecek olan NullVerifier'ı kullan.
        if (!$isEnabled) {
            $this->verifier = new NullVerifier();
            return;
        }

        // Özellik açıksa, hangi stratejinin kullanılacağını seç.
        switch (strtolower($verifierType)) {
            case 'nvi_soap':
                $this->verifier = new NviSoapVerifier();
                break;
            
            // Gelecekte eklenecek yeni doğrulama yöntemleri buraya eklenebilir.
            // case 'nvi_rest':
            //     $this->verifier = new NviRestVerifier();
            //     break;

            default:
                // Bilinmeyen bir tür istenirse veya bir hata olursa, güvenli modda kal
                // ve işlemi atlayacak olan NullVerifier'ı kullan.
                $this->verifier = new NullVerifier();
                break;
        }
    }

    /**
     * Seçilen strateji üzerinden kimlik doğrulama işlemini yürütür.
     * Modülün diğer kısımları, arka planda hangi doğrulayıcının çalıştığını bilmeden
     * sadece bu metodu çağırır.
     *
     * @param array $data Doğrulanacak verileri içeren dizi. 
     *                    Örn: ['tckn' => ..., 'ad' => ..., 'soyad' => ..., 'dogum_yili' => ...]
     * @return VerificationResult Doğrulama sonucunu içeren bir nesne.
     */
    public function execute(array $data): VerificationResult
    {
        return $this->verifier->verify($data);
    }
}
?>