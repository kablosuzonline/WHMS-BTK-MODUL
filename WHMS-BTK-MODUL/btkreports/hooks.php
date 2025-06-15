<?php
/**
 * WHMCS BTK Raporları Modülü - Hook Dosyası
 *
 * WHMCS olaylarını dinleyerek BTK tablolarını günceller, hareketleri oluşturur
 * ve modül arayüzlerini ilgili sayfalara enjekte eder.
 */

if (!defined('WHMCS')) {
    die('This file cannot be accessed directly');
}

// Composer autoload (modül kök dizininde vendor varsa)
if (file_exists(dirname(__FILE__) . '/vendor/autoload.php')) {
    require_once dirname(__FILE__) . '/vendor/autoload.php';
}

// Gerekli sınıfları yükle
$helperPath = __DIR__ . '/app/Helpers/BtkHelper.php';
if (!file_exists($helperPath)) {
    $helperPath = __DIR__ . '/lib/BtkHelper.php'; // Fallback
}
if (file_exists($helperPath)) {
    require_once $helperPath;
} else {
    if (function_exists('logActivity')) { logActivity("BTK Modülü Kritik Hata: BtkHelper.php bulunamadı!", 0); }
    return;
}

// Servis sınıfları (autoload ile yüklenecekler, ama use ile belirtmek iyi pratik)
use WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper;
use WHMCS\Module\Addon\BtkRaporlari\Services\LogService;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService;
use WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService;
use WHMCS\Module\Addon\BtkRaporlari\Services\PersonnelService;
// use WHMCS\Module\Addon\BtkRaporlari\Services\NviVerificationService;

use WHMCS\Database\Capsule;
use WHMCS\Carbon;
use WHMCS\User\Client;
use WHMCS\User\Admin;
use WHMCS\View\Menu\Item as MenuItem; // Client area menü ekleme için
use WHMCS\Config\Setting as WhmcsConfigSetting; // WHMCS Ayarları için
use WHMCS\Session; // Session yönetimi için
use WHMCS\Utility\Protection\CSRF; // CSRF koruması için


// Genel hata yakalama fonksiyonu
if (!function_exists('btkGlobalHookExceptionHandlerForHooksFile')) { // İsim çakışmasını önlemek için daha özel bir isim
    function btkGlobalHookExceptionHandlerForHooksFile(\Exception $e, $hookName, $vars = []) {
        $currentAdminIdHook = $_SESSION['adminid'] ?? 0; // Hook çalışırken session olmayabilir
        $serviceId = $vars['serviceid'] ?? ($vars['params']['serviceid'] ?? ($vars['id'] ?? 'Bilinmiyor'));
        $userId = $vars['userid'] ?? ($vars['params']['userid'] ?? ($vars['clientid'] ?? 'Bilinmiyor'));
        $message = "HOOK ERROR ({$hookName}): ServiceID {$serviceId}, UserID {$userId} - " . $e->getMessage();

        // LogService sınıfının varlığını ve kullanılabilirliğini kontrol et
        if (class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) {
            LogService::add($message, 'CRITICAL', strtoupper($hookName) . '_HOOK_ERROR', ['hook_vars' => $vars, 'exception_class' => get_class($e) ,'exception_trace' => substr($e->getTraceAsString(), 0, 2000)], $currentAdminIdHook);
        } elseif (class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) {
            BtkHelper::logActivity($message . " | Exception: " . substr((string)$e, 0, 1000), $currentAdminIdHook, 'CRITICAL');
        } elseif (function_exists('logActivity')) { // WHMCS global log
            logActivity("BTK Modülü - " . $message . " Detay: " . substr((string)$e, 0, 500), 0);
        }
    }
}


// === CSS ve JS Dosyalarını Yükleme Hook'ları ===

add_hook('AdminAreaHeadOutput', 1, function($vars) {
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return '';
        $moduleLink = $vars['modulelink'] ?? BtkHelper::getModuleAdminUrl();
        $assetsBaseUrl = str_replace('addonmodules.php?module=btkreports', '', $moduleLink);
        if (substr($assetsBaseUrl, -1) !== '/') $assetsBaseUrl .= '/';
        $assetsBaseUrl .= 'modules/addons/btkreports/assets';
        $version = $vars['version'] ?? BtkHelper::getSetting('module_version_from_db', time());

        return <<<HTML
    <link href="{$assetsBaseUrl}/css/btk_admin_style.css?v={$version}" rel="stylesheet" type="text/css" />
HTML;
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AdminAreaHeadOutput', $vars);
        return '';
    }
});

add_hook('AdminAreaFooterOutput', 1, function($vars) {
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return '';
        $moduleLink = $vars['modulelink'] ?? BtkHelper::getModuleAdminUrl();
        $assetsBaseUrl = str_replace('addonmodules.php?module=btkreports', '', $moduleLink);
        if (substr($assetsBaseUrl, -1) !== '/') $assetsBaseUrl .= '/';
        $assetsBaseUrl .= 'modules/addons/btkreports/assets';
        $version = $vars['version'] ?? BtkHelper::getSetting('module_version_from_db', time());
        $csrfToken = CSRF::getToken();
        $_LANG_Hook = $GLOBALS['_LANG'] ?? []; // Dil değişkenlerini al

        $jsOutput = "<script type=\"text/javascript\">
            var btkModuleLink = '{$moduleLink}';
            var btkCsrfToken = '{$csrfToken}';
            var btkLang = {
                please_select: '{$_LANG_Hook['please_select']|escape:'javascript'}'
                // Diğer gerekli dil değişkenleri eklenebilir
            };
        </script>";
        $jsOutput .= "<script type=\"text/javascript\" src=\"{$assetsBaseUrl}/js/btk_admin_scripts.js?v={$version}\"></script>";
        return $jsOutput;
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AdminAreaFooterOutput', $vars);
        return '';
    }
});

// === Müşteri (Client) ile İlgili Hook'lar ===

add_hook('ClientAdd', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) return;
        $userId = $vars['userid'];
        LogService::add("Yeni müşteri eklendi (ClientAdd Hook). UserID: {$userId}. BTK bilgileri için admin girişi bekleniyor.", 'INFO', 'CLIENT_ADD', ['client_vars' => $vars], $currentAdminIdHook);
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'ClientAdd', $vars, $currentAdminIdHook);
    }
});

add_hook('ClientEdit', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) return;
        $userId = $vars['userid'];
        $updatedWhmcsFields = $vars['updatedfields'] ?? [];
        $oldWhmcsData = $vars['olddata'] ?? [];

        if (empty($updatedWhmcsFields)) return;

        $btkRelevantWhmcsFieldsMap = [
            'firstname' => 'ABONE_ADI', 'lastname' => 'ABONE_SOYADI', 'companyname' => 'ABONE_UNVAN',
            'email' => 'ABONE_ADRES_E_MAIL', 'phonenumber' => 'ABONE_ADRES_IRTIBAT_TEL_NO_1',
            'tax_id' => 'ABONE_VERGI_NUMARASI'
        ];
        $changedForBtkLog = [];
        $btkUpdateNeeded = false;

        foreach ($btkRelevantWhmcsFieldsMap as $whmcsField => $btkField) {
            if (array_key_exists($whmcsField, $updatedWhmcsFields)) {
                $oldValue = $oldWhmcsData[$whmcsField] ?? null;
                $newValue = $updatedWhmcsFields[$whmcsField];
                if ((string)$oldValue !== (string)$newValue) {
                    $changedForBtkLog[$btkField] = "'{$oldValue}' -> '{$newValue}'";
                    $btkUpdateNeeded = true;
                }
            }
        }

        if ($btkUpdateNeeded) {
            LogService::add("WHMCS müşteri alanları güncellendi (ClientEdit Hook). UserID: {$userId}. Değişenler: " . json_encode($changedForBtkLog), 'INFO', 'CLIENT_EDIT_WHMCS', ['client_vars' => $vars], $currentAdminIdHook);
            // Bu değişikliklerin müşterinin tüm hizmetlerine yansıtılması ve hareket oluşturulması
            // `SubscriberGuideService::updateClientDetailsForAllServices` tarafından yönetilecek,
            // bu genellikle admin panelindeki BTK formu kaydetme (`saveclientbtkdata` action) ile tetiklenir.
            // Bu hook'un direkt büyük bir güncelleme yapması yerine, admini uyarması veya
            // `saveclientbtkdata` ile çakışmaması için dikkatli bir mantık kurulması gerekebilir.
        }
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'ClientEdit', $vars, $currentAdminIdHook);
    }
});

add_hook('ClientDelete', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') || !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService')) return;
        $userId = $vars['userid'];
        LogService::add("Müşteri silindi (ClientDelete Hook). UserID: {$userId}. Tüm hizmetleri için BTK iptal işlemleri başlatılıyor.", 'WARNING', 'CLIENT_DELETE_START', ['client_vars' => $vars], $currentAdminIdHook);
        SubscriberGuideService::handleClientDeletionForAllServices($userId);
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'ClientDelete', $vars, $currentAdminIdHook);
    }
});

// --- Bölüm 1 Sonu (Hooks.php Tam Sürüm) ---

// ... (Bir önceki bölümdeki kodlar, use ifadeleri ve fonksiyonlar burada devam ediyor) ...

// === Sipariş ve Hizmet (Order & Service) ile İlgili Hook'lar ===

/**
 * Yeni bir sipariş kabul edildiğinde çalışır.
 * Genellikle hizmetler henüz aktif edilmemiştir. Sadece loglama amaçlı kullanılabilir.
 */
add_hook('AcceptOrder', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService')) return;
        $orderId = $vars['orderid'];
        $userId = $vars['userid'];
        $serviceIds = $vars['serviceids'] ?? [];
        LogService::add("Sipariş kabul edildi (AcceptOrder). OrderID {$orderId}, UserID {$userId}. Hizmet ID'leri: " . implode(',', $serviceIds), 'DEBUG', 'ORDER_ACCEPT', ['order_vars' => $vars], $currentAdminIdHook);
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AcceptOrder', $vars, $currentAdminIdHook);
    }
});

/**
 * Bir ürün/hizmet için modül oluşturma komutu (create account) tamamlandığında çalışır.
 * "YENI ABONELIK KAYDI" (kod 1) hareketi oluşturur.
 */
add_hook('AfterModuleCreate', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return;

        $params = $vars['params'] ?? [];
        $serviceId = $params['serviceid'] ?? null;
        $userId = $params['userid'] ?? null;

        if (!$serviceId || !$userId) {
            LogService::add("AfterModuleCreate hook: ServiceID veya UserID eksik.", 'WARNING', 'SERVICE_CREATE_MISSING_PARAMS', ['hook_vars' => $vars], $currentAdminIdHook);
            return;
        }

        LogService::add("Hizmet oluşturuldu/aktive edildi (AfterModuleCreate). ServiceID: {$serviceId}", 'INFO', 'SERVICE_CREATE_START', ['service_id' => $serviceId, 'user_id' => $userId], $currentAdminIdHook);

        $rehberKaydi = SubscriberGuideService::createOrUpdateForNewService($serviceId, $userId, $params);
        if (!$rehberKaydi) {
            LogService::add("AfterModuleCreate: ServiceID {$serviceId} için rehber kaydı oluşturulamadı/güncellenemedi. BTK form bilgileri eksik olabilir.", 'ERROR', 'SERVICE_CREATE_REHBER_FAIL', ['service_id' => $serviceId], $currentAdminIdHook);
            return;
        }

        $hareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '1', 'YENI ABONELIK KAYDI');
        SubscriberActivityService::createActivity(
            $serviceId,
            $userId,
            '1', // MUSTERI_HAREKET_KODU
            $hareketAciklama,
            (array)$rehberKaydi // Rehber kaydından güncel tüm BTK alanları
        );
        LogService::add("AfterModuleCreate: ServiceID {$serviceId} için 'YENI ABONELIK' hareketi oluşturuldu.", 'SUCCESS', 'SERVICE_CREATE_ACTIVITY_SUCCESS', ['service_id' => $serviceId], $currentAdminIdHook);

    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AfterModuleCreate', $vars, $currentAdminIdHook);
    }
});

/**
 * Hizmet askıya alındığında çalışır.
 * HAT_DURUM = 'D' (Dondurulmuş) için hareket oluşturur.
 */
add_hook('AfterModuleSuspend', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return;

        $params = $vars['params'] ?? [];
        $serviceId = $params['serviceid'] ?? null;
        $userId = $params['userid'] ?? null;

        if (!$serviceId || !$userId) {
            LogService::add("AfterModuleSuspend hook: ServiceID veya UserID eksik.", 'WARNING', 'SERVICE_SUSPEND_MISSING_PARAMS', ['hook_vars' => $vars], $currentAdminIdHook);
            return;
        }

        $suspendReason = $params['suspendreason'] ?? '';
        LogService::add("Hizmet askıya alındı (AfterModuleSuspend). ServiceID: {$serviceId}, Sebep: {$suspendReason}", 'INFO', 'SERVICE_SUSPEND_START', ['service_id' => $serviceId, 'user_id' => $userId, 'reason' => $suspendReason], $currentAdminIdHook);

        $hatDurumKodu = '18'; // Varsayılan: DONDURULMUŞ_DİĞER
        if (stripos($suspendReason, 'borç') !== false || stripos($suspendReason, 'overdue') !== false || stripos($suspendReason, 'ödeme') !== false) {
            $hatDurumKodu = '17';
        } elseif (!empty($suspendReason)) {
            $hatDurumKodu = '16';
        }
        $hatDurumKoduAciklama = BtkHelper::getBtkReferenceValue('hat_durum_kodlari', $hatDurumKodu);

        $updatedRehberData = SubscriberGuideService::updateStatus($serviceId, 'D', $hatDurumKodu, $hatDurumKoduAciklama);
        if (!$updatedRehberData) {
            LogService::add("AfterModuleSuspend: ServiceID {$serviceId} için rehber durumu güncellenemedi.", 'ERROR', 'SERVICE_SUSPEND_REHBER_FAIL', ['service_id' => $serviceId], $currentAdminIdHook);
            return;
        }

        $hareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '10', 'HAT DURUM DEGISIKLIGI');
        SubscriberActivityService::createActivity($serviceId, $userId, '10', $hareketAciklama, (array)$updatedRehberData);
        LogService::add("AfterModuleSuspend: ServiceID {$serviceId} için 'HAT DURUM DEGISIKLIGI (DONDURMA)' hareketi oluşturuldu.", 'SUCCESS', 'SERVICE_SUSPEND_ACTIVITY_SUCCESS', ['service_id' => $serviceId], $currentAdminIdHook);

    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AfterModuleSuspend', $vars, $currentAdminIdHook);
    }
});

/**
 * Hizmet askıdan çıkarıldığında çalışır.
 * HAT_DURUM = 'A' (Aktif) için hareket oluşturur. İptal edilmişse engeller.
 */
add_hook('AfterModuleUnsuspend', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return;

        $params = $vars['params'] ?? [];
        $serviceId = $params['serviceid'] ?? null;
        $userId = $params['userid'] ?? null;

        if (!$serviceId || !$userId) {
            LogService::add("AfterModuleUnsuspend hook: ServiceID veya UserID eksik.", 'WARNING', 'SERVICE_UNSUSPEND_MISSING_PARAMS', ['hook_vars' => $vars], $currentAdminIdHook);
            return;
        }

        if (SubscriberGuideService::isBtkCancelled($serviceId)) {
            $message = "AfterModuleUnsuspend: ServiceID {$serviceId} daha önce BTK'ya 'İptal' edilmiş. Tekrar aktive edilemez! Lütfen hizmeti manuel olarak tekrar uygun duruma getirin.";
            LogService::add($message, 'CRITICAL', 'SERVICE_UNSUSPEND_BLOCKED_CANCELLED', ['service_id' => $serviceId], $currentAdminIdHook);
            // Otomatik olarak tekrar askıya al veya sonlandır
            localAPI('UpdateClientProduct', ['serviceid' => $serviceId, 'status' => 'Suspended', 'suspendreason' => 'BTK İptal Kaydı Mevcut - Otomatik Askıya Alındı']);
            return;
        }

        LogService::add("Hizmet askıdan çıkarıldı (AfterModuleUnsuspend). ServiceID: {$serviceId}", 'INFO', 'SERVICE_UNSUSPEND_START', ['service_id' => $serviceId, 'user_id' => $userId], $currentAdminIdHook);

        $hatDurumKodu = '1';
        $hatDurumKoduAciklama = BtkHelper::getBtkReferenceValue('hat_durum_kodlari', $hatDurumKodu, 'AKTIF');
        $updatedRehberData = SubscriberGuideService::updateStatus($serviceId, 'A', $hatDurumKodu, $hatDurumKoduAciklama);

        if (!$updatedRehberData) {
            LogService::add("AfterModuleUnsuspend: ServiceID {$serviceId} için rehber durumu güncellenemedi.", 'ERROR', 'SERVICE_UNSUSPEND_REHBER_FAIL', ['service_id' => $serviceId], $currentAdminIdHook);
            return;
        }

        $hareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '10', 'HAT DURUM DEGISIKLIGI');
        SubscriberActivityService::createActivity($serviceId, $userId, '10', $hareketAciklama, (array)$updatedRehberData);
        LogService::add("AfterModuleUnsuspend: ServiceID {$serviceId} için 'HAT DURUM DEGISIKLIGI (AKTIF)' hareketi oluşturuldu.", 'SUCCESS', 'SERVICE_UNSUSPEND_ACTIVITY_SUCCESS', ['service_id' => $serviceId], $currentAdminIdHook);

    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AfterModuleUnsuspend', $vars, $currentAdminIdHook);
    }
});
-- Bölüm 2 Sonu (Hooks.php Tam Sürüm) ---

// ... (Bir önceki bölümdeki kodlar, use ifadeleri ve fonksiyonlar burada devam ediyor) ...

/**
 * Hizmet sonlandırıldığında çalışır.
 * "ABONE IPTAL KAYDI" (kod 2) hareketi oluşturur.
 */
add_hook('AfterModuleTerminate', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return;

        $params = $vars['params'] ?? [];
        $serviceId = $params['serviceid'] ?? null;
        $userId = $params['userid'] ?? null;

        if (!$serviceId || !$userId) {
            LogService::add("AfterModuleTerminate hook: ServiceID veya UserID eksik.", 'WARNING', 'SERVICE_TERMINATE_MISSING_PARAMS', ['hook_vars' => $vars], $currentAdminIdHook);
            return;
        }

        $terminateReason = $params['terminatereason'] ?? ($vars['params']['เซอร์วิส_cancellation_reason'] ?? ''); // WHMCS bazen farklı parametre adı kullanabilir
        LogService::add("Hizmet sonlandırıldı (AfterModuleTerminate). ServiceID: {$serviceId}, Sebep: {$terminateReason}", 'INFO', 'SERVICE_TERMINATE_START', ['service_id' => $serviceId, 'user_id' => $userId, 'reason' => $terminateReason], $currentAdminIdHook);

        $iptalTarihiBtkFormat = BtkHelper::getBtkDateTimeFormat();
        $hatDurumKodu = '5'; // Varsayılan: IPTAL_ABONE_ISTEGI
        if (stripos($terminateReason, 'borç') !== false || stripos($terminateReason, 'overdue') !== false || stripos($terminateReason, 'ödeme') !== false) { $hatDurumKodu = '2'; }
        elseif (stripos($terminateReason, 'nakil') !== false) { $hatDurumKodu = '3'; }
        elseif (stripos($terminateReason, 'devir') !== false) { $hatDurumKodu = '6'; }
        elseif (stripos($terminateReason, 'vefat') !== false) { $hatDurumKodu = '7'; }
        elseif (stripos($terminateReason, 'şirket kapandı') !== false || stripos($terminateReason, 'firma kapandı') !== false) { $hatDurumKodu = '8'; }
        elseif (stripos($terminateReason, 'sözleşme aykırı') !== false) { $hatDurumKodu = '9'; }
        elseif (stripos($terminateReason, 'kayıp') !== false || stripos($terminateReason, 'çalıntı') !== false) { $hatDurumKodu = '10'; }
        elseif (stripos($terminateReason, 'numara taşıma') !== false || stripos($terminateReason, 'taşındı') !== false) { $hatDurumKodu = '19'; }
        elseif (!empty($terminateReason)) { $hatDurumKodu = '11'; } // IPTAL_DİĞER
        $hatDurumKoduAciklama = BtkHelper::getBtkReferenceValue('hat_durum_kodlari', $hatDurumKodu);

        $updatedRehberData = SubscriberGuideService::terminateService($serviceId, $iptalTarihiBtkFormat, $hatDurumKodu, $hatDurumKoduAciklama);
        if (!$updatedRehberData) {
            LogService::add("AfterModuleTerminate: ServiceID {$serviceId} için rehber durumu 'İptal' olarak güncellenemedi.", 'ERROR', 'SERVICE_TERMINATE_REHBER_FAIL', ['service_id' => $serviceId], $currentAdminIdHook);
            return;
        }

        $hareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '2', 'ABONE IPTAL KAYDI');
        SubscriberActivityService::createActivity($serviceId, $userId, '2', $hareketAciklama, (array)$updatedRehberData);
        LogService::add("AfterModuleTerminate: ServiceID {$serviceId} için 'ABONE IPTAL KAYDI' hareketi oluşturuldu.", 'SUCCESS', 'SERVICE_TERMINATE_ACTIVITY_SUCCESS', ['service_id' => $serviceId], $currentAdminIdHook);

    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AfterModuleTerminate', $vars, $currentAdminIdHook);
    }
});

/**
 * Hizmet paketi değiştirildiğinde çalışır. "TARIFE DEGISIKLIGI KAYDI" (kod 8) hareketi oluşturur.
 */
add_hook('ServiceUpgrade', 1, function($vars) { // Hem upgrade hem downgrade için
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return;

        $serviceId = $vars['serviceid'];
        $serviceData = Capsule::table('tblhosting')->find($serviceId);
        if (!$serviceData) {
             LogService::add("ServiceUpgrade hook: Hizmet bulunamadı. ServiceID: {$serviceId}", 'WARNING', 'SERVICE_UPGRADE_NO_SERVICE', ['hook_vars' => $vars], $currentAdminIdHook);
            return;
        }
        $userId = $serviceData->userid;

        $newProductId = $vars['newproductid'];
        $newProduct = Capsule::table('tblproducts')->find($newProductId);
        $newTarife = $newProduct ? $newProduct->name : 'Bilinmeyen Yeni Tarife';

        LogService::add("Hizmet paketi değiştirildi (ServiceUpgrade). ServiceID: {$serviceId}, Yeni Ürün ID: {$newProductId}", 'INFO', 'SERVICE_UPGRADE_START', ['service_id' => $serviceId, 'user_id' => $userId, 'new_pid' => $newProductId], $currentAdminIdHook);

        $rehberKaydi = SubscriberGuideService::getServiceBtkData($serviceId);
        if (!$rehberKaydi) {
            LogService::add("ServiceUpgrade: ServiceID {$serviceId} için rehber kaydı bulunamadı. Tarife güncellenemedi.", 'ERROR', 'SERVICE_UPGRADE_REHBER_NOT_FOUND', ['service_id' => $serviceId], $currentAdminIdHook);
            // Yeni bir hizmet gibi işlem yapabiliriz, eğer rehber kaydı hiç yoksa.
            // $rehberKaydi = SubscriberGuideService::createOrUpdateForNewService($serviceId, $userId, $vars['params'] ?? []);
            // if (!$rehberKaydi) return;
            return; // Rehber kaydı olmadan devam etme
        }

        $updateDataRehber = [
            'ABONE_TARIFE' => $newTarife,
            'MUSTERI_HAREKET_KODU' => '8',
            'MUSTERI_HAREKET_ACIKLAMA' => BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '8', 'TARIFE DEGISIKLIGI KAYDI'),
            'MUSTERI_HAREKET_ZAMANI' => BtkHelper::getBtkDateTimeFormat(),
            'updated_at' => Carbon::now()
        ];
        Capsule::table('mod_btk_abone_rehber')->where('id', $rehberKaydi->id)->update($updateDataRehber);
        $updatedRehberData = SubscriberGuideService::getServiceBtkData($serviceId);

        $hareketAciklama = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '8', 'TARIFE DEGISIKLIGI KAYDI');
        SubscriberActivityService::createActivity($serviceId, $userId, '8', $hareketAciklama, (array)$updatedRehberData);
        LogService::add("ServiceUpgrade: ServiceID {$serviceId} için 'TARIFE DEGISIKLIGI KAYDI' hareketi oluşturuldu.", 'SUCCESS', 'SERVICE_UPGRADE_ACTIVITY_SUCCESS', ['service_id' => $serviceId], $currentAdminIdHook);

    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'ServiceUpgrade', $vars, $currentAdminIdHook);
    }
});

/**
 * WHMCS admin panelinden bir hizmetin standart alanları (örn: domain, dedicatedip) güncellendiğinde çalışır.
 * Bu hook, bizim özel BTK formumuzdan yapılan değişiklikleri değil, WHMCS'in kendi
 * "Save Changes" butonuyla yapılan değişiklikleri yakalar.
 * Eğer BTK'yı etkileyen bir değişiklik varsa, "ABONE BILGI GUNCELLEME" hareketi oluşturulabilir.
 */
add_hook('ServiceEdit', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\LogService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberGuideService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\SubscriberActivityService') ||
            !class_exists('WHMCS\Module\Addon\BtkRaporlari\Helpers\BtkHelper')) return;

        $serviceId = $vars['serviceid'];
        $userId = $vars['userid'];
        $modifications = $vars['modifications'] ?? [];

        if (empty($modifications)) return;

        $btkRelevantWhmcsServiceFieldsMap = [
            'domain' => 'HAT_NO', // Eğer HAT_NO domain ile eşleşiyorsa
            'dedicatedip' => 'STATIK_IP',
            'username' => 'ISS_KULLANICI_ADI',
            'server' => 'ISS_POP_BILGISI', // Sunucu değişimi POP'u etkileyebilir
        ];
        $triggerServiceBtkUpdate = false;
        $changedForLog = [];

        foreach($modifications as $field => $values) {
            if (array_key_exists($field, $btkRelevantWhmcsServiceFieldsMap)) {
                 if ((string)($values['oldvalue'] ?? '') !== (string)($values['newvalue'] ?? '')) {
                    $changedForLog[$btkRelevantWhmcsServiceFieldsMap[$field]] = "'{$values['oldvalue']}' -> '{$values['newvalue']}'";
                    $triggerServiceBtkUpdate = true;
                }
            }
        }

        if ($triggerServiceBtkUpdate) {
            LogService::add("WHMCS hizmet standart alanları güncellendi (ServiceEdit Hook). ServiceID: {$serviceId}. Değişenler: " . json_encode($changedForLog), 'INFO', 'SERVICE_EDIT_WHMCS_FIELDS', ['service_vars' => $vars], $currentAdminIdHook);

            // Bu değişikliklerin `mod_btk_abone_rehber`'e yansıtılması ve hareket oluşturulması gerekir.
            // `SubscriberGuideService::updateServiceDetailsFromAdminForm` benzeri bir metod çağrılabilir,
            // ancak bu sefer $postData yerine $modifications'tan veri alınır.
            // VEYA, en basiti, bu hook tetiklendikten sonra, `mod_btk_abone_rehber`'deki güncel kaydı alıp
            // "ABONE BILGI GUNCELLEME" hareketi oluşturmaktır.
            // `saveservicebtkdata` action'ı zaten bu işi yapacağı için, çakışmayı önlemek adına
            // bu hook sadece bir log atabilir veya sadece `mod_btk_abone_rehber`i güncelleyip
            // hareket oluşturmayı `saveservicebtkdata`'ya bırakabilir.
            // Şimdilik, hareket oluşturmayı `saveservicebtkdata`'ya bırakıyoruz.
            // Sadece rehberdeki ilgili alanları güncelleyelim.
            $updateDataRehber = [];
            if(isset($modifications['dedicatedip'])) $updateDataRehber['STATIK_IP'] = $modifications['dedicatedip']['newvalue'];
            if(isset($modifications['username'])) $updateDataRehber['ISS_KULLANICI_ADI'] = $modifications['username']['newvalue'];
            // HAT_NO ve ISS_POP_BILGISI için daha karmaşık mantık gerekebilir.

            if(!empty($updateDataRehber)){
                $updateDataRehber['MUSTERI_HAREKET_KODU'] = '3';
                $updateDataRehber['MUSTERI_HAREKET_ACIKLAMA'] = BtkHelper::getBtkReferenceValue('musteri_hareket_kodlari', '3', 'ABONE BILGI GUNCELLEME');
                $updateDataRehber['MUSTERI_HAREKET_ZAMANI'] = BtkHelper::getBtkDateTimeFormat();
                $updateDataRehber['updated_at'] = Carbon::now();
                Capsule::table('mod_btk_abone_rehber')->where('whmcs_service_id', $serviceId)->update($updateDataRehber);
                LogService::add("ServiceEdit Hook: ServiceID {$serviceId} için rehberdeki bazı standart alanlar güncellendi. Hareket oluşturma BTK formu kaydetme işlemine bırakıldı.", 'INFO', 'SERVICE_EDIT_WHMCS_REHBER_UPDATE', ['service_id' => $serviceId], $currentAdminIdHook);
            }
        }
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'ServiceEdit', $vars, $currentAdminIdHook);
    }
});


// --- Admin Kullanıcısı ile İlgili Hook'lar (Personel Tablosu İçin) ---
add_hook('AdminAdd', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0; // İşlemi yapan admin
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\PersonnelService')) return;
        // PersonnelService::addWhmcsAdminsToBtkList metodunun içinde zaten loglama var.
        PersonnelService::addWhmcsAdminsToBtkList([$vars['adminid']]);
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AdminAdd', $vars, $currentAdminIdHook);
    }
});

add_hook('AdminEdit', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\PersonnelService')) return;
        $adminId = $vars['adminid'];
        $adminInfo = $vars['admin_info'] ?? [];
        $dataToUpdate = [];

        if (isset($adminInfo['roleid'])) {
            $role = Capsule::table('tbladminroles')->find($adminInfo['roleid']);
            $dataToUpdate['unvan_gorev'] = $role ? $role->name : 'Yönetici';
        }

        if (!empty($dataToUpdate)) {
            $personel = Capsule::table('mod_btk_personel')->where('admin_id', $adminId)->first();
            if ($personel) {
                PersonnelService::updateBtkPersonnel($personel->id, $dataToUpdate);
            } else {
                LogService::add("AdminEdit Hook: AdminID {$adminId} için mod_btk_personel kaydı bulunamadı. Güncelleme yapılamadı.", 'WARNING', 'ADMIN_EDIT_NO_PERSONNEL', ['admin_id' => $adminId], $currentAdminIdHook);
            }
        }
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AdminEdit', $vars, $currentAdminIdHook);
    }
});

add_hook('AdminDelete', 1, function($vars) {
    $currentAdminIdHook = $_SESSION['adminid'] ?? 0;
    try {
        if (!class_exists('WHMCS\Module\Addon\BtkRaporlari\Services\PersonnelService')) return;
        $adminId = $vars['adminid'];
        $personel = Capsule::table('mod_btk_personel')->where('admin_id', $adminId)->first();
        if ($personel) {
            PersonnelService::updateBtkPersonnel($personel->id, [
                'isten_ayrilma_tarihi' => Carbon::now()->toDateString(),
                'btk_listesine_eklensin' => 0
            ]);
            LogService::add("Admin silindi (AdminDelete Hook). Personel kaydı (ID: {$personel->id}) işten ayrıldı olarak işaretlendi.", 'INFO', 'ADMIN_DELETE_PERSONNEL_UPDATED', ['admin_id' => $adminId, 'personnel_id' => $personel->id], $currentAdminIdHook);
        } else {
            LogService::add("Admin silindi (AdminDelete Hook). AdminID {$adminId} için mod_btk_personel kaydı bulunamadı.", 'WARNING', 'ADMIN_DELETE_NO_PERSONNEL', ['admin_id' => $adminId], $currentAdminIdHook);
        }
    } catch (\Exception $e) {
        btkGlobalHookExceptionHandlerForHooksFile($e, 'AdminDelete', $vars, $currentAdminIdHook);
    }
});


// --- Admin Arayüzü Enjeksiyon Hook'ları ---
// Bu hook'lar, btkreports.php'deki output() fonksiyonu tarafından ele alınacak.
// Buradaki amaç, WHMCS'e bu noktalarda bir şeyler eklemek istediğimizi bildirmek.
// Gerçek HTML çıktısı output() fonksiyonu tarafından üretilecek.

add_hook('AdminAreaClientSummaryPageOutput', 1, function($vars) {
    // Bu hook yerine ClientProfileTabFields daha modern ve kullanışlıdır.
    // Ancak bazı özet bilgiler buraya da eklenebilir.
    // Örnek: return '<div class="btk-client-summary-widget">...BTK Özet...</div>';
    // Bu HTML'i üretmek için btkreports_output'ta özel bir action çağrılabilir.
    return '';
});

add_hook('ClientProfileTabFields', 1, function($vars) {
    // Bu hook, btkreports.php'deki 'output' fonksiyonunun
    // `action=getClientProfileTabContent&userid={$vars['userid']}` gibi bir URL'yi
    // çağırıp dönen HTML'i kullanmasıyla çalışabilir.
    // Ya da doğrudan burada Smarty ile render edilebilir.
    // Şimdilik, btkreports.php'nin bu hook'u yakalayıp içerik döndüreceğini varsayalım.
    $moduleLink = BtkHelper::getModuleAdminUrl(['action' => 'getClientProfileTabContent', 'userid' => $vars['userid'], 'ajax' => 1]);
    // return ['BTK Bilgileri' => '<iframe src="' . $moduleLink . '" style="width:100%; height:600px; border:none;"></iframe>']; // Iframe kötü bir çözüm
    // En iyisi, btkreports.php output() içinde bu hook'u handle edip $vars['smarty'] ile template render etmek.
    // Bu hook'un bir dizi döndürmesi gerekiyor: ['Sekme Başlığı' => 'Sekme İçeriği HTML']
    // Bu nedenle, bu hook'un içini doldurmak yerine, btkreports_output içinde bu hook'u kontrol edip
    // $vars['tabs'] dizisine ekleme yapmak daha doğru olabilir.
    // Ya da:
    if (function_exists('btkreports_get_client_profile_tab_content')) {
         return btkreports_get_client_profile_tab_content($vars);
    }
    return [];
});

add_hook('AdminAreaServiceDetailsOutput', 1, function($vars) {
    // Benzer şekilde, hizmet detayları için.
    // if (function_exists('btkreports_get_service_details_output')) {
    //      return btkreports_get_service_details_output($vars); // Birden fazla blok döndürebilir
    // }
    return [];
});


// --- Müşteri Paneli Enjeksiyon Hook'ları ---
// Bunlar da btkreports.php output() içinde yönetilecek.
add_hook('ClientAreaPageDetails', 1, function ($vars) { return []; });
add_hook('ClientAreaPageViewProductDetails', 1, function ($vars) { return []; });

// Client Area için özel menü öğesi
add_hook('ClientAreaPrimaryNavbar', 1, function (MenuItem $primaryNavbar) {
    if (!is_null($primaryNavbar->getChild('Account'))) {
        $primaryNavbar->getChild('Account')
            ->addChild('BTK Bilgilerim', [
                'label' => 'BTK Bilgilerim', // Dil dosyasından gelmeli
                'uri' => 'index.php?m=btkreports&action=clientdetails', // Bu action btkreports.php'de tanımlanmalı
                'order' => 25,
                'icon' => 'fa-shield-alt',
            ]);
    }
});
add_hook('ClientAreaPrimarySidebar', 1, function(MenuItem $primarySidebar) {
    if (!is_null($primarySidebar->getChild('My Account'))) {
        $primarySidebar->getChild('My Account')
            ->addChild('BTK Bilgilerim Sidebar', [
                'label' => 'BTK Bilgilerim',
                'uri' => 'index.php?m=btkreports&action=clientdetails',
                'order' => 25,
                'icon' => 'fa-shield-alt',
            ]);
    }
});


// Bu dosyadaki TODO yorumları, ilgili servis metodlarının tamamlanması ve
// hook'ların bu metodları doğru parametrelerle çağırması gerektiğini belirtir.
// Hata yönetimi ve loglama, her hook için kritik öneme sahiptir.

?>