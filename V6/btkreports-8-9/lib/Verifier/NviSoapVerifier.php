<?php
/**
 * NVI SOAP Servisi ile Kimlik Doğrulama Stratejisi
 *
 * IdentityVerifierInterface'i uygulayarak, NVI'nin resmi TCKimlik.NVI.gov.tr
 * SOAP web servisleri üzerinden TCKN ve YKN doğrulaması yapar.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    8.0.3
 */

namespace BtkReports\Verifier;

use BtkReports\Helper\BtkHelper;

class NviSoapVerifier implements IdentityVerifierInterface
{
    private const TCKN_SOAP_URL = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL";
    private const YKN_SOAP_URL = "https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL";
    private const TIMEOUT_SECONDS = 15;

    /**
     * Verilen veriye göre TCKN veya YKN doğrulama metodunu çağırır.
     *
     * @param array $data Doğrulanacak veriler.
     * @return VerificationResult Doğrulama sonucu.
     */
    public function verify(array $data): VerificationResult
    {
        $kimlikNo = preg_replace('/[^0-9]/', '', (string)($data['tckn'] ?? ''));

        if (strlen($kimlikNo) !== 11) {
            return new VerificationResult('GecersizTCKN', false, 'Kimlik numarası 11 haneli olmalıdır.');
        }

        // 99 ile başlayanlar Yabancı Kimlik Numarasıdır.
        if (strpos($kimlikNo, '99') === 0) {
            return $this->verifyYabanciKimlikNo($data);
        }

        return $this->verifyTcKimlikNo($data);
    }

    /**
     * T.C. Kimlik Numarasını doğrular.
     *
     * @param array $data ['tckn', 'ad', 'soyad', 'dogum_yili']
     * @return VerificationResult
     */
    private function verifyTcKimlikNo(array $data): VerificationResult
    {
        try {
            $tcKimlikNo = (int)($data['tckn'] ?? 0);
            $ad = self::formatName($data['ad'] ?? '');
            $soyad = self::formatName($data['soyad'] ?? '');
            $dogumYili = (int)($data['dogum_yili'] ?? 0);

            if (empty($tcKimlikNo) || empty($ad) || empty($soyad) || empty($dogumYili)) {
                return new VerificationResult('GecersizTCKN', false, 'TCKN, Ad, Soyad ve Doğum Yılı alanları zorunludur.');
            }

            $client = $this->getSoapClient(self::TCKN_SOAP_URL);

            $params = [
                'TCKimlikNo' => $tcKimlikNo,
                'Ad' => $ad,
                'Soyad' => $soyad,
                'DogumYili' => $dogumYili
            ];
            
            $resultObject = $client->__soapCall('TCKimlikNoDogrula', ['parameters' => $params]);
            
            if (isset($resultObject->TCKimlikNoDogrulaResult) && $resultObject->TCKimlikNoDogrulaResult === true) {
                return new VerificationResult('Dogrulandi', true, 'T.C. Kimlik Numarası başarıyla doğrulandı.');
            }
            
            return new VerificationResult('Dogrulanamadi', false, 'Girilen T.C. Kimlik No bilgileri NVI tarafından doğrulanamadı.');

        } catch (\SoapFault $sf) {
            BtkHelper::logAction('NVI SOAP Hatası (TCKN)', 'HATA', $sf->getMessage());
            return new VerificationResult('Hata', false, 'NVI servisine ulaşılamadı (SOAP Hatası). Lütfen daha sonra tekrar deneyin.');
        } catch (\Exception $e) {
            BtkHelper::logAction('NVI Genel Hata (TCKN)', 'HATA', $e->getMessage());
            return new VerificationResult('Hata', false, 'Kimlik doğrulama sırasında beklenmedik bir hata oluştu.');
        }
    }
    
    /**
     * Yabancı Kimlik Numarasını doğrular.
     *
     * @param array $data ['tckn', 'ad', 'soyad', 'dogum_gun', 'dogum_ay', 'dogum_yil']
     * @return VerificationResult
     */
    private function verifyYabanciKimlikNo(array $data): VerificationResult
    {
        // YKN için tam doğum tarihi gereklidir. Bu veri yoksa doğrulama yapılamaz.
        if (!isset($data['dogum_gun'], $data['dogum_ay'], $data['dogum_yil'])) {
            return new VerificationResult('Hata', false, 'Yabancı Kimlik No doğrulaması için tam doğum tarihi (Gün, Ay, Yıl) gereklidir.');
        }

        try {
            $kimlikNo = (int)($data['tckn'] ?? 0);
            $ad = self::formatName($data['ad'] ?? '');
            $soyad = self::formatName($data['soyad'] ?? '');
            $dogumGun = (int)($data['dogum_gun'] ?? 0);
            $dogumAy = (int)($data['dogum_ay'] ?? 0);
            $dogumYil = (int)($data['dogum_yil'] ?? 0);

            if (empty($kimlikNo) || empty($ad) || empty($soyad) || empty($dogumGun) || empty($dogumAy) || empty($dogumYil)) {
                return new VerificationResult('GecersizTCKN', false, 'YKN, Ad, Soyad ve tam Doğum Tarihi alanları zorunludur.');
            }
            
            $client = $this->getSoapClient(self::YKN_SOAP_URL);

            $params = [
                'KimlikNo' => $kimlikNo,
                'Ad' => $ad,
                'Soyad' => $soyad,
                'DogumGun' => $dogumGun,
                'DogumAy' => $dogumAy,
                'DogumYil' => $dogumYil
            ];

            $resultObject = $client->__soapCall('YabanciKimlikNoDogrula', ['parameters' => $params]);

            if (isset($resultObject->YabanciKimlikNoDogrulaResult) && $resultObject->YabanciKimlikNoDogrulaResult === true) {
                return new VerificationResult('Dogrulandi', true, 'Yabancı Kimlik Numarası başarıyla doğrulandı.');
            }

            return new VerificationResult('Dogrulanamadi', false, 'Girilen Yabancı Kimlik No bilgileri NVI tarafından doğrulanamadı.');
            
        } catch (\SoapFault $sf) {
            BtkHelper::logAction('NVI SOAP Hatası (YKN)', 'HATA', $sf->getMessage());
            return new VerificationResult('Hata', false, 'NVI Yabancı Kimlik servisine ulaşılamadı (SOAP Hatası).');
        } catch (\Exception $e) {
            BtkHelper::logAction('NVI Genel Hata (YKN)', 'HATA', $e->getMessage());
            return new VerificationResult('Hata', false, 'Yabancı kimlik doğrulama sırasında beklenmedik bir hata oluştu.');
        }
    }

    /**
     * Güvenli bir SOAP istemcisi oluşturur.
     *
     * @param string $wsdlUrl
     * @return \SoapClient
     * @throws \Exception SOAP eklentisi yüklü değilse veya istemci oluşturulamazsa.
     */
    private function getSoapClient(string $wsdlUrl): \SoapClient
    {
        if (!extension_loaded('soap')) {
            throw new \Exception("Sunucuda PHP SOAP eklentisi yüklü veya etkin değil.");
        }
        
        return new \SoapClient($wsdlUrl, [
            'trace' => false,
            'exceptions' => true,
            'connection_timeout' => self::TIMEOUT_SECONDS,
            'cache_wsdl' => WSDL_CACHE_NONE,
            'keep_alive' => false,
            'stream_context' => stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                    'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT
                ]
            ])
        ]);
    }

    /**
     * Ad ve Soyadları NVI'nın beklediği formata (büyük harf, Türkçe karakterler) dönüştürür.
     *
     * @param string $name
     * @return string
     */
    private static function formatName(string $name): string
    {
        $name = trim($name);
        $tr_upper_map = [
            'i' => 'İ', 'ı' => 'I', 'ü' => 'Ü', 'ğ' => 'Ğ',
            'ş' => 'Ş', 'ö' => 'Ö', 'ç' => 'Ç'
        ];
        $name = str_replace(array_keys($tr_upper_map), array_values($tr_upper_map), $name);
        return mb_strtoupper($name, 'UTF-8');
    }
}
?>