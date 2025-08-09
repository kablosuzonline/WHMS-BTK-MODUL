<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Hook Dosyası
 * Sürüm: 20.0.0 (Operasyon PHOENIX)
 *
 * Bu sürüm, projenin veri giriş mekanizmasını, WHMCS'in resmi kancalarını
 * kullanarak, kararlı ve tema bağımsız bir yapıya kavuşturur. "Enjeksiyon"
 * ve "Tema Sentezi" yöntemleri tamamen terk edilmiştir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    20.0.0
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// OPERASYON ZAMAN SENKRONİZASYONU
date_default_timezone_set('Europe/Istanbul');

require_once __DIR__ . '/vendor/autoload.php';

use BtkReports\Helper\BtkHelper;
use BtkReports\Manager\HookManager;
use BtkReports\Manager\LogManager;
use BtkReports\Manager\PageManager;

// =================================================================================
// == PHOENIX ARAYÜZ KANCALARI (VERİ SAĞLAYICILAR)
// =================================================================================

/**
 * Müşteri profiline "BTK Bilgileri" adında yeni bir sekme ekler.
 * Bu, WHMCS'in resmi ve en kararlı yöntemidir.
 */
add_hook('AdminClientProfileTabFields', 1, function($vars) {
    try {
        $clientId = $vars['userid'];
        $btkData = PageManager::prepareDataForClientProfile($clientId);

        $smarty = new Smarty();
        $smarty->assign('LANG', BtkHelper::loadLang());
        $smarty->assign('btk_data', $btkData);
        
        $fields = [
            // Smarty'nin render ettiği tüm HTML içeriğini tek bir "alan" olarak döndürüyoruz.
            // WHMCS bu içeriği alıp sekmenin içine basacaktır.
            'BTK Bilgileri' => $smarty->fetch(__DIR__ . '/templates/admin/tabs/client_profile.tpl'),
        ];
        
        return $fields;
        
    } catch (\Exception $e) {
        LogManager::logAction('Hook Hatası: AdminClientProfileTabFields', 'KRITIK', $e->getMessage());
        return ['Hata' => 'BTK Bilgileri sekmesi yüklenirken kritik bir hata oluştu. Lütfen logları kontrol edin.'];
    }
});

/**
 * Müşteri profili sayfasındaki "Kaydet" butonuna basıldığında tetiklenir.
 * "BTK Bilgileri" sekmesinden gelen veriyi yakalar ve işler.
 */
add_hook('ClientEdit', 1, function($vars) {
    try {
        if (isset($_POST['btk_data']['submitted'])) {
            HookManager::handleClientAddOrEditPost($vars['userid'], $_POST['btk_data'] ?? []);
        }
    } catch (\Exception $e) {
        LogManager::logAction('Hook Hatası: ClientEdit (BTK Kayıt)', 'KRITIK', $e->getMessage(), null, ['userid' => $vars['userid']]);
    }
});

/**
 * Hizmet detayları sayfasının altına "BTK Hizmet Bilgileri" panelini ekler.
 */
add_hook('AdminAreaServicesView', 1, function($vars) {
    try {
        $serviceId = $vars['serviceid'];
        $btkData = PageManager::prepareDataForClientServices($serviceId);

        $smarty = new Smarty();
        $smarty->assign($vars); // WHMCS'in kendi değişkenlerini de şablona gönder
        $smarty->assign('LANG', BtkHelper::loadLang());
        $smarty->assign('btk_data', $btkData);
        
        return $smarty->fetch(__DIR__ . '/templates/admin/tabs/service_details.tpl');

    } catch (\Exception $e) {
        LogManager::logAction('Hook Hatası: AdminAreaServicesView', 'KRITIK', $e->getMessage());
        return '<div class="alert alert-danger">BTK Hizmet Bilgileri paneli yüklenirken kritik bir hata oluştu. Lütfen logları kontrol edin.</div>';
    }
});

/**
 * Hizmet detayları sayfasındaki "Kaydet" butonuna basıldığında tetiklenir.
 */
add_hook('AdminServiceEdit', 1, function($vars) {
    try {
        // Standart WHMCS alanlarından (IP, paket vb.) kaynaklanan hareketleri işle
        HookManager::handleStandardServiceEdit($vars);
        // Bizim özel BTK panelimizden gelen verileri işle
        if (isset($_POST['btk_data']['submitted'])) {
            HookManager::handleServiceDetailsSave($vars['serviceid'], $_POST['btk_data']);
        }
    } catch (\Exception $e) {
        LogManager::logAction('Hook Hatası: AdminServiceEdit (BTK Kayıt)', 'KRITIK', $e->getMessage(), null, ['serviceid' => $vars['serviceid']]);
    }
});


// =================================================================================
// == ARKA PLAN İŞLEM KANCALARI
// =================================================================================

add_hook('InvoicePaid', 1, function($vars) {
    try {
        HookManager::handleInvoicePaid($vars['invoiceid']);
    } catch (\Exception $e) {
        LogManager::logAction('Hook Hatası: InvoicePaid', 'KRITIK', $e->getMessage(), null, ['invoiceid' => $vars['invoiceid']]);
    }
});

add_hook('AfterModuleSuspend', 1, function($vars) { try { HookManager::handleServiceStatusChange($vars['params']['serviceid'], 'Suspended'); } catch (\Exception $e) { LogManager::logAction('Hook Hatası: AfterModuleSuspend', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid']]); } });
add_hook('AfterModuleUnsuspend', 1, function($vars) { try { HookManager::handleServiceStatusChange($vars['params']['serviceid'], 'Active'); } catch (\Exception $e) { LogManager::logAction('Hook Hatası: AfterModuleUnsuspend', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid']]); } });
add_hook('AfterModuleTerminate', 1, function($vars) { try { HookManager::handleServiceStatusChange($vars['params']['serviceid'], 'Terminated'); } catch (\Exception $e) { LogManager::logAction('Hook Hatası: AfterModuleTerminate', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid']]); } });
add_hook('ServiceDelete', 1, function($vars) { try { return HookManager::handleServiceDelete($vars['serviceid']); } catch (\Exception $e) { LogManager::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid']]); return null; } });
add_hook('AdminSave', 1, function ($vars) { try { HookManager::syncOnAdminSave($vars); } catch (\Exception $e) { LogManager::logAction('Hook Hatası: AdminSave', 'HATA', $e->getMessage(), null, ['adminid' => $vars['adminid']]); } });
add_hook('AdminDelete', 1, function ($vars) { try { HookManager::syncOnAdminDelete($vars); } catch (\Exception $e) { LogManager::logAction('Hook Hatası: AdminDelete', 'HATA', $e->getMessage(), null, ['adminid' => $vars['adminid']]); } });

// =================================================================================
// == KENDİNİ ONARAN GÜVENLİK VE KARARLILIK MEKANİZMASI
// =================================================================================

add_hook('AdminAreaPage', 1, function($vars) {
    try {
        BtkHelper::ensureTempDirectoryExists();
    } catch (\Exception $e) {
        LogManager::logAction('Temp Klasör Bekçi Hatası', 'KRITIK', $e->getMessage());
    }
});
?>