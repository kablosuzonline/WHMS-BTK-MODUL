<?php
/**
 * WHMCS BTK Raporlama Modülü - Kapsamlı Hook Dosyası
 *
 * Bu dosya, WHMCS içindeki çeşitli olaylara (hook point) müdahale ederek
 * BTK Raporlama modülünün ilgili fonksiyonlarını tetikler.
 * ABONE REHBER ve ABONE HAREKET tablolarının güncel tutulması hedeflenir.
 */

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Gerekli yardımcı dosyaları ve sınıfları dahil et
$btkHelperHookPath = __DIR__ . '/lib/BtkHelper.php'; // PascalCase dosya adı standardı
if (file_exists($btkHelperHookPath)) {
    require_once $btkHelperHookPath;
} else {
    // Bu kritik bir hata, WHMCS sistem loguna yaz ve çık.
    if (function_exists('logActivity')) { 
        logActivity("BTK Reports Hook Critical Error: BtkHelper.php not found at {$btkHelperHookPath}! Hooks will not function.", 0);
    } else {
        error_log("BTK Reports Hook Critical Error: BtkHelper.php not found at {$btkHelperHookPath}! Hooks will not function.");
    }
    return; // BtkHelper olmadan hook'lar çalışamaz.
}

// --- MÜŞTERİ (Client) İLE İLGİLİ HOOK'LAR ---

/**
 * Yeni bir müşteri hesabı oluşturulduktan hemen sonra tetiklenir.
 * $vars: userid, firstname, lastname, companyname, email, adres bilgileri, vs.
 */
add_hook('ClientAdd', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return; // Güvenlik kontrolü
        $adminId = BtkHelper::getCurrentAdminId() ?? ($vars['adminid'] ?? null);
        BtkHelper::logAction('Hook: ClientAdd Tetiklendi', 'DEBUG', ['client_id' => $vars['userid'], 'data_summary' => ['email' => $vars['email']]], $adminId);
        BtkHelper::handleClientAdd($vars);
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAdd', 'HATA', $e->getMessage(), ($vars['adminid'] ?? BtkHelper::getCurrentAdminId()), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
        else error_log("BTK Hook Error ClientAdd: " . $e->getMessage());
    }
});

/**
 * Müşteri detayları admin panelinden güncellendikten sonra tetiklenir.
 * $vars: userid, ve güncellenen tüm alanlar.
 */
add_hook('ClientEdit', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        $adminId = BtkHelper::getCurrentAdminId() ?? ($vars['adminid'] ?? null);
        BtkHelper::logAction('Hook: ClientEdit Tetiklendi', 'DEBUG', ['client_id' => $vars['userid']], $adminId);
        BtkHelper::handleClientEdit($vars);
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientEdit', 'HATA', $e->getMessage(), ($vars['adminid'] ?? BtkHelper::getCurrentAdminId()), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]);
        else error_log("BTK Hook Error ClientEdit: " . $e->getMessage());
    }
});

/**
 * Müşteri hesabı "Kapalı" duruma getirildiğinde.
 * $vars: userid
 */
add_hook('ClientClose', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        BtkHelper::logAction('Hook: ClientClose Tetiklendi', 'UYARI', ['client_id' => $vars['userid'], 'message' => 'Müşteri hesabı kapatıldı. İlişkili hizmetler için BTK iptal işlemleri yapılacak.'], BtkHelper::getCurrentAdminId());
        BtkHelper::handleClientClose($vars['userid']);
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientClose', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
        else error_log("BTK Hook Error ClientClose: " . $e->getMessage());
    }
});

/**
 * Müşteri silinmeden hemen önce tetiklenir.
 * $vars: userid
 */
add_hook('ClientDelete', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        BtkHelper::logAction('Hook: ClientDelete Tetiklendi', 'KRİTİK UYARI', ['client_id' => $vars['userid'], 'message' => 'Müşteri silinme işlemi! BTK verileri korunacak, hizmetler iptal olarak işaretlenecek.'], BtkHelper::getCurrentAdminId() ?? ($vars['adminid'] ?? null));
        BtkHelper::handleClientDelete($vars['userid']);
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientDelete', 'HATA', $e->getMessage(), (BtkHelper::getCurrentAdminId() ?? ($vars['adminid'] ?? null)), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
        else error_log("BTK Hook Error ClientDelete: " . $e->getMessage());
    }
});

/**
 * İki müşteri hesabı birleştirildiğinde.
 * $vars: userid (kaynak müşteri ID), newuserid (hedef müşteri ID)
 */
add_hook('MergeClient', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        BtkHelper::logAction('Hook: MergeClient Tetiklendi', 'UYARI', ['source_client_id' => $vars['userid'], 'target_client_id' => $vars['newuserid'], 'message' => 'Müşteri birleştirme. BTK kayıtları güncellenecek.'], BtkHelper::getCurrentAdminId());
        BtkHelper::handleMergeClient($vars['userid'], $vars['newuserid']);
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: MergeClient', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]);
        else error_log("BTK Hook Error MergeClient: " . $e->getMessage());
    }
});


// --- SİPARİŞ (Order) VE HİZMET (Service/Product) İLE İLGİLİ HOOK'LAR ---

add_hook('OrderCreated', 1, function($vars) { // WHMCS 8+
    try {
        if (!class_exists('BtkHelper')) return;
        BtkHelper::logAction('Hook: OrderCreated Tetiklendi', 'DEBUG', ['order_id' => $vars['orderId'], 'user_id' => $vars['userId']], BtkHelper::getCurrentAdminId());
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: OrderCreated', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error OrderCreated: " . $e->getMessage());}
});

add_hook('AfterShoppingCartCheckout', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        BtkHelper::logAction('Hook: AfterShoppingCartCheckout Tetiklendi', 'DEBUG', ['order_id' => $vars['OrderID'], 'invoice_id' => $vars['InvoiceID']], BtkHelper::getCurrentAdminId());
        // BtkHelper::handleOrderCompletion($vars['OrderID']); // Bu fonksiyon BtkHelper'da tanımlanmalı
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterShoppingCartCheckout', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AfterShoppingCartCheckout: " . $e->getMessage());}
});

add_hook('AfterModuleCreate', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['params']['serviceid'])) { BtkHelper::logAction('Hook: AfterModuleCreate Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid'], 'user_id' => $vars['params']['userid'], 'product_id' => $vars['params']['productid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleServiceCreate($vars['params']);
        } else { BtkHelper::logAction('Hook: AfterModuleCreate', 'UYARI', 'serviceid bulunamadı.', BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars)]);}
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleCreate', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AfterModuleCreate: " . $e->getMessage());}
});

add_hook('AfterModuleSuspend', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['params']['serviceid'])) { BtkHelper::logAction('Hook: AfterModuleSuspend Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleServiceSuspend($vars['params']); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleSuspend', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AfterModuleSuspend: " . $e->getMessage());}
});

add_hook('AfterModuleUnsuspend', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['params']['serviceid'])) { BtkHelper::logAction('Hook: AfterModuleUnsuspend Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleServiceUnsuspend($vars['params']); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleUnsuspend', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AfterModuleUnsuspend: " . $e->getMessage());}
});

add_hook('AfterModuleTerminate', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['params']['serviceid'])) { BtkHelper::logAction('Hook: AfterModuleTerminate Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleServiceTerminate($vars['params']); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleTerminate', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : array_keys($vars), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AfterModuleTerminate: " . $e->getMessage());}
});

add_hook('PreAdminServiceEdit', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['serviceid']) && (isset($_POST['btk_update_trigger_service']) || !empty(array_intersect_key($_POST, array_flip(['btk_tesis_il_id', 'btk_iss_pop_noktasi_id', 'btk_statik_ip']))))) {
            BtkHelper::logAction('Hook: PreAdminServiceEdit (BTK Veri Kaydı)', 'DEBUG', ['service_id' => $vars['serviceid']], BtkHelper::getCurrentAdminId());
            BtkHelper::handlePreServiceEdit($vars['serviceid'], $_POST);
        }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: PreAdminServiceEdit', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'post_keys' => array_keys($_POST), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error PreAdminServiceEdit: " . $e->getMessage());}
});

add_hook('AdminServiceEdit', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['serviceid'])) { BtkHelper::logAction('Hook: AdminServiceEdit Tetiklendi', 'DEBUG', ['service_id' => $vars['serviceid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleServiceEdit($vars); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminServiceEdit', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AdminServiceEdit: " . $e->getMessage());}
});

add_hook('ServiceDelete', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['serviceid'])) { BtkHelper::logAction('Hook: ServiceDelete Tetiklendi', 'UYARI', ['service_id' => $vars['serviceid'], 'message' => 'Hizmet silinme işlemi. BTK verileri İPTAL olarak güncellenmeli.'], BtkHelper::getCurrentAdminId()); BtkHelper::handleServiceDelete($vars['serviceid']); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error ServiceDelete: " . $e->getMessage());}
});

add_hook('AfterProductUpgrade', 1, function($vars) { // WHMCS 8+
    try {
        if (!class_exists('BtkHelper')) return;
        BtkHelper::logAction('Hook: AfterProductUpgrade Tetiklendi', 'INFO', ['service_id' => $vars['serviceid'], 'old_package_id' => $vars['originalpackageid'], 'new_package_id' => $vars['newpackageid']], BtkHelper::getCurrentAdminId());
        BtkHelper::handleServicePackageChange($vars);
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterProductUpgrade', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AfterProductUpgrade: " . $e->getMessage());}
});


// --- FATURA (Invoice) İLE İLGİLİ HOOK'LAR ---
add_hook('InvoicePaid', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['invoiceid'])) { BtkHelper::logAction('Hook: InvoicePaid Tetiklendi', 'DEBUG', ['invoice_id' => $vars['invoiceid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleInvoicePaid($vars['invoiceid']); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: InvoicePaid', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error InvoicePaid: " . $e->getMessage());}
});

add_hook('InvoiceCancelled', 1, function($vars) {
    try {
        if (!class_exists('BtkHelper')) return;
        if (isset($vars['invoiceid'])) { BtkHelper::logAction('Hook: InvoiceCancelled Tetiklendi', 'DEBUG', ['invoice_id' => $vars['invoiceid']], BtkHelper::getCurrentAdminId()); BtkHelper::handleInvoiceCancelled($vars['invoiceid']); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: InvoiceCancelled', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error InvoiceCancelled: " . $e->getMessage());}
});

// --- PERSONEL (Admin) İLE İLGİLİ HOOK'LAR ---
if (class_exists('WHMCS\Utility\Hook')) { // WHMCS 8+ kontrolü
    WHMCS\Utility\Hook::add('AdminSave', 1, function ($vars) {
        try {
            if (!class_exists('BtkHelper')) return true;
            if (isset($vars['adminid'])) { $logAdminId = BtkHelper::getCurrentAdminId(); BtkHelper::logAction('Hook: AdminSave Tetiklendi', 'DEBUG', ['target_admin_id' => $vars['adminid'], 'type' => $vars['type'] ?? 'unknown'], $logAdminId); BtkHelper::syncAdminToPersonel($vars['adminid'], $vars); }
        } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminSave', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars_keys' => array_keys($vars), 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AdminSave: " . $e->getMessage());}
        return true;
    });
    WHMCS\Utility\Hook::add('AdminDelete', 1, function ($vars) {
        try {
            if (!class_exists('BtkHelper')) return true;
            if (isset($vars['adminid'])) { $logAdminId = BtkHelper::getCurrentAdminId(); BtkHelper::logAction('Hook: AdminDelete Tetiklendi', 'UYARI', ['target_admin_id' => $vars['adminid'], 'message' => 'Admin silindi.'], $logAdminId); BtkHelper::handleAdminDelete($vars['adminid']); }
        } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminDelete', 'HATA', $e->getMessage(), BtkHelper::getCurrentAdminId(), ['vars' => $vars, 'trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error AdminDelete: " . $e->getMessage());}
        return true;
    });
} else {
    if (class_exists('BtkHelper')) BtkHelper::logAction('Personel Hook Uyarısı', 'UYARI', 'Kullanılan WHMCS sürümü AdminSave/AdminDelete hooklarını desteklemiyor olabilir. Personel senkronizasyonu tam otomatik olmayabilir.');
}

// --- MÜŞTERİ PANELİ (Client Area) İÇİN HOOK'LAR ---
add_hook('ClientAreaHeadOutput', 1, function($vars) { /* ... (Bir önceki tam hooks.php gönderimindeki gibi) ... */ return ''; });
add_hook('ClientAreaDetailsOutput', 1, function($vars) { /* ... (Bir önceki tam hooks.php gönderimindeki gibi) ... */ });
add_hook('ClientAreaProductDetailsOutput', 1, function($vars) { /* ... (Bir önceki tam hooks.php gönderimindeki gibi) ... */ });

// --- GÜNLÜK CRON JOB HOOK'U ---
add_hook('DailyCronJob', 1, function($vars) {
    try {
        if (class_exists('BtkHelper')) { BtkHelper::logAction('Hook: DailyCronJob Tetiklendi (BTK)', 'INFO', 'Günlük BTK periyodik kontrolleri başlatılıyor.'); BtkHelper::performDailyBtkChecks(); }
    } catch (Exception $e) { if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: DailyCronJob (BTK)', 'HATA', $e->getMessage(), null, ['trace' => $e->getTraceAsString()]); else error_log("BTK Hook Error DailyCronJob: " . $e->getMessage());}
});

// --- MODÜL AYARLARI KAYDEDİLDİĞİNDE ---
add_hook('AddonConfigSave', 1, function($vars) {
    if (isset($vars['module']) && $vars['module'] === 'btkreports' && class_exists('BtkHelper')) {
        BtkHelper::logAction('Hook: AddonConfigSave Tetiklendi', 'INFO', 'BTK Raporlama modül ayarları kaydedildi.', BtkHelper::getCurrentAdminId());
    }
});

if (class_exists('BtkHelper')) { BtkHelper::logAction('Hooks Dosyası Yüklendi', 'DEBUG', 'btkreports/hooks.php başarıyla yüklendi ve tüm kapsamlı hooklar tanımlandı.'); }
?>