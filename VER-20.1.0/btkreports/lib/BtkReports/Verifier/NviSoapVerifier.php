<?php
/**
 * NVI KPS v2 SOAP Servisi ile Kimlik Doğrulama Stratejisi
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * IdentityVerifierInterface'i uygulayarak, NVI'nin modern KPS v2
 * web servisleri üzerinden TCKN doğrulaması yapar. Bu işlem, önce
 * STS'den bir SAML token almayı ve ardından bu token'ı WS-Security
 * başlıklarıyla KPS servisine göndermeyi içerir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Verifier;

use BtkReports\Manager\LogManager;
use BtkReports\Helper\BtkHelper;
use RobRichards\WsePhp\WSSESoap;
use RobRichards\XMLSecLibs\XMLSecurityKey;

class NviSoapVerifier implements IdentityVerifierInterface
{
    private const KPS_V2_TEST_URL = "https://kpsbasvuru.nvi.gov.tr/Services/Tubitak/T%C3%BCmK%C3%BCt%C3%BCkSorgula.svc";
    private const KPS_V2_LIVE_URL = "https://kps.nvi.gov.tr/Services/Tubitak/T%C3%BCmK%C3%BCt%C3%BCkSorgula.svc";
    private const TIMEOUT_SECONDS = 45;
    
    private string $kpsUrl;
    private string $kpsUser;
    private string $kpsPass;
    private bool $isTestMode;

    /**
     * NviSoapVerifier constructor.
     */
    public function __construct(string $kpsUser, string $kpsPass, bool $isTestMode = true)
    {
        $this->kpsUser = $kpsUser;
        $this->kpsPass = $kpsPass;
        $this->isTestMode = $isTestMode;
        $this->kpsUrl = $isTestMode ? self::KPS_V2_TEST_URL : self::KPS_V2_LIVE_URL;
    }

    /**
     * Verilen kimlik bilgilerini KPS v2 üzerinden doğrular.
     */
    public function verify(array $data): VerificationResult
    {
        LogManager::logAction('NVI KPS Sorgulama Denemesi', 'UYARI', "TCKN: {$data['tckn']} için doğrulama başlatıldı.");
        try {
            $stsClient = new NviStsClient($this->kpsUser, $this->kpsPass, $this->isTestMode);
            $samlToken = $stsClient->requestSecurityToken();
            $soapClient = $this->createSecureSoapClient($samlToken);
            $params = $this->prepareKpsParameters($data);
            $resultObject = $soapClient->__soapCall('Sorgula', [$params]);
            return $this->parseKpsResponse($resultObject);
        } catch (\SoapFault $sf) {
            LogManager::logAction('KPS v2 SOAP Hatası', 'HATA', $sf->getMessage(), null, ['request' => $data]);
            return new VerificationResult('Hata', false, BtkHelper::getLang('nviVerificationError'));
        } catch (\Exception $e) {
            LogManager::logAction('KPS v2 Genel Hata', 'HATA', $e->getMessage(), null, ['request' => $data]);
            return new VerificationResult('Hata', false, 'Kimlik doğrulama sırasında beklenmedik bir hata oluştu: ' . $e->getMessage());
        }
    }

    private function createSecureSoapClient(\DOMElement $samlToken): \SoapClient
    {
        $options = [
            'trace' => 1,
            'exceptions' => true,
            'connection_timeout' => self::TIMEOUT_SECONDS,
            'cache_wsdl' => WSDL_CACHE_NONE,
            'keep_alive' => false,
            'soap_version' => SOAP_1_2,
            'stream_context' => stream_context_create([
                'ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true]
            ])
        ];
        $wsdl = $this->kpsUrl . '?wsdl';
        $soapClient = new \SoapClient($wsdl, $options);
        $wsse = new WSSESoap($soapClient, true);
        $wsse->addSAMLToken($samlToken, false);
        return $soapClient;
    }
    
    private function prepareKpsParameters(array $data): array
    {
        $tckn = (int)($data['tckn'] ?? 0);
        $ad = self::formatName($data['ad'] ?? '');
        $soyad = self::formatName($data['soyad'] ?? '');
        $dogumTarihi = $data['dogum_tarihi'] ?? '';
        if (strlen($dogumTarihi) === 10) {
            try { $dogumTarihi = \DateTime::createFromFormat('d/m/Y', $dogumTarihi)->format('Ymd'); } catch (\Exception $e) { $dogumTarihi = ''; }
        }
        $dogumYili = (int)substr($dogumTarihi, 0, 4);
        if (empty($tckn) || empty($ad) || empty($soyad) || empty($dogumYili)) {
            throw new \InvalidArgumentException('Doğrulama için TCKN, Ad, Soyad ve Doğum Yılı alanları zorunludur.');
        }
        return [
            'sorguKriteri' => [
                'KimlikNo' => $tckn,
                'Ad' => $ad,
                'Soyad' => $soyad,
                'DogumYil' => $dogumYili,
            ]
        ];
    }
    
    private function parseKpsResponse(object $response): VerificationResult
    {
        if (!isset($response->SorgulaResult->Sonuc->TCVatandasiKisiKutukleri)) {
            LogManager::logAction('KPS Cevap Hatası', 'UYARI', 'KPS\'den gelen cevapta beklenen TCVatandasiKisiKutukleri alanı bulunamadı.', null, ['response' => $response]);
            return new VerificationResult('Dogrulanamadi', false, BtkHelper::getLang('nviVerificationFail'));
        }
        $kisiKutukleri = $response->SorgulaResult->Sonuc->TCVatandasiKisiKutukleri;
        $hataBilgisi = $kisiKutukleri->HataBilgisi ?? null;
        if ($hataBilgisi && isset($hataBilgisi->Aciklama)) {
            LogManager::logAction('KPS Servis Hatası', 'HATA', $hataBilgisi->Aciklama, null, ['response' => $response]);
            return new VerificationResult('Dogrulanamadi', false, "NVI Servis Hatası: {$hataBilgisi->Aciklama}");
        }
        if (isset($kisiKutukleri->SorguSonucu->Sonuc) && $kisiKutukleri->SorguSonucu->Sonuc === true) {
            return new VerificationResult('Dogrulandi', true, BtkHelper::getLang('nviVerificationSuccess'));
        } else {
            $hataMesaji = $kisiKutukleri->SorguSonucu->HataBilgisi->Aciklama ?? 'Bilinmeyen NVI Hatası';
            LogManager::logAction('KPS Olumsuz Cevap', 'INFO', "NVI Durumu: {$hataMesaji}", null, ['response' => $response]);
            return new VerificationResult('Dogrulanamadi', false, BtkHelper::getLang('nviVerificationFail') . " (NVI Durumu: {$hataMesaji})");
        }
    }

    private static function formatName(string $name): string
    {
        $name = trim($name);
        $tr_upper_map = [ 'i' => 'İ', 'ı' => 'I', 'ü' => 'Ü', 'ğ' => 'Ğ', 'ş' => 'Ş', 'ö' => 'Ö', 'ç' => 'Ç' ];
        $name = str_replace(array_keys($tr_upper_map), array_values($tr_upper_map), mb_strtolower($name, 'UTF-8'));
        return mb_strtoupper($name, 'UTF-8');
    }
}