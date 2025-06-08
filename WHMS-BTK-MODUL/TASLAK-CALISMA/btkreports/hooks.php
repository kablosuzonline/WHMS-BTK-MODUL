<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Hook Dosyası
 *
 * Bu dosya, WHMCS içindeki çeşitli olaylara (hook point) müdahale ederek
 * BTK Raporlama modülünün ilgili fonksiyonlarını tetikler.
 * ABONE REHBER ve ABONE HAREKET tablolarının güncel tutulması hedeflenir.
 *
 * @package    WHMCS
 * @subpackage BTKReports
 * @author     [Üstadım & Sizin Adınız/Şirketiniz Gelecek]
 * @version    6.0.0
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

// --- MÜŞTERİ (Client) İLE İLGİLİ HOOK'LAR ---

add_hook('ClientAdd', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: ClientAdd Tetiklendi', 'DEBUG', ['client_id' => $vars['userid'], 'data_summary' => ['email' => $vars['email']]], $vars['adminid'] ?? BtkHelper::getCurrentAdminId());
        BtkHelper::handleClientAdd($vars);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientAdd', 'HATA', $e->getMessage(), $vars['adminid'] ?? BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('ClientEdit', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: ClientEdit Tetiklendi', 'DEBUG', ['client_id' => $vars['userid']], $vars['adminid'] ?? BtkHelper::getCurrentAdminId());
        BtkHelper::handleClientEdit($vars);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientEdit', 'HATA', $e->getMessage(), $vars['adminid'] ?? BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('ClientClose', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: ClientClose Tetiklendi', 'UYARI', ['client_id' => $vars['userid'], 'message' => 'Müşteri hesabı kapatıldı. Tüm aktif hizmetler için BTK iptal işlemleri yapılmalı.'], BtkHelper::getCurrentAdminId());
        BtkHelper::handleClientClose($vars['userid']);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientClose', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('ClientDelete', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: ClientDelete Tetiklendi', 'KRİTİK UYARI', ['client_id' => $vars['userid'], 'message' => 'Müşteri silinme işlemi! BTK verileri korunmalı ve ilişkili tüm hizmetler kalıcı olarak iptal (ABONE_BITIS) olarak işaretlenmeli.'], $vars['adminid'] ?? BtkHelper::getCurrentAdminId());
        BtkHelper::handleClientDelete($vars['userid']);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: ClientDelete', 'HATA', $e->getMessage(), $vars['adminid'] ?? BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('MergeClient', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: MergeClient Tetiklendi', 'UYARI', ['source_client_id' => $vars['userid'], 'target_client_id' => $vars['newuserid'], 'message' => 'Müşteri birleştirme işlemi. BTK kayıtları hedef müşteriye aktarılmalı, kaynak pasife çekilmeli.'], BtkHelper::getCurrentAdminId());
        BtkHelper::handleMergeClient($vars['userid'], $vars['newuserid']);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: MergeClient', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});


// --- SİPARİŞ (Order) VE HİZMET (Service/Product) İLE İLGİLİ HOOK'LAR ---

add_hook('OrderCreated', 1, function($vars) { // WHMCS 8+
    try {
        BtkHelper::logAction('Hook: OrderCreated Tetiklendi', 'DEBUG', ['order_id' => $vars['orderId'], 'user_id' => $vars['userId']], BtkHelper::getCurrentAdminId());
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: OrderCreated', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('AfterShoppingCartCheckout', 1, function($vars) {
    try {
        BtkHelper::logAction('Hook: AfterShoppingCartCheckout Tetiklendi', 'DEBUG', ['order_id' => $vars['OrderID'], 'invoice_id' => $vars['InvoiceID']], BtkHelper::getCurrentAdminId());
        // BtkHelper::handleOrderCompletion($vars['OrderID']);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterShoppingCartCheckout', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});


add_hook('AfterModuleCreate', 1, function($vars) {
    try {
        if (isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleCreate Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid'], 'user_id' => $vars['params']['userid'], 'product_id' => $vars['params']['productid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleServiceCreate($vars['params']);
        } else {
            BtkHelper::logAction('Hook: AfterModuleCreate', 'UYARI', 'serviceid bulunamadı.', BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars)]);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleCreate', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('AfterModuleSuspend', 1, function($vars) {
    try {
        if (isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleSuspend Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleServiceSuspend($vars['params']);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleSuspend', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('AfterModuleUnsuspend', 1, function($vars) {
    try {
        if (isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleUnsuspend Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleServiceUnsuspend($vars['params']);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleUnsuspend', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('AfterModuleTerminate', 1, function($vars) {
    try {
        if (isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleTerminate Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleServiceTerminate($vars['params']);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterModuleTerminate', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('PreAdminServiceEdit', 1, function($vars) {
    try {
        if (isset($vars['serviceid']) && (isset($_POST['btk_update_trigger']) || !empty(array_intersect_key($_POST, array_flip(['btk_tesis_il_id', 'btk_iss_pop_noktasi_id', 'btk_abone_tc_kimlik_no']))))) { // BTK formundan gelen bir işaretçi
            BtkHelper::logAction('Hook: PreAdminServiceEdit (BTK Veri Kaydı)', 'DEBUG', ['service_id' => $vars['serviceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handlePreServiceEdit($vars['serviceid'], $_POST);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: PreAdminServiceEdit', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'post_keys' => array_keys($_POST), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('AdminServiceEdit', 1, function($vars) {
    try {
        if (isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: AdminServiceEdit Tetiklendi', 'DEBUG', ['service_id' => $vars['serviceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleServiceEdit($vars);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AdminServiceEdit', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('ServiceDelete', 1, function($vars) {
    try {
        if (isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: ServiceDelete Tetiklendi', 'UYARI', ['service_id' => $vars['serviceid'], 'message' => 'Hizmet silinme işlemi. BTK verileri İPTAL olarak güncellenmeli.'], BtkHelper::getCurrentAdminId());
            BtkHelper::handleServiceDelete($vars['serviceid']);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('AfterProductUpgrade', 1, function($vars) { // WHMCS 8+
    try {
        BtkHelper::logAction('Hook: AfterProductUpgrade Tetiklendi', 'INFO', ['service_id' => $vars['serviceid'], 'old_package_id' => $vars['originalpackageid'], 'new_package_id' => $vars['newpackageid']], BtkHelper::getCurrentAdminId());
        BtkHelper::handleServicePackageChange($vars);
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: AfterProductUpgrade', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});


// --- FATURA (Invoice) İLE İLGİLİ HOOK'LAR ---
add_hook('InvoicePaid', 1, function($vars) {
    try {
        if (isset($vars['invoiceid'])) {
            BtkHelper::logAction('Hook: InvoicePaid Tetiklendi', 'DEBUG', ['invoice_id' => $vars['invoiceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleInvoicePaid($vars['invoiceid']);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: InvoicePaid', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});

add_hook('InvoiceCancelled', 1, function($vars) {
    try {
        if (isset($vars['invoiceid'])) {
            BtkHelper::logAction('Hook: InvoiceCancelled Tetiklendi', 'DEBUG', ['invoice_id' => $vars['invoiceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handleInvoiceCancelled($vars['invoiceid']);
        }
    } catch (Exception $e) {
        BtkHelper::logAction('Hook Hatası: InvoiceCancelled', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
    }
});

// --- PERSONEL (Admin) İLE İLGİLİ HOOK'LAR ---
if (class_exists('WHMCS\Utility\Hook')) {
    WHMCS\Utility\Hook::add('AdminSave', 1, function ($vars) {
        try {
            if (isset($vars['adminid'])) {
                $logAdminId = BtkHelper::getCurrentAdminId();
                BtkHelper::logAction('Hook: AdminSave Tetiklendi', 'DEBUG', ['target_admin_id' => $vars['adminid'], 'type' => $vars['type'] ?? 'unknown'], $logAdminId);
                BtkHelper::syncAdminToPersonel($vars['adminid'], $vars);
            }
        } catch (Exception $e) {
            BtkHelper::logAction('Hook Hatası: AdminSave', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
        }
        return true;
    });

    WHMCS\Utility\Hook::add('AdminDelete', 1, function ($vars) {
        try {
            if (isset($vars['adminid'])) {
                $logAdminId = BtkHelper::getCurrentAdminId();
                BtkHelper::logAction('Hook: AdminDelete Tetiklendi', 'UYARI', ['target_admin_id' => $vars['adminid'], 'message' => 'Admin silindi. BTK Personel listesindeki ilgili kaydın durumu güncellenmeli.'], $logAdminId);
                BtkHelper::handleAdminDelete($vars['adminid']);
            }
        } catch (Exception $e) {
            BtkHelper::logAction('Hook Hatası: AdminDelete', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
        }
        return true;
    });
} else {
    BtkHelper::logAction('Personel Hook Uyarısı', 'UYARI', 'Kullanılan WHMCS sürümü AdminSave/AdminDelete hooklarını desteklemiyor olabilir. Personel senkronizasyonu tam otomatik olmayabilir.');
}


// --- MÜŞTERİ PANELİ (Client Area) İÇİN HOOK'LAR ---
add_hook('ClientAreaHeadOutput', 1, function($vars) {
    $output = '';
    // $currentPage = $vars['templatefile'] ?? '';
    // if ($currentPage === 'clientareadetails' || $currentPage === 'clientareaproductdetails') {
    //     $version = BtkHelper::get_btk_setting('module_db_version', '6.0.0');
    //     $output .= '<link href="modules/addons/btkreports/assets/css/btk_client_style.css?v=' . $version . '" rel="stylesheet">';
    // }
    return $output;
});

add_hook('ClientAreaDetailsOutput', 1, function($vars) {
    try {
        $clientId = $vars['client']->id ?? null;
        if (!$clientId || !class_exists('BtkHelper')) return '';

        $btkClientData = BtkHelper::getBtkClientInfoForClientArea($clientId);
        if (empty($btkClientData) && BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') !== '1') {
            return '';
        }
        
        $smarty = new Smarty();
        $smarty->assign('LANG', $vars['_LANG']);
        $smarty->assign('btk_client_data_enabled_for_client_area', true);
        $smarty->assign('btk_client_data', $btkClientData);
        
        if (isset($btkClientData['abone_tc_kimlik_no']) && !empty($btkClientData['abone_tc_kimlik_no'])) {
            $smarty->assign('abone_tc_kimlik_no_masked', substr($btkClientData['abone_tc_kimlik_no'], 0, 2) . str_repeat('*', 7) . substr($btkClientData['abone_tc_kimlik_no'], -2));
        } else {
            $smarty->assign('abone_tc_kimlik_no_masked', $vars['_LANG']['notApplicableShort'] ?? 'N/A');
        }
        
        return $smarty->fetch(__DIR__ . '/templates/clientarea/client_btk_details.tpl');
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAreaDetailsOutput', 'HATA', $e->getMessage(), $vars['client']->id ?? null, ['trace' => $e->getTraceAsString()]);
        return '<div class="alert alert-warning">BTK bilgileri yüklenirken bir sorun oluştu.</div>';
    }
});

add_hook('ClientAreaProductDetailsOutput', 1, function($vars) {
    try {
        $serviceId = $vars['serviceid'] ?? null;
        if (!$serviceId || !class_exists('BtkHelper')) return '';

        $btkServiceData = BtkHelper::getBtkServiceInfoForClientArea($serviceId);
         if (empty($btkServiceData) && BtkHelper::get_btk_setting('show_btk_info_if_empty_clientarea', '0') !== '1') {
            return '';
        }

        $smarty = new Smarty();
        $smarty->assign('LANG', $vars['_LANG']);
        $smarty->assign('btk_service_data_enabled_for_client_area', true);
        $smarty->assign('btk_service_data', $btkServiceData);
        
        return $smarty->fetch(__DIR__ . '/templates/clientarea/service_btk_details.tpl');
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAreaProductDetailsOutput', 'HATA', $e->getMessage(), $vars['userid'] ?? null, ['service_id' => $vars['serviceid'], 'trace' => $e->getTraceAsString()]);
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
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: DailyCronJob (BTK)', 'HATA', $e->getMessage(), null, ['trace' => $e->getTraceAsString()]);
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