<?php
// modules/addons/btkreports/hooks.php

if (!defined("WHMCS")) {
    die("This file cannot be accessed directly");
}

// Ana modül dosyasını dahil et (içindeki yardımcı fonksiyonlar ve $_ADDONLANG için)
if (file_exists(__DIR__ . '/btkreports.php')) {
    require_once __DIR__ . '/btkreports.php';
} else {
    // Eğer ana dosya bulunamazsa, hook'lar çalışamaz.
    if (function_exists('logActivity')) {
        logActivity("BTK Reports Hook Error: btkreports.php not found. Hooks cannot be registered.", 0);
    }
    return;
}

// Dil dosyasının hook içinde de yüklendiğinden emin olalım
global $_ADDONLANG;
if (empty($_ADDONLANG) && file_exists(__DIR__ . '/lang/turkish.php')) {
    require_once __DIR__ . '/lang/turkish.php';
}
// Dil fallback'leri (eğer $_ADDONLANG hala boşsa veya belirli anahtarlar eksikse)
if (empty($_ADDONLANG) || !is_array($_ADDONLANG)) {
    $_ADDONLANG = [];
}
// Temel hook mesajları için fallback'ler (gerekirse daha fazla eklenebilir)
$_ADDONLANG['btkreports_hook_client_added'] = $_ADDONLANG['btkreports_hook_client_added'] ?? 'Yeni Müşteri/Abone Eklendi';
$_ADDONLANG['btkreports_hook_client_updated'] = $_ADDONLANG['btkreports_hook_client_updated'] ?? 'Müşteri/Abone Bilgileri Güncellendi';
$_ADDONLANG['btkreports_hook_client_closed'] = $_ADDONLANG['btkreports_hook_client_closed'] ?? 'Müşteri Hesabı Kapatıldı';
$_ADDONLANG['btkreports_hook_service_created'] = $_ADDONLANG['btkreports_hook_service_created'] ?? 'Yeni Hizmet Oluşturuldu/Aktif Edildi';
$_ADDONLANG['btkreports_hook_service_suspended'] = $_ADDONLANG['btkreports_hook_service_suspended'] ?? 'Hizmet Askıya Alındı';
$_ADDONLANG['btkreports_hook_service_unsuspended'] = $_ADDONLANG['btkreports_hook_service_unsuspended'] ?? 'Hizmet Askıdan Çıkarıldı';
$_ADDONLANG['btkreports_hook_service_terminated'] = $_ADDONLANG['btkreports_hook_service_terminated'] ?? 'Hizmet İptal Edildi (Sonlandırıldı)';
$_ADDONLANG['btkreports_hook_service_deleted'] = $_ADDONLANG['btkreports_hook_service_deleted'] ?? 'Hizmet Silindi';
$_ADDONLANG['btkreports_hook_service_package_changed'] = $_ADDONLANG['btkreports_hook_service_package_changed'] ?? 'Hizmet Paketi/Tarifesi Değiştirildi';
$_ADDONLANG['btkreports_hook_admin_added_sync_attempt'] = $_ADDONLANG['btkreports_hook_admin_added_sync_attempt'] ?? "Yeni yönetici eklendi, personel senkronizasyonu denendi. Admin ID: ";
$_ADDONLANG['btkreports_hook_admin_edited_sync_attempt'] = $_ADDONLANG['btkreports_hook_admin_edited_sync_attempt'] ?? "Yönetici bilgileri düzenlendi, personel senkronizasyonu denendi. Admin ID: ";
$_ADDONLANG['btkreports_hook_admin_deleted_marked'] = $_ADDONLANG['btkreports_hook_admin_deleted_marked'] ?? "Yönetici silindi, personel kaydı güncellendi (işten ayrıldı olarak işaretlendi). Admin ID: ";
$_ADDONLANG['btkreports_hook_admin_deleted_error'] = $_ADDONLANG['btkreports_hook_admin_deleted_error'] ?? "Yönetici silindi, personel kaydı güncellenirken HATA: ";


// -- MÜŞTERİ İLE İLGİLİ HOOKLAR --

add_hook('ClientAdd', 1, function($vars) {
    global $_ADDONLANG;
    if (function_exists('btkreports_add_hareket_kaydi')) {
        btkreports_add_hareket_kaydi(
            $vars['userid'],
            null, // Hizmet ID'si henüz yok
            '1',  // Hareket Kodu: YENI ABONELIK
            $_ADDONLANG['btkreports_hook_client_added'],
            null,
            ['client_details' => $vars],
            'ClientAdd Hook',
            'ClientAdd'
        );
    }
});

add_hook('ClientEdit', 1, function($vars) {
    global $_ADDONLANG;
    if (function_exists('btkreports_add_hareket_kaydi')) {
        $changedData = [];
        if (isset($vars['olddata'])) {
            foreach ($vars as $key => $newValue) {
                if (array_key_exists($key, $vars['olddata']) && $vars['olddata'][$key] != $newValue) {
                    $changedData[$key] = ['old' => $vars['olddata'][$key], 'new' => $newValue];
                }
            }
        }
        btkreports_add_hareket_kaydi(
            $vars['userid'],
            null,
            '13', // Hareket Kodu: DIGER ABONE BILGI GUNCELLEME
            $_ADDONLANG['btkreports_hook_client_updated'],
            $changedData ?: null,
            ['client_details_updated_fields' => array_keys($vars['olddata'] ?? [])],
            'ClientEdit Hook',
            'ClientEdit'
        );
    }
});

add_hook('ClientClose', 1, function($vars) {
    global $_ADDONLANG;
    if (function_exists('btkreports_add_hareket_kaydi')) {
        btkreports_add_hareket_kaydi(
            $vars['userid'],
            null,
            '8', // Hareket Kodu: HIZMET IPTALI (Müşteri kapatılınca tüm hizmetleri iptal sayılabilir)
            $_ADDONLANG['btkreports_hook_client_closed'],
            null,
            ['reason' => 'Client account closed'],
            'ClientClose Hook',
            'ClientClose'
        );
    }
});


// -- HİZMET İLE İLGİLİ HOOKLAR --

add_hook('AcceptOrder', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['serviceids']) && is_array($vars['serviceids'])) {
        foreach ($vars['serviceids'] as $serviceId) {
            $serviceData = Capsule::table('tblhosting')->where('id', $serviceId)->first();
            if ($serviceData && function_exists('btkreports_add_hareket_kaydi')) {
                btkreports_add_hareket_kaydi(
                    $serviceData->userid,
                    $serviceId,
                    '1',
                    $_ADDONLANG['btkreports_hook_service_created'],
                    null,
                    ['order_id' => $vars['orderid'], 'service_id' => $serviceId, 'package_name' => $serviceData->packageid], // packageid yerine product name daha iyi olabilir.
                    'AcceptOrder Hook (Service)',
                    'AcceptOrder'
                );
            }
        }
    } elseif (isset($vars['serviceid'])) {
        $serviceId = (int)$vars['serviceid'];
        $serviceData = Capsule::table('tblhosting')->where('id', $serviceId)->first();
        if ($serviceData && function_exists('btkreports_add_hareket_kaydi')) {
            btkreports_add_hareket_kaydi(
                $serviceData->userid,
                $serviceId,
                '1',
                $_ADDONLANG['btkreports_hook_service_created'],
                null,
                ['order_id' => $vars['orderid'], 'service_id' => $serviceId, 'package_name' => $serviceData->packageid],
                'AcceptOrder Hook (Single Service)',
                'AcceptOrder'
            );
        }
    }
});

add_hook('ServiceSuspend', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['params']['serviceid']) && function_exists('btkreports_add_hareket_kaydi')) {
        $serviceId = (int)$vars['params']['serviceid'];
        $clientId = (int)$vars['params']['userid'];
        btkreports_add_hareket_kaydi(
            $clientId,
            $serviceId,
            '9',
            $_ADDONLANG['btkreports_hook_service_suspended'],
            ['old_status' => 'Active'],
            ['new_status' => 'Suspended'],
            'ServiceSuspend Hook',
            'ServiceSuspend'
        );
    }
});

add_hook('ServiceUnsuspend', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['params']['serviceid']) && function_exists('btkreports_add_hareket_kaydi')) {
        $serviceId = (int)$vars['params']['serviceid'];
        $clientId = (int)$vars['params']['userid'];
        btkreports_add_hareket_kaydi(
            $clientId,
            $serviceId,
            '10',
            $_ADDONLANG['btkreports_hook_service_unsuspended'],
            ['old_status' => 'Suspended'],
            ['new_status' => 'Active'],
            'ServiceUnsuspend Hook',
            'ServiceUnsuspend'
        );
    }
});

add_hook('ServiceTerminate', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['params']['serviceid']) && function_exists('btkreports_add_hareket_kaydi')) {
        $serviceId = (int)$vars['params']['serviceid'];
        $clientId = (int)$vars['params']['userid'];
        btkreports_add_hareket_kaydi(
            $clientId,
            $serviceId,
            '8',
            $_ADDONLANG['btkreports_hook_service_terminated'],
            null,
            ['reason' => 'Terminated'],
            'ServiceTerminate Hook',
            'ServiceTerminate'
        );
    }
});

add_hook('ServiceDelete', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['serviceid']) && function_exists('btkreports_add_hareket_kaydi')) {
        $serviceId = (int)$vars['serviceid'];
        $clientId = (int)$vars['userid'];
        btkreports_add_hareket_kaydi(
            $clientId,
            $serviceId,
            '8',
            $_ADDONLANG['btkreports_hook_service_deleted'],
            null,
            ['reason' => 'Deleted from admin area'],
            'ServiceDelete Hook',
            'ServiceDelete'
        );
    }
});

add_hook('AfterModuleChangePackage', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['params']['serviceid']) && function_exists('btkreports_add_hareket_kaydi')) {
        $serviceId = (int)$vars['params']['serviceid'];
        $clientId = (int)$vars['params']['userid'];
        btkreports_add_hareket_kaydi(
            $clientId,
            $serviceId,
            '14',
            $_ADDONLANG['btkreports_hook_service_package_changed'],
            ['old_package_id' => $vars['params']['originalPackageId'] ?? null, 'old_product_name' => $vars['params']['originalProductName'] ?? null],
            ['new_package_id' => $vars['params']['packageid'] ?? null, 'new_product_name' => $vars['params']['newProductName'] ?? null],
            'AfterModuleChangePackage Hook',
            'AfterModuleChangePackage'
        );
    }
});

// -- YÖNETİCİ (PERSONEL) İLE İLGİLİ HOOKLAR --

add_hook('AdminAdd', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['adminid']) && function_exists('btkreports_sync_admins_to_personel')) {
        $syncResult = btkreports_sync_admins_to_personel();
        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity(
                ($_ADDONLANG['btkreports_hook_admin_added_sync_attempt'] ?? "Yeni yönetici eklendi, personel senkronizasyonu denendi. Admin ID: ") . $vars['adminid'] . " - Sonuç: " . ($syncResult['message'] ?? ''),
                0, null, ($syncResult['success'] ?? false) ? 'INFO' : 'ERROR'
            );
        }
    }
});

add_hook('AdminEdit', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['adminid']) && function_exists('btkreports_sync_admins_to_personel')) {
        $syncResult = btkreports_sync_admins_to_personel();
        if (function_exists('btkreports_log_activity')) {
            btkreports_log_activity(
                ($_ADDONLANG['btkreports_hook_admin_edited_sync_attempt'] ?? "Yönetici bilgileri düzenlendi, personel senkronizasyonu denendi. Admin ID: ") . $vars['adminid'] . " - Sonuç: " . ($syncResult['message'] ?? ''),
                0, null, ($syncResult['success'] ?? false) ? 'INFO' : 'ERROR'
            );
        }
    }
});

add_hook('AdminDelete', 1, function($vars) {
    global $_ADDONLANG;
    if (isset($vars['adminid']) && Capsule::schema()->hasTable('mod_btk_personel')) {
        try {
            $updated = Capsule::table('mod_btk_personel')
                ->where('admin_id', $vars['adminid'])
                ->update([
                    'isten_ayrilma_tarihi' => date('Y-m-d'),
                    'btk_listesine_eklensin' => false,
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            if ($updated && function_exists('btkreports_log_activity')) {
                btkreports_log_activity(
                    ($_ADDONLANG['btkreports_hook_admin_deleted_marked'] ?? "Yönetici silindi, personel kaydı güncellendi (işten ayrıldı olarak işaretlendi). Admin ID: ") . $vars['adminid'],
                    0, null, 'INFO'
                );
            }
        } catch (Exception $e) {
            if (function_exists('btkreports_log_activity')) {
                btkreports_log_activity(
                    ($_ADDONLANG['btkreports_hook_admin_deleted_error'] ?? "Yönetici silindi, personel kaydı güncellenirken HATA: ") . $e->getMessage() . ". Admin ID: " . $vars['adminid'],
                    0, null, 'ERROR'
                );
            }
        }
    }
});

// ------------------------------------------------------------------
// MODÜL ARAYÜZÜ İÇİN CSS/JS YÜKLEME HOOK'U
// ------------------------------------------------------------------
if (function_exists('btkreports_AdminAreaHeadOutput')) {
    add_hook('AdminAreaHeadOutput', 1, 'btkreports_AdminAreaHeadOutput');
}

?>