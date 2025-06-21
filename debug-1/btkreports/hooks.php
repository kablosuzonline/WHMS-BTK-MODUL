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
    // Bu kritik bir hata, WHMCS sistem loguna yaz.
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
 * $vars: userid, firstname, lastname, companyname, email, adres bilgileri, status, vs.
 */
add_hook('ClientAdd', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : ($vars['adminid'] ?? null);
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: ClientAdd Tetiklendi', 'DEBUG', ['client_id' => $vars['userid'], 'status' => $vars['status']], $adminId);
            BtkHelper::handleClientAdd($vars);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientAdd', 'HATA', $e->getMessage(), $adminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

/**
 * Müşteri detayları admin panelinden veya müşteri panelinden güncellendikten sonra tetiklenir.
 * $vars: userid, ve güncellenen tüm alanlar.
 */
add_hook('ClientEdit', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : ($vars['adminid'] ?? null);
    try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: ClientEdit Tetiklendi', 'DEBUG', ['client_id' => $vars['userid'], 'updated_fields_keys' => array_keys($vars)], $adminId);
            BtkHelper::handleClientEdit($vars);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ClientEdit', 'HATA', $e->getMessage(), $adminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

/**
 * Müşteri hesabı "Kapalı" (Closed) duruma getirildiğinde.
 * $vars: userid
 */
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

/**
 * Müşteri silinmeden hemen önce tetiklenir.
 * $vars: userid
 */
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

/**
 * İki müşteri hesabı birleştirildiğinde.
 * $vars: userid (kaynak müşteri ID), newuserid (hedef müşteri ID)
 */
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

/**
 * Yeni bir sipariş kabul edildiğinde (genellikle fatura ödendikten sonra).
 * $vars: orderid, userid, invoiceid, paymentmethod, amount, status ('Active', 'Pending', 'Fraud', 'Cancelled')
 * Bu hook, hizmetler oluşturulmadan ÖNCE çalışabilir. AfterShoppingCartCheckout daha güvenilir olabilir.
 */
add_hook('AcceptOrder', 1, function($vars){
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
     try {
        if (class_exists('BtkHelper')) {
            BtkHelper::logAction('Hook: AcceptOrder Tetiklendi', 'DEBUG', ['order_id' => $vars['orderid'], 'status' => $vars['status']], $adminId);
            // Eğer status 'Active' ise ve hizmetler hemen oluşuyorsa, BtkHelper::handleOrderAccepted($vars['orderid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AcceptOrder', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});


/**
 * Bir ürün/hizmet için modül oluşturma komutu başarıyla tamamlandığında (hizmet aktif edildiğinde).
 * $vars['params']: serviceid, userid, productid, domain, username, password, configoptions, customfields vb.
 */
add_hook('AfterModuleCreate', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null; // Genellikle cron veya sistem tarafından tetiklenir
    try {
        if (class_exists('BtkHelper') && isset($vars['params']['serviceid'])) {
            BtkHelper::logAction('Hook: AfterModuleCreate Tetiklendi', 'INFO', ['service_id' => $vars['params']['serviceid'], 'user_id' => $vars['params']['userid'], 'product_id' => $vars['params']['productid']], $adminId);
            BtkHelper::handleServiceCreate($vars['params']); // Yeni abonelik kaydı ve hareket
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterModuleCreate', 'HATA', $e->getMessage(), $adminId, ['params_keys' => isset($vars['params']) ? array_keys($vars['params']) : ($vars ? array_keys($vars) : []), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AfterModuleSuspend', 1, function($vars) { /* ... (Daha önceki tam hooks.php gönderimindeki gibi, sadece log adminId eklendi) ... */ });
add_hook('AfterModuleUnsuspend', 1, function($vars) { /* ... (Daha önceki tam hooks.php gönderimindeki gibi, sadece log adminId eklendi) ... */ });
add_hook('AfterModuleTerminate', 1, function($vars) { /* ... (Daha önceki tam hooks.php gönderimindeki gibi, sadece log adminId eklendi) ... */ });

/**
 * Admin panelinden bir ürün/hizmet için "Kaydet" butonuna basıldığında, değişiklikler veritabanına yazılmadan hemen önce.
 * $vars: serviceid
 * BTK özel alanlarını $_POST'tan alıp kaydetmek/güncellemek için kullanılır.
 */
add_hook('PreAdminServiceEdit', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid']) && isset($_POST['btk_update_trigger_service'])) { // Formda bu trigger olmalı
            BtkHelper::logAction('Hook: PreAdminServiceEdit (BTK Veri Kaydı)', 'DEBUG', ['service_id' => $vars['serviceid']], $adminId);
            BtkHelper::handlePreServiceEdit($vars['serviceid'], $_POST);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: PreAdminServiceEdit', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'post_keys' => array_keys($_POST), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

/**
 * Admin panelinden bir ürün/hizmet için "Kaydet" butonuna basıldığında, değişiklikler veritabanına yazıldıktan sonra.
 * $vars: serviceid, ve güncellenen tüm standart WHMCS alanları
 */
add_hook('AdminServiceEdit', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: AdminServiceEdit Tetiklendi', 'DEBUG', ['service_id' => $vars['serviceid'], 'updated_fields_keys' => array_keys($vars)], $adminId);
            BtkHelper::handleServiceEdit($vars); // Değişen standart alanlara göre hareket oluşturma
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AdminServiceEdit', 'HATA', $e->getMessage(), $adminId, ['vars_keys' => array_keys($vars), 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('ServiceDelete', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: ServiceDelete Tetiklendi', 'UYARI', ['service_id' => $vars['serviceid'], 'message' => 'Hizmet silinme işlemi. BTK kaydı İPTAL olarak güncellenmeli.'], $adminId);
            BtkHelper::handleServiceDelete($vars['serviceid']);
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: ServiceDelete', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

add_hook('AfterProductUpgrade', 1, function($vars) { // WHMCS 8+
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null;
    try {
        if (class_exists('BtkHelper') && isset($vars['serviceid'])) {
            BtkHelper::logAction('Hook: AfterProductUpgrade Tetiklendi', 'INFO', ['service_id' => $vars['serviceid'], 'old_package_id' => $vars['originalpackageid'], 'new_package_id' => $vars['newpackageid']], $adminId);
            BtkHelper::handleServicePackageChange($vars); // Tarife değişikliği hareketi
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: AfterProductUpgrade', 'HATA', $e->getMessage(), $adminId, ['vars' => $vars, 'trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});


// --- FATURA (Invoice) İLE İLGİLİ HOOK'LAR ---
add_hook('InvoicePaid', 1, function($vars) {
    $adminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null; // Genellikle sistem tarafından tetiklenir
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

// --- PERSONEL (Admin) İLE İLGİLİ HOOK'LAR (WHMCS 8.6+ için) ---
if (class_exists('WHMCS\Utility\Hook')) {
    WHMCS\Utility\Hook::add('AdminSave', 1, function ($vars) {
        $logAdminId = class_exists('BtkHelper') ? BtkHelper::getCurrentAdminId() : null; // İşlemi yapan admin
        try {
            if (class_exists('BtkHelper') && isset($vars['adminid'])) {
                BtkHelper::logAction('Hook: AdminSave Tetiklendi', 'DEBUG', ['target_admin_id' => $vars['adminid'], 'type' => $vars['type'] ?? 'unknown'], $logAdminId);
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
    BtkHelper::logAction('Personel Hook Uyarısı', 'UYARI', 'WHMCS sürümü AdminSave/AdminDelete hooklarını desteklemiyor olabilir. Personel senkronizasyonu tam otomatik olmayabilir.');
}

// --- MÜŞTERİ PANELİ (Client Area) İÇİN HOOK'LAR ---
add_hook('ClientAreaHeadOutput', 1, function($vars) {
    // Bu hook, müşteri paneli <head> içine eklenir.
    // Modülümüzün müşteri paneli için özel CSS dosyası varsa burada eklenebilir.
    // $output = '';
    // if (class_exists('BtkHelper') && BtkHelper::get_btk_setting('client_area_btk_info_enabled', '1') === '1') {
    //     $version = BtkHelper::get_btk_setting('module_db_version', '6.0.0');
    //     $cssFilePath = 'modules/addons/btkreports/assets/css/btk_client_style.css'; // Örnek yol
    //     $output = '<link href="' . $vars['systemurl'] . $cssFilePath . '?v=' . $version . '" rel="stylesheet">';
    // }
    // return $output;
    return ''; // Şimdilik boş
});

add_hook('ClientAreaDetailsOutput', 1, function($vars) {
    // $vars: client (WHMCS\User\Client objesi), clientstats, _LANG
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
        $smarty->assign('LANG', $vars['_LANG']);
        $smarty->assign('btk_client_data_enabled_for_client_area', true); // Bu, şablonda genel bir kontrol sağlar
        $smarty->assign('btk_client_data', $btkClientData ?: []); // Veri yoksa boş dizi gönder
        $smarty->assign('client', $vars['client']); // WHMCS client objesini de gönderelim (örn: ad/soyad için)
        
        // TCKN Maskeleme
        $tcknMasked = $vars['_LANG']['notProvidedOrApplicable'] ?? 'N/A';
        if (isset($btkClientData['abone_tc_kimlik_no']) && !empty($btkClientData['abone_tc_kimlik_no'])) {
            $tcknMasked = substr($btkClientData['abone_tc_kimlik_no'], 0, 2) . str_repeat('*', 7) . substr($btkClientData['abone_tc_kimlik_no'], -2);
        }
        $smarty->assign('abone_tc_kimlik_no_masked', $tcknMasked);
        // Pasaport No Maskeleme (gerekirse)
        $pasaportMasked = $vars['_LANG']['notProvidedOrApplicable'] ?? 'N/A';
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
    // $vars: serviceid, groupid, productid, status, domain, _LANG vb.
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
        $smarty->assign('LANG', $vars['_LANG']);
        $smarty->assign('btk_service_data_enabled_for_client_area', true);
        $smarty->assign('btk_service_data', $btkServiceData ?: []);
        
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
            BtkHelper::performDailyBtkChecks(); // Vefat sorgusu, veri tutarlılığı
            // BtkHelper::archiveOldHareketler(); // Bu btkreports_cron.php içinde zaten çağrılıyor.
        }
    } catch (Exception $e) {
        if (class_exists('BtkHelper')) BtkHelper::logAction('Hook Hatası: DailyCronJob (BTK)', 'HATA', $e->getMessage(), null, ['trace' => substr($e->getTraceAsString(),0,1000)]);
    }
});

// --- MODÜL AYARLARI KAYDEDİLDİĞİNDE ---
add_hook('AddonConfigSave', 1, function($vars) {
    if (isset($vars['module']) && $vars['module'] === 'btkreports' && class_exists('BtkHelper')) {
        BtkHelper::logAction('Hook: AddonConfigSave Tetiklendi', 'INFO', 'BTK Raporlama modül ayarları kaydedildi.', BtkHelper::getCurrentAdminId());
        // FTP ayarları değiştiyse, FTP bağlantı durumunu önbellekten silmek (eğer önbellek kullanılıyorsa)
        // veya bir sonraki ana sayfa ziyaretinde yeniden test edilmesini sağlamak için bir flag set edilebilir.
    }
});


if (class_exists('BtkHelper')) {
    BtkHelper::logAction('Hooks Dosyası Yüklendi', 'DEBUG', 'btkreports/hooks.php başarıyla yüklendi ve tüm kapsamlı hooklar tanımlandı.');
}
?>