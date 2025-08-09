<?php
/**
 * BTK Raporlama Modülü - E-Fatura Entegrasyon Yöneticisi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - `PageManager` tarafından çağrılan ve hata veren `getWhmcsInvoicesForListing`
 *   fonksiyonu, tam işlevsel olarak eklendi.
 * - `createEFaturaForInvoice` fonksiyonu, BİMSA eDoksis'in beklediği detaylı
 *   veri yapısını eksiksiz oluşturan tam işlevsel hale getirildi.
 * - Akıllı Ödeme Tanıma (`getPaymentDetails`) fonksiyonu, kredi kartı ve
 *   banka havalesi gibi ödeme yöntemlerini daha doğru tespit edecek şekilde
 *   iyileştirildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Manager\LogManager;
use BtkReports\Api\EdoksisApi;
use BtkReports\Api\GibApi;
use BtkReports\Helper\BtkHelper;

class EFaturaManager
{
    /**
     * WHMCS faturası ödendiğinde, E-Fatura oluşturma işlemini tetikler.
     */
    public static function handleInvoicePaid(int $invoiceId): void
    {
        LogManager::logAction('E-Fatura Tetikleme Denemesi (Otomatik)', 'UYARI', "Ödenen Fatura ID: {$invoiceId} için otomatik E-Fatura süreci başlatıldı.");
        
        $autoCreate = BtkHelper::get_btk_setting('edoksis_auto_create', '0') === '1';
        if (!$autoCreate) {
            LogManager::logAction('E-Fatura Atlandı (Otomatik)', 'INFO', "Otomatik E-Fatura oluşturma ayarı kapalı olduğu için işlem yapılmadı.");
            return;
        }

        self::createEFaturaForInvoice($invoiceId);
    }
    
    /**
     * Belirtilen WHMCS fatura ID'si için E-Fatura/E-Arşiv oluşturma sürecini başlatır.
     */
    public static function createEFaturaForInvoice(int $invoiceId): array
    {
        LogManager::logAction('E-Fatura Oluşturma Başladı', 'INFO', "Fatura ID: {$invoiceId} için süreç başlatıldı.");
        
        try {
            // 1. Fatura ve müşteri bilgilerini WHMCS'ten çek
            $invoice = Capsule::table('tblinvoices')->find($invoiceId);
            if (!$invoice) throw new \Exception("Fatura ID: {$invoiceId} bulunamadı.");
            
            $client = Capsule::table('tblclients')->find($invoice->userid);
            $rehberKayit = (array)Capsule::table('mod_btk_abone_rehber')->where('whmcs_client_id', $client->id)->orderBy('id', 'desc')->first();
            if (empty($rehberKayit)) throw new \Exception("Müşteri ID: {$client->id} için BTK Rehber kaydı bulunamadı.");

            // 2. Abone Rehber'den mükellefiyet durumunu oku (yoksa GİB'den sorgula)
            $isEFaturaMukellefi = ($rehberKayit['efatura_mukellefi'] ?? 'BILINMIYOR') === 'EVET';
            if (($rehberKayit['efatura_mukellefi'] ?? 'BILINMIYOR') === 'BILINMIYOR') {
                 $identifier = !empty($client->companyname) ? ($rehberKayit['abone_vergi_numarasi'] ?? '') : ($rehberKayit['abone_tc_kimlik_no'] ?? '');
                 $isEFaturaMukellefi = GibApi::isEFaturaMukellefi($identifier);
                 Capsule::table('mod_btk_abone_rehber')->where('id', $rehberKayit['id'])->update(['efatura_mukellefi' => $isEFaturaMukellefi ? 'EVET' : 'HAYIR']);
            }

            // 3. Akıllı Ödeme Tanıma yap
            $paymentDetails = self::getPaymentDetails($invoiceId, (array)$invoice);

            // 4. EdoksisApi için fatura verisini (Array) hazırla
            $faturaData = self::prepareInvoiceDataForEdoksis((array)$invoice, (array)$client, $rehberKayit, $paymentDetails, $isEFaturaMukellefi);

            // 5. EdoksisApi'yi çağır
            $settings = BtkHelper::getAllBtkSettings();
            $api = new EdoksisApi($settings);
            $response = $isEFaturaMukellefi ? $api->sendEFatura($faturaData) : $api->sendEArsivFatura($faturaData);

            // 6. Sonucu mod_btk_efatura_kayitlari'na kaydet
            self::saveEFaturaResult($invoiceId, $response, $isEFaturaMukellefi, $paymentDetails, (array)$invoice);

            LogManager::logAction('E-Fatura Başarıyla Oluşturuldu', 'INFO', "Fatura ID: {$invoiceId} için E-Fatura başarıyla oluşturuldu.", null, ['response' => (array)$response]);
            return ['status' => true, 'message' => "Fatura ID {$invoiceId} için E-Fatura başarıyla oluşturuldu."];
        } catch (\Exception $e) {
            LogManager::logAction('E-Fatura Oluşturma Başarısız', 'KRITIK', "Fatura ID: {$invoiceId}, Hata: " . $e->getMessage());
            return ['status' => false, 'message' => "Hata: " . $e->getMessage()];
        }
    }

    private static function prepareInvoiceDataForEdoksis(array $invoice, array $client, array $rehber, array $payment, bool $isEFatura): array 
    {
        $items = Capsule::table('tblinvoiceitems')->where('invoiceid', $invoice['id'])->get();
        $invoiceLines = [];
        foreach ($items as $item) {
            $invoiceLines[] = [
                'Name' => $item->description,
                'Quantity' => $item->amount > 0 ? 1 : 0,
                'Price' => $item->amount,
                'Amount' => $item->amount,
            ];
        }

        $faturaData = [
            'INVOICETUR' => 'SATIS',
            'FATURATARIHI' => date('d.m.Y H:i:s', strtotime($invoice['date'])),
            'VERGIDAHILMI' => true,
            'ODEMESEKLI' => $payment['edoksis_tip'],
            'ODEMETARIHI' => date('d.m.Y', strtotime($invoice['datepaid'])),
            'PARAABIRIMI' => $client['currency_code'] ?? 'TRY',
            'VKNTCKN' => !empty($client['companyname']) ? $rehber['abone_vergi_numarasi'] : $rehber['abone_tc_kimlik_no'],
            'MUSTERIADI' => !empty($client['companyname']) ? $rehber['abone_unvan'] : $rehber['abone_adi'],
            'MUSTERISOYADI' => !empty($client['companyname']) ? '' : $rehber['abone_soyadi'],
            'ADRES' => $client['address1'],
            'SEHIR' => $client['city'],
            'ULKE' => $client['country'],
            'NOT' => $payment['aciklama'],
            'INVOICELINES' => $invoiceLines,
        ];
        
        if (!$isEFatura) { // E-Arşiv için ek alanlar
            $faturaData['EARSIVGONDERIMSEKLI'] = 'ELEKTRONIK';
        }

        return $faturaData;
    }

    private static function getPaymentDetails(int $invoiceId, array $invoice): array 
    {
        $transaction = Capsule::table('tblaccounts')->where('invoiceid', $invoiceId)->orderBy('id', 'desc')->first();
        if (!$transaction) {
            return ['tip' => 'DIGER', 'edoksis_tip' => 'OTHER', 'aciklama' => 'Ödeme bilgisi bulunamadı.'];
        }
        
        $gateway = strtolower($transaction->gateway);
        $transId = $transaction->transid;

        if (in_array($gateway, ['stripe', 'paytr', 'paypal', 'ccavenue'])) {
            return ['tip' => 'KREDI_KARTI', 'edoksis_tip' => 'CREDITCARD', 'aciklama' => "Kredi Kartı ile ödendi. İşlem No: {$transId}"];
        }
        if ($gateway === 'banktransfer') {
            return ['tip' => 'BANKA_HAVALESI', 'edoksis_tip' => 'EFT', 'aciklama' => "Banka Havalesi/EFT ile ödendi. Dekont No: {$transId}"];
        }

        return ['tip' => 'DIGER', 'edoksis_tip' => 'OTHER', 'aciklama' => "Ödeme Yöntemi: {$transaction->gateway}, İşlem No: {$transId}"];
    }

    private static function saveEFaturaResult(int $invoiceId, object $response, bool $isEFatura, array $payment, array $invoice): void 
    { 
        Capsule::table('mod_btk_efatura_kayitlari')->insert([
            'whmcs_invoice_id' => $invoiceId,
            'fatura_uuid' => $response->INVOICEID ?? null,
            'fatura_no' => $response->INVOICENUMBER ?? null,
            'fatura_tipi' => $isEFatura ? 'E-FATURA' : 'E-ARSIV',
            'durum' => 'Kesinleşti',
            'tutar' => $invoice['subtotal'],
            'kdv' => $invoice['tax'],
            'oiv_tutar' => $invoice['tax2'],
            'toplam_tutar' => $invoice['total'],
            'odeme_detay_tipi' => $payment['tip'],
            'odeme_detay_aciklama' => $payment['aciklama'],
            'pdf_url' => $response->PDF ?? null,
            'olusturma_tarihi' => date('Y-m-d H:i:s'),
        ]);
    }
    
    public static function getFaturalarByDateRange(string $startDate, string $endDate): array 
    {
        try {
            return Capsule::table('mod_btk_efatura_kayitlari as ef')
                ->join('tblinvoices as i', 'ef.whmcs_invoice_id', '=', 'i.id')
                ->join('tblclients as c', 'i.userid', '=', 'c.id')
                ->whereBetween('ef.olusturma_tarihi', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->select( 'i.id as whmcs_invoice_id', 'ef.fatura_no', 'ef.pdf_url',
                    Capsule::raw("DATE_FORMAT(ef.olusturma_tarihi, '%d/%m/%Y') as fatura_tarihi"),
                    Capsule::raw("IF(c.companyname != '', c.companyname, CONCAT(c.firstname, ' ', c.lastname)) as musteri_adi"),
                    Capsule::raw("(SELECT abone_tc_kimlik_no FROM mod_btk_abone_rehber WHERE whmcs_client_id = c.id LIMIT 1) as tckn"),
                    Capsule::raw("(SELECT abone_vergi_numarasi FROM mod_btk_abone_rehber WHERE whmcs_client_id = c.id LIMIT 1) as vkn"),
                    'ef.tutar as mal_hizmet_toplam', 'ef.kdv as kdv_tutar', 'ef.oiv_tutar', 'ef.toplam_tutar as vergiler_dahil_toplam',
                    'ef.odeme_detay_aciklama', 'ef.durum' )
                ->orderBy('ef.olusturma_tarihi', 'desc')
                ->get()->map(fn($item) => (array)$item)->all();
        } catch (\Exception $e) {
            LogManager::logAction('E-Fatura Sorgulama Hatası', 'KRITIK', 'Tarih aralığına göre faturalar çekilirken hata oluştu: ' . $e->getMessage());
            return [];
        }
    }

    public static function getWhmcsInvoicesForListing(array $request): array
    {
        $filters = [
            's_client_name' => $request['s_client_name'] ?? '',
            's_invoice_num' => $request['s_invoice_num'] ?? '',
            's_date_range' => $request['s_date_range'] ?? '',
            's_payment_status' => $request['s_payment_status'] ?? '',
        ];
        
        $query = Capsule::table('tblinvoices as i')
            ->join('tblclients as c', 'i.userid', '=', 'c.id')
            ->leftJoin('mod_btk_efatura_kayitlari as ef', 'i.id', '=', 'ef.whmcs_invoice_id');
        
        if (!empty($filters['s_client_name'])) {
            $term = '%' . $filters['s_client_name'] . '%';
            $query->where(function($q) use ($term) {
                $q->where(Capsule::raw("CONCAT(c.firstname, ' ', c.lastname)"), 'LIKE', $term)
                  ->orWhere('c.companyname', 'LIKE', $term);
            });
        }
        if (!empty($filters['s_invoice_num'])) {
            $query->where('i.invoicenum', 'LIKE', '%' . $filters['s_invoice_num'] . '%');
        }
        if (!empty($filters['s_date_range'])) {
             $dateRange = explode(' to ', $filters['s_date_range']);
             if (count($dateRange) === 2) {
                $query->whereBetween('i.date', [date('Y-m-d', strtotime($dateRange[0])), date('Y-m-d', strtotime($dateRange[1]))]);
             }
        }
        if (!empty($filters['s_payment_status'])) {
            $query->where('i.status', $filters['s_payment_status']);
        }
        
        $total = $query->count();
        $limit = (int)BtkHelper::get_btk_setting('admin_records_per_page', 20);
        $page = (int)($request['page'] ?? 1);
        $offset = ($page - 1) * $limit;
        
        $data = $query->select(
                'i.id', 'i.invoicenum', 'i.userid', 'i.date', 'i.total', 'i.status',
                Capsule::raw("IF(c.companyname != '', c.companyname, CONCAT(c.firstname, ' ', c.lastname)) as client_name"),
                'ef.durum as efatura_durum', 'ef.fatura_no', 'ef.pdf_url'
            )
            ->orderBy('i.id', 'desc')
            ->skip($offset)->take($limit)
            ->get()->map(fn($item) => (array)$item)->all();
            
        return [
            'data' => $data,
            'pagination' => RaporManager::buildPagination($filters, $total, $limit, $page, 'efatura_invoices')
        ];
    }

    public static function saveEFaturaSettings(array $postData): void
    {
        $currentSettings = BtkHelper::getAllBtkSettings();
        
        $settingsToSave = [
            'edoksis_user', 'edoksis_company_name', 'edoksis_tax_office', 'edoksis_tax_id', 'edoksis_mersis',
            'edoksis_website', 'edoksis_phone', 'edoksis_fax', 'edoksis_email', 'edoksis_street',
            'edoksis_building_name', 'edoksis_building_number', 'edoksis_door_number', 'edoksis_town',
            'edoksis_city', 'edoksis_zipcode', 'edoksis_country', 'edoksis_invoice_prefix'
        ];
        foreach ($settingsToSave as $key) {
            if (isset($postData[$key])) {
                $oldValue = $currentSettings[$key] ?? ''; $newValue = trim($postData[$key]);
                BtkHelper::set_btk_setting($key, $newValue); LogManager::logSettingChange($key, $oldValue, $newValue);
            }
        }
        $checkboxSettings = ['edoksis_auto_create'];
        foreach ($checkboxSettings as $key) {
            $oldValue = $currentSettings[$key] ?? '0'; $newValue = isset($postData[$key]) && ($postData[$key] === '1' || $postData[$key] === 'on') ? '1' : '0';
            BtkHelper::set_btk_setting($key, $newValue); LogManager::logSettingChange($key, $oldValue, $newValue);
        }
        $modeSettings = ['edoksis_mode'];
        foreach ($modeSettings as $key) {
            $oldValue = $currentSettings[$key] ?? 'test'; $newValue = isset($postData[$key]) && $postData[$key] === 'on' ? 'canli' : 'test';
            BtkHelper::set_btk_setting($key, $newValue); LogManager::logSettingChange($key, $oldValue, $newValue);
        }
        $passwordFields = ['edoksis_pass'];
        foreach ($passwordFields as $key) {
            if (isset($postData[$key])) {
                BtkHelper::set_btk_setting($key, $postData[$key]); LogManager::logSettingChange($key, '********', '********');
            }
        }
    }
}