<?php
/**
 * BİMSA eDoksis E-Fatura/E-Arşiv API İstemcisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Hata yönetimi, merkezi LogManager ile tam entegre hale getirildi.
 * - SOAP istemcisi başlatma metodları (initEFaturaClient, initEArsivClient)
 *   lazy loading prensibiyle optimize edildi.
 * - Test/Canlı mod geçişleri BtkHelper üzerinden yönetilerek standartlaştırıldı.
 * - İstek zaman aşımları ve diğer SOAP opsiyonları standartlaştırıldı.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Api;

use BtkReports\Manager\LogManager;
use BtkReports\Helper\BtkHelper;

class EdoksisApi
{
    // BİMSA eDoksis tarafından sağlanan sabit servis URL'leri
    private const EFATURA_TEST_URL = "https://efaturatest.edoksis.net/EFaturaEDM/EFaturaEDM.svc?wsdl";
    private const EFATURA_LIVE_URL = "https://efatura.edoksis.net/EFaturaEDM/EFaturaEDM.svc?wsdl";
    private const EARSIV_TEST_URL = "https://earsivtest.edoksis.net/EArsiv/EArsiv.svc?wsdl";
    private const EARSIV_LIVE_URL = "https://earsiv.edoksis.net/EArsiv/EArsiv.svc?wsdl";
    
    // İstekler için varsayılan zaman aşımı süresi (saniye)
    private const TIMEOUT_SECONDS = 60;

    private string $username;
    private string $password;
    private bool $isTestMode;

    private ?\SoapClient $eFaturaClient = null;
    private ?\SoapClient $eArsivClient = null;

    /**
     * EdoksisApi constructor.
     * Ayarları alır ve API ile iletişim için hazır hale gelir.
     *
     * @param array $settings Modül ayarları
     * @throws \Exception Eğer eDoksis kullanıcı adı veya şifresi eksikse
     */
    public function __construct(array $settings)
    {
        $this->username = $settings['edoksis_user'] ?? '';
        $this->password = $settings['edoksis_pass'] ?? '';
        $this->isTestMode = BtkHelper::isEdoksisTestMode();

        if (empty($this->username) || empty($this->password)) {
            throw new \Exception("eDoksis kullanıcı adı veya şifresi modül ayarlarında tanımlanmamış.");
        }
    }

    /**
     * E-Fatura SOAP istemcisini, sadece ihtiyaç duyulduğunda bir kez başlatır.
     * @return \SoapClient
     */
    private function initEFaturaClient(): \SoapClient
    {
        if ($this->eFaturaClient === null) {
            $url = $this->isTestMode ? self::EFATURA_TEST_URL : self::EFATURA_LIVE_URL;
            $options = [
                'trace' => 1, 'exceptions' => true, 'connection_timeout' => self::TIMEOUT_SECONDS,
                'soap_version' => SOAP_1_1, 'cache_wsdl' => WSDL_CACHE_NONE,
            ];
            $this->eFaturaClient = new \SoapClient($url, $options);
        }
        return $this->eFaturaClient;
    }

    /**
     * E-Arşiv SOAP istemcisini, sadece ihtiyaç duyulduğunda bir kez başlatır.
     * @return \SoapClient
     */
    private function initEArsivClient(): \SoapClient
    {
        if ($this->eArsivClient === null) {
            $url = $this->isTestMode ? self::EARSIV_TEST_URL : self::EARSIV_LIVE_URL;
            $options = [
                'trace' => 1, 'exceptions' => true, 'connection_timeout' => self::TIMEOUT_SECONDS,
                'soap_version' => SOAP_1_1, 'cache_wsdl' => WSDL_CACHE_NONE,
            ];
            $this->eArsivClient = new \SoapClient($url, $options);
        }
        return $this->eArsivClient;
    }

    /**
     * E-Fatura gönderir.
     * @param string $ublXml GİB formatında UBL-TR XML içeriği.
     * @return object Servisten dönen sonuç.
     */
    public function sendEFatura(string $ublXml): object
    {
        $client = $this->initEFaturaClient();
        $params = [
            'inLogin' => ['userName' => $this->username, 'password' => $this->password],
            'inUBL' => $ublXml,
            'inParam' => ['SENDTYPE' => 'XML'],
        ];

        try {
            $response = $client->SendInvoice($params);
            LogManager::logAction('E-Fatura Gönderildi', 'INFO', "E-Fatura başarıyla gönderildi.", null, ['response' => (array)$response]);
            return $response->SendInvoiceResult;
        } catch (\SoapFault $e) {
            LogManager::logAction('E-Fatura Gönderme Hatası', 'HATA', $e->getMessage(), null, ['request' => $params, 'soap_fault' => (array)$e]);
            throw $e;
        }
    }

    /**
     * E-Arşiv Fatura gönderir.
     * @param array $faturaData Fatura verilerini içeren dizi.
     * @return object Servisten dönen sonuç.
     */
    public function sendEArsivFatura(array $faturaData): object
    {
        $client = $this->initEArsivClient();
        $params = [
            'inLogin' => ['userName' => $this->username, 'password' => $this->password],
            'inInvoice' => $faturaData,
        ];

        try {
            $response = $client->CreateInvoice($params);
            LogManager::logAction('E-Arşiv Fatura Gönderildi', 'INFO', "E-Arşiv faturası başarıyla gönderildi.", null, ['response' => (array)$response]);
            return $response->CreateInvoiceResult;
        } catch (\SoapFault $e) {
            LogManager::logAction('E-Arşiv Fatura Gönderme Hatası', 'HATA', $e->getMessage(), null, ['request' => $params, 'soap_fault' => (array)$e]);
            throw $e;
        }
    }

    /**
     * Bir faturanın durumunu UUID ile sorgular.
     * @param string $uuid Faturanın tekil kimliği.
     * @return object Servisten dönen sonuç.
     */
    public function getInvoiceStatus(string $uuid): object
    {
        $client = $this->initEFaturaClient();
        $params = [
            'inLogin' => ['userName' => $this->username, 'password' => $this->password],
            'inUUID' => $uuid,
        ];

        try {
            $response = $client->GetInvoiceStatus($params);
            return $response->GetInvoiceStatusResult;
        } catch (\SoapFault $e) {
            LogManager::logAction('Fatura Durum Sorgulama Hatası', 'HATA', $e->getMessage(), null, ['uuid' => $uuid, 'soap_fault' => (array)$e]);
            throw $e;
        }
    }

    /**
     * Tamamlanmış bir faturanın PDF'ini base64 formatında alır.
     * @param string $uuid Faturanın tekil kimliği.
     * @return string Base64 formatında PDF içeriği.
     */
    public function getInvoicePdfAsBase64(string $uuid): string
    {
        $client = $this->initEArsivClient();
        $params = [
            'inLogin' => ['userName' => $this->username, 'password' => $this->password],
            'inUUID' => $uuid,
            'inTYPE' => 'PDF',
        ];

        try {
            $response = $client->GetInvoice($params);
            if (isset($response->GetInvoiceResult->Invoice) && !empty($response->GetInvoiceResult->Invoice)) {
                return $response->GetInvoiceResult->Invoice;
            }
            throw new \Exception("PDF alınamadı. eDoksis cevabında fatura içeriği boş geldi.");
        } catch (\SoapFault $e) {
            LogManager::logAction('Fatura PDF Alma Hatası', 'HATA', $e->getMessage(), null, ['uuid' => $uuid, 'soap_fault' => (array)$e]);
            throw $e;
        }
    }
}