<?php
/**
 * NVI Güvenlik Token Servisi (STS) İstemcisi
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sınıf, KPS v2 servislerini çağırmadan önce, NVI'nin STS servisinden
 * bir SAML v1.1 güvenlik anahtarı (token) almak için gerekli olan
 * SOAP isteğini oluşturur ve gönderir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

namespace BtkReports\Verifier;

use BtkReports\Manager\LogManager;

class NviStsClient
{
    private const STS_TEST_URL = 'https://kpsbasvuru.nvi.gov.tr/Services/SecurityTokenService.svc';
    private const STS_LIVE_URL = 'https://kps.nvi.gov.tr/Services/SecurityTokenService.svc';
    
    private const TIMEOUT_SECONDS = 30;

    private string $stsUrl;
    private string $username;
    private string $password;

    /**
     * NviStsClient constructor.
     */
    public function __construct(string $username, string $password, bool $isTestMode = true)
    {
        $this->username = $username;
        $this->password = $password;
        $this->stsUrl = $isTestMode ? self::STS_TEST_URL : self::STS_LIVE_URL;
    }

    /**
     * STS servisinden bir SAML v1.1 token talep eder.
     */
    public function requestSecurityToken(): \DOMElement
    {
        $soapRequestXml = $this->buildSoapRequest();
        
        $headers = [
            'Content-Type: application/soap+xml; charset=utf-8',
            'Content-Length: ' . strlen($soapRequestXml),
        ];

        $ch = curl_init($this->stsUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $soapRequestXml);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, self::TIMEOUT_SECONDS);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        $responseXml = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($responseXml === false) {
            throw new \Exception("STS servisine cURL isteği başarısız oldu: " . $curlError);
        }

        if ($httpCode >= 400) {
            LogManager::logAction('STS Servis Hatası', 'KRITIK', "HTTP Kodu: {$httpCode}", null, ['response' => $responseXml]);
            throw new \Exception("STS servisi HTTP hatası döndürdü: Kod {$httpCode}");
        }

        return $this->parseSoapResponse($responseXml);
    }

    /**
     * STS'ye gönderilecek olan SOAP zarfını oluşturur.
     */
    private function buildSoapRequest(): string
    {
        $nsSoap = 'http://www.w3.org/2003/05/soap-envelope';
        $nsWsa = 'http://www.w3.org/2005/08/addressing';
        $nsWst = 'http://docs.oasis-open.org/ws-sx/ws-trust/200512';
        $nsWsse = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText';
        $nsWsseBase = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';

        $messageId = 'urn:uuid:' . $this->generateGuid();

        $xml = new \DOMDocument('1.0', 'utf-8');
        $xml->formatOutput = false;

        $soapEnvelope = $xml->createElementNS($nsSoap, 's:Envelope');
        $xml->appendChild($soapEnvelope);

        $soapHeader = $xml->createElementNS($nsSoap, 's:Header');
        $soapEnvelope->appendChild($soapHeader);

        $action = $xml->createElementNS($nsWsa, 'a:Action', 'http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue');
        $action->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:a', $nsWsa);
        $action->setAttributeNS($nsSoap, 's:mustUnderstand', '1');
        $soapHeader->appendChild($action);
        
        $messageID = $xml->createElementNS($nsWsa, 'a:MessageID', $messageId);
        $soapHeader->appendChild($messageID);

        $replyTo = $xml->createElementNS($nsWsa, 'a:ReplyTo');
        $address = $xml->createElementNS($nsWsa, 'a:Address', 'http://www.w3.org/2005/08/addressing/anonymous');
        $replyTo->appendChild($address);
        $soapHeader->appendChild($replyTo);

        $to = $xml->createElementNS($nsWsa, 'a:To', $this->stsUrl);
        $to->setAttributeNS($nsSoap, 's:mustUnderstand', '1');
        $soapHeader->appendChild($to);

        $security = $xml->createElementNS($nsWsseBase, 'o:Security');
        $security->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:o', $nsWsseBase);
        $security->setAttributeNS($nsSoap, 's:mustUnderstand', '1');
        $soapHeader->appendChild($security);
        
        $usernameToken = $xml->createElementNS($nsWsseBase, 'o:UsernameToken');
        $security->appendChild($usernameToken);
        
        $usernameNode = $xml->createElementNS($nsWsseBase, 'o:Username', $this->username);
        $usernameToken->appendChild($usernameNode);

        $passwordNode = $xml->createElementNS($nsWsseBase, 'o:Password', $this->password);
        $passwordNode->setAttribute('Type', $nsWsse);
        $usernameToken->appendChild($passwordNode);

        $soapBody = $xml->createElementNS($nsSoap, 's:Body');
        $soapEnvelope->appendChild($soapBody);
        
        $requestToken = $xml->createElementNS($nsWst, 'trust:RequestSecurityToken');
        $requestToken->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:trust', $nsWst);
        $soapBody->appendChild($requestToken);
        
        $tokenType = $xml->createElementNS($nsWst, 'trust:TokenType', 'http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV1.1');
        $requestToken->appendChild($tokenType);
        
        $requestType = $xml->createElementNS($nsWst, 'trust:RequestType', 'http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue');
        $requestToken->appendChild($requestType);

        return $xml->saveXML();
    }
    
    /**
     * STS'den gelen SOAP cevabını ayrıştırır ve içindeki SAML Token'ı çıkarır.
     */
    private function parseSoapResponse(string $responseXml): \DOMElement
    {
        $doc = new \DOMDocument();
        if (!@$doc->loadXML($responseXml)) {
            throw new \Exception('STS cevabı geçerli bir XML değil.');
        }

        $xpath = new \DOMXPath($doc);
        $xpath->registerNamespace('s', 'http://www.w3.org/2003/05/soap-envelope');
        $xpath->registerNamespace('wst', 'http://docs.oasis-open.org/ws-sx/ws-trust/200512');
        $xpath->registerNamespace('saml', 'urn:oasis:names:tc:SAML:1.0:assertion');

        $fault = $xpath->query('//s:Fault/s:Reason/s:Text');
        if ($fault->length > 0) {
            throw new \Exception('STS servisi hata döndürdü: ' . $fault->item(0)->textContent);
        }
        
        $tokenNode = $xpath->query('//wst:RequestSecurityTokenResponse/wst:RequestedSecurityToken/saml:Assertion')->item(0);
        
        if (!$tokenNode) {
            LogManager::logAction('STS Token Hatası', 'KRITIK', "STS'den gelen cevapta SAML Token bulunamadı.", null, ['response' => $responseXml]);
            throw new \Exception("STS'den gelen cevapta SAML Token bulunamadı.");
        }
        
        return $tokenNode;
    }
    
    /**
     * Rastgele bir GUID (UUID v4) oluşturur.
     */
    private function generateGuid(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}