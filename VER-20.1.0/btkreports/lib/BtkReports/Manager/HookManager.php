<?php
/**
 * WHMCS BTK Raporlama Modülü - Hook Yönetimi
 * Sürüm: 20.1.0 (Operasyon ANKA-PHOENIX)
 *
 * ANKA-PHOENIX Sürüm Notları:
 * - Yeni müşteri ekleme (`ClientAdd`) ve sipariş onaylama (`AcceptOrder`)
 *   kancaları için doğrulama ve BTK veri işleme mantığı eklendi.
 * - `AdminServiceEdit` kancası, artık sadece bizim özel panelimizden değil,
 *   WHMCS'in standart alanlarından (IP adresi, paket vb.) yapılan
 *   değişiklikleri de yakalayıp hareket oluşturacak şekilde iyileştirildi.
 * - Müşteri kilit mekanizması (`isClientLocked`) mantığı, müşteri veri
 *   güncellemelerini doğru şekilde engellemesi için `handleClientAddOrEditPost`
 *   içine entegre edildi.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.1.0
 */

namespace BtkReports\Manager;

use WHMCS\Database\Capsule;
use BtkReports\Api\GibApi;
use BtkReports\Helper\BtkHelper;

class HookManager
{
    // ==================================================================
    // == MÜŞTERİ YÖNETİMİ HOOK'LARI
    // ==================================================================

    /**
     * Yeni bir müşteri eklendiğinde tetiklenir.
     * Bu kanca, müşteri oluşturulduktan HEMEN SONRA çalışır.
     * @param array $vars Kanca tarafından sağlanan değişkenler.
     */
    public static function handleClientAdd(array $vars): void
    {
        // Yeni müşterinin henüz bir hizmeti olmadığı için, sadece müşteri bilgilerini
        // içeren "hayalet" bir rehber kaydı oluşturuyoruz.
        // Bu kayıt, ilk hizmet eklendiğinde bu bilgilerle doldurulacaktır.
        if (isset($_POST['btk_data']['submitted'])) {
            self::handleClientAddOrEditPost($vars['userid'], $_POST['btk_data']);
        }
    }
    
    /**
     * Müşteri bilgileri düzenlenip kaydedildiğinde tetiklenir.
     * Bu fonksiyon hem yeni müşteri ekleme hem de düzenleme için ortak mantığı içerir.
     * @param int $clientId İşlem gören müşteri ID'si.
     * @param array $btkData Formdan gelen BTK verileri.
     */
    public static function handleClientAddOrEditPost(int $clientId, array $btkData): void
    {
        LogManager::logAction('Müşteri Kaydetme/Düzenleme Hook Tetiklendi', 'UYARI', "Müşteri ID: {$clientId} için BTK verileri işleniyor.", null, ['data' => $btkData]);
        
        // "Müşteri Kilidi" kontrolü: Müşterinin hiç aktif hizmeti yoksa bilgilerini güncelleme.
        $rehberKayit = (array)Capsule::table('mod_btk_abone_rehber')->where('whmcs_client_id', $clientId)->orderBy('id', 'desc')->first();
        if (AboneManager::isClientLocked($clientId) && !empty($rehberKayit)) {
            LogManager::logAction('Müşteri Veri Güncelleme Engellendi', 'UYARI', "Müşteri ID: {$clientId} kilitli (aktif hizmeti yok), BTK verileri güncellenmedi.");
            return;
        }

        $guncellenecekVeri = $btkData;
        $identifier = ($guncellenecekVeri['musteri_tipi'] ?? 'G-SAHIS') === 'T-SIRKET' ? ($guncellenecekVeri['abone_vergi_numarasi'] ?? '') : ($guncellenecekVeri['abone_tc_kimlik_no'] ?? '');

        // Eğer geçerli bir TCKN/VKN girildiyse, E-Fatura mükellefiyetini proaktif olarak sorgula.
        if (!empty($identifier)) {
            $isEFaturaMukellefi = GibApi::isEFaturaMukellefi($identifier);
            $guncellenecekVeri['efatura_mukellefi'] = $isEFaturaMukellefi ? 'EVET' : 'HAYIR';
        }
        
        // Bu müşteriye ait TÜM hizmetlerin rehber kayıtlarını bu yeni genel bilgilerle güncelle.
        $serviceIds = Capsule::table('tblhosting')->where('userid', $clientId)->pluck('id')->all();
        
        if (empty($serviceIds)) {
            // Müşterinin henüz hizmeti yoksa, sadece "hayalet" müşteri kaydını oluştur/güncelle.
             AboneManager::createOrUpdateRehberKayit(0, $guncellenecekVeri, ['kod' => '11', 'aciklama' => 'MUSTERI_BILGI_DEGISIKLIGI'], $clientId);
        } else {
            foreach ($serviceIds as $serviceId) {
                AboneManager::createOrUpdateRehberKayit($serviceId, $guncellenecekVeri, ['kod' => '11', 'aciklama' => 'MUSTERI_BILGI_DEGISIKLIGI']);
            }
        }
    }

    // ==================================================================
    // == HİZMET VE SİPARİŞ YÖNETİMİ HOOK'LARI
    // ==================================================================

    /**
     * Bir sipariş onaylandığında tetiklenir.
     * @param array $vars
     */
    public static function handleOrderAccepted(array $vars): void
    {
        $orderId = $vars['orderid'];
        $serviceIds = Capsule::table('tblhosting')->where('orderid', $orderId)->pluck('id')->all();
        LogManager::logAction('Sipariş Onay Hook Tetiklendi', 'INFO', "Sipariş ID: {$orderId}, Hizmet ID(ler): " . implode(',', $serviceIds));
        
        // Sipariş formundan gelen özel BTK verileri varsa, onları işle.
        // Bu, gelecekteki bir özellik için bir altyapıdır.
        $btkOrderData = $_POST['btk_order_data'] ?? [];

        foreach ($serviceIds as $serviceId) {
            AboneManager::createOrUpdateRehberKayit($serviceId, $btkOrderData, ['kod' => '2', 'aciklama' => 'YENI_ABONELIK_KAYDI']);
        }
    }
    
    /**
     * Hizmet detayları sayfasındaki "Kaydet" butonuna basıldığında, bizim özel BTK panelimizden gelen verileri işler.
     * @param int $serviceId
     * @param array $btkData
     */
    public static function handleServiceDetailsSave(int $serviceId, array $btkData): void
    {
        LogManager::logAction('Hizmet Detayları Kaydetme Hook Tetiklendi', 'UYARI', "Hizmet ID: {$serviceId} için BTK verileri işleniyor.", null, ['data' => $btkData]);
        AboneManager::createOrUpdateRehberKayit($serviceId, $btkData, ['kod' => '11', 'aciklama' => 'MUSTERI_BILGI_DEGISIKLIGI']);
    }

    /**
     * WHMCS'in standart hizmet düzenleme alanlarından yapılan değişiklikleri yakalar.
     * @param array $vars
     */
    public static function handleStandardServiceEdit(array $vars): void
    {
        $serviceId = $vars['serviceid'];
        $rehberKayit = (array)Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
        
        if (empty($rehberKayit)) return;
        
        $guncellenecekVeri = [];
        // IP adresi değişikliğini yakala
        if (isset($vars['dedicatedip']) && $vars['dedicatedip'] != $rehberKayit['statik_ip']) {
            $guncellenecekVeri['statik_ip'] = $vars['dedicatedip'];
        }
        
        if (!empty($guncellenecekVeri)) {
             AboneManager::createOrUpdateRehberKayit($serviceId, $guncellenecekVeri, ['kod' => '15', 'aciklama' => 'IP_DEGISIKLIGI']);
        }
    }

    public static function handleServiceStatusChange(int $serviceId, string $newStatus): void
    {
        LogManager::logAction('Hizmet Durum Değişikliği Hook Tetiklendi', 'UYARI', "Hizmet ID: {$serviceId}, Yeni Durum: {$newStatus}");
        AboneManager::createOrUpdateRehberKayit($serviceId, []);
    }
    
    public static function handleServiceDelete(int $serviceId): ?string
    {
        $rehberKayit = Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->first();
        if ($rehberKayit && $rehberKayit->hat_durum !== 'I') {
            LogManager::logAction('Hizmet Silme Engellendi', 'UYARI', "Hizmet ID: {$serviceId}, BTK kaydı iptal edilmediği için silinmesi engellendi.");
            return BtkHelper::getLang('serviceCannotDeleteBtkReason');
        }
        return null;
    }
    
    // ==================================================================
    // == FATURA YÖNETİMİ HOOK'LARI
    // ==================================================================

    public static function handleInvoicePaid(int $invoiceId): void
    {
        EFaturaManager::handleInvoicePaid($invoiceId);
    }
    
    // ==================================================================
    // == YÖNETİCİ SENKRONİZASYON HOOK'LARI
    // ==================================================================

    public static function syncOnAdminSave(array $vars): void
    {
        PersonelManager::syncSingleAdminToPersonel($vars['adminid'], $vars);
    }
    
    public static function syncOnAdminDelete(array $vars): void
    {
        PersonelManager::handleAdminDelete($vars['adminid']);
    }
}