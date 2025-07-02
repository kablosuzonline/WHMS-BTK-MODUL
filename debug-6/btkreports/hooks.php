<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Hook Dosyası
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     KablosuzOnline & Gemini AI
 * @version    6.5
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli yardımcı dosyaları ve sınıfları dahil et
$btkHelperHookPath = __DIR__ . '/lib/BtkHelper.php';
if (file_exists($btkHelperHookPath)) {
    require_once $btkHelperHookPath;
} else {
    if (function_exists('logActivity')) {
        logActivity("BTK Reports Hook Critical Error: BtkHelper.php not found at {$btkHelperHookPath}! Hooks will not function.", 0);
    } else {
        error_log("BTK Reports Hook Critical Error: BtkHelper.php not found at {$btkHelperHookPath}! Hooks will not function.");
    }
    return;
}

use WHMCS\Database\Capsule;
use WHMCS\User\Client;
use WHMCS\Service\Service;
use WHMCS\Product\Product;

// --- MÜŞTERİ (Client) İLE İLGİLİ HOOK'LAR ---

add_hook('ClientAdd', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : ($vars['adminid'] ?? null);
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: ClientAdd Tetiklendi', 'INFO', ['client_id' => $vars['userid'], 'status' => $vars['status']], $adminId);
            BtkHelper::handleClientAdd($vars);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAdd', 'HATA', $e->getMessage(), $adminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('ClientEdit', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : ($vars['adminid'] ?? null);
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: ClientEdit Tetiklendi', 'INFO', ['client_id' => $vars['userid'], 'updated_fields_keys' => array_keys($vars)], $adminId);
            BtkHelper::handleClientEdit($vars);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientEdit', 'HATA', $e->getMessage(), $adminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('ClientClose', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: ClientClose Tetiklendi', 'UYARI', ['client_id' => $vars['userid'], 'message' => 'Müşteri hesabı kapatıldı. Tüm aktif hizmetler için BTK iptal işlemleri yapılmalı.'], $adminId);
            BtkHelper::handleClientStatusChange($vars['userid'], 'Closed');
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientClose', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('ClientDelete', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : ($vars['adminid'] ?? null);
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: ClientDelete Tetiklendi', 'KRİTİK UYARI', ['client_id' => $vars['userid'], 'message' => 'Müşteri silinme işlemi! BTK verileri korunmalı, hizmetler iptal edilmeli.'], $adminId);
            BtkHelper::handleClientDelete($vars['userid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientDelete', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('MergeClient', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: MergeClient Tetiklendi', 'UYARI', ['source_client_id' => $vars['userid'], 'target_client_id' => $vars['newuserid'], 'message' => 'Müşteri birleştirme. BTK kayıtları güncellenmeli.'], $adminId);
            BtkHelper::handleMergeClient($vars['userid'], $vars['newuserid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: MergeClient', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});


// --- SİPARİŞ (Order) VE HİZMET (Service/Product) İLE İLGİLİ HOOK'LAR ---

add_hook('AfterOrderAccept', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['orderid'])) {
            BtkHelper::logAction('Hook: AfterOrderAccept Tetiklendi', 'INFO', ['order_id' => $vars['orderid']], $adminId);
            BtkHelper::handleOrderAccepted($vars['orderid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterOrderAccept', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AfterModuleSuspend', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleSuspend Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid'], 'reason' => $vars['params']['reason'] ?? ''], $adminId);
            BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Suspended');
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleSuspend', 'HATA', $e->getMessage(), $adminId, ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : ($vars ? array_keys($vars) : []), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AfterModuleUnsuspend', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleUnsuspend Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], $adminId);
            BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Active');
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleUnsuspend', 'HATA', $e->getMessage(), $adminId, ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : ($vars ? array_keys($vars) : []), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AfterModuleTerminate', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleTerminate Tetiklendi', 'UYARI', ['service_id' => $vars['params']['serviceid'], 'reason' => $vars['params']['reason'] ?? ''], $adminId);
            BtkHelper::handleServiceStatusChange($vars['params']['serviceid'], 'Terminated');
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleTerminate', 'HATA', $e->getMessage(), $adminId, ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : ($vars ? array_keys($vars) : []), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('PreAdminServiceEdit', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            $service = Service::find($vars['serviceid']);
            if ($service && in_array($service->status, ['Terminated', 'Cancelled', 'Fraud'])) {
                BtkHelper::logAction('Hook: PreAdminServiceEdit (Hizmet Düzenleme Engellendi)', 'UYARI', "ID {$vars['serviceid']} hizmeti sonlandırılmış/iptal edilmiş olduğundan düzenlenemez.", $adminId);
                throw new \Exception(BtkHelper::getLang('serviceTerminatedCannotEdit'));
            }
            
            if (isset($_POST['btkservicedata'])) {
                BtkHelper::logAction('Hook: PreAdminServiceEdit (BTK Veri Kaydı)', 'INFO', ['service_id' => $vars['serviceid']], $adminId);
                BtkHelper::handlePreServiceEdit($vars['serviceid'], $_POST['btkservicedata']);
            }
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: PreAdminServiceEdit', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'post_keys' => array_keys($_POST), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AdminServiceEdit', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: AdminServiceEdit Tetiklendi', 'INFO', ['service_id' => $vars['serviceid'], 'updated_fields_keys' => array_keys($vars)], $adminId);
            BtkHelper::handleServiceEdit($vars);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminServiceEdit', 'HATA', $e->getMessage(), $adminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('ServiceDelete', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            $service = Service::find($vars['serviceid']);
            if ($service && in_array($service->status, ['Terminated', 'Cancelled', 'Fraud', 'Active', 'Suspended'])) { 
                BtkHelper::logAction('Hook: ServiceDelete (Engellendi)', 'CRITICAL', "ID {$vars['serviceid']} hizmeti aktif/sonlandırılmış/iptal edilmiş olduğundan silinemez! WHMCS işlemi engellenmeli.", $adminId);
                return ['abort' => true, 'errorMessage' => BtkHelper::getLang('serviceCannotDeleteBtkReason')];
            }
            BtkHelper::logAction('Hook: ServiceDelete Tetiklendi', 'UYARI', ['service_id' => $vars['serviceid'], 'message' => 'Hizmet silinme işlemi. BTK kaydı İPTAL olarak güncellenmeli.'], $adminId);
            BtkHelper::handleServiceDelete($vars['serviceid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AfterProductUpgrade', 1, function($vars) { 
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: AfterProductUpgrade Tetiklendi', 'INFO', ['service_id' => $vars['serviceid'], 'old_package_id' => $vars['originalpackageid'], 'new_package_id' => $vars['newpackageid']], $adminId);
            BtkHelper::handleServicePackageChange($vars);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterProductUpgrade', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

// --- FATURA (Invoice) İLE İLGİLİ HOOK'LAR ---
add_hook('InvoicePaid', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['invoiceid'])) {
            BtkHelper::logAction('Hook: InvoicePaid Tetiklendi', 'DEBUG', ['invoice_id' => $vars['invoiceid']], $adminId);
            BtkHelper::handleInvoicePaid($vars['invoiceid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: InvoicePaid', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('InvoiceCancelled', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['invoiceid'])) {
            BtkHelper::logAction('Hook: InvoiceCancelled Tetiklendi', 'DEBUG', ['invoice_id' => $vars['invoiceid']], $adminId);
            BtkHelper::handleInvoiceCancelled($vars['invoiceid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: InvoiceCancelled', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

// --- PERSONEL (Admin) İLE İLGİLİ HOOK'LAR ---
if (class_exists('WHMCS\Utility\Hook')) {
    WHMCS\Utility\Hook::add('AdminSave', 1, function ($vars) {
        $logAdminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
        try {
            if (class_exists('BtkHelper') && isset($vars['adminid'])) {
                BtkHelper::logAction('Hook: AdminSave Tetiklendi', 'INFO', ['target_admin_id' => $vars['adminid'], 'type' => $vars['type'] ?? 'unknown'], $logAdminId);
                BtkHelper::syncAdminToPersonel($vars['adminid'], $vars);
            }
        } catch (Exception $e) {
            if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminSave', 'HATA', $e->getMessage(), $logAdminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
        }
        return true;
    });

    WHMCS\Utility\Hook::add('AdminDelete', 1, function ($vars) {
        $logAdminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
        try {
            if (class_exists('BtkHelper') && isset($vars['adminid'])) {
                BtkHelper::logAction('Hook: AdminDelete Tetiklendi', 'UYARI', ['target_admin_id' => $vars['adminid'], 'message' => 'Admin silindi. BTK Personel kaydı güncellenmeli.'], $logAdminId);
                BtkHelper::handleAdminDelete($vars['adminid']);
            }
        } catch (Exception $e) {
            if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminDelete', 'HATA', $e->getMessage(), $logAdminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
        }
        return true;
    });
} elseif (class_exists('BtkHelper')) {
    BtkHelper::logAction('Personel Hook Uyarısı', 'WARNING', 'WHMCS sürümü AdminSave/AdminDelete hooklarını desteklemiyor olabilir. Personel senkronizasyonu tam otomatik olmayabilir.');
}

// --- MÜŞTERİ PANELİ (Client Area) İÇİN HOOK'LAR ---
add_hook('ClientAreaDetailsOutput', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return '';
        $clientId = $vars['client']->id ?? null;
        if (!$clientId) return '';

        $showIfEmpty = BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') === '1';
        $btkClientData = BtkHelper::getBtkClientInfoForClientArea($clientId);

        if (empty($btkClientData) && !$showIfEmpty) {
            return '';
        }
        
        $smarty = new Smarty();
        $smarty->assign('LANG', $vars['_lang']);
        $smarty->assign('btkClientData', $btkClientData ?: []); 
        $smarty->assign('btkClientDataLoaded', true);
        
        $tcknMasked = $vars['_lang']['notProvidedOrApplicable'] ?? ($vars['_lang']['notAvailable'] ?? 'N/A');
        if (isset($btkClientData['abone_tc_kimlik_no']) && !empty($btkClientData['abone_tc_kimlik_no'])) {
            $tcknMasked = substr($btkClientData['abone_tc_kimlik_no'], 0, 2) . str_repeat('*', 7) . substr($btkClientData['abone_tc_kimlik_no'], -2);
        }
        $smarty->assign('abone_tc_kimlik_no_masked', $tcknMasked);
        
        $pasaportMasked = $vars['_lang']['notProvidedOrApplicable'] ?? ($vars['_lang']['notAvailable'] ?? 'N/A');
         if (isset($btkClientData['abone_pasaport_no']) && !empty($btkClientData['abone_pasaport_no'])) {
            $pasaportMasked = substr($btkClientData['abone_pasaport_no'], 0, 3) . str_repeat('*', max(0, strlen($btkClientData['abone_pasaport_no']) - 5)) . substr($btkClientData['abone_pasaport_no'], -2);
        }
        $smarty->assign('abone_pasaport_no_masked', $pasaportMasked);

        return $smarty->fetch(__DIR__ . '/templates/clientarea/client_btk_details.tpl');
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAreaDetailsOutput', 'HATA', $e->getMessage(), $vars['client']->id ?? null, ['trace' => substr($e->getTraceAsString(),0,1000)]);
        return '<div class="alert alert-warning">BTK abonelik bilgileri yüklenirken bir sorun oluştu.</div>';
    }
});

add_hook('ClientAreaProductDetailsOutput', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return '';
        $serviceId = $vars['serviceid'] ?? null;
        if (!$serviceId) return '';

        $showIfEmpty = BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') === '1';
        $btkServiceData = BtkHelper::getBtkServiceInfoForClientArea($serviceId);

         if (empty($btkServiceData) && !$showIfEmpty) {
            return '';
        }

        $smarty = new Smarty();
        $smarty->assign('LANG', $vars['_lang']);
        $smarty->assign('btkServiceDetailsData', $btkServiceData ?: []);
        $smarty->assign('btkServiceDataLoaded', true);
        
        return $smarty->fetch(__DIR__ . '/templates/clientarea/service_btk_details.tpl');
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAreaProductDetailsOutput', 'HATA', $e->getMessage(), $vars['userid'] ?? null, ['service_id' => $vars['serviceid'], 'trace' => substr($e->getTraceAsString(),0,1000)]);
        return '<div class="alert alert-warning">Hizmetinize ait BTK detayları yüklenirken bir sorun oluştu.</div>';
    }
});

// --- GÜNLÜK CRON JOB HOOK'U ---
add_hook('DailyCronJob', 1, function($vars) {
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: DailyCronJob Tetiklendi (BTK)', 'INFO', 'Günlük BTK periyodik kontrolleri başlatılıyor.');
            BtkHelper::performDailyBtkChecks(); 
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: DailyCronJob (BTK)', 'HATA', $e->getMessage(), null, ['trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

// --- MODÜL AYARLARI KAYDEDİLDİĞİNDE ---
add_hook('AddonConfigSave', 1, function($vars) {
    if (isset($vars['module']) && $vars['module'] === 'btkreports' && class_exists('BtkHelper')) {
        BtkHelper::logAction('Hook: AddonConfigSave Tetiklendi', 'INFO', 'BTK Raporlama modül ayarları kaydedildi.', BtkHelper::getCurrentAdminId());
    }
});


if (class_exists('BtkHelper')) {
    BtkHelper::logAction('Hooks Dosyası Yüklendi', 'DEBUG', 'btkreports/hooks.php başarıyla yüklendi ve tüm kapsamlı hooklar tanımlandı.');
}
?>