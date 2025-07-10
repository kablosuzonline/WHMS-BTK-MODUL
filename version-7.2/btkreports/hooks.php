<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Hook Dosyası
 * Sürüm: 7.2.7 (Operatör - Nihai Enjeksiyon ve Kritik Hata Düzeltmeleri)
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    7.2.7
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

require_once __DIR__ . '/vendor/autoload.php';

use BtkReports\Helper\BtkHelper;
use WHMCS\Service\Service;

// =================================================================================
// == ARAYÜZ ENJEKSİYON HOOK'LARI (clientsprofile.php ve clientsservices.php için)
// =================================================================================

/**
 * Müşteri profili sayfasına BTK veri giriş formunun verilerini ve placeholder'ını enjekte eder.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return string Enjekte edilecek HTML/Script içeriği.
 */
add_hook('AdminAreaClientProfilePage', 1, function($vars) {
    try {
        $clientId = $vars['clientid'];
        $btkClientData = BtkHelper::getBtkClientInfoForInjection($clientId); // Enjeksiyon için gerekli tüm veriyi topla

        // Global JavaScript değişkenine veriyi aktar
        $scriptContent = '<script type="text/javascript">';
        $scriptContent .= 'window.btkClientProfileData = ' . json_encode($btkClientData, JSON_UNESCAPED_UNICODE) . ';';
        $scriptContent .= 'window.btkCsrfToken = "' . \BtkreportsCsrfHelper::generateToken() . '";';
        $scriptContent .= 'window.btkCsrfTokenName = "' . \BtkreportsCsrfHelper::getTokenName() . '";';
        $scriptContent .= 'window.btkLang = ' . json_encode(BtkHelper::loadLang(), JSON_UNESCAPED_UNICODE) . ';';
        $scriptContent .= '</script>';
        
        // Formun yerleşeceği placeholder div'i (JS tarafından doldurulacak)
        $placeholderHtml = '<div id="btkClientProfilePlaceholder" style="margin-top:15px;"></div>';

        return $scriptContent . $placeholderHtml;
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminAreaClientProfilePage', 'KRITIK', $e->getMessage(), null, ['clientid' => $vars['clientid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
        return '<div class="alert alert-danger" style="margin-top:15px;">BTK Müşteri Bilgileri bölümü yüklenirken kritik bir hata oluştu. Lütfen sistem loglarını kontrol edin.</div>';
    }
});

/**
 * Hizmet detayları sayfasına BTK veri giriş formunun verilerini ve placeholder'ını enjekte eder.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return string Enjekte edilecek HTML/Script içeriği.
 */
add_hook('AdminAreaViewServicePage', 1, function($vars) {
    try {
        $serviceId = $vars['serviceid'];
        $btkServiceData = BtkHelper::getBtkServiceInfoForInjection($serviceId); // Enjeksiyon için gerekli tüm veriyi topla

        $scriptContent = '<script type="text/javascript">';
        $scriptContent .= 'window.btkServiceDetailsData = ' . json_encode($btkServiceData, JSON_UNESCAPED_UNICODE) . ';';
        $scriptContent .= 'window.btkCsrfToken = "' . \BtkreportsCsrfHelper::generateToken() . '";';
        $scriptContent .= 'window.btkCsrfTokenName = "' . \BtkreportsCsrfHelper::getTokenName() . '";';
        $scriptContent .= 'window.btkLang = ' . json_encode(BtkHelper::loadLang(), JSON_UNESCAPED_UNICODE) . ';';
        $scriptContent .= '</script>';
        
        $placeholderHtml = '<div id="btkServiceDetailsPlaceholder" style="margin-top:15px;"></div>';

        return $scriptContent . $placeholderHtml;
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminAreaViewServicePage', 'KRITIK', $e->getMessage(), null, ['serviceid' => $vars['serviceid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
        return '<div class="alert alert-danger" style="margin-top:15px;">BTK Hizmet Bilgileri bölümü yüklenirken kritik bir hata oluştu. Lütfen sistem loglarını kontrol edin.</div>';
    }
});

// =================================================================================
// == VERİ KAYDETME VE İŞLEM HOOK'LARI (OLAY YÖNETİCİLERİ)
// =================================================================================

/**
 * Müşteri profili kaydedildiğinde, enjekte edilen BTK verilerini yakalar ve işler.
 * Bu hook, WHMCS'in "Save Changes" butonu tetiklendiğinde çalışır.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 */
add_hook('ClientEdit', 1, function($vars) {
    if (isset($_POST['btk_profile_data']) && is_array($_POST['btk_profile_data'])) {
        try {
            \BtkreportsCsrfHelper::verify(); 
            BtkHelper::handleClientProfileSave($vars['userid'], $_POST['btk_profile_data']);
        } catch (\Exception $e) {
            BtkHelper::logAction('Hook Hatası: ClientEdit (BTK Veri Kaydı)', 'HATA', $e->getMessage(), null, ['userid' => $vars['userid'] ?? 'N/A', 'post_keys' => array_keys($_POST['btk_profile_data']), 'trace' => $e->getTraceAsString()]);
        }
    }
});

/**
 * Hizmet detayları kaydedildiğinde, enjekte edilen BTK verilerini yakalar ve işler.
 * Bu hook, WHMCS'in "Save Changes" butonu tetiklendiğinde çalışır.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 */
add_hook('AdminServiceEdit', 1, function($vars) {
    // Önce standart hizmet değişikliklerini yakala (paket, domain vb.)
    try {
        BtkHelper::handleServiceEdit($vars);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminServiceEdit (Standart Veri)', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid'] ?? 'N/A', 'vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
    
    // Sonra bizim enjekte ettiğimiz özel BTK verilerini yakala
    if (isset($_POST['btk_service_data']) && is_array($_POST['btk_service_data'])) {
        try {
            \BtkreportsCsrfHelper::verify();
            BtkHelper::handleServiceDetailsSave($vars['serviceid'], $_POST['btk_service_data']);
        } catch (\Exception $e) {
            BtkHelper::logAction('Hook Hatası: AdminServiceEdit (BTK Veri Kaydı)', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid'] ?? 'N/A', 'post_keys' => array_keys($_POST['btk_service_data']), 'trace' => $e->getTraceAsString()]);
        }
    }
});

/**
 * Yeni bir sipariş onaylandığında, ilgili hizmetler için "YENİ ABONELİK" hareketi oluşturur.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 */
add_hook('AfterOrderAccept', 1, function($vars) {
    try {
        BtkHelper::handleOrderAccepted($vars['orderid']);
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterOrderAccept', 'HATA', $e->getMessage(), null, ['orderid' => $vars['orderid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
});

/**
 * Bir hizmet askıya alındığında "HAT DURUM DEĞİŞİKLİĞİ" hareketi oluşturur.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 */
add_hook('AfterModuleSuspend', 1, function($vars) {
    try {
        BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Suspended');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleSuspend', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
});

/**
 * Askıdan çıkarıldığında "HAT DURUM DEĞİŞİKLİĞİ" hareketi oluşturur.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 */
add_hook('AfterModuleUnsuspend', 1, function($vars) {
    try {
        BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Active');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleUnsuspend', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
});

/**
 * Hizmet sonlandırıldığında "HAT İPTAL" hareketi oluşturur.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 */
add_hook('AfterModuleTerminate', 1, function($vars) {
    try {
        BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Terminated');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleTerminate', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['params']['serviceid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
});

/**
 * Hizmet silinme işlemini engeller, BTK kayıt bütünlüğünü korur.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return array Eğer engelleniyorsa ['abort' => true, 'errorMessage' => ...]
 */
add_hook('ServiceDelete', 1, function($vars) {
    try {
        $service = Service::find($vars['serviceid']);
        if ($service && in_array($service->status, ['Active', 'Suspended', 'Terminated', 'Cancelled', 'Fraud'])) { 
            BtkHelper::logAction('Hook: ServiceDelete (Engellendi)', 'UYARI', "ID {$vars['serviceid']} hizmeti aktif, askıda veya sonlandırılmış olduğu için silinemez.", BtkHelper::getCurrentAdminId());
            return ['abort' => true, 'errorMessage' => BtkHelper::getLang('serviceCannotDeleteBtkReason')];
        }
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), null, ['serviceid' => $vars['serviceid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
});

// =================================================================================
// == PERSONEL YÖNETİMİ HOOK'LARI
// =================================================================================

/**
 * Bir admin hesabı kaydedildiğinde, personel tablosunu senkronize eder.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return bool Her zaman true döner.
 */
add_hook('AdminSave', 1, function ($vars) {
    try {
        if (isset($vars['adminid'])) {
            BtkHelper::syncAdminToPersonel($vars['adminid'], $vars);
        }
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminSave', 'HATA', $e->getMessage(), null, ['adminid' => $vars['adminid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
    return true;
});

/**
 * Bir admin hesabı silindiğinde, personel kaydını pasife çeker.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return bool Her zaman true döner.
 */
add_hook('AdminDelete', 1, function ($vars) {
    try {
        if (isset($vars['adminid'])) {
            BtkHelper::handleAdminDelete($vars['adminid']);
        }
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminDelete', 'HATA', $e->getMessage(), null, ['adminid' => $vars['adminid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
    }
    return true;
});

// =================================================================================
// == MÜŞTERİ PANELİ HOOK'LARI (İsteğe bağlı gösterim için)
// =================================================================================

/**
 * Müşteri paneli detaylar sayfasına BTK bilgilerini basar.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return string Eklenecek HTML içeriği.
 */
add_hook('ClientAreaDetailsOutput', 1, function($vars) {
    try {
        if (BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') !== '1') {
            return ''; // Ayar kapalıysa gösterme
        }
        $smarty = new Smarty();
        $smarty->assign('LANG', BtkHelper::loadLang());
        $smarty->assign($vars); // WHMCS'den gelen tüm değişkenleri aktar
        $smarty->assign('btkClientData', BtkHelper::getBtkClientInfoForClientArea($vars['client']->id));
        return $smarty->fetch(__DIR__ . '/templates/clientarea/client_btk_details.tpl');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientAreaDetailsOutput', 'HATA', $e->getMessage(), $vars['client']->id ?? null, ['trace' => $e->getTraceAsString()]);
        return '';
    }
});

/**
 * Müşteri paneli hizmet detayları sayfasına BTK bilgilerini basar.
 * @param array $vars WHMCS tarafından sağlanan hook değişkenleri.
 * @return string Eklenecek HTML içeriği.
 */
add_hook('ClientAreaProductDetailsOutput', 1, function($vars) {
    try {
        if (BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') !== '1') {
            return ''; // Ayar kapalıysa gösterme
        }
        $smarty = new Smarty();
        $smarty->assign('LANG', BtkHelper::loadLang());
        $smarty->assign($vars); // WHMCS'den gelen tüm değişkenleri aktar
        $smarty->assign('btkServiceDetailsData', BtkHelper::getBtkServiceInfoForClientArea($vars['serviceid']));
        return $smarty->fetch(__DIR__ . '/templates/clientarea/service_btk_details.tpl');
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientAreaProductDetailsOutput', 'HATA', $e->getMessage(), $vars['userid'] ?? null, ['serviceid' => $vars['serviceid'] ?? 'N/A', 'trace' => $e->getTraceAsString()]);
        return '';
    }
});

/**
 * Günlük Cron Job Hook'u (İlerideki periyodik kontroller için)
 */
add_hook('DailyCronJob', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: DailyCronJob Tetiklendi (BTK)', 'INFO', 'Günlük BTK periyodik kontrolleri başlatılıyor.');
        // İleride eklenecek vefat sorgusu vb. gibi özellikler burada tetiklenebilir.
    } catch (\Exception $e) {
        BtkHelper::logAction('Hook Hatası: DailyCronJob (BTK)', 'HATA', $e->getMessage(), null, ['trace' => $e->getTraceAsString()]);
    }
});

/**
 * Modül ayarları kaydedildiğinde (Bilgi amaçlı log)
 */
add_hook('AddonConfigSave', 1, function($vars) {
    if (isset($vars['module']) && $vars['module'] === 'btkreports') {
        BtkHelper::logAction('Hook: AddonConfigSave Tetiklendi', 'INFO', 'BTK Raporlama modül ayarları kaydedildi.', BtkHelper::getCurrentAdminId());
    }
});

BtkHelper::logAction('Hooks Dosyası Yüklendi', 'DEBUG', 'btkreports/hooks.php v7.2.6 başarıyla yüklendi.');